import type { Metadata } from "next";
import { PageHeader, PageToolbar } from "@/components/app/PageHeader";
import { AcquisitionView } from "@/components/app/AcquisitionView";

export const metadata: Metadata = { title: "Acquisition" };

export default function AcquisitionPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Trailing 30 days"
        title="Acquisition"
        description="Every step from first impression to first purchase to 30-day repeat, with the conversion rate and biggest leak at each stage."
        actions={<PageToolbar />}
      />
      <AcquisitionView />
    </div>
  );
}
