import { cn } from "@/lib/cn";

/**
 * The hero "signal from movement" visualization (§10).
 *
 * Acquisition signals originate from labeled sources, travel along routes to the
 * central store, and convert — then the intelligence layer surfaces the KPIs and
 * a detected opportunity. Built entirely from SVG + SMIL motion + CSS so it needs
 * no libraries and no client JS.
 */

const STORE = { x: 372, y: 214 };

interface Source {
  id: string;
  label: string;
  x: number;
  y: number;
  /** quadratic control point for the route */
  cx: number;
  cy: number;
  /** animation stagger (s) */
  delay: number;
  dur: number;
}

const SOURCES: Source[] = [
  { id: "google", label: "Google", x: 74, y: 96, cx: 210, cy: 60, delay: 0, dur: 3.2 },
  { id: "hotel", label: "Hotel", x: 214, y: 54, cx: 300, cy: 96, delay: 0.9, dur: 2.8 },
  { id: "social", label: "Social", x: 56, y: 214, cx: 200, cy: 200, delay: 0.4, dur: 3.6 },
  { id: "mail", label: "Direct Mail", x: 78, y: 336, cx: 210, cy: 330, delay: 1.5, dur: 3.3 },
  { id: "partner", label: "Partner", x: 214, y: 384, cx: 300, cy: 336, delay: 0.6, dur: 3.0 },
  { id: "walkby", label: "Walk-by", x: 330, y: 388, cx: 360, cy: 320, delay: 1.9, dur: 2.6 },
];

function route(s: Source): string {
  return `M ${s.x} ${s.y} Q ${s.cx} ${s.cy} ${STORE.x} ${STORE.y}`;
}

export function SignalField({ className }: { className?: string }) {
  return (
    <div className={cn("relative w-full", className)}>
      <svg
        viewBox="0 0 460 440"
        fill="none"
        className="w-full"
        role="img"
        aria-label="Acquisition signals from Google, hotels, direct mail, partners, social and walk-by traffic converging on your store and converting into new customers."
      >
        <defs>
          <radialGradient id="sf-hub" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgb(var(--signal))" stopOpacity="0.9" />
            <stop offset="60%" stopColor="rgb(var(--brand-500))" stopOpacity="0.35" />
            <stop offset="100%" stopColor="rgb(var(--brand-500))" stopOpacity="0" />
          </radialGradient>
          <filter id="sf-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Range rings around the store */}
        {[54, 92, 132].map((r, i) => (
          <circle
            key={r}
            cx={STORE.x}
            cy={STORE.y}
            r={r}
            stroke="rgb(var(--brand-400))"
            strokeOpacity={0.18}
            strokeWidth={1}
            strokeDasharray="2 5"
          >
            <animate
              attributeName="stroke-opacity"
              values="0.05;0.22;0.05"
              dur="4s"
              begin={`${i * 0.6}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}

        {/* Routes */}
        {SOURCES.map((s) => (
          <path
            key={`r-${s.id}`}
            d={route(s)}
            stroke="rgb(var(--brand-400))"
            strokeOpacity={0.25}
            strokeWidth={1.25}
            strokeLinecap="round"
          />
        ))}

        {/* Traveling signals (two per route, offset) + arrival flash */}
        {SOURCES.map((s) => (
          <g key={`sig-${s.id}`}>
            {[0, s.dur / 2].map((off, k) => (
              <circle key={k} r={3} fill="rgb(var(--signal))" filter="url(#sf-glow)">
                <animateMotion
                  path={route(s)}
                  dur={`${s.dur}s`}
                  begin={`${s.delay + off}s`}
                  repeatCount="indefinite"
                  rotate="auto"
                />
                <animate
                  attributeName="opacity"
                  values="0;1;1;1;0"
                  keyTimes="0;0.1;0.7;0.9;1"
                  dur={`${s.dur}s`}
                  begin={`${s.delay + off}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}
          </g>
        ))}

        {/* Source nodes + labels */}
        {SOURCES.map((s) => (
          <g key={`n-${s.id}`}>
            <circle
              cx={s.x}
              cy={s.y}
              r={4.5}
              fill="rgb(var(--surface))"
              stroke="rgb(var(--brand-500))"
              strokeWidth={1.75}
            />
            <text
              x={s.x}
              y={s.y - 12}
              textAnchor="middle"
              className="fill-[rgb(var(--ink-muted))] font-medium"
              style={{ fontSize: 11, letterSpacing: "0.01em" }}
            >
              {s.label}
            </text>
          </g>
        ))}

        {/* Store hub */}
        <circle cx={STORE.x} cy={STORE.y} r={64} fill="url(#sf-hub)" />
        <circle
          cx={STORE.x}
          cy={STORE.y}
          r={13}
          fill="rgb(var(--brand-600))"
          stroke="rgb(var(--signal))"
          strokeWidth={2}
        />
        <circle cx={STORE.x} cy={STORE.y} r={13} fill="none" stroke="rgb(var(--signal))" strokeWidth={2}>
          <animate attributeName="r" values="13;30;13" dur="3s" repeatCount="indefinite" />
          <animate attributeName="stroke-opacity" values="0.7;0;0.7" dur="3s" repeatCount="indefinite" />
        </circle>
        <text
          x={STORE.x}
          y={STORE.y + 34}
          textAnchor="middle"
          className="fill-[rgb(var(--ink))] font-semibold"
          style={{ fontSize: 12 }}
        >
          Your store
        </text>
      </svg>

      {/* Intelligence overlay — KPI chips + opportunity, in HTML for crisp styling */}
      <div className="pointer-events-none absolute inset-0">
        <FloatChip
          className="left-[2%] top-[6%] animate-fade-up"
          style={{ animationDelay: "0.6s" }}
          value="427"
          label="new customers"
        />
        <FloatChip
          className="right-[1%] top-[20%] animate-fade-up"
          style={{ animationDelay: "1.1s" }}
          value="$31,840"
          label="first-purchase revenue"
          tone="money"
        />
        <FloatChip
          className="right-[3%] bottom-[26%] animate-fade-up"
          style={{ animationDelay: "1.5s" }}
          value="$14.72"
          label="blended CAC"
        />
        <div
          className="absolute bottom-[4%] left-[3%] animate-fade-up rounded-xl border border-[rgb(var(--opp)/0.4)] bg-[rgb(var(--opp-soft))] px-3.5 py-2.5 shadow-elevated"
          style={{ animationDelay: "2s" }}
        >
          <div className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-opp-strong">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-opp opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-opp" />
            </span>
            Opportunity detected
          </div>
          <p className="mt-1 text-[13px] font-semibold text-ink">
            +92 customers · Midtown East
          </p>
        </div>
      </div>
    </div>
  );
}

function FloatChip({
  value,
  label,
  className,
  style,
  tone = "brand",
}: {
  value: string;
  label: string;
  className?: string;
  style?: React.CSSProperties;
  tone?: "brand" | "money";
}) {
  return (
    <div
      className={cn(
        "absolute rounded-xl border border-border bg-surface/95 px-3.5 py-2 shadow-elevated backdrop-blur",
        className
      )}
      style={style}
    >
      <p
        className={cn(
          "tabular text-[19px] font-semibold leading-none tracking-tight",
          tone === "money" ? "text-money-strong" : "text-ink"
        )}
      >
        {value}
      </p>
      <p className="mt-1 text-[10.5px] font-medium uppercase tracking-wide text-ink-subtle">
        {label}
      </p>
    </div>
  );
}
