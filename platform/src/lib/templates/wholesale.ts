import type { TemplateDef, SectionSeed } from "./types";

const PHONE = "9000000000";
const CATEGORIES = ["Groceries & Food", "Household", "Stationery", "Packaging"];

const brands: SectionSeed<"logos"> = {
  type: "logos",
  content: { title: "Every category your shop needs, under one roof", items: ["Staples & Grains", "Edible Oils", "Packaged Foods", "Beverages", "Personal Care", "Home Care", "Stationery", "Snacks & Biscuits"] },
};

const orderSteps: SectionSeed<"steps"> = {
  type: "steps",
  content: {
    eyebrow: "HOW ORDERING WORKS", title: "From Enquiry to", titleHighlight: "Doorstep in 24 Hours",
    items: [
      { title: "Share Your List", text: "Send products and quantities by form, call or WhatsApp.", icon: "clipboard" },
      { title: "Get Your Best Rate", text: "Slab-wise wholesale quote within 2 working hours.", icon: "tag" },
      { title: "Confirm & Pay", text: "UPI, NEFT or approved credit terms for regular buyers.", icon: "check" },
      { title: "Fast Dispatch", text: "Packed, invoiced with GST and dispatched within 24 hours.", icon: "truck" },
    ],
  },
};

const rates: SectionSeed<"priceList"> = {
  type: "priceList",
  content: { eyebrow: "BULK PRICING", title: "Order More,", titleHighlight: "Pay Less", note: "Indicative rates, exclusive of GST and freight. Prices drop further at higher slabs — request a quote for today's exact rate.", groups: [
    { category: "Groceries — per unit", items: [
      { name: "Sona Masoori Rice (25 kg)", price: "₹1,150", note: "10+ bags: ₹1,110 · 50+ bags: ₹1,070" },
      { name: "Sugar (50 kg)", price: "₹2,100", note: "10+ bags: ₹2,050" },
      { name: "Refined Sunflower Oil (15 L tin)", price: "₹1,650", note: "20+ tins: ₹1,590" },
      { name: "Toor Dal (30 kg)", price: "₹3,480", note: "10+ bags: ₹3,390" },
    ] },
    { category: "Household", items: [
      { name: "Detergent Powder (5 kg)", price: "₹340", note: "Carton of 6: ₹1,950" },
      { name: "Bath Soap (carton of 100)", price: "₹1,900", note: "5+ cartons: ₹1,820" },
      { name: "Dishwash Liquid (5 L)", price: "₹420", note: "" },
    ] },
    { category: "Stationery & Packaging", items: [
      { name: "Notebooks (pack of 100)", price: "₹2,400", note: "Custom branding available" },
      { name: "Ball Pens (box of 500)", price: "₹1,750", note: "" },
      { name: "Corrugated Boxes (per 100)", price: "₹1,200", note: "Custom sizes on request" },
    ] },
  ] },
};

const cta: SectionSeed<"cta"> = {
  type: "cta",
  content: { title: "Stocking up for the season?", highlight: "Get Today's Wholesale Rates", phones: [PHONE], buttonLabel: "Get Bulk Quote", buttonHref: "/enquiry" },
};

export const wholesale: TemplateDef = {
  theme: {
    colors: { primary: "#7c3aed", primaryDark: "#5b21b6", secondary: "#1a1744", accent: "#f59e0b", dark: "#110e2f", light: "#f6f4ff", text: "#3f3f55", heading: "#1a1744" },
    font: "Sora", radius: "0.85rem",
  },
  header: (biz) => ({
    logoText: biz, logoImage: "",
    announcement: { show: false, text: "📦 Festive stock is in — lock in bulk rates before prices rise. Enquire today!", link: "/enquiry" },
    topbar: { show: true, address: "Wholesale · Bulk Supply · Distribution · GST Invoicing", phones: [PHONE], email: "sales@example.com", social: { facebook: "#", instagram: "#", whatsapp: "#" } },
    nav: [
      { label: "Home", href: "/" }, { label: "Products", href: "/products" }, { label: "Bulk Rates", href: "/rates" }, { label: "About", href: "/about" }, { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Get Bulk Quote", href: "/enquiry" },
  }),
  footer: (biz) => ({
    about: "Direct-from-brand wholesale for retailers, offices and institutions — sharp slab pricing, GST invoices and dispatch within 24 hours.",
    columns: [
      { title: "Quick Links", links: [ { label: "Home", href: "/" }, { label: "Products", href: "/products" }, { label: "Bulk Rates", href: "/rates" }, { label: "Bulk Quote", href: "/enquiry" }, { label: "Contact", href: "/contact" } ] },
      { title: "Categories", links: [ { label: "Groceries & Food", href: "/products" }, { label: "Household", href: "/products" }, { label: "Stationery", href: "/products" }, { label: "Packaging", href: "/products" } ] },
    ],
    serviceAreas: ["Kirana Stores", "Supermarkets", "Distributors", "Offices", "Hotels & Canteens", "Schools & Institutions"],
    contact: { phones: [PHONE], email: "sales@example.com", address: "Your City" },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. All Rights Reserved.`,
  }),
  seo: (biz) => ({
    title: `${biz} — Wholesale Supplier & Distributor`,
    description: "Wholesale groceries, household, stationery and packaging at slab-wise bulk rates. GST invoices, credit for regular buyers and dispatch within 24 hours.",
    favicon: "", ogImage: "",
    keywords: "wholesale supplier, bulk groceries, distributor, wholesale rates, kirana supplier, packaging supplier",
    businessType: "WholesaleStore",
  }),
  services: [
    { category: "Groceries & Food", title: "Rice, Pulses & Grains", description: "Sona Masoori, basmati, dals and atta in 25–50 kg bags." },
    { category: "Groceries & Food", title: "Oils & Spices", description: "Branded edible oils in tins and whole & ground spices." },
    { category: "Groceries & Food", title: "Packaged Foods", description: "Biscuits, snacks, beverages and instant foods by the carton." },
    { category: "Household", title: "Cleaning Supplies", description: "Detergents, soaps, floor cleaners and dishwash in bulk." },
    { category: "Household", title: "Kitchenware & Plastics", description: "Utensils, containers and disposables for homes and hotels." },
    { category: "Stationery", title: "Office Stationery", description: "Paper, pens, files and printer supplies at office-scale rates." },
    { category: "Stationery", title: "School Supplies", description: "Notebooks, geometry kits and art supplies for the new session." },
    { category: "Packaging", title: "Boxes & Cartons", description: "Corrugated boxes in standard and custom sizes." },
    { category: "Packaging", title: "Bags & Wrapping", description: "Poly, paper and jute bags, tapes and stretch film." },
  ],
  gallery: [
    ...["Main warehouse", "Grocery stock", "Household aisle", "Stationery section"].map((c) => ({ category: "Our Warehouse", caption: c })),
    ...["Order packing", "Loading bay", "Delivery fleet", "Customer pickup"].map((c) => ({ category: "Dispatch & Delivery", caption: c })),
  ],
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "split", customHtml: "",
          badge: "WHOLESALE · BULK SUPPLY · GST INVOICING", titleTop: "Wholesale Rates That", titleHighlight: "Grow Your Margins",
          subtitle: "", description: `${biz} supplies 5,000+ products direct from trusted brands to retailers, offices and institutions — with slab-wise bulk pricing, GST invoices and dispatch within 24 hours.`, image: "",
          primaryBtn: { label: "Get Bulk Quote", href: "/enquiry" }, secondaryBtn: { label: "See Bulk Rates", href: "/rates" },
          features: [ { icon: "tag", title: "Slab-Wise Pricing", text: "" }, { icon: "package", title: "5,000+ Products", text: "" }, { icon: "truck", title: "24-Hour Dispatch", text: "" }, { icon: "handshake", title: "Credit for Regulars", text: "" } ],
        } },
        { type: "features", content: { items: [
          { icon: "tag", title: "Direct-From-Brand Rates", text: "No middlemen — better margins on every carton you buy." },
          { icon: "package", title: "Always in Stock", text: "Deep inventory on fast movers, so your shelves never go empty." },
          { icon: "truck", title: "Dispatch in 24 Hours", text: "Own delivery fleet across the city and reliable transport partners beyond." },
          { icon: "clipboard", title: "GST-Ready Billing", text: "Proper tax invoices on every order for easy input credit." },
        ] }, style: { cardShadow: "md" } },
        { type: "serviceCategories", content: { eyebrow: "WHAT WE SUPPLY", title: "Shop by", titleHighlight: "Category", categories: CATEGORIES } },
        { type: "about", content: {
          eyebrow: "ABOUT US", title: "Your Reliable", titleHighlight: "Wholesale Partner",
          body: [
            `For over two decades, ${biz} has helped kirana stores, supermarkets, offices and institutions buy smarter — better rates, dependable stock and deliveries that arrive when promised.`,
            "We buy directly from brands and mills in large volumes and pass the savings straight to you.",
          ],
          image: "", points: ["Direct sourcing from brands & mills", "Quality-checked, fresh-dated stock", "Credit terms for regular buyers", "Dedicated account manager"],
          buttonLabel: "About Us", buttonHref: "/about",
        } },
        brands,
        rates,
        { type: "stats", content: { items: [ { value: "5,000+", label: "Products in Stock", icon: "package" }, { value: "1,200+", label: "Active Business Buyers", icon: "store" }, { value: "24 hrs", label: "Average Dispatch", icon: "truck" }, { value: "20+", label: "Years in Trade", icon: "award" } ] } },
        orderSteps,
        { type: "testimonials", content: { eyebrow: "BUYER REVIEWS", title: "Why Retailers", titleHighlight: "Stay With Us", items: [
          { name: "Mahesh Gupta", role: "Kirana store owner", text: "Rates are consistently lower than my old distributor and the order always arrives next morning. My margins have clearly improved.", rating: 5 },
          { name: "Sunita Rao", role: "Admin head, IT company", text: "We source all our office stationery and pantry supplies here. One GST invoice, one delivery, zero follow-ups.", rating: 5 },
          { name: "Abdul Rahman", role: "Supermarket owner", text: "Their credit terms and stock availability during festivals have been a big help for my business.", rating: 5 },
          { name: "Deepak Jain", role: "Hotel purchase manager", text: "Transparent slab pricing and genuine branded products. The account manager is always a call away.", rating: 5 },
        ] } },
        { type: "faq", content: { eyebrow: "FAQ", title: "Buyer", titleHighlight: "Questions", items: [
          { q: "What is the minimum order quantity?", a: "Minimum order value is ₹10,000 for delivery. Per-product minimums are usually one bag, tin or carton." },
          { q: "Do you provide GST invoices?", a: "Yes. Every order comes with a proper GST tax invoice so you can claim input tax credit." },
          { q: "Do you offer credit?", a: "Regular buyers can apply for 7–30 day credit terms after their first three orders." },
          { q: "How fast is delivery?", a: "Orders confirmed before 4 PM are dispatched within 24 hours. Delivery within the city is free above ₹25,000." },
          { q: "Can I get rates on WhatsApp?", a: "Yes. Send your product list on WhatsApp and we'll reply with a slab-wise quote within 2 working hours." },
          { q: "What if an item arrives damaged?", a: "Report it within 48 hours with a photo and we'll replace it or issue a credit note — no arguments." },
        ] } },
        cta,
      ],
    },
    { slug: "products", title: "Products", isSystem: true, order: 1, sections: [
      { type: "serviceCategories", content: { eyebrow: "", title: "Our", titleHighlight: "Products", categories: CATEGORIES } },
      brands,
      { type: "cta", content: { title: "Want bulk pricing?", highlight: "Request a Quote", phones: [PHONE], buttonLabel: "Get Quote", buttonHref: "/enquiry" } },
    ] },
    { slug: "rates", title: "Bulk Rates", isSystem: true, order: 2, sections: [
      rates,
      orderSteps,
      { type: "cta", content: { title: "Need exact pricing?", highlight: "Send Your Requirement", phones: [PHONE], buttonLabel: "Get Quote", buttonHref: "/enquiry" } },
    ] },
    { slug: "about", title: "About", isSystem: true, order: 3, sections: [
      { type: "about", content: { eyebrow: "ABOUT US", title: "Two Decades of", titleHighlight: "Trusted Trade", body: [
        `${biz} started as a small grocery wholesaler and has grown into a multi-category supplier serving over a thousand businesses.`,
        "Our promise has never changed: honest rates, genuine products and deliveries you can plan your business around.",
      ], image: "", points: ["Direct sourcing", "Quality assured", "On-time delivery", "Credit options"], buttonLabel: "", buttonHref: "" } },
      { type: "stats", content: { items: [ { value: "5,000+", label: "Products", icon: "package" }, { value: "1,200+", label: "Business Buyers", icon: "users" }, { value: "15+", label: "Delivery Vehicles", icon: "truck" }, { value: "20+", label: "Years", icon: "award" } ] } },
      cta,
    ] },
    { slug: "contact", title: "Contact", isSystem: true, order: 4, sections: [ { type: "contactInfo", content: { eyebrow: "REACH US", title: "Visit Our", titleHighlight: "Warehouse", address: "Your warehouse address", phone: PHONE, email: "sales@example.com", hours: "Mon–Sat: 9 AM – 8 PM · Sunday: 10 AM – 2 PM", mapEmbed: "" } } ] },
    { slug: "enquiry", title: "Bulk Quote", isSystem: true, order: 5, sections: [
      { type: "quoteForm", content: { title: "Request a Bulk Quote", subtitle: "List your products and quantities — we'll send a slab-wise rate within 2 working hours.", showSidebar: true } },
      orderSteps,
    ] },
  ],
};
