import { cn } from "@/lib/cn";

/** Compact circular gauge for an Opportunity Score (0–100). */
export function ScoreDial({
  value,
  size = 56,
  stroke = 5,
  tone = "opp",
  className,
}: {
  value: number;
  size?: number;
  stroke?: number;
  tone?: "opp" | "brand" | "money";
  className?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value)) / 100;
  const color =
    tone === "brand" ? "var(--brand-500)" : tone === "money" ? "var(--money)" : "var(--opp)";

  return (
    <div
      className={cn("relative shrink-0", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgb(var(--border-strong))"
          strokeOpacity={0.5}
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`rgb(${color})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="tabular font-bold tracking-tight"
          style={{ fontSize: size * 0.3, color: `rgb(${color})` }}
        >
          {Math.round(value)}
        </span>
      </div>
    </div>
  );
}
