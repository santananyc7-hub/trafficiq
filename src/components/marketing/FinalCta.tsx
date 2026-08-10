import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Wordmark } from "@/components/brand/Logo";
import { SignalField } from "@/components/viz/SignalField";

export function FinalCta() {
  return (
    <section id="early-access" className="relative px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto w-full max-w-[1180px]">
        <div className="relative overflow-hidden rounded-[32px] bg-[rgb(8,10,18)] px-6 py-16 sm:px-16">
          {/* Ambient signal field, faded into the background */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.28]">
            <div className="absolute -right-24 top-1/2 hidden w-[560px] -translate-y-1/2 lg:block">
              <SignalField />
            </div>
          </div>
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                "radial-gradient(rgb(255 255 255 / 0.05) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />
          <div
            className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full opacity-30 blur-[110px]"
            style={{ background: "rgb(var(--brand-500))" }}
          />

          <div className="relative max-w-xl">
            <h2 className="text-balance text-3xl font-semibold tracking-brand text-white sm:text-[44px] sm:leading-[1.08]">
              Stop guessing where your customers come from.
            </h2>
            <p className="mt-5 text-[16.5px] leading-relaxed text-white/70">
              Turn customer acquisition into something you can measure, understand and
              grow. Early access is opening for a limited group of operators.
            </p>

            <form className="mt-8 flex flex-col gap-3 sm:flex-row" action="#early-access">
              <input
                type="email"
                required
                placeholder="you@dispensary.com"
                aria-label="Work email"
                className="h-12 flex-1 rounded-lg border border-white/15 bg-white/[0.06] px-4 text-[15px] text-white placeholder:text-white/40 focus:border-[rgb(var(--signal))] focus:outline-none"
              />
              <ButtonLink href="#early-access" variant="signal" size="lg">
                Request Early Access
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </form>

            <div className="mt-10 flex items-center gap-3">
              <Wordmark onDark className="text-lg" />
              <span className="text-[13px] text-white/50">
                · Customer Acquisition Intelligence.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
