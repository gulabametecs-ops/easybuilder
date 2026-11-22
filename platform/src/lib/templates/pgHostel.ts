import type { TemplateDef, SectionSeed, PropertySeed } from "./types";

// PG / hostel / co-living operator (boys, girls, co-living; sharing; meals; rules):
// friendly teal + coral, Be Vietnam Pro, very rounded, slideshow hero, minimal header, centered footer.
const PHONE = "9000000000";
const EMAIL = "stay@example.com";
const CITY = "Bengaluru";
const CATEGORIES = ["Stay Options", "Meals & Housekeeping", "Facilities", "For Parents & Companies"];

const facilities: SectionSeed<"features">["content"]["items"] = [
  { icon: "utensils", title: "3 Home-Style Meals", text: "Breakfast, lunch-box and dinner — North & South Indian, veg and Sunday non-veg." },
  { icon: "wifi", title: "100 Mbps Wi-Fi", text: "Fibre broadband on every floor with backup line for WFH days." },
  { icon: "sparkles", title: "Daily Housekeeping", text: "Rooms cleaned daily, bed sheets changed twice a week." },
  { icon: "shirt", title: "Washing Machines", text: "Fully automatic machines on each floor plus ironing station." },
  { icon: "shield", title: "CCTV & Biometric Entry", text: "24×7 warden, CCTV in common areas and biometric main door." },
  { icon: "bolt", title: "Power Backup", text: "Inverter for lights, fans and Wi-Fi — no study or work interruptions." },
];

const stats: SectionSeed<"stats"> = {
  type: "stats",
  content: { items: [
    { value: "6", label: "Branches in Bengaluru", icon: "building" },
    { value: "480+", label: "Happy Residents", icon: "smile" },
    { value: "4.7★", label: "Google Rating", icon: "star" },
    { value: "0", label: "Brokerage, Ever", icon: "tag" },
  ] },
  style: { layout: "band", background: "primary" },
};

const sharingRates: SectionSeed<"priceList"> = {
  type: "priceList",
  content: { eyebrow: "ROOMS & PRICING", title: "Simple, All-Inclusive", titleHighlight: "Monthly Rent", note: "Rent includes meals, Wi-Fi, electricity up to 60 units, housekeeping and laundry. Security deposit: 1 month's rent, fully refundable with 30 days' notice.", groups: [
    { category: "Boys PG", items: [
      { name: "Triple sharing", price: "₹7,500", note: "/month per bed" },
      { name: "Double sharing", price: "₹9,500", note: "/month per bed" },
      { name: "Single room", price: "₹14,500", note: "/month, attached bath" },
    ] },
    { category: "Girls PG", items: [
      { name: "Triple sharing", price: "₹8,000", note: "/month per bed" },
      { name: "Double sharing", price: "₹10,000", note: "/month per bed" },
      { name: "Single room", price: "₹15,000", note: "/month, attached bath" },
    ] },
    { category: "Co-living (Working Professionals)", items: [
      { name: "Double sharing with AC", price: "₹13,500", note: "/month per bed" },
      { name: "Private studio with AC", price: "₹22,000", note: "/month, kitchenette" },
    ] },
  ] },
  style: { cardRadius: "lg" },
};

const houseRules: SectionSeed<"faq"> = {
  type: "faq",
  content: { eyebrow: "HOUSE RULES", title: "Rules That Keep", titleHighlight: "Everyone Comfortable", items: [
    { q: "What are the in-time and gate timings?", a: "Main gate closes at 10:30 PM for students and 11:30 PM for co-living. Late entry is allowed with prior intimation to the warden on WhatsApp." },
    { q: "Are visitors allowed?", a: "Parents and siblings can visit the common lounge between 9 AM and 8 PM. Overnight guests are not permitted in shared rooms; a guest room is available at ₹800/night subject to availability." },
    { q: "Is smoking or alcohol allowed?", a: "No. The property is strictly no-smoking, no-alcohol and no-drugs. Violations lead to immediate termination without refund of the month's rent." },
    { q: "What is the notice period and deposit refund?", a: "30 days' notice. The refundable deposit is returned within 7 days of move-out after a simple room inspection, minus any damages." },
    { q: "Can I cook my own food?", a: "Students cannot cook in rooms. Co-living residents have a shared pantry with microwave, induction and fridge." },
    { q: "Quiet hours?", a: "10:30 PM to 7 AM. Music and calls in the corridors are not allowed during quiet hours so everyone can sleep and study." },
  ] },
};

const testimonials: SectionSeed<"testimonials"> = {
  type: "testimonials",
  content: { eyebrow: "RESIDENTS SAY", title: "Feels Like", titleHighlight: "Home", items: [
    { name: "Ananya R.", role: "MBA student, Christ University", text: "The girls' branch is super safe and the warden aunty treats us like her own. Food is genuinely good — the Sunday biryani is famous.", rating: 5 },
    { name: "Karthik S.", role: "Software engineer, Koramangala", text: "Shifted from a broker flat to co-living here. Wi-Fi never drops on my WFH days and I don't have to worry about maids or bills.", rating: 5 },
    { name: "Mrs. Lakshmi Nair", role: "Parent of a first-year student", text: "We visited three PGs. This was the only one that showed us the kitchen, CCTV and the fire extinguishers without being asked.", rating: 5 },
  ] },
  style: { layout: "minimal" },
};

const properties = (): PropertySeed[] => [
  {
    title: "Boys PG — Double Sharing, Koramangala 5th Block", purpose: "pg", propertyType: "pg-room",
    price: 9500, priceNote: "/month per bed", deposit: 9500, sharing: "Double", foodIncluded: true, gender: "Boys",
    furnishing: "Furnished", bathrooms: 1, availableFrom: "Immediately", locality: "Koramangala", city: CITY,
    summary: "Airy double-sharing room with attached bath, 3 meals, Wi-Fi and daily housekeeping.",
    description: "Our flagship boys' branch, a 5-minute walk from Sony World Signal and close to Christ University and startups in 5th Block. Each resident gets a cot with mattress, study table, chair and a lockable wardrobe.",
    highlights: ["Near Christ University & Forum Mall", "Attached bathroom with geyser", "Sunday special non-veg"],
    amenities: ["wifi", "meals", "housekeeping", "laundry", "power-backup", "cctv", "security", "water", "study", "tv"],
    status: "available", featured: true,
  },
  {
    title: "Girls PG — Triple Sharing, HSR Layout Sector 2", purpose: "pg", propertyType: "pg-room",
    price: 8000, priceNote: "/month per bed", deposit: 8000, sharing: "Triple", foodIncluded: true, gender: "Girls",
    furnishing: "Furnished", bathrooms: 1, availableFrom: "1 December", locality: "HSR Layout", city: CITY,
    summary: "Safe, budget-friendly girls' PG with lady warden, biometric entry and home-style food.",
    description: "Ideal for students and freshers working in HSR and Agara. Lady warden on site 24×7, CCTV on every floor, and a cosy common room with TV and books.",
    highlights: ["Lady warden 24×7", "Biometric entry", "Walking distance to HSR BDA Complex"],
    amenities: ["wifi", "meals", "housekeeping", "laundry", "power-backup", "cctv", "security", "water", "tv", "fridge"],
    status: "available", featured: true,
  },
  {
    title: "Co-living Private Studio with AC, Whitefield", purpose: "pg", propertyType: "hostel",
    price: 22000, priceNote: "/month", deposit: 44000, sharing: "Single", foodIncluded: false, gender: "Co-living",
    furnishing: "Furnished", bathrooms: 1, areaSqft: 260, availableFrom: "Immediately", locality: "Whitefield", city: CITY,
    summary: "Private studio with AC, kitchenette and work desk — 10 minutes from ITPL.",
    description: "Designed for working professionals who want privacy without the hassle of a flat. Queen bed, ergonomic chair, kitchenette with fridge and induction, plus rooftop lounge and gym access.",
    highlights: ["Private kitchenette", "Rooftop lounge & gym", "Meals optional at ₹3,500/month"],
    amenities: ["wifi", "ac", "housekeeping", "laundry", "power-backup", "cctv", "security", "gym", "fridge", "lift"],
    status: "available", featured: true,
  },
  {
    title: "Boys PG — Triple Sharing, BTM Layout 2nd Stage", purpose: "pg", propertyType: "pg-room",
    price: 7500, priceNote: "/month per bed", deposit: 7500, sharing: "Triple", foodIncluded: true, gender: "Boys",
    furnishing: "Furnished", bathrooms: 1, availableFrom: "Immediately", locality: "BTM Layout", city: CITY,
    summary: "Most affordable branch — 3 meals, Wi-Fi and laundry included, near Silk Board.",
    description: "Popular with coaching students and freshers. Large rooms with three cots, individual cupboards and a dedicated study hall open till 1 AM during exam season.",
    amenities: ["wifi", "meals", "housekeeping", "laundry", "power-backup", "cctv", "water", "study"],
    status: "available",
  },
  {
    title: "Co-living Double Sharing with AC, Marathahalli", purpose: "pg", propertyType: "hostel",
    price: 13500, priceNote: "/month per bed", deposit: 13500, sharing: "Double", foodIncluded: true, gender: "Co-living",
    furnishing: "Furnished", bathrooms: 1, availableFrom: "15 December", locality: "Marathahalli", city: CITY,
    summary: "AC double-sharing rooms for professionals, 5 minutes from the Outer Ring Road tech parks.",
    description: "Separate floors for men and women. Includes breakfast and dinner, high-speed Wi-Fi, weekly room deep-clean and a gaming lounge with TV.",
    amenities: ["wifi", "ac", "meals", "housekeeping", "laundry", "power-backup", "cctv", "security", "lift", "tv"],
    status: "available",
  },
  {
    title: "Girls PG — Single Room, Electronic City Phase 1", purpose: "pg", propertyType: "pg-room",
    price: 15000, priceNote: "/month", deposit: 15000, sharing: "Single", foodIncluded: true, gender: "Girls",
    furnishing: "Furnished", bathrooms: 1, availableFrom: "Fully occupied", locality: "Electronic City", city: CITY,
    summary: "Single rooms near Infosys & Wipro campuses — currently full, join the waitlist.",
    description: "Private rooms with attached bath, all meals and company-shuttle pick-up point at the gate. All rooms are currently occupied; call to join the waitlist.",
    amenities: ["wifi", "meals", "housekeeping", "laundry", "power-backup", "cctv", "security", "water"],
    status: "rented",
  },
];

export const pgHostel: TemplateDef = {
  theme: {
    colors: { primary: "#0d9488", primaryDark: "#0f766e", secondary: "#134e4a", accent: "#fb7160", dark: "#12302e", light: "#fff7f2", text: "#3f4b4a", heading: "#102a28" },
    font: "Be Vietnam Pro", radius: "1.25rem",
  },
  header: (biz) => ({
    design: "minimal",
    logoText: biz, logoImage: "",
    announcement: { show: true, text: "Beds filling fast for the new semester · Free visit + first meal on us", link: "/book-visit" },
    topbar: { show: false, address: `Koramangala, ${CITY}`, phones: [PHONE], email: EMAIL, social: { instagram: "#", whatsapp: "#" } },
    nav: [
      { label: "Home", href: "/" },
      { label: "Rooms & Pricing", href: "/rooms" },
      { label: "Facilities", href: "/facilities" },
      { label: "Food Menu", href: "/food-menu" },
      { label: "House Rules", href: "/house-rules" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Book a Visit", href: "/book-visit" },
  }),
  footer: (biz) => ({
    design: "centered",
    about: `${biz} runs safe, clean and affordable PGs and co-living homes for students and working professionals across ${CITY} — with home-style food, Wi-Fi and housekeeping included.`,
    columns: [
      { title: "Stay", links: [ { label: "Rooms & Pricing", href: "/rooms" }, { label: "Facilities", href: "/facilities" }, { label: "Food Menu", href: "/food-menu" }, { label: "House Rules", href: "/house-rules" } ] },
      { title: "Help", links: [ { label: "Book a Visit", href: "/book-visit" }, { label: "About Us", href: "/about" }, { label: "Contact", href: "/contact" } ] },
    ],
    serviceAreas: ["Koramangala", "HSR Layout", "BTM Layout", "Whitefield", "Marathahalli", "Electronic City"],
    contact: { phones: [PHONE], email: EMAIL, address: `5th Block, Koramangala, ${CITY}` },
    social: { instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. Your home away from home.`,
  }),
  seo: (biz) => ({
    title: `${biz} — PG, Hostel & Co-living in ${CITY} with Food`,
    description: `Boys, girls and co-living PG in ${CITY}. Single, double and triple sharing from ₹7,500/month with 3 meals, Wi-Fi, housekeeping and laundry. No brokerage.`,
    favicon: "", ogImage: "",
    keywords: `pg near me, boys pg ${CITY}, girls pg ${CITY}, co-living ${CITY}, hostel with food, pg in koramangala, pg in hsr layout`,
    businessType: "LodgingBusiness", priceRange: "₹",
  }),
  services: [
    { category: "Stay Options", title: "Boys PG", description: "Single, double and triple sharing rooms near colleges and tech parks." },
    { category: "Stay Options", title: "Girls PG", description: "Secure girls-only branches with lady warden and biometric entry." },
    { category: "Stay Options", title: "Co-living for Professionals", description: "AC rooms and private studios with lounge, gym and flexible stays." },
    { category: "Meals & Housekeeping", title: "Home-Style Meals", description: "Breakfast, packed lunch and dinner from our hygienic in-house kitchen." },
    { category: "Meals & Housekeeping", title: "Daily Housekeeping", description: "Room cleaning every day and fresh linen twice a week." },
    { category: "Meals & Housekeeping", title: "Laundry", description: "Washing machines on every floor and an ironing station." },
    { category: "Facilities", title: "High-Speed Wi-Fi", description: "100 Mbps fibre with backup line, ideal for online classes and WFH." },
    { category: "Facilities", title: "Study & Common Rooms", description: "Quiet study hall, TV lounge and indoor games." },
    { category: "Facilities", title: "Safety & Security", description: "CCTV, biometric entry, fire extinguishers and a 24×7 warden." },
    { category: "For Parents & Companies", title: "Parent Updates", description: "Monthly attendance and in-time reports for students, on request." },
    { category: "For Parents & Companies", title: "Corporate & Intern Stays", description: "Bulk beds for interns and new joiners with GST invoices." },
    { category: "For Parents & Companies", title: "Short Stays", description: "Weekly stays for exams, interviews and relocation — subject to availability." },
  ],
  gallery: [
    ...["Double-sharing room", "Girls PG common lounge", "Co-living studio"].map((caption) => ({ category: "Rooms", caption })),
    ...["Dining area", "Sunday special lunch", "Clean in-house kitchen"].map((caption) => ({ category: "Food", caption })),
  ],
  properties,
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "slideshow", customHtml: "",
          badge: "BOYS · GIRLS · CO-LIVING", titleTop: "Your Home Away", titleHighlight: "From Home",
          subtitle: "", description: `Clean rooms, home-style food and fast Wi-Fi — ${biz} PGs across ${CITY} from ₹7,500/month, all-inclusive.`, image: "",
          primaryBtn: { label: "See Rooms & Prices", href: "/rooms" }, secondaryBtn: { label: "Book a Free Visit", href: "/book-visit" },
          features: [ { icon: "utensils", title: "3 Meals", text: "" }, { icon: "wifi", title: "Wi-Fi", text: "" }, { icon: "shield", title: "24×7 Safety", text: "" } ],
          slides: [
            { titleTop: "Your Home Away", titleHighlight: "From Home", description: `Clean rooms, home-style food and fast Wi-Fi — PGs across ${CITY} from ₹7,500/month, all-inclusive.`, image: "", primaryBtn: { label: "See Rooms & Prices", href: "/rooms" }, secondaryBtn: { label: "Book a Free Visit", href: "/book-visit" } },
            { titleTop: "Girls PG With", titleHighlight: "Lady Warden 24×7", description: "Biometric entry, CCTV, in-time updates for parents and a warden who actually cares.", image: "", primaryBtn: { label: "View Girls PG", href: "/rooms" }, secondaryBtn: { label: "House Rules", href: "/house-rules" } },
            { titleTop: "Co-living for", titleHighlight: "Working Professionals", description: "AC rooms and private studios near tech parks — no broker, no bills, no maid hunting.", image: "", primaryBtn: { label: "Explore Co-living", href: "/rooms" }, secondaryBtn: { label: "Call Us", href: `tel:${PHONE}` } },
          ],
        } },
        { type: "features", content: { items: facilities }, style: { layout: "cards", cardRadius: "lg", cardShadow: "sm" } },
        { type: "propertyList", content: {
          eyebrow: "AVAILABLE NOW", title: "Pick Your", titleHighlight: "Room",
          subtitle: "Live availability across our branches — beds, sharing type, food and deposit at a glance.",
          purpose: "pg", featuredOnly: false, showFilters: false, limit: 6, emptyText: "All beds are booked right now — call us to join the waitlist.",
        }, style: { background: "light" } },
        stats,
        { type: "about", content: {
          eyebrow: "WHO WE ARE", title: "Run by a Family,", titleHighlight: "Not a Call Centre",
          body: [
            `${biz} started in 2015 when we turned our own Koramangala home into a PG for six engineering students. Today we run six branches — and still eat the same food our residents do.`,
            "Every branch has an on-site warden, a cook who has been with us for years, and a manager you can call directly. No hidden charges, no brokerage.",
          ],
          image: "", points: ["Owner-managed branches", "Same food we eat at home", "Transparent all-inclusive rent", "Refundable 1-month deposit"],
          buttonLabel: "Our Story", buttonHref: "/about",
        }, style: { layout: "centered" } },
        { type: "serviceCategories", content: { eyebrow: "EVERYTHING INCLUDED", title: "One Rent,", titleHighlight: "Zero Hassle", categories: CATEGORIES }, style: { layout: "tiles", cardRadius: "lg" } },
        testimonials,
        { type: "faq", content: { eyebrow: "QUICK ANSWERS", title: "Before You", titleHighlight: "Move In", items: [
          { q: "What is included in the rent?", a: "Bed, mattress, wardrobe, study table, 3 meals (2 for co-living), Wi-Fi, electricity up to 60 units, housekeeping, laundry machines and water." },
          { q: "How much is the deposit?", a: "One month's rent, fully refundable within 7 days of moving out with a 30-day notice." },
          { q: "Which colleges and offices are nearby?", a: "Christ University, Jyoti Nivas and St. Joseph's are near Koramangala; HSR and BTM serve Agara and Silk Board offices; Whitefield, Marathahalli and Electronic City branches are close to ITPL, ORR tech parks, Infosys and Wipro." },
          { q: "Can I visit before booking?", a: "Yes — book a free visit and we'll show you the room, kitchen and common areas. Your first meal is on us." },
        ] } },
        { type: "appointmentForm", content: { title: "Book a Free Visit", subtitle: "Choose a branch, date and time — we'll WhatsApp you the location and the warden's number." }, style: { background: "light" } },
        { type: "cta", content: { title: "Need a bed this week?", highlight: "Call or WhatsApp us now", phones: [PHONE], buttonLabel: "Book a Visit", buttonHref: "/book-visit" }, style: { layout: "minimal" } },
      ],
    },
    { slug: "rooms", title: "Rooms & Pricing", isSystem: true, order: 1, sections: [
      { type: "banner", content: { title: "Rooms &", titleHighlight: "Pricing", subtitle: "Single, double and triple sharing — boys, girls and co-living.", image: "", bgColor: "", imageOpacity: 30, overlayOpacity: 70 } },
      { type: "propertyList", content: {
        eyebrow: "LIVE AVAILABILITY", title: "All", titleHighlight: "Branches",
        subtitle: "Filter by area and budget. Rent shown is per bed per month unless noted.",
        purpose: "pg", featuredOnly: false, showFilters: true, limit: 24, emptyText: "No beds match these filters — call us, a bed may free up this week.",
      } },
      sharingRates,
      { type: "cta", content: { title: "Found your room?", highlight: "Lock it with a free visit", phones: [PHONE], buttonLabel: "Book a Visit", buttonHref: "/book-visit" }, style: { layout: "minimal", background: "light" } },
    ] },
    { slug: "facilities", title: "Facilities", isSystem: true, order: 2, sections: [
      { type: "banner", content: { title: "Everything You Need,", titleHighlight: "Included", subtitle: "Wi-Fi, meals, housekeeping, laundry and round-the-clock safety.", image: "", bgColor: "", imageOpacity: 30, overlayOpacity: 70 } },
      { type: "features", content: { items: facilities }, style: { layout: "minimal" } },
      { type: "serviceCategories", content: { eyebrow: "", title: "Our", titleHighlight: "Facilities", categories: CATEGORIES }, style: { layout: "tiles", cardRadius: "lg" } },
      { type: "gallery", content: { eyebrow: "TAKE A LOOK", title: "Rooms, Food &", titleHighlight: "Common Areas" }, style: { layout: "masonry" } },
    ] },
    { slug: "food-menu", title: "Food Menu", isSystem: true, order: 3, sections: [
      { type: "banner", content: { title: "Home-Style", titleHighlight: "Food Menu", subtitle: "Cooked fresh in our own kitchen, every day. Menu rotates weekly.", image: "", bgColor: "", imageOpacity: 30, overlayOpacity: 70 } },
      { type: "priceList", content: { eyebrow: "WEEKLY MENU", title: "What's Cooking", titleHighlight: "This Week", note: "Breakfast 7:30–9:30 AM · Packed lunch on request · Dinner 8–10 PM. Jain and less-spicy options available on request.", groups: [
        { category: "Monday – Wednesday", items: [
          { name: "Mon", price: "Poha · Dal tadka & rice", note: "Dinner: chapati, aloo-gobi, curd" },
          { name: "Tue", price: "Idli-sambar · Rajma chawal", note: "Dinner: chapati, mixed veg, rasam rice" },
          { name: "Wed", price: "Upma · Sambar rice", note: "Dinner: paneer butter masala, chapati" },
        ] },
        { category: "Thursday – Saturday", items: [
          { name: "Thu", price: "Aloo paratha · Chole rice", note: "Dinner: dal, bhindi fry, chapati" },
          { name: "Fri", price: "Dosa · Veg pulao & raita", note: "Dinner: egg curry / kadai veg, chapati" },
          { name: "Sat", price: "Bread-omelette / bhurji · Curd rice", note: "Dinner: pav bhaji" },
        ] },
        { category: "Sunday Special", items: [
          { name: "Sun", price: "Puri bhaji · Chicken / veg biryani", note: "Dinner: light khichdi & papad, dessert" },
        ] },
      ] }, style: { cardRadius: "lg" } },
      { type: "pricingPlans", content: { eyebrow: "MEAL PLANS", title: "For Co-living", titleHighlight: "Residents", plans: [
        { name: "Breakfast only", price: "₹1,500", period: "/month", features: ["Daily breakfast", "Tea & coffee"], featured: false, buttonLabel: "Ask Us", buttonHref: "/contact" },
        { name: "Breakfast + Dinner", price: "₹3,500", period: "/month", features: ["Daily breakfast & dinner", "Sunday special", "Tea & coffee"], featured: true, buttonLabel: "Ask Us", buttonHref: "/contact" },
        { name: "All 3 meals", price: "₹4,500", period: "/month", features: ["Breakfast, packed lunch & dinner", "Sunday special", "Evening snacks"], featured: false, buttonLabel: "Ask Us", buttonHref: "/contact" },
      ] }, style: { background: "light", cardRadius: "lg" } },
    ] },
    { slug: "house-rules", title: "House Rules", isSystem: true, order: 4, sections: [
      { type: "banner", content: { title: "House", titleHighlight: "Rules", subtitle: "A few simple rules so everyone can study, work and sleep in peace.", image: "", bgColor: "", imageOpacity: 30, overlayOpacity: 70 } },
      houseRules,
      { type: "steps", content: { eyebrow: "MOVING IN", title: "Move In in", titleHighlight: "3 Easy Steps", items: [
        { title: "Visit & Choose", text: "See the room and pick your bed — first meal on us.", icon: "map-pin" },
        { title: "KYC & Deposit", text: "Aadhaar, college/office ID, a photo and one month's refundable deposit.", icon: "clipboard" },
        { title: "Move In", text: "Collect your key and Wi-Fi password — the warden shows you around.", icon: "key" },
      ] }, style: { layout: "cards", background: "light" } },
    ] },
    { slug: "book-visit", title: "Book a Visit", isSystem: true, order: 5, sections: [
      { type: "appointmentForm", content: { title: "Book a Free Visit", subtitle: "Tell us your preferred branch, sharing type and move-in date — we'll confirm on WhatsApp within an hour." } },
      { type: "openingHours", content: { eyebrow: "VISITING HOURS", title: "When to", titleHighlight: "Drop By", note: "Walk-ins welcome, but booking ensures the manager is there to show you around.", days: [
        { day: "Monday – Saturday", hours: "10:00 AM – 8:00 PM" },
        { day: "Sunday", hours: "11:00 AM – 6:00 PM" },
      ] }, style: { background: "light" } },
    ] },
    { slug: "about", title: "About Us", isSystem: true, order: 6, sections: [
      { type: "banner", content: { title: "About", titleHighlight: biz, subtitle: "Six branches, 480+ residents, one family running it all.", image: "", bgColor: "", imageOpacity: 30, overlayOpacity: 70 } },
      { type: "about", content: { eyebrow: "OUR STORY", title: "It Started With", titleHighlight: "Six Students", body: [
        `In 2015 we rented out four rooms of our family home to six engineering students who couldn't find decent food near college. ${biz} grew from there — one branch at a time.`,
        "We still personally inspect every kitchen every week, and every resident has the owner's number.",
      ], image: "", points: ["Owner-managed since 2015", "Trained cooks & wardens", "Fire-safety audited", "Police-verified staff"], buttonLabel: "", buttonHref: "" }, style: { layout: "reverse" } },
      stats,
      testimonials,
    ] },
    { slug: "contact", title: "Contact Us", isSystem: true, order: 7, sections: [
      { type: "contactInfo", content: { eyebrow: "SAY HELLO", title: "Talk to", titleHighlight: "Us", address: `5th Block, Koramangala, ${CITY}`, phone: PHONE, email: EMAIL, hours: "Every day: 9 AM – 9 PM", mapEmbed: "" } },
      { type: "contactForm", content: { title: "Ask Us Anything", subtitle: "Room availability, food, rules or corporate stays — we reply within the hour." }, style: { background: "light" } },
      { type: "map", content: { eyebrow: "", title: "Find Our", titleHighlight: "Main Branch", address: `5th Block, Koramangala, ${CITY}`, mapEmbed: "" } },
    ] },
  ],
};
