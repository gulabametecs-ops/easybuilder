import type { TemplateDef, SectionSeed } from "./types";
import type { SectionContentMap } from "../config";

// Catering & Cloud Kitchen (weddings, parties, corporate meal boxes, tiffin):
// bold chilli red + turmeric gold on charcoal, sharp cards, quote-driven.
const PHONE = "9000000000";

const cta: SectionSeed<"cta"> = {
  type: "cta",
  content: { title: "Planning a wedding, party or office lunch?", highlight: "Get a Per-Plate Quote in 2 Hours", phones: [PHONE], buttonLabel: "Get a Quote", buttonHref: "/get-quote" },
  style: { background: "dark" },
};

const perPlate: SectionSeed<"pricingPlans"> = {
  type: "pricingPlans",
  content: {
    eyebrow: "PER-PLATE PACKAGES", title: "Menus That Fit", titleHighlight: "Every Budget",
    plans: [
      { name: "Silver Thali", price: "₹349", period: "/plate", features: ["2 starters · 3 mains", "Dal, rice & 2 breads", "1 dessert · salad & raita", "Buffet setup & 2 servers per 100 guests"], featured: false, buttonLabel: "Get Quote", buttonHref: "/get-quote" },
      { name: "Gold Feast", price: "₹549", period: "/plate", features: ["4 starters · 5 mains", "Biryani or pulao + breads basket", "2 desserts + 1 live counter", "Welcome drinks", "Premium chafing & décor"], featured: true, buttonLabel: "Get Quote", buttonHref: "/get-quote" },
      { name: "Royal Banquet", price: "₹899", period: "/plate", features: ["6 starters · 7 mains", "3 live counters (chaat, pasta, jalebi)", "Mocktail bar & 4 desserts", "Uniformed service staff", "Dedicated event captain"], featured: false, buttonLabel: "Get Quote", buttonHref: "/get-quote" },
    ],
  },
  style: { background: "light", cardRadius: "sm", cardShadow: "lg" },
};

export const catering: TemplateDef = {
  theme: {
    colors: { primary: "#b91c1c", primaryDark: "#991b1b", secondary: "#1c1917", accent: "#f59e0b", dark: "#1a1210", light: "#fff7ed", text: "#44403c", heading: "#1c1917" },
    font: "Urbanist", radius: "0.5rem",
  },
  header: (biz) => ({
    design: "modern",
    logoText: biz, logoImage: "",
    announcement: { show: true, text: "Wedding season bookings open · Free tasting for orders above 200 plates", link: "/get-quote" },
    topbar: { show: true, address: "Serving Your City & nearby · FSSAI licensed kitchen", phones: [PHONE], email: "hello@example.com", social: { facebook: "#", instagram: "#", whatsapp: "#" } },
    nav: [
      { label: "Home", href: "/" }, { label: "Menus", href: "/menus" }, { label: "Weddings & Parties", href: "/weddings" }, { label: "Corporate", href: "/corporate" },
      { label: "Tiffin Plans", href: "/tiffin" }, { label: "Gallery", href: "/gallery" }, { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Get a Quote", href: "/get-quote" },
  }),
  footer: (biz) => ({
    design: "gradient",
    about: `${biz} is an FSSAI-licensed catering company and cloud kitchen — wedding and party catering, live counters, corporate meal boxes and daily home-style tiffin subscriptions.`,
    columns: [
      { title: "Catering", links: [ { label: "Weddings & Parties", href: "/weddings" }, { label: "Corporate Catering", href: "/corporate" }, { label: "Per-Plate Menus", href: "/menus" }, { label: "Get a Quote", href: "/get-quote" } ] },
      { title: "Cloud Kitchen", links: [ { label: "Tiffin Subscriptions", href: "/tiffin" }, { label: "Gallery", href: "/gallery" }, { label: "Contact Us", href: "/contact" } ] },
    ],
    serviceAreas: ["Wedding Catering", "Birthday & House Parties", "Corporate Lunch Boxes", "Live Counters", "Daily Tiffin", "Festival Bulk Orders"],
    contact: { phones: [PHONE], email: "hello@example.com", address: "Your City" },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. Every plate, made with care.`,
  }),
  seo: (biz) => ({
    title: `${biz} — Wedding, Party & Corporate Catering · Tiffin Service in Your City`,
    description: "Wedding and party catering from ₹349 per plate, live counters, corporate meal boxes and daily veg & non-veg tiffin subscriptions. FSSAI-licensed kitchen. Get a quote in 2 hours.",
    favicon: "", ogImage: "",
    keywords: "caterers near me, wedding catering, party catering, corporate lunch boxes, tiffin service, cloud kitchen, live counter catering, per plate catering price",
    businessType: "FoodEstablishment", priceRange: "₹₹",
  }),
  services: [
    { category: "Weddings & Events", title: "Wedding Catering", description: "Mehendi to reception — multi-cuisine buffets for 100 to 3,000 guests." },
    { category: "Weddings & Events", title: "Birthday & House Parties", description: "Compact party menus with setup, service and clean-up included." },
    { category: "Weddings & Events", title: "Pooja & Festival Catering", description: "Satvik, no-onion-no-garlic and Jain menus for religious functions." },
    { category: "Live Counters", title: "Chaat & Pani Puri Counter", description: "Live golgappe, dahi bhalla, aloo tikki and papdi chaat." },
    { category: "Live Counters", title: "Tandoor & Grill Counter", description: "Hot rumali, paneer tikka and kebabs made in front of guests." },
    { category: "Live Counters", title: "Dessert & Jalebi Counter", description: "Hot jalebi-rabdi, live kulfi and malpua stations." },
    { category: "Corporate Meals", title: "Office Lunch Boxes", description: "Daily balanced meal boxes delivered hot to your office by 12:30 PM." },
    { category: "Corporate Meals", title: "Conference & Event Catering", description: "Hi-tea, working lunches and buffet setups for offsites and launches." },
    { category: "Corporate Meals", title: "Festive Bulk Orders", description: "Diwali sweets, iftar boxes and team celebration platters." },
    { category: "Tiffin & Cloud Kitchen", title: "Daily Veg Tiffin", description: "Home-style dal, sabzi, roti and rice — changes every day." },
    { category: "Tiffin & Cloud Kitchen", title: "Non-Veg & Protein Tiffin", description: "Chicken, egg and fish curries with high-protein sides." },
  ],
  gallery: [
    "Wedding buffet spread", "Live chaat counter", "Tandoor station at a reception", "Corporate lunch boxes ready to dispatch",
    "Daily tiffin packing", "Dessert & jalebi counter", "Our FSSAI-licensed kitchen", "Uniformed service team",
  ].map((caption) => ({ category: "Our Events", caption })),
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "marquee", customHtml: "",
          badge: "1,200+ EVENTS CATERED · FSSAI LICENSED", titleTop: "From 20 Guests to 2,000 —", titleHighlight: "Food Everyone Remembers",
          subtitle: "", description: `${biz} handles weddings, parties, office lunches and daily tiffins with one promise: hot, hygienic food served on time, every time. Tell us your guest count — we'll build the menu.`, image: "",
          primaryBtn: { label: "Get a Free Quote", href: "/get-quote" }, secondaryBtn: { label: "See Per-Plate Menus", href: "/menus" },
          features: [
            { icon: "utensils", title: "Wedding Buffets", text: "" }, { icon: "zap", title: "Live Counters", text: "" },
            { icon: "package", title: "Corporate Meal Boxes", text: "" }, { icon: "truck", title: "Daily Tiffin Delivery", text: "" },
          ],
        } },
        { type: "logos", content: { title: "Trusted by teams at", items: ["TechNova Solutions", "Shree Infra Group", "BlueOak Pharma", "Kavya Hospitals", "Pinnacle Finserv", "Urban Ed Academy"] }, style: { spacingTop: "sm", spacingBottom: "sm" } },
        { type: "serviceCategories", content: { eyebrow: "WHAT WE CATER", title: "One Kitchen,", titleHighlight: "Every Occasion", categories: ["Weddings & Events", "Live Counters", "Corporate Meals", "Tiffin & Cloud Kitchen"] }, style: { layout: "tiles" } },
        { type: "stats", content: { items: [
          { value: "1,200+", label: "Events Catered", icon: "calendar" }, { value: "4,500", label: "Tiffins Delivered Daily", icon: "truck" },
          { value: "60+", label: "Corporate Clients", icon: "handshake" }, { value: "350+", label: "Dishes on Our Menu", icon: "utensils" },
        ] }, style: { layout: "band" } },
        { type: "imageBanner", content: { title: "Live counters that steal the show", subtitle: "Pani puri, tandoor, pasta, dosa and jalebi-rabdi — cooked fresh in front of your guests.", buttonLabel: "Explore Live Counters", buttonHref: "/weddings", image: "" } },
        perPlate,
        { type: "priceList", content: { eyebrow: "CROWD FAVOURITES", title: "Dishes Guests", titleHighlight: "Ask About", note: "A taste of our 350+ dish menu. Mix and match any of these into your per-plate package.", groups: [
          { category: "Starters", items: [ { name: "Paneer Tikka Shashlik", price: "Veg", note: "Tandoor" }, { name: "Hara Bhara Kebab", price: "Veg", note: "" }, { name: "Chicken Malai Tikka", price: "Non-veg", note: "" }, { name: "Fish Amritsari", price: "Non-veg", note: "" } ] },
          { category: "Mains", items: [ { name: "Dal Baati Churma", price: "Veg", note: "Rajasthani" }, { name: "Paneer Lababdar", price: "Veg", note: "" }, { name: "Mutton Rogan Josh", price: "Non-veg", note: "" }, { name: "Veg Dum Biryani", price: "Veg", note: "" } ] },
          { category: "Desserts", items: [ { name: "Live Jalebi with Rabdi", price: "Veg", note: "Counter" }, { name: "Moong Dal Halwa", price: "Veg", note: "Winter special" }, { name: "Kesar Kulfi", price: "Veg", note: "" } ] },
        ] }, style: { background: "dark" } },
        { type: "about", content: {
          eyebrow: "OUR KITCHEN", title: "A 6,000 sq ft Kitchen Built for", titleHighlight: "Big Days",
          body: [`${biz} began with a single wedding in 2011 and a family cook's recipes. Today our central kitchen runs separate veg, Jain and non-veg lines, with RO water, cold rooms and a 40-strong cooking team.`, "Every event gets a named captain, a written menu sheet and food that reaches the venue 90 minutes before service — so the first plate is as hot as the last."],
          image: "", points: ["Separate veg, Jain & non-veg lines", "Insulated food vans", "Uniformed service staff", "Event captain at every function"],
          buttonLabel: "See Wedding Catering", buttonHref: "/weddings",
        } },
        { type: "steps", content: { eyebrow: "HOW WE WORK", title: "Booking Catering in", titleHighlight: "4 Easy Steps", items: [
          { title: "Share Your Event", text: "Date, venue, guest count and cuisine", icon: "edit" },
          { title: "Free Tasting", text: "Sample your shortlisted dishes at our kitchen", icon: "utensils" },
          { title: "Lock the Menu", text: "Final per-plate price, 30% advance", icon: "clipboard" },
          { title: "We Serve", text: "Setup, service and clean-up handled", icon: "check" },
        ] }, style: { layout: "timeline", background: "light" } },
        { type: "features", content: { items: [
          { icon: "shield", title: "FSSAI-Licensed Kitchen", text: "Audited kitchen, RO water, daily deep-cleaning and staff health checks." },
          { icon: "clock", title: "Always On Time", text: "Food reaches the venue 90 minutes early — never a late buffet." },
          { icon: "users", title: "Trained Service Staff", text: "Uniformed, courteous servers and an event captain at every function." },
          { icon: "leaf", title: "Pure Veg & Jain Kitchen", text: "Separate vessels and cooks for pure veg, Jain and satvik orders." },
        ] }, style: { layout: "numbered" } },
        { type: "countdown", content: { eyebrow: "WEDDING SEASON", title: "Peak Dates Are", titleHighlight: "Filling Fast", subtitle: "Book before the season opens and get a complimentary dessert counter for 200+ guests.", targetDate: "2027-02-01T10:00:00", buttonLabel: "Reserve Your Date", buttonHref: "/get-quote" }, style: { background: "primary" } },
        { type: "testimonials", content: { eyebrow: "CLIENT STORIES", title: "Weddings, Offices &", titleHighlight: "Homes", items: [
          { name: "Sunita & Rajesh Agarwal", role: "Daughter's wedding · 850 guests", text: "Guests are still talking about the dal baati and the live jalebi counter. Not one dish ran out and the team cleaned up before we even noticed.", rating: 5 },
          { name: "Prakash Iyer", role: "Admin Head, IT company", text: "We switched our 220-person office lunch to them a year ago. Food is consistent, boxes arrive by 12:15 and the weekly menu never gets boring.", rating: 5 },
          { name: "Anjali Verma", role: "Tiffin subscriber · 14 months", text: "As a working mom this tiffin is a lifesaver. It genuinely tastes like ghar ka khana — less oil, fresh rotis and great variety.", rating: 5 },
        ] }, style: { layout: "dark" } },
        { type: "faq", content: { eyebrow: "FAQ", title: "Catering", titleHighlight: "Questions", intro: "From guest count to tasting, here is what to know before you book.", items: [
          { q: "What is the minimum order for catering?", a: "We cater events from 25 guests onwards. For smaller house parties, ask about our party platters." },
          { q: "Is a tasting session available?", a: "Yes. Tasting is free for orders above 200 plates; for smaller orders it is ₹1,500, adjusted in the final bill." },
          { q: "Do you provide crockery, tables and staff?", a: "All packages include chafing dishes, crockery and service staff. Tables, tenting and décor can be arranged on request." },
          { q: "How far in advance should we book?", a: "For weddings, 4–8 weeks is ideal in peak season. Parties and corporate events can usually be confirmed with 3–5 days notice." },
          { q: "Do you cook Jain and no-onion-no-garlic food?", a: "Yes, we have separate vessels and cooks for Jain, satvik and pure-veg orders." },
          { q: "What happens to leftover food?", a: "With your consent, we pack excess food hygienically for your family or hand it over to a partner food bank the same night." },
        ] } as SectionContentMap["faq"], style: { layout: "split" } },
        cta,
      ],
    },
    { slug: "menus", title: "Per-Plate Menus", isSystem: true, order: 1, sections: [
      { type: "banner", content: { title: "Per-Plate", titleHighlight: "Menus", subtitle: "Mix and match from 350+ dishes across North Indian, South Indian, Chinese and Continental.", image: "", bgColor: "", imageOpacity: 35, overlayOpacity: 65 } },
      perPlate,
      { type: "priceList", content: {
        eyebrow: "BUILD YOUR OWN", title: "A La Carte", titleHighlight: "Add-Ons",
        note: "Per-plate prices for orders of 100+ guests. GST extra. Final price depends on menu, venue and guest count.",
        groups: [
          { category: "Starters", items: [
            { name: "Paneer Tikka", price: "₹65/plate", note: "" }, { name: "Hara Bhara Kebab", price: "₹45/plate", note: "" }, { name: "Chicken Malai Tikka", price: "₹85/plate", note: "" }, { name: "Fish Amritsari", price: "₹95/plate", note: "" },
          ] },
          { category: "Mains & Rice", items: [
            { name: "Dal Makhani", price: "₹40/plate", note: "" }, { name: "Shahi Paneer", price: "₹60/plate", note: "" }, { name: "Veg Dum Biryani", price: "₹70/plate", note: "" }, { name: "Mutton Rogan Josh", price: "₹140/plate", note: "" },
          ] },
          { category: "Live Counters", items: [
            { name: "Pani Puri & Chaat", price: "₹70/plate", note: "Min 150 guests" }, { name: "Dosa & Uttapam", price: "₹80/plate", note: "" }, { name: "Live Pasta", price: "₹90/plate", note: "" }, { name: "Jalebi-Rabdi", price: "₹55/plate", note: "" },
          ] },
        ],
      }, style: { cardRadius: "sm" } },
      { type: "features", content: { items: [
        { icon: "leaf", title: "Pure Veg Menus", text: "Separate kitchen line for 100% vegetarian events." },
        { icon: "star", title: "Regional Specials", text: "Rajasthani, Gujarati, Punjabi, Hyderabadi and South Indian spreads." },
        { icon: "heart", title: "Healthy Choices", text: "Millet, low-oil and diabetic-friendly dishes on request." },
      ] }, style: { background: "light" } },
      { type: "faq", content: { eyebrow: "MENU FAQ", title: "Customising Your", titleHighlight: "Menu", intro: "Menus are fully customisable — these are the questions hosts ask most.", items: [
        { q: "Can I swap dishes within a package?", a: "Yes. Any dish can be swapped for another in the same category at no extra cost; premium dishes carry a small top-up." },
        { q: "Do you do regional cuisines?", a: "We regularly cook Rajasthani, Punjabi, Gujarati, Bengali, Kerala sadya and Hyderabadi menus with specialist cooks." },
        { q: "Is GST included in the per-plate price?", a: "Per-plate prices exclude 5% GST. Transport within city limits is included." },
      ] } as SectionContentMap["faq"], style: { layout: "split", background: "light" } },
      cta,
    ] },
    { slug: "weddings", title: "Weddings & Parties", isSystem: true, order: 2, sections: [
      { type: "about", content: {
        eyebrow: "WEDDINGS & PARTIES", title: "Every Ceremony,", titleHighlight: "Perfectly Fed",
        body: ["Haldi breakfast, mehendi chaat, sangeet snacks, the wedding feast and the vidaai send-off — we plan menus for every function so your family can stay with the guests, not in the kitchen.", "Our event captain coordinates with your decorator and venue, and our team stays until the last guest has eaten."],
        image: "", points: ["Function-wise menu planning", "Free tasting above 200 plates", "Live counters & mocktail bars", "Setup, service & clean-up"],
        buttonLabel: "Plan Your Menu", buttonHref: "/get-quote",
      } },
      { type: "serviceCategories", content: { eyebrow: "CROWD FAVOURITES", title: "Live Counters &", titleHighlight: "Event Menus", categories: ["Weddings & Events", "Live Counters"] }, style: { background: "light", cardRadius: "sm" } },
      { type: "countdown", content: { eyebrow: "WEDDING SEASON", title: "Peak Dates Are", titleHighlight: "Filling Fast", subtitle: "Book before the season opens and get a complimentary dessert counter for 200+ guests.", targetDate: "2027-02-01T10:00:00", buttonLabel: "Reserve Your Date", buttonHref: "/get-quote" }, style: { background: "primary" } },
      { type: "testimonials", content: { eyebrow: "HAPPY FAMILIES", title: "Wedding", titleHighlight: "Reviews", items: [
        { name: "Neha & Karthik", role: "Reception · 600 guests", text: "North and South Indian spreads side by side — both families were thrilled. The dosa counter had a queue all night!", rating: 5 },
        { name: "Mohammed Rizwan", role: "Walima · 1,100 guests", text: "The mutton biryani and phirni were outstanding. Service was smooth even with a huge crowd.", rating: 5 },
      ] } },
      cta,
    ] },
    { slug: "corporate", title: "Corporate Catering", isSystem: true, order: 3, sections: [
      { type: "imageBanner", content: { title: "Office lunches your team actually looks forward to", subtitle: "Balanced meal boxes delivered hot by 12:30 PM, with a rotating weekly menu and monthly GST billing.", buttonLabel: "Request a Corporate Trial", buttonHref: "/get-quote", image: "" } },
      { type: "pricingPlans", content: {
        eyebrow: "MEAL BOXES", title: "Corporate", titleHighlight: "Lunch Plans",
        plans: [
          { name: "Standard Box", price: "₹130", period: "/meal", features: ["Dal, sabzi, rice, 3 rotis", "Salad & pickle", "Min 25 boxes/day", "Eco-friendly packaging"], featured: false, buttonLabel: "Start Trial", buttonHref: "/get-quote" },
          { name: "Executive Box", price: "₹180", period: "/meal", features: ["2 sabzis or 1 non-veg curry", "Pulao + rotis + dessert", "Rotating 4-week menu", "Monthly GST invoice"], featured: true, buttonLabel: "Start Trial", buttonHref: "/get-quote" },
          { name: "Buffet On-Site", price: "₹260", period: "/person", features: ["Live hot buffet at your office", "Service staff included", "Min 80 guests", "Ideal for offsites & townhalls"], featured: false, buttonLabel: "Start Trial", buttonHref: "/get-quote" },
        ],
      }, style: { cardRadius: "sm", cardShadow: "md" } },
      { type: "logos", content: { title: "Feeding teams at", items: ["TechNova Solutions", "Shree Infra Group", "BlueOak Pharma", "Kavya Hospitals", "Pinnacle Finserv", "Urban Ed Academy"] }, style: { background: "light" } },
      { type: "features", content: { items: [
        { icon: "clock", title: "12:30 PM Guaranteed", text: "Insulated delivery vans and backup riders for every route." },
        { icon: "clipboard", title: "Simple Billing", text: "Monthly GST invoices, PO support and per-employee reports." },
        { icon: "shield", title: "Audited Hygiene", text: "Quarterly third-party food safety audits shared with clients." },
      ] } },
      cta,
    ] },
    { slug: "tiffin", title: "Tiffin Subscriptions", isSystem: true, order: 4, sections: [
      { type: "pricingPlans", content: {
        eyebrow: "DAILY TIFFIN", title: "Ghar Ka Khana,", titleHighlight: "Delivered Daily",
        plans: [
          { name: "Weekly Veg", price: "₹899", period: "/6 meals", features: ["Dal, sabzi, 4 rotis, rice", "Lunch or dinner", "Free delivery within 5 km", "Pause anytime"], featured: false, buttonLabel: "Subscribe", buttonHref: "/get-quote" },
          { name: "Monthly Veg", price: "₹3,299", period: "/26 meals", features: ["Everything in Weekly", "Sunday special meal", "Sweet twice a week", "Skip up to 4 days"], featured: true, buttonLabel: "Subscribe", buttonHref: "/get-quote" },
          { name: "Monthly Non-Veg", price: "₹4,199", period: "/26 meals", features: ["Chicken / egg / fish 4x a week", "High-protein sides", "Sunday biryani", "Skip up to 4 days"], featured: false, buttonLabel: "Subscribe", buttonHref: "/get-quote" },
        ],
      }, style: { background: "light", cardRadius: "sm", cardShadow: "lg" } },
      { type: "openingHours", content: {
        eyebrow: "DELIVERY SLOTS", title: "Hot Meals,", titleHighlight: "On Schedule",
        note: "Change or pause your meal by 9 PM the previous day via WhatsApp.",
        days: [
          { day: "Lunch (Mon – Sat)", hours: "12:00 PM – 1:30 PM" }, { day: "Dinner (Mon – Sat)", hours: "7:30 PM – 9:00 PM" }, { day: "Sunday Special", hours: "12:30 PM – 2:00 PM" },
        ],
      } },
      { type: "steps", content: { eyebrow: "GET STARTED", title: "Start Your Tiffin", titleHighlight: "Tomorrow", items: [
        { title: "Pick a Plan", text: "Veg or non-veg, weekly or monthly", icon: "clipboard" },
        { title: "Share Address", text: "Home, hostel or office", icon: "map-pin" },
        { title: "Pay via UPI", text: "No deposit, no lock-in", icon: "check" },
        { title: "First Meal Tomorrow", text: "Delivered hot in steel-lined boxes", icon: "truck" },
      ] }, style: { background: "dark" } },
      cta,
    ] },
    { slug: "gallery", title: "Gallery", isSystem: true, order: 5, sections: [
      { type: "gallery", content: { eyebrow: "GALLERY", title: "Spreads, Counters &", titleHighlight: "Celebrations" } },
      { type: "stats", content: { items: [
        { value: "3,000", label: "Largest Single Event", icon: "users" }, { value: "12", label: "Years in Catering", icon: "award" },
        { value: "140+", label: "Kitchen & Service Staff", icon: "user-check" }, { value: "4.9★", label: "Google Rating", icon: "star" },
      ] }, style: { background: "primary" } },
      { type: "testimonials", content: { eyebrow: "AFTER THE EVENT", title: "What Hosts", titleHighlight: "Tell Us", items: [
        { name: "Deepa & Arun Nambiar", role: "Housewarming · 120 guests", text: "Sadya on banana leaves for 120 guests, served in perfect order. Our relatives from Kerala were impressed!", rating: 5 },
        { name: "Harpreet Kaur", role: "Lohri party · 200 guests", text: "Sarson da saag, makki di roti and a live gajar halwa counter — exactly what we asked for, and on time.", rating: 5 },
      ] }, style: { layout: "featured" } },
      cta,
    ] },
    { slug: "get-quote", title: "Get a Quote", isSystem: true, order: 6, sections: [
      { type: "quoteForm", content: { title: "Get Your Catering Quote", subtitle: "Share your event date, venue, guest count and cuisine preference. Our event manager will send a per-plate quote within 2 hours.", showSidebar: true } },
      { type: "features", content: { items: [
        { icon: "tag", title: "Transparent Per-Plate Pricing", text: "No hidden charges — staff, setup and transport listed clearly." },
        { icon: "utensils", title: "Free Tasting", text: "Complimentary tasting for orders above 200 plates." },
        { icon: "headset", title: "Dedicated Event Manager", text: "One point of contact from booking to clean-up." },
      ] }, style: { background: "light", cardRadius: "sm" } },
      { type: "faq", content: { eyebrow: "BEFORE YOU BOOK", title: "Booking", titleHighlight: "Basics", items: [
        { q: "How much advance is required?", a: "30% to confirm the date, 50% a week before the event and the balance on the event day." },
        { q: "Can we change the guest count later?", a: "Yes, final guest count can be updated up to 72 hours before the event." },
        { q: "Do you travel outside the city?", a: "We cater within 150 km. Outstation transport and staff stay are quoted separately." },
      ] } },
    ] },
    { slug: "contact", title: "Contact Us", isSystem: true, order: 7, sections: [
      { type: "contactInfo", content: { eyebrow: "CONTACT", title: "Talk to Our", titleHighlight: "Event Team", address: "Your City", phone: PHONE, email: "hello@example.com", hours: "Kitchen & office: 7 AM – 10 PM, all days", mapEmbed: "" } },
      { type: "map", content: { eyebrow: "OUR KITCHEN", title: "Visit for a", titleHighlight: "Tasting", address: "Your City", mapEmbed: "" } },
      { type: "contactForm", content: { title: "Send an Enquiry", subtitle: "Tiffin subscriptions, office lunches or bulk orders — we reply within a couple of hours." } },
      cta,
    ] },
  ],
};
