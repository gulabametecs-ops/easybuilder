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
  gaId: string; // Google Analytics 4 measurement id, e.g. G-XXXXXXX
  googleVerification: string; // Search Console verification content value
  indexable: boolean; // site-wide allow search engines (turn off for staging)
  // Local-business structured data (JSON-LD)
  localBusiness: boolean;
  businessType: string; // schema.org type, e.g. LocalBusiness, Restaurant, Dentist
  priceRange: string; // e.g. ₹₹
  geoLat: string;
  geoLng: string;
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
  };
  hero: {
    variant: string; // "classic" | "centered" | "split" | "custom"
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
  customClass?: string; // advanced: target from custom CSS
};

const SPACE_TOP: Record<string, string> = { none: "!pt-0", sm: "pt-6", lg: "pt-24" };
const SPACE_BOTTOM: Record<string, string> = { none: "!pb-0", sm: "pb-6", lg: "pb-24" };
const BG_CLASS = {
  default: "",
  light: "bg-slate-50",
  dark: "bg-slate-900 text-white",
  primary: "text-white [background:var(--color-primary,#65a30d)]",
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
