import type { TemplateDef, SectionSeed, PropertySeed } from "./types";

// Real-estate broker / property agency (buy, sell, rent, commercial, loans, legal, NRI):
// deep navy + champagne gold, Spectral serif, classic hero, modern header, classic footer.
const PHONE = "9000000000";
const EMAIL = "hello@example.com";
const CITY = "Pune";
const CATEGORIES = ["Buy & Sell", "Rentals & Leasing", "Home Loans & Legal", "NRI Services"];

const stats: SectionSeed<"stats"> = {
  type: "stats",
  content: { items: [
    { value: "2,400+", label: "Families Moved In", icon: "key" },
    { value: "₹1,150 Cr", label: "Property Transacted", icon: "trending" },
    { value: "650+", label: "Verified Listings", icon: "building" },
    { value: "14 Yrs", label: "In Pune Real Estate", icon: "award" },
  ] },
  style: { layout: "cards", background: "light", cardShadow: "md", cardRadius: "md" },
};

const process: SectionSeed<"steps"> = {
  type: "steps",
  content: {
    eyebrow: "HOW WE WORK", title: "From First Call to", titleHighlight: "Keys in Hand",
    items: [
      { title: "Tell Us What You Need", text: "Budget, locality, BHK and timeline — one 15-minute call and we shortlist only what fits.", icon: "phone" },
      { title: "Verified Shortlist", text: "Title, approvals and society NOC checked before we ever show you a property.", icon: "badge-check" },
      { title: "Guided Site Visits", text: "We drive you to 4–6 homes in one afternoon, with honest notes on each.", icon: "map-pin" },
      { title: "Negotiation & Loan", text: "We negotiate the best price and get your home-loan sanction from partner banks.", icon: "handshake" },
      { title: "Registry & Handover", text: "Agreement, stamp duty, registration and society transfer — done, and keys handed over.", icon: "key" },
    ],
  },
};

const testimonials: SectionSeed<"testimonials"> = {
  type: "testimonials",
  content: { eyebrow: "CLIENT STORIES", title: "Trusted by Buyers, Sellers &", titleHighlight: "Tenants", items: [
    { name: "Aditya & Pooja Kulkarni", role: "Bought a 3 BHK in Baner", text: "They showed us six flats in one Saturday and flagged a title issue on the one we liked most. We ended up in a better home at ₹6 lakh less.", rating: 5 },
    { name: "Rajiv Menon", role: "NRI seller, Dubai", text: "I sold my Kothrud flat without flying down once — power of attorney, buyer verification and registration were all handled with video updates.", rating: 5 },
    { name: "Sneha Iyer", role: "Rented a 2 BHK in Kharadi", text: "Zero brokerage drama. The rent agreement was registered online in two days and the deposit terms were crystal clear.", rating: 5 },
    { name: "Harpreet Singh", role: "Leased office space, Hinjewadi", text: "They understood our fit-out timeline and negotiated three months of rent-free period. Very professional commercial team.", rating: 4 },
  ] },
};

const whyUs: SectionSeed<"features">["content"]["items"] = [
  { icon: "shield", title: "Legally Verified Listings", text: "7/12, title search and RERA status checked by our in-house advocate." },
  { icon: "tag", title: "Honest Pricing", text: "Recent registered-sale data for every locality, so you never overpay." },
  { icon: "home", title: "Home Loan Desk", text: "Pre-approved offers from 12 banks & HFCs, doorstep documentation." },
  { icon: "clipboard", title: "Registry Handled", text: "Agreement drafting, stamp duty, registration and society transfer." },
  { icon: "plane", title: "NRI Friendly", text: "PoA, video walkthroughs, rent collection and repatriation guidance." },
  { icon: "users", title: "One Relationship Manager", text: "A single point of contact from first call to possession." },
];

const faq: SectionSeed<"faq"> = {
  type: "faq",
  content: { eyebrow: "FAQ", title: "Questions Buyers & Owners", titleHighlight: "Ask Us", items: [
    { q: "What is your brokerage fee?", a: "For resale purchases it is 1% of the deal value, for rentals one month's rent split between owner and tenant as agreed, and for new projects there is usually no fee to the buyer. Everything is written down before the first visit." },
    { q: "Do you check the property papers before showing it?", a: "Yes. Our advocate checks the title chain, 7/12 or property card, approved plan, society NOC and any loan on the property. Listings that fail checks are never shown." },
    { q: "Can you help me get a home loan?", a: "Our loan desk compares offers from 12 banks and housing-finance companies, collects documents from your doorstep and follows up until sanction and disbursement — at no extra cost." },
    { q: "How much is stamp duty and registration in Pune?", a: "Typically 6% stamp duty (including metro cess) plus ₹30,000 registration fee for most residential purchases within PMC/PCMC limits. Women buyers get a 1% concession. We share the exact figure with your cost sheet." },
    { q: "I live abroad — can I still buy or sell?", a: "Yes. We arrange a registered Power of Attorney, live video walkthroughs, and handle registration, TDS and repatriation paperwork with your CA." },
    { q: "Will you list my flat for rent or sale?", a: "Yes — submit the 'List Your Property' form. We visit, suggest the right price, take photos and share only pre-screened buyers or tenants." },
  ] },
  style: { layout: "split" },
};

const cta: SectionSeed<"cta"> = {
  type: "cta",
  content: { title: "Looking to buy, sell or rent in Pune?", highlight: "Talk to a property advisor today", phones: [PHONE], buttonLabel: "Book a Site Visit", buttonHref: "/contact" },
  style: { layout: "split", background: "dark" },
};

const properties = (): PropertySeed[] => [
  {
    title: "Spacious 3 BHK with Hill View in Baner", purpose: "sale", propertyType: "apartment",
    price: 14500000, bhk: "3 BHK", areaSqft: 1450, furnishing: "Semi-furnished", bathrooms: 3, floor: "9th of 14", facing: "East",
    parking: "2 covered", possession: "Ready to move", locality: "Baner", city: CITY, address: "Near Baner–Pashan Link Road, Baner, Pune",
    summary: "Corner 3 BHK in a gated society with clubhouse, hill-facing balcony and two covered parkings.",
    description: "A bright east-facing corner flat on the 9th floor of a well-maintained 2018 society. Large living room opening to a deck with Baner hill views, modular kitchen with utility, and wardrobes in all three bedrooms. Walking distance to Balewadi High Street and a 10-minute drive to Hinjewadi Phase 1.",
    highlights: ["Hill-facing deck balcony", "Modular kitchen with chimney & hob", "Clear title, society NOC ready", "OC received in 2018"],
    amenities: ["parking", "lift", "power-backup", "security", "gym", "pool", "clubhouse", "play-area", "gas"],
    status: "available", featured: true,
  },
  {
    title: "Modern 2 BHK near Dange Chowk, Wakad", purpose: "sale", propertyType: "apartment",
    price: 7800000, bhk: "2 BHK", areaSqft: 1020, furnishing: "Unfurnished", bathrooms: 2, floor: "6th of 12", facing: "North",
    parking: "1 covered", possession: "Ready to move", locality: "Wakad", city: CITY,
    summary: "Value-for-money 2 BHK, 4 km from Hinjewadi IT Park, in a society with pool and gym.",
    description: "Ideal first home for IT professionals. Efficient layout with no wasted passage, two balconies, vitrified flooring and piped gas. Schools, D-Mart and the Mumbai–Bangalore highway are all within 2 km.",
    highlights: ["4 km to Hinjewadi Phase 1", "Two balconies", "Bank-approved for home loans"],
    amenities: ["parking", "lift", "power-backup", "security", "cctv", "gym", "pool", "gas"],
    status: "available", featured: true,
  },
  {
    title: "4 BHK Independent Villa with Garden, Koregaon Park", purpose: "sale", propertyType: "villa",
    price: 42500000, bhk: "4 BHK", areaSqft: 3600, furnishing: "Furnished", bathrooms: 5, floor: "G+2", facing: "East",
    parking: "3 open + 1 covered", possession: "Ready to move", locality: "Koregaon Park", city: CITY,
    summary: "Fully furnished villa on a quiet lane with private garden, terrace and staff room.",
    description: "A rare independent villa in Koregaon Park Annexe on a 4,200 sq ft plot. Italian marble flooring, home theatre, landscaped front garden and a large terrace for entertaining. Close to North Main Road cafés, yet completely quiet.",
    highlights: ["Private garden & terrace", "Italian marble flooring", "Staff quarters", "Freehold plot, clear title"],
    amenities: ["parking", "power-backup", "security", "cctv", "garden", "ac", "water", "gas"],
    status: "available", featured: true,
  },
  {
    title: "NA Residential Plot in Hinjewadi Phase 3", purpose: "sale", propertyType: "plot",
    price: 6200000, areaSqft: 2000, facing: "North-East", possession: "Immediate", locality: "Hinjewadi", city: CITY,
    summary: "2,000 sq ft NA-approved plot in a gated layout with internal roads, water and electricity.",
    description: "Clear-title non-agricultural plot in a PMRDA-approved gated layout near Maan village. 30 ft internal roads, street lights, compound wall and individual water connection. Ideal to build a bungalow or hold as an investment.",
    highlights: ["PMRDA approved layout", "30 ft internal roads", "Bank loan available"],
    amenities: ["security", "water", "garden"],
    status: "available",
  },
  {
    title: "Ground-Floor Shop on Main Road, Viman Nagar", purpose: "sale", propertyType: "shop",
    price: 11000000, areaSqft: 480, furnishing: "Unfurnished", floor: "Ground", facing: "Road-facing",
    parking: "Visitor parking", possession: "Ready to move", locality: "Viman Nagar", city: CITY,
    summary: "High-footfall 480 sq ft shop with 18 ft frontage, opposite a busy residential complex.",
    description: "Road-facing commercial shop with glass frontage, mezzanine option and 3-phase power. Currently vacant — ideal for a pharmacy, café or clinic. Expected rental yield of around 4%.",
    highlights: ["18 ft frontage", "3-phase power", "Mezzanine possible"],
    amenities: ["parking", "power-backup", "cctv", "water"],
    status: "available",
  },
  {
    title: "Furnished 2 BHK for Rent near EON IT Park, Kharadi", purpose: "rent", propertyType: "apartment",
    price: 32000, priceNote: "/month", deposit: 100000, maintenance: 3500, bhk: "2 BHK", areaSqft: 980,
    furnishing: "Furnished", bathrooms: 2, floor: "11th of 18", facing: "West", parking: "1 covered", availableFrom: "Immediately",
    locality: "Kharadi", city: CITY,
    summary: "Move-in ready 2 BHK with beds, wardrobes, sofa, fridge, washing machine and ACs.",
    description: "Fully furnished flat in a premium society 5 minutes from EON IT Park and World Trade Center. Ideal for working couples or two professionals. Registered leave-and-licence agreement handled by us.",
    highlights: ["5 min walk to EON IT Park", "2 ACs, fridge, washing machine", "Family or working professionals"],
    amenities: ["parking", "lift", "power-backup", "security", "gym", "pool", "ac", "fridge", "wifi"],
    status: "available", featured: true,
  },
  {
    title: "3 BHK Family Flat for Rent in Aundh", purpose: "rent", propertyType: "apartment",
    price: 48000, priceNote: "/month", deposit: 200000, maintenance: 4000, bhk: "3 BHK", areaSqft: 1550,
    furnishing: "Semi-furnished", bathrooms: 3, floor: "4th of 7", facing: "East", parking: "2 covered", availableFrom: "Rented",
    locality: "Aundh", city: CITY,
    summary: "Semi-furnished 3 BHK on ITI Road, close to schools and Westend Mall.",
    description: "Large family flat with wardrobes, kitchen trolleys and lights & fans. This property has been rented — call us for similar homes in Aundh and Baner.",
    amenities: ["parking", "lift", "power-backup", "security", "garden", "gas"],
    status: "rented",
  },
  {
    title: "Plug-and-Play Office Space in Hinjewadi Phase 1", purpose: "rent", propertyType: "office",
    price: 120000, priceNote: "/month", deposit: 720000, maintenance: 14000, areaSqft: 2400,
    furnishing: "Furnished", floor: "5th of 9", parking: "4 covered", availableFrom: "1 December", locality: "Hinjewadi", city: CITY,
    summary: "40-seat furnished office with 2 cabins, conference room, pantry and server room.",
    description: "Ready office in a Grade-A IT building with 100% power backup, central AC and 24×7 access. Suitable for startups and IT services firms. Lock-in and escalation terms negotiable.",
    highlights: ["40 workstations + 2 cabins", "Conference & server room", "100% power backup"],
    amenities: ["parking", "lift", "power-backup", "security", "cctv", "ac", "wifi"],
    status: "available",
  },
  {
    title: "Compact 1 BHK in Magarpatta Road, Hadapsar", purpose: "sale", propertyType: "apartment",
    price: 4800000, bhk: "1 BHK", areaSqft: 620, furnishing: "Semi-furnished", bathrooms: 1, floor: "3rd of 10",
    parking: "1 open", possession: "Ready to move", locality: "Hadapsar", city: CITY,
    summary: "Investor-friendly 1 BHK near Magarpatta City — sold within 3 weeks of listing.",
    description: "This 1 BHK was sold to a buyer from our verified list in 19 days at 98% of asking price. Thinking of selling? List with us.",
    amenities: ["parking", "lift", "security", "gas"],
    status: "sold",
  },
];

export const realEstateBroker: TemplateDef = {
  theme: {
    colors: { primary: "#c5a253", primaryDark: "#a8863a", secondary: "#0f2341", accent: "#2b4c7e", dark: "#0b1a30", light: "#f6f3ec", text: "#3c4658", heading: "#0f2341" },
    font: "Spectral", radius: "0.5rem",
  },
  header: (biz) => ({
    design: "modern",
    logoText: biz, logoImage: "",
    announcement: { show: true, text: "New this week: furnished 2 BHKs near EON IT Park · Free legal check on every resale listing", link: "/properties" },
    topbar: { show: true, address: `Baner Road, ${CITY} · MahaRERA registered agent`, phones: [PHONE], email: EMAIL, social: { facebook: "#", instagram: "#", whatsapp: "#" } },
    nav: [
      { label: "Home", href: "/" },
      { label: "Properties", href: "/properties" },
      { label: "Services", href: "/services" },
      { label: "Home Loans", href: "/home-loans" },
      { label: "List Your Property", href: "/list-property" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Book Site Visit", href: "/contact" },
  }),
  footer: (biz) => ({
    design: "classic",
    about: `${biz} helps families buy, sell and rent verified homes, plots and commercial spaces across ${CITY} — with in-house legal checks, a home-loan desk and NRI support.`,
    columns: [
      { title: "Properties", links: [ { label: "Flats for Sale", href: "/properties" }, { label: "Homes for Rent", href: "/properties" }, { label: "Commercial", href: "/properties" }, { label: "List Your Property", href: "/list-property" } ] },
      { title: "Services", links: [ { label: "Home Loans", href: "/home-loans" }, { label: "Legal & Registry", href: "/services" }, { label: "NRI Services", href: "/services" }, { label: "About Us", href: "/about" }, { label: "Contact", href: "/contact" } ] },
    ],
    serviceAreas: ["Baner", "Wakad", "Hinjewadi", "Kharadi", "Viman Nagar", "Koregaon Park", "Aundh", "Hadapsar"],
    contact: { phones: [PHONE], email: EMAIL, address: `Office 304, Baner Road, ${CITY}` },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. MahaRERA Agent Reg. No. A52100000000 (sample).`,
  }),
  seo: (biz) => ({
    title: `${biz} — Property Dealer & Real Estate Agent in ${CITY}`,
    description: `Buy, sell or rent verified flats, villas, plots, shops and offices in ${CITY}. Legal checks, home-loan help, registration support and NRI services.`,
    favicon: "", ogImage: "",
    keywords: `real estate agent ${CITY}, property dealer near me, flats for sale ${CITY}, 2 bhk for rent ${CITY}, NRI property services, home loan help`,
    businessType: "RealEstateAgent", priceRange: "₹₹₹",
  }),
  services: [
    { category: "Buy & Sell", title: "Buy a Home", description: "Verified resale and new flats, villas and plots matched to your budget and locality." },
    { category: "Buy & Sell", title: "Sell Your Property", description: "Market-based pricing, professional photos and pre-screened buyers — sold faster, with less hassle." },
    { category: "Buy & Sell", title: "Commercial Property", description: "Shops, showrooms and office spaces for end-use or rental investment." },
    { category: "Rentals & Leasing", title: "Homes for Rent", description: "Furnished and semi-furnished flats for families and working professionals." },
    { category: "Rentals & Leasing", title: "Tenant Verification & Agreements", description: "Police verification and registered online leave-and-licence agreements." },
    { category: "Rentals & Leasing", title: "Office Leasing", description: "Plug-and-play and bare-shell offices with negotiated lock-ins and fit-out periods." },
    { category: "Home Loans & Legal", title: "Home Loan Assistance", description: "Best offers from 12 banks & HFCs, doorstep documentation, sanction follow-up." },
    { category: "Home Loans & Legal", title: "Title Search & Legal Check", description: "Advocate-led verification of title, approvals and encumbrances before you pay." },
    { category: "Home Loans & Legal", title: "Agreement & Registration", description: "Sale deed drafting, stamp duty calculation, registration and society transfer." },
    { category: "NRI Services", title: "NRI Buying & Selling", description: "Video walkthroughs, Power of Attorney and end-to-end transaction handling." },
    { category: "NRI Services", title: "Property Management", description: "Tenant finding, rent collection, maintenance and periodic inspection reports." },
    { category: "NRI Services", title: "Repatriation & TDS Guidance", description: "Coordination with your CA for TDS, Form 15CA/CB and fund repatriation." },
  ],
  gallery: [
    ...["Living room — Baner 3 BHK", "Villa garden — Koregaon Park", "Kitchen — Wakad 2 BHK"].map((caption) => ({ category: "Homes", caption })),
    ...["Shop frontage — Viman Nagar", "Office floor — Hinjewadi"].map((caption) => ({ category: "Commercial", caption })),
  ],
  properties,
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "classic", customHtml: "",
          badge: `VERIFIED HOMES · ${CITY.toUpperCase()} · SINCE 2012`, titleTop: "Find a Home You'll Love,", titleHighlight: "Without the Guesswork",
          subtitle: "", description: `${biz} shows you only legally verified flats, villas and plots across ${CITY} — and handles the home loan, paperwork and registry for you.`, image: "",
          primaryBtn: { label: "Browse Properties", href: "/properties" }, secondaryBtn: { label: "Sell or Rent Out", href: "/list-property" },
          features: [ { icon: "shield", title: "Title Verified", text: "" }, { icon: "home", title: "Home Loan Desk", text: "" }, { icon: "plane", title: "NRI Support", text: "" } ],
        } },
        { type: "propertyList", content: {
          eyebrow: "HANDPICKED THIS WEEK", title: "Featured", titleHighlight: "Properties",
          subtitle: "Verified homes and commercial spaces with real prices — book a visit in one click.",
          purpose: "all", featuredOnly: true, showFilters: false, limit: 6, emptyText: "Fresh listings are being verified — check back soon.",
        } },
        stats,
        { type: "serviceCategories", content: { eyebrow: "WHAT WE DO", title: "Every Property Need,", titleHighlight: "One Trusted Advisor", categories: CATEGORIES }, style: { layout: "list" } },
        { type: "about", content: {
          eyebrow: "WHY " + biz.toUpperCase(), title: "Advice First,", titleHighlight: "Deals Second",
          body: [
            `${biz} was started in 2012 by a property lawyer and a banker who saw too many families lose savings to disputed titles and inflated prices.`,
            "We still work that way: every listing is checked by our advocate, every price is compared with registered sales, and you get the same relationship manager from first call to possession.",
          ],
          image: "", points: ["In-house advocate & loan desk", "Registered-sale price data", "No pressure, no fake urgency", "Transparent brokerage, in writing"],
          buttonLabel: "Meet the Team", buttonHref: "/about",
        }, style: { layout: "split" } },
        { ...process, style: { layout: "timeline", background: "light" } },
        { type: "features", content: { items: whyUs }, style: { layout: "split" } },
        { ...testimonials, style: { layout: "featured" } },
        { type: "logos", content: { title: "Home-loan partners", items: ["SBI Home Loans", "HDFC Bank", "ICICI Bank", "Axis Bank", "LIC Housing Finance", "Bajaj Housing Finance"] }, style: { background: "light" } },
        faq,
        cta,
      ],
    },
    { slug: "properties", title: "Properties", isSystem: true, order: 1, sections: [
      { type: "banner", content: { title: "Properties in", titleHighlight: CITY, subtitle: "Buy, rent or invest — flats, villas, plots, shops and offices, all legally verified.", image: "", bgColor: "", imageOpacity: 35, overlayOpacity: 80 } },
      { type: "propertyList", content: {
        eyebrow: "ALL LISTINGS", title: "Buy or", titleHighlight: "Rent",
        subtitle: "Filter by purpose, BHK, budget and locality. Every listing shows the real price.",
        purpose: "all", featuredOnly: false, showFilters: true, limit: 24, emptyText: "No listings match these filters yet — call us and we'll find one off-market.",
      } },
      { type: "imageBanner", content: { title: "Didn't find the right home?", subtitle: "Half our deals are off-market. Tell us your requirement and we'll shortlist within 48 hours.", buttonLabel: "Share Your Requirement", buttonHref: "/contact", image: "" } },
      cta,
    ] },
    { slug: "services", title: "Services", isSystem: true, order: 2, sections: [
      { type: "banner", content: { title: "Our", titleHighlight: "Services", subtitle: "Buying, selling, renting, loans, legal and NRI services — under one roof.", image: "", bgColor: "", imageOpacity: 35, overlayOpacity: 80 } },
      { type: "serviceCategories", content: { eyebrow: "", title: "How We", titleHighlight: "Help", categories: CATEGORIES } },
      { type: "about", content: {
        eyebrow: "NRI DESK", title: "Own, Sell or Rent Out in Pune —", titleHighlight: "From Anywhere",
        body: [
          "Thousands of Pune families live in the Gulf, US, UK and Singapore. Our NRI desk lets you buy, sell or rent out without taking leave or flying down.",
          "Live video walkthroughs, a registered Power of Attorney, monthly rent statements and coordination with your CA for TDS and repatriation.",
        ],
        image: "", points: ["Video site visits at your time zone", "PoA drafting & registration", "Rent collection & maintenance", "Quarterly inspection reports"],
        buttonLabel: "Talk to the NRI Desk", buttonHref: "/contact",
      }, style: { layout: "reverse", background: "light" } },
      { ...process, style: { layout: "cards" } },
      { type: "priceList", content: { eyebrow: "FEES", title: "Transparent", titleHighlight: "Brokerage", note: "GST extra. Fees are confirmed in writing before the first site visit.", groups: [
        { category: "Buying & Selling", items: [
          { name: "Resale purchase (buyer)", price: "1%", note: "of agreement value" },
          { name: "Resale sale (seller)", price: "1%", note: "of agreement value" },
          { name: "New project booking", price: "Free", note: "for buyers" },
        ] },
        { category: "Rentals", items: [
          { name: "Residential rental", price: "1 month's rent", note: "split owner / tenant" },
          { name: "Commercial lease", price: "1.5 months' rent", note: "paid by tenant" },
          { name: "Registered rent agreement", price: "₹2,500", note: "plus govt. charges" },
        ] },
        { category: "Legal & NRI", items: [
          { name: "Title search report", price: "₹7,500", note: "30-year search" },
          { name: "Property management (NRI)", price: "5% of rent", note: "min. ₹1,500/month" },
        ] },
      ] } },
      faq,
      cta,
    ] },
    { slug: "home-loans", title: "Home Loans", isSystem: true, order: 3, sections: [
      { type: "banner", content: { title: "Home Loans,", titleHighlight: "Made Simple", subtitle: "Compare 12 banks & HFCs, get doorstep documentation and sanction in as little as 7 days.", image: "", bgColor: "", imageOpacity: 35, overlayOpacity: 80 } },
      { type: "priceList", content: { eyebrow: "INDICATIVE RATES", title: "Partner", titleHighlight: "Interest Rates", note: "Rates are indicative, vary by credit score and profile, and change with RBI policy. Confirmed only on sanction.", groups: [
        { category: "Public & Private Banks", items: [
          { name: "SBI Home Loans", price: "From 8.25%", note: "Women borrowers: 0.05% lower" },
          { name: "HDFC Bank", price: "From 8.40%", note: "Up to 30 years tenure" },
          { name: "ICICI Bank", price: "From 8.50%", note: "Quick digital sanction" },
        ] },
        { category: "Housing Finance Companies", items: [
          { name: "LIC Housing Finance", price: "From 8.35%", note: "Salaried & self-employed" },
          { name: "Bajaj Housing Finance", price: "From 8.45%", note: "High loan-to-value" },
        ] },
      ] }, style: { background: "light" } },
      { type: "steps", content: { eyebrow: "LOAN PROCESS", title: "Sanction in", titleHighlight: "4 Steps", items: [
        { title: "Eligibility Check", text: "Share income and existing EMIs — we tell you your realistic budget in 10 minutes.", icon: "clipboard" },
        { title: "Compare Offers", text: "Side-by-side rates, processing fees and prepayment terms from partner lenders.", icon: "trending" },
        { title: "Doorstep Documents", text: "Our executive collects KYC, salary slips and property papers from your home.", icon: "home" },
        { title: "Sanction & Disbursal", text: "We follow up with the bank until the cheque reaches the seller.", icon: "badge-check" },
      ] }, style: { layout: "cards" } },
      { type: "faq", content: { eyebrow: "LOAN FAQ", title: "Home Loan", titleHighlight: "Basics", items: [
        { q: "How much loan can I get?", a: "Banks usually lend up to 75–90% of the property value, with EMIs capped at about 50–60% of your net monthly income." },
        { q: "Do you charge for loan assistance?", a: "No. Our loan desk is free for our buyers — the lender pays us a referral fee." },
        { q: "What documents are needed?", a: "KYC, last 6 months' salary slips and bank statements, Form 16 / ITRs, and the property's agreement and approvals. We'll give you a checklist." },
      ] } },
      { type: "quoteForm", content: { title: "Check Your Loan Eligibility", subtitle: "Share your income, budget and city — our loan advisor will call with the best 3 offers.", showSidebar: true } },
    ] },
    { slug: "list-property", title: "List Your Property", isSystem: true, order: 4, sections: [
      { type: "banner", content: { title: "Sell or Rent Out", titleHighlight: "With Confidence", subtitle: "Right price, professional photos and only pre-screened buyers and tenants.", image: "", bgColor: "", imageOpacity: 35, overlayOpacity: 80 } },
      { type: "features", content: { items: [
        { icon: "tag", title: "Free Price Estimate", text: "Based on actual registered sales in your society and locality." },
        { icon: "camera", title: "Pro Photos & Video", text: "Wide-angle photos and a walkthrough video for every listing." },
        { icon: "user-check", title: "Screened Leads Only", text: "We verify budget and loan eligibility before anyone visits." },
        { icon: "clipboard", title: "Paperwork Handled", text: "Agreement, registration, society NOC and police verification." },
      ] }, style: { layout: "numbered" } },
      { type: "quoteForm", content: { title: "List Your Property", subtitle: "Locality, BHK, expected price or rent and a good time to visit — we'll call within 24 hours.", showSidebar: true }, style: { background: "light" } },
      testimonials,
    ] },
    { slug: "about", title: "About Us", isSystem: true, order: 5, sections: [
      { type: "banner", content: { title: "About", titleHighlight: biz, subtitle: `14 years helping families find, finance and own the right home in ${CITY}.`, image: "", bgColor: "", imageOpacity: 35, overlayOpacity: 80 } },
      { type: "about", content: { eyebrow: "OUR STORY", title: "A Lawyer and a Banker", titleHighlight: "Walk Into Real Estate", body: [
        `${biz} began in 2012 in a small Baner office with one belief: buying a home should feel safe, not stressful.`,
        "Today our team of 18 advisors, 2 advocates and a dedicated loan desk has helped over 2,400 families buy, sell and rent across Pune and PCMC.",
      ], image: "", points: ["MahaRERA registered agent", "In-house legal & loan teams", "Pune & PCMC coverage", "4.8★ average Google rating"], buttonLabel: "", buttonHref: "" } },
      { type: "team", content: { eyebrow: "OUR TEAM", title: "Your Property", titleHighlight: "Advisors", members: [
        { name: "Nikhil Deshpande", role: "Founder & Principal Broker", image: "", note: "Ex-banker, 18 years in housing finance" },
        { name: "Adv. Meera Joshi", role: "Head — Legal & Documentation", image: "", note: "Property law, 2,000+ title searches" },
        { name: "Faisal Sayyed", role: "Commercial Leasing Lead", image: "", note: "Offices & retail, Hinjewadi–Kharadi" },
        { name: "Ritu Agarwal", role: "NRI Desk Manager", image: "", note: "Serving clients in 14 countries" },
      ] } },
      stats,
      testimonials,
      cta,
    ] },
    { slug: "contact", title: "Contact Us", isSystem: true, order: 6, sections: [
      { type: "contactInfo", content: { eyebrow: "VISIT OR CALL", title: "Let's Find Your", titleHighlight: "Next Address", address: `Office 304, Baner Road, ${CITY}`, phone: PHONE, email: EMAIL, hours: "Mon–Sun: 10 AM – 8 PM · Site visits by appointment", mapEmbed: "" } },
      { type: "appointmentForm", content: { title: "Book a Site Visit", subtitle: "Pick a date and time — your advisor will confirm and pick you up from the nearest landmark." }, style: { background: "light" } },
      { type: "map", content: { eyebrow: "FIND US", title: "Our", titleHighlight: "Office", address: `Office 304, Baner Road, ${CITY}`, mapEmbed: "" } },
    ] },
  ],
};
