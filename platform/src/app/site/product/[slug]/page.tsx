import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Truck, RotateCcw, ShieldCheck, ChevronRight } from "lucide-react";
import { getCurrentTenant } from "@/lib/tenant";
import { getProductReviews, getSiteProductBySlug, getSiteProducts, getStoreSettings } from "@/lib/storeServer";
import { fromPrice, inr, isSoldOut, paymentMethods, productHref, waLink } from "@/lib/store";
import { ProductCard } from "@/components/site/sections/StoreBlocks";
import { PincodeCheck } from "@/components/site/PincodeCheck";
import { ProductDetail, ProductReviews, RecentlyViewed } from "@/components/site/store/StoreClient";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tenant = await getCurrentTenant();
  if (!tenant) return {};
  const p = await getSiteProductBySlug(tenant.id, (await params).slug);
  if (!p) return {};
  const title = p.seoTitle || `${p.name} — ${inr(fromPrice(p))} | ${tenant.name}`;
  const description = p.seoDescription || p.description.slice(0, 160) || `Buy ${p.name} online from ${tenant.name}.`;
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
  const [all, settings, reviews] = await Promise.all([getSiteProducts(tenant.id), getStoreSettings(tenant.id), getProductReviews(tenant.id, p.id)]);
  const similar = all.filter((x) => x.id !== p.id && x.category === p.category).concat(all.filter((x) => x.id !== p.id && x.category !== p.category)).slice(0, 4);
  const wa = paymentMethods(settings).includes("whatsapp") ? waLink(settings.whatsappNumber, `Hi! I'm interested in ${p.name} (${inr(p.price)}).`) : "";
  const perks = [
    { Icon: Truck, t: settings.freeShippingAbove > 0 ? `Free delivery above ${inr(settings.freeShippingAbove)}` : "Fast delivery across India" },
    { Icon: RotateCcw, t: settings.shipping.returnWindowDays ? `Easy ${settings.shipping.returnWindowDays}-day returns` : "Quality checked before dispatch" },
    { Icon: ShieldCheck, t: settings.codEnabled ? "Cash on delivery available" : "Secure UPI payments" },
  ];
  const availability = `https://schema.org/${isSoldOut(p) ? "OutOfStock" : "InStock"}`;
  const ld = {
    "@context": "https://schema.org", "@type": "Product", name: p.name, description: p.seoDescription || p.description, image: p.images, category: p.category,
    ...(p.sku ? { sku: p.sku } : {}),
    offers: p.variants.length
      ? { "@type": "AggregateOffer", priceCurrency: "INR", lowPrice: fromPrice(p), highPrice: Math.max(...p.variants.map((v) => v.price || p.price)), offerCount: p.variants.length, availability }
      : { "@type": "Offer", priceCurrency: "INR", price: p.price, availability },
    ...(p.reviewCount ? { aggregateRating: { "@type": "AggregateRating", ratingValue: p.rating, reviewCount: p.reviewCount } } : {}),
  };

  return (
    <div className="site-sec bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
        <nav className="flex items-center gap-1.5 text-sm site-muted mb-6 min-w-0" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary">Home</Link><ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <Link href="/shop" className="hover:text-primary">Shop</Link><ChevronRight className="w-3.5 h-3.5 shrink-0" />
          {p.category && <><Link href={`/shop?c=${encodeURIComponent(p.category)}`} className="hover:text-primary truncate">{p.category}</Link><ChevronRight className="w-3.5 h-3.5 shrink-0" /></>}
          <span className="text-primary truncate">{p.name}</span>
        </nav>
        <ProductDetail p={p} whatsappUrl={wa}>
          {!isSoldOut(p) && (
            <div className="mt-6">
              <p className="text-sm font-semibold mb-2">Check delivery</p>
              <PincodeCheck subtotal={fromPrice(p)} weightGrams={p.weightGrams || settings.shipping.defaultWeightGrams} />
            </div>
          )}
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
          {p.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {p.tags.map((t) => <Link key={t} href={`/shop?tag=${encodeURIComponent(t)}`} className="rounded-full bg-light px-3 py-1 text-xs font-semibold hover:text-primary">#{t}</Link>)}
            </div>
          )}
        </ProductDetail>
        <ProductReviews productId={p.id} productName={p.name} rating={p.rating} count={p.reviewCount} reviews={reviews} />
        {similar.length > 0 && (
          <section className="mt-16 sm:mt-24">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">You may also <span className="text-primary">like</span></h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">{similar.map((x) => <ProductCard key={x.id} p={x} />)}</div>
          </section>
        )}
        <RecentlyViewed excludeId={p.id} />
      </div>
    </div>
  );
}
