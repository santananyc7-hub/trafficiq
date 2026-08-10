import { LayoutDashboard, Map, Megaphone, Route, Target, Users } from "lucide-react";
import { Section, SectionHeader } from "@/components/marketing/primitives";
import { Sparkline } from "@/components/ui/Sparkline";
import { Delta } from "@/components/ui/Badge";
import { LogoSymbol } from "@/components/brand/Logo";
import { CHANNELS_DERIVED, KPIS } from "@/lib/demo";
import { money, moneyCompact, number, pct } from "@/lib/format";
import { cn } from "@/lib/cn";

const NAV = [
  { icon: LayoutDashboard, label: "Overview", active: true },
  { icon: Route, label: "Acquisition" },
  { icon: Map, label: "Traffic Map" },
  { icon: Megaphone, label: "Campaigns" },
  { icon: Target, label: "Opportunities" },
  { icon: Users, label: "Customers" },
];

const KPIS_VIEW = [
  { label: "New Customers", value: number(KPIS.newCustomers), delta: KPIS.newCustomersDelta, primary: true },
  { label: "First-Purchase Rev", value: money(KPIS.firstRevenue), delta: KPIS.firstRevenueDelta, tone: "money" as const },
  { label: "Blended CAC", value: money(KPIS.blendedCac, { cents: true }), delta: KPIS.blendedCacDelta, invert: true },
  { label: "30-Day Value", value: money(KPIS.value30), delta: KPIS.value30Delta, tone: "money" as const },
  { label: "Return Rate", value: pct(KPIS.returnRate), delta: KPIS.returnRateDelta },
];

export function ProductReveal() {
  const rows = [...CHANNELS_DERIVED]
    .sort((a, b) => b.newCustomers - a.newCustomers)
    .slice(0, 6);

  return (
    <Section id="product" className="py-16 sm:py-24">
      <SectionHeader
        align="center"
        eyebrow="The Platform"
        title="Meet your customer acquisition command center."
        description="Every new customer, traced back to the marketing that produced them — and priced by what they're actually worth."
      />

      <div className="relative mt-12">
        <div
          className="pointer-events-none absolute inset-x-0 -top-2 bottom-0 -z-10 rounded-[32px] opacity-40 blur-[100px]"
          style={{ background: "rgb(var(--brand-500))" }}
        />
        <BrowserFrame url="app.trafficiq.com/overview">
          <div className="flex min-h-[420px]">
            {/* Mini sidebar */}
            <aside className="hidden w-52 shrink-0 flex-col border-r border-border bg-surface p-3 md:flex">
              <div className="flex items-center gap-2 px-2 py-1.5">
                <LogoSymbol size={22} />
                <span className="text-[15px] font-semibold tracking-brand text-ink">
                  Traffic<span className="text-brand-600">IQ</span>
                </span>
              </div>
              <nav className="mt-4 space-y-0.5">
                {NAV.map((n) => (
                  <div
                    key={n.label}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium",
                      n.active
                        ? "bg-brand-50 text-brand-700"
                        : "text-ink-muted"
                    )}
                  >
                    <n.icon
                      className={cn(
                        "h-4 w-4",
                        n.active ? "text-brand-600" : "text-ink-subtle"
                      )}
                    />
                    {n.label}
                  </div>
                ))}
              </nav>
              <div className="mt-auto rounded-lg border border-border bg-surface-2 p-2.5">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-subtle">
                  Store
                </p>
                <p className="mt-0.5 text-[12px] font-medium text-ink">
                  Midtown Manhattan
                </p>
              </div>
            </aside>

            {/* Main */}
            <div className="min-w-0 flex-1 bg-canvas p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] text-ink-muted">Good morning, Jonathan</p>
                  <h3 className="text-[17px] font-semibold text-ink">
                    Here&apos;s how customer acquisition is performing.
                  </h3>
                </div>
                <span className="hidden rounded-lg border border-border bg-surface px-2.5 py-1 text-[12px] font-medium text-ink-muted sm:block">
                  Last 7 days
                </span>
              </div>

              {/* KPI row */}
              <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
                {KPIS_VIEW.map((k) => (
                  <div
                    key={k.label}
                    className={cn(
                      "rounded-xl border bg-surface p-3",
                      k.primary
                        ? "border-brand-300 ring-1 ring-brand-200"
                        : "border-border"
                    )}
                  >
                    <p className="text-[10.5px] font-medium uppercase tracking-wide text-ink-subtle">
                      {k.label}
                    </p>
                    <p
                      className={cn(
                        "tabular mt-1.5 text-[22px] font-semibold leading-none tracking-tight",
                        k.tone === "money" ? "text-money-strong" : "text-ink"
                      )}
                    >
                      {k.value}
                    </p>
                    <div className="mt-1.5">
                      <Delta value={k.delta} suffix="" invert={k.invert} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Channel table */}
              <div className="mt-3 overflow-hidden rounded-xl border border-border bg-surface">
                <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                  <p className="text-[13px] font-semibold text-ink">
                    Acquisition Channels
                  </p>
                  <p className="text-[11.5px] text-ink-subtle">Ranked by new customers</p>
                </div>
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10.5px] uppercase tracking-wide text-ink-subtle">
                      <th className="px-4 py-2 font-medium">Source</th>
                      <th className="px-2 py-2 text-right font-medium">New</th>
                      <th className="px-2 py-2 text-right font-medium">CAC</th>
                      <th className="hidden px-2 py-2 text-right font-medium sm:table-cell">
                        30-Day Value
                      </th>
                      <th className="hidden px-4 py-2 text-right font-medium sm:table-cell">
                        Trend
                      </th>
                    </tr>
                  </thead>
                  <tbody className="tabular">
                    {rows.map((c, i) => (
                      <tr
                        key={c.id}
                        className={cn(
                          "text-[13px]",
                          i !== rows.length - 1 && "border-b border-border/70"
                        )}
                      >
                        <td className="px-4 py-2.5 font-medium text-ink">{c.source}</td>
                        <td className="px-2 py-2.5 text-right text-ink">
                          {c.newCustomers}
                        </td>
                        <td className="px-2 py-2.5 text-right">
                          <span
                            className={cn(
                              "font-medium",
                              c.cac !== null && c.cac < 8
                                ? "text-money-strong"
                                : c.cac !== null && c.cac > 30
                                  ? "text-neg"
                                  : "text-ink"
                            )}
                          >
                            {c.cac !== null ? money(c.cac, { cents: true }) : "—"}
                          </span>
                        </td>
                        <td className="hidden px-2 py-2.5 text-right text-ink sm:table-cell">
                          {moneyCompact(c.value30PerCustomer)}
                        </td>
                        <td className="hidden px-4 py-2.5 sm:table-cell">
                          <div className="flex justify-end">
                            <Sparkline
                              data={c.trend}
                              width={72}
                              height={22}
                              strokeClass={
                                c.trend[c.trend.length - 1]! >= c.trend[0]!
                                  ? "text-money"
                                  : "text-neg"
                              }
                              fill={false}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </BrowserFrame>
      </div>
    </Section>
  );
}

export function BrowserFrame({
  url,
  children,
}: {
  url: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border-strong bg-surface shadow-pop">
      <div className="flex items-center gap-3 border-b border-border bg-surface-2 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-border-strong" />
          <span className="h-3 w-3 rounded-full bg-border-strong" />
          <span className="h-3 w-3 rounded-full bg-border-strong" />
        </div>
        <div className="mx-auto flex w-full max-w-sm items-center justify-center gap-2 rounded-md border border-border bg-canvas px-3 py-1 text-[12px] text-ink-subtle">
          <span className="h-1.5 w-1.5 rounded-full bg-money" />
          {url}
        </div>
      </div>
      {children}
    </div>
  );
}
