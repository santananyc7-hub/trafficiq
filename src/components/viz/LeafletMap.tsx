"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  TRADE_AREAS,
  TORCHES_LOCATIONS,
  MAP_POINTS,
  type TradeArea,
} from "@/lib/demo";
import type { MapLayer } from "@/components/viz/TradeMap";

// Concrete hexes (Leaflet strokes/fills can't read CSS vars) — brand palette.
const C = {
  brand: "#4f46e5",
  money: "#10a360",
  opp: "#d9980f",
  neg: "#dc3737",
  signal: "#14b8a6",
};

function isDark() {
  return document.documentElement.classList.contains("dark");
}
function tileUrl(dark: boolean) {
  return dark
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
}

function heat(a: TradeArea, layer: MapLayer) {
  const radius = 130 + Math.sqrt(a.customers) * 7; // meters
  if (layer === "revenue")
    return { radius, color: C.money, fill: 0.12 + Math.min(1, (a.value30 * a.newPerMonth) / 130000) * 0.4 };
  if (layer === "customers")
    return { radius, color: C.brand, fill: 0.12 + Math.min(1, a.customers / 950) * 0.4 };
  // opportunities (default) + point layers keep a faint customer base
  const isOppLayer = layer === "opportunities";
  return {
    radius,
    color: isOppLayer ? C.opp : C.brand,
    fill: isOppLayer ? 0.12 + (a.oppScore / 100) * 0.42 : 0.08,
  };
}

export default function LeafletMap({
  layer,
  selected,
  onSelect,
}: {
  layer: MapLayer;
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  const elRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileRef = useRef<L.TileLayer | null>(null);
  const areaRef = useRef<L.LayerGroup | null>(null);
  const pointRef = useRef<L.LayerGroup | null>(null);

  // init once
  useEffect(() => {
    if (!elRef.current || mapRef.current) return;
    const map = L.map(elRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
      attributionControl: true,
    }).setView([40.7529, -73.9808], 14);
    mapRef.current = map;

    tileRef.current = L.tileLayer(tileUrl(isDark()), {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    // Torches flagship store
    const store = TORCHES_LOCATIONS.find((s) => s.flagship) ?? TORCHES_LOCATIONS[0]!;
    L.circleMarker([store.lat, store.lng], {
      radius: 8,
      color: "#ffffff",
      weight: 2,
      fillColor: C.brand,
      fillOpacity: 1,
    })
      .bindTooltip(`Torches NYC · ${store.address} (${store.zip})`, { direction: "top" })
      .addTo(map);

    areaRef.current = L.layerGroup().addTo(map);
    pointRef.current = L.layerGroup().addTo(map);

    // frame all trade areas + stores
    const pts: L.LatLngExpression[] = [
      ...TRADE_AREAS.map((a) => [a.lat, a.lng] as [number, number]),
      [store.lat, store.lng] as [number, number],
    ];
    map.fitBounds(L.latLngBounds(pts), { padding: [34, 34] });

    // swap tiles when the app theme toggles
    const obs = new MutationObserver(() => {
      tileRef.current?.setUrl(tileUrl(isDark()));
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const t = setTimeout(() => map.invalidateSize(), 60);

    return () => {
      clearTimeout(t);
      obs.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // redraw areas + point overlays on layer / selection change
  useEffect(() => {
    const ag = areaRef.current,
      pg = pointRef.current;
    if (!ag || !pg) return;
    ag.clearLayers();
    pg.clearLayers();

    TRADE_AREAS.forEach((a) => {
      const h = heat(a, layer);
      const sel = a.id === selected;
      L.circle([a.lat, a.lng], {
        radius: h.radius,
        color: h.color,
        weight: sel ? 3 : 1.5,
        opacity: sel ? 1 : 0.75,
        fillColor: h.color,
        fillOpacity: h.fill,
      })
        .on("click", () => onSelect(a.id))
        .bindTooltip(`${a.name} · ${a.zip}`, { direction: "top", sticky: true })
        .addTo(ag);
    });

    const pointKind =
      layer === "partners"
        ? "partner"
        : layer === "competitors"
          ? "competitor"
          : layer === "campaigns"
            ? "campaign"
            : null;
    if (pointKind) {
      const color = pointKind === "partner" ? C.money : pointKind === "competitor" ? C.neg : C.signal;
      MAP_POINTS.filter((p) => p.kind === pointKind).forEach((p) => {
        L.circleMarker([p.lat, p.lng], {
          radius: 6,
          color: "#ffffff",
          weight: 2,
          fillColor: color,
          fillOpacity: 1,
        })
          .bindTooltip(`${p.label}${p.detail ? " · " + p.detail : ""}`, { direction: "top" })
          .addTo(pg);
      });
    }
  }, [layer, selected, onSelect]);

  return <div ref={elRef} className="h-full w-full" />;
}
