/**
 * Sales engine — one place that turns normalized sale-line rows into the
 * Overview KPIs. Every source (CSV upload, Dutchie API, Alpine IQ, VeriScan)
 * maps into {SaleLine} and feeds this, so the math is defined once.
 *
 * Local/dev runs on embedded PGlite (real Postgres, zero service). In prod set
 * DATABASE_URL and the same SQL runs on free Neon.
 */
import { PGlite } from "@electric-sql/pglite";

export interface SaleLine {
  receipt_id: string;
  date: string; // YYYY-MM-DD
  store: string;
  budtender?: string;
  member_id: string;
  sku?: string;
  product?: string;
  category?: string;
  qty: number;
  price: number;
  cost?: number;
  discount?: number;
  order_discount?: number;
}

export async function createDb(): Promise<PGlite> {
  const db = new PGlite();
  await db.exec(`
    CREATE TABLE sale_lines (
      receipt_id text, date date, store text, budtender text, member_id text,
      sku text, product text, category text,
      qty integer, price numeric, cost numeric, discount numeric, order_discount numeric
    );
  `);
  return db;
}

const COLS = ["receipt_id","date","store","budtender","member_id","sku","product","category","qty","price","cost","discount","order_discount"] as const;

export async function ingest(db: PGlite, rows: SaleLine[]): Promise<number> {
  for (let i = 0; i < rows.length; i += 200) {
    const chunk = rows.slice(i, i + 200);
    const values: unknown[] = [];
    const tuples = chunk.map((r, j) => {
      const base = j * COLS.length;
      values.push(r.receipt_id, r.date, r.store, r.budtender ?? "", r.member_id, r.sku ?? "", r.product ?? "", r.category ?? "",
        r.qty || 0, r.price || 0, r.cost ?? 0, r.discount ?? 0, r.order_discount ?? 0);
      return `(${COLS.map((_, k) => `$${base + k + 1}`).join(",")})`;
    });
    await db.query(`INSERT INTO sale_lines (${COLS.join(",")}) VALUES ${tuples.join(",")}`, values);
  }
  return rows.length;
}

export interface Kpis {
  windowStart: string; windowEnd: string;
  newCustomers: number; returningInWindow: number; customers: number; repeatRatePct: number;
  orders: number; netRevenue: number; firstPurchaseRevenue: number;
  avgOrderValue: number; valuePerCustomer: number; grossMargin: number;
  categoryMix: { category: string; gross: number }[];
  byStore: { store: string; net: number; orders: number }[];
}

const BASE = `
  WITH r AS (
    SELECT receipt_id, member_id, max(date) AS date, max(store) AS store,
           sum(qty*price) AS gross, sum(discount) AS line_disc, max(order_discount) AS ord_disc
    FROM sale_lines GROUP BY receipt_id, member_id
  ),
  rn AS (SELECT *, gross - line_disc - ord_disc AS net FROM r),
  mf AS (SELECT member_id, min(date) AS first_date FROM rn GROUP BY member_id),
  p  AS (SELECT max(date) AS maxd, (max(date) - INTERVAL '29 days')::date AS wstart FROM rn)
`;

export async function computeKpis(db: PGlite): Promise<Kpis> {
  const q = async <T = Record<string, unknown>>(sql: string) => (await db.query<T>(sql)).rows;
  const k = (await q<Record<string, number>>(`${BASE}
    SELECT
      (SELECT round(sum(net),2) FROM rn)                                   AS net_revenue,
      (SELECT count(*) FROM rn)                                            AS orders,
      (SELECT count(*) FROM mf)                                            AS customers,
      (SELECT count(*) FROM mf, p WHERE first_date >= p.wstart)            AS new_customers,
      (SELECT count(DISTINCT rn.member_id) FROM rn, mf, p
         WHERE rn.member_id = mf.member_id AND rn.date >= p.wstart AND mf.first_date < p.wstart) AS returning_in_window,
      (SELECT round(100.0 * count(*) FILTER (WHERE c > 1) / nullif(count(*),0), 1)
         FROM (SELECT member_id, count(*) c FROM rn GROUP BY member_id) t) AS repeat_rate_pct,
      (SELECT round(sum(net)/nullif(count(*),0),2) FROM rn)                AS avg_order_value,
      (SELECT round(sum(net)/nullif(count(DISTINCT member_id),0),2) FROM rn) AS value_per_customer,
      (SELECT round(sum(net),2) FROM (
          SELECT DISTINCT ON (member_id) net FROM rn ORDER BY member_id, date ASC, receipt_id ASC) fr) AS first_purchase_revenue,
      (SELECT round(sum(qty*(price-cost)) - sum(discount),2) FROM sale_lines) - (SELECT sum(ord_disc) FROM rn) AS gross_margin
  `))[0];
  const win = (await q<{ a: string; b: string }>(`${BASE} SELECT to_char(min(wstart),'YYYY-MM-DD') AS a, to_char(maxd,'YYYY-MM-DD') AS b FROM p, rn GROUP BY maxd`))[0];
  const cat = await q<{ category: string; gross: number }>(`SELECT category, round(sum(qty*price),2) AS gross FROM sale_lines GROUP BY category ORDER BY gross DESC`);
  const store = await q<{ store: string; net: number; orders: number }>(`${BASE} SELECT store, round(sum(net),2) AS net, count(*) AS orders FROM rn GROUP BY store ORDER BY net DESC`);
  return {
    windowStart: win?.a ?? "", windowEnd: win?.b ?? "",
    newCustomers: +k.new_customers, returningInWindow: +k.returning_in_window, customers: +k.customers,
    repeatRatePct: +k.repeat_rate_pct, orders: +k.orders, netRevenue: +k.net_revenue,
    firstPurchaseRevenue: +k.first_purchase_revenue, avgOrderValue: +k.avg_order_value,
    valuePerCustomer: +k.value_per_customer, grossMargin: +k.gross_margin,
    categoryMix: cat.map((c) => ({ category: c.category, gross: +c.gross })),
    byStore: store.map((s) => ({ store: s.store, net: +s.net, orders: +s.orders })),
  };
}

const money = (n: number) => "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2 });
export function printKpis(k: Kpis, source: string, rows: number): void {
  console.log(`\nTrafficIQ — real KPIs from ${source}`);
  console.log(`rows ingested: ${rows} · window: ${k.windowStart} → ${k.windowEnd} (trailing 30d)\n`);
  console.log(`  New customers            ${k.newCustomers}`);
  console.log(`  Returning (in window)    ${k.returningInWindow}`);
  console.log(`  Total customers          ${k.customers}`);
  console.log(`  Repeat rate              ${k.repeatRatePct}%`);
  console.log(`  Orders                   ${k.orders}`);
  console.log(`  Net revenue              ${money(k.netRevenue)}`);
  console.log(`  First-purchase revenue   ${money(k.firstPurchaseRevenue)}`);
  console.log(`  Avg order value          ${money(k.avgOrderValue)}`);
  console.log(`  Value per customer (LTV) ${money(k.valuePerCustomer)}`);
  console.log(`  Gross margin             ${money(k.grossMargin)}`);
  console.log(`\n  CAC = ad spend ÷ new customers (${k.newCustomers}) — spend is the one input not in POS data.\n`);
  console.log("  Category mix (gross):");
  for (const c of k.categoryMix) console.log(`    ${c.category.padEnd(14)} ${money(c.gross)}`);
  console.log("  By store (net):");
  for (const s of k.byStore) console.log(`    ${s.store.padEnd(14)} ${money(s.net)}  ·  ${s.orders} orders`);
}
