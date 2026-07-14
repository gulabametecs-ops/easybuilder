import { notFound } from "next/navigation";
import { headers } from "next/headers";
import type { Metadata } from "next";
import Script from "next/script";
import { getCurrentTenant, getTenantConfig } from "@/lib/tenant";
import { baseUrlFromHost, buildSiteMetadata, localBusinessJsonLd } from "@/lib/seo";
import { themeToStyle, googleFontHref } from "@/components/site/themeVars";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { FloatingButtons } from "@/components/site/FloatingButtons";

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getCurrentTenant();
  if (!tenant) return {};
  const config = await getTenantConfig(tenant.id, tenant.name);
  const baseUrl = baseUrlFromHost((await headers()).get("host"));
  return buildSiteMetadata(config, tenant.name, baseUrl);
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const tenant = await getCurrentTenant();
  if (!tenant) notFound();

  // Suspended by the platform owner (super admin) — block the public site.
  if (tenant.status === "suspended") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white px-6 text-center">
        <div>
          <h1 className="text-2xl font-bold">This website is temporarily unavailable</h1>
          <p className="text-slate-400 mt-2">Please contact the site owner for more information.</p>
        </div>
      </div>
    );
  }

  const config = await getTenantConfig(tenant.id, tenant.name);
  const phone = config.header.topbar.phones[0];
  const whatsapp = config.header.topbar.social.whatsapp;

  const baseUrl = baseUrlFromHost((await headers()).get("host"));
  const jsonLd = localBusinessJsonLd(config, tenant.name, baseUrl);
  const gaId = config.seo.gaId;

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href={googleFontHref(config.theme.font)} />
      {config.customCss ? <style dangerouslySetInnerHTML={{ __html: config.customCss }} /> : null}
      {jsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /> : null}
      {gaId ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html:
            `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');` }} />
        </>
      ) : null}
      <div className="site-root min-h-screen flex flex-col" style={themeToStyle(config.theme)}>
        <SiteHeader header={config.header} />
        <main className="flex-1">{children}</main>
        <SiteFooter footer={config.footer} bizName={tenant.name} />
        <FloatingButtons phone={phone} whatsapp={whatsapp} />
      </div>
    </>
  );
}
