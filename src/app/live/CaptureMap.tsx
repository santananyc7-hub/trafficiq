"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

/* Enhanced capture map: dark CARTO tiles, a customer-origin heatmap, opportunity
   circles, a pulsing convergence node for the flagship, and animated "signals
   converging" lines (the brand thesis). Leaflet is imported inside the effect so
   nothing touches `window` during SSR. */

export interface MapRow {
  zip: string; name: string; lat: number; lng: number; status: string; activeY: number; annual: number;
}
export interface Origin { zip: string; lat: number; lng: number; name: string; customers: number; active: number; }

const TORCHES = { lat: 40.7527, lng: -73.979 };
const COMPETITORS = [
  { lat: 40.7544, lng: -73.9868 }, { lat: 40.7607, lng: -73.9837 }, { lat: 40.7589, lng: -73.9899 },
  { lat: 40.749, lng: -73.9888 }, { lat: 40.74, lng: -73.9905 },
];

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

      map = L.map(el.current, { zoomControl: true, scrollWheelZoom: false })
        .setView([40.758, -73.968], 12);
      const esri = "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}";
      const esriRef = "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}";
      L.tileLayer(esri, { maxZoom: 16, attribution: "Tiles &copy; Esri" }).addTo(map);
      L.tileLayer(esriRef, { maxZoom: 16, opacity: 0.55 }).addTo(map);

      // Customer-origin heatmap — where customers actually come from.
      const maxC = Math.max(1, ...origins.map((o) => o.customers));
      const pts = origins.map((o) => [o.lat, o.lng, Math.min(1, o.customers / maxC)] as [number, number, number]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (L as any).heatLayer(pts, {
        radius: 26, blur: 20, maxZoom: 13, minOpacity: 0.25,
        gradient: { 0.2: "#1d4ed8", 0.45: "#2dd4bf", 0.7: "#a78bfa", 1.0: "#f0abfc" },
      }).addTo(map);

      // Opportunity circles for the catchment (blue = our turf, orange = competitor-held).
      const maxA = Math.max(1, ...rows.map((r) => r.annual));
      for (const r of rows) {
        const col = r.status === "our turf" ? "#3b82f6" : "#f97316";
        L.circle([r.lat, r.lng], { radius: 150 + Math.sqrt(r.annual / maxA) * 650, color: col, weight: 1, fillColor: col, fillOpacity: 0.08 })
          .bindTooltip(`<b>${r.name}</b> · ${r.zip}<br/>${r.activeY} active · $${Math.round(r.annual / 1000)}k/yr`, { className: "tiq-tip" })
          .addTo(map!);
      }

      // Animated "signals converging" — top origins flow toward the flagship.
      const top = [...origins].sort((a, b) => b.customers - a.customers).slice(0, 10);
      for (const o of top) {
        L.polyline([[o.lat, o.lng], [TORCHES.lat, TORCHES.lng]], {
          color: "#2dd4bf", weight: 1, opacity: 0.5, className: "tiq-signal",
        }).addTo(map!);
      }

      // Competitor marks.
      for (const c of COMPETITORS) {
        L.marker([c.lat, c.lng], {
          icon: L.divIcon({ className: "", html: `<div class="tiq-x">✕</div>`, iconSize: [16, 16], iconAnchor: [8, 8] }),
        }).addTo(map!);
      }

      // Flagship convergence node — pulsing.
      L.marker([TORCHES.lat, TORCHES.lng], {
        icon: L.divIcon({ className: "", html: `<div class="tiq-node"><span></span><span></span>Torches</div>`, iconSize: [0, 0] }),
        zIndexOffset: 1000,
      }).addTo(map!);

      setTimeout(() => map && map.invalidateSize(), 120);
    })();

    return () => { cancelled = true; map?.remove(); };
  }, [rows, origins]);

  return <div ref={el} className="tiq-map" style={{ height: 480, width: "100%", borderRadius: 12, overflow: "hidden", background: "#0a0e18" }} />;
}
