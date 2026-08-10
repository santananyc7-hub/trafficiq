"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Section, SectionHeader } from "@/components/marketing/primitives";
import { TradeMap, type MapLayer } from "@/components/viz/TradeMap";
import { Pill } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { TRADE_AREAS } from "@/lib/demo";
import { money, number } from "@/lib/format";
import { cn } from "@/lib/cn";

const LAYERS: { id: MapLayer; label: string }[] = [
  { id: "customers", label: "Customers" },
  { id: "revenue", label: "Revenue" },
  { id: "opportunities", label: "Opportunities" },
  { id: "partners", label: "Partners" },
  { id: "competitors", label: "Competitors" },
];

export function TrafficMapShowcase() {
  const [layer, setLayer] = useState<MapLayer>("opportunities");
  const [selected, setSelected] = useState<string>("midtown-east");
  const area = TRADE_AREAS.find((a) => a.id === selected) ?? TRADE_AREAS[0]!;

  const penTone =
    area.penetration === "Low" ? "opp" : area.penetration === "High" ? "money" : "neutral";

  return (
    <Section className="py-16 sm:py-24">
      <SectionHeader
        eyebrow="Traffic Map"
        eyebrowTone="signal"
        title="Your market is bigger than your customer list."
        description="See where your customers actually come from — and the trade areas producing far fewer than they should."
      />

      <div className="mt-10 grid gap-5 lg:grid-cols-[1.55fr_1fr]">
        <div>
          <div className="mb-3 flex flex-wrap gap-1.5">
            {LAYERS.map((l) => (
              <button
                key={l.id}
                onClick={() => setLayer(l.id)}
                className={cn(
                  "rounded-lg border px-3.5 py-2 text-[12.5px] font-medium transition-colors",
                  layer === l.id
                    ? "border-brand-300 bg-brand-50 text-brand-700"
                    : "border-border bg-surface text-ink-muted hover:text-ink"
                )}
              >
                {l.label}
              </button>
            ))}
          </div>
          <TradeMap
            layer={layer}
            selected={selected}
            onSelect={setSelected}
            className="shadow-elevated"
          />
          <p className="mt-2 text-[12px] text-ink-subtle">
            Click any trade area to inspect it. Stylized representation of the Midtown
            Manhattan market.
          </p>
        </div>

        {/* Intelligence panel */}
        <div className="animate-fade-in rounded-2xl border border-border bg-surface p-5 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
                Trade area
              </p>
              <h3 className="mt-0.5 text-xl font-semibold text-ink">{area.name}</h3>
            </div>
            <Pill tone={penTone} dot>
              {area.penetration} penetration
            </Pill>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <Stat label="Existing customers" value={number(area.customers)} />
            <Stat label="New / month" value={`${area.newPerMonth}`} />
            <Stat label="Avg first purchase" value={money(area.avgFirst)} />
            <Stat label="30-day value" value={money(area.value30)} tone="money" />
          </div>

          {/* Opportunity score meter */}
          <div className="mt-5 rounded-xl border border-opp/30 bg-opp-soft p-4">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold uppercase tracking-wide text-opp-strong">
                Opportunity score
              </span>
              <span className="tabular text-[22px] font-bold text-opp-strong">
                {area.oppScore}
                <span className="text-[13px] font-medium text-opp-strong/70">/100</span>
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[rgb(var(--opp)/0.2)]">
              <div
                className="h-full rounded-full bg-opp transition-all duration-500"
                style={{ width: `${area.oppScore}%` }}
              />
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-ink-muted">
              TrafficIQ estimates{" "}
              <span className="font-semibold text-ink">
                +{area.potentialCustomers} customers/month
              </span>{" "}
              and{" "}
              <span className="font-semibold text-money-strong">
                {money(area.potentialRevenue)}
              </span>{" "}
              in first-purchase revenue here. Recommended play:{" "}
              <span className="font-medium text-ink">{area.recommendation}</span>.
            </p>
          </div>

          <ButtonLink href="#early-access" variant="signal" size="md" className="mt-4 w-full">
            Build Campaign
            <ArrowRight className="h-4 w-4" />
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "money";
}) {
  return (
    <div className="rounded-xl border border-border bg-surface-2 p-3">
      <p className="text-[11px] font-medium uppercase tracking-wide text-ink-subtle">
        {label}
      </p>
      <p
        className={cn(
          "tabular mt-1 text-[19px] font-semibold tracking-tight",
          tone === "money" ? "text-money-strong" : "text-ink"
        )}
      >
        {value}
      </p>
    </div>
  );
}
