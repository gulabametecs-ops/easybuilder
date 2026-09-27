import type { TemplateDef } from "./types";

// Primary School (classes 1–5, ages 5–11): friendly, colourful, academics + activities.
export const primarySchool: TemplateDef = {
  theme: {
    colors: { primary: "#0ea5e9", primaryDark: "#0369a1", secondary: "#0c2d48", accent: "#22c55e", dark: "#0a1f33", light: "#f0f9ff", text: "#334155", heading: "#0c2d48" },
    font: "Plus Jakarta Sans", radius: "1.1rem",
  },
  header: (biz) => ({
    logoText: biz, logoImage: "",
    announcement: { show: true, text: "📚 Admissions open for Classes 1–5 · Book a campus tour this week", link: "/admission" },
    topbar: { show: true, address: "Strong foundations for bright futures", phones: ["9000000000"], email: "info@example.com", social: { facebook: "#", instagram: "#", whatsapp: "#" } },
    nav: [
      { label: "Home", href: "/" }, { label: "Academics", href: "/academics" }, { label: "Activities", href: "/activities" }, { label: "Notices", href: "/notices" }, { label: "Fees", href: "/fees" }, { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Apply for Admission", href: "/admission" },
  }),
  footer: (biz) => ({
    design: "modern",
    about: "A nurturing primary school where concept-based learning, activities and values come together to raise confident, curious and kind children.",
    columns: [
      { title: "Quick Links", links: [ { label: "Home", href: "/" }, { label: "About Us", href: "/about" }, { label: "Academics", href: "/academics" }, { label: "Activities", href: "/activities" }, { label: "Facilities", href: "/facilities" }, { label: "Admission", href: "/admission" } ] },
      { title: "Classes", links: [ { label: "Class 1 & 2", href: "/academics" }, { label: "Class 3", href: "/academics" }, { label: "Class 4", href: "/academics" }, { label: "Class 5", href: "/academics" } ] },
    ],
    serviceAreas: ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5"],
    contact: { phones: ["9000000000"], email: "info@example.com", address: "Your City" },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. Building bright futures.`,
  }),
  seo: (biz) => ({ title: `${biz} — Primary School (Classes 1–5)`, description: "A caring primary school with concept-based academics, small classes, sports, arts and a safe, CCTV-secured campus. Admissions open for Classes 1–5 — apply today.", favicon: "", ogImage: "" }),
  services: [
    { category: "Academics (Classes 1–5)", title: "English", description: "Phonics, reading clubs, creative writing and confident spoken English." },
    { category: "Academics (Classes 1–5)", title: "Mathematics", description: "Concept-first maths with manipulatives, mental maths and real-life problems." },
    { category: "Academics (Classes 1–5)", title: "Environmental Science", description: "Hands-on projects, nature walks and simple experiments about the world around us." },
    { category: "Academics (Classes 1–5)", title: "Hindi & Regional Language", description: "Reading, writing and expression in a second language." },
    { category: "Academics (Classes 1–5)", title: "Computers & Coding", description: "Digital basics, typing and block-based coding from Class 1." },
    { category: "Academics (Classes 1–5)", title: "General Knowledge", description: "Quizzes, current affairs and curiosity about everything." },
    { category: "Co-curricular", title: "Art & Craft", description: "Drawing, painting and craft that build creativity and fine motor skills." },
    { category: "Co-curricular", title: "Music & Dance", description: "Vocal, instruments and dance for rhythm, confidence and joy." },
    { category: "Co-curricular", title: "Sports & Yoga", description: "Athletics, football, skating and daily yoga for fitness and focus." },
    { category: "Co-curricular", title: "Public Speaking", description: "Show-and-tell, assemblies and debates for confident young speakers." },
  ],
  gallery: [...["Smart classroom", "Reading corner & library", "Computer lab", "Sports ground", "Art room", "Annual function", "Science fair", "Field trip"].map((c) => ({ category: "Our Campus", caption: c }))],
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "split", customHtml: "",
          badge: "CLASSES 1 – 5 · ADMISSIONS OPEN", titleTop: "Where Curious Kids Become", titleHighlight: "Confident Learners",
          subtitle: "", description: `${biz} combines concept-based academics, small classes and a rich activity programme — so your child understands what they learn, loves coming to school and grows with strong values.`, image: "",
          primaryBtn: { label: "Apply for Admission", href: "/admission" }, secondaryBtn: { label: "Explore Academics", href: "/academics" },
          features: [ { icon: "book", title: "Concept-Based Learning", text: "" }, { icon: "users", title: "Max 25 per Class", text: "" }, { icon: "shield", title: "CCTV-Secured Campus", text: "" }, { icon: "star", title: "20+ Activities", text: "" } ],
        } },
        { type: "features", style: { background: "light" }, content: { items: [
          { icon: "book", title: "Understand, Don't Memorise", text: "Activity-based lessons, projects and experiments that make concepts clear and lasting." },
          { icon: "users", title: "Every Child Is Seen", text: "Small classes and a class teacher who tracks each child's reading, maths and confidence." },
          { icon: "shield", title: "Safe & Caring Campus", text: "CCTV, verified staff, a nurse on campus and GPS-tracked buses with lady attendants." },
          { icon: "star", title: "All-Round Growth", text: "Sports, arts, music, coding and values education woven into every week." },
        ] } },
        { type: "about", content: { eyebrow: "ABOUT US", title: "A School Where Children Love to", titleHighlight: "Learn", body: [`${biz} was built on a simple belief — young children learn best when they feel safe, valued and curious. Our classrooms are bright, our teachers are warm and our lessons are hands-on.`, "We keep parents closely involved with regular updates, open-door meetings and a clear view of their child's progress."], image: "", points: ["Experienced, B.Ed-qualified teachers", "Activity & project-based learning", "No heavy school bags policy", "Monthly parent updates", "Reading & maths labs", "Discipline with kindness"], buttonLabel: "About Us", buttonHref: "/about" } },
        { type: "serviceCategories", content: { eyebrow: "ACADEMICS", title: "What Your Child Will", titleHighlight: "Learn", categories: ["Academics (Classes 1–5)", "Co-curricular"] } },
        { type: "stats", content: { items: [ { value: "1,200+", label: "Happy Students", icon: "users" }, { value: "20+", label: "Years of Trust", icon: "star" }, { value: "50+", label: "Qualified Teachers", icon: "graduation" }, { value: "1:20", label: "Teacher–Student Ratio", icon: "check" } ] } },
        { type: "steps", style: { background: "light" }, content: { eyebrow: "ADMISSION", title: "Simple, Stress-Free", titleHighlight: "Admission", items: [
          { title: "Enquire Online", text: "Fill the short admission form", icon: "edit" },
          { title: "Campus Tour", text: "See classrooms, labs and grounds", icon: "home" },
          { title: "Friendly Interaction", text: "A relaxed chat with your child — no tests", icon: "headset" },
          { title: "Welcome Aboard", text: "Complete formalities and join the family", icon: "graduation" },
        ] } },
        { type: "team", content: { eyebrow: "OUR TEACHERS", title: "Meet the People Who", titleHighlight: "Inspire", members: [
          { name: "Mrs. Sunita Agarwal", role: "Principal", image: "", note: "M.A., M.Ed · 22 yrs" },
          { name: "Ms. Meera Krishnan", role: "Class 1 & 2 Coordinator", image: "", note: "B.Ed · Phonics Trainer" },
          { name: "Mr. Rakesh Verma", role: "Mathematics", image: "", note: "M.Sc, B.Ed" },
          { name: "Ms. Anjali Deshpande", role: "Activities & Sports", image: "", note: "B.P.Ed · Yoga Certified" },
        ] } },
        { type: "noticeBoard", content: { eyebrow: "STAY UPDATED", title: "Latest from", titleHighlight: "School", limit: 4, notices: [
          { date: "05 Jul", title: "Admissions open for Classes 1–5 — apply now", category: "Admission", link: "/admission", isNew: true },
          { date: "01 Jul", title: "Parent-Teacher Meeting on 12th July", category: "Event", link: "", isNew: true },
          { date: "28 Jun", title: "Annual Sports Day — 25th July", category: "Event", link: "", isNew: false },
          { date: "20 Jun", title: "School reopens 1st July after summer break", category: "Holiday", link: "", isNew: false },
        ] } },
        { type: "testimonials", content: { eyebrow: "PARENTS SAY", title: "Trusted by", titleHighlight: "Parents", items: [
          { name: "Anita Rao", role: "Mother of Kabir, Class 3", text: "Kabir used to struggle with reading. Within a term his class teacher had him reading storybooks on his own. The personal attention here is real.", rating: 5 },
          { name: "Vikas Sharma", role: "Father of Myra, Class 1", text: "A lovely balance of studies and activities. Myra talks about her skating and coding classes as much as her maths — that tells you everything.", rating: 5 },
          { name: "Farah Ali", role: "Mother of Ayaan, Class 5", text: "Safe campus, caring teachers and very transparent communication. We always know exactly how our son is doing.", rating: 5 },
          { name: "Suresh Pillai", role: "Father of Diya, Class 4", text: "The project-based learning is excellent. Diya explains science concepts at home with real confidence now.", rating: 5 },
        ] } },
        { type: "faq", style: { background: "light" }, content: { eyebrow: "PARENT FAQ", title: "Questions Parents", titleHighlight: "Often Ask", items: [
          { q: "Which board does the school follow?", a: "We follow the CBSE / NCERT framework for Classes 1–5, enriched with our own activity-based and project-based programme." },
          { q: "What is the age criteria for Class 1?", a: "Children should be 6 years old by 31st March of the admission year. Our team will confirm eligibility for other classes." },
          { q: "Is there an entrance test?", a: "No. We have a relaxed, friendly interaction with the child and parents to understand the child better." },
          { q: "How many students are there in a class?", a: "We cap classes at 25 students, so teachers can give every child individual attention." },
          { q: "Do you provide transport?", a: "Yes. GPS-tracked school buses with lady attendants cover all major routes in the city." },
          { q: "How are parents kept informed?", a: "Through the parent app, monthly progress notes, term-wise report cards and regular parent-teacher meetings." },
        ] } },
        { type: "cta", content: { title: "Give your child the best start", highlight: "Apply for Admission", phones: ["9000000000"], buttonLabel: "Apply Now", buttonHref: "/admission" } },
      ],
    },
    { slug: "about", title: "About", isSystem: true, order: 1, sections: [
      { type: "about", content: { eyebrow: "ABOUT US", title: "Our", titleHighlight: "Mission", body: [`${biz} is committed to nurturing every child's potential through caring, activity-based education.`, "We want every child to leave Class 5 as a confident reader, a clear thinker and a kind human being."], image: "", points: ["Strong academic foundation", "Values & good habits", "Safe, happy environment", "Parents as partners"], buttonLabel: "", buttonHref: "" } },
      { type: "stats", content: { items: [ { value: "1,200+", label: "Students", icon: "users" }, { value: "20+", label: "Years", icon: "star" }, { value: "50+", label: "Teachers", icon: "graduation" }, { value: "98%", label: "Parent Trust", icon: "award" } ] } },
      { type: "cta", content: { title: "Visit our campus", highlight: "Admissions Open", phones: ["9000000000"], buttonLabel: "Apply Now", buttonHref: "/admission" } },
    ] },
    { slug: "academics", title: "Academics", isSystem: true, order: 2, sections: [
      { type: "serviceCategories", content: { eyebrow: "", title: "Our", titleHighlight: "Curriculum", categories: ["Academics (Classes 1–5)", "Co-curricular"] } },
      { type: "cta", content: { title: "Want to know more?", highlight: "Talk to Us", phones: ["9000000000"], buttonLabel: "Apply Now", buttonHref: "/admission" } },
    ] },
    { slug: "activities", title: "Activities", isSystem: true, order: 3, sections: [
      { type: "features", content: { items: [
        { icon: "star", title: "Sports Day & Games", text: "Football, athletics, skating, yoga and fun games." },
        { icon: "book", title: "Reading Club", text: "Building a lifelong love for books." },
        { icon: "users", title: "Cultural Events", text: "Annual day, festivals and inter-house competitions." },
        { icon: "plane", title: "Field Trips", text: "Learning beyond the classroom — farms, museums and science parks." },
      ] } },
      { type: "gallery", content: { eyebrow: "", title: "Life at", titleHighlight: "Our School" } },
    ] },
    { slug: "facilities", title: "Facilities", isSystem: true, order: 4, sections: [
      { type: "features", content: { items: [
        { icon: "home", title: "Smart Classrooms", text: "Digital boards and bright, airy rooms." },
        { icon: "book", title: "Library", text: "A wide collection of books for young readers." },
        { icon: "bolt", title: "Computer Lab", text: "Early digital literacy in a modern lab." },
        { icon: "star", title: "Sports Ground", text: "Safe, spacious play and sports area." },
        { icon: "truck", title: "Safe Transport", text: "GPS-tracked buses with attendants." },
        { icon: "heart", title: "Medical Care", text: "First-aid room and regular health checks." },
      ] } },
    ] },
    { slug: "fees", title: "Fees", isSystem: true, order: 5, sections: [
      { type: "priceList", content: { eyebrow: "", title: "Fee", titleHighlight: "Structure", note: "Fees are per year and include activity charges. Sibling discounts available.", groups: [
        { category: "Tuition Fees", items: [ { name: "Class 1 & 2", price: "₹42,000/yr", note: "" }, { name: "Class 3 & 4", price: "₹48,000/yr", note: "" }, { name: "Class 5", price: "₹52,000/yr", note: "" } ] },
        { category: "Optional", items: [ { name: "Transport", price: "₹1,200/mo", note: "route-wise" }, { name: "Admission Kit", price: "₹5,000", note: "one-time" } ] },
      ] } },
      { type: "cta", content: { title: "Questions about fees?", highlight: "Contact Us", phones: ["9000000000"], buttonLabel: "Apply Now", buttonHref: "/admission" } },
    ] },
    { slug: "contact", title: "Contact", isSystem: true, order: 6, sections: [ { type: "contactForm", content: { title: "Contact Us", subtitle: "For admissions, fees or a campus visit — reach out anytime." } } ] },
    { slug: "admission", title: "Apply for Admission", isSystem: true, order: 7, sections: [
      { type: "downloads", content: { eyebrow: "DOWNLOADS", title: "Downloads &", titleHighlight: "Prospectus", items: [
        { title: "Prospectus 2026–27", description: "Curriculum, activities, facilities & fees.", link: "", icon: "book" },
        { title: "Fee Structure", description: "Class-wise fees and transport charges.", link: "", icon: "tag" },
        { title: "Academic Calendar", description: "Holidays, exams and events.", link: "", icon: "calendar" },
        { title: "Admission Form", description: "Offline admission form (PDF).", link: "", icon: "clipboard" },
      ] } },
      { type: "quoteForm", content: { title: "Admission Enquiry", subtitle: "Fill the form and our team will call you to guide you through admission.", showSidebar: true } },
    ] },
    { slug: "notices", title: "Notices", isSystem: true, order: 8, sections: [
      { type: "noticeBoard", content: { eyebrow: "STAY UPDATED", title: "Notices &", titleHighlight: "Circulars", notices: [
        { date: "05 Jul", title: "Admissions open for Classes 1–5 — apply now", category: "Admission", link: "/admission", isNew: true },
        { date: "02 Jul", title: "Unit Test schedule shared with parents", category: "Exam", link: "", isNew: true },
        { date: "01 Jul", title: "Parent-Teacher Meeting on 12th July", category: "Event", link: "", isNew: true },
        { date: "28 Jun", title: "Annual Sports Day — 25th July", category: "Event", link: "", isNew: false },
        { date: "20 Jun", title: "School reopens 1st July after summer break", category: "Holiday", link: "", isNew: false },
        { date: "15 Jun", title: "Updated bus routes — see the transport circular", category: "News", link: "", isNew: false },
      ] } },
      { type: "downloads", content: { eyebrow: "CIRCULARS", title: "Download", titleHighlight: "Circulars", items: [
        { title: "Academic Calendar", description: "Holidays, exams and events (PDF).", link: "", icon: "calendar" },
        { title: "Fee Circular", description: "Class-wise fees and due dates.", link: "", icon: "tag" },
        { title: "Book List", description: "Class-wise book and stationery list.", link: "", icon: "book" },
        { title: "Transport Routes", description: "Bus routes and timings.", link: "", icon: "clipboard" },
      ] } },
    ] },
  ],
};
