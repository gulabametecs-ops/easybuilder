import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getCurrentTenant,
  getTenantConfig,
  getPageBySlug,
  getPageForEditor,
  getServicesGrouped,
  getGalleryGrouped,
} from "@/lib/tenant";
import { getAuthedSession } from "@/lib/auth";
import { SectionRenderer, type RenderContext } from "@/components/site/SectionRenderer";
import { BuilderBridge } from "@/components/site/BuilderBridge";

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

  // Edit/preview mode — only for the signed-in owner of THIS tenant.
  let editMode = false;
  if (sp.__edit) {
    const authed = await getAuthedSession();
    editMode = !!authed && authed.tenant.id === tenant.id;
  }

  const page = editMode
    ? await getPageForEditor(tenant.id, slugStr)
    : await getPageBySlug(tenant.id, slugStr);
  if (!page) notFound();

  const [config, servicesByCategory, galleryByCategory] = await Promise.all([
    getTenantConfig(tenant.id, tenant.name),
    getServicesGrouped(tenant.id),
    getGalleryGrouped(tenant.id),
  ]);

  const ctx: RenderContext = {
    servicesByCategory,
    galleryByCategory,
    serviceOptions: Array.from(servicesByCategory.keys()),
    footer: config.footer,
    phones: config.header.topbar.phones,
  };

  return (
    <>
      {page.sections.map((section) => (
        <SectionRenderer key={section.id} section={section} ctx={ctx} editMode={editMode} />
      ))}
      {editMode && <BuilderBridge />}
    </>
  );
}
