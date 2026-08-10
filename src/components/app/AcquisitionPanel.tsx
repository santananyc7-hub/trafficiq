"use client";

import { useState } from "react";
import { PerformanceChart } from "@/components/viz/PerformanceChart";
import { SERIES } from "@/lib/demo";
import { cn } from "@/lib/cn";

const PERIODS = ["7D", "30D", "90D", "YTD"] as const;
type Period = (typeof PERIODS)[number];

export function AcquisitionPanel() {
  const [period, setPeriod] = useState<Period>("7D");

  return (
    <div className="rounded-xl border border-border bg-surface shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div>
          <h3 className="text-sm font-semibold text-ink">Acquisition Performance</h3>
          <div className="mt-1.5 flex items-center gap-4 text-[12px] text-ink-muted">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-brand-500" /> New customers
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-4 rounded-full border-b-2 border-dashed border-money" />{" "}
              First-purchase revenue
            </span>
          </div>
        </div>
        <div className="flex gap-0.5 rounded-lg border border-border bg-surface-2 p-0.5">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                "rounded-md px-2.5 py-1 text-[12.5px] font-medium transition-colors",
                period === p
                  ? "bg-surface text-ink shadow-sm"
                  : "text-ink-subtle hover:text-ink"
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      <div className="px-4 pb-4 pt-5">
        <PerformanceChart data={SERIES[period]} />
      </div>
    </div>
  );
}
