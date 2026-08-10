"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, CornerDownLeft, Sparkles } from "lucide-react";
import { Section, SectionHeader } from "@/components/marketing/primitives";
import { ButtonLink } from "@/components/ui/Button";
import { LogoSymbol } from "@/components/brand/Logo";
import { ASK_PLAN } from "@/lib/demo";
import { money, number } from "@/lib/format";
import { cn } from "@/lib/cn";

const SUGGESTIONS = [
  "Where should I spend $1,000 this week?",
  "Why did new customer traffic decline?",
  "Which ZIP code should I target next?",
  "Which campaign produced the best customers?",
];

// Total reveal steps: 3 analyst lines + allocation + projection + CTA
const TOTAL_STEPS = ASK_PLAN.lines.length + 3;

export function AskTrafficIQ() {
  const [step, setStep] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Kick off the reveal when the section scrolls into view.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setStarted(true);
          obs.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    if (step >= TOTAL_STEPS) return;
    const t = setTimeout(() => setStep((s) => s + 1), step === 0 ? 500 : 620);
    return () => clearTimeout(t);
  }, [started, step]);

  function replay() {
    setStep(0);
    setStarted(true);
  }

  const maxAlloc = Math.max(...ASK_PLAN.allocation.map((a) => a.amount));

  return (
    <Section className="py-16 sm:py-24" containerClassName="">
      <div ref={ref}>
        <SectionHeader
          align="center"
          eyebrow="Ask TrafficIQ"
          eyebrowTone="signal"
          title="Ask your business a question."
          description="A marketing analyst that answers with your own numbers — and a plan you can act on."
        />

        <div className="mx-auto mt-10 max-w-2xl">
          {/* Prompt bar */}
          <div className="flex items-center gap-3 rounded-2xl border border-border-strong bg-surface px-4 py-3 shadow-elevated">
            <Sparkles className="h-4 w-4 shrink-0 text-brand-500" />
            <span className="flex-1 truncate text-[15px] text-ink">
              {ASK_PLAN.question}
            </span>
            <button
              onClick={replay}
              className="flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-[12.5px] font-medium text-white transition-colors hover:bg-brand-700"
            >
              Ask
              <CornerDownLeft className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Suggestions */}
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={replay}
                className="rounded-full border border-border bg-surface px-3.5 py-2 text-[12.5px] text-ink-muted transition-colors hover:border-border-strong hover:text-ink"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Answer */}
          <div className="mt-4 rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
            <div className="flex items-center gap-2.5">
              <LogoSymbol size={22} />
              <span className="text-[13px] font-semibold text-ink">TrafficIQ</span>
              <span className="text-[12px] text-ink-subtle">· analysis</span>
              {step < TOTAL_STEPS && started && (
                <span className="ml-auto flex items-center gap-1 text-[11.5px] text-ink-subtle">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-500" />
                  thinking
                </span>
              )}
            </div>

            <div className="mt-4 space-y-2.5">
              {ASK_PLAN.lines.map((line, i) => (
                <Reveal key={i} show={step > i}>
                  <p className="text-[14.5px] leading-relaxed text-ink-muted">
                    {line}
                  </p>
                </Reveal>
              ))}
            </div>

            {/* Allocation */}
            <Reveal show={step > ASK_PLAN.lines.length}>
              <div className="mt-5 rounded-xl border border-border bg-surface-2 p-4">
                <p className="text-[12px] font-semibold uppercase tracking-wide text-ink-subtle">
                  Recommended allocation
                </p>
                <div className="mt-3 space-y-2.5">
                  {ASK_PLAN.allocation.map((a) => (
                    <div key={a.channel} className="flex items-center gap-3">
                      <span className="w-36 shrink-0 text-[13px] font-medium text-ink">
                        {a.channel}
                      </span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-3">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-700",
                            a.amount === 0 ? "bg-border-strong" : "bg-brand-500"
                          )}
                          style={{
                            width: `${Math.max(4, (a.amount / maxAlloc) * 100)}%`,
                          }}
                        />
                      </div>
                      <span className="tabular w-12 shrink-0 text-right text-[13px] font-semibold text-ink">
                        {money(a.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Projected result */}
            <Reveal show={step > ASK_PLAN.lines.length + 1}>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <Projected label="New customers" value={`+${ASK_PLAN.projected.customers}`} />
                <Projected
                  label="First-purchase rev"
                  value={money(ASK_PLAN.projected.firstRevenue)}
                  tone="money"
                />
                <Projected
                  label="Est. 30-day rev"
                  value={money(ASK_PLAN.projected.value30)}
                  tone="money"
                />
              </div>
            </Reveal>

            <Reveal show={step > ASK_PLAN.lines.length + 2}>
              <ButtonLink
                href="#early-access"
                variant="signal"
                size="md"
                className="mt-4 w-full"
              >
                Build this plan
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </Reveal>
          </div>
          <p className="mt-3 text-center text-[12px] text-ink-subtle">
            Projections are estimates based on your trailing 90-day performance.
          </p>
        </div>
      </div>
    </Section>
  );
}

function Reveal({ show, children }: { show: boolean; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "transition-all duration-500",
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-1 opacity-0"
      )}
    >
      {children}
    </div>
  );
}

function Projected({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "money";
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-3 text-center">
      <p
        className={cn(
          "tabular text-[18px] font-semibold tracking-tight",
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
