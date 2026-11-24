import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import { getCurrentTenant } from "@/lib/tenant";
import { getSiteCollections, getSiteProducts } from "@/lib/storeServer";
import { ProductGridBlock } from "@/components/site/sections/StoreBlocks";
import { SECTION_DEFAULTS } from "@/lib/sectionDefaults";

type Props = { params: Promise<{ slug: string }> };

async function load(slug: string) {
  const tenant = await getCurrentTenant();
  if (!tenant) return null;
  const c = (await getSiteCollections(tenant.id)).find((x) => x.slug === slug);
  return c ? { tenant, c } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const r = await load((await params).slug);
  if (!r) return {};
  const title = `${r.c.title} | ${r.tenant.name}`;
  const description = r.c.description.slice(0, 160) || `Shop ${r.c.title} at ${r.tenant.name}.`;
  return { title, description, alternates: { canonical: `/collections/${r.c.slug}` }, openGraph: { title, description, images: r.c.image ? [{ url: r.c.image }] : undefined } };
}

export default async function CollectionPage({ params }: Props) {
  const r = await load((await params).slug);
  if (!r) notFound();
  const { tenant, c } = r;
  const products = await getSiteProducts(tenant.id);
  const grid = { ...SECTION_DEFAULTS.productGrid, eyebrow: "", title: "", titleHighlight: "", subtitle: "", collection: c.slug, showFilters: true, limit: 0, buttonLabel: "", emptyText: "Products will appear here soon." };
  return (
    <div className="site-sec bg-white">
      <div className="relative overflow-hidden bg-light">
        {c.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={c.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" />
        )}
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-16">
          <nav className="flex items-center gap-1.5 text-sm site-muted mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary">Home</Link><ChevronRight className="w-3.5 h-3.5" />
            <Link href="/collections" className="hover:text-primary">Collections</Link><ChevronRight className="w-3.5 h-3.5" />
            <span className="text-primary truncate">{c.title}</span>
          </nav>
          <h1 className="text-3xl sm:text-5xl font-bold">{c.title}</h1>
          {c.description && <p className="site-muted mt-3 max-w-2xl whitespace-pre-line">{c.description}</p>}
        </div>
      </div>
      <div className="-mt-8 sm:-mt-12">
        <ProductGridBlock c={grid} products={products} collections={[c]} />
      </div>
    </div>
  );
}
