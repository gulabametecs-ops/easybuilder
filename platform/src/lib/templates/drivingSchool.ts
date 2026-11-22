import type { TemplateDef } from "./types";

// Driving School (car & two-wheeler training, RTO licence help, refresher, women-only batches):
// road-sign yellow on asphalt black, bold and confident — conversion via "book a slot".
export const drivingSchool: TemplateDef = {
  theme: {
    colors: { primary: "#eab308", primaryDark: "#a16207", secondary: "#1c1917", accent: "#dc2626", dark: "#171412", light: "#fefce8", text: "#44403c", heading: "#0c0a09" },
    font: "Archivo", radius: "0.375rem",
  },
  header: (biz) => ({
    design: "bold",
    logoText: biz, logoImage: "",
    announcement: { show: true, text: "Licence + training package from ₹5,999 · Women-only batches with lady instructors now open", link: "/book-slot" },
    topbar: { show: true, address: "Car · Two-Wheeler · RTO Licence Help · Pick-up & Drop", phones: ["9000000000"], email: "hello@example.com", social: { facebook: "#", instagram: "#", whatsapp: "#" } },
    nav: [
      { label: "Home", href: "/" }, { label: "Courses", href: "/courses" }, { label: "Licence Help", href: "/licence" }, { label: "Fees", href: "/fees" },
      { label: "Women's Batch", href: "/women-batch" }, { label: "About", href: "/about" }, { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Book a Slot", href: "/book-slot" },
  }),
  footer: (biz) => ({
    design: "minimal",
    about: `${biz} is a government-approved motor driving school offering dual-control car training, two-wheeler lessons, refresher courses and complete RTO licence assistance.`,
    columns: [
      { title: "Learn", links: [ { label: "Car Driving", href: "/courses" }, { label: "Two-Wheeler", href: "/courses" }, { label: "Refresher Course", href: "/courses" }, { label: "Women-Only Batch", href: "/women-batch" } ] },
      { title: "School", links: [ { label: "About Us", href: "/about" }, { label: "Licence Help", href: "/licence" }, { label: "Fees & Packages", href: "/fees" }, { label: "Book a Slot", href: "/book-slot" }, { label: "Contact", href: "/contact" } ] },
    ],
    serviceAreas: ["Learner's Licence", "Permanent Licence", "Manual Car", "Automatic Car", "Scooty & Bike", "Highway Driving", "Night Driving"],
    contact: { phones: ["9000000000"], email: "hello@example.com", address: "Your City" },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. Drive safe, drive smart.`,
  }),
  seo: (biz) => ({
    title: `${biz} — Car & Two-Wheeler Driving School with RTO Licence Help`,
    description: "Learn car and scooty driving with patient, certified instructors in dual-control cars. Learner's & permanent licence assistance, refresher courses, women-only batches and free home pick-up. Packages from ₹4,499.",
    favicon: "", ogImage: "",
    keywords: "driving school near me, car driving classes, scooty driving classes, driving licence help, rto licence, ladies driving school, refresher driving course",
    businessType: "DrivingSchool", priceRange: "₹₹",
  }),
  services: [
    { category: "Car Training", title: "Beginner Car Course (Manual)", description: "15–21 day course in dual-control cars — clutch control, gears, traffic and parking." },
    { category: "Car Training", title: "Automatic Car Course", description: "Easy-to-learn automatic training for city driving without clutch stress." },
    { category: "Car Training", title: "Refresher Course", description: "For licence holders who haven't driven in a while — rebuild confidence in 7–10 days." },
    { category: "Car Training", title: "Highway & Night Driving", description: "Overtaking, lane discipline and low-light driving with an expert beside you." },
    { category: "Two-Wheeler", title: "Scooty / Gearless Training", description: "Balance, braking and city traffic — perfect for first-time riders." },
    { category: "Two-Wheeler", title: "Motorcycle (Geared) Training", description: "Clutch, gear shifts and safe riding technique on 100–150cc bikes." },
    { category: "Licence & RTO", title: "Learner's Licence Assistance", description: "Online application, document check, slot booking and LL test preparation." },
    { category: "Licence & RTO", title: "Permanent Licence & Driving Test", description: "Test-day car, route practice and complete RTO support until you pass." },
    { category: "Licence & RTO", title: "Licence Renewal & Address Change", description: "Hassle-free help with renewals, duplicates and updates on Parivahan." },
    { category: "Special Batches", title: "Women-Only Batch", description: "Lady instructors, flexible daytime slots and free home pick-up." },
    { category: "Special Batches", title: "Senior Citizen & Nervous Drivers", description: "Extra-patient, slower-paced lessons in quiet areas first." },
  ],
  gallery: [
    "Dual-control training car", "Parking practice ground", "Scooty training session", "Women's batch with lady instructor", "Highway driving lesson", "Theory & road-signs class", "Licence day smiles", "Our training fleet",
  ].map((caption) => ({ category: "Our School", caption })),
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "split", customHtml: "",
          badge: "GOVT. APPROVED · DUAL-CONTROL CARS · FREE PICK-UP", titleTop: "Learn to Drive Without Fear.", titleHighlight: "Get Your Licence Without Hassle.",
          subtitle: "", description: `${biz} turns nervous beginners into confident drivers in as little as 15 days. Patient instructors, dual-control cars, two-wheeler training and full RTO licence help — all in one place.`, image: "",
          primaryBtn: { label: "Book a Slot", href: "/book-slot" }, secondaryBtn: { label: "See Packages", href: "/fees" },
          features: [ { icon: "shield", title: "Dual-Control Cars", text: "" }, { icon: "check", title: "Lady Instructors", text: "" }, { icon: "truck", title: "Home Pick-up", text: "" }, { icon: "award", title: "RTO Licence Help", text: "" } ],
        } },
        { type: "features", style: { layout: "numbered" }, content: { items: [
          { icon: "shield", title: "Safety First", text: "Every car has an instructor brake and clutch — you're never alone at the wheel." },
          { icon: "check", title: "Calm, Certified Instructors", text: "Transport-department certified trainers who never shout and always explain." },
          { icon: "clock", title: "Choose Your Time", text: "Slots from 6 AM to 8 PM, seven days a week — 30 or 60 minutes a day." },
          { icon: "map", title: "Real Roads, Real Traffic", text: "Start on an empty ground, graduate to market roads, flyovers and highways." },
          { icon: "truck", title: "Free Pick-up & Drop", text: "We pick you up from home, college or office within a 5 km radius." },
          { icon: "book", title: "Theory & Road Signs", text: "Traffic rules, road signs and LL test practice included in every course." },
        ] } },
        { type: "pricingPlans", style: { background: "light" }, content: { eyebrow: "PACKAGES", title: "Simple,", titleHighlight: "All-Inclusive Pricing", plans: [
          { name: "Scooty Starter", price: "₹2,499", period: "10 days", features: ["10 sessions × 30 min", "Gearless scooty provided", "Traffic rules class", "Practice in safe zone first"], featured: false, buttonLabel: "Book Now", buttonHref: "/book-slot" },
          { name: "Car + Licence", price: "₹5,999", period: "21 days", features: ["21 sessions × 30 min", "Dual-control manual car", "Learner's + permanent licence help", "RTO test-day car", "Free home pick-up"], featured: true, buttonLabel: "Most Popular", buttonHref: "/book-slot" },
          { name: "Refresher", price: "₹3,499", period: "10 days", features: ["10 sessions × 45 min", "Your car or ours", "Highway & parking focus", "Flexible timings"], featured: false, buttonLabel: "Book Now", buttonHref: "/book-slot" },
        ] } },
        { type: "stats", style: { layout: "band", background: "primary" }, content: { items: [ { value: "15,000+", label: "Licensed Drivers", icon: "users" }, { value: "98%", label: "First-Attempt Pass Rate", icon: "award" }, { value: "20+", label: "Training Vehicles", icon: "truck" }, { value: "18 yrs", label: "On the Road", icon: "trending" } ] } },
        { type: "serviceCategories", style: { layout: "list" }, content: { eyebrow: "WHAT WE OFFER", title: "Pick Your", titleHighlight: "Lane", categories: ["Car Training", "Two-Wheeler", "Licence & RTO", "Special Batches"] } },
        { type: "imageBanner", content: { title: "Women-Only Batches With Lady Instructors", subtitle: "Learn in a comfortable, judgement-free space — daytime slots, home pick-up and a 100% female training team.", buttonLabel: "Explore Women's Batch", buttonHref: "/women-batch", image: "" } },
        { type: "steps", style: { layout: "timeline", background: "dark" }, content: { eyebrow: "ROAD MAP", title: "Zero to", titleHighlight: "Licensed Driver", items: [
          { title: "Book & Apply for LL", text: "We file your learner's licence online on day one", icon: "clipboard" },
          { title: "Ground Practice", text: "Steering, clutch and braking in an open area", icon: "map" },
          { title: "City Traffic", text: "Signals, roundabouts, parking and reversing", icon: "truck" },
          { title: "Highway Day", text: "One supervised highway run before your test", icon: "zap" },
          { title: "Pass the RTO Test", text: "Route practice and our car on test day", icon: "award" },
        ] } },
        { type: "testimonials", style: { layout: "minimal" }, content: { eyebrow: "REVIEWS", title: "They Were Nervous Too.", titleHighlight: "Now They Drive.", items: [
          { name: "Neha Gupta", role: "Homemaker · Women's Batch", text: "I was terrified of traffic. Sunita ma'am was so patient — in three weeks I was driving my kids to school myself. The home pick-up made it so easy.", rating: 5 },
          { name: "Aman Verma", role: "College student · Car + Licence", text: "They handled everything — LL, slot booking, even the car on test day. Passed the RTO test on my first attempt.", rating: 5 },
          { name: "Suresh Pillai", role: "Refresher course · Age 52", text: "Hadn't driven in 12 years. Ten days of refresher and highway practice and my confidence is fully back.", rating: 5 },
        ] } },
        { type: "team", style: { layout: "list", background: "light" }, content: { eyebrow: "INSTRUCTORS", title: "Your Co-Pilots on", titleHighlight: "Every Lesson", members: [
          { name: "Mr. Gurmeet Singh", role: "Chief Instructor", image: "", note: "22 yrs · 6,000+ students trained" },
          { name: "Mrs. Sunita Patil", role: "Lady Instructor · Car", image: "", note: "Women's batch lead · 9 yrs" },
          { name: "Mr. Ramesh Yadav", role: "Highway & Refresher Coach", image: "", note: "Ex-transport driver · 15 yrs" },
          { name: "Ms. Kiran Joshi", role: "Two-Wheeler Instructor", image: "", note: "Scooty & bike · 6 yrs" },
        ] } },
        { type: "downloads", content: { eyebrow: "BEFORE YOU START", title: "Licence", titleHighlight: "Checklists", items: [
          { title: "Learner's Licence Documents", description: "Aadhaar, age & address proof, photos — what to keep ready.", link: "", icon: "clipboard" },
          { title: "Road Signs Chart", description: "All mandatory, cautionary and informatory signs for the LL test.", link: "", icon: "map" },
          { title: "LL Test Practice Questions", description: "100 most-asked questions with answers.", link: "", icon: "book" },
        ] } },
        { type: "openingHours", style: { background: "light" }, content: { eyebrow: "TRAINING HOURS", title: "Open", titleHighlight: "7 Days a Week", note: "Office open 9 AM – 7 PM for licence enquiries and admissions.", days: [
          { day: "Monday – Saturday", hours: "6:00 AM – 8:00 PM" },
          { day: "Sunday", hours: "6:00 AM – 1:00 PM" },
          { day: "Women's Batch", hours: "10:00 AM – 4:00 PM daily" },
        ] } },
        { type: "faq", style: { layout: "split" }, content: { eyebrow: "FAQ", title: "Common", titleHighlight: "Questions", intro: "Everything first-time drivers ask us. For licence status questions, WhatsApp your application number to our office.", items: [
          { q: "How many days does it take to learn car driving?", a: "Most beginners are road-ready in 15–21 days of 30-minute daily sessions. Nervous learners can add extra sessions anytime." },
          { q: "Do you help with the driving licence?", a: "Yes. We apply for your learner's licence, prepare you for the LL test, book the permanent licence test and provide our car on test day." },
          { q: "What documents do I need?", a: "Aadhaar card, age proof, address proof and passport-size photos. We'll check everything before applying." },
          { q: "Can I learn without a learner's licence?", a: "You need a valid learner's licence to drive on public roads. We'll help you get it in the first week and start ground practice meanwhile." },
          { q: "When can I take the permanent licence test?", a: "After 30 days from the date your learner's licence is issued. Most students finish training in this window." },
          { q: "Do you train on automatic cars?", a: "Yes, we have both manual and automatic dual-control cars." },
        ] } },
        { type: "cta", style: { layout: "split" }, content: { title: "Your first lesson is just a call away.", highlight: "Book a Driving Slot Today", phones: ["9000000000"], buttonLabel: "Book a Slot", buttonHref: "/book-slot" } },
      ],
    },
    { slug: "courses", title: "Courses", isSystem: true, order: 1, sections: [
      { type: "banner", content: { title: "Driving", titleHighlight: "Courses", subtitle: "Car, two-wheeler, refresher and special batches for every learner.", image: "", bgColor: "#171412", imageOpacity: 40, overlayOpacity: 70 } },
      { type: "serviceCategories", content: { eyebrow: "ALL COURSES", title: "Find the Right", titleHighlight: "Course", categories: ["Car Training", "Two-Wheeler", "Special Batches"] } },
      { type: "features", content: { items: [
        { icon: "check", title: "Manual & Automatic", text: "Learn on a hatchback, then try a sedan before you buy." },
        { icon: "map", title: "Route Variety", text: "Market roads, flyovers, ghats and highways — not just one loop." },
        { icon: "clipboard", title: "Progress Card", text: "Daily skill checklist so you know exactly what's left to learn." },
      ] }, style: { background: "dark", cardRadius: "sm" } },
      { type: "cta", content: { title: "Not sure which course fits you?", highlight: "Ask Our Instructor", phones: ["9000000000"], buttonLabel: "Book a Slot", buttonHref: "/book-slot" } },
    ] },
    { slug: "licence", title: "Licence Help", isSystem: true, order: 2, sections: [
      { type: "banner", content: { title: "RTO", titleHighlight: "Licence Assistance", subtitle: "Learner's licence, permanent licence, renewals — we handle the paperwork.", image: "", bgColor: "#171412", imageOpacity: 40, overlayOpacity: 70 } },
      { type: "steps", content: { eyebrow: "THE PROCESS", title: "Licence in", titleHighlight: "5 Simple Steps", items: [
        { title: "Document Check", text: "Aadhaar, age & address proof, photos", icon: "clipboard" },
        { title: "LL Application", text: "Online form and slot booking on Parivahan", icon: "edit" },
        { title: "LL Test Prep", text: "Road signs and rules mock tests", icon: "book" },
        { title: "30 Days of Training", text: "Mandatory wait — perfect for practice", icon: "truck" },
        { title: "Driving Test", text: "Our car, our instructor, your licence", icon: "award" },
      ] } },
      { type: "priceList", content: { eyebrow: "SERVICE CHARGES", title: "Licence", titleHighlight: "Services", note: "Government RTO fees are charged extra at actuals.", groups: [
        { category: "New Licence", items: [ { name: "Learner's Licence (LL) assistance", price: "₹800", note: "" }, { name: "Permanent Licence + test-day car", price: "₹1,500", note: "" }, { name: "Two-wheeler + four-wheeler combo", price: "₹2,000", note: "" } ] },
        { category: "Other Services", items: [ { name: "Licence renewal", price: "₹600", note: "" }, { name: "Duplicate licence", price: "₹700", note: "" }, { name: "Address / mobile update", price: "₹500", note: "" }, { name: "International Driving Permit", price: "₹1,200", note: "" } ] },
      ] }, style: { background: "light" } },
      { type: "downloads", content: { eyebrow: "HELPFUL", title: "Download", titleHighlight: "Checklists", items: [
        { title: "Documents Checklist", description: "Everything you need for LL and permanent licence.", link: "", icon: "clipboard" },
        { title: "Road Signs Chart", description: "All mandatory, cautionary and informatory signs.", link: "", icon: "book" },
        { title: "LL Test Practice Questions", description: "Most-asked questions from the learner's test.", link: "", icon: "edit" },
      ] } },
      { type: "cta", content: { title: "Leave the paperwork to us.", highlight: "Start Your Licence Today", phones: ["9000000000"], buttonLabel: "Book a Slot", buttonHref: "/book-slot" } },
    ] },
    { slug: "fees", title: "Fees", isSystem: true, order: 3, sections: [
      { type: "pricingPlans", content: { eyebrow: "PACKAGES", title: "Training", titleHighlight: "Packages", plans: [
        { name: "Scooty Starter", price: "₹2,499", period: "10 days", features: ["10 × 30 min sessions", "Scooty provided", "Safe-zone practice"], featured: false, buttonLabel: "Book", buttonHref: "/book-slot" },
        { name: "Car Basic", price: "₹4,499", period: "15 days", features: ["15 × 30 min sessions", "Dual-control car", "Theory class"], featured: false, buttonLabel: "Book", buttonHref: "/book-slot" },
        { name: "Car + Licence", price: "₹5,999", period: "21 days", features: ["21 × 30 min sessions", "LL + DL assistance", "Test-day car", "Free pick-up"], featured: true, buttonLabel: "Book", buttonHref: "/book-slot" },
        { name: "Car Pro", price: "₹8,999", period: "30 days", features: ["30 × 45 min sessions", "Highway & night driving", "Licence help", "Automatic car option"], featured: false, buttonLabel: "Book", buttonHref: "/book-slot" },
      ] } },
      { type: "priceList", content: { eyebrow: "ADD-ONS", title: "Extra", titleHighlight: "Sessions", note: "Prices per session.", groups: [
        { category: "Add-ons", items: [ { name: "Extra 30 min car session", price: "₹300", note: "" }, { name: "Extra 60 min highway session", price: "₹600", note: "" }, { name: "Training in your own car", price: "₹350", note: "per session" }, { name: "Extra two-wheeler session", price: "₹200", note: "" } ] },
      ] }, style: { background: "light" } },
      { type: "cta", content: { title: "Pay in two easy instalments.", highlight: "Book Your Package", phones: ["9000000000"], buttonLabel: "Book a Slot", buttonHref: "/book-slot" } },
    ] },
    { slug: "women-batch", title: "Women's Batch", isSystem: true, order: 4, sections: [
      { type: "banner", content: { title: "Women-Only", titleHighlight: "Driving Batch", subtitle: "Lady instructors · Daytime slots · Free home pick-up.", image: "", bgColor: "#a16207", imageOpacity: 30, overlayOpacity: 70 } },
      { type: "about", content: { eyebrow: "DRIVE INDEPENDENTLY", title: "Built Around", titleHighlight: "Your Comfort", body: ["Many women tell us they'd love to drive but feel uneasy learning with a stranger. Our women-only batch is taught entirely by experienced lady instructors, in slots that fit around school runs and household routines.", "Learn at your own pace, ask every question, and graduate to driving yourself to work, the market or your parents' place — with confidence."], image: "", points: ["100% lady instructors", "10 AM – 4 PM slots", "Free pick-up within 5 km", "Extra sessions for nervous learners", "Licence help included"], buttonLabel: "Book a Slot", buttonHref: "/book-slot" } },
      { type: "testimonials", content: { eyebrow: "", title: "From Our", titleHighlight: "Women Drivers", items: [
        { name: "Neha Gupta", role: "Homemaker", text: "I now drive my kids to school every day. Never thought it would happen!", rating: 5 },
        { name: "Farah Sheikh", role: "Teacher", text: "Patient, kind and very professional. I got my licence in the first attempt.", rating: 5 },
        { name: "Lakshmi Narayanan", role: "Retired banker, 61", text: "Age is no bar here. Sunita ma'am made me feel completely at ease.", rating: 5 },
      ] }, style: { background: "light" } },
      { type: "faq", style: { layout: "split" }, content: { eyebrow: "WOMEN'S BATCH FAQ", title: "Your Questions,", titleHighlight: "Answered", intro: "Talk directly to our lady instructor before you join — just ask for Sunita ma'am when you call.", items: [
        { q: "Will my instructor always be a woman?", a: "Yes. Every session in the women-only batch is taken by a lady instructor, including the RTO test-day drive." },
        { q: "Can I learn on my own family car?", a: "Yes, after 8–10 sessions in our dual-control car you can switch to your own car for practice." },
        { q: "Is there an upper age limit?", a: "No. Our oldest learner got her licence at 64." },
      ] } },
      { type: "cta", content: { title: "Take the wheel of your life.", highlight: "Join the Women's Batch", phones: ["9000000000"], buttonLabel: "Book a Slot", buttonHref: "/book-slot" } },
    ] },
    { slug: "about", title: "About", isSystem: true, order: 5, sections: [
      { type: "about", content: { eyebrow: "ABOUT US", title: "18 Years of", titleHighlight: "Safe Driving", body: [`${biz} started with one car and one instructor who believed driving should be taught with patience, not pressure. Today we run a fleet of dual-control cars and two-wheelers and have trained over 15,000 drivers.`, "We're a government-approved motor driving school, and every instructor is certified, background-verified and trained in defensive driving."], image: "", points: ["Government-approved school", "Insured dual-control fleet", "Background-verified instructors", "Defensive-driving curriculum"], buttonLabel: "View Courses", buttonHref: "/courses" } },
      { type: "stats", content: { items: [ { value: "15,000+", label: "Students", icon: "users" }, { value: "98%", label: "Pass Rate", icon: "award" }, { value: "12", label: "Instructors", icon: "check" }, { value: "0", label: "Training Accidents", icon: "shield" } ] }, style: { background: "primary" } },
      { type: "gallery", style: { layout: "strip" }, content: { eyebrow: "ON THE ROAD", title: "Our", titleHighlight: "Fleet & Grounds" } },
      { type: "cta", content: { title: "Ready to start?", highlight: "Book Your First Lesson", phones: ["9000000000"], buttonLabel: "Book a Slot", buttonHref: "/book-slot" } },
    ] },
    { slug: "book-slot", title: "Book a Slot", isSystem: true, order: 6, sections: [
      { type: "quoteForm", content: { title: "Book Your Driving Slot", subtitle: "Tell us the course, preferred timing and pick-up area — we'll confirm on WhatsApp within an hour.", showSidebar: true } },
      { type: "features", content: { items: [
        { icon: "phone", title: "Quick Confirmation", text: "Slot confirmed within an hour during office time." },
        { icon: "tag", title: "Pay in Instalments", text: "50% at joining, 50% after day 10." },
        { icon: "heart", title: "No-Fear Promise", text: "Not confident by the end? We add 3 sessions free." },
      ] }, style: { background: "light", align: "center" } },
      { type: "openingHours", content: { eyebrow: "", title: "Available", titleHighlight: "Slots", note: "Each session is 30 minutes unless your package says otherwise.", days: [
        { day: "Early Morning", hours: "6:00 AM – 9:00 AM" },
        { day: "Daytime (Women's Batch)", hours: "10:00 AM – 4:00 PM" },
        { day: "Evening", hours: "4:00 PM – 8:00 PM" },
      ] } },
    ] },
    { slug: "contact", title: "Contact", isSystem: true, order: 7, sections: [
      { type: "contactInfo", content: { eyebrow: "CONTACT", title: "Visit Our", titleHighlight: "Office", address: "Your City", phone: "9000000000", email: "hello@example.com", hours: "Office: Mon–Sat 9 AM – 7 PM · Training: 7 days, 6 AM – 8 PM", mapEmbed: "" } },
      { type: "map", content: { eyebrow: "", title: "Find Our", titleHighlight: "Training Ground", address: "Your City", mapEmbed: "" } },
      { type: "contactForm", content: { title: "Have a Question?", subtitle: "Ask about courses, licence help or pick-up areas." } },
    ] },
  ],
};
