import type { TemplateDef } from "./types";

// Coaching Institute (JEE/NEET/UPSC/SSC/tuition): bold, results-driven,
// conversion-focused — batches, toppers & ranks, free demo booking, test series.
export const coaching: TemplateDef = {
  theme: {
    colors: { primary: "#e11d48", primaryDark: "#be123c", secondary: "#0f172a", accent: "#f59e0b", dark: "#12070d", light: "#fff5f6", text: "#334155", heading: "#0f172a" },
    font: "Sora", radius: "0.85rem",
  },
  header: (biz) => ({
    logoText: biz, logoImage: "",
    announcement: { show: true, text: "🔥 New JEE, NEET & SSC batches starting soon · Book a FREE demo class today!", link: "/demo" },
    topbar: { show: true, address: "Results-driven coaching for JEE, NEET, UPSC & SSC", phones: ["9000000000"], email: "info@example.com", social: { facebook: "#", instagram: "#", whatsapp: "#" } },
    nav: [
      { label: "Home", href: "/" }, { label: "Courses", href: "/courses" }, { label: "Results", href: "/results" }, { label: "Faculty", href: "/faculty" }, { label: "Notices", href: "/notices" }, { label: "Fees", href: "/fees" }, { label: "Free Demo", href: "/demo" },
    ],
    cta: { label: "Book Free Demo", href: "/demo" },
  }),
  footer: (biz) => ({
    design: "gradient",
    about: "Result-oriented coaching with expert faculty, small batches, weekly test series and a proven track record of selections in JEE, NEET, UPSC, SSC and banking.",
    columns: [
      { title: "Quick Links", links: [ { label: "Home", href: "/" }, { label: "About Us", href: "/about" }, { label: "Courses", href: "/courses" }, { label: "Faculty", href: "/faculty" }, { label: "Results", href: "/results" }, { label: "Free Demo", href: "/demo" } ] },
      { title: "Courses", links: [ { label: "JEE", href: "/courses" }, { label: "NEET", href: "/courses" }, { label: "UPSC / PSC", href: "/courses" }, { label: "SSC & Banking", href: "/courses" }, { label: "Board Tuition", href: "/courses" } ] },
    ],
    serviceAreas: ["JEE", "NEET", "UPSC", "SSC", "Banking", "Board Tuition"],
    contact: { phones: ["9000000000"], email: "info@example.com", address: "Your City" },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. Your success, our mission.`,
  }),
  seo: (biz) => ({ title: `${biz} — Coaching for JEE, NEET, UPSC, SSC & Banking`, description: "Result-oriented coaching with IIT/AIIMS-qualified faculty, batches of 40, weekly test series and 2,000+ selections. Scholarships up to 100%. Book a free demo class today.", favicon: "", ogImage: "" }),
  services: [
    { category: "Engineering & Medical", title: "JEE (Main + Advanced)", description: "2-year and 1-year classroom programs with weekly JEE-pattern tests and IIT-alumni mentors." },
    { category: "Engineering & Medical", title: "NEET (UG)", description: "Complete Physics, Chemistry and Biology coverage with NCERT-focused notes and 40+ full mock tests." },
    { category: "Engineering & Medical", title: "Foundation (Class 8–10)", description: "Olympiad, NTSE and early JEE/NEET concepts alongside school syllabus." },
    { category: "Government Jobs", title: "UPSC / State PSC", description: "Prelims, Mains answer-writing and interview guidance by ex-civil servants." },
    { category: "Government Jobs", title: "SSC & Railways", description: "CGL, CHSL, MTS and RRB with speed-focused quant and reasoning drills." },
    { category: "Government Jobs", title: "Banking (IBPS / SBI)", description: "PO, Clerk and SO preparation with sectional tests and interview practice." },
    { category: "Board & Tuition", title: "Class 11–12 Science", description: "PCM / PCB with board-exam excellence and competitive-exam depth." },
    { category: "Board & Tuition", title: "Class 11–12 Commerce", description: "Accountancy, Economics and Business Studies with CUET orientation." },
    { category: "Board & Tuition", title: "Class 9–10 (All Subjects)", description: "Strong school foundation with chapter tests and doubt sessions." },
  ],
  gallery: [...["Smart classrooms", "Doubt-clearing session", "Test hall", "Library & self-study zone", "Award ceremony", "Toppers' felicitation", "Faculty room", "Seminar hall"].map((c) => ({ category: "Our Institute", caption: c }))],
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "marquee", customHtml: "",
          badge: "NEW BATCHES · SCHOLARSHIPS UP TO 100%", titleTop: "Crack JEE, NEET & Govt Exams", titleHighlight: "With Confidence",
          subtitle: "", description: `${biz} turns hard work into selections — IIT/AIIMS-qualified faculty, batches capped at 40, weekly exam-pattern tests and a personal mentor for every student.`, image: "",
          primaryBtn: { label: "Book Free Demo", href: "/demo" }, secondaryBtn: { label: "View Results", href: "/results" },
          features: [ { icon: "award", title: "2,000+ Selections", text: "" }, { icon: "graduation", title: "IIT / AIIMS Faculty", text: "" }, { icon: "users", title: "Max 40 per Batch", text: "" }, { icon: "clipboard", title: "Weekly Test Series", text: "" } ],
        } },
        { type: "stats", content: { items: [ { value: "2,000+", label: "Selections", icon: "award" }, { value: "AIR 47", label: "Best JEE Rank", icon: "trending" }, { value: "50+", label: "Expert Faculty", icon: "graduation" }, { value: "15+", label: "Years of Results", icon: "star" } ] } },
        { type: "features", style: { background: "light" }, content: { items: [
          { icon: "graduation", title: "Faculty Who've Cracked It", text: "Learn from IITians, doctors and ex-civil servants who know exactly what the exam demands." },
          { icon: "users", title: "Small Batches", text: "Capped at 40 students so every doubt is heard and every student is tracked." },
          { icon: "clipboard", title: "Weekly Test Series", text: "Exam-pattern tests with all-India ranking and question-wise analysis." },
          { icon: "headset", title: "Unlimited Doubt Support", text: "Daily doubt counters in class plus WhatsApp and app support till late evening." },
          { icon: "book", title: "Smart Study Material", text: "Concise theory, solved examples and PYQs — updated every year to the latest pattern." },
          { icon: "trending", title: "Parent Progress Reports", text: "Monthly performance reports and parent-teacher meetings to keep everyone aligned." },
        ] } },
        { type: "serviceCategories", content: { eyebrow: "COURSES", title: "Programs for Every", titleHighlight: "Goal", categories: ["Engineering & Medical", "Government Jobs", "Board & Tuition"] } },
        { type: "toppers", content: { eyebrow: "OUR RESULTS", title: "Meet Our", titleHighlight: "Top Rankers", items: [
          { name: "Aditya Kumar", exam: "JEE Advanced 2025", score: "AIR 47", rank: "1", image: "" },
          { name: "Sneha Reddy", exam: "NEET 2025", score: "AIR 142", rank: "2", image: "" },
          { name: "Mohit Chauhan", exam: "SSC CGL 2025", score: "Selected", rank: "", image: "" },
          { name: "Pallavi Singh", exam: "IBPS PO 2025", score: "Selected", rank: "", image: "" },
        ] } },
        { type: "about", content: { eyebrow: "WHY US", title: "One Promise:", titleHighlight: "Results", body: [`Since day one, ${biz} has been built around a simple idea — teach concepts deeply, test often, and mentor every student personally.`, "Our structured plan covers the full syllabus months before the exam, leaving time for revision, mock tests and targeted improvement."], image: "", points: ["Concept-first teaching", "Full syllabus + 3 revision cycles", "All-India mock tests", "Personal mentor for each student", "Scholarships up to 100%", "Hostel & library facility"], buttonLabel: "Book Free Demo", buttonHref: "/demo" } },
        { type: "team", style: { background: "light" }, content: { eyebrow: "FACULTY", title: "Learn From the", titleHighlight: "Best", members: [
          { name: "Er. Vivek Sinha", role: "Physics · JEE / NEET", image: "", note: "IIT Delhi · 14 yrs" },
          { name: "Dr. Nandini Rao", role: "Biology · NEET", image: "", note: "MBBS, AIIMS · 10 yrs" },
          { name: "Mr. Harish Pandey", role: "Mathematics · JEE", image: "", note: "IIT Kanpur · 12 yrs" },
          { name: "Mr. Alok Tripathi", role: "General Studies · UPSC", image: "", note: "Ex-Civil Services" },
        ] } },
        { type: "steps", content: { eyebrow: "GET STARTED", title: "Your Path to", titleHighlight: "Selection", items: [
          { title: "Book Free Demo", text: "Attend a live class, no charge", icon: "edit" },
          { title: "Scholarship Test", text: "Win up to 100% fee waiver", icon: "award" },
          { title: "Counselling", text: "Pick the right course & batch", icon: "headset" },
          { title: "Learn, Test, Improve", text: "Weekly tests and mentor reviews", icon: "trending" },
        ] } },
        { type: "testimonials", content: { eyebrow: "SUCCESS STORIES", title: "What Our", titleHighlight: "Students Say", items: [
          { name: "Priya Verma", role: "NEET 2025 · AIR 1,284", text: "The weekly tests and doubt sessions made all the difference. My mentor tracked every weak chapter until it became a strength. Cleared NEET in my first attempt!", rating: 5 },
          { name: "Arjun Nair", role: "JEE Advanced 2025 · IIT Madras", text: "Small batches meant I got real personal attention. The faculty here genuinely care about your rank, not just finishing the syllabus.", rating: 5 },
          { name: "Sneha Das", role: "SSC CGL 2025 · Selected", text: "A clear study plan, daily practice sets and regular mock tests. I improved my score by 40 marks in three months.", rating: 5 },
          { name: "Mrs. Kavita Joshi", role: "Parent of JEE aspirant", text: "The monthly reports and parent meetings kept us informed. We could see our son's rank improving test after test.", rating: 5 },
        ] } },
        { type: "faq", style: { background: "light" }, content: { eyebrow: "FAQ", title: "Questions Students", titleHighlight: "Ask Us", items: [
          { q: "Can I attend a class before enrolling?", a: "Yes. Book a free demo class for any course and experience our teaching, material and test system before you decide." },
          { q: "What is the batch size?", a: "Batches are capped at 40 students so faculty can give personal attention and track every student's progress." },
          { q: "Do you offer scholarships?", a: "Yes. Our scholarship test offers fee waivers of up to 100% based on performance. Board toppers also get merit discounts." },
          { q: "Are online or hybrid classes available?", a: "Yes. All classes are recorded, and hybrid batches let you attend live online with full access to tests and doubt support." },
          { q: "How are parents kept informed?", a: "Parents get monthly performance reports, test-wise rank updates and regular parent-teacher meetings." },
          { q: "Do you offer EMI on fees?", a: "Yes. Fees can be paid in easy instalments or no-cost EMI. Ask our counsellors for current offers." },
        ] } },
        { type: "cta", content: { title: "Your selection starts here", highlight: "Book a Free Demo Class", phones: ["9000000000"], buttonLabel: "Book Free Demo", buttonHref: "/demo" } },
      ],
    },
    { slug: "about", title: "About", isSystem: true, order: 1, sections: [
      { type: "about", content: { eyebrow: "ABOUT US", title: "Why Students", titleHighlight: "Trust Us", body: [`${biz} is built on one promise — results. Our proven methodology, expert faculty and constant testing help students achieve their dream ranks.`, "We focus on concepts, practice and performance, not just lectures."], image: "", points: ["Result-oriented teaching", "Small, focused batches", "Regular tests & analysis", "Personal mentoring"], buttonLabel: "Book Free Demo", buttonHref: "/demo" } },
      { type: "stats", content: { items: [ { value: "2,000+", label: "Selections", icon: "award" }, { value: "15+", label: "Years", icon: "star" }, { value: "50+", label: "Faculty", icon: "graduation" }, { value: "95%", label: "Success Rate", icon: "trending" } ] } },
      { type: "cta", content: { title: "Try before you enroll", highlight: "Book a Free Demo", phones: ["9000000000"], buttonLabel: "Book Free Demo", buttonHref: "/demo" } },
    ] },
    { slug: "courses", title: "Courses", isSystem: true, order: 2, sections: [
      { type: "serviceCategories", content: { eyebrow: "", title: "Our", titleHighlight: "Courses & Batches", categories: ["Engineering & Medical", "Government Jobs", "Board & Tuition"] } },
      { type: "cta", content: { title: "Confused which course fits you?", highlight: "Get Free Counselling", phones: ["9000000000"], buttonLabel: "Book Free Demo", buttonHref: "/demo" } },
    ] },
    { slug: "faculty", title: "Faculty", isSystem: true, order: 3, sections: [
      { type: "team", content: { eyebrow: "OUR TEAM", title: "Expert", titleHighlight: "Faculty", members: [
        { name: "Er. Vivek Sinha", role: "Physics (JEE/NEET)", image: "", note: "IIT Delhi · 14 yrs" },
        { name: "Mrs. Rekha Menon", role: "Chemistry", image: "", note: "M.Sc · 10 yrs" },
        { name: "Dr. Nandini Rao", role: "Biology (NEET)", image: "", note: "MBBS, AIIMS" },
        { name: "Mr. Harish Pandey", role: "Mathematics", image: "", note: "IIT Kanpur" },
        { name: "Mr. Alok Tripathi", role: "General Studies (UPSC)", image: "", note: "Ex-Civil Services" },
        { name: "Mr. Deepak Yadav", role: "Quant & Reasoning", image: "", note: "10 yrs" },
      ] } },
    ] },
    { slug: "results", title: "Results", isSystem: true, order: 4, sections: [
      { type: "stats", content: { items: [ { value: "2,000+", label: "Total Selections", icon: "award" }, { value: "AIR 47", label: "Best JEE Rank", icon: "trending" }, { value: "AIR 142", label: "Best NEET Rank", icon: "graduation" }, { value: "300+", label: "Govt Job Selections", icon: "badge-check" } ] } },
      { type: "toppers", content: { eyebrow: "TOP RANKERS", title: "Our Proud", titleHighlight: "Achievers", items: [
        { name: "Aditya Kumar", exam: "JEE Advanced 2025", score: "AIR 47", rank: "", image: "" },
        { name: "Sneha Reddy", exam: "NEET 2025", score: "AIR 142", rank: "", image: "" },
        { name: "Rahul Bansal", exam: "UPSC CSE", score: "Rank 210", rank: "", image: "" },
        { name: "Mohit Chauhan", exam: "SSC CGL", score: "Selected", rank: "", image: "" },
      ] } },
      { type: "downloads", content: { eyebrow: "DOWNLOADS", title: "Downloads &", titleHighlight: "Resources", items: [
        { title: "Course Prospectus", description: "Full details of courses, batches & fees.", link: "", icon: "book" },
        { title: "Sample Test Paper", description: "Try our exam-pattern test series.", link: "", icon: "clipboard" },
        { title: "Scholarship Form", description: "Apply for the scholarship test.", link: "", icon: "award" },
        { title: "Batch Timetable", description: "Class schedule for all courses.", link: "", icon: "calendar" },
      ] } },
      { type: "cta", content: { title: "Be our next success story", highlight: "Book a Free Demo", phones: ["9000000000"], buttonLabel: "Book Free Demo", buttonHref: "/demo" } },
    ] },
    { slug: "fees", title: "Fees", isSystem: true, order: 5, sections: [
      { type: "priceList", content: { eyebrow: "", title: "Course", titleHighlight: "Fees", note: "EMI options and scholarships (based on a scholarship test) available. Contact us for current offers.", groups: [
        { category: "Engineering & Medical", items: [ { name: "JEE / NEET (2-year)", price: "₹1,10,000", note: "₹55,000/yr" }, { name: "JEE / NEET (1-year)", price: "₹65,000", note: "" }, { name: "Foundation (8–10)", price: "₹28,000/yr", note: "" } ] },
        { category: "Government Jobs", items: [ { name: "UPSC / PSC (Foundation)", price: "₹95,000", note: "" }, { name: "SSC & Railways", price: "₹22,000", note: "" }, { name: "Banking (IBPS/SBI)", price: "₹20,000", note: "" } ] },
        { category: "Board & Tuition", items: [ { name: "Class 11–12 (PCM/PCB)", price: "₹40,000/yr", note: "" }, { name: "Class 9–10", price: "₹24,000/yr", note: "" } ] },
      ] } },
      { type: "cta", content: { title: "Ask about scholarships & EMI", highlight: "Talk to Us", phones: ["9000000000"], buttonLabel: "Book Free Demo", buttonHref: "/demo" } },
    ] },
    { slug: "contact", title: "Contact", isSystem: true, order: 6, sections: [ { type: "contactForm", content: { title: "Contact Us", subtitle: "For admissions, batches, fees or scholarships — reach out anytime." } } ] },
    { slug: "demo", title: "Free Demo", isSystem: true, order: 7, sections: [ { type: "appointmentForm", content: { title: "Book a Free Demo Class", subtitle: "Pick a date & time — attend a live class free before you decide." } } ] },
    { slug: "notices", title: "Notices", isSystem: true, order: 8, sections: [
      { type: "noticeBoard", content: { eyebrow: "STAY UPDATED", title: "Notices &", titleHighlight: "Announcements", notices: [
        { date: "12 Jul", title: "New JEE & NEET batches start 20th July — enroll now", category: "Admission", link: "/demo", isNew: true },
        { date: "08 Jul", title: "Scholarship Test on 15th July — up to 100% fee waiver", category: "Exam", link: "/demo", isNew: true },
        { date: "06 Jul", title: "Weekly test series results updated on portal", category: "Result", link: "/results", isNew: true },
        { date: "01 Jul", title: "2025 Results: 2,000+ selections, best AIR 47", category: "Result", link: "/results", isNew: false },
        { date: "25 Jun", title: "Free demo classes every Saturday — book your seat", category: "Event", link: "/demo", isNew: false },
        { date: "18 Jun", title: "Doubt-clearing camp before exams — register now", category: "Event", link: "", isNew: false },
      ] } },
      { type: "downloads", content: { eyebrow: "RESOURCES", title: "Download", titleHighlight: "Resources", items: [
        { title: "Latest Result Sheet", description: "This year's selections & ranks (PDF).", link: "", icon: "award" },
        { title: "Scholarship Test Form", description: "Apply for the scholarship test.", link: "", icon: "clipboard" },
        { title: "Sample Test Paper", description: "Exam-pattern practice paper.", link: "", icon: "book" },
        { title: "Batch Timetable", description: "Class schedule for all courses.", link: "", icon: "calendar" },
      ] } },
    ] },
  ],
};
