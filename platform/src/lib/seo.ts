import type { Metadata } from "next";
import type { TenantConfig } from "./tenant";

// Builds the base URL from the incoming request host.
export function baseUrlFromHost(host: string | null | undefined): string {
  const h = host ?? "localhost:3000";
  const proto = h.includes("localhost") || h.startsWith("127.") ? "http" : "https";
  return `${proto}://${h}`;
}

// Site-wide metadata (merged with, and overridable by, each page's metadata).
export function buildSiteMetadata(config: TenantConfig, bizName: string, baseUrl: string): Metadata {
  const seo = config.seo;
  const ogImages = seo.ogImage ? [{ url: seo.ogImage }] : undefined;
  return {
    metadataBase: new URL(baseUrl),
    title: seo.title || bizName,
    description: seo.description,
    applicationName: bizName,
    keywords: seo.keywords ? seo.keywords.split(",").map((k) => k.trim()).filter(Boolean) : undefined,
    icons: seo.favicon ? [{ url: seo.favicon }] : undefined,
    alternates: { canonical: baseUrl },
    robots: seo.indexable === false
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      type: "website",
      siteName: bizName,
      title: seo.title || bizName,
      description: seo.description,
      url: baseUrl,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      site: seo.twitterHandle || undefined,
      title: seo.title || bizName,
      description: seo.description,
      images: seo.ogImage ? [seo.ogImage] : undefined,
    },
    verification: seo.googleVerification ? { google: seo.googleVerification } : undefined,
  };
}

// LocalBusiness structured data (JSON-LD) built from the tenant's own config.
export function localBusinessJsonLd(config: TenantConfig, bizName: string, baseUrl: string): Record<string, unknown> | null {
  const seo = config.seo;
  if (!seo.localBusiness) return null;
  const tb = config.header.topbar;
  const fc = config.footer.contact;
  const social = { ...config.footer.social, ...config.header.topbar.social } as Record<string, string | undefined>;
  const sameAs = [social.facebook, social.instagram].filter(Boolean);
  const phone = tb.phones?.[0] || fc.phones?.[0];
  const address = tb.address || fc.address;
  const email = tb.email || fc.email;

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": seo.businessType || "LocalBusiness",
    name: bizName,
    url: baseUrl,
  };
  const image = seo.ogImage || seo.favicon;
  if (image) data.image = image;
  if (phone) data.telephone = phone;
  if (email) data.email = email;
  if (address) data.address = { "@type": "PostalAddress", streetAddress: address };
  if (seo.priceRange) data.priceRange = seo.priceRange;
  if (seo.geoLat && seo.geoLng) data.geo = { "@type": "GeoCoordinates", latitude: seo.geoLat, longitude: seo.geoLng };
  if (sameAs.length) data.sameAs = sameAs;
  return data;
}
