"use client";

import { useState } from "react";
import { Pill, ConfidenceBadge } from "@/components/ui/Badge";
import { JourneyFlow, type JourneyStep } from "@/components/viz/JourneyFlow";
import { ATTR_MODELS, ATTR_SOURCES, JOURNEYS, KPIS, type AttrModel } from "@/lib/demo";
import { money, pct } from "@/lib/format";
import { cn } from "@/lib/cn";

// Plain-English read of each attribution model.
const MODEL_NOTE: Record<AttrModel, string> = {
  "First Touch": "Credits the channel that first found each customer — the top of the funnel.",
  "Last Touch": "Credits the channel that closed each customer — the final touch before purchase.",
  Linear: "Splits credit evenly across every touch on the path to purchase.",
  TrafficIQ: "Blended credit, weighted by each touch's real, measured influence on the purchase.",
};

const NEW_CUSTOMERS = KPIS.newCustomers; // 427

/** Map a journey's raw step labels to JourneyFlow steps: first = brand, last = money. */
function toSteps(labels: string[]): JourneyStep[] {
  const last = labels.length - 1;
  return labels.map((label, i) => ({
    label,
    tone: i === 0 ? "brand" : i === last ? "money" : "neutral",
  }));
}

export function AttributionView() {
  const [model, setModel] = useState<AttrModel>("TrafficIQ");

  const rows = [...ATTR_SOURCES].sort((a, b) => b.credit[model] - a.credit[model]);
  const top = rows[0]!.credit[model];

  return (
    <div className="space-y-6">
      {/* Model selector */}
      <div className="rounded-xl border border-border bg-surface p-4 shadow-card sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-subtle">
              Model
            </span>
            <div className="flex gap-0.5 rounded-lg border border-border bg-surface-2 p-0.5">
              {ATTR_MODELS.map((m) => (
                <button
                  key={m}
                  onClick={() => setModel(m)}
                  aria-pressed={model === m}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-[12.5px] font-medium transition-colors",
                    model === m ? "bg-surface text-ink shadow-sm" : "text-ink-subtle hover:text-ink"
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          {model === "TrafficIQ" && <Pill tone="brand">Recommended</Pill>}
        </div>
        <p className="mt-3 text-[13.5px] leading-relaxed text-ink-muted">{MODEL_NOTE[model]}</p>
      </div>

      {/* Credit chart — the centerpiece */}
      <div className="rounded-xl border border-border bg-surface shadow-card">
        <header className="border-b border-border p-5">
          <h2 className="text-lg font-semibold tracking-tight text-ink">
            Where your customers actually come from
          </h2>
          <p className="mt-0.5 text-[13.5px] text-ink-muted">
            Credited new customers · {model}
          </p>
        </header>

        <div className="space-y-1.5 p-3 sm:p-4">
          {rows.map((row) => {
            const v = row.credit[model];
            const approx = Math.round((v / 100) * NEW_CUSTOMERS);
            return (
              <div
                key={row.source}
                className="flex items-center gap-3 rounded-lg px-2 py-1.5 sm:gap-4"
              >
                <span className="w-28 shrink-0 truncate text-[13px] font-medium text-ink sm:w-44">
                  {row.source}
                </span>
                <div className="h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-surface-2">
                  <div
                    className="h-full rounded-full bg-brand-500 transition-all duration-500"
                    style={{ width: `${Math.max((v / top) * 100, 3)}%` }}
                  />
                </div>
                <div className="flex shrink-0 items-baseline justify-end gap-1.5 tabular">
                  <span className="w-11 text-right text-[13px] font-semibold text-ink">
                    {pct(v, 0)}
                  </span>
                  <span className="w-12 text-right text-[11.5px] text-ink-subtle">
                    ~{approx}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <footer className="border-t border-border px-5 py-3">
          <p className="text-[12.5px] text-ink-subtle">
            Bar length is the share of credited new customers · approximate count of{" "}
            {NEW_CUSTOMERS} this period
          </p>
        </footer>
      </div>

      {/* Customer journeys */}
      <div className="rounded-xl border border-border bg-surface shadow-card">
        <header className="border-b border-border p-5">
          <h2 className="text-lg font-semibold tracking-tight text-ink">Customer journeys</h2>
          <p className="mt-0.5 text-[13.5px] text-ink-muted">
            TrafficIQ labels every path by confidence — it never presents an uncertain
            attribution as certain.
          </p>
        </header>

        <div className="divide-y divide-border">
          {JOURNEYS.map((j) => (
            <div
              key={j.id}
              className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between"
            >
              <div className="min-w-0">
                <JourneyFlow steps={toSteps(j.steps)} />
              </div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 lg:shrink-0 lg:justify-end">
                <div className="min-w-0">
                  <p className="tabular text-[15px] font-semibold text-ink">{j.customers}</p>
                  <p className="text-[11.5px] text-ink-subtle">customers</p>
                </div>
                <div className="min-w-0">
                  <p className="tabular text-[15px] font-semibold text-money-strong">
                    {money(j.avgFirst)}
                  </p>
                  <p className="text-[11.5px] text-ink-subtle">avg first</p>
                </div>
                <ConfidenceBadge level={j.confidence} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
