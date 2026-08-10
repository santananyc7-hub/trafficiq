import type { Metadata } from "next";
import { PageHeader } from "@/components/app/PageHeader";
import { OpportunitiesView } from "@/components/app/OpportunitiesView";

export const metadata: Metadata = { title: "Opportunities" };

export default function OpportunitiesPage() {
  return (
    <div>
      <PageHeader
        title="Where TrafficIQ thinks you should grow next"
        description="An always-on feed of ranked acquisition opportunities across your market."
      />
      <OpportunitiesView />
    </div>
  );
}
