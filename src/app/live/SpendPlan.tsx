"use client";

import { useState } from "react";

/* Spend Plan: the activation layer. Takes the Capture Index and a monthly
   marketing budget, allocates it across the highest-opportunity neighborhoods,
   picks the cannabis-legal channel for each, and projects new customers + ROI
   from your real LTV. Two modeled inputs (budget, cost-per-customer) are yours
   to move; everything else is your data. */

interface Row { zip: string; name: string; status: string; ["capture$"]: number; activeY: number; penetration: number; }
interface Props { rows: Row[]; realLTV: number }

const usd = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

function channelFor(status: string): string {
  const t = status.toLowerCase();
  if (t.includes("turf")) return "Referral + Google Business radius";
  if (t.includes("compet")) return "Geofence + direct mail (EDDM)";
  if (t.includes("contest")) return "Geofence + Weedmaps / Leafly";
  return "Geofence + SMS";
}

export default function SpendPlan({ rows, realLTV }: Props) {
  const [budget, setBudget] = useState(5000);
  const [cpa, setCpa] = useState(40);

  const ranked = [...rows].sort((a, b) => b["capture$"] - a["capture$"]).slice(0, 8);
  const weightSum = ranked.reduce((s, r) => s + r["capture$"], 0) || 1;

  const plan = ranked.map((r) => {
    const alloc = budget * (r["capture$"] / weightSum);
    const monthlyCeiling = (r["capture$"] / Math.max(1, realLTV)) / 12; // capturable customers / mo
    const newCust = Math.min(alloc / cpa, monthlyCeiling);
    const revenue = newCust * realLTV;
    return { ...r, alloc, newCust, revenue, roi: alloc ? revenue / alloc : 0, channel: channelFor(r.status) };
  });

  const totalNew = plan.reduce((s, p) => s + p.newCust, 0);
  const totalRev = plan.reduce((s, p) => s + p.revenue, 0);
  const blendedRoi = budget ? totalRev / budget : 0;

  const exportPlan = () => {
    const csv = "zip,neighborhood,channel,monthly_spend,est_new_customers,est_first_year_revenue,roi\n" +
      plan.map((p) => `${p.zip},"${p.name}","${p.channel}",${Math.round(p.alloc)},${p.newCust.toFixed(1)},${Math.round(p.revenue)},${p.roi.toFixed(2)}`).join("\n");
    const b = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const u = URL.createObjectURL(b); const a = document.createElement("a");
    a.href = u; a.download = "spend-plan.csv"; a.click(); URL.revokeObjectURL(u);
  };

  return (
    <section className="mt-8 rounded-2xl border p-5" style={{ background: "rgb(var(--surface))", borderColor: "rgb(var(--border-strong))" }}>
      <div className="mb-1 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full" style={{ background: "rgb(var(--money))" }} />
        <h2 className="text-[13px] font-semibold uppercase tracking-wide" style={{ color: "rgb(var(--ink-subtle))" }}>Spend Plan</h2>
      </div>
      <p className="mb-4 max-w-3xl text-[12.5px] leading-relaxed" style={{ color: "rgb(var(--ink-muted))" }}>
        Set a monthly budget and it allocates across your highest-opportunity neighborhoods, assigns the right channel, and projects new customers and return from your real {usd(realLTV)} customer value. Drag to plan.
      </p>

      <div className="mb-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl p-3" style={{ background: "rgb(var(--surface-2))" }}>
          <div className="flex items-baseline justify-between">
            <span className="text-[12px] font-medium" style={{ color: "rgb(var(--ink-muted))" }}>Monthly budget</span>
            <span className="text-[15px] font-semibold tabular" style={{ color: "rgb(var(--ink))" }}>{usd(budget)}</span>
          </div>
          <input type="range" min={500} max={50000} step={500} value={budget} onChange={(e) => setBudget(+e.target.value)} className="tiq-range mt-2 w-full" style={{ background: "rgb(var(--surface-3))" }} />
        </div>
        <div className="rounded-xl p-3" style={{ background: "rgb(var(--surface-2))" }}>
          <div className="flex items-baseline justify-between">
            <span className="text-[12px] font-medium" style={{ color: "rgb(var(--ink-muted))" }}>Cost per new customer <span style={{ color: "rgb(var(--ink-subtle))" }}>(modeled)</span></span>
            <span className="text-[15px] font-semibold tabular" style={{ color: "rgb(var(--ink))" }}>{usd(cpa)}</span>
          </div>
          <input type="range" min={15} max={120} step={5} value={cpa} onChange={(e) => setCpa(+e.target.value)} className="tiq-range mt-2 w-full" style={{ background: "rgb(var(--surface-3))" }} />
        </div>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-3">
        <div className="rounded-xl p-3" style={{ background: "rgb(var(--surface-2))" }}>
          <div className="text-[11px] uppercase tracking-wide" style={{ color: "rgb(var(--ink-subtle))" }}>New customers / mo</div>
          <div className="mt-0.5 text-xl font-semibold tabular" style={{ color: "rgb(var(--ink))" }}>{Math.round(totalNew).toLocaleString()}</div>
        </div>
        <div className="rounded-xl p-3" style={{ background: "rgb(var(--surface-2))" }}>
          <div className="text-[11px] uppercase tracking-wide" style={{ color: "rgb(var(--ink-subtle))" }}>First-year revenue</div>
          <div className="mt-0.5 text-xl font-semibold tabular" style={{ color: "rgb(var(--money))" }}>{usd(totalRev)}</div>
        </div>
        <div className="rounded-xl p-3" style={{ background: "rgb(var(--surface-2))" }}>
          <div className="text-[11px] uppercase tracking-wide" style={{ color: "rgb(var(--ink-subtle))" }}>Return on spend</div>
          <div className="mt-0.5 text-xl font-semibold tabular" style={{ color: blendedRoi >= 1 ? "rgb(var(--money))" : "rgb(var(--warn))" }}>{blendedRoi.toFixed(1)}×</div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border" style={{ borderColor: "rgb(var(--border))" }}>
        <div className="hidden grid-cols-[1fr_1.3fr_90px_72px_96px_56px] items-center gap-3 px-3 py-2 text-[10.5px] font-semibold uppercase tracking-wide md:grid" style={{ background: "rgb(var(--surface-2))", color: "rgb(var(--ink-subtle))" }}>
          <span>Neighborhood</span><span>Channel</span><span className="text-right">Spend / mo</span><span className="text-right">New cust.</span><span className="text-right">Revenue</span><span className="text-right">ROI</span>
        </div>
        {plan.map((p) => (
          <div key={p.zip} className="grid grid-cols-2 items-center gap-x-3 gap-y-1 border-t px-3 py-2.5 md:grid-cols-[1fr_1.3fr_90px_72px_96px_56px]" style={{ borderColor: "rgb(var(--border))" }}>
            <div className="col-span-2 md:col-span-1">
              <div className="text-[13px] font-semibold" style={{ color: "rgb(var(--ink))" }}>{p.name}</div>
              <div className="text-[11px] tabular" style={{ color: "rgb(var(--ink-subtle))" }}>{p.zip}</div>
            </div>
            <span className="text-[12px]" style={{ color: "rgb(var(--ink-muted))" }}>{p.channel}</span>
            <span className="text-right text-[12px] font-medium tabular" style={{ color: "rgb(var(--ink))" }}>{usd(p.alloc)}</span>
            <span className="text-right text-[12px] tabular" style={{ color: "rgb(var(--ink-muted))" }}>{p.newCust.toFixed(1)}</span>
            <span className="text-right text-[12px] font-semibold tabular" style={{ color: "rgb(var(--money))" }}>{usd(p.revenue)}</span>
            <span className="text-right text-[12px] font-semibold tabular" style={{ color: p.roi >= 1 ? "rgb(var(--money))" : "rgb(var(--ink-subtle))" }}>{p.roi.toFixed(1)}×</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[11px]" style={{ color: "rgb(var(--ink-subtle))" }}>
          Real: opportunity weighting, customer value, channel fit by competitive position. Modeled: cost per new customer (yours to set). New customers are capped at each area&apos;s monthly capturable ceiling.
        </p>
        <button onClick={exportPlan} className="shrink-0 rounded-lg px-3.5 py-2 text-[12px] font-semibold transition" style={{ background: "rgb(var(--money))", color: "#fff" }}>
          Export spend plan (CSV)
        </button>
      </div>
    </section>
  );
}
