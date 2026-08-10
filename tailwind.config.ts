import type { Config } from "tailwindcss";

/**
 * TrafficIQ design system.
 *
 * A cool slate foundation with a single confident indigo "intelligence" accent,
 * plus three business-semantic ramps that carry meaning, never decoration:
 *   money       — emerald, first-purchase & 30-day revenue
 *   opportunity — amber/gold, TrafficIQ's signature "growth here" signal
 *   channel     — a small qualitative ramp for charts / map layers
 * Everything is driven by CSS variables (see globals.css) so light/dark stay
 * in lock-step and figures read at Bloomberg-terminal legibility.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Surfaces & text
        canvas: "rgb(var(--canvas) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        "surface-2": "rgb(var(--surface-2) / <alpha-value>)",
        "surface-3": "rgb(var(--surface-3) / <alpha-value>)",
        overlay: "rgb(var(--overlay) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        "border-strong": "rgb(var(--border-strong) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        "ink-muted": "rgb(var(--ink-muted) / <alpha-value>)",
        "ink-subtle": "rgb(var(--ink-subtle) / <alpha-value>)",
        // Brand accent — indigo intelligence
        brand: {
          50: "rgb(var(--brand-50) / <alpha-value>)",
          100: "rgb(var(--brand-100) / <alpha-value>)",
          200: "rgb(var(--brand-200) / <alpha-value>)",
          300: "rgb(var(--brand-300) / <alpha-value>)",
          400: "rgb(var(--brand-400) / <alpha-value>)",
          500: "rgb(var(--brand-500) / <alpha-value>)",
          600: "rgb(var(--brand-600) / <alpha-value>)",
          700: "rgb(var(--brand-700) / <alpha-value>)",
          800: "rgb(var(--brand-800) / <alpha-value>)",
          900: "rgb(var(--brand-900) / <alpha-value>)",
        },
        // Money / revenue (emerald)
        money: {
          soft: "rgb(var(--money-soft) / <alpha-value>)",
          DEFAULT: "rgb(var(--money) / <alpha-value>)",
          strong: "rgb(var(--money-strong) / <alpha-value>)",
        },
        // Opportunity (amber/gold) — the signature "grow here" signal
        opp: {
          soft: "rgb(var(--opp-soft) / <alpha-value>)",
          DEFAULT: "rgb(var(--opp) / <alpha-value>)",
          strong: "rgb(var(--opp-strong) / <alpha-value>)",
        },
        // Directional semantics
        pos: "rgb(var(--pos) / <alpha-value>)",
        neg: "rgb(var(--neg) / <alpha-value>)",
        warn: "rgb(var(--warn) / <alpha-value>)",
        info: "rgb(var(--info) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      borderRadius: {
        lg: "0.625rem",
        xl: "0.875rem",
        "2xl": "1.125rem",
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(var(--shadow) / 0.05), 0 1px 3px 0 rgb(var(--shadow) / 0.04)",
        elevated:
          "0 4px 12px -2px rgb(var(--shadow) / 0.10), 0 2px 6px -2px rgb(var(--shadow) / 0.06)",
        pop: "0 12px 32px -8px rgb(var(--shadow) / 0.22), 0 4px 12px -4px rgb(var(--shadow) / 0.12)",
        "glow-brand": "0 0 0 1px rgb(var(--brand-500) / 0.35), 0 8px 24px -6px rgb(var(--brand-500) / 0.35)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "count-in": {
          from: { opacity: "0", transform: "translateY(4px) scale(0.98)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(16px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: { "100%": { transform: "translateX(100%)" } },
        "pulse-ring": {
          "0%": { transform: "scale(0.85)", opacity: "0.5" },
          "70%, 100%": { transform: "scale(2.2)", opacity: "0" },
        },
        "draw-line": {
          from: { "stroke-dashoffset": "1" },
          to: { "stroke-dashoffset": "0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in": "fade-in 0.4s ease both",
        "count-in": "count-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
        "scale-in": "scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) both",
        "slide-in-right": "slide-in-right 0.35s cubic-bezier(0.16, 1, 0.3, 1) both",
        "pulse-ring": "pulse-ring 2.4s cubic-bezier(0.16, 1, 0.3, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
