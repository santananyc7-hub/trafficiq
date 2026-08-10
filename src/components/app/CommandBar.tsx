"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CornerDownLeft, Sparkles, X } from "lucide-react";
import { LogoSymbol } from "@/components/brand/Logo";
import { ASK_PLAN } from "@/lib/demo";
import { money } from "@/lib/format";
import { cn } from "@/lib/cn";

const SUGGESTIONS = [
  "Where should I spend $1,000 this week?",
  "Why did new customer traffic decline?",
  "Which ZIP code should I target next?",
  "Find underperforming acquisition channels.",
];

export function CommandBar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setAnswered(false);
    }
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const maxAlloc = Math.max(...ASK_PLAN.allocation.map((a) => a.amount));

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 pt-[10vh]">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl animate-scale-in overflow-hidden rounded-2xl border border-border bg-overlay shadow-pop">
        {/* Input */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3.5">
          <Sparkles className="h-4 w-4 shrink-0 text-brand-500" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && query.trim()) setAnswered(true);
            }}
            placeholder="Ask TrafficIQ about customer acquisition…"
            className="flex-1 bg-transparent text-[15px] text-ink placeholder:text-ink-subtle focus:outline-none"
          />
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-ink-subtle hover:bg-surface-2"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4">
          {!answered ? (
            <div>
              <p className="px-1 text-[11px] font-semibold uppercase tracking-wide text-ink-subtle">
                Suggested
              </p>
              <div className="mt-2 space-y-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setQuery(s);
                      setAnswered(true);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[13.5px] text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-brand-400" />
                    {s}
                    <CornerDownLeft className="ml-auto h-3.5 w-3.5 text-ink-subtle" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="animate-fade-up">
              <div className="mb-3 flex items-center gap-2">
                <LogoSymbol size={20} />
                <span className="text-[13px] font-semibold text-ink">TrafficIQ</span>
                <span className="text-[12px] text-ink-subtle">· analysis</span>
              </div>
              <div className="space-y-2">
                {ASK_PLAN.lines.map((l, i) => (
                  <p key={i} className="text-[14px] leading-relaxed text-ink-muted">
                    {l}
                  </p>
                ))}
              </div>

              <div className="mt-4 rounded-xl border border-border bg-surface-2 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-subtle">
                  Recommended allocation
                </p>
                <div className="mt-3 space-y-2">
                  {ASK_PLAN.allocation.map((a) => (
                    <div key={a.channel} className="flex items-center gap-3">
                      <span className="w-32 shrink-0 text-[12.5px] font-medium text-ink">
                        {a.channel}
                      </span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-3">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            a.amount === 0 ? "bg-border-strong" : "bg-brand-500"
                          )}
                          style={{ width: `${Math.max(4, (a.amount / maxAlloc) * 100)}%` }}
                        />
                      </div>
                      <span className="tabular w-12 shrink-0 text-right text-[12.5px] font-semibold text-ink">
                        {money(a.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                <Proj label="New customers" value={`+${ASK_PLAN.projected.customers}`} />
                <Proj label="First-purchase" value={money(ASK_PLAN.projected.firstRevenue)} tone />
                <Proj label="30-day rev" value={money(ASK_PLAN.projected.value30)} tone />
              </div>

              <Link
                href="/campaigns/new"
                onClick={onClose}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
              >
                Build this plan
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Proj({ label, value, tone }: { label: string; value: string; tone?: boolean }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-2.5 text-center">
      <p
        className={cn(
          "tabular text-[16px] font-semibold tracking-tight",
          tone ? "text-money-strong" : "text-ink"
        )}
      >
        {value}
      </p>
      <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-ink-subtle">
        {label}
      </p>
    </div>
  );
}
