"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  Gift,
  MapPin,
  Megaphone,
  QrCode,
  Rocket,
  Sparkles,
  Target,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { LogoSymbol } from "@/components/brand/Logo";
import { money, number } from "@/lib/format";
import { cn } from "@/lib/cn";

const STEPS = ["Goal", "Target", "Channel", "Offer", "Creative", "Forecast"] as const;

const GOALS: { id: string; label: string; sub: string; icon: LucideIcon }[] = [
  { id: "acquire", label: "Acquire new customers", sub: "Bring first-time paying customers into the store", icon: Target },
  { id: "traffic", label: "Increase store traffic", sub: "Drive more attributed store visits", icon: Megaphone },
  { id: "neighborhood", label: "Enter a new neighborhood", sub: "Grow in an underserved trade area", icon: MapPin },
  { id: "partnership", label: "Build a local partnership", sub: "Turn a nearby business into a referral source", icon: Gift },
];

const AREAS = [
  { id: "midtown-east", label: "Midtown East", note: "Opportunity Score 92" },
  { id: "flatiron", label: "Flatiron / NoMad", note: "Opportunity Score 76" },
  { id: "upper-east", label: "Upper East Side", note: "Opportunity Score 83" },
  { id: "chelsea", label: "Chelsea", note: "Opportunity Score 71" },
];

interface Ch {
  id: string;
  label: string;
  cac: number;
  reachPerDollar: number;
  recommended?: boolean;
}
const CHANNELS: Ch[] = [
  { id: "hotel", label: "Hotel Partnership", cac: 11.05, reachPerDollar: 2.8, recommended: true },
  { id: "google", label: "Google Local", cac: 4.1, reachPerDollar: 17, recommended: true },
  { id: "directmail", label: "Direct Mail", cac: 18.4, reachPerDollar: 1.5 },
  { id: "qr", label: "QR / Street Team", cac: 8.0, reachPerDollar: 3.2 },
  { id: "social", label: "Social", cac: 16.83, reachPerDollar: 7.5 },
  { id: "event", label: "Event", cac: 19.31, reachPerDollar: 2.1 },
];

const OFFERS = [
  { id: "first-visit", label: "20% off first visit", sub: "TrafficIQ recommended — best first-purchase conversion", recommended: true },
  { id: "bogo", label: "First-visit BOGO", sub: "Higher basket, slightly lower margin" },
  { id: "gift", label: "Free gift over $40", sub: "Lifts average first purchase" },
];

const CLOSE_RATE = 0.42;
const AVG_FIRST = 74.6;

export function CampaignBuilder() {
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState("acquire");
  const [area, setArea] = useState("midtown-east");
  const [channel, setChannel] = useState("hotel");
  const [offer, setOffer] = useState("first-visit");
  const [budget, setBudget] = useState(1000);
  const [launched, setLaunched] = useState(false);

  const ch = CHANNELS.find((c) => c.id === channel)!;
  const areaObj = AREAS.find((a) => a.id === area)!;

  const forecast = useMemo(() => {
    const newCustomers = Math.round(budget / ch.cac);
    const storeVisits = Math.round(newCustomers / CLOSE_RATE);
    const reach = Math.round(budget * ch.reachPerDollar * 40);
    const firstRevenue = Math.round(newCustomers * AVG_FIRST);
    const value30 = Math.round(firstRevenue * 1.5);
    return { newCustomers, storeVisits, reach, firstRevenue, value30, cac: ch.cac };
  }, [budget, ch]);

  const creative = useMemo(() => {
    const slug = area.replace(/-/g, "_");
    const promo = `${areaObj.label.split(/[ /]/)[0]!.toUpperCase()}20`;
    return {
      headline:
        goal === "partnership"
          ? `Your guests get 20% off their first visit — steps from ${areaObj.label}.`
          : `New to ${areaObj.label}? Your first visit is 20% off.`,
      landing: `Show this code in store to claim 20% off your first purchase. Attributed automatically to your ${ch.label.toLowerCase()} campaign.`,
      promo,
      utm: `utm_source=${channel}&utm_medium=${channel === "hotel" ? "qr" : "link"}&utm_campaign=${slug}_${goal}`,
      trackingId: `TIQ-${channel.toUpperCase().slice(0, 4)}-${areaObj.label.slice(0, 3).toUpperCase()}-4821`,
    };
  }, [goal, area, channel, areaObj, ch]);

  if (launched) return <LaunchedState forecast={forecast} areaLabel={areaObj.label} />;

  return (
    <div className="mx-auto max-w-3xl">
      {/* Stepper */}
      <div className="mb-6 flex items-center justify-between gap-1">
        {STEPS.map((s, i) => {
          const done = i < step;
          const cur = i === step;
          return (
            <div key={s} className="flex flex-1 items-center gap-2 last:flex-none">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold transition-colors",
                    done
                      ? "bg-brand-600 text-white"
                      : cur
                        ? "bg-brand-50 text-brand-700 ring-2 ring-brand-300"
                        : "bg-surface-2 text-ink-subtle"
                  )}
                >
                  {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </span>
                <span
                  className={cn(
                    "hidden text-[12.5px] font-medium sm:block",
                    cur ? "text-ink" : "text-ink-subtle"
                  )}
                >
                  {s}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <span className={cn("hidden h-px flex-1 sm:block", done ? "bg-brand-300" : "bg-border")} />
              )}
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-600">
          Step {step + 1} of {STEPS.length}
        </p>

        {step === 0 && (
          <Section title="What's the goal of this campaign?">
            <OptionGrid>
              {GOALS.map((g) => (
                <OptionCard
                  key={g.id}
                  active={goal === g.id}
                  onClick={() => setGoal(g.id)}
                  icon={g.icon}
                  label={g.label}
                  sub={g.sub}
                />
              ))}
            </OptionGrid>
          </Section>
        )}

        {step === 1 && (
          <Section title="Which trade area are you targeting?">
            <OptionGrid>
              {AREAS.map((a) => (
                <OptionCard
                  key={a.id}
                  active={area === a.id}
                  onClick={() => setArea(a.id)}
                  icon={MapPin}
                  label={a.label}
                  sub={a.note}
                />
              ))}
            </OptionGrid>
          </Section>
        )}

        {step === 2 && (
          <Section title="How will you reach them?" hint="TrafficIQ pre-selects the most efficient channels for this goal.">
            <OptionGrid>
              {CHANNELS.map((c) => (
                <OptionCard
                  key={c.id}
                  active={channel === c.id}
                  onClick={() => setChannel(c.id)}
                  icon={c.id === "qr" ? QrCode : Megaphone}
                  label={c.label}
                  sub={`~${money(c.cac, { cents: true })} CAC`}
                  badge={c.recommended ? "Recommended" : undefined}
                />
              ))}
            </OptionGrid>
          </Section>
        )}

        {step === 3 && (
          <Section title="Pick an offer">
            <div className="space-y-2.5">
              {OFFERS.map((o) => (
                <button
                  key={o.id}
                  onClick={() => setOffer(o.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-colors",
                    offer === o.id ? "border-brand-300 bg-brand-50 ring-1 ring-brand-200" : "border-border hover:bg-surface-2"
                  )}
                >
                  <Gift className={cn("h-5 w-5 shrink-0", offer === o.id ? "text-brand-600" : "text-ink-subtle")} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2 text-[14px] font-semibold text-ink">
                      {o.label}
                      {o.recommended && (
                        <span className="rounded bg-brand-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-brand-700">
                          TrafficIQ pick
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block text-[12.5px] text-ink-muted">{o.sub}</span>
                  </span>
                  {offer === o.id && <Check className="h-4 w-4 shrink-0 text-brand-600" />}
                </button>
              ))}
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between">
                <label className="text-[13px] font-medium text-ink-muted">Weekly budget</label>
                <span className="tabular text-[15px] font-semibold text-ink">{money(budget)}</span>
              </div>
              <input
                type="range"
                min={250}
                max={5000}
                step={50}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="tiq-range w-full"
                style={{
                  background: `linear-gradient(to right, rgb(var(--brand-500)) ${((budget - 250) / 4750) * 100}%, rgb(var(--surface-3)) ${((budget - 250) / 4750) * 100}%)`,
                }}
              />
            </div>
          </Section>
        )}

        {step === 4 && (
          <Section title="Generated creative & tracking" hint="Edit anything — TrafficIQ drafts a starting point.">
            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <div className="space-y-3">
                <Field label="Headline" value={creative.headline} />
                <Field label="Landing copy" value={creative.landing} multiline />
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Promo code" value={creative.promo} mono />
                  <Field label="Partner tracking ID" value={creative.trackingId} mono />
                </div>
                <Field label="UTM tracking" value={creative.utm} mono />
              </div>
              <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-surface-2 p-4">
                <FauxQR seed={creative.trackingId} />
                <span className="text-[11px] font-medium text-ink-subtle">Unique QR</span>
              </div>
            </div>
          </Section>
        )}

        {step === 5 && (
          <Section title="Forecast" hint="Projected from this channel's trailing performance. Estimates, not guarantees.">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Forecast label="Est. reach" value={number(forecast.reach)} />
              <Forecast label="Est. store visits" value={number(forecast.storeVisits)} />
              <Forecast label="New customers" value={`+${forecast.newCustomers}`} primary />
              <Forecast label="Est. CAC" value={money(forecast.cac, { cents: true })} />
              <Forecast label="First-purchase rev" value={money(forecast.firstRevenue)} tone="money" />
              <Forecast label="Est. 30-day rev" value={money(forecast.value30)} tone="money" />
            </div>
            <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-brand-200 bg-brand-50/60 p-4">
              <LogoSymbol size={18} />
              <p className="text-[13px] leading-relaxed text-ink-muted">
                At {money(budget)}/week through <span className="font-medium text-ink">{ch.label}</span>, this campaign
                should acquire about <span className="font-semibold text-ink">{forecast.newCustomers} new customers</span> in{" "}
                {areaObj.label} at a {money(forecast.cac, { cents: true })} CAC.
              </p>
            </div>
          </Section>
        )}

        {/* Footer nav */}
        <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
          {step > 0 ? (
            <Button variant="ghost" size="md" onClick={() => setStep((s) => s - 1)}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          ) : (
            <Link
              href="/campaigns"
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-ink-muted hover:text-ink"
            >
              <ArrowLeft className="h-4 w-4" />
              Cancel
            </Link>
          )}

          {step < STEPS.length - 1 ? (
            <Button variant="primary" size="md" onClick={() => setStep((s) => s + 1)}>
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button variant="signal" size="md" onClick={() => setLaunched(true)}>
              <Rocket className="h-4 w-4" />
              Launch Campaign
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function LaunchedState({
  forecast,
  areaLabel,
}: {
  forecast: { newCustomers: number; firstRevenue: number };
  areaLabel: string;
}) {
  return (
    <div className="mx-auto max-w-lg py-10 text-center">
      <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-600 shadow-glow-brand">
        <Rocket className="h-7 w-7 text-white" />
        <span className="absolute inset-0 rounded-2xl ring-2 ring-brand-400 animate-pulse-ring" />
      </div>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight text-ink">Campaign launched.</h1>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">
        TrafficIQ is now tracking this {areaLabel} campaign end-to-end. You&apos;ll see attributed
        customers appear on the Overview as they convert — a projected{" "}
        <span className="font-semibold text-ink">+{forecast.newCustomers}</span> new customers and{" "}
        <span className="font-semibold text-money-strong">{money(forecast.firstRevenue)}</span> in
        first-purchase revenue.
      </p>
      <div className="mt-7 flex justify-center gap-2">
        <Link href="/campaigns" className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700">
          View campaigns
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link href="/overview" className="inline-flex items-center gap-2 rounded-lg border border-border-strong px-4 py-2.5 text-sm font-medium text-ink hover:bg-surface-2">
          Back to Overview
        </Link>
      </div>
    </div>
  );
}

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-3">
      <h2 className="text-[18px] font-semibold tracking-tight text-ink">{title}</h2>
      {hint && <p className="mt-1 text-[13px] text-ink-muted">{hint}</p>}
      <div className="mt-4">{children}</div>
    </div>
  );
}

function OptionGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-2.5 sm:grid-cols-2">{children}</div>;
}

function OptionCard({
  active,
  onClick,
  icon: Icon,
  label,
  sub,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  icon: LucideIcon;
  label: string;
  sub: string;
  badge?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-start gap-3 rounded-xl border p-4 text-left transition-colors",
        active ? "border-brand-300 bg-brand-50 ring-1 ring-brand-200" : "border-border hover:bg-surface-2"
      )}
    >
      <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", active ? "bg-brand-600 text-white" : "bg-surface-2 text-ink-subtle")}>
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2 text-[14px] font-semibold text-ink">
          {label}
          {badge && (
            <span className="rounded bg-brand-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-brand-700">
              {badge}
            </span>
          )}
        </span>
        <span className="mt-0.5 block text-[12.5px] text-ink-muted">{sub}</span>
      </span>
      {active && <Check className="h-4 w-4 shrink-0 text-brand-600" />}
    </button>
  );
}

function Field({
  label,
  value,
  multiline,
  mono,
}: {
  label: string;
  value: string;
  multiline?: boolean;
  mono?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface-2 p-3">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[10.5px] font-medium uppercase tracking-wide text-ink-subtle">{label}</span>
        <Copy className="h-3.5 w-3.5 text-ink-subtle" />
      </div>
      <p className={cn("text-[13px] text-ink", mono && "font-mono text-[12px]", multiline ? "leading-relaxed" : "truncate")}>
        {value}
      </p>
    </div>
  );
}

function Forecast({
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
    <div className={cn("rounded-xl border bg-surface p-3.5", primary ? "border-brand-300 ring-1 ring-brand-200" : "border-border")}>
      <p className="text-[10.5px] font-medium uppercase tracking-wide text-ink-subtle">{label}</p>
      <p className={cn("tabular mt-1 text-[20px] font-semibold tracking-tight", tone === "money" ? "text-money-strong" : "text-ink")}>
        {value}
      </p>
    </div>
  );
}

/** Deterministic decorative QR-like grid derived from a seed string. */
function FauxQR({ seed }: { seed: string }) {
  const cells = [];
  const size = 11;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // deterministic hash of coordinates + seed
      let h = 0;
      const s = `${seed}:${x}:${y}`;
      for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) & 0xffff;
      const on = h % 100 < 48;
      const finder =
        (x < 3 && y < 3) || (x > size - 4 && y < 3) || (x < 3 && y > size - 4);
      if (on || finder) cells.push(`${x},${y}`);
    }
  }
  const unit = 8;
  return (
    <svg width={size * unit} height={size * unit} viewBox={`0 0 ${size * unit} ${size * unit}`} className="rounded">
      <rect width={size * unit} height={size * unit} fill="rgb(var(--surface))" />
      {cells.map((c) => {
        const [x, y] = c.split(",").map(Number);
        return <rect key={c} x={x! * unit} y={y! * unit} width={unit} height={unit} fill="rgb(var(--ink))" rx={1} />;
      })}
    </svg>
  );
}
