import type { TemplateDef } from "./types";

// Computer & IT Institute (basic computer, Tally/GST, Excel, coding, web dev, data analytics, CCC/DCA):
// electric violet + cyan on near-black, techy and career-focused — conversion via admission enquiry.
export const computerInstitute: TemplateDef = {
  theme: {
    colors: { primary: "#8b5cf6", primaryDark: "#6d28d9", secondary: "#1e1b4b", accent: "#06b6d4", dark: "#110e1d", light: "#f5f3ff", text: "#3f3d56", heading: "#18142e" },
    font: "Hanken Grotesk", radius: "0.25rem",
  },
  header: (biz) => ({
    design: "classic",
    logoText: biz, logoImage: "",
    announcement: { show: true, text: "Admissions open · Full Stack & Data Analytics batches with 100% placement assistance", link: "/admission" },
    topbar: { show: false, address: "Your City", phones: ["9000000000"], email: "hello@example.com", social: { facebook: "#", instagram: "#", whatsapp: "#" } },
    nav: [
      { label: "Home", href: "/" }, { label: "Courses", href: "/courses" }, { label: "Placements", href: "/placements" }, { label: "Fees", href: "/fees" },
      { label: "Faculty", href: "/faculty" }, { label: "About", href: "/about" }, { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Enquire Now", href: "/admission" },
  }),
  footer: (biz) => ({
    design: "classic",
    about: `${biz} — job-ready computer education from basic computer and Tally to full stack development and data analytics.`,
    columns: [
      { title: "Courses", links: [ { label: "Basic Computer & CCC", href: "/courses" }, { label: "Tally & Accounting", href: "/courses" }, { label: "Programming", href: "/courses" }, { label: "Data Analytics", href: "/courses" } ] },
      { title: "Institute", links: [ { label: "Placements", href: "/placements" }, { label: "Fees", href: "/fees" }, { label: "Faculty", href: "/faculty" }, { label: "Admission", href: "/admission" }, { label: "Contact", href: "/contact" } ] },
    ],
    serviceAreas: ["CCC", "DCA / ADCA", "Tally Prime + GST", "Advanced Excel", "Python", "Full Stack Web", "Data Analytics", "Power BI"],
    contact: { phones: ["9000000000"], email: "hello@example.com", address: "Your City" },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. Learn. Build. Get hired.`,
  }),
  seo: (biz) => ({
    title: `${biz} — Computer Courses, Tally, Excel, Coding & Data Analytics`,
    description: "Computer training institute offering CCC, DCA/ADCA, Tally Prime with GST, Advanced Excel, Python, Java, full stack web development and data analytics. Practical labs, certificates and placement assistance.",
    favicon: "", ogImage: "",
    keywords: "computer institute near me, computer course, tally gst course, advanced excel course, python classes, web development course, data analytics course, ccc course, dca course",
    businessType: "EducationalOrganization", priceRange: "₹₹",
  }),
  services: [
    { category: "Computer Basics", title: "Basic Computer & Internet", description: "Windows, typing, MS Word, PowerPoint, email and safe internet use — for absolute beginners." },
    { category: "Computer Basics", title: "CCC (NIELIT)", description: "Course on Computer Concepts — exam-oriented prep for the government-recognised certificate." },
    { category: "Computer Basics", title: "DCA / ADCA Diploma", description: "6 and 12-month diplomas covering office tools, accounting, DTP and programming basics." },
    { category: "Office & Accounting", title: "Tally Prime with GST", description: "Vouchers, inventory, payroll, GST returns and e-way bills on live business data." },
    { category: "Office & Accounting", title: "Advanced Excel & MIS", description: "Formulas, Pivot Tables, XLOOKUP, dashboards and automation for office jobs." },
    { category: "Office & Accounting", title: "Graphic Design & DTP", description: "Photoshop, CorelDRAW and Canva for print, social media and small business." },
    { category: "Programming", title: "C, C++ & Java", description: "Programming fundamentals, OOP and DSA for school, college and placement exams." },
    { category: "Programming", title: "Python Programming", description: "From basics to automation scripts and mini projects — the most in-demand first language." },
    { category: "Programming", title: "Full Stack Web Development", description: "HTML, CSS, JavaScript, React, Node.js and MongoDB with a live portfolio project." },
    { category: "Data & Analytics", title: "Data Analytics", description: "Excel, SQL, Python (Pandas) and Power BI with real datasets and case studies." },
    { category: "Data & Analytics", title: "Power BI & SQL", description: "Short, job-focused course on querying databases and building business dashboards." },
  ],
  gallery: [
    "Main computer lab", "Coding bootcamp in action", "Tally & GST practical", "Project demo day", "Placement drive", "Certificate distribution", "One-on-one doubt session", "Hackathon weekend",
  ].map((caption) => ({ category: "Our Campus", caption })),
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "minimal", customHtml: "",
          badge: "CCC · DCA · TALLY · EXCEL · PYTHON · WEB DEV · DATA ANALYTICS", titleTop: "Skills That Get You", titleHighlight: "Hired.",
          subtitle: "", description: `${biz} teaches computers the practical way — one student per system, real projects, industry trainers and placement support. From your first mouse click to your first developer job.`, image: "",
          primaryBtn: { label: "Enquire for Admission", href: "/admission" }, secondaryBtn: { label: "Browse Courses", href: "/courses" },
          features: [ { icon: "grid", title: "1 Student · 1 System", text: "" }, { icon: "award", title: "Certified Courses", text: "" }, { icon: "handshake", title: "Placement Support", text: "" }, { icon: "clock", title: "Flexible Batches", text: "" } ],
        } },
        { type: "serviceCategories", content: { eyebrow: "COURSES", title: "Four Tracks.", titleHighlight: "One Career.", categories: ["Computer Basics", "Office & Accounting", "Programming", "Data & Analytics"] }, style: { background: "light", cardRadius: "md", cardShadow: "none", cardBorderWidth: 1, cardBorderColor: "#ddd6fe" } },
        { type: "about", content: { eyebrow: "WHY US", title: "Not Theory.", titleHighlight: "Practice.", body: [`At ${biz}, 80% of class time is spent on the keyboard. You'll build invoices in Tally, dashboards in Excel and full web apps in React — not just read about them.`, "Small batches, industry-experienced trainers and an open lab mean you never get stuck alone."], image: "", points: ["Open lab 8 AM – 9 PM for practice", "Live projects & portfolio", "Resume + mock interview prep", "Weekend batches for working people", "EMI & scholarship options"], buttonLabel: "Learn About Us", buttonHref: "/about" }, style: { layout: "reverse", align: "left" } },
        { type: "toppers", style: { background: "dark" }, content: { eyebrow: "PLACED", title: "Recent", titleHighlight: "Success Stories", items: [
          { name: "Rahul Kushwaha", exam: "Full Stack · Web Developer", score: "₹5.4 LPA", rank: "1", image: "" },
          { name: "Priya Saxena", exam: "Data Analytics · MIS Analyst", score: "₹4.8 LPA", rank: "2", image: "" },
          { name: "Imran Ali", exam: "Python · Junior Developer", score: "₹4.2 LPA", rank: "3", image: "" },
          { name: "Komal Jain", exam: "Tally + GST · Accounts Executive", score: "₹2.6 LPA", rank: "4", image: "" },
        ] } },
        { type: "logos", content: { title: "Where our students work", items: ["IT Services Firms", "CA & Tax Firms", "E-commerce Startups", "Banks & NBFCs", "BPO / KPO", "Digital Agencies", "Retail Chains", "Manufacturing MSMEs"] } },
        { type: "stats", style: { layout: "cards" }, content: { items: [ { value: "12,000+", label: "Students Certified", icon: "graduation" }, { value: "850+", label: "Placements", icon: "handshake" }, { value: "60", label: "Lab Systems", icon: "grid" }, { value: "₹4.2 LPA", label: "Avg. Fresher Package", icon: "trending" } ] } },
        { type: "steps", style: { layout: "cards", background: "light" }, content: { eyebrow: "YOUR JOURNEY", title: "Learn →", titleHighlight: "Build → Get Hired", items: [
          { title: "Free Counselling", text: "We match a course to your goal and current skills", icon: "headset" },
          { title: "Hands-On Classes", text: "Daily practicals on your own system", icon: "grid" },
          { title: "Real Projects", text: "Build a portfolio employers can actually see", icon: "package" },
          { title: "Certificate & Placement", text: "Mock interviews and referrals to hiring partners", icon: "award" },
        ] } },
        { type: "features", style: { layout: "minimal" }, content: { items: [
          { icon: "grid", title: "Excel, SQL & Power BI", text: "Pivot tables to live dashboards — the toolkit every MIS and analyst role asks for." },
          { icon: "zap", title: "React & Node.js", text: "Build and deploy a full web app with login, payments and a database." },
          { icon: "tag", title: "Tally Prime + GST", text: "Vouchers, inventory, payroll and GSTR filing on real business data." },
          { icon: "bolt", title: "Python Automation", text: "Scripts that rename files, send emails and clean spreadsheets in seconds." },
        ] } },
        { type: "testimonials", content: { eyebrow: "REVIEWS", title: "Heard in", titleHighlight: "Our Lab", items: [
          { name: "Rahul Kushwaha", role: "B.Com → Web Developer", text: "I came from a commerce background with zero coding. Six months later I had three live projects on GitHub and an offer letter. The trainers stayed back every evening to help.", rating: 5 },
          { name: "Komal Jain", role: "Accounts Executive", text: "The Tally + GST course used real company data. I filed GSTR-1 and GSTR-3B confidently from my first week at work.", rating: 5 },
          { name: "Ramesh Bhatt", role: "Shop owner · Basic Computer", text: "At 48 I was scared of computers. Now I manage my shop's billing and send emails myself. Very patient teachers.", rating: 5 },
        ] }, style: { background: "primary", cardRadius: "md" } },
        { type: "team", style: { layout: "list" }, content: { eyebrow: "TRAINERS", title: "Learn From People Who", titleHighlight: "Ship Code", members: [
          { name: "Mr. Nitin Sharma", role: "Full Stack Lead", image: "", note: "8 yrs as a product developer" },
          { name: "Ms. Pooja Agarwal", role: "Data Analytics Trainer", image: "", note: "Ex-MIS manager · Power BI specialist" },
          { name: "Mr. Anil Gupta", role: "Tally & GST Trainer", image: "", note: "Practising accountant · 15 yrs" },
        ] } },
        { type: "countdown", content: { eyebrow: "NEXT CAREER BATCH", title: "Full Stack & Data Analytics", titleHighlight: "Batch Starts", subtitle: "6-month career programs with projects and placement support. Only 20 seats per batch — early-bird fee till 31st December.", targetDate: "2027-01-04T10:00:00", buttonLabel: "Reserve a Seat", buttonHref: "/admission" } },
        { type: "faq", style: { background: "light" }, content: { eyebrow: "FAQ", title: "Before You", titleHighlight: "Join", items: [
          { q: "Do I need any computer knowledge to join?", a: "No. Our Basic Computer course starts from zero. For coding and analytics, we run a free foundation week first." },
          { q: "Are your certificates recognised?", a: "CCC is conducted by NIELIT, Tally has its own official certification exam, and all our courses come with an institute certificate verifiable online." },
          { q: "Do you provide placement?", a: "We provide 100% placement assistance — resume building, mock interviews and referrals to our hiring partners. Final selection depends on your performance." },
          { q: "Can I pay fees in instalments?", a: "Yes. Most courses can be paid in 2–4 monthly instalments, and no-cost EMI is available on longer programs." },
          { q: "Do I need my own laptop?", a: "No. Every student gets a dedicated lab system. A laptop helps for home practice in coding courses, but it is not required." },
          { q: "Do you have weekend or online batches?", a: "Yes, we run weekend and live online batches for college students and working professionals." },
        ] } },
        { type: "cta", style: { layout: "minimal" }, content: { title: "One counselling call can change your career.", highlight: "Enquire for Admission", phones: ["9000000000"], buttonLabel: "Enquire Now", buttonHref: "/admission" } },
      ],
    },
    { slug: "courses", title: "Courses", isSystem: true, order: 1, sections: [
      { type: "banner", content: { title: "All", titleHighlight: "Courses", subtitle: "From basic computer to full stack — pick a track and start this month.", image: "", bgColor: "#1e1b4b", imageOpacity: 30, overlayOpacity: 80 } },
      { type: "serviceCategories", content: { eyebrow: "", title: "Explore by", titleHighlight: "Track", categories: ["Computer Basics", "Office & Accounting", "Programming", "Data & Analytics"] } },
      { type: "features", content: { items: [
        { icon: "clock", title: "Short-Term (1–3 months)", text: "Basic Computer, CCC, Tally, Advanced Excel, Python, Power BI." },
        { icon: "graduation", title: "Diplomas (6–12 months)", text: "DCA, ADCA and Diploma in Software Development." },
        { icon: "zap", title: "Career Programs (6 months)", text: "Full Stack Web Development and Data Analytics with placement." },
      ] }, style: { background: "light", cardShadow: "sm", cardRadius: "md" } },
      { type: "downloads", content: { eyebrow: "SYLLABUS", title: "Download", titleHighlight: "Course Brochures", items: [
        { title: "Full Stack Syllabus", description: "Module-wise plan with projects and tech stack.", link: "", icon: "book" },
        { title: "Data Analytics Syllabus", description: "Excel, SQL, Python and Power BI curriculum.", link: "", icon: "book" },
        { title: "DCA / ADCA Syllabus", description: "Semester-wise subjects and exam pattern.", link: "", icon: "clipboard" },
      ] } },
      { type: "cta", content: { title: "Confused between courses?", highlight: "Get Free Career Counselling", phones: ["9000000000"], buttonLabel: "Enquire Now", buttonHref: "/admission" } },
    ] },
    { slug: "placements", title: "Placements", isSystem: true, order: 2, sections: [
      { type: "stats", content: { items: [ { value: "850+", label: "Students Placed", icon: "handshake" }, { value: "120+", label: "Hiring Partners", icon: "store" }, { value: "₹9 LPA", label: "Highest Package", icon: "trending" }, { value: "92%", label: "Career-Track Placement", icon: "award" } ] }, style: { background: "dark" } },
      { type: "toppers", content: { eyebrow: "WALL OF FAME", title: "Our", titleHighlight: "Placed Students", items: [
        { name: "Rahul Kushwaha", exam: "Web Developer", score: "₹5.4 LPA", rank: "1", image: "" },
        { name: "Priya Saxena", exam: "MIS Analyst", score: "₹4.8 LPA", rank: "2", image: "" },
        { name: "Imran Ali", exam: "Junior Python Developer", score: "₹4.2 LPA", rank: "3", image: "" },
        { name: "Deepika Rawat", exam: "Data Analyst", score: "₹4.5 LPA", rank: "4", image: "" },
        { name: "Komal Jain", exam: "Accounts Executive", score: "₹2.6 LPA", rank: "5", image: "" },
        { name: "Sachin Pandey", exam: "Front-end Developer", score: "₹4.0 LPA", rank: "6", image: "" },
      ] } },
      { type: "logos", content: { title: "Hiring partners", items: ["IT Services Firms", "CA & Tax Firms", "E-commerce Startups", "Banks & NBFCs", "BPO / KPO", "Digital Agencies", "Retail Chains", "Manufacturing MSMEs"] }, style: { background: "light" } },
      { type: "steps", content: { eyebrow: "PLACEMENT CELL", title: "How We Help You", titleHighlight: "Get Hired", items: [
        { title: "Resume & LinkedIn", text: "ATS-friendly resume and a profile recruiters notice", icon: "edit" },
        { title: "Mock Interviews", text: "Technical and HR rounds with feedback", icon: "users" },
        { title: "Referrals & Drives", text: "Monthly placement drives and direct referrals", icon: "handshake" },
      ] } },
      { type: "cta", content: { title: "Your name could be next on this wall.", highlight: "Join a Career Program", phones: ["9000000000"], buttonLabel: "Enquire Now", buttonHref: "/admission" } },
    ] },
    { slug: "fees", title: "Fees", isSystem: true, order: 3, sections: [
      { type: "pricingPlans", content: { eyebrow: "CAREER PROGRAMS", title: "Invest in", titleHighlight: "Your Career", plans: [
        { name: "Tally + GST + Excel", price: "₹9,999", period: "3 months", features: ["Tally Prime certification", "GST returns practice", "Advanced Excel & MIS", "Job assistance"], featured: false, buttonLabel: "Enquire", buttonHref: "/admission" },
        { name: "Full Stack Web Dev", price: "₹34,999", period: "6 months", features: ["HTML to React & Node.js", "3 portfolio projects", "Git & deployment", "100% placement assistance", "No-cost EMI"], featured: true, buttonLabel: "Enquire", buttonHref: "/admission" },
        { name: "Data Analytics", price: "₹29,999", period: "5 months", features: ["Excel, SQL, Python", "Power BI dashboards", "Capstone case study", "Placement assistance"], featured: false, buttonLabel: "Enquire", buttonHref: "/admission" },
      ] } },
      { type: "priceList", content: { eyebrow: "SHORT COURSES", title: "Course", titleHighlight: "Fees", note: "Includes study material, lab access and institute certificate. Exam fees (NIELIT etc.) extra.", groups: [
        { category: "Computer Basics", items: [ { name: "Basic Computer & Internet (2 months)", price: "₹3,000", note: "" }, { name: "CCC (3 months)", price: "₹3,500", note: "" }, { name: "DCA (6 months)", price: "₹8,000", note: "" }, { name: "ADCA (12 months)", price: "₹14,000", note: "" } ] },
        { category: "Office & Programming", items: [ { name: "Advanced Excel (1.5 months)", price: "₹4,500", note: "" }, { name: "Graphic Design (3 months)", price: "₹9,000", note: "" }, { name: "C / C++ (2 months)", price: "₹5,000", note: "" }, { name: "Python (2 months)", price: "₹7,500", note: "" }, { name: "Power BI & SQL (6 weeks)", price: "₹8,500", note: "" } ] },
      ] }, style: { background: "light" } },
      { type: "openingHours", content: { eyebrow: "BATCHES", title: "Batch", titleHighlight: "Timings", note: "New batches start on the 1st and 15th of every month.", days: [
        { day: "Morning", hours: "8:00 AM – 12:00 PM" },
        { day: "Afternoon", hours: "12:00 PM – 4:00 PM" },
        { day: "Evening", hours: "5:00 PM – 9:00 PM" },
        { day: "Weekend (Sat–Sun)", hours: "10:00 AM – 5:00 PM" },
      ] } },
      { type: "cta", content: { title: "Ask about scholarships & EMI", highlight: "Talk to a Counsellor", phones: ["9000000000"], buttonLabel: "Enquire Now", buttonHref: "/admission" } },
    ] },
    { slug: "faculty", title: "Faculty", isSystem: true, order: 4, sections: [
      { type: "team", content: { eyebrow: "TRAINERS", title: "Industry", titleHighlight: "Experts", members: [
        { name: "Mr. Saurabh Tripathi", role: "Director · Full Stack Lead", image: "", note: "Ex-software engineer · 13 yrs" },
        { name: "Ms. Nidhi Chawla", role: "Data Analytics Trainer", image: "", note: "Power BI certified · 8 yrs" },
        { name: "CA Manish Goyal", role: "Tally & GST Faculty", image: "", note: "Chartered Accountant · 10 yrs" },
        { name: "Mr. Anil Prajapati", role: "Python & Java Trainer", image: "", note: "M.Tech CSE · 9 yrs" },
        { name: "Ms. Swati Mishra", role: "Basic Computer & CCC", image: "", note: "MCA · 7 yrs" },
        { name: "Mr. Varun Sethi", role: "Graphic Design Mentor", image: "", note: "Freelance designer · 6 yrs" },
      ] }, style: { cardRadius: "sm", cardShadow: "none", cardBorderWidth: 1, cardBorderColor: "#ddd6fe" } },
      { type: "features", content: { items: [
        { icon: "user-check", title: "Industry-Experienced", text: "Every trainer has worked in the field they teach." },
        { icon: "headset", title: "Doubt Sessions Daily", text: "Dedicated doubt-clearing hour after each batch." },
        { icon: "users", title: "Mentor for Every Student", text: "A named mentor tracks your progress and projects." },
      ] }, style: { background: "light" } },
      { type: "cta", content: { title: "Meet your trainer before you enrol", highlight: "Attend a Free Demo", phones: ["9000000000"], buttonLabel: "Enquire Now", buttonHref: "/admission" } },
    ] },
    { slug: "about", title: "About", isSystem: true, order: 5, sections: [
      { type: "banner", content: { title: "About", titleHighlight: biz, subtitle: "Making every student computer-confident and job-ready.", image: "", bgColor: "#1e1b4b", imageOpacity: 30, overlayOpacity: 80 } },
      { type: "about", content: { eyebrow: "OUR STORY", title: "From One Lab to", titleHighlight: "Thousands of Careers", body: [`${biz} started in 2011 with 10 computers and one goal: affordable, practical computer education for students, homemakers and job seekers in our city.`, "Today we run a 60-system lab, teach everything from CCC to React, and our alumni work in IT companies, CA firms and startups across India."], image: "", points: ["Authorised CCC & Tally training", "60 modern lab systems", "Air-conditioned, Wi-Fi campus", "Girls' scholarship program"], buttonLabel: "View Placements", buttonHref: "/placements" } },
      { type: "gallery", style: { layout: "masonry" }, content: { eyebrow: "CAMPUS", title: "Life at", titleHighlight: "the Institute" } },
      { type: "cta", content: { title: "Come see our lab", highlight: "Book a Campus Visit", phones: ["9000000000"], buttonLabel: "Enquire Now", buttonHref: "/admission" } },
    ] },
    { slug: "admission", title: "Admission Enquiry", isSystem: true, order: 6, sections: [
      { type: "quoteForm", content: { title: "Admission Enquiry", subtitle: "Tell us the course you're interested in and your preferred batch — a counsellor will call you within 24 hours.", showSidebar: true } },
      { type: "steps", content: { eyebrow: "ADMISSION", title: "Join in", titleHighlight: "3 Steps", items: [
        { title: "Counselling", text: "Free call or visit to pick the right course", icon: "headset" },
        { title: "Demo Class", text: "Attend one class before you pay", icon: "grid" },
        { title: "Enrol", text: "Submit ID, photo and first instalment", icon: "check" },
      ] }, style: { background: "light" } },
      { type: "faq", content: { eyebrow: "", title: "Admission", titleHighlight: "FAQs", items: [
        { q: "What documents are needed?", a: "Aadhaar card, two passport-size photos and your latest marksheet." },
        { q: "Is there a registration fee?", a: "A one-time ₹500 registration fee, adjusted against your course fee." },
        { q: "Can I get a refund?", a: "Full refund if you cancel within 7 days of joining." },
      ] } },
    ] },
    { slug: "contact", title: "Contact", isSystem: true, order: 7, sections: [
      { type: "contactInfo", content: { eyebrow: "CONTACT", title: "Reach", titleHighlight: "Us", address: "Your City", phone: "9000000000", email: "hello@example.com", hours: "Mon–Sat 8:00 AM – 9:00 PM · Sun 10:00 AM – 5:00 PM", mapEmbed: "" } },
      { type: "map", content: { eyebrow: "", title: "Visit", titleHighlight: "Our Campus", address: "Your City", mapEmbed: "" } },
      { type: "contactForm", content: { title: "Send a Message", subtitle: "Questions about courses, fees or placements? We'll get back to you today." } },
    ] },
  ],
};
