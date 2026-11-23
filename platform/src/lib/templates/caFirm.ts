import type { TemplateDef, SectionSeed } from "./types";
import type { SectionContentMap } from "../config";

// CA & tax / accounting firm: trustworthy emerald + navy, Source Sans 3, classic header,
// split hero, transparent fee card, compliance due-date calendar and partner team.
const PHONE = "022 4972 1180";

const cta: SectionSeed<"cta"> = {
  type: "cta",
  content: { title: "GST notice, ITR deadline or a new company?", highlight: "Talk to a Chartered Accountant Today", phones: [PHONE], buttonLabel: "Book a Consultation", buttonHref: "/consultation" },
  style: { background: "dark", layout: "split" },
};

const fees: SectionSeed<"priceList"> = {
  type: "priceList",
  content: {
    eyebrow: "PROFESSIONAL FEES", title: "Transparent", titleHighlight: "Fee Card",
    note: "Starting fees, exclusive of GST and government charges. Final fee depends on turnover and number of transactions.",
    groups: [
      { category: "Income Tax", items: [
        { name: "ITR – Salaried (ITR-1/2)", price: "₹1,499", note: "" },
        { name: "ITR – Business / Freelancer (ITR-3/4)", price: "₹3,999", note: "" },
        { name: "Capital Gains & NRI Returns", price: "₹5,999", note: "" },
        { name: "Income Tax Notice Reply", price: "₹4,999", note: "Per notice" },
      ] },
      { category: "GST", items: [
        { name: "GST Registration", price: "₹1,999", note: "" },
        { name: "Monthly GSTR-1 & 3B Filing", price: "₹1,500/mo", note: "Up to 100 invoices" },
        { name: "GST Annual Return (GSTR-9)", price: "₹7,500", note: "" },
        { name: "GST Audit & Reconciliation", price: "₹15,000", note: "" },
      ] },
      { category: "Company & Startup", items: [
        { name: "Private Limited Registration", price: "₹9,999", note: "Incl. DSC & DIN" },
        { name: "LLP Registration", price: "₹7,999", note: "" },
        { name: "ROC Annual Filing", price: "₹12,000", note: "" },
        { name: "Startup India & MSME Registration", price: "₹2,999", note: "" },
      ] },
      { category: "Audit & Accounting", items: [
        { name: "Monthly Bookkeeping (Tally / Zoho)", price: "₹4,000/mo", note: "" },
        { name: "Tax Audit (Section 44AB)", price: "₹25,000", note: "" },
        { name: "Statutory Audit", price: "On request", note: "" },
        { name: "Virtual CFO", price: "₹35,000/mo", note: "" },
      ] },
    ],
  },
  style: { cardRadius: "sm" },
};

const partners: SectionSeed<"team"> = {
  type: "team",
  content: { eyebrow: "OUR PARTNERS", title: "Chartered Accountants", titleHighlight: "You Can Call", members: [
    { name: "CA Rajesh Agarwal", role: "Founding Partner · FCA, DISA", image: "", note: "27 years in audit and direct tax; former member of the ICAI Direct Tax Committee." },
    { name: "CA Lakshmi Iyer", role: "Partner · GST & Indirect Tax", image: "", note: "Handles GST advisory and litigation for 300+ traders and manufacturers." },
    { name: "CA Nikhil Shah", role: "Partner · Startups & Virtual CFO", image: "", note: "Company formation, fundraising due diligence and monthly MIS for startups." },
    { name: "CA Priya Deshpande", role: "Senior Manager · NRI Taxation", image: "", note: "NRI returns, DTAA relief, property sale and repatriation." },
  ] },
  style: { cardRadius: "sm", cardShadow: "md", align: "center" },
};

export const caFirm: TemplateDef = {
  theme: {
    colors: { primary: "#047857", primaryDark: "#065f46", secondary: "#0b2239", accent: "#f59e0b", dark: "#0b2239", light: "#f0fdf4", text: "#334155", heading: "#0b2239" },
    font: "Source Sans 3", radius: "0.375rem",
  },
  header: (biz) => ({
    design: "classic",
    logoText: biz, logoImage: "",
    announcement: { show: true, text: "ITR due 31 July · Advance tax due 15 June — get your filing done early", link: "/compliance-calendar" },
    topbar: { show: true, address: "Andheri East, Mumbai · ICAI Firm Reg. No. 1XXXXXW", phones: [PHONE], email: "office@example.com", social: { facebook: "#", instagram: "#", whatsapp: "#" } },
    nav: [
      { label: "Home", href: "/" }, { label: "Services", href: "/services" }, { label: "Fees", href: "/fees" },
      { label: "Compliance Calendar", href: "/compliance-calendar" }, { label: "Our Team", href: "/team" }, { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Book a Consultation", href: "/consultation" },
  }),
  footer: (biz) => ({
    design: "classic",
    about: `${biz} is a firm of Chartered Accountants offering income tax, GST, audit, company registration and virtual CFO services to individuals, NRIs, MSMEs and startups.`,
    columns: [
      { title: "Services", links: [ { label: "Income Tax & ITR", href: "/services" }, { label: "GST", href: "/services" }, { label: "Company Registration", href: "/services" }, { label: "Audit", href: "/services" } ] },
      { title: "Firm", links: [ { label: "Fees", href: "/fees" }, { label: "Compliance Calendar", href: "/compliance-calendar" }, { label: "Our Team", href: "/team" }, { label: "Contact", href: "/contact" } ] },
    ],
    serviceAreas: ["Income Tax", "GST", "Company Registration", "Audit", "Virtual CFO", "NRI Taxation"],
    contact: { phones: [PHONE], email: "office@example.com", address: "Andheri East, Mumbai" },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}, Chartered Accountants. Information on this site is general and not professional advice.`,
  }),
  seo: (biz) => ({
    title: `${biz} — Chartered Accountants for ITR, GST, Audit & Company Registration`,
    description: "CA firm for income tax returns, GST registration and filing, tax audit, private limited registration and virtual CFO services. Transparent fees from ₹1,499.",
    favicon: "", ogImage: "",
    keywords: "chartered accountant near me, CA firm, ITR filing, GST registration, GST return filing, company registration, tax audit, virtual CFO",
    businessType: "AccountingService", priceRange: "₹₹",
  }),
  services: [
    { category: "Tax", title: "Income Tax Return Filing", description: "Salaried, business, capital gains and NRI returns, filed and verified." },
    { category: "Tax", title: "GST Registration & Returns", description: "Registration, monthly GSTR-1/3B, annual returns and reconciliation." },
    { category: "Tax", title: "Tax Notices & Assessments", description: "Replies to income tax and GST notices, scrutiny and appeals." },
    { category: "Business Setup", title: "Company & LLP Registration", description: "Private limited, LLP, OPC and partnership firms with PAN, TAN and GST." },
    { category: "Business Setup", title: "Startup & MSME Registrations", description: "Startup India, Udyam, IEC, trademarks and FSSAI." },
    { category: "Audit & Advisory", title: "Tax & Statutory Audit", description: "Section 44AB tax audits and statutory audits of companies." },
    { category: "Audit & Advisory", title: "Accounting & Bookkeeping", description: "Monthly books in Tally or Zoho, payroll, TDS and MIS reports." },
    { category: "Audit & Advisory", title: "Virtual CFO", description: "Budgeting, cash-flow planning and investor reporting for growing companies." },
  ],
  gallery: [
    "Our Andheri office", "Partners' review meeting", "GST filing desk", "Client consultation",
    "Year-end audit season", "Startup advisory session", "Document signing", "Team celebration after ITR season",
  ].map((caption) => ({ category: "Our Firm", caption })),
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "split", customHtml: "",
          badge: "CHARTERED ACCOUNTANTS · SINCE 1998", titleTop: "Tax, GST & Audit —", titleHighlight: "Handled by CAs You Can Call",
          subtitle: "", description: `${biz} files 4,000+ returns a year for salaried professionals, NRIs, traders and startups. One partner-led team for your income tax, GST, company law and audit — with fees written down before we start.`, image: "",
          primaryBtn: { label: "Book a Consultation", href: "/consultation" }, secondaryBtn: { label: "See Our Fees", href: "/fees" },
          features: [
            { icon: "shield", title: "ICAI Registered Firm", text: "" }, { icon: "tag", title: "Fixed, Written Fees", text: "" },
            { icon: "clock", title: "Deadline Reminders", text: "" }, { icon: "users", title: "Partner-Led Team", text: "" },
          ],
        } },
        { type: "stats", content: { items: [
          { value: "26 yrs", label: "In Practice", icon: "award" }, { value: "4,000+", label: "Returns Filed a Year", icon: "clipboard" },
          { value: "650+", label: "GST Clients", icon: "store" }, { value: "180+", label: "Companies Registered", icon: "building" },
        ] }, style: { layout: "band", background: "primary" } },
        { type: "serviceCategories", content: { eyebrow: "WHAT WE DO", title: "Every Compliance,", titleHighlight: "One Firm", categories: ["Tax", "Business Setup", "Audit & Advisory"] }, style: { cardRadius: "sm" } },
        { type: "about", content: {
          eyebrow: "ABOUT THE FIRM", title: "Numbers Done Right,", titleHighlight: "Explained Simply",
          body: [`${biz} was founded in 1998 by CA Rajesh Agarwal with a simple rule: every client gets a partner's phone number. Today our 4 partners and 28 staff serve clients across India and 14 countries.`, "We explain what we file, why, and what it costs — and we send reminders before every due date so you never pay a late fee."],
          image: "", points: ["Peer-reviewed by ICAI", "Data on secure, encrypted systems", "WhatsApp updates on every filing", "Same-day reply on notices"],
          buttonLabel: "Meet the Partners", buttonHref: "/team",
        } },
        fees,
        { type: "features", content: { items: [
          { icon: "clipboard", title: "Document Checklist First", text: "You get a clear list of what we need before work starts — no back-and-forth." },
          { icon: "shield", title: "Confidential by Default", text: "NDAs for businesses, encrypted storage and access only for your assigned team." },
          { icon: "clock", title: "Due-Date Reminders", text: "SMS and WhatsApp alerts 7 days before every tax, GST and ROC deadline." },
          { icon: "headset", title: "One Point of Contact", text: "A named manager plus direct access to a partner for important decisions." },
        ] }, style: { layout: "split", background: "light" } },
        { type: "testimonials", content: { eyebrow: "CLIENT REVIEWS", title: "Trusted by Families &", titleHighlight: "Businesses", items: [
          { name: "Sameer Kulkarni", role: "Director, packaging company", text: "They handled our GST audit and a scrutiny notice in the same quarter. Calm, thorough and always reachable.", rating: 5 },
          { name: "Dr. Anita Rao", role: "NRI, Dubai", text: "Selling my Pune flat from abroad felt impossible. They handled the capital gains, TDS refund and repatriation paperwork perfectly.", rating: 5 },
          { name: "Karthik Menon", role: "Founder, SaaS startup", text: "Company registration in 9 days and now our monthly virtual CFO — investors love how clean our books are.", rating: 5 },
        ] }, style: { layout: "default" } },
        { type: "faq", content: { eyebrow: "FAQ", title: "Tax &", titleHighlight: "Compliance Questions", intro: "Quick answers from our team. For your exact case, book a consultation.", items: [
          { q: "What documents do I need for ITR filing?", a: "PAN, Aadhaar, Form 16 or business accounts, bank statements, AIS/TIS and proof of deductions. We send a checklist for your case." },
          { q: "Do you work with clients outside Mumbai?", a: "Yes. Most of our clients share documents online; we meet in person only when needed." },
          { q: "How fast can you register a private limited company?", a: "Usually 7–10 working days after documents are complete, depending on MCA approvals." },
          { q: "Can you help with an income tax or GST notice?", a: "Yes. Share the notice and we'll explain it within 24 hours and quote a fixed fee for the reply." },
        ] } as SectionContentMap["faq"], style: { layout: "split" } },
        cta,
      ],
    },
    { slug: "services", title: "Services", isSystem: true, order: 1, sections: [
      { type: "banner", content: { title: "Our", titleHighlight: "Services", subtitle: "Income tax, GST, company law, audit and advisory.", image: "", bgColor: "", imageOpacity: 30, overlayOpacity: 75 } },
      { type: "serviceCategories", content: { eyebrow: "SERVICES", title: "How We", titleHighlight: "Help", categories: ["Tax", "Business Setup", "Audit & Advisory"] }, style: { layout: "list" } },
      { type: "steps", content: { eyebrow: "HOW IT WORKS", title: "From Documents to", titleHighlight: "Filed", items: [
        { title: "Free Call", text: "Understand your case in 15 minutes", icon: "phone" },
        { title: "Fixed Quote", text: "Written fee and checklist", icon: "tag" },
        { title: "We Prepare", text: "Computation shared for review", icon: "clipboard" },
        { title: "Filed & Confirmed", text: "Acknowledgement on WhatsApp", icon: "check" },
      ] }, style: { layout: "timeline", background: "light" } },
      cta,
    ] },
    { slug: "fees", title: "Fees", isSystem: true, order: 2, sections: [
      { type: "pricingPlans", content: {
        eyebrow: "RETAINER PLANS", title: "Monthly Compliance", titleHighlight: "Packages",
        plans: [
          { name: "Proprietor", price: "₹2,499", period: "/month", features: ["GST returns (up to 100 invoices)", "TDS returns", "Annual ITR", "WhatsApp support"], featured: false, buttonLabel: "Get Started", buttonHref: "/consultation" },
          { name: "Growing Business", price: "₹7,999", period: "/month", features: ["Bookkeeping in Tally / Zoho", "GST, TDS & payroll", "Quarterly MIS", "Tax audit at discounted fee"], featured: true, buttonLabel: "Get Started", buttonHref: "/consultation" },
          { name: "Private Limited", price: "₹14,999", period: "/month", features: ["Full accounting & compliance", "ROC filings & board minutes", "Statutory audit coordination", "Partner review every quarter"], featured: false, buttonLabel: "Get Started", buttonHref: "/consultation" },
        ],
      }, style: { background: "light", cardRadius: "sm", cardShadow: "md" } },
      fees,
      cta,
    ] },
    { slug: "compliance-calendar", title: "Compliance Calendar", isSystem: true, order: 3, sections: [
      { type: "openingHours", content: {
        eyebrow: "KEY DUE DATES", title: "Compliance", titleHighlight: "Calendar",
        note: "Dates as generally applicable; government extensions can change them. Clients get reminders 7 days before each date.",
        days: [
          { day: "GSTR-1 (monthly)", hours: "11th of every month" }, { day: "GSTR-3B (monthly)", hours: "20th of every month" },
          { day: "TDS payment", hours: "7th of every month" }, { day: "Advance tax instalments", hours: "15 Jun · 15 Sep · 15 Dec · 15 Mar" },
          { day: "ITR (non-audit cases)", hours: "31 July" }, { day: "Tax audit report", hours: "30 September" },
          { day: "ROC – AOC-4 / MGT-7", hours: "Within 30 / 60 days of AGM" },
        ],
      } },
      { type: "countdown", content: { eyebrow: "NEXT BIG DEADLINE", title: "Income Tax Return", titleHighlight: "Due Date", subtitle: "File early, avoid the last-week rush and late fees under Section 234F.", targetDate: "2027-07-31T23:59:00", buttonLabel: "Start My ITR", buttonHref: "/consultation" }, style: { background: "primary" } },
      cta,
    ] },
    { slug: "team", title: "Our Team", isSystem: true, order: 4, sections: [
      partners,
      { type: "gallery", content: { eyebrow: "INSIDE THE FIRM", title: "Our", titleHighlight: "Office" }, style: { layout: "grid" } },
      cta,
    ] },
    { slug: "consultation", title: "Book a Consultation", isSystem: true, order: 5, sections: [
      { type: "appointmentForm", content: { title: "Book a Consultation", subtitle: "Pick a convenient time for a 30-minute call or office visit with a CA. First call for new clients is free." } },
      { type: "features", content: { items: [
        { icon: "phone", title: "Phone or Video", text: "Consult from anywhere in India or abroad." },
        { icon: "shield", title: "Confidential", text: "Your documents stay encrypted and private." },
        { icon: "tag", title: "Fixed Quote", text: "Written fee before any work begins." },
      ] }, style: { background: "light" } },
    ] },
    { slug: "contact", title: "Contact Us", isSystem: true, order: 6, sections: [
      { type: "contactInfo", content: { eyebrow: "CONTACT", title: "Visit Our", titleHighlight: "Office", address: "Andheri East, Mumbai", phone: PHONE, email: "office@example.com", hours: "Mon – Sat, 10 AM – 7 PM", mapEmbed: "" } },
      { type: "contactForm", content: { title: "Send Your Query", subtitle: "Describe your tax or compliance need — a team member replies within one working day." } },
    ] },
  ],
};
