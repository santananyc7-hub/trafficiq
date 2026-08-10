"use client";

import { useState } from "react";
import { ArrowRight, Sparkles, X } from "lucide-react";
import { Pill } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LogoSymbol } from "@/components/brand/Logo";
import {
  CAMPAIGNS_DERIVED,
  type CampaignDerived,
  type CampaignStatus,
} from "@/lib/demo";
import { money, moneyCompact, number, monthDay } from "@/lib/format";
import { cn } from "@/lib/cn";

const TABS: (CampaignStatus | "All")[] = [
  "All",
  "Active",
  "Scheduled",
  "Completed",
  "Draft",
];

const STATUS_TONE: Record<CampaignStatus, "money" | "brand" | "neutral"> = {
  Active: "money",
  Scheduled: "brand",
  Completed: "neutral",
  Draft: "neutral",
};

const ANALYSIS: Record<string, string> = {
  "grand-central":
    "Traffic from the Grand Central QR converts 2.4× better between 4:30–7:30 PM. Weight distribution to the evening commuter window to lift conversions.",
  "hotel-concierge":
    "The highest 30-day value of any active campaign at $146/customer. TrafficIQ found four more hotels within your trade area that match this partner profile.",
  "influencer-14":
    "CAC of $38.18 is 2.6× your blended average and the repeat rate is under half. Recommend pausing and reallocating $750 to hotel and local-search acquisition.",
  "google-local":
    "Your most efficient always-on channel at a $4.10 CAC. Impression share is capped by budget, not demand — a $350/week increase should scale linearly.",
  "midtown-east-dm":
    "Direct mail into the Midtown East ZIP cluster is landing new customers, but its 30-day repeat lags. Pair with a second-visit offer to lift retained value.",
};

export function CampaignsView() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("All");
  const [openId, setOpenId] = useState<string | null>(null);

  const rows = CAMPAIGNS_DERIVED.filter((c) => tab === "All" || c.status === tab);
  const active = CAMPAIGNS_DERIVED.filter((c) => c.status === "Active");
  const open = CAMPAIGNS_DERIVED.find((c) => c.id === openId) ?? null;

  const totalSpend = active.reduce((s, c) => s + c.spend, 0);
  const totalNew = active.reduce((s, c) => s + c.newCustomers, 0);
  const totalV30 = active.reduce((s, c) => s + c.value30, 0);
  const blendedCac = totalNew > 0 ? totalSpend / totalNew : 0;

  return (
    <div className="space-y-4">
      {/* Summary strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Summary label="Active campaigns" value={`${active.length}`} />
        <Summary label="Spend (active)" value={money(totalSpend)} />
        <Summary label="New customers" value={number(totalNew)} primary />
        <Summary label="Blended campaign CAC" value={money(blendedCac, { cents: true })} />
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5">
        {TABS.map((t) => {
          const count =
            t === "All"
              ? CAMPAIGNS_DERIVED.length
              : CAMPAIGNS_DERIVED.filter((c) => c.status === t).length;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12.5px] font-medium transition-colors",
                tab === t
                  ? "border-brand-300 bg-brand-50 text-brand-700"
                  : "border-border bg-surface text-ink-muted hover:text-ink"
              )}
            >
              {t}
              <span className={cn("tabular text-[11px]", tab === t ? "text-brand-600" : "text-ink-subtle")}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead>
              <tr className="border-b border-border text-[11px] uppercase tracking-wide text-ink-subtle">
                <th className="px-3 py-2.5 pl-5 font-medium">Campaign</th>
                <th className="px-3 py-2.5 text-right font-medium">Spend</th>
                <th className="hidden px-3 py-2.5 text-right font-medium lg:table-cell">Scans / Clicks</th>
                <th className="hidden px-3 py-2.5 text-right font-medium lg:table-cell">Store Visits</th>
                <th className="px-3 py-2.5 text-right font-medium">New</th>
                <th className="hidden px-3 py-2.5 text-right font-medium md:table-cell">30-Day Rev</th>
                <th className="px-3 py-2.5 text-right font-medium">CAC</th>
                <th className="px-3 py-2.5 pr-5 text-right font-medium">ROAS</th>
              </tr>
            </thead>
            <tbody className="tabular">
              {rows.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => setOpenId(c.id)}
                  className="group cursor-pointer border-b border-border/60 text-[13px] transition-colors last:border-0 hover:bg-surface-2/60"
                >
                  <td className="px-3 py-3 pl-5">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-ink">{c.name}</span>
                      {c.topPerformer && (
                        <span className="rounded bg-money-soft px-1.5 py-0.5 text-[10px] font-semibold uppercase text-money-strong">
                          Top
                        </span>
                      )}
                      {c.alert && (
                        <span
                          className="rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase"
                          style={{ background: "rgb(var(--neg)/0.12)", color: "rgb(var(--neg))" }}
                        >
                          Alert
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <Pill tone={STATUS_TONE[c.status]} dot className="!px-2 !py-0 !text-[10.5px]">
                        {c.status}
                      </Pill>
                      <span className="text-[11.5px] text-ink-subtle">{c.channel}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-right text-ink-muted">
                    {c.spend > 0 ? money(c.spend) : "—"}
                  </td>
                  <td className="hidden px-3 py-3 text-right text-ink-muted lg:table-cell">
                    {c.scans > 0 ? number(c.scans) : "—"}
                  </td>
                  <td className="hidden px-3 py-3 text-right text-ink-muted lg:table-cell">
                    {c.storeVisits > 0 ? number(c.storeVisits) : "—"}
                  </td>
                  <td className="px-3 py-3 text-right font-semibold text-ink">
                    {c.newCustomers > 0 ? c.newCustomers : "—"}
                  </td>
                  <td className="hidden px-3 py-3 text-right text-ink-muted md:table-cell">
                    {c.value30 > 0 ? money(c.value30) : "—"}
                  </td>
                  <td className="px-3 py-3 text-right">
                    <span
                      className={cn(
                        "font-medium",
                        c.cac !== null && c.cac < 8
                          ? "text-money-strong"
                          : c.cac !== null && c.cac > 30
                            ? "text-neg"
                            : "text-ink"
                      )}
                    >
                      {c.cac !== null ? money(c.cac, { cents: true }) : "—"}
                    </span>
                  </td>
                  <td className="px-3 py-3 pr-5 text-right font-medium text-ink">
                    {c.roas !== null ? `${c.roas.toFixed(1)}×` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {open && <CampaignDrawer c={open} onClose={() => setOpenId(null)} />}
    </div>
  );
}

function CampaignDrawer({ c, onClose }: { c: CampaignDerived; onClose: () => void }) {
  const maxFunnel = c.funnel[0]?.value ?? 1;
  const analysis =
    ANALYSIS[c.id] ??
    (c.newCustomers > 0
      ? `Acquired ${c.newCustomers} new customers at a ${money(c.cac ?? 0, { cents: true })} CAC. 30-day value is running at ${money(c.value30 / Math.max(1, c.newCustomers))} per customer.`
      : "Scheduled — no acquisition data yet. TrafficIQ will begin attributing customers as soon as it goes live.");

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-border bg-surface shadow-pop animate-slide-in-right">
        <div className="sticky top-0 flex items-start justify-between gap-3 border-b border-border bg-surface/90 px-5 py-4 backdrop-blur">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Pill tone={STATUS_TONE[c.status]} dot>{c.status}</Pill>
              <span className="text-[12px] text-ink-subtle">{c.channel}</span>
            </div>
            <h3 className="mt-1.5 text-[17px] font-semibold leading-tight text-ink">{c.name}</h3>
            <p className="mt-0.5 text-[12px] text-ink-subtle">Started {monthDay(c.startedIso)}</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-ink-muted hover:bg-surface-2"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-5 p-5">
          {/* Stat grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <Stat label="Spend" value={c.spend > 0 ? money(c.spend) : "—"} />
            <Stat label="New customers" value={c.newCustomers > 0 ? `${c.newCustomers}` : "—"} primary />
            <Stat label="CAC" value={c.cac !== null ? money(c.cac, { cents: true }) : "—"} />
            <Stat label="ROAS" value={c.roas !== null ? `${c.roas.toFixed(1)}×` : "—"} />
            <Stat label="First-purchase rev" value={c.firstRevenue > 0 ? money(c.firstRevenue) : "—"} tone="money" />
            <Stat label="30-day revenue" value={c.value30 > 0 ? money(c.value30) : "—"} tone="money" />
          </div>

          {/* Funnel */}
          {c.funnel.length > 0 && (
            <div>
              <p className="mb-2.5 text-[12px] font-semibold uppercase tracking-wide text-ink-subtle">
                Acquisition funnel
              </p>
              <div className="space-y-2">
                {c.funnel.map((f, i) => {
                  const prev = i > 0 ? c.funnel[i - 1]!.value : null;
                  const conv = prev ? (f.value / prev) * 100 : null;
                  return (
                    <div key={f.label}>
                      <div className="mb-1 flex items-center justify-between text-[12.5px]">
                        <span className="font-medium text-ink">{f.label}</span>
                        <span className="tabular text-ink-muted">
                          {number(f.value)}
                          {conv !== null && (
                            <span className="ml-1.5 text-ink-subtle">{conv.toFixed(1)}%</span>
                          )}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-surface-2">
                        <div
                          className="h-full rounded-full bg-brand-500"
                          style={{ width: `${Math.max(3, (f.value / maxFunnel) * 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* AI analysis */}
          <div className="rounded-xl border border-brand-200 bg-brand-50/60 p-4">
            <div className="flex items-center gap-2">
              <LogoSymbol size={18} />
              <span className="text-[12.5px] font-semibold text-ink">TrafficIQ analysis</span>
              <Sparkles className="h-3.5 w-3.5 text-brand-500" />
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">{analysis}</p>
          </div>

          <div className="flex gap-2">
            <Button variant="primary" size="sm" className="flex-1">
              {c.alert ? "Reallocate budget" : "Optimize campaign"}
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
            <Button variant="secondary" size="sm">
              Full report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Summary({
  label,
  value,
  primary,
}: {
  label: string;
  value: string;
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
      <p className="tabular mt-1.5 text-[22px] font-semibold tracking-tight text-ink">{value}</p>
    </div>
  );
}

function Stat({
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
        "rounded-lg border bg-surface-2 p-2.5",
        primary ? "border-brand-300" : "border-border"
      )}
    >
      <p className="text-[10.5px] font-medium uppercase tracking-wide text-ink-subtle">{label}</p>
      <p
        className={cn(
          "tabular mt-0.5 text-[16px] font-semibold tracking-tight",
          tone === "money" ? "text-money-strong" : "text-ink"
        )}
      >
        {value}
      </p>
    </div>
  );
}
