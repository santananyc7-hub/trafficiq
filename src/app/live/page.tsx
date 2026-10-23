import { getSnapshot, type Snapshot } from "@/server/snapshot";

/* Command Center — the real product. Server component: reads the latest
   aggregate snapshot from Neon (or the committed fallback). Revalidates hourly
   so the weekly cron's fresh numbers appear without a redeploy. */

export const revalidate = 3600;

const usd = (n: number) => "$" + Math.round(n).toLocaleString("en-US");
const usdK = (n: number) => "$" + Math.round(n / 1000) + "k";
const pct = (n: number) => (n * 100).toFixed(1) + "%";

function Map({ rows }: { rows: Snapshot["rows"] }) {
  const comps = [
    { lat: 40.7544, lng: -73.9868 }, { lat: 40.7607, lng: -73.9837 }, { lat: 40.7589, lng: -73.9899 },
    { lat: 40.749, lng: -73.9888 }, { lat: 40.74, lng: -73.9905 },
  ];
  const T = { lat: 40.7527, lng: -73.979 };
  const all = [...rows, ...comps, T];
  const laMin = Math.min(...all.map((p) => p.lat)), laMax = Math.max(...all.map((p) => p.lat));
  const lnMin = Math.min(...all.map((p) => p.lng)), lnMax = Math.max(...all.map((p) => p.lng));
  const W = 680, H = 440, pad = 56;
  const X = (g: number) => pad + ((g - lnMin) / (lnMax - lnMin)) * (W - 2 * pad);
  const Y = (g: number) => pad + ((laMax - g) / (laMax - laMin)) * (H - 2 * pad);
  const maxv = Math.max(...rows.map((r) => r.annual), 1);
  const R = (v: number) => 6 + Math.sqrt(v / maxv) * 20;
  const tx = X(T.lng), ty = Y(T.lat);
  const sorted = [...rows].sort((a, b) => b.annual - a.annual);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {sorted.map((r, i) => {
        const x = X(r.lng), y = Y(r.lat), rad = R(r.annual);
        const col = r.status === "our turf" ? "#2563eb" : "#eb6834";
        const right = x > 500;
        return (
          <g key={r.zip}>
            <circle cx={x} cy={y} r={rad} fill={col} fillOpacity={0.2} stroke={col} strokeWidth={1} />
            <text x={x} y={y + 4} textAnchor="middle" fontSize={11} fontWeight={500} fill={col}>{r.activeY}</text>
            {i < 7 && (
              <>
                <text x={right ? x - rad - 5 : x + rad + 5} y={y - 2} textAnchor={right ? "end" : "start"} fontSize={11} fontWeight={500} fill="rgb(var(--ink))">{r.name.split(" / ")[0]}</text>
                <text x={right ? x - rad - 5 : x + rad + 5} y={y + 10} textAnchor={right ? "end" : "start"} fontSize={10} fill="rgb(var(--ink-muted))">{usdK(r.annual)}/yr</text>
              </>
            )}
          </g>
        );
      })}
      {comps.map((c, i) => {
        const x = X(c.lng), y = Y(c.lat);
        return <path key={i} d={`M${x - 5} ${y - 5}L${x + 5} ${y + 5}M${x + 5} ${y - 5}L${x - 5} ${y + 5}`} stroke="rgb(var(--ink-subtle))" strokeWidth={2} strokeLinecap="round" />;
      })}
      <path d={`M${tx} ${ty - 9}L${tx + 9} ${ty}L${tx} ${ty + 9}L${tx - 9} ${ty}Z`} fill="#1d4ed8" stroke="#fff" strokeWidth={1.5} />
      <text x={tx} y={ty + 23} textAnchor="middle" fontSize={11} fontWeight={500} fill="rgb(var(--ink))">Torches</text>
    </svg>
  );
}

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
        <h2 className="mb-1 text-[13px] font-semibold uppercase tracking-wide" style={{ color: "rgb(var(--ink-subtle))" }}>Capture map</h2>
        <p className="mb-2 text-[12px]" style={{ color: "rgb(var(--ink-muted))" }}>
          Number = active customers today · bubble = $/yr opportunity · blue = your turf, orange = competitor-held · ✕ = competitor
        </p>
        <div className="rounded-xl border p-3" style={{ background: "rgb(var(--surface))", borderColor: "rgb(var(--border))" }}>
          <Map rows={d.rows} />
        </div>
      </section>
    </main>
  );
}
