import { notFound, redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import type { Metadata } from "next";
import Script from "next/script";
import { getCurrentTenant, getTenantConfig } from "@/lib/tenant";
import { baseUrlFromHost, buildSiteMetadata, localBusinessJsonLd } from "@/lib/seo";
import { themeToStyle, googleFontHref } from "@/components/site/themeVars";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { FloatingButtons } from "@/components/site/FloatingButtons";
import { DemoTimerBar } from "@/components/site/DemoTimerBar";
import { checkTenantAccess } from "@/lib/subscription";
import { sanitizeCss } from "@/lib/sanitizeHtml";
import {
  getActiveDemoSessionForTenant,
  isDemoSubdomain,
  loadDemoOverlay,
  demosUnlockUrl,
  verticalForDemoSubdomain,
} from "@/lib/demoSession";
import { applySiteConfigOverlay } from "@/lib/demoOverlay";
import { parseJson, type ThemeConfig, type HeaderConfig, type FooterConfig, type SeoConfig } from "@/lib/config";
import { defaultTheme, defaultHeader, defaultFooter, defaultSeo } from "@/lib/template";
import { ROOT_DOMAIN } from "@/lib/domains";
import { designTheme, designHeader, designFooter } from "@/lib/designs";

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

  const isDemo = isDemoSubdomain(tenant.subdomain);
  const demoSession = isDemo ? await getActiveDemoSessionForTenant(tenant) : null;

  // Demo sites require verified OTP session for this vertical only.
  if (isDemo && !demoSession) {
    const vertical = verticalForDemoSubdomain(tenant.subdomain) ?? tenant.vertical;
    const root = ROOT_DOMAIN.includes("localhost") ? "http" : "https";
    const marketingHost = ROOT_DOMAIN.includes("localhost") ? `localhost:3000` : ROOT_DOMAIN;
    redirect(`${root}://${marketingHost}${demosUnlockUrl(vertical)}`);
  }

  const access = checkTenantAccess(tenant);
  if (!access.allowed && !isDemo) {
    const title =
      access.reason === "expired"
        ? "Subscription expired"
        : access.reason === "cancelled"
          ? "This website has been cancelled"
          : "This website is temporarily unavailable";
    const detail =
      access.reason === "expired"
        ? "The site owner needs to renew their plan to bring this website back online."
        : "Please contact the site owner for more information.";
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white px-6 text-center">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-slate-400 mt-2">{detail}</p>
        </div>
      </div>
    );
  }

  let config = await getTenantConfig(tenant.id, tenant.name);
  if (demoSession) {
    const overlay = await loadDemoOverlay(demoSession.id);
    const raw = await (await import("@/lib/db")).db.siteConfig.findUnique({ where: { tenantId: tenant.id } });
    const merged = applySiteConfigOverlay(
      {
        theme: raw?.theme ?? "{}",
        header: raw?.header ?? "{}",
        footer: raw?.footer ?? "{}",
        seo: raw?.seo ?? "{}",
        customCss: raw?.customCss ?? "",
      },
      overlay,
    );
    config = {
      theme: parseJson<ThemeConfig>(merged.theme, defaultTheme),
      header: parseJson<HeaderConfig>(merged.header, defaultHeader(tenant.name)),
      footer: parseJson<FooterConfig>(merged.footer, defaultFooter(tenant.name)),
      seo: parseJson<SeoConfig>(merged.seo, defaultSeo(tenant.name)),
      customCss: merged.customCss,
      resultConfig: config.resultConfig,
    };
  }

  // Live-demo design preview (?design=… → cookie, set in proxy). Render-only, never saved.
  const previewDesign = demoSession ? (await cookies()).get("site_design")?.value : undefined;
  if (previewDesign) {
    config = {
      ...config,
      theme: designTheme(config.theme, previewDesign),
      header: designHeader(config.header, previewDesign),
      footer: designFooter(config.footer, previewDesign),
    };
  }

  const phone = config.header.topbar.phones[0];
  const whatsapp = config.header.topbar.social.whatsapp;

  const baseUrl = baseUrlFromHost((await headers()).get("host"));
  const jsonLd = localBusinessJsonLd(config, tenant.name, baseUrl);
  // These IDs are interpolated into inline JS — only allow plain ID characters.
  const tagId = (v: string | undefined) => (v && /^[A-Za-z0-9_-]{1,40}$/.test(v) ? v : "");
  const gaId = tagId(config.seo.gaId);
  const gtmId = tagId(config.seo.gtmId);
  const fbPixelId = tagId(config.seo.fbPixelId);
  const clarityId = tagId(config.seo.clarityId);
  const safeCss = sanitizeCss(config.customCss);

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href={googleFontHref(config.theme.font)} />
      {safeCss ? <style dangerouslySetInnerHTML={{ __html: safeCss }} /> : null}
      {jsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} /> : null}
      {gaId ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html:
            `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');` }} />
        </>
      ) : null}
      {gtmId ? (
        <Script id="gtm-init" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html:
          `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');` }} />
      ) : null}
      {fbPixelId ? (
        <Script id="fb-pixel" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html:
          `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${fbPixelId}');fbq('track','PageView');` }} />
      ) : null}
      {clarityId ? (
        <Script id="ms-clarity" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html:
          `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${clarityId}");` }} />
      ) : null}
      {demoSession?.expiresAt && <DemoTimerBar expiresAt={demoSession.expiresAt.toISOString()} />}
      <div className="site-root min-h-screen flex flex-col" style={themeToStyle(config.theme)}>
        <SiteHeader header={config.header} />
        <main className="flex-1">{children}</main>
        <SiteFooter footer={config.footer} bizName={tenant.name} />
        <FloatingButtons phone={phone} whatsapp={whatsapp} />
      </div>
    </>
  );
}
