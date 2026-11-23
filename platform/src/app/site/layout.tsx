import { notFound, redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import type { Metadata } from "next";
import { getCurrentTenant, getTenantConfig } from "@/lib/tenant";
import { baseUrlFromHost, buildSiteMetadata, localBusinessJsonLd } from "@/lib/seo";
import { themeToStyle, googleFontHref } from "@/components/site/themeVars";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { FloatingButtons } from "@/components/site/FloatingButtons";
import { DemoTimerBar } from "@/components/site/DemoTimerBar";
import { PageViewBeacon } from "@/components/site/PageViewBeacon";
import { IntegrationScripts } from "@/components/site/IntegrationScripts";
import { IntegrationStrip } from "@/components/site/IntegrationStrip";
import { siteIntegrations } from "@/lib/integrations";
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
    // Inside the /demos iframe a redirect would nest the marketing page in itself.
    if ((await headers()).get("sec-fetch-dest") === "iframe") {
      return (
        <div style={{ display: "grid", placeItems: "center", minHeight: "100vh", fontFamily: "system-ui, sans-serif", color: "#334155", textAlign: "center", padding: 24 }}>
          <div>
            <p style={{ fontSize: 18, fontWeight: 600 }}>This demo sandbox has ended.</p>
            <p style={{ marginTop: 8, fontSize: 14 }}>Close the preview and start a new one from the demos page.</p>
          </div>
        </div>
      );
    }
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
      payments: config.payments,
      integrations: config.integrations,
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
  const integrations = siteIntegrations(config.integrations, config.seo);
  // No third-party tags in demo sandboxes or inside iframes (admin builder preview, /demos stage).
  const loadThirdParty = !isDemo && (await headers()).get("sec-fetch-dest") !== "iframe";
  const safeCss = sanitizeCss(config.customCss);

  return (
    <>
      <link rel="stylesheet" href={googleFontHref(config.theme.font)} />
      {safeCss ? <style dangerouslySetInnerHTML={{ __html: safeCss }} /> : null}
      {jsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} /> : null}
      {loadThirdParty && <IntegrationScripts i={integrations} />}
      {/* Inside the /demos live stage the toolbar already shows the timer. */}
      {demoSession?.expiresAt && (await headers()).get("sec-fetch-dest") !== "iframe" && (
        <DemoTimerBar expiresAt={demoSession.expiresAt.toISOString()} link={{ href: "/admin", label: "Open admin panel" }} />
      )}
      <div className="site-root min-h-screen flex flex-col" style={themeToStyle(config.theme)}>
        <SiteHeader header={config.header} />
        <main className="flex-1">{children}</main>
        <IntegrationStrip review={integrations.review} mailchimp={integrations.mailchimp} />
        <SiteFooter footer={config.footer} bizName={tenant.name} />
        <FloatingButtons phone={phone} whatsapp={whatsapp} booking={integrations.booking?.display === "floating" ? integrations.booking : null} />
      </div>
      {!isDemo && <PageViewBeacon />}
    </>
  );
}
