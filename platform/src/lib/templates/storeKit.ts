import type { TemplateDef, ProductSeed, PageSeed, SectionSeed } from "./types";
import type { FeatureItem, HeaderConfig, ThemeConfig, SectionContentMap, SectionStyle } from "../config";

// Shared page structure for the online-store sectors. Each sector file supplies its own look
// (theme, header/hero layout, section styles) + copy + catalogue; the storefront shape
// (home → shop → product → cart) stays identical so the store admin works the same everywhere.

export type StoreSpec = {
  theme: ThemeConfig;
  headerDesign: NonNullable<HeaderConfig["design"]>;
  footerDesign?: "classic" | "modern" | "centered" | "minimal" | "gradient";
  heroVariant: "classic" | "split" | "centered" | "gradient" | "minimal";
  phone: string;
  email: string;
  address: string;
  announcement: string;
  hero: { badge: string; titleTop: string; titleHighlight: string; description: string };
  heroFeatures: FeatureItem[];
  categories: string[];
  trust: FeatureItem[];
  bestsellers: { eyebrow: string; title: string; titleHighlight: string; subtitle: string };
  spotlight: { category: string; eyebrow: string; title: string; titleHighlight: string };
  offer: { title: string; subtitle: string; buttonLabel: string };
  about: { title: string; titleHighlight: string; body: (biz: string) => string[]; points: string[] };
  stats: { value: string; label: string; icon: string }[];
  testimonials: { name: string; role: string; text: string; rating: number }[];
  faq: { q: string; a: string }[];
  seo: { title: string; description: string; keywords: string; businessType?: string };
  footerAbout: (biz: string) => string;
  serviceAreas: string[];
  products: ProductSeed[];
  /** Per-section looks so the sectors don't feel like one template recoloured. */
  look?: { testimonials?: string; trust?: string; card?: SectionStyle; stats?: string };
};

const shopHref = (c: string) => `/shop?c=${encodeURIComponent(c)}`;

export function storeTemplate(s: StoreSpec): TemplateDef {
  const card = s.look?.card ?? { cardRadius: "lg", cardShadow: "md" };
  const grid = (c: Partial<SectionContentMap["productGrid"]>, style: SectionStyle = {}): SectionSeed<"productGrid"> => ({
    type: "productGrid",
    content: {
      eyebrow: "", title: "", titleHighlight: "", subtitle: "", category: "all", collection: "", featuredOnly: false, showFilters: false,
      limit: 8, buttonLabel: "View all products", buttonHref: "/shop", emptyText: "New products are on the way — check back soon.", ...c,
    },
    style: { ...card, ...style },
  });
  const faq: SectionSeed<"faq"> = {
    type: "faq",
    content: { eyebrow: "HELP", title: "Shopping", titleHighlight: "Questions", items: s.faq } as SectionContentMap["faq"],
    style: { layout: "split", background: "light" },
  };
  const trust: SectionSeed<"features"> = { type: "features", content: { items: s.trust }, style: { layout: s.look?.trust ?? "cards", ...card } };

  const pages = (biz: string): PageSeed[] => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: s.heroVariant, customHtml: "", badge: s.hero.badge, titleTop: s.hero.titleTop, titleHighlight: s.hero.titleHighlight,
          subtitle: "", description: s.hero.description, image: "",
          primaryBtn: { label: "Shop Now", href: "/shop" }, secondaryBtn: { label: "Bestsellers", href: "/shop" },
          features: s.heroFeatures,
        } },
        { type: "productCategories", content: { eyebrow: "BROWSE", title: "Shop by", titleHighlight: "Category" }, style: card },
        grid({ ...s.bestsellers, featuredOnly: true, limit: 8 }),
        trust,
        { type: "imageBanner", content: { title: s.offer.title, subtitle: s.offer.subtitle, buttonLabel: s.offer.buttonLabel, buttonHref: "/shop", image: "" } },
        grid({ ...s.spotlight, limit: 4, buttonLabel: `More in ${s.spotlight.category}`, buttonHref: shopHref(s.spotlight.category) }, { background: "light" }),
        { type: "stats", content: { items: s.stats }, style: { layout: s.look?.stats ?? "band" } },
        { type: "testimonials", content: { eyebrow: "REVIEWS", title: "Loved by", titleHighlight: "Our Customers", items: s.testimonials }, style: { layout: s.look?.testimonials ?? "featured" } },
        faq,
      ],
    },
    {
      slug: "shop", title: "Shop", isSystem: true, order: 1,
      sections: [
        { type: "banner", content: { title: "Shop", titleHighlight: "All Products", subtitle: "Prices include GST. Cash on delivery available.", image: "", bgColor: "", imageOpacity: 40, overlayOpacity: 60 } },
        grid({ eyebrow: "", title: "", titleHighlight: "", subtitle: "", showFilters: true, limit: 0, buttonLabel: "", buttonHref: "" }),
        trust,
      ],
    },
    {
      slug: "about", title: "About Us", isSystem: true, order: 2,
      sections: [
        { type: "about", content: {
          eyebrow: "OUR STORY", title: s.about.title, titleHighlight: s.about.titleHighlight, body: s.about.body(biz), image: "",
          points: s.about.points, buttonLabel: "Start Shopping", buttonHref: "/shop",
        } },
        { type: "stats", content: { items: s.stats }, style: { layout: "cards", background: "light" } },
        { type: "testimonials", content: { eyebrow: "REVIEWS", title: "What Shoppers", titleHighlight: "Say", items: s.testimonials }, style: { layout: "minimal" } },
      ],
    },
    {
      slug: "shipping-returns", title: "Shipping & Returns", isSystem: true, order: 3, showInNav: false,
      sections: [
        { type: "steps", content: { eyebrow: "HOW IT WORKS", title: "From Cart to", titleHighlight: "Your Door", items: [
          { title: "Place your order", text: "Pay by UPI, cash on delivery or order on WhatsApp", icon: "check" },
          { title: "We confirm & pack", text: "You get a WhatsApp confirmation the same day", icon: "package" },
          { title: "Shipped", text: "Tracked delivery across India", icon: "truck" },
          { title: "Easy returns", text: "Not right? Request a return within 7 days", icon: "thumbs-up" },
        ] }, style: { layout: "timeline" } },
        faq,
      ],
    },
    {
      slug: "contact", title: "Contact Us", isSystem: true, order: 4,
      sections: [
        { type: "contactInfo", content: { eyebrow: "CONTACT", title: "We're Here to", titleHighlight: "Help", address: s.address, phone: s.phone, email: s.email, hours: "Mon – Sat, 10 AM – 7 PM · WhatsApp replies within the hour", mapEmbed: "" } },
        { type: "contactForm", content: { title: "Send Us a Message", subtitle: "Questions about an order, sizes or bulk purchases? We usually reply within a few hours." } },
      ],
    },
  ];

  return {
    theme: s.theme,
    header: (biz) => ({
      design: s.headerDesign,
      logoText: biz, logoImage: "",
      announcement: { show: true, text: s.announcement, link: "/shop" },
      topbar: { show: false, address: s.address, phones: [s.phone], email: s.email, social: { facebook: "#", instagram: "#", whatsapp: "#" } },
      nav: [
        { label: "Home", href: "/" }, { label: "Shop", href: "/shop" },
        ...s.categories.slice(0, 2).map((c) => ({ label: c, href: shopHref(c) })),
        { label: "About", href: "/about" }, { label: "Contact", href: "/contact" },
      ],
      cta: { label: "Shop Now", href: "/shop" },
    }),
    footer: (biz) => ({
      design: s.footerDesign ?? "modern",
      about: s.footerAbout(biz),
      columns: [
        { title: "Shop", links: [{ label: "All Products", href: "/shop" }, ...s.categories.map((c) => ({ label: c, href: shopHref(c) }))] },
        { title: "Help", links: [
          { label: "My Cart", href: "/cart" }, { label: "My Account", href: "/account" }, { label: "Shipping & Returns", href: "/shipping-returns" },
          { label: "About Us", href: "/about" }, { label: "Contact Us", href: "/contact" },
        ] },
      ],
      serviceAreas: s.serviceAreas,
      contact: { phones: [s.phone], email: s.email, address: s.address },
      social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
      copyright: `© {year} ${biz}. Secure checkout · COD available.`,
    }),
    seo: (biz) => ({
      title: `${biz} — ${s.seo.title}`,
      description: s.seo.description,
      favicon: "", ogImage: "",
      keywords: s.seo.keywords,
      businessType: s.seo.businessType ?? "Store", priceRange: "₹₹",
    }),
    services: [],
    gallery: [],
    products: () => s.products,
    pages,
  };
}
