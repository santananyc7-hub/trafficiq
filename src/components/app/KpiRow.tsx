import { Delta } from "@/components/ui/Badge";
import { KPIS } from "@/lib/demo";
import { money, number, pct } from "@/lib/format";
import { cn } from "@/lib/cn";

interface Kpi {
  label: string;
  value: string;
  delta: number;
  invert?: boolean;
  tone?: "money" | "ink";
  primary?: boolean;
}

const KPI_LIST: Kpi[] = [
  { label: "New Customers", value: number(KPIS.newCustomers), delta: KPIS.newCustomersDelta, primary: true },
  { label: "First-Purchase Revenue", value: money(KPIS.firstRevenue), delta: KPIS.firstRevenueDelta, tone: "money" },
  { label: "Blended CAC", value: money(KPIS.blendedCac, { cents: true }), delta: KPIS.blendedCacDelta, invert: true },
  { label: "30-Day New-Customer Value", value: money(KPIS.value30), delta: KPIS.value30Delta, tone: "money" },
  { label: "Return Rate", value: pct(KPIS.returnRate), delta: KPIS.returnRateDelta },
];

export function KpiRow() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      {KPI_LIST.map((k) => (
        <div
          key={k.label}
          className={cn(
            "rounded-xl border bg-surface p-4 shadow-card",
            k.primary
              ? "col-span-2 border-brand-300 ring-1 ring-brand-200 lg:col-span-1"
              : "border-border"
          )}
        >
          <p className="text-[11.5px] font-medium uppercase tracking-wide text-ink-subtle">
            {k.label}
          </p>
          <p
            className={cn(
              "tabular mt-2 font-semibold tracking-tight",
              k.primary ? "text-[32px] leading-none lg:text-[30px]" : "text-[26px] leading-none",
              k.tone === "money" ? "text-money-strong" : "text-ink"
            )}
          >
            {k.value}
          </p>
          <div className="mt-2">
            <Delta value={k.delta} invert={k.invert} suffix="vs prev" />
          </div>
        </div>
      ))}
    </div>
  );
}
