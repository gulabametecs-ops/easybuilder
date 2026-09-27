import type { TemplateDef } from "./types";

// Events, Webinars, Seminars & Training: vibrant indigo/violet + coral —
// upcoming events, flagship countdown, speakers, passes, corporate training, seat booking.
export const events: TemplateDef = {
  theme: {
    colors: { primary: "#6d28d9", primaryDark: "#5b21b6", secondary: "#1e1b4b", accent: "#fb7185", dark: "#140f2e", light: "#f5f3ff", text: "#3f3d56", heading: "#1e1b4b" },
    font: "Plus Jakarta Sans", radius: "1rem",
  },
  header: (biz) => ({
    design: "bold",
    logoText: biz, logoImage: "",
    announcement: { show: true, text: "Growth Summit 2026 · Early-bird passes close soon — save 30%", link: "/tickets" },
    topbar: { show: true, address: "Webinars · Seminars · Workshops · Corporate Training", phones: ["9000000000"], email: "hello@example.com", social: { facebook: "#", instagram: "#", whatsapp: "#" } },
    nav: [
      { label: "Home", href: "/" }, { label: "Events", href: "/events" }, { label: "Speakers", href: "/speakers" }, { label: "Tickets", href: "/tickets" }, { label: "Corporate Training", href: "/corporate-training" }, { label: "Past Events", href: "/past-events" }, { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Register Now", href: "/register" },
  }),
  footer: (biz) => ({
    design: "gradient",
    about: "Live and online events that help professionals and teams learn, connect and grow — from free webinars to flagship summits and custom corporate training.",
    columns: [
      { title: "Explore", links: [ { label: "Upcoming Events", href: "/events" }, { label: "Speakers", href: "/speakers" }, { label: "Agenda", href: "/agenda" }, { label: "Past Events", href: "/past-events" }, { label: "About Us", href: "/about" } ] },
      { title: "Attend", links: [ { label: "Register for an Event", href: "/register" }, { label: "Tickets & Passes", href: "/tickets" }, { label: "Free Webinars", href: "/events" }, { label: "Contact", href: "/contact" } ] },
      { title: "For Business", links: [ { label: "Corporate Training", href: "/corporate-training" }, { label: "Group Bookings", href: "/corporate-training" }, { label: "Partner / Sponsor", href: "/contact" } ] },
    ],
    serviceAreas: ["Webinars", "Seminars", "Workshops", "Conferences", "Corporate Training", "Certifications"],
    contact: { phones: ["9000000000"], email: "hello@example.com", address: "Your City" },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. Learn. Connect. Grow.`,
  }),
  seo: (biz) => ({
    title: `${biz} — Webinars, Seminars, Workshops & Corporate Training`,
    description: "Book your seat for live webinars, seminars, hands-on workshops and conferences. Expert speakers, certificates and custom corporate training programs.",
    keywords: "webinar, seminar, workshop, conference, corporate training, event registration, professional events India",
    businessType: "EventVenue", priceRange: "₹₹",
    favicon: "", ogImage: "",
  }),
  services: [
    { category: "Webinars", title: "Digital Marketing Masterclass", description: "Online · Sat 18 Oct, 11:00 AM · 90 min live with Q&A. Free." },
    { category: "Webinars", title: "Personal Finance & Investing 101", description: "Online · Sun 26 Oct, 6:00 PM · Beginner friendly. Free." },
    { category: "Webinars", title: "AI Tools for Everyday Productivity", description: "Online · Sat 8 Nov, 4:00 PM · Live demos & templates. ₹299." },
    { category: "Seminars & Conferences", title: "Growth Summit 2026", description: "Offline · 12 Dec, Your City Convention Centre · Full-day flagship conference." },
    { category: "Seminars & Conferences", title: "Startup Funding Seminar", description: "Offline · 15 Nov · Meet founders & investors, pitch clinic included." },
    { category: "Seminars & Conferences", title: "HR Leaders Roundtable", description: "Hybrid · 22 Nov · Future of work, hiring & retention." },
    { category: "Workshops", title: "Public Speaking Bootcamp", description: "Offline · 2-day workshop, 1–2 Nov · Small batch of 30, certificate included." },
    { category: "Workshops", title: "Data Analytics with Excel & Power BI", description: "Online · 4 weekends from 9 Nov · Hands-on projects & certificate." },
    { category: "Workshops", title: "Sales Negotiation Workshop", description: "Offline · 29 Nov · Role-plays, frameworks and real scenarios." },
  ],
  gallery: [
    ...["Growth Summit 2025 main stage", "Keynote session", "Panel discussion", "Networking lunch"].map((c) => ({ category: "Conferences", caption: c })),
    ...["Public speaking bootcamp", "Hands-on analytics workshop", "Team-building activity"].map((c) => ({ category: "Workshops", caption: c })),
    ...["Corporate leadership program", "Certificate ceremony"].map((c) => ({ category: "Corporate Training", caption: c })),
  ],
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "gradient", customHtml: "",
          badge: "WEBINARS · SEMINARS · WORKSHOPS · CONFERENCES", titleTop: "Learn from the Best.", titleHighlight: "Grow Faster.",
          subtitle: "", description: `${biz} brings you live webinars, hands-on workshops and high-energy conferences with India's top practitioners. Book your seat online in under a minute.`, image: "",
          primaryBtn: { label: "Register Now", href: "/register" }, secondaryBtn: { label: "Browse Events", href: "/events" },
          features: [ { icon: "calendar", title: "Weekly Live Events", text: "" }, { icon: "users", title: "Expert Speakers", text: "" }, { icon: "award", title: "Certificates", text: "" }, { icon: "handshake", title: "Networking", text: "" } ],
        } },
        { type: "logos", content: { title: "Professionals from leading companies attend our events", items: ["TechCorp", "FinServe", "RetailOne", "BuildWell", "MediCare Plus", "EduNext"] } },
        { type: "countdown", style: { background: "dark" }, content: { eyebrow: "FLAGSHIP EVENT", title: "Growth Summit", titleHighlight: "2026", subtitle: "12 December · Your City Convention Centre · 20+ speakers, 8 sessions, 500+ attendees. Early-bird passes save 30%.", targetDate: "2026-12-12T09:30", buttonLabel: "Grab Your Pass", buttonHref: "/tickets" } },
        { type: "serviceCategories", content: { eyebrow: "UPCOMING", title: "Upcoming", titleHighlight: "Events", categories: ["Webinars", "Seminars & Conferences", "Workshops"] } },
        { type: "features", style: { background: "light" }, content: { items: [
          { icon: "users", title: "Industry Experts", text: "Speakers who practise what they teach — founders, CXOs and specialists." },
          { icon: "headset", title: "Live & Interactive", text: "Real-time Q&A, polls and breakout discussions, online or on-site." },
          { icon: "award", title: "Certificates", text: "Earn a verifiable participation certificate for every event." },
          { icon: "book-open", title: "Recordings & Notes", text: "Replays, slides and templates shared after each session." },
          { icon: "handshake", title: "Networking", text: "Meet peers, mentors and potential partners at every event." },
          { icon: "tag", title: "Affordable Access", text: "Free webinars every month and early-bird pricing on all passes." },
        ] } },
        { type: "team", content: { eyebrow: "SPEAKERS", title: "Learn from", titleHighlight: "Top Speakers", members: [
          { name: "Speaker Name", role: "Founder & CEO, Growth Startup", image: "", note: "Keynote · Scaling to ₹100 Cr" },
          { name: "Speaker Name", role: "Head of Marketing, Consumer Brand", image: "", note: "Digital Marketing" },
          { name: "Speaker Name", role: "Chartered Accountant & Investor", image: "", note: "Personal Finance" },
          { name: "Speaker Name", role: "Leadership Coach", image: "", note: "Public Speaking" },
        ] } },
        { type: "steps", style: { background: "light" }, content: { eyebrow: "HOW IT WORKS", title: "Book Your Seat in", titleHighlight: "4 Easy Steps", items: [
          { title: "Pick an Event", text: "Browse webinars, workshops and conferences", icon: "calendar" },
          { title: "Choose Your Pass", text: "Free, Standard or VIP — whatever fits", icon: "tag" },
          { title: "Register Online", text: "Reserve your seat or slot in a minute", icon: "edit" },
          { title: "Attend & Grow", text: "Join live, get certified, stay connected", icon: "award" },
        ] } },
        { type: "stats", content: { items: [ { value: "250+", label: "Events Hosted", icon: "calendar" }, { value: "40,000+", label: "Attendees", icon: "users" }, { value: "120+", label: "Expert Speakers", icon: "star" }, { value: "4.8/5", label: "Avg. Rating", icon: "thumbs-up" } ] } },
        { type: "testimonials", style: { background: "light" }, content: { eyebrow: "ATTENDEE STORIES", title: "What Attendees", titleHighlight: "Say", items: [
          { name: "Neha Kapoor", role: "Marketing Manager · Growth Summit", text: "Best-organised conference I've attended in years. Every session was practical and the networking alone was worth the pass.", rating: 5 },
          { name: "Vikram Iyer", role: "Founder · Startup Funding Seminar", text: "I left with three investor contacts and a much sharper pitch deck. The pitch clinic was fantastic.", rating: 5 },
          { name: "Ananya Rao", role: "L&D Head · Corporate Training", text: "We trained 60 managers with their leadership program. Custom content, great trainers and measurable results.", rating: 5 },
        ] } },
        { type: "faq", content: { eyebrow: "FAQ", title: "Before You", titleHighlight: "Register", items: [
          { q: "How do I join an online webinar?", a: "After registering you'll receive a confirmation with the joining link on email and WhatsApp, plus a reminder 1 hour before the session." },
          { q: "Will I get a certificate?", a: "Yes. All attendees who join the live session receive a digital participation certificate. Workshops include a completion certificate." },
          { q: "Are recordings available?", a: "Standard and VIP pass holders get access to recordings and slides. Free webinar replays are available for a limited time." },
          { q: "Can I get a refund or transfer my pass?", a: "Passes can be transferred to a colleague at no cost. Refunds are available up to 7 days before paid events." },
          { q: "Do you offer group or corporate bookings?", a: "Yes — groups of 5+ get special pricing, and we design custom in-house training programs for companies." },
        ] } },
        { type: "cta", content: { title: "Seats fill up fast", highlight: "Reserve Yours Today", phones: ["9000000000"], buttonLabel: "Register Now", buttonHref: "/register" } },
      ],
    },
    { slug: "events", title: "Upcoming Events", isSystem: true, order: 1, sections: [
      { type: "serviceCategories", content: { eyebrow: "", title: "Upcoming", titleHighlight: "Events", categories: ["Webinars", "Seminars & Conferences", "Workshops"] } },
      { type: "priceList", style: { background: "light" }, content: { eyebrow: "EVENT CALENDAR", title: "Dates &", titleHighlight: "Formats", note: "Online events are hosted on Zoom / Google Meet — joining link shared after registration. Venue details for offline events are sent with your confirmation.", groups: [
        { category: "October", items: [ { name: "Digital Marketing Masterclass", price: "Free", note: "Online · 18 Oct" }, { name: "Personal Finance & Investing 101", price: "Free", note: "Online · 26 Oct" } ] },
        { category: "November", items: [ { name: "Public Speaking Bootcamp", price: "₹4,999", note: "Offline · 1–2 Nov" }, { name: "AI Tools for Everyday Productivity", price: "₹299", note: "Online · 8 Nov" }, { name: "Data Analytics with Excel & Power BI", price: "₹6,999", note: "Online · from 9 Nov" }, { name: "Startup Funding Seminar", price: "₹1,499", note: "Offline · 15 Nov" }, { name: "HR Leaders Roundtable", price: "₹1,999", note: "Hybrid · 22 Nov" }, { name: "Sales Negotiation Workshop", price: "₹3,499", note: "Offline · 29 Nov" } ] },
        { category: "December", items: [ { name: "Growth Summit 2026 (Flagship)", price: "from ₹2,499", note: "Offline · 12 Dec" } ] },
      ] } },
      { type: "cta", content: { title: "Found the right event?", highlight: "Book Your Seat", phones: ["9000000000"], buttonLabel: "Register Now", buttonHref: "/register" } },
    ] },
    { slug: "speakers", title: "Speakers", isSystem: true, order: 2, sections: [
      { type: "team", content: { eyebrow: "", title: "Our", titleHighlight: "Speakers & Trainers", members: [
        { name: "Speaker Name", role: "Founder & CEO, Growth Startup", image: "", note: "Keynote · Growth Summit" },
        { name: "Speaker Name", role: "Head of Marketing, Consumer Brand", image: "", note: "Digital Marketing" },
        { name: "Speaker Name", role: "Chartered Accountant & Investor", image: "", note: "Personal Finance" },
        { name: "Speaker Name", role: "Leadership Coach", image: "", note: "Public Speaking" },
        { name: "Speaker Name", role: "Data Science Lead", image: "", note: "Analytics & AI" },
        { name: "Speaker Name", role: "Angel Investor", image: "", note: "Startup Funding" },
        { name: "Speaker Name", role: "CHRO, IT Services", image: "", note: "HR & Culture" },
        { name: "Speaker Name", role: "Sales Director", image: "", note: "Negotiation" },
      ] } },
      { type: "cta", content: { title: "Want to speak at our events?", highlight: "Apply as a Speaker", phones: ["9000000000"], buttonLabel: "Get in Touch", buttonHref: "/contact" } },
    ] },
    { slug: "agenda", title: "Agenda", isSystem: true, order: 3, sections: [
      { type: "countdown", style: { background: "dark" }, content: { eyebrow: "12 DECEMBER 2026", title: "Growth Summit", titleHighlight: "Agenda", subtitle: "A full day of keynotes, panels and hands-on masterclasses at Your City Convention Centre.", targetDate: "2026-12-12T09:30", buttonLabel: "Get Your Pass", buttonHref: "/tickets" } },
      { type: "steps", content: { eyebrow: "EVENT DAY", title: "Summit", titleHighlight: "Schedule", items: [
        { title: "9:30 AM · Check-in", text: "Registration, welcome kit & breakfast", icon: "check" },
        { title: "10:30 AM · Keynote", text: "Scaling a business in the new India", icon: "star" },
        { title: "11:30 AM · Panel", text: "Marketing, funding & talent in 2027", icon: "users" },
        { title: "1:00 PM · Networking Lunch", text: "Meet speakers and fellow attendees", icon: "utensils" },
        { title: "2:30 PM · Masterclasses", text: "Parallel hands-on tracks", icon: "book-open" },
        { title: "5:30 PM · Awards & Close", text: "Certificates and evening networking", icon: "award" },
      ] } },
      { type: "cta", content: { title: "Don't miss a single session", highlight: "Register Today", phones: ["9000000000"], buttonLabel: "Register Now", buttonHref: "/register" } },
    ] },
    { slug: "tickets", title: "Tickets & Passes", isSystem: true, order: 4, sections: [
      { type: "pricingPlans", content: { eyebrow: "CHOOSE YOUR PASS", title: "Tickets &", titleHighlight: "Passes", plans: [
        { name: "Free Webinar", price: "₹0", period: "per session", features: ["Live online access", "Q&A with the speaker", "Participation certificate", "Replay for 48 hours"], featured: false, buttonLabel: "Register Free", buttonHref: "/register" },
        { name: "Standard Pass", price: "₹2,499", period: "per person", features: ["Full-day summit access", "All keynotes & panels", "Lunch & refreshments", "Recordings & slides", "Certificate"], featured: true, buttonLabel: "Book Standard", buttonHref: "/register" },
        { name: "VIP / Corporate", price: "₹7,999", period: "per person", features: ["Front-row seating", "Speaker meet & greet", "Exclusive masterclass", "VIP networking dinner", "Group of 5+ gets 15% off"], featured: false, buttonLabel: "Book VIP", buttonHref: "/register" },
      ] } },
      { type: "faq", style: { background: "light" }, content: { eyebrow: "", title: "Ticket", titleHighlight: "FAQs", items: [
        { q: "Do prices include GST?", a: "Prices shown are exclusive of 18% GST. A GST invoice is issued for every paid booking." },
        { q: "Is there an early-bird discount?", a: "Yes — early-bird passes are 30% off until 30 days before the event, subject to availability." },
        { q: "Can my company pay for multiple passes?", a: "Yes. Contact us or use the corporate enquiry form for group invoicing and bulk discounts." },
      ] } },
      { type: "cta", content: { title: "Booking for a team?", highlight: "Get Group Pricing", phones: ["9000000000"], buttonLabel: "Corporate Enquiry", buttonHref: "/corporate-training" } },
    ] },
    { slug: "corporate-training", title: "Corporate Training", isSystem: true, order: 5, sections: [
      { type: "about", content: { eyebrow: "FOR TEAMS", title: "Training That", titleHighlight: "Moves the Needle", body: ["We design and deliver in-house and virtual training programs tailored to your team's goals — from first-time managers to senior leadership.", "Every program starts with a needs assessment and ends with measurable outcomes, feedback reports and certificates."], image: "", points: ["Custom curriculum", "On-site or virtual delivery", "Certified trainers", "Pre & post assessments", "GST invoicing", "Pan-India delivery"], buttonLabel: "Request a Proposal", buttonHref: "/corporate-training#enquiry" } },
      { type: "features", style: { background: "light" }, content: { items: [
        { icon: "users", title: "Leadership & Management", text: "Programs for first-time managers, team leads and senior leaders." },
        { icon: "trending", title: "Sales & Negotiation", text: "Frameworks, role-plays and pipeline discipline for sales teams." },
        { icon: "headset", title: "Communication Skills", text: "Presentation, business writing and customer communication." },
        { icon: "zap", title: "Digital & AI Skills", text: "Practical AI, analytics and productivity tools for every team." },
        { icon: "shield", title: "Compliance & POSH", text: "Mandatory workplace compliance training with certification." },
        { icon: "handshake", title: "Team Offsites", text: "Facilitated workshops and team-building for offsites." },
      ] } },
      { type: "logos", content: { title: "Trusted by learning teams at", items: ["TechCorp", "FinServe", "RetailOne", "BuildWell", "MediCare Plus", "EduNext"] } },
      { type: "quoteForm", style: { anchorId: "enquiry" }, content: { title: "Corporate & Group Enquiry", subtitle: "Tell us your team size, topics and preferred dates. Our training consultant will share a tailored proposal within 24 hours.", showSidebar: true } },
    ] },
    { slug: "register", title: "Register", isSystem: true, order: 6, sections: [
      { type: "appointmentForm", content: { title: "Book Your Seat", subtitle: "Choose the event and your preferred date or slot. You'll receive a confirmation with joining link or venue details on email and WhatsApp." } },
      { type: "features", style: { background: "light" }, content: { items: [
        { icon: "check", title: "Instant Confirmation", text: "Your seat is reserved as soon as we confirm." },
        { icon: "mail", title: "Reminders", text: "Email & WhatsApp reminders before the event." },
        { icon: "award", title: "Certificate", text: "Digital certificate for every attendee." },
      ] } },
    ] },
    { slug: "past-events", title: "Past Events", isSystem: true, order: 7, sections: [
      { type: "gallery", content: { eyebrow: "HIGHLIGHTS", title: "Past", titleHighlight: "Events" } },
      { type: "video", style: { background: "light" }, content: { eyebrow: "WATCH", title: "Growth Summit 2025", titleHighlight: "Recap", url: "", caption: "500+ attendees, 20 speakers and one unforgettable day." } },
      { type: "stats", content: { items: [ { value: "250+", label: "Events Hosted", icon: "calendar" }, { value: "40,000+", label: "Attendees", icon: "users" }, { value: "60+", label: "Corporate Clients", icon: "handshake" }, { value: "4.8/5", label: "Avg. Rating", icon: "star" } ] } },
      { type: "cta", content: { title: "Be part of the next one", highlight: "See Upcoming Events", phones: ["9000000000"], buttonLabel: "Upcoming Events", buttonHref: "/events" } },
    ] },
    { slug: "about", title: "About Us", isSystem: true, order: 8, sections: [
      { type: "about", content: { eyebrow: "ABOUT US", title: "Events That", titleHighlight: "Create Impact", body: [`${biz} curates learning experiences for ambitious professionals and teams — free webinars, focused workshops and flagship conferences.`, "We work with practitioners, not just presenters, so every session leaves you with ideas you can use the very next day."], image: "", points: ["250+ events delivered", "Online, offline & hybrid", "Expert speaker network", "End-to-end event management"], buttonLabel: "Upcoming Events", buttonHref: "/events" } },
      { type: "cta", content: { title: "Join our next event", highlight: "Register Now", phones: ["9000000000"], buttonLabel: "Register Now", buttonHref: "/register" } },
    ] },
    { slug: "contact", title: "Contact", isSystem: true, order: 9, sections: [
      { type: "contactInfo", content: { eyebrow: "REACH US", title: "Get In", titleHighlight: "Touch", address: "Your City", phone: "9000000000", email: "hello@example.com", hours: "Mon–Sat: 10am – 7pm", mapEmbed: "" } },
      { type: "contactForm", style: { background: "light" }, content: { title: "Send Us a Message", subtitle: "Questions about an event, speaking, sponsorship or partnerships — we reply within one working day." } },
    ] },
  ],
};
