import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { ReportsView } from "@/components/app/ReportsView";

export const metadata: Metadata = { title: "Reports" };

export default function ReportsPage() {
  return (
    <div>
      <PageHeader
        title="Reports"
        description="Acquisition reporting an owner, a board, or an agency client can trust — saved, scheduled and exportable."
        actions={
          <button className="inline-flex h-9 items-center gap-2 rounded-lg bg-brand-600 px-3.5 text-[13px] font-medium text-white transition-colors hover:bg-brand-700">
            <Plus className="h-4 w-4" />
            New Report
          </button>
        }
      />
      <ReportsView />
    </div>
  );
}
