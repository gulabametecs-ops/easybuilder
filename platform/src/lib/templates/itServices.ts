import type { TemplateDef, SectionSeed } from "./types";
import type { SectionContentMap } from "../config";

// IT services & software company: deep-space navy + electric cyan & lime, Space Grotesk,
// modern header, gradient hero, engagement models, tech stack and case studies.
const PHONE = "080 6912 4410";

const cta: SectionSeed<"cta"> = {
  type: "cta",
  content: { title: "Have a product idea or a legacy system to modernise?", highlight: "Get a Free Technical Consultation", phones: [PHONE], buttonLabel: "Start a Project", buttonHref: "/start-project" },
  style: { background: "dark", layout: "split" },
};

const engagement: SectionSeed<"pricingPlans"> = {
  type: "pricingPlans",
  content: {
    eyebrow: "ENGAGEMENT MODELS", title: "Work With Us", titleHighlight: "Your Way",
    plans: [
      { name: "MVP Sprint", price: "₹4.5 L", period: "/fixed scope", features: ["8–10 week build", "Web or cross-platform app", "UI/UX design included", "1 month free support"], featured: false, buttonLabel: "Discuss MVP", buttonHref: "/start-project" },
      { name: "Dedicated Team", price: "₹2.8 L", period: "/month", features: ["2 developers + QA + PM", "Daily stand-ups, your tools", "Scale up/down monthly", "IP fully yours"], featured: true, buttonLabel: "Build My Team", buttonHref: "/start-project" },
      { name: "Cloud & Support", price: "₹60,000", period: "/month", features: ["AWS / Azure management", "24×7 monitoring & alerts", "Security patches & backups", "99.9% uptime SLA"], featured: false, buttonLabel: "Talk to Us", buttonHref: "/start-project" },
    ],
  },
  style: { background: "light", cardRadius: "lg", cardShadow: "lg" },
};

export const itServices: TemplateDef = {
  theme: {
    colors: { primary: "#0891b2", primaryDark: "#0e7490", secondary: "#020617", accent: "#a3e635", dark: "#020617", light: "#f0f9ff", text: "#334155", heading: "#020617" },
    font: "Space Grotesk", radius: "0.75rem",
  },
  header: (biz) => ({
    design: "modern",
    logoText: biz, logoImage: "",
    announcement: { show: true, text: "Now hiring: React & Node.js engineers in Bengaluru and Pune", link: "/careers" },
    topbar: { show: false, address: "HSR Layout, Bengaluru", phones: [PHONE], email: "hello@example.com", social: { facebook: "#", instagram: "#", whatsapp: "#" } },
    nav: [
      { label: "Home", href: "/" }, { label: "Services", href: "/services" }, { label: "Case Studies", href: "/case-studies" },
      { label: "Pricing", href: "/pricing" }, { label: "Careers", href: "/careers" }, { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Start a Project", href: "/start-project" },
  }),
  footer: (biz) => ({
    design: "gradient",
    about: `${biz} designs, builds and runs software for startups and enterprises — web and mobile apps, cloud, data and AI — from Bengaluru, for clients in India, the US and the Middle East.`,
    columns: [
      { title: "Services", links: [ { label: "Web & App Development", href: "/services" }, { label: "Cloud & DevOps", href: "/services" }, { label: "AI & Data", href: "/services" } ] },
      { title: "Company", links: [ { label: "Case Studies", href: "/case-studies" }, { label: "Pricing", href: "/pricing" }, { label: "Careers", href: "/careers" }, { label: "Contact", href: "/contact" } ] },
    ],
    serviceAreas: ["Bengaluru", "Pune", "Hyderabad", "Dubai", "Singapore", "USA"],
    contact: { phones: [PHONE], email: "hello@example.com", address: "HSR Layout, Bengaluru" },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. ISO 27001 certified.`,
  }),
  seo: (biz) => ({
    title: `${biz} — Software Development, Mobile Apps & Cloud Services`,
    description: "Custom web and mobile app development, SaaS products, cloud migration, DevOps and AI solutions. Dedicated teams from ₹2.8 L/month. ISO 27001 certified.",
    favicon: "", ogImage: "",
    keywords: "software development company, app development company india, web development, cloud migration, devops services, dedicated developers, saas development",
    businessType: "ProfessionalService", priceRange: "₹₹₹",
  }),
  services: [
    { category: "Build", title: "Custom Web Applications", description: "React, Next.js and Node.js platforms, portals and dashboards." },
    { category: "Build", title: "Mobile App Development", description: "Flutter and React Native apps for Android and iOS." },
    { category: "Build", title: "SaaS Product Engineering", description: "Multi-tenant SaaS, billing, analytics and admin panels." },
    { category: "Run", title: "Cloud Migration & DevOps", description: "AWS and Azure migration, CI/CD, Kubernetes and cost optimisation." },
    { category: "Run", title: "Managed Support & QA", description: "Automated testing, monitoring and 24×7 L2 support." },
    { category: "Grow", title: "AI & Data Solutions", description: "Chatbots, document AI, forecasting and BI dashboards." },
    { category: "Grow", title: "UI/UX Design", description: "Research, wireframes and design systems that convert." },
  ],
  gallery: [
    "Sprint planning", "Engineering floor, Bengaluru", "Code review", "Product dashboard we built",
    "Analytics platform", "Team workshop", "Mobile app release", "Our HSR Layout office",
  ].map((caption) => ({ category: "Work & Culture", caption })),
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "gradient", customHtml: "",
          badge: "ISO 27001 · AWS PARTNER · 140+ ENGINEERS", titleTop: "We Build Software", titleHighlight: "That Ships — and Scales",
          subtitle: "", description: `${biz} turns ideas into products and legacy systems into modern platforms. Web, mobile, cloud and AI — delivered in two-week sprints with full transparency.`, image: "",
          primaryBtn: { label: "Start a Project", href: "/start-project" }, secondaryBtn: { label: "See Case Studies", href: "/case-studies" },
          features: [
            { icon: "zap", title: "2-Week Sprints", text: "" }, { icon: "shield", title: "ISO 27001", text: "" }, { icon: "users", title: "140+ Engineers", text: "" },
          ],
        } },
        { type: "logos", content: { title: "Trusted by product teams at", items: ["FinEdge", "MediTrack", "ShopKart", "UrbanRide", "EduSpark", "LogiChain"] }, style: { spacingTop: "sm", spacingBottom: "sm" } },
        { type: "serviceCategories", content: { eyebrow: "WHAT WE DO", title: "Build, Run &", titleHighlight: "Grow", categories: ["Build", "Run", "Grow"] }, style: { layout: "tiles", cardRadius: "lg" } },
        { type: "stats", content: { items: [
          { value: "320+", label: "Projects Delivered", icon: "check" }, { value: "140+", label: "Engineers", icon: "users" },
          { value: "18", label: "Countries Served", icon: "map-pin" }, { value: "96%", label: "Client Retention", icon: "handshake" },
        ] }, style: { layout: "cards", background: "dark" } },
        { type: "about", content: {
          eyebrow: "WHY US", title: "Senior Engineers,", titleHighlight: "Zero Surprises",
          body: [`${biz} was started in 2012 by three engineers who were tired of projects that went silent for months. Every client gets a shared board, a demo every two weeks and direct access to the engineers building their product.`, "Our code is reviewed, tested and documented — and it belongs to you from day one."],
          image: "", points: ["Fortnightly demos", "Code & IP owned by you", "NDA before discovery", "Senior architect on every project"],
          buttonLabel: "Our Process", buttonHref: "/services",
        }, style: { layout: "reverse" } },
        { type: "priceList", content: { eyebrow: "TECH STACK", title: "Tools We", titleHighlight: "Master", note: "We pick the stack for your problem — not the other way round.", groups: [
          { category: "Frontend & Mobile", items: [ { name: "React / Next.js", price: "Web", note: "" }, { name: "Flutter", price: "Mobile", note: "" }, { name: "React Native", price: "Mobile", note: "" } ] },
          { category: "Backend & Data", items: [ { name: "Node.js / NestJS", price: "API", note: "" }, { name: "Python / Django", price: "API & AI", note: "" }, { name: "PostgreSQL / MySQL", price: "Data", note: "" } ] },
          { category: "Cloud & DevOps", items: [ { name: "AWS / Azure / GCP", price: "Cloud", note: "" }, { name: "Docker & Kubernetes", price: "Ops", note: "" }, { name: "GitHub Actions", price: "CI/CD", note: "" } ] },
        ] }, style: { cardRadius: "lg" } },
        engagement,
        { type: "testimonials", content: { eyebrow: "CLIENT STORIES", title: "What Founders &", titleHighlight: "CTOs Say", items: [
          { name: "Aditya Raghavan", role: "CTO, fintech startup", text: "They rebuilt our lending platform on AWS in four months with zero downtime. Our release cycle went from monthly to weekly.", rating: 5 },
          { name: "Sneha Kapoor", role: "Founder, health-tech", text: "From Figma to Play Store in 10 weeks. The team felt like our own — honest about trade-offs and fast to respond.", rating: 5 },
          { name: "Omar Al Farsi", role: "IT Director, logistics group, Dubai", text: "Their dedicated team has run our fleet platform for three years. Reliable, well documented, great communication.", rating: 5 },
        ] }, style: { layout: "dark" } },
        { type: "faq", content: { eyebrow: "FAQ", title: "Working With", titleHighlight: "Us", intro: "What clients ask before we kick off.", items: [
          { q: "Who owns the code?", a: "You do. IP and source code are assigned to you in the contract, and repositories live in your account." },
          { q: "Do you sign an NDA?", a: "Yes, before any discovery call where you share confidential details." },
          { q: "How do you estimate cost?", a: "After a free discovery call we share a scoped estimate with milestones. Fixed-price and time-and-material models are both available." },
          { q: "Can you take over an existing project?", a: "Yes. We start with a code and architecture audit, then a transition plan." },
        ] } as SectionContentMap["faq"], style: { layout: "split", background: "light" } },
        cta,
      ],
    },
    { slug: "services", title: "Services", isSystem: true, order: 1, sections: [
      { type: "banner", content: { title: "Our", titleHighlight: "Services", subtitle: "Product engineering, cloud and AI — end to end.", image: "", bgColor: "", imageOpacity: 35, overlayOpacity: 70 } },
      { type: "serviceCategories", content: { eyebrow: "SERVICES", title: "End-to-End", titleHighlight: "Engineering", categories: ["Build", "Run", "Grow"] }, style: { cardRadius: "lg" } },
      { type: "steps", content: { eyebrow: "OUR PROCESS", title: "From Idea to", titleHighlight: "Launch", items: [
        { title: "Discovery", text: "Goals, users and scope in 1–2 weeks", icon: "edit" },
        { title: "Design", text: "Clickable prototypes and architecture", icon: "layers" },
        { title: "Build", text: "Two-week sprints with live demos", icon: "zap" },
        { title: "Launch & Scale", text: "Release, monitor and improve", icon: "trending" },
      ] }, style: { layout: "default" } },
      cta,
    ] },
    { slug: "case-studies", title: "Case Studies", isSystem: true, order: 2, sections: [
      { type: "features", content: { items: [
        { icon: "trending", title: "Lending Platform · Fintech", text: "Migrated a monolith to AWS microservices; loan approval time down from 2 days to 9 minutes." },
        { icon: "heart-pulse", title: "Tele-consult App · Health-tech", text: "Flutter app with video consults and e-prescriptions; 2 lakh downloads in 6 months." },
        { icon: "truck", title: "Fleet Tracking · Logistics", text: "Real-time tracking for 4,000 trucks with route optimisation saving 11% fuel." },
        { icon: "store", title: "D2C Commerce · Retail", text: "Headless Next.js store with 1.8s page loads and 34% higher conversion." },
      ] }, style: { layout: "cards", cardRadius: "lg" } },
      { type: "gallery", content: { eyebrow: "WORK", title: "Products &", titleHighlight: "Teams" }, style: { layout: "masonry" } },
      cta,
    ] },
    { slug: "pricing", title: "Pricing", isSystem: true, order: 3, sections: [
      engagement,
      { type: "faq", content: { eyebrow: "PRICING FAQ", title: "Pricing", titleHighlight: "Questions", items: [
        { q: "Is GST included?", a: "Prices exclude 18% GST. Export of services to overseas clients is zero-rated." },
        { q: "Can I pause a dedicated team?", a: "Yes, with 30 days' notice. Knowledge transfer documents are kept up to date." },
      ] } },
      cta,
    ] },
    { slug: "careers", title: "Careers", isSystem: true, order: 4, sections: [
      { type: "priceList", content: { eyebrow: "OPEN ROLES", title: "Join the", titleHighlight: "Team", note: "Hybrid roles in Bengaluru and Pune. Send your CV through the contact form.", groups: [
        { category: "Engineering", items: [ { name: "Senior React Developer", price: "4–7 yrs", note: "Bengaluru" }, { name: "Node.js Backend Engineer", price: "3–6 yrs", note: "Pune" }, { name: "Flutter Developer", price: "2–5 yrs", note: "Bengaluru" } ] },
        { category: "Cloud, QA & Design", items: [ { name: "DevOps Engineer (AWS)", price: "3–6 yrs", note: "Remote" }, { name: "QA Automation Engineer", price: "2–4 yrs", note: "Pune" }, { name: "Product Designer", price: "3–5 yrs", note: "Bengaluru" } ] },
      ] } },
      { type: "visionMission", content: {
        eyebrow: "LIFE AT THE COMPANY",
        visionTitle: "Learn Every Sprint", visionText: "₹50,000 annual learning budget, certifications paid for and internal tech talks every Friday.",
        missionTitle: "Work That Matters", missionText: "Build products used by millions — no maintenance-only bench projects.",
        valuesTitle: "Benefits",
        values: [
          { icon: "heart-pulse", title: "Family Health Cover", text: "₹10 lakh cover for you, spouse, kids and parents." },
          { icon: "home", title: "Hybrid Work", text: "Three office days a week, flexible hours." },
          { icon: "award", title: "ESOPs", text: "Stock options for senior engineers." },
        ],
      } },
      { type: "contactForm", content: { title: "Apply Now", subtitle: "Tell us the role, your experience and a link to your CV or GitHub." } },
    ] },
    { slug: "start-project", title: "Start a Project", isSystem: true, order: 5, sections: [
      { type: "quoteForm", content: { title: "Tell Us About Your Project", subtitle: "Share your idea, timeline and budget range. A solution architect will reply within one working day with next steps.", showSidebar: true } },
    ] },
    { slug: "contact", title: "Contact Us", isSystem: true, order: 6, sections: [
      { type: "contactInfo", content: { eyebrow: "CONTACT", title: "Say", titleHighlight: "Hello", address: "HSR Layout, Bengaluru", phone: PHONE, email: "hello@example.com", hours: "Mon – Fri, 9:30 AM – 7 PM IST", mapEmbed: "" } },
      { type: "contactForm", content: { title: "Send a Message", subtitle: "Partnerships, projects or press — we reply within a day." } },
    ] },
  ],
};
