import "./_env";
const key = process.env.DUTCHIE_API_KEY!.trim();
const base = (process.env.DUTCHIE_BASE_URL || "https://api.pos.dutchie.com").replace(/\/$/, "");
const H = { Authorization: "Basic " + Buffer.from(`${key}:`).toString("base64"), Accept: "application/json" };
const FROM = "2026-07-01", TO = "2026-10-22";

async function main() {
  // Which date param names does /reporting/transactions accept?
  const variants = [
    `fromDateUTC=${FROM}&toDateUTC=${TO}`,
    `FromDateUTC=${FROM}&ToDateUTC=${TO}`,
    `transactionDateStart=${FROM}&transactionDateEnd=${TO}`,
    `fromLastModifiedDateUTC=${FROM}&toLastModifiedDateUTC=${TO}`,
  ];
  console.log("== /reporting/transactions date-param test ==");
  for (const q of variants) {
    const r = await fetch(`${base}/reporting/transactions?${q}`, { headers: H });
    if (r.ok) {
      const j = await r.json();
      const arr = Array.isArray(j) ? j : (j.data ?? j.transactions ?? []);
      console.log(`✓ OK  ${q.split("=")[0]}...  → ${arr.length} records; fields: ${arr[0] ? Object.keys(arr[0]).join(", ").slice(0, 300) : "none"}`);
      break;
    } else {
      console.log(`  ${r.status}  ${q.split("=")[0]}...`);
    }
  }

  // Customer fields — NAMES ONLY (no values; records carry PII).
  console.log("\n== /reporting/customers field names (no values) ==");
  const rc = await fetch(`${base}/reporting/customers`, { headers: H });
  if (rc.ok) {
    const j = await rc.json();
    const arr = Array.isArray(j) ? j : (j.data ?? j.customers ?? []);
    console.log(`records: ${arr.length}`);
    if (arr[0]) console.log("fields: " + Object.keys(arr[0]).join(", "));
  } else {
    console.log("status " + rc.status);
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
