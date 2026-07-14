import type { TemplateDef } from "./types";

export const skill: TemplateDef = {
  theme: {
    colors: { primary: "#db2777", primaryDark: "#be185d", secondary: "#2a0e2e", accent: "#f472b6", dark: "#1f0a22", light: "#fdf2f8", text: "#3f3f46", heading: "#2a0e2e" },
    font: "Poppins", radius: "1.1rem",
  },
  header: (biz) => ({
    logoText: biz, logoImage: "",
    announcement: { show: false, text: "✨ New batches starting soon — book a FREE trial class!", link: "/join" },
    topbar: { show: true, address: "Learn a new skill today", phones: ["9000000000"], email: "hello@example.com", social: { facebook: "#", instagram: "#", whatsapp: "#" } },
    nav: [
      { label: "Home", href: "/" }, { label: "Classes", href: "/classes" }, { label: "Trainers", href: "/trainers" }, { label: "Fees", href: "/fees" }, { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Book Free Trial", href: "/join" },
  }),
  footer: (biz) => ({
    about: "Unlock your potential — learn from expert trainers in a fun, supportive space.",
    columns: [
      { title: "Quick Links", links: [ { label: "Home", href: "/" }, { label: "Classes", href: "/classes" }, { label: "Trainers", href: "/trainers" }, { label: "Fees", href: "/fees" }, { label: "Book Trial", href: "/join" } ] },
      { title: "Classes", links: [ { label: "Martial Arts", href: "/classes" }, { label: "Music", href: "/classes" }, { label: "Dance", href: "/classes" }, { label: "Art & Craft", href: "/classes" } ] },
    ],
    serviceAreas: ["Kids", "Teens", "Adults", "Beginners", "Advanced"],
    contact: { phones: ["9000000000"], email: "hello@example.com", address: "Your City" },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. All Rights Reserved.`,
  }),
  seo: (biz) => ({ title: `${biz} — Skill & Hobby Classes`, description: "Learn karate, music, dance and more from expert trainers. Book a free trial class today!", favicon: "", ogImage: "" }),
  services: [
    { category: "Martial Arts", title: "Karate", description: "For kids, teens & adults." },
    { category: "Martial Arts", title: "Taekwondo", description: "Discipline & self-defence." },
    { category: "Martial Arts", title: "Self-Defence", description: "Practical safety skills." },
    { category: "Music", title: "Guitar", description: "Acoustic & electric." },
    { category: "Music", title: "Keyboard / Piano", description: "From basics to advanced." },
    { category: "Music", title: "Vocals / Singing", description: "Find your voice." },
    { category: "Dance", title: "Western Dance", description: "Hip-hop, freestyle & more." },
    { category: "Dance", title: "Classical Dance", description: "Traditional forms." },
    { category: "Dance", title: "Bollywood", description: "Fun, energetic routines." },
    { category: "Art & Craft", title: "Drawing & Painting", description: "For all ages." },
    { category: "Art & Craft", title: "Craft Workshops", description: "Creative hands-on fun." },
  ],
  gallery: [...["Karate class", "Music session", "Dance practice", "Art class", "Performance", "Awards"].map((c) => ({ category: "Our Academy", caption: c }))],
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "centered", customHtml: "",
          badge: "LEARN · GROW · SHINE", titleTop: "Discover Your", titleHighlight: "Talent",
          subtitle: "", description: `${biz} offers fun, expert-led classes in martial arts, music, dance and art for all ages. Book a free trial today!`, image: "",
          primaryBtn: { label: "Book Free Trial", href: "/join" }, secondaryBtn: { label: "View Classes", href: "/classes" },
          features: [ { icon: "award", title: "Expert Trainers", text: "" }, { icon: "users", title: "All Ages", text: "" }, { icon: "star", title: "Fun Environment", text: "" }, { icon: "badge-check", title: "Certificates", text: "" } ],
        } },
        { type: "about", content: { eyebrow: "ABOUT US", title: "Where Passion", titleHighlight: "Meets Skill", body: [`${biz} is a place to learn, grow and have fun. Our expert trainers make every class engaging and rewarding.`, "Whether you're a beginner or advanced, there's a batch for you."], image: "", points: ["Certified trainers", "Small batches", "Flexible timings", "Regular performances"], buttonLabel: "About Us", buttonHref: "/about" } },
        { type: "serviceCategories", content: { eyebrow: "OUR CLASSES", title: "Explore Our", titleHighlight: "Classes", categories: ["Martial Arts", "Music", "Dance", "Art & Craft"] } },
        { type: "team", content: { eyebrow: "OUR TRAINERS", title: "Meet Our", titleHighlight: "Trainers", members: [
          { name: "Trainer Name", role: "Karate Instructor", image: "", note: "Black Belt" },
          { name: "Trainer Name", role: "Music Teacher", image: "", note: "Guitar & Piano" },
          { name: "Trainer Name", role: "Dance Choreographer", image: "", note: "Western & Bollywood" },
          { name: "Trainer Name", role: "Art Teacher", image: "", note: "Fine Arts" },
        ] } },
        { type: "stats", content: { items: [ { value: "2000+", label: "Students", icon: "users" }, { value: "20+", label: "Trainers", icon: "award" }, { value: "50+", label: "Batches", icon: "star" }, { value: "10+", label: "Years", icon: "trending" } ] } },
        { type: "steps", content: { eyebrow: "GET STARTED", title: "How to", titleHighlight: "Join", items: [
          { title: "Book Trial", text: "Free trial class", icon: "edit" },
          { title: "Meet Trainer", text: "Find your fit", icon: "users" },
          { title: "Choose Batch", text: "Pick your timing", icon: "calendar" },
          { title: "Start Learning", text: "Begin your journey", icon: "star" },
        ] } },
        { type: "testimonials", content: { eyebrow: "TESTIMONIALS", title: "What Parents &", titleHighlight: "Students Say", items: [
          { name: "Parent Name", role: "Parent", text: "My child loves the karate classes — great trainers!", rating: 5 },
          { name: "Student Name", role: "Student", text: "Learned guitar in months. Super fun and friendly.", rating: 5 },
          { name: "Parent Name", role: "Parent", text: "Wonderful dance academy. Highly recommended.", rating: 5 },
        ] } },
        { type: "cta", content: { title: "Ready to start?", highlight: "Book a Free Trial", phones: ["9000000000"], buttonLabel: "Book Now", buttonHref: "/join" } },
      ],
    },
    { slug: "about", title: "About", isSystem: true, order: 1, sections: [
      { type: "about", content: { eyebrow: "ABOUT US", title: "Our", titleHighlight: "Story", body: [`${biz} was founded to make skill-learning joyful and accessible for everyone.`], image: "", points: ["Passionate trainers", "Positive environment", "Focus on every student"], buttonLabel: "", buttonHref: "" } },
      { type: "cta", content: { title: "Come learn with us", highlight: "Book a Free Trial", phones: ["9000000000"], buttonLabel: "Book Now", buttonHref: "/join" } },
    ] },
    { slug: "classes", title: "Classes", isSystem: true, order: 2, sections: [
      { type: "serviceCategories", content: { eyebrow: "", title: "Our", titleHighlight: "Classes", categories: ["Martial Arts", "Music", "Dance", "Art & Craft"] } },
      { type: "cta", content: { title: "Not sure which class?", highlight: "Book a Free Trial", phones: ["9000000000"], buttonLabel: "Book Now", buttonHref: "/join" } },
    ] },
    { slug: "trainers", title: "Trainers", isSystem: true, order: 3, sections: [
      { type: "team", content: { eyebrow: "OUR TEAM", title: "Our", titleHighlight: "Trainers", members: [
        { name: "Trainer Name", role: "Karate Instructor", image: "", note: "Black Belt" },
        { name: "Trainer Name", role: "Guitar Teacher", image: "", note: "10+ yrs" },
        { name: "Trainer Name", role: "Vocal Coach", image: "", note: "Classical & Western" },
        { name: "Trainer Name", role: "Dance Choreographer", image: "", note: "Bollywood" },
        { name: "Trainer Name", role: "Art Teacher", image: "", note: "Fine Arts" },
        { name: "Trainer Name", role: "Taekwondo Coach", image: "", note: "Certified" },
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
