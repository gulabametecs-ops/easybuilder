import type { TemplateDef } from "./types";

// Education consultancy — study abroad + study in India. Inspired by the Hamza
// Consultancy site, rebuilt on the platform's section engine.
export const educationConsultancy: TemplateDef = {
  theme: {
    colors: {
      primary: "#2563eb",
      primaryDark: "#1d4ed8",
      secondary: "#0b1f3a",
      accent: "#06b6d4",
      dark: "#081a33",
      light: "#f0f6ff",
      text: "#334155",
      heading: "#0b1f3a",
    },
    font: "Plus Jakarta Sans",
    radius: "1rem",
  },
  header: (biz) => ({
    logoText: biz,
    logoImage: "",
    announcement: { show: true, text: "✈️ Fall & Spring intakes open for USA, UK, Canada, Australia & Germany — book a free profile evaluation", link: "/consultation" },
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
    design: "modern",
    about: "Your trusted partner for admissions in India and abroad — honest counselling, strong applications and high visa success, from shortlist to send-off.",
    columns: [
      { title: "Quick Links", links: [
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
        { label: "Services", href: "/services" },
        { label: "Counsellors", href: "/team" },
        { label: "Free Consultation", href: "/consultation" },
        { label: "Contact", href: "/contact" },
      ] },
      { title: "Destinations", links: [
        { label: "Study in USA", href: "/services" },
        { label: "Study in UK", href: "/services" },
        { label: "Study in Canada", href: "/services" },
        { label: "Study in Australia", href: "/services" },
        { label: "Study in Germany", href: "/services" },
        { label: "Study in India", href: "/services" },
      ] },
    ],
    serviceAreas: ["USA", "UK", "Canada", "Australia", "Germany", "Ireland", "India"],
    contact: { phones: ["9000000000"], email: "info@example.com", address: "Your City, India" },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. All Rights Reserved.`,
  }),
  seo: (biz) => ({
    title: `${biz} — Study Abroad & In-India Admission Consultants`,
    description: "Expert guidance for university admissions in the USA, UK, Canada, Australia, Germany and India — course selection, SOPs, IELTS/GRE prep, scholarships and student visas. Book a free consultation.",
    favicon: "",
    ogImage: "",
  }),
  services: [
    { category: "Study Abroad", title: "USA Admissions", description: "MS, MBA and UG applications to top US universities, with assistantship and scholarship guidance." },
    { category: "Study Abroad", title: "UK Admissions", description: "One-year master's and UG programs at Russell Group and leading UK universities." },
    { category: "Study Abroad", title: "Canada Admissions", description: "Colleges and universities with a clear study-to-PGWP-to-PR pathway." },
    { category: "Study Abroad", title: "Australia Admissions", description: "Group of Eight and top universities with post-study work rights." },
    { category: "Study Abroad", title: "Germany Admissions", description: "Low or zero-tuition public universities, blocked account and APS support." },
    { category: "Study in India", title: "Engineering (JEE / State)", description: "JoSAA, state counselling and private university B.Tech admissions." },
    { category: "Study in India", title: "Medical (NEET)", description: "MCC and state MBBS/BDS counselling, choice filling and document support." },
    { category: "Study in India", title: "Management (MBA)", description: "CAT/XAT/MAT based B-school shortlisting, essays and interview prep." },
    { category: "Study in India", title: "Law, Design & More", description: "CLAT, NID, NIFT and other specialised admissions." },
    { category: "Test Prep", title: "IELTS Coaching", description: "Band-focused training with weekly full mocks and speaking practice." },
    { category: "Test Prep", title: "TOEFL / PTE", description: "Score-focused English proficiency prep with computer-based mocks." },
    { category: "Test Prep", title: "GRE / GMAT", description: "Quant, verbal and AWA strategy with adaptive practice tests." },
    { category: "Visa & Documentation", title: "Student Visa", description: "F-1, UK Student, Canada SDS and Australia subclass 500 filing and mock interviews." },
    { category: "Visa & Documentation", title: "SOP / LOR Writing", description: "Personal, story-driven SOPs and strong LORs reviewed by senior counsellors." },
    { category: "Visa & Documentation", title: "Scholarships & Education Loans", description: "Find scholarships and get education-loan assistance from partner banks." },
  ],
  gallery: [
    ...["Counselling session", "Visa success celebration", "Student send-off", "University fair", "Our office", "IELTS classroom", "Pre-departure briefing", "Alumni meet"].map((c) => ({ category: "Our Journey", caption: c })),
  ],
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "split", customHtml: "",
          badge: "STUDY ABROAD · STUDY IN INDIA",
          titleTop: "Your Dream University,",
          titleHighlight: "Made Possible",
          subtitle: "",
          description: `${biz} helps you choose the right course, country and university — then handles applications, scholarships and your student visa, so you can focus on your future.`,
          image: "",
          primaryBtn: { label: "Book Free Consultation", href: "/consultation" },
          secondaryBtn: { label: "Explore Services", href: "/services" },
          features: [
            { icon: "graduation", title: "Certified Counsellors", text: "" },
            { icon: "shield", title: "98% Visa Success", text: "" },
            { icon: "award", title: "200+ Partner Universities", text: "" },
            { icon: "check", title: "End-to-End Support", text: "" },
          ],
        } },
        { type: "logos", content: { title: "Our students study at 200+ leading universities worldwide", items: ["Canada", "Australia", "United Kingdom", "Germany", "USA", "Ireland", "New Zealand", "Singapore"] } },
        { type: "features", style: { background: "light" }, content: { items: [
          { icon: "user-check", title: "Honest, Profile-Based Advice", text: "We recommend universities that match your profile and budget — not the ones that pay the highest commission." },
          { icon: "edit", title: "Applications That Stand Out", text: "Story-driven SOPs, strong LORs and polished résumés reviewed by senior counsellors." },
          { icon: "shield", title: "98% Visa Success", text: "Meticulous documentation, financial planning and mock visa interviews." },
          { icon: "tag", title: "Scholarships & Loans", text: "Our students have secured ₹25+ crore in scholarships, plus education-loan help from partner banks." },
        ] } },
        { type: "about", content: {
          eyebrow: "WHO WE ARE", title: "Trusted Guidance for", titleHighlight: "Life-Changing Decisions",
          body: [
            `Since 2014, ${biz} has helped thousands of Indian students get into top universities in India and abroad — with honest advice, careful planning and personal attention at every step.`,
            "One dedicated counsellor stays with you from your first consultation to your pre-departure briefing, so you're never left guessing.",
          ],
          image: "",
          points: ["Free profile evaluation", "University & course shortlisting", "SOP, LOR & résumé support", "IELTS / GRE coaching in-house", "Scholarship & loan assistance", "Visa filing & mock interviews"],
          buttonLabel: "About Us", buttonHref: "/about",
        } },
        { type: "serviceCategories", content: { eyebrow: "OUR SERVICES", title: "Everything You Need,", titleHighlight: "Under One Roof", categories: ["Study Abroad", "Study in India", "Test Prep", "Visa & Documentation"] } },
        { type: "stats", content: { items: [
          { value: "5,000+", label: "Students Placed", icon: "users" },
          { value: "98%", label: "Visa Success Rate", icon: "shield" },
          { value: "15+", label: "Countries", icon: "plane" },
          { value: "₹25 Cr+", label: "Scholarships Won", icon: "award" },
        ] } },
        { type: "steps", style: { background: "light" }, content: { eyebrow: "PROCESS", title: "Your Journey in", titleHighlight: "5 Simple Steps", items: [
          { title: "Free Counselling", text: "Profile evaluation, goals and budget", icon: "headset" },
          { title: "Shortlist", text: "Universities and courses that fit you", icon: "clipboard" },
          { title: "Apply", text: "Applications, SOP, LOR and scholarships", icon: "edit" },
          { title: "Visa", text: "Documentation, funds and mock interviews", icon: "shield" },
          { title: "Fly!", text: "Pre-departure briefing and send-off", icon: "plane" },
        ] } },
        { type: "team", content: { eyebrow: "OUR EXPERTS", title: "Meet Your", titleHighlight: "Counsellors", members: [
          { name: "Ms. Ayesha Siddiqui", role: "Senior Counsellor · USA & UK", image: "", note: "12 yrs · 1,500+ admits" },
          { name: "Mr. Rohit Malhotra", role: "Canada & Australia Specialist", image: "", note: "ICEF Certified" },
          { name: "Ms. Deepika Rao", role: "Visa & Documentation Head", image: "", note: "98% visa approvals" },
          { name: "Mr. Varun Joshi", role: "Test Prep Head", image: "", note: "IELTS 8.5 · GRE 330" },
        ] } },
        { type: "testimonials", content: { eyebrow: "SUCCESS STORIES", title: "Students Who", titleHighlight: "Made It", items: [
          { name: "Harsh Vardhan", role: "MS Computer Science · USA", text: "My counsellor shortlisted universities I'd never have considered and helped me rewrite my SOP three times. Got 4 admits and my F-1 visa on the first attempt.", rating: 5 },
          { name: "Simran Kaur", role: "MSc Data Science · Canada", text: "From IELTS coaching to my study permit, everything was handled in one place. They were honest about costs and timelines — no surprises.", rating: 5 },
          { name: "Mr. Ramesh Iyer", role: "Parent · Daughter studying in London", text: "As parents we were anxious about the whole process. The team explained every step, helped with the education loan and even briefed us before she flew.", rating: 5 },
          { name: "Aman Gupta", role: "MS Mechanical · Germany", text: "Studying in Germany almost tuition-free felt impossible until I met them. APS, blocked account, visa — they guided me through all of it.", rating: 5 },
        ] } },
        { type: "faq", style: { background: "light" }, content: { eyebrow: "FAQ", title: "Questions Students", titleHighlight: "Often Ask", items: [
          { q: "Is the first consultation really free?", a: "Yes. Your first session, including a full profile evaluation and country/course recommendations, is completely free with no obligation." },
          { q: "When should I start preparing to study abroad?", a: "Ideally 10–12 months before your intake. That leaves time for tests, applications, scholarships and the visa process." },
          { q: "Which country is best for me?", a: "It depends on your course, budget, academic profile and long-term goals. We compare options like the USA, UK, Canada, Australia and Germany side by side for you." },
          { q: "Do I need IELTS or GRE?", a: "Most universities need an English test (IELTS, TOEFL or PTE). GRE/GMAT depends on the course and university. We offer in-house coaching for all of them." },
          { q: "Can you help with scholarships and education loans?", a: "Yes. We identify scholarships you qualify for, help with applications and connect you with partner banks for education loans." },
          { q: "What is your visa success rate?", a: "Our students have a 98% visa success rate, thanks to careful documentation, financial planning and mock visa interviews." },
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
          { value: "5,000+", label: "Students Placed", icon: "users" },
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
          { name: "Ms. Ayesha Siddiqui", role: "Senior Education Counsellor", image: "", note: "USA & UK" },
          { name: "Ms. Deepika Rao", role: "Visa Specialist", image: "", note: "Documentation" },
          { name: "Mr. Varun Joshi", role: "Test Prep Head", image: "", note: "IELTS / GRE" },
          { name: "Mr. Sameer Kulkarni", role: "India Admissions", image: "", note: "Engineering & Medical" },
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
