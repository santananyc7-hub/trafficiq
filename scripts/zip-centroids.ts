/**
 * Build ZIP → centroid lookup for the customer-origin heatmap. Keyless
 * (Zippopotam). Takes the top customer ZIPs and resolves lat/lng, so the
 * heatmap shows where customers actually come from across the metro.
 *   npx tsx scripts/zip-centroids.ts
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const TOP = 320;
const rows = (JSON.parse(readFileSync("data/out/customers_by_zip.json", "utf8")) as Array<{ zip: string; customers: number; active365: number }>)
  .sort((a, b) => b.customers - a.customers)
  .slice(0, TOP);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const out: Array<{ zip: string; lat: number; lng: number; name: string; customers: number; active: number }> = [];
  let ok = 0, miss = 0;
  for (const r of rows) {
    try {
      const res = await fetch(`https://api.zippopotam.us/us/${r.zip}`);
      if (!res.ok) { miss++; continue; }
      const j = (await res.json()) as { places?: Array<{ latitude: string; longitude: string; ["place name"]: string }> };
      const p = j.places?.[0];
      if (!p) { miss++; continue; }
      out.push({ zip: r.zip, lat: +p.latitude, lng: +p.longitude, name: p["place name"], customers: r.customers, active: r.active365 });
      ok++;
    } catch { miss++; }
    if (ok % 40 === 0) process.stdout.write(".");
    await sleep(60);
  }
  mkdirSync("data/geo", { recursive: true });
  writeFileSync("data/geo/zip-origins.json", JSON.stringify(out));
  console.log(`\nresolved ${ok} ZIP centroids (${miss} missed) → data/geo/zip-origins.json`);
  console.log(`top: ${out.slice(0, 5).map((o) => `${o.zip}(${o.customers})`).join(" ")}`);
}
main().catch((e) => { console.error(e); process.exit(1); });
