import type { TemplateDef } from "./types";

// Language & IELTS Institute (spoken English, IELTS/PTE/TOEFL, French/German/Japanese):
// bright sky blue + coral, airy and global — conversion via the free demo class.
export const languageInstitute: TemplateDef = {
  theme: {
    colors: { primary: "#0ea5e9", primaryDark: "#0369a1", secondary: "#1e3a5f", accent: "#fb7185", dark: "#082f49", light: "#f0f9ff", text: "#334155", heading: "#0c2a43" },
    font: "Lexend", radius: "1rem",
  },
  header: (biz) => ({
    design: "minimal",
    logoText: biz, logoImage: "",
    announcement: { show: true, text: "New IELTS weekend batch starts this month · Attend a FREE demo class + mock test", link: "/demo-class" },
    topbar: { show: true, address: "Spoken English · IELTS · PTE · TOEFL · French · German · Japanese", phones: ["9000000000"], email: "hello@example.com", social: { facebook: "#", instagram: "#", whatsapp: "#" } },
    nav: [
      { label: "Home", href: "/" }, { label: "About", href: "/about" }, { label: "Courses", href: "/courses" }, { label: "IELTS & PTE", href: "/test-prep" },
      { label: "Faculty", href: "/faculty" }, { label: "Fees", href: "/fees" }, { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Free Demo Class", href: "/demo-class" },
  }),
  footer: (biz) => ({
    design: "modern",
    about: `${biz} helps students and professionals speak confidently, score high on IELTS, PTE and TOEFL, and learn French, German and Japanese for study, work and migration abroad.`,
    columns: [
      { title: "Institute", links: [ { label: "About Us", href: "/about" }, { label: "Our Faculty", href: "/faculty" }, { label: "Fees & Batches", href: "/fees" }, { label: "Contact", href: "/contact" } ] },
      { title: "Programs", links: [ { label: "Spoken English", href: "/courses" }, { label: "IELTS / PTE / TOEFL", href: "/test-prep" }, { label: "Foreign Languages", href: "/courses" }, { label: "Book Free Demo", href: "/demo-class" } ] },
    ],
    serviceAreas: ["IELTS Academic", "IELTS General", "PTE Academic", "TOEFL iBT", "Spoken English", "French (DELF)", "German (Goethe)", "Japanese (JLPT)"],
    contact: { phones: ["9000000000"], email: "hello@example.com", address: "Your City" },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. Speak to the world.`,
  }),
  seo: (biz) => ({
    title: `${biz} — IELTS, PTE, Spoken English & Foreign Language Classes`,
    description: "IELTS, PTE and TOEFL coaching with weekly mock tests, spoken English for students and professionals, and French, German & Japanese classes. Small batches, online & offline. Book a free demo class.",
    favicon: "", ogImage: "",
    keywords: "ielts coaching near me, pte classes, spoken english classes, toefl coaching, german classes, french classes, japanese language course",
    businessType: "EducationalOrganization", priceRange: "₹₹",
  }),
  services: [
    { category: "Spoken English", title: "Spoken English — Foundation", description: "Everyday conversation, grammar in use and pronunciation for absolute beginners." },
    { category: "Spoken English", title: "Fluency & Public Speaking", description: "Group discussions, presentations and debates to speak without hesitation." },
    { category: "Spoken English", title: "Business English & Interview Prep", description: "Emails, meetings, client calls and mock HR interviews for working professionals." },
    { category: "Test Preparation", title: "IELTS Academic & General", description: "All four modules with band-wise strategy, weekly full-length mock tests and feedback." },
    { category: "Test Preparation", title: "PTE Academic", description: "Computer-based practice on real-format templates with AI-scored mock tests." },
    { category: "Test Preparation", title: "TOEFL iBT", description: "Integrated reading, listening, speaking and writing tasks for US university admissions." },
    { category: "Test Preparation", title: "Duolingo English Test", description: "Short, focused prep for the online DET with adaptive practice sets." },
    { category: "Foreign Languages", title: "French — A1 to B2 (DELF)", description: "Structured CEFR levels with DELF exam preparation for Canada and Europe." },
    { category: "Foreign Languages", title: "German — A1 to B1 (Goethe)", description: "Goethe-Zertifikat prep for study, nursing and work-visa pathways to Germany." },
    { category: "Foreign Languages", title: "Japanese — N5 to N3 (JLPT)", description: "Hiragana, katakana, kanji and conversation for JLPT and jobs in Japan." },
  ],
  gallery: [
    "Spoken English batch", "IELTS mock test hall", "Speaking practice one-on-one", "Computer-based PTE lab", "German A1 classroom", "Group discussion session", "Band 8 achievers' wall", "Certificate day",
  ].map((caption) => ({ category: "Our Institute", caption })),
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "slideshow", customHtml: "",
          badge: "IELTS · PTE · TOEFL · SPOKEN ENGLISH · FRENCH · GERMAN · JAPANESE", titleTop: "Speak With Confidence.", titleHighlight: "Score Your Dream Band.",
          subtitle: "", description: `${biz} trains you for the world — from your first English conversation to Band 8 in IELTS and B1 in German. Small batches, certified trainers, weekly mock tests and flexible online & offline timings.`, image: "",
          primaryBtn: { label: "Book Free Demo Class", href: "/demo-class" }, secondaryBtn: { label: "Explore Courses", href: "/courses" },
          features: [ { icon: "award", title: "Band 7+ Results", text: "" }, { icon: "users", title: "Max 12 per Batch", text: "" }, { icon: "clipboard", title: "Weekly Mock Tests", text: "" }, { icon: "plane", title: "Study-Abroad Ready", text: "" } ],
          slides: [
            { titleTop: "Score Your", titleHighlight: "Dream Band", description: "IELTS and PTE coaching with a full-length mock every week and line-by-line writing feedback.", image: "", primaryBtn: { label: "Book Free Demo", href: "/demo-class" }, secondaryBtn: { label: "IELTS & PTE", href: "/test-prep" } },
            { titleTop: "Speak English", titleHighlight: "Without Fear", description: "Fluency, interviews and business English for students, homemakers and working professionals.", image: "", primaryBtn: { label: "Explore Courses", href: "/courses" }, secondaryBtn: { label: "See Fees", href: "/fees" } },
            { titleTop: "German, French,", titleHighlight: "Japanese", description: "CEFR and JLPT levels for study, nursing and work-visa pathways — A1 batches start every month.", image: "", primaryBtn: { label: "Free Level Test", href: "/demo-class" }, secondaryBtn: { label: "Meet the Faculty", href: "/faculty" } },
          ],
        } },
        { type: "stats", style: { layout: "minimal" }, content: { items: [ { value: "8,500+", label: "Students Trained", icon: "users" }, { value: "7.5", label: "Average IELTS Band", icon: "award" }, { value: "1,200+", label: "Visas & Admissions", icon: "plane" }, { value: "12 yrs", label: "Teaching Languages", icon: "trending" } ] } },
        { type: "features", style: { layout: "split", background: "light" }, content: { eyebrow: "WHY LEARN WITH US", title: "Small Batches,", titleHighlight: "Big Bands", items: [
          { icon: "check", title: "Certified Trainers", text: "CELTA-certified English faculty, plus native-level language coaches." },
          { icon: "clipboard", title: "Real-Format Mock Tests", text: "Full-length IELTS and PTE mocks every week, evaluated against official band descriptors." },
          { icon: "headset", title: "1-on-1 Speaking Rounds", text: "Personal speaking slots with a trainer to fix fluency, pronunciation and coherence." },
          { icon: "calendar", title: "Flexible Batches", text: "Morning, evening and weekend batches — online, offline or hybrid." },
          { icon: "shield", title: "Free Re-Attendance", text: "Missed your target band? Re-join the next batch at no extra cost within 6 months." },
        ] } },
        { type: "serviceCategories", style: { layout: "list" }, content: { eyebrow: "WHAT WE TEACH", title: "Three Paths to", titleHighlight: "Fluency", categories: ["Spoken English", "Test Preparation", "Foreign Languages"] } },
        { type: "steps", style: { layout: "timeline", background: "dark" }, content: { eyebrow: "HOW IT WORKS", title: "From Enquiry to", titleHighlight: "Exam Day", items: [
          { title: "Free Level Test", text: "A 30-minute assessment of your current English or language level", icon: "edit" },
          { title: "Personal Study Plan", text: "Target band, timeline and the right batch for you", icon: "clipboard" },
          { title: "Learn & Practise", text: "Live classes, speaking rounds and weekly mocks", icon: "book" },
          { title: "Book & Ace the Exam", text: "We help with test booking and final-week revision", icon: "award" },
        ] } },
        { type: "toppers", content: { eyebrow: "OUR ACHIEVERS", title: "Recent", titleHighlight: "High Scorers", items: [
          { name: "Harpreet Kaur", exam: "IELTS Academic", score: "Band 8.5", rank: "1", image: "" },
          { name: "Rohan Mehta", exam: "PTE Academic", score: "86 / 90", rank: "2", image: "" },
          { name: "Sneha Iyer", exam: "TOEFL iBT", score: "112 / 120", rank: "3", image: "" },
          { name: "Arjun Malhotra", exam: "Goethe B1", score: "Sehr gut", rank: "4", image: "" },
        ] } },
        { type: "testimonials", style: { layout: "featured", background: "light" }, content: { eyebrow: "STUDENT STORIES", title: "Voices From", titleHighlight: "Around the World", items: [
          { name: "Harpreet Kaur", role: "Band 8.5 · Now studying in Toronto", text: "My writing was stuck at 6.5. The trainers marked every essay line by line and within six weeks I scored 8 in writing. The mock tests felt exactly like the real exam.", rating: 5 },
          { name: "Vikram Chauhan", role: "Software Engineer · Business English", text: "I used to freeze in client calls. The fluency batch and mock meetings changed that completely — I now lead our weekly sync with the US team.", rating: 5 },
          { name: "Ananya Reddy", role: "German B1 · Nursing in Germany", text: "Cleared Goethe B1 on the first attempt. The teacher made grammar fun and the speaking practice was the best part.", rating: 5 },
          { name: "Mohammed Irfan", role: "PTE 79+ · Skilled visa, Australia", text: "The AI-scored PTE mocks showed me exactly where I lost marks in Read Aloud. Got 79+ in every module on my second attempt.", rating: 5 },
        ] } },
        { type: "logos", content: { title: "We prepare you for", items: ["IELTS", "PTE Academic", "TOEFL iBT", "Duolingo English Test", "DELF", "Goethe-Zertifikat", "JLPT"] } },
        { type: "pricingPlans", style: { background: "light" }, content: { eyebrow: "POPULAR PROGRAMS", title: "Fees That", titleHighlight: "Make Sense", plans: [
          { name: "Spoken English", price: "₹6,500", period: "8 weeks", features: ["3 classes a week", "Group discussions & role-plays", "Grammar workbook", "Certificate on completion"], featured: false, buttonLabel: "Book Free Demo", buttonHref: "/demo-class" },
          { name: "IELTS / PTE Complete", price: "₹14,000", period: "6–8 weeks", features: ["All four modules", "8 full-length mock tests", "1-on-1 speaking rounds", "Exam booking help", "Free re-attendance"], featured: true, buttonLabel: "Book Free Demo", buttonHref: "/demo-class" },
          { name: "German / French A1", price: "₹15,500", period: "8–10 weeks", features: ["CEFR A1 syllabus", "Native-level coach", "Exam-pattern practice", "Online or offline"], featured: false, buttonLabel: "Book Free Demo", buttonHref: "/demo-class" },
        ] } },
        { type: "countdown", content: { eyebrow: "NEXT BATCH", title: "IELTS Weekend Batch", titleHighlight: "Starts Soon", subtitle: "Only 12 seats per batch. Register now and get the study kit + 2 extra mock tests free.", targetDate: "2027-01-09T09:00", buttonLabel: "Reserve My Seat", buttonHref: "/demo-class" } },
        { type: "faq", style: { layout: "split" }, content: { eyebrow: "FAQ", title: "Questions Students", titleHighlight: "Ask Us", intro: "Can't find your answer? Walk in for a free 30-minute level test — no booking needed on weekdays.", items: [
          { q: "How long does IELTS preparation take?", a: "Most students need 6–8 weeks to move up by one band. We recommend a free level test first so we can give you a realistic timeline." },
          { q: "Do you offer online classes?", a: "Yes. Every course runs online and offline, and you can switch between the two whenever your schedule changes." },
          { q: "Which is easier — IELTS or PTE?", a: "It depends on you. PTE is fully computer-based with quicker results; IELTS has a face-to-face speaking test. Our counsellor will help you choose." },
          { q: "Do you help with booking the exam?", a: "Yes, we guide you through test registration, date selection and documents for IELTS, PTE and TOEFL." },
          { q: "Can working professionals join?", a: "Of course. We run early-morning, late-evening and weekend batches built around office hours." },
          { q: "Is German A1 enough for a nursing job in Germany?", a: "A1 is the visa entry level for some routes, but most employers ask for B1 or B2. We plan your A1 → B2 path with exam dates." },
        ] } },
        { type: "cta", style: { layout: "minimal" }, content: { title: "Your global future starts with one class.", highlight: "Book a Free Demo Today", phones: ["9000000000"], buttonLabel: "Book Free Demo", buttonHref: "/demo-class" } },
      ],
    },
    { slug: "about", title: "About", isSystem: true, order: 1, sections: [
      { type: "banner", content: { title: "About", titleHighlight: biz, subtitle: "Teaching languages that open doors — since 2014.", image: "", bgColor: "", imageOpacity: 35, overlayOpacity: 75 } },
      { type: "about", content: { eyebrow: "OUR STORY", title: "Language Is a", titleHighlight: "Passport", body: [`${biz} began as a small spoken English class with eight students. Today we train thousands every year for study, work and migration abroad — without losing the personal attention that made us who we are.`, "Our trainers don't just teach rules. They build the confidence to speak up in a classroom in Melbourne, a hospital in Berlin or a boardroom in Bengaluru."], image: "", points: ["CELTA-certified faculty", "Batches capped at 12 students", "Air-conditioned classrooms & PTE computer lab", "Free re-attendance if you miss your target band"], buttonLabel: "Meet Our Faculty", buttonHref: "/faculty" } },
      { type: "features", content: { items: [
        { icon: "heart", title: "Patient Teaching", text: "No question is too basic. We meet every learner where they are." },
        { icon: "trending", title: "Measured Progress", text: "Band-wise tracking after every mock so you always know where you stand." },
        { icon: "shield", title: "Honest Counselling", text: "We tell you the real timeline — no false band guarantees." },
      ] }, style: { background: "light", cardRadius: "lg" } },
      { type: "gallery", style: { layout: "strip" }, content: { eyebrow: "CAMPUS", title: "Inside", titleHighlight: "Our Institute" } },
      { type: "cta", content: { title: "See how we teach", highlight: "Join a Free Demo Class", phones: ["9000000000"], buttonLabel: "Book Demo", buttonHref: "/demo-class" } },
    ] },
    { slug: "courses", title: "Courses", isSystem: true, order: 2, sections: [
      { type: "banner", content: { title: "Our", titleHighlight: "Courses", subtitle: "Spoken English, test preparation and foreign languages — beginner to advanced.", image: "", bgColor: "", imageOpacity: 35, overlayOpacity: 75 } },
      { type: "serviceCategories", content: { eyebrow: "PROGRAMS", title: "Choose Your", titleHighlight: "Course", categories: ["Spoken English", "Test Preparation", "Foreign Languages"] } },
      { type: "steps", content: { eyebrow: "CEFR LEVELS", title: "Foreign Languages,", titleHighlight: "Level by Level", items: [
        { title: "A1 · Beginner", text: "Alphabet, greetings, everyday phrases — about 8 weeks", icon: "book" },
        { title: "A2 · Elementary", text: "Simple conversations, travel and shopping — about 8 weeks", icon: "book" },
        { title: "B1 · Intermediate", text: "Work, study and visa-level communication — about 12 weeks", icon: "graduation" },
        { title: "B2 · Upper-Intermediate", text: "University and professional fluency — about 14 weeks", icon: "award" },
      ] }, style: { background: "light" } },
      { type: "cta", content: { title: "Not sure which level you're at?", highlight: "Take a Free Level Test", phones: ["9000000000"], buttonLabel: "Book Level Test", buttonHref: "/demo-class" } },
    ] },
    { slug: "test-prep", title: "IELTS & PTE", isSystem: true, order: 3, sections: [
      { type: "banner", content: { title: "IELTS, PTE &", titleHighlight: "TOEFL Coaching", subtitle: "Strategy, practice and real-format mock tests for your target score.", image: "", bgColor: "", imageOpacity: 35, overlayOpacity: 75 } },
      { type: "features", content: { items: [
        { icon: "headset", title: "Listening", text: "Accent training (British, Australian, American) and note-completion strategies." },
        { icon: "book", title: "Reading", text: "Skimming, scanning and True/False/Not Given techniques under time pressure." },
        { icon: "edit", title: "Writing", text: "Task 1 & 2 templates, cohesion and vocabulary — every essay marked by a trainer." },
        { icon: "users", title: "Speaking", text: "Cue-card practice and recorded mock interviews with band-wise feedback." },
      ] }, style: { cardRadius: "md", cardShadow: "md" } },
      { type: "toppers", content: { eyebrow: "RESULTS", title: "Bands That", titleHighlight: "Speak for Us", items: [
        { name: "Harpreet Kaur", exam: "IELTS Academic", score: "8.5", rank: "1", image: "" },
        { name: "Mohammed Faizan", exam: "IELTS General", score: "8.0", rank: "2", image: "" },
        { name: "Rohan Mehta", exam: "PTE Academic", score: "86", rank: "3", image: "" },
        { name: "Pooja Nair", exam: "PTE Academic", score: "84", rank: "4", image: "" },
        { name: "Sneha Iyer", exam: "TOEFL iBT", score: "112", rank: "5", image: "" },
      ] }, style: { background: "light" } },
      { type: "downloads", content: { eyebrow: "FREE RESOURCES", title: "Study", titleHighlight: "Material", items: [
        { title: "IELTS Band Descriptor Guide", description: "Understand exactly what examiners look for in writing and speaking.", link: "", icon: "book" },
        { title: "100 Cue Cards 2026", description: "Latest speaking topics with model answers.", link: "", icon: "clipboard" },
        { title: "PTE Templates Pack", description: "Describe Image, Retell Lecture and Essay templates.", link: "", icon: "edit" },
      ] } },
      { type: "cta", content: { title: "Attempt a full mock test", highlight: "Absolutely Free", phones: ["9000000000"], buttonLabel: "Book Free Mock", buttonHref: "/demo-class" } },
    ] },
    { slug: "faculty", title: "Faculty", isSystem: true, order: 4, sections: [
      { type: "team", content: { eyebrow: "OUR TRAINERS", title: "Meet the", titleHighlight: "Faculty", members: [
        { name: "Ms. Kavita Sharma", role: "Head Trainer · IELTS", image: "", note: "CELTA · 14 yrs · IELTS 9 in Speaking" },
        { name: "Mr. Daniel Fernandes", role: "PTE & TOEFL Trainer", image: "", note: "M.A. English · 9 yrs" },
        { name: "Ms. Ritu Agarwal", role: "Spoken English & Soft Skills", image: "", note: "Corporate trainer · 11 yrs" },
        { name: "Ms. Shreya Kulkarni", role: "French Faculty", image: "", note: "DALF C1 · Alliance-trained" },
        { name: "Mr. Aditya Rao", role: "German Faculty", image: "", note: "Goethe C1 · Lived in Munich 4 yrs" },
        { name: "Ms. Megha Tiwari", role: "Japanese Faculty", image: "", note: "JLPT N2 · 6 yrs" },
      ] }, style: { cardRadius: "lg", cardShadow: "md" } },
      { type: "stats", content: { items: [ { value: "15+", label: "Trainers", icon: "users" }, { value: "6", label: "Languages & Exams", icon: "book" }, { value: "10 yrs", label: "Avg. Experience", icon: "award" }, { value: "4.9★", label: "Student Rating", icon: "star" } ] }, style: { layout: "band", background: "primary" } },
      { type: "cta", content: { title: "Learn from the best", highlight: "Book a Demo With Our Faculty", phones: ["9000000000"], buttonLabel: "Book Demo", buttonHref: "/demo-class" } },
    ] },
    { slug: "fees", title: "Fees & Batches", isSystem: true, order: 5, sections: [
      { type: "priceList", content: { eyebrow: "TRANSPARENT FEES", title: "Course", titleHighlight: "Fees", note: "Fees include study material and mock tests. 5% off for students paying in full; EMI available.", groups: [
        { category: "Spoken English", items: [ { name: "Foundation (2 months)", price: "₹6,500", note: "Mon–Fri, 1 hr/day" }, { name: "Fluency & Public Speaking (2 months)", price: "₹8,000", note: "" }, { name: "Business English (6 weeks)", price: "₹9,500", note: "Weekend batch" } ] },
        { category: "Test Preparation", items: [ { name: "IELTS (6 weeks)", price: "₹12,000", note: "20 mock tests" }, { name: "PTE Academic (4 weeks)", price: "₹11,000", note: "AI-scored mocks" }, { name: "TOEFL iBT (6 weeks)", price: "₹13,500", note: "" }, { name: "Speaking-only crash course", price: "₹4,500", note: "10 one-on-one rounds" } ] },
        { category: "Foreign Languages (per level)", items: [ { name: "French A1 / A2", price: "₹14,000", note: "" }, { name: "German A1 / A2", price: "₹15,000", note: "" }, { name: "Japanese N5", price: "₹13,000", note: "" } ] },
      ] } },
      { type: "openingHours", content: { eyebrow: "BATCH TIMINGS", title: "Pick a", titleHighlight: "Slot", note: "Online batches run at the same times. One-on-one slots on request.", days: [
        { day: "Morning (Mon–Fri)", hours: "7:00 AM – 10:00 AM" },
        { day: "Afternoon (Mon–Fri)", hours: "12:00 PM – 4:00 PM" },
        { day: "Evening (Mon–Fri)", hours: "6:00 PM – 9:30 PM" },
        { day: "Weekend", hours: "Sat & Sun · 9:00 AM – 6:00 PM" },
      ] }, style: { background: "light" } },
      { type: "cta", content: { title: "Questions about fees or EMI?", highlight: "Talk to a Counsellor", phones: ["9000000000"], buttonLabel: "Book Free Demo", buttonHref: "/demo-class" } },
    ] },
    { slug: "demo-class", title: "Free Demo Class", isSystem: true, order: 6, sections: [
      { type: "appointmentForm", content: { title: "Book Your Free Demo Class", subtitle: "Choose a course and a time — we'll confirm your slot and a free level test on WhatsApp." } },
      { type: "steps", content: { eyebrow: "WHAT HAPPENS NEXT", title: "Your Demo in", titleHighlight: "3 Steps", items: [
        { title: "We Call You", text: "A counsellor confirms your slot within a few hours", icon: "phone" },
        { title: "Attend the Class", text: "Sit in a live batch — online or at our centre", icon: "users" },
        { title: "Get Your Level Report", text: "Current level, target band and a study plan", icon: "clipboard" },
      ] }, style: { background: "light" } },
      { type: "faq", content: { eyebrow: "", title: "Before You", titleHighlight: "Book", items: [
        { q: "Is the demo really free?", a: "Yes — the demo class and level test are free, with no obligation to enrol." },
        { q: "Can I attend the demo online?", a: "Yes. We'll send a Google Meet link for the batch you choose." },
        { q: "What should I bring?", a: "Just a notebook. For PTE demos we provide the computer lab." },
      ] } },
    ] },
    { slug: "contact", title: "Contact", isSystem: true, order: 7, sections: [
      { type: "contactInfo", content: { eyebrow: "GET IN TOUCH", title: "Visit", titleHighlight: "Our Centre", address: "Your City", phone: "9000000000", email: "hello@example.com", hours: "Mon–Sat 7:00 AM – 9:30 PM · Sun 9:00 AM – 6:00 PM", mapEmbed: "" } },
      { type: "map", content: { eyebrow: "LOCATION", title: "Find", titleHighlight: "Us", address: "Your City", mapEmbed: "" } },
      { type: "contactForm", content: { title: "Send Us a Message", subtitle: "Ask about courses, batches, fees or exam booking — we reply the same day." } },
    ] },
  ],
};
