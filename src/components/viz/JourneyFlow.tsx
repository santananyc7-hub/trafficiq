import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

export interface JourneyStep {
  label: string;
  sub?: string;
  tone?: "neutral" | "money" | "money-strong" | "brand";
}

/** Horizontal customer-journey flow (attribution path). Wraps on small screens. */
export function JourneyFlow({
  steps,
  className,
}: {
  steps: JourneyStep[];
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-stretch gap-2", className)}>
      {steps.map((s, i) => (
        <div key={i} className="flex items-stretch gap-2">
          <div
            className={cn(
              "flex flex-col justify-center rounded-xl border px-3 py-2",
              s.tone === "money" || s.tone === "money-strong"
                ? "border-money/30 bg-money-soft"
                : s.tone === "brand"
                  ? "border-brand-200 bg-brand-50"
                  : "border-border bg-surface"
            )}
          >
            <span
              className={cn(
                "text-[13px] font-semibold leading-tight",
                s.tone === "money" || s.tone === "money-strong"
                  ? "text-money-strong"
                  : s.tone === "brand"
                    ? "text-brand-700"
                    : "text-ink"
              )}
            >
              {s.label}
            </span>
            {s.sub && (
              <span className="text-[11px] text-ink-subtle">{s.sub}</span>
            )}
          </div>
          {i < steps.length - 1 && (
            <ChevronRight className="my-auto h-4 w-4 shrink-0 text-ink-subtle" />
          )}
        </div>
      ))}
    </div>
  );
}
