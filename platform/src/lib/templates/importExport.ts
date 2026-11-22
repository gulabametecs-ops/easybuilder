import type { TemplateDef, SectionSeed } from "./types";

// Import & Export House (agri commodities, spices, textiles, engineering goods):
// cobalt blue + sea teal, clean global-trade look, conversion on the RFQ.
const PHONE = "9000000000";
const EMAIL = "hello@example.com";
const CATEGORIES = ["Agri Commodities", "Spices", "Textiles", "Engineering Goods"];

const markets: SectionSeed<"logos"> = {
  type: "logos",
  content: { title: "Shipping regularly to buyers in 38 countries", items: ["UAE", "Saudi Arabia", "United Kingdom", "Germany", "USA", "Vietnam", "Bangladesh", "Kenya", "Australia", "Malaysia"] },
};

const certs: SectionSeed<"features"> = {
  type: "features",
  content: { items: [
    { icon: "badge-check", title: "IEC & RCMC Registered", text: "Valid Importer-Exporter Code with APEDA, Spices Board and EEPC memberships." },
    { icon: "shield", title: "FSSAI & ISO 22000", text: "Food-safety certified sourcing, storage and packing for all edible exports." },
    { icon: "leaf", title: "Organic (NPOP) & GOTS", text: "Certified organic spices and GOTS-compliant cotton textiles on request." },
    { icon: "clipboard", title: "Phytosanitary & COO", text: "Certificates of origin, phytosanitary and fumigation certificates with every lot." },
    { icon: "check", title: "Third-Party Inspection", text: "Pre-shipment inspection by an accredited international agency of the buyer's choice." },
    { icon: "award", title: "Star Export House", text: "Government-recognised status for consistent export performance." },
  ] },
  style: { cardRadius: "lg", cardShadow: "sm", cardBorderWidth: 1 },
};

const flow: SectionSeed<"steps"> = {
  type: "steps",
  content: {
    eyebrow: "HOW AN ORDER MOVES", title: "From RFQ to", titleHighlight: "Your Port",
    items: [
      { title: "RFQ & Specification", text: "Share product, grade, quantity, packing and destination port. Quote within 24 hours.", icon: "edit" },
      { title: "Samples & Approval", text: "Courier samples with lab analysis (moisture, purity, GSM or dimensions) for sign-off.", icon: "package" },
      { title: "Contract & Payment Terms", text: "Proforma invoice on FOB, CIF or CFR terms with LC, CAD or advance TT.", icon: "handshake" },
      { title: "Sourcing & QC", text: "Lot procured from vetted farms and mills, cleaned, graded and inspected.", icon: "badge-check" },
      { title: "Shipment & Documents", text: "Container stuffing, customs clearance, BL and full document set dispatched.", icon: "truck" },
    ],
  },
  style: { background: "light" },
};

const fobRates: SectionSeed<"priceList"> = {
  type: "priceList",
  content: { eyebrow: "INDICATIVE PRICES", title: "This Week's", titleHighlight: "FOB Rates", note: "Indicative FOB Indian port, USD per MT. Prices change with crop and currency — send an RFQ for a firm offer.", groups: [
        { category: "Spices", items: [
          { name: "Turmeric Fingers (Salem, 3% curcumin)", price: "$1,850 / MT", note: "50 kg PP bags" },
          { name: "Cumin Seeds (Europe quality, 99%)", price: "$3,950 / MT", note: "25 kg bags" },
          { name: "Red Chilli Teja (stemless)", price: "$2,600 / MT", note: "10 kg cartons" },
        ] },
        { category: "Agri Commodities", items: [
          { name: "1121 Basmati Sella Rice", price: "$1,120 / MT", note: "5–40 kg bags" },
          { name: "Sesame Seeds (hulled, 99.95%)", price: "$1,780 / MT", note: "25 kg bags" },
          { name: "Nashik Red Onion (55 mm+)", price: "$420 / MT", note: "Reefer, 25 kg mesh" },
        ] },
      ] }, style: { background: "light" }
};

const incoterms: SectionSeed<"pricingPlans"> = {
  type: "pricingPlans",
  content: { eyebrow: "INCOTERMS", title: "Choose How", titleHighlight: "We Ship", plans: [
        { name: "FOB", price: "Port of loading", period: "", featured: false, buttonLabel: "Request FOB Quote", buttonHref: "/rfq", features: ["Goods loaded on your nominated vessel", "Export customs clearance", "All origin documents", "You arrange freight & insurance"] },
        { name: "CIF", price: "Port of discharge", period: "", featured: true, buttonLabel: "Request CIF Quote", buttonHref: "/rfq", features: ["Everything in FOB", "Ocean freight booked by us", "Marine insurance at 110% value", "Free-time negotiated with the line"] },
        { name: "DAP", price: "Your warehouse", period: "", featured: false, buttonLabel: "Request DAP Quote", buttonHref: "/rfq", features: ["Everything in CIF", "Destination port handling", "Inland delivery to your door", "Import duties paid by you"] },
      ] }, style: { cardRadius: "lg", cardShadow: "lg" }
};

const cta: SectionSeed<"cta"> = {
  type: "cta",
  content: { title: "Sourcing from India?", highlight: "Get a Quote in 24 Hours", phones: [PHONE], buttonLabel: "Send RFQ", buttonHref: "/rfq" },
};

export const importExport: TemplateDef = {
  theme: {
    colors: { primary: "#1d4ed8", primaryDark: "#1e3a8a", secondary: "#0b1b3a", accent: "#0d9488", dark: "#081430", light: "#eef3fd", text: "#3b4559", heading: "#0b1b3a" },
    font: "Red Hat Display", radius: "1.25rem",
  },
  header: (biz) => ({
    design: "minimal",
    logoText: biz, logoImage: "",
    announcement: { show: true, text: "New crop season: Turmeric, Cumin & Basmati export lots available — request today's FOB price", link: "/rfq" },
    topbar: { show: true, address: "Govt. Recognised Export House · IEC Registered", phones: [PHONE], email: EMAIL, social: { facebook: "#", instagram: "#", whatsapp: "#" } },
    nav: [
      { label: "Home", href: "/" }, { label: "Products", href: "/products" }, { label: "Sourcing", href: "/sourcing" }, { label: "Compliance", href: "/compliance" },
      { label: "Logistics", href: "/logistics" }, { label: "About", href: "/about" }, { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Send RFQ", href: "/rfq" },
  }),
  footer: (biz) => ({
    design: "modern",
    about: `${biz} is an Indian import-export house supplying agri commodities, spices, textiles and engineering goods to buyers worldwide — with certified quality, complete documentation and dependable shipping.`,
    columns: [
      { title: "Products", links: [ { label: "Agri Commodities", href: "/products" }, { label: "Spices", href: "/products" }, { label: "Textiles", href: "/products" }, { label: "Engineering Goods", href: "/products" } ] },
      { title: "Trade With Us", links: [ { label: "Sourcing & QC", href: "/sourcing" }, { label: "Certifications", href: "/compliance" }, { label: "Logistics & Incoterms", href: "/logistics" }, { label: "Request for Quote", href: "/rfq" }, { label: "Contact", href: "/contact" } ] },
    ],
    serviceAreas: ["Middle East", "Europe", "North America", "South-East Asia", "Africa", "Australia"],
    contact: { phones: [PHONE], email: EMAIL, address: "Your City, India" },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. Trusted trade from India to the world.`,
  }),
  seo: (biz) => ({
    title: `${biz} — Exporter of Spices, Agri Commodities, Textiles & Engineering Goods from India`,
    description: "Government-recognised export house supplying turmeric, cumin, basmati rice, cotton textiles and engineering goods worldwide. FOB/CIF pricing, certified quality, quote in 24 hours.",
    favicon: "", ogImage: "",
    keywords: "exporter from India, spices exporter, basmati rice exporter, agri commodity supplier, cotton textile exporter, engineering goods exporter, import export company",
    businessType: "Organization", priceRange: "₹₹₹",
  }),
  services: [
    { category: "Agri Commodities", title: "Basmati & Non-Basmati Rice", description: "1121 Sella, Pusa and Sona Masoori in 5–50 kg PP and jute bags." },
    { category: "Agri Commodities", title: "Pulses & Oilseeds", description: "Toor dal, chickpeas, sesame and groundnut kernels, machine-cleaned." },
    { category: "Agri Commodities", title: "Fresh Onions & Produce", description: "Nashik red onion, grapes and pomegranates in reefer containers." },
    { category: "Spices", title: "Turmeric Fingers & Powder", description: "Salem and Erode turmeric with 3–5% curcumin, steam-sterilised." },
    { category: "Spices", title: "Cumin, Coriander & Fennel", description: "Unjha-origin seed spices, 99% purity, Europe-grade cleaning." },
    { category: "Spices", title: "Red Chilli & Black Pepper", description: "Guntur Teja chilli and Malabar pepper, whole or crushed." },
    { category: "Textiles", title: "Cotton Yarn & Fabric", description: "Combed and carded yarn Ne 20s–60s, greige and dyed fabrics." },
    { category: "Textiles", title: "Home Textiles", description: "Bed linen, towels and kitchen textiles in private label." },
    { category: "Engineering Goods", title: "Castings & Forgings", description: "SG iron, steel castings and forged flanges to drawing." },
    { category: "Engineering Goods", title: "Pumps, Valves & Hardware", description: "Agricultural pumps, brass valves and builders' hardware." },
  ],
  gallery: [
    ...["Spice cleaning & grading unit", "Rice warehouse", "Lab testing of samples", "Private-label packing"].map((caption) => ({ category: "Sourcing & Quality", caption })),
    ...["Container stuffing", "Port loading", "Textile mill partner", "Engineering goods crate packing"].map((caption) => ({ category: "Logistics", caption })),
  ],
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "marquee", customHtml: "",
          badge: "STAR EXPORT HOUSE · IEC · APEDA · SPICES BOARD", titleTop: "India's Finest Goods,", titleHighlight: "Delivered to Your Port",
          subtitle: "", description: `${biz} sources, certifies and ships agri commodities, spices, textiles and engineering goods to importers in 38 countries — with transparent FOB/CIF pricing and complete export documentation.`, image: "",
          primaryBtn: { label: "Send an RFQ", href: "/rfq" }, secondaryBtn: { label: "Explore Products", href: "/products" },
          features: [ { icon: "plane", title: "38 Countries", text: "" }, { icon: "badge-check", title: "Certified Quality", text: "" }, { icon: "clock", title: "24-Hr Quotes", text: "" }, { icon: "truck", title: "FOB · CIF · CFR", text: "" } ],
        } },
        { type: "about", content: {
          eyebrow: "ABOUT US", title: "A Trading Partner,", titleHighlight: "Not Just a Supplier",
          body: [
            `Since 2009, ${biz} has helped importers, distributors and private-label brands source reliably from India.`,
            "We combine a network of 600+ farmers, processors and mills with in-house quality control and a logistics desk that knows every port from Mundra to Chennai.",
          ],
          image: "", points: ["Independent pre-shipment inspection", "LC, CAD and TT payment terms", "Consolidated mixed-product containers", "Real-time shipment tracking"],
          buttonLabel: "Our Story", buttonHref: "/about",
        }, style: { layout: "centered" } },
        markets,
        { type: "serviceCategories", content: { eyebrow: "WHAT WE EXPORT", title: "Four Product", titleHighlight: "Verticals", categories: CATEGORIES }, style: { cardRadius: "lg", cardShadow: "md" } },
        fobRates,
        { type: "features", content: { items: [
          { icon: "map", title: "Origin-Direct Sourcing", text: "We buy at the source — Unjha, Erode, Guntur, Tiruppur — for better price and traceability." },
          { icon: "badge-check", title: "Lab-Tested Every Lot", text: "Moisture, purity, pesticide residue and aflatoxin reports shared before shipment." },
          { icon: "package", title: "Private Label Ready", text: "Your brand on retail packs, jute bags or cartons — from 1 container." },
          { icon: "headset", title: "One Trade Manager", text: "A dedicated manager handles your quote, samples, documents and tracking." },
        ] }, style: { layout: "minimal" } },
        { type: "stats", content: { items: [
          { value: "1,400+", label: "Containers Shipped", icon: "truck" },
          { value: "38", label: "Countries Served", icon: "plane" },
          { value: "220+", label: "Active Importers", icon: "handshake" },
          { value: "0.3%", label: "Claim Rate", icon: "shield" },
        ] }, style: { layout: "cards", background: "primary" } },
        flow,
        incoterms,
        { ...certs, style: { layout: "numbered", background: "dark" } },
        { type: "testimonials", content: { eyebrow: "BUYER FEEDBACK", title: "Importers Who", titleHighlight: "Reorder", items: [
          { name: "Khalid Al Mansoori", role: "Spice Distributor, Dubai", text: "Twenty-two containers of cumin and turmeric and every lot matched the approved sample. Documents arrive before the vessel does.", rating: 5 },
          { name: "Sophie Wagner", role: "Organic Food Importer, Hamburg", text: "Residue reports met EU MRLs every time. Their organic certification paperwork is the cleanest we receive from any origin.", rating: 5 },
          { name: "Nguyen Van Thanh", role: "Textile Buyer, Ho Chi Minh City", text: "Consistent yarn count and quick replacement on one bale issue. Communication is fast and honest.", rating: 5 },
          { name: "James Okafor", role: "Hardware Importer, Lagos", text: "Mixed container of pumps and valves, well crated, with clear HS codes. Clearance at our end was smooth.", rating: 4 },
          { name: "Aarav Shah", role: "Machinery Importer, Ahmedabad", text: "They handled our import of packaging machinery end to end — LC, customs and GST — and it reached our plant a week ahead of schedule.", rating: 5 },
        ] }, style: { background: "light", cardRadius: "lg" } },
        { type: "downloads", content: { eyebrow: "BUYER RESOURCES", title: "Catalogues &", titleHighlight: "Specifications", items: [
          { title: "Product Catalogue", description: "All four verticals with grades, packing and MOQ.", link: "#", icon: "book-open" },
          { title: "Spice Specification Sheets", description: "Moisture, purity, ASTA colour and curcumin data.", link: "#", icon: "clipboard" },
          { title: "Company Profile & Certificates", description: "IEC, RCMC, FSSAI, ISO and organic certificates.", link: "#", icon: "award" },
          { title: "Crop Calendar", description: "Harvest months and best shipping windows for each commodity.", link: "#", icon: "calendar" },
        ] } },
        { type: "faq", content: { eyebrow: "FAQ", title: "Trading", titleHighlight: "Questions", items: [
          { q: "What is your minimum order quantity?", a: "Usually one 20 ft container (around 18–25 MT for commodities). Mixed containers combining several products are welcome." },
          { q: "Which Incoterms do you work on?", a: "FOB, CFR and CIF from Mundra, Nhava Sheva, Chennai and Kolkata. EXW and DAP can be arranged on request." },
          { q: "What payment terms do you accept?", a: "Irrevocable LC at sight, CAD through banks, or advance TT. Repeat buyers can discuss partial-advance terms." },
          { q: "Can I get samples before ordering?", a: "Yes. Samples are couriered within 3–5 days with a lab analysis sheet. Courier charges are adjusted against the first order." },
          { q: "Do you also handle imports into India?", a: "Yes — we import machinery, dry fruits and industrial raw materials on behalf of Indian buyers, including customs clearance and GST compliance." },
          { q: "How do you handle a quality claim?", a: "Share photos and an independent survey report within 15 days of arrival. We compare it with our retained sample and settle approved claims by credit note or replacement." },
        ] }, style: { background: "light" } },
        cta,
      ],
    },
    { slug: "products", title: "Products", isSystem: true, order: 1, sections: [
      { type: "banner", content: { title: "Our Export", titleHighlight: "Products", subtitle: "Agri commodities, spices, textiles and engineering goods — graded, certified and shipped.", image: "", bgColor: "", imageOpacity: 35, overlayOpacity: 75 } },
      { type: "serviceCategories", content: { eyebrow: "", title: "Browse by", titleHighlight: "Vertical", categories: CATEGORIES }, style: { cardRadius: "lg", cardShadow: "md" } },
      fobRates,
      markets,
      cta,
    ] },
    { slug: "sourcing", title: "Sourcing & QC", isSystem: true, order: 2, sections: [
      { type: "about", content: { eyebrow: "SOURCING", title: "Straight From", titleHighlight: "India's Best Origins", body: [
        "Every product comes from the region known for it — seed spices from Unjha, turmeric from Erode and Salem, chilli from Guntur, cotton textiles from Tiruppur and castings from Rajkot and Kolhapur.",
        "Our field team audits each supplier for quality, capacity and compliance before a single lot is bought.",
      ], image: "", points: ["600+ audited farmers, processors & mills", "Machine cleaning, sortex & steam sterilisation", "Retained samples for every shipment", "Full lot traceability to farm or factory"], buttonLabel: "Send RFQ", buttonHref: "/rfq" } },
      { type: "features", content: { items: [
        { icon: "droplet", title: "Moisture & Purity", text: "Every agri lot tested against your contracted spec." },
        { icon: "shield", title: "Residue & Aflatoxin", text: "NABL lab reports for EU, US and Japan MRL compliance." },
        { icon: "grid", title: "Textile Testing", text: "Count, GSM, shrinkage and colour-fastness checks." },
        { icon: "wrench", title: "Dimensional Inspection", text: "Engineering goods checked against drawing tolerances." },
      ] }, style: { background: "dark", cardRadius: "lg" } },
      { ...flow, style: { layout: "timeline" } },
      { type: "gallery", content: { eyebrow: "BEHIND THE SHIPMENT", title: "Sourcing &", titleHighlight: "Quality in Action" }, style: { layout: "masonry" } },
      cta,
    ] },
    { slug: "compliance", title: "Compliance & Certifications", isSystem: true, order: 3, sections: [
      certs,
      { type: "downloads", content: { eyebrow: "DOCUMENTS", title: "Certificates on", titleHighlight: "Request", items: [
        { title: "IEC & GST Registration", description: "Importer-Exporter Code and GSTIN certificate.", link: "#", icon: "clipboard" },
        { title: "APEDA / Spices Board RCMC", description: "Registration-cum-membership certificates.", link: "#", icon: "badge-check" },
        { title: "FSSAI & ISO 22000", description: "Food safety licence and management system certificate.", link: "#", icon: "shield" },
        { title: "Organic NPOP Certificate", description: "Scope certificate for organic spices and pulses.", link: "#", icon: "leaf" },
      ] } },
      { type: "faq", content: { eyebrow: "COMPLIANCE FAQ", title: "Documents", titleHighlight: "We Provide", items: [
        { q: "Which documents come with each shipment?", a: "Commercial invoice, packing list, bill of lading, certificate of origin, phytosanitary and fumigation certificates, and lab analysis — plus any buyer-specific documents." },
        { q: "Can you provide preferential COO for FTA benefits?", a: "Yes — we issue preferential certificates of origin under India's FTAs (UAE CEPA, ASEAN, SAFTA and others) to reduce your import duty." },
        { q: "Do you support halal or kosher certification?", a: "Halal-certified packing is available for Middle East buyers, and kosher supervision can be arranged for specific lots." },
      ] }, style: { background: "light" } },
      cta,
    ] },
    { slug: "logistics", title: "Logistics", isSystem: true, order: 4, sections: [
      { type: "banner", content: { title: "Shipping Made", titleHighlight: "Predictable", subtitle: "Container booking, customs, insurance and tracking — handled end to end.", image: "", bgColor: "", imageOpacity: 35, overlayOpacity: 75 } },
      flow,
      incoterms,
      { type: "stats", content: { items: [
        { value: "5", label: "Indian Ports Served", icon: "map-pin" },
        { value: "21 days", label: "Avg. Transit to Europe", icon: "clock" },
        { value: "100%", label: "Shipments Insured", icon: "shield" },
        { value: "24×7", label: "Tracking Support", icon: "headset" },
      ] }, style: { background: "dark", layout: "minimal" } },
      { type: "faq", content: { eyebrow: "SHIPPING FAQ", title: "Containers &", titleHighlight: "Transit", intro: "How we book, load, insure and track your container from Indian port to yours.", items: [
        { q: "Which container sizes do you load?", a: "20 ft and 40 ft dry containers for most goods, 40 ft high-cube for textiles, and reefers for fresh onions, grapes and pomegranates." },
        { q: "Can I nominate my own forwarder?", a: "Yes. On FOB terms your forwarder books the vessel and we deliver to the CFS with all export documents." },
        { q: "How do I track my shipment?", a: "You receive the container number, BL draft and vessel details on loading, plus weekly ETA updates from our logistics desk." },
      ] } as SectionSeed<"faq">["content"], style: { layout: "split" } },
      cta,
    ] },
    { slug: "about", title: "About Us", isSystem: true, order: 5, sections: [
      { type: "about", content: { eyebrow: "OUR STORY", title: "Fifteen Years of", titleHighlight: "Global Trade", body: [
        `${biz} began as a two-person spice trading desk and is today a government-recognised export house with offices at two ports and a team of 40.`,
        "We believe trade runs on trust — so we put every spec in writing, share every lab report and pick up the phone when something goes wrong.",
      ], image: "", points: ["Government-recognised Star Export House", "Offices near Mundra & Chennai ports", "Multilingual trade desk (English, Arabic, French)", "Member of FIEO and regional chambers"], buttonLabel: "", buttonHref: "" } },
      { type: "visionMission", content: {
        eyebrow: "WHAT DRIVES US",
        visionTitle: "Our Vision", visionText: "To be the most trusted gateway for global buyers sourcing from India.",
        missionTitle: "Our Mission", missionText: "Deliver certified, consistent quality with complete transparency — on price, on documents and on delivery dates.",
        valuesTitle: "Our Values",
        values: [
          { icon: "handshake", title: "Integrity", text: "The sample you approve is the lot you receive." },
          { icon: "leaf", title: "Responsible Sourcing", text: "Fair prices for farmers and audited suppliers." },
          { icon: "clock", title: "Reliability", text: "Shipment dates we commit to, we keep." },
        ],
      } },
      { type: "team", content: { eyebrow: "TRADE DESK", title: "Meet Your", titleHighlight: "Trade Team", members: [
        { name: "Rajesh Agarwal", role: "Founder & Director", image: "", note: "25 years in commodity trading" },
        { name: "Priya Nair", role: "Head — Export Operations", image: "", note: "Documentation & compliance expert" },
        { name: "Faisal Qureshi", role: "Middle East Sales", image: "", note: "Arabic & English" },
        { name: "Ananya Iyer", role: "Quality Control Manager", image: "", note: "M.Sc Food Technology" },
      ] }, style: { cardRadius: "lg" } },
      cta,
    ] },
    { slug: "rfq", title: "Request for Quote", isSystem: true, order: 6, sections: [
      { type: "quoteForm", content: { title: "Request for Quotation (RFQ)", subtitle: "Tell us the product, grade, quantity, packing, destination port and Incoterm — you'll receive a firm offer within 24 hours.", showSidebar: true } },
      { type: "features", content: { items: [
        { icon: "clock", title: "24-Hour Response", text: "Firm offer with validity and shipment window." },
        { icon: "package", title: "Free Samples", text: "Courier charges adjusted on first order." },
        { icon: "shield", title: "NDA on Request", text: "Your private-label and pricing details stay confidential." },
      ] }, style: { background: "light", align: "center" } },
      flow,
    ] },
    { slug: "contact", title: "Contact", isSystem: true, order: 7, sections: [
      { type: "contactInfo", content: { eyebrow: "GET IN TOUCH", title: "Talk to Our", titleHighlight: "Trade Desk", address: "Your City, India", phone: PHONE, email: EMAIL, hours: "Mon–Sat: 9 AM – 7 PM IST · WhatsApp replies across time zones", mapEmbed: "" } },
      { type: "map", content: { eyebrow: "HEAD OFFICE", title: "Find", titleHighlight: "Us", address: "Your City, India", mapEmbed: "" } },
      { type: "contactForm", content: { title: "Write to Us", subtitle: "Buyer, supplier or logistics partner — we respond within one business day." } },
    ] },
  ],
};
