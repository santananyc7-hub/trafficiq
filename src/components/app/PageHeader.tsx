import type { ReactNode } from "react";
import { Calendar, ChevronDown, Download } from "lucide-react";

/** App page header with an optional greeting eyebrow and a controls slot. */
export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-[13px] text-ink-muted">{eyebrow}</p>
        )}
        <h1 className="text-[22px] font-semibold tracking-tight text-ink sm:text-2xl">
          {title}
        </h1>
        {description && (
          <p className="mt-0.5 text-[13.5px] text-ink-muted">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

/** Standard toolbar: date range + compare + export. Presentational (demo). */
export function PageToolbar() {
  return (
    <>
      <button className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-surface px-3 text-[13px] font-medium text-ink transition-colors hover:bg-surface-2">
        <Calendar className="h-4 w-4 text-ink-subtle" />
        Last 7 days
        <ChevronDown className="h-3.5 w-3.5 text-ink-subtle" />
      </button>
      <button className="hidden h-9 items-center gap-2 rounded-lg border border-border bg-surface px-3 text-[13px] font-medium text-ink-muted transition-colors hover:bg-surface-2 sm:inline-flex">
        Compare
        <ChevronDown className="h-3.5 w-3.5 text-ink-subtle" />
      </button>
      <button className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-surface px-3 text-[13px] font-medium text-ink-muted transition-colors hover:bg-surface-2">
        <Download className="h-4 w-4 text-ink-subtle" />
        Export
      </button>
    </>
  );
}
