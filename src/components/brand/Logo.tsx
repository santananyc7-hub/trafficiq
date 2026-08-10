import { cn } from "@/lib/cn";

/**
 * TrafficIQ brand marks — the "TR" monogram icon (by Revenue Labs).
 * The artwork is a self-contained rounded tile served from /brand/tiq-icon.png,
 * so it reads on both light and dark surfaces.
 */

// Prefix the Pages basePath (empty in dev) so the plain <img> resolves under
// https://<user>.github.io/<repo>/ as well as at the root during local dev.
const ICON = (process.env.NEXT_PUBLIC_BASE_PATH || "") + "/brand/tiq-icon.png";

/** The icon tile at an arbitrary size. `variant` kept for call-site compatibility. */
export function LogoSymbol({
  size = 32,
  className,
}: {
  size?: number;
  /** retained for compatibility; the raster mark is a single artwork */
  variant?: "color" | "mono" | "on-brand";
  className?: string;
  animate?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={ICON}
      alt="TrafficIQ"
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      style={{ width: size, height: size, borderRadius: size * 0.23 }}
    />
  );
}

/** Alias — the mark already is a tile. */
export function LogoTile({
  size = 36,
  className,
}: {
  size?: number;
  className?: string;
  rounded?: string;
}) {
  return <LogoSymbol size={size} className={className} />;
}

/** Wordmark — "Traffic" in ink, "IQ" in brand blue, optional Revenue Labs line. */
export function Wordmark({
  className,
  onDark = false,
  endorsed = false,
}: {
  className?: string;
  onDark?: boolean;
  endorsed?: boolean;
}) {
  return (
    <span className={cn("inline-flex flex-col leading-none", className)}>
      <span className={cn("font-semibold tracking-brand", onDark ? "text-white" : "text-ink")}>
        Traffic<span className="text-brand-600">IQ</span>
      </span>
      {endorsed && (
        <span
          className={cn(
            "mt-1 text-[9px] font-semibold uppercase tracking-[0.2em]",
            onDark ? "text-white/55" : "text-ink-subtle"
          )}
        >
          by Revenue Labs
        </span>
      )}
    </span>
  );
}

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  tile?: boolean;
  onDark?: boolean;
  endorsed?: boolean;
  animate?: boolean;
}

const SIZES = {
  sm: { tile: 28, text: "text-[17px]" },
  md: { tile: 34, text: "text-xl" },
  lg: { tile: 44, text: "text-[26px]" },
} as const;

/** Horizontal lockup: TR tile + wordmark. */
export function Logo({
  className,
  size = "md",
  onDark = false,
  endorsed = false,
}: LogoProps) {
  const s = SIZES[size];
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoSymbol size={s.tile} />
      <Wordmark className={s.text} onDark={onDark} endorsed={endorsed} />
    </span>
  );
}
