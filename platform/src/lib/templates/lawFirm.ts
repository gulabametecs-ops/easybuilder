import type { TemplateDef, SectionSeed } from "./types";
import type { SectionContentMap } from "../config";

// Law firm / advocates: classic burgundy + antique gold on parchment, EB Garamond serif,
// centered header & hero, practice areas, advocates, consultation booking, BCI disclaimer.
const PHONE = "011 4105 7726";
const DISCLAIMER = "As per the rules of the Bar Council of India, advocates may not solicit work or advertise. This website is for information only; by using it you confirm you are seeking information about the firm of your own accord, and nothing here creates a lawyer–client relationship.";

const cta: SectionSeed<"cta"> = {
  type: "cta",
  content: { title: "Facing a legal issue?", highlight: "Speak to an Advocate in Confidence", phones: [PHONE], buttonLabel: "Book a Consultation", buttonHref: "/consultation" },
  style: { background: "primary", layout: "minimal" },
};

const advocates: SectionSeed<"team"> = {
  type: "team",
  content: { eyebrow: "OUR ADVOCATES", title: "Counsel With", titleHighlight: "Courtroom Experience", members: [
    { name: "Adv. Vikram Mehra", role: "Managing Partner · Civil & Commercial", image: "", note: "28 years before the Delhi High Court and commercial courts; arbitration and recovery suits." },
    { name: "Adv. Sunanda Rao", role: "Partner · Family & Matrimonial", image: "", note: "Divorce, custody, maintenance and mediation; counsel in 900+ family matters." },
    { name: "Adv. Farhan Qureshi", role: "Partner · Criminal Law", image: "", note: "Bail, trial and appellate practice in Sessions Courts and the High Court." },
    { name: "Adv. Meera Joshi", role: "Senior Associate · Property & RERA", image: "", note: "Title due diligence, property disputes and RERA complaints." },
  ] },
  style: { cardRadius: "none", cardShadow: "sm", align: "center" },
};

export const lawFirm: TemplateDef = {
  theme: {
    colors: { primary: "#7f1d1d", primaryDark: "#5f1414", secondary: "#1c1412", accent: "#b08d57", dark: "#1c1412", light: "#faf6f0", text: "#44403c", heading: "#1c1412" },
    font: "EB Garamond", radius: "0.125rem",
  },
  header: (biz) => ({
    design: "centered",
    logoText: biz, logoImage: "",
    announcement: { show: false, text: "", link: "" },
    topbar: { show: true, address: "Chambers: Lawyers' Block, Saket District Courts, New Delhi", phones: [PHONE], email: "chambers@example.com", social: { facebook: "#", instagram: "#", whatsapp: "#" } },
    nav: [
      { label: "Home", href: "/" }, { label: "Practice Areas", href: "/practice-areas" }, { label: "Our Advocates", href: "/advocates" },
      { label: "Legal FAQs", href: "/legal-faqs" }, { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Book a Consultation", href: "/consultation" },
  }),
  footer: (biz) => ({
    design: "centered",
    about: `${biz} — advocates practising before the Supreme Court, Delhi High Court and district courts. ${DISCLAIMER}`,
    columns: [
      { title: "Practice", links: [ { label: "Practice Areas", href: "/practice-areas" }, { label: "Our Advocates", href: "/advocates" }, { label: "Legal FAQs", href: "/legal-faqs" } ] },
      { title: "Chambers", links: [ { label: "Book a Consultation", href: "/consultation" }, { label: "Contact", href: "/contact" } ] },
    ],
    serviceAreas: ["Civil Litigation", "Family Law", "Criminal Defence", "Property & RERA", "Corporate & Contracts", "Arbitration"],
    contact: { phones: [PHONE], email: "chambers@example.com", address: "Saket, New Delhi" },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. Information only — not legal advice or solicitation.`,
  }),
  seo: (biz) => ({
    title: `${biz} — Advocates for Civil, Family, Criminal & Property Matters in Delhi`,
    description: "Law firm in New Delhi for civil litigation, divorce and family law, criminal defence, property and RERA disputes, contracts and arbitration. Book a confidential consultation.",
    favicon: "", ogImage: "",
    keywords: "lawyer near me, advocate in delhi, divorce lawyer, criminal lawyer, property lawyer, civil lawyer, law firm delhi, legal consultation",
    businessType: "LegalService", priceRange: "₹₹₹",
  }),
  services: [
    { category: "Litigation", title: "Civil & Commercial Litigation", description: "Recovery suits, injunctions, contract disputes and commercial court matters." },
    { category: "Litigation", title: "Criminal Defence", description: "Anticipatory and regular bail, trials, quashing petitions and appeals." },
    { category: "Litigation", title: "Arbitration & Mediation", description: "Domestic arbitration, enforcement of awards and court-annexed mediation." },
    { category: "Personal & Family", title: "Divorce & Family Law", description: "Mutual and contested divorce, custody, maintenance and domestic violence cases." },
    { category: "Personal & Family", title: "Wills, Succession & Probate", description: "Drafting wills, succession certificates, probate and family settlements." },
    { category: "Property & Business", title: "Property & RERA Disputes", description: "Title verification, partition suits, tenant eviction and RERA complaints." },
    { category: "Property & Business", title: "Corporate & Contracts", description: "Agreements, shareholder disputes, legal notices and compliance opinions." },
  ],
  gallery: [
    "Our chambers library", "Conference room", "Case preparation", "Client meeting",
    "Documentation desk", "Delhi High Court", "Partners in discussion", "Signing a settlement",
  ].map((caption) => ({ category: "Chambers", caption })),
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "centered", customHtml: "",
          badge: "ADVOCATES · SUPREME COURT · DELHI HIGH COURT", titleTop: "Clear Advice.", titleHighlight: "Committed Representation.",
          subtitle: "", description: `${biz} has represented individuals, families and businesses for over 25 years — in court, at the negotiating table and in arbitration.`, image: "",
          primaryBtn: { label: "Book a Consultation", href: "/consultation" }, secondaryBtn: { label: "Practice Areas", href: "/practice-areas" },
          features: [
            { icon: "award", title: "25+ Years", text: "" }, { icon: "shield", title: "Strict Confidentiality", text: "" }, { icon: "users", title: "6 Advocates", text: "" },
          ],
        } },
        { type: "about", content: {
          eyebrow: "THE FIRM", title: "Law Practised With", titleHighlight: "Integrity",
          body: [`${biz} was founded in 1998 by Adv. Vikram Mehra. Our advocates appear daily before the Delhi High Court, district courts, NCLT, consumer commissions and RERA.`, "We tell clients honestly where they stand, what the process involves, and what it is likely to cost — before any filing is made.", DISCLAIMER],
          image: "", points: ["Enrolled with the Bar Council of Delhi", "Hindi, English & Urdu", "Video consultations available", "Written fee terms"],
          buttonLabel: "Meet Our Advocates", buttonHref: "/advocates",
        }, style: { layout: "split" } },
        { type: "serviceCategories", content: { eyebrow: "PRACTICE AREAS", title: "Where We", titleHighlight: "Practise", categories: ["Litigation", "Personal & Family", "Property & Business"] }, style: { cardRadius: "none" } },
        { type: "stats", content: { items: [
          { value: "25+", label: "Years of Practice", icon: "award" }, { value: "3,200+", label: "Matters Handled", icon: "clipboard" },
          { value: "6", label: "Advocates", icon: "users" }, { value: "12", label: "Courts & Tribunals", icon: "building" },
        ] }, style: { layout: "minimal", background: "dark" } },
        { type: "steps", content: { eyebrow: "HOW WE WORK", title: "From First Call to", titleHighlight: "Resolution", items: [
          { title: "Confidential Consultation", text: "Share the facts and documents", icon: "phone" },
          { title: "Legal Opinion", text: "Options, risks and timelines", icon: "clipboard" },
          { title: "Engagement", text: "Written scope and fee terms", icon: "handshake" },
          { title: "Representation", text: "Regular updates after every hearing", icon: "shield" },
        ] }, style: { layout: "timeline" } },
        advocates,
        { type: "testimonials", content: { eyebrow: "CLIENT EXPERIENCES", title: "In Their", titleHighlight: "Words", items: [
          { name: "Rakesh Bansal", role: "Business owner", text: "A recovery suit we'd been told would drag for years was settled in mediation within eight months. Clear advice at every step.", rating: 5 },
          { name: "Name withheld", role: "Family matter", text: "Adv. Sunanda handled a very sensitive custody matter with patience and complete discretion.", rating: 5 },
          { name: "Gurpreet Sandhu", role: "Homebuyer, RERA complaint", text: "They got our builder to refund with interest through RERA. Fees were exactly as agreed.", rating: 5 },
        ] }, style: { layout: "featured" } },
        { type: "faq", content: { eyebrow: "FAQ", title: "Before Your", titleHighlight: "Consultation", intro: "General information only — every case is different.", items: [
          { q: "Is the first consultation confidential?", a: "Yes. Everything you share is privileged and kept strictly confidential, whether or not you engage us." },
          { q: "What should I bring?", a: "Any notices, agreements, court papers, ID proof and a short timeline of events." },
          { q: "Do you offer video consultations?", a: "Yes, for clients anywhere in India or abroad. Documents can be shared securely in advance." },
          { q: "How are fees decided?", a: "Fees depend on the matter, forum and stage. You receive written fee terms before we begin." },
        ] } as SectionContentMap["faq"], style: { layout: "split", background: "light" } },
        cta,
      ],
    },
    { slug: "practice-areas", title: "Practice Areas", isSystem: true, order: 1, sections: [
      { type: "banner", content: { title: "Practice", titleHighlight: "Areas", subtitle: "Litigation and advisory across civil, criminal, family, property and commercial law.", image: "", bgColor: "", imageOpacity: 30, overlayOpacity: 75 } },
      { type: "serviceCategories", content: { eyebrow: "PRACTICE AREAS", title: "Our", titleHighlight: "Expertise", categories: ["Litigation", "Personal & Family", "Property & Business"] }, style: { layout: "list" } },
      { type: "priceList", content: { eyebrow: "CONSULTATION FEES", title: "Consultation", titleHighlight: "Fees", note: "Indicative consultation fees. Fees for drafting and court appearances are shared in writing after the first meeting.", groups: [
        { category: "Consultations", items: [ { name: "Video consultation (30 min)", price: "₹2,000", note: "" }, { name: "In-chamber consultation (45 min)", price: "₹3,500", note: "" }, { name: "Written legal opinion", price: "From ₹10,000", note: "" } ] },
        { category: "Documentation", items: [ { name: "Legal notice drafting", price: "From ₹5,000", note: "" }, { name: "Will drafting & registration support", price: "From ₹12,000", note: "" }, { name: "Agreement drafting / vetting", price: "From ₹8,000", note: "" } ] },
      ] }, style: { background: "light", cardRadius: "none" } },
      cta,
    ] },
    { slug: "advocates", title: "Our Advocates", isSystem: true, order: 2, sections: [
      advocates,
      { type: "gallery", content: { eyebrow: "CHAMBERS", title: "Our", titleHighlight: "Chambers" }, style: { layout: "strip" } },
      cta,
    ] },
    { slug: "legal-faqs", title: "Legal FAQs", isSystem: true, order: 3, sections: [
      { type: "faq", content: { eyebrow: "LEGAL FAQS", title: "Common Legal", titleHighlight: "Questions", items: [
        { q: "How long does a mutual consent divorce take?", a: "Typically 6–18 months, depending on whether the court waives the six-month cooling-off period." },
        { q: "What is anticipatory bail?", a: "A direction that a person be released on bail if arrested, sought before arrest when someone fears being arrested for a non-bailable offence." },
        { q: "Can I file a RERA complaint myself?", a: "Yes, but legal help is useful for drafting the complaint, calculating interest and representing you at hearings." },
        { q: "Is a will required to be registered?", a: "Registration is not compulsory, but it adds evidentiary value and reduces the chance of disputes." },
        { q: "What is the limitation period for a money recovery suit?", a: "Generally three years from the date the amount became due, subject to the specific facts." },
      ] } },
      { type: "richText", content: { html: `<p><strong>Disclaimer:</strong> ${DISCLAIMER}</p>` } },
      cta,
    ] },
    { slug: "consultation", title: "Book a Consultation", isSystem: true, order: 4, sections: [
      { type: "appointmentForm", content: { title: "Book a Consultation", subtitle: "Choose a date and time for an in-chamber or video consultation. Please describe your matter briefly — details stay confidential." } },
    ] },
    { slug: "contact", title: "Contact Us", isSystem: true, order: 5, sections: [
      { type: "contactInfo", content: { eyebrow: "CONTACT", title: "Reach Our", titleHighlight: "Chambers", address: "Lawyers' Block, Saket District Courts, New Delhi", phone: PHONE, email: "chambers@example.com", hours: "Mon – Sat, 10 AM – 7 PM (court days: after 4 PM)", mapEmbed: "" } },
      { type: "map", content: { eyebrow: "LOCATION", title: "Find", titleHighlight: "Us", address: "Saket, New Delhi", mapEmbed: "" } },
      { type: "contactForm", content: { title: "Send a Message", subtitle: "Do not send confidential documents through this form. We will call you back." } },
    ] },
  ],
};
