import type { TemplateDef, SectionSeed } from "./types";

// Café & Bakery (specialty coffee, fresh bakes, custom cakes, brunch):
// warm toffee + cream palette, soft rounded cards, pre-order focused.
const PHONE = "9000000000";

const cta: SectionSeed<"cta"> = {
  type: "cta",
  content: { title: "Birthday, anniversary or just a Tuesday?", highlight: "Pre-Order Your Cake Today", phones: [PHONE], buttonLabel: "Pre-Order Now", buttonHref: "/pre-order" },
  style: { background: "primary" },
};

const hours: SectionSeed<"openingHours"> = {
  type: "openingHours",
  content: {
    eyebrow: "OVEN HOURS", title: "Fresh Out", titleHighlight: "Every Morning",
    note: "Croissants and sourdough come out at 8 AM and usually sell out by noon. Custom cake pick-ups available from 10 AM.",
    days: [
      { day: "Monday – Friday", hours: "7:30 AM – 10:00 PM" },
      { day: "Saturday", hours: "7:30 AM – 11:00 PM" },
      { day: "Sunday", hours: "8:00 AM – 11:00 PM" },
      { day: "Weekend Brunch", hours: "9:00 AM – 2:00 PM" },
    ],
  },
};

const cakeMenu: SectionSeed<"priceList"> = {
  type: "priceList",
  content: {
    eyebrow: "CAKE PRICE GUIDE", title: "Celebration Cakes,", titleHighlight: "By the Kilo",
    note: "Every cake is available eggless at no extra cost. Fondant & photo cakes need 48 hours notice. Prices inclusive of GST.",
    groups: [
      { category: "Classic Cakes (per kg)", items: [
        { name: "Belgian Chocolate Truffle", price: "₹1,100", note: "Our bestseller" },
        { name: "Fresh Fruit & Cream", price: "₹950", note: "Seasonal fruit" },
        { name: "Red Velvet Cream Cheese", price: "₹1,250", note: "" },
        { name: "Rasmalai Fusion Cake", price: "₹1,300", note: "Saffron, pista & rasmalai" },
      ] },
      { category: "Designer & Theme Cakes", items: [
        { name: "Fondant Theme Cake", price: "from ₹1,800/kg", note: "Cartoon, sports, floral" },
        { name: "Photo Print Cake", price: "₹1,400/kg", note: "Edible photo top" },
        { name: "Tiered Wedding Cake", price: "from ₹6,500", note: "2–4 tiers, tasting included" },
        { name: "Bento Mini Cake", price: "₹449", note: "300 g, serves 2" },
      ] },
    ],
  },
  style: { background: "light", cardRadius: "lg" },
};

export const cafeBakery: TemplateDef = {
  theme: {
    colors: { primary: "#92400e", primaryDark: "#78350f", secondary: "#3b2416", accent: "#e8a87c", dark: "#24160d", light: "#fbf3e8", text: "#5a4637", heading: "#2a1a10" },
    font: "Bricolage Grotesque", radius: "1.25rem",
  },
  header: (biz) => ({
    design: "centered",
    logoText: biz, logoImage: "",
    announcement: { show: true, text: "Fresh sourdough out of the oven at 8 AM daily · Custom cakes need just 24 hours notice", link: "/pre-order" },
    topbar: { show: true, address: "Your City · Dine-in · Takeaway · Delivery", phones: [PHONE], email: "hello@example.com", social: { facebook: "#", instagram: "#", whatsapp: "#" } },
    nav: [
      { label: "Home", href: "/" }, { label: "Menu", href: "/menu" }, { label: "Custom Cakes", href: "/custom-cakes" }, { label: "Brunch", href: "/brunch" },
      { label: "Our Story", href: "/about" }, { label: "Gallery", href: "/gallery" }, { label: "Visit Us", href: "/contact" },
    ],
    cta: { label: "Pre-Order", href: "/pre-order" },
  }),
  footer: (biz) => ({
    design: "centered",
    about: `${biz} is a neighbourhood café and bakery — single-origin Indian coffee, butter-laminated bakes, all-day brunch and made-to-order cakes, with eggless options on everything.`,
    columns: [
      { title: "Eat & Drink", links: [ { label: "Café Menu", href: "/menu" }, { label: "Weekend Brunch", href: "/brunch" }, { label: "Custom Cakes", href: "/custom-cakes" }, { label: "Pre-Order", href: "/pre-order" } ] },
      { title: "The Café", links: [ { label: "Our Story", href: "/about" }, { label: "Gallery", href: "/gallery" }, { label: "Visit Us", href: "/contact" } ] },
    ],
    serviceAreas: ["Specialty Coffee", "Sourdough & Breads", "Custom Cakes", "Eggless Bakes", "All-Day Brunch", "Party Hampers"],
    contact: { phones: [PHONE], email: "hello@example.com", address: "Your City" },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. Baked fresh, every single morning.`,
  }),
  seo: (biz) => ({
    title: `${biz} — Café, Bakery & Custom Cakes in Your City`,
    description: "Specialty coffee, fresh sourdough, croissants, all-day brunch and custom designer cakes with eggless options. Pre-order birthday cakes online from ₹449.",
    favicon: "", ogImage: "",
    keywords: "cafe near me, bakery near me, custom cakes, eggless cake, birthday cake delivery, sourdough bread, brunch cafe, specialty coffee",
    businessType: "CafeOrCoffeeShop", priceRange: "₹₹",
  }),
  services: [
    { category: "Coffee & Drinks", title: "Single-Origin Pour Over", description: "Chikmagalur and Coorg estate beans, roasted in small batches every week." },
    { category: "Coffee & Drinks", title: "Espresso Bar", description: "Cappuccino, flat white, cortado and our signature jaggery cold brew." },
    { category: "Coffee & Drinks", title: "Teas & Coolers", description: "Masala chai, Kashmiri kahwa, iced hibiscus and fresh fruit coolers." },
    { category: "Fresh Bakes", title: "Sourdough & Artisan Breads", description: "48-hour fermented sourdough, multigrain and focaccia baked daily." },
    { category: "Fresh Bakes", title: "Croissants & Viennoiserie", description: "All-butter croissants, pain au chocolat and almond danish." },
    { category: "Fresh Bakes", title: "Cookies, Brownies & Tea Cakes", description: "Gooey brownies, nankhatai and banana walnut loaves — eggless available." },
    { category: "Cakes & Celebrations", title: "Custom Birthday Cakes", description: "Theme, photo and fondant cakes designed around your celebration." },
    { category: "Cakes & Celebrations", title: "Wedding & Tiered Cakes", description: "Multi-tier showpiece cakes with a complimentary tasting session." },
    { category: "Cakes & Celebrations", title: "Dessert Hampers & Gifting", description: "Festive and corporate hampers with cookies, cakes and coffee." },
    { category: "Brunch & Meals", title: "All-Day Breakfast", description: "Shakshuka, avocado toast, akuri on sourdough and fluffy pancakes." },
    { category: "Brunch & Meals", title: "Sandwiches & Bowls", description: "Grilled paneer pesto, chicken tikka melts and wholesome grain bowls." },
  ],
  gallery: [
    "Morning bake on the counter", "Latte art at the espresso bar", "Croissants fresh from the oven", "Three-tier floral wedding cake",
    "Weekend brunch spread", "Sourdough loaves cooling", "Cosy window seating", "Kids' theme birthday cake",
  ].map((caption) => ({ category: "Our Café", caption })),
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "centered", customHtml: "",
          badge: "BAKED FRESH AT 8 AM · 100% EGGLESS OPTIONS", titleTop: "Good Coffee. Warm Bakes.", titleHighlight: "Cakes Worth Celebrating.",
          subtitle: "", description: `${biz} is your neighbourhood café for small-batch coffee, butter-laminated croissants, lazy weekend brunches and custom cakes made just the way you imagine them.`, image: "",
          primaryBtn: { label: "Pre-Order a Cake", href: "/pre-order" }, secondaryBtn: { label: "See the Menu", href: "/menu" },
          features: [
            { icon: "leaf", title: "Eggless on Request", text: "" }, { icon: "clock", title: "Fresh Every Morning", text: "" },
            { icon: "gift", title: "Custom Cakes in 24 hrs", text: "" }, { icon: "truck", title: "Doorstep Delivery", text: "" },
          ],
        } },
        { type: "priceList", content: {
          eyebrow: "BESTSELLERS", title: "The Ones People", titleHighlight: "Come Back For",
          note: "Prices inclusive of GST. Ask us for today's specials at the counter.",
          groups: [
            { category: "From the Bar", items: [
              { name: "Jaggery Cold Brew", price: "₹210", note: "Signature" }, { name: "Flat White", price: "₹190", note: "" }, { name: "Masala Chai Pot", price: "₹140", note: "Serves 2" }, { name: "Filter Kaapi Tonic", price: "₹200", note: "Summer special" },
            ] },
            { category: "From the Oven", items: [
              { name: "All-Butter Croissant", price: "₹160", note: "" }, { name: "Nutella Babka Slice", price: "₹180", note: "" }, { name: "Eggless Fudge Brownie", price: "₹130", note: "" }, { name: "Cardamom Morning Bun", price: "₹150", note: "Weekends only" },
            ] },
          ],
        }, style: { background: "dark", cardRadius: "lg" } },
        { type: "features", content: { items: [
          { icon: "leaf", title: "Every Cake Has an Eggless Twin", text: "Same recipe, same price — tested side by side until nobody can tell." },
          { icon: "heart", title: "Real Butter, Real Chocolate", text: "French-style butter and Belgian couverture. No margarine, no compound." },
          { icon: "star", title: "Estate Coffee", text: "Single-origin beans from Chikmagalur and Coorg, roasted every week." },
          { icon: "gift", title: "Gift-Ready Boxes", text: "Hampers and cake boxes with handwritten notes, delivered on time." },
        ] }, style: { cardRadius: "lg", cardShadow: "sm" } },
        { type: "about", content: {
          eyebrow: "FROM OUR OVEN", title: "A Little Bakery With a", titleHighlight: "Big Butter Habit",
          body: [`${biz} started as a home kitchen taking cake orders on WhatsApp. Today we bake over 400 croissants, 60 sourdough loaves and dozens of celebration cakes every week — still by hand, still in small batches.`, "We use real butter, Belgian chocolate, local A2 milk and estate coffee from Karnataka. No premixes, no shortcuts, and every recipe has an eggless twin."],
          image: "", points: ["Real butter, no margarine", "Eggless version of every cake", "Coffee roasted in small batches", "Jain-friendly options available"],
          buttonLabel: "Read Our Story", buttonHref: "/about",
        }, style: { layout: "reverse", background: "light" } },
        { type: "imageBanner", content: { title: "Your cake, your way", subtitle: "Tell us the theme, flavour and size — we'll sketch it, bake it and box it. Eggless at no extra cost.", buttonLabel: "Design a Custom Cake", buttonHref: "/custom-cakes", image: "" } },
        { type: "serviceCategories", content: { eyebrow: "WHAT'S COOKING", title: "Something for", titleHighlight: "Every Craving", categories: ["Coffee & Drinks", "Fresh Bakes", "Cakes & Celebrations", "Brunch & Meals"] }, style: { layout: "tiles" } },
        { type: "steps", content: { eyebrow: "CAKE IN 4 STEPS", title: "From Idea to", titleHighlight: "Candles", items: [
          { title: "Share Your Idea", text: "A theme, photo or Pinterest screenshot", icon: "edit" },
          { title: "Get a Sketch", text: "Design & price on WhatsApp in 2 hours", icon: "clipboard" },
          { title: "We Bake Fresh", text: "Baked the same morning, never frozen", icon: "heart" },
          { title: "Pick Up or Delivered", text: "Chilled delivery box, on time", icon: "truck" },
        ] }, style: { layout: "cards", background: "light" } },
        { type: "stats", content: { items: [
          { value: "400+", label: "Croissants Baked Weekly", icon: "star" }, { value: "12,000+", label: "Cakes Delivered", icon: "gift" },
          { value: "4.8★", label: "Google Rating", icon: "thumbs-up" }, { value: "100%", label: "Eggless Options", icon: "leaf" },
        ] }, style: { layout: "cards" } },
        { type: "testimonials", content: { eyebrow: "SWEET WORDS", title: "Regulars Say It", titleHighlight: "Best", items: [
          { name: "Riya Deshmukh", role: "Ordered a 2-tier eggless cake", text: "They turned my daughter's crayon drawing into a unicorn cake and it tasted even better than it looked. Not a single guest believed it was eggless!", rating: 5 },
          { name: "Arjun Nair", role: "Weekday regular", text: "The flat white here is the only one in the city that tastes like Bengaluru. I work from their window seat three days a week.", rating: 5 },
          { name: "Fatima Sheikh", role: "Weekend brunch fan", text: "Akuri on sourdough, a jaggery cold brew and the almond croissant — my perfect Sunday. Staff remember my order every time.", rating: 5 },
        ] }, style: { layout: "minimal" } },
        { type: "logos", content: { title: "Cakes & hampers for", items: ["Birthdays", "Anniversaries", "Baby Showers", "Office Treats", "Diwali Hampers", "Wedding Favours", "Rakhi Boxes"] }, style: { background: "light", spacingTop: "sm", spacingBottom: "sm" } },
        { type: "gallery", content: { eyebrow: "ON THE COUNTER", title: "Fresh From", titleHighlight: "Our Kitchen" }, style: { layout: "masonry" } },
        hours,
        { type: "faq", content: { eyebrow: "QUICK ANSWERS", title: "Before You", titleHighlight: "Drop By", items: [
          { q: "How much notice do you need for a custom cake?", a: "24 hours for most cream cakes, 48 hours for fondant, photo and tiered cakes. Same-day cakes are available from the counter." },
          { q: "Is everything available eggless?", a: "Yes — every cake and most bakes have an eggless version at the same price. Ask for our egg-free croissants, glazed with milk instead of egg wash." },
          { q: "Do you deliver?", a: "We deliver cakes and bake boxes within 8 km in a chilled box. Delivery is free on orders above ₹1,500." },
          { q: "Can I work from the café?", a: "Of course. We have free Wi-Fi, charging points at the window bar and no time limit on weekdays." },
          { q: "Are you pet-friendly?", a: "Our outdoor sit-out is pet-friendly — we even keep a jar of dog biscuits at the counter." },
        ] } },
        cta,
      ],
    },
    { slug: "menu", title: "Café Menu", isSystem: true, order: 1, sections: [
      { type: "banner", content: { title: "The Café", titleHighlight: "Menu", subtitle: "Coffee, bakes and plates — made fresh, all day.", image: "", bgColor: "", imageOpacity: 40, overlayOpacity: 60 } },
      { type: "priceList", content: {
        eyebrow: "", title: "Sip, Bite,", titleHighlight: "Repeat",
        note: "All prices inclusive of GST. Oat, almond and soy milk +₹40. Eggless and Jain versions available — just ask.",
        groups: [
          { category: "Espresso & Coffee", items: [
            { name: "Espresso / Doppio", price: "₹120 / ₹150", note: "" }, { name: "Cappuccino", price: "₹180", note: "" }, { name: "Flat White", price: "₹190", note: "" },
            { name: "Jaggery Cold Brew", price: "₹210", note: "House signature" }, { name: "Pour Over (Chikmagalur estate)", price: "₹240", note: "" },
          ] },
          { category: "Tea & Coolers", items: [
            { name: "Masala Chai Pot", price: "₹140", note: "Serves 2" }, { name: "Kashmiri Kahwa", price: "₹160", note: "" }, { name: "Iced Hibiscus Lemonade", price: "₹170", note: "" },
          ] },
          { category: "Bakes", items: [
            { name: "All-Butter Croissant", price: "₹160", note: "" }, { name: "Almond Croissant", price: "₹210", note: "" }, { name: "Pain au Chocolat", price: "₹190", note: "" },
            { name: "Eggless Fudge Brownie", price: "₹130", note: "" }, { name: "Banana Walnut Loaf (slice)", price: "₹120", note: "" },
          ] },
          { category: "Breads to Take Home", items: [
            { name: "Classic Sourdough Loaf", price: "₹320", note: "48-hr ferment" }, { name: "Multigrain Sandwich Loaf", price: "₹180", note: "" }, { name: "Rosemary Focaccia", price: "₹260", note: "" },
          ] },
          { category: "Sandwiches & Plates", items: [
            { name: "Grilled Paneer Pesto Sandwich", price: "₹290", note: "" }, { name: "Chicken Tikka Melt", price: "₹340", note: "" }, { name: "Quinoa Harvest Bowl", price: "₹360", note: "" },
          ] },
        ],
      }, style: { cardRadius: "lg" } },
      { type: "features", content: { items: [
        { icon: "leaf", title: "Eggless Everything", text: "Every bake on the menu has an eggless version on request." },
        { icon: "heart", title: "Real Ingredients", text: "Butter, Belgian chocolate and local A2 milk — no premixes." },
        { icon: "package", title: "Takeaway & Delivery", text: "Order at the counter, on WhatsApp or through popular food delivery apps." },
      ] }, style: { background: "light", cardRadius: "lg" } },
      cta,
    ] },
    { slug: "custom-cakes", title: "Custom Cakes", isSystem: true, order: 2, sections: [
      { type: "about", content: {
        eyebrow: "CUSTOM CAKES", title: "Dream It. We'll", titleHighlight: "Bake It.",
        body: ["From a simple chocolate truffle with a hand-piped message to a four-tier wedding showpiece, every custom cake is designed with you — flavour, sponge, frosting and décor.", "Share a photo, a theme or just a mood. Our cake designer sends a sketch and quote on WhatsApp within a few hours."],
        image: "", points: ["Eggless at no extra cost", "Free sketch & design consultation", "Tasting box for wedding cakes", "Same-city delivery with cold box"],
        buttonLabel: "Start Your Order", buttonHref: "/pre-order",
      } },
      cakeMenu,
      { type: "steps", content: { eyebrow: "HOW IT WORKS", title: "Four Steps to Your", titleHighlight: "Perfect Cake", items: [
        { title: "Share Your Idea", text: "Theme, flavour, size and date via the form or WhatsApp", icon: "edit" },
        { title: "Get a Sketch", text: "Our designer sends a sketch and final quote", icon: "clipboard" },
        { title: "Confirm & Pay 50%", text: "Lock your date with a UPI advance", icon: "check" },
        { title: "Pick Up or Delivery", text: "Boxed fresh, delivered chilled to your door", icon: "truck" },
      ] }, style: { background: "dark" } },
      { type: "faq", content: { eyebrow: "CAKE FAQ", title: "Before You", titleHighlight: "Order", items: [
        { q: "How early should I order a custom cake?", a: "Classic cakes need 24 hours, fondant and photo cakes 48 hours, and tiered wedding cakes at least 7 days." },
        { q: "Are your eggless cakes really as soft?", a: "Yes — our eggless recipes are developed separately, not just adapted. Most guests can't tell the difference." },
        { q: "Do you deliver?", a: "We deliver across the city in temperature-controlled boxes. Delivery charges start at ₹99 depending on distance." },
        { q: "Can I get sugar-free or vegan cakes?", a: "We offer jaggery-sweetened and dairy-free options on select flavours. Mention it in your order notes." },
      ] } },
      cta,
    ] },
    { slug: "brunch", title: "Weekend Brunch", isSystem: true, order: 3, sections: [
      { type: "imageBanner", content: { title: "Slow mornings, done right", subtitle: "Every Saturday & Sunday, 9 AM – 2 PM. Bottomless filter coffee with every brunch set.", buttonLabel: "Reserve a Table", buttonHref: "/contact", image: "" } },
      { type: "pricingPlans", content: {
        eyebrow: "BRUNCH SETS", title: "Pick Your", titleHighlight: "Brunch",
        plans: [
          { name: "The Light One", price: "₹449", period: "/person", features: ["Avocado or akuri toast on sourdough", "Seasonal fruit bowl", "Any hot coffee or chai"], featured: false, buttonLabel: "Reserve", buttonHref: "/contact" },
          { name: "The Big Sunday", price: "₹699", period: "/person", features: ["Shakshuka or pancakes stack", "Butter croissant & jam", "Fresh juice of the day", "Bottomless filter coffee"], featured: true, buttonLabel: "Reserve", buttonHref: "/contact" },
          { name: "Brunch for Two", price: "₹1,249", period: "/couple", features: ["Two mains of your choice", "Pastry basket to share", "Two signature coffees", "Mini dessert jar"], featured: false, buttonLabel: "Reserve", buttonHref: "/contact" },
        ],
      }, style: { background: "light", cardRadius: "lg", cardShadow: "md" } },
      { type: "features", content: { items: [
        { icon: "users", title: "Kid-Friendly", text: "Mini pancakes, colouring sheets and high chairs on hand." },
        { icon: "leaf", title: "Veg & Jain Options", text: "Every brunch main has a vegetarian and Jain version." },
        { icon: "heart", title: "Pet-Friendly Patio", text: "Bring your pup — water bowls and dog biscuits are on us." },
      ] } },
      { type: "testimonials", content: { eyebrow: "BRUNCH REVIEWS", title: "Sundays Well", titleHighlight: "Spent", items: [
        { name: "Neha & Karan Bhatia", role: "Brunch every other Sunday", text: "Bottomless filter coffee, shakshuka and the cardamom bun — we've stopped going anywhere else.", rating: 5 },
        { name: "Ishita Rao", role: "Birthday brunch for 12", text: "They reserved the long table, made a mini cake and didn't rush us at all. Lovely team.", rating: 5 },
      ] }, style: { layout: "featured", background: "light" } },
      { type: "faq", content: { eyebrow: "BRUNCH FAQ", title: "Weekend", titleHighlight: "Basics", items: [
        { q: "Do I need to reserve for brunch?", a: "Walk-ins are welcome, but tables for 4+ after 10:30 AM usually need a reservation." },
        { q: "Is there a kids' menu?", a: "Yes — mini pancakes, cheese toast and hot chocolate, plus high chairs on request." },
      ] } },
      cta,
    ] },
    { slug: "about", title: "Our Story", isSystem: true, order: 4, sections: [
      { type: "about", content: {
        eyebrow: "OUR STORY", title: "Started in a Home Kitchen,", titleHighlight: "Baked With Love",
        body: [`${biz} began with one oven, one stand mixer and a stream of birthday cake orders from neighbours. When the queue outgrew the kitchen, we opened a café so people could taste things fresh and warm.`, "We still laminate our croissant dough by hand, feed our sourdough starter twice a day and taste every batch before it reaches the counter."],
        image: "", points: ["Home-grown, women-led bakery", "Local farmers & estate coffee", "Zero premix, zero preservatives", "Plastic-free packaging"],
        buttonLabel: "See Our Menu", buttonHref: "/menu",
      } },
      { type: "team", content: { eyebrow: "THE BAKERS", title: "Hands Behind the", titleHighlight: "Bakes", members: [
        { name: "Meera Kulkarni", role: "Founder & Head Baker", image: "", note: "Le Cordon Bleu trained" },
        { name: "Sahil Thomas", role: "Head Barista", image: "", note: "SCA certified · 7 yrs" },
        { name: "Nandini Rao", role: "Cake Designer", image: "", note: "2,000+ custom cakes" },
        { name: "Imran Khan", role: "Viennoiserie Chef", image: "", note: "Croissant specialist" },
      ] }, style: { background: "light", cardRadius: "lg" } },
      { type: "stats", content: { items: [
        { value: "6", label: "Years of Baking", icon: "award" }, { value: "60+", label: "Loaves a Week", icon: "star" },
        { value: "35", label: "Cake Flavours", icon: "gift" }, { value: "18", label: "Team Members", icon: "users" },
      ] }, style: { background: "dark" } },
      cta,
    ] },
    { slug: "gallery", title: "Gallery", isSystem: true, order: 5, sections: [
      { type: "gallery", content: { eyebrow: "GALLERY", title: "Butter, Sugar &", titleHighlight: "Good Light" } },
      { type: "testimonials", content: { eyebrow: "REVIEWS", title: "From Our", titleHighlight: "Guests", items: [
        { name: "Kavya Menon", role: "Wedding cake client", text: "Our three-tier rose and pistachio cake was the talk of the reception. The tasting session made choosing so easy.", rating: 5 },
        { name: "Rahul Bansal", role: "Office hamper order", text: "Ordered 80 Diwali hampers for our team — beautifully packed and delivered on time.", rating: 5 },
      ] }, style: { background: "light", cardRadius: "lg" } },
      cta,
    ] },
    { slug: "pre-order", title: "Pre-Order", isSystem: true, order: 6, sections: [
      { type: "quoteForm", content: { title: "Pre-Order a Cake or Bake Box", subtitle: "Tell us the occasion, date, flavour and size. We'll confirm the design and price on WhatsApp within 2 hours.", showSidebar: true } },
      cakeMenu,
      { type: "steps", content: { eyebrow: "WHAT HAPPENS NEXT", title: "From Order to", titleHighlight: "Celebration", items: [
        { title: "We Call You", text: "Quick chat to finalise the design", icon: "phone" },
        { title: "Advance via UPI", text: "50% to lock your date", icon: "check" },
        { title: "Fresh Bake", text: "Baked on the day of pick-up", icon: "clock" },
        { title: "Enjoy", text: "Pick up or get it delivered", icon: "gift" },
      ] } },
    ] },
    { slug: "contact", title: "Visit Us", isSystem: true, order: 7, sections: [
      { type: "contactInfo", content: { eyebrow: "SAY HELLO", title: "Come In for", titleHighlight: "Coffee", address: "Your City", phone: PHONE, email: "hello@example.com", hours: "Mon–Fri 7:30 AM – 10 PM · Sat–Sun 8 AM – 11 PM", mapEmbed: "" } },
      { type: "map", content: { eyebrow: "FIND US", title: "Follow the Smell of", titleHighlight: "Fresh Bread", address: "Your City", mapEmbed: "" } },
      { type: "contactForm", content: { title: "Send Us a Note", subtitle: "Table bookings, bulk orders, collaborations or feedback — we reply the same day." } },
      hours,
    ] },
  ],
};
