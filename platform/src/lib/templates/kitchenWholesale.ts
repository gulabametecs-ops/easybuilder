import type { TemplateDef, SectionSeed } from "./types";

// Kitchen Sink & Kitchen-Setup Wholesale (sinks, faucets, chimneys, hobs, modular hardware):
// brushed graphite + aqua teal, clean modern sans, light minimal hero, conversion on dealer/bulk quotes.
const PHONE = "9000000000";
const EMAIL = "trade@example.com";
const CATEGORIES = ["Kitchen Sinks", "Faucets & Fittings", "Chimneys, Hobs & Appliances", "Modular Kitchen Hardware"];

const brands: SectionSeed<"logos"> = {
  type: "logos",
  content: { title: "Leading kitchen brands we stock & supply", items: ["Brand 1", "Brand 2", "Brand 3", "Brand 4", "Brand 5", "Brand 6", "Brand 7", "Brand 8"] },
  style: { background: "light" },
};

const stats: SectionSeed<"stats"> = {
  type: "stats",
  content: { items: [
    { value: "3,500+", label: "SKUs in Ready Stock", icon: "package" },
    { value: "1,800+", label: "Dealers & Kitchen Makers", icon: "handshake" },
    { value: "22", label: "States Dispatched To", icon: "truck" },
    { value: "16+", label: "Years in Kitchen Trade", icon: "award" },
  ] },
};

const orderFlow: SectionSeed<"steps"> = {
  type: "steps",
  content: {
    eyebrow: "HOW TRADE ORDERS WORK", title: "From BOQ to", titleHighlight: "Site Delivery",
    items: [
      { title: "Share Your BOQ", text: "Send a kitchen-wise or project-wise list — model numbers, sizes or just photos of what you need.", icon: "clipboard" },
      { title: "Dealer Price in 2 Hours", text: "Net dealer rates with slab discounts, GST and freight shown line by line.", icon: "tag" },
      { title: "Confirm & Reserve Stock", text: "Pay by UPI/NEFT or use approved credit — stock is blocked against your order immediately.", icon: "check" },
      { title: "Packed for Transit", text: "Sinks crated with corner guards, chimneys and hobs in original sealed cartons, every box labelled.", icon: "package" },
      { title: "Dispatch Pan-India", text: "Same-day dispatch within the city; transport or courier to any PIN code with LR copy shared.", icon: "truck" },
    ],
  },
};

const dealerRates: SectionSeed<"priceList"> = {
  type: "priceList",
  content: {
    eyebrow: "INDICATIVE DEALER RATES", title: "Trade Prices for", titleHighlight: "Volume Buyers",
    note: "Indicative net dealer rates, exclusive of 18% GST and freight. Actual rates depend on brand, finish and order quantity — ask for today's price list.",
    groups: [
      { category: "Kitchen Sinks", items: [
        { name: "SS 304 Single Bowl 24×18\" (matte finish)", price: "₹3,250", note: "MOQ 5 pcs · 20+ pcs: ₹3,050" },
        { name: "SS 304 Double Bowl 45×20\"", price: "₹6,400", note: "MOQ 3 pcs" },
        { name: "Single Bowl with Drainboard 37×18\"", price: "₹4,600", note: "MOQ 3 pcs" },
        { name: "Handmade SS Sink 30×18\" (R10 corners)", price: "₹8,900", note: "Includes coupling & basket" },
        { name: "Quartz Granite Sink 1.5 Bowl (black)", price: "₹11,500", note: "MOQ 2 pcs" },
      ] },
      { category: "Faucets & Fittings", items: [
        { name: "Brass Sink Mixer, Chrome (wall mount)", price: "₹1,850", note: "Carton of 10: ₹17,500" },
        { name: "Pull-Out Sink Tap, Single Lever", price: "₹3,400", note: "MOQ 4 pcs" },
        { name: "Waste Coupling 4\" with Basket", price: "₹380", note: "Box of 25: ₹8,750" },
        { name: "PVC Flexible Waste Pipe (32 mm)", price: "₹95", note: "Box of 50" },
      ] },
      { category: "Appliances & Hardware", items: [
        { name: "Auto-Clean Chimney 60 cm, 1200 m³/h", price: "₹9,800", note: "Brand-wise rates on request" },
        { name: "3-Burner Glass Built-In Hob", price: "₹7,200", note: "Auto-ignition" },
        { name: "SS Tandem Drawer Set (soft close)", price: "₹2,950", note: "Set of 10: ₹28,000" },
        { name: "Soft-Close Hinges (box of 50)", price: "₹2,100", note: "Clip-on, 3D adjustable" },
      ] },
    ],
  },
};

const catalogues: SectionSeed<"downloads"> = {
  type: "downloads",
  content: { eyebrow: "FOR TRADE PARTNERS", title: "Catalogues &", titleHighlight: "Price Lists", items: [
    { title: "Sink Catalogue 2026", description: "SS, handmade and quartz sinks with cut-out sizes, bowl depths and finishes.", link: "", icon: "book" },
    { title: "Faucets & Fittings Catalogue", description: "Mixers, pull-out taps, couplings and waste fittings with model codes.", link: "", icon: "droplet" },
    { title: "Modular Hardware Price List", description: "Baskets, tandem boxes, corner units, hinges and channels — dealer net rates.", link: "", icon: "grid" },
    { title: "Dealer Application Form", description: "Register as a dealer for slab pricing, credit terms and display support.", link: "", icon: "clipboard" },
  ] },
};

const testimonials: SectionSeed<"testimonials"> = {
  type: "testimonials",
  content: { eyebrow: "TRADE REVIEWS", title: "Trusted by Kitchen", titleHighlight: "Professionals", items: [
    { name: "Rohit Malhotra", role: "Modular kitchen manufacturer, 40+ kitchens/month", text: "One supplier for sinks, hobs, chimneys and all the hardware. Every kitchen ships complete — our installers no longer wait on a missing coupling.", rating: 5 },
    { name: "Ar. Neha Kulkarni", role: "Interior designer", text: "Their team suggests sink sizes that actually fit the granite cut-out and sends spec sheets I can share with clients. Delivery is always on the promised date.", rating: 5 },
    { name: "Suresh Agarwal", role: "Sanitaryware & kitchen retailer", text: "Dealer rates are sharp and the 30-day credit keeps my counter stocked. Damaged pieces get replaced without arguments.", rating: 5 },
    { name: "Prakash Constructions", role: "Builder, 220-flat project", text: "We ordered 220 identical sink-and-tap sets in three tranches. Same batch, same finish, GST invoice and LR copy every time.", rating: 5 },
  ] },
};

const faqItems = [
  { q: "What is the minimum order quantity?", a: "Retail counters and kitchen makers can start at ₹15,000 per order. Per-product MOQ is usually 2–5 pieces for sinks and one carton for fittings and hardware." },
  { q: "Do you give a GST invoice?", a: "Yes. Every order is billed with a proper GST tax invoice and e-way bill so you can claim full input tax credit." },
  { q: "Do you dispatch outside the city?", a: "We dispatch pan-India through trusted transporters and courier partners. Sinks are crated and every consignment is shared with an LR copy and tracking." },
  { q: "How fast is delivery within the city?", a: "Orders confirmed before 2 PM are delivered the same day within city limits. Site deliveries can be scheduled for builders and contractors." },
  { q: "Are the products genuine with warranty?", a: "All branded products come in sealed original packing with the manufacturer's warranty card. We help you register and process warranty claims." },
  { q: "Can I get credit terms?", a: "Registered dealers and repeat buyers can apply for 15–45 day credit after three successful orders, subject to documentation." },
  { q: "How do I become a dealer?", a: "Fill the dealer enquiry form with your GSTIN and shop details. Our team will call within one working day with the dealer price list and scheme details." },
];

const cta: SectionSeed<"cta"> = {
  type: "cta",
  content: { title: "Setting up kitchens in bulk?", highlight: "Get Dealer Pricing Today", phones: [PHONE], buttonLabel: "Request Dealer Price", buttonHref: "/enquiry" },
};

export const kitchenWholesale: TemplateDef = {
  theme: {
    colors: { primary: "#0e9f9a", primaryDark: "#0a7773", secondary: "#2b3239", accent: "#8a98a8", dark: "#1b2127", light: "#f1f5f6", text: "#4a535d", heading: "#1b2127" },
    font: "Albert Sans", radius: "0.875rem",
  },
  header: (biz) => ({
    design: "modern",
    logoText: biz, logoImage: "",
    announcement: { show: true, text: "New 2026 sink & hardware catalogue is out — dealers get an extra 2% on the first order.", link: "/dealer" },
    topbar: { show: true, address: "Kitchen Sinks · Faucets · Chimneys & Hobs · Modular Hardware — Wholesale", phones: [PHONE], email: EMAIL, social: { facebook: "#", instagram: "#", whatsapp: "#" } },
    nav: [
      { label: "Home", href: "/" }, { label: "Products", href: "/products" }, { label: "Brands", href: "/brands" }, { label: "Become a Dealer", href: "/dealer" }, { label: "About", href: "/about" }, { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Get Dealer Price", href: "/enquiry" },
  }),
  footer: (biz) => ({
    design: "centered",
    about: `${biz} is a wholesale distributor of kitchen sinks, faucets, chimneys, hobs and modular kitchen hardware — supplying kitchen makers, interior designers, builders and retailers across India.`,
    columns: [
      { title: "Products", links: [ { label: "Kitchen Sinks", href: "/products" }, { label: "Faucets & Fittings", href: "/products" }, { label: "Chimneys & Hobs", href: "/products" }, { label: "Modular Hardware", href: "/products" } ] },
      { title: "For Trade", links: [ { label: "Dealer Price Enquiry", href: "/enquiry" }, { label: "Become a Dealer", href: "/dealer" }, { label: "Brands We Stock", href: "/brands" }, { label: "Contact", href: "/contact" } ] },
    ],
    serviceAreas: ["Modular Kitchen Makers", "Interior Designers", "Builders & Developers", "Contractors", "Sanitaryware Retailers", "Hotels & Institutions"],
    contact: { phones: [PHONE], email: EMAIL, address: "Your City" },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. All Rights Reserved.`,
  }),
  seo: (biz) => ({
    title: `${biz} — Kitchen Sink & Kitchen Hardware Wholesaler`,
    description: "Wholesale stainless-steel, handmade and quartz kitchen sinks, faucets, chimneys, hobs and modular kitchen hardware. Dealer pricing, GST invoice and pan-India dispatch.",
    favicon: "", ogImage: "",
    keywords: "kitchen sink wholesale, stainless steel sink dealer, quartz sink distributor, kitchen faucet wholesale, chimney hob dealer, modular kitchen hardware supplier, tandem drawer wholesale",
    businessType: "WholesaleStore",
  }),
  services: [
    { category: "Kitchen Sinks", title: "Stainless-Steel Sinks", description: "SS 304 single and double bowl sinks in matte, satin and lining finishes.",
      longDescription: "Our core range: food-grade SS 304 sinks in 0.8–1.2 mm gauge, from compact 18×16\" bar sinks to 45×20\" double bowls. Available in matte, satin and lining finishes with sound-deadening pads and anti-condensation coating. Every sink ships with a waste coupling and is crated for safe transit. Ideal for builder projects needing identical batches." },
    { category: "Kitchen Sinks", title: "Sinks with Drainboard", description: "Single and double bowl sinks with integrated drainboards for busy kitchens.",
      longDescription: "Single and double bowl models with left or right drainboards, sized for standard 2 ft and 2.5 ft counters. Popular with modular kitchen makers and hostels where drying space matters. Ribbed drainboards channel water back into the bowl and stay rust-free for years." },
    { category: "Kitchen Sinks", title: "Handmade Sinks", description: "Thick-gauge handmade sinks with tight R10/R15 corners for premium kitchens.",
      longDescription: "1.2–1.5 mm thick handmade sinks with near-square R10 corners, deep 10\" bowls and undermount or top-mount options. Supplied with roller mats, bottom grids and basket wastes for designer kitchens and premium apartment projects." },
    { category: "Kitchen Sinks", title: "Quartz & Granite Sinks", description: "Scratch- and heat-resistant composite sinks in black, grey, white and beige.",
      longDescription: "Composite quartz/granite sinks with 80% natural quartz content, resistant to scratches, stains and heat up to 280°C. Single, 1.5 and double bowl models in matte black, metallic grey, white and sand. Cut-out templates and installation sheets provided with every piece." },
    { category: "Faucets & Fittings", title: "Kitchen Mixers & Taps", description: "Wall-mount and deck-mount brass mixers, sink cocks and swan-neck taps.",
      longDescription: "Lead-free brass and SS 304 kitchen taps in chrome, matte black, brushed nickel and gunmetal — wall-mount mixers, single-lever deck mixers and swan-neck sink cocks with ceramic cartridges. Bulk cartons available for builder and contractor orders." },
    { category: "Faucets & Fittings", title: "Pull-Out & Pull-Down Taps", description: "Spray-head taps with dual-mode flow for modern kitchens.",
      longDescription: "Pull-out and pull-down taps with dual-mode aerator and spray, 360° swivel and braided hoses. Compatible with single-hole sinks and quartz sinks. Spare spray heads and hoses stocked for after-sales service." },
    { category: "Faucets & Fittings", title: "Waste Couplings & Fittings", description: "Waste couplings, basket strainers, overflow kits and flexible waste pipes.",
      longDescription: "Everything to finish the plumbing under the sink: 3.5\" and 4\" waste couplings, basket strainers, overflow kits, flexible PVC waste pipes, angle valves and connection pipes — sold by the box at dealer rates." },
    { category: "Chimneys, Hobs & Appliances", title: "Kitchen Chimneys", description: "Wall-mount, island and filterless auto-clean chimneys in 60 and 90 cm.",
      longDescription: "Baffle-filter and filterless auto-clean chimneys from 1000 to 1500 m³/h suction, in 60 and 90 cm widths, wall-mount and island types. Supplied with ducting kits and brand warranty; installation support on request for project orders." },
    { category: "Chimneys, Hobs & Appliances", title: "Built-In Hobs & Cooktops", description: "Glass and stainless-steel hobs with 2 to 5 burners, auto-ignition.",
      longDescription: "Toughened-glass and SS built-in hobs with brass burners, flame-failure safety and auto-ignition, plus induction and gas-on-glass cooktops. Standard cut-out sizes to match modular kitchen counters." },
    { category: "Chimneys, Hobs & Appliances", title: "Water Purifiers", description: "RO, RO+UV and under-sink purifiers for homes and projects.",
      longDescription: "Wall-mount and under-sink RO, RO+UV+UF purifiers with TDS controllers, plus spare membranes and filter kits. Bulk pricing for builders handing over fitted kitchens and for retailers stocking counter models." },
    { category: "Modular Kitchen Hardware", title: "Baskets & Tandem Drawers", description: "SS cutlery, plate, bottle and thali baskets plus soft-close tandem boxes.",
      longDescription: "SS 304 wire baskets — cutlery, plate, cup-saucer, bottle pull-outs and thali baskets — in all standard carcass widths, plus soft-close tandem boxes and drawer systems. Packed in sets for kitchen makers to speed up assembly." },
    { category: "Modular Kitchen Hardware", title: "Corner Units & Tall Units", description: "Magic corners, carousel units, pantry pull-outs and wicker baskets.",
      longDescription: "Space-saving solutions for awkward corners and tall cabinets: magic corners, LeMans-style carousels, 3/4 and full-round carousels, pantry pull-outs and wicker baskets in multiple widths." },
    { category: "Modular Kitchen Hardware", title: "Hinges, Channels & Dish Racks", description: "Soft-close hinges, telescopic channels, lift-ups and wall-mount dish racks.",
      longDescription: "Clip-on soft-close hinges, full-extension telescopic channels, gas lifts and lift-up systems, handles and profile lights — plus SS wall-mount and in-cabinet dish racks. Sold by the box with assorted packs for fabricators." },
  ],
  gallery: [
    ...["Sink display wall", "Quartz sink range", "Faucet counter", "Chimney & hob display"].map((c) => ({ category: "Our Showroom", caption: c })),
    ...["Ready-stock racks", "Crating sinks for dispatch", "Hardware packing", "Loading for transport"].map((c) => ({ category: "Warehouse & Dispatch", caption: c })),
  ],
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "minimal", customHtml: "",
          badge: "SINKS · FAUCETS · CHIMNEYS · MODULAR HARDWARE", titleTop: "Everything a Kitchen Needs,", titleHighlight: "at Dealer Prices",
          subtitle: "", description: `${biz} supplies stainless-steel and quartz sinks, faucets, chimneys, hobs and modular kitchen hardware to kitchen makers, interior designers, builders and retailers — GST invoicing, MOQ-friendly slabs and pan-India dispatch.`, image: "",
          primaryBtn: { label: "Get Dealer Price", href: "/enquiry" }, secondaryBtn: { label: "Browse Products", href: "/products" },
          features: [ { icon: "package", title: "3,500+ SKUs in Stock", text: "" }, { icon: "tag", title: "Slab-Wise Dealer Rates", text: "" }, { icon: "clipboard", title: "GST Invoice", text: "" }, { icon: "truck", title: "Pan-India Dispatch", text: "" } ],
        } },
        brands,
        { type: "serviceCategories", content: { eyebrow: "WHAT WE SUPPLY", title: "One Source for the", titleHighlight: "Complete Kitchen", categories: CATEGORIES }, style: { layout: "tiles" } },
        { ...stats, style: { layout: "minimal" } },
        { type: "about", content: {
          eyebrow: "WHY BUY FROM US", title: "A Kitchen Specialist,", titleHighlight: "Not a General Trader",
          body: [
            `For over 16 years ${biz} has dealt only in kitchen products — so we know which sink fits a 600 mm carcass, which chimney suits an open kitchen and which hinge your fabricators prefer.`,
            "Kitchen makers and builders order the complete set from us — sink, tap, coupling, hob, chimney and hardware — and receive it in one consignment with one GST invoice.",
          ],
          image: "", points: ["Genuine brands with manufacturer warranty", "Complete kitchen sets in one dispatch", "Technical help on sizes & cut-outs", "Credit terms for registered dealers"],
          buttonLabel: "About Us", buttonHref: "/about",
        }, style: { layout: "split" } },
        { type: "features", content: { items: [
          { icon: "tag", title: "Dealer & Project Pricing", text: "Net rates by slab — the more kitchens you set up, the better the price." },
          { icon: "package", title: "Ready Stock, Same Batch", text: "Bulk quantities from one batch so finishes match across a whole project." },
          { icon: "shield", title: "Safe Transit Packing", text: "Sinks crated with corner guards; breakage in transit replaced free." },
          { icon: "headset", title: "After-Sales Support", text: "Warranty registration, spares and replacement handled by our desk." },
        ] }, style: { layout: "cards", background: "light", cardRadius: "lg", cardShadow: "md", cardBorderWidth: 0 } },
        { ...dealerRates, style: { background: "dark" } },
        { ...orderFlow, style: { layout: "default" } },
        { type: "quoteForm", content: { title: "Request Dealer / Bulk Pricing", subtitle: "Share products, models or a kitchen BOQ with quantities — we reply with net dealer rates, GST and freight within 2 working hours.", showSidebar: true }, style: { background: "light" } },
        { ...testimonials, style: { layout: "featured" } },
        catalogues,
        { type: "faq", content: { eyebrow: "FAQ", title: "Trade", titleHighlight: "Questions", items: faqItems, intro: "MOQ, GST, credit, dispatch and dealership — what kitchen professionals ask us most." } as SectionSeed<"faq">["content"], style: { layout: "split", background: "light" } },
        { ...cta, style: { layout: "split" } },
      ],
    },
    { slug: "products", title: "Products", isSystem: true, order: 1, sections: [
      { type: "banner", content: { title: "Kitchen", titleHighlight: "Products", subtitle: "Sinks, faucets, appliances and modular hardware — everything needed to set up a kitchen, in ready stock.", image: "", bgColor: "", imageOpacity: 35, overlayOpacity: 80 } },
      { type: "serviceCategories", content: { eyebrow: "BROWSE BY CATEGORY", title: "Our", titleHighlight: "Product Range", categories: CATEGORIES }, style: { layout: "tiles" } },
      { ...dealerRates, style: { background: "light" } },
      catalogues,
      { type: "gallery", content: { eyebrow: "SHOWROOM & WAREHOUSE", title: "See the", titleHighlight: "Range in Person" }, style: { layout: "grid" } },
      cta,
    ] },
    { slug: "brands", title: "Brands", isSystem: true, order: 2, sections: [
      { type: "banner", content: { title: "Brands We", titleHighlight: "Stock", subtitle: "Genuine products in sealed packing with full manufacturer warranty.", image: "", bgColor: "", imageOpacity: 35, overlayOpacity: 80 } },
      brands,
      { type: "richText", content: { html: "<h3>Why brand range matters to your business</h3><p>Customers walk in asking for specific brands and model numbers. Stocking a wide brand range lets your counter or kitchen studio say <strong>yes</strong> to every request — from value SS sinks for rental flats to premium quartz sinks and filterless chimneys for designer homes.</p><ul><li>Sinks: SS 304, handmade and quartz across value, mid and premium brands</li><li>Faucets &amp; fittings: brass and SS 304 with ceramic cartridges</li><li>Chimneys &amp; hobs: auto-clean, filterless and built-in models</li><li>Modular hardware: soft-close systems from leading European and Indian brands</li></ul><p>Need a brand that isn't listed? Ask us — we source on order for project quantities.</p>" } },
      { type: "features", content: { items: [
        { icon: "badge-check", title: "100% Genuine", text: "Sourced from brand companies and their authorised distributors only." },
        { icon: "shield", title: "Full Warranty", text: "Manufacturer warranty card with every product; we help with claims." },
        { icon: "tag", title: "Brand-Wise Price Lists", text: "Separate dealer price lists per brand, updated with every price revision." },
      ] }, style: { layout: "minimal" } },
      { type: "cta", content: { title: "Looking for a specific brand or model?", highlight: "Ask for Availability", phones: [PHONE], buttonLabel: "Send Enquiry", buttonHref: "/enquiry" }, style: { layout: "minimal" } },
    ] },
    { slug: "about", title: "About", isSystem: true, order: 3, sections: [
      { type: "about", content: { eyebrow: "ABOUT US", title: "Kitchen Products", titleHighlight: "Is All We Do", body: [
        `${biz} began as a single sink counter and has grown into a kitchen-products distributor supplying 1,800+ dealers, kitchen makers and builders across 22 states.`,
        "We stock deep in every category a kitchen needs, so our partners can quote confidently, deliver on time and keep their own customers happy.",
      ], image: "", points: ["20,000 sq ft warehouse", "Display showroom for clients", "In-house transit crating", "Dedicated trade desk"], buttonLabel: "", buttonHref: "" }, style: { layout: "reverse" } },
      { type: "visionMission", content: {
        eyebrow: "HOW WE WORK",
        visionTitle: "Our Vision", visionText: "To be India's most dependable one-stop source for everything that goes into a kitchen.",
        missionTitle: "Our Mission", missionText: "Genuine products, honest dealer pricing and dispatches that reach the site complete and undamaged.",
        valuesTitle: "What We Stand For",
        values: [
          { icon: "badge-check", title: "Genuine Only", text: "No grey-market or duplicate products — ever." },
          { icon: "package", title: "Complete Orders", text: "Every item on the BOQ, in one dispatch." },
          { icon: "handshake", title: "Partner First", text: "Your margins and reputation come first." },
        ],
      }, style: { background: "light" } },
      { ...stats, style: { layout: "cards" } },
      { ...testimonials, style: { layout: "minimal" } },
      cta,
    ] },
    { slug: "dealer", title: "Become a Dealer", isSystem: true, order: 4, sections: [
      { type: "banner", content: { title: "Become a", titleHighlight: "Dealer", subtitle: "Retailers, kitchen studios and sanitaryware counters — grow your kitchen business with our range.", image: "", bgColor: "", imageOpacity: 35, overlayOpacity: 80 } },
      { type: "pricingPlans", content: { eyebrow: "PARTNER PROGRAMMES", title: "Choose Your", titleHighlight: "Partnership", plans: [
        { name: "Retail Counter", price: "₹15,000", period: "min. order", features: ["Standard dealer price list", "Mix-and-match across brands", "GST invoice & e-way bill", "WhatsApp ordering"], featured: false, buttonLabel: "Apply", buttonHref: "/enquiry" },
        { name: "Authorised Dealer", price: "₹2 L", period: "per quarter", features: ["Extra 3–5% over dealer list", "30-day credit after 3 orders", "Display sinks at subsidised rates", "Catalogues & POS material"], featured: true, buttonLabel: "Become a Dealer", buttonHref: "/enquiry" },
        { name: "Kitchen Maker / Builder", price: "Project", period: "rate contract", features: ["Fixed rates for the project duration", "Same-batch supply in tranches", "Site delivery scheduling", "Dedicated account manager"], featured: false, buttonLabel: "Talk to Sales", buttonHref: "/contact" },
      ] }, style: { cardRadius: "lg" } },
      { type: "steps", content: { eyebrow: "ONBOARDING", title: "Start Selling in", titleHighlight: "3 Simple Steps", items: [
        { title: "Submit Details", text: "Share your GSTIN, shop/studio address and categories of interest.", icon: "edit" },
        { title: "Get Price List", text: "Receive brand-wise dealer price lists and scheme details within one working day.", icon: "tag" },
        { title: "Place First Order", text: "Order, get your display support and start selling.", icon: "store" },
      ] }, style: { layout: "cards", background: "light" } },
      { type: "quoteForm", content: { title: "Dealer Enquiry", subtitle: "Tell us your business name, city, GSTIN and the products you want to deal in — our trade desk will call you back.", showSidebar: true } },
    ] },
    { slug: "contact", title: "Contact", isSystem: true, order: 5, sections: [
      { type: "contactInfo", content: { eyebrow: "REACH US", title: "Visit Our", titleHighlight: "Showroom & Warehouse", address: "Your showroom & warehouse address", phone: PHONE, email: EMAIL, hours: "Mon–Sat: 9:30 AM – 7:30 PM · Sunday closed", mapEmbed: "" } },
      { type: "openingHours", content: { eyebrow: "TIMINGS", title: "Showroom &", titleHighlight: "Dispatch Hours", note: "Orders confirmed before 2 PM are delivered the same day within the city.", days: [
        { day: "Monday – Saturday", hours: "9:30 AM – 7:30 PM" },
        { day: "Sunday", hours: "Closed (WhatsApp orders open)" },
        { day: "Same-day dispatch cut-off", hours: "2:00 PM" },
        { day: "Transport booking (outstation)", hours: "Daily till 5:00 PM" },
      ] }, style: { background: "light" } },
      { type: "contactForm", content: { title: "Write to Our Trade Desk", subtitle: "Stock availability, brand price lists, credit or dispatch — we reply the same working day." } },
    ] },
    { slug: "enquiry", title: "Dealer Price Enquiry", isSystem: true, order: 6, showInNav: false, sections: [
      { type: "quoteForm", content: { title: "Get Dealer / Bulk Pricing", subtitle: "List products, sizes and quantities (or attach your BOQ details) — we send net rates with GST and freight within 2 working hours.", showSidebar: true } },
      orderFlow,
      { type: "faq", content: { eyebrow: "BEFORE YOU ORDER", title: "Good to", titleHighlight: "Know", items: faqItems.slice(0, 4) } },
    ] },
  ],
};
