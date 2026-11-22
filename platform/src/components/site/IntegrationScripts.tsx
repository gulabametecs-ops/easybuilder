import Script from "next/script";
import type { SiteIntegrations } from "@/lib/integrations";

// Third-party tags for the public site. Every id here already passed the strict
// registry patterns (or the legacy [A-Za-z0-9_-] check), so it is safe inside JS
// string literals. JSON.stringify adds the quotes/escaping as a second guard.
const js = (v: string) => JSON.stringify(v).replace(/</g, "\\u003c");
const loader = (src: string) =>
  `(function(){var s=document.createElement("script");s.async=1;s.src=${js(src)};document.head.appendChild(s);})();`;

export function IntegrationScripts({ i }: { i: SiteIntegrations }) {
  const gtagIds = [i.gaId, i.googleAdsId].filter(Boolean);
  const inline = (id: string, code: string) => (
    <Script key={id} id={id} strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: code }} />
  );
  return (
    <>
      {gtagIds.length > 0 && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gtagIds[0])}`} strategy="afterInteractive" />
          {inline("ga-init", `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());${gtagIds.map((id) => `gtag('config',${js(id)});`).join("")}`)}
        </>
      )}
      {i.gtmId && inline("gtm-init",
        `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',${js(i.gtmId)});`)}
      {i.fbPixelId && inline("fb-pixel",
        `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init',${js(i.fbPixelId)});fbq('track','PageView');`)}
      {i.clarityId && inline("ms-clarity",
        `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script",${js(i.clarityId)});`)}
      {i.hotjarId && inline("hotjar",
        `(function(h){h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};h._hjSettings={hjid:${Number(i.hotjarId)},hjsv:6};})(window);${loader(`https://static.hotjar.com/c/hotjar-${i.hotjarId}.js?sv=6`)}`)}
      {i.linkedinId && inline("linkedin-insight",
        `window._linkedin_data_partner_ids=window._linkedin_data_partner_ids||[];window._linkedin_data_partner_ids.push(${js(i.linkedinId)});${loader("https://snap.licdn.com/li.lms-analytics/insight.min.js")}`)}
      {i.tawk && inline("tawk", `window.Tawk_API=window.Tawk_API||{};window.Tawk_LoadStart=new Date();${loader(`https://embed.tawk.to/${i.tawk.propertyId}/${i.tawk.widgetId}`)}`)}
      {i.crispId && inline("crisp", `window.$crisp=[];window.CRISP_WEBSITE_ID=${js(i.crispId)};${loader("https://client.crisp.chat/l.js")}`)}
      {i.tidioKey && <Script src={`https://code.tidio.co/${i.tidioKey}.js`} strategy="afterInteractive" />}
    </>
  );
}
