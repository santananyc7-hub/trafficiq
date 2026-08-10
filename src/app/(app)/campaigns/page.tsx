import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { CampaignsView } from "@/components/app/CampaignsView";

export const metadata: Metadata = { title: "Campaigns" };

export default function CampaignsPage() {
  return (
    <div>
      <PageHeader
        title="Campaigns"
        description="Every campaign tracked to real customer acquisition — not scans, customers."
        actions={
          <Link
            href="/campaigns/new"
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-brand-600 px-3.5 text-[13px] font-medium text-white transition-colors hover:bg-brand-700"
          >
            <Plus className="h-4 w-4" />
            New Campaign
          </Link>
        }
      />
      <CampaignsView />
    </div>
  );
}
