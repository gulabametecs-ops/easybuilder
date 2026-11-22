// Integrations ("plugins") registry. Every value a tenant can enter is a plain
// ID / token / https URL validated against a strict pattern — never raw HTML or
// script. The public site interpolates only values that pass these patterns.
import type { SeoConfig } from "./config";
import type { PublicPayments, TenantPayments } from "./payments";

export type IntegrationCategory = "payments" | "chat" | "analytics" | "booking" | "reviews" | "verification" | "marketing";

export const INTEGRATION_CATEGORIES: { id: IntegrationCategory; label: string }[] = [
  { id: "payments", label: "Payments" },
  { id: "chat", label: "Live chat" },
  { id: "analytics", label: "Analytics & ads" },
  { id: "booking", label: "Booking" },
  { id: "reviews", label: "Reviews" },
  { id: "verification", label: "Verification" },
  { id: "marketing", label: "Marketing" },
];

export type IntegrationField = {
  key: string;
  label: string;
  placeholder?: string;
  pattern?: RegExp; // required for free-text fields
  options?: { value: string; label: string }[]; // select fields
  optional?: boolean;
  type?: "text" | "secret" | "image" | "select";
  help?: string;
};

export type IntegrationDef = {
  id: string;
  name: string;
  category: IntegrationCategory;
  description: string;
  icon: string; // lucide-react icon name
  color: string; // brand colour (hex)
  helpUrl: string; // "Where do I find this?"
  fields: IntegrationField[];
  /** Stored in SiteConfig.payments (shared with Settings → Payments) instead of SiteConfig.integrations. */
  storage?: "payments";
};

// ─── Patterns ────────────────────────────────────────────────────────────────
const URL_TAIL = String.raw`(?:/[A-Za-z0-9._~/@%+:-]*)?(?:\?[A-Za-z0-9._~=&%+/:-]*)?`;
/** https URL on one of the given hosts (subdomains not allowed unless listed). */
export function httpsOn(...hosts: string[]): RegExp {
  const h = hosts.map((x) => x.replace(/\./g, "\\.")).join("|");
  return new RegExp(`^https://(?:${h})${URL_TAIL}$`);
}
const TOKEN = /^[A-Za-z0-9_-]{6,120}$/;
const LABEL = /^[^<>"'`{}\\]{1,60}$/; // display text only, rendered as React text
const IMAGE_URL = /^(?:https:\/\/[A-Za-z0-9.-]+(?:\/[A-Za-z0-9._~/@%+:=&?-]*)?|\/[A-Za-z0-9._~/%-]+)$/;

const label = (key: string, labelText: string, placeholder: string): IntegrationField => ({
  key, label: labelText, placeholder, pattern: LABEL, optional: true,
});

export const INTEGRATIONS: IntegrationDef[] = [
  // ── Payments ──
  {
    id: "razorpay", name: "Razorpay", category: "payments", storage: "payments",
    description: "Accept cards, UPI and netbanking on your Donate / Pay blocks.",
    icon: "CreditCard", color: "#0C2451", helpUrl: "https://dashboard.razorpay.com/app/website-app-settings/api-keys",
    fields: [
      { key: "razorpayKeyId", label: "Key ID", placeholder: "rzp_live_XXXXXXXXXXXX", pattern: /^rzp_(?:test|live)_[A-Za-z0-9]{8,32}$/ },
      { key: "razorpayKeySecret", label: "Key secret", placeholder: "Leave blank to keep the saved secret", pattern: /^[A-Za-z0-9]{12,64}$/, type: "secret", optional: true, help: "Stored securely on the server — never shown on your site." },
    ],
  },
  {
    id: "upi", name: "UPI", category: "payments", storage: "payments",
    description: "Show your UPI ID and QR code so visitors can pay from any UPI app.",
    icon: "QrCode", color: "#5F259F", helpUrl: "https://www.npci.org.in/what-we-do/upi/product-overview",
    fields: [
      { key: "upiId", label: "UPI ID", placeholder: "yourname@okhdfcbank", pattern: /^[A-Za-z0-9._-]{2,256}@[A-Za-z0-9]{2,64}$/, optional: true },
      { key: "upiQrImage", label: "QR code image", placeholder: "Upload your QR (optional)", pattern: IMAGE_URL, type: "image", optional: true, help: "If empty, a QR is generated from your UPI ID." },
    ],
  },
  {
    id: "razorpayPage", name: "Razorpay Payment Page", category: "payments",
    description: "Link to a hosted Razorpay Payment Page or payment link.",
    icon: "Link", color: "#3395FF", helpUrl: "https://dashboard.razorpay.com/app/paymentpages",
    fields: [
      { key: "url", label: "Payment page URL", placeholder: "https://rzp.io/l/yourpage", pattern: httpsOn("rzp.io", "pages.razorpay.com", "razorpay.me") },
      label("label", "Button label", "Pay with Razorpay"),
    ],
  },
  {
    id: "paypal", name: "PayPal.me", category: "payments",
    description: "Let international visitors pay you through PayPal.",
    icon: "Wallet", color: "#003087", helpUrl: "https://www.paypal.com/paypalme/",
    fields: [
      { key: "url", label: "PayPal.me link", placeholder: "https://paypal.me/yourname", pattern: httpsOn("paypal.me", "www.paypal.me", "www.paypal.com") },
      label("label", "Button label", "Pay with PayPal"),
    ],
  },
  {
    id: "stripe", name: "Stripe Payment Link", category: "payments",
    description: "Collect payments with a Stripe-hosted checkout link.",
    icon: "CreditCard", color: "#635BFF", helpUrl: "https://dashboard.stripe.com/payment-links",
    fields: [
      { key: "url", label: "Payment link URL", placeholder: "https://buy.stripe.com/xxxx", pattern: httpsOn("buy.stripe.com") },
      label("label", "Button label", "Pay with card"),
    ],
  },
  {
    id: "instamojo", name: "Instamojo", category: "payments",
    description: "Share an Instamojo payment link for quick checkouts.",
    icon: "Link", color: "#2B2A6B", helpUrl: "https://www.instamojo.com/payment-links/",
    fields: [
      { key: "url", label: "Instamojo link", placeholder: "https://imjo.in/xxxxxx", pattern: httpsOn("imjo.in", "www.instamojo.com", "instamojo.com") },
      label("label", "Button label", "Pay with Instamojo"),
    ],
  },
  {
    id: "cashfree", name: "Cashfree", category: "payments",
    description: "Add a Cashfree payment link button to your site.",
    icon: "Link", color: "#6933D3", helpUrl: "https://www.cashfree.com/payment-links/",
    fields: [
      { key: "url", label: "Cashfree payment link", placeholder: "https://payments.cashfree.com/links/xxxx", pattern: httpsOn("payments.cashfree.com", "cfre.in") },
      label("label", "Button label", "Pay with Cashfree"),
    ],
  },
  // ── Chat ──
  {
    id: "tawk", name: "Tawk.to", category: "chat",
    description: "Free live chat widget — answer visitors in real time.",
    icon: "MessageCircle", color: "#03A84E", helpUrl: "https://help.tawk.to/article/finding-your-property-id-and-widget-id",
    fields: [
      { key: "propertyId", label: "Property ID", placeholder: "64f1c0a2b3c4d5e6f7a8b9c0", pattern: /^[a-f0-9]{24}$/ },
      { key: "widgetId", label: "Widget ID", placeholder: "1h9abcdef", pattern: /^[A-Za-z0-9]{4,32}$/ },
    ],
  },
  {
    id: "crisp", name: "Crisp", category: "chat",
    description: "Modern chat inbox with mobile apps for your team.",
    icon: "MessagesSquare", color: "#1972F5", helpUrl: "https://help.crisp.chat/en/article/how-to-find-the-website-id-1ylqx1s/",
    fields: [
      { key: "websiteId", label: "Website ID", placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", pattern: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i },
    ],
  },
  {
    id: "tidio", name: "Tidio", category: "chat",
    description: "Live chat plus AI chatbot for common questions.",
    icon: "Bot", color: "#0566FF", helpUrl: "https://help.tidio.com/hc/en-us/articles/5381543414812",
    fields: [
      { key: "publicKey", label: "Public key", placeholder: "abcdefghijklmnopqrstuvwxyz123456", pattern: /^[A-Za-z0-9]{20,40}$/ },
    ],
  },
  // ── Analytics & ads ──
  {
    id: "ga4", name: "Google Analytics 4", category: "analytics",
    description: "Visitor stats, traffic sources and conversions.",
    icon: "BarChart3", color: "#E37400", helpUrl: "https://support.google.com/analytics/answer/9539598",
    fields: [{ key: "id", label: "Measurement ID", placeholder: "G-XXXXXXXXXX", pattern: /^G-[A-Z0-9]{4,15}$/ }],
  },
  {
    id: "gtm", name: "Google Tag Manager", category: "analytics",
    description: "Manage all your tags from one container.",
    icon: "Tags", color: "#246FDB", helpUrl: "https://support.google.com/tagmanager/answer/6103696",
    fields: [{ key: "id", label: "Container ID", placeholder: "GTM-XXXXXXX", pattern: /^GTM-[A-Z0-9]{4,10}$/ }],
  },
  {
    id: "metaPixel", name: "Meta Pixel", category: "analytics",
    description: "Measure Facebook & Instagram ad results and build audiences.",
    icon: "Target", color: "#0866FF", helpUrl: "https://www.facebook.com/business/help/952192354843755",
    fields: [{ key: "id", label: "Pixel ID", placeholder: "1234567890123456", pattern: /^\d{10,20}$/ }],
  },
  {
    id: "clarity", name: "Microsoft Clarity", category: "analytics",
    description: "Free heatmaps and session recordings.",
    icon: "MousePointerClick", color: "#0078D4", helpUrl: "https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-setup",
    fields: [{ key: "id", label: "Project ID", placeholder: "abcd1234ef", pattern: /^[A-Za-z0-9]{6,20}$/ }],
  },
  {
    id: "hotjar", name: "Hotjar", category: "analytics",
    description: "Heatmaps, recordings and on-site feedback.",
    icon: "Flame", color: "#FF3C00", helpUrl: "https://help.hotjar.com/hc/en-us/articles/115011639927",
    fields: [{ key: "id", label: "Site ID", placeholder: "1234567", pattern: /^\d{5,10}$/ }],
  },
  {
    id: "linkedin", name: "LinkedIn Insight Tag", category: "analytics",
    description: "Track conversions and retarget LinkedIn ad audiences.",
    icon: "Briefcase", color: "#0A66C2", helpUrl: "https://www.linkedin.com/help/lms/answer/a418880",
    fields: [{ key: "id", label: "Partner ID", placeholder: "1234567", pattern: /^\d{4,12}$/ }],
  },
  {
    id: "googleAds", name: "Google Ads", category: "analytics",
    description: "Conversion tracking and remarketing for Google Ads.",
    icon: "Megaphone", color: "#FBBC04", helpUrl: "https://support.google.com/google-ads/answer/6095821",
    fields: [{ key: "id", label: "Conversion ID", placeholder: "AW-123456789", pattern: /^AW-\d{6,15}$/ }],
  },
  // ── Booking ──
  ...(["calendly", "calcom"] as const).map((id): IntegrationDef => ({
    id,
    name: id === "calendly" ? "Calendly" : "Cal.com",
    category: "booking",
    description: id === "calendly" ? "Let visitors book a call on your Calendly." : "Open-source scheduling — share your Cal.com booking page.",
    icon: "CalendarCheck",
    color: id === "calendly" ? "#006BFF" : "#111827",
    helpUrl: id === "calendly" ? "https://help.calendly.com/hc/en-us/articles/223193448" : "https://cal.com/docs",
    fields: [
      { key: "url", label: "Booking page URL", placeholder: id === "calendly" ? "https://calendly.com/yourname/30min" : "https://cal.com/yourname/30min", pattern: id === "calendly" ? httpsOn("calendly.com") : httpsOn("cal.com", "app.cal.com") },
      label("label", "Button label", "Book a call"),
      { key: "display", label: "Show as", type: "select", options: [{ value: "floating", label: "Floating button" }, { value: "section", label: "Button in the Pay online section" }] },
    ],
  })),
  // ── Reviews ──
  {
    id: "googleReviews", name: "Google Reviews", category: "reviews",
    description: "Add a \"Review us on Google\" button to your site.",
    icon: "Star", color: "#FBBC05", helpUrl: "https://support.google.com/business/answer/3474122",
    fields: [
      { key: "url", label: "Review link", placeholder: "https://g.page/r/xxxx/review", pattern: httpsOn("g.page", "search.google.com", "www.google.com", "maps.app.goo.gl", "goo.gl", "maps.google.com", "g.co") },
      label("ratingText", "Rating text", "4.9 ★ from 120 reviews"),
    ],
  },
  // ── Verification ──
  ...([
    ["googleVerify", "Google Search Console", "#4285F4", "https://support.google.com/webmasters/answer/9008080", "google-site-verification"],
    ["bingVerify", "Bing Webmaster", "#008373", "https://www.bing.com/webmasters/help/add-and-verify-site-12184f8b", "msvalidate.01"],
    ["pinterestVerify", "Pinterest", "#E60023", "https://help.pinterest.com/en/business/article/claim-your-website", "p:domain_verify"],
    ["facebookVerify", "Facebook domain", "#1877F2", "https://www.facebook.com/business/help/321167023127050", "facebook-domain-verification"],
  ] as const).map(([id, name, color, helpUrl, meta]): IntegrationDef => ({
    id, name, category: "verification", color, helpUrl, icon: "BadgeCheck",
    description: `Verify site ownership (<meta name="${meta}">).`,
    fields: [{ key: "token", label: "Verification code", placeholder: "content=\"…\" value only", pattern: TOKEN }],
  })),
  // ── Marketing ──
  {
    id: "mailchimp", name: "Mailchimp", category: "marketing",
    description: "Collect newsletter sign-ups straight into your audience.",
    icon: "Mail", color: "#FFE01B", helpUrl: "https://mailchimp.com/help/host-your-own-signup-forms/",
    fields: [
      { key: "action", label: "Signup form action URL", placeholder: "https://xxxx.us1.list-manage.com/subscribe/post?u=…&id=…", pattern: /^https:\/\/[a-z0-9-]+(?:\.[a-z0-9-]+)*\.list-manage\.com\/subscribe\/post\?[A-Za-z0-9=&_.-]+$/ },
      label("title", "Heading", "Join our newsletter"),
    ],
  },
];

export const INTEGRATION_BY_ID = new Map(INTEGRATIONS.map((d) => [d.id, d]));

// ─── Storage ─────────────────────────────────────────────────────────────────
/** Payments-backed integrations (razorpay/upi) keep only enabled + updatedAt here; their values live in SiteConfig.payments. */
export type IntegrationEntry = { enabled: boolean; values: Record<string, string>; updatedAt?: string };
export type IntegrationsConfig = Record<string, IntegrationEntry>;

export type ValidationResult = { ok: true; values: Record<string, string> } | { ok: false; error: string };

/** Strictly validates user input for one integration. Unknown keys are dropped. */
/** Error for one field value, or null when valid. Shared by server validation and the live admin form. */
export function fieldError(f: IntegrationField, raw: unknown): string | null {
  const v = typeof raw === "string" ? raw.trim() : "";
  if (!v) return f.type === "select" || f.optional ? null : `${f.label} is required.`;
  if (f.type === "select") return f.options!.some((o) => o.value === v) ? null : `Invalid ${f.label}.`;
  if (!f.pattern || !f.pattern.test(v)) return `${f.label} doesn't look right — e.g. ${f.placeholder ?? "see help"}.`;
  return null;
}

export function validateIntegration(id: string, input: Record<string, unknown>): ValidationResult {
  const def = INTEGRATION_BY_ID.get(id);
  if (!def) return { ok: false, error: "Unknown integration." };
  const values: Record<string, string> = {};
  for (const f of def.fields) {
    const err = fieldError(f, input[f.key]);
    if (err) return { ok: false, error: err };
    const v = typeof input[f.key] === "string" ? (input[f.key] as string).trim() : "";
    if (v) values[f.key] = v;
    else if (f.type === "select") values[f.key] = f.options![0].value;
  }
  if (id === "upi" && !values.upiId && !values.upiQrImage) return { ok: false, error: "Add a UPI ID or a QR image." };
  return { ok: true, values };
}

/** Parses the stored JSON, dropping unknown integrations and anything that fails validation. */
export function parseIntegrations(raw: string | null | undefined): IntegrationsConfig {
  let data: unknown;
  try {
    data = JSON.parse(raw || "{}");
  } catch {
    return {};
  }
  const out: IntegrationsConfig = {};
  if (!data || typeof data !== "object") return out;
  for (const [id, entry] of Object.entries(data as Record<string, unknown>)) {
    const def = INTEGRATION_BY_ID.get(id);
    if (!def || !entry || typeof entry !== "object") continue;
    const e = entry as { enabled?: unknown; values?: unknown; updatedAt?: unknown };
    const updatedAt = typeof e.updatedAt === "string" && !Number.isNaN(Date.parse(e.updatedAt)) ? e.updatedAt : undefined;
    if (def.storage) {
      out[id] = { enabled: e.enabled !== false, values: {}, updatedAt };
      continue;
    }
    const res = validateIntegration(id, (e.values && typeof e.values === "object" ? e.values : {}) as Record<string, unknown>);
    if (res.ok) out[id] = { enabled: e.enabled !== false, values: res.values, updatedAt };
  }
  return out;
}

export function serializeIntegrations(cfg: IntegrationsConfig): string {
  return JSON.stringify(cfg);
}

// ─── Public-site view ────────────────────────────────────────────────────────
export type PayLink = { id: string; name: string; url: string; label: string; color: string };
export type SiteIntegrations = {
  gaId: string; gtmId: string; fbPixelId: string; clarityId: string;
  hotjarId: string; linkedinId: string; googleAdsId: string;
  tawk: { propertyId: string; widgetId: string } | null;
  crispId: string; tidioKey: string;
  payLinks: PayLink[];
  booking: { name: string; url: string; label: string; display: string } | null;
  review: { url: string; ratingText: string } | null;
  mailchimp: { action: string; title: string } | null;
  verification: { google: string; bing: string; pinterest: string; facebook: string };
};

// Legacy SEO analytics ids were only checked against this when injected.
const legacyId = (v: string | undefined) => (v && /^[A-Za-z0-9_-]{1,40}$/.test(v) ? v : "");

/** Resolves enabled integrations (+ legacy SEO fallbacks) into ready-to-render values. */
export function siteIntegrations(cfg: IntegrationsConfig, seo: Partial<SeoConfig>): SiteIntegrations {
  const on = (id: string) => (cfg[id]?.enabled ? cfg[id].values : null);
  const v = (id: string, key: string) => on(id)?.[key] ?? "";
  const payLinks = INTEGRATIONS.filter((d) => d.category === "payments" && !d.storage && on(d.id)).map((d) => ({
    id: d.id, name: d.name, url: v(d.id, "url"), label: v(d.id, "label") || `Pay with ${d.name.replace(/ Payment (Link|Page)$/, "")}`, color: d.color,
  }));
  const bookingId = on("calendly") ? "calendly" : on("calcom") ? "calcom" : "";
  return {
    gaId: v("ga4", "id") || legacyId(seo.gaId),
    gtmId: v("gtm", "id") || legacyId(seo.gtmId),
    fbPixelId: v("metaPixel", "id") || legacyId(seo.fbPixelId),
    clarityId: v("clarity", "id") || legacyId(seo.clarityId),
    hotjarId: v("hotjar", "id"),
    linkedinId: v("linkedin", "id"),
    googleAdsId: v("googleAds", "id"),
    tawk: on("tawk") ? { propertyId: v("tawk", "propertyId"), widgetId: v("tawk", "widgetId") } : null,
    crispId: v("crisp", "websiteId"),
    tidioKey: v("tidio", "publicKey"),
    payLinks,
    booking: bookingId
      ? { name: INTEGRATION_BY_ID.get(bookingId)!.name, url: v(bookingId, "url"), label: v(bookingId, "label") || "Book a call", display: v(bookingId, "display") || "floating" }
      : null,
    review: on("googleReviews") ? { url: v("googleReviews", "url"), ratingText: v("googleReviews", "ratingText") } : null,
    mailchimp: on("mailchimp") ? { action: v("mailchimp", "action"), title: v("mailchimp", "title") || "Join our newsletter" } : null,
    verification: {
      google: v("googleVerify", "token") || seo.googleVerification || "",
      bing: v("bingVerify", "token") || seo.bingVerification || "",
      pinterest: v("pinterestVerify", "token"),
      facebook: v("facebookVerify", "token"),
    },
  };
}

/** Connected = has values (payments-backed ones read the payments config). */
export function isConnected(def: IntegrationDef, cfg: IntegrationsConfig, payments: Pick<TenantPayments | PublicPayments, "razorpayKeyId" | "upiId" | "upiQrImage">): boolean {
  if (def.id === "razorpay") return Boolean(payments.razorpayKeyId);
  if (def.id === "upi") return Boolean(payments.upiId || payments.upiQrImage);
  return Boolean(cfg[def.id]) && !def.storage;
}

/** Integrations that used to live in SEO settings: integration id → [field key, SeoConfig key]. */
export const LEGACY_SEO_FIELDS: Record<string, [string, keyof SeoConfig]> = {
  ga4: ["id", "gaId"],
  gtm: ["id", "gtmId"],
  metaPixel: ["id", "fbPixelId"],
  clarity: ["id", "clarityId"],
  googleVerify: ["token", "googleVerification"],
  bingVerify: ["token", "bingVerification"],
};

/** Hide payment methods the tenant switched off in Integrations (values stay saved). */
export function applyPaymentToggles<T extends { razorpayKeyId: string; upiId: string; upiQrImage: string; razorpayReady?: boolean }>(p: T, cfg: IntegrationsConfig): T {
  const out = { ...p };
  if (cfg.razorpay?.enabled === false) Object.assign(out, { razorpayKeyId: "", razorpayReady: false });
  if (cfg.upi?.enabled === false) Object.assign(out, { upiId: "", upiQrImage: "" });
  return out;
}

export type IntegrationStatus = "connected" | "off" | "setup" | "none";

export function integrationStatus(
  def: IntegrationDef,
  cfg: IntegrationsConfig,
  payments: Pick<TenantPayments | PublicPayments, "razorpayKeyId" | "upiId" | "upiQrImage">,
  opts: { hasRazorpaySecret?: boolean; legacy?: boolean } = {},
): IntegrationStatus {
  if (!isConnected(def, cfg, payments)) return "none";
  if (opts.legacy) return "setup"; // still stored in SEO settings — save here to manage
  if (def.id === "razorpay" && !opts.hasRazorpaySecret) return "setup";
  return cfg[def.id]?.enabled === false ? "off" : "connected";
}

// ─── "Paste anything" smart input ────────────────────────────────────────────
// Pull the right ID/URL out of whatever the owner pastes (embed snippet, dashboard
// URL, share link, <meta> tag…). Every candidate is re-checked with fieldError, so
// only a validated id/URL is ever returned — never the pasted HTML.

const firstMatch = (text: string, ...res: RegExp[]) => {
  for (const re of res) {
    const m = text.match(re);
    if (m) return m.slice(1).length ? m.slice(1) : [m[0]];
  }
  return null;
};

/** Finds a URL on one of `hosts` in the text; adds https:// when missing; drops trailing punctuation. */
function findUrl(text: string, hosts: string[], keepQuery = true): string {
  const h = hosts.map((x) => x.replace(/\./g, "\\.")).join("|");
  const m = text.match(new RegExp(`(?<![\\w.@/-])(?:https?://)?(?:${h})(?![\\w.-])(?:/[^\\s"'<>()]*)?`, "i"));
  if (!m) return "";
  let url = m[0].replace(/^http:\/\//i, "https://").replace(/[.,;!)\]]+$/, "");
  if (!/^https:\/\//i.test(url)) url = `https://${url}`;
  url = url.replace(/^https:\/\/([^/]+)/i, (_x, host: string) => `https://${host.toLowerCase()}`);
  return keepQuery ? url : url.replace(/[?#].*$/, "");
}

const URL_HOSTS: Record<string, { hosts: string[]; keepQuery?: boolean }> = {
  razorpayPage: { hosts: ["rzp.io", "pages.razorpay.com", "razorpay.me"] },
  paypal: { hosts: ["www.paypal.me", "paypal.me", "www.paypal.com"] },
  stripe: { hosts: ["buy.stripe.com"] },
  instamojo: { hosts: ["www.instamojo.com", "instamojo.com", "imjo.in"] },
  cashfree: { hosts: ["payments.cashfree.com", "cfre.in"] },
  calendly: { hosts: ["calendly.com"], keepQuery: false },
  calcom: { hosts: ["app.cal.com", "cal.com"], keepQuery: false },
  googleReviews: { hosts: ["g.page", "search.google.com", "www.google.com", "maps.app.goo.gl", "goo.gl", "maps.google.com", "g.co"] },
};

const META_NAMES: Record<string, string> = {
  googleVerify: "google-site-verification",
  bingVerify: "msvalidate\\.01",
  pinterestVerify: "p:domain_verify",
  facebookVerify: "facebook-domain-verification",
};

function rawExtract(id: string, text: string): Record<string, string> {
  const t = text.trim();
  const one = (key: string, ...res: RegExp[]) => {
    const m = firstMatch(t, ...res);
    return m ? { [key]: m[0] } : {};
  };
  if (URL_HOSTS[id]) {
    const { hosts, keepQuery = true } = URL_HOSTS[id];
    const url = findUrl(t, hosts, keepQuery);
    return url ? { url } : {};
  }
  if (META_NAMES[id]) {
    const name = META_NAMES[id];
    return one("token",
      new RegExp(`name\\s*=\\s*["']${name}["'][^>]*content\\s*=\\s*["']([A-Za-z0-9_-]{6,120})["']`, "i"),
      new RegExp(`content\\s*=\\s*["']([A-Za-z0-9_-]{6,120})["'][^>]*name\\s*=\\s*["']${name}["']`, "i"),
      /^([A-Za-z0-9_-]{6,120})$/);
  }
  switch (id) {
    case "tawk": {
      const m = firstMatch(t, /tawk\.to\/(?:chat\/)?([a-f0-9]{24})\/([A-Za-z0-9]{4,32})/i);
      return m ? { propertyId: m[0].toLowerCase(), widgetId: m[1] } : {};
    }
    case "crisp": return one("websiteId", /CRISP_WEBSITE_ID\s*=\s*["']([0-9a-f-]{36})["']/i, /\b([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\b/i);
    case "tidio": return one("publicKey", /code\.tidio\.co\/([A-Za-z0-9]{20,40})\.js/, /^([A-Za-z0-9]{20,40})$/);
    case "ga4": return one("id", /\b(G-[A-Z0-9]{4,15})\b/i);
    case "gtm": return one("id", /\b(GTM-[A-Z0-9]{4,10})\b/i);
    case "googleAds": return one("id", /\b(AW-\d{6,15})\b/i);
    case "metaPixel": return one("id", /fbq\(\s*['"]init['"]\s*,\s*['"](\d{10,20})['"]/, /facebook\.com\/tr\?id=(\d{10,20})/, /^(\d{10,20})$/);
    case "clarity": return one("id", /clarity\.ms\/tag\/([A-Za-z0-9]{6,20})/, /["']script["']\s*,\s*["']([A-Za-z0-9]{6,20})["']/, /^([A-Za-z0-9]{6,20})$/);
    case "hotjar": return one("id", /hjid\s*:\s*(\d{5,10})/, /hotjar-(\d{5,10})\.js/, /^(\d{5,10})$/);
    case "linkedin": return one("id", /_linkedin_partner_id\s*=\s*["']?(\d{4,12})/, /[?&]pid=(\d{4,12})/, /^(\d{4,12})$/);
    case "razorpay": return one("razorpayKeyId", /\b(rzp_(?:live|test)_[A-Za-z0-9]{8,32})\b/);
    case "upi": {
      const pa = t.match(/[?&]pa=([^&\s"']+)/);
      const raw = pa ? decodeURIComponent(pa[1]) : t.replace(/\s+/g, "");
      const m = raw.match(/[A-Za-z0-9._-]{2,256}@[A-Za-z0-9]{2,64}/);
      return m ? { upiId: m[0] } : {};
    }
    case "mailchimp": {
      const m = t.replace(/&amp;/g, "&").match(/https:\/\/[a-z0-9.-]+\.list-manage\.com\/subscribe\/post\?[A-Za-z0-9=&_.-]+/i);
      return m ? { action: m[0] } : {};
    }
  }
  return {};
}

/** Validated values detected in pasted text (only fields that pass their pattern). */
export function smartExtract(id: string, text: string): Record<string, string> {
  const def = INTEGRATION_BY_ID.get(id);
  if (!def || !text || text.length > 20_000) return {};
  const found = rawExtract(id, text);
  const out: Record<string, string> = {};
  for (const f of def.fields) {
    const v = found[f.key];
    if (v && !fieldError(f, v)) out[f.key] = v;
  }
  return out;
}

// ─── Setup guides ────────────────────────────────────────────────────────────
/** Where step ① sends the owner (signup / dashboard page). */
export const PROVIDER_URL: Record<string, string> = {
  razorpay: "https://dashboard.razorpay.com/app/website-app-settings/api-keys",
  razorpayPage: "https://dashboard.razorpay.com/app/paymentpages",
  paypal: "https://www.paypal.com/paypalme/",
  stripe: "https://dashboard.stripe.com/payment-links",
  instamojo: "https://www.instamojo.com/",
  cashfree: "https://merchant.cashfree.com/",
  tawk: "https://dashboard.tawk.to/",
  crisp: "https://app.crisp.chat/",
  tidio: "https://www.tidio.com/panel/",
  ga4: "https://analytics.google.com/",
  gtm: "https://tagmanager.google.com/",
  metaPixel: "https://business.facebook.com/events_manager2",
  clarity: "https://clarity.microsoft.com/",
  hotjar: "https://insights.hotjar.com/",
  linkedin: "https://www.linkedin.com/campaignmanager/",
  googleAds: "https://ads.google.com/",
  calendly: "https://calendly.com/event_types/user/me",
  calcom: "https://app.cal.com/event-types",
  googleReviews: "https://business.google.com/",
  googleVerify: "https://search.google.com/search-console",
  bingVerify: "https://www.bing.com/webmasters",
  pinterestVerify: "https://www.pinterest.com/settings/claim",
  facebookVerify: "https://business.facebook.com/settings/owned-domains",
  mailchimp: "https://admin.mailchimp.com/lists/",
};

/** What to copy in step ②. */
export const COPY_HINT: Record<string, string> = {
  razorpay: "Copy the Key ID (rzp_live_…) and secret from API Keys.",
  upi: "Copy your UPI ID from any UPI app (or scan-to-pay link).",
  razorpayPage: "Copy the public payment page link (rzp.io/…).",
  paypal: "Copy your PayPal.me link.",
  stripe: "Copy the buy.stripe.com link.",
  instamojo: "Copy your payment link.",
  cashfree: "Copy your payment link.",
  tawk: "Copy the widget code (or the Direct Chat Link) — both work.",
  crisp: "Copy the install snippet or the Website ID.",
  tidio: "Copy the install snippet or Public key.",
  ga4: "Copy the Google tag snippet or the G-… ID.",
  gtm: "Copy the container snippet or the GTM-… ID.",
  metaPixel: "Copy the pixel base code or the Pixel ID.",
  clarity: "Copy the tracking code or Project ID.",
  hotjar: "Copy the tracking code or Site ID.",
  linkedin: "Copy the Insight Tag code or partner ID.",
  googleAds: "Copy the Google tag snippet or AW-… ID.",
  calendly: "Copy your event link (any Calendly link).",
  calcom: "Copy your booking link.",
  googleReviews: "Copy the “Ask for reviews” link.",
  googleVerify: "Copy the whole <meta> tag — we take just the code.",
  bingVerify: "Copy the whole <meta> tag — we take just the code.",
  pinterestVerify: "Copy the whole <meta> tag — we take just the code.",
  facebookVerify: "Copy the whole <meta> tag — we take just the code.",
  mailchimp: "Copy the embedded form code — we take just the form URL.",
};

// ─── Sector recommendations (lib/verticals.ts categories) ────────────────────
const RECOMMENDED: Record<string, string[]> = {
  "Community & Non-profit": ["razorpay", "upi", "tawk", "ga4", "mailchimp"],
  "Real Estate & Property": ["calendly", "googleReviews", "tawk", "metaPixel"],
  "Food & Hospitality": ["googleReviews", "metaPixel", "upi", "ga4"],
  "Healthcare": ["calendly", "googleReviews", "ga4", "tawk"],
  "Fitness & Wellness": ["calendly", "googleReviews", "metaPixel", "upi"],
  "Schools & Coaching": ["upi", "razorpay", "tawk", "ga4"],
  "Home & Local Services": ["googleReviews", "tawk", "ga4", "googleAds"],
  "Trade & Manufacturing": ["tawk", "ga4", "linkedin", "googleVerify"],
  "Events & Training": ["calendly", "razorpayPage", "googleReviews", "metaPixel"],
};
export function recommendedFor(category: string): string[] {
  return RECOMMENDED[category] ?? ["ga4", "googleReviews", "tawk", "googleVerify"];
}
