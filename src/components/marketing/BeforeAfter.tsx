import { ArrowRight, Check } from "lucide-react";
import { Section, SectionHeader } from "@/components/marketing/primitives";
import { KPIS, OPP_TOTALS } from "@/lib/demo";
import { money, number, pct } from "@/lib/format";
import { cn } from "@/lib/cn";

const WITHOUT = [
  "Clicks",
  "Impressions",
  "QR scans",
  "Promo codes",
  "Spreadsheets",
  "Agency reports",
  "Raw POS data",
  "Guesswork",
];

interface Outcome {
  value: string;
  label: string;
  money?: boolean;
}

const WITH: Outcome[] = [
  { value: number(KPIS.newCustomers), label: "New Customers" },
  { value: money(KPIS.firstRevenue), label: "First-Purchase Revenue", money: true },
  { value: money(KPIS.blendedCac, { cents: true }), label: "Blended CAC" },
  { value: pct(KPIS.returnRate), label: "Return Rate" },
  { value: money(OPP_TOTALS.revenue), label: "in Opportunities Found", money: true },
];

export function BeforeAfter() {
  return (
    <Section className="py-16 sm:py-24">
      <SectionHeader align="center" eyebrow="The Shift" title="From guessing to knowing." />

      <div className="mt-12 grid items-stretch gap-4 lg:grid-cols-[1fr_auto_1fr]">
        {/* Without */}
        <div className="rounded-2xl border border-border bg-surface-2 p-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
            Without TrafficIQ
          </p>
          <p className="mt-1 text-[13px] text-ink-subtle">
            Fragmented signals that never add up to an answer.
          </p>
          <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2.5">
            {WITHOUT.map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-[14px] text-ink-subtle">
                <span
                  className="h-px w-3 shrink-0 bg-border-strong"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Divider / arrow */}
        <div className="flex items-center justify-center py-1 lg:py-0">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand-200 bg-brand-50 text-brand-600 shadow-card">
            <ArrowRight className="h-5 w-5 rotate-90 lg:rotate-0" />
          </span>
        </div>

        {/* With */}
        <div className="rounded-2xl border border-brand-300 bg-surface p-6 shadow-elevated ring-1 ring-brand-200">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-brand-600">
            With TrafficIQ
          </p>
          <p className="mt-1 text-[13px] text-ink-muted">
            The same activity, resolved into figures you can act on.
          </p>
          <ul className="mt-5 space-y-2.5">
            {WITH.map((o) => (
              <li
                key={o.label}
                className="flex items-baseline gap-3 border-b border-border/70 pb-2.5 last:border-0 last:pb-0"
              >
                <Check className="h-4 w-4 shrink-0 translate-y-0.5 text-money-strong" />
                <span
                  className={cn(
                    "tabular text-[20px] font-semibold leading-none tracking-tight",
                    o.money ? "text-money-strong" : "text-ink"
                  )}
                >
                  {o.value}
                </span>
                <span className="text-[14px] text-ink-muted">{o.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
