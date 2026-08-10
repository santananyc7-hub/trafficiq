import {
  BarChart3,
  CalendarClock,
  Download,
  FileText,
  GitBranch,
  Handshake,
  Layers,
  Route,
  Target,
  type LucideIcon,
} from "lucide-react";
import { Pill } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";

interface Template {
  id: string;
  name: string;
  desc: string;
  icon: LucideIcon;
}
const TEMPLATES: Template[] = [
  { id: "acq", name: "Acquisition Summary", desc: "New customers, CAC and revenue for any period", icon: BarChart3 },
  { id: "channel", name: "Channel Performance", desc: "Every channel ranked by new customers and ROAS", icon: Route },
  { id: "opp", name: "Opportunity Brief", desc: "Ranked growth opportunities with financial impact", icon: Target },
  { id: "partner", name: "Partner Performance", desc: "Partner-sourced customers and referral value", icon: Handshake },
  { id: "attr", name: "Attribution Report", desc: "Credit by model with honest confidence levels", icon: GitBranch },
  { id: "rollup", name: "Multi-Location Rollup", desc: "Portfolio view across all 3 stores", icon: Layers },
];

interface Saved {
  name: string;
  period: string;
  type: string;
  created: string;
  format: "PDF" | "CSV";
}
const SAVED: Saved[] = [
  { name: "August Acquisition Summary", period: "Aug 1–10, 2026", type: "Acquisition", created: "Aug 10", format: "PDF" },
  { name: "Q3 Channel Performance", period: "Jul–Sep 2026", type: "Channel", created: "Aug 9", format: "CSV" },
  { name: "Hotel Partner Report — client copy", period: "Jul 2026", type: "Partner", created: "Aug 4", format: "PDF" },
  { name: "Midtown East Opportunity Brief", period: "Aug 2026", type: "Opportunity", created: "Aug 3", format: "PDF" },
  { name: "Attribution — TrafficIQ model", period: "Jul 2026", type: "Attribution", created: "Aug 1", format: "CSV" },
];

interface Scheduled {
  name: string;
  cadence: string;
  channel: string;
  format: "PDF" | "CSV" | "Email";
}
const SCHEDULED: Scheduled[] = [
  { name: "Weekly Acquisition Summary", cadence: "Every Monday · 8:00 AM", channel: "Email to owners", format: "Email" },
  { name: "Monthly Board Report", cadence: "1st of month", channel: "PDF to leadership", format: "PDF" },
  { name: "Agency Client Rollup", cadence: "Every Monday", channel: "PDF to agency", format: "PDF" },
];

export function ReportsView() {
  return (
    <div className="space-y-6">
      {/* Templates */}
      <div>
        <h2 className="text-[13px] font-semibold uppercase tracking-wide text-ink-subtle">
          Generate a report
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TEMPLATES.map((t) => (
            <div
              key={t.id}
              className="group flex flex-col rounded-xl border border-border bg-surface p-4 shadow-card transition-all hover:border-border-strong hover:shadow-elevated"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <t.icon className="h-[18px] w-[18px]" />
                </span>
                <h3 className="text-[14px] font-semibold text-ink">{t.name}</h3>
              </div>
              <p className="mt-2 flex-1 text-[12.5px] leading-relaxed text-ink-muted">{t.desc}</p>
              <div className="mt-3 flex gap-2">
                <button className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-[12.5px] font-medium text-white transition-colors hover:bg-brand-700">
                  <FileText className="h-3.5 w-3.5" />
                  PDF
                </button>
                <button className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border-strong px-3 py-1.5 text-[12.5px] font-medium text-ink transition-colors hover:bg-surface-2">
                  <Download className="h-3.5 w-3.5" />
                  CSV
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Saved reports */}
      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h3 className="text-sm font-semibold text-ink">Recent reports</h3>
            <p className="mt-0.5 text-[12.5px] text-ink-subtle">Saved and exported reports</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-left">
            <thead>
              <tr className="border-b border-border text-[11px] uppercase tracking-wide text-ink-subtle">
                <th className="px-3 py-2.5 pl-5 font-medium">Report</th>
                <th className="hidden px-3 py-2.5 font-medium sm:table-cell">Period</th>
                <th className="hidden px-3 py-2.5 font-medium md:table-cell">Created</th>
                <th className="px-3 py-2.5 font-medium">Format</th>
                <th className="px-3 py-2.5 pr-5 text-right font-medium">Download</th>
              </tr>
            </thead>
            <tbody>
              {SAVED.map((r) => (
                <tr key={r.name} className="border-b border-border/60 text-[13px] transition-colors last:border-0 hover:bg-surface-2/60">
                  <td className="px-3 py-3 pl-5">
                    <div className="font-medium text-ink">{r.name}</div>
                    <div className="mt-0.5 text-[11.5px] text-ink-subtle sm:hidden">{r.period}</div>
                  </td>
                  <td className="hidden px-3 py-3 text-ink-muted sm:table-cell">{r.period}</td>
                  <td className="hidden px-3 py-3 text-ink-muted md:table-cell">{r.created}</td>
                  <td className="px-3 py-3">
                    <Pill tone={r.format === "PDF" ? "brand" : "neutral"}>{r.format}</Pill>
                  </td>
                  <td className="px-3 py-3 pr-5 text-right">
                    <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink" aria-label="Download">
                      <Download className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scheduled */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-ink-subtle" />
          <h2 className="text-[13px] font-semibold uppercase tracking-wide text-ink-subtle">
            Scheduled
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {SCHEDULED.map((s) => (
            <div key={s.name} className="rounded-xl border border-border bg-surface p-4 shadow-card">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-[13.5px] font-semibold text-ink">{s.name}</h3>
                <Pill tone="money" dot>Active</Pill>
              </div>
              <p className="mt-2 text-[12.5px] text-ink-muted">{s.cadence}</p>
              <p className="mt-0.5 text-[12px] text-ink-subtle">{s.channel}</p>
            </div>
          ))}
        </div>
      </div>

      <p className={cn("text-[12px] text-ink-subtle")}>
        Exports are illustrative in this demo. Saved views, CSV and PDF generation, and
        scheduled delivery connect to live data once integrations are enabled.
      </p>
    </div>
  );
}
