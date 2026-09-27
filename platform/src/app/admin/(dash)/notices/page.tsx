import { getAuthedSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { NoticesManager } from "@/components/admin/NoticesManager";
import { getDemoSessionId } from "@/lib/actions/guard";
import { demoVisibleWhere } from "@/lib/demoSession";

export const metadata = { title: "Notices" };

export default async function NoticesPage() {
  const authed = await getAuthedSession();
  if (!authed) return null;
  const demoId = await getDemoSessionId();
  const notices = await db.notice.findMany({
    where: demoVisibleWhere(authed.tenant.id, demoId),
    orderBy: [{ pinned: "desc" }, { order: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="admin-full-bleed flex flex-col flex-1 min-h-0">
      <NoticesManager
        notices={notices.map((n) => ({
          id: n.id,
          date: n.date,
          title: n.title,
          category: n.category,
          link: n.link,
          attachmentUrl: n.attachmentUrl,
          attachmentName: n.attachmentName,
          pinned: n.pinned,
          published: n.published,
        }))}
      />
    </div>
  );
}
