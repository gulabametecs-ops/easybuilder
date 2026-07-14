import type { TemplateDef } from "./types";

export const manufacturing: TemplateDef = {
  theme: {
    colors: { primary: "#0ea5e9", primaryDark: "#0284c7", secondary: "#0f172a", accent: "#38bdf8", dark: "#0b1220", light: "#f0f9ff", text: "#334155", heading: "#0f172a" },
    font: "Poppins", radius: "0.5rem",
  },
  header: (biz) => ({
    logoText: biz, logoImage: "",
    announcement: { show: false, text: "🏭 Now accepting bulk & custom manufacturing orders — request a quote!", link: "/quote" },
    topbar: { show: true, address: "Manufacturing & bulk supply", phones: ["9000000000"], email: "sales@example.com", social: { facebook: "#", instagram: "#", whatsapp: "#" } },
    nav: [
      { label: "Home", href: "/" }, { label: "Products", href: "/products" }, { label: "Capabilities", href: "/capabilities" }, { label: "About", href: "/about" }, { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Request a Quote", href: "/quote" },
  }),
  footer: (biz) => ({
    about: "Precision manufacturing and reliable bulk supply for businesses.",
    columns: [
      { title: "Quick Links", links: [ { label: "Home", href: "/" }, { label: "Products", href: "/products" }, { label: "Capabilities", href: "/capabilities" }, { label: "Request Quote", href: "/quote" }, { label: "Contact", href: "/contact" } ] },
      { title: "Capabilities", links: [ { label: "Custom Manufacturing", href: "/capabilities" }, { label: "Bulk Production", href: "/capabilities" }, { label: "Quality Control", href: "/capabilities" }, { label: "Packaging", href: "/capabilities" } ] },
    ],
    serviceAreas: ["OEM", "Bulk Orders", "Custom", "Export", "B2B"],
    contact: { phones: ["9000000000"], email: "sales@example.com", address: "Your City" },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. All Rights Reserved.`,
  }),
  seo: (biz) => ({ title: `${biz} — Manufacturing & Bulk Supply`, description: "Precision manufacturing, custom production and reliable bulk supply for B2B clients. Request a quote today.", favicon: "", ogImage: "" }),
  services: [
    { category: "Our Products", title: "Product Line A", description: "High-quality, made to spec." },
    { category: "Our Products", title: "Product Line B", description: "Durable and reliable." },
    { category: "Our Products", title: "Product Line C", description: "Custom sizes available." },
    { category: "Our Products", title: "Product Line D", description: "Export-quality finish." },
    { category: "Custom Manufacturing", title: "OEM Manufacturing", description: "Made to your specifications." },
    { category: "Custom Manufacturing", title: "White Labelling", description: "Your brand, our production." },
    { category: "Custom Manufacturing", title: "Prototyping", description: "From idea to sample." },
    { category: "Services", title: "Bulk Production", description: "Large-volume orders." },
    { category: "Services", title: "Quality Testing", description: "Certified quality control." },
    { category: "Services", title: "Packaging & Logistics", description: "Ready-to-ship." },
  ],
  gallery: [...["Factory floor", "Machinery", "Production line", "Quality lab", "Warehouse", "Packaging"].map((c) => ({ category: "Our Facility", caption: c }))],
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "classic", customHtml: "",
          badge: "MANUFACTURING · BULK · CUSTOM", titleTop: "Precision at", titleHighlight: "Scale",
          subtitle: "", description: `${biz} delivers quality manufacturing and reliable bulk supply with modern machinery and strict quality control.`, image: "",
          primaryBtn: { label: "Request a Quote", href: "/quote" }, secondaryBtn: { label: "Our Capabilities", href: "/capabilities" },
          features: [ { icon: "shield", title: "ISO Quality", text: "" }, { icon: "trending", title: "High Capacity", text: "" }, { icon: "clock", title: "On-Time Delivery", text: "" }, { icon: "check", title: "Custom Orders", text: "" } ],
        } },
        { type: "about", content: { eyebrow: "ABOUT US", title: "Trusted", titleHighlight: "Manufacturing Partner", body: [`${biz} combines modern technology with skilled expertise to deliver consistent quality at scale.`, "From custom OEM to large bulk orders, we're your reliable production partner."], image: "", points: ["Modern machinery", "Strict quality control", "Scalable capacity", "On-time delivery"], buttonLabel: "About Us", buttonHref: "/about" } },
        { type: "features", content: { items: [
          { icon: "shield", title: "Certified Quality", text: "ISO-standard quality management." },
          { icon: "trending", title: "High Output", text: "Capacity for large bulk orders." },
          { icon: "check", title: "Custom Manufacturing", text: "Made exactly to your spec." },
          { icon: "clock", title: "Reliable Delivery", text: "We meet your deadlines." },
        ] } },
        { type: "serviceCategories", content: { eyebrow: "WHAT WE DO", title: "Products &", titleHighlight: "Services", categories: ["Our Products", "Custom Manufacturing", "Services"] } },
        { type: "stats", content: { items: [ { value: "1M+", label: "Units Produced", icon: "trending" }, { value: "200+", label: "B2B Clients", icon: "handshake" }, { value: "99%", label: "On-Time", icon: "clock" }, { value: "25+", label: "Years", icon: "award" } ] } },
        { type: "imageBanner", content: { title: "Have a manufacturing requirement?", subtitle: "Share your specs and volume — we'll get back with a competitive quote.", buttonLabel: "Request a Quote", buttonHref: "/quote", image: "" } },
        { type: "cta", content: { title: "Ready to produce at scale?", highlight: "Request a Quote", phones: ["9000000000"], buttonLabel: "Get Quote", buttonHref: "/quote" } },
      ],
    },
    { slug: "products", title: "Products", isSystem: true, order: 1, sections: [
      { type: "serviceCategories", content: { eyebrow: "", title: "Our", titleHighlight: "Products", categories: ["Our Products", "Custom Manufacturing", "Services"] } },
      { type: "cta", content: { title: "Need a custom product?", highlight: "Request a Quote", phones: ["9000000000"], buttonLabel: "Get Quote", buttonHref: "/quote" } },
    ] },
    { slug: "capabilities", title: "Capabilities", isSystem: true, order: 2, sections: [
      { type: "features", content: { items: [
        { icon: "shield", title: "Quality Control", text: "In-house testing at every stage." },
        { icon: "trending", title: "Bulk Capacity", text: "Large-volume production lines." },
        { icon: "check", title: "Custom & OEM", text: "White-label and made-to-order." },
        { icon: "roller", title: "Finishing", text: "Export-quality finish & packaging." },
      ] } },
      { type: "stats", content: { items: [ { value: "1M+", label: "Units/yr", icon: "trending" }, { value: "10+", label: "Production Lines", icon: "wrench" }, { value: "ISO", label: "Certified", icon: "shield" }, { value: "25+", label: "Years", icon: "award" } ] } },
      { type: "cta", content: { title: "Let's build together", highlight: "Request a Quote", phones: ["9000000000"], buttonLabel: "Get Quote", buttonHref: "/quote" } },
    ] },
    { slug: "about", title: "About", isSystem: true, order: 3, sections: [
      { type: "about", content: { eyebrow: "ABOUT US", title: "Our", titleHighlight: "Story", body: [`${biz} has grown into a trusted manufacturing partner for businesses across industries.`], image: "", points: ["Skilled workforce", "Modern facility", "Sustainable practices"], buttonLabel: "", buttonHref: "" } },
      { type: "cta", content: { title: "Work with us", highlight: "Request a Quote", phones: ["9000000000"], buttonLabel: "Get Quote", buttonHref: "/quote" } },
    ] },
    { slug: "contact", title: "Contact", isSystem: true, order: 4, sections: [ { type: "contactInfo", content: { eyebrow: "REACH US", title: "Our", titleHighlight: "Facility", address: "Your factory address", phone: "9000000000", email: "sales@example.com", hours: "Mon–Sat: 9am – 6pm", mapEmbed: "" } } ] },
    { slug: "quote", title: "Request a Quote", isSystem: true, order: 5, sections: [ { type: "quoteForm", content: { title: "Request a Manufacturing Quote", subtitle: "Share your product, specifications and volume — we'll respond quickly.", showSidebar: true } } ] },
  ],
};
