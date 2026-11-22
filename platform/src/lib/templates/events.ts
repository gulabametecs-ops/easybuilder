import type { TemplateDef } from "./types";

// Events, Webinars, Seminars & Training: vibrant indigo/violet + coral —
// upcoming events, flagship countdown, speakers, passes, corporate training, seat booking.
export const events: TemplateDef = {
  theme: {
    colors: { primary: "#6d28d9", primaryDark: "#5b21b6", secondary: "#1e1b4b", accent: "#fb7185", dark: "#140f2e", light: "#f5f3ff", text: "#3f3d56", heading: "#1e1b4b" },
    font: "Plus Jakarta Sans", radius: "0.75rem",
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
        { type: "countdown", style: { background: "dark" }, content: { eyebrow: "FLAGSHIP EVENT", title: "Growth Summit", titleHighlight: "2026", subtitle: "12 December · Your City Convention Centre · 20+ speakers, 8 sessions, 500+ attendees. Early-bird passes save 30%.", targetDate: "2026-12-12T09:30", buttonLabel: "Grab Your Pass", buttonHref: "/tickets" } },
        { type: "logos", content: { title: "Professionals from 300+ companies attend our events", items: ["TechCorp", "FinServe", "RetailOne", "BuildWell", "MediCare Plus", "EduNext", "AgriGrow", "LogiMove"] } },
        { type: "serviceCategories", style: { layout: "list" }, content: { eyebrow: "UPCOMING", title: "This Season's", titleHighlight: "Events", categories: ["Webinars", "Seminars & Conferences", "Workshops"] } },
        { type: "stats", style: { layout: "band", background: "primary" }, content: { items: [ { value: "250+", label: "Events Hosted", icon: "calendar" }, { value: "40,000+", label: "Attendees", icon: "users" }, { value: "120+", label: "Expert Speakers", icon: "star" }, { value: "4.8/5", label: "Avg. Rating", icon: "thumbs-up" } ] } },
        { type: "team", content: { eyebrow: "SPEAKERS", title: "Learn from", titleHighlight: "Top Speakers", members: [
          { name: "Raghav Bhatia", role: "Founder & CEO, D2C startup", image: "", note: "Keynote · Scaling to ₹100 Cr" },
          { name: "Sunita Menon", role: "Head of Marketing, consumer brand", image: "", note: "Digital Marketing" },
          { name: "CA Abhishek Jain", role: "Chartered Accountant & Investor", image: "", note: "Personal Finance" },
          { name: "Farah Khan Mirza", role: "Leadership & Speaking Coach", image: "", note: "Public Speaking" },
        ] } },
        { type: "features", style: { layout: "split", background: "light" }, content: { ...{ eyebrow: "WHY ATTEND", title: "Every Event,", titleHighlight: "Worth Your Time" }, items: [
          { icon: "users", title: "Industry Experts", text: "Speakers who practise what they teach — founders, CXOs and specialists." },
          { icon: "headset", title: "Live & Interactive", text: "Real-time Q&A, polls and breakout discussions, online or on-site." },
          { icon: "award", title: "Certificates", text: "Earn a verifiable participation certificate for every event." },
          { icon: "book-open", title: "Recordings & Notes", text: "Replays, slides and templates shared after each session." },
          { icon: "handshake", title: "Networking", text: "Meet peers, mentors and potential partners at every event." },
          { icon: "tag", title: "Affordable Access", text: "Free webinars every month and early-bird pricing on all passes." },
        ] } },
        { type: "steps", style: { layout: "timeline" }, content: { eyebrow: "SUMMIT DAY", title: "12 December at a", titleHighlight: "Glance", items: [
          { title: "9:30 AM · Check-in & Breakfast", text: "Collect your badge and welcome kit", icon: "check" },
          { title: "10:30 AM · Opening Keynote", text: "Scaling a business in the new India", icon: "star" },
          { title: "11:30 AM · Founders' Panel", text: "Marketing, funding & talent in 2027", icon: "users" },
          { title: "1:00 PM · Networking Lunch", text: "Speed-networking tables by industry", icon: "utensils" },
          { title: "2:30 PM · Masterclass Tracks", text: "Growth, finance and AI — pick one", icon: "book-open" },
          { title: "5:30 PM · Awards & High Tea", text: "Certificates and evening networking", icon: "award" },
        ] } },
        { type: "pricingPlans", style: { background: "light" }, content: { eyebrow: "PASSES", title: "Pick Your", titleHighlight: "Pass", plans: [
          { name: "Free Webinar", price: "₹0", period: "per session", features: ["Live online access", "Q&A with the speaker", "Participation certificate", "Replay for 48 hours"], featured: false, buttonLabel: "Register Free", buttonHref: "/register" },
          { name: "Standard Pass", price: "₹2,499", period: "per person", features: ["Full-day summit access", "All keynotes & panels", "Lunch & refreshments", "Recordings & slides", "Certificate"], featured: true, buttonLabel: "Book Standard", buttonHref: "/tickets" },
          { name: "VIP / Corporate", price: "₹7,999", period: "per person", features: ["Front-row seating", "Speaker meet & greet", "Exclusive masterclass", "VIP networking dinner", "Group of 5+ gets 15% off"], featured: false, buttonLabel: "Book VIP", buttonHref: "/tickets" },
        ] } },
        { type: "testimonials", style: { layout: "dark", background: "dark" }, content: { eyebrow: "ATTENDEE STORIES", title: "What Attendees", titleHighlight: "Say", items: [
          { name: "Neha Kapoor", role: "Marketing Manager · Growth Summit", text: "Best-organised conference I've attended in years. Every session was practical and the networking alone was worth the pass.", rating: 5 },
          { name: "Vikram Iyer", role: "Founder · Startup Funding Seminar", text: "I left with three investor contacts and a much sharper pitch deck. The pitch clinic was fantastic.", rating: 5 },
          { name: "Ananya Rao", role: "L&D Head · Corporate Training", text: "We trained 60 managers with their leadership program. Custom content, great trainers and measurable results.", rating: 5 },
        ] } },
        { type: "gallery", style: { layout: "strip" }, content: { eyebrow: "HIGHLIGHTS", title: "Moments From", titleHighlight: "Past Events" } },
        { type: "faq", style: { layout: "split", background: "light" }, content: { ...{ intro: "Joining links, certificates, refunds and group bookings — all in one place." }, eyebrow: "FAQ", title: "Before You", titleHighlight: "Register", items: [
          { q: "How do I join an online webinar?", a: "After registering you'll receive a confirmation with the joining link on email and WhatsApp, plus a reminder 1 hour before the session." },
          { q: "Will I get a certificate?", a: "Yes. All attendees who join the live session receive a digital participation certificate. Workshops include a completion certificate." },
          { q: "Are recordings available?", a: "Standard and VIP pass holders get access to recordings and slides. Free webinar replays are available for a limited time." },
          { q: "Can I get a refund or transfer my pass?", a: "Passes can be transferred to a colleague at no cost. Refunds are available up to 7 days before paid events." },
          { q: "Do you offer group or corporate bookings?", a: "Yes — groups of 5+ get special pricing, and we design custom in-house training programs for companies." },
          { q: "Is there parking and food at offline events?", a: "Yes. Venues have paid parking, and all full-day passes include breakfast, lunch and high tea with veg and Jain options." },
        ] } },
        { type: "cta", style: { layout: "minimal" }, content: { title: "Seats fill up fast", highlight: "Reserve Yours Today", phones: ["9000000000"], buttonLabel: "Register Now", buttonHref: "/register" } },
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
        { name: "Raghav Bhatia", role: "Founder & CEO, Growth Startup", image: "", note: "Keynote · Growth Summit" },
        { name: "Sunita Menon", role: "Head of Marketing, Consumer Brand", image: "", note: "Digital Marketing" },
        { name: "CA Abhishek Jain", role: "Chartered Accountant & Investor", image: "", note: "Personal Finance" },
        { name: "Farah Khan Mirza", role: "Leadership Coach", image: "", note: "Public Speaking" },
        { name: "Dr. Kiran Rao", role: "Data Science Lead", image: "", note: "Analytics & AI" },
        { name: "Manish Agarwal", role: "Angel Investor", image: "", note: "Startup Funding" },
        { name: "Lavanya Krishnan", role: "CHRO, IT Services", image: "", note: "HR & Culture" },
        { name: "Gurpreet Sandhu", role: "Sales Director", image: "", note: "Negotiation" },
      ] } },
      { type: "faq", style: { layout: "split", background: "light" }, content: { ...{ intro: "Have a talk that changes how people work? Here's how speaking with us works." }, eyebrow: "FOR SPEAKERS", title: "Speaking", titleHighlight: "With Us", items: [
        { q: "How are speakers selected?", a: "We look for practitioners with real results and a clear, practical talk. Share a 2-minute video and your topic outline." },
        { q: "Are speakers paid?", a: "Keynote and workshop speakers receive an honorarium plus travel; webinar speakers get promotion, recordings and leads." },
        { q: "Can I run a paid workshop on your platform?", a: "Yes. We handle marketing, ticketing and hosting on a revenue-share basis." },
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
      { type: "testimonials", style: { background: "light" }, content: { eyebrow: "GROWTH SUMMIT 2025", title: "What Attendees", titleHighlight: "Said", items: [
        { name: "Ananya Rao", role: "Founder, D2C brand", text: "Twenty speakers, zero fluff. I left with three partnerships and a full notebook.", rating: 5 },
        { name: "Vikram Shah", role: "Head of Sales", text: "Smooth check-in, great networking lounges and sessions that started on time.", rating: 5 },
        { name: "Priya Menon", role: "Marketing Manager", text: "The workshops alone were worth the pass. Already registered for the next edition.", rating: 5 },
      ] } },
      { type: "stats", content: { items: [ { value: "250+", label: "Events Hosted", icon: "calendar" }, { value: "40,000+", label: "Attendees", icon: "users" }, { value: "60+", label: "Corporate Clients", icon: "handshake" }, { value: "4.8/5", label: "Avg. Rating", icon: "star" } ] } },
      { type: "cta", content: { title: "Be part of the next one", highlight: "See Upcoming Events", phones: ["9000000000"], buttonLabel: "Upcoming Events", buttonHref: "/events" } },
    ] },
    { slug: "about", title: "About Us", isSystem: true, order: 8, sections: [
      { type: "about", content: { eyebrow: "ABOUT US", title: "Events That", titleHighlight: "Create Impact", body: [`${biz} curates learning experiences for ambitious professionals and teams — free webinars, focused workshops and flagship conferences.`, "We work with practitioners, not just presenters, so every session leaves you with ideas you can use the very next day."], image: "", points: ["250+ events delivered", "Online, offline & hybrid", "Expert speaker network", "End-to-end event management"], buttonLabel: "Upcoming Events", buttonHref: "/events" } },
      { type: "stats", style: { layout: "cards", background: "light" }, content: { items: [ { value: "8 yrs", label: "Running Events", icon: "calendar" }, { value: "60+", label: "Corporate Clients", icon: "handshake" }, { value: "14", label: "Cities Covered", icon: "map-pin" }, { value: "92%", label: "Would Recommend", icon: "thumbs-up" } ] } },
      { type: "testimonials", style: { layout: "minimal" }, content: { eyebrow: "PARTNERS", title: "Why Teams", titleHighlight: "Work With Us", items: [
        { name: "Rahul Desai", role: "Co-founder, SaaS startup", text: "We co-hosted a founders' meetup with them — 300 sign-ups, zero chaos, and a guest list that actually showed up.", rating: 5 },
        { name: "Priyanka Ghosh", role: "HR Business Partner", text: "Our POSH and first-time-manager programs were delivered across three cities without a single hiccup.", rating: 5 },
      ] } },
      { type: "cta", content: { title: "Join our next event", highlight: "Register Now", phones: ["9000000000"], buttonLabel: "Register Now", buttonHref: "/register" } },
    ] },
    { slug: "contact", title: "Contact", isSystem: true, order: 9, sections: [
      { type: "contactInfo", content: { eyebrow: "REACH US", title: "Get In", titleHighlight: "Touch", address: "Your City", phone: "9000000000", email: "hello@example.com", hours: "Mon–Sat: 10am – 7pm", mapEmbed: "" } },
      { type: "contactForm", style: { background: "light" }, content: { title: "Send Us a Message", subtitle: "Questions about an event, speaking, sponsorship or partnerships — we reply within one working day." } },
    ] },
  ],
};
