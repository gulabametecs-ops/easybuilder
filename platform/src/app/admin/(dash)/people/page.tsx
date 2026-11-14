import { getAuthedSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { PeopleManager } from "@/components/admin/PeopleManager";
import { getDemoSessionId } from "@/lib/actions/guard";
import { demoVisibleWhere } from "@/lib/demoSession";

export const metadata = { title: "People" };

export default async function PeoplePage() {
  const authed = await getAuthedSession();
  if (!authed) return null;
  const demoId = await getDemoSessionId();
  const people = await db.person.findMany({
    where: demoVisibleWhere(authed.tenant.id, demoId),
    orderBy: { order: "asc" },
  });
  return (
    <div className="admin-full-bleed flex flex-col flex-1 min-h-0">
      <PeopleManager people={people} />
    </div>
  );
}
