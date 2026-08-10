import type { Metadata } from "next";
import { PageHeader, PageToolbar } from "@/components/app/PageHeader";
import { AttributionView } from "@/components/app/AttributionView";

export const metadata: Metadata = { title: "Attribution" };

export default function AttributionPage() {
  return (
    <div>
      <PageHeader
        title="Attribution"
        description="Where your customers actually come from — first touch, last touch, and TrafficIQ's blended model, with honest confidence."
        actions={<PageToolbar />}
      />
      <AttributionView />
    </div>
  );
}
