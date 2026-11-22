import type { TemplateDef } from "./types";

// Wedding Planner: romantic rose + ivory/gold — destination weddings, décor,
// venue sourcing, mehendi/sangeet, packages and a real-weddings portfolio.
export const weddingPlanner: TemplateDef = {
  theme: {
    colors: { primary: "#be123c", primaryDark: "#9f1239", secondary: "#b08d57", accent: "#d4af37", dark: "#3b0a1a", light: "#fdf8f0", text: "#5b4a4a", heading: "#3b0a1a" },
    font: "Petrona", radius: "1.5rem",
  },
  header: (biz) => ({
    design: "centered",
    logoText: biz, logoImage: "",
    announcement: { show: true, text: "Now booking 2027 wedding season · Free first consultation for early enquiries", link: "/plan-your-wedding" },
    topbar: { show: true, address: "Destination & Local Weddings · Your City", phones: ["9000000000"], email: "hello@example.com", social: { facebook: "#", instagram: "#", whatsapp: "#" } },
    nav: [
      { label: "Home", href: "/" }, { label: "Services", href: "/services" }, { label: "Destinations", href: "/destinations" }, { label: "Packages", href: "/packages" }, { label: "Real Weddings", href: "/real-weddings" }, { label: "Our Story", href: "/about" }, { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Plan My Wedding", href: "/plan-your-wedding" },
  }),
  footer: (biz) => ({
    design: "classic",
    about: `${biz} plans unforgettable Indian weddings — from intimate mehendi mornings to three-day destination celebrations — so your family can be guests at their own wedding.`,
    columns: [
      { title: "Plan", links: [ { label: "Wedding Services", href: "/services" }, { label: "Packages", href: "/packages" }, { label: "Destinations", href: "/destinations" }, { label: "Start Planning", href: "/plan-your-wedding" } ] },
      { title: "Inspiration", links: [ { label: "Real Weddings", href: "/real-weddings" }, { label: "Our Story", href: "/about" }, { label: "Contact", href: "/contact" } ] },
    ],
    serviceAreas: ["Destination Weddings", "Décor & Design", "Venue Sourcing", "Mehendi & Sangeet", "Catering Coordination", "Guest Hospitality"],
    contact: { phones: ["9000000000"], email: "hello@example.com", address: "Your City" },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. Crafted with love, planned to perfection.`,
  }),
  seo: (biz) => ({
    title: `${biz} — Wedding Planner for Destination & Indian Weddings`,
    description: "Full-service Indian wedding planning: destination weddings, venue sourcing, décor, mehendi & sangeet, catering coordination, photography tie-ups and guest hospitality.",
    keywords: "wedding planner, destination wedding India, wedding decorator, mehendi sangeet planner, wedding management, Indian wedding planner",
    businessType: "LocalBusiness", priceRange: "₹₹₹",
    favicon: "", ogImage: "",
  }),
  services: [
    { category: "Full Wedding Planning", title: "End-to-End Wedding Management", description: "One team from roka to vidaai — budgets, vendors, timelines and on-day coordination." },
    { category: "Full Wedding Planning", title: "Destination Weddings", description: "Udaipur palaces, Goa beaches, Jim Corbett resorts — travel, stays and logistics handled." },
    { category: "Full Wedding Planning", title: "Venue Sourcing & Negotiation", description: "Shortlists matched to your guest count and budget, with site visits and contract support." },
    { category: "Décor & Design", title: "Theme & Mandap Décor", description: "Floral mandaps, stage design, lighting and entry concepts designed around your story." },
    { category: "Décor & Design", title: "Mehendi & Haldi Set-ups", description: "Marigold canopies, swings, floor seating and photo corners for daytime functions." },
    { category: "Décor & Design", title: "Sangeet Stage & Production", description: "LED stage, sound, choreographer coordination and cue-to-cue show running." },
    { category: "Celebrations & Hospitality", title: "Catering Coordination", description: "Menu tastings, live counters and caterer management for every function." },
    { category: "Celebrations & Hospitality", title: "Guest Hospitality & RSVP", description: "Welcome hampers, airport pickups, room blocks and a dedicated guest helpdesk." },
    { category: "Celebrations & Hospitality", title: "Baraat & Entertainment", description: "Ghodi, dhol, band, fireworks permits and celebrity or artist bookings." },
    { category: "Celebrations & Hospitality", title: "Photography & Makeup Tie-ups", description: "Curated photographers, cinematographers and bridal makeup artists at partner rates." },
  ],
  gallery: [
    ...["Floral mandap at sunset", "Lakeside pheras in Udaipur", "Bride's grand entry under phoolon ki chadar"].map((c) => ({ category: "Weddings", caption: c })),
    ...["Marigold mehendi lounge", "Haldi with pastel drapes", "Sangeet stage with LED backdrop"].map((c) => ({ category: "Functions", caption: c })),
    ...["Beach wedding in Goa", "Palace courtyard reception", "Hill resort sundowner cocktail"].map((c) => ({ category: "Destinations", caption: c })),
  ],
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "centered", customHtml: "",
          badge: "WEDDING PLANNERS · DÉCOR · DESTINATION WEDDINGS", titleTop: "Your Forever Begins", titleHighlight: "Beautifully Planned",
          subtitle: "", description: `From the first roka to the last vidaai, ${biz} designs and manages every detail of your wedding — so you and your family simply celebrate.`, image: "",
          primaryBtn: { label: "Plan My Wedding", href: "/plan-your-wedding" }, secondaryBtn: { label: "See Real Weddings", href: "/real-weddings" },
          features: [ { icon: "heart", title: "300+ Weddings", text: "" }, { icon: "plane", title: "Destination Experts", text: "" }, { icon: "star", title: "Bespoke Décor", text: "" }, { icon: "handshake", title: "Trusted Vendors", text: "" } ],
        } },
        { type: "about", style: { layout: "stacked" }, content: { eyebrow: "WELCOME", title: "Weddings That Feel", titleHighlight: "Like You", body: [`At ${biz}, we believe a wedding should look and feel like the couple — not like the last one at the same venue.`, "Our planners, designers and on-ground crew have managed celebrations from 80 to 1,500 guests across India and abroad, with one promise: no stress for the families."], image: "", points: ["Dedicated wedding manager", "Transparent vendor pricing", "Day-by-day timeline", "On-site crew on every function", "Two-culture & inter-faith weddings", "Eco-friendly décor options"], buttonLabel: "Our Story", buttonHref: "/about" } },
        { type: "stats", style: { layout: "minimal" }, content: { items: [ { value: "300+", label: "Weddings Planned", icon: "heart" }, { value: "18", label: "Destinations", icon: "plane" }, { value: "150+", label: "Partner Vendors", icon: "handshake" }, { value: "4.9/5", label: "Couple Rating", icon: "star" } ] } },
        { type: "serviceCategories", style: { layout: "tiles", background: "light" }, content: { eyebrow: "WHAT WE DO", title: "Every Ritual,", titleHighlight: "Perfectly Planned", categories: ["Full Wedding Planning", "Décor & Design", "Celebrations & Hospitality"] } },
        { type: "testimonials", style: { layout: "featured" }, content: { eyebrow: "LOVE NOTES", title: "Words From Our", titleHighlight: "Couples", items: [
          { name: "Riya & Arjun", role: "Udaipur · 3-day destination wedding", text: "Our families flew in from four countries and every single guest felt looked after. The lakeside pheras were straight out of a dream — and we didn't take a single vendor call all week.", rating: 5 },
          { name: "Sneha & Karthik", role: "Your City · 650 guests", text: "A Tamil–Punjabi wedding with two sets of rituals — they made both families feel at home and kept every function on time.", rating: 5 },
          { name: "Mansi Agarwal", role: "Mother of the bride", text: "I actually enjoyed my daughter's wedding instead of running around. That is the biggest compliment I can give.", rating: 5 },
          { name: "Aisha & Imran", role: "Nikah & Walima · 400 guests", text: "Elegant, thoughtful and perfectly managed — our families still talk about the décor.", rating: 5 },
        ] } },
        { type: "gallery", style: { layout: "masonry", background: "light" }, content: { eyebrow: "REAL WEDDINGS", title: "Moments We've", titleHighlight: "Created" } },
        { type: "steps", style: { layout: "timeline" }, content: { eyebrow: "HOW WE PLAN", title: "From Hello to", titleHighlight: "Happily Ever After", items: [
          { title: "Coffee Consultation", text: "We listen to your story, style, guest list and budget", icon: "heart" },
          { title: "Concept & Budget", text: "Mood boards, venue shortlist and a line-item budget within a week", icon: "edit" },
          { title: "Vendor Curation", text: "Décor, caterer, photographer, makeup — booked and managed", icon: "handshake" },
          { title: "Guest Logistics", text: "RSVPs, room blocks, pickups and welcome hampers", icon: "plane" },
          { title: "Wedding Week", text: "Our crew runs every function so you never pick up the phone", icon: "calendar" },
        ] } },
        { type: "imageBanner", content: { title: "Dreaming of a palace or a beach?", subtitle: "Udaipur, Jaipur, Goa, Kerala, Rishikesh and beyond — we scout, negotiate and manage destination weddings end to end.", buttonLabel: "Explore Destinations", buttonHref: "/destinations", image: "" } },
        { type: "pricingPlans", content: { eyebrow: "PLANNING PACKAGES", title: "Choose Your", titleHighlight: "Package", plans: [
          { name: "Day-of Coordination", price: "₹75,000", period: "per wedding", features: ["Coordinator from 4 weeks out", "Vendor confirmations", "Function-day timeline", "Crew of 4 on the day"], featured: false, buttonLabel: "Enquire", buttonHref: "/plan-your-wedding" },
          { name: "Signature Wedding", price: "₹2,50,000", period: "planning fee", features: ["Full planning for 3 functions", "Venue sourcing & negotiation", "Décor concept & styling", "Guest hospitality desk", "Crew of 10 on all days"], featured: true, buttonLabel: "Enquire", buttonHref: "/plan-your-wedding" },
          { name: "Royal Destination", price: "₹5,00,000", period: "planning fee", features: ["Unlimited functions", "Destination recce visits", "Travel & room-block management", "Artist & entertainment booking", "Dedicated design team"], featured: false, buttonLabel: "Enquire", buttonHref: "/plan-your-wedding" },
        ] } },
        { type: "team", style: { layout: "list", background: "light" }, content: { eyebrow: "THE PLANNERS", title: "The People Behind", titleHighlight: "Your Big Day", members: [
          { name: "Kavya Malhotra", role: "Founder & Lead Planner", image: "", note: "300+ weddings across 18 destinations" },
          { name: "Aditya Rao", role: "Head of Design", image: "", note: "Mandaps, stage design & floral concepts" },
          { name: "Meera Iyer", role: "Hospitality Lead", image: "", note: "Guest travel, stays & helpdesk" },
          { name: "Sameer Khan", role: "Production Manager", image: "", note: "Sound, light, permits & logistics" },
        ] } },
        { type: "logos", content: { title: "Our trusted partner network", items: ["Floral Studio", "Royal Caterers", "Candid Frames", "Glam Bridal", "Sound & Light Co.", "Heritage Stays"] } },
        { type: "faq", content: { eyebrow: "FAQ", title: "Planning", titleHighlight: "Questions", items: [
          { q: "How early should we book a wedding planner?", a: "Ideally 8–12 months before the date for peak season (Nov–Feb) and destination weddings. We have also delivered beautiful weddings in 6–8 weeks." },
          { q: "Do you work within a fixed budget?", a: "Yes. We build a line-item budget on day one and share vendor quotes transparently, so there are no surprises." },
          { q: "Can we use our own photographer or caterer?", a: "Absolutely. We coordinate with your vendors or recommend from our trusted partner list at pre-negotiated rates." },
          { q: "Do you plan only destination weddings?", a: "No — we plan local weddings in Your City as often as destination celebrations, from intimate 80-guest ceremonies to grand receptions." },
          { q: "Do you handle muhurat-based scheduling?", a: "Yes. We build the function timeline around your pandit's muhurat, including late-night pheras and early-morning rituals." },
        ] } },
        { type: "cta", style: { background: "primary" }, content: { title: "Let's start planning", highlight: "Your Big Day", phones: ["9000000000"], buttonLabel: "Book a Free Consultation", buttonHref: "/plan-your-wedding" } },
      ],
    },
    { slug: "services", title: "Services", isSystem: true, order: 1, sections: [
      { type: "serviceCategories", content: { eyebrow: "SERVICES", title: "Wedding", titleHighlight: "Services", categories: ["Full Wedding Planning", "Décor & Design", "Celebrations & Hospitality"] } },
      { type: "features", style: { background: "light", cardRadius: "lg" }, content: { items: [
        { icon: "star", title: "Mehendi & Haldi", text: "Colourful daytime set-ups with dhol, chaat counters and mehendi artists." },
        { icon: "zap", title: "Sangeet Nights", text: "Stage, lights, DJ, choreographer and a rehearsed show flow." },
        { icon: "heart", title: "Wedding Ceremony", text: "Mandap, pandit coordination, varmala stage and phoolon ki chadar." },
        { icon: "utensils", title: "Reception & Dinner", text: "Menu curation, live counters, bar coordination and seating plans." },
        { icon: "instagram", title: "Photo & Film Tie-ups", text: "Candid photographers and cinematographers matched to your style." },
        { icon: "gift", title: "Trousseau & Hampers", text: "Welcome kits, room hampers and return gifts for every guest." },
      ] } },
      { type: "logos", content: { title: "Our trusted partner network", items: ["Floral Studio", "Royal Caterers", "Candid Frames", "Glam Bridal", "Sound & Light Co.", "Heritage Stays"] } },
      { type: "steps", style: { layout: "cards" }, content: { eyebrow: "WEDDING WEEK", title: "Function by", titleHighlight: "Function", items: [
        { title: "Day 1 · Haldi & Mehendi", text: "Marigold set-ups, dhol, chaat counters and mehendi artists", icon: "leaf" },
        { title: "Day 1 · Sangeet", text: "Stage, LED, DJ and a rehearsed family performance flow", icon: "zap" },
        { title: "Day 2 · Baraat & Pheras", text: "Ghodi, band, varmala stage and mandap with pandit coordination", icon: "heart" },
        { title: "Day 3 · Reception", text: "Couple entry, dinner, live counters and send-off", icon: "star" },
      ] } },
      { type: "cta", content: { title: "Need just décor or the full wedding?", highlight: "We Do Both", phones: ["9000000000"], buttonLabel: "Get a Proposal", buttonHref: "/plan-your-wedding" } },
    ] },
    { slug: "destinations", title: "Destinations", isSystem: true, order: 2, sections: [
      { type: "banner", content: { title: "Destination", titleHighlight: "Weddings", subtitle: "Palaces, beaches, backwaters and mountains — celebrated your way.", image: "", bgColor: "", imageOpacity: 60, overlayOpacity: 50 } },
      { type: "priceList", content: { eyebrow: "WHERE WE PLAN", title: "Popular", titleHighlight: "Destinations", note: "Indicative planning-fee starting points for 150 guests over 2–3 days. Venue, stay and vendor costs are quoted separately.", groups: [
        { category: "Rajasthan", items: [ { name: "Udaipur — lake palaces", price: "from ₹4,50,000", note: "Best Oct–Mar" }, { name: "Jaipur — heritage forts", price: "from ₹3,75,000", note: "Best Nov–Feb" }, { name: "Jodhpur — desert camps", price: "from ₹3,50,000", note: "Best Nov–Feb" } ] },
        { category: "Coast & Backwaters", items: [ { name: "Goa — beach resorts", price: "from ₹3,25,000", note: "Best Nov–Mar" }, { name: "Kerala — backwater villas", price: "from ₹3,50,000", note: "Best Sep–Mar" } ] },
        { category: "Hills", items: [ { name: "Rishikesh — riverside", price: "from ₹2,75,000", note: "Best Oct–Apr" }, { name: "Mussoorie — mountain resorts", price: "from ₹3,00,000", note: "Best Mar–Jun" } ] },
      ] } },
      { type: "steps", style: { background: "light" }, content: { eyebrow: "DESTINATION LOGISTICS", title: "We Handle the", titleHighlight: "Travel Too", items: [
        { title: "Recce Visit", text: "We scout the venue with you, in person or on video", icon: "map" },
        { title: "Room Blocks", text: "Negotiated hotel inventory and rooming lists", icon: "home" },
        { title: "Travel Desk", text: "Flights, trains and airport pickups for guests", icon: "plane" },
        { title: "Local Permits", text: "Venue, sound and fireworks permissions sorted", icon: "shield" },
      ] } },
      { type: "faq", content: { ...{ intro: "Budgets, guest stays and weather backups — what every couple asks before choosing a destination." }, eyebrow: "DESTINATION FAQ", title: "Destination", titleHighlight: "Questions", items: [
        { q: "What does a destination wedding for 150 guests cost overall?", a: "Most of our 2–3 day destination weddings for 150 guests land between ₹45 lakh and ₹1.2 crore including venue, stay, food and décor. We build your budget line by line." },
        { q: "Can guests pay for their own rooms?", a: "Yes. We set up a room block and a guest booking link so families can choose to pay directly." },
        { q: "What if it rains?", a: "Every outdoor function has a covered backup plan confirmed at the recce stage." },
      ] }, style: { layout: "split" } },
      { type: "cta", content: { title: "Found your dream destination?", highlight: "Let's Plan It", phones: ["9000000000"], buttonLabel: "Start Planning", buttonHref: "/plan-your-wedding" } },
    ] },
    { slug: "packages", title: "Packages", isSystem: true, order: 3, sections: [
      { type: "pricingPlans", content: { eyebrow: "PLANNING PACKAGES", title: "Choose Your", titleHighlight: "Package", plans: [
        { name: "Day-of Coordination", price: "₹75,000", period: "per wedding", features: ["Coordinator from 4 weeks out", "Vendor confirmations", "Function-day timeline", "Crew of 4 on the day"], featured: false, buttonLabel: "Enquire", buttonHref: "/plan-your-wedding" },
        { name: "Signature Wedding", price: "₹2,50,000", period: "planning fee", features: ["Full planning for 3 functions", "Venue sourcing & negotiation", "Décor concept & styling", "Guest hospitality desk", "Crew of 10 on all days"], featured: true, buttonLabel: "Enquire", buttonHref: "/plan-your-wedding" },
        { name: "Royal Destination", price: "₹5,00,000", period: "planning fee", features: ["Unlimited functions", "Destination recce visits", "Travel & room-block management", "Artist & entertainment booking", "Dedicated design team"], featured: false, buttonLabel: "Enquire", buttonHref: "/plan-your-wedding" },
      ] } },
      { type: "priceList", style: { background: "light" }, content: { eyebrow: "À LA CARTE", title: "Add-on", titleHighlight: "Services", note: "Prices exclusive of GST. Final quotes depend on guest count, venue and date.", groups: [
        { category: "Décor", items: [ { name: "Mehendi / Haldi décor", price: "from ₹85,000", note: "Up to 150 guests" }, { name: "Floral mandap", price: "from ₹1,20,000", note: "Fresh & imported flowers" }, { name: "Sangeet stage & lighting", price: "from ₹1,50,000", note: "LED wall, sound, trussing" } ] },
        { category: "Hospitality", items: [ { name: "Welcome hampers", price: "from ₹650", note: "Per room" }, { name: "Guest helpdesk", price: "₹25,000", note: "Per day" }, { name: "Baraat with dhol & band", price: "from ₹45,000", note: "2 hours" } ] },
      ] } },
      { type: "faq", content: { eyebrow: "", title: "Package", titleHighlight: "FAQs", items: [
        { q: "Is the planning fee separate from vendor costs?", a: "Yes. Our fee covers planning and management; venue, décor, catering and other vendors are billed at actual, quoted transparently." },
        { q: "What is the payment schedule?", a: "40% on booking, 40% three months before the wedding, and 20% one week before the first function." },
        { q: "Can a package be customised?", a: "Every package is a starting point — we add or remove functions and services to fit your plan." },
      ] } },
      { type: "cta", content: { title: "Not sure which package fits?", highlight: "Talk to a Planner", phones: ["9000000000"], buttonLabel: "Book a Consultation", buttonHref: "/plan-your-wedding" } },
    ] },
    { slug: "real-weddings", title: "Real Weddings", isSystem: true, order: 4, sections: [
      { type: "gallery", content: { eyebrow: "PORTFOLIO", title: "Real", titleHighlight: "Weddings" } },
      { type: "imageBanner", content: { title: "Riya & Arjun in Udaipur", subtitle: "Three days, 280 guests and lakeside pheras at golden hour — planned end to end by our team.", buttonLabel: "Plan Your Wedding", buttonHref: "/plan-your-wedding", image: "" } },
      { type: "testimonials", style: { background: "light" }, content: { eyebrow: "", title: "Couples", titleHighlight: "Remember", items: [
        { name: "Pooja & Rahul", role: "Goa beach wedding", text: "The sunset pheras by the sea were magical. They even planned a monsoon backup we thankfully never needed.", rating: 5 },
        { name: "Aisha & Imran", role: "Your City · Nikah & Walima", text: "Elegant, thoughtful and perfectly managed — our families still talk about the décor.", rating: 5 },
        { name: "Divya & Rohan", role: "Rishikesh riverside wedding", text: "An intimate 90-guest wedding that felt personal in every little detail.", rating: 5 },
      ] } },
      { type: "cta", content: { title: "Your story could be next", highlight: "Let's Create It", phones: ["9000000000"], buttonLabel: "Plan My Wedding", buttonHref: "/plan-your-wedding" } },
    ] },
    { slug: "about", title: "Our Story", isSystem: true, order: 5, sections: [
      { type: "about", content: { eyebrow: "OUR STORY", title: "Planners at Heart,", titleHighlight: "Family by Choice", body: [`${biz} began with one sister's wedding and a notebook full of lists. Ten years later, we are a team of 25 planners, designers and on-ground coordinators.`, "We still plan every wedding the way we planned that first one — personally, patiently and with a lot of love."], image: "", points: ["10+ years of weddings", "Team of 25 specialists", "Planned in 18 destinations", "Vendor network of 150+"], buttonLabel: "See Our Work", buttonHref: "/real-weddings" } },
      { type: "team", style: { background: "light", cardRadius: "lg" }, content: { eyebrow: "THE TEAM", title: "Meet Your", titleHighlight: "Planners", members: [
        { name: "Kavya Malhotra", role: "Founder & Lead Planner", image: "", note: "300+ weddings" },
        { name: "Aditya Rao", role: "Head of Design", image: "", note: "Mandaps & stage design" },
        { name: "Meera Iyer", role: "Hospitality Lead", image: "", note: "Guest experience" },
        { name: "Sameer Khan", role: "Production Manager", image: "", note: "Sound, light & logistics" },
      ] } },
      { type: "stats", content: { items: [ { value: "10+", label: "Years", icon: "calendar" }, { value: "300+", label: "Weddings", icon: "heart" }, { value: "1,50,000+", label: "Guests Hosted", icon: "users" }, { value: "25", label: "Team Members", icon: "user-check" } ] } },
      { type: "cta", content: { title: "We'd love to hear your story", highlight: "Say Hello", phones: ["9000000000"], buttonLabel: "Contact Us", buttonHref: "/contact" } },
    ] },
    { slug: "plan-your-wedding", title: "Plan Your Wedding", isSystem: true, order: 6, showInNav: false, sections: [
      { type: "quoteForm", content: { title: "Tell Us About Your Wedding", subtitle: "Share your dates, city or destination, guest count and functions. Your dedicated planner will call you within 24 hours with ideas and a budget estimate.", showSidebar: true } },
      { type: "features", style: { background: "light" }, content: { items: [
        { icon: "heart", title: "Free First Consultation", text: "No obligation — just ideas and honest advice." },
        { icon: "clipboard", title: "Line-item Budget", text: "A transparent estimate within 3 working days." },
        { icon: "user-check", title: "One Point of Contact", text: "A dedicated planner from start to finish." },
      ] } },
      { type: "testimonials", content: { eyebrow: "", title: "Trusted by", titleHighlight: "300+ Couples", items: [
        { name: "Nikita & Varun", role: "Jaipur · 400 guests", text: "From the first call we knew we were in safe hands. Calm, creative and incredibly organised.", rating: 5 },
        { name: "Tanvi Shah", role: "Bride · Your City", text: "They stuck to our budget and still made everything look luxurious.", rating: 5 },
      ] } },
    ] },
    { slug: "contact", title: "Contact", isSystem: true, order: 7, sections: [
      { type: "contactInfo", content: { eyebrow: "VISIT OUR STUDIO", title: "Let's", titleHighlight: "Meet", address: "Your City", phone: "9000000000", email: "hello@example.com", hours: "Mon–Sat: 11am – 7pm · Sundays by appointment", mapEmbed: "" } },
      { type: "map", content: { eyebrow: "", title: "Find", titleHighlight: "Us", address: "Your City", mapEmbed: "" } },
      { type: "contactForm", style: { background: "light" }, content: { title: "Send Us a Note", subtitle: "Questions about dates, venues or packages — we reply within one working day." } },
    ] },
  ],
};
