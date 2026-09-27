import type { TemplateDef, SectionSeed } from "./types";

const PHONE = "9000000000";
const CATEGORIES = ["Our Products", "Custom Manufacturing", "Services"];

const process: SectionSeed<"steps"> = {
  type: "steps",
  content: {
    eyebrow: "OUR PROCESS", title: "From Drawing to", titleHighlight: "Dispatch",
    items: [
      { title: "Requirement & Drawing", text: "Share your drawing, sample or spec — we review feasibility within 48 hours.", icon: "clipboard" },
      { title: "Quote & Sample", text: "Competitive quote plus a first-article sample for your approval.", icon: "edit" },
      { title: "Production", text: "Scheduled on dedicated lines with in-process inspection at every stage.", icon: "factory" },
      { title: "Quality Check", text: "Final inspection with dimensional reports and material certificates.", icon: "badge-check" },
      { title: "Pack & Deliver", text: "Export-grade packing and on-time dispatch, domestic or overseas.", icon: "truck" },
    ],
  },
};

const clients: SectionSeed<"logos"> = {
  type: "logos",
  content: { title: "Supplying manufacturers across 12+ industries", items: ["Automotive", "Electrical & Switchgear", "Pharma Equipment", "Agri Machinery", "Railways", "Solar & Energy", "Construction", "Consumer Appliances"] },
};

const capacity: SectionSeed<"stats"> = {
  type: "stats",
  content: { items: [ { value: "1.2M+", label: "Units Produced / Year", icon: "factory" }, { value: "40,000 sq ft", label: "Manufacturing Facility", icon: "home" }, { value: "98.7%", label: "On-Time Delivery", icon: "clock" }, { value: "250+", label: "B2B Clients", icon: "handshake" } ] },
};

const cta: SectionSeed<"cta"> = {
  type: "cta",
  content: { title: "Have a drawing or sample?", highlight: "Get a Quote Within 48 Hours", phones: [PHONE], buttonLabel: "Request a Quote", buttonHref: "/quote" },
};

export const manufacturing: TemplateDef = {
  theme: {
    colors: { primary: "#0284c7", primaryDark: "#0369a1", secondary: "#0f172a", accent: "#f97316", dark: "#0a1120", light: "#f1f6fb", text: "#334155", heading: "#0f172a" },
    font: "Inter", radius: "0.6rem",
  },
  header: (biz) => ({
    logoText: biz, logoImage: "",
    announcement: { show: false, text: "🏭 Capacity available for new OEM & bulk orders this quarter — request a quote.", link: "/quote" },
    topbar: { show: true, address: "ISO 9001:2015 Certified · OEM & Bulk Manufacturing", phones: [PHONE], email: "sales@example.com", social: { facebook: "#", instagram: "#", whatsapp: "#" } },
    nav: [
      { label: "Home", href: "/" }, { label: "Products", href: "/products" }, { label: "Capabilities", href: "/capabilities" }, { label: "About", href: "/about" }, { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Request a Quote", href: "/quote" },
  }),
  footer: (biz) => ({
    about: "Precision components, OEM manufacturing and dependable bulk supply for B2B clients in India and overseas — built to spec, delivered on schedule.",
    columns: [
      { title: "Quick Links", links: [ { label: "Home", href: "/" }, { label: "Products", href: "/products" }, { label: "Capabilities", href: "/capabilities" }, { label: "Request Quote", href: "/quote" }, { label: "Contact", href: "/contact" } ] },
      { title: "Capabilities", links: [ { label: "CNC Machining", href: "/capabilities" }, { label: "Sheet Metal Fabrication", href: "/capabilities" }, { label: "OEM & White Label", href: "/capabilities" }, { label: "Quality Control", href: "/capabilities" }, { label: "Export Packing", href: "/capabilities" } ] },
    ],
    serviceAreas: ["OEM Supply", "Bulk Orders", "Custom Parts", "Export", "B2B Contracts"],
    contact: { phones: [PHONE], email: "sales@example.com", address: "Your City" },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. All Rights Reserved.`,
  }),
  seo: (biz) => ({
    title: `${biz} — Precision Manufacturing & OEM Supplier`,
    description: "ISO-certified manufacturer of precision machined, fabricated and moulded components. OEM, custom and bulk production with on-time delivery across India and export.",
    favicon: "", ogImage: "",
    keywords: "manufacturer, OEM supplier, CNC machining, sheet metal fabrication, bulk manufacturing, industrial components, India",
    businessType: "Organization",
  }),
  services: [
    { category: "Our Products", title: "Precision Machined Components", description: "CNC-turned and milled parts held to ±0.01 mm tolerances." },
    { category: "Our Products", title: "Sheet Metal Fabrication", description: "Laser cutting, bending and welding for enclosures and brackets." },
    { category: "Our Products", title: "Injection Moulded Parts", description: "Engineering plastic parts in high volumes with consistent finish." },
    { category: "Our Products", title: "Industrial Assemblies", description: "Sub-assemblies tested and shipped ready to install." },
    { category: "Custom Manufacturing", title: "OEM Manufacturing", description: "Built exactly to your drawings, materials and standards." },
    { category: "Custom Manufacturing", title: "White Labelling", description: "Your brand, our production — packed and labelled to your spec." },
    { category: "Custom Manufacturing", title: "Prototyping & Sampling", description: "Quick-turn samples to validate designs before scale-up." },
    { category: "Services", title: "Bulk Production", description: "Dedicated lines for high-volume, repeat schedules." },
    { category: "Services", title: "Quality Testing & Certification", description: "CMM inspection, material certificates and PPAP documentation." },
    { category: "Services", title: "Packaging & Logistics", description: "Export-grade packing and dispatch to your door or port." },
  ],
  gallery: [
    ...["CNC machining centre", "Sheet metal line", "Injection moulding", "Assembly bay"].map((c) => ({ category: "Production", caption: c })),
    ...["Quality lab (CMM)", "Finished goods store", "Export packing", "Dispatch bay"].map((c) => ({ category: "Quality & Logistics", caption: c })),
  ],
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "gradient", customHtml: "",
          badge: "ISO 9001:2015 · OEM · BULK · EXPORT", titleTop: "Precision Manufacturing,", titleHighlight: "Delivered at Scale",
          subtitle: "", description: `${biz} turns your drawings into dependable, high-volume production — with modern machinery, in-house quality control and a 98.7% on-time delivery record.`, image: "",
          primaryBtn: { label: "Request a Quote", href: "/quote" }, secondaryBtn: { label: "Our Capabilities", href: "/capabilities" },
          features: [ { icon: "badge-check", title: "ISO Certified", text: "" }, { icon: "factory", title: "1.2M+ Units / Year", text: "" }, { icon: "clock", title: "98.7% On-Time", text: "" }, { icon: "plane", title: "Export Ready", text: "" } ],
        } },
        { type: "features", content: { items: [
          { icon: "badge-check", title: "Quality You Can Audit", text: "ISO 9001 systems, CMM inspection and full traceability on every batch." },
          { icon: "trending", title: "Capacity to Scale", text: "From 500-piece pilots to lakhs of units a month on dedicated lines." },
          { icon: "tag", title: "Competitive Costing", text: "Lean processes and in-house tooling keep your per-unit cost low." },
          { icon: "clock", title: "Deadlines Kept", text: "Firm production schedules with weekly status updates to your team." },
        ] }, style: { cardShadow: "md" } },
        { type: "about", content: {
          eyebrow: "ABOUT US", title: "Your Long-Term", titleHighlight: "Manufacturing Partner",
          body: [
            `For over 25 years, ${biz} has supplied precision components and assemblies to OEMs across India and abroad.`,
            "Our engineers work with your team from drawing review to final dispatch — improving manufacturability, reducing cost and keeping quality consistent from the first batch to the thousandth.",
          ],
          image: "", points: ["CNC, fabrication & moulding under one roof", "In-house tool room & quality lab", "PPAP & first-article inspection reports", "Domestic and export logistics"],
          buttonLabel: "About Us", buttonHref: "/about",
        } },
        { type: "serviceCategories", content: { eyebrow: "WHAT WE MAKE", title: "Products &", titleHighlight: "Capabilities", categories: CATEGORIES } },
        capacity,
        process,
        clients,
        { type: "testimonials", content: { eyebrow: "CLIENT FEEDBACK", title: "Trusted by", titleHighlight: "Procurement Teams", items: [
          { name: "Sanjay Kulkarni", role: "Purchase Head, Auto Components OEM", text: "Three years, zero line stoppages because of their supply. Quality documentation is always complete and on time.", rating: 5 },
          { name: "Ritu Malhotra", role: "Founder, Consumer Appliances Brand", text: "They helped us refine our design for manufacturing and cut our per-unit cost by nearly 18%. A true partner, not just a vendor.", rating: 5 },
          { name: "Venkatesh Iyer", role: "Supply Chain Manager, Switchgear Company", text: "Consistent tolerances batch after batch and clear communication on schedules. Onboarding was smooth.", rating: 5 },
          { name: "Harpreet Sandhu", role: "Director, Agri Machinery Exporter", text: "Export packing and documentation are handled perfectly. Our overseas customers have never received a damaged shipment.", rating: 5 },
        ] } },
        { type: "faq", content: { eyebrow: "FAQ", title: "Working", titleHighlight: "With Us", items: [
          { q: "What is your minimum order quantity?", a: "MOQs depend on the process — typically 500 pieces for machined parts and 5,000 for moulded parts. We also take pilot and prototype batches." },
          { q: "How quickly can we get a quote?", a: "Send your drawing (PDF, DWG or STEP) with quantity and material, and we'll share a detailed quote within 48 hours." },
          { q: "Do you sign NDAs?", a: "Yes. We routinely sign NDAs before reviewing drawings, and your designs are never shared or reused." },
          { q: "What quality documentation do you provide?", a: "Dimensional inspection reports, material test certificates and, for automotive clients, full PPAP documentation." },
          { q: "Do you export?", a: "Yes. We ship to the Middle East, Europe and Southeast Asia with export-grade packing and all customs paperwork." },
          { q: "What are your typical lead times?", a: "Samples in 1–2 weeks; bulk production in 3–6 weeks depending on volume and tooling." },
        ] } },
        cta,
      ],
    },
    { slug: "products", title: "Products", isSystem: true, order: 1, sections: [
      { type: "serviceCategories", content: { eyebrow: "", title: "Our", titleHighlight: "Products", categories: CATEGORIES } },
      clients,
      { type: "cta", content: { title: "Need a custom part?", highlight: "Share Your Drawing", phones: [PHONE], buttonLabel: "Request a Quote", buttonHref: "/quote" } },
    ] },
    { slug: "capabilities", title: "Capabilities", isSystem: true, order: 2, sections: [
      { type: "features", content: { items: [
        { icon: "wrench", title: "CNC Machining", text: "VMCs and CNC lathes for turned and milled parts in steel, aluminium and brass." },
        { icon: "hammer", title: "Sheet Metal & Welding", text: "Laser cutting, CNC bending, MIG/TIG welding and powder coating." },
        { icon: "factory", title: "Injection Moulding", text: "50–450 tonne machines for engineering plastic components." },
        { icon: "badge-check", title: "Quality Lab", text: "CMM, hardness testing and calibrated gauges for every batch." },
        { icon: "package", title: "Assembly & Packing", text: "Sub-assembly, testing, labelling and export-grade packaging." },
        { icon: "truck", title: "Logistics", text: "Scheduled dispatches, JIT supply and port delivery for exports." },
      ] } },
      capacity,
      process,
      { type: "cta", content: { title: "Let's build together", highlight: "Request a Quote", phones: [PHONE], buttonLabel: "Get Quote", buttonHref: "/quote" } },
    ] },
    { slug: "about", title: "About", isSystem: true, order: 3, sections: [
      { type: "about", content: { eyebrow: "ABOUT US", title: "25 Years of", titleHighlight: "Engineering Trust", body: [
        `${biz} began as a small machine shop and has grown into a multi-process manufacturing facility trusted by OEMs across India and overseas.`,
        "We invest steadily in modern machinery, skilled people and quality systems — because our clients' production lines depend on ours.",
      ], image: "", points: ["Skilled workforce of 150+", "40,000 sq ft modern facility", "ISO 9001:2015 certified", "Sustainable, low-waste practices"], buttonLabel: "", buttonHref: "" } },
      capacity,
      { type: "cta", content: { title: "Work with us", highlight: "Request a Quote", phones: [PHONE], buttonLabel: "Get Quote", buttonHref: "/quote" } },
    ] },
    { slug: "contact", title: "Contact", isSystem: true, order: 4, sections: [ { type: "contactInfo", content: { eyebrow: "REACH US", title: "Visit Our", titleHighlight: "Facility", address: "Your factory address", phone: PHONE, email: "sales@example.com", hours: "Mon–Sat: 9 AM – 6 PM (plant visits by appointment)", mapEmbed: "" } } ] },
    { slug: "quote", title: "Request a Quote", isSystem: true, order: 5, sections: [
      { type: "quoteForm", content: { title: "Request a Manufacturing Quote", subtitle: "Share your product, drawing, material and annual volume — we'll respond within 48 hours.", showSidebar: true } },
      process,
    ] },
  ],
};
