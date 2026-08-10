"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { OpportunityCard } from "@/components/app/OpportunityCard";
import { OPPORTUNITIES, OPP_TOTALS } from "@/lib/demo";
import { money, number } from "@/lib/format";
import { cn } from "@/lib/cn";

type SortKey = "score" | "revenue" | "customers";
const SORTS: { key: SortKey; label: string }[] = [
  { key: "score", label: "Opportunity Score" },
  { key: "revenue", label: "Revenue impact" },
  { key: "customers", label: "New customers" },
];
const CONF = ["All", "High", "Medium"] as const;

export function OpportunitiesView() {
  const [sort, setSort] = useState<SortKey>("score");
  const [conf, setConf] = useState<(typeof CONF)[number]>("All");

  const rows = OPPORTUNITIES.filter((o) => conf === "All" || o.confidence === conf).sort(
    (a, b) => {
      if (sort === "revenue") return b.revenue - a.revenue;
      if (sort === "customers") return b.customers - a.customers;
      return b.score - a.score;
    }
  );

  return (
    <div className="space-y-5">
      {/* Headline stat band */}
      <div className="relative overflow-hidden rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 to-surface p-6 shadow-card">
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-30 blur-3xl"
          style={{ background: "rgb(var(--brand-400))" }}
        />
        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-brand-700">
              <Sparkles className="h-3.5 w-3.5" /> Growth feed
            </span>
            <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-ink-muted">
              TrafficIQ continuously ranks where your next marketing dollar should go —
              scored by impact, confidence and effort.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div>
              <p className="tabular text-[34px] font-bold tracking-tight text-ink">
                {money(OPP_TOTALS.revenue)}
              </p>
              <p className="text-[12px] text-ink-subtle">Potential new revenue / mo</p>
            </div>
            <div className="h-10 w-px bg-border" />
            <div>
              <p className="tabular text-[34px] font-bold tracking-tight text-ink">
                +{number(OPP_TOTALS.customers)}
              </p>
              <p className="text-[12px] text-ink-subtle">New customers / mo</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          {CONF.map((c) => (
            <button
              key={c}
              onClick={() => setConf(c)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-[12.5px] font-medium transition-colors",
                conf === c
                  ? "border-brand-300 bg-brand-50 text-brand-700"
                  : "border-border bg-surface text-ink-muted hover:text-ink"
              )}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-[13px]">
          <span className="text-ink-subtle">Sort by</span>
          <div className="flex gap-0.5 rounded-lg border border-border bg-surface-2 p-0.5">
            {SORTS.map((s) => (
              <button
                key={s.key}
                onClick={() => setSort(s.key)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-[12.5px] font-medium transition-colors",
                  sort === s.key ? "bg-surface text-ink shadow-sm" : "text-ink-subtle hover:text-ink"
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {rows.map((o) => (
          <OpportunityCard key={o.id} opp={o} href="/campaigns/new" />
        ))}
      </div>
    </div>
  );
}
