import "./_env";
const key = process.env.DUTCHIE_API_KEY!.trim();
const base = (process.env.DUTCHIE_BASE_URL || "https://api.pos.dutchie.com").replace(/\/$/, "");
const auth = "Basic " + Buffer.from(`${key}:`).toString("base64");
const H = { Authorization: auth, Accept: "application/json" };

async function main() {
  // 1) Learn required params for /reporting/transactions (400 body = validation msg, no data).
  const r = await fetch(base + "/reporting/transactions", { headers: H });
  console.log("== /reporting/transactions param hint (status " + r.status + ") ==");
  console.log((await r.text()).slice(0, 400));

  // 2) Find the customer endpoint (status only — never print bodies, they hold PII).
  console.log("\n== customer endpoint probes (status only) ==");
  const cands = [
    "/reporting/customers", "/reporting/customer", "/reporting/consumers",
    "/customers/details", "/consumers", "/patients", "/reporting/loyalty",
    "/loyalty/members", "/reporting/customer-list", "/customer/details",
    "/reporting/customers-list", "/reporting/patients",
  ];
  for (const p of cands) {
    const rr = await fetch(base + p, { headers: H });
    const mark = rr.ok ? "✓ OK" : rr.status === 400 ? "400 (exists, needs params)" : rr.status === 403 ? "403 (needs scope)" : String(rr.status);
    if (rr.status !== 404) console.log(`→ ${p.padEnd(30)} ${mark}`);
    else console.log(`  ${p.padEnd(30)} 404`);
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
