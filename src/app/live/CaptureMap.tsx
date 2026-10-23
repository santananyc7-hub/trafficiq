"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

/* Customer-flow map: every top ZIP streams a glowing arc into the flagship,
   weighted and colored (cyan → violet → magenta) by customer volume, animated
   to flow toward Torches. ZIP · count labels mark the biggest origins. No
   circles — just quantum flows culminating at the store. */

export interface MapRow { zip: string; name: string; lat: number; lng: number; status: string; activeY: number; annual: number; }
export interface Origin { zip: string; lat: number; lng: number; name: string; customers: number; active: number; }

const TORCHES: [number, number] = [40.7527, -73.979];
const COMPETITORS = [
  [40.7544, -73.9868], [40.7607, -73.9837], [40.7589, -73.9899], [40.749, -73.9888], [40.74, -73.9905],
] as [number, number][];

function ramp(t: number): string {
  const mix = (a: number[], b: number[], u: number) => a.map((x, i) => Math.round(x + ((b[i] ?? x) - x) * u));
  const cyan = [34, 211, 238], violet = [139, 92, 246], mag = [232, 121, 249];
  const c = t < 0.5 ? mix(cyan, violet, t * 2) : mix(violet, mag, (t - 0.5) * 2);
  return `rgb(${c[0] ?? 0},${c[1] ?? 0},${c[2] ?? 0})`;
}

// Quadratic-bezier arc between two latlngs, bent perpendicular to the chord.
function arc(a: [number, number], b: [number, number], bend = 0.2): [number, number][] {
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const cx = mx - dy * bend, cy = my + dx * bend;
  const pts: [number, number][] = [];
  for (let i = 0; i <= 18; i++) {
    const t = i / 18, u = 1 - t;
    pts.push([u * u * a[0] + 2 * u * t * cx + t * t * b[0], u * u * a[1] + 2 * u * t * cy + t * t * b[1]]);
  }
  return pts;
}

export default function CaptureMap({ origins }: { rows: MapRow[]; origins: Origin[] }) {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!el.current) return;
    let map: import("leaflet").Map | undefined;
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !el.current) return;

      map = L.map(el.current, { zoomControl: true, scrollWheelZoom: false }).setView(TORCHES, 12);
      L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}", { maxZoom: 16, attribution: "Tiles &copy; Esri" }).addTo(map);
      L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}", { maxZoom: 16, opacity: 0.4 }).addTo(map);

      const sorted = [...origins].sort((a, b) => b.customers - a.customers);
      const maxC = Math.max(1, ...sorted.map((o) => o.customers));

      // Glowing flow arcs — brightest/thickest from the densest origins.
      sorted.slice(0, 70).forEach((o, i) => {
        const t = o.customers / maxC;
        const bend = (i % 2 ? 1 : -1) * (0.12 + 0.1 * (1 - t)); // alternate side, gentle for big flows
        L.polyline(arc([o.lat, o.lng], TORCHES, bend), {
          color: ramp(t), weight: 1 + t * 4, opacity: 0.35 + t * 0.55, className: "tiq-signal", lineCap: "round", lineJoin: "round",
        }).bindTooltip(`<b>${o.zip}</b> · ${o.name}<br/>${o.customers.toLocaleString()} customers`, { className: "tiq-tip", sticky: true }).addTo(map!);
      });

      // Numerical labels for the biggest origins only (kept, decluttered).
      sorted.slice(0, 10).forEach((o) => {
        L.tooltip({ permanent: true, direction: "center", className: "tiq-lab" })
          .setLatLng([o.lat, o.lng]).setContent(`${o.zip} · ${o.customers.toLocaleString()}`).addTo(map!);
      });

      for (const c of COMPETITORS) {
        L.marker(c, { icon: L.divIcon({ className: "", html: `<div class="tiq-x">✕</div>`, iconSize: [14, 14], iconAnchor: [7, 7] }) }).addTo(map!);
      }

      L.marker(TORCHES, {
        icon: L.divIcon({ className: "", html: `<div class="tiq-node tiq-node-lg"><i></i><i></i><b>Torches</b></div>`, iconSize: [0, 0] }), zIndexOffset: 1000,
      }).addTo(map!);

      // Tight view on the dense core where flows converge.
      const b = L.latLngBounds(sorted.slice(0, 26).map((o) => [o.lat, o.lng] as [number, number]));
      b.extend(TORCHES);
      map.fitBounds(b, { padding: [40, 40], maxZoom: 13 });
      setTimeout(() => map && map.invalidateSize(), 120);
    })();

    return () => { cancelled = true; map?.remove(); };
  }, [origins]);

  return <div ref={el} className="tiq-map" style={{ height: 540, width: "100%", borderRadius: 12, overflow: "hidden", background: "#06070f" }} />;
}
