import type { Metadata } from "next";
import { PageHeader } from "@/components/app/PageHeader";
import { CampaignBuilder } from "@/components/app/CampaignBuilder";

export const metadata: Metadata = { title: "New Campaign" };

export default function NewCampaignPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Campaigns"
        title="New Campaign"
        description="Goal to launch in a few steps — TrafficIQ pre-fills the efficient path and forecasts the result."
      />
      <CampaignBuilder />
    </div>
  );
}
