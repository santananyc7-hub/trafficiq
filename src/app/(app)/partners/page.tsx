import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { PartnersView } from "@/components/app/PartnersView";

export const metadata: Metadata = { title: "Partners" };

export default function PartnersPage() {
  return (
    <div>
      <PageHeader
        title="Partners"
        description="A local acquisition network — hotels, venues and businesses, each with its own QR code, link and promo."
        actions={
          <button className="inline-flex h-9 items-center gap-2 rounded-lg bg-brand-600 px-3.5 text-[13px] font-medium text-white transition-colors hover:bg-brand-700">
            <Plus className="h-4 w-4" />
            Add Partner
          </button>
        }
      />
      <PartnersView />
    </div>
  );
}
