import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { getCurrentTenant, getSiteProperties, getSitePropertyBySlug, getTenantConfig } from "@/lib/tenant";
import { Icon } from "@/components/site/Icon";
import { ImageSlot } from "@/components/site/ImageSlot";
import { safeHref } from "@/lib/sanitizeHtml";
import { mapsHref } from "@/lib/eventContent";
import { AMENITIES, amenityLabel, formatPrice, priceLabel, purposeLabel, typeLabel } from "@/lib/property";
import { EmiCalculator, PropertyCards, PropertyEnquiry, PropertyGallery } from "@/components/site/sections/PropertyBlocks";

type Props = { params: Promise<{ slug: string }> };

const RADIUS_LG = "rounded-[calc(var(--site-radius)*1.6)]";
const PANEL = `${RADIUS_LG} bg-[var(--site-surface)] ring-1 ring-[var(--site-line)]`;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tenant = await getCurrentTenant();
  if (!tenant) return {};
  const { slug } = await params;
  const p = await getSitePropertyBySlug(tenant.id, slug);
  if (!p) return {};
  const title = `${p.title} — ${priceLabel(p)} | ${tenant.name}`;
  const description = p.summary || p.description.slice(0, 160) || `${p.title} in ${[p.locality, p.city].filter(Boolean).join(", ")}`;
  return {
    title,
    description,
    alternates: { canonical: `/properties/${p.slug}` },
    openGraph: { title, description, url: `/properties/${p.slug}`, images: p.coverImage ? [{ url: p.coverImage }] : undefined },
  };
}

export default async function PropertyDetailPage({ params }: Props) {
  const tenant = await getCurrentTenant();
  if (!tenant) notFound();
  const { slug } = await params;
  const p = await getSitePropertyBySlug(tenant.id, slug);
  if (!p) notFound();
  const [config, all, listPage] = await Promise.all([
    getTenantConfig(tenant.id, tenant.name),
    getSiteProperties(tenant.id),
    // the page that shows the listings ("/properties", "/rooms", "/projects"…), home as fallback
    db.page.findFirst({
      where: { tenantId: tenant.id, published: true, slug: { not: "home" }, sections: { some: { type: "propertyList" } } },
      orderBy: { order: "asc" },
      select: { slug: true, title: true },
    }),
  ]);
  const listHref = listPage ? `/${listPage.slug}` : "/";

  const images = [...new Set([p.coverImage, ...p.gallery].filter(Boolean))];
  const similar = all.filter((x) => x.purpose === p.purpose && x.id !== p.id).slice(0, 3);
  const where = [p.locality, p.city].filter(Boolean).join(", ");
  const fullAddress = p.address || where;
  const mapLink = safeHref(mapsHref(fullAddress, p.mapUrl));
  const mapEmbed = /google\.[a-z.]+\/maps\/embed/.test(p.mapUrl) ? safeHref(p.mapUrl)
    : fullAddress ? `https://maps.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed` : "";
  const brochure = safeHref(p.brochureUrl);
  const video = safeHref(p.videoUrl);
  const closed = p.status === "sold" || p.status === "rented";
  const rentLike = p.purpose === "rent" || p.purpose === "pg";

  const facts: [icon: string, label: string, value: string][] = ([
    ["home", "Property type", p.propertyType ? typeLabel(p.propertyType) : ""],
    ["bed", p.purpose === "project" ? "Configuration" : "BHK", p.bhk],
    ["ruler", "Area", p.areaSqft > 0 ? `${p.areaSqft.toLocaleString("en-IN")} sq.ft` : ""],
    ["sofa", "Furnishing", p.furnishing],
    ["bath", "Bathrooms", p.bathrooms > 0 ? String(p.bathrooms) : ""],
    ["layers", "Floor", p.floor],
    ["compass", "Facing", p.facing],
    ["car", "Parking", p.parking],
    ["calendar", "Available from", p.availableFrom],
    ["key", "Possession", p.possession],
    ["badge-check", "RERA", p.rera],
    ["users", "Sharing", p.sharing],
    ["utensils", "Food", p.foodIncluded ? "Included" : ""],
    ["user-check", "For", p.gender],
  ] as [string, string, string][]).filter(([, , v]) => v);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: p.title,
    description: p.summary || p.description || p.title,
    url: `/properties/${p.slug}`,
    ...(images.length ? { image: images } : {}),
    ...(fullAddress ? { address: { "@type": "PostalAddress", streetAddress: p.address || undefined, addressLocality: p.locality || p.city || undefined, addressRegion: p.city || undefined, addressCountry: "IN" } } : {}),
    offers: {
      "@type": "Offer",
      ...(p.price > 0 ? { price: p.price, priceCurrency: "INR" } : {}),
      availability: closed ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      seller: { "@type": "RealEstateAgent", name: tenant.name },
    },
  };

  return (
    <article className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-8 sm:pt-10">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm site-muted mb-5">
          <Link href="/" className="hover:text-primary">Home</Link>
          <Icon name="arrow" className="w-3.5 h-3.5" />
          <Link href={listHref} className="hover:text-primary">{listPage?.title || "Properties"}</Link>
          <Icon name="arrow" className="w-3.5 h-3.5" />
          <span className="text-primary truncate max-w-[14rem]">{p.title}</span>
        </nav>

        {closed && (
          <div className="mb-5 rounded-xl bg-slate-900 text-white px-4 py-3 text-sm font-semibold flex items-center gap-2">
            <Icon name="check" className="w-4 h-4" /> This property has been {p.status === "sold" ? "sold" : "rented out"}. See similar listings below.
          </div>
        )}
        {p.status === "under-offer" && (
          <div className="mb-5 rounded-xl bg-amber-100 text-amber-900 px-4 py-3 text-sm font-semibold">Under offer — enquire to join the waitlist.</div>
        )}

        <div className="grid lg:grid-cols-[minmax(0,1fr)_380px] gap-8 lg:gap-10 items-start">
          <div className="min-w-0 space-y-10">
            <PropertyGallery images={images} title={p.title} />

            <header>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="rounded-full bg-primary text-white text-xs font-semibold px-3 py-1">{purposeLabel(p.purpose)}</span>
                {p.featured && <span className="rounded-full bg-primary/10 text-primary text-xs font-semibold px-3 py-1">Featured</span>}
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight">{p.title}</h1>
              {where && <p className="mt-2 site-muted inline-flex items-center gap-1.5"><Icon name="map-pin" className="w-4 h-4 shrink-0" />{where}</p>}
              <div className="mt-5 flex flex-wrap items-end gap-x-8 gap-y-3">
                <div>
                  <p className="text-3xl sm:text-4xl font-extrabold text-primary tabular-nums">{priceLabel(p)}</p>
                  {p.priceNote && !p.priceNote.startsWith("/") && <p className="text-sm site-muted">{p.priceNote}</p>}
                </div>
                {rentLike && p.deposit > 0 && <PriceBit label="Deposit" value={formatPrice(p.deposit)} />}
                {p.maintenance > 0 && <PriceBit label="Maintenance" value={`${formatPrice(p.maintenance)} /month`} />}
                {p.purpose !== "pg" && p.areaSqft > 0 && p.price > 0 && !rentLike && (
                  <PriceBit label="Per sq.ft" value={`₹${Math.round(p.price / p.areaSqft).toLocaleString("en-IN")}`} />
                )}
              </div>
            </header>

            {facts.length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-4">Key facts</h2>
                <dl className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {facts.map(([icon, label, value]) => (
                    <div key={label} className={`${PANEL} p-4 flex gap-3 min-w-0`}>
                      <span className="w-9 h-9 shrink-0 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><Icon name={icon} className="w-4 h-4" /></span>
                      <div className="min-w-0">
                        <dt className="text-[11px] uppercase tracking-wider site-muted font-semibold">{label}</dt>
                        <dd className="font-semibold text-sm mt-0.5 break-words">{value}</dd>
                      </div>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            {p.highlights.length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-3">Highlights</h2>
                <ul className="grid sm:grid-cols-2 gap-2">
                  {p.highlights.map((h) => (
                    <li key={h} className="flex gap-2"><Icon name="check" className="w-4 h-4 text-primary mt-1 shrink-0" /> {h}</li>
                  ))}
                </ul>
              </section>
            )}

            {p.description && (
              <section>
                <h2 className="text-xl font-bold mb-3">About this property</h2>
                <p className="leading-relaxed site-muted whitespace-pre-wrap">{p.description}</p>
              </section>
            )}

            {p.amenities.length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-4">Amenities</h2>
                <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {p.amenities.map((a) => (
                    <li key={a} className={`${PANEL} px-3 py-3 flex items-center gap-2.5 text-sm font-medium`}>
                      <Icon name={AMENITIES.find((x) => x.id === a)?.icon ?? "check"} className="w-4 h-4 text-primary shrink-0" />
                      {amenityLabel(a)}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {p.floorPlans.length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-4">Floor plans</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {p.floorPlans.map((f, i) => (
                    <a key={`${f.label}-${i}`} href={safeHref(f.image) || undefined} target="_blank" rel="noreferrer" className={`${PANEL} overflow-hidden block`}>
                      <ImageSlot src={f.image} alt={f.label} w={800} h={600} showBadge className="w-full aspect-[4/3] bg-white" imgClassName="w-full h-full object-contain" />
                      <div className="p-3">
                        <p className="font-semibold text-sm">{f.label}</p>
                        {f.area && <p className="text-xs site-muted">{f.area}</p>}
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            )}

            {(p.purpose === "sale" || p.purpose === "project") && p.price > 0 && !closed && (
              <section>
                <h2 className="text-xl font-bold mb-4">EMI calculator</h2>
                <EmiCalculator price={p.price} />
              </section>
            )}

            {fullAddress && (
              <section>
                <h2 className="text-xl font-bold mb-3">Location</h2>
                <p className="site-muted mb-3 inline-flex gap-1.5"><Icon name="map-pin" className="w-4 h-4 mt-1 shrink-0" />{fullAddress}</p>
                {mapEmbed && (
                  <div className={`${RADIUS_LG} overflow-hidden ring-1 ring-[var(--site-line)] aspect-[16/9] bg-slate-100`}>
                    <iframe src={mapEmbed} className="w-full h-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Map" />
                  </div>
                )}
                {mapLink && <a href={mapLink} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-primary text-sm font-semibold">Open in Google Maps <Icon name="arrow" className="w-3.5 h-3.5" /></a>}
              </section>
            )}

            {(brochure || video) && (
              <section className="flex flex-wrap gap-3">
                {brochure && <a href={brochure} target="_blank" rel="noreferrer" className="btn-primary inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold"><Icon name="download" className="w-4 h-4" /> Download brochure</a>}
                {video && <a href={video} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl ring-1 ring-inset ring-[var(--site-line)] px-5 py-3 text-sm font-semibold hover:text-primary"><Icon name="play" className="w-4 h-4 text-primary" /> Watch video tour</a>}
              </section>
            )}
          </div>

          <aside className="lg:sticky lg:top-24 min-w-0">
            <PropertyEnquiry title={p.title} purpose={p.purpose} phone={config.header.topbar.phones?.[0]} whatsapp={config.header.topbar.social.whatsapp} />
          </aside>
        </div>
      </div>

      {similar.length > 0 && (
        <section className="bg-light py-16 mt-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">Similar <span className="text-primary">properties</span></h2>
            <PropertyCards list={similar} />
          </div>
        </section>
      )}
      {!similar.length && <div className="pb-16" />}
    </article>
  );
}

function PriceBit({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wider site-muted font-semibold">{label}</p>
      <p className="font-bold tabular-nums">{value}</p>
    </div>
  );
}
