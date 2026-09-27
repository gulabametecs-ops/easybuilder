import type { TemplateDef, SectionSeed } from "./types";

const PHONE = "9000000000";
const DEPARTMENTS = ["General Medicine", "Dental", "Eye Care", "Skin & Hair", "Mental Health"];

const doctors = [
  { name: "Dr. Anil Sharma", role: "General Physician", image: "", note: "MBBS, MD · 18 yrs experience" },
  { name: "Dr. Meera Krishnan", role: "Dental Surgeon", image: "", note: "BDS, MDS · Implants & root canals" },
  { name: "Dr. Farhan Ali", role: "Ophthalmologist", image: "", note: "MS Ophthal · Cataract & LASIK" },
  { name: "Dr. Sneha Patil", role: "Dermatologist", image: "", note: "MD Derma · Skin & hair" },
  { name: "Dr. Vikram Rao", role: "Psychiatrist", image: "", note: "MD Psychiatry · Counselling" },
  { name: "Dr. Kavitha Reddy", role: "ENT Specialist", image: "", note: "MS ENT · 12 yrs experience" },
];

const hours: SectionSeed<"openingHours"> = {
  type: "openingHours",
  content: {
    eyebrow: "OPD TIMINGS", title: "When to", titleHighlight: "Visit Us",
    note: "Emergency, pharmacy and diagnostics are open 24×7, including public holidays.",
    days: [
      { day: "Monday – Saturday (OPD)", hours: "8:00 AM – 9:00 PM" },
      { day: "Sunday (OPD)", hours: "9:00 AM – 1:00 PM" },
      { day: "Diagnostics & Lab", hours: "Open 24×7" },
      { day: "Emergency & Pharmacy", hours: "Open 24×7" },
    ],
  },
  style: { background: "light" },
};

const bookSteps: SectionSeed<"steps"> = {
  type: "steps",
  content: {
    eyebrow: "EASY BOOKING", title: "See a Specialist in", titleHighlight: "3 Simple Steps",
    items: [
      { title: "Choose a Department", text: "Pick the speciality or the doctor you want to consult.", icon: "stethoscope" },
      { title: "Pick a Time Slot", text: "Choose a date and time — confirmation arrives on WhatsApp.", icon: "calendar" },
      { title: "Walk In, No Waiting", text: "Arrive at your slot. Your file is ready before you are.", icon: "check" },
    ],
  },
};

const cta: SectionSeed<"cta"> = {
  type: "cta",
  content: { title: "Need to see a doctor?", highlight: "Book Your Appointment Today", phones: [PHONE], buttonLabel: "Book Appointment", buttonHref: "/book" },
};

export const hospital: TemplateDef = {
  theme: {
    colors: { primary: "#0e9aa7", primaryDark: "#0b7a85", secondary: "#0b2a3c", accent: "#5eead4", dark: "#07202e", light: "#f0f9fa", text: "#3d4f5c", heading: "#0b2a3c" },
    font: "Manrope", radius: "1rem",
  },
  header: (biz) => ({
    logoText: biz, logoImage: "",
    announcement: { show: false, text: "🩺 Full-body health check-up at ₹1,499 this month — book your slot.", link: "/book" },
    topbar: { show: true, address: "24×7 Emergency · OPD 8 AM – 9 PM", phones: [PHONE], email: "care@example.com", social: { facebook: "#", instagram: "#", whatsapp: "#" } },
    nav: [
      { label: "Home", href: "/" }, { label: "Departments", href: "/departments" }, { label: "Doctors", href: "/doctors" }, { label: "Health Packages", href: "/packages" }, { label: "About", href: "/about" }, { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Book Appointment", href: "/book" },
  }),
  footer: (biz) => ({
    about: "Experienced specialists, modern diagnostics and genuinely caring staff — complete healthcare for your family, under one roof.",
    columns: [
      { title: "Quick Links", links: [ { label: "Home", href: "/" }, { label: "Departments", href: "/departments" }, { label: "Doctors", href: "/doctors" }, { label: "Health Packages", href: "/packages" }, { label: "Book Appointment", href: "/book" }, { label: "Contact", href: "/contact" } ] },
      { title: "Departments", links: [ { label: "General Medicine", href: "/departments" }, { label: "Dental", href: "/departments" }, { label: "Eye Care", href: "/departments" }, { label: "Skin & Hair", href: "/departments" }, { label: "Mental Health", href: "/departments" } ] },
    ],
    serviceAreas: ["General Medicine", "Dental", "Eye Care", "Dermatology", "Mental Health", "ENT", "Diagnostics"],
    contact: { phones: [PHONE], email: "care@example.com", address: "Your City" },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. All Rights Reserved.`,
  }),
  seo: (biz) => ({
    title: `${biz} — Multi-Speciality Clinic & Hospital`,
    description: "Experienced specialists in general medicine, dental, eye, skin and mental health. 24×7 emergency, in-house diagnostics and easy online appointments.",
    favicon: "", ogImage: "",
    keywords: "hospital, multi speciality clinic, doctor appointment, dentist, eye hospital, dermatologist, health check-up",
    businessType: "MedicalClinic",
  }),
  services: [
    { category: "General Medicine", title: "General Consultation", description: "Fever, infections, BP, diabetes and everyday health concerns." },
    { category: "General Medicine", title: "Preventive Health Check-ups", description: "Screening packages that catch problems early." },
    { category: "Dental", title: "Dental Check-up & Cleaning", description: "Painless scaling, polishing and routine dental care." },
    { category: "Dental", title: "Root Canal & Implants", description: "Single-sitting RCTs and long-lasting implants." },
    { category: "Eye Care", title: "Comprehensive Eye Examination", description: "Vision, glaucoma and retina screening in one visit." },
    { category: "Eye Care", title: "Cataract Surgery", description: "Stitch-less day-care surgery with premium lenses." },
    { category: "Skin & Hair", title: "Skin Treatments", description: "Acne, pigmentation, allergies and anti-ageing care." },
    { category: "Skin & Hair", title: "Hair Loss Treatments", description: "PRP, medication plans and transplant consultation." },
    { category: "Mental Health", title: "Counselling & Therapy", description: "Confidential sessions for stress, anxiety and relationships." },
    { category: "Mental Health", title: "Psychiatric Care", description: "Diagnosis and treatment plans from qualified psychiatrists." },
  ],
  gallery: [
    ...["Reception & waiting lounge", "Consultation room", "Pathology lab", "Dental suite"].map((c) => ({ category: "Our Facility", caption: c })),
    ...["Eye care unit", "In-house pharmacy", "Emergency bay", "Patient ward"].map((c) => ({ category: "Care & Diagnostics", caption: c })),
  ],
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "split", customHtml: "",
          badge: "24×7 EMERGENCY · EXPERT SPECIALISTS", titleTop: "Expert Care for Every", titleHighlight: "Member of Your Family",
          subtitle: "", description: `From routine check-ups to specialist treatment, ${biz} brings experienced doctors, in-house diagnostics and a caring team together — so you get answers faster.`, image: "",
          primaryBtn: { label: "Book Appointment", href: "/book" }, secondaryBtn: { label: "Find a Doctor", href: "/doctors" },
          features: [ { icon: "stethoscope", title: "20+ Specialists", text: "" }, { icon: "clock", title: "24×7 Emergency", text: "" }, { icon: "clipboard", title: "In-House Diagnostics", text: "" }, { icon: "star", title: "4.8 Patient Rating", text: "" } ],
        } },
        { type: "features", content: { items: [
          { icon: "stethoscope", title: "Senior Specialists", text: "Consult doctors with 10–20 years of experience, not trainees." },
          { icon: "clock", title: "Minimal Waiting", text: "Timed appointments mean you're seen close to your slot." },
          { icon: "clipboard", title: "Reports in Hours", text: "In-house lab and imaging — most reports ready the same day." },
          { icon: "tag", title: "Transparent Billing", text: "Clear estimates upfront. Cashless for major insurers." },
        ] }, style: { cardShadow: "md" } },
        { type: "about", content: {
          eyebrow: "ABOUT US", title: "Healthcare That Treats You", titleHighlight: "Like Family",
          body: [
            `${biz} was founded on a simple belief — good healthcare should be expert, easy to access and delivered with kindness.`,
            "Our specialists, nurses and technicians work as one team, so your diagnosis, tests and treatment happen under one roof without the running around.",
          ],
          image: "", points: ["Qualified, experienced specialists", "Modern diagnostic equipment", "Cashless insurance support", "24×7 emergency & pharmacy"],
          buttonLabel: "About Our Hospital", buttonHref: "/about",
        } },
        { type: "serviceCategories", content: { eyebrow: "DEPARTMENTS", title: "Specialist Care,", titleHighlight: "All in One Place", categories: DEPARTMENTS } },
        { type: "team", content: { eyebrow: "OUR DOCTORS", title: "Meet Our", titleHighlight: "Specialists", members: doctors.slice(0, 4) } },
        { type: "stats", content: { items: [ { value: "50,000+", label: "Patients Treated", icon: "users" }, { value: "20+", label: "Specialist Doctors", icon: "stethoscope" }, { value: "24×7", label: "Emergency Care", icon: "clock" }, { value: "12+", label: "Years of Service", icon: "award" } ] } },
        bookSteps,
        { type: "testimonials", content: { eyebrow: "PATIENT STORIES", title: "Trusted by", titleHighlight: "Thousands of Families", items: [
          { name: "Lakshmi Narayanan", role: "Cataract surgery patient", text: "My mother's cataract surgery was quick and completely painless. Dr. Farhan explained every step and she was home the same day.", rating: 5 },
          { name: "Arjun Mehta", role: "Dental patient", text: "Had a root canal done in a single sitting with almost no discomfort. The clinic is spotless and the staff are very polite.", rating: 5 },
          { name: "Fatima Begum", role: "Emergency visit", text: "We rushed in at 2 AM with my son's high fever. The emergency team was calm, quick and kept us informed throughout.", rating: 5 },
          { name: "Rohit Deshmukh", role: "Health check-up", text: "Booked the full-body package online. Tests done in an hour, reports on WhatsApp by evening, and a proper doctor review.", rating: 5 },
        ] } },
        hours,
        { type: "faq", content: { eyebrow: "FAQ", title: "Patient", titleHighlight: "Questions", items: [
          { q: "How do I book an appointment?", a: "Book online in under a minute, call us, or send a WhatsApp message. You'll get an instant confirmation with your slot." },
          { q: "Do you accept health insurance?", a: "Yes. We offer cashless treatment with most major insurers and TPAs, and help with reimbursement paperwork for others." },
          { q: "Is emergency care available at night?", a: "Yes. Our emergency department, pharmacy and lab are open 24×7, including Sundays and public holidays." },
          { q: "How soon will I get my test reports?", a: "Most blood tests and X-rays are ready the same day. Reports are shared on WhatsApp and email, and printed copies are available at the desk." },
          { q: "Can I consult a doctor online?", a: "Yes. Video consultations are available for follow-ups and non-emergency concerns — select 'Online' when booking." },
          { q: "What should I bring to my first visit?", a: "A photo ID, your insurance card if applicable, and any previous prescriptions or reports." },
        ] } },
        cta,
      ],
    },
    { slug: "departments", title: "Departments", isSystem: true, order: 1, sections: [
      { type: "serviceCategories", content: { eyebrow: "", title: "Our", titleHighlight: "Departments", categories: DEPARTMENTS } },
      bookSteps,
      { type: "cta", content: { title: "Have a health concern?", highlight: "Consult Our Experts", phones: [PHONE], buttonLabel: "Book Appointment", buttonHref: "/book" } },
    ] },
    { slug: "doctors", title: "Doctors", isSystem: true, order: 2, sections: [
      { type: "team", content: { eyebrow: "OUR TEAM", title: "Our", titleHighlight: "Doctors", members: doctors } },
      hours,
      cta,
    ] },
    { slug: "packages", title: "Health Packages", isSystem: true, order: 3, sections: [
      { type: "pricingPlans", content: { eyebrow: "PREVENTIVE CARE", title: "Health Check-up", titleHighlight: "Packages", plans: [
        { name: "Basic Wellness", price: "₹999", period: "", features: ["Complete blood count", "Blood sugar (fasting)", "Lipid profile", "Urine routine", "Physician consultation"], featured: false, buttonLabel: "Book Now", buttonHref: "/book" },
        { name: "Full Body", price: "₹1,499", period: "", features: ["Everything in Basic", "Liver & kidney function", "Thyroid profile", "HbA1c", "ECG", "Physician review of reports"], featured: true, buttonLabel: "Book Now", buttonHref: "/book" },
        { name: "Executive", price: "₹3,999", period: "", features: ["Everything in Full Body", "Vitamin D & B12", "Chest X-ray", "2D Echo / TMT", "Eye & dental check-up", "Dietitian consultation"], featured: false, buttonLabel: "Book Now", buttonHref: "/book" },
      ] } },
      cta,
    ] },
    { slug: "about", title: "About", isSystem: true, order: 4, sections: [
      { type: "about", content: { eyebrow: "ABOUT US", title: "Caring for", titleHighlight: "Our Community", body: [
        `For over a decade, ${biz} has been the first call for thousands of families — for a child's fever at midnight, a parent's surgery or a routine check-up.`,
        "We invest in experienced specialists, modern equipment and a patient-first culture, so every visit feels unhurried, clear and reassuring.",
      ], image: "", points: ["Patient-first", "Ethical, evidence-based care", "Latest technology", "Affordable & transparent"], buttonLabel: "", buttonHref: "" } },
      { type: "stats", content: { items: [ { value: "50,000+", label: "Patients Treated", icon: "users" }, { value: "20+", label: "Specialists", icon: "stethoscope" }, { value: "15,000+", label: "Procedures", icon: "heart" }, { value: "12+", label: "Years", icon: "award" } ] } },
      cta,
    ] },
    { slug: "contact", title: "Contact", isSystem: true, order: 5, sections: [
      { type: "contactForm", content: { title: "Contact Us", subtitle: "Questions about treatment, billing or insurance? Our help desk responds quickly. For emergencies, call us directly." } },
      hours,
    ] },
    { slug: "book", title: "Book Appointment", isSystem: true, order: 6, sections: [
      { type: "appointmentForm", content: { title: "Book an Appointment", subtitle: "Choose a department, date and time — we'll confirm your slot on WhatsApp." } },
      bookSteps,
    ] },
  ],
};
