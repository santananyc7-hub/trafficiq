import type { Metadata } from "next";
import { PageHeader } from "@/components/app/PageHeader";
import { IntegrationsView } from "@/components/app/IntegrationsView";

export const metadata: Metadata = { title: "Integrations" };

export default function IntegrationsPage() {
  return (
    <div>
      <PageHeader
        title="Integrations"
        description="TrafficIQ sits above your existing retail stack — connect once and every acquisition metric stays in sync."
      />
      <IntegrationsView />
    </div>
  );
}
