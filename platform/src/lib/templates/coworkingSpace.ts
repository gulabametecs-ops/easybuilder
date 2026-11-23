import type { TemplateDef, SectionSeed } from "./types";
import type { SectionContentMap } from "../config";

// Co-working space / business centre: energetic rose + teal on blush, Lexend Deca,
// modern header, centered hero, desk/cabin pricing, amenities, hours and tour booking.
const PHONE = "040 4852 9917";

const cta: SectionSeed<"cta"> = {
  type: "cta",
  content: { title: "Come see the space.", highlight: "Free Day Pass With Every Tour", phones: [PHONE], buttonLabel: "Book a Tour", buttonHref: "/book-tour" },
  style: { background: "primary", layout: "split" },
};

const memberships: SectionSeed<"pricingPlans"> = {
  type: "pricingPlans",
  content: {
    eyebrow: "MEMBERSHIPS", title: "Desks & Cabins,", titleHighlight: "Month to Month",
    plans: [
      { name: "Hot Desk", price: "₹6,499", period: "/month", features: ["Any open desk, 9 AM – 9 PM", "High-speed Wi-Fi & printing", "4 meeting-room hours", "Unlimited tea & coffee"], featured: false, buttonLabel: "Book a Tour", buttonHref: "/book-tour" },
      { name: "Dedicated Desk", price: "₹8,999", period: "/month", features: ["Your own desk & locker", "24×7 access", "8 meeting-room hours", "Business address & mail handling"], featured: true, buttonLabel: "Book a Tour", buttonHref: "/book-tour" },
      { name: "Private Cabin", price: "₹42,000", period: "/month · 4 seats", features: ["Lockable furnished cabin", "Your logo on the door", "20 meeting-room hours", "GST registration address"], featured: false, buttonLabel: "Book a Tour", buttonHref: "/book-tour" },
    ],
  },
  style: { background: "light", cardRadius: "lg", cardShadow: "md" },
};

const onDemand: SectionSeed<"priceList"> = {
  type: "priceList",
  content: {
    eyebrow: "ON DEMAND", title: "Day Passes &", titleHighlight: "Meeting Rooms",
    note: "Prices exclude 18% GST. Members get discounted meeting-room rates.",
    groups: [
      { category: "Passes", items: [
        { name: "Day Pass", price: "₹499", note: "9 AM – 9 PM" },
        { name: "10-Day Flexi Pass", price: "₹3,999", note: "Valid 60 days" },
        { name: "Virtual Office (address + GST)", price: "₹1,499/mo", note: "" },
      ] },
      { category: "Rooms", items: [
        { name: "Meeting Room (6 seats)", price: "₹600/hr", note: "Screen & whiteboard" },
        { name: "Board Room (12 seats)", price: "₹1,400/hr", note: "Video conferencing" },
        { name: "Event Space (60 people)", price: "₹12,000/half day", note: "" },
      ] },
    ],
  },
  style: { cardRadius: "lg" },
};

export const coworkingSpace: TemplateDef = {
  theme: {
    colors: { primary: "#e11d48", primaryDark: "#be123c", secondary: "#1f1720", accent: "#14b8a6", dark: "#1f1720", light: "#fff1f2", text: "#3f3f46", heading: "#1f1720" },
    font: "Lexend Deca", radius: "1.25rem",
  },
  header: (biz) => ({
    design: "modern",
    logoText: biz, logoImage: "",
    announcement: { show: true, text: "Opening offer: first month 20% off on dedicated desks & cabins", link: "/pricing" },
    topbar: { show: false, address: "Hitech City, Hyderabad", phones: [PHONE], email: "hello@example.com", social: { facebook: "#", instagram: "#", whatsapp: "#" } },
    nav: [
      { label: "Home", href: "/" }, { label: "Spaces", href: "/spaces" }, { label: "Pricing", href: "/pricing" },
      { label: "Amenities", href: "/amenities" }, { label: "Gallery", href: "/gallery" }, { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Book a Tour", href: "/book-tour" },
  }),
  footer: (biz) => ({
    design: "gradient",
    about: `${biz} offers hot desks, dedicated desks, private cabins, meeting rooms and virtual offices in Hitech City — flexible monthly plans for freelancers, startups and teams.`,
    columns: [
      { title: "Workspace", links: [ { label: "Spaces", href: "/spaces" }, { label: "Pricing", href: "/pricing" }, { label: "Amenities", href: "/amenities" } ] },
      { title: "Visit", links: [ { label: "Book a Tour", href: "/book-tour" }, { label: "Gallery", href: "/gallery" }, { label: "Contact", href: "/contact" } ] },
    ],
    serviceAreas: ["Hot Desks", "Dedicated Desks", "Private Cabins", "Meeting Rooms", "Virtual Office", "Event Space"],
    contact: { phones: [PHONE], email: "hello@example.com", address: "Hitech City, Hyderabad" },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. Work, together.`,
  }),
  seo: (biz) => ({
    title: `${biz} — Coworking Space, Private Cabins & Meeting Rooms in Hitech City`,
    description: "Flexible coworking in Hyderabad: hot desks from ₹6,499/month, dedicated desks, private cabins, meeting rooms by the hour and virtual offices with GST address.",
    favicon: "", ogImage: "",
    keywords: "coworking space hyderabad, coworking hitech city, private cabin office, meeting room on rent, virtual office gst address, day pass coworking, shared office space",
    businessType: "LocalBusiness", priceRange: "₹₹",
  }),
  services: [
    { category: "Workspaces", title: "Hot Desks", description: "Grab any open desk in our bright, quiet zones — perfect for freelancers." },
    { category: "Workspaces", title: "Dedicated Desks", description: "Your own desk, monitor-ready, with a personal locker and 24×7 access." },
    { category: "Workspaces", title: "Private Cabins", description: "Furnished, lockable cabins for 2 to 20 people, ready on day one." },
    { category: "Meet & Host", title: "Meeting & Board Rooms", description: "Book by the hour with screens, whiteboards and video conferencing." },
    { category: "Meet & Host", title: "Event Space", description: "Host workshops, meetups and launches for up to 60 people." },
    { category: "Business Services", title: "Virtual Office", description: "Prestigious business address for GST and company registration, with mail handling." },
  ],
  gallery: [
    "Open coworking floor", "Window-side hot desks", "Lounge & café", "Meeting room",
    "Private cabin for 6", "Members at work", "Board room", "Reception",
  ].map((caption) => ({ category: "The Space", caption })),
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "centered", customHtml: "",
          badge: "HITECH CITY · 24×7 ACCESS · 350 SEATS", titleTop: "Work Somewhere", titleHighlight: "You Actually Like",
          subtitle: "", description: `${biz} is a bright, fully managed workspace with fast Wi-Fi, great coffee and people worth meeting. Desks, cabins and meeting rooms — month to month.`, image: "",
          primaryBtn: { label: "Book a Free Tour", href: "/book-tour" }, secondaryBtn: { label: "See Pricing", href: "/pricing" },
          features: [
            { icon: "wifi", title: "1 Gbps Wi-Fi", text: "" }, { icon: "clock", title: "24×7 Access", text: "" }, { icon: "users", title: "Community Events", text: "" },
          ],
        } },
        { type: "stats", content: { items: [
          { value: "350", label: "Seats", icon: "users" }, { value: "22", label: "Private Cabins", icon: "building" },
          { value: "8", label: "Meeting Rooms", icon: "calendar" }, { value: "120+", label: "Member Companies", icon: "handshake" },
        ] }, style: { layout: "band", background: "dark" } },
        { type: "serviceCategories", content: { eyebrow: "SPACES", title: "A Space for", titleHighlight: "Every Way You Work", categories: ["Workspaces", "Meet & Host", "Business Services"] }, style: { layout: "tiles", cardRadius: "lg" } },
        memberships,
        { type: "features", content: { items: [
          { icon: "wifi", title: "1 Gbps Wi-Fi + Backup", text: "Dual ISPs and power backup so calls never drop." },
          { icon: "utensils", title: "Café & Pantry", text: "Unlimited tea and coffee, plus an in-house café." },
          { icon: "shield", title: "Secure Access", text: "Biometric entry, CCTV and lockers." },
          { icon: "car", title: "Parking", text: "Car and bike parking in the building basement." },
          { icon: "snowflake", title: "Fully Air-Conditioned", text: "Ergonomic chairs and quiet phone booths." },
          { icon: "sparkles", title: "Daily Housekeeping", text: "Clean desks, washrooms and pantry every day." },
        ] }, style: { layout: "cards", cardRadius: "lg", background: "light" } },
        { type: "about", content: {
          eyebrow: "ABOUT US", title: "Built by Founders,", titleHighlight: "for Founders",
          body: [`${biz} opened in 2019 when two startup founders couldn't find an office that was flexible, affordable and actually pleasant. Today 120+ companies and freelancers work here.`, "We run regular community events — demo days, tax clinics, yoga mornings and Friday chai — so you meet people, not just walls."],
          image: "", points: ["Month-to-month plans", "Move-in within 24 hours", "GST invoice for every plan", "Weekly community events"],
          buttonLabel: "Book a Tour", buttonHref: "/book-tour",
        }, style: { layout: "split" } },
        onDemand,
        { type: "testimonials", content: { eyebrow: "MEMBERS", title: "Why Members", titleHighlight: "Stay", items: [
          { name: "Pranav Reddy", role: "Founder, 8-person SaaS startup", text: "We moved from a dedicated desk to a 10-seat cabin without changing buildings or signing a long lease. Super flexible.", rating: 5 },
          { name: "Divya Menon", role: "Freelance designer", text: "Fast Wi-Fi, good coffee and I've found three clients at community events. Best ₹6,499 I spend every month.", rating: 5 },
          { name: "Imran Ali", role: "Regional manager, logistics firm", text: "Our sales team uses the meeting rooms for client pitches. Professional setup and the staff are always helpful.", rating: 5 },
        ] }, style: { layout: "default" } },
        { type: "faq", content: { eyebrow: "FAQ", title: "Coworking", titleHighlight: "Questions", intro: "Everything you need to know before you move in.", items: [
          { q: "Is there a lock-in period?", a: "No. All plans are month to month with 30 days' notice. Cabins over 10 seats have a 3-month minimum." },
          { q: "Can I register my company or GST here?", a: "Yes. Dedicated desk, cabin and virtual office plans include a business address with the documents needed for GST and MCA registration." },
          { q: "Can I try before I join?", a: "Yes, every tour includes a free day pass." },
          { q: "Are guests allowed?", a: "Yes, members can bring guests to the lounge and meeting rooms." },
        ] } as SectionContentMap["faq"], style: { layout: "split" } },
        cta,
      ],
    },
    { slug: "spaces", title: "Spaces", isSystem: true, order: 1, sections: [
      { type: "banner", content: { title: "Our", titleHighlight: "Spaces", subtitle: "Hot desks, dedicated desks, cabins, meeting rooms and event space.", image: "", bgColor: "", imageOpacity: 45, overlayOpacity: 55 } },
      { type: "serviceCategories", content: { eyebrow: "SPACES", title: "Choose Your", titleHighlight: "Setup", categories: ["Workspaces", "Meet & Host", "Business Services"] }, style: { cardRadius: "lg" } },
      { type: "imageBanner", content: { title: "Cabins that grow with your team", subtitle: "Start with 2 seats and move to 20 in the same building — we'll handle the shift over a weekend.", buttonLabel: "Enquire for a Cabin", buttonHref: "/book-tour", image: "" } },
      cta,
    ] },
    { slug: "pricing", title: "Pricing", isSystem: true, order: 2, sections: [
      memberships,
      onDemand,
      cta,
    ] },
    { slug: "amenities", title: "Amenities", isSystem: true, order: 3, sections: [
      { type: "features", content: { items: [
        { icon: "wifi", title: "1 Gbps Wi-Fi", text: "Dual ISPs with automatic failover." },
        { icon: "zap", title: "Power Backup", text: "100% DG and UPS backup." },
        { icon: "utensils", title: "Café & Pantry", text: "Unlimited tea and coffee." },
        { icon: "shield", title: "Biometric Access", text: "24×7 secure entry with CCTV." },
        { icon: "box", title: "Lockers & Mail", text: "Personal lockers and mail handling." },
        { icon: "tv", title: "AV-Ready Rooms", text: "Screens and video conferencing." },
      ] }, style: { layout: "cards", cardRadius: "lg" } },
      { type: "openingHours", content: { eyebrow: "HOURS", title: "Open When", titleHighlight: "You Work", note: "Dedicated desk and cabin members have 24×7 access.", days: [
        { day: "Monday – Friday", hours: "9:00 AM – 9:00 PM (staffed)" }, { day: "Saturday", hours: "10:00 AM – 6:00 PM" }, { day: "Sunday", hours: "Members only" },
      ] } },
      cta,
    ] },
    { slug: "gallery", title: "Gallery", isSystem: true, order: 4, sections: [
      { type: "gallery", content: { eyebrow: "GALLERY", title: "Take a", titleHighlight: "Look Around" }, style: { layout: "masonry" } },
      cta,
    ] },
    { slug: "book-tour", title: "Book a Tour", isSystem: true, order: 5, sections: [
      { type: "appointmentForm", content: { title: "Book a Tour", subtitle: "Pick a date and time — a community manager will show you around and set up your free day pass." } },
    ] },
    { slug: "contact", title: "Contact Us", isSystem: true, order: 6, sections: [
      { type: "contactInfo", content: { eyebrow: "CONTACT", title: "Find", titleHighlight: "Us", address: "Hitech City, Hyderabad", phone: PHONE, email: "hello@example.com", hours: "Mon – Fri 9 AM – 9 PM · Sat 10 AM – 6 PM", mapEmbed: "" } },
      { type: "map", content: { eyebrow: "LOCATION", title: "In the Heart of", titleHighlight: "Hitech City", address: "Hitech City, Hyderabad", mapEmbed: "" } },
      { type: "contactForm", content: { title: "Send an Enquiry", subtitle: "Team size, move-in date and budget — we'll send options the same day." } },
    ] },
  ],
};
