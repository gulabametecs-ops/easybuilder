import type { TemplateDef, SectionSeed } from "./types";

// Construction & Builders (residential, commercial, renovation, approvals):
// dark charcoal + safety amber, bold and industrial, conversion on the site-visit quote.
const PHONE = "9000000000";
const CATEGORIES = ["Residential Construction", "Commercial Projects", "Renovation & Interiors", "Architecture & Approvals"];

const stats: SectionSeed<"stats"> = {
  type: "stats",
  content: { items: [
    { value: "18+", label: "Years Building", icon: "hammer" },
    { value: "320+", label: "Homes & Projects Delivered", icon: "home" },
    { value: "42 Lakh sq ft", label: "Built-Up Area Completed", icon: "grid" },
    { value: "96%", label: "Handed Over On Time", icon: "clock" },
  ] },
  style: { background: "dark" },
};

const process: SectionSeed<"steps"> = {
  type: "steps",
  content: {
    eyebrow: "HOW WE BUILD", title: "Bhoomi Pujan to", titleHighlight: "Griha Pravesh",
    items: [
      { title: "Free Site Visit", text: "Our engineer inspects your plot, checks soil, access and local bylaws — at no cost.", icon: "map-pin" },
      { title: "Design & Approvals", text: "Architectural plans, 3D elevation, structural drawings and municipal sanction handled for you.", icon: "edit" },
      { title: "Fixed-Price Contract", text: "Itemised BOQ, brand-wise material list and stage-wise payment schedule — no hidden extras.", icon: "clipboard" },
      { title: "Construction & QC", text: "Site supervisor daily, 400+ quality checkpoints and weekly photo updates on WhatsApp.", icon: "hammer" },
      { title: "Handover & Warranty", text: "Snag-free handover with 10-year structural warranty and 1-year maintenance support.", icon: "award" },
    ],
  },
};

const packages: SectionSeed<"pricingPlans"> = {
  type: "pricingPlans",
  content: {
    eyebrow: "PER SQ FT PACKAGES", title: "Transparent", titleHighlight: "Construction Packages",
    plans: [
      { name: "Basic", price: "₹1,750", period: "per sq ft", featured: false, buttonLabel: "Get Estimate", buttonHref: "/quote", features: [
        "RCC framed structure, Fe 500 TMT steel", "Red brick / AAC block masonry", "Vitrified tiles up to ₹50/sq ft", "ISI-mark CPVC plumbing & ISI wiring", "Tractor emulsion paint", "Standard flush doors",
      ] },
      { name: "Premium", price: "₹2,150", period: "per sq ft", featured: true, buttonLabel: "Get Estimate", buttonHref: "/quote", features: [
        "Everything in Basic", "Top-brand 53-grade cement & Fe 500D TMT", "Tiles & granite up to ₹90/sq ft", "Premium-brand CP & sanitary fittings", "Teak wood main door", "Modular kitchen platform with granite",
      ] },
      { name: "Luxury", price: "₹2,750", period: "per sq ft", featured: false, buttonLabel: "Get Estimate", buttonHref: "/quote", features: [
        "Everything in Premium", "Italian marble / large-format tiles", "Imported designer CP & sanitary fittings", "uPVC sliding windows", "False ceiling with cove lighting", "Home automation ready wiring",
      ] },
    ],
  },
  style: { background: "light", cardRadius: "none", cardShadow: "lg" },
};

const testimonials: SectionSeed<"testimonials"> = {
  type: "testimonials",
  content: { eyebrow: "CLIENT STORIES", title: "Homes Built on", titleHighlight: "Trust", items: [
    { name: "Ramesh & Sunita Patil", role: "G+2 Independent House, 2,400 sq ft", text: "We live abroad and were nervous about building from a distance. Weekly photo reports and a fixed price meant zero surprises. Handed over two weeks early.", rating: 5 },
    { name: "Arvind Mehta", role: "Owner, Showroom & Office Complex", text: "Our 14,000 sq ft commercial building was delivered in 11 months with every structural test report documented. Very professional site management.", rating: 5 },
    { name: "Kavitha Reddy", role: "Full Home Renovation, 3 BHK", text: "They redid our 25-year-old flat — plumbing, wiring, kitchen, flooring — while keeping noise and mess under control for the neighbours.", rating: 5 },
    { name: "Dr. Imran Shaikh", role: "Clinic Building with Approvals", text: "From sanction plan to occupancy certificate, they handled every approval. I just visited the site on Sundays.", rating: 4 },
  ] },
  style: { cardRadius: "none", cardBorderWidth: 2, cardShadow: "none" },
};

const qualityPoints: SectionSeed<"features">["content"]["items"] = [
  { icon: "shield", title: "Earthquake-Resistant Design", text: "IS 1893 compliant structures designed for your seismic zone." },
  { icon: "badge-check", title: "400+ Quality Checkpoints", text: "Cube tests, slump tests and steel checks recorded for every slab." },
  { icon: "droplet", title: "Waterproofing Included", text: "Terrace, bathroom and sump waterproofing in every package." },
  { icon: "roller", title: "Finishing Done Right", text: "Putty, primer and two coats — no shortcuts on the last mile." },
  { icon: "users", title: "Dedicated Site Engineer", text: "One engineer, one point of contact, from foundation to handover." },
  { icon: "phone", title: "Weekly Photo Reports", text: "Progress photos and updates every week on WhatsApp." },
];

const cta: SectionSeed<"cta"> = {
  type: "cta",
  content: { title: "Own a plot? Planning to build?", highlight: "Book a Free Site Visit", phones: [PHONE], buttonLabel: "Get a Free Estimate", buttonHref: "/quote" },
};

export const construction: TemplateDef = {
  theme: {
    colors: { primary: "#f59e0b", primaryDark: "#d97706", secondary: "#1f2328", accent: "#ea580c", dark: "#16181c", light: "#f6f4ef", text: "#3d4148", heading: "#111317" },
    font: "Kanit", radius: "0.125rem",
  },
  header: (biz) => ({
    design: "bold",
    logoText: biz, logoImage: "",
    announcement: { show: true, text: "Booking open for new projects · Free site visit, soil check & 3D elevation with every contract", link: "/quote" },
    topbar: { show: true, address: "Your City · RERA-registered builder", phones: [PHONE], email: "hello@example.com", social: { facebook: "#", instagram: "#", whatsapp: "#" } },
    nav: [
      { label: "Home", href: "/" }, { label: "About", href: "/about" }, { label: "Services", href: "/services" }, { label: "Packages", href: "/packages" },
      { label: "Projects", href: "/projects" }, { label: "Gallery", href: "/gallery" }, { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Free Estimate", href: "/quote" },
  }),
  footer: (biz) => ({
    design: "minimal",
    about: `${biz} builds homes, commercial buildings and renovations with fixed per-sq-ft pricing, branded materials, in-house approvals and a 10-year structural warranty.`,
    columns: [
      { title: "Company", links: [ { label: "About Us", href: "/about" }, { label: "Projects", href: "/projects" }, { label: "Gallery", href: "/gallery" }, { label: "Contact", href: "/contact" } ] },
      { title: "What We Do", links: [ { label: "House Construction", href: "/services" }, { label: "Commercial Buildings", href: "/services" }, { label: "Renovation", href: "/services" }, { label: "Per Sq Ft Packages", href: "/packages" }, { label: "Get Estimate", href: "/quote" } ] },
    ],
    serviceAreas: ["Independent Houses", "Villas", "Commercial Buildings", "Renovation", "Turnkey Interiors", "Sanction Plans"],
    contact: { phones: [PHONE], email: "hello@example.com", address: "Your City" },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. Built strong. Built honest.`,
  }),
  seo: (biz) => ({
    title: `${biz} — House Construction, Builders & Contractors in Your City`,
    description: "Turnkey house construction from ₹1,750/sq ft. Residential, commercial, renovation, architecture and building approvals with fixed pricing and 10-year structural warranty.",
    favicon: "", ogImage: "",
    keywords: "builders near me, house construction cost per sq ft, construction company, civil contractor, renovation contractor, building approval, turnkey construction",
    businessType: "GeneralContractor", priceRange: "₹₹₹",
  }),
  services: [
    { category: "Residential Construction", title: "Independent House Construction", description: "G+1 to G+3 homes built turnkey on your plot with fixed per-sq-ft pricing." },
    { category: "Residential Construction", title: "Villas & Duplexes", description: "Premium villas with landscaped setbacks, terraces and luxury finishes." },
    { category: "Residential Construction", title: "Rental & Apartment Buildings", description: "Multi-unit buildings designed to maximise rental yield and FSI." },
    { category: "Commercial Projects", title: "Showrooms & Office Buildings", description: "Column-free retail floors, glass facades and fire-compliant layouts." },
    { category: "Commercial Projects", title: "Warehouses & Industrial Sheds", description: "PEB and RCC structures with heavy-duty flooring and loading bays." },
    { category: "Commercial Projects", title: "Schools, Clinics & Hospitals", description: "Institutional buildings built to code with phased handover options." },
    { category: "Renovation & Interiors", title: "Full Home Renovation", description: "Plumbing, wiring, flooring, kitchen and bathroom upgrades for older homes." },
    { category: "Renovation & Interiors", title: "Floor Addition & Extension", description: "Structural audit and safe vertical or horizontal extension of existing buildings." },
    { category: "Renovation & Interiors", title: "Waterproofing & Structural Repair", description: "Terrace waterproofing, crack injection and column jacketing." },
    { category: "Architecture & Approvals", title: "Architectural Design & 3D Elevation", description: "Vastu-friendly floor plans, 3D elevations and walkthroughs." },
    { category: "Architecture & Approvals", title: "Structural Engineering", description: "Earthquake-resistant structural design with soil-test based foundations." },
    { category: "Architecture & Approvals", title: "Sanction Plan & OC Approvals", description: "Municipal building permission, completion and occupancy certificates." },
  ],
  gallery: [
    ...["Foundation & footing work", "RCC slab casting", "Brickwork in progress", "Site safety & supervision"].map((caption) => ({ category: "Ongoing Projects", caption })),
    ...["G+2 independent house", "Modern villa elevation", "Commercial showroom building", "Renovated modular kitchen"].map((caption) => ({ category: "Completed Projects", caption })),
  ],
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "gradient", customHtml: "",
          badge: "RERA REGISTERED · 10-YEAR STRUCTURAL WARRANTY", titleTop: "We Build It Right,", titleHighlight: "The First Time",
          subtitle: "", description: `${biz} delivers turnkey homes and commercial buildings at a fixed per-sq-ft price — branded materials, in-house approvals and a site engineer on your project every single day.`, image: "",
          primaryBtn: { label: "Get Free Estimate", href: "/quote" }, secondaryBtn: { label: "View Packages", href: "/packages" },
          features: [ { icon: "shield", title: "10-Yr Warranty", text: "" }, { icon: "tag", title: "Fixed Price", text: "" }, { icon: "clipboard", title: "Approvals Handled", text: "" }, { icon: "clock", title: "On-Time Handover", text: "" } ],
        } },
        { ...stats, style: { layout: "minimal", background: "light" } },
        { type: "about", content: {
          eyebrow: "WHY " + biz.toUpperCase(), title: "Engineers First,", titleHighlight: "Builders Always",
          body: [
            `${biz} was founded by civil engineers who were tired of seeing families cheated by cost overruns and poor workmanship.`,
            "Every project gets a written BOQ, a brand-wise material list and stage-wise payments — you pay only after each stage passes inspection.",
          ],
          image: "", points: ["Soil test & structural design included", "Only ISI / branded materials", "Stage-wise payment, no advance lock-in", "Live site updates on WhatsApp"],
          buttonLabel: "About Us", buttonHref: "/about",
        }, style: { layout: "reverse" } },
        { type: "serviceCategories", content: { eyebrow: "WHAT WE BUILD", title: "Construction", titleHighlight: "Services", categories: CATEGORIES }, style: { cardRadius: "none", cardShadow: "md" } },
        { ...process, style: { layout: "cards", background: "dark" } },
        packages,
        { type: "features", content: { items: qualityPoints }, style: { background: "primary", cardRadius: "none" } },
        { type: "gallery", content: { eyebrow: "OUR SITES", title: "Ongoing &", titleHighlight: "Completed Projects" }, style: { layout: "strip" } },
        { type: "imageBanner", content: { title: "Already have a plan? Get a detailed BOQ in 72 hours.", subtitle: "Share your drawings or plot size — our estimation team sends an itemised cost sheet with material brands.", buttonLabel: "Send Your Plan", buttonHref: "/quote", image: "" } },
        { ...testimonials, style: { ...testimonials.style, layout: "featured" } },
        { type: "logos", content: { title: "Built only with ISI-marked, branded materials", items: ["53-Grade OPC Cement", "Fe 500D TMT Steel", "AAC Blocks", "ISI CPVC Plumbing", "FR-LSH Copper Wiring", "Premium Emulsion Paints"] }, style: { background: "light" } },
        { type: "faq", content: { eyebrow: "FAQ", title: "Before You", titleHighlight: "Build", intro: "Cost, approvals, timelines and payments — straight answers to what every plot owner asks us first.", items: [
          { q: "What is the construction cost per sq ft?", a: "Our packages start at ₹1,750/sq ft (Basic), ₹2,150 (Premium) and ₹2,750 (Luxury), covering structure, finishing, plumbing and electricals. Final cost depends on soil, design and floors." },
          { q: "Do you help with building plan approval?", a: "Yes. Our architects prepare the sanction drawings and we follow up with the municipal authority until permission, completion and occupancy certificates are issued." },
          { q: "How long does a house take to build?", a: "A typical 1,500–2,500 sq ft G+1 home takes 8–11 months from foundation to handover, depending on approvals and design." },
          { q: "How do payments work?", a: "A small booking amount, then stage-wise payments (foundation, plinth, each slab, brickwork, finishing). You pay only after each stage is inspected." },
          { q: "Can I choose my own materials?", a: "Absolutely. Our packages list default brands, and any upgrade is priced transparently as an add-on before work starts." },
          { q: "Do you arrange home loan documents?", a: "Yes. We provide the stage-wise estimate, BOQ and progress certificates that banks ask for when releasing construction-loan instalments." },
        ] } as SectionSeed<"faq">["content"], style: { layout: "split" } },
        { type: "quoteForm", content: { title: "Get a Free Site Visit & Estimate", subtitle: "Plot size, number of floors and preferred package — we'll call within 24 hours.", showSidebar: false }, style: { background: "light" } },
        cta,
      ],
    },
    { slug: "about", title: "About Us", isSystem: true, order: 1, sections: [
      { type: "banner", content: { title: "Building Homes,", titleHighlight: "Building Trust", subtitle: "18 years, 320+ projects, one promise — a fixed price and an honest build.", image: "", bgColor: "", imageOpacity: 40, overlayOpacity: 70 } },
      { type: "about", content: { eyebrow: "OUR STORY", title: "From One House to", titleHighlight: "320+ Projects", body: [
        `${biz} started in 2007 with a single independent house. Word of mouth from that family brought the next ten.`,
        "Today our team of 25 engineers, architects and site supervisors and 300+ skilled workers deliver homes, commercial buildings and renovations across Your City.",
      ], image: "", points: ["RERA registered & ISO 9001 processes", "In-house architects & structural engineers", "Own shuttering, mixers & equipment", "Safety-first sites with PPE for all workers"], buttonLabel: "", buttonHref: "" } },
      { type: "team", content: { eyebrow: "LEADERSHIP", title: "The People Behind", titleHighlight: "Every Build", members: [
        { name: "Er. Suresh Deshmukh", role: "Founder & Managing Director", image: "", note: "B.E. Civil, 25 years in construction" },
        { name: "Ar. Neha Kulkarni", role: "Principal Architect", image: "", note: "M.Arch, Vastu & sustainable design" },
        { name: "Er. Vikram Singh", role: "Head — Structural Engineering", image: "", note: "M.Tech Structures, 400+ designs" },
        { name: "Mahesh Yadav", role: "Senior Site Manager", image: "", note: "Managed 90+ residential sites" },
      ] }, style: { cardRadius: "none", layout: "list" } },
      { type: "visionMission", content: {
        eyebrow: "WHAT WE STAND FOR",
        visionTitle: "Our Vision", visionText: "A city where every family can build without fear of overruns, delays or shortcuts.",
        missionTitle: "Our Mission", missionText: "Fixed prices, engineer-led sites and documented quality on every slab we cast.",
        valuesTitle: "Our Values",
        values: [
          { icon: "tag", title: "No Hidden Costs", text: "Itemised BOQ and locked per-sq-ft rates." },
          { icon: "shield", title: "Safety First", text: "PPE, barricading and insured workers on every site." },
          { icon: "clock", title: "On-Time Handover", text: "96% of projects delivered on or before the contract date." },
        ],
      }, style: { background: "light" } },
      stats,
      cta,
    ] },
    { slug: "services", title: "Services", isSystem: true, order: 2, sections: [
      { type: "serviceCategories", content: { eyebrow: "", title: "Everything From", titleHighlight: "Plan to Possession", categories: CATEGORIES }, style: { cardRadius: "none", cardShadow: "md" } },
      { type: "features", content: { items: qualityPoints }, style: { background: "dark", cardRadius: "none" } },
      { ...process, style: { layout: "timeline" } },
      { type: "faq", content: { eyebrow: "SERVICES FAQ", title: "Renovation &", titleHighlight: "Extensions", items: [
        { q: "Can you add a floor to my existing house?", a: "Usually yes, after a structural audit of the columns and foundation. If strengthening is needed, we quote column jacketing separately." },
        { q: "Do you take renovation of occupied flats?", a: "Yes. We phase the work room by room, protect furniture and follow society timing rules for noisy work." },
        { q: "Do you build warehouses and PEB sheds?", a: "Yes — RCC or pre-engineered steel buildings with industrial flooring, loading docks and fire-compliance drawings." },
      ] }, style: { background: "light" } },
      cta,
    ] },
    { slug: "packages", title: "Packages", isSystem: true, order: 3, sections: [
      packages,
      { type: "priceList", content: { eyebrow: "ADD-ONS & EXTRAS", title: "Clear Rates for", titleHighlight: "Every Upgrade", note: "Rates are indicative, inclusive of material and labour, and exclude GST. Final pricing is fixed in your contract.", groups: [
        { category: "Design & Approvals", items: [
          { name: "Architectural plan + 3D elevation", price: "₹25/sq ft", note: "Free with any package" },
          { name: "Structural drawings", price: "₹15/sq ft", note: "Soil-test based" },
          { name: "Sanction plan liaison", price: "From ₹45,000", note: "Excludes govt. fees" },
        ] },
        { category: "Upgrades", items: [
          { name: "Modular kitchen", price: "From ₹1,85,000", note: "10 ft L-shape, BWP ply" },
          { name: "False ceiling (gypsum)", price: "₹95/sq ft", note: "With cove lighting" },
          { name: "Solar rooftop 3 kW", price: "From ₹1,65,000", note: "Net-metering support" },
          { name: "Rainwater harvesting", price: "From ₹38,000", note: "Recharge pit + filter" },
        ] },
        { category: "Renovation", items: [
          { name: "Bathroom renovation", price: "From ₹1,10,000", note: "Per bathroom, 40 sq ft" },
          { name: "Terrace waterproofing", price: "₹65/sq ft", note: "5-year warranty" },
          { name: "Full flat repainting", price: "₹18/sq ft", note: "Premium emulsion" },
        ] },
      ] }, style: { cardRadius: "none" } },
      { type: "faq", content: { eyebrow: "PRICING FAQ", title: "What's", titleHighlight: "Included?", items: [
        { q: "Is the sq ft rate on carpet or built-up area?", a: "All our rates are on built-up area including walls, staircase and balconies, as measured in the approved plan." },
        { q: "Does the package include compound wall and sump?", a: "Sump, septic tank and overhead tank are included. Compound wall and gate are quoted separately per running foot." },
        { q: "Will the price increase midway?", a: "No. The per-sq-ft rate in your contract is locked. Only changes you request are billed, with written approval first." },
      ] } },
      cta,
    ] },
    { slug: "projects", title: "Projects", isSystem: true, order: 4, sections: [
      { type: "banner", content: { title: "Our", titleHighlight: "Projects", subtitle: "Ongoing sites you can visit and completed homes you can talk to.", image: "", bgColor: "", imageOpacity: 40, overlayOpacity: 70 } },
      { type: "priceList", content: { eyebrow: "PROJECT TRACKER", title: "Ongoing &", titleHighlight: "Recently Completed", note: "Site visits to ongoing projects are welcome on weekends — call to schedule.", groups: [
        { category: "Ongoing", items: [
          { name: "Sharma Residence — G+2, 3,200 sq ft", price: "Slab 2 done", note: "Handover: March" },
          { name: "Green Valley Villas — 6 units", price: "Brickwork", note: "Handover: August" },
          { name: "Patel Commercial Complex — 18,000 sq ft", price: "Foundation", note: "Handover: Next year" },
        ] },
        { category: "Completed", items: [
          { name: "Joshi House — G+1, 2,100 sq ft", price: "Delivered", note: "10 months" },
          { name: "Dr. Shaikh's Clinic Building — 6,500 sq ft", price: "Delivered", note: "With OC approval" },
          { name: "Lakeview Apartment Renovation — 12 flats", price: "Delivered", note: "4 months" },
        ] },
      ] }, style: { background: "light" } },
      { type: "gallery", content: { eyebrow: "SITE PHOTOS", title: "From the", titleHighlight: "Ground Up" }, style: { layout: "masonry" } },
      testimonials,
      cta,
    ] },
    { slug: "gallery", title: "Gallery", isSystem: true, order: 5, sections: [
      { type: "gallery", content: { eyebrow: "GALLERY", title: "Built by", titleHighlight: biz } },
      stats,
      cta,
    ] },
    { slug: "quote", title: "Free Estimate", isSystem: true, order: 6, sections: [
      { type: "quoteForm", content: { title: "Get a Free Construction Estimate", subtitle: "Tell us your plot size, floors and preferred package — we'll call within 24 hours and schedule a free site visit.", showSidebar: true } },
      process,
      { type: "downloads", content: { eyebrow: "RESOURCES", title: "Plan Your", titleHighlight: "Build", items: [
        { title: "Package Specification Sheet", description: "Brand-wise material list for Basic, Premium and Luxury.", link: "#", icon: "clipboard" },
        { title: "Sample BOQ — 2,000 sq ft House", description: "See how we itemise every cost.", link: "#", icon: "tag" },
        { title: "Home Building Checklist", description: "Documents and approvals you need before starting.", link: "#", icon: "check" },
      ] } },
    ] },
    { slug: "contact", title: "Contact Us", isSystem: true, order: 7, sections: [
      { type: "contactInfo", content: { eyebrow: "VISIT OUR OFFICE", title: "Let's Talk About", titleHighlight: "Your Project", address: "Your City", phone: PHONE, email: "hello@example.com", hours: "Mon–Sat: 9:30 AM – 7 PM · Sunday site visits by appointment", mapEmbed: "" } },
      { type: "map", content: { eyebrow: "FIND US", title: "Our", titleHighlight: "Office", address: "Your City", mapEmbed: "" } },
      { type: "contactForm", content: { title: "Send Us a Message", subtitle: "Questions about cost, approvals or timelines? We reply the same day." } },
    ] },
  ],
};
