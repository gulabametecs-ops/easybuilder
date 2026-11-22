import type { TemplateDef, SectionSeed, PropertySeed } from "./types";

// Builder / developer selling flats in its own projects (ongoing, upcoming, completed):
// charcoal + copper luxury, Raleway, square corners, custom HTML hero, centered header, gradient footer.
const PHONE = "9000000000";
const EMAIL = "sales@example.com";
const CITY = "Thane";
const CATEGORIES = ["Residences", "Buying Made Easy", "After-Sales & Possession", "Investors & NRIs"];

const heroHtml = (biz: string) => `
<div style="background:linear-gradient(160deg,var(--c-dark) 0%,#1d1b19 55%,color-mix(in srgb,var(--c-primary) 30%,#141312) 100%);color:#fff;position:relative;overflow:hidden">
  <div style="position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px);background-size:64px 64px"></div>
  <div style="position:absolute;right:-10rem;top:-12rem;width:30rem;height:30rem;border-radius:9999px;background:var(--c-primary);opacity:.22;filter:blur(110px)"></div>
  <div style="position:relative;max-width:80rem;margin:0 auto;padding:clamp(4.5rem,10vw,8rem) 1.25rem clamp(3.5rem,7vw,5.5rem)">
    <p style="letter-spacing:.32em;font-size:.72rem;font-weight:600;color:var(--c-primary);margin:0 0 1.5rem">${biz.toUpperCase()} · CRAFTING ${CITY.toUpperCase()}'S SKYLINE SINCE 1998</p>
    <h1 style="font-size:clamp(2.6rem,6.6vw,5.6rem);line-height:1.02;font-weight:300;margin:0 0 1.5rem;letter-spacing:-.02em;max-width:60rem">Homes built to<br/><strong style="font-weight:800;color:var(--c-primary)">outlast generations.</strong></h1>
    <p style="font-size:clamp(1.05rem,1.5vw,1.2rem);line-height:1.75;max-width:40rem;opacity:.8;margin:0 0 2.5rem">MahaRERA-registered 2, 3 &amp; 4 BHK residences on Ghodbunder Road — with 27 years of on-time possessions, transparent payment plans and pre-approved home loans.</p>
    <div style="display:flex;flex-wrap:wrap;gap:1rem;margin:0 0 3.5rem">
      <a href="/projects" style="background:var(--c-primary);color:#141312;padding:1.05rem 2rem;border-radius:var(--site-radius);font-weight:700;text-decoration:none;letter-spacing:.04em">EXPLORE PROJECTS →</a>
      <a href="/site-visit" style="border:1px solid rgba(255,255,255,.4);color:#fff;padding:1.05rem 2rem;border-radius:var(--site-radius);font-weight:600;text-decoration:none;letter-spacing:.04em">BOOK A SITE VISIT</a>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(12rem,1fr));border-top:1px solid rgba(255,255,255,.15)">
      <div style="padding:1.5rem 1.5rem 0 0"><p style="font-size:.7rem;letter-spacing:.2em;opacity:.6;margin:0">NOW SELLING</p><p style="font-size:1.35rem;font-weight:700;margin:.4rem 0 0">Skyline Vista</p><p style="font-size:.9rem;opacity:.7;margin:.2rem 0 0">2 &amp; 3 BHK · from ₹1.12 Cr</p></div>
      <div style="padding:1.5rem 1.5rem 0 0"><p style="font-size:.7rem;letter-spacing:.2em;opacity:.6;margin:0">PRE-LAUNCH</p><p style="font-size:1.35rem;font-weight:700;margin:.4rem 0 0">Skyline Aurum</p><p style="font-size:.9rem;opacity:.7;margin:.2rem 0 0">2 &amp; 4 BHK sky residences</p></div>
      <div style="padding:1.5rem 1.5rem 0 0"><p style="font-size:.7rem;letter-spacing:.2em;opacity:.6;margin:0">READY TO MOVE</p><p style="font-size:1.35rem;font-weight:700;margin:.4rem 0 0">Skyline Heights</p><p style="font-size:.9rem;opacity:.7;margin:.2rem 0 0">OC received · last few homes</p></div>
    </div>
  </div>
</div>`;

const stats: SectionSeed<"stats"> = {
  type: "stats",
  content: { items: [
    { value: "27 Yrs", label: "Of Building", icon: "award" },
    { value: "14", label: "Projects Delivered", icon: "building" },
    { value: "4,800+", label: "Families Handed Keys", icon: "key" },
    { value: "38 Lakh sq ft", label: "Delivered On Time", icon: "layers" },
  ] },
  style: { layout: "minimal", background: "dark" },
};

const paymentPlans: SectionSeed<"pricingPlans"> = {
  type: "pricingPlans",
  content: {
    eyebrow: "PAYMENT PLANS", title: "Pay the Way That", titleHighlight: "Suits You",
    plans: [
      { name: "Construction-Linked", price: "10%", period: "on booking", featured: false, buttonLabel: "Get Cost Sheet", buttonHref: "/site-visit", features: [
        "Balance paid slab-by-slab as construction progresses", "Bank disburses directly against stage certificates", "Most popular with home-loan buyers", "Stage photos & architect certificate each time",
      ] },
      { name: "20 : 80 Subvention", price: "20%", period: "now, 80% on possession", featured: true, buttonLabel: "Check Eligibility", buttonHref: "/site-visit", features: [
        "Pay 20% now, rest on possession", "Pre-EMI interest borne by us till possession", "Tie-up with partner banks only", "Limited inventory — Skyline Aurum launch",
      ] },
      { name: "Down-Payment", price: "Save 4%", period: "on agreement value", featured: false, buttonLabel: "Get Cost Sheet", buttonHref: "/site-visit", features: [
        "95% within 60 days of booking", "Flat 4% discount on agreement value", "Ideal for investors & NRIs", "Priority choice of floor & view",
      ] },
    ],
  },
  style: { background: "light", cardRadius: "none", cardShadow: "lg" },
};

const testimonials: SectionSeed<"testimonials"> = {
  type: "testimonials",
  content: { eyebrow: "HOMEOWNERS", title: "Keys Handed,", titleHighlight: "Promises Kept", items: [
    { name: "Prakash & Anjali Rao", role: "3 BHK, Skyline Heights", text: "We booked in 2021 and got possession two months before the RERA date. The finish quality — tiles, windows, fittings — matched the sample flat exactly.", rating: 5 },
    { name: "Vivek Shetty", role: "NRI buyer, Singapore", text: "Monthly construction videos and a dedicated relationship manager made it easy to buy from abroad. Registration was done through PoA without a single delay.", rating: 5 },
    { name: "Farah Khan", role: "2 BHK, Skyline Vista (booked)", text: "The 20:80 plan meant no EMI on top of our rent. The sales team gave a full cost sheet with stamp duty and GST upfront — no surprises.", rating: 5 },
  ] },
  style: { layout: "dark" },
};

const updates: SectionSeed<"noticeBoard"> = {
  type: "noticeBoard",
  content: {
    eyebrow: "LIVE FROM SITE", title: "Construction", titleHighlight: "Updates",
    notices: [
      { date: "10 Nov 2026", title: "Skyline Vista Tower A — 18th floor slab cast, on schedule for Dec 2027 possession", category: "Tower A", link: "", isNew: true },
      { date: "28 Oct 2026", title: "Skyline Vista Tower B — 11th floor slab completed, blockwork up to 6th floor", category: "Tower B", link: "", isNew: true },
      { date: "15 Oct 2026", title: "Skyline Aurum — MahaRERA registration received, pre-launch EOIs open", category: "Launch", link: "/projects", isNew: false },
      { date: "02 Sep 2026", title: "Skyline Heights — Occupancy Certificate received, possessions in progress", category: "Possession", link: "", isNew: false },
    ],
  },
};

const faq: SectionSeed<"faq"> = {
  type: "faq",
  content: { eyebrow: "BUYER FAQ", title: "Buying From", titleHighlight: "Us", items: [
    { q: "Are your projects RERA registered?", a: "Yes. Every project and phase is registered with MahaRERA. The registration number is shown on each project page, brochure and advertisement, and quarterly progress is uploaded on the MahaRERA portal." },
    { q: "Which banks have approved your projects?", a: "SBI, HDFC Bank, ICICI Bank, Axis Bank, Kotak and LIC Housing Finance have pre-approved our ongoing projects, so loan sanction is faster." },
    { q: "What does the 'all-inclusive' price include?", a: "Our cost sheet shows agreement value, GST (5% for under-construction), stamp duty, registration, maintenance deposit and parking separately — nothing is added later." },
    { q: "When will I get possession?", a: "Each project page shows the RERA possession date. Our last 6 projects were handed over on or before that date." },
    { q: "Can I customise my flat?", a: "Minor changes (flooring, kitchen platform, bathroom fittings) are possible before the finishing stage of your floor, at transparent extra cost." },
    { q: "Do you help with resale or rental after possession?", a: "Yes. Our after-sales desk helps with society formation, interiors partners, and connects owners with tenants or buyers." },
  ] },
};

const cta: SectionSeed<"cta"> = {
  type: "cta",
  content: { title: "See the sample flat in person.", highlight: "Free pick-up & drop for site visits", phones: [PHONE], buttonLabel: "Book a Site Visit", buttonHref: "/site-visit" },
};

const properties = (): PropertySeed[] => [
  {
    title: "2 BHK — Tower A, Skyline Vista", purpose: "project", propertyType: "apartment",
    price: 11200000, priceNote: "onwards", bhk: "2 BHK", areaSqft: 745, bathrooms: 2, floor: "5th–27th", facing: "East / West",
    parking: "1 covered (optional)", possession: "December 2027", rera: "P51700034567",
    locality: "Ghodbunder Road", city: CITY, address: "Skyline Vista, Off Ghodbunder Road, near Kasarvadavali, Thane West",
    summary: "Smart 2 BHK residences with deck, in a 3-acre gated project with 40+ amenities.",
    description: "Skyline Vista is a 3-tower, 32-storey gated community on Ghodbunder Road, minutes from the upcoming Metro Line 4 station. Every 2 BHK has a deck, vitrified flooring, modular kitchen platform and uPVC sliding windows.",
    highlights: ["Metro Line 4 within 800 m", "Podium garden & 40+ amenities", "20:80 plan available"],
    amenities: ["parking", "lift", "power-backup", "security", "cctv", "gym", "pool", "clubhouse", "garden", "play-area", "gas"],
    floorPlans: [ { label: "2 BHK Type A", area: "745 sq ft carpet" }, { label: "2 BHK Type B with deck", area: "790 sq ft carpet" } ],
    status: "available", featured: true,
  },
  {
    title: "3 BHK — Tower B, Skyline Vista", purpose: "project", propertyType: "apartment",
    price: 16800000, priceNote: "onwards", bhk: "3 BHK", areaSqft: 1080, bathrooms: 3, floor: "6th–30th", facing: "East",
    parking: "1 covered", possession: "June 2028", rera: "P51700034568",
    locality: "Ghodbunder Road", city: CITY,
    summary: "Corner 3 BHK homes with Yeoor hills view and two decks.",
    description: "Tower B offers four corner homes per floor with cross-ventilation and views of the Yeoor hills. Master bedroom with walk-in wardrobe space and a separate utility area.",
    highlights: ["Only 4 homes per floor", "Yeoor hills view", "Two decks"],
    amenities: ["parking", "lift", "power-backup", "security", "cctv", "gym", "pool", "clubhouse", "garden", "play-area", "gas"],
    floorPlans: [ { label: "3 BHK Corner", area: "1,080 sq ft carpet" }, { label: "3 BHK Grand", area: "1,165 sq ft carpet" } ],
    status: "available", featured: true,
  },
  {
    title: "4 BHK Sky Residences — Skyline Aurum", purpose: "project", propertyType: "apartment",
    price: 32000000, priceNote: "onwards", bhk: "4 BHK", areaSqft: 1850, bathrooms: 4, floor: "25th–40th", facing: "Lake-facing",
    parking: "2 covered", possession: "June 2030", rera: "P51700045678",
    locality: "Majiwada", city: CITY,
    summary: "Pre-launch: limited lake-facing 4 BHK sky residences with private lift lobby.",
    description: "Skyline Aurum is our flagship 40-storey tower near Majiwada junction. Only two residences per floor, private lift lobby, double-height living in select homes, and a rooftop infinity pool. EOI open now with pre-launch pricing.",
    highlights: ["2 homes per floor", "Private lift lobby", "Rooftop infinity pool", "Pre-launch price"],
    amenities: ["parking", "lift", "power-backup", "security", "cctv", "gym", "pool", "clubhouse", "garden", "ac", "gas"],
    floorPlans: [ { label: "4 BHK Sky Residence", area: "1,850 sq ft carpet" }, { label: "4 BHK Duplex", area: "2,400 sq ft carpet" } ],
    status: "available", featured: true,
  },
  {
    title: "2 BHK — Skyline Aurum", purpose: "project", propertyType: "apartment",
    price: 12500000, priceNote: "onwards", bhk: "2 BHK", areaSqft: 780, bathrooms: 2, floor: "4th–24th",
    parking: "1 covered", possession: "June 2030", rera: "P51700045678",
    locality: "Majiwada", city: CITY,
    summary: "Premium 2 BHK homes in the Aurum tower with access to all sky amenities.",
    description: "Efficient 2 BHK layouts with a large living-dining, deck and premium specifications — engineered wood in the master bedroom and branded CP fittings.",
    amenities: ["parking", "lift", "power-backup", "security", "cctv", "gym", "pool", "clubhouse", "gas"],
    floorPlans: [ { label: "2 BHK Premium", area: "780 sq ft carpet" } ],
    status: "available",
  },
  {
    title: "Ready 3 BHK — Skyline Heights, Kolshet Road", purpose: "sale", propertyType: "apartment",
    price: 15500000, priceNote: "all-inclusive", bhk: "3 BHK", areaSqft: 1010, furnishing: "Unfurnished", bathrooms: 3, floor: "14th of 22", facing: "North",
    parking: "1 covered", possession: "Ready to move — OC received", rera: "P51700012345",
    locality: "Kolshet Road", city: CITY,
    summary: "Move in this month — OC-received 3 BHK with no GST, last few homes left.",
    description: "Skyline Heights was completed in 2026 with an Occupancy Certificate. No GST on ready homes, society already formed, and 120+ families living here.",
    highlights: ["OC received — no GST", "Society formed", "Move in immediately"],
    amenities: ["parking", "lift", "power-backup", "security", "cctv", "gym", "clubhouse", "garden", "play-area", "gas"],
    floorPlans: [ { label: "3 BHK", area: "1,010 sq ft carpet" } ],
    status: "available", featured: true,
  },
  {
    title: "2 BHK — Skyline Heights (Sold Out)", purpose: "sale", propertyType: "apartment",
    price: 10500000, priceNote: "all-inclusive", bhk: "2 BHK", areaSqft: 720, bathrooms: 2,
    possession: "Ready to move — OC received", rera: "P51700012345",
    locality: "Kolshet Road", city: CITY,
    summary: "All 2 BHK homes at Skyline Heights are sold — see Skyline Vista for similar homes.",
    description: "Every 2 BHK in Skyline Heights has been sold and handed over. Explore Skyline Vista on Ghodbunder Road for 2 BHKs starting at ₹1.12 Cr.",
    amenities: ["parking", "lift", "security", "gym", "garden"],
    floorPlans: [ { label: "2 BHK", area: "720 sq ft carpet" } ],
    status: "sold",
  },
];

export const builderDeveloper: TemplateDef = {
  theme: {
    colors: { primary: "#c07a45", primaryDark: "#9c5f31", secondary: "#2a2724", accent: "#e0b07a", dark: "#141312", light: "#f5f1ec", text: "#47423d", heading: "#1c1a18" },
    font: "Raleway", radius: "0rem",
  },
  header: (biz) => ({
    design: "centered",
    logoText: biz, logoImage: "",
    announcement: { show: true, text: "Skyline Aurum pre-launch — EOIs open · 20:80 payment plan on select homes", link: "/projects" },
    topbar: { show: true, address: `Ghodbunder Road, ${CITY} · All projects MahaRERA registered`, phones: [PHONE], email: EMAIL, social: { facebook: "#", instagram: "#", whatsapp: "#" } },
    nav: [
      { label: "Home", href: "/" },
      { label: "Projects", href: "/projects" },
      { label: "Construction Updates", href: "/updates" },
      { label: "Payment Plans", href: "/payment-plans" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Site Visit", href: "/site-visit" },
  }),
  footer: (biz) => ({
    design: "gradient",
    about: `${biz} has delivered 14 residential projects and 4,800+ homes in ${CITY} since 1998 — MahaRERA-registered, bank-approved and handed over on time.`,
    columns: [
      { title: "Projects", links: [ { label: "Skyline Vista (Ongoing)", href: "/projects" }, { label: "Skyline Aurum (Upcoming)", href: "/projects" }, { label: "Skyline Heights (Ready)", href: "/projects" }, { label: "Construction Updates", href: "/updates" } ] },
      { title: "Buyers", links: [ { label: "Payment Plans", href: "/payment-plans" }, { label: "Book a Site Visit", href: "/site-visit" }, { label: "About Us", href: "/about" }, { label: "Contact", href: "/contact" } ] },
    ],
    serviceAreas: ["Ghodbunder Road", "Majiwada", "Kolshet Road", "Kasarvadavali", "Thane West"],
    contact: { phones: [PHONE], email: EMAIL, address: `Sales Gallery, Ghodbunder Road, ${CITY}` },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. Project details are indicative; refer to MahaRERA registration and the agreement for sale.`,
  }),
  seo: (biz) => ({
    title: `${biz} — New Flats & Projects in ${CITY} | 2, 3 & 4 BHK`,
    description: `MahaRERA-registered 2, 3 & 4 BHK flats in ${CITY} by ${biz}. Ongoing, upcoming and ready-to-move projects, floor plans, payment plans and site visits.`,
    favicon: "", ogImage: "",
    keywords: `new projects ${CITY}, 2 bhk ${CITY}, 3 bhk ghodbunder road, builder ${CITY}, ready to move flats ${CITY}, rera registered projects`,
    businessType: "HomeAndConstructionBusiness", priceRange: "₹₹₹₹",
  }),
  services: [
    { category: "Residences", title: "2 BHK Homes", description: "Efficient 2 BHK layouts with decks in gated, amenity-rich towers." },
    { category: "Residences", title: "3 BHK Corner Homes", description: "Cross-ventilated corner homes with hill and lake views." },
    { category: "Residences", title: "4 BHK Sky Residences", description: "Two homes per floor, private lift lobby and premium specifications." },
    { category: "Buying Made Easy", title: "Flexible Payment Plans", description: "Construction-linked, 20:80 subvention and down-payment discount options." },
    { category: "Buying Made Easy", title: "Home Loan Partners", description: "Pre-approved by SBI, HDFC, ICICI, Axis, Kotak and LIC HFL for quick sanction." },
    { category: "Buying Made Easy", title: "Transparent Cost Sheet", description: "Agreement value, GST, stamp duty and charges itemised before booking." },
    { category: "After-Sales & Possession", title: "Construction Updates", description: "Monthly photo and video updates, plus quarterly MahaRERA progress." },
    { category: "After-Sales & Possession", title: "Possession & Handover", description: "Snag-list inspection, documentation and society formation support." },
    { category: "After-Sales & Possession", title: "5-Year Defect Liability", description: "Structural and workmanship defects fixed free as per RERA." },
    { category: "Investors & NRIs", title: "NRI Desk", description: "Video walkthroughs, PoA-based registration and NRE/NRO payment guidance." },
    { category: "Investors & NRIs", title: "Pre-Launch Access", description: "Priority allotment and launch pricing for registered investors." },
    { category: "Investors & NRIs", title: "Leasing Assistance", description: "Help finding tenants after possession through our partner network." },
  ],
  gallery: [
    ...["Skyline Vista — Tower A elevation", "Podium garden", "Clubhouse & pool"].map((caption) => ({ category: "Skyline Vista", caption })),
    ...["Sample flat living room", "Sample flat master bedroom", "Kitchen specifications"].map((caption) => ({ category: "Sample Flat", caption })),
    ...["Tower A — 18th slab", "Tower B — blockwork"].map((caption) => ({ category: "Construction Progress", caption })),
  ],
  properties,
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "custom", customHtml: heroHtml(biz),
          badge: "MAHARERA REGISTERED · SINCE 1998", titleTop: "Homes built to", titleHighlight: "outlast generations",
          subtitle: "", description: `MahaRERA-registered 2, 3 & 4 BHK residences in ${CITY} with on-time possession and transparent payment plans.`, image: "",
          primaryBtn: { label: "Explore Projects", href: "/projects" }, secondaryBtn: { label: "Book a Site Visit", href: "/site-visit" },
          features: [ { icon: "shield", title: "RERA Registered", text: "" }, { icon: "clock", title: "On-Time Possession", text: "" }, { icon: "key", title: "Ready Homes", text: "" } ],
        } },
        stats,
        { type: "propertyList", content: {
          eyebrow: "OUR PROJECTS", title: "Residences", titleHighlight: "Now Selling",
          subtitle: "Configurations, carpet areas, RERA numbers and possession dates — all in one place.",
          purpose: "all", featuredOnly: true, showFilters: false, limit: 6, emptyText: "New launches will be announced here soon.",
        } },
        { type: "about", content: {
          eyebrow: "THE " + biz.toUpperCase() + " PROMISE", title: "We Don't Sell Brochures.", titleHighlight: "We Hand Over Homes.",
          body: [
            `Since 1998, ${biz} has built 14 projects in ${CITY} — every one of them delivered with Occupancy Certificate, and the last six on or before the RERA date.`,
            "We build with our own engineering team, use branded materials you can verify, and show you the exact specification in a sample flat before you book.",
          ],
          image: "", points: ["14 projects, all with OC", "In-house design & engineering", "Sample flat = actual specification", "Pre-approved by 6 major lenders"],
          buttonLabel: "Our Legacy", buttonHref: "/about",
        }, style: { layout: "reverse" } },
        { type: "serviceCategories", content: { eyebrow: "BUYING WITH US", title: "Everything From Booking", titleHighlight: "to Possession", categories: CATEGORIES }, style: { background: "dark", cardRadius: "none" } },
        { type: "features", content: { items: [
          { icon: "layers", title: "Earthquake-Resistant RCC", text: "Zone-III compliant design with Mivan / aluminium formwork for precise walls." },
          { icon: "compass", title: "Vastu-Friendly Layouts", text: "Most homes east or north facing with zero dead space." },
          { icon: "droplet", title: "Rainwater & STP", text: "Rainwater harvesting, sewage treatment and solar common lighting." },
          { icon: "building", title: "Grand Clubhouse", text: "Pool, gym, banquet, co-working lounge and indoor games." },
        ] }, style: { layout: "numbered" } },
        updates,
        paymentPlans,
        testimonials,
        { type: "logos", content: { title: "Projects pre-approved by", items: ["SBI", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Mahindra Bank", "LIC Housing Finance"] } },
        faq,
        { type: "countdown", content: { eyebrow: "SKYLINE AURUM", title: "Pre-Launch Pricing", titleHighlight: "Ends Soon", subtitle: "Register your EOI to lock launch pricing and priority floor choice.", targetDate: "2027-01-31T23:59:00", buttonLabel: "Register EOI", buttonHref: "/site-visit" }, style: { background: "light" } },
        cta,
      ],
    },
    { slug: "projects", title: "Projects", isSystem: true, order: 1, sections: [
      { type: "banner", content: { title: "Our", titleHighlight: "Projects", subtitle: "Ongoing, upcoming and ready-to-move residences across Thane.", image: "", bgColor: "#141312", imageOpacity: 40, overlayOpacity: 75 } },
      { type: "propertyList", content: {
        eyebrow: "ALL CONFIGURATIONS", title: "Find Your", titleHighlight: "Residence",
        subtitle: "Filter by new launch or ready-to-move, BHK and budget. Every listing shows its MahaRERA number.",
        purpose: "all", featuredOnly: false, showFilters: true, limit: 24, emptyText: "No homes match these filters — our sales team can share upcoming inventory.",
      } },
      { type: "priceList", content: { eyebrow: "PROJECT STATUS", title: "At a", titleHighlight: "Glance", note: "Possession dates as per MahaRERA registration. Prices exclude stamp duty, registration and GST where applicable.", groups: [
        { category: "Ongoing", items: [
          { name: "Skyline Vista — 2 & 3 BHK, Ghodbunder Road", price: "₹1.12 Cr onwards", note: "Possession Dec 2027 / Jun 2028" },
        ] },
        { category: "Upcoming", items: [
          { name: "Skyline Aurum — 2 & 4 BHK, Majiwada", price: "₹1.25 Cr onwards", note: "Pre-launch · Possession Jun 2030" },
        ] },
        { category: "Completed", items: [
          { name: "Skyline Heights — 2 & 3 BHK, Kolshet Road", price: "₹1.55 Cr", note: "OC received 2026 · last few homes" },
          { name: "Skyline Residency — 1 & 2 BHK, Kasarvadavali", price: "Sold out", note: "Handed over 2022" },
        ] },
      ] }, style: { background: "light", cardRadius: "none" } },
      { type: "gallery", content: { eyebrow: "VISUALS", title: "Elevations, Sample Flat &", titleHighlight: "Site" }, style: { layout: "grid" } },
      cta,
    ] },
    { slug: "updates", title: "Construction Updates", isSystem: true, order: 2, sections: [
      { type: "banner", content: { title: "Construction", titleHighlight: "Updates", subtitle: "Track your home's progress, slab by slab.", image: "", bgColor: "#141312", imageOpacity: 40, overlayOpacity: 75 } },
      updates,
      { type: "video", content: { eyebrow: "MONTHLY DRONE VIDEO", title: "Skyline Vista", titleHighlight: "From Above", url: "", caption: "Paste the latest drone walkthrough link from Admin." } },
      { type: "gallery", content: { eyebrow: "SITE PHOTOS", title: "Progress", titleHighlight: "Gallery" }, style: { layout: "strip" } },
      { type: "downloads", content: { eyebrow: "DOCUMENTS", title: "RERA &", titleHighlight: "Approvals", items: [
        { title: "MahaRERA Certificate — Skyline Vista", description: "Registration P51700034567 / P51700034568.", link: "#", icon: "clipboard" },
        { title: "Project Brochure", description: "Floor plans, specifications and amenities.", link: "#", icon: "book" },
        { title: "Quarterly Progress Report", description: "As uploaded on the MahaRERA portal.", link: "#", icon: "download" },
      ] }, style: { background: "light" } },
    ] },
    { slug: "payment-plans", title: "Payment Plans", isSystem: true, order: 3, sections: [
      { type: "banner", content: { title: "Payment Plans &", titleHighlight: "Home Loans", subtitle: "Choose the plan that fits your cash-flow — with pre-approved loans from 6 lenders.", image: "", bgColor: "#141312", imageOpacity: 40, overlayOpacity: 75 } },
      paymentPlans,
      { type: "priceList", content: { eyebrow: "CONSTRUCTION-LINKED SCHEDULE", title: "Stage-wise", titleHighlight: "Payments", note: "Indicative schedule for Skyline Vista. The exact schedule is part of your agreement for sale.", groups: [
        { category: "Booking & Agreement", items: [
          { name: "On booking", price: "10%", note: "" },
          { name: "On agreement (within 30 days)", price: "10%", note: "Stamp duty & registration payable" },
        ] },
        { category: "Structure", items: [
          { name: "On plinth", price: "15%", note: "" },
          { name: "On every 4th slab", price: "5% each", note: "Up to 40% in total" },
        ] },
        { category: "Finishing & Possession", items: [
          { name: "On blockwork & plaster", price: "10%", note: "" },
          { name: "On flooring & fittings", price: "10%", note: "" },
          { name: "On possession", price: "5%", note: "With OC" },
        ] },
      ] } },
      { type: "logos", content: { title: "Home-loan partners", items: ["SBI", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Mahindra Bank", "LIC Housing Finance"] }, style: { background: "light" } },
      faq,
    ] },
    { slug: "site-visit", title: "Book a Site Visit", isSystem: true, order: 4, sections: [
      { type: "appointmentForm", content: { title: "Book a Site Visit", subtitle: "Pick a date and time to see the sample flat and site — free pick-up and drop within Thane & Mulund." } },
      { type: "steps", content: { eyebrow: "YOUR VISIT", title: "What to", titleHighlight: "Expect", items: [
        { title: "Pick-up", text: "Our cab picks you up from home or the nearest station.", icon: "car" },
        { title: "Sample Flat", text: "Walk through the fully finished sample flat with actual specifications.", icon: "home" },
        { title: "Site Tour", text: "Hard-hat tour of the towers with our project engineer.", icon: "hammer" },
        { title: "Cost Sheet", text: "Itemised cost sheet and loan eligibility — no pressure to book.", icon: "clipboard" },
      ] }, style: { layout: "timeline", background: "light" } },
      { type: "openingHours", content: { eyebrow: "SALES GALLERY", title: "Open", titleHighlight: "All Week", note: "Weekend slots fill fast — book ahead.", days: [
        { day: "Monday – Friday", hours: "10:00 AM – 7:00 PM" },
        { day: "Saturday – Sunday", hours: "9:00 AM – 8:00 PM" },
      ] } },
    ] },
    { slug: "about", title: "About Us", isSystem: true, order: 5, sections: [
      { type: "banner", content: { title: "27 Years of", titleHighlight: "Building Trust", subtitle: "14 projects. 4,800+ families. Every one handed over with OC.", image: "", bgColor: "#141312", imageOpacity: 40, overlayOpacity: 75 } },
      { type: "about", content: { eyebrow: "OUR LEGACY", title: "Three Generations of", titleHighlight: "Builders", body: [
        `${biz} was founded in 1998 by Shri Ramesh Thakkar with a 24-flat building in Naupada. His children and grandchildren now run a company that has shaped Thane's Ghodbunder corridor.`,
        "We still follow the founder's rule: never announce a possession date we can't beat.",
      ], image: "", points: ["CREDAI-MCHI member", "ISO 9001:2015 certified", "In-house architects & engineers", "Green-building practices"], buttonLabel: "", buttonHref: "" }, style: { layout: "split" } },
      { type: "visionMission", content: {
        eyebrow: "WHAT DRIVES US",
        visionTitle: "Vision", visionText: `To be ${CITY}'s most trusted name in homes — measured by families who refer us, not by square feet sold.`,
        missionTitle: "Mission", missionText: "Build honest homes with verified materials, transparent pricing and possession on or before the promised date.",
        valuesTitle: "Our Values",
        values: [
          { icon: "clock", title: "On-Time", text: "Last six projects delivered on or before the RERA date." },
          { icon: "shield", title: "Transparency", text: "Itemised cost sheets and published construction updates." },
          { icon: "award", title: "Craftsmanship", text: "Sample flat specification is exactly what you receive." },
        ],
      }, style: { background: "light" } },
      { type: "team", content: { eyebrow: "LEADERSHIP", title: "The People Behind", titleHighlight: "the Skyline", members: [
        { name: "Ramesh Thakkar", role: "Founder & Chairman", image: "", note: "40 years in real estate" },
        { name: "Kunal Thakkar", role: "Managing Director", image: "", note: "Civil engineer, leads all projects" },
        { name: "Ar. Shruti Thakkar", role: "Director — Design", image: "", note: "M.Arch, sustainable design" },
        { name: "Sanjay Pillai", role: "Head — Sales & CRM", image: "", note: "3,000+ homes sold" },
      ] }, style: { layout: "list", cardRadius: "none" } },
      stats,
      testimonials,
    ] },
    { slug: "contact", title: "Contact Us", isSystem: true, order: 6, sections: [
      { type: "contactInfo", content: { eyebrow: "SALES GALLERY", title: "Visit", titleHighlight: "Us", address: `Skyline Vista Sales Gallery, Ghodbunder Road, ${CITY}`, phone: PHONE, email: EMAIL, hours: "Open 7 days: 10 AM – 7 PM (weekends till 8 PM)", mapEmbed: "" } },
      { type: "quoteForm", content: { title: "Request a Cost Sheet", subtitle: "Tell us the project, configuration and budget — our sales manager will send floor plans and an itemised cost sheet.", showSidebar: true }, style: { background: "light" } },
      { type: "map", content: { eyebrow: "LOCATION", title: "Find the", titleHighlight: "Site", address: `Off Ghodbunder Road, near Kasarvadavali, ${CITY}`, mapEmbed: "" } },
    ] },
  ],
};
