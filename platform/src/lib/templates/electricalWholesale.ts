import type { TemplateDef, SectionSeed } from "./types";

// Electricals & Lighting Wholesale (wires, switchgear, LED, fans, conduits, solar):
// near-black charcoal + electric yellow with a cyan spark, techy sans, conversion on bulk/project quotes.
const PHONE = "9000000000";
const EMAIL = "orders@example.com";
const CATEGORIES = ["Wires & Cables", "Switches & Sockets", "Switchgear & Distribution", "LED Lighting", "Fans & Appliances", "Conduits & Accessories", "Solar Products"];

const stats: SectionSeed<"stats"> = {
  type: "stats",
  content: { items: [
    { value: "8,000+", label: "Products in Stock", icon: "package" },
    { value: "2,500+", label: "Electricians & Contractors", icon: "users" },
    { value: "4 hrs", label: "City Delivery", icon: "zap" },
    { value: "25+", label: "Years in Electricals", icon: "award" },
  ] },
};

const brands: SectionSeed<"logos"> = {
  type: "logos",
  content: { title: "Genuine products from brands electricians trust", items: ["Brand 1", "Brand 2", "Brand 3", "Brand 4", "Brand 5", "Brand 6", "Brand 7", "Brand 8"] },
};

const orderFlow: SectionSeed<"steps"> = {
  type: "steps",
  content: {
    eyebrow: "ORDER IN 4 STEPS", title: "Material on Site,", titleHighlight: "Not on Hold",
    items: [
      { title: "Send Your List", text: "Share the material list or BOQ on WhatsApp, email or the enquiry form — brand, size and quantity.", icon: "clipboard" },
      { title: "Get Net Rates", text: "Brand-wise net rates with discount slabs and GST within 1 working hour.", icon: "tag" },
      { title: "Confirm & Pay", text: "UPI, NEFT, cheque or approved credit — stock reserved immediately.", icon: "check" },
      { title: "Delivered Fast", text: "City orders delivered within 4 hours; outstation via transport with LR copy.", icon: "truck" },
    ],
  },
};

const netRates: SectionSeed<"priceList"> = {
  type: "priceList",
  content: {
    eyebrow: "INDICATIVE NET RATES", title: "Contractor &", titleHighlight: "Dealer Pricing",
    note: "Indicative rates exclusive of GST; copper and brand price revisions apply. Send your list for today's exact net rate.",
    groups: [
      { category: "Wires & Cables", items: [
        { name: "1.5 sq mm FR PVC Wire (90 m coil)", price: "₹1,240", note: "10+ coils: ₹1,195" },
        { name: "2.5 sq mm FR PVC Wire (90 m coil)", price: "₹1,980", note: "10+ coils: ₹1,910" },
        { name: "4 sq mm FRLS Wire (90 m coil)", price: "₹3,150", note: "MOQ 5 coils" },
        { name: "4 core 10 sq mm Armoured Cable", price: "₹265/m", note: "Cut lengths available" },
      ] },
      { category: "Switchgear & Switches", items: [
        { name: "MCB SP 6–32A (C-curve)", price: "₹168", note: "Box of 12: ₹1,950" },
        { name: "RCCB 4P 40A 30 mA", price: "₹2,450", note: "" },
        { name: "8-Way SPN Distribution Board (double door)", price: "₹1,380", note: "MOQ 5" },
        { name: "6A Modular Switch (box of 20)", price: "₹520", note: "Plates & boxes extra" },
      ] },
      { category: "Lighting, Fans & Solar", items: [
        { name: "9W LED Bulb, B22 (pack of 50)", price: "₹2,350", note: "2-year warranty" },
        { name: "2×2 ft 36W LED Panel", price: "₹890", note: "10+ pcs: ₹840" },
        { name: "1200 mm BLDC Ceiling Fan", price: "₹2,750", note: "5-star rated" },
        { name: "540 Wp Mono PERC Solar Panel", price: "₹13,200", note: "Pallet rates on request" },
      ] },
    ],
  },
};

const testimonials: SectionSeed<"testimonials"> = {
  type: "testimonials",
  content: { eyebrow: "FROM THE FIELD", title: "Electricians &", titleHighlight: "Contractors Say", items: [
    { name: "Sanjay Electricals", role: "Electrical contractor, residential projects", text: "I send the list at 10 in the morning and the material is on site before lunch. Rates are consistently the best in the market.", rating: 5 },
    { name: "Imran Qureshi", role: "Licensed electrician", text: "Genuine wire with batch numbers and proper bills — my clients trust the work more. The loyalty scheme is a nice bonus.", rating: 5 },
    { name: "Shree Ganesh Builders", role: "Builder, 4 residential towers", text: "Full-building wiring, DBs and lighting supplied in phases at a locked rate. GST invoices and e-way bills always in order.", rating: 5 },
    { name: "Meena Lighting House", role: "Retail electrical shop", text: "Their 30-day credit and wide brand range let me compete with much bigger shops. Short-supplies are fixed the next day.", rating: 4 },
  ] },
};

const faqItems = [
  { q: "Who can buy from you?", a: "Electricians, contractors, builders, retailers, institutions and industries. Individual home owners are welcome for complete-house orders." },
  { q: "What is the minimum order?", a: "There is no minimum for counter pickup. Free city delivery applies on orders above ₹10,000; most items have a box or coil MOQ for net rates." },
  { q: "Are your products genuine and ISI marked?", a: "Yes. We source directly from brand companies and their authorised distributors. Wires, MCBs and fans carry ISI/BIS marking and manufacturer warranty." },
  { q: "Do you give GST invoices and credit?", a: "Every sale is billed with a GST tax invoice. Registered contractors and dealers can apply for 15–30 day credit after verification." },
  { q: "How quickly can you deliver?", a: "City orders confirmed before 3 PM are delivered within 4 hours. Outstation orders are dispatched the same day through transport or courier." },
  { q: "Do you supply solar projects?", a: "Yes — panels, on-grid and hybrid inverters, batteries, DC cables, MC4 connectors and mounting structures for rooftop and commercial projects." },
];

const cta: SectionSeed<"cta"> = {
  type: "cta",
  content: { title: "Big project coming up?", highlight: "Lock In Project Rates Today", phones: [PHONE], buttonLabel: "Send Material List", buttonHref: "/enquiry" },
};

export const electricalWholesale: TemplateDef = {
  theme: {
    colors: { primary: "#eab308", primaryDark: "#a16207", secondary: "#111827", accent: "#06b6d4", dark: "#0b0e13", light: "#fbf8ea", text: "#3f4450", heading: "#0b0e13" },
    font: "Saira", radius: "0.375rem",
  },
  header: (biz) => ({
    design: "centered",
    logoText: biz, logoImage: "",
    announcement: { show: true, text: "⚡ Monsoon stock is in — fans, LED and wires at pre-revision rates. Send your list today.", link: "/enquiry" },
    topbar: { show: true, address: "Wires · Switchgear · LED · Fans · Solar — Wholesale & Project Supply", phones: [PHONE], email: EMAIL, social: { facebook: "#", instagram: "#", whatsapp: "#" } },
    nav: [
      { label: "Home", href: "/" }, { label: "Products", href: "/products" }, { label: "Brands", href: "/brands" }, { label: "Dealers", href: "/dealer" }, { label: "About", href: "/about" }, { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Send Material List", href: "/enquiry" },
  }),
  footer: (biz) => ({
    design: "gradient",
    about: `${biz} is a wholesale distributor of electricals and lighting — wires, switchgear, LED, fans, conduits and solar — supplying electricians, contractors, builders and retailers with genuine products and fast delivery.`,
    columns: [
      { title: "Products", links: [ { label: "Wires & Cables", href: "/products" }, { label: "Switchgear & DB", href: "/products" }, { label: "LED Lighting", href: "/products" }, { label: "Fans", href: "/products" }, { label: "Solar Products", href: "/products" } ] },
      { title: "For Trade", links: [ { label: "Bulk / Project Enquiry", href: "/enquiry" }, { label: "Dealer Programme", href: "/dealer" }, { label: "Brands", href: "/brands" }, { label: "Contact", href: "/contact" } ] },
    ],
    serviceAreas: ["Electricians", "Electrical Contractors", "Builders & Developers", "Electrical Retailers", "Industries & Factories", "Solar Installers"],
    contact: { phones: [PHONE], email: EMAIL, address: "Your City" },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. All Rights Reserved.`,
  }),
  seo: (biz) => ({
    title: `${biz} — Electrical & Lighting Wholesaler`,
    description: "Wholesale wires & cables, switches, MCB & distribution boards, LED lights, fans, conduits and solar products. Contractor net rates, GST invoice and 4-hour city delivery.",
    favicon: "", ogImage: "",
    keywords: "electrical wholesaler, wire cable dealer, MCB distributor, LED light wholesale, fan dealer, PVC conduit supplier, solar panel distributor, electrical shop near me",
    businessType: "WholesaleStore",
  }),
  services: [
    { category: "Wires & Cables", title: "House Wires", description: "FR, FRLS and HFFR copper wires from 0.75 to 6 sq mm in 90 m coils.",
      longDescription: "ISI-marked multi-strand copper house wires in FR, FRLS, ZHFR and HFFR grades, 0.75 to 6 sq mm, in all ten colours. Stocked in full coils with batch numbers for traceability — the backbone of every residential and commercial wiring job." },
    { category: "Wires & Cables", title: "Power & Armoured Cables", description: "LT copper and aluminium armoured cables, flexible and submersible cables.",
      longDescription: "2 to 4 core copper and aluminium armoured cables up to 300 sq mm, multi-core flexible cables, submersible pump cables and coaxial/LAN cables. Cut lengths available; drum lots at project rates with test certificates." },
    { category: "Switches & Sockets", title: "Modular Switches & Sockets", description: "Modular switches, sockets, plates, boxes and USB/smart modules.",
      longDescription: "Complete modular ranges — 6A/16A switches and sockets, fan regulators, USB chargers, bell pushes, cover plates in multiple finishes and concealed metal boxes. Builder packs for apartment projects and box quantities for electricians." },
    { category: "Switchgear & Distribution", title: "MCB, RCCB & Isolators", description: "MCBs, RCCBs, RCBOs, isolators and changeover switches.",
      longDescription: "SP, DP, TP and FP MCBs from 0.5 to 63A in B, C and D curves, RCCBs and RCBOs at 30/100/300 mA, isolators, changeovers and surge protectors — for homes, shops and industrial panels." },
    { category: "Switchgear & Distribution", title: "Distribution Boards & MCCBs", description: "SPN/TPN DBs, phase-selector DBs, MCCBs and metering enclosures.",
      longDescription: "Single and double door SPN and TPN distribution boards, VTPN and phase-selector boards, MCCBs up to 630A and meter boxes. We help contractors pick the right ways and ratings for each floor or panel." },
    { category: "LED Lighting", title: "LED Bulbs, Battens & Panels", description: "Bulbs, tube battens, slim panels and downlights for homes and offices.",
      longDescription: "Energy-efficient LED bulbs, 20W/36W battens, 2×2 ft panels, COB and slim downlights, strip lights and profile lights in warm, neutral and cool white. Bulk packs for contractors and retailers with brand warranty." },
    { category: "LED Lighting", title: "Outdoor & Industrial Lighting", description: "Flood lights, street lights, high-bays and well-glass fittings.",
      longDescription: "LED flood lights 50–500W, street lights, high-bays for warehouses and factories, well-glass and flameproof fittings. Lux-level suggestions provided for project quotes." },
    { category: "Fans & Appliances", title: "Ceiling, Exhaust & BLDC Fans", description: "Ceiling, BLDC, wall, pedestal and exhaust fans plus water heaters.",
      longDescription: "Standard and energy-saving BLDC ceiling fans, decorative fans, wall and pedestal fans, ventilation and exhaust fans, plus storage and instant water heaters. Season stock planned months ahead so you never run short in summer." },
    { category: "Conduits & Accessories", title: "PVC Conduits & Fittings", description: "Rigid and flexible PVC conduits, bends, junction boxes and casing-capping.",
      longDescription: "ISI medium and heavy-gauge PVC conduits, flexible pipes, bends, tees, junction boxes, casing-capping and cable ties — sold by the bundle. Plus tapes, lugs, glands, MCB boxes and earthing material to finish every job." },
    { category: "Solar Products", title: "Solar Panels & Inverters", description: "Mono PERC panels, on-grid/hybrid inverters, batteries and BOS.",
      longDescription: "Mono PERC and bifacial panels, on-grid, off-grid and hybrid inverters, lithium and tubular batteries, DC cables, MC4 connectors, ACDB/DCDB and mounting structures. Supply-only kits for rooftop installers with subsidy-compliant documentation." },
  ],
  gallery: [
    ...["Wire & cable bay", "Switchgear counter", "LED display wall", "Fan display"].map((c) => ({ category: "Our Store", caption: c })),
    ...["Cable drum yard", "Order picking", "Delivery vans", "Solar panel stock"].map((c) => ({ category: "Warehouse & Delivery", caption: c })),
  ],
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "classic", customHtml: "",
          badge: "WIRES · SWITCHGEAR · LED · FANS · SOLAR", titleTop: "Power Up Every Project with", titleHighlight: "Wholesale Electricals",
          subtitle: "", description: `${biz} supplies genuine wires, switchgear, lighting, fans and solar products to electricians, contractors, builders and retailers — net contractor rates, GST invoicing and 4-hour city delivery.`, image: "",
          primaryBtn: { label: "Send Material List", href: "/enquiry" }, secondaryBtn: { label: `Call ${PHONE}`, href: `tel:${PHONE}` },
          features: [ { icon: "zap", title: "4-Hour City Delivery", text: "" }, { icon: "badge-check", title: "ISI / Genuine Brands", text: "" }, { icon: "tag", title: "Contractor Net Rates", text: "" }, { icon: "handshake", title: "Credit for Trade", text: "" } ],
        } },
        { ...stats, style: { layout: "band", background: "primary" } },
        { type: "serviceCategories", content: { eyebrow: "PRODUCT RANGE", title: "Everything Electrical,", titleHighlight: "Under One Roof", categories: CATEGORIES }, style: { layout: "list" } },
        { type: "features", content: { items: [
          { icon: "zap", title: "Same-Day, Often Same-Hour", text: "Own delivery vans across the city; material reaches site while your team is still there." },
          { icon: "badge-check", title: "Only Genuine Stock", text: "Direct from brands and authorised distributors, with batch numbers and warranty." },
          { icon: "tag", title: "Transparent Net Rates", text: "Brand-wise discount slabs — no confusing MRP games." },
          { icon: "clipboard", title: "Project Billing Made Easy", text: "GST invoices, e-way bills and site-wise statements for contractors." },
        ] }, style: { layout: "minimal", background: "dark" } },
        { ...orderFlow, style: { layout: "cards", cardRadius: "sm", cardBorderWidth: 2, cardShadow: "none" } },
        { ...netRates, style: { background: "light" } },
        brands,
        { type: "pricingPlans", content: { eyebrow: "TRADE PROGRAMMES", title: "Built for", titleHighlight: "Electrical Professionals", plans: [
          { name: "Electrician Club", price: "Free", period: "join with ID", features: ["Contractor net rates", "Loyalty points on every bill", "Free city delivery above ₹10,000", "WhatsApp ordering"], featured: false, buttonLabel: "Join Now", buttonHref: "/dealer" },
          { name: "Contractor Account", price: "₹1 L", period: "per month", features: ["Extra slab discount", "15–30 day credit", "Site-wise billing & statements", "Priority delivery slots"], featured: true, buttonLabel: "Open Account", buttonHref: "/dealer" },
          { name: "Retailer / Sub-Dealer", price: "Custom", period: "dealer list", features: ["Dealer price lists by brand", "Scheme & festive offers passed on", "Display & POS support", "Weekly route delivery"], featured: false, buttonLabel: "Become a Dealer", buttonHref: "/dealer" },
        ] }, style: { cardRadius: "sm" } },
        { ...testimonials, style: { layout: "dark" } },
        { type: "about", content: {
          eyebrow: "ABOUT US", title: "25 Years of Keeping", titleHighlight: "Sites Powered",
          body: [
            `${biz} started as a neighbourhood electrical counter and today serves 2,500+ electricians, contractors and retailers with 8,000+ products in ready stock.`,
            "We understand site pressure — that's why we keep deep stock of fast movers, quote within the hour and deliver within hours, not days.",
          ],
          image: "", points: ["Counter, warehouse & cable yard", "Own fleet of delivery vans", "Solar project desk", "Technical help on ratings & sizing"],
          buttonLabel: "Our Story", buttonHref: "/about",
        }, style: { layout: "stacked" } },
        { type: "faq", content: { eyebrow: "FAQ", title: "Questions from", titleHighlight: "the Trade", items: faqItems }, style: { background: "light" } },
        { type: "quoteForm", content: { title: "Send Your Material List", subtitle: "Brand, size and quantity — or just paste your BOQ. Net rates with GST within 1 working hour.", showSidebar: false } },
        cta,
      ],
    },
    { slug: "products", title: "Products", isSystem: true, order: 1, sections: [
      { type: "banner", content: { title: "Our", titleHighlight: "Products", subtitle: "Wires, switchgear, lighting, fans, conduits and solar — genuine brands in ready stock.", image: "", bgColor: "", imageOpacity: 30, overlayOpacity: 85 } },
      { type: "serviceCategories", content: { eyebrow: "", title: "Browse by", titleHighlight: "Category", categories: CATEGORIES }, style: { layout: "default" } },
      netRates,
      { type: "downloads", content: { eyebrow: "DOWNLOADS", title: "Price Lists &", titleHighlight: "Catalogues", items: [
        { title: "Wires & Cables Net Rate List", description: "Brand-wise coil and drum rates, updated with every copper revision.", link: "", icon: "tag" },
        { title: "Switchgear & DB Catalogue", description: "MCB, RCCB, DB and MCCB ratings with part numbers.", link: "", icon: "book" },
        { title: "Lighting & Fans Catalogue", description: "LED, outdoor lighting and fan models with wattages and warranties.", link: "", icon: "zap" },
        { title: "Solar Product Sheet", description: "Panels, inverters, batteries and BOS with datasheets.", link: "", icon: "leaf" },
      ] }, style: { background: "light" } },
      { type: "gallery", content: { eyebrow: "INSIDE THE STORE", title: "Stock You Can", titleHighlight: "Count On" }, style: { layout: "masonry" } },
      cta,
    ] },
    { slug: "brands", title: "Brands", isSystem: true, order: 2, sections: [
      { type: "banner", content: { title: "Brands We", titleHighlight: "Deal In", subtitle: "Genuine, ISI-marked products with full manufacturer warranty.", image: "", bgColor: "", imageOpacity: 30, overlayOpacity: 85 } },
      brands,
      { type: "features", content: { items: [
        { icon: "badge-check", title: "Sourced Right", text: "Directly from brand companies and their authorised distributors." },
        { icon: "shield", title: "Warranty Backed", text: "Replacement and warranty claims processed through our counter." },
        { icon: "trending", title: "Price-Revision Alerts", text: "We message regular buyers before brand price increases." },
        { icon: "package", title: "Deep Stock", text: "Fast movers held in quantity so projects never stall." },
      ] }, style: { layout: "cards", background: "light", cardRadius: "sm" } },
      { type: "cta", content: { title: "Need a specific brand or part number?", highlight: "Check Availability", phones: [PHONE], buttonLabel: "Send Enquiry", buttonHref: "/enquiry" }, style: { layout: "split" } },
    ] },
    { slug: "about", title: "About", isSystem: true, order: 3, sections: [
      { type: "about", content: { eyebrow: "ABOUT US", title: "Your Electrical", titleHighlight: "Supply Partner", body: [
        `${biz} has grown from a single counter into a full-line electrical and lighting distributor with a warehouse, cable yard and delivery fleet.`,
        "Electricians, contractors and builders rely on us because we pick up the phone, keep the stock and deliver on time — every time.",
      ], image: "", points: ["8,000+ products", "Own delivery fleet", "Solar project desk", "Credit for registered trade"], buttonLabel: "", buttonHref: "" }, style: { layout: "centered" } },
      { ...stats, style: { layout: "default", background: "dark" } },
      { type: "visionMission", content: {
        eyebrow: "WHAT DRIVES US",
        visionTitle: "Our Vision", visionText: "To be the first call for every electrician and contractor who needs genuine material, fast.",
        missionTitle: "Our Mission", missionText: "Deep stock, honest net rates and delivery within hours — so no site ever waits on material.",
        valuesTitle: "Our Values",
        values: [
          { icon: "shield", title: "Safety First", text: "Only certified, genuine products — because wiring lasts decades." },
          { icon: "zap", title: "Speed", text: "Quotes in an hour, delivery in hours." },
          { icon: "handshake", title: "Trade Loyalty", text: "We grow when our electricians and dealers grow." },
        ],
      } },
      { ...testimonials, style: { layout: "minimal", background: "light" } },
    ] },
    { slug: "dealer", title: "Dealers & Contractors", isSystem: true, order: 4, sections: [
      { type: "banner", content: { title: "Partner", titleHighlight: "With Us", subtitle: "Electricians, contractors and retailers — get trade rates, credit and priority delivery.", image: "", bgColor: "", imageOpacity: 30, overlayOpacity: 85 } },
      { type: "steps", content: { eyebrow: "GET STARTED", title: "Open a Trade", titleHighlight: "Account", items: [
        { title: "Register", text: "Share your name, firm, GSTIN (if any) and electrician licence or shop details.", icon: "edit" },
        { title: "Verification", text: "Our team verifies details and shares brand-wise trade price lists.", icon: "badge-check" },
        { title: "Start Ordering", text: "Order on WhatsApp or call; credit limit activated after three orders.", icon: "zap" },
      ] }, style: { layout: "timeline" } },
      { type: "quoteForm", content: { title: "Trade / Dealer Registration", subtitle: "Tell us about your business and the product lines you buy — we'll call back within one working day.", showSidebar: true }, style: { background: "light" } },
    ] },
    { slug: "contact", title: "Contact", isSystem: true, order: 5, sections: [
      { type: "contactInfo", content: { eyebrow: "REACH US", title: "Visit Our", titleHighlight: "Store & Warehouse", address: "Your store & warehouse address", phone: PHONE, email: EMAIL, hours: "Mon–Sat: 9 AM – 8:30 PM · Sunday: 10 AM – 1 PM", mapEmbed: "" } },
      { type: "openingHours", content: { eyebrow: "TIMINGS", title: "Counter &", titleHighlight: "Delivery Hours", note: "City orders confirmed before 3 PM are delivered within 4 hours.", days: [
        { day: "Monday – Saturday", hours: "9:00 AM – 8:30 PM" },
        { day: "Sunday", hours: "10:00 AM – 1:00 PM" },
        { day: "City delivery cut-off", hours: "3:00 PM" },
        { day: "Outstation dispatch", hours: "Daily till 5:00 PM" },
      ] }, style: { background: "dark" } },
      { type: "contactForm", content: { title: "Message Our Sales Counter", subtitle: "Stock checks, rates, credit or delivery — we reply within the hour during working time." } },
    ] },
    { slug: "enquiry", title: "Bulk Enquiry", isSystem: true, order: 6, showInNav: false, sections: [
      { type: "quoteForm", content: { title: "Bulk / Project Enquiry", subtitle: "List products with brand, size and quantity — we'll send net rates with GST within 1 working hour.", showSidebar: true } },
      { ...orderFlow, style: { layout: "cards" } },
    ] },
  ],
};
