import { cn } from "@/lib/cn";

/**
 * TrafficIQ brand marks.
 *
 * The symbol is a "signal convergence" glyph: three routes enter from different
 * directions, converge at a hub node, and one confident vector exits toward a
 * bright destination — the visual thesis of the product (many signals → one
 * decision → growth). It intentionally avoids leaves, pins, targets and letters
 * so the brand can travel beyond cannabis (§02, §36).
 */

type MarkVariant = "color" | "mono" | "on-brand";

const HUB = { x: 17, y: 17 };
const OUT = { x: 26, y: 8 };
const INPUTS = [
  { x: 6, y: 7 },
  { x: 5.5, y: 20 },
  { x: 16, y: 27 },
];

/** The standalone convergence glyph (transparent background). */
export function LogoSymbol({
  size = 32,
  variant = "color",
  className,
  animate = false,
}: {
  size?: number;
  variant?: MarkVariant;
  className?: string;
  animate?: boolean;
}) {
  const route =
    variant === "on-brand"
      ? "rgb(255 255 255 / 0.55)"
      : variant === "mono"
        ? "currentColor"
        : "rgb(var(--brand-400))";
  const hub =
    variant === "on-brand"
      ? "#ffffff"
      : variant === "mono"
        ? "currentColor"
        : "rgb(var(--brand-600))";
  const dest =
    variant === "on-brand"
      ? "rgb(var(--signal))"
      : variant === "mono"
        ? "currentColor"
        : "rgb(var(--signal-strong))";
  const inputDot =
    variant === "mono" ? "currentColor" : variant === "on-brand" ? "rgb(255 255 255 / 0.7)" : "rgb(var(--brand-500))";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      {/* Routes converging into the hub */}
      {INPUTS.map((p, i) => (
        <line
          key={i}
          x1={p.x}
          y1={p.y}
          x2={HUB.x}
          y2={HUB.y}
          stroke={route}
          strokeWidth={2}
          strokeLinecap="round"
          className={animate ? "origin-center" : undefined}
        />
      ))}
      {/* The confident output vector toward growth */}
      <line
        x1={HUB.x}
        y1={HUB.y}
        x2={OUT.x}
        y2={OUT.y}
        stroke={dest}
        strokeWidth={2.4}
        strokeLinecap="round"
      />
      {/* Origin signal nodes */}
      {INPUTS.map((p, i) => (
        <circle key={`n${i}`} cx={p.x} cy={p.y} r={1.9} fill={inputDot} />
      ))}
      {/* Convergence hub */}
      <circle cx={HUB.x} cy={HUB.y} r={3.4} fill={hub} />
      {/* Bright destination node */}
      <circle cx={OUT.x} cy={OUT.y} r={2.6} fill={dest} />
      {animate && (
        <circle cx={OUT.x} cy={OUT.y} r={2.6} fill={dest} className="animate-pulse-ring" />
      )}
    </svg>
  );
}

/** Rounded-square brand tile — favicon, app icon, sidebar, social avatar. */
export function LogoTile({
  size = 36,
  className,
  rounded = "rounded-[28%]",
}: {
  size?: number;
  className?: string;
  rounded?: string;
}) {
  return (
    <span
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden",
        rounded,
        className
      )}
      style={{
        width: size,
        height: size,
        background:
          "linear-gradient(140deg, rgb(var(--brand-500)) 0%, rgb(var(--brand-700)) 100%)",
        boxShadow: "inset 0 1px 0 rgb(255 255 255 / 0.16)",
      }}
    >
      {/* Faint signal dot-grid inside the tile */}
      <span
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(rgb(255 255 255 / 0.14) 1px, transparent 1px)",
          backgroundSize: `${Math.max(6, size / 6)}px ${Math.max(6, size / 6)}px`,
        }}
      />
      <LogoSymbol size={size * 0.7} variant="on-brand" />
    </span>
  );
}

/** Wordmark — "Traffic" in ink, "IQ" carrying the intelligence accent. */
export function Wordmark({
  className,
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  return (
    <span
      className={cn(
        "font-semibold tracking-brand",
        onDark ? "text-white" : "text-ink",
        className
      )}
    >
      Traffic<span className="text-brand-600">IQ</span>
    </span>
  );
}

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  /** Show the mark tile alongside the wordmark. */
  tile?: boolean;
  onDark?: boolean;
  animate?: boolean;
}

const SIZES = {
  sm: { tile: 28, text: "text-[17px]" },
  md: { tile: 34, text: "text-xl" },
  lg: { tile: 44, text: "text-[26px]" },
} as const;

/** Horizontal lockup: convergence tile + wordmark. */
export function Logo({
  className,
  size = "md",
  tile = true,
  onDark = false,
  animate = false,
}: LogoProps) {
  const s = SIZES[size];
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      {tile ? (
        <LogoTile size={s.tile} />
      ) : (
        <LogoSymbol size={s.tile} animate={animate} />
      )}
      <Wordmark className={s.text} onDark={onDark} />
    </span>
  );
}
