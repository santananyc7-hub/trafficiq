"use client";

import { useState } from "react";
import { ArrowRight, MapPin, Plus, QrCode } from "lucide-react";
import { Pill } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ScoreDial } from "@/components/ui/ScoreDial";
import {
  PARTNERS_DERIVED,
  PARTNER_PROSPECTS,
  type PartnerStatus,
} from "@/lib/demo";
import { money, number } from "@/lib/format";
import { cn } from "@/lib/cn";

const STATUS_TONE: Record<PartnerStatus, "money" | "brand" | "neutral" | "warn"> = {
  "Top Performer": "money",
  Active: "brand",
  Contacted: "neutral",
  Prospect: "neutral",
  Paused: "warn",
};

const FILTERS: (PartnerStatus | "All")[] = ["All", "Top Performer", "Active", "Contacted", "Prospect", "Paused"];

export function PartnersView() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");

  const rows = [...PARTNERS_DERIVED]
    .filter((p) => filter === "All" || p.status === filter)
    .sort((a, b) => b.newCustomers - a.newCustomers);

  const activeish = PARTNERS_DERIVED.filter((p) => p.newCustomers > 0);
  const totalNew = activeish.reduce((s, p) => s + p.newCustomers, 0);
  const totalV30 = activeish.reduce((s, p) => s + p.value30, 0);
  const totalCost = activeish.reduce((s, p) => s + p.cost, 0);
  const cac = totalNew > 0 ? totalCost / totalNew : 0;

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Summary label="Active partners" value={`${activeish.length}`} />
        <Summary label="Partner customers" value={number(totalNew)} primary />
        <Summary label="30-day revenue" value={money(totalV30)} tone="money" />
        <Summary label="Partner CAC" value={money(cac, { cents: true })} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-1.5">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-[12.5px] font-medium transition-colors",
              filter === f
                ? "border-brand-300 bg-brand-50 text-brand-700"
                : "border-border bg-surface text-ink-muted hover:text-ink"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="border-b border-border text-[11px] uppercase tracking-wide text-ink-subtle">
                <th className="px-3 py-2.5 pl-5 font-medium">Partner</th>
                <th className="hidden px-3 py-2.5 text-right font-medium md:table-cell">QR Scans</th>
                <th className="px-3 py-2.5 text-right font-medium">New</th>
                <th className="hidden px-3 py-2.5 text-right font-medium lg:table-cell">First Rev</th>
                <th className="hidden px-3 py-2.5 text-right font-medium md:table-cell">30-Day Rev</th>
                <th className="px-3 py-2.5 text-right font-medium">CAC</th>
                <th className="px-3 py-2.5 pr-5 text-right font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="tabular">
              {rows.map((p) => (
                <tr key={p.id} className="border-b border-border/60 text-[13px] transition-colors last:border-0 hover:bg-surface-2/60">
                  <td className="px-3 py-3 pl-5">
                    <div className="font-medium text-ink">{p.name}</div>
                    <div className="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-ink-subtle">
                      {p.category}
                      <span className="inline-flex items-center gap-0.5">
                        <MapPin className="h-3 w-3" />
                        {p.distanceMi} mi
                      </span>
                    </div>
                  </td>
                  <td className="hidden px-3 py-3 text-right text-ink-muted md:table-cell">
                    {p.scans > 0 ? number(p.scans) : "—"}
                  </td>
                  <td className="px-3 py-3 text-right font-semibold text-ink">
                    {p.newCustomers > 0 ? p.newCustomers : "—"}
                  </td>
                  <td className="hidden px-3 py-3 text-right text-ink-muted lg:table-cell">
                    {p.firstRevenue > 0 ? money(p.firstRevenue) : "—"}
                  </td>
                  <td className="hidden px-3 py-3 text-right text-ink-muted md:table-cell">
                    {p.value30 > 0 ? money(p.value30) : "—"}
                  </td>
                  <td className="px-3 py-3 text-right">
                    <span className={cn("font-medium", p.cac !== null && p.cac < 12 ? "text-money-strong" : "text-ink")}>
                      {p.cac !== null ? money(p.cac, { cents: true }) : "—"}
                    </span>
                  </td>
                  <td className="px-3 py-3 pr-5 text-right">
                    <Pill tone={STATUS_TONE[p.status]} dot>{p.status}</Pill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Discovery */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-ink">Discover new partners</h2>
            <p className="mt-0.5 text-[13.5px] text-ink-muted">
              Nearby businesses ranked by Opportunity Score and estimated monthly referrals.
            </p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PARTNER_PROSPECTS.map((p) => (
            <div key={p.id} className="flex flex-col rounded-2xl border border-border bg-surface p-4 shadow-card transition-all hover:border-border-strong hover:shadow-elevated">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-[14.5px] font-semibold leading-snug text-ink">{p.name}</h3>
                  <p className="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-ink-subtle">
                    {p.category}
                    <span className="inline-flex items-center gap-0.5">
                      <MapPin className="h-3 w-3" />
                      {p.distanceMi} mi
                    </span>
                  </p>
                </div>
                <ScoreDial value={p.oppScore} tone="brand" size={44} />
              </div>
              <div className="mt-3 rounded-lg border border-border bg-surface-2 px-3 py-2">
                <p className="text-[10.5px] font-medium uppercase tracking-wide text-ink-subtle">
                  Est. referrals / mo
                </p>
                <p className="tabular text-[15px] font-semibold text-ink">
                  {p.estRefsLow}–{p.estRefsHigh}
                </p>
              </div>
              <p className="mt-3 flex items-center gap-1.5 text-[12px] text-ink-muted">
                <QrCode className="h-3.5 w-3.5 text-brand-500" />
                {p.action}
              </p>
              <Button variant="secondary" size="sm" className="mt-3 w-full">
                <Plus className="h-3.5 w-3.5" />
                Add Prospect
              </Button>
            </div>
          ))}
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
    <div className={cn("rounded-xl border bg-surface p-3.5 shadow-card", primary ? "border-brand-300 ring-1 ring-brand-200" : "border-border")}>
      <p className="text-[11px] font-medium uppercase tracking-wide text-ink-subtle">{label}</p>
      <p className={cn("tabular mt-1.5 text-[22px] font-semibold tracking-tight", tone === "money" ? "text-money-strong" : "text-ink")}>
        {value}
      </p>
    </div>
  );
}
