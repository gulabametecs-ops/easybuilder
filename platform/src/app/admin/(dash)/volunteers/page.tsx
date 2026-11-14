import { getAuthedSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { VolunteersManager } from "@/components/admin/VolunteersManager";
import { getDemoSessionId } from "@/lib/actions/guard";
import { demoVisibleWhere } from "@/lib/demoSession";

export const metadata = { title: "Volunteers" };

export default async function VolunteersPage() {
  const authed = await getAuthedSession();
  if (!authed) return null;
  const demoId = await getDemoSessionId();
  const volunteers = await db.volunteer.findMany({
    where: demoVisibleWhere(authed.tenant.id, demoId),
    orderBy: { createdAt: "desc" },
  });
  return (
    <div className="admin-full-bleed flex flex-col flex-1 min-h-0">
      <VolunteersManager volunteers={volunteers} />
    </div>
  );
}
