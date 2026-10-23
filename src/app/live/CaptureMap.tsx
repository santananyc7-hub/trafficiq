"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

/* Precise customer-origin map: every top ZIP is a density-colored node sized by
   customer count (cyan → violet → magenta), the biggest are labeled, and
   animated "flow" lines stream from the densest origins into the flagship —
   so you can pinpoint exactly where customers come from. A faint heat underlay
   gives ambient context; faint rings mark opportunity. */

export interface MapRow {
  zip: string; name: string; lat: number; lng: number; status: string; activeY: number; annual: number;
}
export interface Origin { zip: string; lat: number; lng: number; name: string; customers: number; active: number; }

const TORCHES = { lat: 40.7527, lng: -73.979 };
const COMPETITORS = [
  { lat: 40.7544, lng: -73.9868 }, { lat: 40.7607, lng: -73.9837 }, { lat: 40.7589, lng: -73.9899 },
  { lat: 40.749, lng: -73.9888 }, { lat: 40.74, lng: -73.9905 },
];

function ramp(t: number): string {
  const mix = (a: number[], b: number[], u: number) => a.map((x, i) => Math.round(x + ((b[i] ?? x) - x) * u));
  const cyan = [34, 211, 238], violet = [139, 92, 246], mag = [232, 121, 249];
  const c = t < 0.5 ? mix(cyan, violet, t * 2) : mix(violet, mag, (t - 0.5) * 2);
  return `rgb(${c[0] ?? 0},${c[1] ?? 0},${c[2] ?? 0})`;
}

export default function CaptureMap({ rows, origins }: { rows: MapRow[]; origins: Origin[] }) {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!el.current) return;
    let map: import("leaflet").Map | undefined;
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet.heat");
      if (cancelled || !el.current) return;

      map = L.map(el.current, { zoomControl: true, scrollWheelZoom: false }).setView([40.74, -73.95], 11);
      L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}", { maxZoom: 16, attribution: "Tiles &copy; Esri" }).addTo(map);
      L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}", { maxZoom: 16, opacity: 0.5 }).addTo(map);

      const sorted = [...origins].sort((a, b) => b.customers - a.customers);
      const maxC = Math.max(1, ...sorted.map((o) => o.customers));

      // Faint ambient heat underlay (not the primary layer).
      const pts = sorted.map((o) => [o.lat, o.lng, Math.min(1, o.customers / maxC)] as [number, number, number]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (L as any).heatLayer(pts, { radius: 16, blur: 22, maxZoom: 13, minOpacity: 0.12, max: 1.0,
        gradient: { 0.3: "#164e63", 0.6: "#4c1d95", 1.0: "#701a75" } }).addTo(map);

      // Faint opportunity rings (context, not clutter).
      const maxA = Math.max(1, ...rows.map((r) => r.annual));
      for (const r of rows) {
        const col = r.status === "our turf" ? "#38bdf8" : "#fb923c";
        L.circle([r.lat, r.lng], { radius: 150 + Math.sqrt(r.annual / maxA) * 520, color: col, weight: 0.8, opacity: 0.35, fill: false, dashArray: "3 5" }).addTo(map!);
      }

      // Flow lines — densest origins stream into the flagship.
      sorted.slice(0, 22).forEach((o) => {
        const t = o.customers / maxC;
        L.polyline([[o.lat, o.lng], [TORCHES.lat, TORCHES.lng]], {
          color: ramp(t), weight: 0.6 + t * 1.8, opacity: 0.22 + t * 0.4, className: "tiq-signal",
        }).addTo(map!);
      });

      // Precise origin nodes — one per ZIP, sized by customers, density-colored.
      sorted.slice(0, 120).forEach((o, i) => {
        const t = o.customers / maxC;
        const m = L.circleMarker([o.lat, o.lng], {
          radius: 3 + Math.sqrt(t) * 12, color: "#ffffff", weight: 0.4, opacity: 0.5,
          fillColor: ramp(t), fillOpacity: 0.82,
        }).bindTooltip(`<b>${o.zip}</b> · ${o.name}<br/>${o.customers.toLocaleString()} customers`, { className: "tiq-tip", direction: "top" }).addTo(map!);
        if (i < 8) m.bindTooltip(`${o.zip} · ${o.customers}`, { permanent: true, direction: "top", className: "tiq-tip tiq-lab", offset: [0, -4] });
      });

      // Competitor marks.
      for (const c of COMPETITORS) {
        L.marker([c.lat, c.lng], { icon: L.divIcon({ className: "", html: `<div class="tiq-x">✕</div>`, iconSize: [16, 16], iconAnchor: [8, 8] }) }).addTo(map!);
      }

      // Flagship convergence node.
      L.marker([TORCHES.lat, TORCHES.lng], {
        icon: L.divIcon({ className: "", html: `<div class="tiq-node"><i></i><i></i><b>Torches</b></div>`, iconSize: [0, 0] }), zIndexOffset: 1000,
      }).addTo(map!);

      // Frame the customer spread.
      const b = L.latLngBounds(sorted.slice(0, 90).map((o) => [o.lat, o.lng] as [number, number]));
      b.extend([TORCHES.lat, TORCHES.lng]);
      map.fitBounds(b, { padding: [30, 30] });
      setTimeout(() => map && map.invalidateSize(), 120);
    })();

    return () => { cancelled = true; map?.remove(); };
  }, [rows, origins]);

  return <div ref={el} className="tiq-map" style={{ height: 520, width: "100%", borderRadius: 12, overflow: "hidden", background: "#06070f" }} />;
}
