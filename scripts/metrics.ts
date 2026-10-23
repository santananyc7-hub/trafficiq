/**
 * Compute KPIs from a Dutchie sales CSV export (the no-API fallback).
 *   npx tsx scripts/metrics.ts [path/to/dutchie_sales.csv]
 */
import "./_env";
import { readFileSync } from "node:fs";
import Papa from "papaparse";
import { createDb, ingest, computeKpis, printKpis, type SaleLine } from "../src/server/salesEngine";

async function main() {
  const csvPath = process.argv[2] || "data/sample/dutchie_sales.csv";
  const parsed = Papa.parse<Record<string, string>>(readFileSync(csvPath, "utf8"), { header: true, skipEmptyLines: true });
  const n = (v: string) => (v === "" || v == null ? 0 : Number(v));
  const rows: SaleLine[] = parsed.data.filter((r) => r.receipt_id).map((r) => ({
    receipt_id: r.receipt_id, date: r.date, store: r.store, budtender: r.budtender, member_id: r.member_id,
    sku: r.sku, product: r.product, category: r.category,
    qty: n(r.qty), price: n(r.price), cost: n(r.cost), discount: n(r.discount), order_discount: n(r.order_discount),
  }));
  const db = await createDb();
  await ingest(db, rows);
  printKpis(await computeKpis(db), csvPath, rows.length);
  await db.close();
}

main().catch((e) => { console.error(e); process.exit(1); });
