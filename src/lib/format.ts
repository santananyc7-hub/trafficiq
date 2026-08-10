/** Formatting helpers for money-denominated, human-readable output. */

export function money(value: number, opts?: { cents?: boolean }): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: opts?.cents ? 2 : 0,
    maximumFractionDigits: opts?.cents ? 2 : 0,
  }).format(value);
}

/** Compact money for tight spaces, e.g. "$8.7k". */
export function moneyCompact(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

/** Signed percentage with one decimal, e.g. "+18.4%". */
export function percent(value: number, digits = 1): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(digits)}%`;
}

/** Plain percentage (no forced sign), e.g. "27.6%". */
export function pct(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`;
}

export function number(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

/** Round to cents to keep computed impacts clean. */
export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** Deterministic date formatting (avoids locale/timezone drift in SSR). */
export function monthDay(iso: string): string {
  const d = new Date(iso);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`;
}
