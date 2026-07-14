import type { TemplateDef } from "./types";

export const restaurant: TemplateDef = {
  theme: {
    colors: { primary: "#dc2626", primaryDark: "#b91c1c", secondary: "#1c1917", accent: "#f59e0b", dark: "#1c1917", light: "#fff7ed", text: "#44403c", heading: "#1c1917" },
    font: "Poppins", radius: "0.8rem",
  },
  header: (biz) => ({
    logoText: biz, logoImage: "",
    topbar: { show: true, address: "Open 11am – 11pm · Dine-in & Takeaway", phones: ["9000000000"], email: "hello@example.com", social: { facebook: "#", instagram: "#", whatsapp: "#" } },
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
    about: "Delicious food, warm ambience, unforgettable moments.",
    columns: [
      { title: "Quick Links", links: [
        { label: "Home", href: "/" }, { label: "Menu", href: "/menu" }, { label: "Gallery", href: "/gallery" }, { label: "Book a Table", href: "/book" }, { label: "Contact", href: "/contact" },
      ] },
      { title: "Hours", links: [
        { label: "Mon–Fri: 11am–11pm", href: "#" }, { label: "Sat–Sun: 10am–12am", href: "#" }, { label: "Takeaway & Delivery", href: "#" }, { label: "Party Bookings", href: "/book" },
      ] },
    ],
    serviceAreas: ["Dine-in", "Takeaway", "Delivery", "Party Hall", "Catering"],
    contact: { phones: ["9000000000"], email: "hello@example.com", address: "Your City" },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. All Rights Reserved.`,
  }),
  seo: (biz) => ({ title: `${biz} — Restaurant & Dining`, description: "Authentic flavours, cozy ambience — dine in, take away or book a table online.", favicon: "", ogImage: "" }),
  services: [
    { category: "Dining", title: "Dine-in", description: "Comfortable indoor & outdoor seating." },
    { category: "Dining", title: "Takeaway", description: "Quick pickup on all dishes." },
    { category: "Dining", title: "Home Delivery", description: "Hot food to your doorstep." },
    { category: "Events", title: "Party Hall", description: "Celebrate with us." },
    { category: "Events", title: "Catering", description: "We cater your events." },
  ],
  gallery: [...["Signature dish", "Interior", "Chef special", "Desserts", "Ambience", "Live counter"].map((c) => ({ category: "Our Restaurant", caption: c }))],
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "centered", customHtml: "",
          badge: "FRESH · AUTHENTIC · DELICIOUS", titleTop: "Taste the", titleHighlight: "Difference",
          subtitle: "", description: `Welcome to ${biz} — where every dish is crafted with love and the finest ingredients.`, image: "",
          primaryBtn: { label: "Book a Table", href: "/book" }, secondaryBtn: { label: "View Menu", href: "/menu" },
          features: [ { icon: "star", title: "Top Rated", text: "" }, { icon: "check", title: "Fresh Daily", text: "" }, { icon: "clock", title: "Quick Service", text: "" }, { icon: "home", title: "Cozy Ambience", text: "" } ],
        } },
        { type: "about", content: { eyebrow: "ABOUT US", title: "A Place to", titleHighlight: "Savour", body: [`${biz} brings you authentic flavours in a warm, welcoming space.`, "From family dinners to celebrations, we make every meal memorable."], image: "", points: ["Fresh ingredients", "Expert chefs", "Great ambience", "Warm service"], buttonLabel: "Our Story", buttonHref: "/about" } },
        { type: "priceList", content: { eyebrow: "OUR MENU", title: "Popular", titleHighlight: "Dishes", note: "Prices inclusive of taxes.", groups: [
          { category: "Starters", items: [ { name: "Paneer Tikka", price: "₹220", note: "" }, { name: "Chicken 65", price: "₹260", note: "" }, { name: "Veg Spring Roll", price: "₹180", note: "" } ] },
          { category: "Main Course", items: [ { name: "Butter Chicken", price: "₹340", note: "" }, { name: "Paneer Butter Masala", price: "₹300", note: "" }, { name: "Biryani (Veg/Chicken)", price: "₹250", note: "" } ] },
          { category: "Desserts & Drinks", items: [ { name: "Gulab Jamun", price: "₹90", note: "" }, { name: "Fresh Lime Soda", price: "₹80", note: "" } ] },
        ] } },
        { type: "stats", content: { items: [ { value: "50+", label: "Dishes", icon: "star" }, { value: "10k+", label: "Happy Diners", icon: "users" }, { value: "4.8★", label: "Rating", icon: "award" }, { value: "8+", label: "Years", icon: "home" } ] } },
        { type: "cta", content: { title: "Hungry?", highlight: "Book Your Table Now", phones: ["9000000000"], buttonLabel: "Book a Table", buttonHref: "/book" } },
      ],
    },
    { slug: "menu", title: "Menu", isSystem: true, order: 1, sections: [
      { type: "priceList", content: { eyebrow: "", title: "Full", titleHighlight: "Menu", note: "", groups: [
        { category: "Starters", items: [ { name: "Paneer Tikka", price: "₹220", note: "" }, { name: "Chicken 65", price: "₹260", note: "" }, { name: "Veg Spring Roll", price: "₹180", note: "" }, { name: "Tandoori Mushroom", price: "₹240", note: "" } ] },
        { category: "Main Course", items: [ { name: "Butter Chicken", price: "₹340", note: "" }, { name: "Paneer Butter Masala", price: "₹300", note: "" }, { name: "Dal Makhani", price: "₹220", note: "" }, { name: "Biryani", price: "₹250", note: "" } ] },
        { category: "Breads & Rice", items: [ { name: "Butter Naan", price: "₹45", note: "" }, { name: "Jeera Rice", price: "₹150", note: "" } ] },
        { category: "Desserts & Drinks", items: [ { name: "Gulab Jamun", price: "₹90", note: "" }, { name: "Ice Cream", price: "₹110", note: "" }, { name: "Fresh Lime Soda", price: "₹80", note: "" } ] },
      ] } },
      { type: "cta", content: { title: "Loved the menu?", highlight: "Reserve a Table", phones: ["9000000000"], buttonLabel: "Book a Table", buttonHref: "/book" } },
    ] },
    { slug: "gallery", title: "Gallery", isSystem: true, order: 2, sections: [ { type: "gallery", content: { eyebrow: "", title: "Our", titleHighlight: "Gallery" } } ] },
    { slug: "about", title: "About", isSystem: true, order: 3, sections: [
      { type: "about", content: { eyebrow: "ABOUT US", title: "Our", titleHighlight: "Story", body: [`${biz} was born from a passion for great food and hospitality.`], image: "", points: ["Family recipes", "Locally sourced", "Loved by regulars"], buttonLabel: "", buttonHref: "" } },
      { type: "cta", content: { title: "Come dine with us", highlight: "Book a Table", phones: ["9000000000"], buttonLabel: "Book Now", buttonHref: "/book" } },
    ] },
    { slug: "contact", title: "Contact", isSystem: true, order: 4, sections: [ { type: "contactForm", content: { title: "Contact & Location", subtitle: "Reservations, parties or feedback — reach out." } } ] },
    { slug: "book", title: "Book a Table", isSystem: true, order: 5, sections: [ { type: "appointmentForm", content: { title: "Reserve Your Table", subtitle: "Pick a date & time — we'll keep it ready." } } ] },
  ],
};
