"use client";

import { useId } from "react";
import { MapPin, Building2, Flag, Route as RouteIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { MAP_POINTS, TRADE_AREAS, type TradeArea } from "@/lib/demo";

export type MapLayer =
  | "customers"
  | "revenue"
  | "opportunities"
  | "partners"
  | "competitors"
  | "campaigns";

/** Avenue / street guide lines for the stylized Midtown grid. */
const AVENUES = [16, 32, 48, 64, 80]; // vertical
const STREETS = [14, 28, 42, 56]; // horizontal

function heat(area: TradeArea, layer: MapLayer): { v: number; color: string } {
  if (layer === "opportunities") {
    return { v: area.oppScore / 100, color: "var(--opp)" };
  }
  if (layer === "revenue") {
    const v = Math.min(1, (area.value30 * area.newPerMonth) / 130000);
    return { v, color: "var(--money)" };
  }
  // customers (default) + point-layers still show a faint customer base
  const v = Math.min(1, area.customers / 950);
  return { v, color: "var(--brand-500)" };
}

export function TradeMap({
  layer = "customers",
  selected,
  onSelect,
  className,
  showPoints = true,
}: {
  layer?: MapLayer;
  selected?: string | null;
  onSelect?: (id: string) => void;
  className?: string;
  showPoints?: boolean;
}) {
  const gid = useId().replace(/:/g, "");
  const pointKind =
    layer === "partners"
      ? "partner"
      : layer === "competitors"
        ? "competitor"
        : layer === "campaigns"
          ? "campaign"
          : null;
  const points = showPoints
    ? MAP_POINTS.filter(
        (p) => p.kind === "store" || (pointKind && p.kind === pointKind)
      )
    : MAP_POINTS.filter((p) => p.kind === "store");

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-surface",
        className
      )}
    >
      {/* Coordinate grid backdrop */}
      <div className="grid-coords pointer-events-none absolute inset-0 opacity-60" />
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 40%, transparent 40%, rgb(var(--canvas)) 100%)",
        }}
      />

      <svg
        viewBox="0 0 100 68"
        className="relative block w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id={`glow-${gid}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Stylized avenues / streets */}
        {AVENUES.map((x) => (
          <line
            key={`av-${x}`}
            x1={x}
            y1={4}
            x2={x}
            y2={64}
            stroke="rgb(var(--border-strong))"
            strokeOpacity={0.5}
            strokeWidth={0.3}
          />
        ))}
        {STREETS.map((y) => (
          <line
            key={`st-${y}`}
            x1={6}
            y1={y}
            x2={94}
            y2={y}
            stroke="rgb(var(--border-strong))"
            strokeOpacity={0.5}
            strokeWidth={0.3}
          />
        ))}
        {/* A diagonal "Broadway" cut for character */}
        <line
          x1={30}
          y1={4}
          x2={62}
          y2={64}
          stroke="rgb(var(--border-strong))"
          strokeOpacity={0.6}
          strokeWidth={0.4}
        />

        {/* Trade-area heat blobs */}
        {TRADE_AREAS.map((a) => {
          const { v, color } = heat(a, layer);
          const r = 4.5 + Math.sqrt(a.customers) / 6; // ~7.5–12
          const isSel = selected === a.id;
          const isOpp = layer === "opportunities" && a.oppScore >= 80;
          return (
            <g
              key={a.id}
              onClick={onSelect ? () => onSelect(a.id) : undefined}
              className={cn(onSelect && "cursor-pointer")}
            >
              <circle
                cx={a.x}
                cy={a.y * 0.68}
                r={r}
                fill={`rgb(${color})`}
                fillOpacity={0.1 + v * 0.5}
                stroke={`rgb(${color})`}
                strokeOpacity={isSel ? 0.95 : 0.35 + v * 0.4}
                strokeWidth={isSel ? 0.7 : 0.4}
              />
              {isOpp && (
                <circle
                  cx={a.x}
                  cy={a.y * 0.68}
                  r={r}
                  fill="none"
                  stroke="rgb(var(--opp))"
                  strokeWidth={0.5}
                >
                  <animate
                    attributeName="r"
                    values={`${r};${r + 4};${r}`}
                    dur="3s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="stroke-opacity"
                    values="0.8;0;0.8"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}
              <circle cx={a.x} cy={a.y * 0.68} r={0.7} fill={`rgb(${color})`} />
            </g>
          );
        })}

        {/* Points overlay (store / partners / competitors / campaigns) */}
        {points.map((p) => {
          const isStore = p.kind === "store";
          const c =
            p.kind === "store"
              ? "var(--brand-600)"
              : p.kind === "partner"
                ? "var(--money)"
                : p.kind === "competitor"
                  ? "var(--neg)"
                  : "var(--signal-strong)";
          return (
            <g key={p.id} filter={isStore ? `url(#glow-${gid})` : undefined}>
              {isStore && (
                <circle cx={p.x} cy={p.y * 0.68} r={2.4} fill="none" stroke="rgb(var(--signal))" strokeWidth={0.4}>
                  <animate attributeName="r" values="2.4;5;2.4" dur="2.8s" repeatCount="indefinite" />
                  <animate attributeName="stroke-opacity" values="0.8;0;0.8" dur="2.8s" repeatCount="indefinite" />
                </circle>
              )}
              <circle
                cx={p.x}
                cy={p.y * 0.68}
                r={isStore ? 1.7 : 1.2}
                fill={`rgb(${c})`}
                stroke="rgb(var(--surface))"
                strokeWidth={0.35}
              />
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="pointer-events-none absolute bottom-3 left-3 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-border bg-surface/85 px-2.5 py-1.5 text-[10.5px] font-medium text-ink-muted backdrop-blur">
        <LegendDot icon={MapPin} tone="var(--brand-600)" label="Your store" />
        {pointKind === "partner" && <LegendDot icon={Flag} tone="var(--money)" label="Partners" />}
        {pointKind === "competitor" && <LegendDot icon={Building2} tone="var(--neg)" label="Competitors" />}
        {pointKind === "campaign" && <LegendDot icon={RouteIcon} tone="var(--signal-strong)" label="Campaigns" />}
        {layer === "opportunities" && <LegendDot icon={MapPin} tone="var(--opp)" label="Opportunity zone" />}
      </div>
    </div>
  );
}

function LegendDot({
  icon: Icon,
  tone,
  label,
}: {
  icon: typeof MapPin;
  tone: string;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1">
      <Icon className="h-3 w-3" style={{ color: `rgb(${tone})` }} />
      {label}
    </span>
  );
}
