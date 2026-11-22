import type { TemplateDef } from "./types";

// Banquet & Event Venue: regal purple + champagne gold — halls & lawns with
// capacities, weddings to corporate events, per-plate catering, availability enquiry.
export const banquetHall: TemplateDef = {
  theme: {
    colors: { primary: "#9333ea", primaryDark: "#7e22ce", secondary: "#2e1065", accent: "#eab308", dark: "#1a0b2e", light: "#faf5ff", text: "#44405a", heading: "#2e1065" },
    font: "Libre Franklin", radius: "0.5rem",
  },
  header: (biz) => ({
    design: "modern",
    logoText: biz, logoImage: "",
    announcement: { show: true, text: "Limited dates left for Nov–Feb wedding season · Check availability today", link: "/enquiry" },
    topbar: { show: true, address: "Banquet Halls · Lawns · In-house Catering · Your City", phones: ["9000000000"], email: "hello@example.com", social: { facebook: "#", instagram: "#", whatsapp: "#" } },
    nav: [
      { label: "Home", href: "/" }, { label: "Venues", href: "/venues" }, { label: "Occasions", href: "/occasions" }, { label: "Catering", href: "/catering" }, { label: "Packages", href: "/packages" }, { label: "Gallery", href: "/gallery" }, { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Check Availability", href: "/enquiry" },
  }),
  footer: (biz) => ({
    design: "centered",
    about: `${biz} — elegant AC banquet halls and landscaped lawns for weddings, receptions, birthdays and corporate events, with in-house catering, décor and parking for 300 cars.`,
    columns: [
      { title: "Venue", links: [ { label: "Halls & Lawns", href: "/venues" }, { label: "Occasions", href: "/occasions" }, { label: "Gallery", href: "/gallery" } ] },
      { title: "Book", links: [ { label: "Catering Menu", href: "/catering" }, { label: "Packages", href: "/packages" }, { label: "Check Availability", href: "/enquiry" }, { label: "Contact", href: "/contact" } ] },
    ],
    serviceAreas: ["Weddings", "Receptions", "Engagements", "Birthdays", "Corporate Events", "Kitty Parties"],
    contact: { phones: ["9000000000"], email: "hello@example.com", address: "Your City" },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. Celebrate in grandeur.`,
  }),
  seo: (biz) => ({
    title: `${biz} — Banquet Hall & Lawn for Weddings, Parties & Corporate Events`,
    description: "AC banquet halls and open lawns for 50 to 1,500 guests. Weddings, receptions, birthdays and corporate events with in-house veg & non-veg catering, décor and ample parking.",
    keywords: "banquet hall, wedding venue, marriage lawn, party hall, reception venue, corporate event venue, banquet near me, catering per plate",
    businessType: "EventVenue", priceRange: "₹₹",
    favicon: "", ogImage: "",
  }),
  services: [
    { category: "Halls & Lawns", title: "Grand Ballroom", description: "Pillar-less AC hall · 400 seated / 700 floating · 12,000 sq ft." },
    { category: "Halls & Lawns", title: "Royal Lawn", description: "Open landscaped lawn · up to 1,500 guests · ideal for weddings & sangeet." },
    { category: "Halls & Lawns", title: "Crystal Hall", description: "Mid-size AC hall · 150 seated / 250 floating · engagements & receptions." },
    { category: "Halls & Lawns", title: "Pearl Lounge", description: "Intimate private lounge · 40–80 guests · birthdays, kitty parties, meetings." },
    { category: "Occasions", title: "Weddings & Receptions", description: "Mandap, varmala stage, bridal room and baraat entry — all on one campus." },
    { category: "Occasions", title: "Engagements & Ring Ceremonies", description: "Elegant stage set-ups and couple entries for 100–300 guests." },
    { category: "Occasions", title: "Birthdays & Anniversaries", description: "Themed décor, cake table, DJ and kids' play zone." },
    { category: "Occasions", title: "Corporate Events", description: "Conferences, award nights and dealer meets with AV, stage and Wi-Fi." },
    { category: "Catering & Décor", title: "In-house Veg Catering", description: "North Indian, South Indian, Chinese and live counters from ₹750 per plate." },
    { category: "Catering & Décor", title: "Non-Veg & Jain Menus", description: "Separate kitchens for non-veg and Jain food, from ₹950 per plate." },
    { category: "Catering & Décor", title: "Décor & Lighting", description: "In-house floral, stage, LED wall and fairy-light packages." },
  ],
  gallery: [
    ...["Grand Ballroom wedding set-up", "Royal Lawn at night with fairy lights", "Crystal Hall reception stage"].map((c) => ({ category: "Venues", caption: c })),
    ...["Floral mandap on the lawn", "Varmala stage entry", "Sangeet dance floor"].map((c) => ({ category: "Weddings", caption: c })),
    ...["Live chaat counter", "Royal thali buffet spread"].map((c) => ({ category: "Catering", caption: c })),
    ...["Corporate award night", "First birthday theme décor"].map((c) => ({ category: "Events", caption: c })),
  ],
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "split", customHtml: "",
          badge: "BANQUET HALLS · LAWNS · IN-HOUSE CATERING", titleTop: "Grand Celebrations Deserve a", titleHighlight: "Grand Venue",
          subtitle: "", description: `${biz} offers four AC halls and a landscaped lawn for 50 to 1,500 guests — with in-house catering, décor and valet parking, all under one roof.`, image: "",
          primaryBtn: { label: "Check Availability", href: "/enquiry" }, secondaryBtn: { label: "Explore Venues", href: "/venues" },
          features: [ { icon: "users", title: "50–1,500 Guests", text: "" }, { icon: "utensils", title: "In-house Catering", text: "" }, { icon: "truck", title: "300-Car Parking", text: "" }, { icon: "zap", title: "100% Power Backup", text: "" } ],
        } },
        { type: "features", style: { layout: "minimal", background: "light" }, content: { items: [
          { icon: "utensils", title: "In-house Catering", text: "Veg, Jain and non-veg kitchens with 400+ dishes to choose from." },
          { icon: "star", title: "Décor Included", text: "Stage, entry and table décor packages from our in-house team." },
          { icon: "home", title: "Bridal Suites", text: "Two AC bridal & groom rooms with attached washrooms." },
          { icon: "truck", title: "Valet Parking", text: "Secure parking for 300 cars with trained valets." },
          { icon: "zap", title: "Power Backup", text: "Silent generators covering every hall and the lawn." },
          { icon: "shield", title: "Safety First", text: "Fire NOC, CCTV, trained security and wheelchair access." },
        ] } },
        { type: "serviceCategories", style: { layout: "tiles" }, content: { eyebrow: "OUR SPACES", title: "Halls & Lawns for", titleHighlight: "Every Guest List", categories: ["Halls & Lawns"] } },
        { type: "stats", style: { layout: "band", background: "primary" }, content: { items: [ { value: "4 + 1", label: "Halls & Lawn", icon: "home" }, { value: "1,500", label: "Max Guests", icon: "users" }, { value: "2,500+", label: "Events Hosted", icon: "calendar" }, { value: "300", label: "Car Parking", icon: "truck" } ] } },
        { type: "about", style: { layout: "centered" }, content: { eyebrow: "SINCE 2009", title: "17 Years of", titleHighlight: "Hosting Celebrations", body: [`${biz} has hosted more than 2,500 weddings, receptions and corporate evenings. Families who celebrated their own weddings here now book us for their children's.`, "One banquet manager handles your event from the first site visit to the last guest leaving — venue, food, décor and parking, with a single bill."], image: "", points: ["One point of contact", "Single consolidated bill", "Free menu tasting", "Monsoon backup hall", "Fire NOC & CCTV", "Wheelchair accessible"], buttonLabel: "Explore Venues", buttonHref: "/venues" } },
        { type: "serviceCategories", style: { layout: "list", background: "light" }, content: { eyebrow: "OCCASIONS", title: "We Host", titleHighlight: "It All", categories: ["Occasions"] } },
        { type: "priceList", content: { eyebrow: "CATERING", title: "Per-Plate", titleHighlight: "Menus", note: "Minimum 100 plates. Prices exclusive of GST. Free menu tasting for 4 on confirmed bookings.", groups: [
          { category: "Vegetarian", items: [ { name: "Silver Veg Buffet", price: "₹750 / plate", note: "2 starters, 4 mains, 2 desserts" }, { name: "Gold Veg Buffet", price: "₹1,050 / plate", note: "4 starters, live counters, 3 desserts" }, { name: "Platinum Veg Buffet", price: "₹1,450 / plate", note: "Mocktail bar, 6 starters, 4 live counters" } ] },
          { category: "Non-Veg & Jain", items: [ { name: "Non-Veg Buffet", price: "₹950 / plate", note: "Includes 2 non-veg starters & mains" }, { name: "Royal Non-Veg", price: "₹1,350 / plate", note: "Kebab counter, biryani, seafood" }, { name: "Jain Menu", price: "₹850 / plate", note: "Separate Jain kitchen" } ] },
        ] } },
        { type: "imageBanner", content: { title: "Saying 'I do' under the stars?", subtitle: "Our 60,000 sq ft Royal Lawn hosts weddings and sangeets for up to 1,500 guests, with a covered hall as monsoon backup.", buttonLabel: "See the Lawn", buttonHref: "/venues", image: "" } },
        { type: "gallery", style: { background: "dark" }, content: { eyebrow: "GALLERY", title: "Celebrations at", titleHighlight: biz } },
        { type: "testimonials", style: { cardRadius: "md", cardShadow: "md" }, content: { eyebrow: "REVIEWS", title: "Families Who", titleHighlight: "Celebrated Here", items: [
          { name: "Sharma Family", role: "Wedding · 900 guests · Royal Lawn", text: "The lawn looked royal, the food was the talk of the town, and parking for 900 guests was smooth.", rating: 5 },
          { name: "Neeraj Gupta", role: "HR Head · Annual award night", text: "Great AV set-up, punctual service and a very professional banquet team.", rating: 5 },
          { name: "Fatima Sheikh", role: "Daughter's first birthday · Pearl Lounge", text: "Beautiful theme décor and the kids loved the play zone. Hassle-free from booking to bill.", rating: 5 },
        ] } },
        { type: "openingHours", style: { background: "light" }, content: { eyebrow: "SITE VISITS", title: "Come See", titleHighlight: "the Venue", note: "Walk-ins welcome for site visits. Call ahead to book a menu tasting with our chef.", days: [
          { day: "Monday – Saturday", hours: "10:00 AM – 8:00 PM" }, { day: "Sunday", hours: "11:00 AM – 6:00 PM" }, { day: "Event days", hours: "Office open till the last guest leaves" },
        ] } },
        { type: "faq", content: { eyebrow: "FAQ", title: "Booking", titleHighlight: "Questions", items: [
          { q: "How much advance is needed to block a date?", a: "₹51,000 blocks your date for 15 days; 50% is due on confirmation and the balance 7 days before the event." },
          { q: "Can we bring an outside caterer or decorator?", a: "Catering is in-house only. Outside decorators are allowed with a nominal facilitation fee." },
          { q: "Till what time can events run?", a: "Indoor events till 12:30 AM. Lawn music must end by 10 PM as per local rules; pheras can continue after." },
          { q: "Do you have rooms for guests?", a: "We have two bridal suites on campus and tie-ups with three hotels within 2 km at special rates for wedding guests." },
          { q: "Is the venue rent separate from catering?", a: "Venue rent is waived when your catering booking crosses the minimum plate count for that hall." },
        ] } },
        { type: "countdown", style: { background: "dark" }, content: { eyebrow: "WEDDING SEASON 2027–28", title: "Peak Dates", titleHighlight: "Filling Fast", subtitle: "Muhurat dates from November to February book out early. Block yours before the season opens.", targetDate: "2027-11-01T00:00", buttonLabel: "Check Availability", buttonHref: "/enquiry" } },
        { type: "cta", style: { layout: "split" }, content: { title: "Your date might be available", highlight: "Enquire Now", phones: ["9000000000"], buttonLabel: "Check Availability", buttonHref: "/enquiry" } },
      ],
    },
    { slug: "venues", title: "Halls & Lawns", isSystem: true, order: 1, sections: [
      { type: "banner", content: { title: "Halls &", titleHighlight: "Lawns", subtitle: "Four AC halls and one grand lawn — combine them for multi-function weddings.", image: "", bgColor: "#2e1065", imageOpacity: 50, overlayOpacity: 60 } },
      { type: "serviceCategories", content: { eyebrow: "", title: "Choose Your", titleHighlight: "Space", categories: ["Halls & Lawns"] } },
      { type: "priceList", style: { background: "light" }, content: { eyebrow: "CAPACITY & RENT", title: "Venue", titleHighlight: "Capacities", note: "Venue rent is waived on catering bookings above the minimum plate count. Rent shown per 6-hour slot.", groups: [
        { category: "Indoor (AC)", items: [ { name: "Grand Ballroom", price: "₹1,50,000", note: "400 seated · 700 floating" }, { name: "Crystal Hall", price: "₹75,000", note: "150 seated · 250 floating" }, { name: "Pearl Lounge", price: "₹25,000", note: "40–80 guests" } ] },
        { category: "Outdoor", items: [ { name: "Royal Lawn", price: "₹2,25,000", note: "Up to 1,500 guests" }, { name: "Lawn + Ballroom combo", price: "₹3,25,000", note: "Two-function weddings" } ] },
      ] } },
      { type: "features", content: { items: [
        { icon: "home", title: "Bridal Rooms", text: "Two AC suites for the bride and groom." },
        { icon: "truck", title: "300-Car Parking", text: "Valet and separate entry for the baraat." },
        { icon: "zap", title: "Power Backup", text: "Silent DG sets on every space." },
        { icon: "users", title: "Wheelchair Access", text: "Ramps and lifts throughout the campus." },
      ] } },
      { type: "faq", style: { layout: "split", background: "light" }, content: { ...{ intro: "Combining spaces, rain backups and slot timings — answered by our banquet manager." }, eyebrow: "VENUE FAQ", title: "Choosing the", titleHighlight: "Right Space", items: [
        { q: "Can we book the lawn and a hall together?", a: "Yes. Many weddings use the lawn for sangeet and pheras and the Grand Ballroom for the reception — ask for the combo rate." },
        { q: "Is there a backup if it rains?", a: "Every lawn booking includes the Crystal Hall on standby as a monsoon backup at no extra rent." },
        { q: "How many hours is a slot?", a: "Each slot is 6 hours; extra hours are ₹15,000 per hour for halls and ₹25,000 for the lawn." },
      ] } },
      { type: "cta", content: { title: "Want to see it in person?", highlight: "Book a Site Visit", phones: ["9000000000"], buttonLabel: "Schedule Visit", buttonHref: "/enquiry" } },
    ] },
    { slug: "occasions", title: "Occasions", isSystem: true, order: 2, sections: [
      { type: "serviceCategories", content: { eyebrow: "OCCASIONS", title: "Every Celebration,", titleHighlight: "Hosted Right", categories: ["Occasions"] } },
      { type: "steps", style: { background: "light" }, content: { eyebrow: "WEDDING DAY", title: "A Wedding at", titleHighlight: biz, items: [
        { title: "Baraat Arrival", text: "Dedicated entry road with dhol & fireworks zone", icon: "zap" },
        { title: "Varmala & Welcome", text: "Stage on the lawn with welcome drinks", icon: "heart" },
        { title: "Dinner Buffet", text: "Live counters and a separate VIP dining area", icon: "utensils" },
        { title: "Pheras", text: "Mandap with pandit coordination till late night", icon: "star" },
      ] } },
      { type: "features", style: { background: "dark" }, content: { items: [
        { icon: "handshake", title: "Corporate Events", text: "Projector, LED wall, podium mics, Wi-Fi and breakout rooms." },
        { icon: "gift", title: "Birthdays", text: "Theme décor, cake table, DJ and a kids' play zone." },
        { icon: "heart", title: "Anniversaries", text: "Elegant dinners and surprise set-ups for 40–200 guests." },
        { icon: "users", title: "Social Gatherings", text: "Kitty parties, satsangs and community functions." },
      ] } },
      { type: "cta", content: { title: "Planning an occasion?", highlight: "Get a Quote", phones: ["9000000000"], buttonLabel: "Enquire Now", buttonHref: "/enquiry" } },
    ] },
    { slug: "catering", title: "Catering", isSystem: true, order: 3, sections: [
      { type: "about", content: { eyebrow: "IN-HOUSE KITCHEN", title: "Food Guests", titleHighlight: "Remember", body: ["Our 40-member culinary team has cooked for weddings of 1,500 guests without missing a beat.", "Separate veg, Jain and non-veg kitchens, FSSAI-certified, with menu tastings before every wedding."], image: "", points: ["400+ dish menu", "Separate Jain kitchen", "Live counters", "Free menu tasting", "FSSAI certified", "Uniformed service staff"], buttonLabel: "Get a Menu Quote", buttonHref: "/enquiry" } },
      { type: "priceList", style: { background: "light" }, content: { eyebrow: "MENUS", title: "Per-Plate", titleHighlight: "Pricing", note: "Minimum 100 plates. GST extra. Custom menus available.", groups: [
        { category: "Vegetarian", items: [ { name: "Silver Veg", price: "₹750", note: "Welcome drink, 2 starters, 4 mains, 2 desserts" }, { name: "Gold Veg", price: "₹1,050", note: "4 starters, 6 mains, 2 live counters, 3 desserts" }, { name: "Platinum Veg", price: "₹1,450", note: "Mocktail bar, 6 starters, 4 live counters" } ] },
        { category: "Non-Veg", items: [ { name: "Classic Non-Veg", price: "₹950", note: "2 non-veg starters, 2 non-veg mains" }, { name: "Royal Non-Veg", price: "₹1,350", note: "Kebab counter, biryani, seafood option" } ] },
        { category: "Live Counters (add-on)", items: [ { name: "Chaat counter", price: "₹120 / plate", note: "" }, { name: "Pasta / Chinese wok", price: "₹150 / plate", note: "" }, { name: "Jalebi & rabri", price: "₹90 / plate", note: "" } ] },
      ] } },
      { type: "gallery", content: { eyebrow: "", title: "From Our", titleHighlight: "Kitchen" } },
      { type: "testimonials", style: { layout: "minimal" }, content: { eyebrow: "GUESTS ON THE FOOD", title: "Still Talking About", titleHighlight: "the Menu", items: [
        { name: "Agarwal Family", role: "Wedding · 1,100 guests", text: "The dal baati and jalebi-rabri counters had queues all night. Not one dish ran short.", rating: 5 },
        { name: "Jain Family", role: "Engagement · 250 guests", text: "A completely separate Jain kitchen, and the food was as good as the regular menu.", rating: 5 },
      ] } },
      { type: "cta", content: { title: "Book a free tasting", highlight: "for 4 Guests", phones: ["9000000000"], buttonLabel: "Enquire Now", buttonHref: "/enquiry" } },
    ] },
    { slug: "packages", title: "Packages", isSystem: true, order: 4, sections: [
      { type: "pricingPlans", content: { eyebrow: "ALL-INCLUSIVE", title: "Event", titleHighlight: "Packages", plans: [
        { name: "Celebration", price: "₹1,250", period: "per plate", features: ["Crystal Hall or Pearl Lounge", "Gold Veg menu", "Basic stage décor", "DJ for 4 hours", "Min. 100 guests"], featured: false, buttonLabel: "Enquire", buttonHref: "/enquiry" },
        { name: "Wedding Classic", price: "₹1,650", period: "per plate", features: ["Grand Ballroom", "Gold Veg / Non-Veg menu", "Floral stage & entry", "Bridal room", "Valet parking", "Min. 300 guests"], featured: true, buttonLabel: "Enquire", buttonHref: "/enquiry" },
        { name: "Royal Wedding", price: "₹2,250", period: "per plate", features: ["Royal Lawn + Ballroom", "Platinum menu + 4 live counters", "Premium floral mandap", "LED wall & sound", "Fireworks zone", "Min. 500 guests"], featured: false, buttonLabel: "Enquire", buttonHref: "/enquiry" },
      ] } },
      { type: "faq", style: { background: "light" }, content: { eyebrow: "FAQ", title: "Booking", titleHighlight: "Questions", items: [
        { q: "How much advance is needed to block a date?", a: "₹51,000 blocks your date for 15 days; 50% is due on confirmation and the balance 7 days before the event." },
        { q: "Can we bring an outside caterer or decorator?", a: "Catering is in-house only. Outside decorators are allowed with a nominal facilitation fee." },
        { q: "Till what time can events run?", a: "Indoor events till 12:30 AM. Lawn music must end by 10 PM as per local rules; pheras can continue after." },
        { q: "Is alcohol permitted?", a: "Yes, with a valid one-day licence, which our team can help you obtain." },
      ] } },
      { type: "countdown", style: { background: "dark" }, content: { eyebrow: "WEDDING SEASON", title: "Peak Dates", titleHighlight: "Filling Fast", subtitle: "Muhurat dates from November to February book out early. Block yours before the season opens.", targetDate: "2027-11-01T00:00", buttonLabel: "Check Availability", buttonHref: "/enquiry" } },
    ] },
    { slug: "gallery", title: "Gallery", isSystem: true, order: 5, sections: [
      { type: "gallery", content: { eyebrow: "GALLERY", title: "Inside", titleHighlight: biz } },
      { type: "testimonials", style: { background: "light" }, content: { eyebrow: "HOSTS", title: "Celebrations", titleHighlight: "Hosted Here", items: [
        { name: "Neha & Karan", role: "Wedding · 900 guests", text: "The lawn looked unreal at night, and the team ran the baraat-to-vidaai timeline without a single hiccup.", rating: 5 },
        { name: "Mr. Suresh Gupta", role: "50th anniversary dinner", text: "Spotless hall, generous parking and food our relatives still talk about.", rating: 5 },
        { name: "Infotech Solutions", role: "Annual corporate gala", text: "AV, stage and seating were set up exactly to our floor plan. We have already booked next year.", rating: 5 },
      ] } },
      { type: "cta", content: { title: "Loved what you saw?", highlight: "Visit Us", phones: ["9000000000"], buttonLabel: "Book a Site Visit", buttonHref: "/enquiry" } },
    ] },
    { slug: "enquiry", title: "Check Availability", isSystem: true, order: 6, showInNav: false, sections: [
      { type: "quoteForm", content: { title: "Check Date Availability", subtitle: "Tell us your event type, preferred date, guest count and menu preference. Our banquet manager will confirm availability and share a quote within 2 hours.", showSidebar: true } },
      { type: "openingHours", style: { background: "light" }, content: { eyebrow: "SITE VISITS", title: "Visit", titleHighlight: "Timings", note: "Walk-ins welcome; call ahead for menu tastings.", days: [
        { day: "Monday – Saturday", hours: "10:00 AM – 8:00 PM" }, { day: "Sunday", hours: "11:00 AM – 6:00 PM" },
      ] } },
      { type: "features", content: { items: [
        { icon: "clock", title: "Reply in 2 Hours", text: "Fast availability confirmation." },
        { icon: "tag", title: "Transparent Quotes", text: "Per-plate pricing, no hidden charges." },
        { icon: "utensils", title: "Free Tasting", text: "For 4 guests on confirmed bookings." },
      ] } },
    ] },
    { slug: "contact", title: "Contact", isSystem: true, order: 7, sections: [
      { type: "contactInfo", content: { eyebrow: "REACH US", title: "Get In", titleHighlight: "Touch", address: "Your City", phone: "9000000000", email: "hello@example.com", hours: "Daily: 10am – 8pm", mapEmbed: "" } },
      { type: "map", content: { eyebrow: "", title: "How to", titleHighlight: "Reach Us", address: "Your City", mapEmbed: "" } },
      { type: "contactForm", style: { background: "light" }, content: { title: "Send an Enquiry", subtitle: "Questions about halls, menus or décor — our banquet team replies the same day." } },
    ] },
  ],
};
