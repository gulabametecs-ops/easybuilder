import { getAuthedSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui";
import { GalleryManager } from "@/components/admin/GalleryManager";

export const metadata = { title: "Gallery" };

export default async function GalleryPage() {
  const authed = await getAuthedSession();
  if (!authed) return null;

  const items = await db.galleryItem.findMany({
    where: { tenantId: authed.tenant.id },
    orderBy: [{ category: "asc" }, { order: "asc" }],
  });
  const categories = Array.from(new Set(items.map((i) => i.category)));

  return (
    <>
      <PageHeader title="Gallery" subtitle={`${items.length} photos`} />
      <GalleryManager items={items} categories={categories} />
    </>
  );
}
