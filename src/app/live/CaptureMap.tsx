"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

/* Customer-acquisition flow map. Dense glowing PARTICLES stream along arcs from
   every home ZIP into Torches; a bright diamond EMITTER marks where each trail
   originates; the biggest origins carry a data chip (ZIP · customers). Color
   cyan → violet → magenta scales with volume. Canvas runs the particle system
   with additive glow; no circle markers anywhere. */

export interface MapRow { zip: string; name: string; lat: number; lng: number; status: string; activeY: number; annual: number; }
export interface Origin { zip: string; lat: number; lng: number; name: string; customers: number; active: number; }

const TORCHES: [number, number] = [40.7527, -73.979];
const COMPETITORS = [
  [40.7544, -73.9868], [40.7607, -73.9837], [40.7589, -73.9899], [40.749, -73.9888], [40.74, -73.9905],
] as [number, number][];

function ramp(t: number): [number, number, number] {
  const mix = (a: number[], b: number[], u: number) => a.map((x, i) => Math.round(x + ((b[i] ?? x) - x) * u));
  const cyan = [34, 211, 238], violet = [139, 92, 246], mag = [232, 121, 249];
  const c = t < 0.5 ? mix(cyan, violet, t * 2) : mix(violet, mag, (t - 0.5) * 2);
  return [c[0] ?? 0, c[1] ?? 0, c[2] ?? 0];
}

function arc(a: [number, number], b: [number, number], bend: number): [number, number][] {
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const cx = mx - dy * bend, cy = my + dx * bend;
  const pts: [number, number][] = [];
  for (let i = 0; i <= 20; i++) {
    const t = i / 20, u = 1 - t;
    pts.push([u * u * a[0] + 2 * u * t * cx + t * t * b[0], u * u * a[1] + 2 * u * t * cy + t * t * b[1]]);
  }
  return pts;
}

interface Flow { arc: [number, number][]; rgb: [number, number, number]; }
interface Particle { f: number; p: number; speed: number; r: number; }
interface Emitter { ll: [number, number]; rgb: [number, number, number]; big: boolean; }

export default function CaptureMap({ origins }: { rows: MapRow[]; origins: Origin[] }) {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!el.current) return;
    let map: import("leaflet").Map | undefined;
    let raf = 0;
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !el.current) return;
      const host = el.current;

      map = L.map(host, { zoomControl: true, scrollWheelZoom: false }).setView(TORCHES, 12);
      L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}", { maxZoom: 16, attribution: "Tiles &copy; Esri" }).addTo(map);
      L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}", { maxZoom: 16, opacity: 0.4 }).addTo(map);

      const sorted = [...origins].sort((a, b) => b.customers - a.customers);
      const maxC = Math.max(1, ...sorted.map((o) => o.customers));
      const flows: Flow[] = [];
      const particles: Particle[] = [];
      const emitters: Emitter[] = [];

      sorted.slice(0, 110).forEach((o, i) => {
        const t = o.customers / maxC;
        const bend = (i % 2 ? 1 : -1) * (0.1 + 0.12 * (1 - t));
        const a = arc([o.lat, o.lng], TORCHES, bend);
        const rgb = ramp(t);
        const fi = flows.push({ arc: a, rgb }) - 1;
        // faint rail so a trail's path reads even between particles
        L.polyline(a, { color: `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`, weight: 0.5 + t * 1.1, opacity: 0.08 + t * 0.14, lineCap: "round", interactive: false }).addTo(map!);
        // dense particle stream — count scales hard with volume
        const n = 3 + Math.round(t * 18);
        for (let k = 0; k < n; k++) particles.push({ f: fi, p: k / n + Math.random() * 0.03, speed: 0.11 + t * 0.15, r: 0.9 + t * 2.2 });
        if (i < 46) emitters.push({ ll: [o.lat, o.lng], rgb, big: i < 16 });
      });

      // Data chips on the biggest origins (ZIP · customers) — no circles.
      sorted.slice(0, 16).forEach((o) => {
        L.tooltip({ permanent: true, direction: "top", offset: [0, -4], className: "tiq-chip" }).setLatLng([o.lat, o.lng]).setContent(`${o.zip}<b>${o.customers.toLocaleString()}</b>`).addTo(map!);
      });
      for (const c of COMPETITORS) L.marker(c, { icon: L.divIcon({ className: "", html: `<div class="tiq-x">✕</div>`, iconSize: [14, 14], iconAnchor: [7, 7] }) }).addTo(map!);
      L.marker(TORCHES, { icon: L.divIcon({ className: "", html: `<div class="tiq-node tiq-node-lg"><i></i><i></i><b>Torches</b></div>`, iconSize: [0, 0] }), zIndexOffset: 1000 }).addTo(map!);

      const b = L.latLngBounds(sorted.slice(0, 26).map((o) => [o.lat, o.lng] as [number, number]));
      b.extend(TORCHES);
      map.fitBounds(b, { paddingTopLeft: [40, 55], paddingBottomRight: [40, 90], maxZoom: 13 });

      // Particle canvas overlay (transparent; tiles/chips/markers show through).
      const cv = document.createElement("canvas");
      cv.style.cssText = "position:absolute;inset:0;pointer-events:none;z-index:450;";
      host.appendChild(cv);
      const ctx = cv.getContext("2d")!;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const resize = () => { const s = map!.getSize(); cv.width = s.x * dpr; cv.height = s.y * dpr; cv.style.width = s.x + "px"; cv.style.height = s.y + "px"; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
      resize();
      map.on("resize", resize);
      setTimeout(() => { map && map.invalidateSize(); resize(); }, 140);

      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      let last = performance.now();
      const draw = (now: number) => {
        const dt = Math.min(0.05, (now - last) / 1000); last = now;
        const s = map!.getSize();
        ctx.clearRect(0, 0, s.x, s.y);
        ctx.globalCompositeOperation = "lighter";

        // Origin emitters — bright pulsing diamonds marking where trails start.
        for (const e of emitters) {
          const cp = map!.latLngToContainerPoint(e.ll);
          const [r, g, bl] = e.rgb;
          const sz = e.big ? 4.5 : 2.8;
          const pulse = 0.55 + 0.45 * Math.sin(now / 520 + cp.x * 0.05);
          const grd = ctx.createRadialGradient(cp.x, cp.y, 0, cp.x, cp.y, sz * 4);
          grd.addColorStop(0, `rgba(${r},${g},${bl},${0.6 * pulse})`);
          grd.addColorStop(1, `rgba(${r},${g},${bl},0)`);
          ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(cp.x, cp.y, sz * 4, 0, 6.283); ctx.fill();
          ctx.save(); ctx.translate(cp.x, cp.y); ctx.rotate(Math.PI / 4);
          ctx.fillStyle = `rgba(255,255,255,${0.85})`; ctx.fillRect(-sz / 2, -sz / 2, sz, sz);
          ctx.restore();
        }

        // Particles streaming toward Torches.
        for (const pt of particles) {
          if (!reduce) { pt.p += pt.speed * dt; if (pt.p >= 1) pt.p -= 1; }
          const a = flows[pt.f]!.arc; const seg = pt.p * (a.length - 1);
          const i = Math.min(a.length - 2, Math.floor(seg)); const f = seg - i;
          const p0 = a[i]!, p1 = a[i + 1]!;
          const cp = map!.latLngToContainerPoint([p0[0] + (p1[0] - p0[0]) * f, p0[1] + (p1[1] - p0[1]) * f]);
          const [r, g, bl] = flows[pt.f]!.rgb;
          const fade = 0.3 + 0.7 * Math.sin(Math.PI * pt.p);
          const rad = pt.r * 4.5;
          const grd = ctx.createRadialGradient(cp.x, cp.y, 0, cp.x, cp.y, rad);
          grd.addColorStop(0, `rgba(${r},${g},${bl},${0.9 * fade})`);
          grd.addColorStop(1, `rgba(${r},${g},${bl},0)`);
          ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(cp.x, cp.y, rad, 0, 6.283); ctx.fill();
          ctx.fillStyle = `rgba(255,255,255,${0.75 * fade})`; ctx.beginPath(); ctx.arc(cp.x, cp.y, pt.r * 0.65, 0, 6.283); ctx.fill();
        }

        ctx.globalCompositeOperation = "source-over";
        raf = requestAnimationFrame(draw);
      };
      raf = requestAnimationFrame(draw);
    })();

    return () => { cancelled = true; cancelAnimationFrame(raf); map?.remove(); };
  }, [origins]);

  return <div ref={el} className="tiq-map" style={{ height: 560, width: "100%", borderRadius: 12, overflow: "hidden", background: "#06070f", position: "relative" }} />;
}
