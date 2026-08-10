"use client";

import { useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { Sparkline } from "@/components/ui/Sparkline";
import { CHANNELS_DERIVED, type ChannelDerived } from "@/lib/demo";
import { money, pct } from "@/lib/format";
import { cn } from "@/lib/cn";

type Key =
  | "source"
  | "newCustomers"
  | "firstRevenue"
  | "spend"
  | "cac"
  | "value30"
  | "returnRate"
  | "roas";

const COLS: { key: Key; label: string; num: boolean; hideSm?: boolean }[] = [
  { key: "source", label: "Source", num: false },
  { key: "newCustomers", label: "New", num: true },
  { key: "firstRevenue", label: "First Rev", num: true, hideSm: true },
  { key: "spend", label: "Spend", num: true, hideSm: true },
  { key: "cac", label: "CAC", num: true },
  { key: "value30", label: "30-Day Rev", num: true, hideSm: true },
  { key: "returnRate", label: "Return", num: true, hideSm: true },
  { key: "roas", label: "ROAS", num: true },
];

export function ChannelsTable() {
  const [sort, setSort] = useState<Key>("newCustomers");
  const [dir, setDir] = useState<1 | -1>(-1);

  const rows = [...CHANNELS_DERIVED].sort((a, b) => {
    const av = a[sort] ?? -Infinity;
    const bv = b[sort] ?? -Infinity;
    if (typeof av === "string" && typeof bv === "string")
      return av.localeCompare(bv) * dir;
    return ((av as number) - (bv as number)) * dir;
  });

  function toggle(k: Key) {
    if (k === sort) setDir((d) => (d === 1 ? -1 : 1));
    else {
      setSort(k);
      setDir(k === "source" ? 1 : -1);
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h3 className="text-sm font-semibold text-ink">Acquisition Channels</h3>
          <p className="mt-0.5 text-[12.5px] text-ink-subtle">
            Where your 427 new customers came from this period
          </p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-left">
          <thead>
            <tr className="border-b border-border text-[11px] uppercase tracking-wide text-ink-subtle">
              {COLS.map((c) => (
                <th
                  key={c.key}
                  className={cn(
                    "px-3 py-2.5 font-medium first:pl-5",
                    c.num && "text-right",
                    c.hideSm && "hidden md:table-cell"
                  )}
                >
                  <button
                    onClick={() => toggle(c.key)}
                    className={cn(
                      "inline-flex items-center gap-1 hover:text-ink",
                      c.num && "flex-row-reverse",
                      sort === c.key && "text-ink"
                    )}
                  >
                    {c.label}
                    <ArrowUpDown className="h-3 w-3 opacity-50" />
                  </button>
                </th>
              ))}
              <th className="px-3 py-2.5 pr-5 text-right font-medium">Trend</th>
            </tr>
          </thead>
          <tbody className="tabular">
            {rows.map((c) => (
              <Row key={c.id} c={c} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Row({ c }: { c: ChannelDerived }) {
  const efficient = c.cac !== null && c.cac < 8;
  const expensive = c.cac !== null && c.cac > 30;
  const up = c.trend[c.trend.length - 1]! >= c.trend[0]!;

  return (
    <tr className="group border-b border-border/60 text-[13px] transition-colors last:border-0 hover:bg-surface-2/60">
      <td className="px-3 py-3 pl-5">
        <div className="flex items-center gap-2 font-medium text-ink">
          {c.source}
          {efficient && (
            <span className="rounded bg-money-soft px-1.5 py-0.5 text-[10px] font-semibold uppercase text-money-strong">
              Efficient
            </span>
          )}
          {expensive && (
            <span className="rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase" style={{ background: "rgb(var(--neg)/0.12)", color: "rgb(var(--neg))" }}>
              High CAC
            </span>
          )}
        </div>
      </td>
      <td className="px-3 py-3 text-right font-semibold text-ink">{c.newCustomers}</td>
      <td className="hidden px-3 py-3 text-right text-ink-muted md:table-cell">
        {money(c.firstRevenue)}
      </td>
      <td className="hidden px-3 py-3 text-right text-ink-muted md:table-cell">
        {c.spend > 0 ? money(c.spend) : "—"}
      </td>
      <td className="px-3 py-3 text-right">
        <span
          className={cn(
            "font-medium",
            efficient ? "text-money-strong" : expensive ? "text-neg" : "text-ink"
          )}
        >
          {c.cac !== null ? money(c.cac, { cents: true }) : "—"}
        </span>
      </td>
      <td className="hidden px-3 py-3 text-right text-ink-muted md:table-cell">
        {money(c.value30)}
      </td>
      <td className="hidden px-3 py-3 text-right text-ink-muted md:table-cell">
        {pct(c.returnRate)}
      </td>
      <td className="px-3 py-3 text-right font-medium text-ink">
        {c.roas !== null ? `${c.roas.toFixed(1)}×` : "—"}
      </td>
      <td className="px-3 py-3 pr-5">
        <div className="flex justify-end">
          <Sparkline
            data={c.trend}
            width={68}
            height={22}
            fill={false}
            strokeClass={up ? "text-money" : "text-neg"}
          />
        </div>
      </td>
    </tr>
  );
}
