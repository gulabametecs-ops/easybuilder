import { getAuthedSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { LeadsManager } from "@/components/admin/LeadsManager";
import { getDemoSessionId } from "@/lib/actions/guard";
import { demoVisibleWhere } from "@/lib/demoSession";

export const metadata = { title: "Leads" };

export default async function LeadsPage() {
  const authed = await getAuthedSession();
  if (!authed) return null;

  const demoId = await getDemoSessionId();
  const leads = await db.lead.findMany({
    where: demoVisibleWhere(authed.tenant.id, demoId),
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="admin-full-bleed flex flex-col flex-1 min-h-0">
      <LeadsManager leads={leads} />
    </div>
  );
}
