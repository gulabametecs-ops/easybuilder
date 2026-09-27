import Link from "next/link";
import { notFound } from "next/navigation";
import { getAuthedSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { updatePageMeta, duplicatePage } from "@/lib/actions/content";
import { SaveBar } from "@/components/admin/ui";
import { VisualBuilder } from "@/components/admin/VisualBuilder";
import { ArrowLeft, Copy, Settings2, ExternalLink } from "lucide-react";
import { getTenantConfig } from "@/lib/tenant";
import { getActiveDemoSessionForTenant, isDemoSubdomain, loadDemoOverlay } from "@/lib/demoSession";
import { applySectionsOverlay } from "@/lib/demoOverlay";

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

  // Demo sandbox: show overlay edits (not only DB seed).
  let sections = page.sections;
  if (isDemoSubdomain(authed.tenant.subdomain)) {
    const demo = await getActiveDemoSessionForTenant(authed.tenant);
    if (demo) {
      const overlay = await loadDemoOverlay(demo.id);
      sections = applySectionsOverlay(page.sections, page.id, overlay);
    }
  }

  const site = await getTenantConfig(authed.tenant.id, authed.tenant.name);
  const previewPath = page.slug === "home" ? "/" : `/${page.slug}`;

  return (
    <div className="admin-full-bleed flex flex-col flex-1 min-h-0 gap-2">
      <div className="shrink-0 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Link href="/admin/pages" className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 shrink-0">
            <ArrowLeft className="w-3.5 h-3.5" /> Pages
          </Link>
          <span className="text-slate-300 dark:text-slate-600">/</span>
          <h1 className="text-base font-bold text-slate-900 dark:text-white truncate">{page.title}</h1>
          <span className="text-xs text-slate-400 shrink-0">{sections.length} sections</span>
          <a href={previewPath} target="_blank" className="text-xs text-lime-600 hover:underline inline-flex items-center gap-1 shrink-0">
            View live <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <details className="relative">
            <summary className="list-none cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-600 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
              <Settings2 className="w-3.5 h-3.5" /> Settings
            </summary>
            <div className="absolute right-0 top-full mt-1 z-30 w-[min(100vw-2rem,22rem)] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl p-4">
              <form action={updatePageMeta} className="space-y-3">
                <input type="hidden" name="id" value={page.id} />
                <label className="block">
                  <span className="block text-xs font-medium text-slate-500 mb-1">Page name</span>
                  <input name="title" defaultValue={page.title} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800 px-3 py-2 text-sm outline-none focus:border-lime-500" />
                </label>
                <label className="block">
                  <span className="block text-xs font-medium text-slate-500 mb-1">Google title</span>
                  <input name="seoTitle" defaultValue={page.seoTitle} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800 px-3 py-2 text-sm outline-none focus:border-lime-500" />
                </label>
                <label className="block">
                  <span className="block text-xs font-medium text-slate-500 mb-1">Google description</span>
                  <input name="seoDescription" defaultValue={page.seoDescription} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800 px-3 py-2 text-sm outline-none focus:border-lime-500" />
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <input type="checkbox" name="published" defaultChecked={page.published} className="rounded" /> Published
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <input type="checkbox" name="showInNav" defaultChecked={page.showInNav} className="rounded" /> Show in menu
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <input type="checkbox" name="noindex" defaultChecked={page.noindex} className="rounded" /> Hide from Google
                </label>
                <input type="hidden" name="seoImage" value={page.seoImage} />
                <SaveBar label="Save" />
              </form>
            </div>
          </details>
          <form action={duplicatePage.bind(null, page.id)}>
            <button type="submit" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-600 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
              <Copy className="w-3.5 h-3.5" /> Duplicate
            </button>
          </form>
        </div>
      </div>

      <VisualBuilder pageId={page.id} previewPath={previewPath} sections={sections} siteColors={site.theme.colors} />
    </div>
  );
}
