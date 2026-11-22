import { getAuthedSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { fileUploadMb } from "@/lib/usage";
import { PropertiesManager } from "@/components/admin/PropertiesManager";
import { getDemoSessionId } from "@/lib/actions/guard";
import { demoVisibleWhere } from "@/lib/demoSession";
import { mapProperty } from "@/lib/property";

export const metadata = { title: "Properties" };

export default async function PropertiesAdminPage() {
  const authed = await getAuthedSession();
  if (!authed) return null;
  const demoId = await getDemoSessionId();
  const rows = await db.property.findMany({
    where: demoVisibleWhere(authed.tenant.id, demoId),
    orderBy: [{ featured: "desc" }, { order: "desc" }],
  });
  const properties = rows.map((r) => ({ ...mapProperty(r), published: r.published }));
  return (
    <div className="admin-full-bleed flex flex-col flex-1 min-h-0">
      <PropertiesManager properties={properties} maxFileMb={await fileUploadMb(authed.tenant)} />
    </div>
  );
}
