import type { TemplateDef, SectionSeed } from "./types";

const PHONE = "9000000000";
const ADDRESS = "Road No. 12, Banjara Hills, Hyderabad";
const MAP = "https://maps.google.com/maps?q=Banjara%20Hills%20Hyderabad&output=embed";

const hours: SectionSeed<"openingHours"> = {
  type: "openingHours",
  content: {
    eyebrow: "TIMINGS", title: "We're Open", titleHighlight: "All Week",
    note: "Kitchen closes 30 minutes before closing time. Walk-ins welcome; weekend tables fill fast — book ahead.",
    days: [
      { day: "Monday – Thursday", hours: "12:00 PM – 11:00 PM" },
      { day: "Friday", hours: "12:00 PM – 11:30 PM" },
      { day: "Saturday – Sunday", hours: "11:30 AM – 12:00 AM" },
      { day: "Sunday Brunch Buffet", hours: "11:30 AM – 3:30 PM" },
    ],
  },
  style: { background: "light" },
};

const cta: SectionSeed<"cta"> = {
  type: "cta",
  content: { title: "Hungry already?", highlight: "Reserve Your Table in 30 Seconds", phones: [PHONE], buttonLabel: "Book a Table", buttonHref: "/book" },
};

const fullMenu: SectionSeed<"priceList"> = {
  type: "priceList",
  content: { eyebrow: "", title: "Our", titleHighlight: "Menu", note: "All prices inclusive of GST. Jain and less-spicy versions available on request.", groups: [
    { category: "Starters", items: [
      { name: "Paneer Tikka Angaar", price: "₹280", note: "Smoky, char-grilled cottage cheese" },
      { name: "Chicken 65", price: "₹310", note: "Hyderabadi classic, curry-leaf tempered" },
      { name: "Tandoori Mushroom", price: "₹260", note: "" },
      { name: "Crispy Corn Pepper Salt", price: "₹220", note: "" },
      { name: "Apollo Fish", price: "₹360", note: "" },
    ] },
    { category: "Mains", items: [
      { name: "Butter Chicken", price: "₹380", note: "Our most-ordered dish" },
      { name: "Paneer Butter Masala", price: "₹320", note: "" },
      { name: "Dal Makhani", price: "₹260", note: "Slow-cooked overnight" },
      { name: "Mutton Rogan Josh", price: "₹440", note: "" },
    ] },
    { category: "Biryani & Rice", items: [
      { name: "Hyderabadi Chicken Dum Biryani", price: "₹320", note: "Serves 1–2" },
      { name: "Mutton Dum Biryani", price: "₹420", note: "" },
      { name: "Veg Dum Biryani", price: "₹260", note: "" },
      { name: "Jeera Rice", price: "₹160", note: "" },
    ] },
    { category: "Breads", items: [
      { name: "Butter Naan", price: "₹60", note: "" },
      { name: "Garlic Naan", price: "₹75", note: "" },
      { name: "Lachha Paratha", price: "₹65", note: "" },
    ] },
    { category: "Desserts & Drinks", items: [
      { name: "Double Ka Meetha", price: "₹140", note: "" },
      { name: "Gulab Jamun (2 pcs)", price: "₹110", note: "" },
      { name: "Mango Lassi", price: "₹130", note: "" },
      { name: "Fresh Lime Soda", price: "₹90", note: "" },
    ] },
  ] },
};

export const restaurant: TemplateDef = {
  theme: {
    colors: { primary: "#d9412b", primaryDark: "#b12f1c", secondary: "#1f1512", accent: "#f4a340", dark: "#170f0c", light: "#fdf6ee", text: "#4a3f3a", heading: "#1f1512" },
    font: "Outfit", radius: "1rem",
  },
  header: (biz) => ({
    logoText: biz, logoImage: "",
    announcement: { show: false, text: "🍽️ Sunday Brunch Buffet — unlimited starters, mains & desserts. Book now!", link: "/book" },
    topbar: { show: true, address: "Open daily 12 PM – 11 PM · Dine-in · Takeaway · Delivery", phones: [PHONE], email: "hello@example.com", social: { facebook: "#", instagram: "#", whatsapp: "#" } },
    nav: [
      { label: "Home", href: "/" },
      { label: "Menu", href: "/menu" },
      { label: "Gallery", href: "/gallery" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Book a Table", href: "/book" },
  }),
  footer: (biz) => ({
    about: "Slow-cooked curries, dum biryani and tandoor classics in a warm, modern space. Dine in, take away or let us cater your next celebration.",
    columns: [
      { title: "Quick Links", links: [
        { label: "Home", href: "/" }, { label: "Menu", href: "/menu" }, { label: "Gallery", href: "/gallery" }, { label: "Book a Table", href: "/book" }, { label: "Contact", href: "/contact" },
      ] },
      { title: "Hours", links: [
        { label: "Mon–Thu: 12 PM – 11 PM", href: "#" }, { label: "Fri: 12 PM – 11:30 PM", href: "#" }, { label: "Sat–Sun: 11:30 AM – 12 AM", href: "#" }, { label: "Party & Catering Enquiries", href: "/book" },
      ] },
    ],
    serviceAreas: ["Dine-in", "Takeaway", "Home Delivery", "Private Dining", "Party Hall", "Outdoor Catering"],
    contact: { phones: [PHONE], email: "hello@example.com", address: ADDRESS },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. All Rights Reserved.`,
  }),
  seo: (biz) => ({
    title: `${biz} — Biryani, Tandoor & North Indian Restaurant`,
    description: "Hyderabadi dum biryani, tandoor grills and rich curries. Dine in, order takeaway, host a party or book a table online in seconds.",
    favicon: "", ogImage: "",
    keywords: "restaurant, biryani, north indian food, family restaurant, party hall, catering, table booking",
    businessType: "Restaurant",
  }),
  services: [
    { category: "Dining", title: "Dine-in", description: "Family-friendly seating with an open kitchen and live tandoor." },
    { category: "Dining", title: "Takeaway", description: "Order ahead and pick up hot, sealed and ready in 20 minutes." },
    { category: "Dining", title: "Home Delivery", description: "Spill-proof packaging so it tastes just as good at home." },
    { category: "Dining", title: "Sunday Brunch Buffet", description: "Unlimited starters, mains, live counters and desserts." },
    { category: "Events & Catering", title: "Private Dining", description: "A reserved space for 10–25 guests with a curated menu." },
    { category: "Events & Catering", title: "Party Hall", description: "Birthdays, kitty parties and anniversaries for up to 80 guests." },
    { category: "Events & Catering", title: "Outdoor Catering", description: "Weddings, poojas and house parties — menu, staff and service." },
    { category: "Events & Catering", title: "Corporate Lunches", description: "Daily office meal boxes and team-lunch packages." },
  ],
  gallery: [
    ...["Signature dum biryani", "Tandoor platter", "Butter chicken", "Desserts"].map((c) => ({ category: "Our Food", caption: c })),
    ...["Main dining hall", "Private dining room", "Live tandoor counter", "Party setup"].map((c) => ({ category: "Our Space", caption: c })),
  ],
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "marquee", customHtml: "",
          badge: "DUM BIRYANI · TANDOOR · CURRIES", titleTop: "Slow-Cooked Flavour,", titleHighlight: "Served Fresh Daily",
          subtitle: "", description: `At ${biz}, biryani is sealed and dum-cooked for hours, breads come straight off the tandoor and every curry starts from whole spices ground in-house.`, image: "",
          primaryBtn: { label: "Book a Table", href: "/book" }, secondaryBtn: { label: "Explore the Menu", href: "/menu" },
          features: [ { icon: "star", title: "Rated 4.8 by Diners", text: "" }, { icon: "utensils", title: "Fresh Every Service", text: "" }, { icon: "clock", title: "Served in 15 Minutes", text: "" }, { icon: "users", title: "Family Seating", text: "" } ],
        } },
        { type: "features", content: { items: [
          { icon: "utensils", title: "Cooked From Scratch", text: "No pre-mixes, no shortcuts — masalas ground in our kitchen every morning." },
          { icon: "badge-check", title: "Spotless Kitchen", text: "FSSAI-licensed with daily hygiene checks you can see through our open kitchen." },
          { icon: "clock", title: "Quick Service", text: "Starters on your table in about 15 minutes, even on busy weekends." },
          { icon: "heart", title: "Made for Families", text: "Kids' portions, high chairs and less-spicy versions on request." },
        ] }, style: { cardShadow: "md" } },
        { type: "about", content: {
          eyebrow: "OUR STORY", title: "Recipes Passed Down,", titleHighlight: "Plated for Today",
          body: [
            `${biz} began with a family recipe for dum biryani and a simple promise — cook it the slow way, every single day.`,
            "Today our chefs bring the same care to tandoor grills, rich gravies and classic desserts, served in a space that is as comfortable for a quick lunch as it is for a big celebration.",
          ],
          image: "", points: ["Whole spices, ground in-house", "Charcoal tandoor & dum kitchen", "Veg and non-veg kitchens kept separate", "Warm, attentive service"],
          buttonLabel: "Read Our Story", buttonHref: "/about",
        } },
        { type: "priceList", content: { eyebrow: "CHEF'S PICKS", title: "Dishes Guests", titleHighlight: "Come Back For", note: "Prices inclusive of GST. Full menu has 60+ dishes.", groups: [
          { category: "Starters", items: [ { name: "Paneer Tikka Angaar", price: "₹280", note: "Smoky, char-grilled" }, { name: "Chicken 65", price: "₹310", note: "Hyderabadi classic" }, { name: "Tandoori Mushroom", price: "₹260", note: "" } ] },
          { category: "Mains & Biryani", items: [ { name: "Chicken Dum Biryani", price: "₹320", note: "Our signature" }, { name: "Butter Chicken", price: "₹380", note: "" }, { name: "Dal Makhani", price: "₹260", note: "Slow-cooked overnight" } ] },
          { category: "Desserts & Drinks", items: [ { name: "Double Ka Meetha", price: "₹140", note: "" }, { name: "Mango Lassi", price: "₹130", note: "" } ] },
        ] } },
        { type: "stats", content: { items: [ { value: "60+", label: "Dishes on the Menu", icon: "utensils" }, { value: "1 Lakh+", label: "Happy Diners", icon: "users" }, { value: "4.8★", label: "Google Rating", icon: "star" }, { value: "10+", label: "Years of Flavour", icon: "award" } ] } },
        { type: "serviceCategories", content: { eyebrow: "DINE · ORDER · CELEBRATE", title: "More Than a", titleHighlight: "Meal", categories: ["Dining", "Events & Catering"] } },
        { type: "testimonials", content: { eyebrow: "GUEST REVIEWS", title: "What Our", titleHighlight: "Guests Say", items: [
          { name: "Sameer Qureshi", role: "Regular since 2019", text: "The dum biryani here is the closest to home-style I've found in the city. Perfectly layered rice, tender meat, and the raita is spot on.", rating: 5 },
          { name: "Kavya Menon", role: "Birthday party host", text: "Hosted my daughter's birthday for 40 guests in the party hall. Decor, food and service were all handled beautifully.", rating: 5 },
          { name: "Rajesh Agarwal", role: "Corporate client", text: "We order team lunches every Friday. Always on time, well packed and the quality has never dropped.", rating: 5 },
          { name: "Neha Joshi", role: "Food blogger", text: "Their Paneer Tikka Angaar and Double Ka Meetha are must-tries. Lovely ambience for a family dinner.", rating: 5 },
        ] } },
        hours,
        { type: "map", content: { eyebrow: "FIND US", title: "Come Hungry,", titleHighlight: "Leave Happy", address: ADDRESS, mapEmbed: MAP } },
        { type: "faq", content: { eyebrow: "FAQ", title: "Good to", titleHighlight: "Know", items: [
          { q: "Do I need to book a table?", a: "Walk-ins are always welcome, but we recommend booking for Friday to Sunday evenings and for groups of six or more." },
          { q: "Do you have pure vegetarian options?", a: "Yes. Nearly half our menu is vegetarian, cooked in a separate veg section with separate utensils. Jain preparations are available on request." },
          { q: "Is parking available?", a: "Yes, we have dedicated parking for cars and two-wheelers, plus valet parking on weekend evenings." },
          { q: "Can I host a birthday or office party?", a: "Absolutely. Our party hall seats up to 80 guests and our private dining room seats 10–25. Set menus start from ₹650 per person." },
          { q: "Do you deliver?", a: "Yes, within a 6 km radius directly, and across the city through popular food delivery apps." },
          { q: "Do you cater outside events?", a: "We cater weddings, poojas, house parties and corporate events — complete with service staff. Share your guest count for a quote." },
        ] } },
        cta,
      ],
    },
    { slug: "menu", title: "Menu", isSystem: true, order: 1, sections: [
      fullMenu,
      { type: "cta", content: { title: "Found your favourite?", highlight: "Reserve a Table", phones: [PHONE], buttonLabel: "Book a Table", buttonHref: "/book" } },
    ] },
    { slug: "gallery", title: "Gallery", isSystem: true, order: 2, sections: [
      { type: "gallery", content: { eyebrow: "", title: "A Taste of", titleHighlight: "Our Kitchen" } },
      cta,
    ] },
    { slug: "about", title: "About", isSystem: true, order: 3, sections: [
      { type: "about", content: { eyebrow: "OUR STORY", title: "Born From a", titleHighlight: "Family Recipe", body: [
        `${biz} started with one pot of dum biryani and a family that loved feeding people. Word spread, the tables filled up, and the menu grew — but the slow-cooking never changed.`,
        "We source fresh produce every morning, grind our own spice blends and cook every dish to order. It takes longer. It tastes better.",
      ], image: "", points: ["Family recipes", "Fresh, local produce", "Loved by regulars", "Separate veg kitchen"], buttonLabel: "", buttonHref: "" } },
      { type: "team", content: { eyebrow: "THE KITCHEN", title: "Meet Our", titleHighlight: "Chefs", members: [
        { name: "Chef Imran Khan", role: "Head Chef — Biryani & Dum", image: "", note: "20 years of Hyderabadi cuisine" },
        { name: "Chef Gurpreet Singh", role: "Tandoor Specialist", image: "", note: "Charcoal grills & breads" },
        { name: "Chef Lakshmi Iyer", role: "Pastry & Desserts", image: "", note: "Traditional Indian sweets" },
      ] } },
      hours,
      cta,
    ] },
    { slug: "contact", title: "Contact", isSystem: true, order: 4, sections: [
      { type: "contactForm", content: { title: "Contact & Location", subtitle: "Reservations, party enquiries or feedback — we reply within the hour." } },
      { type: "map", content: { eyebrow: "", title: "Find", titleHighlight: "Us", address: ADDRESS, mapEmbed: MAP } },
    ] },
    { slug: "book", title: "Book a Table", isSystem: true, order: 5, sections: [
      { type: "appointmentForm", content: { title: "Reserve Your Table", subtitle: "Pick a date, time and party size — we'll confirm on WhatsApp and keep your table ready." } },
      hours,
    ] },
  ],
};
