import {
  AlertTriangle,
  ArrowRight,
  Clock,
  Flag,
  MapPin,
  RefreshCw,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { ScoreDial } from "@/components/ui/ScoreDial";
import { ConfidenceBadge, Pill } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { money } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { OppKind, Opportunity } from "@/lib/demo";

const KIND: Record<OppKind, { icon: LucideIcon; label: string }> = {
  "trade-area": { icon: MapPin, label: "Geographic gap" },
  partner: { icon: Flag, label: "Partner opportunity" },
  "channel-scale": { icon: TrendingUp, label: "Scale channel" },
  "budget-alert": { icon: AlertTriangle, label: "Budget alert" },
  timing: { icon: Clock, label: "Timing" },
  reactivation: { icon: RefreshCw, label: "Re-activation" },
};

export function OpportunityCard({
  opp,
  className,
  onAction,
  href,
}: {
  opp: Opportunity;
  className?: string;
  onAction?: (opp: Opportunity) => void;
  /** When set, the CTA navigates here (e.g. the campaign builder). */
  href?: string;
}) {
  const meta = KIND[opp.kind];
  const Icon = meta.icon;
  const alert = opp.kind === "budget-alert";

  return (
    <div
      className={cn(
        "group flex min-w-0 flex-col rounded-2xl border border-border bg-surface p-5 shadow-card transition-all hover:border-border-strong hover:shadow-elevated",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <ScoreDial value={opp.score} tone={alert ? "opp" : "opp"} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide",
                alert ? "text-neg" : "text-brand-600"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {meta.label}
            </span>
            {opp.area && (
              <span className="text-[11.5px] text-ink-subtle">· {opp.area}</span>
            )}
          </div>
          <h3 className="mt-1 text-[15.5px] font-semibold leading-snug text-ink">
            {opp.title}
          </h3>
        </div>
      </div>

      <p className="mt-3 text-[13.5px] leading-relaxed text-ink-muted">{opp.reason}</p>

      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4">
        <Metric label="Customers / mo" value={`+${opp.customers}`} />
        <Metric label="Revenue / mo" value={money(opp.revenue)} tone="money" />
        <Metric
          label="Expected CAC"
          value={money(opp.expectedCac, { cents: true })}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <ConfidenceBadge level={opp.confidence} />
        {href ? (
          <ButtonLink href={href} variant={alert ? "secondary" : "primary"} size="sm">
            {opp.action}
            <ArrowRight className="h-3.5 w-3.5" />
          </ButtonLink>
        ) : (
          <Button
            variant={alert ? "secondary" : "primary"}
            size="sm"
            onClick={onAction ? () => onAction(opp) : undefined}
          >
            {opp.action}
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "money";
}) {
  return (
    <div>
      <p className="text-[10.5px] font-medium uppercase tracking-wide text-ink-subtle">
        {label}
      </p>
      <p
        className={cn(
          "tabular mt-0.5 text-[15px] font-semibold tracking-tight",
          tone === "money" ? "text-money-strong" : "text-ink"
        )}
      >
        {value}
      </p>
    </div>
  );
}
