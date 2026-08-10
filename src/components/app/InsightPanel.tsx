import { ArrowRight, Sparkles } from "lucide-react";
import { LogoSymbol } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";

/** TrafficIQ AI insight — explains WHY, then recommends an action. */
export function InsightPanel() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-brand-200 bg-gradient-to-br from-brand-50 to-surface p-5 shadow-card">
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-30 blur-3xl"
        style={{ background: "rgb(var(--brand-400))" }}
      />
      <div className="relative">
        <div className="flex items-center gap-2">
          <LogoSymbol size={20} />
          <span className="text-[13px] font-semibold text-ink">TrafficIQ Insight</span>
          <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-brand-200 bg-brand-50 px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide text-brand-700">
            <Sparkles className="h-3 w-3" /> Live
          </span>
        </div>

        <p className="mt-3 text-[14px] leading-relaxed text-ink">
          <span className="font-semibold">Google Maps</span> generated{" "}
          <span className="font-semibold text-brand-700">84 new customers</span> this
          period at a <span className="font-semibold text-money-strong">$4.10 CAC</span>{" "}
          — 3.6× more efficient than your blended cost. Meanwhile{" "}
          <span className="font-semibold">hotel partnerships</span> produced the highest
          30-day value at <span className="font-semibold text-money-strong">$146/customer</span>.
        </p>
        <p className="mt-2.5 text-[14px] leading-relaxed text-ink-muted">
          Influencer Campaign #14 is running at a{" "}
          <span className="font-semibold text-neg">$38.18 CAC</span>. Shifting{" "}
          <span className="font-semibold text-ink">$750</span> from it toward hotel and
          local-search acquisition should add an estimated{" "}
          <span className="font-semibold text-ink">51 customers</span> at your blended CAC.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <ButtonLink href="/campaigns/new" variant="primary" size="sm">
            Build Campaign
            <ArrowRight className="h-3.5 w-3.5" />
          </ButtonLink>
          <ButtonLink href="/acquisition" variant="secondary" size="sm">
            View Analysis
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
