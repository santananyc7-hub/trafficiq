/**
 * Full-year pull → firm metrics: real LTV, real repeat rate, active customers,
 * dormant (reactivation) pool, channel mix. Privacy: customerId→ZIP + per-id
 * counts in memory only; writes ZIP-level aggregates. No PII persisted.
 *   npx tsx scripts/sync-year.ts
 */
import "./_env";
import { readFileSync, writeFileSync } from "node:fs";

const key = process.env.DUTCHIE_API_KEY!.trim();
const base = (process.env.DUTCHIE_BASE_URL || "https://api.pos.dutchie.com").replace(/\/$/, "");
const H = { Authorization: "Basic " + Buffer.from(`${key}:`).toString("base64"), Accept: "application/json" };
const NOW = new Date("2026-10-23"), YEAR_AGO = new Date("2025-10-23"), D90 = new Date("2026-07-25");
const iso = (d: Date) => d.toISOString().slice(0, 10);

function months() {
  const out: [string, string][] = []; let d = new Date(YEAR_AGO);
  while (d < NOW) { const n = new Date(d); n.setMonth(n.getMonth() + 1); out.push([iso(d), iso(n)]); d = n; }
  return out;
}
const getJson = async (u: string) => { const r = await fetch(u, { headers: H }); if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); };
const arrOf = (j: any) => (Array.isArray(j) ? j : (j.data ?? j.transactions ?? j.customers ?? []));

// US Census ACS 5-year: population, median household income, median age per ZCTA.
// Free government API (no key required; optional key just lifts rate limits).
const CENSUS_CACHE = "data/geo/zip-census.json";
async function censusDemo(zip: string): Promise<{ age: number; income: number; pop: number } | null> {
  const ck = process.env.CENSUS_API_KEY?.trim(); const kp = ck ? `&key=${ck}` : "";
  for (const yr of [2023, 2022]) {
    try {
      const res = await fetch(`https://api.census.gov/data/${yr}/acs/acs5?get=B01003_001E,B19013_001E,B01002_001E&for=zip%20code%20tabulation%20area:${zip}${kp}`);
      if (!res.ok) continue;
      const j = (await res.json()) as string[][]; const row = j[1]; if (!row) continue;
      const [pop, income, age] = row.map(Number);
      return { pop, income: income < 0 ? NaN : income, age: age < 0 ? NaN : age };
    } catch { /* next vintage */ }
  }
  return null;
}

async function main() {
  process.stdout.write("customers → ZIP … ");
  const daysAgo = (s?: string) => (s ? (NOW.getTime() - new Date(s).getTime()) / 86400000 : Infinity);
  const cidZip = new Map<string, string>();
  let newCustomers = 0, loyaltyMembers = 0;
  for (const c of arrOf(await getJson(`${base}/reporting/customers`))) {
    const z = String(c.postalCode ?? "").trim().slice(0, 5);
    if (/^\d{5}$/.test(z) && c.customerId != null) cidZip.set(String(c.customerId), z);
    if (daysAgo(c.creationDate) <= 90) newCustomers++;
    if (c.isLoyaltyMember) loyaltyMembers++;
  }
  console.log(`${cidZip.size.toLocaleString()}`);

  const txns = new Map<string, number>(), spend = new Map<string, number>(), last = new Map<string, number>();
  const channel: Record<string, number> = {}; let total = 0;
  for (const [f, t] of months()) {
    const arr = arrOf(await getJson(`${base}/reporting/transactions?FromLastModifiedDateUTC=${f}&ToLastModifiedDateUTC=${t}`));
    for (const x of arr) {
      if (x.isVoid || x.isReturn) continue;
      const d = new Date(x.transactionDate); if (d < YEAR_AGO || d > NOW) continue;
      const cid = String(x.customerId ?? ""); if (!cid || cid === "null") continue;
      total++; txns.set(cid, (txns.get(cid) ?? 0) + 1); spend.set(cid, (spend.get(cid) ?? 0) + Number(x.total ?? 0));
      last.set(cid, Math.max(last.get(cid) ?? 0, d.getTime()));
      const s = String(x.orderSource ?? "").trim() || "(unset)"; channel[s] = (channel[s] ?? 0) + 1;
    }
    process.stdout.write(".");
  }
  console.log(` ${total.toLocaleString()} txns`);

  const active = spend.size;
  const txnCounts = [...txns.values()];
  const repeat = txnCounts.filter((n) => n > 1).length;
  const oneAndDone = txnCounts.filter((n) => n === 1).length;
  const repeatRate = repeat / active;
  const totalSpend = [...spend.values()].reduce((a, b) => a + b, 0);
  const realLTV = Math.round(totalSpend / active);
  const avgTxns = total / active;

  // Real customer segments (counts only — no PII).
  const totalCustomers = cidZip.size;
  const dormant = Math.max(0, totalCustomers - active);
  const spendsDesc = [...spend.values()].sort((a, b) => b - a);
  const vip = Math.max(1, Math.round(active * 0.1));
  const vipRevenueShare = totalSpend ? spendsDesc.slice(0, vip).reduce((a, b) => a + b, 0) / totalSpend : 0;
  const segments = { totalCustomers, active, newCustomers, repeat, oneAndDone, dormant, vip, vipRevenueShare, loyaltyMembers };

  // ZIP rollup
  const zActive: Record<string, number> = {}, zSpend: Record<string, number> = {}, zActive90: Record<string, number> = {};
  for (const [cid, sp] of spend) {
    const z = cidZip.get(cid); if (!z) continue;
    zActive[z] = (zActive[z] ?? 0) + 1; zSpend[z] = (zSpend[z] ?? 0) + sp;
    if ((last.get(cid) ?? 0) >= D90.getTime()) zActive90[z] = (zActive90[z] ?? 0) + 1;
  }
  // ── Real VIP demographic profile: ground `match` in who actually spends ──
  // Your top-10%-by-spend customers' home ZIPs → their Census age + income,
  // weighted by how many VIPs live there. This is the profile every candidate
  // neighborhood is scored against — no hard-coded assumptions.
  process.stdout.write("VIP profile (Census) … ");
  const spendThreshold = spendsDesc[vip - 1] ?? 0;
  const vipByZip: Record<string, number> = {};
  for (const [cid, sp] of spend) { if (sp < spendThreshold) continue; const z = cidZip.get(cid); if (z) vipByZip[z] = (vipByZip[z] ?? 0) + 1; }
  const vipZips = Object.entries(vipByZip).sort((a, b) => b[1] - a[1]);
  const vipPlaced = vipZips.reduce((s, [, n]) => s + n, 0) || 1;
  const cache: Record<string, { age: number; income: number; pop: number }> = (() => { try { return JSON.parse(readFileSync(CENSUS_CACHE, "utf8")); } catch { return {}; } })();
  const profileZips = vipZips.slice(0, 70);
  for (const [z] of profileZips) { if (!cache[z]) { const c = await censusDemo(z); if (c) cache[z] = c; } }
  try { writeFileSync(CENSUS_CACHE, JSON.stringify(cache)); } catch { /* cache is best-effort */ }
  let wSum = 0, ageSum = 0, incSum = 0, covered = 0, used = 0; const agePts: [number, number][] = [];
  for (const [z, n] of profileZips) { const c = cache[z]; if (!c || !Number.isFinite(c.age) || !Number.isFinite(c.income)) continue; wSum += n; ageSum += n * c.age; incSum += n * c.income; covered += n; used++; agePts.push([c.age, n]); }
  const vipAge = wSum ? ageSum / wSum : 34;
  const vipIncome = wSum ? incSum / wSum : 95000;
  let varSum = 0; for (const [a, n] of agePts) varSum += n * (a - vipAge) ** 2;
  const ageWidth = Math.max(6, wSum ? Math.sqrt(varSum / wSum) : 10);
  const vipProfile = { age: Math.round(vipAge * 10) / 10, income: Math.round(vipIncome), ageWidth: Math.round(ageWidth * 10) / 10, basedOnVips: covered, zipsProfiled: used, coverage: covered / vipPlaced };
  console.log(`age ~${vipProfile.age}, income ~$${vipProfile.income.toLocaleString()} (from ${covered.toLocaleString()} VIPs across ${used} ZIPs)`);

  const custByZip = new Map((JSON.parse(readFileSync("data/out/customers_by_zip.json", "utf8")) as any[]).map((r) => [r.zip, r.customers]));
  const geo = JSON.parse(readFileSync("data/out/opportunity.json", "utf8")) as any[];
  const CEILING = 0.2, CAPTURE = 0.05;
  const clamp = (x: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, x));
  const rows = geo.map((g) => {
    // match = demographic similarity of this ZIP to the real VIP profile
    const ageFit = Number.isFinite(g.age) ? Math.exp(-(((g.age - vipAge) / ageWidth) ** 2)) : 0.5;
    const incomeFit = Number.isFinite(g.income) ? clamp(g.income / vipIncome) : 0.5;
    const match = clamp(0.6 * ageFit + 0.4 * incomeFit, 0.001, 1);
    const demand = g.pop * match, activeY = zActive[g.zip] ?? 0;
    const totalCust = (custByZip.get(g.zip) as number) ?? 0, dormant = Math.max(0, totalCust - activeY);
    const penetration = Math.min(1, activeY / (demand || 1));
    const reactivate$ = Math.round(dormant * repeatRate * realLTV);
    const capture$ = Math.round(Math.max(0, demand * CEILING - activeY) * CAPTURE * realLTV);
    return { zip: g.zip, name: g.name, lat: g.lat, lng: g.lng, pop: g.pop, match, status: g.status,
      activeY, dormant, penetration, reactivate$, capture$, annual: reactivate$ + capture$ };
  }).sort((a, b) => b.annual - a.annual);

  const payload = { active, repeatRate, realLTV, avgTxns, channel, segments, vipProfile, rows };
  writeFileSync("data/out/opportunity_year.json", JSON.stringify(payload, null, 2));
  if (process.env.DATABASE_URL) {
    const { writeSnapshot } = await import("../src/server/snapshot");
    await writeSnapshot(payload);
    console.log("→ snapshot written to Neon");
  }
  const usd = (n: number) => "$" + Math.round(n).toLocaleString("en-US");
  console.log(`\nFIRM metrics (12 months):`);
  console.log(`  active customers (bought in last yr): ${active.toLocaleString()}`);
  console.log(`  real repeat rate: ${(repeatRate * 100).toFixed(1)}%   avg visits/yr: ${avgTxns.toFixed(1)}`);
  console.log(`  real LTV (actual annual spend/customer): ${usd(realLTV)}`);
  console.log(`  channel: ` + Object.entries(channel).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k, v]) => `${k} ${(100 * v / total).toFixed(1)}%`).join(" · "));
  console.log(`\n  Catchment capture targets (real penetration + real LTV + real repeat rate):`);
  console.log("  #  ZIP   Neighborhood          ActiveYr  Dormant  Pen%   $reactivate  $capture    $/yr");
  rows.slice(0, 10).forEach((r, i) => console.log(`  ${String(i + 1).padStart(2)} ${r.zip} ${r.name.padEnd(20).slice(0, 20)} ${String(r.activeY).padStart(8)} ${String(r.dormant).padStart(8)}  ${(r.penetration * 100).toFixed(2).padStart(5)}  ${usd(r.reactivate$).padStart(11)} ${usd(r.capture$).padStart(9)} ${usd(r.annual).padStart(8)}`));
  console.log(`\n  Wrote data/out/opportunity_year.json`);
}
main().catch((e) => { console.error(e); process.exit(1); });
