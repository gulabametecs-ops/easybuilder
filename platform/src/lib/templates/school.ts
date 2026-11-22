import type { TemplateDef } from "./types";

// School (Secondary / Senior Secondary, classes 6–12): professional, academic,
// board results & toppers, streams, faculty, facilities, admissions.
export const school: TemplateDef = {
  theme: {
    colors: { primary: "#1d4ed8", primaryDark: "#1e3a8a", secondary: "#0f172a", accent: "#f59e0b", dark: "#0a1128", light: "#f1f5ff", text: "#334155", heading: "#0f172a" },
    font: "Manrope", radius: "0.5rem",
  },
  header: (biz) => ({
    design: "bold",
    logoText: biz, logoImage: "",
    announcement: { show: true, text: "🎓 Admissions open for 2026–27 · Class 11 stream counselling now on", link: "/admission" },
    topbar: { show: true, address: "CBSE affiliated · Classes 6 to 12", phones: ["9000000000"], email: "info@example.com", social: { facebook: "#", instagram: "#", whatsapp: "#" } },
    nav: [
      { label: "Home", href: "/" }, { label: "Academics", href: "/academics" }, { label: "Faculty", href: "/faculty" }, { label: "Results", href: "/results" }, { label: "Notices", href: "/notices" }, { label: "Facilities", href: "/facilities" }, { label: "Admissions", href: "/admission" }, { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Apply for Admission", href: "/admission" },
  }),
  footer: (biz) => ({
    design: "classic",
    about: "A leading senior secondary school committed to academic excellence, strong character and all-round development — preparing students for boards, entrances and life.",
    columns: [
      { title: "Quick Links", links: [ { label: "Home", href: "/" }, { label: "About Us", href: "/about" }, { label: "Academics", href: "/academics" }, { label: "Faculty", href: "/faculty" }, { label: "Results", href: "/results" }, { label: "Admissions", href: "/admission" } ] },
      { title: "Academics", links: [ { label: "Secondary (6–10)", href: "/academics" }, { label: "Science (11–12)", href: "/academics" }, { label: "Commerce (11–12)", href: "/academics" }, { label: "Humanities (11–12)", href: "/academics" } ] },
    ],
    serviceAreas: ["CBSE", "Class 6–10", "Science", "Commerce", "Humanities"],
    contact: { phones: ["9000000000"], email: "info@example.com", address: "Your City" },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. Shaping future leaders.`,
  }),
  seo: (biz) => ({ title: `${biz} — CBSE School (Classes 6–12)`, description: "A leading CBSE school with expert faculty, 100% board results, Science, Commerce & Humanities streams, integrated JEE/NEET support and modern labs. Admissions open — apply today.", favicon: "", ogImage: "" }),
  services: [
    { category: "Secondary (Classes 6–10)", title: "Core Academics", description: "Maths, Science, Social Science and English taught concept-first with regular assessments." },
    { category: "Secondary (Classes 6–10)", title: "Languages", description: "Hindi, Sanskrit and a foreign-language option (French / German)." },
    { category: "Secondary (Classes 6–10)", title: "Computer Science & AI", description: "Coding, robotics and AI basics in our modern computer lab." },
    { category: "Secondary (Classes 6–10)", title: "Olympiad & Foundation", description: "Early preparation for Olympiads, NTSE and competitive exams." },
    { category: "Senior Secondary (11–12)", title: "Science — PCM", description: "Physics, Chemistry, Maths with integrated JEE preparation." },
    { category: "Senior Secondary (11–12)", title: "Science — PCB", description: "Physics, Chemistry, Biology with integrated NEET preparation." },
    { category: "Senior Secondary (11–12)", title: "Commerce", description: "Accountancy, Business Studies, Economics with CA / CUET orientation." },
    { category: "Senior Secondary (11–12)", title: "Humanities", description: "History, Political Science, Psychology, Economics & more — CUET ready." },
  ],
  gallery: [...["Campus", "Science labs", "Library", "Smart classrooms", "Sports complex", "Auditorium", "Annual day", "Inter-school sports meet"].map((c) => ({ category: "Our Campus", caption: c }))],
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "slideshow", customHtml: "",
          badge: "CBSE AFFILIATED · ADMISSIONS OPEN 2026–27", titleTop: "Where Ambition Meets", titleHighlight: "Excellence",
          subtitle: "", description: `${biz} combines rigorous academics, expert mentors and a vibrant campus life — with a proven record of 100% board results and top ranks every year.`, image: "",
          primaryBtn: { label: "Apply for Admission", href: "/admission" }, secondaryBtn: { label: "View Results", href: "/results" },
          features: [ { icon: "graduation", title: "150+ Expert Faculty", text: "" }, { icon: "award", title: "100% Board Results", text: "" }, { icon: "book", title: "Modern Labs", text: "" }, { icon: "star", title: "Sports & Arts", text: "" } ],
          slides: [
            { titleTop: "Where Ambition Meets", titleHighlight: "Excellence", description: `${biz} nurtures academic excellence, strong values and all-round growth for Classes 6–12.`, image: "", primaryBtn: { label: "Apply for Admission", href: "/admission" }, secondaryBtn: { label: "View Results", href: "/results" } },
            { titleTop: "100% Board", titleHighlight: "Results", description: "Consistent top results with 45+ students above 90% and proud toppers every single year.", image: "", primaryBtn: { label: "View Results", href: "/results" }, secondaryBtn: { label: "About Us", href: "/about" } },
            { titleTop: "Future-Ready", titleHighlight: "Campus", description: "Smart classrooms, science, robotics and computer labs, a rich library and a full sports complex.", image: "", primaryBtn: { label: "Explore Facilities", href: "/facilities" }, secondaryBtn: { label: "Admissions", href: "/admission" } },
          ],
        } },
        { type: "stats", style: { layout: "band", background: "primary" }, content: { items: [ { value: "100%", label: "Board Pass Rate", icon: "award" }, { value: "45+", label: "Students Above 90%", icon: "trending" }, { value: "3,000+", label: "Students", icon: "users" }, { value: "22", label: "Years of Excellence", icon: "star" } ] } },
        { type: "about", style: { layout: "reverse" }, content: { eyebrow: "ABOUT US", title: "Two Decades of Shaping", titleHighlight: "Future Leaders", body: [`For over 20 years, ${biz} has helped students discover their strengths — through concept-based teaching, personal mentoring and a campus that encourages them to try everything.`, "Our goal is not just marks, but thoughtful, confident young people ready for college, careers and life."], image: "", points: ["CBSE curriculum, Classes 6–12", "Science, Commerce & Humanities", "Weekly tests & progress analytics", "Career & stream counselling", "Values, discipline & leadership", "Strong alumni network"], buttonLabel: "About the School", buttonHref: "/about" } },
        { type: "features", style: { layout: "numbered", background: "light" }, content: { items: [
          { icon: "graduation", title: "Mentors, Not Just Teachers", text: "Experienced subject experts plus a personal mentor for every student from Class 9." },
          { icon: "award", title: "Proven Board Results", text: "100% pass rate for years, with toppers scoring 98%+ in Class 10 and 12." },
          { icon: "trending", title: "Integrated JEE / NEET / CUET", text: "Entrance preparation built into the Class 11–12 timetable — no extra coaching runs." },
          { icon: "star", title: "Life Beyond Marks", text: "Sports, debates, MUNs, music, robotics clubs and community service." },
          { icon: "shield", title: "Safe, CCTV-Monitored Campus", text: "Visitor management, trained guards, female attendants on every bus and an on-campus nurse." },
          { icon: "book", title: "Weekly Tests & Analytics", text: "Chapter tests every Saturday with a parent dashboard showing scores, attendance and remarks." },
        ] } },
        { type: "serviceCategories", style: { layout: "tiles" }, content: { eyebrow: "ACADEMICS", title: "Classes &", titleHighlight: "Streams", categories: ["Secondary (Classes 6–10)", "Senior Secondary (11–12)"] } },
        { type: "toppers", style: { background: "dark" }, content: { eyebrow: "BOARD RESULTS 2026", title: "Our Proud", titleHighlight: "Toppers", items: [
          { name: "Aarav Mehta", exam: "Class 12 · Science (PCM)", score: "98.6%", rank: "1", image: "" },
          { name: "Ishita Kulkarni", exam: "Class 12 · Commerce", score: "97.8%", rank: "2", image: "" },
          { name: "Riya Choudhary", exam: "Class 10 · CBSE", score: "98.2%", rank: "1", image: "" },
          { name: "Kunal Joshi", exam: "Class 10 · CBSE", score: "97.4%", rank: "3", image: "" },
        ] } },
        { type: "visionMission", content: {
          eyebrow: "WHAT WE STAND FOR",
          visionTitle: "Our Vision", visionText: "To raise curious, capable and compassionate young Indians who lead with knowledge and integrity.",
          missionTitle: "Our Mission", missionText: "Concept-first teaching, personal mentoring and a campus full of opportunities — so every child finds the subject, sport or art they love.",
          valuesTitle: "Our Values",
          values: [
            { icon: "star", title: "Excellence", text: "High standards in every classroom and on every field." },
            { icon: "heart", title: "Respect", text: "Kindness towards classmates, teachers and community." },
            { icon: "shield", title: "Integrity", text: "Honesty in exams, sport and everyday conduct." },
          ],
        } },
        { type: "noticeBoard", style: { background: "light" }, content: { eyebrow: "STAY UPDATED", title: "Notice", titleHighlight: "Board", limit: 4, notices: [
          { date: "12 Nov", title: "Half-yearly result & PTM for Classes 6–12 on 22nd November", category: "Exam", link: "/notices", isNew: true },
          { date: "08 Nov", title: "Admissions open for 2027–28 — registration forms available online", category: "Admission", link: "/admission", isNew: true },
          { date: "01 Nov", title: "Annual Sports Meet on 6th–7th December — house trials begin", category: "Event", link: "", isNew: false },
          { date: "25 Oct", title: "Class 10 & 12 pre-board datesheet released", category: "Exam", link: "/notices", isNew: false },
        ] } },
        { type: "steps", style: { layout: "timeline" }, content: { eyebrow: "ADMISSIONS", title: "Admission in", titleHighlight: "4 Easy Steps", items: [
          { title: "Enquire", text: "Submit the online enquiry form or call the admissions desk.", icon: "edit" },
          { title: "Campus Visit", text: "Tour labs, classrooms and sports facilities with your child.", icon: "home" },
          { title: "Assessment", text: "A short aptitude test (Classes 6–9, 11) and a parent interaction.", icon: "clipboard" },
          { title: "Enroll", text: "Submit documents, pay the admission fee and collect the kit.", icon: "graduation" },
        ] } },
        { type: "countdown", style: { background: "dark" }, content: { eyebrow: "ADMISSIONS 2027–28", title: "Entrance Assessment", titleHighlight: "Countdown", subtitle: "The first assessment for Classes 6, 9 and 11 is on 17th January. Register before 10th January to book a slot.", targetDate: "2027-01-17T09:00:00", buttonLabel: "Register Now", buttonHref: "/admission" } },
        { type: "testimonials", style: { layout: "featured" }, content: { eyebrow: "WHAT THEY SAY", title: "Students &", titleHighlight: "Parents", items: [
          { name: "Ananya Singh", role: "Alumna, 2024 batch · B.Tech", text: "The integrated JEE classes meant I never had to run between school and coaching. My teachers knew exactly where I needed help, and the Saturday tests kept me honest all year.", rating: 5 },
          { name: "Mr. Prakash Deshmukh", role: "Parent of Class 10 student", text: "Excellent academics with a real focus on values and discipline. The monthly progress reports keep us fully informed.", rating: 5 },
          { name: "Rohan Patel", role: "Alumnus, 2023 batch · B.Com (Hons)", text: "Great mentors and a supportive environment. The CUET guidance in Class 12 helped me get into my dream college.", rating: 5 },
          { name: "Mrs. Lakshmi Menon", role: "Parent of Class 8 student", text: "My daughter has grown so much in confidence through debates and sports. A school that genuinely cares about the whole child.", rating: 5 },
        ] } },
        { type: "faq", style: { layout: "split", background: "light" }, content: { eyebrow: "ADMISSIONS FAQ", title: "Frequently Asked", titleHighlight: "Questions", intro: "Everything parents ask before admission. Still unsure? Call the admissions desk, Mon–Sat 9am–2pm.", items: [
          { q: "Which board is the school affiliated to?", a: "The school is affiliated to CBSE, New Delhi, and offers Classes 6 to 12." },
          { q: "Which streams are available in Class 11?", a: "Science (PCM and PCB), Commerce (with Maths or Informatics Practices) and Humanities, with a wide choice of electives." },
          { q: "Do you offer JEE / NEET preparation?", a: "Yes. Integrated JEE, NEET and CUET preparation is built into the Class 11–12 timetable at no separate coaching centre." },
          { q: "Is there an admission test?", a: "Students applying for Classes 6–9 and 11 take a short aptitude assessment followed by an interaction with parents." },
          { q: "What is the student–teacher ratio?", a: "We maintain around 1:25, with smaller groups for labs and remedial classes." },
          { q: "Is school transport available?", a: "Yes. GPS-tracked buses with female attendants cover all major routes in and around the city." },
          { q: "Is there an RTE / sibling fee concession?", a: "Yes. 25% seats in entry classes are reserved under RTE, and a second child gets a 10% tuition fee concession." },
        ] } },
        { type: "cta", style: { layout: "split" }, content: { title: "Give your child the best education", highlight: "Apply for Admission 2027–28", phones: ["9000000000"], buttonLabel: "Apply Now", buttonHref: "/admission" } },
      ],
    },
    { slug: "about", title: "About", isSystem: true, order: 1, sections: [
      { type: "about", content: { eyebrow: "ABOUT US", title: "Our Vision &", titleHighlight: "Mission", body: [`${biz} is dedicated to academic excellence, strong character and preparing students to lead in a changing world.`, "We combine rigorous academics with sports, arts and values."], image: "", points: ["Holistic development", "Safe & inclusive campus", "Experienced leadership", "Strong alumni network"], buttonLabel: "", buttonHref: "" } },
      { type: "stats", style: { layout: "minimal" }, content: { items: [ { value: "20+", label: "Years", icon: "star" }, { value: "100%", label: "Board Results", icon: "award" }, { value: "150+", label: "Faculty", icon: "graduation" }, { value: "3,000+", label: "Students", icon: "users" } ] } },
      { type: "team", style: { layout: "list", background: "light" }, content: { eyebrow: "LEADERSHIP", title: "School", titleHighlight: "Leadership", members: [
        { name: "Dr. Ramesh Iyer", role: "Principal", image: "", note: "Ph.D. Education · 25 years in CBSE schools" },
        { name: "Mrs. Sunita Khanna", role: "Vice Principal (Academics)", image: "", note: "M.A., M.Ed · Board exam coordinator" },
        { name: "Mr. Vikram Thakur", role: "Head of Sports", image: "", note: "M.P.Ed · Former state-level athlete" },
      ] } },
      { type: "cta", content: { title: "Visit our campus", highlight: "Admissions Open", phones: ["9000000000"], buttonLabel: "Apply Now", buttonHref: "/admission" } },
    ] },
    { slug: "academics", title: "Academics", isSystem: true, order: 2, sections: [
      { type: "serviceCategories", content: { eyebrow: "", title: "Classes &", titleHighlight: "Streams", categories: ["Secondary (Classes 6–10)", "Senior Secondary (11–12)"] } },
      { type: "faq", content: { eyebrow: "FAQ", title: "Academic", titleHighlight: "Questions", items: [
        { q: "Which board is the school affiliated to?", a: "The school follows the CBSE curriculum." },
        { q: "How is stream selection done in Class 11?", a: "Based on Class 10 results, aptitude and counselling with parents and students." },
        { q: "Are there remedial and doubt-clearing classes?", a: "Yes, regular remedial sessions and mentoring are part of our academic support." },
      ] } },
      { type: "cta", content: { title: "Have questions about academics?", highlight: "Talk to Us", phones: ["9000000000"], buttonLabel: "Apply Now", buttonHref: "/admission" } },
    ] },
    { slug: "faculty", title: "Faculty", isSystem: true, order: 3, sections: [
      { type: "team", content: { eyebrow: "OUR TEAM", title: "Expert", titleHighlight: "Faculty", members: [
        { name: "Dr. Ramesh Iyer", role: "Principal", image: "", note: "Ph.D. Education · 25 yrs" },
        { name: "Mr. Sanjay Gupta", role: "Physics (11–12)", image: "", note: "M.Sc · 15 yrs" },
        { name: "Mrs. Neelam Saxena", role: "Chemistry (11–12)", image: "", note: "M.Sc, B.Ed" },
        { name: "Mr. Abhishek Rao", role: "Mathematics", image: "", note: "M.Sc, B.Ed" },
        { name: "Dr. Farida Sheikh", role: "Biology", image: "", note: "Ph.D. Zoology" },
        { name: "Mrs. Kiran Bhatia", role: "Commerce", image: "", note: "M.Com, B.Ed" },
      ] } },
    ] },
    { slug: "results", title: "Results", isSystem: true, order: 4, sections: [
      { type: "stats", content: { items: [ { value: "100%", label: "Pass Rate", icon: "award" }, { value: "45+", label: "Above 90%", icon: "trending" }, { value: "12", label: "Perfect 100 in subjects", icon: "star" }, { value: "98.6%", label: "School Topper", icon: "graduation" } ] } },
      { type: "toppers", content: { eyebrow: "TOPPERS", title: "Our Proud", titleHighlight: "Achievers", items: [
        { name: "Aarav Mehta", exam: "Class 12 · Science", score: "98.6%", rank: "1", image: "" },
        { name: "Ishita Kulkarni", exam: "Class 12 · Commerce", score: "97.8%", rank: "2", image: "" },
        { name: "Riya Choudhary", exam: "Class 10 · CBSE", score: "98.2%", rank: "1", image: "" },
        { name: "Kunal Joshi", exam: "Class 10 · CBSE", score: "97.4%", rank: "3", image: "" },
      ] } },
      { type: "downloads", content: { eyebrow: "DOWNLOADS", title: "Downloads &", titleHighlight: "Prospectus", items: [
        { title: "Prospectus 2026–27", description: "Programs, streams, facilities & admission details.", link: "", icon: "book" },
        { title: "Fee Structure", description: "Class-wise fees and payment options.", link: "", icon: "tag" },
        { title: "Academic Calendar", description: "Holidays, exams and events for the year.", link: "", icon: "calendar" },
        { title: "Admission Form", description: "Offline admission form (PDF).", link: "", icon: "clipboard" },
      ] } },
      { type: "cta", content: { title: "Be our next topper", highlight: "Join Us", phones: ["9000000000"], buttonLabel: "Apply Now", buttonHref: "/admission" } },
    ] },
    { slug: "facilities", title: "Facilities", isSystem: true, order: 5, sections: [
      { type: "features", content: { items: [
        { icon: "book", title: "Science & Computer Labs", text: "Fully equipped Physics, Chemistry, Biology & IT labs." },
        { icon: "graduation", title: "Smart Classrooms", text: "Digital boards and interactive learning tools." },
        { icon: "star", title: "Sports Complex", text: "Cricket, football, basketball, athletics and indoor games." },
        { icon: "users", title: "Library & Reading Room", text: "Thousands of books, journals and digital resources." },
        { icon: "clipboard", title: "Auditorium", text: "For events, seminars and cultural programmes." },
        { icon: "truck", title: "Safe Transport", text: "GPS-tracked buses covering all major routes." },
      ] } },
      { type: "gallery", style: { layout: "masonry" }, content: { eyebrow: "", title: "Our", titleHighlight: "Campus" } },
      { type: "openingHours", style: { background: "light" }, content: { eyebrow: "VISIT US", title: "Office &", titleHighlight: "Visiting Hours", note: "Campus tours for new parents run every Saturday at 10:30am — no appointment needed.", days: [
        { day: "Monday – Friday", hours: "8:00am – 3:00pm" }, { day: "Saturday", hours: "9:00am – 1:00pm" }, { day: "Sunday", hours: "Closed" },
      ] } },
    ] },
    { slug: "contact", title: "Contact", isSystem: true, order: 6, sections: [ { type: "contactInfo", content: { eyebrow: "REACH US", title: "Get In", titleHighlight: "Touch", address: "School Road, Your City", phone: "9000000000", email: "info@example.com", hours: "Mon–Sat: 8am – 3pm", mapEmbed: "" } } ] },
    { slug: "admission", title: "Admissions", isSystem: true, order: 7, sections: [ { type: "quoteForm", content: { title: "Admission Enquiry", subtitle: "Fill the form and our admissions team will contact you with all the details.", showSidebar: true } } ] },
    { slug: "notices", title: "Notices", isSystem: true, order: 8, sections: [
      { type: "noticeBoard", content: { eyebrow: "STAY UPDATED", title: "Notices &", titleHighlight: "Circulars", notices: [
        { date: "10 Jul", title: "Class 10 & 12 Board Results declared — check the Results page", category: "Result", link: "/results", isNew: true },
        { date: "05 Jul", title: "Admissions open for 2026–27 — apply online now", category: "Admission", link: "/admission", isNew: true },
        { date: "02 Jul", title: "Half-yearly exam datesheet released", category: "Exam", link: "", isNew: true },
        { date: "28 Jun", title: "Annual Day & Prize Distribution on 20th July", category: "Event", link: "", isNew: false },
        { date: "22 Jun", title: "Parent-Teacher Meeting for all classes on 8th July", category: "Event", link: "", isNew: false },
        { date: "20 Jun", title: "School reopens on 1st July after summer break", category: "Holiday", link: "", isNew: false },
        { date: "15 Jun", title: "New bus routes added — see the transport circular", category: "News", link: "", isNew: false },
      ] } },
      { type: "downloads", content: { eyebrow: "CIRCULARS & RESULTS", title: "Download", titleHighlight: "Circulars", items: [
        { title: "Board Result Analysis", description: "Class 10 & 12 result highlights (PDF).", link: "", icon: "award" },
        { title: "Exam Datesheet", description: "Half-yearly examination schedule.", link: "", icon: "calendar" },
        { title: "Fee Circular", description: "Updated fee structure & due dates.", link: "", icon: "tag" },
        { title: "Transport Circular", description: "Bus routes and timings.", link: "", icon: "clipboard" },
      ] } },
    ] },
  ],
};
