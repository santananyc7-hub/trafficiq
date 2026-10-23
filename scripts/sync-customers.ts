/**
 * Pull Dutchie customers → aggregate to ZIP level → write ONLY aggregates.
 * Privacy by design: names, DOB, address, DL hash, MMJ id, phone, email are
 * read in memory and immediately discarded; nothing but per-ZIP counts/buckets
 * is written to disk or printed.
 *
 *   npx tsx scripts/sync-customers.ts
 */
import "./_env";
import { mkdirSync, writeFileSync } from "node:fs";

const key = process.env.DUTCHIE_API_KEY!.trim();
const base = (process.env.DUTCHIE_BASE_URL || "https://api.pos.dutchie.com").replace(/\/$/, "");
const H = { Authorization: "Basic " + Buffer.from(`${key}:`).toString("base64"), Accept: "application/json" };

const NOW = new Date("2026-10-22");
const daysAgo = (iso?: string) => (iso ? (NOW.getTime() - new Date(iso).getTime()) / 86400000 : Infinity);
const ageFrom = (dob?: string) => (dob ? Math.floor((NOW.getTime() - new Date(dob).getTime()) / (365.25 * 86400000)) : null);

interface Agg { n: number; active365: number; lapsed: number; new90: number; ageSum: number; ageN: number; referrals: Record<string, number>; }
const z: Record<string, Agg> = {};
const get = (zip: string) => (z[zip] ??= { n: 0, active365: 0, lapsed: 0, new90: 0, ageSum: 0, ageN: 0, referrals: {} });

async function main() {
  process.stdout.write("Fetching /reporting/customers … ");
  const r = await fetch(`${base}/reporting/customers`, { headers: H });
  if (!r.ok) { console.error(`HTTP ${r.status}`); process.exit(1); }
  const j = (await r.json()) as unknown;
  const rows = (Array.isArray(j) ? j : ((j as Record<string, unknown>).data ?? (j as Record<string, unknown>).customers ?? [])) as Record<string, unknown>[];
  console.log(`${rows.length.toLocaleString()} records`);

  let withZip = 0, merged = 0, anon = 0;
  for (const c of rows) {
    if (c.mergedIntoCustomerId) { merged++; continue; }
    if (c.isAnonymous) { anon++; continue; }
    const zip = String(c.postalCode ?? "").trim().slice(0, 5);
    if (!/^\d{5}$/.test(zip)) continue;
    withZip++;
    const a = get(zip);
    a.n++;
    const rec = daysAgo(c.lastTransactionDate as string | undefined);
    if (rec <= 365) a.active365++;
    else if (rec <= 365 * 3) a.lapsed++;
    if (daysAgo(c.creationDate as string | undefined) <= 90) a.new90++;
    const age = ageFrom(c.dateOfBirth as string | undefined);
    if (age && age >= 18 && age <= 100) { a.ageSum += age; a.ageN++; }
    const ref = String(c.referralSource ?? "").trim() || "(none)";
    a.referrals[ref] = (a.referrals[ref] ?? 0) + 1;
  }

  // Emit ONLY aggregates — no PII leaves this process.
  const out = Object.entries(z).map(([zip, a]) => ({
    zip, customers: a.n, active365: a.active365, lapsed: a.lapsed, new90: a.new90,
    avgAge: a.ageN ? Math.round(a.ageSum / a.ageN) : null,
    topReferral: Object.entries(a.referrals).sort((x, y) => y[1] - x[1])[0]?.[0] ?? null,
  })).sort((x, y) => y.customers - x.customers);

  mkdirSync("data/out", { recursive: true });
  writeFileSync("data/out/customers_by_zip.json", JSON.stringify(out, null, 2));

  console.log(`with usable ZIP: ${withZip.toLocaleString()}  (merged ${merged}, anonymous ${anon})`);
  console.log(`distinct ZIPs: ${out.length}\n`);
  console.log("Top 12 customer-home ZIPs (your real customer DNA):");
  console.log("  ZIP    customers  active(1y)  new(90d)  avgAge  topReferral");
  for (const r of out.slice(0, 12)) {
    console.log(`  ${r.zip}  ${String(r.customers).padStart(8)}  ${String(r.active365).padStart(9)}  ${String(r.new90).padStart(7)}  ${String(r.avgAge ?? "-").padStart(6)}  ${r.topReferral}`);
  }
  console.log("\nWrote data/out/customers_by_zip.json (ZIP aggregates only — no PII).");
}
main().catch((e) => { console.error(e); process.exit(1); });
