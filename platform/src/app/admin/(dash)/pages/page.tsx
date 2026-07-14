import Link from "next/link";
import { getAuthedSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { createPage } from "@/lib/actions/content";
import { PageHeader, Card, Badge } from "@/components/admin/ui";
import { DeletePageButton } from "@/components/admin/PageRowActions";
import { Pencil } from "lucide-react";

export const metadata = { title: "Pages" };

export default async function PagesPage() {
  const authed = await getAuthedSession();
  if (!authed) return null;

  const pages = await db.page.findMany({
    where: { tenantId: authed.tenant.id },
    orderBy: { order: "asc" },
    include: { _count: { select: { sections: true } } },
  });

  return (
    <>
      <PageHeader title="Pages & Sections" subtitle="Manage your website pages and their content blocks." />

      <Card className="p-5 mb-6">
        <form action={createPage} className="flex flex-col sm:flex-row gap-3 sm:items-end">
          <label className="flex-1">
            <span className="block text-sm font-medium text-slate-600 mb-1">Add a new page</span>
            <input name="title" placeholder="e.g. Testimonials" required className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-lime-500" />
          </label>
          <button className="rounded-lg bg-slate-900 text-white font-semibold px-5 py-2.5 text-sm hover:bg-slate-800">Create page</button>
        </form>
      </Card>

      <div className="space-y-3">
        {pages.map((p) => (
          <Card key={p.id} className="flex items-center gap-3 p-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-slate-900">{p.title}</p>
                {p.isSystem && <Badge tone="blue">system</Badge>}
                {!p.published && <Badge tone="amber">draft</Badge>}
                {p.showInNav && <Badge tone="slate">in menu</Badge>}
              </div>
              <p className="text-sm text-slate-400 mt-0.5">/{p.slug === "home" ? "" : p.slug} · {p._count.sections} sections</p>
            </div>
            <Link href={`/admin/pages/${p.id}`} className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200" title="Edit"><Pencil className="w-4 h-4" /></Link>
            {!p.isSystem && <DeletePageButton id={p.id} />}
          </Card>
        ))}
      </div>
    </>
  );
}
