import type { TemplateDef } from "./types";

// Education consultancy — study abroad + study in India. Inspired by the Hamza
// Consultancy site, rebuilt on the platform's section engine.
export const educationConsultancy: TemplateDef = {
  theme: {
    colors: {
      primary: "#2563eb",
      primaryDark: "#1d4ed8",
      secondary: "#0b1f3a",
      accent: "#38bdf8",
      dark: "#0b1f3a",
      light: "#eff5ff",
      text: "#334155",
      heading: "#0b1f3a",
    },
    font: "Poppins",
    radius: "0.9rem",
  },
  header: (biz) => ({
    logoText: biz,
    logoImage: "",
    topbar: {
      show: true,
      address: "Study Abroad & In-India Admissions",
      phones: ["9000000000"],
      email: "info@example.com",
      social: { facebook: "#", instagram: "#", whatsapp: "#" },
    },
    nav: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Counsellors", href: "/team" },
      { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Free Consultation", href: "/consultation" },
  }),
  footer: (biz) => ({
    about: "Your trusted partner for admissions in India and abroad.",
    columns: [
      { title: "Quick Links", links: [
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
        { label: "Services", href: "/services" },
        { label: "Counsellors", href: "/team" },
        { label: "Contact", href: "/contact" },
      ] },
      { title: "Destinations", links: [
        { label: "Study in USA", href: "/services" },
        { label: "Study in UK", href: "/services" },
        { label: "Study in Canada", href: "/services" },
        { label: "Study in Australia", href: "/services" },
        { label: "Study in India", href: "/services" },
      ] },
    ],
    serviceAreas: ["USA", "UK", "Canada", "Australia", "Germany", "India"],
    contact: { phones: ["9000000000"], email: "info@example.com", address: "Your City, Country" },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. All Rights Reserved.`,
  }),
  seo: (biz) => ({
    title: `${biz} — Study Abroad & In-India Admission Consultants`,
    description: "Expert guidance for university admissions in India and abroad — courses, visas, test prep and scholarships.",
    favicon: "",
    ogImage: "",
  }),
  services: [
    { category: "Study Abroad", title: "USA Admissions", description: "Universities & courses across the USA." },
    { category: "Study Abroad", title: "UK Admissions", description: "Top UK universities guidance." },
    { category: "Study Abroad", title: "Canada Admissions", description: "Study & PR pathway support." },
    { category: "Study Abroad", title: "Australia Admissions", description: "Courses across Australian universities." },
    { category: "Study Abroad", title: "Germany Admissions", description: "Low-cost quality education in Germany." },
    { category: "Study in India", title: "Engineering (JEE/State)", description: "B.Tech admission guidance." },
    { category: "Study in India", title: "Medical (NEET)", description: "MBBS/BDS counselling support." },
    { category: "Study in India", title: "Management (MBA)", description: "Top B-school admissions." },
    { category: "Study in India", title: "Law & Others", description: "Law, design and more." },
    { category: "Test Prep", title: "IELTS Coaching", description: "Score-focused IELTS training." },
    { category: "Test Prep", title: "TOEFL / PTE", description: "English proficiency prep." },
    { category: "Test Prep", title: "GRE / GMAT", description: "Graduate exam preparation." },
    { category: "Visa & Documentation", title: "Student Visa", description: "End-to-end visa filing." },
    { category: "Visa & Documentation", title: "SOP / LOR Writing", description: "Compelling application docs." },
    { category: "Visa & Documentation", title: "Scholarship Guidance", description: "Find & apply for scholarships." },
  ],
  gallery: [
    ...["Counselling session", "Visa success", "Student send-off", "University fair", "Office", "Seminar"].map((c) => ({ category: "Our Journey", caption: c })),
  ],
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "classic", customHtml: "",
          badge: "STUDY ABROAD · STUDY IN INDIA",
          titleTop: "Your Gateway to",
          titleHighlight: "Global Education",
          subtitle: "",
          description: `${biz} guides students to the right university, course and country — with visa and scholarship support at every step.`,
          image: "",
          primaryBtn: { label: "Free Consultation", href: "/consultation" },
          secondaryBtn: { label: "Our Services", href: "/services" },
          features: [
            { icon: "graduation", title: "Expert Counsellors", text: "" },
            { icon: "shield", title: "High Visa Success", text: "" },
            { icon: "award", title: "Top Universities", text: "" },
            { icon: "check", title: "End-to-End Support", text: "" },
          ],
        } },
        { type: "about", content: {
          eyebrow: "WHO WE ARE", title: "Trusted", titleHighlight: "Education Consultants",
          body: [
            `${biz} helps students achieve their dream of studying at top institutions in India and abroad.`,
            "From choosing the right course to visa approval, our experienced counsellors are with you at every step.",
          ],
          image: "",
          points: ["Personalised counselling", "University & course selection", "Visa & documentation", "Scholarship guidance", "Test preparation"],
          buttonLabel: "About Us", buttonHref: "/about",
        } },
        { type: "serviceCategories", content: { eyebrow: "OUR SERVICES", title: "How We", titleHighlight: "Help You", categories: ["Study Abroad", "Study in India", "Test Prep", "Visa & Documentation"] } },
        { type: "logos", content: { title: "Our students study at 200+ top universities", items: ["Oxford", "Harvard", "Toronto", "Melbourne", "TU Munich", "NUS", "IIT", "IIM"] } },
        { type: "stats", content: { items: [
          { value: "2000+", label: "Students Placed", icon: "users" },
          { value: "200+", label: "Partner Universities", icon: "award" },
          { value: "15+", label: "Countries", icon: "map" },
          { value: "10+", label: "Years Experience", icon: "star" },
        ] } },
        { type: "steps", content: { eyebrow: "PROCESS", title: "Your Journey in", titleHighlight: "5 Steps", items: [
          { title: "Free Counselling", text: "Understand your goals & options", icon: "headset" },
          { title: "Shortlist", text: "Universities & courses that fit", icon: "clipboard" },
          { title: "Apply", text: "Applications, SOP & LOR", icon: "edit" },
          { title: "Visa", text: "Documentation & visa filing", icon: "shield" },
          { title: "Fly!", text: "Pre-departure & send-off", icon: "graduation" },
        ] } },
        { type: "cta", content: { title: "Confused about your future?", highlight: "Book a Free Consultation", phones: ["9000000000"], buttonLabel: "Get Started", buttonHref: "/consultation" } },
      ],
    },
    {
      slug: "about", title: "About", isSystem: true, order: 1,
      sections: [
        { type: "about", content: {
          eyebrow: "ABOUT US", title: "Guiding Students", titleHighlight: "Since 2014",
          body: [`${biz} is a full-service education consultancy helping students study in India and abroad.`, "Our mission is to make quality education accessible with honest, expert guidance."],
          image: "", points: ["Certified counsellors", "Transparent process", "Student-first approach"], buttonLabel: "", buttonHref: "",
        } },
        { type: "stats", content: { items: [
          { value: "2000+", label: "Students Placed", icon: "users" },
          { value: "200+", label: "Universities", icon: "award" },
          { value: "15+", label: "Countries", icon: "map" },
          { value: "10+", label: "Years", icon: "star" },
        ] } },
        { type: "cta", content: { title: "Ready to begin?", highlight: "Talk to a Counsellor", phones: ["9000000000"], buttonLabel: "Free Consultation", buttonHref: "/consultation" } },
      ],
    },
    {
      slug: "services", title: "Services", isSystem: true, order: 2,
      sections: [
        { type: "serviceCategories", content: { eyebrow: "", title: "Our", titleHighlight: "Services", categories: ["Study Abroad", "Study in India", "Test Prep", "Visa & Documentation"] } },
        { type: "cta", content: { title: "Need guidance?", highlight: "We're Here to Help", phones: ["9000000000"], buttonLabel: "Free Consultation", buttonHref: "/consultation" } },
      ],
    },
    {
      slug: "team", title: "Counsellors", isSystem: true, order: 3,
      sections: [
        { type: "team", content: { eyebrow: "OUR TEAM", title: "Meet Our", titleHighlight: "Counsellors", members: [
          { name: "Counsellor Name", role: "Senior Education Counsellor", image: "", note: "USA & UK" },
          { name: "Counsellor Name", role: "Visa Specialist", image: "", note: "Documentation" },
          { name: "Counsellor Name", role: "Test Prep Head", image: "", note: "IELTS / GRE" },
          { name: "Counsellor Name", role: "India Admissions", image: "", note: "Engineering & Medical" },
        ] } },
        { type: "cta", content: { title: "Have questions?", highlight: "Talk to Our Experts", phones: ["9000000000"], buttonLabel: "Free Consultation", buttonHref: "/consultation" } },
      ],
    },
    {
      slug: "contact", title: "Contact", isSystem: true, order: 4,
      sections: [{ type: "contactForm", content: { title: "Contact Us", subtitle: "Reach out and our counsellors will get back to you." } }],
    },
    {
      slug: "consultation", title: "Free Consultation", isSystem: true, order: 5,
      sections: [
        { type: "quoteForm", content: { title: "Book a Free Consultation", subtitle: "Tell us your goals and we'll craft your path to admission.", showSidebar: true } },
      ],
    },
  ],
};
