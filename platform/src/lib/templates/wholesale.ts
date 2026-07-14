import type { TemplateDef } from "./types";

export const wholesale: TemplateDef = {
  theme: {
    colors: { primary: "#7c3aed", primaryDark: "#6d28d9", secondary: "#1e1b4b", accent: "#a78bfa", dark: "#12102e", light: "#f5f3ff", text: "#3f3f46", heading: "#1e1b4b" },
    font: "Poppins", radius: "0.7rem",
  },
  header: (biz) => ({
    logoText: biz, logoImage: "",
    announcement: { show: false, text: "📦 Bulk orders — best wholesale rates. Enquire today!", link: "/enquiry" },
    topbar: { show: true, address: "Wholesale & distribution", phones: ["9000000000"], email: "sales@example.com", social: { facebook: "#", instagram: "#", whatsapp: "#" } },
    nav: [
      { label: "Home", href: "/" }, { label: "Products", href: "/products" }, { label: "Bulk Rates", href: "/rates" }, { label: "About", href: "/about" }, { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Get Bulk Quote", href: "/enquiry" },
  }),
  footer: (biz) => ({
    about: "Your trusted wholesale supplier with the best rates and reliable delivery.",
    columns: [
      { title: "Quick Links", links: [ { label: "Home", href: "/" }, { label: "Products", href: "/products" }, { label: "Bulk Rates", href: "/rates" }, { label: "Bulk Quote", href: "/enquiry" }, { label: "Contact", href: "/contact" } ] },
      { title: "Categories", links: [ { label: "Groceries", href: "/products" }, { label: "Household", href: "/products" }, { label: "Stationery", href: "/products" }, { label: "Packaging", href: "/products" } ] },
    ],
    serviceAreas: ["Retailers", "Distributors", "Shops", "Offices", "Institutions"],
    contact: { phones: ["9000000000"], email: "sales@example.com", address: "Your City" },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. All Rights Reserved.`,
  }),
  seo: (biz) => ({ title: `${biz} — Wholesale Supplier & Distributor`, description: "Best wholesale rates on bulk products with reliable and timely delivery. Request a bulk quote today.", favicon: "", ogImage: "" }),
  services: [
    { category: "Groceries & Food", title: "Rice, Pulses & Grains", description: "Bulk packs at wholesale rates." },
    { category: "Groceries & Food", title: "Oils & Spices", description: "Wide range in bulk." },
    { category: "Groceries & Food", title: "Packaged Foods", description: "Branded & local products." },
    { category: "Household", title: "Cleaning Supplies", description: "Detergents, soaps & more." },
    { category: "Household", title: "Kitchenware", description: "Utensils & plastic items." },
    { category: "Stationery", title: "Office Stationery", description: "Pens, paper, files in bulk." },
    { category: "Stationery", title: "School Supplies", description: "Notebooks, kits & more." },
    { category: "Packaging", title: "Boxes & Cartons", description: "Custom sizes available." },
    { category: "Packaging", title: "Bags & Wrapping", description: "Poly, paper & jute bags." },
  ],
  gallery: [...["Warehouse", "Stock", "Loading", "Delivery fleet", "Products", "Team"].map((c) => ({ category: "Our Business", caption: c }))],
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "split", customHtml: "",
          badge: "WHOLESALE · BULK · DISTRIBUTION", titleTop: "Best Rates on", titleHighlight: "Bulk Orders",
          subtitle: "", description: `${biz} supplies quality products at wholesale prices with reliable, on-time delivery for retailers and businesses.`, image: "",
          primaryBtn: { label: "Get Bulk Quote", href: "/enquiry" }, secondaryBtn: { label: "View Products", href: "/products" },
          features: [ { icon: "tag", title: "Wholesale Rates", text: "" }, { icon: "store", title: "Wide Range", text: "" }, { icon: "clock", title: "Fast Delivery", text: "" }, { icon: "shield", title: "Trusted Supplier", text: "" } ],
        } },
        { type: "features", content: { items: [
          { icon: "tag", title: "Lowest Prices", text: "Direct wholesale rates, no middlemen." },
          { icon: "store", title: "Huge Inventory", text: "Thousands of products in stock." },
          { icon: "clock", title: "Quick Dispatch", text: "Same-day dispatch on bulk orders." },
          { icon: "handshake", title: "Trusted by 1000+", text: "Retailers and businesses rely on us." },
        ] } },
        { type: "serviceCategories", content: { eyebrow: "PRODUCTS", title: "Our", titleHighlight: "Categories", categories: ["Groceries & Food", "Household", "Stationery", "Packaging"] } },
        { type: "stats", content: { items: [ { value: "5000+", label: "Products", icon: "store" }, { value: "1000+", label: "Happy Clients", icon: "users" }, { value: "24 hrs", label: "Dispatch", icon: "clock" }, { value: "20+", label: "Years", icon: "award" } ] } },
        { type: "imageBanner", content: { title: "Need a bulk quote?", subtitle: "Send us your requirement and get the best wholesale price.", buttonLabel: "Get Bulk Quote", buttonHref: "/enquiry", image: "" } },
        { type: "cta", content: { title: "Looking for wholesale rates?", highlight: "Contact Us Today", phones: ["9000000000"], buttonLabel: "Get Quote", buttonHref: "/enquiry" } },
      ],
    },
    { slug: "products", title: "Products", isSystem: true, order: 1, sections: [
      { type: "serviceCategories", content: { eyebrow: "", title: "Our", titleHighlight: "Products", categories: ["Groceries & Food", "Household", "Stationery", "Packaging"] } },
      { type: "cta", content: { title: "Want bulk pricing?", highlight: "Request a Quote", phones: ["9000000000"], buttonLabel: "Get Quote", buttonHref: "/enquiry" } },
    ] },
    { slug: "rates", title: "Bulk Rates", isSystem: true, order: 2, sections: [
      { type: "priceList", content: { eyebrow: "", title: "Sample", titleHighlight: "Bulk Rates", note: "Rates are indicative and vary by quantity. Request a quote for exact pricing.", groups: [
        { category: "Groceries (per unit, bulk)", items: [ { name: "Rice (25kg bag)", price: "₹1,150", note: "" }, { name: "Sugar (50kg)", price: "₹2,100", note: "" }, { name: "Cooking Oil (15L)", price: "₹1,650", note: "" } ] },
        { category: "Household", items: [ { name: "Detergent (5kg)", price: "₹340", note: "" }, { name: "Soap (carton of 100)", price: "₹1,900", note: "" } ] },
        { category: "Stationery", items: [ { name: "Notebooks (pack of 100)", price: "₹2,400", note: "" }, { name: "Pens (box of 500)", price: "₹1,750", note: "" } ] },
      ] } },
      { type: "cta", content: { title: "Get exact bulk pricing", highlight: "Send Your Requirement", phones: ["9000000000"], buttonLabel: "Get Quote", buttonHref: "/enquiry" } },
    ] },
    { slug: "about", title: "About", isSystem: true, order: 3, sections: [
      { type: "about", content: { eyebrow: "ABOUT US", title: "Your Trusted", titleHighlight: "Wholesale Partner", body: [`${biz} has served retailers and businesses for years with quality products and unbeatable wholesale rates.`], image: "", points: ["Direct sourcing", "Quality assured", "On-time delivery", "Credit options"], buttonLabel: "", buttonHref: "" } },
      { type: "cta", content: { title: "Partner with us", highlight: "Get Wholesale Rates", phones: ["9000000000"], buttonLabel: "Get Quote", buttonHref: "/enquiry" } },
    ] },
    { slug: "contact", title: "Contact", isSystem: true, order: 4, sections: [ { type: "contactInfo", content: { eyebrow: "REACH US", title: "Visit Our", titleHighlight: "Warehouse", address: "Your warehouse address", phone: "9000000000", email: "sales@example.com", hours: "Mon–Sat: 9am – 8pm", mapEmbed: "" } } ] },
    { slug: "enquiry", title: "Bulk Quote", isSystem: true, order: 5, sections: [ { type: "quoteForm", content: { title: "Request a Bulk Quote", subtitle: "Tell us your products and quantities — we'll send the best rate.", showSidebar: true } } ] },
  ],
};
