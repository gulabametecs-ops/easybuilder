import type { TemplateDef, SectionSeed } from "./types";
import type { SectionContentMap } from "../config";

// Tiffin / Dabba meal subscription: homely leaf green + mustard on cream,
// rounded Baloo 2, centered header, split hero, weekly menu + delivery areas.
const PHONE = "98200 41275";

const cta: SectionSeed<"cta"> = {
  type: "cta",
  content: { title: "Missing ghar ka khana?", highlight: "Your First Tiffin Can Arrive Tomorrow", phones: [PHONE], buttonLabel: "Start a Trial Meal", buttonHref: "/subscribe" },
  style: { background: "primary", layout: "split" },
};

const plans: SectionSeed<"pricingPlans"> = {
  type: "pricingPlans",
  content: {
    eyebrow: "MEAL PLANS", title: "Pick a Dabba,", titleHighlight: "Pause Anytime",
    plans: [
      { name: "Trial Week", price: "₹649", period: "/6 lunches", features: ["Dal, sabzi, 4 phulkas, rice", "Salad, pickle & papad", "Free delivery within 4 km", "No deposit"], featured: false, buttonLabel: "Try a Week", buttonHref: "/subscribe" },
      { name: "Monthly Veg", price: "₹2,799", period: "/26 meals", features: ["Lunch or dinner, Mon–Sat", "Sunday special thali", "Sweet every Wednesday", "Skip up to 4 days, carried forward", "Add dinner for ₹2,400 more"], featured: true, buttonLabel: "Subscribe", buttonHref: "/subscribe" },
      { name: "Monthly Non-Veg", price: "₹3,599", period: "/26 meals", features: ["Chicken / egg / fish 4 days a week", "Veg on Tuesdays & Thursdays", "Sunday biryani", "Skip up to 4 days"], featured: false, buttonLabel: "Subscribe", buttonHref: "/subscribe" },
    ],
  },
  style: { background: "light", cardRadius: "lg", cardShadow: "md" },
};

const weeklyMenu: SectionSeed<"priceList"> = {
  type: "priceList",
  content: {
    eyebrow: "THIS WEEK'S DABBA", title: "Our Weekly", titleHighlight: "Menu",
    note: "Menu rotates every 4 weeks. Every veg meal has dal, 1 dry + 1 gravy sabzi, 4 phulkas, rice, salad and achaar. Extra roti ₹8 each.",
    groups: [
      { category: "Mon – Wed", items: [
        { name: "Monday: Rajma, aloo gobi, jeera rice", price: "Veg", note: "" },
        { name: "Tuesday: Dal tadka, bhindi masala, kadhi", price: "Veg", note: "" },
        { name: "Wednesday: Chole, lauki chana, sooji halwa", price: "Veg", note: "Sweet day" },
      ] },
      { category: "Thu – Sat", items: [
        { name: "Thursday: Moong dal, palak paneer", price: "Veg", note: "" },
        { name: "Friday: Egg curry or paneer bhurji", price: "Veg / Egg", note: "" },
        { name: "Saturday: Chicken curry or kofta", price: "Non-veg / Veg", note: "" },
      ] },
      { category: "Add-ons", items: [
        { name: "Extra phulka", price: "₹8", note: "" },
        { name: "Bowl of curd", price: "₹20", note: "" },
        { name: "Sunday chicken biryani", price: "₹149", note: "Pre-book by Saturday" },
        { name: "Gulab jamun (2 pcs)", price: "₹30", note: "" },
      ] },
    ],
  },
  style: { cardRadius: "lg" },
};

export const tiffinService: TemplateDef = {
  theme: {
    colors: { primary: "#15803d", primaryDark: "#166534", secondary: "#713f12", accent: "#eab308", dark: "#14240f", light: "#fefce8", text: "#3f3f2e", heading: "#1a2e05" },
    font: "Baloo 2", radius: "1rem",
  },
  header: (biz) => ({
    design: "centered",
    logoText: biz, logoImage: "",
    announcement: { show: true, text: "New in Andheri & Powai: first 3 tiffins at ₹69 each", link: "/subscribe" },
    topbar: { show: true, address: "Andheri East, Mumbai · FSSAI licensed home kitchen", phones: [PHONE], email: "dabba@example.com", social: { facebook: "#", instagram: "#", whatsapp: "#" } },
    nav: [
      { label: "Home", href: "/" }, { label: "Meal Plans", href: "/meal-plans" }, { label: "Weekly Menu", href: "/menu" },
      { label: "Delivery Areas", href: "/delivery-areas" }, { label: "Gallery", href: "/gallery" }, { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Subscribe", href: "/subscribe" },
  }),
  footer: (biz) => ({
    design: "modern",
    about: `${biz} cooks home-style lunch and dinner tiffins every day — less oil, fresh phulkas and a menu that changes daily — delivered in steel dabbas to homes, PGs and offices.`,
    columns: [
      { title: "Tiffin", links: [ { label: "Meal Plans", href: "/meal-plans" }, { label: "Weekly Menu", href: "/menu" }, { label: "Subscribe", href: "/subscribe" } ] },
      { title: "Help", links: [ { label: "Delivery Areas", href: "/delivery-areas" }, { label: "Gallery", href: "/gallery" }, { label: "Contact Us", href: "/contact" } ] },
    ],
    serviceAreas: ["Andheri", "Powai", "Vile Parle", "Jogeshwari", "Goregaon", "Marol"],
    contact: { phones: [PHONE], email: "dabba@example.com", address: "Andheri East, Mumbai" },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. Made fresh, every single day.`,
  }),
  seo: (biz) => ({
    title: `${biz} — Home-Style Tiffin Service & Monthly Meal Plans`,
    description: "Veg and non-veg tiffin subscriptions from ₹649 a week. Daily changing home-style menu, steel dabbas, free delivery, pause anytime.",
    favicon: "", ogImage: "",
    keywords: "tiffin service near me, dabba service, monthly tiffin, home food delivery, veg tiffin, non veg tiffin, meal subscription",
    businessType: "FoodEstablishment", priceRange: "₹",
  }),
  services: [
    { category: "Daily Tiffin", title: "Veg Lunch Tiffin", description: "Dal, two sabzis, four phulkas, rice and salad — packed hot at 11 AM." },
    { category: "Daily Tiffin", title: "Non-Veg Tiffin", description: "Home-style chicken, egg and fish curries four days a week." },
    { category: "Daily Tiffin", title: "Dinner Dabba", description: "A lighter dinner menu — khichdi, paratha-sabzi and soups." },
    { category: "Special Plans", title: "Diet & Low-Oil Tiffin", description: "Millet rotis, steamed sabzi and measured portions for fitness goals." },
    { category: "Special Plans", title: "Student & PG Plan", description: "Budget dabbas for hostels and PGs with bigger rice portions." },
    { category: "Special Plans", title: "Sunday Special Thali", description: "Puri-chole, biryani or pav bhaji — the Sunday treat everyone waits for." },
    { category: "Office Dabbas", title: "Office Lunch Dabbas", description: "Team lunch subscriptions from 10 dabbas a day with monthly billing." },
    { category: "Office Dabbas", title: "South Indian Breakfast", description: "Idli, upma and poha delivered by 8:30 AM to homes and offices." },
  ],
  gallery: [
    "Today's veg dabba", "Packing at 11 AM", "Fresh phulkas off the tawa", "Sunday biryani",
    "Our steel dabbas", "Monday rajma-chawal", "Breakfast idli box", "Delivery riders heading out",
  ].map((caption) => ({ category: "From Our Kitchen", caption })),
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "split", customHtml: "",
          badge: "2,400+ DABBAS DELIVERED DAILY", titleTop: "Maa Jaisa Khana,", titleHighlight: "Delivered in a Steel Dabba",
          subtitle: "", description: `${biz} cooks fresh dal, sabzi and phulkas every morning and delivers them hot to your home, PG or office. Weekly or monthly plans — pause whenever you travel.`, image: "",
          primaryBtn: { label: "See Meal Plans", href: "/meal-plans" }, secondaryBtn: { label: "This Week's Menu", href: "/menu" },
          features: [
            { icon: "leaf", title: "Less Oil, No Soda", text: "" }, { icon: "clock", title: "Hot by 1 PM", text: "" },
            { icon: "truck", title: "Free Delivery", text: "" }, { icon: "calendar", title: "Pause Anytime", text: "" },
          ],
        } },
        { type: "stats", content: { items: [
          { value: "2,400+", label: "Dabbas a Day", icon: "package" }, { value: "6", label: "Areas Served", icon: "map-pin" },
          { value: "9 yrs", label: "Cooking Daily", icon: "calendar" }, { value: "4.8★", label: "Google Rating", icon: "star" },
        ] }, style: { layout: "cards", background: "light" } },
        { type: "serviceCategories", content: { eyebrow: "WHAT'S IN THE DABBA", title: "Tiffins for", titleHighlight: "Every Routine", categories: ["Daily Tiffin", "Special Plans", "Office Dabbas"] }, style: { cardRadius: "lg" } },
        plans,
        { type: "about", content: {
          eyebrow: "OUR STORY", title: "Started by a Mother,", titleHighlight: "Run Like a Family",
          body: [`${biz} began in 2016 when Sushma Kulkarni started cooking for six homesick engineering students in her building. Word spread, and today a team of 22 cooks the same way she did — fresh masalas, cold-pressed oil and phulkas rolled to order.`, "Every dabba is packed by 11 AM and reaches you within the hour. We wash and sterilise every steel box at 80°C before it goes out again."],
          image: "", points: ["Menu changes daily, repeats monthly", "Steel dabbas, no plastic", "Cooked in cold-pressed oil", "Pause by 9 PM for the next day"],
          buttonLabel: "Start Your Plan", buttonHref: "/subscribe",
        }, style: { layout: "reverse" } },
        weeklyMenu,
        { type: "steps", content: { eyebrow: "HOW IT WORKS", title: "Start Your Tiffin in", titleHighlight: "3 Minutes", items: [
          { title: "Choose a Plan", text: "Veg, non-veg, lunch, dinner or both", icon: "clipboard" },
          { title: "Share Your Address", text: "Home, PG, hostel or office", icon: "map-pin" },
          { title: "Pay by UPI", text: "Weekly or monthly, no deposit", icon: "check" },
          { title: "Eat Fresh Tomorrow", text: "Hot dabba at your door by 1 PM", icon: "truck" },
        ] }, style: { layout: "timeline" } },
        { type: "imageBanner", content: { title: "Sunday is biryani day", subtitle: "Pre-book our dum biryani or a puri-chole thali by Saturday night — it sells out every week.", buttonLabel: "View Sunday Menu", buttonHref: "/menu", image: "" } },
        { type: "testimonials", content: { eyebrow: "SUBSCRIBERS SAY", title: "Like Eating", titleHighlight: "at Home", items: [
          { name: "Rohit Deshmukh", role: "IT engineer · 2 years", text: "Moved to Mumbai alone and this tiffin saved me. The dal tastes exactly like Pune, and they remember I don't eat karela!", rating: 5 },
          { name: "Fatima Shaikh", role: "Working mother", text: "I take the dinner dabba for my in-laws. Less oil, soft phulkas, and the delivery boy is always on time.", rating: 5 },
          { name: "Ankit Jain", role: "Student, PG in Powai", text: "Student plan is very affordable and the quantity is more than enough. Sunday biryani is the highlight of my week.", rating: 5 },
        ] }, style: { layout: "featured" } },
        { type: "faq", content: { eyebrow: "FAQ", title: "Tiffin", titleHighlight: "Questions", intro: "Everything subscribers ask before their first dabba.", items: [
          { q: "Can I pause my tiffin when I travel?", a: "Yes. WhatsApp us by 9 PM and the next day's meal is paused. Paused meals are carried forward, up to 4 per month." },
          { q: "Do you deliver to offices?", a: "Yes, lunch dabbas reach offices between 12:30 and 1:30 PM. Teams of 10+ get monthly GST billing." },
          { q: "Is the food spicy?", a: "We cook medium-spicy, home-style. Tell us if you need less spice or no onion-garlic and we'll mark your dabba." },
          { q: "What if I don't like a day's menu?", a: "Swap it for our standard dal-rice-sabzi box at no extra cost — just tell us the evening before." },
        ] } as SectionContentMap["faq"], style: { layout: "split", background: "light" } },
        cta,
      ],
    },
    { slug: "meal-plans", title: "Meal Plans", isSystem: true, order: 1, sections: [
      { type: "banner", content: { title: "Meal", titleHighlight: "Plans", subtitle: "Weekly, monthly, lunch, dinner or both — every plan can be paused.", image: "", bgColor: "", imageOpacity: 40, overlayOpacity: 60 } },
      plans,
      { type: "features", content: { items: [
        { icon: "leaf", title: "Fresh Every Day", text: "Nothing cooked the night before. Vegetables bought every morning from Andheri market." },
        { icon: "shield", title: "Hygienic Kitchen", text: "FSSAI licensed, RO water, hairnets and gloves for every cook." },
        { icon: "package", title: "Steel Dabbas", text: "Four-compartment steel boxes, collected and sterilised daily." },
        { icon: "tag", title: "No Lock-in", text: "Stop anytime. Unused meals refunded at the end of the month." },
      ] }, style: { layout: "cards", cardRadius: "lg" } },
      { type: "openingHours", content: {
        eyebrow: "DELIVERY SLOTS", title: "Hot Meals,", titleHighlight: "On Schedule",
        note: "Change, swap or pause tomorrow's meal on WhatsApp before 9 PM.",
        days: [
          { day: "Breakfast (Mon – Sat)", hours: "7:30 AM – 8:30 AM" }, { day: "Lunch (Mon – Sat)", hours: "12:00 PM – 1:30 PM" },
          { day: "Dinner (Mon – Sat)", hours: "7:30 PM – 9:00 PM" }, { day: "Sunday Special", hours: "12:30 PM – 2:00 PM" },
        ],
      } },
      cta,
    ] },
    { slug: "menu", title: "Weekly Menu", isSystem: true, order: 2, sections: [
      { type: "banner", content: { title: "This Week's", titleHighlight: "Menu", subtitle: "Home-style North Indian and Maharashtrian food, changing every day.", image: "", bgColor: "", imageOpacity: 40, overlayOpacity: 60 } },
      weeklyMenu,
      { type: "imageBanner", content: { title: "Every phulka rolled to order", subtitle: "Our cooks roll and puff phulkas between 10:30 and 11 AM so they're still soft when you open the dabba.", buttonLabel: "Subscribe Now", buttonHref: "/subscribe", image: "" } },
      cta,
    ] },
    { slug: "delivery-areas", title: "Delivery Areas", isSystem: true, order: 3, sections: [
      { type: "about", content: {
        eyebrow: "WHERE WE DELIVER", title: "Free Delivery Across", titleHighlight: "6 Areas",
        body: ["Our riders leave the kitchen at 11:45 AM and 7:15 PM on fixed routes, so your dabba arrives at about the same time every day.", "Outside these areas? Message us — new routes open once 15 subscribers join from a locality."],
        image: "", points: ["Andheri East & West", "Powai & Chandivali", "Vile Parle", "Jogeshwari", "Goregaon East", "Marol & Saki Naka"],
        buttonLabel: "Check My Area", buttonHref: "/contact",
      } },
      { type: "map", content: { eyebrow: "OUR KITCHEN", title: "Cooked Fresh in", titleHighlight: "Andheri East", address: "Andheri East, Mumbai", mapEmbed: "" } },
      cta,
    ] },
    { slug: "gallery", title: "Gallery", isSystem: true, order: 4, sections: [
      { type: "gallery", content: { eyebrow: "GALLERY", title: "Inside Our", titleHighlight: "Kitchen" }, style: { layout: "masonry" } },
      cta,
    ] },
    { slug: "subscribe", title: "Subscribe", isSystem: true, order: 5, sections: [
      { type: "quoteForm", content: { title: "Start Your Tiffin", subtitle: "Tell us your plan, meal (lunch/dinner), veg or non-veg and delivery address. We'll confirm on WhatsApp within 30 minutes.", showSidebar: true } },
      { type: "faq", content: { eyebrow: "BEFORE YOU START", title: "Subscription", titleHighlight: "Basics", items: [
        { q: "How do I pay?", a: "UPI, card or cash on the first delivery. Monthly plans are paid in advance." },
        { q: "When does my plan start?", a: "Orders confirmed before 8 PM start the next working day." },
      ] } },
    ] },
    { slug: "contact", title: "Contact Us", isSystem: true, order: 6, sections: [
      { type: "contactInfo", content: { eyebrow: "CONTACT", title: "Talk to Our", titleHighlight: "Tiffin Team", address: "Andheri East, Mumbai", phone: PHONE, email: "dabba@example.com", hours: "WhatsApp: 7 AM – 10 PM, all days", mapEmbed: "" } },
      { type: "contactForm", content: { title: "Send a Message", subtitle: "Questions about plans, delivery or a custom diet? We reply within an hour." } },
    ] },
  ],
};
