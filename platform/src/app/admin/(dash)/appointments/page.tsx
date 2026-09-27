import { getAuthedSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { AppointmentsManager } from "@/components/admin/AppointmentsManager";
import { getDemoSessionId } from "@/lib/actions/guard";
import { demoVisibleWhere } from "@/lib/demoSession";

export const metadata = { title: "Appointments" };

export default async function AppointmentsPage() {
  const authed = await getAuthedSession();
  if (!authed) return null;

  const demoId = await getDemoSessionId();
  const appts = await db.appointment.findMany({
    where: demoVisibleWhere(authed.tenant.id, demoId),
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="admin-full-bleed flex flex-col flex-1 min-h-0">
      <AppointmentsManager appts={appts} />
    </div>
  );
}
