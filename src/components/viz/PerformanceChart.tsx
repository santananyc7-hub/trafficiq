"use client";

import { useState } from "react";
import { money, number } from "@/lib/format";
import type { SeriesPoint } from "@/lib/demo";

const W = 1000;
const H = 300;
const PAD = { l: 10, r: 10, t: 16, b: 30 };

/**
 * Acquisition performance chart — new customers (area) + first-purchase revenue
 * (secondary line), dual-scaled. Dependency-free SVG with hover crosshair and a
 * scale-independent HTML tooltip. Respects reduced motion via CSS.
 */
export function PerformanceChart({ data }: { data: SeriesPoint[] }) {
  const [active, setActive] = useState<number | null>(null);
  const n = data.length;

  const custMax = Math.max(...data.map((d) => d.customers)) * 1.12;
  const revMax = Math.max(...data.map((d) => d.revenue)) * 1.12;

  const plotW = W - PAD.l - PAD.r;
  const plotH = H - PAD.t - PAD.b;
  const x = (i: number) => PAD.l + (plotW * i) / Math.max(1, n - 1);
  const yc = (v: number) => PAD.t + plotH * (1 - v / custMax);
  const yr = (v: number) => PAD.t + plotH * (1 - v / revMax);

  const custLine = data.map((d, i) => `${x(i)},${yc(d.customers)}`).join(" ");
  const custArea = `${PAD.l},${PAD.t + plotH} ${custLine} ${PAD.l + plotW},${PAD.t + plotH}`;
  const revLine = data.map((d, i) => `${x(i)},${yr(d.revenue)}`).join(" ");

  // sparse x labels (~6)
  const step = Math.max(1, Math.round(n / 6));
  const ticks = data.map((d, i) => ({ d, i })).filter(({ i }) => i % step === 0 || i === n - 1);
  const activePt = active !== null ? data[active] : null;

  return (
    <div className="relative">
      <div className="relative" style={{ height: 260 }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-full w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="pc-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(var(--brand-500))" stopOpacity="0.28" />
            <stop offset="100%" stopColor="rgb(var(--brand-500))" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* horizontal gridlines */}
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <line
            key={f}
            x1={PAD.l}
            x2={PAD.l + plotW}
            y1={PAD.t + plotH * f}
            y2={PAD.t + plotH * f}
            stroke="rgb(var(--border))"
            strokeWidth={1}
            strokeDasharray="2 6"
          />
        ))}

        {/* revenue line (secondary) */}
        <polyline
          points={revLine}
          fill="none"
          stroke="rgb(var(--money))"
          strokeWidth={2}
          strokeOpacity={0.7}
          strokeDasharray="5 4"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />

        {/* customers area + line */}
        <polygon points={custArea} fill="url(#pc-fill)" />
        <polyline
          points={custLine}
          fill="none"
          stroke="rgb(var(--brand-500))"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />

        {/* crosshair (dots rendered as HTML overlay so they stay circular) */}
        {active !== null && (
          <line
            x1={x(active)}
            x2={x(active)}
            y1={PAD.t}
            y2={PAD.t + plotH}
            stroke="rgb(var(--ink-subtle))"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
        )}

        {/* invisible hit areas */}
        {data.map((_, i) => (
          <rect
            key={i}
            x={x(i) - plotW / (n - 1) / 2}
            y={0}
            width={plotW / (n - 1)}
            height={H}
            fill="transparent"
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
          />
        ))}
      </svg>

      {/* active dots — circular HTML overlay (immune to the stretched viewBox) */}
      {active !== null && (
        <>
          <Dot
            leftPct={(x(active) / W) * 100}
            topPct={(yc(data[active]!.customers) / H) * 100}
            color="rgb(var(--brand-600))"
          />
          <Dot
            leftPct={(x(active) / W) * 100}
            topPct={(yr(data[active]!.revenue) / H) * 100}
            color="rgb(var(--money))"
          />
        </>
      )}
      </div>

      {/* x-axis labels */}
      <div className="relative mt-1 h-4">
        {ticks.map(({ d, i }) => (
          <span
            key={i}
            className="absolute -translate-x-1/2 text-[10.5px] text-ink-subtle"
            style={{ left: `${(i / Math.max(1, n - 1)) * 100}%` }}
          >
            {d.label}
          </span>
        ))}
      </div>

      {/* tooltip */}
      {activePt && (
        <div
          className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 rounded-lg border border-border bg-overlay px-3 py-2 shadow-elevated"
          style={{
            left: `${Math.min(88, Math.max(12, (active! / Math.max(1, n - 1)) * 100))}%`,
          }}
        >
          <p className="text-[11px] font-medium text-ink-subtle">{activePt.label}</p>
          <p className="tabular mt-0.5 text-[13px] font-semibold text-ink">
            <span className="mr-1 inline-block h-2 w-2 rounded-full bg-brand-500 align-middle" />
            {number(activePt.customers)} customers
          </p>
          <p className="tabular text-[13px] font-semibold text-money-strong">
            <span className="mr-1 inline-block h-2 w-2 rounded-full bg-money align-middle" />
            {money(activePt.revenue)}
          </p>
        </div>
      )}
    </div>
  );
}

function Dot({
  leftPct,
  topPct,
  color,
}: {
  leftPct: number;
  topPct: number;
  color: string;
}) {
  return (
    <span
      className="pointer-events-none absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
      style={{
        left: `${leftPct}%`,
        top: `${topPct}%`,
        background: color,
        borderColor: "rgb(var(--surface))",
      }}
    />
  );
}
