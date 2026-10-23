import { getSnapshot } from "@/server/snapshot";
import CaptureMap from "./CaptureMap";
import origins from "../../../data/geo/zip-origins.json";

/* Command Center — the real product. Server component: reads the latest
   aggregate snapshot from Neon (or the committed fallback). Revalidates hourly
   so the weekly cron's fresh numbers appear without a redeploy. */

export const revalidate = 3600;

const usd = (n: number) => "$" + Math.round(n).toLocaleString("en-US");
const usdK = (n: number) => "$" + Math.round(n / 1000) + "k";
const pct = (n: number) => (n * 100).toFixed(1) + "%";

function Kpi({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl p-4" style={{ background: "rgb(var(--surface-2))" }}>
      <div className="text-[12px] font-medium uppercase tracking-wide" style={{ color: "rgb(var(--ink-subtle))" }}>{label}</div>
      <div className="mt-1 text-2xl font-semibold tabular" style={{ color: "rgb(var(--ink))" }}>{value}</div>
      {sub && <div className="mt-0.5 text-[12px]" style={{ color: "rgb(var(--ink-muted))" }}>{sub}</div>}
    </div>
  );
}

export default async function LivePage() {
  const d = await getSnapshot();
  const visitValue = d.realLTV / (d.avgTxns || 1);
  const chanTotal = Object.values(d.channel).reduce((a, b) => a + b, 0) || 1;
  const topChannel = Object.entries(d.channel).sort((a, b) => b[1] - a[1])[0] ?? (["Dutchie", 0] as [string, number]);
  const dormantSum = d.rows.reduce((s, r) => s + r.dormant, 0);
  const reactivateSum = d.rows.reduce((s, r) => s + r["reactivate$"], 0);
  const turf = (d.rows.filter((r) => r.status === "our turf").sort((a, b) => b["capture$"] - a["capture$"])[0] ?? d.rows[0])!;

  const moves = [
    { tag: "Frequency", title: "Lift repeat rate — your biggest lever",
      body: `${d.active.toLocaleString()} active customers visit just ${d.avgTxns.toFixed(1)}×/yr (repeat rate ${pct(d.repeatRate)}). A +5pt lift via your Dutchie menu + SMS ≈ one extra visit from ${Math.round(d.active * 0.05).toLocaleString()} customers.`,
      value: Math.round(d.active * 0.05) * visitValue,
      how: "Automated SMS/email reorder nudges to one-and-done customers through your owned channel (96% of orders already flow there)." },
    { tag: "Reactivate", title: "Win back the dormant base near you",
      body: `${dormantSum.toLocaleString()} customers in your core catchment haven't bought in a year. Reactivating at your real ${pct(d.repeatRate)} repeat rate recovers lost revenue.`,
      value: reactivateSum,
      how: "Geo-targeted win-back offer to lapsed customers, by ZIP, fired from Alpine IQ." },
    { tag: "Capture", title: `Own your doorstep — ${turf.name}`,
      body: `${turf.name} (${turf.zip}) is your turf (you're closest) yet you have only ${turf.activeY} active customers in ${turf.pop.toLocaleString()} people — penetration ${pct(turf.penetration)}. Pure local upside.`,
      value: turf["capture$"],
      how: "Local referral + Google Business Profile radius push concentrated on this ZIP." },
  ].sort((a, b) => b.value - a.value);

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-5 py-10" style={{ background: "rgb(var(--canvas))" }}>
      <header className="mb-1 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full" style={{ background: "rgb(var(--signal))" }} />
        <span className="text-[12px] font-semibold uppercase tracking-[0.18em]" style={{ color: "rgb(var(--ink-subtle))" }}>
          Live Dutchie data · {topChannel[0]} {pct(topChannel[1] / chanTotal)} of orders{d.updatedAt ? ` · refreshed ${new Date(d.updatedAt).toLocaleDateString()}` : ""}
        </span>
      </header>
      <h1 className="text-2xl font-semibold" style={{ color: "rgb(var(--ink))" }}>Torches — Command Center</h1>
      <p className="mt-1 text-sm" style={{ color: "rgb(var(--ink-muted))" }}>
        Where your next customers come from — and the one move that drives the most traffic this week.
      </p>

      <section className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi label="Active customers" value={d.active.toLocaleString()} sub="bought in last 12 mo" />
        <Kpi label="Repeat rate" value={pct(d.repeatRate)} sub={`${d.avgTxns.toFixed(1)} visits/yr`} />
        <Kpi label="Value / customer" value={usd(d.realLTV)} sub="actual annual spend" />
        <Kpi label="Visit value" value={usd(visitValue)} sub="per transaction" />
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-wide" style={{ color: "rgb(var(--ink-subtle))" }}>This week&apos;s moves</h2>
        <div className="space-y-3">
          {moves.map((m) => (
            <div key={m.title} className="rounded-xl border p-4" style={{ background: "rgb(var(--surface))", borderColor: "rgb(var(--border))" }}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="rounded-full px-2 py-0.5 text-[11px] font-semibold" style={{ background: "rgb(var(--brand-50))", color: "rgb(var(--brand-600))" }}>{m.tag}</span>
                  <h3 className="mt-2 text-[15px] font-semibold" style={{ color: "rgb(var(--ink))" }}>{m.title}</h3>
                  <p className="mt-1 text-[13px]" style={{ color: "rgb(var(--ink-muted))" }}>{m.body}</p>
                  <p className="mt-1.5 text-[12px]" style={{ color: "rgb(var(--ink-subtle))" }}>→ {m.how}</p>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-lg font-semibold tabular" style={{ color: "rgb(var(--money))" }}>{usdK(m.value)}</div>
                  <div className="text-[11px]" style={{ color: "rgb(var(--ink-subtle))" }}>/yr opportunity</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-2 text-[11px]" style={{ color: "rgb(var(--ink-subtle))" }}>
          Real: active, repeat rate, LTV, penetration, channel. Modeled: capture conversion (5%) and reactivation win-back rates.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-wide" style={{ color: "rgb(var(--ink-subtle))" }}>Channels — where orders come from</h2>
        <div className="rounded-xl border p-4" style={{ background: "rgb(var(--surface))", borderColor: "rgb(var(--border))" }}>
          {Object.entries(d.channel).sort((a, b) => b[1] - a[1]).map(([name, count]) => {
            const p = count / chanTotal;
            return (
              <div key={name} className="mb-3 last:mb-0">
                <div className="flex items-baseline justify-between text-[13px]">
                  <span style={{ color: "rgb(var(--ink))" }}>{name}</span>
                  <span className="tabular" style={{ color: "rgb(var(--ink-muted))" }}>{pct(p)}</span>
                </div>
                <div className="mt-1 h-1.5 w-full rounded-full" style={{ background: "rgb(var(--surface-3))" }}>
                  <div className="h-1.5 rounded-full" style={{ width: `${Math.max(2, p * 100)}%`, background: "rgb(var(--brand-600))" }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {d.segments && (
        <section className="mt-8">
          <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-wide" style={{ color: "rgb(var(--ink-subtle))" }}>Customer mix</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Kpi label="Total customers" value={d.segments.totalCustomers.toLocaleString()} sub="on file (with ZIP)" />
            <Kpi label="Active (1 yr)" value={d.segments.active.toLocaleString()} />
            <Kpi label="New (90 days)" value={d.segments.newCustomers.toLocaleString()} />
            <Kpi label="Repeat" value={d.segments.repeat.toLocaleString()} sub={`${pct(d.segments.repeat / (d.segments.active || 1))} of active`} />
            <Kpi label="One-and-done" value={d.segments.oneAndDone.toLocaleString()} sub="single visit" />
            <Kpi label="Dormant" value={d.segments.dormant.toLocaleString()} sub="no purchase in 1 yr" />
            <Kpi label="VIP (top 10%)" value={d.segments.vip.toLocaleString()} sub={`${pct(d.segments.vipRevenueShare)} of revenue`} />
            <Kpi label="Loyalty members" value={d.segments.loyaltyMembers.toLocaleString()} />
          </div>
        </section>
      )}

      <section className="mt-8">
        <h2 className="mb-1 text-[13px] font-semibold uppercase tracking-wide" style={{ color: "rgb(var(--ink-subtle))" }}>Capture map</h2>
        <p className="mb-2 text-[12px]" style={{ color: "rgb(var(--ink-muted))" }}>
          Heat = where your customers come from · circles = $/yr opportunity (blue your turf, orange competitor-held) · pulsing node = Torches · lines = signals converging
        </p>
        <CaptureMap rows={d.rows} origins={origins} />
      </section>
    </main>
  );
}
