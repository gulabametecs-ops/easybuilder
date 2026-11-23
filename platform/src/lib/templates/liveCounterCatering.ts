import type { TemplateDef, SectionSeed } from "./types";
import type { SectionContentMap } from "../config";

// Live counters & BBQ / tandoor outdoor catering: smoky charcoal + ember orange,
// condensed Oswald, bold header, slideshow hero, counter-by-counter price cards.
const PHONE = "98110 63482";

const cta: SectionSeed<"cta"> = {
  type: "cta",
  content: { title: "Party this month?", highlight: "Lock Your Live Counters Before the Dates Go", phones: [PHONE], buttonLabel: "Build My Counters", buttonHref: "/book" },
  style: { background: "primary" },
};

const counterPrices: SectionSeed<"priceList"> = {
  type: "priceList",
  content: {
    eyebrow: "LIVE COUNTERS", title: "Pick Your", titleHighlight: "Counters",
    note: "Per-guest prices for 100+ guests, including chef, gas, equipment and counter décor. Under 100 guests: flat ₹6,500 minimum per counter. GST extra.",
    groups: [
      { category: "Tandoor & BBQ", items: [
        { name: "Paneer & Mushroom Tikka Tandoor", price: "₹140/guest", note: "Clay tandoor on site" },
        { name: "Chicken Tikka & Seekh Kebab", price: "₹190/guest", note: "" },
        { name: "Mutton Galouti & Boti", price: "₹260/guest", note: "" },
        { name: "Charcoal BBQ Grill (veg + non-veg)", price: "₹220/guest", note: "Corn, pineapple, wings, prawns" },
      ] },
      { category: "Chaat & Street Food", items: [
        { name: "Pani Puri (5 flavours of pani)", price: "₹60/guest", note: "" },
        { name: "Aloo Tikki & Papdi Chaat", price: "₹70/guest", note: "" },
        { name: "Pav Bhaji on Tawa", price: "₹80/guest", note: "" },
        { name: "Mumbai Vada Pav & Dabeli", price: "₹65/guest", note: "" },
      ] },
      { category: "Global Counters", items: [
        { name: "Live Pasta (red, white, pink sauce)", price: "₹110/guest", note: "" },
        { name: "Wood-fired Pizza", price: "₹150/guest", note: "Oven on wheels" },
        { name: "Dimsum & Noodle Wok", price: "₹120/guest", note: "" },
        { name: "Dosa & Uttapam", price: "₹90/guest", note: "" },
      ] },
      { category: "Sweet Endings", items: [
        { name: "Hot Jalebi & Rabdi", price: "₹55/guest", note: "" },
        { name: "Matka Kulfi Cart", price: "₹50/guest", note: "" },
        { name: "Live Gajar Halwa (winter)", price: "₹60/guest", note: "" },
      ] },
    ],
  },
  style: { background: "dark", cardRadius: "none" },
};

const combos: SectionSeed<"pricingPlans"> = {
  type: "pricingPlans",
  content: {
    eyebrow: "PARTY COMBOS", title: "Counter Combos for", titleHighlight: "Every Party Size",
    plans: [
      { name: "House Party", price: "₹24,999", period: "/50 guests", features: ["Chaat counter + pasta counter", "Tandoor starters (veg)", "Jalebi-rabdi", "2 chefs + 2 helpers, 3 hours"], featured: false, buttonLabel: "Book Combo", buttonHref: "/book" },
      { name: "Farmhouse BBQ Night", price: "₹649", period: "/guest", features: ["Charcoal BBQ + tandoor", "Chaat & pani puri", "Wood-fired pizza", "Kulfi cart", "Fairy-light counter décor"], featured: true, buttonLabel: "Book Combo", buttonHref: "/book" },
      { name: "Sangeet Street Festival", price: "₹899", period: "/guest", features: ["6 live counters of your choice", "Mocktail & shikanji bar", "Themed thela-style carts", "Counter captain + 12 staff"], featured: false, buttonLabel: "Book Combo", buttonHref: "/book" },
    ],
  },
  style: { cardRadius: "none", cardShadow: "lg" },
};

export const liveCounterCatering: TemplateDef = {
  theme: {
    colors: { primary: "#ea580c", primaryDark: "#c2410c", secondary: "#1c1917", accent: "#facc15", dark: "#140d09", light: "#fff7ed", text: "#44403c", heading: "#1c1917" },
    font: "Oswald", radius: "0.25rem",
  },
  header: (biz) => ({
    design: "bold",
    logoText: biz, logoImage: "",
    announcement: { show: true, text: "Winter farmhouse BBQ nights — book 4 counters, get the kulfi cart free", link: "/book" },
    topbar: { show: false, address: "Chhatarpur, New Delhi", phones: [PHONE], email: "fire@example.com", social: { facebook: "#", instagram: "#", whatsapp: "#" } },
    nav: [
      { label: "Home", href: "/" }, { label: "Live Counters", href: "/counters" }, { label: "BBQ & Tandoor", href: "/bbq" },
      { label: "Party Combos", href: "/combos" }, { label: "Gallery", href: "/gallery" }, { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Book Counters", href: "/book" },
  }),
  footer: (biz) => ({
    design: "gradient",
    about: `${biz} brings live tandoors, charcoal BBQ grills, chaat carts and pasta stations to your farmhouse, lawn or terrace — cooked hot, right in front of your guests.`,
    columns: [
      { title: "Counters", links: [ { label: "Live Counters", href: "/counters" }, { label: "BBQ & Tandoor", href: "/bbq" }, { label: "Party Combos", href: "/combos" } ] },
      { title: "Book", links: [ { label: "Book Counters", href: "/book" }, { label: "Gallery", href: "/gallery" }, { label: "Contact", href: "/contact" } ] },
    ],
    serviceAreas: ["Delhi", "Gurugram", "Noida", "Faridabad", "Chhatarpur Farmhouses", "Ghaziabad"],
    contact: { phones: [PHONE], email: "fire@example.com", address: "Chhatarpur, New Delhi" },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. Cooked live. Served hot.`,
  }),
  seo: (biz) => ({
    title: `${biz} — Live Counters, BBQ & Tandoor Catering for Parties`,
    description: "Live tandoor, charcoal BBQ, chaat, pasta, pizza and jalebi counters for weddings, sangeets and farmhouse parties in Delhi NCR. From ₹50 per guest.",
    favicon: "", ogImage: "",
    keywords: "live counter catering, bbq catering delhi, tandoor counter for party, chaat counter, pasta live counter, farmhouse party catering, sangeet food counters",
    businessType: "FoodEstablishment", priceRange: "₹₹₹",
  }),
  services: [
    { category: "Fire & Smoke", title: "Charcoal BBQ Grill", description: "Wings, prawns, corn and pineapple grilled over coal by our pitmasters." },
    { category: "Fire & Smoke", title: "Live Tandoor Counter", description: "Clay tandoor on site — tikkas, kebabs and butter naan straight from the fire." },
    { category: "Fire & Smoke", title: "Sizzler & Shashlik Station", description: "Paneer and chicken shashlik on hot iron plates." },
    { category: "Street Food", title: "Pani Puri & Chaat Cart", description: "Thela-style cart with five pani flavours, tikki and papdi chaat." },
    { category: "Street Food", title: "Pav Bhaji & Tawa Counter", description: "Butter-loaded pav bhaji and tawa pulao on a giant tawa." },
    { category: "Street Food", title: "Live Dosa Counter", description: "Paper dosa, mysore masala and uttapam with three chutneys." },
    { category: "Global", title: "Live Pasta Station", description: "Penne and spaghetti tossed to order in red, white or pink sauce." },
    { category: "Global", title: "Wood-fired Pizza Oven", description: "Thin-crust pizzas baked in 90 seconds in our oven on wheels." },
  ],
  gallery: [
    "Charcoal grill at a farmhouse party", "Seekh kebabs off the coal", "Paneer tikka sizzler", "Tandoori platter",
    "Wok flames at the noodle counter", "Live pasta station", "Pav bhaji on the big tawa", "Pani puri cart",
    "Guests at the BBQ night", "Dosa counter at a sangeet",
  ].map((caption) => ({ category: "Live at Events", caption })),
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "slideshow", customHtml: "",
          badge: "LIVE TANDOOR · BBQ · CHAAT · PASTA", titleTop: "Fire Up Your Party With", titleHighlight: "Live Counters",
          subtitle: "", description: `${biz} sets up live tandoors, charcoal grills and street-food carts at your venue and cooks everything fresh in front of your guests.`, image: "",
          primaryBtn: { label: "Build My Counters", href: "/book" }, secondaryBtn: { label: "See All Counters", href: "/counters" },
          features: [ { icon: "flame", title: "Cooked Live", text: "" }, { icon: "users", title: "50 to 3,000 Guests", text: "" }, { icon: "truck", title: "Full Setup On Site", text: "" } ],
          slides: [
            { titleTop: "Fire Up Your Party With", titleHighlight: "Live Counters", description: "Tandoor, BBQ, chaat, pasta and jalebi — cooked fresh in front of your guests.", image: "", primaryBtn: { label: "Build My Counters", href: "/book" }, secondaryBtn: { label: "See All Counters", href: "/counters" } },
            { titleTop: "Charcoal, Smoke &", titleHighlight: "Seekh Kebabs", description: "Our pitmasters bring the grill, the coal and the marinades to your farmhouse.", image: "", primaryBtn: { label: "BBQ & Tandoor Menu", href: "/bbq" }, secondaryBtn: { label: "Party Combos", href: "/combos" } },
            { titleTop: "The Chaat Cart Everyone", titleHighlight: "Queues Up For", description: "Pani puri with five flavours of pani, aloo tikki and dahi bhalla — just like Chandni Chowk.", image: "", primaryBtn: { label: "Book a Chaat Cart", href: "/book" }, secondaryBtn: { label: "Gallery", href: "/gallery" } },
          ],
        } },
        { type: "stats", content: { items: [
          { value: "1,800+", label: "Parties Fired Up", icon: "flame" }, { value: "24", label: "Live Counter Types", icon: "utensils" },
          { value: "60", label: "Counter Chefs", icon: "users" }, { value: "4.9★", label: "Rated on Google", icon: "star" },
        ] }, style: { layout: "minimal", background: "dark" } },
        { type: "serviceCategories", content: { eyebrow: "OUR COUNTERS", title: "Fire, Street &", titleHighlight: "Global", categories: ["Fire & Smoke", "Street Food", "Global"] }, style: { layout: "tiles", cardRadius: "none" } },
        counterPrices,
        { type: "imageBanner", content: { title: "The grill is the new dance floor", subtitle: "At every BBQ night, guests gather around the coal. We bring the grill, the pitmaster and the playlist-worthy smoke.", buttonLabel: "See BBQ & Tandoor", buttonHref: "/bbq", image: "" } },
        combos,
        { type: "about", content: {
          eyebrow: "WHO WE ARE", title: "A Crew of Street-Food Chefs and", titleHighlight: "Pitmasters",
          body: [`${biz} started in 2014 with one tandoor on a hired tempo, cooking for a friend's mehendi. Today we run 24 counter formats with 60 trained counter chefs across Delhi NCR.`, "Every counter arrives 3 hours early with its own gas, coal, equipment and décor. All you have to do is tell us where the party is."],
          image: "", points: ["Clay tandoors & charcoal grills", "Fire-safety kits at every counter", "Uniformed counter chefs", "Counter décor & signboards included"],
          buttonLabel: "Plan My Party", buttonHref: "/book",
        }, style: { layout: "split" } },
        { type: "steps", content: { eyebrow: "HOW BOOKING WORKS", title: "Your Counters, Sorted in", titleHighlight: "4 Steps", items: [
          { title: "Pick Counters", text: "Choose from 24 live counters", icon: "clipboard" },
          { title: "Share Guest Count", text: "We size chefs and stock", icon: "users" },
          { title: "Pay 25% Advance", text: "Date locked instantly", icon: "check" },
          { title: "We Fire Up", text: "Setup 3 hours before guests", icon: "flame" },
        ] }, style: { layout: "default" } },
        { type: "testimonials", content: { eyebrow: "PARTY REVIEWS", title: "Guests Left", titleHighlight: "Smelling of Smoke", items: [
          { name: "Karan Malhotra", role: "Farmhouse birthday · 180 guests", text: "The BBQ counter was the star. Wings and corn off the coal all night — nobody even went to the main buffet!", rating: 5 },
          { name: "Simran Bedi", role: "Sangeet · 400 guests", text: "Six counters, zero chaos. The pani puri cart had a queue the whole evening and the jalebi came out hot till midnight.", rating: 5 },
          { name: "Vikram Sethi", role: "Corporate offsite · 250 guests", text: "Pizza oven and pasta station for our team — great food, great show, and they left the lawn spotless.", rating: 5 },
        ] }, style: { layout: "dark" } },
        { type: "faq", content: { eyebrow: "FAQ", title: "Live Counter", titleHighlight: "Questions", intro: "What hosts ask before booking counters.", items: [
          { q: "How many counters do I need?", a: "As a rule of thumb, one counter per 60–80 guests keeps queues short. We'll suggest the right mix for your crowd." },
          { q: "Do you need electricity or water at the venue?", a: "Only a 15-amp point for lights. We bring gas cylinders, charcoal, water cans and fire extinguishers." },
          { q: "Can you add counters to another caterer's buffet?", a: "Yes. Many hosts book us only for live counters alongside their main caterer." },
          { q: "Is the BBQ halal / can veg and non-veg be separate?", a: "Halal meat is standard. Veg and non-veg counters use separate grills, tools and chefs." },
        ] } as SectionContentMap["faq"], style: { layout: "default" } },
        cta,
      ],
    },
    { slug: "counters", title: "Live Counters", isSystem: true, order: 1, sections: [
      { type: "banner", content: { title: "Live", titleHighlight: "Counters", subtitle: "24 counter formats, cooked live at your venue.", image: "", bgColor: "", imageOpacity: 45, overlayOpacity: 60 } },
      { type: "serviceCategories", content: { eyebrow: "COUNTERS", title: "Choose Your", titleHighlight: "Line-up", categories: ["Fire & Smoke", "Street Food", "Global"] }, style: { layout: "default", cardRadius: "none" } },
      counterPrices,
      cta,
    ] },
    { slug: "bbq", title: "BBQ & Tandoor", isSystem: true, order: 2, sections: [
      { type: "about", content: {
        eyebrow: "BBQ & TANDOOR", title: "Real Coal. Real Clay.", titleHighlight: "Real Smoke.",
        body: ["Our clay tandoors are fired with charcoal two hours before service so the walls are hot enough to blister naan in 60 seconds.", "Marinades are made the night before in our central kitchen — hung curd, mustard oil and our own garam masala."],
        image: "", points: ["Paneer tikka angaar", "Chicken seekh & reshmi kebab", "Tandoori pomfret & prawns", "Grilled corn & pineapple"],
        buttonLabel: "Book a BBQ Night", buttonHref: "/book",
      }, style: { layout: "reverse" } },
      { type: "priceList", content: { eyebrow: "BBQ MENU", title: "Off the", titleHighlight: "Coals", note: "Per-guest prices for 100+ guests. Mix any 4 items per counter.", groups: [
        { category: "Veg", items: [ { name: "Paneer Tikka Angaar", price: "₹70", note: "" }, { name: "Tandoori Malai Broccoli", price: "₹65", note: "" }, { name: "Bhutta (Grilled Corn)", price: "₹35", note: "" }, { name: "Grilled Pineapple", price: "₹35", note: "" } ] },
        { category: "Non-Veg", items: [ { name: "Chicken Tikka", price: "₹90", note: "" }, { name: "Mutton Seekh Kebab", price: "₹120", note: "" }, { name: "BBQ Chicken Wings", price: "₹95", note: "" }, { name: "Tandoori Prawns", price: "₹160", note: "" } ] },
      ] }, style: { background: "light", cardRadius: "none" } },
      { type: "imageBanner", content: { title: "Farmhouse BBQ Nights", subtitle: "Winter evenings, bonfire, live grill and kulfi — our most-booked package from November to February.", buttonLabel: "See Combos", buttonHref: "/combos", image: "" } },
      cta,
    ] },
    { slug: "combos", title: "Party Combos", isSystem: true, order: 3, sections: [
      combos,
      { type: "countdown", content: { eyebrow: "WINTER PARTY SEASON", title: "Weekend Dates Are", titleHighlight: "Going Fast", subtitle: "Book any 4 counters before the season starts and get the matka kulfi cart free.", targetDate: "2027-01-15T18:00:00", buttonLabel: "Grab a Date", buttonHref: "/book" }, style: { background: "dark" } },
      cta,
    ] },
    { slug: "gallery", title: "Gallery", isSystem: true, order: 4, sections: [
      { type: "gallery", content: { eyebrow: "GALLERY", title: "Fire, Flavour &", titleHighlight: "Full Plates" }, style: { layout: "masonry" } },
      cta,
    ] },
    { slug: "book", title: "Book Counters", isSystem: true, order: 5, sections: [
      { type: "quoteForm", content: { title: "Build Your Counter Line-up", subtitle: "Tell us the date, venue, guest count and the counters you like. We'll send a per-guest quote within 2 hours.", showSidebar: true } },
    ] },
    { slug: "contact", title: "Contact Us", isSystem: true, order: 6, sections: [
      { type: "contactInfo", content: { eyebrow: "CONTACT", title: "Talk to Our", titleHighlight: "Party Desk", address: "Chhatarpur, New Delhi", phone: PHONE, email: "fire@example.com", hours: "Calls & WhatsApp: 10 AM – 10 PM", mapEmbed: "" } },
      { type: "contactForm", content: { title: "Send an Enquiry", subtitle: "Corporate events, sangeets or a small terrace party — we reply fast." } },
    ] },
  ],
};
