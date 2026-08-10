import type { ReactNode } from "react";
import { ArrowRight, MapPin } from "lucide-react";
import { Section, Eyebrow } from "@/components/marketing/primitives";
import { JourneyFlow } from "@/components/viz/JourneyFlow";
import { TradeMap } from "@/components/viz/TradeMap";
import { Pill } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { money } from "@/lib/format";
import { cn } from "@/lib/cn";

export function ValueProps() {
  return (
    <Section className="py-16 sm:py-24">
      <div className="flex flex-col gap-20">
        {/* 01 — Attribution */}
        <Row
          index="01"
          eyebrow="Attribution"
          title="Know what actually brings customers through the door."
          body="TrafficIQ ties every campaign, QR code, link and partnership to a real purchase — and to what that customer is worth 30 days later."
        >
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold uppercase tracking-wide text-ink-subtle">
                Customer journey
              </span>
              <Pill tone="money" dot>
                High confidence
              </Pill>
            </div>
            <JourneyFlow
              className="mt-4"
              steps={[
                { label: "Hotel QR", sub: "The Chatwal", tone: "brand" },
                { label: "Landing page" },
                { label: "Menu" },
                { label: "Store visit" },
                { label: "$92 purchase", tone: "money" },
                { label: "$146", sub: "30-day value", tone: "money-strong" },
              ]}
            />
            <p className="mt-4 text-[13px] leading-relaxed text-ink-muted">
              Not every path is certain. TrafficIQ labels each attribution
              <span className="font-medium text-ink"> High</span>,
              <span className="font-medium text-ink"> Medium</span> or
              <span className="font-medium text-ink"> Low</span> confidence — it never
              pretends to know what it can&apos;t.
            </p>
          </div>
        </Row>

        {/* 02 — Geographic intelligence */}
        <Row
          index="02"
          reverse
          eyebrow="Geographic Intelligence"
          eyebrowTone="signal"
          title="See where your next customers should come from."
          body="TrafficIQ maps customer density across your market and flags the trade areas producing far fewer customers than they should."
        >
          <div className="rounded-2xl border border-border bg-surface p-3 shadow-card">
            <TradeMap layer="opportunities" selected="midtown-east" showPoints={false} />
            <div className="flex items-center justify-between gap-3 px-2 py-2.5">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-opp" />
                <span className="text-[13.5px] font-semibold text-ink">
                  Midtown East
                </span>
                <Pill tone="opp" dot>
                  Score 92
                </Pill>
              </div>
              <span className="text-[13px] text-ink-muted">
                <span className="font-semibold text-ink">+140</span> customers/mo ·{" "}
                <span className="font-semibold text-money-strong">
                  {money(11200)}
                </span>
              </span>
            </div>
          </div>
        </Row>

        {/* 03 — Acquisition intelligence */}
        <Row
          index="03"
          eyebrow="Acquisition Intelligence"
          title="Know where to spend your next marketing dollar."
          body="Give TrafficIQ a budget. It returns the allocation most likely to bring paying customers through the door — with a projected result."
        >
          <BudgetPlan />
        </Row>
      </div>
    </Section>
  );
}

const PLAN = [
  { channel: "Hotel Partnerships", amount: 500 },
  { channel: "Google Local", amount: 350 },
  { channel: "Direct Mail", amount: 150 },
  { channel: "Influencers", amount: 0 },
];

function BudgetPlan() {
  const max = Math.max(...PLAN.map((p) => p.amount));
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-semibold uppercase tracking-wide text-ink-subtle">
          Available budget
        </span>
        <span className="tabular text-[18px] font-bold text-ink">{money(1000)}</span>
      </div>
      <div className="mt-4 space-y-2.5">
        {PLAN.map((p) => (
          <div key={p.channel} className="flex items-center gap-3">
            <span className="w-36 shrink-0 text-[13px] font-medium text-ink">
              {p.channel}
            </span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-3">
              <div
                className={cn(
                  "h-full rounded-full",
                  p.amount === 0 ? "bg-border-strong" : "bg-brand-500"
                )}
                style={{ width: `${Math.max(3, (p.amount / max) * 100)}%` }}
              />
            </div>
            <span className="tabular w-14 shrink-0 text-right text-[13px] font-semibold text-ink">
              {p.amount === 0 ? "—" : money(p.amount)}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4">
        <MiniStat label="Customers" value="+73" />
        <MiniStat label="First-purchase" value={money(5840)} tone="money" />
        <MiniStat label="30-day rev" value={money(9210)} tone="money" />
      </div>
    </div>
  );
}

function MiniStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "money";
}) {
  return (
    <div className="text-center">
      <p
        className={cn(
          "tabular text-[16px] font-semibold tracking-tight",
          tone === "money" ? "text-money-strong" : "text-ink"
        )}
      >
        {value}
      </p>
      <p className="mt-0.5 text-[10.5px] font-medium uppercase tracking-wide text-ink-subtle">
        {label}
      </p>
    </div>
  );
}

function Row({
  index,
  eyebrow,
  eyebrowTone,
  title,
  body,
  children,
  reverse,
}: {
  index: string;
  eyebrow: string;
  eyebrowTone?: "brand" | "signal" | "muted";
  title: string;
  body: string;
  children: ReactNode;
  reverse?: boolean;
}) {
  return (
    <div className="grid items-center gap-8 lg:grid-cols-2">
      <div className={cn(reverse && "lg:order-2")}>
        <div className="flex items-center gap-3">
          <span className="tabular text-[13px] font-bold text-brand-600">{index}</span>
          <Eyebrow tone={eyebrowTone}>{eyebrow}</Eyebrow>
        </div>
        <h3 className="mt-3 text-balance text-2xl font-semibold tracking-brand text-ink sm:text-[30px] sm:leading-tight">
          {title}
        </h3>
        <p className="mt-4 max-w-lg text-pretty text-[15.5px] leading-relaxed text-ink-muted">
          {body}
        </p>
        <ButtonLink href="#early-access" variant="ghost" size="md" className="mt-5 -ml-2 text-brand-600">
          Request early access
          <ArrowRight className="h-4 w-4" />
        </ButtonLink>
      </div>
      <div className={cn(reverse && "lg:order-1")}>{children}</div>
    </div>
  );
}
