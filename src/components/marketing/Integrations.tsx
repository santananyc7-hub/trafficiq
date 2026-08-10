import { ArrowDown } from "lucide-react";
import { Section, SectionHeader } from "@/components/marketing/primitives";
import { Pill } from "@/components/ui/Badge";
import { LogoSymbol } from "@/components/brand/Logo";
import { cn } from "@/lib/cn";

const SYSTEMS = [
  { name: "Dutchie", role: "POS & E-commerce", provides: ["Transactions", "Products", "Orders"] },
  { name: "Alpine IQ", role: "Loyalty & CRM", provides: ["Segments", "Loyalty", "Campaigns"] },
  { name: "Headset", role: "Market data", provides: ["Market data", "Category benchmarks"] },
];

const OUTPUTS = ["Transactions", "Customers", "Campaigns", "Market data"];

const PLANNED = [
  "Google Analytics",
  "Google Business Profile",
  "Meta",
  "Weedmaps",
  "Leafly",
];

function Connector() {
  return (
    <div className="flex justify-center py-3" aria-hidden="true">
      <div className="flex flex-col items-center text-ink-subtle">
        <span className="h-6 w-px bg-border-strong" />
        <ArrowDown className="-mt-1 h-4 w-4" />
      </div>
    </div>
  );
}

export function Integrations() {
  return (
    <Section id="integrations" className="py-16 sm:py-24">
      <SectionHeader
        eyebrow="Integrations"
        title="Works with the stack you already have."
        description="TrafficIQ sits above your existing retail systems — it doesn't replace them."
      />

      <div className="mt-12 rounded-2xl border border-border bg-surface/50 p-5 shadow-card sm:p-8">
        {/* Top layer — signals in */}
        <div className="flex flex-col items-center text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-subtle">
            Customer Acquisition
          </p>
          <p className="mt-1 text-[13px] text-ink-muted">
            Every marketing touch and store visit — the signals that produce customers.
          </p>
        </div>

        <Connector />

        {/* TrafficIQ hub */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-3 rounded-xl border border-brand-300 bg-brand-50 px-5 py-3 shadow-glow-brand ring-1 ring-brand-200">
            <LogoSymbol size={26} />
            <div className="text-left">
              <p className="text-[15px] font-semibold tracking-brand text-ink">
                Traffic<span className="text-brand-600">IQ</span>
              </p>
              <p className="text-[11.5px] text-ink-muted">Acquisition intelligence layer</p>
            </div>
          </div>
        </div>

        <Connector />

        {/* System cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          {SYSTEMS.map((s) => (
            <div
              key={s.name}
              className="rounded-xl border border-border bg-surface p-4 shadow-card"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[15px] font-semibold text-ink">{s.name}</p>
                  <p className="text-[12px] text-ink-subtle">{s.role}</p>
                </div>
                <Pill tone="money" dot>
                  Connected
                </Pill>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {s.provides.map((p) => (
                  <span
                    key={p}
                    className="rounded-md border border-border bg-surface-2 px-2 py-0.5 text-[11.5px] font-medium text-ink-muted"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Connector />

        {/* Bottom layer — normalized data chips */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {OUTPUTS.map((o) => (
            <span
              key={o}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-[12.5px] font-medium text-ink-muted"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[rgb(var(--signal))]" />
              {o}
            </span>
          ))}
        </div>
      </div>

      {/* Coming soon */}
      <div className="mt-8">
        <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-ink-subtle">
          Coming soon
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {PLANNED.map((name) => (
            <div
              key={name}
              className={cn(
                "flex items-center justify-between gap-2 rounded-xl border border-dashed border-border bg-surface/40 px-3.5 py-3"
              )}
            >
              <span className="text-[13.5px] font-medium text-ink-muted">{name}</span>
              <Pill tone="neutral">Planned</Pill>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-6 text-[12px] text-ink-subtle">
        Integrations shown are illustrative of planned and supported connections; no
        partnership or endorsement is implied.
      </p>
    </Section>
  );
}
