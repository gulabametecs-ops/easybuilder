import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getCurrentTenant,
  getTenantConfig,
  getPageBySlug,
  getPageForEditor,
  getServicesGrouped,
  getGalleryGrouped,
  getSiteNotices,
} from "@/lib/tenant";
import { getAuthedSession } from "@/lib/auth";
import { faqJsonLd } from "@/lib/seo";
import { SectionRenderer, type RenderContext } from "@/components/site/SectionRenderer";
import { BuilderBridge } from "@/components/site/BuilderBridge";
import { getActiveDemoSessionForTenant, loadDemoOverlay, trackDemoPageView, isDemoSubdomain } from "@/lib/demoSession";
import { applySectionsOverlay } from "@/lib/demoOverlay";
import { designSections } from "@/lib/designs";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug?: string[] }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

function slugFrom(parts?: string[]): string {
  if (!parts || parts.length === 0) return "home";
  return parts.join("/");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tenant = await getCurrentTenant();
  if (!tenant) return {};
  const config = await getTenantConfig(tenant.id, tenant.name);
  const { slug } = await params;
  const slugStr = slugFrom(slug);
  const isHome = slugStr === "home";
  const page = await getPageBySlug(tenant.id, slugStr);

  const title = page?.seoTitle || (page && !isHome ? `${page.title} — ${tenant.name}` : config.seo.title);
  const description = page?.seoDescription || config.seo.description;
  const ogImage = page?.seoImage || config.seo.ogImage;
  const path = isHome ? "/" : `/${slugStr}`;
  const siteHidden = config.seo.indexable === false;

  return {
    title,
    description,
    alternates: { canonical: path },
    robots: siteHidden || page?.noindex ? { index: false, follow: false } : undefined,
    openGraph: { title, description, url: path, images: ogImage ? [{ url: ogImage }] : undefined },
    twitter: { title, description, images: ogImage ? [ogImage] : undefined },
  };
}

export default async function SitePage({ params, searchParams }: Props) {
  const tenant = await getCurrentTenant();
  if (!tenant) notFound();

  const { slug } = await params;
  const sp = await searchParams;
  const slugStr = slugFrom(slug);

  const demoSession = isDemoSubdomain(tenant.subdomain)
    ? await getActiveDemoSessionForTenant(tenant)
    : null;

  if (demoSession) {
    await trackDemoPageView(demoSession.id, slugStr);
  }

  let editMode = false;
  if (sp.__edit) {
    const authed = await getAuthedSession();
    editMode = !!authed && authed.tenant.id === tenant.id;
  }
  // Demo: only enter builder edit mode when explicitly requested (?__edit=1) with admin session.
  // Default demo browsing shows the complete public website.

  const page = editMode
    ? await getPageForEditor(tenant.id, slugStr)
    : await getPageBySlug(tenant.id, slugStr);
  if (!page) notFound();

  let sections = page.sections.map((s) => ({ ...s, pageId: page.id }));
  if (demoSession) {
    const overlay = await loadDemoOverlay(demoSession.id);
    sections = applySectionsOverlay(sections, page.id, overlay);
    // Public view hides invisible sections; editor preview keeps them (dimmed via BuilderBridge).
    if (!editMode) sections = sections.filter((s) => s.visible);
    // Live-demo design preview (cookie set by proxy from ?design=). Render-only.
    const previewDesign = (await cookies()).get("site_design")?.value;
    if (previewDesign && !editMode) sections = designSections(sections, previewDesign);
  } else if (!editMode) {
    sections = sections.filter((s) => s.visible);
  }

  const [config, servicesByCategory, galleryByCategory, notices] = await Promise.all([
    getTenantConfig(tenant.id, tenant.name),
    getServicesGrouped(tenant.id),
    getGalleryGrouped(tenant.id),
    getSiteNotices(tenant.id),
  ]);

  const ctx: RenderContext = {
    servicesByCategory,
    galleryByCategory,
    serviceOptions: Array.from(servicesByCategory.keys()),
    footer: config.footer,
    phones: config.header.topbar.phones,
    notices,
  };

  const faqItems = config.seo.faqSchema !== false
    ? sections.filter((s) => s.type === "faq").flatMap((s) => {
        try { return (JSON.parse(s.content).items ?? []) as { q: string; a: string }[]; } catch { return []; }
      })
    : [];
  const faqLd = faqJsonLd(faqItems);

  return (
    <>
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd).replace(/</g, "\\u003c") }} />}
      {sections.map((section) => (
        <SectionRenderer key={section.id} section={section} ctx={ctx} editMode={editMode} />
      ))}
      {editMode && <BuilderBridge />}
    </>
  );
}
