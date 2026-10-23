/**
 * True capture map: join real transactions → customer home ZIP.
 * Privacy: holds only customerId→ZIP (pseudonymous id + coarse ZIP) and per-id
 * spend in memory; writes ONLY ZIP-level aggregates. No names/DOB/address/etc.
 *
 *   npx tsx scripts/sync-true.ts
 */
import "./_env";
import { readFileSync, writeFileSync } from "node:fs";

const key = process.env.DUTCHIE_API_KEY!.trim();
const base = (process.env.DUTCHIE_BASE_URL || "https://api.pos.dutchie.com").replace(/\/$/, "");
const H = { Authorization: "Basic " + Buffer.from(`${key}:`).toString("base64"), Accept: "application/json" };

const CEILING = 0.2, CONV = 0.06;
const WINDOW_DAYS = 92;
const CUTOFF = new Date("2026-07-22");
const WINDOWS = [["2026-07-20", "2026-08-22"], ["2026-08-22", "2026-09-22"], ["2026-09-22", "2026-10-23"]];

async function getJson(url: string) { const r = await fetch(url, { headers: H }); if (!r.ok) throw new Error(`HTTP ${r.status} ${url}`); return r.json(); }
const arrOf = (j: any) => (Array.isArray(j) ? j : (j.data ?? j.transactions ?? j.customers ?? []));

async function main() {
  // 1) customerId → ZIP (keep nothing else)
  process.stdout.write("customers → ZIP map … ");
  const cj = await getJson(`${base}/reporting/customers`);
  const cidZip = new Map<string, string>();
  for (const c of arrOf(cj)) {
    const zip = String(c.postalCode ?? "").trim().slice(0, 5);
    if (/^\d{5}$/.test(zip) && c.customerId != null) cidZip.set(String(c.customerId), zip);
  }
  console.log(`${cidZip.size.toLocaleString()} with ZIP`);

  // 2) transactions over ~90d → active customers, spend, channel
  const spendByCid = new Map<string, number>();
  const activeCids = new Set<string>();
  const channel: Record<string, number> = {};
  let txCount = 0;
  for (const [f, t] of WINDOWS) {
    const j = await getJson(`${base}/reporting/transactions?FromLastModifiedDateUTC=${f}&ToLastModifiedDateUTC=${t}`);
    for (const x of arrOf(j)) {
      if (x.isVoid || x.isReturn) continue;
      if (new Date(x.transactionDate) < CUTOFF) continue;
      const cid = String(x.customerId ?? "");
      if (!cid || cid === "null") continue;
      txCount++;
      activeCids.add(cid);
      spendByCid.set(cid, (spendByCid.get(cid) ?? 0) + Number(x.total ?? 0));
      const src = String(x.orderSource ?? "").trim() || "(unset)";
      channel[src] = (channel[src] ?? 0) + 1;
    }
  }
  console.log(`transactions (90d): ${txCount.toLocaleString()} · active customers: ${activeCids.size.toLocaleString()}`);

  // 3) aggregate active customers + spend to ZIP
  const zipActive: Record<string, number> = {}, zipSpend: Record<string, number> = {};
  for (const cid of activeCids) {
    const zip = cidZip.get(cid); if (!zip) continue;
    zipActive[zip] = (zipActive[zip] ?? 0) + 1;
    zipSpend[zip] = (zipSpend[zip] ?? 0) + (spendByCid.get(cid) ?? 0);
  }

  // 4) real LTV (annualized window spend per active customer)
  const totalSpend = [...spendByCid.values()].reduce((a, b) => a + b, 0);
  const realLTV = Math.round((totalSpend / Math.max(1, activeCids.size)) * (365 / WINDOW_DAYS));

  // 5) join to catchment geo + score with REAL penetration + REAL LTV
  const geo = JSON.parse(readFileSync("data/out/opportunity.json", "utf8")) as any[];
  const rows = geo.map((g) => {
    const matchedDemand = g.pop * g.match;
    const active = zipActive[g.zip] ?? 0;
    const spend = Math.round(zipSpend[g.zip] ?? 0);
    const penetration = Math.min(1, active / (matchedDemand || 1));
    const untapped = Math.max(0, matchedDemand * CEILING - active);
    const annual = Math.round(untapped * CONV * realLTV);
    return { zip: g.zip, name: g.name, lat: g.lat, lng: g.lng, pop: g.pop, match: g.match,
      status: g.status, activeCustomers: active, windowSpend: spend, penetration, untapped: Math.round(untapped), annual };
  }).sort((a, b) => b.annual - a.annual);

  writeFileSync("data/out/opportunity_true.json", JSON.stringify({ realLTV, activeTotal: activeCids.size, channel, rows }, null, 2));

  const usd = (n: number) => "$" + Math.round(n).toLocaleString("en-US");
  console.log(`\nReal annualized LTV per active customer: ${usd(realLTV)}`);
  console.log("Channel mix (orderSource) across active transactions:");
  for (const [k, v] of Object.entries(channel).sort((a, b) => b[1] - a[1]).slice(0, 6)) console.log(`   ${k.padEnd(16)} ${(100 * v / txCount).toFixed(1)}%`);
  console.log(`\nTrafficIQ — TRUE Capture Targets (real penetration + real LTV)\n`);
  console.log("  #  ZIP   Neighborhood          Pop    Match  Active  Pen%   Status          Est $/yr");
  rows.slice(0, 10).forEach((r, i) =>
    console.log(`  ${String(i + 1).padStart(2)} ${r.zip} ${r.name.padEnd(20).slice(0, 20)} ${String(r.pop).padStart(6)}  ${(r.match * 100).toFixed(0).padStart(3)}% ${String(r.activeCustomers).padStart(6)}  ${(r.penetration * 100).toFixed(2).padStart(5)}  ${r.status.padEnd(14)} ${usd(r.annual).padStart(9)}`));
  console.log(`\n  Wrote data/out/opportunity_true.json`);
}
main().catch((e) => { console.error(e); process.exit(1); });
