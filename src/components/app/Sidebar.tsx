"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV, NAV_SECONDARY } from "@/lib/nav";
import { Logo } from "@/components/brand/Logo";
import { StoreSwitcher } from "@/components/app/StoreSwitcher";
import { cn } from "@/lib/cn";

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  const renderItem = (item: (typeof NAV)[number]) => {
    const active =
      pathname === item.href || pathname.startsWith(item.href + "/");
    const Icon = item.icon;
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onNavigate}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-[13.5px] font-medium transition-colors",
          active
            ? "bg-brand-50 text-brand-700"
            : "text-ink-muted hover:bg-surface-2 hover:text-ink"
        )}
      >
        <Icon
          className={cn(
            "h-[18px] w-[18px]",
            active ? "text-brand-600" : "text-ink-subtle"
          )}
        />
        {item.label}
      </Link>
    );
  };

  return (
    <div className="flex h-full flex-col bg-surface">
      <div className="flex h-16 items-center px-5">
        <Link href="/overview" onClick={onNavigate} aria-label="TrafficIQ">
          <Logo size="sm" />
        </Link>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2">
        {NAV.map(renderItem)}
        <div className="my-2 border-t border-border" />
        {NAV_SECONDARY.map(renderItem)}
      </nav>

      <div className="border-t border-border p-3">
        <StoreSwitcher />
      </div>
    </div>
  );
}
