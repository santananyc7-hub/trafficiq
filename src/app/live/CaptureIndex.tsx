"use client";

/* The engine: a Capture Index. For every neighborhood it fuses THREE data
   points no single vendor holds together — your real customer home-ZIPs (POS),
   the matching population there (Census), and how close your competitors sit —
   into one score: where your next customers are, ranked by the dollars you're
   leaving on the table. POS and loyalty tools can't draw this map; they only
   see inside the store. */

interface Row { zip: string; name: string; status: string; activeY: number; annual: number; ["capture$"]: number; pop: number; match: number; penetration: number; }
interface Props {
  active: number; repeatRate: number; realLTV: number; avgTxns: number;
  segments?: { oneAndDone: number; dormant: number; vip: number; newCustomers: number; totalCustomers: number; loyaltyMembers: number };
  rows: Row[];
}

const usd = (n: number) => "$" + Math.round(n).toLocaleString("en-US");
const usdK = (n: number) => (n >= 1e6 ? "$" + (n / 1e6).toFixed(1) + "M" : "$" + Math.round(n / 1000) + "k");
const pct2 = (n: number) => (n * 100 < 0.1 ? (n * 100).toFixed(2) : (n * 100).toFixed(1)) + "%";
const compact = (n: number) => (n >= 1e6 ? (n / 1e6).toFixed(1) + "M" : n >= 1e3 ? Math.round(n / 1e3) + "k" : String(Math.round(n)));

function download(name: string, text: string) {
  const b = new Blob([text], { type: "text/csv;charset=utf-8" });
  const u = URL.createObjectURL(b);
  const a = document.createElement("a");
  a.href = u; a.download = name; a.click();
  URL.revokeObjectURL(u);
}

function statusTone(s: string): { bg: string; fg: string; label: string } {
  const t = s.toLowerCase();
  if (t.includes("turf")) return { bg: "rgb(var(--signal) / 0.15)", fg: "rgb(var(--signal-strong))", label: "Your turf" };
  if (t.includes("compet") || t.includes("contest")) return { bg: "rgb(var(--opp-soft))", fg: "rgb(var(--opp))", label: "Contested" };
  return { bg: "rgb(var(--surface-3))", fg: "rgb(var(--ink-muted))", label: s };
}

export default function CaptureIndex(d: Props) {
  const ranked = [...d.rows].sort((a, b) => b["capture$"] - a["capture$"]);
  const maxCap = Math.max(1, ...ranked.map((r) => r["capture$"]));
  const totalUpside = ranked.reduce((s, r) => s + r["capture$"], 0);
  const totalAddressable = ranked.reduce((s, r) => s + r.pop * r.match, 0);
  const top = ranked.slice(0, 12);

  const csv = "rank,zip,neighborhood,status,capture_score,your_active_customers,addressable_population,penetration_pct,annual_opportunity_usd\n" +
    ranked.map((r, i) => `${i + 1},${r.zip},"${r.name}",${r.status},${Math.round((r["capture$"] / maxCap) * 100)},${r.activeY},${Math.round(r.pop * r.match)},${(r.penetration * 100).toFixed(2)},${Math.round(r["capture$"])}`).join("\n");

  return (
    <section id="engine" className="mt-8 rounded-2xl border p-5" style={{ background: "rgb(var(--surface))", borderColor: "rgb(var(--brand-600))" }}>
      <div className="mb-1 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full" style={{ background: "rgb(var(--signal))" }} />
        <h2 className="text-[13px] font-semibold uppercase tracking-wide" style={{ color: "rgb(var(--brand-600))" }}>The engine · Capture Index</h2>
      </div>
      <p className="mb-4 max-w-3xl text-[12.5px] leading-relaxed" style={{ color: "rgb(var(--ink-muted))" }}>
        Every neighborhood scored on one number — where your next customers are. It fuses your real customer home-ZIPs with the matching population there and how close competitors sit, then ranks by the revenue you&apos;re leaving on the table. Your POS and loyalty tools can&apos;t build this: they only see who already walked in.
      </p>

      <div className="mb-4 grid grid-cols-3 gap-3">
        <div className="rounded-xl p-3" style={{ background: "rgb(var(--surface-2))" }}>
          <div className="text-[11px] uppercase tracking-wide" style={{ color: "rgb(var(--ink-subtle))" }}>Untapped upside</div>
          <div className="mt-0.5 text-xl font-semibold tabular" style={{ color: "rgb(var(--money))" }}>{usdK(totalUpside)}<span className="text-[11px] font-normal" style={{ color: "rgb(var(--ink-subtle))" }}>/yr</span></div>
        </div>
        <div className="rounded-xl p-3" style={{ background: "rgb(var(--surface-2))" }}>
          <div className="text-[11px] uppercase tracking-wide" style={{ color: "rgb(var(--ink-subtle))" }}>Neighborhoods ranked</div>
          <div className="mt-0.5 text-xl font-semibold tabular" style={{ color: "rgb(var(--ink))" }}>{ranked.length.toLocaleString()}</div>
        </div>
        <div className="rounded-xl p-3" style={{ background: "rgb(var(--surface-2))" }}>
          <div className="text-[11px] uppercase tracking-wide" style={{ color: "rgb(var(--ink-subtle))" }}>Addressable nearby</div>
          <div className="mt-0.5 text-xl font-semibold tabular" style={{ color: "rgb(var(--ink))" }}>{compact(totalAddressable)}<span className="text-[11px] font-normal" style={{ color: "rgb(var(--ink-subtle))" }}> people who match</span></div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border" style={{ borderColor: "rgb(var(--border))" }}>
        <div className="hidden grid-cols-[28px_1fr_120px_84px_72px_96px] items-center gap-3 px-3 py-2 text-[10.5px] font-semibold uppercase tracking-wide md:grid" style={{ background: "rgb(var(--surface-2))", color: "rgb(var(--ink-subtle))" }}>
          <span>#</span><span>Neighborhood</span><span>Capture score</span><span className="text-right">You have</span><span className="text-right">Penetration</span><span className="text-right">Opp / yr</span>
        </div>
        {top.map((r, i) => {
          const score = Math.round((r["capture$"] / maxCap) * 100);
          const addressable = Math.round(r.pop * r.match);
          const tone = statusTone(r.status);
          return (
            <div key={r.zip} className="grid grid-cols-2 items-center gap-x-3 gap-y-1 border-t px-3 py-2.5 md:grid-cols-[28px_1fr_120px_84px_72px_96px]" style={{ borderColor: "rgb(var(--border))" }}>
              <span className="text-[13px] font-semibold tabular" style={{ color: "rgb(var(--ink-subtle))" }}>{i + 1}</span>
              <div className="col-span-2 md:col-span-1">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold" style={{ color: "rgb(var(--ink))" }}>{r.name}</span>
                  <span className="rounded px-1.5 py-0.5 text-[10px] font-medium" style={{ background: tone.bg, color: tone.fg }}>{tone.label}</span>
                </div>
                <div className="text-[11px] tabular" style={{ color: "rgb(var(--ink-subtle))" }}>{r.zip} · {addressable.toLocaleString()} addressable</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full" style={{ background: "rgb(var(--surface-3))" }}>
                  <div className="h-1.5 rounded-full" style={{ width: `${Math.max(4, score)}%`, background: "linear-gradient(90deg, rgb(var(--signal)), rgb(var(--flux)))" }} />
                </div>
                <span className="w-6 text-right text-[12px] font-semibold tabular" style={{ color: "rgb(var(--ink))" }}>{score}</span>
              </div>
              <span className="text-right text-[12px] tabular" style={{ color: "rgb(var(--ink-muted))" }}>{r.activeY.toLocaleString()}</span>
              <span className="text-right text-[12px] tabular" style={{ color: "rgb(var(--ink-muted))" }}>{pct2(r.penetration)}</span>
              <span className="text-right text-[13px] font-semibold tabular" style={{ color: "rgb(var(--money))" }}>{usdK(r["capture$"])}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[11px]" style={{ color: "rgb(var(--ink-subtle))" }}>
          Capture score = this neighborhood&apos;s revenue opportunity vs. your strongest. Real: your customers, penetration, competitor geography, Census population. Modeled: reachable-penetration benchmark. No customer records leave here.
        </p>
        <button onClick={() => download("capture-index.csv", csv)} className="shrink-0 rounded-lg px-3.5 py-2 text-[12px] font-semibold transition" style={{ background: "rgb(var(--brand-600))", color: "#fff" }}>
          Export full target list ({ranked.length} ZIPs)
        </button>
      </div>
    </section>
  );
}
