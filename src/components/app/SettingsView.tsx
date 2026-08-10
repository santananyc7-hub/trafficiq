"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { Pill } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { STORES } from "@/lib/nav";
import { cn } from "@/lib/cn";

type Section = "Organization" | "Locations" | "Team & Roles" | "Plan & Billing";

const SECTIONS: Section[] = ["Organization", "Locations", "Team & Roles", "Plan & Billing"];

const ORG_FIELDS: { label: string; value: string }[] = [
  { label: "Organization name", value: "Demo Dispensary" },
  { label: "Industry", value: "Cannabis retail" },
  { label: "Timezone", value: "America/New_York (ET)" },
  { label: "Reference market", value: "Midtown Manhattan" },
];

type Role = "Owner" | "Admin" | "Marketing" | "Manager" | "Analyst";

interface Member {
  name: string;
  email: string;
  role: Role;
  status: "Active" | "Invited";
}

const MEMBERS: Member[] = [
  { name: "Jonathan Reyes", email: "jonathan@demodispensary.co", role: "Owner", status: "Active" },
  { name: "Priya Nair", email: "priya@demodispensary.co", role: "Admin", status: "Active" },
  { name: "Marcus Bell", email: "marcus@demodispensary.co", role: "Marketing", status: "Active" },
  { name: "Elena Duarte", email: "elena@demodispensary.co", role: "Manager", status: "Active" },
  { name: "Sam Whitfield", email: "sam@demodispensary.co", role: "Analyst", status: "Invited" },
];

const ROLE_REFERENCE: { role: string; capability: string }[] = [
  { role: "Owner", capability: "Full access, billing and organization ownership" },
  { role: "Admin", capability: "Manage locations, integrations and team members" },
  { role: "Marketing", capability: "Run campaigns, partners and attribution" },
  { role: "Manager", capability: "View performance for assigned locations" },
  { role: "Analyst", capability: "Read-only access to reports and dashboards" },
  { role: "Agency", capability: "Manage multiple client organizations" },
];

const PLAN_FEATURES = [
  "Traffic Map",
  "Opportunity Engine",
  "Partner Intelligence",
  "AI Marketing Analyst",
  "Advanced Attribution",
];

const LOCATIONS = STORES.filter((s) => s.id !== "all");

export function SettingsView() {
  const [section, setSection] = useState<Section>("Organization");

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
      {/* Section nav — horizontal chips on mobile, vertical rail on desktop */}
      <nav className="lg:w-56 lg:shrink-0">
        <div className="flex flex-wrap gap-1.5 lg:flex-col lg:gap-1">
          {SECTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setSection(s)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-left text-[13px] font-medium transition-colors lg:border-transparent lg:px-3 lg:py-2",
                section === s
                  ? "border-brand-300 bg-brand-50 text-brand-700 lg:border-transparent"
                  : "border-border bg-surface text-ink-muted hover:text-ink lg:bg-transparent lg:hover:bg-surface-2"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <div className="min-w-0 flex-1">
        {section === "Organization" && <OrganizationSection />}
        {section === "Locations" && <LocationsSection />}
        {section === "Team & Roles" && <TeamSection />}
        {section === "Plan & Billing" && <BillingSection />}
      </div>
    </div>
  );
}

function SectionShell({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-ink">{title}</h2>
          <p className="mt-0.5 text-[13.5px] text-ink-muted">{description}</p>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function OrganizationSection() {
  return (
    <SectionShell
      title="Organization"
      description="Core account details for your operator profile."
    >
      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-card">
        <dl>
          {ORG_FIELDS.map((f, i) => (
            <div
              key={f.label}
              className={cn(
                "flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4",
                i !== 0 && "border-t border-border/60"
              )}
            >
              <dt className="text-[12.5px] font-medium text-ink-subtle">{f.label}</dt>
              <dd className="text-[14px] font-medium text-ink sm:text-right">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <p className="text-[12px] text-ink-subtle">
        Read-only in this demo. Organization details are managed by your account owner.
      </p>
    </SectionShell>
  );
}

function LocationsSection() {
  return (
    <SectionShell
      title="Locations"
      description="Every store rolls up into one acquisition view."
    >
      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-card">
        {LOCATIONS.map((s, i) => (
          <div
            key={s.id}
            className={cn(
              "flex items-center justify-between gap-3 px-5 py-4",
              i !== 0 && "border-t border-border/60"
            )}
          >
            <div className="min-w-0">
              <div className="text-[14px] font-medium text-ink">{s.name}</div>
              <div className="mt-0.5 text-[12px] text-ink-subtle">{s.sub}</div>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <Pill tone="money" dot>
                Active
              </Pill>
              <Button variant="secondary" size="sm">
                Manage
              </Button>
            </div>
          </div>
        ))}
      </div>
      <p className="text-[12px] text-ink-subtle">
        TrafficIQ supports multi-location operators — switch or roll up locations from the store
        selector.
      </p>
    </SectionShell>
  );
}

const ROLE_TONE: Record<Role, "brand" | "neutral"> = {
  Owner: "brand",
  Admin: "neutral",
  Marketing: "neutral",
  Manager: "neutral",
  Analyst: "neutral",
};

function TeamSection() {
  return (
    <SectionShell
      title="Team & Roles"
      description="Manage who has access and what they can do."
      action={
        <Button variant="primary" size="sm">
          <Plus className="h-3.5 w-3.5" />
          Invite member
        </Button>
      }
    >
      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left">
            <thead>
              <tr className="border-b border-border text-[11px] uppercase tracking-wide text-ink-subtle">
                <th className="px-3 py-2.5 pl-5 font-medium">Name</th>
                <th className="hidden px-3 py-2.5 font-medium sm:table-cell">Email</th>
                <th className="px-3 py-2.5 font-medium">Role</th>
                <th className="px-3 py-2.5 pr-5 text-right font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {MEMBERS.map((m) => (
                <tr
                  key={m.email}
                  className="border-b border-border/60 text-[13px] transition-colors last:border-0 hover:bg-surface-2/60"
                >
                  <td className="px-3 py-3 pl-5">
                    <div className="font-medium text-ink">{m.name}</div>
                    <div className="mt-0.5 text-[11.5px] text-ink-subtle sm:hidden">{m.email}</div>
                  </td>
                  <td className="hidden px-3 py-3 text-ink-muted sm:table-cell">{m.email}</td>
                  <td className="px-3 py-3">
                    <Pill tone={ROLE_TONE[m.role]}>{m.role}</Pill>
                  </td>
                  <td className="px-3 py-3 pr-5 text-right">
                    <span
                      className={cn(
                        "text-[12.5px] font-medium",
                        m.status === "Active" ? "text-ink-muted" : "text-warn"
                      )}
                    >
                      {m.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface p-5 shadow-card">
        <h3 className="text-[13px] font-semibold uppercase tracking-wide text-ink-subtle">Roles</h3>
        <dl className="mt-3 space-y-2.5">
          {ROLE_REFERENCE.map((r) => (
            <div key={r.role} className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
              <dt className="w-24 shrink-0 text-[13px] font-medium text-ink">{r.role}</dt>
              <dd className="text-[13px] text-ink-muted">{r.capability}</dd>
            </div>
          ))}
        </dl>
      </div>
    </SectionShell>
  );
}

function BillingSection() {
  return (
    <SectionShell
      title="Plan & Billing"
      description="Your subscription and what's included."
    >
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[16px] font-semibold tracking-tight text-ink">Growth</h3>
              <Pill tone="brand" dot>
                Current plan
              </Pill>
            </div>
            <p className="mt-1 text-[13.5px] text-ink-muted">
              <span className="tabular">$599</span> / location / month
            </p>
          </div>
          <Button variant="secondary" size="sm">
            Manage billing
          </Button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Metric label="Active locations" value="3" />
          <Metric label="Monthly total" value="$1,797" tone="money" />
          <Metric label="Next invoice" value="Sep 1, 2026" />
        </div>

        <div className="mt-5 border-t border-border/60 pt-4">
          <p className="text-[12px] font-medium uppercase tracking-wide text-ink-subtle">Included</p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {PLAN_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2 text-[13.5px] text-ink">
                <Check className="h-4 w-4 shrink-0 text-money-strong" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="text-[12px] text-ink-subtle">Early-access pricing — subject to change.</p>
    </SectionShell>
  );
}

function Metric({ label, value, tone }: { label: string; value: string; tone?: "money" }) {
  return (
    <div className="rounded-lg border border-border bg-surface-2 p-3">
      <p className="text-[10.5px] font-medium uppercase tracking-wide text-ink-subtle">{label}</p>
      <p
        className={cn(
          "tabular mt-1 text-[17px] font-semibold tracking-tight",
          tone === "money" ? "text-money-strong" : "text-ink"
        )}
      >
        {value}
      </p>
    </div>
  );
}
