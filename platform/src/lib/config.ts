// ─────────────────────────────────────────────────────────────────────────────
// Config type system — the shape of every tenant's customizable website.
// SiteConfig columns (theme/header/footer/seo) and Section.content are stored as
// JSON strings in the DB; these types + parse helpers give us type-safety.
// The admin panel edits these objects; the rendering engine reads them.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Theme ───────────────────────────────────────────────────────────────────
export type ThemeConfig = {
  colors: {
    primary: string; // brand green
    primaryDark: string;
    secondary: string; // navy
    accent: string;
    dark: string; // dark section background
    light: string; // light section background
    text: string;
    heading: string;
  };
  font: string; // e.g. "Poppins", "Inter"
  radius: string; // e.g. "0.75rem"
};

// ─── Header ──────────────────────────────────────────────────────────────────
export type NavItem = { label: string; href: string };
export type HeaderConfig = {
  /** Visual layout — same idea as footer.design */
  design?: "classic" | "modern" | "centered" | "minimal" | "bold";
  logoText: string;
  logoImage: string; // URL, optional
  announcement?: { show: boolean; text: string; link: string };
  topbar: {
    show: boolean;
    address: string;
    phones: string[];
    email: string;
    social: { facebook?: string; instagram?: string; whatsapp?: string };
  };
  nav: NavItem[];
  cta: { label: string; href: string };
};

// ─── Footer ──────────────────────────────────────────────────────────────────
export type FooterColumn = { title: string; links: NavItem[] };
export type FooterConfig = {
  design?: "classic" | "modern" | "centered" | "minimal" | "gradient";
  about: string;
  columns: FooterColumn[];
  serviceAreas: string[];
  contact: { phones: string[]; email: string; address: string };
  social: { facebook?: string; instagram?: string; whatsapp?: string; location?: string };
  copyright: string;
};

// ─── SEO ─────────────────────────────────────────────────────────────────────
export type SeoConfig = {
  title: string;
  description: string;
  favicon: string;
  ogImage: string;
  keywords: string; // comma-separated
  twitterHandle: string; // @handle
  ogType: string; // website | business.business | article
  // Analytics & tag managers
  gaId: string; // Google Analytics 4 measurement id, e.g. G-XXXXXXX
  gtmId: string; // Google Tag Manager, e.g. GTM-XXXX
  fbPixelId: string; // Meta / Facebook Pixel id
  clarityId: string; // Microsoft Clarity project id
  // Search-engine verification
  googleVerification: string; // Search Console verification content value
  bingVerification: string; // Bing Webmaster verification
  indexable: boolean; // site-wide allow search engines (turn off for staging)
  robotsFollow: boolean; // allow following links (nofollow site-wide if false)
  // Local-business structured data (JSON-LD)
  localBusiness: boolean;
  businessType: string; // schema.org type, e.g. LocalBusiness, Restaurant, Dentist
  priceRange: string; // e.g. ₹₹
  geoLat: string;
  geoLng: string;
  ratingValue: string; // aggregate rating (e.g. 4.8) for rich results
  ratingCount: string; // number of reviews
  faqSchema: boolean; // auto-generate FAQ structured data from FAQ sections
};

// ─── Section content types (discriminated by Section.type) ───────────────────
export type FeatureItem = { icon: string; title: string; text: string };
export type StatItem = { value: string; label: string; icon: string };
export type StepItem = { title: string; text: string; icon: string };
export type TeamMember = { name: string; role: string; image: string; note: string };
export type PriceItem = { name: string; price: string; note: string };
export type PriceGroup = { category: string; items: PriceItem[] };

export type SectionContentMap = {
  banner: {
    title: string;
    titleHighlight: string;
    subtitle: string;
    /** Background photo (optional). Empty = soft stock image. */
    image: string;
    /** Solid banner / overlay colour (hex). Empty = site dark colour. */
    bgColor: string;
    /** How strong the photo shows (0–100). */
    imageOpacity: number;
    /** How strong the colour overlay is over the photo (0–100). */
    overlayOpacity: number;
  };
  hero: {
    variant: string; // classic | split | centered | marquee | gradient | minimal | slideshow | custom
    customHtml: string; // used when variant = "custom"
    badge: string;
    titleTop: string;
    titleHighlight: string;
    subtitle: string;
    description: string;
    image: string;
    primaryBtn: NavItem;
    secondaryBtn: NavItem;
    features: FeatureItem[];
    // used when variant = "slideshow" — each slide fully editable
    slides?: { titleTop: string; titleHighlight: string; description: string; image: string; primaryBtn: NavItem; secondaryBtn: NavItem }[];
  };
  features: { items: FeatureItem[] };
  about: {
    eyebrow: string;
    title: string;
    titleHighlight: string;
    body: string[];
    image: string;
    points: string[];
    buttonLabel: string;
    buttonHref: string;
  };
  serviceCategories: {
    eyebrow: string;
    title: string;
    titleHighlight: string;
    // categories reference Service rows by their `category` field
    categories: string[];
  };
  stats: { items: StatItem[] };
  gallery: { eyebrow: string; title: string; titleHighlight: string };
  steps: { eyebrow: string; title: string; titleHighlight: string; items: StepItem[] };
  cta: { title: string; highlight: string; phones: string[]; buttonLabel: string; buttonHref: string };
  quoteForm: { title: string; subtitle: string; showSidebar: boolean };
  appointmentForm: { title: string; subtitle: string };
  contactForm: { title: string; subtitle: string };
  faq: { eyebrow: string; title: string; titleHighlight: string; items: { q: string; a: string }[] };
  video: { eyebrow: string; title: string; titleHighlight: string; url: string; caption: string };
  imageBanner: { title: string; subtitle: string; buttonLabel: string; buttonHref: string; image: string };
  contactInfo: { eyebrow: string; title: string; titleHighlight: string; address: string; phone: string; email: string; hours: string; mapEmbed: string };
  testimonials: { eyebrow: string; title: string; titleHighlight: string; items: { name: string; role: string; text: string; rating: number }[] };
  logos: { title: string; items: string[] };
  team: { eyebrow: string; title: string; titleHighlight: string; members: TeamMember[] };
  priceList: { eyebrow: string; title: string; titleHighlight: string; note: string; groups: PriceGroup[] };
  richText: { html: string };
  html: { code: string };
  pricingPlans: {
    eyebrow: string; title: string; titleHighlight: string;
    plans: { name: string; price: string; period: string; features: string[]; featured: boolean; buttonLabel: string; buttonHref: string }[];
  };
  openingHours: {
    eyebrow: string; title: string; titleHighlight: string; note: string;
    days: { day: string; hours: string }[];
  };
  countdown: {
    eyebrow: string; title: string; titleHighlight: string; subtitle: string;
    targetDate: string; buttonLabel: string; buttonHref: string;
  };
  map: { eyebrow: string; title: string; titleHighlight: string; address: string; mapEmbed: string };
  noticeBoard: {
    eyebrow: string; title: string; titleHighlight: string;
    limit?: number; // max notices to show (0/undefined = all)
    notices: { date: string; title: string; category: string; link: string; isNew: boolean }[];
  };
  toppers: {
    eyebrow: string; title: string; titleHighlight: string;
    items: { name: string; exam: string; score: string; rank: string; image: string }[];
  };
  downloads: {
    eyebrow: string; title: string; titleHighlight: string;
    items: { title: string; description: string; link: string; icon: string }[];
  };
};

export type SectionType = keyof SectionContentMap;

// ─── Per-section design/style (stored in Section.style JSON) ──────────────────
export type Spacing = "default" | "none" | "sm" | "lg";
export type SectionStyle = {
  anchorId?: string; // for menu jump-links (#id)
  spacingTop?: Spacing;
  spacingBottom?: Spacing;
  hideOnMobile?: boolean;
  background?: "default" | "light" | "dark" | "primary";
  align?: "left" | "center" | "right"; // text + card-grid alignment
  accentColor?: string; // overrides the brand/primary colour for this section
  textColor?: string; // overrides body text colour for this section
  customClass?: string; // advanced: target from custom CSS
  // Cards (team, features, services, testimonials, …)
  cardBg?: string;
  cardText?: string;
  cardBorderColor?: string;
  cardBorderWidth?: number; // px 0–8
  cardRadius?: "none" | "sm" | "md" | "lg" | "full";
  cardShadow?: "none" | "sm" | "md" | "lg";
  cardSize?: "sm" | "md" | "lg";
};

const CARD_RADIUS: Record<NonNullable<SectionStyle["cardRadius"]>, string> = {
  none: "0px",
  sm: "0.5rem",
  md: "0.75rem",
  lg: "1.25rem",
  full: "9999px",
};
const CARD_SHADOW: Record<NonNullable<SectionStyle["cardShadow"]>, string> = {
  none: "none",
  sm: "0 1px 2px rgb(0 0 0 / 0.06)",
  md: "0 4px 14px rgb(0 0 0 / 0.08)",
  lg: "0 12px 28px rgb(0 0 0 / 0.12)",
};
const CARD_SIZE: Record<NonNullable<SectionStyle["cardSize"]>, string> = {
  sm: "12rem",
  md: "16rem",
  lg: "20rem",
};

// Inline CSS custom-property overrides for a section (colours + alignment + cards).
export function sectionFrameStyle(style: SectionStyle): import("react").CSSProperties {
  const s: import("react").CSSProperties & Record<`--${string}`, string> = {};
  if (style.accentColor) { s["--c-primary"] = style.accentColor; s["--c-primary-dark"] = style.accentColor; }
  if (style.textColor) { s["--c-text"] = style.textColor; s.color = style.textColor; }
  if (style.align) s.textAlign = style.align;

  if (style.cardBg) s["--card-bg"] = style.cardBg;
  if (style.cardText) s["--card-text"] = style.cardText;
  if (style.cardBorderColor) s["--card-border"] = style.cardBorderColor;
  if (style.cardBorderWidth != null) s["--card-bw"] = `${Math.min(8, Math.max(0, style.cardBorderWidth))}px`;
  if (style.cardRadius) s["--card-radius"] = CARD_RADIUS[style.cardRadius];
  if (style.cardShadow) s["--card-shadow"] = CARD_SHADOW[style.cardShadow];
  if (style.cardSize) s["--card-w"] = CARD_SIZE[style.cardSize];
  return s;
}

const SPACE_TOP: Record<string, string> = { none: "!pt-0", sm: "pt-6", lg: "pt-24" };
const SPACE_BOTTOM: Record<string, string> = { none: "!pb-0", sm: "pb-6", lg: "pb-24" };
const BG_CLASS = {
  default: "",
  // Theme-aware (tenant palette); content blocks go transparent inside via [data-bg] in globals.css.
  light: "bg-light",
  dark: "bg-dark text-white",
  primary: "bg-primary text-white",
} as const;

// Build the wrapper class list for a section from its style config.
export function sectionFrameClasses(style: SectionStyle): string {
  const parts: string[] = [];
  if (style.spacingTop && style.spacingTop !== "default" && SPACE_TOP[style.spacingTop]) parts.push(SPACE_TOP[style.spacingTop]);
  if (style.spacingBottom && SPACE_BOTTOM[style.spacingBottom]) parts.push(SPACE_BOTTOM[style.spacingBottom]);
  if (style.hideOnMobile) parts.push("hidden md:block");
  if (style.background && style.background !== "default" && BG_CLASS[style.background]) parts.push(BG_CLASS[style.background]);
  if (style.customClass) parts.push(style.customClass);
  return parts.join(" ");
}

// ─── Safe parse helpers ──────────────────────────────────────────────────────
export function parseJson<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return { ...fallback, ...(JSON.parse(raw) as object) } as T;
  } catch {
    return fallback;
  }
}

export function parseSectionContent<T extends SectionType>(
  type: T,
  raw: string,
): SectionContentMap[T] {
  try {
    return JSON.parse(raw) as SectionContentMap[T];
  } catch {
    return {} as SectionContentMap[T];
  }
}
