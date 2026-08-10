import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

interface Column {
  title: string;
  links: string[];
}

const COLUMNS: Column[] = [
  {
    title: "Product",
    links: ["Overview", "Attribution", "Traffic Map", "Campaigns", "Integrations"],
  },
  {
    title: "Company",
    links: ["About", "Contact", "Security", "Careers"],
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms"],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto w-full max-w-[1180px] px-5 py-12 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_2fr]">
          {/* Brand */}
          <div>
            <Logo size="sm" />
            <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-ink-muted">
              Customer Acquisition Intelligence for retail.
            </p>
            <p className="mt-2 text-[12.5px] text-ink-subtle">
              Cannabis retail today. Every retail vertical next.
            </p>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
                  {col.title}
                </p>
                <ul className="mt-3 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <Link
                        href="#"
                        className="text-[14px] text-ink-muted transition-colors hover:text-ink"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-[12.5px] text-ink-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 TrafficIQ. All rights reserved.</p>
          <p>Not affiliated with Dutchie, Alpine IQ, or Headset.</p>
        </div>
      </div>
    </footer>
  );
}
