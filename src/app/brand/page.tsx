import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  Logo,
  LogoSymbol,
  LogoTile,
  Wordmark,
} from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { Pill, Delta, ConfidenceBadge } from "@/components/ui/Badge";
import { ScoreDial } from "@/components/ui/ScoreDial";
import { Sparkline } from "@/components/ui/Sparkline";
import { ThemeToggle } from "@/components/theme";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Brand Guidelines",
  description: "The TrafficIQ design system — the source of truth for product and marketing.",
};

export default function BrandPage() {
  return (
    <div className="min-h-screen bg-canvas">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-canvas/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-[1080px] items-center gap-4 px-6">
          <Logo size="sm" />
          <span className="ml-1 hidden text-[13px] text-ink-subtle sm:block">
            / Brand Guidelines
          </span>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-[13px] font-medium text-ink-muted hover:bg-surface-2 hover:text-ink"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Home
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1080px] px-6 py-12">
        <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-brand-600">
          TrafficIQ Design System
        </p>
        <h1 className="mt-3 max-w-2xl text-balance text-4xl font-semibold tracking-brand text-ink">
          One system for the website and the product.
        </h1>
        <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-ink-muted">
          Every token, mark and component on this page is the same code that powers
          trafficiq.com and the application. Build new surfaces from these primitives so
          the brand never drifts.
        </p>

        {/* LOGO */}
        <Block id="logo" n="01" title="Logo system">
          <p className="mb-6 max-w-2xl text-[14.5px] leading-relaxed text-ink-muted">
            The mark is a <span className="font-medium text-ink">signal-convergence</span>{" "}
            glyph: routes enter from several directions, converge at a hub, and one
            confident vector exits toward growth — many signals becoming one decision.
            No leaves, pins, targets or letters, so the brand travels beyond cannabis.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Swatch label="Primary lockup">
              <Logo size="md" />
            </Swatch>
            <Swatch label="App / avatar tile">
              <LogoTile size={48} />
            </Swatch>
            <Swatch label="Symbol">
              <LogoSymbol size={44} />
            </Swatch>
            <Swatch label="Wordmark">
              <Wordmark className="text-2xl" />
            </Swatch>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="flex items-center justify-center rounded-xl border border-border bg-[rgb(8,10,18)] p-8">
              <Logo size="md" onDark />
            </div>
            <Swatch label="Monochrome">
              <div className="flex items-center gap-4 text-ink">
                <LogoSymbol size={40} variant="mono" />
                <LogoSymbol size={28} variant="mono" />
                <LogoSymbol size={20} variant="mono" />
                <LogoSymbol size={16} variant="mono" />
              </div>
            </Swatch>
          </div>
        </Block>

        {/* COLOR */}
        <Block id="color" n="02" title="Color">
          <p className="mb-2 text-[13px] font-semibold text-ink">Surfaces & ink</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            <ColorChip name="canvas" varName="--canvas" />
            <ColorChip name="surface" varName="--surface" />
            <ColorChip name="surface-2" varName="--surface-2" />
            <ColorChip name="border" varName="--border" />
            <ColorChip name="ink" varName="--ink" dark />
            <ColorChip name="ink-muted" varName="--ink-muted" dark />
          </div>
          <p className="mb-2 mt-6 text-[13px] font-semibold text-ink">
            Brand — indigo intelligence
          </p>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-9">
            {[50, 100, 200, 300, 400, 500, 600, 700, 800].map((s) => (
              <ColorChip
                key={s}
                name={`${s}`}
                varName={`--brand-${s}`}
                dark={s >= 500}
              />
            ))}
          </div>
          <p className="mb-2 mt-6 text-[13px] font-semibold text-ink">
            Semantic — meaning, never decoration
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <ColorChip name="money" varName="--money" dark />
            <ColorChip name="opportunity" varName="--opp" dark />
            <ColorChip name="signal" varName="--signal" />
            <ColorChip name="positive" varName="--pos" dark />
            <ColorChip name="negative" varName="--neg" dark />
            <ColorChip name="warning" varName="--warn" />
          </div>
        </Block>

        {/* TYPOGRAPHY */}
        <Block id="type" n="03" title="Typography">
          <p className="mb-5 text-[14px] text-ink-muted">
            <span className="font-medium text-ink">Inter</span> for interface and copy,{" "}
            <span className="font-mono font-medium text-ink">JetBrains Mono</span> for
            code. Financial figures use tabular numerals.
          </p>
          <div className="space-y-4 rounded-xl border border-border bg-surface p-6">
            <TypeRow label="Display / H1" cls="text-4xl font-semibold tracking-brand">
              Know where your customers come from
            </TypeRow>
            <TypeRow label="H2" cls="text-2xl font-semibold tracking-brand">
              Acquisition performance
            </TypeRow>
            <TypeRow label="H3" cls="text-lg font-semibold">
              Acquisition channels
            </TypeRow>
            <TypeRow label="Body" cls="text-[15px] text-ink-muted">
              TrafficIQ connects marketing activity to real store purchases.
            </TypeRow>
            <TypeRow label="Metric" cls="tabular text-4xl font-bold tracking-tight">
              $31,840
            </TypeRow>
            <TypeRow label="Label" cls="text-[11px] font-medium uppercase tracking-wide text-ink-subtle">
              First-purchase revenue
            </TypeRow>
          </div>
        </Block>

        {/* COMPONENTS */}
        <Block id="components" n="04" title="Components">
          <div className="grid gap-4 sm:grid-cols-2">
            <Swatch label="Buttons">
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="signal" size="sm">Signal</Button>
                <Button variant="primary" size="sm">Primary</Button>
                <Button variant="secondary" size="sm">Secondary</Button>
                <Button variant="subtle" size="sm">Subtle</Button>
                <Button variant="ghost" size="sm">Ghost</Button>
              </div>
            </Swatch>
            <Swatch label="Pills & badges">
              <div className="flex flex-wrap items-center gap-2">
                <Pill tone="brand" dot>Active</Pill>
                <Pill tone="money" dot>Top performer</Pill>
                <Pill tone="opp" dot>Opportunity</Pill>
                <Pill tone="signal" dot>Live</Pill>
                <ConfidenceBadge level="High" />
              </div>
            </Swatch>
            <Swatch label="Deltas">
              <div className="flex flex-wrap items-center gap-4">
                <Delta value={18.4} />
                <Delta value={-6.1} suffix="CAC" invert />
                <Delta value={-4.2} />
              </div>
            </Swatch>
            <Swatch label="Score dial & sparkline">
              <div className="flex items-center gap-5">
                <ScoreDial value={92} />
                <ScoreDial value={74} tone="brand" size={48} />
                <Sparkline data={[12, 18, 15, 22, 20, 28, 26, 34]} width={110} height={34} strokeClass="text-money" />
              </div>
            </Swatch>
          </div>
        </Block>

        {/* MOTION + RADIUS/SHADOW */}
        <Block id="foundations" n="05" title="Radius, shadow & motion">
          <div className="grid gap-4 sm:grid-cols-3">
            <Swatch label="Radius">
              <div className="flex items-end gap-3">
                {["rounded-lg", "rounded-xl", "rounded-2xl"].map((r) => (
                  <div key={r} className="text-center">
                    <div className={cn("h-14 w-14 border border-border-strong bg-surface-2", r)} />
                    <span className="mt-1 block text-[10px] text-ink-subtle">{r}</span>
                  </div>
                ))}
              </div>
            </Swatch>
            <Swatch label="Shadow">
              <div className="flex items-end gap-3">
                {["shadow-card", "shadow-elevated", "shadow-pop"].map((s) => (
                  <div key={s} className="text-center">
                    <div className={cn("h-14 w-14 rounded-xl bg-surface", s)} />
                    <span className="mt-1 block text-[10px] text-ink-subtle">
                      {s.replace("shadow-", "")}
                    </span>
                  </div>
                ))}
              </div>
            </Swatch>
            <Swatch label="Motion">
              <div className="space-y-1.5 text-[12.5px] text-ink-muted">
                <p>UI transitions · 150–400ms</p>
                <p>Reveal · fade-up / scale-in</p>
                <p>Signals · convergence, pulse rings</p>
                <p className="text-ink-subtle">Restrained. State, not decoration.</p>
              </div>
            </Swatch>
          </div>
        </Block>
      </div>
    </div>
  );
}

function Block({
  id,
  n,
  title,
  children,
}: {
  id: string;
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mt-14 scroll-mt-20 border-t border-border pt-10">
      <div className="mb-6 flex items-center gap-3">
        <span className="tabular text-[13px] font-bold text-brand-600">{n}</span>
        <h2 className="text-xl font-semibold tracking-brand text-ink">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Swatch({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <p className="mb-4 text-[11px] font-medium uppercase tracking-wide text-ink-subtle">
        {label}
      </p>
      <div className="flex min-h-[52px] items-center">{children}</div>
    </div>
  );
}

function ColorChip({
  name,
  varName,
  dark,
}: {
  name: string;
  varName: string;
  dark?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div
        className="flex h-14 items-end p-2"
        style={{ background: `rgb(var(${varName}))` }}
      >
        <span
          className={cn(
            "text-[10px] font-mono",
            dark ? "text-white/80" : "text-black/60"
          )}
        >
          {varName}
        </span>
      </div>
      <div className="bg-surface px-2 py-1.5">
        <span className="text-[11.5px] font-medium text-ink">{name}</span>
      </div>
    </div>
  );
}

function TypeRow({
  label,
  cls,
  children,
}: {
  label: string;
  cls: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 border-b border-border pb-4 last:border-0 last:pb-0 sm:flex-row sm:items-baseline sm:gap-6">
      <span className="w-28 shrink-0 text-[11px] font-medium uppercase tracking-wide text-ink-subtle">
        {label}
      </span>
      <span className={cn("text-ink", cls)}>{children}</span>
    </div>
  );
}
