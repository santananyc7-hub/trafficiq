import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Full-bleed section with a centered max-width container. */
export function Section({
  children,
  className,
  containerClassName,
  id,
}: {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("relative px-5 sm:px-8", className)}>
      <div className={cn("mx-auto w-full max-w-[1180px]", containerClassName)}>
        {children}
      </div>
    </section>
  );
}

/** Small uppercase eyebrow with a signal dot. */
export function Eyebrow({
  children,
  className,
  tone = "brand",
}: {
  children: ReactNode;
  className?: string;
  tone?: "brand" | "signal" | "muted";
}) {
  const color =
    tone === "signal"
      ? "text-[rgb(var(--signal-strong))]"
      : tone === "muted"
        ? "text-ink-subtle"
        : "text-brand-600";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em]",
        color,
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  eyebrowTone,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
  eyebrowTone?: "brand" | "signal" | "muted";
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className
      )}
    >
      {eyebrow && <Eyebrow tone={eyebrowTone}>{eyebrow}</Eyebrow>}
      <h2 className="max-w-2xl text-balance text-3xl font-semibold tracking-brand text-ink sm:text-[40px] sm:leading-[1.08]">
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "max-w-2xl text-pretty text-[16px] leading-relaxed text-ink-muted",
            align === "center" && "mx-auto"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
