/**
 * Pull transactions from the Dutchie POS API → normalize → run the KPI engine.
 *   npx tsx scripts/sync-dutchie.ts
 *
 * Reads DUTCHIE_* from .env.local. Dutchie field names vary by API version, so
 * on the first run this prints the live response shape and (best-effort) maps it;
 * once we confirm the shape from a real response we lock the mapper.
 */
import "./_env";
import { createDb, ingest, computeKpis, printKpis, type SaleLine } from "../src/server/salesEngine";

const key = process.env.DUTCHIE_API_KEY?.trim();
const baseUrl = (process.env.DUTCHIE_BASE_URL || "https://api.pos.dutchie.com").replace(/\/$/, "");
const path = process.env.DUTCHIE_TRANSACTIONS_PATH || "/transactions";

function pick<T = unknown>(o: Record<string, unknown>, ...keys: string[]): T | undefined {
  for (const k of keys) {
    const hit = Object.keys(o).find((kk) => kk.toLowerCase() === k.toLowerCase());
    if (hit && o[hit] != null) return o[hit] as T;
  }
  return undefined;
}

// Best-effort: Dutchie returns transactions, each with line items. Flatten to SaleLine[].
function toSaleLines(data: unknown): SaleLine[] {
  const arr: Record<string, unknown>[] = Array.isArray(data)
    ? (data as Record<string, unknown>[])
    : ((pick<Record<string, unknown>[]>((data as Record<string, unknown>) || {}, "data", "transactions", "results") as Record<string, unknown>[]) || []);
  const out: SaleLine[] = [];
  for (const t of arr) {
    const receipt = String(pick(t, "transactionId", "receiptId", "id", "ticketId") ?? "");
    const date = String(pick(t, "checkoutDate", "transactionDate", "date", "createdDate") ?? "").slice(0, 10);
    const store = String(pick(t, "location", "store", "locationName", "storeName") ?? "");
    const member = String(pick(t, "customerId", "memberId", "patientId", "loyaltyId") ?? "");
    const order_discount = Number(pick(t, "totalDiscount", "orderDiscount") ?? 0);
    const items = (pick<Record<string, unknown>[]>(t, "items", "lineItems", "products", "transactionItems") as Record<string, unknown>[]) || [];
    for (const it of items) {
      out.push({
        receipt_id: receipt, date, store, member_id: member,
        budtender: String(pick(it, "budtender", "employee", "salesRep") ?? ""),
        sku: String(pick(it, "sku", "productId") ?? ""),
        product: String(pick(it, "productName", "product", "name") ?? ""),
        category: String(pick(it, "category", "productCategory") ?? ""),
        qty: Number(pick(it, "quantity", "qty") ?? 1),
        price: Number(pick(it, "unitPrice", "price", "salesPrice") ?? 0),
        cost: Number(pick(it, "unitCost", "cost") ?? 0),
        discount: Number(pick(it, "discount", "totalDiscount") ?? 0),
        order_discount,
      });
    }
  }
  return out;
}

async function main() {
  if (!key) {
    console.error("DUTCHIE_API_KEY is empty. Paste it into .env.local, then re-run.");
    process.exit(1);
  }
  const auth = "Basic " + Buffer.from(`${key}:`).toString("base64");
  const url = `${baseUrl}${path}`;
  console.log(`GET ${url}`);
  const res = await fetch(url, { headers: { Authorization: auth, Accept: "application/json" } });
  const body = await res.text();
  if (!res.ok) {
    console.error(`HTTP ${res.status} ${res.statusText}`);
    console.error(body.slice(0, 500));
    console.error(res.status === 401 ? "→ check the API key." :
      res.status === 403 ? "→ key is missing a permission scope; ask Dutchie Support to add transactions." :
      res.status === 404 ? "→ wrong path; set DUTCHIE_TRANSACTIONS_PATH from your API Explorer." : "");
    process.exit(1);
  }
  let json: unknown;
  try { json = JSON.parse(body); } catch { console.error("Non-JSON response:", body.slice(0, 300)); process.exit(1); }

  const rows = toSaleLines(json);
  if (rows.length === 0) {
    // Privacy: print FIELD NAMES only, never values — the records may carry PII.
    const sample = (Array.isArray(json) ? json[0] : json) as Record<string, unknown>;
    const shape = sample && typeof sample === "object"
      ? Object.keys(sample).map((k) => `${k}: ${Array.isArray(sample[k]) ? "array" : typeof sample[k]}`)
      : [typeof sample];
    console.log("Connected ✓ but couldn't map fields yet. Field names (no values):");
    console.log(shape.join("\n"));
    console.log("\n→ Tell me these field names and I'll lock the mapper. No data values needed.");
    process.exit(0);
  }
  const db = await createDb();
  await ingest(db, rows);
  printKpis(await computeKpis(db), `Dutchie API (${rows.length} line items)`, rows.length);
  await db.close();
}

main().catch((e) => { console.error(e); process.exit(1); });
