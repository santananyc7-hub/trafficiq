/**
 * Capture map v2 — REAL penetration. Joins the Census+geo scoring
 * (data/out/opportunity.json) with real Dutchie customer counts per ZIP
 * (data/out/customers_by_zip.json). Penetration and reactivation pools are now
 * actual; only the conversion rates remain modeled (labelled).
 *
 *   npx tsx scripts/opportunity-real.ts
 */
import "./_env";
import { readFileSync, writeFileSync } from "node:fs";

const CEILING = 0.2;   // realistic max active share of matching demand
const CONV = 0.06;     // modeled: new matching customers won per year
const REACT = 0.15;    // modeled: lapsed customers won back per year
const VALUE = 650;     // modeled: annual revenue per customer

type Geo = { zip: string; name: string; lat: number; lng: number; pop: number; match: number; dTor: number; dComp: number; nearestComp: string; status: string };
type Cust = { zip: string; customers: number; active365: number; lapsed: number; new90: number; avgAge: number | null };

const geo = JSON.parse(readFileSync("data/out/opportunity.json", "utf8")) as Geo[];
const custArr = JSON.parse(readFileSync("data/out/customers_by_zip.json", "utf8")) as Cust[];
const cust = new Map(custArr.map((c) => [c.zip, c]));
const clamp = (x: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, x));

const rows = geo.map((g) => {
  const c = cust.get(g.zip) ?? { customers: 0, active365: 0, lapsed: 0, new90: 0, avgAge: null };
  const matchedDemand = g.pop * g.match;
  const penetration = clamp(c.active365 / (matchedDemand || 1));
  const untappedCapture = Math.max(0, matchedDemand * CEILING - c.active365);
  const captureAnnual = untappedCapture * CONV * VALUE;
  const reactAnnual = c.lapsed * REACT * VALUE;
  const annual = captureAnnual + reactAnnual;
  return { ...g, total: c.customers, active: c.active365, lapsed: c.lapsed, new90: c.new90,
    penetration, untappedCapture, captureAnnual, reactAnnual, annual };
}).sort((a, b) => b.annual - a.annual);

writeFileSync("data/out/opportunity_real.json", JSON.stringify(rows, null, 2));

const usd = (n: number) => "$" + Math.round(n).toLocaleString("en-US");
console.log(`\nTrafficIQ — REAL Capture Targets around Torches (12 E 42nd St)`);
console.log(`Live Census + real Dutchie customer home-ZIPs · penetration is actual\n`);
console.log("  #  ZIP   Neighborhood          Pop    Match  Ours  Active  Lapsed  Pen%  Status          $capture  $reactivate   $/yr");
rows.slice(0, 12).forEach((r, i) => {
  console.log(`  ${String(i + 1).padStart(2)} ${r.zip} ${r.name.padEnd(20).slice(0, 20)} ${String(r.pop).padStart(6)}  ${(r.match * 100).toFixed(0).padStart(3)}% ${String(r.total).padStart(5)} ${String(r.active).padStart(6)} ${String(r.lapsed).padStart(7)}  ${(r.penetration * 100).toFixed(1).padStart(4)}  ${r.status.padEnd(14)} ${usd(r.captureAnnual).padStart(8)} ${usd(r.reactAnnual).padStart(11)} ${usd(r.annual).padStart(7)}`);
});
const tot = rows.reduce((s, r) => s + r.annual, 0);
const totReact = rows.reduce((s, r) => s + r.reactAnnual, 0);
console.log(`\n  Catchment annual opportunity: ${usd(tot)}  (of which reactivation: ${usd(totReact)})`);
console.log(`  (Real: pop, match, customers, active, lapsed. Modeled rates: capture ${CONV * 100}%/yr, reactivate ${REACT * 100}%/yr, $${VALUE}/customer.)`);
const top = rows[0];
console.log(`\n  ▶ Top move: ${top.name} (${top.zip}) — ${top.lapsed} lapsed to win back + ${Math.round(top.untappedCapture)} new to capture ≈ ${usd(top.annual)}/yr.`);
console.log("");
