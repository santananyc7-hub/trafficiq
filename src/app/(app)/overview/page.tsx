import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader, PageToolbar } from "@/components/app/PageHeader";
import { KpiRow } from "@/components/app/KpiRow";
import { AcquisitionPanel } from "@/components/app/AcquisitionPanel";
import { ChannelsTable } from "@/components/app/ChannelsTable";
import { InsightPanel } from "@/components/app/InsightPanel";
import { OpportunityCard } from "@/components/app/OpportunityCard";
import { OPPORTUNITIES, OPP_TOTALS } from "@/lib/demo";
import { money } from "@/lib/format";

export const metadata: Metadata = { title: "Overview" };

export default function OverviewPage() {
  const topOpps = OPPORTUNITIES.slice(0, 3);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Good morning, Jonathan"
        title="Here's how customer acquisition is performing."
        actions={<PageToolbar />}
      />

      <KpiRow />

      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <AcquisitionPanel />
        <InsightPanel />
      </div>

      <ChannelsTable />

      {/* Money left on the table */}
      <div>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold tracking-tight text-ink">
                Acquisition Opportunities
              </h2>
              <span className="rounded-full border border-opp/30 bg-opp-soft px-2.5 py-0.5 text-[11.5px] font-semibold text-opp-strong">
                {OPP_TOTALS.count} found
              </span>
            </div>
            <p className="mt-0.5 text-[13.5px] text-ink-muted">
              TrafficIQ identified{" "}
              <span className="font-semibold text-money-strong">
                {money(OPP_TOTALS.revenue)}
              </span>{" "}
              in potential new-customer revenue.
            </p>
          </div>
          <Link
            href="/opportunities"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-brand-600 hover:text-brand-700"
          >
            View all opportunities
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {topOpps.map((o) => (
            <OpportunityCard key={o.id} opp={o} href="/campaigns/new" />
          ))}
        </div>
      </div>
    </div>
  );
}
