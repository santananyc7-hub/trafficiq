import { Briefcase, Building2, Megaphone, Network } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Section, SectionHeader } from "@/components/marketing/primitives";

interface Role {
  role: string;
  icon: LucideIcon;
  question: string;
  answer: string;
}

const ROLES: Role[] = [
  {
    role: "Owner",
    icon: Building2,
    question: "Where is my marketing money actually going?",
    answer: "See spend-to-customer for every channel.",
  },
  {
    role: "Marketing Director",
    icon: Megaphone,
    question: "Which campaign should I scale?",
    answer: "Rank campaigns by new customers and 30-day value, not clicks.",
  },
  {
    role: "Multi-Location Operator",
    icon: Network,
    question: "Which store has the strongest acquisition engine?",
    answer: "Compare CAC and return rate across locations.",
  },
  {
    role: "Agency",
    icon: Briefcase,
    question: "Prove exactly how many customers our campaigns generated.",
    answer: "Attribution reporting clients can trust.",
  },
];

export function UseCases() {
  return (
    <Section id="use-cases" className="py-16 sm:py-24">
      <SectionHeader
        eyebrow="Who It's For"
        title="Built for the people accountable for growth."
      />

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {ROLES.map(({ role, icon: Icon, question, answer }) => (
          <div
            key={role}
            className="group flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6 shadow-card transition-all duration-200 hover:border-border-strong hover:shadow-elevated"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
                {role}
              </span>
            </div>
            <p className="text-pretty text-[19px] font-semibold leading-snug tracking-brand text-ink">
              &ldquo;{question}&rdquo;
            </p>
            <p className="text-[14.5px] leading-relaxed text-ink-muted">{answer}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
