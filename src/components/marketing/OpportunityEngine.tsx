import { ArrowRight, Sparkles } from "lucide-react";
import { OpportunityCard } from "@/components/app/OpportunityCard";
import { ButtonLink } from "@/components/ui/Button";
import { OPPORTUNITIES, OPP_TOTALS } from "@/lib/demo";
import { money, number } from "@/lib/format";

export function OpportunityEngine() {
  const featured = OPPORTUNITIES.slice(0, 3);
  return (
    <section className="relative px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto w-full max-w-[1180px]">
        {/* Forced-dark spotlight band for contrast in either theme */}
        <div className="relative overflow-hidden rounded-[28px] bg-[rgb(8,10,18)] p-6 sm:p-10">
          <div
            className="grid-signal pointer-events-none absolute inset-0 opacity-60"
            style={{
              // dot-grid tuned for the always-dark band
              backgroundImage:
                "radial-gradient(rgb(255 255 255 / 0.05) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full opacity-30 blur-[110px]"
            style={{ background: "rgb(var(--brand-500))" }}
          />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--signal))]">
                <Sparkles className="h-3.5 w-3.5" />
                Opportunity Engine
              </span>
              <h2 className="mt-4 text-balance text-3xl font-semibold tracking-brand text-white sm:text-[38px] sm:leading-[1.1]">
                It doesn&apos;t just report the past. It finds your next
                opportunity.
              </h2>
              <p className="mt-4 text-[15.5px] leading-relaxed text-white/70">
                TrafficIQ continuously scans your market for underserved trade areas,
                unsigned partners, and misallocated budget — ranked by expected
                return.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-6 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4">
              <div>
                <p className="tabular text-[30px] font-bold tracking-tight text-white">
                  {money(OPP_TOTALS.revenue)}
                </p>
                <p className="text-[12px] text-white/60">Potential new revenue / mo</p>
              </div>
              <div className="h-10 w-px bg-white/10" />
              <div>
                <p className="tabular text-[30px] font-bold tracking-tight text-white">
                  {OPP_TOTALS.count}
                </p>
                <p className="text-[12px] text-white/60">Opportunities found</p>
              </div>
            </div>
          </div>

          <div className="relative mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((o) => (
              <OpportunityCard key={o.id} opp={o} />
            ))}
          </div>

          <div className="relative mt-7 flex items-center justify-between gap-4">
            <p className="text-[13px] text-white/55">
              +{number(OPP_TOTALS.customers)} potential new customers across{" "}
              {OPP_TOTALS.count} opportunities.
            </p>
            <ButtonLink href="#early-access" variant="signal" size="md">
              See the Opportunity Engine
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
