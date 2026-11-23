import type { TemplateDef, SectionSeed } from "./types";
import type { SectionContentMap } from "../config";

// HR, recruitment & staffing agency: friendly indigo + tangerine on lavender, Nunito Sans,
// minimal header, slideshow hero (employers / candidates), live openings and hiring plans.
const PHONE = "020 6745 3310";

const cta: SectionSeed<"cta"> = {
  type: "cta",
  content: { title: "Hiring 1 person or 100?", highlight: "Get Shortlisted Profiles in 72 Hours", phones: [PHONE], buttonLabel: "Hire Talent", buttonHref: "/hire" },
  style: { background: "dark" },
};

const openings: SectionSeed<"priceList"> = {
  type: "priceList",
  content: {
    eyebrow: "CURRENT OPENINGS", title: "Jobs Hiring", titleHighlight: "This Week",
    note: "Salary ranges are annual CTC. Never pay anyone to get a job — our services are free for candidates.",
    groups: [
      { category: "IT & Tech", items: [
        { name: "Java Developer · Pune", price: "₹8–14 LPA", note: "3–6 yrs" },
        { name: "Data Analyst · Bengaluru", price: "₹6–10 LPA", note: "2–4 yrs" },
        { name: "IT Support Engineer · Pune", price: "₹3.5–5 LPA", note: "1–3 yrs" },
      ] },
      { category: "Sales & Operations", items: [
        { name: "Area Sales Manager · Nashik", price: "₹7–9 LPA", note: "5+ yrs FMCG" },
        { name: "Customer Support (Hindi/English)", price: "₹2.6–3.4 LPA", note: "Freshers OK" },
        { name: "Warehouse Supervisor · Chakan", price: "₹3.6–4.8 LPA", note: "" },
      ] },
      { category: "Manufacturing", items: [
        { name: "Production Engineer · Ranjangaon", price: "₹4–6 LPA", note: "Diploma/BE" },
        { name: "Quality Inspector (Auto)", price: "₹3–4.2 LPA", note: "" },
        { name: "CNC/VMC Operator · 40 positions", price: "₹2.4–3.2 LPA", note: "ITI" },
      ] },
    ],
  },
  style: { cardRadius: "md" },
};

const plans: SectionSeed<"pricingPlans"> = {
  type: "pricingPlans",
  content: {
    eyebrow: "FOR EMPLOYERS", title: "Hiring Plans That", titleHighlight: "Fit Your Growth",
    plans: [
      { name: "Permanent Hiring", price: "8.33%", period: "of annual CTC", features: ["Pay only on joining", "90-day free replacement", "Screened & assessed shortlists", "All functions up to mid-level"], featured: false, buttonLabel: "Hire Now", buttonHref: "/hire" },
      { name: "Bulk & Volume Hiring", price: "₹6,500", period: "/hire", features: ["20+ positions per drive", "Walk-in & campus drives", "Document & reference checks", "Joining tracker"], featured: true, buttonLabel: "Plan a Drive", buttonHref: "/hire" },
      { name: "Contract Staffing", price: "8%", period: "service fee on payroll", features: ["Staff on our payroll", "PF, ESI & compliance handled", "Scale up or down monthly", "Attendance & payroll reports"], featured: false, buttonLabel: "Get Staff", buttonHref: "/hire" },
    ],
  },
  style: { background: "light", cardRadius: "md", cardShadow: "md" },
};

export const hrStaffing: TemplateDef = {
  theme: {
    colors: { primary: "#4338ca", primaryDark: "#3730a3", secondary: "#1e1b4b", accent: "#f97316", dark: "#1e1b4b", light: "#eef2ff", text: "#3f3f46", heading: "#1e1b4b" },
    font: "Nunito Sans", radius: "0.75rem",
  },
  header: (biz) => ({
    design: "minimal",
    logoText: biz, logoImage: "",
    announcement: { show: true, text: "Walk-in drive this Saturday: 60 openings for customer support & warehouse roles", link: "/jobs" },
    topbar: { show: true, address: "Baner, Pune · Licensed recruitment agency", phones: [PHONE], email: "talent@example.com", social: { facebook: "#", instagram: "#", whatsapp: "#" } },
    nav: [
      { label: "Home", href: "/" }, { label: "For Employers", href: "/employers" }, { label: "Find Jobs", href: "/jobs" },
      { label: "Industries", href: "/industries" }, { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Hire Talent", href: "/hire" },
  }),
  footer: (biz) => ({
    design: "minimal",
    about: `${biz} helps companies hire permanent, contract and bulk staff across IT, manufacturing, sales and operations — and helps job seekers find the right role, free of charge.`,
    columns: [
      { title: "Employers", links: [ { label: "Hiring Plans", href: "/employers" }, { label: "Industries", href: "/industries" }, { label: "Hire Talent", href: "/hire" } ] },
      { title: "Candidates", links: [ { label: "Current Openings", href: "/jobs" }, { label: "Submit Your CV", href: "/jobs" }, { label: "Contact", href: "/contact" } ] },
    ],
    serviceAreas: ["Pune", "Mumbai", "Nashik", "Aurangabad", "Bengaluru", "Hyderabad"],
    contact: { phones: [PHONE], email: "talent@example.com", address: "Baner, Pune" },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. We never charge candidates for jobs.`,
  }),
  seo: (biz) => ({
    title: `${biz} — Recruitment, Staffing & HR Services in Pune`,
    description: "Permanent recruitment, bulk hiring and contract staffing for IT, manufacturing, sales and operations. Shortlists in 72 hours. Free job placement for candidates.",
    favicon: "", ogImage: "",
    keywords: "recruitment agency pune, placement consultancy, staffing company, contract staffing, bulk hiring, manpower agency, jobs in pune, hr consultancy",
    businessType: "EmploymentAgency", priceRange: "₹₹",
  }),
  services: [
    { category: "Hiring", title: "Permanent Recruitment", description: "Mid-level and specialist hiring with screened, interview-ready shortlists." },
    { category: "Hiring", title: "Bulk & Volume Hiring", description: "Walk-in, campus and online drives for 20 to 500 positions." },
    { category: "Hiring", title: "Executive Search", description: "Confidential search for CXO, plant head and senior leadership roles." },
    { category: "Staffing", title: "Contract Staffing", description: "Temporary and project staff on our payroll with full compliance." },
    { category: "Staffing", title: "Payroll & Compliance", description: "Payroll processing, PF, ESI, PT and labour-law compliance." },
    { category: "HR Advisory", title: "Background Verification", description: "Education, employment, address and criminal record checks." },
    { category: "HR Advisory", title: "HR Policies & Training", description: "Handbooks, POSH compliance and manager training workshops." },
  ],
  gallery: [
    "Walk-in drive in Pune", "Interview panel", "Candidate assessment", "Our recruitment team",
    "Campus placement day", "Client hiring workshop", "Onboarding session", "Team celebration",
  ].map((caption) => ({ category: "On the Job", caption })),
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "slideshow", customHtml: "",
          badge: "12,000+ PLACEMENTS · 400+ EMPLOYERS", titleTop: "The Right People,", titleHighlight: "Hired Faster",
          subtitle: "", description: `${biz} sources, screens and onboards talent for growing companies — and helps job seekers land roles that fit.`, image: "",
          primaryBtn: { label: "Hire Talent", href: "/hire" }, secondaryBtn: { label: "Find a Job", href: "/jobs" },
          features: [ { icon: "users", title: "12,000+ Placed", text: "" }, { icon: "clock", title: "72-Hour Shortlists", text: "" }, { icon: "shield", title: "Verified Candidates", text: "" } ],
          slides: [
            { titleTop: "The Right People,", titleHighlight: "Hired Faster", description: "Screened, interview-ready shortlists in 72 hours — for one role or a hundred.", image: "", primaryBtn: { label: "Hire Talent", href: "/hire" }, secondaryBtn: { label: "Hiring Plans", href: "/employers" } },
            { titleTop: "Looking for a Job?", titleHighlight: "We're Free for Candidates", description: "Upload your CV once and our recruiters match you to openings across Pune, Mumbai and Bengaluru.", image: "", primaryBtn: { label: "See Openings", href: "/jobs" }, secondaryBtn: { label: "Contact a Recruiter", href: "/contact" } },
            { titleTop: "Contract Staff,", titleHighlight: "Zero Compliance Worries", description: "We handle payroll, PF, ESI and attendance — you focus on the work.", image: "", primaryBtn: { label: "Get Contract Staff", href: "/hire" }, secondaryBtn: { label: "Industries", href: "/industries" } },
          ],
        } },
        { type: "logos", content: { title: "Hiring partner for", items: ["Sahyadri Auto Parts", "Nexa Infotech", "GreenLeaf FMCG", "Prime Logistics", "MedPlus Hospitals", "Orion BPO"] }, style: { spacingTop: "sm", spacingBottom: "sm" } },
        { type: "stats", content: { items: [
          { value: "12,000+", label: "Candidates Placed", icon: "user-check" }, { value: "400+", label: "Employers", icon: "building" },
          { value: "72 hrs", label: "Average Shortlist Time", icon: "clock" }, { value: "91%", label: "90-Day Retention", icon: "thumbs-up" },
        ] }, style: { layout: "cards", background: "light" } },
        { type: "serviceCategories", content: { eyebrow: "FOR EMPLOYERS", title: "Hiring, Staffing &", titleHighlight: "HR Support", categories: ["Hiring", "Staffing", "HR Advisory"] }, style: { cardRadius: "md" } },
        openings,
        { type: "about", content: {
          eyebrow: "WHO WE ARE", title: "Recruiters Who Know", titleHighlight: "Your Industry",
          body: [`${biz} was founded in 2010 by HR leaders from manufacturing and IT. Our 45 recruiters each specialise in one industry, so they speak your hiring manager's language.`, "Every candidate is screened by phone, assessed for skills and reference-checked before you see the profile."],
          image: "", points: ["Industry-specialist recruiters", "Skill tests before shortlisting", "90-day replacement guarantee", "No fees for candidates — ever"],
          buttonLabel: "Hiring Plans", buttonHref: "/employers",
        }, style: { layout: "split" } },
        plans,
        { type: "testimonials", content: { eyebrow: "WHAT PEOPLE SAY", title: "Employers &", titleHighlight: "Candidates", items: [
          { name: "Sanjay Patil", role: "HR Head, auto components plant", text: "They closed 120 operator and supervisor positions for our new line in five weeks. Joining rate was above 85%.", rating: 5 },
          { name: "Neha Joshi", role: "Placed as Data Analyst", text: "My recruiter prepared me for every round and negotiated a better offer. And I didn't pay a rupee.", rating: 5 },
          { name: "Arvind Menon", role: "Founder, SaaS startup", text: "Our first 15 engineers came through them. Great culture fit and very honest feedback on candidates.", rating: 5 },
        ] }, style: { layout: "featured" } },
        { type: "faq", content: { eyebrow: "FAQ", title: "Hiring &", titleHighlight: "Job Questions", intro: "For employers and job seekers.", items: [
          { q: "Do candidates pay any fee?", a: "Never. Our fees are paid only by employers. If anyone asks you for money in our name, please report it to us." },
          { q: "When do employers pay?", a: "For permanent hiring, only after the candidate joins. Contract staffing is billed monthly." },
          { q: "What if a hire leaves early?", a: "We replace them free of charge if they leave within 90 days of joining." },
          { q: "Which cities do you hire for?", a: "Mainly Pune, Mumbai, Nashik and Bengaluru, with pan-India sourcing for specialist roles." },
        ] } as SectionContentMap["faq"], style: { layout: "split", background: "light" } },
        cta,
      ],
    },
    { slug: "employers", title: "For Employers", isSystem: true, order: 1, sections: [
      { type: "banner", content: { title: "For", titleHighlight: "Employers", subtitle: "Permanent, bulk and contract hiring with compliance handled.", image: "", bgColor: "", imageOpacity: 35, overlayOpacity: 70 } },
      plans,
      { type: "steps", content: { eyebrow: "OUR PROCESS", title: "Hiring in", titleHighlight: "4 Steps", items: [
        { title: "Brief", text: "Role, skills, budget and culture", icon: "clipboard" },
        { title: "Source & Screen", text: "Database, job boards and referrals", icon: "users" },
        { title: "Shortlist in 72 hrs", text: "Assessed, interview-ready profiles", icon: "user-check" },
        { title: "Offer & Onboard", text: "Negotiation and joining follow-up", icon: "handshake" },
      ] }, style: { layout: "timeline" } },
      cta,
    ] },
    { slug: "jobs", title: "Find Jobs", isSystem: true, order: 2, sections: [
      openings,
      { type: "contactForm", content: { title: "Submit Your CV", subtitle: "Share your name, role you want, experience and a link to your CV. A recruiter will call you for matching openings." } },
      { type: "features", content: { items: [
        { icon: "shield", title: "100% Free", text: "We never charge candidates." },
        { icon: "user-check", title: "Interview Prep", text: "Mock interviews and tips for every round." },
        { icon: "handshake", title: "Offer Support", text: "Help with salary negotiation and joining." },
      ] }, style: { background: "light" } },
    ] },
    { slug: "industries", title: "Industries", isSystem: true, order: 3, sections: [
      { type: "features", content: { items: [
        { icon: "factory", title: "Manufacturing & Auto", text: "Engineers, supervisors, operators and quality staff for plants around Pune." },
        { icon: "graduation", title: "IT & Software", text: "Developers, testers, data and support roles for product and services firms." },
        { icon: "truck", title: "Logistics & Warehousing", text: "Warehouse, delivery and supply-chain teams at scale." },
        { icon: "heart-pulse", title: "Healthcare", text: "Nurses, technicians and front-office staff for hospitals and labs." },
        { icon: "store", title: "Retail & FMCG", text: "Sales, merchandising and store teams across Maharashtra." },
        { icon: "headset", title: "BPO & Customer Support", text: "Voice and non-voice teams in Hindi, English and Marathi." },
      ] }, style: { layout: "cards", cardRadius: "md" } },
      { type: "gallery", content: { eyebrow: "ON THE GROUND", title: "Drives &", titleHighlight: "Placements" }, style: { layout: "grid" } },
      cta,
    ] },
    { slug: "hire", title: "Hire Talent", isSystem: true, order: 4, sections: [
      { type: "quoteForm", content: { title: "Share Your Hiring Need", subtitle: "Tell us the roles, number of positions, location and budget. An account manager will call within 4 working hours.", showSidebar: true } },
    ] },
    { slug: "contact", title: "Contact Us", isSystem: true, order: 5, sections: [
      { type: "contactInfo", content: { eyebrow: "CONTACT", title: "Talk to a", titleHighlight: "Recruiter", address: "Baner, Pune", phone: PHONE, email: "talent@example.com", hours: "Mon – Sat, 9:30 AM – 6:30 PM", mapEmbed: "" } },
      { type: "map", content: { eyebrow: "OFFICE", title: "Visit", titleHighlight: "Us", address: "Baner, Pune", mapEmbed: "" } },
    ] },
  ],
};
