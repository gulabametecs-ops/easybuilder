import { test } from "node:test";
import assert from "node:assert/strict";
import { validateIntegration, parseIntegrations, siteIntegrations } from "./integrations";

const ok = (id: string, v: Record<string, string>) => validateIntegration(id, v).ok;

test("accepts well-formed ids and URLs", () => {
  assert.ok(ok("ga4", { id: "G-ABC123XYZ" }));
  assert.ok(ok("gtm", { id: "GTM-5XK2P9" }));
  assert.ok(ok("metaPixel", { id: "1234567890123456" }));
  assert.ok(ok("tawk", { propertyId: "64f1c0a2b3c4d5e6f7a8b9c0", widgetId: "1h9abcdef" }));
  assert.ok(ok("crisp", { websiteId: "3f2b1c4d-1111-2222-3333-444455556666" }));
  assert.ok(ok("stripe", { url: "https://buy.stripe.com/test_abc123" }));
  assert.ok(ok("paypal", { url: "https://paypal.me/acme" }));
  assert.ok(ok("calendly", { url: "https://calendly.com/acme/30min", display: "section" }));
  assert.ok(ok("mailchimp", { action: "https://acme.us1.list-manage.com/subscribe/post?u=abc&id=def" }));
  assert.ok(ok("upi", { upiId: "acme@okhdfcbank" }));
  assert.ok(ok("razorpay", { razorpayKeyId: "rzp_live_ABCdef123456" }));
});

test("rejects bad ids, wrong domains and script-ish input", () => {
  assert.ok(!ok("ga4", { id: "UA-1234" }));
  assert.ok(!ok("ga4", { id: "G-1');alert(1);//" }));
  assert.ok(!ok("metaPixel", { id: "12ab" }));
  assert.ok(!ok("tawk", { propertyId: "<script>", widgetId: "x" }));
  assert.ok(!ok("stripe", { url: "https://evil.com/buy.stripe.com" }));
  assert.ok(!ok("stripe", { url: "https://buy.stripe.com.evil.com/x" }));
  assert.ok(!ok("stripe", { url: "http://buy.stripe.com/x" }));
  assert.ok(!ok("paypal", { url: "javascript:alert(1)" }));
  assert.ok(!ok("calendly", { url: "https://calendly.com/a\"onmouseover=\"x" }));
  assert.ok(!ok("calendly", { url: "https://calendly.com/a", display: "popup" }));
  assert.ok(!ok("googleVerify", { token: "<meta name=x>" }));
  assert.ok(!ok("googleReviews", { url: "https://g.page/r/x", ratingText: "<img src=x onerror=alert(1)>" }));
  assert.ok(!ok("upi", {}));
  assert.ok(!ok("nope", { id: "x" }));
  assert.ok(!ok("ga4", {})); // required
});

test("parse drops invalid / unknown entries; site view honours enabled + legacy fallback", () => {
  const cfg = parseIntegrations(JSON.stringify({
    ga4: { enabled: true, values: { id: "G-NEW12345" } },
    hotjar: { enabled: true, values: { id: "</script>" } },
    tidio: { enabled: false, values: { publicKey: "abcdefghijklmnopqrstuvwxyz123456" } },
    bogus: { enabled: true, values: {} },
    razorpay: { enabled: true, values: { razorpayKeyId: "rzp_live_ABCdef123456" } }, // payments-backed, never stored here
  }));
  assert.deepEqual(Object.keys(cfg).sort(), ["ga4", "razorpay", "tidio"]);
  assert.deepEqual(cfg.razorpay.values, {}); // payments-backed: only the on/off marker is kept here
  const site = siteIntegrations(cfg, { gaId: "G-OLD", gtmId: "GTM-OLD1" });
  assert.equal(site.gaId, "G-NEW12345");
  assert.equal(site.gtmId, "GTM-OLD1");
  assert.equal(site.tidioKey, "");
  assert.equal(site.hotjarId, "");
  assert.deepEqual(parseIntegrations("not json"), {});
});

import { smartExtract } from "./integrations";

test("smartExtract pulls validated ids out of snippets and links", () => {
  const tawk = `<!--Start of Tawk.to Script--><script type="text/javascript">var Tawk_API=Tawk_API||{};(function(){var s1=document.createElement("script");s1.src='https://embed.tawk.to/64f1c0a2b3c4d5e6f7a8b9c0/1h9abcdef';})();</script>`;
  assert.deepEqual(smartExtract("tawk", tawk), { propertyId: "64f1c0a2b3c4d5e6f7a8b9c0", widgetId: "1h9abcdef" });
  assert.deepEqual(smartExtract("tawk", "https://tawk.to/chat/64f1c0a2b3c4d5e6f7a8b9c0/default"), { propertyId: "64f1c0a2b3c4d5e6f7a8b9c0", widgetId: "default" });
  assert.deepEqual(smartExtract("ga4", `<script async src="https://www.googletagmanager.com/gtag/js?id=G-ABC123XYZ"></script><script>gtag('config', 'G-ABC123XYZ');</script>`), { id: "G-ABC123XYZ" });
  assert.deepEqual(smartExtract("gtm", `})(window,document,'script','dataLayer','GTM-5XK2P9');</script>`), { id: "GTM-5XK2P9" });
  assert.deepEqual(smartExtract("metaPixel", `fbq('init', '1234567890123456');fbq('track', 'PageView');`), { id: "1234567890123456" });
  assert.deepEqual(smartExtract("clarity", `(window, document, "clarity", "script", "abcd1234ef");`), { id: "abcd1234ef" });
  assert.deepEqual(smartExtract("hotjar", `h._hjSettings={hjid:3456789,hjsv:6};`), { id: "3456789" });
  assert.deepEqual(smartExtract("linkedin", `_linkedin_partner_id = "1234567";`), { id: "1234567" });
  assert.deepEqual(smartExtract("googleAds", `gtag('config', 'AW-123456789');`), { id: "AW-123456789" });
  assert.deepEqual(smartExtract("crisp", `window.$crisp=[];window.CRISP_WEBSITE_ID="3f2b1c4d-1111-2222-3333-444455556666";`), { websiteId: "3f2b1c4d-1111-2222-3333-444455556666" });
  assert.deepEqual(smartExtract("tidio", `<script src="//code.tidio.co/abcdefghijklmnopqrstuvwxyz123456.js" async></script>`), { publicKey: "abcdefghijklmnopqrstuvwxyz123456" });
  assert.deepEqual(smartExtract("calendly", "Book here: https://calendly.com/acme/30min?month=2026-11."), { url: "https://calendly.com/acme/30min" });
  assert.deepEqual(smartExtract("calcom", "cal.com/acme/intro"), { url: "https://cal.com/acme/intro" });
  assert.deepEqual(smartExtract("paypal", "paypal.me/acme"), { url: "https://paypal.me/acme" });
  assert.deepEqual(smartExtract("upi", "  acme @ okhdfcbank "), { upiId: "acme@okhdfcbank" });
  assert.deepEqual(smartExtract("upi", "upi://pay?pa=acme%40okaxis&pn=Acme"), { upiId: "acme@okaxis" });
  assert.deepEqual(smartExtract("googleVerify", `<meta name="google-site-verification" content="AbC_dEf-123456789xyz" />`), { token: "AbC_dEf-123456789xyz" });
  assert.deepEqual(smartExtract("bingVerify", `<meta name="msvalidate.01" content="0123456789ABCDEF0123456789ABCDEF" />`), { token: "0123456789ABCDEF0123456789ABCDEF" });
  assert.deepEqual(smartExtract("googleReviews", "https://g.page/r/CabcDEF123/review"), { url: "https://g.page/r/CabcDEF123/review" });
  assert.deepEqual(smartExtract("mailchimp", `<form action="https://acme.us1.list-manage.com/subscribe/post?u=abc123&amp;id=def456" method="post">`), { action: "https://acme.us1.list-manage.com/subscribe/post?u=abc123&id=def456" });
  assert.deepEqual(smartExtract("razorpay", "Key Id: rzp_live_ABCdef123456"), { razorpayKeyId: "rzp_live_ABCdef123456" });
});

test("smartExtract returns nothing for junk or wrong-provider input", () => {
  assert.deepEqual(smartExtract("ga4", "<script>alert(1)</script>"), {});
  assert.deepEqual(smartExtract("stripe", "https://evil.com/buy.stripe.com"), {});
  assert.deepEqual(smartExtract("tawk", "https://embed.tawk.to/notahexid/xyz"), {});
  assert.deepEqual(smartExtract("googleVerify", `<meta name="google-site-verification" content="x"><script>`), {});
  assert.deepEqual(smartExtract("calendly", "https://calendly.com.evil.io/x"), {});
  assert.deepEqual(smartExtract("nope", "G-ABC123"), {});
});
