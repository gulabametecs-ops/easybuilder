import type { TemplateDef, SectionSeed } from "./types";

const PHONE = "9000000000";
const EMAIL = "hello@example.com";
const CATEGORIES = ["Pain Management", "Sports Rehab", "Post-Surgery Rehab", "Neuro Rehab", "Home Physiotherapy"];

const banner = (title: string, titleHighlight: string, subtitle: string): SectionSeed<"banner"> => ({
  type: "banner",
  content: { title, titleHighlight, subtitle, image: "", bgColor: "#0f2a1d", imageOpacity: 35, overlayOpacity: 70 },
});

const therapists = [
  { name: "Dr. Kavya Raghavan (PT)", role: "Founder · Musculoskeletal Physiotherapist", image: "", note: "MPT Ortho · 15 yrs · Spine & posture" },
  { name: "Dr. Arjun Malhotra (PT)", role: "Sports Physiotherapist", image: "", note: "MPT Sports · Worked with state-level athletes" },
  { name: "Dr. Nisha Fernandes (PT)", role: "Neuro Rehabilitation", image: "", note: "MPT Neuro · Stroke & Parkinson's rehab" },
  { name: "Dr. Siddharth Rao (PT)", role: "Post-Operative Rehab", image: "", note: "MPT Ortho · Knee & hip replacement recovery" },
  { name: "Dr. Farah Siddiqui (PT)", role: "Women's Health Physio", image: "", note: "BPT, Cert. Pre & Post-natal care" },
  { name: "Dr. Manoj Yadav (PT)", role: "Home Care Lead", image: "", note: "BPT · Geriatric & home rehab · 10 yrs" },
];

const recoverySteps: SectionSeed<"steps"> = {
  type: "steps",
  content: {
    eyebrow: "HOW WE WORK", title: "A Clear Path", titleHighlight: "Back to Movement",
    items: [
      { title: "Detailed Assessment", text: "45-minute evaluation of posture, strength, range of motion and daily routine.", icon: "clipboard" },
      { title: "Personal Plan", text: "Goals and session plan agreed with you — with a realistic timeline, not promises.", icon: "edit" },
      { title: "Hands-on Treatment", text: "Manual therapy, electrotherapy and guided exercise, one-to-one.", icon: "user-check" },
      { title: "Home Programme", text: "Simple exercises on video so progress continues between sessions.", icon: "home" },
    ],
  },
};

const plans: SectionSeed<"pricingPlans"> = {
  type: "pricingPlans",
  content: {
    eyebrow: "SESSIONS & PACKAGES", title: "Simple, Honest", titleHighlight: "Pricing",
    plans: [
      { name: "Assessment + Session", price: "₹800", period: "first visit", features: ["45-min detailed assessment", "First treatment session", "Written plan & goals", "Home exercise sheet"], featured: false, buttonLabel: "Book Assessment", buttonHref: "/assessment" },
      { name: "Recovery Pack", price: "₹5,400", period: "10 sessions", features: ["10 one-to-one sessions", "Valid for 6 weeks", "Progress re-assessment", "Video home programme", "WhatsApp check-ins"], featured: true, buttonLabel: "Choose Pack", buttonHref: "/assessment" },
      { name: "Home Visit Pack", price: "₹8,000", period: "10 home sessions", features: ["Therapist visits your home", "Portable equipment", "Family caregiver guidance", "Weekly progress report"], featured: false, buttonLabel: "Book Home Visit", buttonHref: "/home-visits" },
    ],
  },
  style: { background: "light", cardRadius: "md", cardShadow: "md" },
};

const hours: SectionSeed<"openingHours"> = {
  type: "openingHours",
  content: {
    eyebrow: "CLINIC HOURS", title: "Early Mornings to", titleHighlight: "Late Evenings",
    note: "Home visits are scheduled separately between 8 AM and 7 PM.",
    days: [
      { day: "Monday – Saturday", hours: "7:00 AM – 9:00 PM" },
      { day: "Sunday", hours: "8:00 AM – 12:00 PM" },
      { day: "Home visits", hours: "8:00 AM – 7:00 PM, by appointment" },
    ],
  },
};

const partners: SectionSeed<"logos"> = {
  type: "logos",
  content: { title: "Working alongside", items: ["Orthopaedic surgeons", "Neurologists", "Sports academies", "Corporate wellness teams", "Senior living homes"] },
};

const cta: SectionSeed<"cta"> = {
  type: "cta",
  content: { title: "Pain slowing you down?", highlight: "Book Your Assessment", phones: [PHONE], buttonLabel: "Book Assessment", buttonHref: "/assessment" },
  style: { background: "primary" },
};

export const physioClinic: TemplateDef = {
  theme: {
    colors: { primary: "#16a34a", primaryDark: "#15803d", secondary: "#14332a", accent: "#facc15", dark: "#0f2a1d", light: "#f2f8f3", text: "#45524a", heading: "#14332a" },
    font: "Outfit", radius: "0.75rem",
  },
  header: (biz) => ({
    design: "centered",
    logoText: biz, logoImage: "",
    announcement: { show: false, text: "First assessment + session at ₹800 — book online.", link: "/assessment" },
    topbar: { show: false, address: "Your City", phones: [PHONE], email: EMAIL, social: { facebook: "#", instagram: "#", whatsapp: "#" } },
    nav: [
      { label: "Home", href: "/" }, { label: "Conditions", href: "/conditions" }, { label: "Therapies", href: "/therapies" }, { label: "Home Visits", href: "/home-visits" }, { label: "Packages", href: "/packages" }, { label: "Team", href: "/team" }, { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Book Assessment", href: "/assessment" },
  }),
  footer: (biz) => ({
    design: "centered",
    about: `${biz} is a physiotherapy and rehabilitation clinic helping people recover from pain, injury, surgery and neurological conditions — at the clinic or at home.`,
    columns: [
      { title: "Explore", links: [ { label: "Conditions We Treat", href: "/conditions" }, { label: "Therapies", href: "/therapies" }, { label: "Home Visits", href: "/home-visits" }, { label: "Packages", href: "/packages" } ] },
      { title: "Clinic", links: [ { label: "Our Team", href: "/team" }, { label: "Book Assessment", href: "/assessment" }, { label: "Contact", href: "/contact" } ] },
    ],
    serviceAreas: ["Back & Neck Pain", "Sports Injury", "Knee & Shoulder Rehab", "Post-Surgery Rehab", "Stroke Rehab", "Home Physiotherapy"],
    contact: { phones: [PHONE], email: EMAIL, address: "Your City" },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. All Rights Reserved.`,
  }),
  seo: (biz) => ({
    title: `${biz} — Physiotherapy & Rehabilitation Clinic`,
    description: "Physiotherapy for back and neck pain, sports injuries, post-surgery and neuro rehabilitation. Clinic sessions, home visits and affordable treatment packages.",
    favicon: "", ogImage: "",
    keywords: "physiotherapy near me, physiotherapist, back pain treatment, sports injury rehab, knee replacement physiotherapy, stroke rehabilitation, home physiotherapy",
    businessType: "Physiotherapy", priceRange: "₹₹",
  }),
  services: [
    { category: "Pain Management", title: "Back & Neck Pain", description: "Manual therapy and targeted exercise for slip disc, sciatica and stiffness." },
    { category: "Pain Management", title: "Shoulder & Knee Pain", description: "Care for frozen shoulder, arthritis and tendon problems." },
    { category: "Pain Management", title: "Posture Correction", description: "Ergonomic advice and strengthening for desk-job aches." },
    { category: "Sports Rehab", title: "Sports Injury Treatment", description: "Ligament sprains, muscle tears and overuse injuries assessed and treated." },
    { category: "Sports Rehab", title: "Return-to-Sport Training", description: "Strength, agility and movement testing before you get back in the game." },
    { category: "Post-Surgery Rehab", title: "Knee & Hip Replacement Rehab", description: "Structured recovery to help regain walking, stairs and independence." },
    { category: "Post-Surgery Rehab", title: "ACL & Arthroscopy Rehab", description: "Phase-wise programme coordinated with your surgeon's protocol." },
    { category: "Neuro Rehab", title: "Stroke Rehabilitation", description: "Balance, gait and hand-function training for stroke survivors." },
    { category: "Neuro Rehab", title: "Parkinson's & Balance Care", description: "Exercise programmes to support mobility and reduce fall risk." },
    { category: "Home Physiotherapy", title: "Home Physiotherapy Visits", description: "Qualified therapists at your home with portable equipment." },
    { category: "Home Physiotherapy", title: "Elderly Mobility Care", description: "Gentle strengthening and fall-prevention for seniors." },
  ],
  gallery: [
    ...["Treatment cubicles", "Exercise & rehab gym", "Electrotherapy unit", "Gait training track"].map((c) => ({ category: "Our Clinic", caption: c })),
    ...["Sports rehab session", "Post-surgery knee exercise", "Stroke rehab balance training", "Home physiotherapy visit"].map((c) => ({ category: "Rehab in Action", caption: c })),
  ],
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "minimal", customHtml: "",
          badge: "PHYSIOTHERAPY · REHABILITATION · HOME VISITS", titleTop: "Move Better.", titleHighlight: "Live Without Limits.",
          subtitle: "", description: `${biz} helps you recover from pain, injury and surgery with one-to-one physiotherapy, clear goals and a plan built around your life.`, image: "",
          primaryBtn: { label: "Book Assessment", href: "/assessment" }, secondaryBtn: { label: "Conditions We Treat", href: "/conditions" },
          features: [ { icon: "user-check", title: "One-to-One Sessions", text: "" }, { icon: "home", title: "Home Visits", text: "" }, { icon: "clock", title: "7 AM – 9 PM", text: "" } ],
        } },
        { type: "features", content: { items: [
          { icon: "heart-pulse", title: "Personal Attention", text: "One patient, one therapist, for the full session." },
          { icon: "trending", title: "Measured Progress", text: "Strength and range-of-motion tracked so you can see improvement." },
          { icon: "home", title: "Clinic or Home", text: "Continue the same plan at home when travel is difficult." },
          { icon: "tag", title: "Clear Packages", text: "Session packs priced upfront — no surprise add-ons." },
        ] }, style: { cardShadow: "none", cardBorderWidth: 1, cardRadius: "md" } },
        { type: "serviceCategories", content: { eyebrow: "WHAT WE TREAT", title: "Rehab for", titleHighlight: "Every Stage of Recovery", categories: CATEGORIES }, style: { layout: "tiles", background: "dark" } },
        { type: "about", content: {
          eyebrow: "OUR APPROACH", title: "Treating the Cause,", titleHighlight: "Not Just the Pain",
          body: [
            "Pain is often a signal of how you sit, move, train or recover. We look at the whole picture — not just the sore spot — and explain what is happening in plain language.",
            "Every session is one-to-one with a qualified physiotherapist. No crowded halls, no machine-only treatment.",
          ],
          image: "", points: ["Evidence-based manual therapy", "Exercise-led rehabilitation", "Coordination with your doctor or surgeon", "Progress measured every 5 sessions"],
          buttonLabel: "Explore Therapies", buttonHref: "/therapies",
        } },
        { type: "stats", content: { items: [ { value: "8,000+", label: "Patients Rehabilitated", icon: "users" }, { value: "6", label: "Qualified Physios", icon: "award" }, { value: "45 min", label: "Every Assessment", icon: "clock" }, { value: "4.9★", label: "Google Rating", icon: "star" } ] }, style: { layout: "band" } },
        { ...recoverySteps, style: { layout: "cards" } },
        { type: "testimonials", content: { eyebrow: "RECOVERY STORIES", title: "Back to What", titleHighlight: "They Love", items: [
          { name: "Ramesh Iyer", role: "Knee replacement, 64", text: "Three weeks after surgery I was walking with a stick; by week eight I was climbing stairs at home. Dr. Siddharth kept me motivated throughout.", rating: 5 },
          { name: "Tanya Sharma", role: "Software engineer, back pain", text: "Years of desk work had left me with constant lower-back pain. The posture plan and exercises have made a real difference to my workday.", rating: 5 },
          { name: "Karan Singh", role: "Footballer, ACL rehab", text: "The return-to-sport testing gave me confidence. I'm training with my club again and feel stronger than before the injury.", rating: 5 },
          { name: "Lata Joshi", role: "Daughter of stroke patient", text: "The home visits were a blessing. My father is walking short distances again and the team taught us how to support him safely.", rating: 5 },
          { name: "Shabnam Qureshi", role: "New mother, post-natal rehab", text: "Dr. Farah's post-natal programme fixed the back pain I'd had since delivery. Gentle, practical and completely comfortable.", rating: 5 },
        ] }, style: { layout: "featured", background: "light" } },
        { type: "team", content: { eyebrow: "OUR PHYSIOTHERAPISTS", title: "Experts in", titleHighlight: "Movement", members: therapists.slice(0, 3) }, style: { cardRadius: "md", align: "center" } },
        plans,
        { type: "imageBanner", content: { title: "Can't travel to the clinic?", subtitle: "Our physiotherapists come to your home with portable equipment — ideal after surgery or for elderly patients.", buttonLabel: "Book a Home Visit", buttonHref: "/home-visits", image: "" } },
        partners,
        { type: "faq", content: { eyebrow: "FAQ", title: "Before You", titleHighlight: "Book", items: [
          { q: "Do I need a doctor's referral?", a: "No. You can book directly. If we feel you need a scan or a doctor's opinion first, we'll tell you honestly." },
          { q: "How many sessions will I need?", a: "It depends on the condition and your goals. After the assessment we share an estimated number of sessions and review progress every five." },
          { q: "What should I wear?", a: "Loose, comfortable clothing that lets us see and move the area being treated — shorts for knee problems, for example." },
          { q: "How long is each session?", a: "The first assessment takes about 45 minutes. Follow-up sessions are 40–45 minutes." },
          { q: "Is physiotherapy covered by insurance?", a: "Some policies cover physiotherapy, especially after surgery. We provide detailed invoices and reports for your claim." },
          { q: "Will it hurt?", a: "Some exercises may feel like hard work, but treatment should never be sharply painful. Tell your physio and we'll adjust the load immediately." },
        ], intro: "Everything you need to know before your first session. Still unsure? Call us and speak directly to a physiotherapist." } as SectionSeed<"faq">["content"], style: { layout: "split", background: "light" } },
        hours,
        { type: "appointmentForm", content: { title: "Book Your First Assessment", subtitle: "Clinic or home visit — tell us what's troubling you and pick a time. We'll confirm on WhatsApp." }, style: { background: "light" } },
        cta,
      ],
    },
    { slug: "conditions", title: "Conditions", isSystem: true, order: 1, sections: [
      banner("Conditions", "We Treat", "From everyday aches to complex neurological recovery."),
      { type: "serviceCategories", content: { eyebrow: "", title: "Find Your", titleHighlight: "Condition", categories: CATEGORIES }, style: { cardRadius: "md", cardShadow: "sm" } },
      { type: "features", content: { items: [
        { icon: "user-check", title: "Slip Disc & Sciatica", text: "Pain relief, nerve mobility and core strengthening." },
        { icon: "zap", title: "Cervical Spondylosis", text: "Neck mobility, posture and desk ergonomics." },
        { icon: "heart", title: "Frozen Shoulder", text: "Gradual, guided restoration of shoulder movement." },
        { icon: "star", title: "Plantar Fasciitis", text: "Foot mechanics, stretching and load management." },
        { icon: "award", title: "Tennis Elbow", text: "Tendon loading and grip-strength rehabilitation." },
        { icon: "shield", title: "Arthritis", text: "Joint-friendly strengthening to support daily activities." },
      ] }, style: { background: "dark", cardRadius: "md" } },
      { type: "faq", content: { eyebrow: "CONDITION FAQ", title: "Is Physio Right", titleHighlight: "for Me?", items: [
        { q: "Can physiotherapy help a slip disc without surgery?", a: "Most disc problems improve with a structured exercise and pain-management plan. We refer you to a spine surgeon only if there are warning signs like leg weakness or loss of bladder control." },
        { q: "My knee hurts on stairs — is it arthritis?", a: "It could be arthritis, a kneecap tracking issue or weak hip muscles. A 45-minute assessment tells us which, and the plan differs for each." },
        { q: "How soon after surgery should I start?", a: "Usually within 24–48 hours for joint replacements, as per your surgeon's protocol. We coordinate directly with your surgeon." },
      ], intro: "Common questions about whether physiotherapy can help your condition." } as SectionSeed<"faq">["content"], style: { layout: "split" } },
      cta,
    ] },
    { slug: "therapies", title: "Therapies", isSystem: true, order: 2, sections: [
      banner("Our", "Therapies", "Hands-on care, modern equipment and guided exercise."),
      { type: "features", content: { items: [
        { icon: "handshake", title: "Manual Therapy", text: "Joint mobilisation, soft-tissue release and myofascial techniques." },
        { icon: "bolt", title: "Electrotherapy", text: "IFT, TENS, ultrasound therapy and shockwave where clinically suitable." },
        { icon: "trending", title: "Exercise Therapy", text: "Progressive strength, mobility and stability programmes." },
        { icon: "droplet", title: "Dry Needling & Taping", text: "Used alongside exercise for muscle tightness and support." },
      ] }, style: { cardRadius: "lg", cardShadow: "md" } },
      { ...recoverySteps, style: { layout: "timeline", background: "light" } },
      { type: "gallery", content: { eyebrow: "THE CLINIC", title: "Built for", titleHighlight: "Rehabilitation" }, style: { layout: "masonry" } },
      cta,
    ] },
    { slug: "home-visits", title: "Home Visits", isSystem: true, order: 3, sections: [
      banner("Physiotherapy", "at Home", "Qualified physiotherapists at your doorstep across Your City."),
      { type: "about", content: {
        eyebrow: "HOME CARE", title: "The Same Care,", titleHighlight: "In Your Living Room",
        body: [
          "After surgery, a stroke or for elderly family members, getting to a clinic can be the hardest part. Our home physiotherapists bring the session to you.",
          "We also guide family members on safe transfers, walking support and daily exercises.",
        ],
        image: "", points: ["Verified, qualified physiotherapists", "Portable TENS & exercise equipment", "Same therapist each visit", "Weekly progress update to family"],
        buttonLabel: "Book a Home Visit", buttonHref: "/assessment",
      } },
      { type: "priceList", content: { eyebrow: "HOME VISIT FEES", title: "Home Physiotherapy", titleHighlight: "Charges", note: "Travel included within 8 km. Packages must be used within 6 weeks.", groups: [
        { category: "Per Visit", items: [ { name: "Home assessment + session", price: "₹1,000", note: "60 minutes" }, { name: "Follow-up home session", price: "₹900", note: "45 minutes" } ] },
        { category: "Packages", items: [ { name: "10 home sessions", price: "₹8,000", note: "Save ₹1,000" }, { name: "20 home sessions", price: "₹15,000", note: "Ideal for post-surgery" } ] },
      ] }, style: { background: "light" } },
      hours,
      cta,
    ] },
    { slug: "packages", title: "Packages", isSystem: true, order: 4, sections: [
      banner("Sessions &", "Packages", "Transparent pricing for clinic and home physiotherapy."),
      plans,
      { type: "priceList", content: { eyebrow: "SPECIALISED PROGRAMMES", title: "Rehab", titleHighlight: "Programmes", note: "Programme fees are indicative; your physio confirms the plan after assessment.", groups: [
        { category: "Clinic Programmes", items: [
          { name: "Post knee replacement (6 weeks)", price: "₹14,000", note: "18 sessions" },
          { name: "ACL rehab (12 weeks)", price: "₹22,000", note: "Return-to-sport testing included" },
          { name: "Back care programme (4 weeks)", price: "₹7,500", note: "12 sessions" },
          { name: "Neuro rehab (monthly)", price: "₹12,000", note: "12 sessions" },
        ] },
      ] }, style: { cardRadius: "md" } },
      cta,
    ] },
    { slug: "team", title: "Team", isSystem: true, order: 5, sections: [
      banner("Meet the", "Team", "Qualified physiotherapists with focused specialities."),
      { type: "team", content: { eyebrow: "OUR PHYSIOTHERAPISTS", title: "People Behind", titleHighlight: "Your Recovery", members: therapists }, style: { cardRadius: "md", cardShadow: "sm" } },
      partners,
      cta,
    ] },
    { slug: "contact", title: "Contact", isSystem: true, order: 6, sections: [
      { type: "contactInfo", content: { eyebrow: "GET IN TOUCH", title: "Visit", titleHighlight: "the Clinic", address: "Your City", phone: PHONE, email: EMAIL, hours: "Mon–Sat: 7 AM – 9 PM · Sun: 8 AM – 12 PM", mapEmbed: "" } },
      { type: "map", content: { eyebrow: "", title: "How to", titleHighlight: "Reach Us", address: "Your City", mapEmbed: "" } },
      { type: "contactForm", content: { title: "Send a Message", subtitle: "Tell us briefly about your pain or injury and we'll call you back." } },
    ] },
    { slug: "assessment", title: "Book Assessment", isSystem: true, order: 7, sections: [
      banner("Book Your", "Assessment", "Clinic or home — we'll confirm your slot on WhatsApp."),
      { type: "appointmentForm", content: { title: "Book a Physiotherapy Assessment", subtitle: "Choose clinic or home visit, a preferred date and time, and tell us what's troubling you." } },
      recoverySteps,
    ] },
  ],
};
