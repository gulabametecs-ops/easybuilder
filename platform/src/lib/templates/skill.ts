import type { TemplateDef } from "./types";

// Skill / Hobby Academy (martial arts, music, dance, art): energetic, creative,
// trial-class focused — for kids, teens and adults.
export const skill: TemplateDef = {
  theme: {
    colors: { primary: "#db2777", primaryDark: "#be185d", secondary: "#1e1b4b", accent: "#f59e0b", dark: "#1a1033", light: "#fdf2f8", text: "#3f3f46", heading: "#1e1b4b" },
    font: "Outfit", radius: "1.1rem",
  },
  header: (biz) => ({
    logoText: biz, logoImage: "",
    announcement: { show: true, text: "✨ New weekend & evening batches starting soon — book a FREE trial class!", link: "/join" },
    topbar: { show: true, address: "Martial arts · Music · Dance · Art — for ages 4 to 60", phones: ["9000000000"], email: "hello@example.com", social: { facebook: "#", instagram: "#", whatsapp: "#" } },
    nav: [
      { label: "Home", href: "/" }, { label: "About", href: "/about" }, { label: "Classes", href: "/classes" }, { label: "Trainers", href: "/trainers" }, { label: "Fees", href: "/fees" }, { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Book Free Trial", href: "/join" },
  }),
  footer: (biz) => ({
    about: "Unlock your potential — learn karate, music, dance and art from certified trainers in a fun, supportive and safe space.",
    columns: [
      { title: "Quick Links", links: [ { label: "Home", href: "/" }, { label: "About Us", href: "/about" }, { label: "Classes", href: "/classes" }, { label: "Trainers", href: "/trainers" }, { label: "Fees", href: "/fees" }, { label: "Book Trial", href: "/join" } ] },
      { title: "Classes", links: [ { label: "Martial Arts", href: "/classes" }, { label: "Music", href: "/classes" }, { label: "Dance", href: "/classes" }, { label: "Art & Craft", href: "/classes" } ] },
    ],
    serviceAreas: ["Kids", "Teens", "Adults", "Beginners", "Advanced"],
    contact: { phones: ["9000000000"], email: "hello@example.com", address: "Your City" },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. All Rights Reserved.`,
  }),
  seo: (biz) => ({ title: `${biz} — Karate, Music, Dance & Art Classes`, description: "Learn karate, guitar, keyboard, vocals, dance and art from certified trainers. Small batches, flexible timings, graded certifications and stage shows. Book a free trial class today!", favicon: "", ogImage: "" }),
  services: [
    { category: "Martial Arts", title: "Karate", description: "Belt-graded training for kids, teens and adults — fitness, focus and discipline." },
    { category: "Martial Arts", title: "Taekwondo", description: "Olympic-style kicks, forms and sparring with tournament opportunities." },
    { category: "Martial Arts", title: "Self-Defence for Girls & Women", description: "Practical, confidence-building safety techniques in a short course." },
    { category: "Music", title: "Guitar", description: "Acoustic and electric — chords, songs and Trinity / Rockschool grade exams." },
    { category: "Music", title: "Keyboard / Piano", description: "From first notes to advanced pieces, with Trinity grade preparation." },
    { category: "Music", title: "Vocals / Singing", description: "Hindustani, Western and Bollywood singing — breath, pitch and performance." },
    { category: "Dance", title: "Western & Hip-Hop", description: "Hip-hop, freestyle and contemporary with regular choreography showcases." },
    { category: "Dance", title: "Classical Dance", description: "Bharatanatyam and Kathak with graded exams and stage performances." },
    { category: "Dance", title: "Bollywood & Zumba", description: "Fun, high-energy routines for kids and fitness batches for adults." },
    { category: "Art & Craft", title: "Drawing & Painting", description: "Sketching, watercolour and acrylics — for young artists and hobbyists." },
    { category: "Art & Craft", title: "Craft Workshops", description: "Clay, origami and seasonal craft workshops full of creative fun." },
  ],
  gallery: [...["Karate class", "Belt grading day", "Music session", "Dance practice", "Art class", "Annual stage show", "Tournament medals", "Summer camp"].map((c) => ({ category: "Our Academy", caption: c }))],
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "split", customHtml: "",
          badge: "LEARN · PERFORM · SHINE", titleTop: "Discover the Talent", titleHighlight: "You Were Born With",
          subtitle: "", description: `${biz} offers expert-led classes in martial arts, music, dance and art for ages 4 to 60 — with small batches, flexible timings, graded certificates and real stage experience. Your first class is free.`, image: "",
          primaryBtn: { label: "Book Free Trial", href: "/join" }, secondaryBtn: { label: "Explore Classes", href: "/classes" },
          features: [ { icon: "award", title: "Certified Trainers", text: "" }, { icon: "users", title: "Ages 4 to 60", text: "" }, { icon: "calendar", title: "Weekday & Weekend Batches", text: "" }, { icon: "badge-check", title: "Graded Certificates", text: "" } ],
        } },
        { type: "features", style: { background: "light" }, content: { items: [
          { icon: "award", title: "Certified Trainers", text: "Black belts, Trinity-graded musicians and trained choreographers who love to teach." },
          { icon: "users", title: "Small Batches", text: "10–12 students per batch so every learner gets hands-on correction and attention." },
          { icon: "badge-check", title: "Recognised Certifications", text: "Belt gradings, Trinity / Rockschool and classical dance exams to mark real progress." },
          { icon: "star", title: "Stage & Competition Time", text: "Annual shows, recitals and tournaments that build real-world confidence." },
        ] } },
        { type: "about", content: { eyebrow: "ABOUT US", title: "Where Passion", titleHighlight: "Meets Skill", body: [`${biz} is a place to learn, grow and have fun. Whether your child wants to earn a black belt or you've always wanted to play the guitar, we'll help you get there step by step.`, "Our structured curriculum, friendly trainers and safe, air-conditioned studios make every class something to look forward to."], image: "", points: ["Structured, level-wise curriculum", "Air-conditioned studios", "Flexible weekday & weekend slots", "Monthly progress feedback", "Make-up classes for missed sessions", "Sibling & family discounts"], buttonLabel: "About Us", buttonHref: "/about" } },
        { type: "serviceCategories", content: { eyebrow: "OUR CLASSES", title: "Find Your", titleHighlight: "Passion", categories: ["Martial Arts", "Music", "Dance", "Art & Craft"] } },
        { type: "stats", content: { items: [ { value: "2,000+", label: "Students Trained", icon: "users" }, { value: "20+", label: "Certified Trainers", icon: "award" }, { value: "150+", label: "Medals & Awards", icon: "star" }, { value: "10+", label: "Years of Excellence", icon: "trending" } ] } },
        { type: "team", content: { eyebrow: "OUR TRAINERS", title: "Learn From", titleHighlight: "Experts", members: [
          { name: "Sensei Rajesh Thakur", role: "Karate Head Coach", image: "", note: "3rd Dan Black Belt · National Referee" },
          { name: "Mr. Aakash D'Souza", role: "Guitar & Keyboard", image: "", note: "Trinity Grade 8 · 12 yrs" },
          { name: "Ms. Tanvi Kapoor", role: "Dance Choreographer", image: "", note: "Hip-Hop & Bollywood" },
          { name: "Ms. Priyanka Bose", role: "Art Teacher", image: "", note: "BFA, Fine Arts" },
        ] } },
        { type: "steps", style: { background: "light" }, content: { eyebrow: "GET STARTED", title: "Start in", titleHighlight: "4 Easy Steps", items: [
          { title: "Book a Free Trial", text: "Pick any class and a slot that suits you", icon: "edit" },
          { title: "Meet Your Trainer", text: "Get a quick level check and guidance", icon: "users" },
          { title: "Choose Your Batch", text: "Weekday, evening or weekend timings", icon: "calendar" },
          { title: "Learn & Perform", text: "Grade up, earn certificates, hit the stage", icon: "star" },
        ] } },
        { type: "openingHours", content: { eyebrow: "TIMINGS", title: "Batch", titleHighlight: "Timings", note: "Separate batches for kids, teens and adults. Call us to check seat availability.", days: [
          { day: "Monday – Friday", hours: "7:00 AM – 9:00 AM · 4:00 PM – 9:00 PM" },
          { day: "Saturday", hours: "8:00 AM – 8:00 PM" },
          { day: "Sunday", hours: "9:00 AM – 1:00 PM (workshops & shows)" },
        ] } },
        { type: "testimonials", content: { eyebrow: "TESTIMONIALS", title: "What Parents &", titleHighlight: "Students Say", items: [
          { name: "Meenal Joshi", role: "Mother of Aryan, 9 · Karate", text: "Aryan earned his yellow belt in four months and is so much more focused at school now. Sensei is strict but incredibly encouraging.", rating: 5 },
          { name: "Karthik Subramanian", role: "Adult Student · Guitar", text: "I picked up the guitar at 34 and was playing full songs within three months. The weekend batch fits perfectly around my job.", rating: 5 },
          { name: "Ritika Bansal", role: "Mother of Saanvi, 12 · Dance", text: "The annual show was a professional production! Saanvi has gained so much confidence on stage. Highly recommended.", rating: 5 },
          { name: "Nikhil Arora", role: "Student, 16 · Keyboard", text: "Cleared my Trinity Grade 5 with distinction. The trainers explain theory in a way that actually makes sense.", rating: 5 },
        ] } },
        { type: "faq", style: { background: "light" }, content: { eyebrow: "FAQ", title: "Questions People", titleHighlight: "Ask Us", items: [
          { q: "Is the trial class really free?", a: "Yes. Your first class in any course is completely free, with no obligation to join." },
          { q: "What age can my child start?", a: "Art and dance start from age 4, martial arts from 5 and music instruments from 6. Adults of any age are welcome." },
          { q: "I'm a complete beginner. Is that okay?", a: "Absolutely. Most of our students start from zero. Batches are grouped by level so you learn comfortably." },
          { q: "Do you offer certifications?", a: "Yes. We conduct belt gradings for martial arts and prepare students for Trinity, Rockschool and classical dance exams." },
          { q: "What if I miss a class?", a: "You can attend a make-up class in another batch of the same level within the same month." },
          { q: "Are there discounts?", a: "We offer sibling and family discounts and a lower rate on quarterly and annual plans." },
        ] } },
        { type: "cta", content: { title: "Ready to discover your talent?", highlight: "Book a Free Trial Class", phones: ["9000000000"], buttonLabel: "Book Free Trial", buttonHref: "/join" } },
      ],
    },
    { slug: "about", title: "About", isSystem: true, order: 1, sections: [
      { type: "about", content: { eyebrow: "ABOUT US", title: "Our", titleHighlight: "Story", body: [`${biz} was founded to make skill-learning joyful and accessible for everyone — from a shy five-year-old to a working professional chasing a lifelong dream.`, "Today we're proud to have trained thousands of students who now perform on stages, win tournaments and simply enjoy their art."], image: "", points: ["Passionate, certified trainers", "Positive, safe environment", "Focus on every student", "Regular shows & competitions"], buttonLabel: "", buttonHref: "" } },
      { type: "stats", content: { items: [ { value: "2,000+", label: "Students", icon: "users" }, { value: "20+", label: "Trainers", icon: "award" }, { value: "50+", label: "Batches", icon: "star" }, { value: "10+", label: "Years", icon: "trending" } ] } },
      { type: "cta", content: { title: "Come learn with us", highlight: "Book a Free Trial", phones: ["9000000000"], buttonLabel: "Book Now", buttonHref: "/join" } },
    ] },
    { slug: "classes", title: "Classes", isSystem: true, order: 2, sections: [
      { type: "serviceCategories", content: { eyebrow: "", title: "Our", titleHighlight: "Classes", categories: ["Martial Arts", "Music", "Dance", "Art & Craft"] } },
      { type: "cta", content: { title: "Not sure which class?", highlight: "Book a Free Trial", phones: ["9000000000"], buttonLabel: "Book Now", buttonHref: "/join" } },
    ] },
    { slug: "trainers", title: "Trainers", isSystem: true, order: 3, sections: [
      { type: "team", content: { eyebrow: "OUR TEAM", title: "Our", titleHighlight: "Trainers", members: [
        { name: "Sensei Rajesh Thakur", role: "Karate Instructor", image: "", note: "3rd Dan Black Belt" },
        { name: "Mr. Aakash D'Souza", role: "Guitar Teacher", image: "", note: "10+ yrs" },
        { name: "Ms. Radhika Menon", role: "Vocal Coach", image: "", note: "Classical & Western" },
        { name: "Ms. Tanvi Kapoor", role: "Dance Choreographer", image: "", note: "Bollywood & Hip-Hop" },
        { name: "Ms. Priyanka Bose", role: "Art Teacher", image: "", note: "Fine Arts" },
        { name: "Mr. Sahil Khanna", role: "Taekwondo Coach", image: "", note: "Certified · State Medallist" },
      ] } },
    ] },
    { slug: "fees", title: "Fees", isSystem: true, order: 4, sections: [
      { type: "priceList", content: { eyebrow: "", title: "Class", titleHighlight: "Fees", note: "Monthly fees. Sibling and annual discounts available.", groups: [
        { category: "Martial Arts", items: [ { name: "Karate (2 days/week)", price: "₹1,200/mo", note: "" }, { name: "Taekwondo", price: "₹1,200/mo", note: "" } ] },
        { category: "Music", items: [ { name: "Guitar / Keyboard", price: "₹1,500/mo", note: "" }, { name: "Vocals", price: "₹1,400/mo", note: "" } ] },
        { category: "Dance & Art", items: [ { name: "Dance (any style)", price: "₹1,300/mo", note: "" }, { name: "Art & Craft", price: "₹1,000/mo", note: "" } ] },
      ] } },
      { type: "cta", content: { title: "Questions about fees?", highlight: "Contact Us", phones: ["9000000000"], buttonLabel: "Book Trial", buttonHref: "/join" } },
    ] },
    { slug: "contact", title: "Contact", isSystem: true, order: 5, sections: [ { type: "contactForm", content: { title: "Contact Us", subtitle: "Ask about classes, batches, timings or fees." } } ] },
    { slug: "join", title: "Book Free Trial", isSystem: true, order: 6, sections: [ { type: "appointmentForm", content: { title: "Book a Free Trial Class", subtitle: "Pick a class, date and time — your first class is on us!" } } ] },
  ],
};
