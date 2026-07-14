import Link from "next/link";
import { notFound } from "next/navigation";
import { getAuthedSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { updatePageMeta, duplicatePage } from "@/lib/actions/content";
import { PageHeader, Card, SaveBar } from "@/components/admin/ui";
import { VisualBuilder } from "@/components/admin/VisualBuilder";
import { ArrowLeft, Copy, Settings2 } from "lucide-react";

type Props = { params: Promise<{ id: string }> };

export default async function PageEditor({ params }: Props) {
  const authed = await getAuthedSession();
  if (!authed) return null;
  const { id } = await params;

  const page = await db.page.findFirst({
    where: { id, tenantId: authed.tenant.id },
    include: { sections: { orderBy: { order: "asc" } } },
  });
  if (!page) notFound();

  const previewPath = page.slug === "home" ? "/" : `/${page.slug}`;

  return (
    <>
      <Link href="/admin/pages" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to pages
      </Link>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <PageHeader title={`Edit: ${page.title}`} subtitle={`/${page.slug === "home" ? "" : page.slug}`} />
        <form action={duplicatePage.bind(null, page.id)}>
          <button className="inline-flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-600 px-3.5 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
            <Copy className="w-4 h-4" /> Duplicate page
          </button>
        </form>
      </div>

      <details className="mb-6 group">
        <summary className="cursor-pointer inline-flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 list-none">
          <Settings2 className="w-4 h-4" /> Page settings &amp; SEO
        </summary>
        <Card className="p-5 mt-3">
          <form action={updatePageMeta} className="space-y-4">
            <input type="hidden" name="id" value={page.id} />
            <label className="block">
              <span className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Page title</span>
              <input name="title" defaultValue={page.title} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800 px-3.5 py-2.5 text-sm outline-none focus:border-lime-500" />
            </label>
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">SEO title (browser tab / Google)</span>
                <input name="seoTitle" defaultValue={page.seoTitle} placeholder="Leave blank to use page title" className="w-full rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800 px-3.5 py-2.5 text-sm outline-none focus:border-lime-500" />
              </label>
              <label className="block">
                <span className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">SEO meta description</span>
                <input name="seoDescription" defaultValue={page.seoDescription} placeholder="Short summary shown in search results" className="w-full rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800 px-3.5 py-2.5 text-sm outline-none focus:border-lime-500" />
              </label>
            </div>
            <label className="block">
              <span className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Social share image URL (this page)</span>
              <input name="seoImage" defaultValue={page.seoImage} placeholder="Leave blank to use the site default" className="w-full rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800 px-3.5 py-2.5 text-sm outline-none focus:border-lime-500" />
            </label>
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <input type="checkbox" name="published" defaultChecked={page.published} className="rounded" /> Published
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <input type="checkbox" name="showInNav" defaultChecked={page.showInNav} className="rounded" /> Show in navigation menu
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <input type="checkbox" name="noindex" defaultChecked={page.noindex} className="rounded" /> Hide from search engines
              </label>
            </div>
            <SaveBar label="Save page settings" />
          </form>
        </Card>
      </details>

      <VisualBuilder pageId={page.id} previewPath={previewPath} sections={page.sections} />
    </>
  );
}
