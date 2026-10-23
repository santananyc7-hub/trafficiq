// Discover valid Dutchie POS endpoints. Prints path + HTTP status ONLY — no key, no body.
import "./_env";

const key = process.env.DUTCHIE_API_KEY!.trim();
const base = (process.env.DUTCHIE_BASE_URL || "https://api.pos.dutchie.com").replace(/\/$/, "");
const auth = "Basic " + Buffer.from(`${key}:`).toString("base64");

const paths = [
  "/whoami", "/util/ping", "/products", "/inventory",
  "/transactions", "/transaction", "/reporting/transactions", "/reporting/sales",
  "/sales", "/orders", "/customers", "/customer", "/loyaltymembers",
  "/v2/transactions", "/transactions/history", "/reporting/transactions-detail",
];

async function main() {
  for (const p of paths) {
    try {
      const r = await fetch(base + p, { headers: { Authorization: auth, Accept: "application/json" } });
      const mark = r.ok ? "✓ OK" : r.status === 404 ? "404" : r.status === 403 ? "403 (needs scope)" : r.status === 400 ? "400 (exists, needs params)" : String(r.status);
      console.log(`${r.status === 404 ? " " : "→"} ${p.padEnd(32)} ${mark}`);
    } catch (e) {
      console.log(`  ${p.padEnd(32)} ERR ${(e as Error).message}`);
    }
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
