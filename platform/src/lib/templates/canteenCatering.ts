import type { TemplateDef, SectionSeed } from "./types";
import type { SectionContentMap } from "../config";

// Corporate & industrial canteen operator: crisp B2B steel blue + lime on slate,
// Public Sans, classic header + classic hero, compliance-led, per-head pricing.
const PHONE = "080 4718 2290";

const cta: SectionSeed<"cta"> = {
  type: "cta",
  content: { title: "Running a cafeteria for 100 or 5,000 employees?", highlight: "Book a Free Site Survey & Trial Week", phones: [PHONE], buttonLabel: "Request a Proposal", buttonHref: "/proposal" },
  style: { background: "dark" },
};

const perHead: SectionSeed<"pricingPlans"> = {
  type: "pricingPlans",
  content: {
    eyebrow: "PER-HEAD PRICING", title: "Transparent Rates,", titleHighlight: "Monthly Billing",
    plans: [
      { name: "Shop-Floor Meal", price: "₹68", period: "/head/meal", features: ["Rice, dal, sabzi, 4 rotis, buttermilk", "Min 300 meals per shift", "Shift-wise counters incl. night shift", "Weekly menu signed off by HR"], featured: false, buttonLabel: "Get Proposal", buttonHref: "/proposal" },
      { name: "Corporate Cafeteria", price: "₹145", period: "/head/day", features: ["Breakfast + lunch + evening snack", "2 cuisines daily (North & South)", "Salad bar & healthy counter", "Cashless coupons / app billing", "On-site supervisor"], featured: true, buttonLabel: "Get Proposal", buttonHref: "/proposal" },
      { name: "Executive Dining", price: "₹290", period: "/head/meal", features: ["Plated or buffet service", "Chef's live counter twice a week", "Board-room & client meals", "Dedicated steward team"], featured: false, buttonLabel: "Get Proposal", buttonHref: "/proposal" },
    ],
  },
  style: { background: "light", cardRadius: "sm", cardShadow: "md" },
};

export const canteenCatering: TemplateDef = {
  theme: {
    colors: { primary: "#1d4ed8", primaryDark: "#1e3a8a", secondary: "#0f172a", accent: "#84cc16", dark: "#0b1b33", light: "#f1f5f9", text: "#334155", heading: "#0f172a" },
    font: "Public Sans", radius: "0.375rem",
  },
  header: (biz) => ({
    design: "classic",
    logoText: biz, logoImage: "",
    announcement: { show: false, text: "", link: "" },
    topbar: { show: true, address: "Peenya Industrial Area, Bengaluru · FSSAI Central Licence · ISO 22000", phones: [PHONE], email: "contracts@example.com", social: { facebook: "#", instagram: "#", whatsapp: "#" } },
    nav: [
      { label: "Home", href: "/" }, { label: "Services", href: "/services" }, { label: "Pricing", href: "/pricing" },
      { label: "Hygiene & Compliance", href: "/compliance" }, { label: "Clients", href: "/clients" }, { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Request a Proposal", href: "/proposal" },
  }),
  footer: (biz) => ({
    design: "classic",
    about: `${biz} runs staff cafeterias and industrial canteens for offices, factories, hospitals and campuses — FSSAI and ISO 22000 certified, with per-head pricing and monthly GST billing.`,
    columns: [
      { title: "Services", links: [ { label: "Corporate Cafeterias", href: "/services" }, { label: "Factory Canteens", href: "/services" }, { label: "Pricing", href: "/pricing" } ] },
      { title: "Company", links: [ { label: "Hygiene & Compliance", href: "/compliance" }, { label: "Clients", href: "/clients" }, { label: "Request a Proposal", href: "/proposal" }, { label: "Contact", href: "/contact" } ] },
    ],
    serviceAreas: ["Bengaluru", "Hosur", "Mysuru", "Tumakuru", "Chennai", "Hyderabad"],
    contact: { phones: [PHONE], email: "contracts@example.com", address: "Peenya Industrial Area, Bengaluru" },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. Feeding India's workforce, one shift at a time.`,
  }),
  seo: (biz) => ({
    title: `${biz} — Corporate Cafeteria & Industrial Canteen Catering`,
    description: "Staff cafeteria and factory canteen management from ₹68 per head. FSSAI & ISO 22000 certified kitchens, shift-wise meals, cashless billing and monthly MIS reports.",
    favicon: "", ogImage: "",
    keywords: "canteen contractor, industrial canteen, corporate cafeteria management, factory canteen catering, employee meals, per head meal price, staff canteen",
    businessType: "FoodEstablishment", priceRange: "₹₹",
  }),
  services: [
    { category: "Corporate", title: "Corporate Cafeteria Management", description: "Breakfast, lunch and snacks for IT parks and offices, with multi-cuisine counters." },
    { category: "Corporate", title: "Pantry & Tea-Coffee Service", description: "Managed pantries, vending and tea-coffee rounds for every floor." },
    { category: "Corporate", title: "Meetings & Townhall Catering", description: "Hi-tea, working lunches and buffets for up to 2,000 people on site." },
    { category: "Industrial", title: "Factory Shift Canteens", description: "Hot meals for all three shifts, including night-shift dinners at 2 AM." },
    { category: "Industrial", title: "Central Kitchen Meal Delivery", description: "Insulated hot-case delivery for units without an on-site kitchen." },
    { category: "Institutional", title: "Hospital & Patient Diets", description: "Dietitian-planned patient meals plus staff canteen operations." },
    { category: "Institutional", title: "Campus & Hostel Mess", description: "Monthly mess contracts for colleges, training centres and hostels." },
  ],
  gallery: [
    "IT park cafeteria, Whitefield", "Lunch counters at 12:30 PM", "Central kitchen bulk cooking", "Chef team on the line",
    "South Indian breakfast counter", "Steel thali at a factory canteen", "Buffet for a townhall", "Daily hygiene audit",
  ].map((caption) => ({ category: "Sites We Run", caption })),
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "classic", customHtml: "",
          badge: "FSSAI CENTRAL LICENCE · ISO 22000 · 38 SITES", titleTop: "Canteens & Cafeterias That",
          titleHighlight: "Run Like Clockwork", subtitle: "",
          description: `${biz} manages staff food for 42,000 employees a day across offices, factories and hospitals. Fixed per-head pricing, audited hygiene and a menu your teams actually like.`, image: "",
          primaryBtn: { label: "Request a Proposal", href: "/proposal" }, secondaryBtn: { label: "See Per-Head Pricing", href: "/pricing" },
          features: [
            { icon: "shield", title: "Audited Kitchens", text: "" }, { icon: "clock", title: "24×7 Shifts", text: "" },
            { icon: "clipboard", title: "Monthly MIS", text: "" }, { icon: "users", title: "Trained Staff", text: "" },
          ],
        } },
        { type: "logos", content: { title: "Running cafeterias for", items: ["Vantage Motors", "Kaveri Textiles", "Nimbus Tech Park", "SunRise Hospitals", "Apex Pharma", "Deccan Polymers"] }, style: { spacingTop: "sm", spacingBottom: "sm" } },
        { type: "stats", content: { items: [
          { value: "42,000", label: "Meals a Day", icon: "utensils" }, { value: "38", label: "Sites Managed", icon: "building" },
          { value: "99.6%", label: "On-Time Service", icon: "clock" }, { value: "0", label: "Major Audit Findings in 2025", icon: "shield" },
        ] }, style: { layout: "band", background: "primary" } },
        { type: "serviceCategories", content: { eyebrow: "WHAT WE RUN", title: "One Partner for", titleHighlight: "Every Workplace", categories: ["Corporate", "Industrial", "Institutional"] }, style: { layout: "list" } },
        perHead,
        { type: "features", content: { items: [
          { icon: "shield", title: "FSSAI & ISO 22000", text: "Central licence, HACCP plans and third-party audits every quarter — reports shared with your admin team." },
          { icon: "clipboard", title: "Menu Committee", text: "Monthly menu reviewed with employee representatives and HR, with feedback tablets at every counter." },
          { icon: "tag", title: "Cashless Billing", text: "RFID cards, coupons or app — daily consumption reports and one monthly GST invoice." },
          { icon: "users", title: "Background-Verified Staff", text: "Police-verified, medically certified cooks and stewards in uniform, with PF and ESI compliance." },
        ] }, style: { layout: "split" } },
        { type: "about", content: {
          eyebrow: "WHY HR TEAMS SWITCH TO US", title: "We Take Food Off", titleHighlight: "Your Admin's Plate",
          body: [`${biz} was founded in 2009 by hotel-management professionals who had run kitchens for five-star chains. We bring the same discipline to staff dining: standard recipes, weighed portions and temperature logs at every counter.`, "A site manager is on your campus every day, with an escalation path to our operations head within 30 minutes."],
          image: "", points: ["Takeover within 15 days", "Kitchen design & equipment set-up", "Labour-law compliant manpower", "Daily temperature & hygiene logs"],
          buttonLabel: "Our Compliance Standards", buttonHref: "/compliance",
        } },
        { type: "steps", content: { eyebrow: "ONBOARDING", title: "From Survey to First Meal in", titleHighlight: "15 Days", items: [
          { title: "Site Survey", text: "Kitchen, headcount and shift study", icon: "clipboard" },
          { title: "Menu & Rate Card", text: "Per-head proposal with sample menu", icon: "tag" },
          { title: "Trial Week", text: "Live service with feedback tablets", icon: "utensils" },
          { title: "Full Takeover", text: "SLA-based contract and monthly MIS", icon: "handshake" },
        ] }, style: { layout: "timeline", background: "light" } },
        { type: "testimonials", content: { eyebrow: "CLIENT FEEDBACK", title: "Trusted by Admin &", titleHighlight: "HR Heads", items: [
          { name: "Ramesh Gowda", role: "Plant HR Head, auto components", text: "Three shifts, 1,800 workers and not a single late meal in two years. Canteen complaints in our union meetings have stopped completely.", rating: 5 },
          { name: "Priya Menon", role: "Facilities Lead, IT park", text: "Moving to their cashless system cut our food wastage by 22%. The monthly MIS makes my review with finance very easy.", rating: 5 },
          { name: "Dr. Suresh Rao", role: "Administrator, multi-speciality hospital", text: "Patient diets are prepared exactly to the dietitian's chart, and staff food quality has improved a lot.", rating: 5 },
        ] }, style: { layout: "minimal" } },
        { type: "faq", content: { eyebrow: "FAQ", title: "Canteen Contract", titleHighlight: "Questions", intro: "What admin, HR and procurement teams usually ask us.", items: [
          { q: "What is the minimum headcount?", a: "We take on cafeterias from 100 employees and factory canteens from 250 meals per shift." },
          { q: "Do you use our kitchen or yours?", a: "Either. We can run your on-site kitchen or deliver hot meals from our central kitchens in Peenya and Hosur." },
          { q: "How is pricing fixed?", a: "A per-head, per-meal rate agreed in the contract, revised once a year. Subsidy splits between company and employee are supported." },
          { q: "Who handles labour compliance?", a: "All staff are on our payroll with PF, ESI and minimum-wage compliance. Monthly challans are shared with you." },
        ] } as SectionContentMap["faq"], style: { layout: "split" } },
        cta,
      ],
    },
    { slug: "services", title: "Services", isSystem: true, order: 1, sections: [
      { type: "banner", content: { title: "Canteen", titleHighlight: "Services", subtitle: "Corporate cafeterias, factory canteens, hospital and campus dining.", image: "", bgColor: "", imageOpacity: 40, overlayOpacity: 70 } },
      { type: "serviceCategories", content: { eyebrow: "SERVICES", title: "Food Services for", titleHighlight: "Every Workplace", categories: ["Corporate", "Industrial", "Institutional"] } },
      { type: "priceList", content: { eyebrow: "SAMPLE DAILY MENU", title: "A Typical Day at a", titleHighlight: "Corporate Cafeteria", note: "Menus rotate on a 4-week cycle and are approved by your menu committee.", groups: [
        { category: "Breakfast · 8–10 AM", items: [ { name: "Idli, vada, sambar", price: "Included", note: "" }, { name: "Poha / upma", price: "Included", note: "" }, { name: "Eggs to order", price: "₹15 add-on", note: "" } ] },
        { category: "Lunch · 12–2:30 PM", items: [ { name: "North Indian thali", price: "Included", note: "" }, { name: "South Indian meals", price: "Included", note: "" }, { name: "Salad & healthy bowl", price: "Included", note: "" }, { name: "Chicken curry (Wed & Fri)", price: "₹35 add-on", note: "" } ] },
        { category: "Evening · 4–6 PM", items: [ { name: "Tea / filter coffee", price: "Included", note: "" }, { name: "Samosa, bajji or sprouts", price: "Included", note: "" } ] },
      ] }, style: { background: "light" } },
      { type: "imageBanner", content: { title: "Central kitchens built for scale", subtitle: "Two 15,000 sq ft kitchens with steam cooking, blast chillers and hot-case dispatch for 20,000 meals per shift.", buttonLabel: "Request a Site Visit", buttonHref: "/proposal", image: "" } },
      cta,
    ] },
    { slug: "pricing", title: "Pricing", isSystem: true, order: 2, sections: [
      { type: "banner", content: { title: "Per-Head", titleHighlight: "Pricing", subtitle: "Simple per-meal rates. GST at 5%. Subsidy splits supported.", image: "", bgColor: "", imageOpacity: 40, overlayOpacity: 70 } },
      perHead,
      { type: "features", content: { items: [
        { icon: "tag", title: "No Hidden Charges", text: "Gas, manpower and consumables are included in the per-head rate." },
        { icon: "clipboard", title: "Monthly MIS", text: "Headcount, consumption, feedback scores and wastage in one report." },
        { icon: "handshake", title: "Annual Rate Lock", text: "Rates fixed for 12 months, revised only against an agreed index." },
      ] }, style: { layout: "numbered" } },
      cta,
    ] },
    { slug: "compliance", title: "Hygiene & Compliance", isSystem: true, order: 3, sections: [
      { type: "about", content: {
        eyebrow: "HYGIENE & COMPLIANCE", title: "Food Safety Is Our", titleHighlight: "First Line Item",
        body: ["Every site follows a written HACCP plan: incoming material checks, separate veg and non-veg prep zones, cooking and holding temperature logs, and retained samples for 72 hours.", "Our in-house food safety team audits each site monthly, and an independent auditor visits every quarter."],
        image: "", points: ["FSSAI Central Licence", "ISO 22000:2018 certified", "Monthly medical checks for staff", "Pest control & water testing"],
        buttonLabel: "Request Audit Reports", buttonHref: "/contact",
      } },
      { type: "stats", content: { items: [
        { value: "4×", label: "Third-Party Audits a Year", icon: "badge-check" }, { value: "72 hrs", label: "Food Samples Retained", icon: "clock" },
        { value: "100%", label: "Staff Medically Certified", icon: "user-check" }, { value: "ISO 22000", label: "Certified Since 2015", icon: "award" },
      ] }, style: { layout: "cards", background: "light" } },
      cta,
    ] },
    { slug: "clients", title: "Clients", isSystem: true, order: 4, sections: [
      { type: "logos", content: { title: "Some of the teams we feed", items: ["Vantage Motors", "Kaveri Textiles", "Nimbus Tech Park", "SunRise Hospitals", "Apex Pharma", "Deccan Polymers", "Orbit Logistics", "Greenfield Campus"] } },
      { type: "gallery", content: { eyebrow: "SITES", title: "Cafeterias &", titleHighlight: "Canteens We Run" }, style: { layout: "grid" } },
      { type: "testimonials", content: { eyebrow: "REFERENCES", title: "Long-Term", titleHighlight: "Partners", items: [
        { name: "Kavitha Narayan", role: "Admin Manager, pharma plant", text: "They have run our 1,200-person canteen for 7 years. The audit scores keep improving every year.", rating: 5 },
        { name: "Imran Pasha", role: "Procurement, logistics company", text: "Clear contracts, on-time invoices and no labour headaches. Exactly what we wanted from a vendor.", rating: 5 },
      ] }, style: { layout: "default" } },
      cta,
    ] },
    { slug: "proposal", title: "Request a Proposal", isSystem: true, order: 5, sections: [
      { type: "quoteForm", content: { title: "Request a Canteen Proposal", subtitle: "Share your site location, headcount per shift, meals required and whether you have an on-site kitchen. Our team will schedule a site survey within 48 hours.", showSidebar: true } },
    ] },
    { slug: "contact", title: "Contact Us", isSystem: true, order: 6, sections: [
      { type: "contactInfo", content: { eyebrow: "CONTACT", title: "Talk to Our", titleHighlight: "Contracts Team", address: "Peenya Industrial Area, Bengaluru", phone: PHONE, email: "contracts@example.com", hours: "Office: Mon – Sat, 9 AM – 6 PM · Operations 24×7", mapEmbed: "" } },
      { type: "map", content: { eyebrow: "HEAD OFFICE", title: "Visit Our", titleHighlight: "Central Kitchen", address: "Peenya Industrial Area, Bengaluru", mapEmbed: "" } },
      { type: "contactForm", content: { title: "Send an Enquiry", subtitle: "Vendor registration, tenders or general questions — we reply within one working day." } },
    ] },
  ],
};
