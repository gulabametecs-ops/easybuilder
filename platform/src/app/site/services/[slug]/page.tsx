import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCurrentTenant, getTenantConfig } from "@/lib/tenant";
import { db } from "@/lib/db";
import { img } from "@/lib/img";
import { Icon, categoryIcon } from "@/components/site/Icon";

type Props = { params: Promise<{ slug: string }> };

const slugify = (t: string) => t.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

async function findService(tenantId: string, slug: string) {
  const bySlug = await db.service.findFirst({ where: { tenantId, slug } });
  if (bySlug) return bySlug;
  // legacy fallback: match by slugified title
  const all = await db.service.findMany({ where: { tenantId } });
  return all.find((s) => slugify(s.title) === slug) ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tenant = await getCurrentTenant();
  if (!tenant) return {};
  const { slug } = await params;
  const svc = await findService(tenant.id, slug);
  if (!svc) return {};
  const title = svc.seoTitle || `${svc.title} — ${tenant.name}`;
  const description = svc.seoDescription || svc.description || `${svc.title} by ${tenant.name}.`;
  return {
    title,
    description,
    alternates: { canonical: `/services/${svc.slug || slug}` },
    openGraph: { title, description, url: `/services/${svc.slug || slug}`, images: svc.image ? [{ url: svc.image }] : undefined },
    twitter: { title, description, images: svc.image ? [svc.image] : undefined },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const tenant = await getCurrentTenant();
  if (!tenant) notFound();
  const { slug } = await params;
  const svc = await findService(tenant.id, slug);
  if (!svc) notFound();

  const [config, related] = await Promise.all([
    getTenantConfig(tenant.id, tenant.name),
    db.service.findMany({ where: { tenantId: tenant.id, category: svc.category, NOT: { id: svc.id } }, orderBy: { order: "asc" }, take: 4 }),
  ]);
  const cta = config.header.cta ?? { label: "Enquire Now", href: "/contact" };
  const phone = config.header.topbar.phones?.[0];
  const image = svc.image || img(`${svc.title}-service`, 1200, 800);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: svc.title,
    description: svc.description || svc.longDescription || `${svc.title} by ${tenant.name}`,
    category: svc.category,
    provider: { "@type": "LocalBusiness", name: tenant.name },
    ...(svc.image ? { image: svc.image } : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      {/* Banner */}
      <section className="relative bg-secondary text-white overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--c-dark)] via-[var(--c-dark)]/90 to-[var(--c-dark)]/60" />
        <div className="relative mx-auto max-w-7xl px-4 py-16">
          <div className="flex items-center gap-2 text-sm text-white/60 mb-3">
            <Link href="/" className="hover:text-primary">Home</Link><Icon name="arrow" className="w-3.5 h-3.5" />
            <Link href="/services" className="hover:text-primary">Services</Link><Icon name="arrow" className="w-3.5 h-3.5" />
            <span className="text-primary">{svc.title}</span>
          </div>
          <span className="inline-block rounded-full bg-primary/20 text-primary text-xs font-semibold px-3 py-1 mb-3">{svc.category}</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold">{svc.title}</h1>
        </div>
      </section>

      {/* Detail */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 grid lg:grid-cols-[1.4fr_1fr] gap-10 items-start">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt={svc.title} className="w-full aspect-video rounded-2xl object-cover shadow-lg mb-6" />
            {svc.description && <p className="text-lg text-slate-700 leading-relaxed">{svc.description}</p>}
            {svc.longDescription && <div className="mt-4 text-slate-600 leading-relaxed whitespace-pre-line">{svc.longDescription}</div>}
          </div>
          <aside className="lg:sticky lg:top-6 rounded-2xl border border-slate-200 bg-light p-6">
            <h3 className="font-bold text-heading text-lg">Interested in {svc.title}?</h3>
            <p className="text-sm text-slate-500 mt-1">Get in touch and we&apos;ll help you right away.</p>
            <Link href={cta.href} className="btn-primary mt-4 w-full inline-flex items-center justify-center gap-2 px-5 py-3 font-semibold"><Icon name="edit" className="w-4 h-4" /> {cta.label}</Link>
            {phone && <a href={`tel:${phone}`} className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-white"><Icon name="phone" className="w-4 h-4 text-primary" /> {phone}</a>}
          </aside>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="py-16 bg-light">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="text-2xl font-extrabold mb-6">More in <span className="text-primary">{svc.category}</span></h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map((r) => (
                <Link key={r.id} href={`/services/${r.slug || slugify(r.title)}`} className="card bg-white border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all overflow-hidden block group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={r.image || img(r.title, 600, 400)} alt={r.title} className="w-full h-32 object-cover group-hover:scale-105 transition-transform" />
                  <div className="p-4"><h4 className="font-semibold text-sm text-secondary">{r.title}</h4>
                    <span className="inline-flex items-center gap-1 text-primary text-xs font-semibold mt-2">View details <Icon name="arrow" className="w-3 h-3 group-hover:translate-x-1 transition-transform" /></span></div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
