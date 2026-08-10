import { cn } from "@/lib/cn";

// Pages basePath (empty in dev) so the render resolves under /<repo>/ too.
const HERO_SRC =
  (process.env.NEXT_PUBLIC_BASE_PATH || "") + "/hero/signal-field.png";

/**
 * Hero visual (§10) — a cinematic "signal from movement" panel.
 *
 * The backdrop is a generated intelligence-network render (Higgsfield); the
 * live intelligence layer floats on top: real KPI chips, a detected opportunity,
 * and a pulse tied to the convergence node. The panel is self-contained and
 * always dark, so it reads identically in the site's light and dark themes and
 * never fights the sticky nav. next/image serves an optimized, priority LCP.
 */
export function HeroVisual({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative aspect-[16/11] w-full overflow-hidden rounded-2xl border border-white/10 bg-[rgb(8,10,18)] shadow-pop",
        className
      )}
    >
      {/* Cinematic network backdrop with a slow, reduced-motion-aware drift */}
      <div
        className="absolute inset-0 origin-center"
        style={{ animation: "tiq-breath 18s ease-in-out infinite" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_SRC}
          alt="An aerial city rendered as a network of light — acquisition signals converging from many directions onto one bright node."
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      {/* Depth + text-side darkening so overlaid data stays crisp */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(8,10,18,0.82) 0%, rgba(8,10,18,0.30) 34%, rgba(8,10,18,0) 60%), linear-gradient(0deg, rgba(8,10,18,0.55) 0%, rgba(8,10,18,0) 45%)",
        }}
      />

      {/* Convergence node pulse — anchors the live layer to the render */}
      <div className="pointer-events-none absolute left-[71%] top-[47%]">
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[rgb(var(--signal))] opacity-60" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-[rgb(var(--signal))] ring-2 ring-[rgb(var(--signal))]/30" />
        </span>
      </div>

      {/* Live intelligence overlay */}
      <div className="absolute inset-0">
        <Chip
          className="left-[4%] top-[7%]"
          style={{ animationDelay: "0.5s" }}
          value="427"
          label="new customers"
        />
        <Chip
          className="right-[4%] top-[13%]"
          style={{ animationDelay: "0.9s" }}
          value="$31,840"
          label="first-purchase revenue"
          tone="money"
        />
        <Chip
          className="right-[5%] bottom-[24%]"
          style={{ animationDelay: "1.3s" }}
          value="$14.72"
          label="blended CAC"
        />

        <div
          className="absolute bottom-[6%] left-[4%] animate-fade-up rounded-xl border px-3.5 py-2.5 shadow-elevated backdrop-blur-md"
          style={{
            animationDelay: "1.7s",
            background: "rgba(46,34,8,0.72)",
            borderColor: "rgba(245,190,74,0.45)",
          }}
        >
          <div className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.14em]" style={{ color: "rgb(250,210,120)" }}>
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ background: "rgb(245,190,74)" }} />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: "rgb(245,190,74)" }} />
            </span>
            Opportunity detected
          </div>
          <p className="mt-1 text-[13px] font-semibold text-white">
            +92 customers · Midtown East
          </p>
        </div>

        {/* Node micro-label */}
        <div className="absolute right-[4%] top-[46%] hidden animate-fade-in items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-2.5 py-1 backdrop-blur sm:flex" style={{ animationDelay: "2.1s" }}>
          <span className="h-1.5 w-1.5 rounded-full bg-[rgb(var(--signal))]" />
          <span className="text-[11px] font-medium text-white/90">6 sources converging</span>
        </div>
      </div>
    </div>
  );
}

function Chip({
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
        "absolute animate-fade-up rounded-xl border border-white/10 bg-black/45 px-3.5 py-2 shadow-elevated backdrop-blur-md",
        className
      )}
      style={style}
    >
      <p
        className={cn(
          "tabular text-[19px] font-semibold leading-none tracking-tight",
          tone === "money" ? "text-[rgb(52,211,153)]" : "text-white"
        )}
      >
        {value}
      </p>
      <p className="mt-1 text-[10.5px] font-medium uppercase tracking-wide text-white/55">
        {label}
      </p>
    </div>
  );
}
