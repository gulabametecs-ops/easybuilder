import type { TemplateDef } from "./types";

export const school: TemplateDef = {
  theme: {
    colors: { primary: "#f59e0b", primaryDark: "#d97706", secondary: "#1e293b", accent: "#fbbf24", dark: "#0f172a", light: "#fffbeb", text: "#334155", heading: "#1e293b" },
    font: "Poppins", radius: "0.9rem",
  },
  header: (biz) => ({
    logoText: biz, logoImage: "",
    announcement: { show: false, text: "🎓 Admissions open for the new session — enquire now!", link: "/admission" },
    topbar: { show: true, address: "Building bright futures", phones: ["9000000000"], email: "info@example.com", social: { facebook: "#", instagram: "#", whatsapp: "#" } },
    nav: [
      { label: "Home", href: "/" }, { label: "Programs", href: "/programs" }, { label: "Faculty", href: "/faculty" }, { label: "Fees", href: "/fees" }, { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Apply for Admission", href: "/admission" },
  }),
  footer: (biz) => ({
    about: "Quality education and coaching that helps students excel.",
    columns: [
      { title: "Quick Links", links: [ { label: "Home", href: "/" }, { label: "Programs", href: "/programs" }, { label: "Faculty", href: "/faculty" }, { label: "Fees", href: "/fees" }, { label: "Admission", href: "/admission" } ] },
      { title: "Programs", links: [ { label: "Foundation (6–10)", href: "/programs" }, { label: "Board Exams", href: "/programs" }, { label: "JEE / NEET", href: "/programs" }, { label: "Spoken English", href: "/programs" } ] },
    ],
    serviceAreas: ["Foundation", "Board Exams", "JEE", "NEET", "Spoken English"],
    contact: { phones: ["9000000000"], email: "info@example.com", address: "Your City" },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. All Rights Reserved.`,
  }),
  seo: (biz) => ({ title: `${biz} — School & Coaching Institute`, description: "Expert faculty, proven results and a caring environment. Admissions open — apply today.", favicon: "", ogImage: "" }),
  services: [
    { category: "Foundation (Classes 6–10)", title: "Maths Foundation", description: "Strong concepts from the basics." },
    { category: "Foundation (Classes 6–10)", title: "Science Foundation", description: "Practical, concept-based learning." },
    { category: "Foundation (Classes 6–10)", title: "English & Social", description: "All-round academic support." },
    { category: "Board Exams (11–12)", title: "Physics, Chemistry, Maths", description: "Board + competitive prep." },
    { category: "Board Exams (11–12)", title: "Biology", description: "For medical aspirants." },
    { category: "Board Exams (11–12)", title: "Commerce", description: "Accounts, Economics, Business." },
    { category: "Competitive Exams", title: "JEE (Main & Advanced)", description: "Engineering entrance coaching." },
    { category: "Competitive Exams", title: "NEET", description: "Medical entrance coaching." },
    { category: "Competitive Exams", title: "Foundation Olympiad", description: "For younger students." },
    { category: "Skill Courses", title: "Spoken English", description: "Confident communication." },
    { category: "Skill Courses", title: "Computer Basics", description: "Digital literacy." },
  ],
  gallery: [...["Classroom", "Library", "Science lab", "Results day", "Campus", "Seminar"].map((c) => ({ category: "Our Campus", caption: c }))],
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "classic", customHtml: "",
          badge: "ADMISSIONS OPEN", titleTop: "Learn Today,", titleHighlight: "Lead Tomorrow",
          subtitle: "", description: `${biz} provides quality education and coaching with experienced faculty and a proven track record of results.`, image: "",
          primaryBtn: { label: "Apply Now", href: "/admission" }, secondaryBtn: { label: "Our Programs", href: "/programs" },
          features: [ { icon: "graduation", title: "Expert Faculty", text: "" }, { icon: "award", title: "Proven Results", text: "" }, { icon: "users", title: "Small Batches", text: "" }, { icon: "book", title: "Study Material", text: "" } ],
        } },
        { type: "about", content: { eyebrow: "ABOUT US", title: "Where Students", titleHighlight: "Succeed", body: [`${biz} is dedicated to nurturing every student with personal attention and modern teaching methods.`, "Our results speak for themselves — year after year."], image: "", points: ["Experienced teachers", "Regular tests & feedback", "Doubt-clearing sessions", "Parent-teacher meetings"], buttonLabel: "About Us", buttonHref: "/about" } },
        { type: "serviceCategories", content: { eyebrow: "PROGRAMS", title: "Our", titleHighlight: "Programs", categories: ["Foundation (Classes 6–10)", "Board Exams (11–12)", "Competitive Exams", "Skill Courses"] } },
        { type: "stats", content: { items: [ { value: "5000+", label: "Students Taught", icon: "users" }, { value: "95%", label: "Success Rate", icon: "award" }, { value: "30+", label: "Expert Faculty", icon: "graduation" }, { value: "15+", label: "Years", icon: "star" } ] } },
        { type: "team", content: { eyebrow: "OUR FACULTY", title: "Meet Our", titleHighlight: "Teachers", members: [
          { name: "Teacher Name", role: "Mathematics", image: "", note: "M.Sc, B.Ed" },
          { name: "Teacher Name", role: "Physics", image: "", note: "M.Sc" },
          { name: "Teacher Name", role: "Chemistry", image: "", note: "M.Sc" },
          { name: "Teacher Name", role: "Biology", image: "", note: "M.Sc, B.Ed" },
        ] } },
        { type: "steps", content: { eyebrow: "ADMISSION", title: "How to", titleHighlight: "Join", items: [
          { title: "Enquire", text: "Fill the admission form", icon: "edit" },
          { title: "Counselling", text: "Meet our counsellor", icon: "headset" },
          { title: "Assessment", text: "Know your level", icon: "clipboard" },
          { title: "Enroll", text: "Start your journey", icon: "graduation" },
        ] } },
        { type: "cta", content: { title: "Ready to excel?", highlight: "Apply for Admission", phones: ["9000000000"], buttonLabel: "Apply Now", buttonHref: "/admission" } },
      ],
    },
    { slug: "about", title: "About", isSystem: true, order: 1, sections: [
      { type: "about", content: { eyebrow: "ABOUT US", title: "Our", titleHighlight: "Mission", body: [`${biz} believes every student can achieve greatness with the right guidance.`], image: "", points: ["Concept-based teaching", "Individual attention", "Discipline & values"], buttonLabel: "", buttonHref: "" } },
      { type: "stats", content: { items: [ { value: "5000+", label: "Students", icon: "users" }, { value: "95%", label: "Results", icon: "award" }, { value: "30+", label: "Faculty", icon: "graduation" }, { value: "15+", label: "Years", icon: "star" } ] } },
      { type: "cta", content: { title: "Join us today", highlight: "Admissions Open", phones: ["9000000000"], buttonLabel: "Apply Now", buttonHref: "/admission" } },
    ] },
    { slug: "programs", title: "Programs", isSystem: true, order: 2, sections: [
      { type: "serviceCategories", content: { eyebrow: "", title: "Our", titleHighlight: "Programs", categories: ["Foundation (Classes 6–10)", "Board Exams (11–12)", "Competitive Exams", "Skill Courses"] } },
      { type: "cta", content: { title: "Not sure which program?", highlight: "Talk to a Counsellor", phones: ["9000000000"], buttonLabel: "Apply Now", buttonHref: "/admission" } },
    ] },
    { slug: "faculty", title: "Faculty", isSystem: true, order: 3, sections: [
      { type: "team", content: { eyebrow: "OUR TEAM", title: "Our", titleHighlight: "Faculty", members: [
        { name: "Teacher Name", role: "Mathematics", image: "", note: "M.Sc, B.Ed" },
        { name: "Teacher Name", role: "Physics", image: "", note: "M.Sc" },
        { name: "Teacher Name", role: "Chemistry", image: "", note: "M.Sc" },
        { name: "Teacher Name", role: "Biology", image: "", note: "M.Sc, B.Ed" },
        { name: "Teacher Name", role: "English", image: "", note: "M.A, B.Ed" },
        { name: "Teacher Name", role: "Commerce", image: "", note: "M.Com" },
      ] } },
    ] },
    { slug: "fees", title: "Fees", isSystem: true, order: 4, sections: [
      { type: "priceList", content: { eyebrow: "", title: "Course", titleHighlight: "Fees", note: "Fees may vary by batch. Scholarships available for meritorious students.", groups: [
        { category: "Foundation (Classes 6–10)", items: [ { name: "Full Year Program", price: "₹18,000/yr", note: "" }, { name: "Single Subject", price: "₹6,000/yr", note: "" } ] },
        { category: "Board Exams (11–12)", items: [ { name: "PCM / PCB", price: "₹35,000/yr", note: "" }, { name: "Commerce", price: "₹28,000/yr", note: "" } ] },
        { category: "Competitive Exams", items: [ { name: "JEE (2-year)", price: "₹55,000/yr", note: "" }, { name: "NEET (2-year)", price: "₹55,000/yr", note: "" } ] },
      ] } },
      { type: "cta", content: { title: "Questions about fees?", highlight: "Contact Us", phones: ["9000000000"], buttonLabel: "Apply Now", buttonHref: "/admission" } },
    ] },
    { slug: "contact", title: "Contact", isSystem: true, order: 5, sections: [ { type: "contactForm", content: { title: "Contact Us", subtitle: "Reach out for admissions, fees or any query." } } ] },
    { slug: "admission", title: "Apply for Admission", isSystem: true, order: 6, sections: [ { type: "quoteForm", content: { title: "Admission Enquiry", subtitle: "Fill the form and our counsellor will call you back.", showSidebar: true } } ] },
  ],
};
