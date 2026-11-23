import type { TemplateDef, SectionSeed } from "./types";
import type { SectionContentMap } from "../config";

// Pure-veg Jain & satvik catering: calm saffron + tulsi green on ivory, Mukta,
// minimal header, marquee hero, soft pill-round cards, rules-of-the-kitchen trust.
const PHONE = "98250 17394";

const cta: SectionSeed<"cta"> = {
  type: "cta",
  content: { title: "Paryushan, pooja, wedding or bhandara?", highlight: "Shuddh Jain & Satvik Menus, Planned With You", phones: [PHONE], buttonLabel: "Enquire for Your Event", buttonHref: "/enquiry" },
  style: { background: "primary" },
};

const thalis: SectionSeed<"pricingPlans"> = {
  type: "pricingPlans",
  content: {
    eyebrow: "PER-THALI PACKAGES", title: "Shuddh Bhojan,", titleHighlight: "Honest Pricing",
    plans: [
      { name: "Satvik Thali", price: "₹299", period: "/thali", features: ["2 sabzi, dal, kadhi", "Rice, 3 phulkas or puri", "1 sweet, papad, salad", "No onion, no garlic"], featured: false, buttonLabel: "Enquire", buttonHref: "/enquiry" },
      { name: "Jain Utsav Thali", price: "₹449", period: "/thali", features: ["No root vegetables, onion or garlic", "3 sabzi incl. raw banana / kacha papaya", "Dal-dhokli or kadhi-khichdi", "2 sweets & farsan", "Served before sunset on request"], featured: true, buttonLabel: "Enquire", buttonHref: "/enquiry" },
      { name: "Shubh Vivah Buffet", price: "₹749", period: "/guest", features: ["Gujarati, Rajasthani & Marwadi spread", "Live Jain chaat & dhokla counter", "4 sweets incl. live jalebi", "Separate Jain & satvik lines"], featured: false, buttonLabel: "Enquire", buttonHref: "/enquiry" },
    ],
  },
  style: { background: "light", cardRadius: "lg", cardShadow: "sm" },
};

const jainMenu: SectionSeed<"priceList"> = {
  type: "priceList",
  content: {
    eyebrow: "JAIN & SATVIK MENU", title: "Dishes Without", titleHighlight: "Onion, Garlic or Roots",
    note: "Per-plate add-on prices for 100+ guests. All dishes made with filtered water, no root vegetables in Jain menus, and cooked & served before sunset on request.",
    groups: [
      { category: "Farsan", items: [
        { name: "Khaman Dhokla", price: "₹30", note: "" },
        { name: "Jain Kachori (no potato)", price: "₹35", note: "Moong dal filling" },
        { name: "Patra", price: "₹30", note: "" },
        { name: "Khandvi", price: "₹35", note: "" },
      ] },
      { category: "Sabzi & Dal", items: [
        { name: "Paneer Tikka Masala (Jain)", price: "₹70", note: "Tomato-cashew gravy" },
        { name: "Kacha Kela Methi", price: "₹45", note: "" },
        { name: "Gatte ki Sabzi", price: "₹50", note: "" },
        { name: "Gujarati Dal / Kadhi", price: "₹30", note: "" },
      ] },
      { category: "Rice & Breads", items: [
        { name: "Jeera Rice / Khichdi", price: "₹30", note: "" },
        { name: "Bajra Rotla & Phulka", price: "₹25", note: "" },
        { name: "Masala Puri", price: "₹25", note: "" },
      ] },
      { category: "Mithai", items: [
        { name: "Mohanthal", price: "₹45", note: "" },
        { name: "Shrikhand / Amrakhand", price: "₹50", note: "" },
        { name: "Dudhpak", price: "₹45", note: "" },
      ] },
    ],
  },
  style: { cardRadius: "lg" },
};

export const jainSatvikCatering: TemplateDef = {
  theme: {
    colors: { primary: "#c2620a", primaryDark: "#9a4a06", secondary: "#3f6212", accent: "#65a30d", dark: "#2b1a05", light: "#fffbeb", text: "#4b3b2a", heading: "#2b1a05" },
    font: "Mukta", radius: "1.25rem",
  },
  header: (biz) => ({
    design: "minimal",
    logoText: biz, logoImage: "",
    announcement: { show: true, text: "Paryushan Parva tiffins & ekasana thalis — bookings open", link: "/enquiry" },
    topbar: { show: true, address: "Navrangpura, Ahmedabad · 100% pure veg kitchen", phones: [PHONE], email: "seva@example.com", social: { facebook: "#", instagram: "#", whatsapp: "#" } },
    nav: [
      { label: "Home", href: "/" }, { label: "Jain Menu", href: "/jain-menu" }, { label: "Religious Events", href: "/religious-events" },
      { label: "Weddings", href: "/weddings" }, { label: "Our Kitchen", href: "/our-kitchen" }, { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Enquire Now", href: "/enquiry" },
  }),
  footer: (biz) => ({
    design: "minimal",
    about: `${biz} is a 100% pure-vegetarian caterer for Jain, satvik and Swaminarayan menus — no onion, no garlic, no root vegetables, and never any egg or meat in our kitchen.`,
    columns: [
      { title: "Catering", links: [ { label: "Jain Menu", href: "/jain-menu" }, { label: "Religious Events", href: "/religious-events" }, { label: "Weddings", href: "/weddings" } ] },
      { title: "About", links: [ { label: "Our Kitchen", href: "/our-kitchen" }, { label: "Enquiry", href: "/enquiry" }, { label: "Contact", href: "/contact" } ] },
    ],
    serviceAreas: ["Jain Weddings", "Paryushan & Ayambil", "Temple Bhandara", "Satsang & Katha", "Griha Pravesh", "Navkarshi"],
    contact: { phones: [PHONE], email: "seva@example.com", address: "Navrangpura, Ahmedabad" },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. Shuddh, satvik, seva-bhaav se.`,
  }),
  seo: (biz) => ({
    title: `${biz} — Pure Veg Jain & Satvik Caterers for Weddings & Religious Events`,
    description: "100% pure-veg Jain and satvik catering — no onion, no garlic, no root vegetables. Paryushan, temple bhandara, satsang and Jain wedding menus from ₹299 per thali.",
    favicon: "", ogImage: "",
    keywords: "jain caterers, satvik catering, no onion no garlic catering, pure veg caterers ahmedabad, paryushan food, jain wedding catering, bhandara catering",
    businessType: "FoodEstablishment", priceRange: "₹₹",
  }),
  services: [
    { category: "Religious Events", title: "Paryushan & Ayambil Meals", description: "Ekasana, biyasana and ayambil thalis cooked strictly as per tithi." },
    { category: "Religious Events", title: "Temple Bhandara & Mahaprasad", description: "Prasad bhojan for 500 to 20,000 devotees, served in pangat or buffet." },
    { category: "Religious Events", title: "Satsang, Katha & Pooja", description: "Satvik bhojan for Bhagwat katha, Sundarkand and griha pravesh." },
    { category: "Family Functions", title: "Jain Wedding Catering", description: "Full wedding menus with separate Jain, satvik and regular veg lines." },
    { category: "Family Functions", title: "Navkarshi & Sunset Dinners", description: "Breakfast after sunrise and dinners served before sunset (chovihar)." },
    { category: "Family Functions", title: "South Indian Satvik Spread", description: "Idli, dosa and banana-leaf meals without onion or garlic." },
    { category: "Daily Seva", title: "Jain Tiffin Service", description: "Daily Jain lunch dabbas for families, students and senior citizens." },
  ],
  gallery: [
    "Gujarati Jain thali", "Banana-leaf satvik bhojan", "Fresh vegetables, checked by hand", "Idli & coconut chutney",
    "Masala dosa without onion", "Dal-rice thali", "Bhandara pangat seva", "Satvik ingredients",
  ].map((caption) => ({ category: "Shuddh Bhojan", caption })),
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "marquee", customHtml: "",
          badge: "100% PURE VEG · NO ONION · NO GARLIC · NO ROOTS", titleTop: "Shuddh Jain & Satvik Bhojan,", titleHighlight: "Cooked With Shraddha",
          subtitle: "", description: `${biz} caters Jain weddings, Paryushan meals, temple bhandaras and satsangs with menus that follow every rule — and taste like a feast.`, image: "",
          primaryBtn: { label: "Enquire for Your Event", href: "/enquiry" }, secondaryBtn: { label: "View Jain Menu", href: "/jain-menu" },
          features: [
            { icon: "leaf", title: "Pure Veg Kitchen", text: "" }, { icon: "sparkles", title: "Filtered Water Only", text: "" },
            { icon: "clock", title: "Sunset Service", text: "" }, { icon: "heart", title: "Seva Bhaav", text: "" },
          ],
        } },
        { type: "visionMission", content: {
          eyebrow: "OUR KITCHEN RULES",
          visionTitle: "No Compromise", visionText: "Not a single egg, onion, garlic or root vegetable enters our Jain kitchen — not even for other orders.",
          missionTitle: "Cooked as Per Tithi", missionText: "We follow the Jain calendar for green-vegetable restrictions on ashtami, chaudas and during Paryushan.",
          valuesTitle: "How We Cook",
          values: [
            { icon: "droplets", title: "Filtered & Boiled Water", text: "All cooking and drinking water is filtered and boiled." },
            { icon: "leaf", title: "Hand-Checked Vegetables", text: "Leafy greens and grains checked for insects before cooking." },
            { icon: "shield", title: "Separate Vessels", text: "Dedicated utensils and cooks for Jain orders only." },
          ],
        } },
        { type: "serviceCategories", content: { eyebrow: "WHAT WE CATER", title: "From Pooja to", titleHighlight: "Pheras", categories: ["Religious Events", "Family Functions", "Daily Seva"] }, style: { layout: "tiles", cardRadius: "lg" } },
        thalis,
        { type: "about", content: {
          eyebrow: "OUR STORY", title: "A Family Kitchen That Grew With", titleHighlight: "the Sangh",
          body: [`${biz} began in 1994 cooking ayambil meals for the upashraya next door. Over three decades we have served Jain sanghs, temple trusts and families across Gujarat and Mumbai.`, "Our maharajs are trained in Jain cooking rules, and a family member supervises every large event personally."],
          image: "", points: ["30 years of Jain catering", "Trained Jain maharajs", "Pangat & buffet service", "Events up to 20,000 devotees"],
          buttonLabel: "Inside Our Kitchen", buttonHref: "/our-kitchen",
        }, style: { layout: "split" } },
        { type: "stats", content: { items: [
          { value: "30 yrs", label: "Pure Veg Since 1994", icon: "leaf" }, { value: "4,000+", label: "Events Served", icon: "calendar" },
          { value: "20,000", label: "Largest Bhandara", icon: "users" }, { value: "0", label: "Onion or Garlic. Ever.", icon: "shield" },
        ] }, style: { layout: "cards" } },
        jainMenu,
        { type: "imageBanner", content: { title: "Bhandara for thousands, served with care", subtitle: "Pangat seva on banana leaves or a buffet — our volunteers and staff serve every devotee with respect.", buttonLabel: "Religious Events", buttonHref: "/religious-events", image: "" } },
        { type: "testimonials", content: { eyebrow: "BLESSINGS", title: "Trusted by Sanghs &", titleHighlight: "Families", items: [
          { name: "Hemant Shah", role: "Trustee, Jain Sangh", text: "Eight days of Paryushan meals for 1,500 people, strictly as per tithi. Not one complaint from our elders.", rating: 5 },
          { name: "Rupal & Chirag Mehta", role: "Jain wedding · 700 guests", text: "Both our families were happy — Jain line, satvik line and a live dhokla counter. The mohanthal was outstanding.", rating: 5 },
          { name: "Swami Anand Prakash", role: "Ashram, Bhagwat katha", text: "Seven days of satvik bhojan for devotees, simple and pure. Their team served with real seva bhaav.", rating: 5 },
        ] }, style: { layout: "default" } },
        { type: "faq", content: { eyebrow: "FAQ", title: "Jain & Satvik", titleHighlight: "Questions", intro: "How we keep every meal shuddh.", items: [
          { q: "Is your kitchen fully vegetarian?", a: "Yes. No egg, meat or alcohol has ever entered our kitchen or vehicles." },
          { q: "What is the difference between Jain and satvik menus?", a: "Satvik menus avoid onion and garlic. Jain menus also avoid root vegetables like potato, carrot, ginger and beetroot, and follow tithi rules." },
          { q: "Can you serve before sunset (chovihar)?", a: "Yes. We plan cooking and service so the meal is completed before sunset on the day of your event." },
          { q: "Do you cater outside Ahmedabad?", a: "We regularly cater in Gujarat, Mumbai and at tirth sthals like Palitana and Shankheshwar. Travel is quoted separately." },
        ] } as SectionContentMap["faq"], style: { layout: "split", background: "light" } },
        cta,
      ],
    },
    { slug: "jain-menu", title: "Jain Menu", isSystem: true, order: 1, sections: [
      { type: "banner", content: { title: "Jain &", titleHighlight: "Satvik Menu", subtitle: "Gujarati, Rajasthani, Marwadi and South Indian — all without onion, garlic or roots.", image: "", bgColor: "", imageOpacity: 40, overlayOpacity: 60 } },
      jainMenu,
      thalis,
      cta,
    ] },
    { slug: "religious-events", title: "Religious Events", isSystem: true, order: 2, sections: [
      { type: "about", content: {
        eyebrow: "RELIGIOUS EVENTS", title: "Paryushan, Bhandara &", titleHighlight: "Satsang Bhojan",
        body: ["We plan meals around the ritual — ekasana and ayambil thalis during Paryushan, mahaprasad for temple utsavs, and simple satvik bhojan for kathas and satsangs.", "For large bhandaras we bring our own pangat seating, banana leaves or eco-friendly plates, and trained serving staff."],
        image: "", points: ["Ayambil & ekasana thalis", "Pangat or buffet seva", "Eco-friendly patravali plates", "Events up to 20,000 devotees"],
        buttonLabel: "Plan an Event", buttonHref: "/enquiry",
      } },
      { type: "serviceCategories", content: { eyebrow: "SEVA", title: "Religious", titleHighlight: "Catering", categories: ["Religious Events", "Daily Seva"] }, style: { background: "light", cardRadius: "lg" } },
      { type: "steps", content: { eyebrow: "HOW WE PLAN", title: "Planned Around", titleHighlight: "the Ritual", items: [
        { title: "Share Tithi & Dates", text: "We check the Jain calendar", icon: "calendar" },
        { title: "Menu by Ritual", text: "Ayambil, ekasana or satvik", icon: "clipboard" },
        { title: "Kitchen Setup", text: "On-site or central kitchen", icon: "utensils" },
        { title: "Seva on the Day", text: "Pangat or buffet service", icon: "heart" },
      ] }, style: { layout: "timeline" } },
      cta,
    ] },
    { slug: "weddings", title: "Weddings", isSystem: true, order: 3, sections: [
      { type: "imageBanner", content: { title: "Jain weddings, every function covered", subtitle: "Mameru, mehendi, sangeet, pheras and reception — with separate Jain and satvik lines at every meal.", buttonLabel: "Get a Wedding Quote", buttonHref: "/enquiry", image: "" } },
      thalis,
      { type: "gallery", content: { eyebrow: "WEDDING SPREADS", title: "Shuddh", titleHighlight: "Celebrations" }, style: { layout: "strip" } },
      cta,
    ] },
    { slug: "our-kitchen", title: "Our Kitchen", isSystem: true, order: 4, sections: [
      { type: "features", content: { items: [
        { icon: "droplets", title: "Filtered, Boiled Water", text: "Every drop used for cooking is filtered and boiled." },
        { icon: "leaf", title: "Hand-Checked Greens & Grains", text: "Sorted and checked before use, as per Jain practice." },
        { icon: "shield", title: "Dedicated Utensils", text: "Jain orders have their own vessels, ladles and cooks." },
        { icon: "clock", title: "Fresh, Same-Day Cooking", text: "No leftovers ever reused — food is cooked for each event." },
      ] }, style: { layout: "numbered" } },
      { type: "gallery", content: { eyebrow: "GALLERY", title: "From Our", titleHighlight: "Rasoda" }, style: { layout: "masonry" } },
      cta,
    ] },
    { slug: "enquiry", title: "Enquiry", isSystem: true, order: 5, sections: [
      { type: "quoteForm", content: { title: "Enquire for Your Event", subtitle: "Share the occasion, date, guest count and whether you need Jain, satvik or both menus. We'll call you back within 2 hours.", showSidebar: true } },
    ] },
    { slug: "contact", title: "Contact Us", isSystem: true, order: 6, sections: [
      { type: "contactInfo", content: { eyebrow: "CONTACT", title: "Talk to Our", titleHighlight: "Seva Team", address: "Navrangpura, Ahmedabad", phone: PHONE, email: "seva@example.com", hours: "8 AM – 9 PM, all days", mapEmbed: "" } },
      { type: "contactForm", content: { title: "Send a Message", subtitle: "Tiffin, small pooja or a large sangh event — we're happy to help." } },
    ] },
  ],
};
