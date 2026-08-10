import { Section } from "@/components/marketing/primitives";

const MARKS = ["Dutchie", "Alpine IQ", "Headset", "Google", "Meta", "Weedmaps"];

export function SocialProof() {
  return (
    <Section className="py-10">
      <div className="rounded-2xl border border-border bg-surface/50 px-6 py-7">
        <p className="text-center text-[15px] font-medium text-ink">
          Your stack tells you <span className="text-ink-subtle">what happened.</span>{" "}
          TrafficIQ tells you{" "}
          <span className="text-brand-600">where growth comes from.</span>
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          {MARKS.map((m) => (
            <span
              key={m}
              className="text-[15px] font-semibold tracking-tight text-ink-subtle/80 grayscale transition-colors hover:text-ink-muted"
            >
              {m}
            </span>
          ))}
        </div>
        <p className="mt-5 text-center text-[12px] text-ink-subtle">
          Designed to connect with the tools modern dispensaries already use. Logos
          shown for compatibility; no partnership implied.
        </p>
      </div>
    </Section>
  );
}
