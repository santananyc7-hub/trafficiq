"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, Store } from "lucide-react";
import { STORES } from "@/lib/nav";
import { cn } from "@/lib/cn";

export function StoreSwitcher() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("midtown");
  const current = STORES.find((s) => s.id === active) ?? STORES[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2.5 rounded-lg border border-border bg-surface px-2.5 py-2 text-left transition-colors hover:bg-surface-2"
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-brand-600 text-white">
          <Store className="h-3.5 w-3.5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-semibold text-ink">
            {current.name}
          </span>
          <span className="block truncate text-[11px] text-ink-subtle">
            {current.sub}
          </span>
        </span>
        <ChevronsUpDown className="h-4 w-4 shrink-0 text-ink-subtle" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute bottom-full left-0 z-40 mb-2 w-full overflow-hidden rounded-xl border border-border bg-overlay p-1 shadow-pop">
            {STORES.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setActive(s.id);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-surface-2",
                  active === s.id && "bg-surface-2"
                )}
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-medium text-ink">
                    {s.name}
                  </span>
                  <span className="block truncate text-[11px] text-ink-subtle">
                    {s.sub}
                  </span>
                </span>
                {active === s.id && (
                  <Check className="h-4 w-4 shrink-0 text-brand-600" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
