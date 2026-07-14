import { getAuthedSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { PageHeader, Card, EmptyState } from "@/components/admin/ui";
import { AppointmentsTable } from "@/components/admin/AppointmentsTable";

export const metadata = { title: "Appointments" };

export default async function AppointmentsPage() {
  const authed = await getAuthedSession();
  if (!authed) return null;

  const appts = await db.appointment.findMany({
    where: { tenantId: authed.tenant.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <PageHeader title="Appointments" subtitle={`${appts.length} booking requests`} />
      <Card>
        {appts.length === 0 ? (
          <EmptyState title="No appointments yet" hint="Booking requests from your site will appear here." />
        ) : (
          <AppointmentsTable appts={appts} />
        )}
      </Card>
    </>
  );
}
