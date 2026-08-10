import { PlugZap, ScanSearch, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Section, SectionHeader } from "@/components/marketing/primitives";

interface Step {
  n: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    n: "01",
    icon: PlugZap,
    title: "Connect your retail and marketing stack.",
    description: "Dutchie, Alpine IQ, Headset and your ad accounts in minutes.",
  },
  {
    n: "02",
    icon: ScanSearch,
    title: "See where new customers originate and what they're worth.",
    description: "Every purchase traced to its true source, priced by 30-day value.",
  },
  {
    n: "03",
    icon: TrendingUp,
    title: "Get told where to invest next.",
    description:
      "TrafficIQ ranks opportunities and recommends where your next dollar goes.",
  },
];

export function HowItWorks() {
  return (
    <Section id="how" className="py-16 sm:py-24">
      <SectionHeader
        eyebrow="How It Works"
        title="Three steps to acquisition you can measure."
      />

      <div className="relative mt-12 grid gap-8 md:grid-cols-3 md:gap-6">
        {/* Connector rail (desktop) */}
        <div
          className="pointer-events-none absolute left-0 right-0 top-[26px] hidden h-px bg-border md:block"
          aria-hidden="true"
        />

        {STEPS.map(({ n, icon: Icon, title, description }) => (
          <div key={n} className="relative flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <span className="tabular text-[40px] font-semibold leading-none tracking-tight text-brand-600">
                {n}
              </span>
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface text-brand-600 shadow-card">
                <Icon className="h-5 w-5" />
              </span>
            </div>
            <h3 className="text-balance text-[18px] font-semibold leading-snug tracking-brand text-ink">
              {title}
            </h3>
            <p className="text-[14.5px] leading-relaxed text-ink-muted">{description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
