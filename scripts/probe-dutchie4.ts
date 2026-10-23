import "./_env";
const key = process.env.DUTCHIE_API_KEY!.trim();
const base = (process.env.DUTCHIE_BASE_URL || "https://api.pos.dutchie.com").replace(/\/$/, "");
const H = { Authorization: "Basic " + Buffer.from(`${key}:`).toString("base64"), Accept: "application/json" };
const F = "2026-09-01", T = "2026-10-22";
const variants = [
  `FromLastModifiedDateUTC=${F}&ToLastModifiedDateUTC=${T}`,
  `fromLastModifiedDateUTC=${F}T00:00:00Z&toLastModifiedDateUTC=${T}T00:00:00Z`,
  `FromTransactionDateUTC=${F}&ToTransactionDateUTC=${T}`,
  `fromTransactionDateUTC=${F}&toTransactionDateUTC=${T}`,
  `transactionDateStart=${F}T00:00:00Z&transactionDateEnd=${T}T00:00:00Z`,
  `startDate=${F}&endDate=${T}`,
  `fromDate=${F}&toDate=${T}`,
];
async function main() {
  for (const q of variants) {
    const r = await fetch(`${base}/reporting/transactions?${q}`, { headers: H });
    if (r.ok) {
      const j = await r.json();
      const arr = Array.isArray(j) ? j : (j.data ?? j.transactions ?? []);
      console.log(`✓ OK  ${q}`);
      console.log(`   records: ${arr.length}; fields: ${arr[0] ? Object.keys(arr[0]).join(", ") : "none"}`);
      return;
    }
    console.log(`  ${r.status}  ${q.split("&")[0]}`);
  }
  console.log("none matched — will read the 400 hint again");
}
main().catch((e) => { console.error(e); process.exit(1); });
