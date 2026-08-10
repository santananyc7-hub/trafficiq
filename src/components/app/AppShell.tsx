"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, Menu, Search, X } from "lucide-react";
import { Sidebar } from "@/components/app/Sidebar";
import { CommandBar } from "@/components/app/CommandBar";
import { ThemeToggle } from "@/components/theme";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [drawer, setDrawer] = useState(false);
  const [cmd, setCmd] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmd((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-screen bg-canvas">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-border lg:block">
        <Sidebar />
      </aside>

      {/* Mobile drawer */}
      {drawer && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setDrawer(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 border-r border-border shadow-pop">
            <button
              onClick={() => setDrawer(false)}
              className="absolute right-3 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted hover:bg-surface-2"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
            <Sidebar onNavigate={() => setDrawer(false)} />
          </div>
        </div>
      )}

      <div className="lg:pl-64">
        <TopBar onOpenMenu={() => setDrawer(true)} onOpenCmd={() => setCmd(true)} />
        <main className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>

      <CommandBar open={cmd} onClose={() => setCmd(false)} />
    </div>
  );
}

function TopBar({
  onOpenMenu,
  onOpenCmd,
}: {
  onOpenMenu: () => void;
  onOpenCmd: () => void;
}) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-surface/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <button
        onClick={onOpenMenu}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted hover:bg-surface-2 lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* AI command bar trigger */}
      <button
        onClick={onOpenCmd}
        className="group flex h-9 min-w-0 flex-1 items-center gap-2.5 rounded-lg border border-border bg-surface-2 px-3 text-left text-[13.5px] text-ink-subtle transition-colors hover:border-border-strong sm:max-w-md"
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="min-w-0 flex-1 truncate">Ask TrafficIQ about customer acquisition…</span>
        <kbd className="hidden shrink-0 rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[10px] text-ink-subtle sm:block">
          ⌘K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-1">
        <ThemeToggle />
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted hover:bg-surface-2 hover:text-ink"
          aria-label="Notifications"
        >
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-opp ring-2 ring-surface" />
        </button>
        <Link
          href="/settings"
          className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-[13px] font-semibold text-white"
          aria-label="Account"
        >
          JR
        </Link>
      </div>
    </header>
  );
}
