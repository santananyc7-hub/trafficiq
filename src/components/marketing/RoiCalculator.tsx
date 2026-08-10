"use client";

import { useState } from "react";
import { Section, SectionHeader } from "@/components/marketing/primitives";
import { money, number } from "@/lib/format";
import { cn } from "@/lib/cn";

const TIQ_COST = 599; // Growth plan / location / month
const VALUE30_RATIO = 1.634; // 30-day revenue as a multiple of first-purchase

export function RoiCalculator() {
  const [spend, setSpend] = useState(10000);
  const [avgFirst, setAvgFirst] = useState(78);
  const [newCustomers, setNewCustomers] = useState(400);
  const [improve, setImprove] = useState(10);

  const addlCustomers = Math.round(newCustomers * (improve / 100));
  const addlFirst = addlCustomers * avgFirst;
  const est30 = Math.round(addlFirst * VALUE30_RATIO);
  const roi = est30 / TIQ_COST;

  return (
    <Section className="py-16 sm:py-24">
      <SectionHeader
        align="center"
        eyebrow="ROI"
        title="TrafficIQ only needs to find a few customers to pay for itself."
        description="Estimate the return from a modest lift in acquisition efficiency. These are projections, not guarantees."
      />

      <div className="mx-auto mt-10 grid max-w-4xl gap-4 lg:grid-cols-[1fr_1fr]">
        {/* Inputs */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
          <Slider
            label="Monthly marketing spend"
            value={spend}
            min={2000}
            max={60000}
            step={500}
            onChange={setSpend}
            format={(v) => money(v)}
          />
          <Slider
            label="Average first purchase"
            value={avgFirst}
            min={30}
            max={160}
            step={1}
            onChange={setAvgFirst}
            format={(v) => money(v)}
          />
          <Slider
            label="Monthly new customers"
            value={newCustomers}
            min={50}
            max={2000}
            step={10}
            onChange={setNewCustomers}
            format={(v) => number(v)}
          />
          <Slider
            label="TrafficIQ efficiency lift"
            value={improve}
            min={2}
            max={30}
            step={1}
            onChange={setImprove}
            format={(v) => `${v}%`}
            last
          />
        </div>

        {/* Output */}
        <div className="relative overflow-hidden rounded-2xl border border-brand-300 bg-gradient-to-br from-brand-50 to-surface p-6 shadow-card ring-1 ring-brand-200">
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-30 blur-3xl"
            style={{ background: "rgb(var(--brand-400))" }}
          />
          <div className="relative">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-brand-700">
              Estimated monthly return
            </p>
            <p className="tabular mt-2 text-[52px] font-bold leading-none tracking-tight text-ink">
              {roi.toFixed(1)}×
            </p>
            <p className="mt-1 text-[13px] text-ink-muted">
              on {money(TIQ_COST)}/mo — the Growth plan.
            </p>

            <div className="mt-6 space-y-2.5">
              <OutRow label="Additional new customers" value={`+${number(addlCustomers)}`} />
              <OutRow
                label="Additional first-purchase revenue"
                value={money(addlFirst)}
                tone="money"
              />
              <OutRow
                label="Estimated 30-day revenue"
                value={money(est30)}
                tone="money"
                strong
              />
            </div>
          </div>
        </div>
      </div>
      <p className="mx-auto mt-4 max-w-4xl text-center text-[12px] text-ink-subtle">
        Illustrative model. Actual results depend on your market, offers and
        execution — TrafficIQ does not guarantee outcomes.
      </p>
    </Section>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
  last,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
  last?: boolean;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className={cn(!last && "mb-6")}>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-[13px] font-medium text-ink-muted">{label}</label>
        <span className="tabular text-[15px] font-semibold text-ink">
          {format(value)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="tiq-range w-full"
        style={{
          background: `linear-gradient(to right, rgb(var(--brand-500)) ${pct}%, rgb(var(--surface-3)) ${pct}%)`,
        }}
      />
    </div>
  );
}

function OutRow({
  label,
  value,
  tone,
  strong,
}: {
  label: string;
  value: string;
  tone?: "money";
  strong?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-xl px-3 py-2.5",
        strong ? "bg-money-soft" : "bg-surface/70"
      )}
    >
      <span className="text-[13px] text-ink-muted">{label}</span>
      <span
        className={cn(
          "tabular text-[16px] font-semibold tracking-tight",
          tone === "money" ? "text-money-strong" : "text-ink"
        )}
      >
        {value}
      </span>
    </div>
  );
}
