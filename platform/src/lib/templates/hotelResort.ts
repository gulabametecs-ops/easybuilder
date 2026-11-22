import type { TemplateDef, SectionSeed } from "./types";
import type { SectionContentMap } from "../config";

// Hotel & Resort (rooms & suites, dining, banquets, spa, packages):
// deep teal + brass on ivory, elegant serif, understated square-ish cards.
const PHONE = "9000000000";

const cta: SectionSeed<"cta"> = {
  type: "cta",
  content: { title: "Your stay begins with a single message", highlight: "Best Rates When You Book Direct", phones: [PHONE], buttonLabel: "Check Availability", buttonHref: "/book" },
  style: { background: "dark" },
};

const rooms: SectionSeed<"pricingPlans"> = {
  type: "pricingPlans",
  content: {
    eyebrow: "ROOMS & SUITES", title: "Rest in", titleHighlight: "Quiet Comfort",
    plans: [
      { name: "Deluxe Garden Room", price: "₹5,499", period: "/night", features: ["320 sq ft · king or twin beds", "Private garden-facing balcony", "Breakfast for two included", "Rain shower & premium toiletries"], featured: false, buttonLabel: "Enquire", buttonHref: "/book" },
      { name: "Premier Pool View", price: "₹7,999", period: "/night", features: ["420 sq ft · king bed", "Direct view of the infinity pool", "Breakfast & evening high-tea", "Complimentary minibar", "Late check-out till 1 PM"], featured: true, buttonLabel: "Enquire", buttonHref: "/book" },
      { name: "Heritage Suite", price: "₹13,999", period: "/night", features: ["780 sq ft · separate living room", "Soaking tub & private sit-out", "All meals included", "60-min couples spa ritual", "Airport transfers"], featured: false, buttonLabel: "Enquire", buttonHref: "/book" },
    ],
  },
  style: { background: "light", cardRadius: "sm", cardShadow: "md" },
};

export const hotelResort: TemplateDef = {
  theme: {
    colors: { primary: "#0f766e", primaryDark: "#115e59", secondary: "#13302d", accent: "#c9a227", dark: "#0b1f1d", light: "#f6f3ec", text: "#4b524f", heading: "#10221f" },
    font: "Newsreader", radius: "0.125rem",
  },
  header: (biz) => ({
    design: "classic",
    logoText: biz, logoImage: "",
    announcement: { show: true, text: "Book direct & save 15% · Complimentary breakfast and late check-out on all direct bookings", link: "/book" },
    topbar: { show: true, address: "Your City · 24-hour front desk", phones: [PHONE], email: "hello@example.com", social: { facebook: "#", instagram: "#", whatsapp: "#" } },
    nav: [
      { label: "Home", href: "/" }, { label: "Rooms & Suites", href: "/rooms" }, { label: "Dining", href: "/dining" }, { label: "Banquets", href: "/banquets" },
      { label: "Spa", href: "/spa" }, { label: "Packages", href: "/packages" }, { label: "Gallery", href: "/gallery" }, { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Book Your Stay", href: "/book" },
  }),
  footer: (biz) => ({
    design: "minimal",
    about: `${biz} is a boutique hotel and resort with 48 rooms and suites, an infinity pool, award-winning dining, banquet lawns and an Ayurvedic spa — crafted for unhurried stays.`,
    columns: [
      { title: "Stay", links: [ { label: "Rooms & Suites", href: "/rooms" }, { label: "Packages & Offers", href: "/packages" }, { label: "Book Your Stay", href: "/book" } ] },
      { title: "Experience", links: [ { label: "Dining", href: "/dining" }, { label: "Weddings & Banquets", href: "/banquets" }, { label: "Spa & Wellness", href: "/spa" }, { label: "Gallery", href: "/gallery" }, { label: "Contact", href: "/contact" } ] },
    ],
    serviceAreas: ["Luxury Rooms", "Destination Weddings", "Corporate Offsites", "Ayurvedic Spa", "Fine Dining", "Weekend Getaways"],
    contact: { phones: [PHONE], email: "hello@example.com", address: "Your City" },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. Stay a little longer.`,
  }),
  seo: (biz) => ({
    title: `${biz} — Boutique Hotel & Resort in Your City · Rooms, Spa & Banquets`,
    description: "Elegant rooms and suites from ₹5,499/night, infinity pool, multi-cuisine dining, Ayurvedic spa and banquet lawns for weddings and corporate events. Book direct for the best rates.",
    favicon: "", ogImage: "",
    keywords: "resort near me, boutique hotel, hotel rooms, destination wedding venue, banquet hall, spa resort, weekend getaway, corporate offsite venue",
    businessType: "Resort", priceRange: "₹₹₹",
  }),
  services: [
    { category: "Rooms & Suites", title: "Deluxe Garden Rooms", description: "Calm rooms with private balconies overlooking landscaped gardens." },
    { category: "Rooms & Suites", title: "Premier Pool View Rooms", description: "Wake up to the infinity pool with breakfast and high-tea included." },
    { category: "Rooms & Suites", title: "Heritage Suites", description: "Spacious suites with living rooms, soaking tubs and butler service." },
    { category: "Dining", title: "Saffron — All-Day Dining", description: "Indian, Asian and Continental buffets and à la carte from 7 AM to 11 PM." },
    { category: "Dining", title: "The Courtyard Grill", description: "Open-air barbecue and tandoor dinners under the stars." },
    { category: "Dining", title: "In-Room Dining", description: "24-hour room service with a curated late-night menu." },
    { category: "Events & Banquets", title: "Destination Weddings", description: "Lawns for 800 guests, mandap décor, rooms for families and in-house catering." },
    { category: "Events & Banquets", title: "Corporate Offsites & MICE", description: "Conference halls, AV support, team-building and residential packages." },
    { category: "Spa & Wellness", title: "Ayurvedic Spa Therapies", description: "Abhyanga, shirodhara and signature rituals by Kerala-trained therapists." },
    { category: "Spa & Wellness", title: "Yoga & Fitness", description: "Sunrise yoga deck, gym and guided meditation sessions." },
  ],
  gallery: [
    "Infinity pool at sunset", "Heritage Suite living room", "Saffron all-day dining", "Wedding mandap on the lawns",
    "Ayurvedic spa treatment room", "Courtyard grill dinner", "Sunrise yoga deck", "Grand lobby",
  ].map((caption) => ({ category: "The Resort", caption })),
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "split", customHtml: "",
          badge: "BOUTIQUE RESORT · 48 ROOMS & SUITES", titleTop: "Slow Mornings, Golden Evenings —", titleHighlight: "Your Escape Awaits",
          subtitle: "", description: `Tucked among gardens on the edge of the city, ${biz} pairs gracious Indian hospitality with quiet luxury — elegant rooms, an infinity pool, unhurried dining and an Ayurvedic spa.`, image: "",
          primaryBtn: { label: "Check Availability", href: "/book" }, secondaryBtn: { label: "Explore Rooms", href: "/rooms" },
          features: [
            { icon: "home", title: "48 Rooms & Suites", text: "" }, { icon: "utensils", title: "3 Dining Venues", text: "" },
            { icon: "leaf", title: "Ayurvedic Spa", text: "" }, { icon: "star", title: "4.8★ Guest Rating", text: "" },
          ],
        } },
        { type: "about", content: {
          eyebrow: "WELCOME", title: "A Resort Designed for", titleHighlight: "Unhurried Stays",
          body: [`Set across six acres of mango orchards and frangipani gardens, ${biz} was built for travellers who want space to breathe. Every room opens to greenery, and every meal is cooked from produce grown nearby.`, "Whether it's a weekend away, a family celebration or a three-day offsite, our team takes care of every detail so you can simply be present."],
          image: "", points: ["Six acres of gardens", "Infinity pool", "Sunrise yoga deck", "Kids' club", "45 min from the airport"],
          buttonLabel: "Discover the Resort", buttonHref: "/gallery",
        }, style: { layout: "centered" } },
        rooms,
        { type: "features", content: { eyebrow: "THE RESORT", title: "Everything You Need for", titleHighlight: "a Perfect Stay", items: [
          { icon: "utensils", title: "Saffron & Courtyard Grill", text: "All-day multi-cuisine dining and open-air barbecue nights." },
          { icon: "leaf", title: "Ayurvedic Spa", text: "Kerala-trained therapists and signature couple rituals." },
          { icon: "heart", title: "Weddings on the Lawns", text: "Elegant lawns and a pillarless ballroom for up to 800 guests." },
          { icon: "users", title: "Kids' Club", text: "Supervised activities, games room and a splash pool." },
          { icon: "plane", title: "Airport Transfers", text: "Chauffeured sedans and SUVs on request, 24 × 7." },
          { icon: "shield", title: "Thoughtful Service", text: "Personal guest relations host for every booking." },
        ] } as SectionContentMap["features"], style: { layout: "split" } },
        { type: "stats", content: { items: [
          { value: "48", label: "Rooms & Suites", icon: "home" }, { value: "6 Acres", label: "Of Gardens", icon: "leaf" },
          { value: "800", label: "Banquet Guests", icon: "users" }, { value: "4.8★", label: "Guest Rating", icon: "star" },
        ] }, style: { layout: "minimal", background: "dark" } },
        { type: "serviceCategories", content: { eyebrow: "EXPERIENCES", title: "Dine, Unwind &", titleHighlight: "Celebrate", categories: ["Dining", "Spa & Wellness", "Events & Banquets"] }, style: { layout: "tiles" } },
        { type: "imageBanner", content: { title: "Say ‘I do’ beneath the stars", subtitle: "Destination weddings with lawn ceremonies, in-house catering, décor partners and rooms for the whole family.", buttonLabel: "Plan Your Wedding", buttonHref: "/banquets", image: "" } },
        { type: "pricingPlans", content: {
          eyebrow: "SIGNATURE PACKAGES", title: "Curated", titleHighlight: "Getaways",
          plans: [
            { name: "Weekend Escape", price: "₹14,999", period: "/2 nights", features: ["Premier Pool View room", "Breakfast & one dinner for two", "Sunset high-tea"], featured: false, buttonLabel: "Enquire", buttonHref: "/book" },
            { name: "Romance Retreat", price: "₹24,999", period: "/2 nights", features: ["Heritage Suite with floral turndown", "Candle-lit poolside dinner", "90-min couples spa ritual", "All meals included"], featured: true, buttonLabel: "Enquire", buttonHref: "/book" },
            { name: "Family Holiday", price: "₹32,999", period: "/3 nights", features: ["Two interconnected rooms", "All meals for 4", "Kids' club access", "Guided nature walk"], featured: false, buttonLabel: "Enquire", buttonHref: "/book" },
          ],
        }, style: { background: "light", cardRadius: "sm", cardShadow: "lg" } },
        { type: "countdown", content: { eyebrow: "LIMITED OFFER", title: "Winter Escape —", titleHighlight: "25% Off Suites", subtitle: "Stay 2 nights or more in any suite and get a complimentary couples spa ritual.", targetDate: "2027-01-15T23:59:00", buttonLabel: "Claim the Offer", buttonHref: "/packages" }, style: { background: "primary" } },
        { type: "testimonials", content: { eyebrow: "GUEST JOURNAL", title: "Words From Our", titleHighlight: "Guests", items: [
          { name: "Aditi & Varun Khanna", role: "Anniversary stay · Heritage Suite", text: "The floral turndown, the candle-lit dinner by the pool, the shirodhara — every detail felt personal. We've already booked next year.", rating: 5 },
          { name: "Suresh Pillai", role: "Corporate offsite · 60 delegates", text: "Smooth AV, excellent food across three days and a team-building evening our people still talk about. Truly hassle-free.", rating: 5 },
          { name: "Farah Siddiqui", role: "Family weekend", text: "The kids didn't want to leave the splash pool and kids' club. Breakfast spread was the best we've had at any resort.", rating: 5 },
          { name: "Col. Harish Menon (Retd.)", role: "Golden jubilee celebration · 120 guests", text: "Our 50th anniversary on the lawns was magical. The team arranged rooms for three generations of family without a single hiccup.", rating: 5 },
        ] }, style: { layout: "featured" } },
        { type: "logos", content: { title: "Recognition & guest ratings", items: ["9.2 / 10 Guest Score", "Travellers' Favourite 2025", "Best Wedding Lawns · City Awards", "Green Stay Certified", "Family-Friendly Certified"] }, style: { background: "light", spacingTop: "sm", spacingBottom: "sm" } },
        { type: "faq", content: { eyebrow: "PLAN YOUR STAY", title: "Before You", titleHighlight: "Arrive", items: [
          { q: "What are the check-in and check-out times?", a: "Check-in is from 2 PM and check-out until 11 AM. Direct bookings get late check-out till 1 PM, subject to availability." },
          { q: "Is breakfast included?", a: "Yes, a full Indian and continental breakfast at Saffron is included with every room." },
          { q: "Do you allow pets?", a: "Two of our garden rooms are pet-friendly. Please mention your pet while booking." },
          { q: "Can we visit just for the day?", a: "Yes. Our day-out package includes pool access, lunch and high-tea from ₹2,499 per adult." },
          { q: "Is there an airport transfer?", a: "Chauffeured sedans and SUVs are available 24 × 7 at a fixed rate; Heritage Suite guests get complimentary transfers." },
        ] } },
        cta,
      ],
    },
    { slug: "rooms", title: "Rooms & Suites", isSystem: true, order: 1, sections: [
      { type: "banner", content: { title: "Rooms &", titleHighlight: "Suites", subtitle: "Garden balconies, pool views and heritage suites — each a quiet retreat.", image: "", bgColor: "", imageOpacity: 45, overlayOpacity: 55 } },
      rooms,
      { type: "features", content: { items: [
        { icon: "zap", title: "High-Speed Wi-Fi", text: "Complimentary fibre Wi-Fi across rooms and gardens." },
        { icon: "clock", title: "24-Hour In-Room Dining", text: "Comfort food and a curated late-night menu." },
        { icon: "badge-check", title: "Premium Bedding", text: "Hypoallergenic pillows, pillow menu and blackout drapes." },
        { icon: "gift", title: "Welcome Amenities", text: "Seasonal fruit, homemade cookies and a herbal welcome drink." },
      ] }, style: { cardRadius: "sm" } },
      { type: "faq", content: { eyebrow: "STAY INFORMATION", title: "Good to", titleHighlight: "Know", items: [
        { q: "What are the check-in and check-out times?", a: "Check-in is from 2 PM and check-out by 11 AM. Early check-in and late check-out are subject to availability." },
        { q: "Is breakfast included?", a: "All direct bookings include buffet breakfast at Saffron for registered guests." },
        { q: "Are pets allowed?", a: "We welcome small pets in select Garden Rooms with prior intimation. A cleaning fee of ₹1,500 applies." },
        { q: "What is your cancellation policy?", a: "Free cancellation up to 72 hours before arrival. Peak-season and package bookings may have different terms." },
      ] }, style: { background: "light" } },
      { type: "testimonials", content: { eyebrow: "GUEST REVIEWS", title: "Rooms Guests", titleHighlight: "Rave About", items: [
        { name: "Priyanka Sethi", role: "Premier Pool View · 3 nights", text: "Waking up to the pool every morning was the highlight. Spotless room and the softest bedding.", rating: 5 },
        { name: "Rohan Desai", role: "Heritage Suite · honeymoon", text: "The soaking tub, the private sit-out and the butler who remembered every preference. Worth every rupee.", rating: 5 },
      ] }, style: { layout: "minimal", background: "light" } },
      cta,
    ] },
    { slug: "dining", title: "Dining", isSystem: true, order: 2, sections: [
      { type: "about", content: {
        eyebrow: "DINING", title: "Three Venues,", titleHighlight: "One Philosophy",
        body: ["Our chefs cook with produce from our own kitchen garden and farms within 50 km. Breakfasts are leisurely, lunches are light and dinners are an occasion.", "From the Saffron breakfast spread to the Courtyard Grill's live tandoor, every meal is made to be lingered over."],
        image: "", points: ["Kitchen-garden produce", "Regional thalis every Sunday", "Jain & vegan menus", "Private dining on request"],
        buttonLabel: "Reserve a Table", buttonHref: "/contact",
      } },
      { type: "priceList", content: {
        eyebrow: "SIGNATURE MENU", title: "Chef's", titleHighlight: "Selection",
        note: "Prices exclusive of GST. Non-resident guests welcome — table reservations recommended for dinner.",
        groups: [
          { category: "Saffron · All-Day", items: [
            { name: "Breakfast Buffet", price: "₹950", note: "7 AM – 10:30 AM" }, { name: "Sunday Regional Thali", price: "₹1,250", note: "Changes weekly" }, { name: "Malabar Prawn Curry", price: "₹780", note: "" },
          ] },
          { category: "Courtyard Grill · Dinner", items: [
            { name: "Tandoori Platter (veg / non-veg)", price: "₹1,150 / ₹1,450", note: "Serves 2" }, { name: "Raan-e-Sikandari", price: "₹1,650", note: "Pre-order 24 hrs" }, { name: "Grilled Basa with Lemon Butter", price: "₹890", note: "" },
          ] },
          { category: "The Bar & Lounge", items: [
            { name: "Signature Mocktails", price: "₹350", note: "" }, { name: "Sunset High-Tea", price: "₹650", note: "4 PM – 6 PM" }, { name: "Cheese & Small Plates", price: "₹750", note: "" },
          ] },
        ],
      }, style: { background: "light", cardRadius: "sm" } },
      { type: "openingHours", content: {
        eyebrow: "TIMINGS", title: "When We", titleHighlight: "Serve",
        note: "In-room dining is available 24 hours for resident guests.",
        days: [
          { day: "Saffron · Breakfast", hours: "7:00 AM – 10:30 AM" }, { day: "Saffron · Lunch", hours: "12:30 PM – 3:30 PM" },
          { day: "Courtyard Grill · Dinner", hours: "7:00 PM – 11:00 PM" }, { day: "Bar & Lounge", hours: "4:00 PM – 11:30 PM" },
        ],
      } },
      cta,
    ] },
    { slug: "banquets", title: "Weddings & Banquets", isSystem: true, order: 3, sections: [
      { type: "imageBanner", content: { title: "Celebrations as grand as your story", subtitle: "Two manicured lawns, a pillarless ballroom and a dedicated wedding team for ceremonies of 50 to 800 guests.", buttonLabel: "Request a Banquet Quote", buttonHref: "/book", image: "" } },
      { type: "priceList", content: {
        eyebrow: "VENUES", title: "Spaces for Every", titleHighlight: "Occasion",
        note: "Veg menus from ₹1,450 per plate and non-veg from ₹1,750 per plate. Venue charges waived on minimum guarantees.",
        groups: [
          { category: "Outdoor", items: [
            { name: "The Frangipani Lawn", price: "up to 800 guests", note: "Weddings & receptions" }, { name: "Poolside Deck", price: "up to 150 guests", note: "Sangeet & cocktails" },
          ] },
          { category: "Indoor", items: [
            { name: "Grand Ballroom", price: "up to 500 guests", note: "Pillarless · 6,500 sq ft" }, { name: "The Board Room", price: "up to 30 guests", note: "Meetings & offsites" }, { name: "Private Dining Room", price: "up to 20 guests", note: "Intimate dinners" },
          ] },
        ],
      }, style: { cardRadius: "sm" } },
      { type: "steps", content: { eyebrow: "PLANNING", title: "Your Wedding,", titleHighlight: "Step by Step", items: [
        { title: "Site Visit", text: "Walk the venues with our wedding manager", icon: "map-pin" },
        { title: "Menu Tasting", text: "Curate your menu with our chefs", icon: "utensils" },
        { title: "Décor & Rooms", text: "Mandap, florals and family room blocks", icon: "heart" },
        { title: "Celebrate", text: "We run the day — you enjoy it", icon: "star" },
      ] }, style: { background: "dark" } },
      { type: "serviceCategories", content: { eyebrow: "EVENTS", title: "Weddings &", titleHighlight: "Corporate", categories: ["Events & Banquets"] }, style: { background: "light" } },
      cta,
    ] },
    { slug: "spa", title: "Spa & Wellness", isSystem: true, order: 4, sections: [
      { type: "about", content: {
        eyebrow: "SPA & WELLNESS", title: "Restore the Body,", titleHighlight: "Quiet the Mind",
        body: ["Our Ayurvedic spa follows traditional Kerala therapies with warm herbal oils, prepared in-house. Every treatment begins with a short consultation to understand your dosha and comfort.", "Pair your ritual with sunrise yoga, a steam session and a herbal tea in the relaxation garden."],
        image: "", points: ["Kerala-trained therapists", "Couple treatment suites", "Steam, sauna & jacuzzi", "Daily sunrise yoga"],
        buttonLabel: "Book a Treatment", buttonHref: "/book",
      } },
      { type: "priceList", content: {
        eyebrow: "SPA MENU", title: "Therapies &", titleHighlight: "Rituals",
        note: "Prices exclusive of GST. Resident guests enjoy 20% off. Please book at least 4 hours in advance.",
        groups: [
          { category: "Ayurvedic", items: [
            { name: "Abhyanga Full-Body Massage", price: "₹3,200", note: "60 min" }, { name: "Shirodhara", price: "₹3,800", note: "45 min" }, { name: "Potli Herbal Compress", price: "₹3,500", note: "60 min" },
          ] },
          { category: "Signature Rituals", items: [
            { name: "Couples Harmony Ritual", price: "₹8,500", note: "90 min, for two" }, { name: "Detox Body Wrap & Scrub", price: "₹4,200", note: "75 min" }, { name: "Foot Reflexology", price: "₹1,800", note: "30 min" },
          ] },
        ],
      }, style: { background: "light", cardRadius: "sm" } },
      { type: "team", content: { eyebrow: "OUR EXPERTS", title: "Hands That", titleHighlight: "Heal", members: [
        { name: "Dr. Lakshmi Menon", role: "Ayurveda Consultant", image: "", note: "BAMS · 15 yrs" },
        { name: "Anil Varghese", role: "Senior Therapist", image: "", note: "Kerala trained · 11 yrs" },
        { name: "Priyanka Joshi", role: "Yoga Instructor", image: "", note: "RYT-500" },
      ] } },
      cta,
    ] },
    { slug: "packages", title: "Packages & Offers", isSystem: true, order: 5, sections: [
      { type: "countdown", content: { eyebrow: "LIMITED OFFER", title: "Winter Escape —", titleHighlight: "25% Off Suites", subtitle: "Stay 2 nights or more in any suite and get a complimentary couples spa ritual.", targetDate: "2027-01-15T23:59:00", buttonLabel: "Claim the Offer", buttonHref: "/book" }, style: { background: "primary" } },
      { type: "pricingPlans", content: {
        eyebrow: "PACKAGES", title: "Stays Made", titleHighlight: "Special",
        plans: [
          { name: "Weekend Escape", price: "₹14,999", period: "/2 nights", features: ["Premier Pool View room", "Breakfast & one dinner for two", "Sunset high-tea"], featured: false, buttonLabel: "Enquire", buttonHref: "/book" },
          { name: "Romance Retreat", price: "₹24,999", period: "/2 nights", features: ["Heritage Suite with floral turndown", "Candle-lit poolside dinner", "90-min couples spa ritual", "All meals included"], featured: true, buttonLabel: "Enquire", buttonHref: "/book" },
          { name: "Wellness Reset", price: "₹38,999", period: "/4 nights", features: ["Deluxe Garden room", "Daily Ayurvedic therapy", "Satvik meal plan", "Yoga & meditation sessions"], featured: false, buttonLabel: "Enquire", buttonHref: "/book" },
          { name: "Corporate Offsite", price: "₹8,500", period: "/person/night", features: ["Twin-sharing rooms", "All meals & 2 tea breaks", "Conference hall & AV", "Team-building evening"], featured: false, buttonLabel: "Enquire", buttonHref: "/book" },
        ],
      }, style: { cardRadius: "sm", cardShadow: "md" } },
      { type: "features", content: { items: [
        { icon: "tag", title: "Best Rate Guarantee", text: "Find a lower rate online and we'll match it — plus 10% off." },
        { icon: "check", title: "Flexible Cancellation", text: "Free cancellation up to 72 hours before arrival." },
        { icon: "gift", title: "Direct-Booking Perks", text: "Late check-out, welcome drink and spa credit." },
      ] }, style: { background: "light" } },
      cta,
    ] },
    { slug: "gallery", title: "Gallery", isSystem: true, order: 6, sections: [
      { type: "gallery", content: { eyebrow: "GALLERY", title: "Moments at", titleHighlight: "the Resort" } },
      { type: "imageBanner", content: { title: "Sunrise yoga to candle-lit dinners", subtitle: "See it for yourself — book direct for late check-out, a welcome drink and spa credit.", buttonLabel: "Check Availability", buttonHref: "/book", image: "" } },
      cta,
    ] },
    { slug: "book", title: "Book Your Stay", isSystem: true, order: 7, sections: [
      { type: "appointmentForm", content: { title: "Room & Event Enquiry", subtitle: "Share your arrival date, number of guests and room preference — our reservations team will confirm availability and the best direct rate within an hour." } },
      { type: "features", content: { items: [
        { icon: "tag", title: "Book Direct & Save 15%", text: "Lower than any travel portal, every day." },
        { icon: "clock", title: "Reply Within an Hour", text: "Reservations desk staffed 24 × 7." },
        { icon: "headset", title: "Personal Host", text: "A guest relations host plans your stay with you." },
      ] }, style: { background: "light", cardRadius: "sm" } },
      { type: "openingHours", content: {
        eyebrow: "STAY TIMINGS", title: "Check-In &", titleHighlight: "Check-Out",
        note: "Early check-in and late check-out subject to availability. Government photo ID required for all guests.",
        days: [
          { day: "Check-in", hours: "From 2:00 PM" }, { day: "Check-out", hours: "Until 11:00 AM" }, { day: "Front Desk & Reservations", hours: "24 hours" },
        ],
      } },
    ] },
    { slug: "contact", title: "Contact", isSystem: true, order: 8, sections: [
      { type: "contactInfo", content: { eyebrow: "CONTACT", title: "We'd Love to", titleHighlight: "Host You", address: "Your City", phone: PHONE, email: "hello@example.com", hours: "Front desk & reservations: 24 hours", mapEmbed: "" } },
      { type: "map", content: { eyebrow: "GETTING HERE", title: "45 Minutes From", titleHighlight: "the Airport", address: "Your City", mapEmbed: "" } },
      { type: "contactForm", content: { title: "Write to Us", subtitle: "Questions about rooms, dining reservations, weddings or corporate stays — our team replies promptly." } },
      cta,
    ] },
  ],
};
