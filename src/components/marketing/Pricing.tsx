import { Check } from "lucide-react";
import { Section, SectionHeader } from "@/components/marketing/primitives";
import { ButtonLink } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";

interface Plan {
  name: string;
  price: string;
  unit?: string;
  featuresLabel?: string;
  features: string[];
  cta: string;
  ctaVariant: "secondary" | "signal";
  recommended?: boolean;
}

const PLANS: Plan[] = [
  {
    name: "Starter",
    price: "$299",
    unit: "/location/mo",
    features: [
      "Acquisition dashboard",
      "Campaign tracking",
      "QR attribution",
      "Core reporting",
    ],
    cta: "Start Free Trial",
    ctaVariant: "secondary",
  },
  {
    name: "Growth",
    price: "$599",
    unit: "/location/mo",
    featuresLabel: "Everything in Starter, plus",
    features: [
      "Traffic Map",
      "Opportunity Engine",
      "Partner Intelligence",
      "AI Marketing Analyst",
      "Advanced Attribution",
    ],
    cta: "Request Early Access",
    ctaVariant: "signal",
    recommended: true,
  },
  {
    name: "Multi-Location",
    price: "Custom",
    features: [
      "Portfolio analytics",
      "Cross-location intelligence",
      "Agency access",
      "Advanced permissions",
      "Dedicated onboarding",
    ],
    cta: "Talk to Sales",
    ctaVariant: "secondary",
  },
];

export function Pricing() {
  return (
    <Section id="pricing" className="py-16 sm:py-24">
      <SectionHeader
        align="center"
        eyebrow="Pricing"
        title="Early-access pricing."
        description="Priced per location. Cancel anytime during early access."
      />

      <div className="mt-12 grid items-stretch gap-5 lg:grid-cols-3">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "relative flex flex-col rounded-2xl border bg-surface p-6 shadow-card",
              plan.recommended
                ? "border-brand-300 shadow-elevated ring-1 ring-brand-200 lg:-mt-2 lg:mb-2"
                : "border-border"
            )}
          >
            {plan.recommended && (
              <div className="absolute -top-3 left-6">
                <Pill tone="brand" dot>
                  Recommended
                </Pill>
              </div>
            )}

            <p className="text-[15px] font-semibold text-ink">{plan.name}</p>

            <div className="mt-4 flex items-baseline gap-1.5">
              <span className="tabular text-[40px] font-semibold leading-none tracking-tight text-ink">
                {plan.price}
              </span>
              {plan.unit && (
                <span className="text-[13px] font-medium text-ink-subtle">
                  {plan.unit}
                </span>
              )}
            </div>

            <div className="mt-6">
              <ButtonLink
                href="#early-access"
                variant={plan.ctaVariant}
                size="md"
                className="w-full"
              >
                {plan.cta}
              </ButtonLink>
            </div>

            {plan.featuresLabel && (
              <p className="mt-6 text-[12.5px] font-medium text-ink-muted">
                {plan.featuresLabel}
              </p>
            )}
            <ul className={cn("space-y-2.5", plan.featuresLabel ? "mt-3" : "mt-6")}>
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-[14px] text-ink">
                  <Check
                    className={cn(
                      "h-4 w-4 shrink-0 translate-y-0.5",
                      plan.recommended ? "text-brand-600" : "text-money-strong"
                    )}
                  />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-6 text-center text-[12px] text-ink-subtle">
        Early Access Pricing — subject to change.
      </p>
    </Section>
  );
}
