import type { TemplateDef, SectionSeed } from "./types";
import type { SectionContentMap } from "../config";

// Digital marketing agency: loud violet + highlighter yellow on near-black, Instrument Sans,
// bold header, marquee hero, monthly retainers, results-first case studies.
const PHONE = "98330 72614";

const cta: SectionSeed<"cta"> = {
  type: "cta",
  content: { title: "Spending on ads but not seeing leads?", highlight: "Get a Free Marketing Audit in 48 Hours", phones: [PHONE], buttonLabel: "Get My Free Audit", buttonHref: "/free-audit" },
  style: { background: "primary" },
};

const retainers: SectionSeed<"pricingPlans"> = {
  type: "pricingPlans",
  content: {
    eyebrow: "MONTHLY RETAINERS", title: "Growth Plans,", titleHighlight: "No Lock-ins",
    plans: [
      { name: "Starter", price: "₹24,999", period: "/month", features: ["Instagram + Facebook management", "12 posts & 4 reels a month", "Google Business Profile", "Monthly report"], featured: false, buttonLabel: "Choose Starter", buttonHref: "/free-audit" },
      { name: "Growth", price: "₹54,999", period: "/month", features: ["Everything in Starter", "Meta & Google Ads management", "Landing page + tracking setup", "Local SEO (10 keywords)", "Fortnightly review call"], featured: true, buttonLabel: "Choose Growth", buttonHref: "/free-audit" },
      { name: "Performance", price: "₹1.1 L", period: "/month", features: ["Full-funnel ads (Meta, Google, YouTube)", "SEO for 30 keywords + content", "CRO & A/B testing", "Dedicated growth manager"], featured: false, buttonLabel: "Choose Performance", buttonHref: "/free-audit" },
    ],
  },
  style: { background: "dark", cardRadius: "lg", cardShadow: "lg" },
};

export const digitalMarketing: TemplateDef = {
  theme: {
    colors: { primary: "#7c3aed", primaryDark: "#6d28d9", secondary: "#13072e", accent: "#facc15", dark: "#13072e", light: "#faf5ff", text: "#3f3f46", heading: "#13072e" },
    font: "Instrument Sans", radius: "1rem",
  },
  header: (biz) => ({
    design: "bold",
    logoText: biz, logoImage: "",
    announcement: { show: true, text: "Diwali sale season: book your ad campaigns now — limited slots", link: "/free-audit" },
    topbar: { show: false, address: "Lower Parel, Mumbai", phones: [PHONE], email: "grow@example.com", social: { facebook: "#", instagram: "#", whatsapp: "#" } },
    nav: [
      { label: "Home", href: "/" }, { label: "Services", href: "/services" }, { label: "Results", href: "/results" },
      { label: "Pricing", href: "/pricing" }, { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Free Audit", href: "/free-audit" },
  }),
  footer: (biz) => ({
    design: "modern",
    about: `${biz} is a performance-first digital marketing agency — SEO, social media, Meta and Google Ads, content and websites for D2C brands, clinics, real estate and local businesses.`,
    columns: [
      { title: "Services", links: [ { label: "SEO", href: "/services" }, { label: "Social Media", href: "/services" }, { label: "Paid Ads", href: "/services" }, { label: "Websites", href: "/services" } ] },
      { title: "Agency", links: [ { label: "Results", href: "/results" }, { label: "Pricing", href: "/pricing" }, { label: "Free Audit", href: "/free-audit" }, { label: "Contact", href: "/contact" } ] },
    ],
    serviceAreas: ["SEO", "Social Media", "Meta Ads", "Google Ads", "Content & Reels", "Web Design"],
    contact: { phones: [PHONE], email: "grow@example.com", address: "Lower Parel, Mumbai" },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. Meta Business Partner · Google Partner.`,
  }),
  seo: (biz) => ({
    title: `${biz} — Digital Marketing Agency for SEO, Social Media & Performance Ads`,
    description: "Results-driven digital marketing: SEO, Instagram and Facebook management, Meta and Google Ads, reels and landing pages. Plans from ₹24,999/month. Free audit.",
    favicon: "", ogImage: "",
    keywords: "digital marketing agency, seo company, social media marketing, facebook ads agency, google ads agency, performance marketing, instagram marketing mumbai",
    businessType: "ProfessionalService", priceRange: "₹₹",
  }),
  services: [
    { category: "Get Found", title: "Search Engine Optimisation", description: "Technical SEO, content and links that grow organic traffic month on month." },
    { category: "Get Found", title: "Local SEO & Google Business", description: "Rank in the map pack and turn searches into calls and visits." },
    { category: "Get Leads", title: "Meta Ads (Facebook & Instagram)", description: "Lead-gen and sales campaigns with creative testing every week." },
    { category: "Get Leads", title: "Google Search & YouTube Ads", description: "High-intent search campaigns and video ads tracked to revenue." },
    { category: "Get Leads", title: "Landing Pages & CRO", description: "Fast landing pages and A/B tests that lift conversion rates." },
    { category: "Get Loved", title: "Social Media Management", description: "Content calendars, posts, reels and community management." },
    { category: "Get Loved", title: "Content & Reels Production", description: "Scripts, shoots and edits for reels, shorts and brand films." },
    { category: "Get Loved", title: "Influencer Marketing", description: "Micro-influencer campaigns with tracked links and codes." },
  ],
  gallery: [
    "Campaign planning wall", "Reel shoot day", "Content calendar session", "Ads dashboard review",
    "Brand strategy workshop", "Client results call", "Social media desk", "Team brainstorm",
  ].map((caption) => ({ category: "Inside the Agency", caption })),
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "marquee", customHtml: "",
          badge: "SEO · SOCIAL · PERFORMANCE ADS", titleTop: "More Leads. Lower Cost.", titleHighlight: "Marketing That Pays Back.",
          subtitle: "", description: `${biz} has managed ₹38 crore in ad spend for 210+ brands. We plan, create and optimise every week — and report in rupees, not just reach.`, image: "",
          primaryBtn: { label: "Get a Free Audit", href: "/free-audit" }, secondaryBtn: { label: "See Results", href: "/results" },
          features: [
            { icon: "trending", title: "Meta Business Partner", text: "" }, { icon: "star", title: "Google Partner", text: "" },
            { icon: "zap", title: "Weekly Optimisation", text: "" }, { icon: "users", title: "210+ Brands", text: "" },
          ],
        } },
        { type: "stats", content: { items: [
          { value: "₹38 Cr", label: "Ad Spend Managed", icon: "trending" }, { value: "4.6×", label: "Average ROAS", icon: "zap" },
          { value: "210+", label: "Brands Grown", icon: "star" }, { value: "-41%", label: "Avg. Cost per Lead Drop", icon: "tag" },
        ] }, style: { layout: "band", background: "dark" } },
        { type: "serviceCategories", content: { eyebrow: "SERVICES", title: "Get Found. Get Leads.", titleHighlight: "Get Loved.", categories: ["Get Found", "Get Leads", "Get Loved"] }, style: { layout: "tiles", cardRadius: "lg" } },
        { type: "imageBanner", content: { title: "Creative is the new targeting", subtitle: "We shoot and test 20+ ad creatives a month for every growth client — the winners get the budget.", buttonLabel: "See Our Work", buttonHref: "/results", image: "" } },
        { type: "features", content: { items: [
          { icon: "trending", title: "D2C Skincare · Meta Ads", text: "ROAS from 1.8× to 5.2× in 90 days with UGC creatives and a new landing page." },
          { icon: "heart-pulse", title: "Dental Chain · Google + Local SEO", text: "312 appointment leads a month across 6 clinics at ₹186 per lead." },
          { icon: "home", title: "Real Estate · Lead Gen", text: "2,400 site-visit leads for a Thane project; cost per lead down 47%." },
        ] }, style: { layout: "numbered" } },
        retainers,
        { type: "steps", content: { eyebrow: "HOW WE WORK", title: "Our Growth", titleHighlight: "Loop", items: [
          { title: "Audit", text: "Ads, site, tracking and competitors", icon: "clipboard" },
          { title: "Plan", text: "90-day roadmap with targets", icon: "edit" },
          { title: "Launch", text: "Creatives, campaigns and pages", icon: "zap" },
          { title: "Optimise", text: "Weekly tests, monthly reports", icon: "trending" },
        ] }, style: { layout: "timeline", background: "light" } },
        { type: "testimonials", content: { eyebrow: "CLIENT LOVE", title: "Brands That", titleHighlight: "Grew With Us", items: [
          { name: "Riya Malhotra", role: "Founder, D2C skincare brand", text: "They tripled our ROAS and our reels finally feel like us. Weekly calls keep everyone honest about numbers.", rating: 5 },
          { name: "Dr. Harsh Vora", role: "Dental clinic chain", text: "Our phones ring every day from Google now. Clear monthly reports — leads, cost per lead and bookings.", rating: 5 },
          { name: "Ajay Nair", role: "Marketing head, real estate developer", text: "Best site-visit lead quality we've had from any agency. They fixed our CRM tracking in week one.", rating: 5 },
        ] }, style: { layout: "minimal" } },
        { type: "faq", content: { eyebrow: "FAQ", title: "Agency", titleHighlight: "Questions", intro: "Straight answers, no jargon.", items: [
          { q: "Is ad spend included in the retainer?", a: "No. Ad budget is paid directly to Meta or Google from your account; our fee covers strategy, creatives and management." },
          { q: "How soon will I see results?", a: "Paid ads usually show results in 2–4 weeks. SEO typically takes 3–6 months to build steady traffic." },
          { q: "Is there a minimum contract?", a: "No lock-in. We ask for a 3-month commitment for SEO since it compounds over time." },
          { q: "Who owns the ad accounts?", a: "You do. We work inside your Business Manager and Google Ads account with partner access." },
        ] } as SectionContentMap["faq"], style: { layout: "split" } },
        cta,
      ],
    },
    { slug: "services", title: "Services", isSystem: true, order: 1, sections: [
      { type: "banner", content: { title: "Our", titleHighlight: "Services", subtitle: "SEO, social, paid ads and content — under one roof.", image: "", bgColor: "", imageOpacity: 35, overlayOpacity: 70 } },
      { type: "serviceCategories", content: { eyebrow: "SERVICES", title: "Full-Funnel", titleHighlight: "Marketing", categories: ["Get Found", "Get Leads", "Get Loved"] }, style: { cardRadius: "lg" } },
      { type: "priceList", content: { eyebrow: "ONE-TIME PROJECTS", title: "Project", titleHighlight: "Pricing", note: "One-time projects, GST extra.", groups: [
        { category: "Setup", items: [ { name: "SEO audit & roadmap", price: "₹14,999", note: "" }, { name: "Meta pixel, GA4 & conversion tracking", price: "₹9,999", note: "" }, { name: "Google Business Profile optimisation", price: "₹6,999", note: "" } ] },
        { category: "Creative", items: [ { name: "Landing page (design + build)", price: "₹29,999", note: "" }, { name: "Reels pack (8 edited reels)", price: "₹24,000", note: "" }, { name: "Brand film (60–90 sec)", price: "From ₹85,000", note: "" } ] },
      ] }, style: { background: "light", cardRadius: "lg" } },
      cta,
    ] },
    { slug: "results", title: "Results", isSystem: true, order: 2, sections: [
      { type: "stats", content: { items: [
        { value: "5.2×", label: "Best ROAS This Year", icon: "trending" }, { value: "1.2 L", label: "Leads Generated in 2025", icon: "users" },
        { value: "180+", label: "Page-1 Keywords", icon: "star" }, { value: "92%", label: "Clients Renew", icon: "handshake" },
      ] }, style: { layout: "cards", background: "light" } },
      { type: "gallery", content: { eyebrow: "BEHIND THE RESULTS", title: "Campaigns &", titleHighlight: "Creatives" }, style: { layout: "masonry" } },
      { type: "logos", content: { title: "Brands we've grown", items: ["GlowRoots", "SmileCare Dental", "Skyline Homes", "FitBowl", "UrbanThreads", "LearnLeap"] } },
      cta,
    ] },
    { slug: "pricing", title: "Pricing", isSystem: true, order: 3, sections: [
      retainers,
      { type: "faq", content: { eyebrow: "PRICING FAQ", title: "Pricing", titleHighlight: "Questions", items: [
        { q: "Are prices inclusive of GST?", a: "No, 18% GST is extra. Ad spend is billed separately by the platforms." },
        { q: "Can I switch plans?", a: "Yes, upgrade or downgrade from the next billing month." },
      ] } },
      cta,
    ] },
    { slug: "free-audit", title: "Free Audit", isSystem: true, order: 4, sections: [
      { type: "quoteForm", content: { title: "Get Your Free Marketing Audit", subtitle: "Share your website, Instagram handle and monthly ad budget. Within 48 hours we'll send a video audit with 5 quick wins.", showSidebar: true } },
    ] },
    { slug: "contact", title: "Contact Us", isSystem: true, order: 5, sections: [
      { type: "contactInfo", content: { eyebrow: "CONTACT", title: "Let's", titleHighlight: "Talk Growth", address: "Lower Parel, Mumbai", phone: PHONE, email: "grow@example.com", hours: "Mon – Sat, 10 AM – 7 PM", mapEmbed: "" } },
      { type: "contactForm", content: { title: "Send a Message", subtitle: "Projects, partnerships or careers — we reply within a day." } },
    ] },
  ],
};
