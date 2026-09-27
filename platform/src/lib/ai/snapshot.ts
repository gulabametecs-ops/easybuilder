import { db } from "@/lib/db";

/** Compact site snapshot stored before AI modifications for rollback reference. */
export async function captureSiteSnapshot(tenantId: string, pageId?: string): Promise<object> {
  const cfg = await db.siteConfig.findUnique({ where: { tenantId } });
  const pages = await db.page.findMany({
    where: { tenantId, ...(pageId ? { id: pageId } : {}) },
    orderBy: { order: "asc" },
    include: { sections: { orderBy: { order: "asc" } } },
  });

  return {
    theme: cfg?.theme ?? "{}",
    header: cfg?.header ?? "{}",
    pages: pages.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      order: p.order,
      sections: p.sections.map((s) => ({
        id: s.id,
        type: s.type,
        order: s.order,
        content: s.content,
        style: s.style,
      })),
    })),
  };
}
