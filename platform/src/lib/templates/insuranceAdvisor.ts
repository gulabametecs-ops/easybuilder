import type { TemplateDef, SectionSeed } from "./types";
import type { SectionContentMap } from "../config";

// Insurance & financial advisor: calm ocean blue + marigold on sky white, Hind,
// bold header, classic hero, needs-based plans, claim support and a regulatory disclaimer.
const PHONE = "98450 26139";
const DISCLAIMER = "Insurance is the subject matter of solicitation. Mutual fund investments are subject to market risks; read all scheme-related documents carefully. Past performance is not indicative of future returns. Premiums and returns shown are illustrative only and depend on age, health, insurer and plan. We are an AMFI-registered mutual fund distributor and IRDAI-licensed insurance advisor, not an investment adviser; product details and registration numbers are available on request.";

const cta: SectionSeed<"cta"> = {
  type: "cta",
  content: { title: "Not sure if your family is covered enough?", highlight: "Get a Free Insurance & Goal Review", phones: [PHONE], buttonLabel: "Book a Free Review", buttonHref: "/free-review" },
  style: { background: "primary" },
};

export const insuranceAdvisor: TemplateDef = {
  theme: {
    colors: { primary: "#0369a1", primaryDark: "#075985", secondary: "#0c2a3f", accent: "#f59e0b", dark: "#0c2a3f", light: "#f0f9ff", text: "#334155", heading: "#0c2a3f" },
    font: "Hind", radius: "0.625rem",
  },
  header: (biz) => ({
    design: "bold",
    logoText: biz, logoImage: "",
    announcement: { show: true, text: "Tax-saving season: review your 80C & 80D investments before 31 March", link: "/free-review" },
    topbar: { show: true, address: "Jayanagar, Bengaluru · IRDAI licensed · AMFI registered (ARN)", phones: [PHONE], email: "care@example.com", social: { facebook: "#", instagram: "#", whatsapp: "#" } },
    nav: [
      { label: "Home", href: "/" }, { label: "Insurance", href: "/insurance" }, { label: "Investments", href: "/investments" },
      { label: "Claim Support", href: "/claims" }, { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Free Review", href: "/free-review" },
  }),
  footer: (biz) => ({
    design: "classic",
    about: `${biz} helps families plan life, health and motor insurance, mutual fund SIPs and retirement — and stands by them at claim time. ${DISCLAIMER}`,
    columns: [
      { title: "Plan", links: [ { label: "Life Insurance", href: "/insurance" }, { label: "Health Insurance", href: "/insurance" }, { label: "Mutual Funds & SIP", href: "/investments" } ] },
      { title: "Support", links: [ { label: "Claim Support", href: "/claims" }, { label: "Free Review", href: "/free-review" }, { label: "Contact", href: "/contact" } ] },
    ],
    serviceAreas: ["Term Life", "Health Insurance", "Motor Insurance", "Mutual Fund SIPs", "Retirement Planning", "Child Education Plans"],
    contact: { phones: [PHONE], email: "care@example.com", address: "Jayanagar, Bengaluru" },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. Insurance is the subject matter of solicitation. Mutual fund investments are subject to market risks.`,
  }),
  seo: (biz) => ({
    title: `${biz} — Life & Health Insurance Advisor and Mutual Fund SIP Planning`,
    description: "Independent help choosing term life, family health and motor insurance, mutual fund SIPs and retirement plans — with claim support when it matters. Free review.",
    favicon: "", ogImage: "",
    keywords: "insurance advisor near me, term insurance, health insurance for family, mutual fund distributor, sip investment, retirement planning, claim support bengaluru",
    businessType: "InsuranceAgency", priceRange: "₹₹",
  }),
  services: [
    { category: "Protection", title: "Term Life Insurance", description: "High cover at low premium so your family's goals stay on track." },
    { category: "Protection", title: "Family Health Insurance", description: "Floater and super top-up plans with cashless hospital networks." },
    { category: "Protection", title: "Motor & Home Insurance", description: "Car, bike and home policies with fast, hassle-free renewals." },
    { category: "Wealth", title: "Mutual Fund SIPs", description: "Goal-based SIPs across equity, hybrid and debt funds." },
    { category: "Wealth", title: "Retirement Planning", description: "NPS, SIPs and annuity options mapped to your retirement income." },
    { category: "Wealth", title: "Child Education Planning", description: "Disciplined investing for school, college and higher studies abroad." },
    { category: "Support", title: "Claim Assistance", description: "Paperwork, follow-ups and escalation with insurers and TPAs." },
  ],
  gallery: [
    "Family planning session", "Our Jayanagar office", "Policy review meeting", "Goal planning on paper",
    "Market review", "Client documentation", "Savings & SIP workshop", "Team of advisors",
  ].map((caption) => ({ category: "With Our Clients", caption })),
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "classic", customHtml: "",
          badge: "IRDAI LICENSED · AMFI REGISTERED · SINCE 2006", titleTop: "Protect Your Family.", titleHighlight: "Grow Your Savings.",
          subtitle: "", description: `${biz} helps 3,500+ families choose the right insurance and investments — and stays with you at claim time. Honest advice, no jargon.`, image: "",
          primaryBtn: { label: "Book a Free Review", href: "/free-review" }, secondaryBtn: { label: "Explore Insurance", href: "/insurance" },
          features: [
            { icon: "shield", title: "Claim Support", text: "" }, { icon: "users", title: "3,500+ Families", text: "" },
            { icon: "heart", title: "Needs-Based Advice", text: "" }, { icon: "clock", title: "Renewal Reminders", text: "" },
          ],
        } },
        { type: "stats", content: { items: [
          { value: "3,500+", label: "Families Served", icon: "users" }, { value: "₹42 Cr+", label: "Claims Settled for Clients", icon: "shield" },
          { value: "18 yrs", label: "Of Advice", icon: "award" }, { value: "22", label: "Insurer & AMC Partners", icon: "handshake" },
        ] }, style: { layout: "cards" } },
        { type: "serviceCategories", content: { eyebrow: "WHAT WE DO", title: "Protection, Wealth &", titleHighlight: "Support", categories: ["Protection", "Wealth", "Support"] }, style: { cardRadius: "lg" } },
        { type: "priceList", content: { eyebrow: "INDICATIVE PREMIUMS", title: "What Cover", titleHighlight: "Typically Costs", note: "Illustrative annual premiums for a healthy non-smoker in Bengaluru. Actual premium depends on age, health, insurer and plan. Insurance is the subject matter of solicitation.", groups: [
          { category: "Term Life (₹1 Cr cover)", items: [ { name: "Age 25, cover till 60", price: "≈ ₹9,500/yr", note: "" }, { name: "Age 35, cover till 60", price: "≈ ₹14,000/yr", note: "" }, { name: "Age 45, cover till 65", price: "≈ ₹32,000/yr", note: "" } ] },
          { category: "Family Health (₹10 L floater)", items: [ { name: "Couple, 30s", price: "≈ ₹16,000/yr", note: "" }, { name: "Couple + 2 kids", price: "≈ ₹22,000/yr", note: "" }, { name: "Super top-up ₹50 L", price: "≈ ₹4,500/yr", note: "" } ] },
        ] }, style: { background: "light" } },
        { type: "about", content: {
          eyebrow: "ABOUT US", title: "An Advisor for Life,", titleHighlight: "Not Just a Policy",
          body: [`${biz} was started in 2006 by Ramesh Hegde after he saw a neighbour's family struggle with a rejected claim. Our team of 9 advisors now works with families and small businesses across Karnataka.`, "We compare plans from multiple insurers and fund houses, explain exclusions in plain language, and remind you before every renewal and review."],
          image: "", points: ["Multiple insurers compared", "Exclusions explained upfront", "Annual portfolio review", "Claim help at no extra cost"],
          buttonLabel: "Claim Support", buttonHref: "/claims",
        }, style: { layout: "split" } },
        { type: "steps", content: { eyebrow: "HOW IT WORKS", title: "Your Plan in", titleHighlight: "3 Meetings", items: [
          { title: "Understand", text: "Family, income, goals and existing policies", icon: "users" },
          { title: "Recommend", text: "Cover gaps and plan options compared", icon: "clipboard" },
          { title: "Act & Review", text: "Purchase help and yearly review", icon: "check" },
        ] }, style: { layout: "timeline", background: "light" } },
        { type: "testimonials", content: { eyebrow: "CLIENT STORIES", title: "When It", titleHighlight: "Mattered Most", items: [
          { name: "Kavya Shetty", role: "Health claim, ₹6.8 lakh", text: "When my father was hospitalised, their team handled the cashless approval and the extra paperwork. We just focused on him.", rating: 5 },
          { name: "Manjunath R.", role: "SIP investor since 2014", text: "They kept me investing through every market fall. My daughter's college fund is fully ready.", rating: 5 },
          { name: "Sana Fathima", role: "Small business owner", text: "They explained term insurance simply and found me a plan with the riders I actually needed.", rating: 5 },
        ] }, style: { layout: "featured" } },
        { type: "faq", content: { eyebrow: "FAQ", title: "Insurance &", titleHighlight: "Investment Questions", intro: "General information — please read policy and scheme documents before investing.", items: [
          { q: "How much life cover do I need?", a: "A common starting point is 10–15 times your annual income plus outstanding loans, adjusted for your goals. We calculate it for your family in the review." },
          { q: "Do you charge a fee for advice?", a: "The review is free. As a distributor we receive commission from insurers and fund houses, which we disclose on request." },
          { q: "Can you help with a claim on a policy bought elsewhere?", a: "Yes, we help with paperwork and follow-ups for existing clients' family members, even on older policies." },
          { q: "Are mutual fund returns guaranteed?", a: "No. Mutual fund investments are subject to market risks and returns are not guaranteed." },
        ] } as SectionContentMap["faq"], style: { layout: "split" } },
        { type: "richText", content: { html: `<p style="font-size:0.85rem"><strong>Disclaimer:</strong> ${DISCLAIMER}</p>` }, style: { background: "light", spacingTop: "sm", spacingBottom: "sm" } },
        cta,
      ],
    },
    { slug: "insurance", title: "Insurance", isSystem: true, order: 1, sections: [
      { type: "banner", content: { title: "Insurance", titleHighlight: "Planning", subtitle: "Life, health, motor and home — chosen for your needs.", image: "", bgColor: "", imageOpacity: 35, overlayOpacity: 70 } },
      { type: "serviceCategories", content: { eyebrow: "PROTECTION", title: "Cover for", titleHighlight: "Every Risk", categories: ["Protection"] }, style: { cardRadius: "lg" } },
      { type: "features", content: { items: [
        { icon: "shield", title: "Claim Ratio Checked", text: "We compare insurers on claim settlement and hospital networks, not just price." },
        { icon: "clipboard", title: "Fine Print Explained", text: "Waiting periods, room-rent caps and exclusions explained before you buy." },
        { icon: "clock", title: "Renewal Reminders", text: "Never miss a renewal and lose continuity benefits." },
      ] }, style: { layout: "cards", background: "light" } },
      { type: "richText", content: { html: `<p style="font-size:0.85rem"><strong>Disclaimer:</strong> ${DISCLAIMER}</p>` } },
      cta,
    ] },
    { slug: "investments", title: "Investments", isSystem: true, order: 2, sections: [
      { type: "banner", content: { title: "Goal-Based", titleHighlight: "Investing", subtitle: "SIPs, retirement and child education planning.", image: "", bgColor: "", imageOpacity: 35, overlayOpacity: 70 } },
      { type: "pricingPlans", content: {
        eyebrow: "SIP PLANS", title: "Start Small,", titleHighlight: "Stay Consistent",
        plans: [
          { name: "First SIP", price: "₹2,000", period: "/month", features: ["1–2 diversified funds", "Online KYC help", "Goal tracker", "Annual review"], featured: false, buttonLabel: "Start SIP", buttonHref: "/free-review" },
          { name: "Family Goals", price: "₹10,000", period: "/month", features: ["Child education + retirement goals", "Equity & hybrid mix", "Half-yearly review", "Tax-saving ELSS option"], featured: true, buttonLabel: "Plan Goals", buttonHref: "/free-review" },
          { name: "Wealth Builder", price: "₹25,000+", period: "/month", features: ["Asset allocation plan", "Rebalancing support", "Quarterly review", "Consolidated statements"], featured: false, buttonLabel: "Talk to Us", buttonHref: "/free-review" },
        ],
      }, style: { background: "light", cardRadius: "lg" } },
      { type: "richText", content: { html: `<p style="font-size:0.85rem"><strong>Disclaimer:</strong> ${DISCLAIMER}</p>` } },
      cta,
    ] },
    { slug: "claims", title: "Claim Support", isSystem: true, order: 3, sections: [
      { type: "about", content: {
        eyebrow: "CLAIM SUPPORT", title: "We Stand With You at", titleHighlight: "Claim Time",
        body: ["Call our claim desk as soon as possible. We help with cashless pre-authorisation, document checklists, insurer follow-ups and escalation to the grievance cell or Insurance Ombudsman when needed.", "Claim support is free for every client and their family members."],
        image: "", points: ["24×7 claim helpline", "Cashless pre-authorisation help", "Reimbursement paperwork", "Escalation support"],
        buttonLabel: "Call the Claim Desk", buttonHref: "/contact",
      } },
      { type: "gallery", content: { eyebrow: "OUR TEAM AT WORK", title: "Advice &", titleHighlight: "Support" }, style: { layout: "strip" } },
      cta,
    ] },
    { slug: "free-review", title: "Free Review", isSystem: true, order: 4, sections: [
      { type: "appointmentForm", content: { title: "Book a Free Insurance & Goal Review", subtitle: "A 45-minute call or office visit to check your existing cover and investments. No obligation to buy." } },
    ] },
    { slug: "contact", title: "Contact Us", isSystem: true, order: 5, sections: [
      { type: "contactInfo", content: { eyebrow: "CONTACT", title: "Talk to an", titleHighlight: "Advisor", address: "Jayanagar, Bengaluru", phone: PHONE, email: "care@example.com", hours: "Mon – Sat, 10 AM – 7 PM · Claim helpline 24×7", mapEmbed: "" } },
      { type: "contactForm", content: { title: "Send a Message", subtitle: "Questions about a policy, renewal or claim — we reply the same day." } },
    ] },
  ],
};
