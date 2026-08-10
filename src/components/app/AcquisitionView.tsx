"use client";

import { useState } from "react";
import { Delta } from "@/components/ui/Badge";
import { ACQ_HERO, ACQ_FUNNEL } from "@/lib/demo";
import { money, number, pct } from "@/lib/format";
import { cn } from "@/lib/cn";

interface Hero {
  label: string;
  value: string;
  delta: number;
  invert?: boolean;
  tone?: "money" | "ink";
  primary?: boolean;
}

const HERO: Hero[] = [
  { label: "New Customers", value: number(ACQ_HERO.newCustomers), delta: 18.4, primary: true },
  { label: "First-Purchase Revenue", value: money(ACQ_HERO.firstRevenue), delta: 15.2, tone: "money" },
  { label: "Blended CAC", value: money(ACQ_HERO.cac, { cents: true }), delta: -6.1, invert: true },
  { label: "LTV : CAC", value: `${ACQ_HERO.ltvCac.toFixed(1)}×`, delta: 4.0 },
];

// Calm indigo taper — light at the top of the funnel, deeper toward purchase.
const FILL = [
  "bg-brand-300",
  "bg-brand-400",
  "bg-brand-500",
  "bg-brand-500",
  "bg-brand-600",
  "bg-brand-700",
];

// Descriptor for the step-conversion "read" line, per stage.
const STEP_WORD = ["", "click-through", "menu-open", "store-visit", "close", "repeat"];

interface Step {
  label: string;
  value: number;
  hint: string;
  i: number;
  /** Conversion in from the previous stage, in percent. Null for the first stage. */
  stepRate: number | null;
  /** Raw share of top-of-funnel volume, in percent. */
  rawWidth: number;
}

const TOP = ACQ_FUNNEL[0]!.value;

const STEPS: Step[] = ACQ_FUNNEL.map((s, i) => {
  const prev = i > 0 ? ACQ_FUNNEL[i - 1]! : null;
  return {
    label: s.label,
    value: s.value,
    hint: s.hint,
    i,
    stepRate: prev ? (s.value / prev.value) * 100 : null,
    rawWidth: (s.value / TOP) * 100,
  };
});

// Lowest step-conversion = biggest leak.
const LEAK = STEPS.filter((s) => s.stepRate !== null).reduce((a, b) =>
  (b.stepRate as number) < (a.stepRate as number) ? b : a
);

// Landing-page visit → first purchase.
const OVERALL = (ACQ_FUNNEL[4]!.value / ACQ_FUNNEL[1]!.value) * 100;

function readFor(s: Step): string {
  if (s.i === 0) {
    return `${number(s.value)} impressions entered the funnel — top-of-funnel reach across ad, search, QR and partner exposure.`;
  }
  if (s.i === 5) {
    return `${number(s.value)} of ${number(ACQ_FUNNEL[4]!.value)} new customers returned within 30 days — a ${pct(
      s.stepRate as number
    )} repeat rate.`;
  }
  const prev = ACQ_FUNNEL[s.i - 1]!;
  return `${number(s.value)} of ${number(prev.value)} ${prev.label.toLowerCase()} converted — a ${pct(
    s.stepRate as number
  )} ${STEP_WORD[s.i]} rate.`;
}

export function AcquisitionView() {
  const [active, setActive] = useState(4); // First purchase
  const activeStep = STEPS[active]!;

  return (
    <div className="space-y-6">
      {/* Hero KPI row */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {HERO.map((k) => (
          <div
            key={k.label}
            className={cn(
              "rounded-xl border bg-surface p-4 shadow-card",
              k.primary
                ? "col-span-2 border-brand-300 ring-1 ring-brand-200 lg:col-span-1"
                : "border-border"
            )}
          >
            <p className="text-[11.5px] font-medium uppercase tracking-wide text-ink-subtle">
              {k.label}
            </p>
            <p
              className={cn(
                "tabular mt-2 font-semibold tracking-tight",
                k.primary ? "text-[32px] leading-none lg:text-[30px]" : "text-[26px] leading-none",
                k.tone === "money" ? "text-money-strong" : "text-ink"
              )}
            >
              {k.value}
            </p>
            <div className="mt-2">
              <Delta value={k.delta} invert={k.invert} suffix="vs prev" />
            </div>
          </div>
        ))}
      </div>

      {/* Acquisition funnel */}
      <div className="rounded-xl border border-border bg-surface shadow-card">
        <header className="border-b border-border p-5">
          <h2 className="text-lg font-semibold tracking-tight text-ink">Acquisition Funnel</h2>
          <p className="mt-0.5 text-[13.5px] text-ink-muted">
            Impression to first purchase to 30-day repeat
          </p>
        </header>

        <div className="space-y-1 p-3 sm:p-4">
          {STEPS.map((row) => {
            const isActive = row.i === active;
            return (
              <button
                key={row.label}
                onClick={() => setActive(row.i)}
                aria-pressed={isActive}
                className={cn(
                  "group block w-full rounded-lg border px-3 py-2.5 text-left transition-colors",
                  isActive
                    ? "border-brand-300 bg-brand-50 ring-1 ring-brand-200"
                    : "border-transparent hover:bg-surface-2"
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="min-w-0 truncate text-[13px] font-medium text-ink">
                    {row.label}
                  </span>
                  <div className="flex shrink-0 items-center gap-2">
                    {row.stepRate !== null && (
                      <span className="tabular rounded-full bg-surface-2 px-1.5 py-0.5 text-[11px] font-medium text-ink-subtle">
                        {pct(row.stepRate)}
                      </span>
                    )}
                    <span className="tabular text-[13px] font-semibold text-ink">
                      {number(row.value)}
                    </span>
                  </div>
                </div>
                <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-surface-2">
                  <div
                    className={cn("h-full rounded-full transition-all duration-500", FILL[row.i])}
                    style={{ width: `${Math.max(row.rawWidth, 4)}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>

        <footer className="border-t border-border p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-subtle">
                TrafficIQ read — {activeStep.label}
              </p>
              <p className="mt-1 text-[13.5px] leading-relaxed text-ink-muted">
                {readFor(activeStep)}
              </p>
              <p className="mt-1 text-[12.5px] text-ink-subtle">{activeStep.hint}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:w-[300px] lg:shrink-0">
              <div className="rounded-xl border border-border bg-surface-2 p-3">
                <p className="text-[11px] font-medium uppercase tracking-wide text-ink-subtle">
                  Visit → purchase
                </p>
                <p className="tabular mt-1 text-[19px] font-semibold tracking-tight text-money-strong">
                  {pct(OVERALL)}
                </p>
                <p className="mt-0.5 text-[11.5px] text-ink-subtle">Landing to first purchase</p>
              </div>
              <div className="rounded-xl border border-opp/30 bg-opp-soft p-3">
                <p className="text-[11px] font-medium uppercase tracking-wide text-opp-strong">
                  Biggest leak
                </p>
                <p className="tabular mt-1 text-[19px] font-semibold tracking-tight text-opp-strong">
                  {pct(LEAK.stepRate as number)}
                </p>
                <p className="mt-0.5 truncate text-[11.5px] text-opp-strong/80">
                  {ACQ_FUNNEL[LEAK.i - 1]!.label} → {LEAK.label}
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
