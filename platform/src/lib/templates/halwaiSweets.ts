import type { TemplateDef, SectionSeed } from "./types";
import type { SectionContentMap } from "../config";

// Halwai / mithai & sweets catering: festive rani pink + gold on blush, Lora serif,
// modern header, centered hero, sweet-box gifting, wedding sweets and bulk orders.
const PHONE = "94140 52783";

const cta: SectionSeed<"cta"> = {
  type: "cta",
  content: { title: "Diwali, a wedding or 500 office gift boxes?", highlight: "Bulk Sweet Orders Confirmed in 1 Hour", phones: [PHONE], buttonLabel: "Place a Bulk Order", buttonHref: "/order" },
  style: { background: "dark", layout: "minimal" },
};

const sweetBoxes: SectionSeed<"pricingPlans"> = {
  type: "pricingPlans",
  content: {
    eyebrow: "SWEET BOXES", title: "Gift Boxes for", titleHighlight: "Every Celebration",
    plans: [
      { name: "Shagun Box", price: "₹349", period: "/500 g", features: ["Kaju katli, motichoor laddu, milk cake", "Printed festive box", "Custom name sticker", "Min order 25 boxes"], featured: false, buttonLabel: "Order Boxes", buttonHref: "/order" },
      { name: "Royal Dry-Fruit Box", price: "₹899", period: "/1 kg", features: ["Kaju roll, pista lauj, badam barfi", "Velvet box with brass handle", "Personalised message card", "Pan-India courier"], featured: true, buttonLabel: "Order Boxes", buttonHref: "/order" },
      { name: "Wedding Mithai Thaal", price: "₹2,499", period: "/thaal", features: ["2.5 kg assorted mithai", "Decorated silver-look thaal", "Silk cover & tassels", "For shagun, tilak & milni"], featured: false, buttonLabel: "Order Thaals", buttonHref: "/order" },
    ],
  },
  style: { background: "light", cardRadius: "lg", cardShadow: "lg" },
};

const rateCard: SectionSeed<"priceList"> = {
  type: "priceList",
  content: {
    eyebrow: "RATE CARD", title: "Mithai &", titleHighlight: "Namkeen",
    note: "Prices per kg. Made in pure desi ghee unless marked. Bulk rates for 20 kg+ on request.",
    groups: [
      { category: "Ghee Sweets", items: [
        { name: "Kaju Katli (silver vark)", price: "₹1,100/kg", note: "Bestseller" },
        { name: "Motichoor Laddu", price: "₹560/kg", note: "" },
        { name: "Besan Laddu", price: "₹520/kg", note: "" },
        { name: "Mysore Pak", price: "₹640/kg", note: "" },
      ] },
      { category: "Milk Sweets", items: [
        { name: "Rajbhog & Rasgulla", price: "₹420/kg", note: "" },
        { name: "Kalakand", price: "₹620/kg", note: "Made daily" },
        { name: "Alwar Milk Cake", price: "₹580/kg", note: "" },
        { name: "Kesar Peda", price: "₹600/kg", note: "" },
      ] },
      { category: "Hot Counters", items: [
        { name: "Gulab Jamun (hot)", price: "₹22/pc", note: "For events" },
        { name: "Jalebi with Rabdi", price: "₹380/kg", note: "" },
        { name: "Moong Dal Halwa", price: "₹720/kg", note: "Winter" },
      ] },
      { category: "Namkeen", items: [
        { name: "Samosa / Kachori", price: "₹20/pc", note: "" },
        { name: "Bikaneri Bhujia", price: "₹320/kg", note: "" },
        { name: "Mathri & Shakkarpara", price: "₹360/kg", note: "" },
      ] },
    ],
  },
  style: { cardRadius: "lg" },
};

export const halwaiSweets: TemplateDef = {
  theme: {
    colors: { primary: "#be185d", primaryDark: "#9d174d", secondary: "#7c2d12", accent: "#d4a017", dark: "#3b0a1f", light: "#fdf2f8", text: "#4a3540", heading: "#3b0a1f" },
    font: "Lora", radius: "1rem",
  },
  header: (biz) => ({
    design: "modern",
    logoText: biz, logoImage: "",
    announcement: { show: true, text: "Diwali gift boxes now booking — free name printing on 50+ boxes", link: "/sweet-boxes" },
    topbar: { show: true, address: "Johari Bazaar, Jaipur · Since 1968", phones: [PHONE], email: "mithai@example.com", social: { facebook: "#", instagram: "#", whatsapp: "#" } },
    nav: [
      { label: "Home", href: "/" }, { label: "Sweet Boxes", href: "/sweet-boxes" }, { label: "Wedding Sweets", href: "/wedding-sweets" },
      { label: "Rate Card", href: "/rate-card" }, { label: "Gallery", href: "/gallery" }, { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Bulk Order", href: "/order" },
  }),
  footer: (biz) => ({
    design: "centered",
    about: `${biz} has made mithai in pure desi ghee in Jaipur since 1968 — festive gift boxes, wedding sweets, live halwai counters and bulk orders for offices and temples.`,
    columns: [
      { title: "Mithai", links: [ { label: "Sweet Boxes", href: "/sweet-boxes" }, { label: "Wedding Sweets", href: "/wedding-sweets" }, { label: "Rate Card", href: "/rate-card" } ] },
      { title: "Order", links: [ { label: "Bulk Order", href: "/order" }, { label: "Gallery", href: "/gallery" }, { label: "Contact", href: "/contact" } ] },
    ],
    serviceAreas: ["Diwali Gift Boxes", "Wedding Mithai", "Live Halwai Counters", "Corporate Gifting", "Temple Prasad", "Namkeen"],
    contact: { phones: [PHONE], email: "mithai@example.com", address: "Johari Bazaar, Jaipur" },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. Mithas har mauke ki.`,
  }),
  seo: (biz) => ({
    title: `${biz} — Halwai, Mithai Gift Boxes & Wedding Sweets Catering`,
    description: "Pure desi ghee mithai since 1968. Diwali and corporate sweet boxes from ₹349, wedding mithai thaals, live jalebi and gulab jamun counters and bulk orders.",
    favicon: "", ogImage: "",
    keywords: "halwai near me, mithai shop, sweet box for diwali, wedding sweets order, bulk sweets order, kaju katli price, corporate diwali gift box, live jalebi counter",
    businessType: "FoodEstablishment", priceRange: "₹₹",
  }),
  services: [
    { category: "Festive Gifting", title: "Diwali Sweet Boxes", description: "Assorted mithai and dry-fruit boxes with custom name printing." },
    { category: "Festive Gifting", title: "Corporate Gift Hampers", description: "500 to 10,000 boxes for staff and clients, delivered across India." },
    { category: "Festive Gifting", title: "Rakhi & Bhai Dooj Boxes", description: "Small sweet boxes packed with rakhi or tilak kits." },
    { category: "Weddings", title: "Wedding Mithai Thaals", description: "Decorated thaals for shagun, tilak, roka and milni ceremonies." },
    { category: "Weddings", title: "Live Halwai Counter", description: "Hot jalebi, gulab jamun and malpua fried live at your wedding." },
    { category: "Weddings", title: "Bidaai & Return-Gift Boxes", description: "Personalised mithai boxes for guests leaving the wedding." },
    { category: "Bulk & Prasad", title: "Temple Prasad & Bhandara", description: "Boondi, laddu and halwa prasad in bulk for temples and jagrans." },
    { category: "Bulk & Prasad", title: "Samosa & Namkeen Bulk Orders", description: "Hot samosas, kachoris and namkeen for offices and parties." },
  ],
  gallery: [
    "Gulab jamun frying in the kadhai", "Laddu box packing", "Diwali gift boxes", "Hot samosas",
    "Wedding mithai spread", "Kachori and chutney", "Festive table", "Our halwai at work",
  ].map((caption) => ({ category: "Mithai Ghar", caption })),
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "centered", customHtml: "",
          badge: "PURE DESI GHEE · SINCE 1968", titleTop: "Mithas Jo Yaad Reh Jaaye —", titleHighlight: "Jaipur's Family Halwai",
          subtitle: "", description: `Three generations of ${biz} halwais have fried jalebis, rolled laddus and stirred milk cake in the same kadhai. Now we bring them to your festivals, weddings and offices.`, image: "",
          primaryBtn: { label: "Order Sweet Boxes", href: "/sweet-boxes" }, secondaryBtn: { label: "Wedding Sweets", href: "/wedding-sweets" },
          features: [
            { icon: "award", title: "Since 1968", text: "" }, { icon: "gift", title: "Custom Gift Boxes", text: "" },
            { icon: "truck", title: "Pan-India Delivery", text: "" }, { icon: "flame", title: "Live Halwai Counters", text: "" },
          ],
        } },
        { type: "features", content: { items: [
          { icon: "leaf", title: "Pure Desi Ghee", text: "Every ghee sweet is made in A2 cow ghee — never vanaspati." },
          { icon: "sparkles", title: "Made Fresh Daily", text: "Milk sweets made every morning, sold within 48 hours." },
          { icon: "gift", title: "Gift-Ready Packing", text: "Velvet, kraft and printed boxes with your name or logo." },
        ] }, style: { layout: "minimal", align: "center" } },
        { type: "serviceCategories", content: { eyebrow: "WHAT WE MAKE", title: "Mithai for", titleHighlight: "Every Shubh Mauka", categories: ["Festive Gifting", "Weddings", "Bulk & Prasad"] }, style: { cardRadius: "lg" } },
        sweetBoxes,
        { type: "about", content: {
          eyebrow: "OUR HERITAGE", title: "One Kadhai,", titleHighlight: "Three Generations",
          body: [`${biz} began in 1968 when Babulal ji set up a small kadhai in Johari Bazaar. His motichoor laddu became famous across the walled city — the recipe hasn't changed since.`, "Today his grandsons run a modern, FSSAI-licensed karkhana with 35 halwais, while every batch of kaju katli is still tasted by the family before it leaves."],
          image: "", points: ["Original 1968 recipes", "FSSAI-licensed karkhana", "No artificial colour in milk sweets", "Silver vark from certified suppliers"],
          buttonLabel: "See the Rate Card", buttonHref: "/rate-card",
        } },
        { type: "stats", content: { items: [
          { value: "55+", label: "Years of Mithas", icon: "award" }, { value: "120+", label: "Sweets & Namkeen", icon: "sparkles" },
          { value: "2 lakh", label: "Diwali Boxes Last Year", icon: "gift" }, { value: "900+", label: "Weddings Sweetened", icon: "heart" },
        ] }, style: { layout: "band", background: "primary" } },
        rateCard,
        { type: "imageBanner", content: { title: "Hot jalebi at your wedding", subtitle: "Our halwais fry jalebi, gulab jamun and malpua live at your venue — served hot with rabdi till the last guest.", buttonLabel: "Book a Halwai Counter", buttonHref: "/wedding-sweets", image: "" } },
        { type: "countdown", content: { eyebrow: "FESTIVE SEASON", title: "Diwali Gift Box Orders", titleHighlight: "Close Soon", subtitle: "Order 100+ boxes before the cut-off for free logo printing and doorstep delivery.", targetDate: "2027-10-20T20:00:00", buttonLabel: "Order Diwali Boxes", buttonHref: "/order" }, style: { background: "dark" } },
        { type: "testimonials", content: { eyebrow: "SWEET WORDS", title: "Families &", titleHighlight: "Companies Love Us", items: [
          { name: "Meenakshi Agarwal", role: "Daughter's wedding · 1,100 guests", text: "Thirty shagun thaals, a live jalebi counter and 1,100 bidaai boxes — all perfect. Relatives still ask where the laddus came from.", rating: 5 },
          { name: "Nitin Saxena", role: "HR Head, finance company", text: "We ordered 2,400 Diwali boxes with our logo. Delivered to 14 offices on time and the kaju katli was outstanding.", rating: 5 },
          { name: "Pandit Ramesh Sharma", role: "Temple trust", text: "Our weekly bhandara prasad comes from them. Same taste every Tuesday for eight years.", rating: 5 },
        ] }, style: { layout: "featured" } },
        { type: "faq", content: { eyebrow: "FAQ", title: "Ordering", titleHighlight: "Mithai", intro: "Shelf life, bulk orders and delivery — answered.", items: [
          { q: "How long do sweets stay fresh?", a: "Ghee sweets like kaju katli and laddu last 10–15 days. Milk sweets like kalakand and rasgulla should be eaten within 2–3 days, refrigerated." },
          { q: "What is the minimum for custom-printed boxes?", a: "25 boxes for name stickers, 100 boxes for fully printed boxes with your logo." },
          { q: "Do you deliver outside Jaipur?", a: "Ghee sweets and dry-fruit boxes ship pan-India in 2–5 days. Milk sweets are delivered within Jaipur only." },
          { q: "Can you make sugar-free sweets?", a: "Yes — sugar-free kaju katli, anjeer barfi and dates laddu are available on 2 days' notice." },
        ] } as SectionContentMap["faq"], style: { layout: "split", background: "light" } },
        cta,
      ],
    },
    { slug: "sweet-boxes", title: "Sweet Boxes", isSystem: true, order: 1, sections: [
      { type: "banner", content: { title: "Sweet", titleHighlight: "Boxes", subtitle: "Festive, corporate and return-gift boxes — packed the way you want.", image: "", bgColor: "", imageOpacity: 45, overlayOpacity: 60 } },
      sweetBoxes,
      { type: "steps", content: { eyebrow: "BULK GIFTING", title: "500 Boxes, Zero", titleHighlight: "Hassle", items: [
        { title: "Choose a Box", text: "Pick size, sweets and packaging", icon: "gift" },
        { title: "Send Your Logo", text: "We share a print proof in 24 hours", icon: "edit" },
        { title: "Approve & Pay 50%", text: "Production slot reserved", icon: "check" },
        { title: "Delivered", text: "To one office or 50 addresses", icon: "truck" },
      ] }, style: { layout: "timeline" } },
      cta,
    ] },
    { slug: "wedding-sweets", title: "Wedding Sweets", isSystem: true, order: 2, sections: [
      { type: "about", content: {
        eyebrow: "WEDDING SWEETS", title: "From Roka to", titleHighlight: "Bidaai",
        body: ["Every wedding ritual has its mithai — shagun thaals, tilak boxes, milni sweets and the bidaai box your guests take home. We plan all of them in one order.", "On the wedding day our halwais set up a live counter with hot jalebi, gulab jamun, malpua and rabdi."],
        image: "", points: ["Decorated shagun thaals", "Live jalebi & gulab jamun counter", "Personalised bidaai boxes", "Coordinated with your caterer"],
        buttonLabel: "Plan Wedding Sweets", buttonHref: "/order",
      }, style: { layout: "reverse" } },
      { type: "serviceCategories", content: { eyebrow: "FOR WEDDINGS", title: "Wedding", titleHighlight: "Mithai Services", categories: ["Weddings"] }, style: { background: "light", cardRadius: "lg" } },
      cta,
    ] },
    { slug: "rate-card", title: "Rate Card", isSystem: true, order: 3, sections: [
      { type: "banner", content: { title: "Mithai", titleHighlight: "Rate Card", subtitle: "Fresh daily from our Johari Bazaar karkhana.", image: "", bgColor: "", imageOpacity: 45, overlayOpacity: 60 } },
      rateCard,
      { type: "openingHours", content: { eyebrow: "SHOP TIMINGS", title: "Visit the", titleHighlight: "Mithai Ghar", note: "Hot jalebi and kachori every morning from 7:30 AM.", days: [
        { day: "Monday – Saturday", hours: "7:30 AM – 10:30 PM" }, { day: "Sunday", hours: "7:30 AM – 11:00 PM" }, { day: "Diwali week", hours: "6:00 AM – Midnight" },
      ] } },
      cta,
    ] },
    { slug: "gallery", title: "Gallery", isSystem: true, order: 4, sections: [
      { type: "gallery", content: { eyebrow: "GALLERY", title: "From Our", titleHighlight: "Kadhai" }, style: { layout: "grid" } },
      cta,
    ] },
    { slug: "order", title: "Bulk Order", isSystem: true, order: 5, sections: [
      { type: "quoteForm", content: { title: "Place a Bulk Sweet Order", subtitle: "Tell us the occasion, quantity (kg or boxes), delivery date and city. We'll confirm price and slot within 1 hour.", showSidebar: true } },
    ] },
    { slug: "contact", title: "Contact Us", isSystem: true, order: 6, sections: [
      { type: "contactInfo", content: { eyebrow: "CONTACT", title: "Visit or Call", titleHighlight: "the Mithai Ghar", address: "Johari Bazaar, Jaipur", phone: PHONE, email: "mithai@example.com", hours: "Shop: 7:30 AM – 10:30 PM, all days", mapEmbed: "" } },
      { type: "map", content: { eyebrow: "FIND US", title: "In the Heart of", titleHighlight: "the Pink City", address: "Johari Bazaar, Jaipur", mapEmbed: "" } },
      { type: "contactForm", content: { title: "Send a Message", subtitle: "Questions about boxes, shipping or custom sweets — we reply quickly." } },
    ] },
  ],
};
