import type { Metadata } from "next";
import { PageHeader } from "@/components/app/PageHeader";
import { TrafficMapView } from "@/components/app/TrafficMapView";

export const metadata: Metadata = { title: "Traffic Map" };

export default function TrafficMapPage() {
  return (
    <div>
      <PageHeader
        title="Traffic Map"
        description="Where your customers come from — and the trade areas producing fewer than they should."
      />
      <TrafficMapView />
    </div>
  );
}
