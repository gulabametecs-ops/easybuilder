import { getAuthedSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { GalleryManager } from "@/components/admin/GalleryManager";
import { getDemoSessionId } from "@/lib/actions/guard";
import { demoVisibleWhere } from "@/lib/demoSession";

export const metadata = { title: "Gallery" };

export default async function GalleryPage() {
  const authed = await getAuthedSession();
  if (!authed) return null;

  const demoId = await getDemoSessionId();
  const items = await db.galleryItem.findMany({
    where: demoVisibleWhere(authed.tenant.id, demoId),
    orderBy: [{ category: "asc" }, { order: "asc" }],
  });
  const categories = Array.from(new Set(items.map((i) => i.category)));

  return (
    <div className="admin-full-bleed flex flex-col flex-1 min-h-0">
      <GalleryManager items={items} categories={categories} />
    </div>
  );
}
