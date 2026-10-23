"use client";

import { useState } from "react";

/* The tool layer: turns the analysis into executable plays — copy-ready
   campaign copy + exportable target lists you can run in Alpine IQ, Dutchie,
   or a geofence/ad platform. No PII leaves here; exports are segment
   definitions + geo-targets, not customer records. */

interface Row { zip: string; name: string; status: string; activeY: number; annual: number; ["capture$"]: number; pop: number; match: number; penetration: number; }
interface Props {
  active: number; repeatRate: number; realLTV: number; avgTxns: number;
  segments?: { oneAndDone: number; dormant: number; vip: number; newCustomers: number; totalCustomers: number; loyaltyMembers: number };
  rows: Row[];
}

const usd = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

function download(name: string, text: string) {
  const b = new Blob([text], { type: "text/plain;charset=utf-8" });
  const u = URL.createObjectURL(b);
  const a = document.createElement("a");
  a.href = u; a.download = name; a.click();
  URL.revokeObjectURL(u);
}

export default function Actions(d: Props) {
  const [copied, setCopied] = useState("");
  const copy = (id: string, text: string) => navigator.clipboard.writeText(text).then(() => { setCopied(id); setTimeout(() => setCopied(""), 1400); });
  const seg = d.segments;
  const ltv = d.realLTV;

  const targets = [...d.rows].sort((a, b) => b.annual - a.annual).slice(0, 8);
  const geoCsv = "zip,neighborhood,status,active_customers,matching_population,penetration_pct,annual_opportunity\n" +
    targets.map((r) => `${r.zip},"${r.name}",${r.status},${r.activeY},${Math.round(r.pop * r.match)},${(r.penetration * 100).toFixed(2)},${Math.round(r.annual)}`).join("\n");

  const reactivateN = seg?.oneAndDone ?? 0;
  const reactivateSms = "Torches NYC 🌿 We saved your spot — 15% off your next visit through Sunday. Order ahead: [your Dutchie menu link]. Txt STOP to opt out.";
  const reactivate$ = Math.round(reactivateN * 0.12 * ltv);

  const vipN = seg?.vip ?? 0;
  const vipSms = "You’re a Torches VIP 💜 Refer a friend and you BOTH get $10 off your next order. Your code: [CODE]. Share it → [link].";
  const vip$ = Math.round(vipN * 0.15 * ltv);

  const plays = [
    {
      id: "react", tag: "Reactivate",
      title: "Win back your one-and-done base",
      target: `${reactivateN.toLocaleString()} customers who bought once in the last year`,
      proj: reactivate$,
      msg: reactivateSms,
      how: "Owned channel (SMS/email via Alpine IQ) — the one lever that moves your 14.9% repeat rate.",
      brief: () => download("reactivation-play.txt",
        `TORCHES — REACTIVATION PLAY\n\nSegment: one-and-done customers (bought exactly once in last 12 mo)\nAudience size: ${reactivateN.toLocaleString()}\nChannel: SMS/email via Alpine IQ (your opted-in base)\nOffer: 15% off next visit, expires Sunday\nProjected: ~${Math.round(reactivateN * 0.12).toLocaleString()} return visits ≈ ${usd(reactivate$)} at ${usd(ltv)} LTV\n\nSuggested message:\n${reactivateSms}\n\nTo run: Alpine IQ → Audiences → filter "purchases = 1, last 12 mo" → new campaign → paste message → schedule.`),
    },
    {
      id: "geo", tag: "Acquire",
      title: "Target look-alike neighborhoods",
      target: `${targets.length} high-match ZIPs where you under-penetrate`,
      proj: targets.reduce((s, r) => s + r["capture$"], 0),
      msg: `Geofence / Weedmaps / local mailers to adults 25–45 in: ${targets.map((t) => t.zip).join(", ")}`,
      how: "Concentrate local spend on the ZIPs with your best-customer profile but few active customers.",
      brief: () => download("geo-target-pack.csv", geoCsv),
    },
    {
      id: "vip", tag: "Refer",
      title: "Turn VIPs into a referral engine",
      target: `${vipN.toLocaleString()} VIPs (top 10% — ${seg ? Math.round((seg ? 0.578 : 0) * 100) : 58}% of revenue)`,
      proj: vip$,
      msg: vipSms,
      how: "Your highest-value customers are the cheapest new-customer channel. A $10/$10 referral pays for itself.",
      brief: () => download("vip-referral-play.txt",
        `TORCHES — VIP REFERRAL PLAY\n\nSegment: top 10% of customers by spend (≈58% of revenue)\nAudience size: ${vipN.toLocaleString()}\nChannel: SMS/email via Alpine IQ\nOffer: $10 for referrer + $10 for new customer\nProjected: ~${Math.round(vipN * 0.15).toLocaleString()} new customers ≈ ${usd(vip$)}\n\nSuggested message:\n${vipSms}\n\nTo run: Alpine IQ → Audiences → top-spend segment → referral campaign with unique codes.`),
    },
  ].sort((a, b) => b.proj - a.proj);

  return (
    <section className="mt-8">
      <h2 className="mb-1 text-[13px] font-semibold uppercase tracking-wide" style={{ color: "rgb(var(--ink-subtle))" }}>Launch a play</h2>
      <p className="mb-3 text-[12px]" style={{ color: "rgb(var(--ink-muted))" }}>
        Executable campaigns built from your data — copy the message, export the target, run it in Alpine IQ / Dutchie. No customer records leave here.
      </p>
      <div className="grid gap-3 md:grid-cols-3">
        {plays.map((p) => (
          <div key={p.id} className="flex flex-col rounded-xl border p-4" style={{ background: "rgb(var(--surface))", borderColor: "rgb(var(--border))" }}>
            <div className="flex items-center justify-between">
              <span className="rounded-full px-2 py-0.5 text-[11px] font-semibold" style={{ background: "rgb(var(--brand-50))", color: "rgb(var(--brand-600))" }}>{p.tag}</span>
              <span className="text-[15px] font-semibold tabular" style={{ color: "rgb(var(--signal))" }}>{usd(p.proj)}<span className="text-[11px]" style={{ color: "rgb(var(--ink-subtle))" }}>/yr</span></span>
            </div>
            <h3 className="mt-2 text-[14px] font-semibold" style={{ color: "rgb(var(--ink))" }}>{p.title}</h3>
            <p className="mt-1 text-[12px]" style={{ color: "rgb(var(--ink-muted))" }}>{p.target}</p>
            <p className="mt-2 rounded-lg p-2 text-[11.5px] leading-snug" style={{ background: "rgb(var(--surface-2))", color: "rgb(var(--ink-muted))" }}>{p.msg}</p>
            <p className="mt-2 text-[11px]" style={{ color: "rgb(var(--ink-subtle))" }}>{p.how}</p>
            <div className="mt-3 flex gap-2">
              <button onClick={() => copy(p.id, p.msg)} className="flex-1 rounded-lg px-2 py-1.5 text-[12px] font-medium transition" style={{ background: "rgb(var(--brand-600))", color: "#fff" }}>
                {copied === p.id ? "Copied ✓" : "Copy message"}
              </button>
              <button onClick={p.brief} className="flex-1 rounded-lg border px-2 py-1.5 text-[12px] font-medium" style={{ borderColor: "rgb(var(--border-strong))", color: "rgb(var(--ink))" }}>
                Export target
              </button>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[11px]" style={{ color: "rgb(var(--ink-subtle))" }}>
        Next: one-click send straight to Alpine IQ (with your approval on each send) turns these from exports into fully automated plays.
      </p>
    </section>
  );
}
