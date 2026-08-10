import type { Metadata } from "next";
import { PageHeader } from "@/components/app/PageHeader";
import { SettingsView } from "@/components/app/SettingsView";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <div>
      <PageHeader
        title="Settings"
        description="Organization, locations, team and billing — built for multi-location operators and agencies."
      />
      <SettingsView />
    </div>
  );
}
