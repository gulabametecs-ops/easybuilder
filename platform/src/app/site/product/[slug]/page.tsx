import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Truck, RotateCcw, ShieldCheck, ChevronRight } from "lucide-react";
import { getCurrentTenant } from "@/lib/tenant";
import { getSiteProductBySlug, getSiteProducts, getStoreSettings } from "@/lib/storeServer";
import { inr, paymentMethods, productHref, waLink } from "@/lib/store";
import { PriceTag, ProductCard } from "@/components/site/sections/StoreBlocks";
import { BuyBox, ProductGallery } from "@/components/site/store/StoreClient";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tenant = await getCurrentTenant();
  if (!tenant) return {};
  const p = await getSiteProductBySlug(tenant.id, (await params).slug);
  if (!p) return {};
  const title = `${p.name} — ${inr(p.price)} | ${tenant.name}`;
  const description = p.description.slice(0, 160) || `Buy ${p.name} online from ${tenant.name}.`;
  return {
    title, description,
    alternates: { canonical: productHref(p.slug) },
    openGraph: { title, description, url: productHref(p.slug), images: p.images[0] ? [{ url: p.images[0] }] : undefined },
  };
}

export default async function ProductPage({ params }: Props) {
  const tenant = await getCurrentTenant();
  if (!tenant) notFound();
  const p = await getSiteProductBySlug(tenant.id, (await params).slug);
  if (!p) notFound();
  const [all, settings] = await Promise.all([getSiteProducts(tenant.id), getStoreSettings(tenant.id)]);
  const similar = all.filter((x) => x.id !== p.id && x.category === p.category).concat(all.filter((x) => x.id !== p.id && x.category !== p.category)).slice(0, 4);
  const wa = paymentMethods(settings).includes("whatsapp") ? waLink(settings.whatsappNumber, `Hi! I'm interested in ${p.name} (${inr(p.price)}).`) : "";
  const perks = [
    { Icon: Truck, t: settings.freeShippingAbove > 0 ? `Free delivery above ${inr(settings.freeShippingAbove)}` : "Fast delivery across India" },
    { Icon: RotateCcw, t: "Easy 7-day returns" },
    { Icon: ShieldCheck, t: settings.codEnabled ? "Cash on delivery available" : "Secure UPI payments" },
  ];
  const ld = {
    "@context": "https://schema.org", "@type": "Product", name: p.name, description: p.description, image: p.images, category: p.category,
    offers: { "@type": "Offer", priceCurrency: "INR", price: p.price, availability: `https://schema.org/${p.stock > 0 ? "InStock" : "OutOfStock"}` },
  };

  return (
    <div className="site-sec bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\u003c") }} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
        <nav className="flex items-center gap-1.5 text-sm site-muted mb-6 min-w-0" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary">Home</Link><ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <Link href="/shop" className="hover:text-primary">Shop</Link><ChevronRight className="w-3.5 h-3.5 shrink-0" />
          {p.category && <><Link href={`/shop?c=${encodeURIComponent(p.category)}`} className="hover:text-primary truncate">{p.category}</Link><ChevronRight className="w-3.5 h-3.5 shrink-0" /></>}
          <span className="text-primary truncate">{p.name}</span>
        </nav>
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14">
          <ProductGallery p={p} />
          <div className="min-w-0">
            {p.badge && <span className="inline-block rounded-full bg-primary text-white text-xs font-bold uppercase tracking-wide px-3 py-1 mb-3">{p.badge}</span>}
            {p.category && <p className="text-xs font-semibold uppercase tracking-wider site-muted">{p.category}</p>}
            <h1 className="text-2xl sm:text-4xl font-bold leading-tight mt-1">{p.name}</h1>
            <div className="mt-4"><PriceTag p={p} big /></div>
            <p className="text-xs site-muted mt-1">Inclusive of all taxes</p>
            <div className="mt-6"><BuyBox p={p} whatsappUrl={wa} /></div>
            <ul className="mt-8 grid sm:grid-cols-3 gap-3">
              {perks.map(({ Icon, t }) => (
                <li key={t} className="flex items-center gap-2 rounded-xl bg-light px-3 py-3 text-xs font-semibold"><Icon className="w-4 h-4 text-primary shrink-0" />{t}</li>
              ))}
            </ul>
            {p.description && (
              <div className="mt-8">
                <h2 className="text-lg font-bold mb-2">Product details</h2>
                <p className="site-muted leading-relaxed whitespace-pre-line">{p.description}</p>
              </div>
            )}
          </div>
        </div>
        {similar.length > 0 && (
          <section className="mt-16 sm:mt-24">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">You may also <span className="text-primary">like</span></h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">{similar.map((x) => <ProductCard key={x.id} p={x} />)}</div>
          </section>
        )}
      </div>
    </div>
  );
}
