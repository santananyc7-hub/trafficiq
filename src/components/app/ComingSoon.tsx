import Link from "next/link";
import { ArrowRight, Sparkles, type LucideIcon } from "lucide-react";

/** Consistent placeholder for routes not yet built out (no dead nav links). */
export function ComingSoon({
  icon: Icon,
  title,
  description,
  bullets,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  bullets: string[];
}) {
  return (
    <div className="mx-auto max-w-2xl py-10">
      <div className="rounded-2xl border border-border bg-surface p-8 shadow-card">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <Icon className="h-6 w-6" />
        </span>
        <div className="mt-5 flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight text-ink">{title}</h1>
          <span className="inline-flex items-center gap-1 rounded-full border border-brand-200 bg-brand-50 px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide text-brand-700">
            <Sparkles className="h-3 w-3" /> In build
          </span>
        </div>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">{description}</p>

        <ul className="mt-5 space-y-2">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-2.5 text-[14px] text-ink">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
              {b}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/overview"
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
          >
            Back to Overview
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/opportunities"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border-strong px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-2"
          >
            See Opportunities
          </Link>
        </div>
      </div>
    </div>
  );
}
