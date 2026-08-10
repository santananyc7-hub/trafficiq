import { HelpCircle, ArrowRight } from "lucide-react";
import { Section, SectionHeader } from "@/components/marketing/primitives";
import { LogoSymbol } from "@/components/brand/Logo";

const SOURCES = [
  "Google",
  "Direct Mail",
  "Hotels",
  "Events",
  "Influencers",
  "Street Team",
  "Partners",
];

const RESOLVED = [
  { label: "Attributed customers", tone: "ink" },
  { label: "First-purchase revenue", tone: "money" },
  { label: "CAC", tone: "ink" },
  { label: "30-day value", tone: "money" },
];

export function ProblemSection() {
  return (
    <Section className="py-16 sm:py-24">
      <SectionHeader
        eyebrow="The Problem"
        title="Marketing shouldn't be a guessing game."
        description="Dispensaries spend thousands every month across search, direct mail, influencers, events, street teams and partnerships — but most operators still can't say which channel brought them a new paying customer."
      />

      <div className="mt-12 grid gap-4 lg:grid-cols-2">
        {/* Before — fragmented */}
        <div className="rounded-2xl border border-border bg-surface-2/60 p-6">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-ink-subtle">
            Today
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {SOURCES.map((s) => (
              <span
                key={s}
                className="rounded-lg border border-border bg-surface px-2.5 py-1.5 text-[12.5px] font-medium text-ink-muted"
              >
                {s}
              </span>
            ))}
          </div>
          <div className="my-5 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-dashed border-ink-subtle/50 bg-surface">
              <HelpCircle className="h-6 w-6 text-ink-subtle" />
            </div>
          </div>
          <div className="rounded-xl border border-border bg-surface px-4 py-3 text-center">
            <p className="text-[13px] font-medium text-ink-muted">
              Store revenue — source unknown
            </p>
          </div>
        </div>

        {/* After — resolved */}
        <div className="relative overflow-hidden rounded-2xl border border-brand-300 bg-surface p-6 ring-1 ring-brand-200">
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-20 blur-3xl"
            style={{ background: "rgb(var(--brand-500))" }}
          />
          <p className="text-[12px] font-semibold uppercase tracking-wide text-brand-600">
            With TrafficIQ
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {SOURCES.map((s) => (
              <span
                key={s}
                className="rounded-lg border border-brand-200 bg-brand-50 px-2.5 py-1.5 text-[12.5px] font-medium text-brand-700"
              >
                {s}
              </span>
            ))}
          </div>
          <div className="my-5 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 shadow-glow-brand">
              <LogoSymbol size={26} variant="on-brand" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {RESOLVED.map((r) => (
              <div
                key={r.label}
                className="flex items-center gap-2 rounded-xl border border-border bg-surface-2 px-3 py-2.5"
              >
                <ArrowRight
                  className={
                    r.tone === "money" ? "h-3.5 w-3.5 text-money" : "h-3.5 w-3.5 text-brand-500"
                  }
                />
                <span
                  className={
                    r.tone === "money"
                      ? "text-[13px] font-semibold text-money-strong"
                      : "text-[13px] font-semibold text-ink"
                  }
                >
                  {r.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
