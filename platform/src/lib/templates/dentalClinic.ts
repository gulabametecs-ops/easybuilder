import type { TemplateDef, SectionSeed } from "./types";

const PHONE = "9000000000";
const EMAIL = "hello@example.com";
const CATEGORIES = ["General Dentistry", "Root Canal & Restorations", "Implants & Dentures", "Braces & Aligners", "Cosmetic Dentistry", "Kids Dentistry"];

const banner = (title: string, titleHighlight: string, subtitle: string): SectionSeed<"banner"> => ({
  type: "banner",
  content: { title, titleHighlight, subtitle, image: "", bgColor: "", imageOpacity: 30, overlayOpacity: 70 },
});

const dentists = [
  { name: "Dr. Ananya Iyer", role: "Founder · Prosthodontist & Implantologist", image: "", note: "BDS, MDS · 14 yrs · 2,000+ implants placed" },
  { name: "Dr. Rohan Kulkarni", role: "Endodontist (Root Canal Specialist)", image: "", note: "BDS, MDS · Microscope-assisted RCT" },
  { name: "Dr. Simran Gill", role: "Orthodontist", image: "", note: "BDS, MDS · Braces & clear aligners" },
  { name: "Dr. Kabir Menon", role: "Paediatric Dentist", image: "", note: "BDS, MDS · Gentle care for children" },
  { name: "Dr. Neha Bhatt", role: "Cosmetic Dentist", image: "", note: "BDS · Veneers, whitening & smile design" },
  { name: "Dr. Imran Qureshi", role: "Periodontist (Gum Specialist)", image: "", note: "BDS, MDS · Gum care & laser therapy" },
];

const hours: SectionSeed<"openingHours"> = {
  type: "openingHours",
  content: {
    eyebrow: "CLINIC HOURS", title: "Open Six Days,", titleHighlight: "Evenings Included",
    note: "Dental pain or a broken tooth? Call us — emergency slots are kept free every day.",
    days: [
      { day: "Monday – Friday", hours: "10:00 AM – 2:00 PM · 5:00 PM – 9:00 PM" },
      { day: "Saturday", hours: "10:00 AM – 7:00 PM" },
      { day: "Sunday", hours: "By appointment only" },
      { day: "Dental emergencies", hours: "Call anytime on 9000000000" },
    ],
  },
  style: { background: "light", cardRadius: "lg" },
};

const visitSteps: SectionSeed<"steps"> = {
  type: "steps",
  content: {
    eyebrow: "YOUR FIRST VISIT", title: "A Calm, Clear", titleHighlight: "Dental Journey",
    items: [
      { title: "Book a Slot", text: "Choose a time online or on WhatsApp — confirmation arrives instantly.", icon: "calendar" },
      { title: "Digital Check-up", text: "Intra-oral camera photos and a low-radiation digital X-ray, shown to you on screen.", icon: "clipboard" },
      { title: "Clear Treatment Plan", text: "Options, timelines and a written estimate before any treatment begins.", icon: "edit" },
      { title: "Comfortable Treatment", text: "Sterilised instruments, numbing gel and a dentist who checks in with you throughout.", icon: "heart" },
    ],
  },
};

const pricePreview: SectionSeed<"priceList"> = {
  type: "priceList",
  content: {
    eyebrow: "TRANSPARENT PRICING", title: "Treatment", titleHighlight: "Price List",
    note: "Indicative starting prices. Your final estimate is shared in writing after the check-up — no hidden charges.",
    groups: [
      { category: "Everyday Care", items: [
        { name: "Consultation & digital check-up", price: "₹300", note: "Waived if treatment starts same day" },
        { name: "Scaling & polishing", price: "₹1,200", note: "Full mouth, one sitting" },
        { name: "Tooth-coloured filling", price: "₹1,000", note: "Per tooth" },
        { name: "Digital X-ray (IOPA)", price: "₹200", note: "Per film" },
      ] },
      { category: "Root Canal & Crowns", items: [
        { name: "Root canal treatment", price: "₹4,500", note: "Front teeth from ₹3,500" },
        { name: "Metal-ceramic crown", price: "₹5,000", note: "Per tooth" },
        { name: "Zirconia crown", price: "₹9,500", note: "Metal-free, natural look" },
      ] },
      { category: "Implants & Smile", items: [
        { name: "Dental implant with crown", price: "₹28,000", note: "Per tooth, depends on implant system" },
        { name: "Clear aligners", price: "₹65,000", note: "Full course, after 3D scan" },
        { name: "Metal braces", price: "₹30,000", note: "Full course" },
        { name: "In-clinic teeth whitening", price: "₹8,000", note: "Single sitting" },
      ] },
    ],
  },
  style: { cardRadius: "lg", cardShadow: "sm" },
};

const cta: SectionSeed<"cta"> = {
  type: "cta",
  content: { title: "Been putting off that check-up?", highlight: "Book Your Visit Today", phones: [PHONE], buttonLabel: "Book Appointment", buttonHref: "/book" },
  style: { background: "primary" },
};

export const dentalClinic: TemplateDef = {
  theme: {
    colors: { primary: "#06b6d4", primaryDark: "#0891b2", secondary: "#0f2b46", accent: "#a5f3fc", dark: "#082032", light: "#ecfeff", text: "#41546a", heading: "#0f2b46" },
    font: "Figtree", radius: "2rem",
  },
  header: (biz) => ({
    design: "modern",
    logoText: biz, logoImage: "",
    announcement: { show: true, text: "Free dental check-up for kids under 12 every Saturday — book a slot.", link: "/book" },
    topbar: { show: false, address: "Your City", phones: [PHONE], email: EMAIL, social: { facebook: "#", instagram: "#", whatsapp: "#" } },
    nav: [
      { label: "Home", href: "/" }, { label: "Treatments", href: "/treatments" }, { label: "Smile Makeover", href: "/smile-makeover" }, { label: "Kids", href: "/kids" }, { label: "Prices", href: "/prices" }, { label: "Our Dentists", href: "/dentists" }, { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Book Appointment", href: "/book" },
  }),
  footer: (biz) => ({
    design: "minimal",
    about: `${biz} is a modern dental clinic offering gentle check-ups, root canals, implants, aligners and smile design — with clear pricing and sterilisation you can see.`,
    columns: [
      { title: "Clinic", links: [ { label: "Home", href: "/" }, { label: "Our Dentists", href: "/dentists" }, { label: "Prices", href: "/prices" }, { label: "Contact", href: "/contact" } ] },
      { title: "Treatments", links: [ { label: "All Treatments", href: "/treatments" }, { label: "Smile Makeover", href: "/smile-makeover" }, { label: "Kids Dentistry", href: "/kids" }, { label: "Book Appointment", href: "/book" } ] },
    ],
    serviceAreas: ["Check-ups & Cleaning", "Root Canal", "Dental Implants", "Clear Aligners", "Braces", "Teeth Whitening", "Kids Dentistry"],
    contact: { phones: [PHONE], email: EMAIL, address: "Your City" },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. All Rights Reserved.`,
  }),
  seo: (biz) => ({
    title: `${biz} — Dental Clinic for Implants, Aligners & Root Canal`,
    description: "Gentle dental care for the whole family — check-ups, painless root canals, implants, clear aligners, braces, smile makeovers and kids dentistry with transparent pricing.",
    favicon: "", ogImage: "",
    keywords: "dentist near me, dental clinic, root canal, dental implants, clear aligners, braces, teeth whitening, kids dentist",
    businessType: "Dentist", priceRange: "₹₹",
  }),
  services: [
    { category: "General Dentistry", title: "Dental Check-up & Digital X-ray", description: "A complete oral exam with intra-oral camera photos you can see on screen." },
    { category: "General Dentistry", title: "Scaling & Polishing", description: "Ultrasonic cleaning that removes tartar and stains in a single sitting." },
    { category: "Root Canal & Restorations", title: "Root Canal Treatment", description: "Rotary and microscope-assisted RCT, usually completed in one or two visits." },
    { category: "Root Canal & Restorations", title: "Tooth-Coloured Fillings & Crowns", description: "Composite fillings and zirconia crowns that blend with your natural teeth." },
    { category: "Implants & Dentures", title: "Dental Implants", description: "Fixed replacement for missing teeth, planned with 3D CBCT imaging." },
    { category: "Implants & Dentures", title: "Dentures & Bridges", description: "Comfortable complete, partial and implant-supported dentures." },
    { category: "Braces & Aligners", title: "Clear Aligners", description: "Nearly invisible, removable aligners planned with a 3D digital scan." },
    { category: "Braces & Aligners", title: "Metal & Ceramic Braces", description: "Reliable braces for teens and adults, with monthly progress reviews." },
    { category: "Cosmetic Dentistry", title: "Teeth Whitening", description: "In-clinic whitening that lifts several shades in about an hour." },
    { category: "Cosmetic Dentistry", title: "Veneers & Smile Design", description: "Digitally previewed veneers and contouring for a balanced smile." },
    { category: "Kids Dentistry", title: "Child Check-ups & Fluoride", description: "Friendly first visits, fluoride varnish and pit-and-fissure sealants." },
    { category: "Kids Dentistry", title: "Habit & Early Orthodontic Care", description: "Guidance for thumb-sucking, crowding and early bite problems." },
  ],
  gallery: [
    ...["Reception lounge", "Treatment suite", "Sterilisation zone", "Digital X-ray & 3D scanner"].map((c) => ({ category: "Our Clinic", caption: c })),
    ...["Kids play corner", "Smile design consultation", "Aligner fitting", "Happy patient after whitening"].map((c) => ({ category: "Smiles & Care", caption: c })),
  ],
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "gradient", customHtml: "",
          badge: "GENTLE · DIGITAL · TRANSPARENT", titleTop: "Healthy Teeth, Confident", titleHighlight: "Smiles for Life",
          subtitle: "", description: `At ${biz}, experienced dentists combine digital diagnostics with a calm, unhurried approach — from your first check-up to implants and aligners.`, image: "",
          primaryBtn: { label: "Book Appointment", href: "/book" }, secondaryBtn: { label: "See Prices", href: "/prices" },
          features: [ { icon: "shield", title: "Autoclave Sterilised", text: "" }, { icon: "clock", title: "Evening Slots", text: "" }, { icon: "tag", title: "Written Estimates", text: "" }, { icon: "star", title: "4.9 Google Rating", text: "" } ],
        } },
        { type: "serviceCategories", content: { eyebrow: "TREATMENTS", title: "Everything Your Smile Needs,", titleHighlight: "Under One Roof", categories: CATEGORIES }, style: { cardRadius: "lg", cardShadow: "md" } },
        { type: "stats", content: { items: [ { value: "15,000+", label: "Smiles Treated", icon: "users" }, { value: "2,000+", label: "Implants Placed", icon: "award" }, { value: "6", label: "Specialist Dentists", icon: "stethoscope" }, { value: "4.9★", label: "Patient Rating", icon: "star" } ] }, style: { layout: "cards", background: "light" } },
        { type: "imageBanner", content: { title: "Thinking about aligners or a smile makeover?", subtitle: "Get a 3D scan and a digital preview of your new smile before you decide.", buttonLabel: "Explore Smile Makeover", buttonHref: "/smile-makeover", image: "" } },
        { type: "about", content: {
          eyebrow: "WHY PATIENTS STAY", title: "Dentistry Without", titleHighlight: "the Anxiety",
          body: [
            `Many of our patients arrive having avoided the dentist for years. At ${biz}, we explain everything first, show you your own X-rays and photos, and never rush you into treatment.`,
            "Each specialist focuses on one area — root canals, implants, braces or children — so you are treated by the right dentist for the job.",
          ],
          image: "", points: ["Single-use and autoclave-sterilised instruments", "Low-radiation digital X-rays", "Written estimate before treatment", "EMI options on larger treatments"],
          buttonLabel: "Meet Our Dentists", buttonHref: "/dentists",
        } },
        { ...visitSteps, style: { layout: "timeline", background: "light" } },
        pricePreview,
        { type: "team", content: { eyebrow: "OUR DENTISTS", title: "Specialists Who", titleHighlight: "Listen First", members: dentists.slice(0, 4) }, style: { layout: "list" } },
        { type: "testimonials", content: { eyebrow: "PATIENT REVIEWS", title: "Real Smiles,", titleHighlight: "Real Stories", items: [
          { name: "Pooja Agarwal", role: "Clear aligner patient", text: "Dr. Simran showed me a 3D preview before we started. Nine months later my teeth are straight and nobody at work even noticed the aligners.", rating: 5 },
          { name: "Suresh Pillai", role: "Implant patient", text: "I had put off replacing my molar for years. The implant was planned step by step and the cost matched the written estimate exactly.", rating: 5 },
          { name: "Ayesha Khan", role: "Parent of a 7-year-old", text: "My daughter was terrified of dentists. Dr. Kabir turned the visit into a game — now she reminds me about her check-ups.", rating: 5 },
          { name: "Vivek Saxena", role: "Root canal patient", text: "Came in with severe pain on a Friday evening and was treated the same night. Far more comfortable than I expected.", rating: 5 },
          { name: "Meenakshi Sundaram", role: "Denture patient, 68", text: "My new dentures fit properly for the first time in years. Dr. Ananya adjusted them twice at no extra charge until I could chew comfortably.", rating: 5 },
        ] }, style: { layout: "dark" } },
        { type: "gallery", content: { eyebrow: "INSIDE THE CLINIC", title: "Calm Spaces,", titleHighlight: "Spotless Care" }, style: { layout: "masonry" } },
        { type: "faq", content: { eyebrow: "FAQ", title: "Questions Patients", titleHighlight: "Often Ask", items: [
          { q: "Is a root canal painful?", a: "Root canals are done under local anaesthesia, and most patients say it feels similar to getting a filling. Mild soreness for a day or two afterwards is normal." },
          { q: "How long does a dental implant take?", a: "Typically 3–4 months from placement to the final crown, allowing the implant to bond with the bone. Your dentist will share a timeline after the CBCT scan." },
          { q: "Am I suitable for clear aligners?", a: "Most cases of mild to moderate crowding or gaps can be treated with aligners. A 3D scan and orthodontist consultation will confirm what is right for you." },
          { q: "Do you offer EMI?", a: "Yes. No-cost EMI options are available on implants, aligners, braces and smile makeovers through partner finance providers." },
          { q: "At what age should my child first see a dentist?", a: "We recommend a first visit by age one or when the first tooth appears, then every six months." },
          { q: "How do you sterilise instruments?", a: "Every instrument is cleaned, pouched and autoclaved at 134°C, and disposables are used once only. You are welcome to see our sterilisation zone." },
        ] }, style: { background: "light" } },
        { type: "appointmentForm", content: { title: "Book Your Check-up", subtitle: "Pick a treatment, date and time — we'll confirm your slot on WhatsApp within minutes." } },
        hours,
        { ...cta, style: { layout: "minimal" } },
      ],
    },
    { slug: "treatments", title: "Treatments", isSystem: true, order: 1, sections: [
      banner("Our", "Treatments", "From routine cleaning to full-mouth rehabilitation — planned by specialists."),
      { type: "serviceCategories", content: { eyebrow: "", title: "Dental Care for", titleHighlight: "Every Need", categories: CATEGORIES }, style: { cardRadius: "lg", cardShadow: "md" } },
      { type: "features", content: { items: [
        { icon: "zap", title: "Rotary Root Canals", text: "Faster, more precise cleaning — most RCTs done in one or two sittings." },
        { icon: "grid", title: "3D CBCT Planning", text: "Implants are planned on a 3D scan to choose the right size and position." },
        { icon: "droplet", title: "Laser Gum Care", text: "Minimally invasive gum treatment with quicker healing for most patients." },
        { icon: "shield", title: "Strict Sterilisation", text: "Class-B autoclave and single-use disposables for every patient." },
      ] }, style: { background: "light", cardRadius: "lg" } },
      visitSteps,
      cta,
    ] },
    { slug: "smile-makeover", title: "Smile Makeover", isSystem: true, order: 2, sections: [
      banner("Smile", "Makeover", "Aligners, whitening, veneers and contouring — previewed digitally before you begin."),
      { type: "about", content: {
        eyebrow: "DIGITAL SMILE DESIGN", title: "See Your New Smile", titleHighlight: "Before We Start",
        body: [
          "We take photos and a 3D scan of your teeth, then design changes on screen so you can see the expected result and adjust it with your dentist.",
          "Your plan may combine aligners, whitening, veneers or gum contouring — whatever achieves a natural-looking result with the least treatment.",
        ],
        image: "", points: ["3D intra-oral scan, no messy impressions", "Digital preview of the result", "Staged plan with clear costs", "No-cost EMI available"],
        buttonLabel: "Book a Smile Consultation", buttonHref: "/book",
      } },
      { type: "pricingPlans", content: { eyebrow: "POPULAR OPTIONS", title: "Smile Makeover", titleHighlight: "Packages", plans: [
        { name: "Bright Smile", price: "₹8,000", period: "one sitting", features: ["Scaling & polishing", "In-clinic whitening", "Take-home touch-up gel", "Shade check after 2 weeks"], featured: false, buttonLabel: "Book Now", buttonHref: "/book" },
        { name: "Aligner Smile", price: "₹65,000", period: "full course", features: ["3D scan & digital preview", "Full set of clear aligners", "Monthly orthodontist reviews", "Retainers included", "No-cost EMI"], featured: true, buttonLabel: "Book Now", buttonHref: "/book" },
        { name: "Signature Veneers", price: "₹12,000", period: "per tooth", features: ["Digital smile design", "Trial smile mock-up", "E-max / ceramic veneers", "Bite & shade adjustment"], featured: false, buttonLabel: "Book Now", buttonHref: "/book" },
      ] }, style: { background: "light" } },
      { ...visitSteps, style: { layout: "cards" } },
      { type: "gallery", content: { eyebrow: "INSIDE THE CLINIC", title: "Where Smiles", titleHighlight: "Are Designed" }, style: { layout: "strip" } },
      cta,
    ] },
    { slug: "kids", title: "Kids Dentistry", isSystem: true, order: 3, sections: [
      banner("Kids", "Dentistry", "Gentle, playful dental visits that build healthy habits early."),
      { type: "features", content: { items: [
        { icon: "heart", title: "Tell-Show-Do", text: "We explain each instrument in kid-friendly words before using it." },
        { icon: "gift", title: "Brave Smile Rewards", text: "Stickers and a small reward after every visit." },
        { icon: "shield", title: "Preventive First", text: "Fluoride varnish and sealants to protect new teeth from cavities." },
        { icon: "users", title: "Parents Welcome", text: "Stay beside your child in the treatment room throughout." },
      ] }, style: { cardRadius: "full", cardShadow: "md", align: "center" } },
      { type: "priceList", content: { eyebrow: "KIDS CARE", title: "Children's", titleHighlight: "Treatment Prices", note: "Free check-up for children under 12 every Saturday (with prior booking).", groups: [
        { category: "Prevention", items: [ { name: "Child check-up", price: "₹200", note: "" }, { name: "Fluoride varnish", price: "₹800", note: "Both arches" }, { name: "Pit & fissure sealant", price: "₹600", note: "Per tooth" } ] },
        { category: "Treatment", items: [ { name: "Milk-tooth filling", price: "₹800", note: "Per tooth" }, { name: "Pulpectomy (child RCT)", price: "₹2,500", note: "Per tooth" }, { name: "Space maintainer", price: "₹3,000", note: "" } ] },
      ] } },
      { type: "faq", content: { eyebrow: "PARENTS ASK", title: "Kids Dental", titleHighlight: "FAQ", items: [
        { q: "Do milk teeth really need treatment?", a: "Yes. Milk teeth hold space for permanent teeth and help with chewing and speech. Untreated decay can cause pain and affect the teeth underneath." },
        { q: "How can I prepare my child for the first visit?", a: "Keep it positive and simple — say the dentist will count their teeth. Avoid words like 'injection' or 'pain'." },
        { q: "When should we check for braces?", a: "An orthodontic screening around age 7–8 helps spot bite or crowding problems early." },
      ] }, style: { background: "light" } },
      cta,
    ] },
    { slug: "prices", title: "Prices", isSystem: true, order: 4, sections: [
      banner("Treatment", "Prices", "Clear, upfront pricing — your exact estimate is shared in writing after the check-up."),
      pricePreview,
      { type: "features", content: { items: [
        { icon: "tag", title: "Written Estimates", text: "Every plan comes with an itemised estimate before treatment." },
        { icon: "clipboard", title: "Insurance Paperwork", text: "We help with documents for reimbursement where your policy covers dental." },
        { icon: "badge-check", title: "No-Cost EMI", text: "Spread implants, aligners and braces over 3–12 months." },
      ] }, style: { background: "dark", cardRadius: "md" } },
      { type: "faq", content: { eyebrow: "PAYMENTS", title: "Billing &", titleHighlight: "EMI Questions", items: [
        { q: "Is the consultation fee adjusted in treatment?", a: "Yes. The ₹300 check-up fee is waived if you start treatment the same day." },
        { q: "Which payment modes do you accept?", a: "UPI, debit/credit cards, net banking and cash. No-cost EMI is available on treatments above ₹10,000." },
        { q: "Will the final bill match the estimate?", a: "Yes. If anything changes during treatment, we explain why and get your consent before any extra cost." },
      ], intro: "Clear prices, written estimates and easy EMI — here's how billing works at the clinic." } as SectionSeed<"faq">["content"], style: { layout: "split" } },
      cta,
    ] },
    { slug: "dentists", title: "Our Dentists", isSystem: true, order: 5, sections: [
      banner("Meet Our", "Dentists", "Specialists in implants, root canals, orthodontics, gums and children's dentistry."),
      { type: "team", content: { eyebrow: "OUR TEAM", title: "The", titleHighlight: "Specialists", members: dentists }, style: { cardRadius: "lg", cardShadow: "md", align: "center" } },
      { type: "stats", content: { items: [ { value: "60+", label: "Years Combined Experience", icon: "award" }, { value: "15,000+", label: "Patients", icon: "users" }, { value: "12", label: "Years in Your City", icon: "map-pin" }, { value: "4.9★", label: "Google Rating", icon: "star" } ] }, style: { background: "primary" } },
      hours,
      cta,
    ] },
    { slug: "contact", title: "Contact", isSystem: true, order: 6, sections: [
      { type: "contactInfo", content: { eyebrow: "VISIT US", title: "Find", titleHighlight: "the Clinic", address: "Your City", phone: PHONE, email: EMAIL, hours: "Mon–Fri: 10 AM – 2 PM, 5 PM – 9 PM · Sat: 10 AM – 7 PM", mapEmbed: "" } },
      { type: "map", content: { eyebrow: "", title: "Get", titleHighlight: "Directions", address: "Your City", mapEmbed: "" } },
      { type: "contactForm", content: { title: "Send Us a Message", subtitle: "Ask about a treatment, prices or EMI — we usually reply within a few hours." } },
    ] },
    { slug: "book", title: "Book Appointment", isSystem: true, order: 7, sections: [
      { type: "appointmentForm", content: { title: "Book Your Dental Appointment", subtitle: "Pick a treatment, date and time — we'll confirm your slot on WhatsApp." } },
      visitSteps,
      hours,
    ] },
  ],
};
