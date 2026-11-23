import type { TemplateDef, SectionSeed } from "./types";
import type { SectionContentMap } from "../config";

// Business / management consulting: understated deep teal + brass on stone, Inter Tight,
// classic header, minimal light hero, approach & engagement formats, partner bios.
const PHONE = "022 6188 9045";

const cta: SectionSeed<"cta"> = {
  type: "cta",
  content: { title: "Growth stalled, margins shrinking or planning the next stage?", highlight: "Book a Strategy Session With a Partner", phones: [PHONE], buttonLabel: "Book a Session", buttonHref: "/strategy-session" },
  style: { background: "dark", layout: "minimal" },
};

const partners: SectionSeed<"team"> = {
  type: "team",
  content: { eyebrow: "PARTNERS", title: "Operators Who've", titleHighlight: "Run Businesses", members: [
    { name: "Anand Krishnan", role: "Managing Partner · Strategy", image: "", note: "Former strategy head at a listed FMCG company; IIM Ahmedabad." },
    { name: "Ritu Bhandari", role: "Partner · Operations & Supply Chain", image: "", note: "20 years in lean manufacturing and supply-chain transformation." },
    { name: "Farah Siddiqui", role: "Partner · Finance & M&A", image: "", note: "Chartered Accountant; led 30+ fundraises and acquisitions for mid-market firms." },
    { name: "Rahul Mehta", role: "Principal · Family Business & Governance", image: "", note: "Advises second- and third-generation family businesses on succession." },
  ] },
  style: { layout: "list" },
};

export const businessConsulting: TemplateDef = {
  theme: {
    colors: { primary: "#115e59", primaryDark: "#134e4a", secondary: "#0b1514", accent: "#c8a24a", dark: "#0b1514", light: "#f5f5f0", text: "#3f3f46", heading: "#0b1514" },
    font: "Inter Tight", radius: "0.25rem",
  },
  header: (biz) => ({
    design: "classic",
    logoText: biz, logoImage: "",
    announcement: { show: false, text: "", link: "" },
    topbar: { show: true, address: "Nariman Point, Mumbai · Delhi · Bengaluru", phones: [PHONE], email: "partners@example.com", social: { facebook: "#", instagram: "#", whatsapp: "#" } },
    nav: [
      { label: "Home", href: "/" }, { label: "Services", href: "/services" }, { label: "Our Approach", href: "/approach" },
      { label: "Case Studies", href: "/case-studies" }, { label: "Partners", href: "/partners" }, { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Book a Session", href: "/strategy-session" },
  }),
  footer: (biz) => ({
    design: "modern",
    about: `${biz} is a management consulting firm for Indian mid-market companies and family businesses — strategy, operations, finance and organisation design, delivered by former operators.`,
    columns: [
      { title: "Services", links: [ { label: "Growth Strategy", href: "/services" }, { label: "Operations Excellence", href: "/services" }, { label: "Finance & M&A", href: "/services" } ] },
      { title: "Firm", links: [ { label: "Our Approach", href: "/approach" }, { label: "Case Studies", href: "/case-studies" }, { label: "Partners", href: "/partners" }, { label: "Contact", href: "/contact" } ] },
    ],
    serviceAreas: ["Mumbai", "Delhi NCR", "Bengaluru", "Ahmedabad", "Pune", "Chennai"],
    contact: { phones: [PHONE], email: "partners@example.com", address: "Nariman Point, Mumbai" },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. All rights reserved.`,
  }),
  seo: (biz) => ({
    title: `${biz} — Management Consulting for Mid-Market & Family Businesses`,
    description: "Strategy, operations excellence, finance and M&A, and family business governance for Indian mid-market companies. Former operators, measurable outcomes.",
    favicon: "", ogImage: "",
    keywords: "management consulting india, business consultant mumbai, strategy consulting, family business consulting, operations consulting, msme consultant, m&a advisory",
    businessType: "ProfessionalService", priceRange: "₹₹₹",
  }),
  services: [
    { category: "Strategy", title: "Growth Strategy", description: "Market entry, new product lines and a 3-year plan the team believes in." },
    { category: "Strategy", title: "Pricing & Profitability", description: "SKU, customer and channel profitability with pricing that holds margin." },
    { category: "Operations", title: "Operations Excellence", description: "Lean, inventory and supply-chain programmes that free up cash." },
    { category: "Operations", title: "Digital Transformation", description: "ERP, CRM and dashboards chosen and rolled out with your people." },
    { category: "Finance & Governance", title: "Fundraising & M&A Advisory", description: "Investor readiness, valuation, deal structuring and due diligence." },
    { category: "Finance & Governance", title: "Family Business Governance", description: "Family constitutions, boards and succession planning." },
    { category: "Finance & Governance", title: "Organisation & Performance", description: "Structure, roles, KPIs and incentive design." },
  ],
  gallery: [
    "Strategy workshop", "Board presentation", "Analytics review", "Partner meeting",
    "Client offsite", "Planning session", "Our Mumbai office", "Leadership alignment day",
  ].map((caption) => ({ category: "Engagements", caption })),
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "minimal", customHtml: "",
          badge: "STRATEGY · OPERATIONS · FINANCE", titleTop: "Clarity for Leaders.", titleHighlight: "Results for Businesses.",
          subtitle: "", description: `${biz} helps ₹50–2,000 crore companies grow profitably — with consultants who have run P&Ls themselves and stay until results show up.`, image: "",
          primaryBtn: { label: "Book a Strategy Session", href: "/strategy-session" }, secondaryBtn: { label: "See Case Studies", href: "/case-studies" },
          features: [
            { icon: "trending", title: "Outcome-Linked Fees", text: "" }, { icon: "users", title: "Former Operators", text: "" }, { icon: "shield", title: "Strictly Confidential", text: "" },
          ],
        } },
        { type: "logos", content: { title: "Advising leadership teams at", items: ["Vardhman Textiles Group", "Coastal Seafoods", "Apex Auto Components", "Kiran Pharma", "BlueSky Retail", "Sundaram Agro"] }, style: { spacingTop: "sm", spacingBottom: "sm" } },
        { type: "imageBanner", content: { title: "Strategy that leaves the boardroom", subtitle: "Every recommendation comes with an owner, a 90-day plan and a dashboard to track it.", buttonLabel: "Our Approach", buttonHref: "/approach", image: "" } },
        { type: "serviceCategories", content: { eyebrow: "SERVICES", title: "Where We", titleHighlight: "Add Value", categories: ["Strategy", "Operations", "Finance & Governance"] }, style: { layout: "default", cardRadius: "none" } },
        { type: "stats", content: { items: [
          { value: "140+", label: "Engagements", icon: "clipboard" }, { value: "₹1,100 Cr", label: "Value Unlocked for Clients", icon: "trending" },
          { value: "16", label: "Industries", icon: "factory" }, { value: "70%", label: "Repeat Clients", icon: "handshake" },
        ] }, style: { layout: "minimal", background: "light" } },
        { type: "about", content: {
          eyebrow: "WHY US", title: "Advice From People Who've", titleHighlight: "Been in Your Chair",
          body: [`${biz} was founded in 2013 by leaders from FMCG, manufacturing and finance. We work with promoters and CEOs of growing Indian companies — not with slides, but alongside your team.`, "Part of our fee is linked to agreed outcomes, so our incentives match yours."],
          image: "", points: ["Partner on every engagement", "Outcome-linked fee options", "Implementation support", "NDA before discovery"],
          buttonLabel: "Meet the Partners", buttonHref: "/partners",
        }, style: { layout: "reverse" } },
        { type: "pricingPlans", content: {
          eyebrow: "ENGAGEMENT FORMATS", title: "Start Small,", titleHighlight: "Scale With Results",
          plans: [
            { name: "Diagnostic", price: "₹4.5 L", period: "/3 weeks", features: ["Interviews & data review", "Top 5 value levers", "Board-ready report", "Fee adjusted if you continue"], featured: false, buttonLabel: "Start a Diagnostic", buttonHref: "/strategy-session" },
            { name: "Transformation", price: "From ₹12 L", period: "/month", features: ["3–9 month programme", "Partner + 3 consultants", "Weekly steering meetings", "Part fee linked to outcomes"], featured: true, buttonLabel: "Discuss a Programme", buttonHref: "/strategy-session" },
            { name: "CEO Advisory", price: "₹2.5 L", period: "/month", features: ["Monthly sessions with a partner", "Board meeting preparation", "On-call advice", "Quarterly strategy review"], featured: false, buttonLabel: "Enquire", buttonHref: "/strategy-session" },
          ],
        }, style: { cardRadius: "none", cardShadow: "md" } },
        { type: "testimonials", content: { eyebrow: "CLIENT VOICES", title: "From Promoters &", titleHighlight: "CEOs", items: [
          { name: "Vinod Agarwal", role: "MD, textile group", text: "Their inventory programme released ₹38 crore of working capital in nine months. They worked on our shop floor, not just in our boardroom.", rating: 5 },
          { name: "Lakshmi Sundaram", role: "Second-generation promoter, agro business", text: "The family constitution they helped us draft has made decisions faster and conversations easier.", rating: 5 },
          { name: "Deepak Rao", role: "CEO, auto components", text: "Pricing and SKU work added 3.2 points of EBITDA margin in a year. Clear, practical, no jargon.", rating: 5 },
        ] }, style: { layout: "minimal" } },
        { type: "faq", content: { eyebrow: "FAQ", title: "Working", titleHighlight: "Together", intro: "How engagements usually work.", items: [
          { q: "What size of company do you work with?", a: "Mostly companies with ₹50 crore to ₹2,000 crore revenue, including family-owned businesses and PE-backed firms." },
          { q: "How long is a typical engagement?", a: "Diagnostics take 3 weeks; transformation programmes run 3–9 months." },
          { q: "Do you help with implementation?", a: "Yes. We stay through implementation with weekly reviews until results are visible." },
          { q: "How is confidentiality handled?", a: "We sign NDAs before discovery and never share client data or names without written consent." },
        ] } as SectionContentMap["faq"], style: { layout: "split", background: "light" } },
        cta,
      ],
    },
    { slug: "services", title: "Services", isSystem: true, order: 1, sections: [
      { type: "banner", content: { title: "Consulting", titleHighlight: "Services", subtitle: "Strategy, operations, finance and governance for growing companies.", image: "", bgColor: "", imageOpacity: 35, overlayOpacity: 70 } },
      { type: "serviceCategories", content: { eyebrow: "SERVICES", title: "How We", titleHighlight: "Help", categories: ["Strategy", "Operations", "Finance & Governance"] }, style: { layout: "list" } },
      cta,
    ] },
    { slug: "approach", title: "Our Approach", isSystem: true, order: 2, sections: [
      { type: "visionMission", content: {
        eyebrow: "OUR APPROACH",
        visionTitle: "Diagnose Before Prescribing", visionText: "Every engagement starts with data and conversations across your shop floor, sales team and customers.",
        missionTitle: "Implement, Then Leave", missionText: "We build capability in your team so improvements continue after we're gone.",
        valuesTitle: "Principles",
        values: [
          { icon: "check", title: "Evidence First", text: "Recommendations backed by your own numbers." },
          { icon: "users", title: "Your Team, Our Coaching", text: "Owners from your side for every initiative." },
          { icon: "trending", title: "Measured Outcomes", text: "Agreed KPIs tracked weekly." },
        ],
      } },
      { type: "steps", content: { eyebrow: "HOW AN ENGAGEMENT RUNS", title: "Four Phases,", titleHighlight: "One Scorecard", items: [
        { title: "Diagnose", text: "3 weeks of data and interviews", icon: "clipboard" },
        { title: "Design", text: "Initiatives, owners and targets", icon: "edit" },
        { title: "Deliver", text: "Weekly sprints with your team", icon: "zap" },
        { title: "Sustain", text: "Dashboards and handover", icon: "shield" },
      ] }, style: { layout: "default" } },
      cta,
    ] },
    { slug: "case-studies", title: "Case Studies", isSystem: true, order: 3, sections: [
      { type: "features", content: { items: [
        { icon: "factory", title: "Textiles · Working Capital", text: "Inventory days down from 142 to 88, releasing ₹38 crore in nine months." },
        { icon: "tag", title: "Auto Components · Pricing", text: "SKU rationalisation and price resets added 3.2 points of EBITDA margin." },
        { icon: "store", title: "Retail · Expansion Strategy", text: "Store format and city prioritisation for 60 new stores with 22-month payback." },
        { icon: "handshake", title: "Agro · Succession", text: "Family constitution and professional board for a third-generation business." },
      ] }, style: { layout: "split" } },
      { type: "gallery", content: { eyebrow: "IN THE FIELD", title: "Engagements", titleHighlight: "in Action" }, style: { layout: "grid" } },
      cta,
    ] },
    { slug: "partners", title: "Partners", isSystem: true, order: 4, sections: [
      partners,
      cta,
    ] },
    { slug: "strategy-session", title: "Book a Strategy Session", isSystem: true, order: 5, sections: [
      { type: "appointmentForm", content: { title: "Book a Strategy Session", subtitle: "A 60-minute confidential conversation with a partner about your business priorities. No cost, no obligation." } },
    ] },
    { slug: "contact", title: "Contact Us", isSystem: true, order: 6, sections: [
      { type: "contactInfo", content: { eyebrow: "CONTACT", title: "Get in", titleHighlight: "Touch", address: "Nariman Point, Mumbai", phone: PHONE, email: "partners@example.com", hours: "Mon – Fri, 9:30 AM – 6:30 PM", mapEmbed: "" } },
      { type: "contactForm", content: { title: "Send an Enquiry", subtitle: "Tell us a little about your company and what you'd like to discuss." } },
    ] },
  ],
};
