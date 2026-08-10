import { ArrowRight, PlayCircle } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { HeroVisual } from "@/components/viz/HeroVisual";
import { Section } from "@/components/marketing/primitives";

export function Hero() {
  return (
    <Section className="relative overflow-hidden pb-20 pt-14 sm:pt-20">
      {/* Ambient signal grid (subtle; the hero visual supplies the glow) */}
      <div className="grid-signal pointer-events-none absolute inset-0 -z-10 mask-fade-b opacity-60" />

      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-[12.5px] font-medium text-ink-muted backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-[rgb(var(--signal))]" />
            Customer Acquisition Intelligence for Retail
          </span>

          <h1 className="mt-5 text-balance text-[40px] font-semibold leading-[1.04] tracking-brand text-ink sm:text-[56px]">
            Know exactly where your{" "}
            <span className="text-brand-600">new customers</span> come from.
          </h1>

          <p className="mt-5 max-w-xl text-pretty text-[17px] leading-relaxed text-ink-muted">
            TrafficIQ connects marketing activity to real store purchases — then
            shows you where to find your next customers. Built for modern retail
            operators.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="#early-access" variant="signal" size="lg">
              Request Early Access
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="#how" variant="secondary" size="lg">
              <PlayCircle className="h-[18px] w-[18px]" />
              See How It Works
            </ButtonLink>
          </div>

          <p className="mt-6 text-[13px] text-ink-subtle">
            Connects with the stack modern dispensaries already run —{" "}
            <span className="text-ink-muted">Dutchie · Alpine IQ · Headset</span>.
          </p>
        </div>

        <div className="animate-scale-in [animation-delay:120ms]">
          <HeroVisual />
        </div>
      </div>
    </Section>
  );
}
