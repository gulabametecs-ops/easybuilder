import Link from "next/link";
import { getAuthedSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { PageHeader, Badge } from "@/components/admin/ui";
import { PagesManager } from "@/components/admin/PagesManager";

export const metadata = { title: "Pages" };

export default async function PagesPage() {
  const authed = await getAuthedSession();
  if (!authed) return null;

  const pages = await db.page.findMany({
    where: { tenantId: authed.tenant.id },
    orderBy: { order: "asc" },
    include: {
      sections: { orderBy: { order: "asc" }, select: { type: true, visible: true } },
    },
  });

  const payload = pages.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    published: p.published,
    showInNav: p.showInNav,
    isSystem: p.isSystem,
    sectionCount: p.sections.length,
    sectionTypes: p.sections.filter((s) => s.visible).map((s) => s.type).slice(0, 8),
  }));

  return (
    <>
      <PageHeader
        title="Pages & Sections"
        subtitle="Create pages from ready layouts, then edit content visually."
      />
      <PagesManager pages={payload} />
    </>
  );
}
