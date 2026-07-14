import { getAuthedSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { PageHeader, Card, EmptyState } from "@/components/admin/ui";
import { LeadsTable } from "@/components/admin/LeadsTable";

export const metadata = { title: "Leads" };

export default async function LeadsPage() {
  const authed = await getAuthedSession();
  if (!authed) return null;

  const leads = await db.lead.findMany({
    where: { tenantId: authed.tenant.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <PageHeader title="Leads" subtitle={`${leads.length} quote & contact submissions`} />
      <Card>
        {leads.length === 0 ? (
          <EmptyState title="No leads yet" hint="When visitors submit the quote or contact form, they'll show up here." />
        ) : (
          <LeadsTable leads={leads} />
        )}
      </Card>
    </>
  );
}
