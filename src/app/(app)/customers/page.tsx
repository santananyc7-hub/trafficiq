import type { Metadata } from "next";
import { PageHeader, PageToolbar } from "@/components/app/PageHeader";
import { CustomersView } from "@/components/app/CustomersView";

export const metadata: Metadata = { title: "Customers" };

export default function CustomersPage() {
  return (
    <div>
      <PageHeader
        title="Customers"
        description="Your newly acquired customers — where they came from, what they first spent, and what they're worth."
        actions={<PageToolbar />}
      />
      <CustomersView />
    </div>
  );
}
