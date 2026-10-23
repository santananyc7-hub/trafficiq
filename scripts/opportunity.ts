/**
 * Opportunity-Score engine (Path A demo): rank the neighborhoods around the
 * Torches flagship by untapped, matching, capturable demand — using LIVE US
 * Census demographics + real competitor positions. This is the thing the
 * incumbents don't do: outward-looking market capture, not owned-channel attribution.
 *
 * Modeled now: the "best-customer profile" and current penetration (no VeriScan
 * yet). REAL now: Census population/income/age per ZIP, competitor geography,
 * and the whole scoring engine. Swap VeriScan home-ZIPs in → the model becomes exact.
 *
 *   npx tsx scripts/opportunity.ts
 */
import "./_env";
import { mkdirSync, writeFileSync } from "node:fs";

// Torches flagship — 12 E 42nd St (Grand Central / Midtown East)
const TORCHES = { lat: 40.7527, lng: -73.979 };

// Real competing Midtown dispensaries (from prior research).
const COMPETITORS = [
  { name: "Qube NYC", lat: 40.7544, lng: -73.9868 },
  { name: "The Daily Green", lat: 40.7607, lng: -73.9837 },
  { name: "Elevation HQ", lat: 40.7589, lng: -73.9899 },
  { name: "Culture House", lat: 40.749, lng: -73.9888 },
  { name: "Stoops NYC", lat: 40.74, lng: -73.9905 },
];

// Catchment ZIPs with centroids + neighborhood labels.
const ZIPS: { zip: string; name: string; lat: number; lng: number }[] = [
  { zip: "10017", name: "Midtown East", lat: 40.752, lng: -73.9723 },
  { zip: "10016", name: "Murray Hill / Kips Bay", lat: 40.746, lng: -73.978 },
  { zip: "10022", name: "Midtown East / Sutton", lat: 40.7586, lng: -73.968 },
  { zip: "10018", name: "Garment District", lat: 40.7549, lng: -73.9925 },
  { zip: "10036", name: "Times Sq / Theater", lat: 40.759, lng: -73.9897 },
  { zip: "10019", name: "Hell's Kitchen", lat: 40.7657, lng: -73.988 },
  { zip: "10001", name: "Chelsea / NoMad", lat: 40.7506, lng: -73.9971 },
  { zip: "10010", name: "Gramercy / Flatiron", lat: 40.739, lng: -73.9826 },
  { zip: "10011", name: "Chelsea", lat: 40.742, lng: -74.0007 },
  { zip: "10003", name: "Union Sq / East Village", lat: 40.7318, lng: -73.989 },
  { zip: "10009", name: "East Village / Alphabet", lat: 40.7265, lng: -73.979 },
  { zip: "10021", name: "Upper East Side (60s)", lat: 40.7692, lng: -73.959 },
  { zip: "10028", name: "Upper East Side (80s)", lat: 40.7762, lng: -73.9533 },
  { zip: "10128", name: "Yorkville", lat: 40.7816, lng: -73.9505 },
  { zip: "10023", name: "Lincoln Sq (UWS)", lat: 40.7759, lng: -73.9822 },
  { zip: "10024", name: "Upper West Side (80s)", lat: 40.7861, lng: -73.9766 },
  { zip: "10012", name: "SoHo / NoHo", lat: 40.7255, lng: -73.9983 },
  { zip: "10013", name: "Tribeca / SoHo", lat: 40.7205, lng: -74.005 },
  { zip: "10002", name: "Lower East Side", lat: 40.7156, lng: -73.9865 },
  { zip: "11101", name: "Long Island City", lat: 40.747, lng: -73.94 },
  { zip: "11211", name: "Williamsburg", lat: 40.714, lng: -73.953 },
  { zip: "10038", name: "Financial District", lat: 40.7089, lng: -74.0027 },
];

// ── Modeled assumptions (labelled; replaced by real VeriScan/Dutchie data) ──
const TARGET_AGE = 34;        // best-customer median age
const AGE_WIDTH = 13;
const INCOME_FULL = 95000;    // income at which demographic fit saturates
const REACH_MILES = 1.3;      // distance decay for a short-trip urban catchment
const BASE_PENETRATION = 0.14; // modeled share of reachable demand we already get at the doorstep
const CAPTURE_RATE = 0.015;   // modeled annual conversion of untapped matched demand
const ANNUAL_VALUE = 650;     // modeled annual revenue per captured customer ($)

function haversine(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 3958.8, toR = Math.PI / 180;
  const dLat = (b.lat - a.lat) * toR, dLng = (b.lng - a.lng) * toR;
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * toR) * Math.cos(b.lat * toR) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

async function census(zip: string): Promise<{ pop: number; income: number; age: number } | null> {
  const vars = "B01003_001E,B19013_001E,B01002_001E";
  const key = process.env.CENSUS_API_KEY?.trim();
  const keyParam = key ? `&key=${key}` : "";
  for (const yr of [2023, 2022]) {
    const url = `https://api.census.gov/data/${yr}/acs/acs5?get=${vars}&for=zip%20code%20tabulation%20area:${zip}${keyParam}`;
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const j = (await res.json()) as string[][];
      const [pop, income, age] = j[1].map(Number);
      return { pop, income: income < 0 ? NaN : income, age: age < 0 ? NaN : age };
    } catch { /* try next vintage */ }
  }
  return null;
}

function clamp(x: number, lo = 0, hi = 1) { return Math.max(lo, Math.min(hi, x)); }

async function main() {
  const NYC_MED_INCOME = 76000, NYC_MED_AGE = 37;
  const rows = [];
  for (const z of ZIPS) {
    const c = await census(z.zip);
    const pop = c?.pop ?? 0;
    const income = Number.isFinite(c?.income) ? (c!.income as number) : NYC_MED_INCOME;
    const age = Number.isFinite(c?.age) ? (c!.age as number) : NYC_MED_AGE;

    const ageFit = Math.exp(-(((age - TARGET_AGE) / AGE_WIDTH) ** 2));
    const incomeFit = clamp(income / INCOME_FULL);
    const match = 0.6 * ageFit + 0.4 * incomeFit;

    const dTor = haversine(TORCHES, z);
    const dComp = Math.min(...COMPETITORS.map((k) => haversine(k, z)));
    const nearestComp = COMPETITORS.reduce((a, b) => (haversine(b, z) < haversine(a, z) ? b : a));
    const reach = Math.exp(-dTor / REACH_MILES);
    const penetration = clamp(BASE_PENETRATION + reach * 0.12); // more penetrated near the door
    const matchedDemand = pop * match;
    const untapped = matchedDemand * reach * (1 - penetration);
    const newCust = untapped * CAPTURE_RATE;
    const annual = newCust * ANNUAL_VALUE;

    // Who holds this ZIP today?
    const status = dComp < dTor - 0.1 ? "competitor-held" : dTor < dComp - 0.1 ? "our turf" : "contested";
    rows.push({ ...z, pop, income, age, match, dTor, dComp, nearestComp: nearestComp.name, reach, penetration, untapped, newCust, annual, status });
  }

  rows.sort((a, b) => b.annual - a.annual);
  mkdirSync("data/out", { recursive: true });
  writeFileSync("data/out/opportunity.json", JSON.stringify(rows, null, 2));

  const usd = (n: number) => "$" + Math.round(n).toLocaleString("en-US");
  console.log(`\nTrafficIQ — Capture Targets around Torches (12 E 42nd St)`);
  console.log(`Live US Census demographics · ${COMPETITORS.length} real competitors · modeled customer profile\n`);
  console.log("  #  ZIP   Neighborhood            Pop    Med.Inc  Age  Match  mi  Nearest comp (mi)   Status          Est $/yr");
  rows.slice(0, 10).forEach((r, i) => {
    console.log(
      `  ${String(i + 1).padStart(2)} ${r.zip} ${r.name.padEnd(22).slice(0, 22)} ${String(r.pop).padStart(6)}  ${usd(r.income).padStart(7)} ${String(Math.round(r.age)).padStart(3)}  ${(r.match * 100).toFixed(0).padStart(3)}%  ${r.dTor.toFixed(1)}  ${r.nearestComp.slice(0, 13).padEnd(13)} ${r.dComp.toFixed(1)}  ${r.status.padEnd(14)} ${usd(r.annual).padStart(9)}`
    );
  });
  const total = rows.slice(0, 10).reduce((s, r) => s + r.annual, 0);
  console.log(`\n  Top-10 modeled annual capture opportunity: ${usd(total)}`);
  console.log(`  (Assumptions — capture ${(CAPTURE_RATE * 100).toFixed(1)}%/yr, $${ANNUAL_VALUE}/customer/yr; swap VeriScan ZIPs for exact penetration.)`);

  // The #1 move, stated plainly.
  const top = rows[0];
  console.log(`\n  ▶ Top move: ${top.name} (${top.zip}) — ${Math.round(top.newCust)} capturable customers/yr ≈ ${usd(top.annual)}.`);
  console.log(`    ${top.status === "competitor-held" ? `${top.nearestComp} is closer (${top.dComp.toFixed(1)}mi vs your ${top.dTor.toFixed(1)}mi) — win it with a geo-targeted offer + reviews.` : `Open field — no competitor closer than you; concentrate referral + GBP radius here.`}`);
  console.log("");
}

main().catch((e) => { console.error(e); process.exit(1); });
