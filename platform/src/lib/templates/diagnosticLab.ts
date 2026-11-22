import type { TemplateDef, SectionSeed } from "./types";

const PHONE = "9000000000";
const EMAIL = "hello@example.com";
const CATEGORIES = ["Blood Tests", "Health Packages", "Radiology & Imaging", "Home Collection", "Corporate Health"];

const banner = (title: string, titleHighlight: string, subtitle: string): SectionSeed<"banner"> => ({
  type: "banner",
  content: { title, titleHighlight, subtitle, image: "", bgColor: "#0b1f4d", imageOpacity: 25, overlayOpacity: 80 },
});

const packages: SectionSeed<"pricingPlans"> = {
  type: "pricingPlans",
  content: {
    eyebrow: "HEALTH PACKAGES", title: "Preventive Check-ups", titleHighlight: "for Every Age",
    plans: [
      { name: "Essential Screen", price: "₹799", period: "38 parameters", features: ["Complete blood count (CBC)", "Fasting blood sugar", "Lipid profile", "Urine routine", "Free home sample collection"], featured: false, buttonLabel: "Book Now", buttonHref: "/book" },
      { name: "Full Body Advanced", price: "₹1,799", period: "86 parameters", features: ["Everything in Essential", "Liver & kidney function", "Thyroid profile (T3, T4, TSH)", "HbA1c", "Vitamin D & B12", "Doctor review of reports"], featured: true, buttonLabel: "Book Now", buttonHref: "/book" },
      { name: "Senior Citizen Care", price: "₹2,999", period: "100+ parameters", features: ["Everything in Full Body", "ECG", "Chest X-ray", "PSA (men) / Pap smear (women)", "Calcium & iron studies", "Priority home visit"], featured: false, buttonLabel: "Book Now", buttonHref: "/book" },
    ],
  },
};

const collectionSteps: SectionSeed<"steps"> = {
  type: "steps",
  content: {
    eyebrow: "HOME SAMPLE COLLECTION", title: "Tests at Home in", titleHighlight: "4 Easy Steps",
    items: [
      { title: "Book Online or Call", text: "Choose your tests or package and a convenient morning slot.", icon: "phone" },
      { title: "Phlebotomist Visits", text: "A trained, ID-verified phlebotomist arrives with sealed, single-use kits.", icon: "home" },
      { title: "Cold-Chain to Lab", text: "Samples travel in temperature-controlled boxes to our central lab.", icon: "truck" },
      { title: "Reports on WhatsApp", text: "Download digitally signed reports online — most within 24 hours.", icon: "check" },
    ],
  },
  style: { background: "light", cardRadius: "md" },
};

const corporateClients: SectionSeed<"logos"> = {
  type: "logos",
  content: { title: "Trusted by teams across Your City", items: ["IT Services Client", "Textile Mill Client", "Pharma Unit Client", "School Partner", "Logistics Client", "Auto Components Client"] },
};

const cta: SectionSeed<"cta"> = {
  type: "cta",
  content: { title: "Time for your health check-up?", highlight: "Book a Free Home Collection", phones: [PHONE], buttonLabel: "Book a Test", buttonHref: "/book" },
  style: { background: "dark" },
};

export const diagnosticLab: TemplateDef = {
  theme: {
    colors: { primary: "#2563eb", primaryDark: "#1d4ed8", secondary: "#0b1f4d", accent: "#38bdf8", dark: "#0a1633", light: "#eff4ff", text: "#3f4a5f", heading: "#0b1f4d" },
    font: "Rubik", radius: "0.375rem",
  },
  header: (biz) => ({
    design: "minimal",
    logoText: biz, logoImage: "",
    announcement: { show: true, text: "Full Body Advanced (86 tests) at ₹1,799 with free home collection — this month only.", link: "/packages" },
    topbar: { show: true, address: "Collection centre open 7 AM – 9 PM · Home visits from 6 AM", phones: [PHONE], email: EMAIL, social: { facebook: "#", instagram: "#", whatsapp: "#" } },
    nav: [
      { label: "Home", href: "/" }, { label: "Tests", href: "/tests" }, { label: "Health Packages", href: "/packages" }, { label: "Home Collection", href: "/home-collection" }, { label: "Corporate", href: "/corporate" }, { label: "Reports", href: "/reports" }, { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Book a Test", href: "/book" },
  }),
  footer: (biz) => ({
    design: "classic",
    about: `${biz} is a modern diagnostic centre for blood tests, health packages and radiology — with home sample collection, quality-controlled processes and reports available online.`,
    columns: [
      { title: "Services", links: [ { label: "All Tests", href: "/tests" }, { label: "Health Packages", href: "/packages" }, { label: "Home Collection", href: "/home-collection" }, { label: "Corporate Check-ups", href: "/corporate" } ] },
      { title: "Patients", links: [ { label: "Download Reports", href: "/reports" }, { label: "Book a Test", href: "/book" }, { label: "About Us", href: "/about" }, { label: "Contact", href: "/contact" } ] },
    ],
    serviceAreas: ["Pathology", "Biochemistry", "Hormones & Thyroid", "X-ray", "Ultrasound", "ECG", "Home Collection"],
    contact: { phones: [PHONE], email: EMAIL, address: "Your City" },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. All Rights Reserved.`,
  }),
  seo: (biz) => ({
    title: `${biz} — Diagnostic Lab, Blood Tests & Home Sample Collection`,
    description: "Blood tests, full body check-ups, X-ray, ultrasound and ECG with free home sample collection and online reports. Corporate health check-ups available.",
    favicon: "", ogImage: "",
    keywords: "diagnostic lab, blood test at home, full body checkup, pathology lab, thyroid test, x-ray, ultrasound, health package",
    businessType: "MedicalClinic", priceRange: "₹",
  }),
  services: [
    { category: "Blood Tests", title: "Complete Blood Count (CBC)", description: "Haemoglobin, WBC, platelets and more — from ₹250." },
    { category: "Blood Tests", title: "Thyroid Profile", description: "T3, T4 and TSH to assess thyroid function — from ₹450." },
    { category: "Blood Tests", title: "Diabetes Panel", description: "Fasting, post-meal sugar and HbA1c — from ₹550." },
    { category: "Health Packages", title: "Full Body Check-up", description: "86 parameters covering heart, liver, kidney, thyroid and vitamins." },
    { category: "Health Packages", title: "Women's Wellness", description: "Hormones, iron, calcium, vitamin D and thyroid in one package." },
    { category: "Radiology & Imaging", title: "Digital X-ray", description: "Low-dose digital X-rays with same-day reporting." },
    { category: "Radiology & Imaging", title: "Ultrasound & Sonography", description: "Abdomen, pelvis and obstetric scans by qualified radiologists." },
    { category: "Radiology & Imaging", title: "ECG", description: "Resting 12-lead ECG, also available at home." },
    { category: "Home Collection", title: "Home Sample Collection", description: "Free doorstep collection for orders above ₹500, from 6 AM." },
    { category: "Home Collection", title: "Senior & Bedridden Care", description: "Patient, unhurried collection for elderly and home-bound patients." },
    { category: "Corporate Health", title: "Employee Health Check-ups", description: "On-site camps and annual check-ups with consolidated reporting." },
    { category: "Corporate Health", title: "Pre-Employment Screening", description: "Standard pre-joining test panels with fast turnaround for HR teams." },
  ],
  gallery: [
    ...["Collection centre reception", "Fully automated analyser", "Biochemistry section", "Sample processing bay"].map((c) => ({ category: "Our Lab", caption: c })),
    ...["Digital X-ray room", "Ultrasound suite", "Home collection team", "Corporate health camp"].map((c) => ({ category: "Imaging & Outreach", caption: c })),
  ],
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "marquee", customHtml: "",
          badge: "FREE HOME SAMPLE COLLECTION · REPORTS ONLINE", titleTop: "Accurate Tests,", titleHighlight: "Reports You Can Trust",
          subtitle: "", description: `Book blood tests, full body check-ups and scans with ${biz}. Our phlebotomist visits your home, and digitally signed reports arrive on WhatsApp — most within 24 hours.`, image: "",
          primaryBtn: { label: "Book a Test", href: "/book" }, secondaryBtn: { label: "View Packages", href: "/packages" },
          features: [ { icon: "home", title: "Home Collection", text: "" }, { icon: "clock", title: "24-Hour Reports", text: "" }, { icon: "shield", title: "Quality Controlled", text: "" }, { icon: "tag", title: "Fair Prices", text: "" } ],
        } },
        { type: "stats", content: { items: [ { value: "3 Lakh+", label: "Tests Every Year", icon: "clipboard" }, { value: "1,200+", label: "Tests Available", icon: "grid" }, { value: "24 hrs", label: "Typical Report Time", icon: "clock" }, { value: "150+", label: "Corporate Clients", icon: "handshake" } ] }, style: { layout: "minimal", spacingTop: "sm" } },
        { type: "priceList", content: { eyebrow: "MOST BOOKED", title: "Popular Tests &", titleHighlight: "Today's Rates", note: "Free home collection on orders above ₹500. Fasting of 10–12 hours needed for sugar and lipid tests.", groups: [
          { category: "Routine", items: [ { name: "Complete Blood Count (CBC)", price: "₹250", note: "Report in 12 hrs" }, { name: "Fasting Blood Sugar", price: "₹80", note: "" }, { name: "Urine Routine", price: "₹150", note: "" }, { name: "Dengue NS1 Antigen", price: "₹600", note: "Same day" } ] },
          { category: "Profiles", items: [ { name: "Thyroid Profile (T3, T4, TSH)", price: "₹450", note: "" }, { name: "Lipid Profile", price: "₹450", note: "Fasting" }, { name: "HbA1c", price: "₹400", note: "" }, { name: "Vitamin D + B12 combo", price: "₹1,399", note: "Save ₹200" } ] },
        ] }, style: { background: "light", cardRadius: "sm" } },
        packages,
        { type: "features", content: { items: [
          { icon: "badge-check", title: "Daily Quality Checks", text: "Internal and external quality control runs on every analyser, every day." },
          { icon: "user-check", title: "Trained Phlebotomists", text: "ID-verified staff using sealed, single-use needles and tubes." },
          { icon: "clipboard", title: "Pathologist Verified", text: "Every report is reviewed and digitally signed by a qualified pathologist." },
          { icon: "mail", title: "Reports Online", text: "Download past and current reports anytime with your mobile number." },
        ], eyebrow: "WHY PATIENTS TRUST US", title: "Quality at", titleHighlight: "Every Step" } as SectionSeed<"features">["content"], style: { layout: "split", background: "light" } },
        { ...collectionSteps, style: { background: "dark" } },
        { type: "serviceCategories", content: { eyebrow: "WHAT WE OFFER", title: "Complete Diagnostics,", titleHighlight: "One Trusted Lab", categories: CATEGORIES }, style: { cardRadius: "sm", cardShadow: "sm" } },
        { type: "about", content: {
          eyebrow: "INSIDE OUR LAB", title: "Fully Automated,", titleHighlight: "Pathologist-Led",
          body: [
            `Every sample at ${biz} is barcoded at collection and tracked through fully automated analysers — so there's no manual labelling and no mix-ups.`,
            "Our pathologists review abnormal values personally and call your doctor when a result needs urgent attention.",
          ],
          image: "", points: ["Barcoded, tracked samples", "Daily internal QC, monthly external QC", "Critical-value alerts to your doctor", "Digitally signed PDF reports"],
          buttonLabel: "About the Lab", buttonHref: "/about",
        }, style: { layout: "stacked" } },
        { type: "imageBanner", content: { title: "Health check-ups for your whole team", subtitle: "On-site camps, annual check-ups and pre-employment screening with a single consolidated report.", buttonLabel: "Corporate Plans", buttonHref: "/corporate", image: "" } },
        corporateClients,
        { type: "testimonials", content: { eyebrow: "REVIEWS", title: "What Our", titleHighlight: "Patients Say", items: [
          { name: "Rajesh Gupta", role: "Full Body Advanced", text: "The phlebotomist arrived at 6:30 AM sharp, was very gentle, and the report was on WhatsApp the same evening.", rating: 5 },
          { name: "Sunita Deshpande", role: "Daughter of a senior patient", text: "They collected my father's sample at home with great patience. Saved us a tiring trip to the centre.", rating: 5 },
          { name: "Harpreet Kaur", role: "HR Manager", text: "Organised a health camp for 220 employees in one morning. The consolidated report made our wellness planning easy.", rating: 5 },
          { name: "Mohammed Rizwan", role: "Ultrasound patient", text: "Clear instructions beforehand, no waiting at the centre, and the radiologist explained the findings patiently.", rating: 4 },
        ] }, style: { background: "light" } },
        { type: "downloads", content: { eyebrow: "BEFORE YOUR TEST", title: "Preparation", titleHighlight: "Guides", items: [
          { title: "Fasting Test Guide", description: "Which tests need 10–12 hours of fasting and what you can drink.", link: "", icon: "clock" },
          { title: "Ultrasound Preparation", description: "Water intake and fasting instructions for abdominal and pelvic scans.", link: "", icon: "clipboard" },
          { title: "Urine & Stool Samples", description: "How to collect samples correctly at home.", link: "", icon: "droplet" },
          { title: "Corporate Camp Checklist", description: "Space, timing and employee list format for on-site camps.", link: "", icon: "book" },
        ] } },
        { type: "faq", content: { eyebrow: "FAQ", title: "Common", titleHighlight: "Questions", items: [
          { q: "Is home sample collection free?", a: "Yes, for orders above ₹500 within our service area. A nominal ₹100 visit charge applies to smaller orders." },
          { q: "How soon will I get my reports?", a: "Most routine blood tests are reported within 24 hours. Specialised tests may take 2–5 days — the expected time is shown when you book." },
          { q: "Do I need to fast before my test?", a: "Sugar, lipid profile and full body packages need 10–12 hours of fasting. Water is allowed. We'll remind you the evening before." },
          { q: "How do I download my report?", a: "Visit the Reports page and enter your registered mobile number and booking ID. You'll also receive a PDF link on WhatsApp and email." },
          { q: "Do I need a doctor's prescription?", a: "Not for most blood tests and health packages. Some radiology scans require a doctor's referral." },
          { q: "Can I pay after the sample is collected?", a: "Yes. Pay by UPI or card to the phlebotomist, or online via the link we send after booking." },
        ] }, style: { background: "light" } },
        cta,
      ],
    },
    { slug: "tests", title: "Tests", isSystem: true, order: 1, sections: [
      banner("Test", "Menu", "1,200+ tests across pathology, biochemistry, hormones and imaging."),
      { type: "priceList", content: { eyebrow: "POPULAR TESTS", title: "Individual Test", titleHighlight: "Prices", note: "Prices include home collection for orders above ₹500. Ask us for any test not listed.", groups: [
        { category: "Blood & Routine", items: [
          { name: "Complete Blood Count (CBC)", price: "₹250", note: "Report in 12 hrs" },
          { name: "ESR", price: "₹150", note: "" },
          { name: "Urine Routine", price: "₹150", note: "" },
          { name: "Blood Group & Rh", price: "₹120", note: "" },
        ] },
        { category: "Biochemistry & Hormones", items: [
          { name: "Lipid Profile", price: "₹450", note: "Fasting required" },
          { name: "Liver Function Test", price: "₹550", note: "" },
          { name: "Kidney Function Test", price: "₹550", note: "" },
          { name: "Thyroid Profile (T3, T4, TSH)", price: "₹450", note: "" },
          { name: "HbA1c", price: "₹400", note: "" },
          { name: "Vitamin D (25-OH)", price: "₹900", note: "" },
        ] },
        { category: "Radiology", items: [
          { name: "Digital X-ray (single view)", price: "₹350", note: "" },
          { name: "Ultrasound Abdomen", price: "₹1,200", note: "Prep required" },
          { name: "ECG", price: "₹300", note: "Home ECG ₹500" },
        ] },
      ] }, style: { cardRadius: "sm" } },
      { type: "serviceCategories", content: { eyebrow: "DEPARTMENTS", title: "Browse by", titleHighlight: "Category", categories: CATEGORIES }, style: { background: "light" } },
      cta,
    ] },
    { slug: "packages", title: "Health Packages", isSystem: true, order: 2, sections: [
      banner("Health", "Packages", "Preventive check-ups designed by doctors, priced for families."),
      packages,
      { type: "features", content: { items: [
        { icon: "heart-pulse", title: "Cardiac Risk Add-on", text: "hs-CRP, Lp(a) and homocysteine — ₹1,200." },
        { icon: "droplet", title: "Diabetes Care Add-on", text: "HbA1c, insulin and urine microalbumin — ₹900." },
        { icon: "users", title: "Family Offer", text: "Book 3 or more packages together and save 15%." },
      ] }, style: { background: "dark", cardRadius: "md" } },
      { type: "faq", content: { eyebrow: "CHOOSING A PACKAGE", title: "Which Package", titleHighlight: "Is Right for Me?", items: [
        { q: "I'm under 30 and healthy — which package?", a: "Essential Screen once a year is enough for most young adults. Add Vitamin D and B12 if you work indoors." },
        { q: "My parents are above 60.", a: "Senior Citizen Care covers heart, kidney, bone and cancer-screening markers, with a priority home visit." },
        { q: "Do packages include a doctor consultation?", a: "Full Body Advanced and Senior Citizen Care include a free tele-review of your reports with our physician." },
      ], intro: "Not sure which package fits? Here's a quick guide — or call us and our team will help you choose." } as SectionSeed<"faq">["content"], style: { layout: "split" } },
      cta,
    ] },
    { slug: "home-collection", title: "Home Collection", isSystem: true, order: 3, sections: [
      banner("Home Sample", "Collection", "Skip the queue — we come to you from 6 AM, seven days a week."),
      collectionSteps,
      { type: "openingHours", content: { eyebrow: "SLOTS", title: "Home Visit", titleHighlight: "Timings", note: "Fasting samples are collected first in the morning. Book by 9 PM for the next day.", days: [
        { day: "Monday – Saturday", hours: "6:00 AM – 7:00 PM" },
        { day: "Sunday", hours: "6:00 AM – 1:00 PM" },
        { day: "Collection centre walk-in", hours: "7:00 AM – 9:00 PM" },
      ] } },
      { type: "faq", content: { eyebrow: "HOME VISITS", title: "Home Collection", titleHighlight: "FAQ", items: [
        { q: "Which areas do you cover?", a: "We cover most of Your City and nearby suburbs. Enter your pincode while booking to confirm." },
        { q: "Is it safe?", a: "Every phlebotomist is trained, ID-verified and uses sealed, single-use kits opened in front of you." },
        { q: "Can you collect from an office or hospital?", a: "Yes, we can collect from any address you provide, including workplaces and care homes." },
      ] }, style: { background: "light" } },
      cta,
    ] },
    { slug: "corporate", title: "Corporate", isSystem: true, order: 4, sections: [
      banner("Corporate", "Health Check-ups", "Annual check-ups, on-site camps and pre-employment screening for teams of any size."),
      { type: "about", content: {
        eyebrow: "FOR HR & ADMIN TEAMS", title: "Employee Health,", titleHighlight: "Simply Managed",
        body: [
          `${biz} runs on-site health camps and centre-based check-ups for offices, factories and schools — with one point of contact and one consolidated report.`,
          "Employees get individual reports privately on their phones, while HR receives an anonymised summary of health trends.",
        ],
        image: "", points: ["On-site camps for 20 to 2,000 employees", "Pre-employment test panels", "Anonymised health-trend dashboard", "Monthly or annual billing"],
        buttonLabel: "Request a Proposal", buttonHref: "/book",
      } },
      corporateClients,
      { type: "stats", content: { items: [ { value: "150+", label: "Companies Served", icon: "factory" }, { value: "40,000+", label: "Employees Screened", icon: "users" }, { value: "48 hrs", label: "Consolidated Report", icon: "clock" }, { value: "1", label: "Dedicated Manager", icon: "headset" } ] }, style: { background: "primary" } },
      { type: "cta", content: { title: "Planning an employee health camp?", highlight: "Get a Corporate Quote", phones: [PHONE], buttonLabel: "Request a Proposal", buttonHref: "/book" }, style: { background: "dark" } },
    ] },
    { slug: "reports", title: "Reports", isSystem: true, order: 5, sections: [
      banner("Download", "Reports", "Access your digitally signed reports anytime, from any device."),
      { type: "steps", content: { eyebrow: "ONLINE REPORTS", title: "Get Your Report in", titleHighlight: "3 Steps", items: [
        { title: "Enter Mobile Number", text: "Use the number registered at the time of booking.", icon: "phone" },
        { title: "Verify with OTP", text: "A one-time password keeps your reports private.", icon: "shield" },
        { title: "Download PDF", text: "View, download or share the digitally signed report.", icon: "check" },
      ] } },
      { type: "contactForm", content: { title: "Can't Find Your Report?", subtitle: "Share your name, mobile number and booking ID — our support team will send it to you." } },
      cta,
    ] },
    { slug: "about", title: "About", isSystem: true, order: 6, sections: [
      banner("About", biz, "Reliable diagnostics, delivered with care."),
      { type: "visionMission", content: {
        eyebrow: "WHO WE ARE",
        visionTitle: "Our Vision", visionText: "Make accurate, affordable diagnostics easy for every family in Your City.",
        missionTitle: "Our Mission", missionText: "Combine automated lab technology, strict quality control and doorstep convenience so people test early and decide with confidence.",
        valuesTitle: "What We Stand For",
        values: [
          { icon: "badge-check", title: "Accuracy", text: "Daily quality control and pathologist-reviewed reports." },
          { icon: "tag", title: "Fair Pricing", text: "Published prices with no surprise charges." },
          { icon: "heart", title: "Patient Comfort", text: "Gentle collection and clear, respectful communication." },
        ],
      } },
      { type: "team", content: { eyebrow: "OUR EXPERTS", title: "Lab", titleHighlight: "Leadership", members: [
        { name: "Dr. Prakash Venkatesh", role: "Chief Pathologist", image: "", note: "MD Pathology · 20 yrs" },
        { name: "Dr. Shalini Mathur", role: "Consultant Radiologist", image: "", note: "MD Radiology · Ultrasound & X-ray" },
        { name: "Dr. Aditya Joshi", role: "Microbiologist", image: "", note: "MD Microbiology" },
        { name: "Ms. Reena Thomas", role: "Quality Manager", image: "", note: "M.Sc. Biochemistry · 15 yrs" },
      ] }, style: { cardRadius: "md", cardShadow: "md" } },
      { type: "gallery", content: { eyebrow: "INSIDE THE LAB", title: "Our", titleHighlight: "Facility" }, style: { layout: "masonry" } },
      cta,
    ] },
    { slug: "contact", title: "Contact", isSystem: true, order: 7, sections: [
      { type: "contactInfo", content: { eyebrow: "REACH US", title: "Visit Our", titleHighlight: "Collection Centre", address: "Your City", phone: PHONE, email: EMAIL, hours: "Mon–Sun: 7 AM – 9 PM", mapEmbed: "" } },
      { type: "map", content: { eyebrow: "", title: "Find", titleHighlight: "Us", address: "Your City", mapEmbed: "" } },
      { type: "contactForm", content: { title: "Write to Us", subtitle: "Questions about tests, prices or reports? We reply within a few hours." } },
    ] },
    { slug: "book", title: "Book a Test", isSystem: true, order: 8, sections: [
      banner("Book a", "Test", "Home collection or centre visit — your choice."),
      { type: "quoteForm", content: { title: "Book Your Test or Package", subtitle: "Tell us the tests, preferred date and address. We'll confirm the slot and price on WhatsApp.", showSidebar: true } },
      collectionSteps,
    ] },
  ],
};
