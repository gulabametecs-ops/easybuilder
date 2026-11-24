import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { getCurrentTenant } from "@/lib/tenant";
import { getSiteCollections, getSiteProducts } from "@/lib/storeServer";

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getCurrentTenant();
  return tenant ? { title: `Collections | ${tenant.name}`, alternates: { canonical: "/collections" } } : {};
}

export default async function CollectionsIndex() {
  const tenant = await getCurrentTenant();
  if (!tenant) notFound();
  const [collections, products] = await Promise.all([getSiteCollections(tenant.id), getSiteProducts(tenant.id)]);
  if (!collections.length) notFound();
  const byId = new Map(products.map((p) => [p.id, p]));
  return (
    <div className="site-sec bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-16">
        <h1 className="text-3xl sm:text-5xl font-bold mb-8 sm:mb-12">Shop our <span className="text-primary">collections</span></h1>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {collections.map((c) => {
            const items = c.productIds.filter((id) => byId.has(id));
            const img = c.image || byId.get(items[0] ?? "")?.images[0] || "";
            return (
              <Link key={c.id} href={`/collections/${c.slug}`} className="group relative block aspect-[4/5] overflow-hidden rounded-[calc(var(--site-radius)*1.2)] bg-light">
                {img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                ) : <span className="w-full h-full flex items-center justify-center text-primary"><ShoppingBag className="w-10 h-10 opacity-60" /></span>}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 text-white">
                  <p className="font-bold text-lg sm:text-xl leading-tight">{c.title}</p>
                  <p className="text-xs sm:text-sm text-white/80 mt-0.5 inline-flex items-center gap-1">{items.length} product{items.length === 1 ? "" : "s"} <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" /></p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
