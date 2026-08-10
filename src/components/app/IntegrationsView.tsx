import { ArrowDown, ArrowRight } from "lucide-react";
import { Pill } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

interface Connected {
  name: string;
  category: string;
  provides: string[];
  lastSync: string;
}

interface Available {
  name: string;
  category: string;
  status: "Available" | "Planned";
}

const CONNECTED: Connected[] = [
  {
    name: "Dutchie",
    category: "Point of sale",
    provides: ["Transactions", "Products", "Customers", "Orders"],
    lastSync: "4 minutes ago",
  },
  {
    name: "VeriScan",
    category: "Door traffic & ID scan",
    provides: ["Door scans", "Store visits", "New vs returning", "Age verification"],
    lastSync: "2 minutes ago",
  },
  {
    name: "Alpine IQ",
    category: "CRM & loyalty",
    provides: ["Customer segments", "Campaigns", "Loyalty"],
    lastSync: "11 minutes ago",
  },
  {
    name: "Headset",
    category: "Market intelligence",
    provides: ["Market data", "Category benchmarks"],
    lastSync: "1 hour ago",
  },
];

const AVAILABLE: Available[] = [
  { name: "Google Business Profile", category: "Local search & reviews", status: "Available" },
  { name: "Google Analytics", category: "Web analytics", status: "Available" },
  { name: "Meta", category: "Paid social", status: "Available" },
  { name: "Weedmaps", category: "Menu & discovery", status: "Planned" },
  { name: "Leafly", category: "Menu & discovery", status: "Planned" },
];

const ARCH_SOURCES = ["Google", "Meta", "Local search", "Partners", "QR codes"];
const ARCH_OUTPUTS = ["Transactions", "Customers", "Campaigns", "Market data"];

export function IntegrationsView() {
  return (
    <div className="space-y-8">
      {/* Architecture strip — TrafficIQ sits above the stack */}
      <div className="rounded-xl border border-border bg-surface p-5 shadow-card">
        <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center md:gap-4">
          <ArchLayer label="Customer acquisition" chips={ARCH_SOURCES} />
          <ArchArrow />
          <div className="flex flex-col items-center gap-1.5 rounded-lg border border-brand-200 bg-brand-50 px-4 py-3 text-center">
            <span className="text-[10.5px] font-medium uppercase tracking-wide text-brand-600">
              Intelligence layer
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-brand-700">TrafficIQ</span>
          </div>
          <ArchArrow />
          <ArchLayer label="Connected stack" chips={CONNECTED.map((c) => c.name)} />
          <ArchArrow />
          <ArchLayer label="Unified data" chips={ARCH_OUTPUTS} />
        </div>
      </div>

      {/* Connected */}
      <section>
        <SectionHeader
          title="Connected"
          description="Live connectors syncing acquisition, customer and market data into TrafficIQ."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {CONNECTED.map((c) => (
            <div
              key={c.name}
              className="flex flex-col rounded-2xl border border-border bg-surface p-4 shadow-card transition-all hover:border-border-strong hover:shadow-elevated"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <InitialTile name={c.name} />
                  <div className="min-w-0">
                    <h3 className="text-[14.5px] font-semibold leading-snug text-ink">{c.name}</h3>
                    <p className="mt-0.5 text-[11.5px] text-ink-subtle">{c.category}</p>
                  </div>
                </div>
                <Pill tone="money" dot>
                  Connected
                </Pill>
              </div>

              <div className="mt-3.5 flex flex-wrap gap-1.5">
                {c.provides.map((p) => (
                  <span
                    key={p}
                    className="rounded bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-ink-muted"
                  >
                    {p}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 border-t border-border/60 pt-3.5">
                <span className="text-[12px] text-ink-subtle">Last sync {c.lastSync}</span>
                <Button variant="secondary" size="sm">
                  Manage
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Available */}
      <section>
        <SectionHeader
          title="Available"
          description="Connect additional sources — each maps cleanly into the same acquisition model."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {AVAILABLE.map((a) => (
            <div
              key={a.name}
              className="flex flex-col rounded-2xl border border-border bg-surface/60 p-4 shadow-card transition-all hover:border-border-strong hover:shadow-elevated"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <InitialTile name={a.name} muted />
                  <div className="min-w-0">
                    <h3 className="text-[14.5px] font-semibold leading-snug text-ink">{a.name}</h3>
                    <p className="mt-0.5 text-[11.5px] text-ink-subtle">{a.category}</p>
                  </div>
                </div>
                <Pill tone="neutral">{a.status}</Pill>
              </div>

              <div className="mt-4 flex items-center justify-end border-t border-border/60 pt-3.5">
                <Button variant="secondary" size="sm" disabled={a.status === "Planned"}>
                  Connect
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <p className="text-[12px] leading-relaxed text-ink-subtle">
        Integrations are illustrative in this demo. No partnership implied; connect real APIs later
        without rebuilding the UI.
      </p>
    </div>
  );
}

function ArchLayer({ label, chips }: { label: string; chips: string[] }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2 rounded-lg border border-border bg-surface-2 px-3.5 py-3">
      <span className="text-[10.5px] font-medium uppercase tracking-wide text-ink-subtle">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {chips.map((c) => (
          <span
            key={c}
            className="rounded bg-surface px-2 py-0.5 text-[11px] font-medium text-ink-muted"
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}

function ArchArrow() {
  return (
    <div className="flex shrink-0 items-center justify-center text-ink-subtle">
      <ArrowDown className="h-4 w-4 md:hidden" />
      <ArrowRight className="hidden h-4 w-4 md:block" />
    </div>
  );
}

function InitialTile({ name, muted }: { name: string; muted?: boolean }) {
  return (
    <span
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-[16px] font-semibold",
        muted ? "text-ink-subtle" : "text-ink"
      )}
    >
      {name.charAt(0)}
    </span>
  );
}

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-3">
      <h2 className="text-lg font-semibold tracking-tight text-ink">{title}</h2>
      <p className="mt-0.5 text-[13.5px] text-ink-muted">{description}</p>
    </div>
  );
}
