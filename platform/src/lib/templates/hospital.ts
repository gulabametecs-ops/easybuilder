import type { TemplateDef } from "./types";

export const hospital: TemplateDef = {
  theme: {
    colors: { primary: "#0891b2", primaryDark: "#0e7490", secondary: "#082f49", accent: "#22d3ee", dark: "#082f49", light: "#ecfeff", text: "#334155", heading: "#082f49" },
    font: "Poppins", radius: "0.9rem",
  },
  header: (biz) => ({
    logoText: biz, logoImage: "",
    topbar: { show: true, address: "Open 24×7 · Emergency Care Available", phones: ["9000000000"], email: "care@example.com", social: { facebook: "#", instagram: "#", whatsapp: "#" } },
    nav: [
      { label: "Home", href: "/" }, { label: "Departments", href: "/departments" }, { label: "Doctors", href: "/doctors" }, { label: "About", href: "/about" }, { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Book Appointment", href: "/book" },
  }),
  footer: (biz) => ({
    about: "Compassionate, quality healthcare for your family.",
    columns: [
      { title: "Quick Links", links: [ { label: "Home", href: "/" }, { label: "Departments", href: "/departments" }, { label: "Doctors", href: "/doctors" }, { label: "Book Appointment", href: "/book" }, { label: "Contact", href: "/contact" } ] },
      { title: "Departments", links: [ { label: "Dental", href: "/departments" }, { label: "Eye Care", href: "/departments" }, { label: "Skin & Hair", href: "/departments" }, { label: "Mental Health", href: "/departments" }, { label: "General Medicine", href: "/departments" } ] },
    ],
    serviceAreas: ["Dental", "Eye", "Skin", "Mental Health", "ENT", "General"],
    contact: { phones: ["9000000000"], email: "care@example.com", address: "Your City" },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. All Rights Reserved.`,
  }),
  seo: (biz) => ({ title: `${biz} — Multi-Speciality Clinic & Hospital`, description: "Expert doctors, modern facilities and compassionate care. Book your appointment online.", favicon: "", ogImage: "" }),
  services: [
    { category: "Dental", title: "Dental Check-up & Cleaning", description: "Routine dental care." },
    { category: "Dental", title: "Root Canal & Implants", description: "Advanced dental treatment." },
    { category: "Eye Care", title: "Eye Examination", description: "Complete vision testing." },
    { category: "Eye Care", title: "Cataract Surgery", description: "Safe day-care surgery." },
    { category: "Skin & Hair", title: "Skin Treatments", description: "Acne, pigmentation & more." },
    { category: "Skin & Hair", title: "Hair Treatments", description: "Hair fall & transplant." },
    { category: "Mental Health", title: "Counselling & Therapy", description: "Confidential support." },
    { category: "Mental Health", title: "Psychiatric Care", description: "Expert consultation." },
    { category: "General Medicine", title: "General Consultation", description: "For fever, infections & more." },
    { category: "General Medicine", title: "Health Check-up Packages", description: "Preventive screening." },
  ],
  gallery: [...["Reception", "Consultation room", "Lab", "Dental unit", "Eye care", "Pharmacy"].map((c) => ({ category: "Our Facility", caption: c }))],
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "split", customHtml: "",
          badge: "CARING · TRUSTED · 24×7", titleTop: "Your Health,", titleHighlight: "Our Priority",
          subtitle: "", description: `${biz} offers expert doctors and modern facilities for complete family healthcare.`, image: "",
          primaryBtn: { label: "Book Appointment", href: "/book" }, secondaryBtn: { label: "Our Departments", href: "/departments" },
          features: [ { icon: "shield", title: "Expert Doctors", text: "" }, { icon: "clock", title: "24×7 Care", text: "" }, { icon: "check", title: "Modern Equipment", text: "" }, { icon: "star", title: "Trusted by Thousands", text: "" } ],
        } },
        { type: "about", content: { eyebrow: "ABOUT US", title: "Compassionate", titleHighlight: "Healthcare", body: [`${biz} is committed to providing quality, affordable healthcare with a patient-first approach.`, "Our experienced doctors and caring staff are here for you round the clock."], image: "", points: ["Qualified specialists", "Modern diagnostics", "Affordable care", "Emergency support"], buttonLabel: "About Us", buttonHref: "/about" } },
        { type: "serviceCategories", content: { eyebrow: "DEPARTMENTS", title: "Our", titleHighlight: "Departments", categories: ["Dental", "Eye Care", "Skin & Hair", "Mental Health", "General Medicine"] } },
        { type: "team", content: { eyebrow: "OUR DOCTORS", title: "Meet Our", titleHighlight: "Specialists", members: [
          { name: "Dr. Full Name", role: "Dental Surgeon", image: "", note: "BDS, MDS" },
          { name: "Dr. Full Name", role: "Ophthalmologist", image: "", note: "MS Ophthal" },
          { name: "Dr. Full Name", role: "Dermatologist", image: "", note: "MD Derma" },
          { name: "Dr. Full Name", role: "Psychiatrist", image: "", note: "MD Psych" },
        ] } },
        { type: "stats", content: { items: [ { value: "50k+", label: "Patients Treated", icon: "users" }, { value: "20+", label: "Specialists", icon: "shield" }, { value: "24×7", label: "Emergency", icon: "clock" }, { value: "12+", label: "Years", icon: "award" } ] } },
        { type: "cta", content: { title: "Need to see a doctor?", highlight: "Book an Appointment", phones: ["9000000000"], buttonLabel: "Book Now", buttonHref: "/book" } },
      ],
    },
    { slug: "departments", title: "Departments", isSystem: true, order: 1, sections: [
      { type: "serviceCategories", content: { eyebrow: "", title: "Our", titleHighlight: "Departments", categories: ["Dental", "Eye Care", "Skin & Hair", "Mental Health", "General Medicine"] } },
      { type: "cta", content: { title: "Have a health concern?", highlight: "Consult Our Experts", phones: ["9000000000"], buttonLabel: "Book Appointment", buttonHref: "/book" } },
    ] },
    { slug: "doctors", title: "Doctors", isSystem: true, order: 2, sections: [
      { type: "team", content: { eyebrow: "OUR TEAM", title: "Our", titleHighlight: "Doctors", members: [
        { name: "Dr. Full Name", role: "Dental Surgeon", image: "", note: "BDS, MDS" },
        { name: "Dr. Full Name", role: "Ophthalmologist", image: "", note: "MS Ophthal" },
        { name: "Dr. Full Name", role: "Dermatologist", image: "", note: "MD Derma" },
        { name: "Dr. Full Name", role: "Psychiatrist", image: "", note: "MD Psych" },
        { name: "Dr. Full Name", role: "General Physician", image: "", note: "MBBS, MD" },
        { name: "Dr. Full Name", role: "ENT Specialist", image: "", note: "MS ENT" },
      ] } },
    ] },
    { slug: "about", title: "About", isSystem: true, order: 3, sections: [
      { type: "about", content: { eyebrow: "ABOUT US", title: "Caring for", titleHighlight: "Our Community", body: [`${biz} has been serving the community with trusted healthcare for years.`], image: "", points: ["Patient-first", "Ethical care", "Latest technology"], buttonLabel: "", buttonHref: "" } },
      { type: "cta", content: { title: "We're here for you", highlight: "Book an Appointment", phones: ["9000000000"], buttonLabel: "Book Now", buttonHref: "/book" } },
    ] },
    { slug: "contact", title: "Contact", isSystem: true, order: 4, sections: [ { type: "contactForm", content: { title: "Contact Us", subtitle: "Questions or emergencies — reach our team." } } ] },
    { slug: "book", title: "Book Appointment", isSystem: true, order: 5, sections: [ { type: "appointmentForm", content: { title: "Book an Appointment", subtitle: "Choose a department, date and time that suits you." } } ] },
  ],
};
