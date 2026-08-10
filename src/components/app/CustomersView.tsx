"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { Pill } from "@/components/ui/Badge";
import {
  CUSTOMERS,
  inSegment,
  type CustomerSegment,
} from "@/lib/demo";
import { money, monthDay } from "@/lib/format";
import { cn } from "@/lib/cn";

const SEGMENTS: (CustomerSegment | "All")[] = [
  "New This Week",
  "New This Month",
  "Returned",
  "One-and-Done",
  "High Value",
  "VIP Potential",
  "All",
];

function countIn(seg: CustomerSegment | "All"): number {
  return seg === "All"
    ? CUSTOMERS.length
    : CUSTOMERS.filter((c) => inSegment(c, seg)).length;
}

export function CustomersView() {
  const [seg, setSeg] = useState<(typeof SEGMENTS)[number]>("New This Month");

  const rows = CUSTOMERS.filter((c) => seg === "All" || inSegment(c, seg));

  const newWeek = CUSTOMERS.filter((c) => inSegment(c, "New This Week")).length;
  const newMonth = CUSTOMERS.filter((c) => inSegment(c, "New This Month")).length;
  const returned = CUSTOMERS.filter((c) => c.visits > 1).length;
  const avgLtv =
    CUSTOMERS.reduce((s, c) => s + c.predLtv, 0) / CUSTOMERS.length;

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Summary label="New this week" value={`${newWeek}`} primary />
        <Summary label="New this month" value={`${newMonth}`} />
        <Summary label="Returned" value={`${returned}`} />
        <Summary label="Avg predicted LTV" value={money(avgLtv)} tone="money" />
      </div>

      {/* PII note */}
      <div className="flex items-center gap-2">
        <Pill tone="neutral" className="gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-brand-500" />
          Anonymized
        </Pill>
        <p className="text-[12.5px] text-ink-subtle">
          Customer identifiers are anonymized. TrafficIQ never exposes personally identifiable data.
        </p>
      </div>

      {/* Segment tabs */}
      <div className="flex flex-wrap gap-1.5">
        {SEGMENTS.map((s) => (
          <button
            key={s}
            onClick={() => setSeg(s)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12.5px] font-medium transition-colors",
              seg === s
                ? "border-brand-300 bg-brand-50 text-brand-700"
                : "border-border bg-surface text-ink-muted hover:text-ink"
            )}
          >
            {s}
            <span
              className={cn(
                "tabular text-[11px]",
                seg === s ? "text-brand-600" : "text-ink-subtle"
              )}
            >
              {countIn(s)}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead>
              <tr className="border-b border-border text-[11px] uppercase tracking-wide text-ink-subtle">
                <th className="px-3 py-2.5 pl-5 font-medium">Customer</th>
                <th className="px-3 py-2.5 font-medium">Acquisition Source</th>
                <th className="px-3 py-2.5 text-right font-medium">First Purchase</th>
                <th className="hidden px-3 py-2.5 text-right font-medium lg:table-cell">Last Purchase</th>
                <th className="hidden px-3 py-2.5 text-right font-medium md:table-cell">Visits</th>
                <th className="px-3 py-2.5 text-right font-medium">30-Day Revenue</th>
                <th className="px-3 py-2.5 pr-5 text-right font-medium">Predicted LTV</th>
              </tr>
            </thead>
            <tbody className="tabular">
              {rows.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-border/60 text-[13px] transition-colors last:border-0 hover:bg-surface-2/60"
                >
                  <td className="px-3 py-3 pl-5">
                    <div className="font-mono text-[12.5px] font-medium text-ink">{c.id}</div>
                    <div className="mt-0.5 text-[11.5px] text-ink-subtle">
                      Acquired {monthDay(c.firstIso)}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-ink-muted">{c.source}</td>
                  <td className="px-3 py-3 text-right text-ink-muted">
                    {money(c.firstValue)}
                  </td>
                  <td className="hidden px-3 py-3 text-right text-ink-muted lg:table-cell">
                    {monthDay(c.lastIso)}
                  </td>
                  <td className="hidden px-3 py-3 text-right font-medium text-ink md:table-cell">
                    {c.visits}
                  </td>
                  <td className="px-3 py-3 text-right text-ink">{money(c.value30)}</td>
                  <td className="px-3 py-3 pr-5 text-right font-semibold text-money-strong">
                    {money(c.predLtv)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Summary({
  label,
  value,
  tone,
  primary,
}: {
  label: string;
  value: string;
  tone?: "money";
  primary?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-surface p-3.5 shadow-card",
        primary ? "border-brand-300 ring-1 ring-brand-200" : "border-border"
      )}
    >
      <p className="text-[11px] font-medium uppercase tracking-wide text-ink-subtle">{label}</p>
      <p
        className={cn(
          "tabular mt-1.5 text-[22px] font-semibold tracking-tight",
          tone === "money" ? "text-money-strong" : "text-ink"
        )}
      >
        {value}
      </p>
    </div>
  );
}
