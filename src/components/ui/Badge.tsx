import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { percent } from "@/lib/format";

type Tone =
  | "neutral"
  | "brand"
  | "money"
  | "opp"
  | "pos"
  | "neg"
  | "warn"
  | "signal";

const TONES: Record<Tone, string> = {
  neutral: "bg-surface-2 text-ink-muted border border-border",
  brand: "bg-brand-50 text-brand-700 border border-brand-200",
  money: "bg-money-soft text-money-strong border border-money/30",
  opp: "bg-opp-soft text-opp-strong border border-opp/30",
  pos: "text-pos",
  neg: "text-neg",
  warn: "bg-[rgb(var(--warn)/0.12)] text-warn border border-[rgb(var(--warn)/0.25)]",
  signal:
    "border border-[rgb(var(--signal)/0.35)] bg-[rgb(var(--signal)/0.12)] text-[rgb(var(--signal-strong))]",
};

export function Pill({
  children,
  tone = "neutral",
  className,
  dot = false,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
  dot?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold",
        TONES[tone],
        className
      )}
    >
      {dot && (
        <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      )}
      {children}
    </span>
  );
}

/** Directional change chip, e.g. ▲ +18.4%. */
export function Delta({
  value,
  suffix = "vs prev",
  className,
  invert = false,
}: {
  value: number;
  suffix?: string;
  className?: string;
  /** When true, a negative value is "good" (e.g. CAC going down). */
  invert?: boolean;
}) {
  const good = invert ? value < 0 : value > 0;
  const Icon = value >= 0 ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-[12.5px] font-semibold tabular",
        good ? "text-pos" : "text-neg",
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {percent(value)}
      {suffix && (
        <span className="font-normal text-ink-subtle">{suffix}</span>
      )}
    </span>
  );
}

const CONFIDENCE: Record<"High" | "Medium" | "Low", Tone> = {
  High: "money",
  Medium: "warn",
  Low: "neutral",
};

export function ConfidenceBadge({
  level,
  className,
}: {
  level: "High" | "Medium" | "Low";
  className?: string;
}) {
  return (
    <Pill tone={CONFIDENCE[level]} dot className={cn("uppercase tracking-wide", className)}>
      {level} confidence
    </Pill>
  );
}
