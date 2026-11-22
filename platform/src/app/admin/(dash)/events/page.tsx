import { getAuthedSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { fileUploadMb } from "@/lib/usage";
import { EventsManager } from "@/components/admin/EventsManager";
import { getDemoSessionId } from "@/lib/actions/guard";
import { demoVisibleWhere } from "@/lib/demoSession";

export const metadata = { title: "Events" };

export default async function EventsAdminPage() {
  const authed = await getAuthedSession();
  if (!authed) return null;
  const demoId = await getDemoSessionId();
  const events = await db.siteEvent.findMany({
    where: demoVisibleWhere(authed.tenant.id, demoId),
    orderBy: [{ date: "desc" }, { order: "asc" }],
  });
  return (
    <div className="admin-full-bleed flex flex-col flex-1 min-h-0">
      <EventsManager events={events} maxFileMb={await fileUploadMb(authed.tenant)} />
    </div>
  );
}
