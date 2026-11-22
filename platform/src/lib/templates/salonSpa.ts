import type { TemplateDef } from "./types";

// Salon & Spa (hair, skin, nails, bridal makeup, massages, men's grooming):
// glossy blush + black, editorial and booking-focused.
export const salonSpa: TemplateDef = {
  theme: {
    colors: { primary: "#db2777", primaryDark: "#be185d", secondary: "#111111", accent: "#f9a8d4", dark: "#0f0a0d", light: "#fdf2f6", text: "#4b3f45", heading: "#111111" },
    font: "Epilogue", radius: "0.25rem",
  },
  header: (biz) => ({
    design: "modern",
    logoText: biz, logoImage: "",
    announcement: { show: true, text: "Festive glow offer · 20% off facials & hair spa this month — book your slot", link: "/book-appointment" },
    topbar: { show: true, address: "Your City", phones: ["9000000000"], email: "hello@example.com", social: { facebook: "#", instagram: "#", whatsapp: "#" } },
    nav: [
      { label: "Home", href: "/" }, { label: "Services", href: "/services" }, { label: "Price List", href: "/price-list" }, { label: "Bridal", href: "/bridal" },
      { label: "Spa", href: "/spa" }, { label: "Membership", href: "/membership" }, { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Book Appointment", href: "/book-appointment" },
  }),
  footer: (biz) => ({
    design: "centered",
    about: `${biz} is a full-service unisex salon and day spa — expert stylists, certified therapists and premium products for hair, skin, nails and bridal beauty.`,
    columns: [
      { title: "Salon", links: [ { label: "Hair, Skin & Nails", href: "/services" }, { label: "Price List", href: "/price-list" }, { label: "Bridal Makeup", href: "/bridal" }, { label: "Spa & Massages", href: "/spa" } ] },
      { title: "Visit", links: [ { label: "Book Appointment", href: "/book-appointment" }, { label: "Membership", href: "/membership" }, { label: "Contact Us", href: "/contact" } ] },
    ],
    serviceAreas: ["Haircuts & Colour", "Keratin & Smoothening", "Facials & Skin", "Nail Art", "Bridal Makeup", "Spa Massages", "Men's Grooming"],
    contact: { phones: ["9000000000"], email: "hello@example.com", address: "Your City" },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. Look good, feel better.`,
  }),
  seo: (biz) => ({
    title: `${biz} — Unisex Salon, Bridal Makeup & Day Spa in Your City`,
    description: "Haircuts, colour, keratin, facials, nail art, bridal makeup, spa massages and men's grooming by expert stylists. Transparent price list and money-saving memberships. Book online.",
    favicon: "", ogImage: "",
    keywords: "salon near me, unisex salon, bridal makeup artist, hair spa, keratin treatment, facial, nail art, body massage spa, men's grooming",
    businessType: "BeautySalon", priceRange: "₹₹",
  }),
  services: [
    { category: "Hair", title: "Cut, Style & Blow-dry", description: "Precision cuts and finishes tailored to your face shape and lifestyle." },
    { category: "Hair", title: "Global & Highlights Colour", description: "Ammonia-free colour, balayage and highlights by colour specialists." },
    { category: "Hair", title: "Keratin & Smoothening", description: "Frizz-free, glossy hair for months with professional-grade treatments." },
    { category: "Skin & Nails", title: "Signature Facials", description: "Hydra, gold, detan and anti-ageing facials for every skin type." },
    { category: "Skin & Nails", title: "Waxing & Threading", description: "Quick, hygienic hair removal with liposoluble and chocolate wax options." },
    { category: "Skin & Nails", title: "Manicure, Pedicure & Nail Art", description: "Spa mani-pedis, gel polish, extensions and hand-painted nail art." },
    { category: "Bridal & Makeup", title: "Bridal Makeup", description: "HD and airbrush bridal looks with draping and hairstyling, at the salon or venue." },
    { category: "Bridal & Makeup", title: "Party & Engagement Makeup", description: "Camera-ready looks for sangeet, reception, cocktail and festive events." },
    { category: "Spa & Grooming", title: "Spa Massages", description: "Swedish, deep tissue, Balinese and aromatherapy massages by certified therapists." },
    { category: "Spa & Grooming", title: "Men's Grooming", description: "Haircuts, beard sculpting, hot-towel shaves, facials and hair colour for men." },
    { category: "Spa & Grooming", title: "Hair Spa & Scalp Care", description: "Deep-conditioning rituals for dry, damaged or falling hair." },
  ],
  gallery: [
    "Styling floor", "Balayage colour work", "Bridal look", "Nail art studio", "Facial room", "Couple spa suite", "Men's grooming lounge", "Reception & retail bar",
  ].map((caption) => ({ category: "Our Salon", caption })),
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "split", customHtml: "",
          badge: "UNISEX SALON · BRIDAL STUDIO · DAY SPA", titleTop: "Beauty, Styled", titleHighlight: "Just for You",
          subtitle: "", description: `From a quick blow-dry to your big day, ${biz} brings senior stylists, certified therapists and salon-professional products under one chic roof.`, image: "",
          primaryBtn: { label: "Book Appointment", href: "/book-appointment" }, secondaryBtn: { label: "View Price List", href: "/price-list" },
          features: [ { icon: "star", title: "Senior Stylists", text: "" }, { icon: "shield", title: "Hygiene First", text: "" }, { icon: "gift", title: "Member Rewards", text: "" }, { icon: "clock", title: "Open 7 Days", text: "" } ],
        } },
        { type: "serviceCategories", content: { eyebrow: "OUR SERVICES", title: "Everything You", titleHighlight: "Need to Glow", categories: ["Hair", "Skin & Nails", "Bridal & Makeup", "Spa & Grooming"] }, style: { layout: "tiles" } },
        { type: "priceList", content: { eyebrow: "POPULAR PICKS", title: "Starting", titleHighlight: "Prices", note: "Final price depends on hair length and products chosen. Full menu on the price list page.", groups: [
          { category: "Hair", items: [ { name: "Women's haircut & blow-dry", price: "₹899", note: "" }, { name: "Global colour", price: "₹2,999+", note: "ammonia-free" }, { name: "Keratin treatment", price: "₹4,999+", note: "" }, { name: "Men's cut & beard", price: "₹549", note: "" } ] },
          { category: "Skin & Spa", items: [ { name: "Hydra glow facial", price: "₹2,499", note: "60 min" }, { name: "Swedish massage", price: "₹2,199", note: "60 min" }, { name: "Gel manicure", price: "₹999", note: "" }, { name: "Full-arm & leg wax", price: "₹1,099", note: "" } ] },
        ] }, style: { background: "light", cardRadius: "sm" } },
        { type: "about", content: {
          eyebrow: "THE SALON", title: "Chic Space,", titleHighlight: "Honest Advice",
          body: [`${biz} began as a two-chair studio and grew into a 3,500 sq ft unisex salon and day spa — still run on the same idea: listen first, then cut.`, "Every chemical service starts with a free consultation and patch test, and every stylist trains at least 60 hours a year on new techniques."],
          image: "", points: ["Separate men's grooming lounge", "Private couple spa suite", "Single-use kits for every client", "Free consultation before colour & keratin", "Card, UPI & wallet payments", "Valet parking on weekends"],
          buttonLabel: "Our Services", buttonHref: "/services",
        }, style: { layout: "stacked" } },
        { type: "testimonials", content: { eyebrow: "REVIEWS", title: "Loved by", titleHighlight: "Our Clients", items: [
          { name: "Sneha Agarwal", role: "Bride · Dec 2025", text: "My bridal makeup stayed flawless for 12 hours of pheras and photos. The trial helped me feel completely sure of my look.", rating: 5 },
          { name: "Rhea D'Souza", role: "Colour client", text: "Finally a salon that listens! My balayage is exactly what I showed them, and my hair feels healthier than before.", rating: 5 },
          { name: "Aman Khurana", role: "Gentleman member", text: "Best beard sculpting and hot-towel shave in the city. The membership pays for itself in two visits.", rating: 5 },
        ] }, style: { layout: "dark", background: "dark" } },
        { type: "features", content: { ...{ eyebrow: "WHY US", title: "The Salon", titleHighlight: "Standard" }, items: [
          { icon: "badge-check", title: "Professional Products Only", text: "Salon-grade colour, bond-repair and skincare ranges — never local substitutes or refills." },
          { icon: "shield", title: "Sterilised Tools", text: "UV-sterilised tools, fresh towels and single-use kits for every client." },
          { icon: "user-check", title: "Consultation First", text: "A free skin and hair consultation and patch test before every chemical service." },
          { icon: "tag", title: "Transparent Pricing", text: "What you see is what you pay. No surprise add-ons at the counter." },
        ] }, style: { layout: "split" } },
        { type: "gallery", content: { eyebrow: "LOOKBOOK", title: "Fresh From", titleHighlight: "Our Chairs" }, style: { layout: "masonry", background: "light" } },
        { type: "team", content: { eyebrow: "THE ARTISTS", title: "Meet Our", titleHighlight: "Stylists", members: [
          { name: "Zoya Sheikh", role: "Creative Director · Hair", image: "", note: "Trained in London · 12 yrs" },
          { name: "Pallavi Thakur", role: "Lead Bridal Artist", image: "", note: "800+ brides" },
          { name: "Irfan Ali", role: "Senior Colourist", image: "", note: "Balayage specialist · 9 yrs" },
          { name: "Lakshmi Pillai", role: "Spa Therapist", image: "", note: "Kerala Ayurveda trained" },
        ] }, style: { cardRadius: "sm", cardShadow: "md" } },
        { type: "countdown", content: { eyebrow: "FESTIVE GLOW OFFER", title: "20% Off Facials &", titleHighlight: "Hair Spa", subtitle: "For new and existing clients, all week including weekends. Pre-book on WhatsApp — limited slots per day.", targetDate: "2026-12-31T21:00", buttonLabel: "Grab the Offer", buttonHref: "/book-appointment" }, style: { background: "primary" } },
        { type: "pricingPlans", content: {
          eyebrow: "MEMBERSHIP", title: "Save on Every", titleHighlight: "Visit",
          plans: [
            { name: "Glow", price: "₹4,999", period: "/6 months", features: ["15% off all services", "1 free hair spa", "Birthday facial"], featured: false, buttonLabel: "Join Glow", buttonHref: "/membership" },
            { name: "Luxe", price: "₹9,999", period: "/year", features: ["25% off all services", "4 free hair spas", "2 free massages", "Priority weekend slots"], featured: true, buttonLabel: "Join Luxe", buttonHref: "/membership" },
            { name: "Gentleman", price: "₹3,499", period: "/6 months", features: ["Unlimited beard trims", "20% off haircuts & facials", "1 free head massage monthly"], featured: false, buttonLabel: "Join Now", buttonHref: "/membership" },
          ],
        }, style: { cardRadius: "sm" } },
        { type: "openingHours", content: { eyebrow: "SALON HOURS", title: "Open", titleHighlight: "7 Days", note: "Bridal and on-venue appointments from 4 AM on request. Last booking 45 minutes before closing.", days: [
          { day: "Monday – Friday", hours: "10:00 AM – 9:00 PM" }, { day: "Saturday – Sunday", hours: "9:00 AM – 9:30 PM" }, { day: "Public Holidays", hours: "10:00 AM – 6:00 PM" },
        ] }, style: { background: "light" } },
        { type: "faq", content: { ...{ intro: "Bookings, products and aftercare — quick answers before your visit." }, eyebrow: "FAQ", title: "Good to", titleHighlight: "Know", items: [
          { q: "Do I need to book in advance?", a: "Walk-ins are welcome, but we recommend booking — especially for weekends, colour, keratin and spa services." },
          { q: "Is this a unisex salon?", a: "Yes. We have a dedicated men's grooming section alongside our women's styling floor and private spa rooms." },
          { q: "Do you offer bridal trials?", a: "Yes, bridal trials are available at a fixed fee that is adjusted against your final bridal package." },
          { q: "Which products do you use?", a: "Only professional salon ranges — ammonia-free colour, bond-repair treatments and dermatologist-tested skincare. Ask your stylist and they'll show you the product before use." },
          { q: "How long does keratin last?", a: "Typically 3–5 months depending on hair type and aftercare. We give you a sulphate-free aftercare routine with every treatment." },
        ] }, style: { layout: "split" } },
        { type: "cta", content: { title: "Ready for a little me-time?", highlight: "Book Your Slot Today", phones: ["9000000000"], buttonLabel: "Book Appointment", buttonHref: "/book-appointment" }, style: { background: "dark" } },
      ],
    },
    { slug: "services", title: "Services", isSystem: true, order: 1, sections: [
      { type: "banner", content: { title: "Our", titleHighlight: "Services", subtitle: "Hair, skin, nails, makeup, spa and grooming — expertly done.", image: "", bgColor: "#0f0a0d", imageOpacity: 55, overlayOpacity: 55 } },
      { type: "serviceCategories", content: { eyebrow: "MENU", title: "Pick Your", titleHighlight: "Pamper", categories: ["Hair", "Skin & Nails", "Bridal & Makeup", "Spa & Grooming"] }, style: { cardRadius: "sm", cardShadow: "lg" } },
      { type: "steps", content: { eyebrow: "YOUR VISIT", title: "How It", titleHighlight: "Works", items: [
        { title: "Book", text: "Online, on WhatsApp or by phone", icon: "calendar" },
        { title: "Consult", text: "We understand your hair & skin first", icon: "user-check" },
        { title: "Relax", text: "Tea, music and expert hands", icon: "heart" },
        { title: "Glow", text: "Aftercare tips to keep the look", icon: "star" },
      ] }, style: { background: "light" } },
      { type: "testimonials", content: { eyebrow: "CLIENT LOVE", title: "Why They", titleHighlight: "Keep Coming Back", items: [
        { name: "Nandini Rao", role: "Keratin client", text: "Four months later my hair is still smooth, and they told me honestly that I didn't need the pricier treatment.", rating: 5 },
        { name: "Kabir Sethi", role: "Men's grooming", text: "Quick, clean and the hot-towel shave is the best twenty minutes of my week.", rating: 5 },
        { name: "Meenal Joshi", role: "Nail art regular", text: "The gel art lasts three weeks easily. Hygiene is spotless.", rating: 5 },
      ] }, style: { layout: "featured" } },
      { type: "cta", content: { title: "Can't decide what you need?", highlight: "Get a Free Consultation", phones: ["9000000000"], buttonLabel: "Book Appointment", buttonHref: "/book-appointment" } },
    ] },
    { slug: "price-list", title: "Price List", isSystem: true, order: 2, sections: [
      { type: "priceList", content: { eyebrow: "FULL MENU", title: "Salon", titleHighlight: "Price List", note: "Prices are starting rates inclusive of GST and may vary with hair length and products. Members save 15–25% on every service.", groups: [
        { category: "Hair — Women", items: [ { name: "Haircut & blow-dry", price: "₹899", note: "" }, { name: "Blow-dry / ironing", price: "₹599", note: "" }, { name: "Global colour", price: "₹2,999+", note: "" }, { name: "Balayage / highlights", price: "₹4,499+", note: "" }, { name: "Keratin / smoothening", price: "₹4,999+", note: "" }, { name: "Bond-repair hair spa", price: "₹1,999", note: "" } ] },
        { category: "Men's Grooming", items: [ { name: "Haircut & styling", price: "₹399", note: "" }, { name: "Beard sculpting", price: "₹249", note: "" }, { name: "Hot-towel shave", price: "₹349", note: "" }, { name: "Hair colour", price: "₹799", note: "" }, { name: "Detan facial", price: "₹1,199", note: "" } ] },
        { category: "Skin", items: [ { name: "Clean-up", price: "₹799", note: "" }, { name: "Hydra glow facial", price: "₹2,499", note: "60 min" }, { name: "Gold / anti-ageing facial", price: "₹2,999", note: "75 min" }, { name: "Full-arm & leg liposoluble wax", price: "₹1,099", note: "" }, { name: "Eyebrow threading", price: "₹60", note: "" } ] },
        { category: "Nails", items: [ { name: "Classic manicure", price: "₹599", note: "" }, { name: "Spa pedicure", price: "₹899", note: "" }, { name: "Gel polish", price: "₹999", note: "hands" }, { name: "Nail extensions", price: "₹1,999+", note: "with art" } ] },
      ] }, style: { cardRadius: "sm" } },
      { type: "countdown", content: { eyebrow: "LIMITED OFFER", title: "20% Off Facials &", titleHighlight: "Hair Spa", subtitle: "Festive glow offer for new and existing clients. Book before it ends.", targetDate: "2026-12-31T21:00", buttonLabel: "Grab the Offer", buttonHref: "/book-appointment" }, style: { background: "dark" } },
      { type: "cta", content: { title: "Save every visit", highlight: "Become a Member", phones: ["9000000000"], buttonLabel: "See Memberships", buttonHref: "/membership" } },
    ] },
    { slug: "bridal", title: "Bridal Makeup", isSystem: true, order: 3, sections: [
      { type: "about", content: {
        eyebrow: "BRIDAL STUDIO", title: "Your Big Day,", titleHighlight: "Your Signature Look",
        body: ["Whether you dream of a dewy minimal look or a classic red-and-gold bridal, our lead artists design your look around your outfit, jewellery, skin and venue lighting.", "Every bridal package includes a consultation, skin-prep plan and hair styling — with on-venue service anywhere in Your City."],
        image: "", points: ["HD & airbrush makeup", "Saree & dupatta draping", "Pre-bridal skin & hair packages", "Family & bridesmaid makeup"],
        buttonLabel: "Book a Bridal Trial", buttonHref: "/book-appointment",
      } },
      { type: "pricingPlans", content: {
        eyebrow: "BRIDAL PACKAGES", title: "Pick Your", titleHighlight: "Package",
        plans: [
          { name: "Engagement / Reception", price: "₹12,000", period: "/look", features: ["HD makeup & hairstyling", "Draping", "Lashes included"], featured: false, buttonLabel: "Enquire", buttonHref: "/book-appointment" },
          { name: "Signature Bridal", price: "₹28,000", period: "/wedding day", features: ["Airbrush or HD makeup", "Hairstyling with accessories", "Draping & jewellery setting", "Bridal trial included", "Touch-up kit"], featured: true, buttonLabel: "Enquire", buttonHref: "/book-appointment" },
          { name: "Pre-Bridal Glow", price: "₹15,999", period: "/4 weeks", features: ["4 facials", "2 hair spas", "Full body polishing", "Mani-pedi & waxing"], featured: false, buttonLabel: "Enquire", buttonHref: "/book-appointment" },
        ],
      }, style: { background: "light", cardRadius: "sm", cardShadow: "lg" } },
      { type: "gallery", content: { eyebrow: "REAL BRIDES", title: "Bridal", titleHighlight: "Portfolio" } },
      { type: "testimonials", content: { eyebrow: "HAPPY BRIDES", title: "Their Words,", titleHighlight: "Not Ours", items: [
        { name: "Sneha Agarwal", role: "Bride · Dec 2025", text: "Pallavi understood my vision immediately. The makeup looked like my skin, only better — and survived a very emotional vidaai!", rating: 5 },
        { name: "Fatima Rizvi", role: "Bride · Feb 2026", text: "The whole team came to the venue on time and did my mother and sisters too. Zero stress on the wedding morning.", rating: 5 },
      ] }, style: { background: "dark" } },
      { type: "faq", content: { ...{ intro: "Booking timelines, finishes and pre-bridal prep, answered by our lead bridal artist." }, eyebrow: "BRIDAL FAQ", title: "Planning Your", titleHighlight: "Bridal Look", items: [
        { q: "When should I book my bridal makeup?", a: "3–6 months ahead for Nov–Feb weddings. A ₹5,000 advance locks your date and artist." },
        { q: "HD or airbrush — which is better?", a: "Airbrush is lighter and more sweat-proof for long outdoor functions; HD gives a fuller, glam finish. We help you choose at the trial." },
        { q: "Do you travel to the venue?", a: "Yes, anywhere in Your City at no extra charge; outstation and destination weddings at travel actuals." },
        { q: "When should I start pre-bridal treatments?", a: "Ideally 6–8 weeks before the wedding so skin and hair have time to respond." },
      ] }, style: { layout: "split" } },
      { type: "cta", content: { title: "Wedding dates fill early", highlight: "Lock Your Bridal Date", phones: ["9000000000"], buttonLabel: "Book a Bridal Trial", buttonHref: "/book-appointment" }, style: { background: "primary" } },
    ] },
    { slug: "spa", title: "Spa", isSystem: true, order: 4, sections: [
      { type: "banner", content: { title: "The", titleHighlight: "Day Spa", subtitle: "Private rooms, warm oils and certified therapists. Switch off for an hour.", image: "", bgColor: "", imageOpacity: 60, overlayOpacity: 40 } },
      { type: "priceList", content: { eyebrow: "SPA MENU", title: "Massages &", titleHighlight: "Rituals", note: "Couple suites available. Please arrive 15 minutes early to unwind with herbal tea.", groups: [
        { category: "Massages", items: [ { name: "Swedish relaxation", price: "₹2,199", note: "60 min" }, { name: "Deep tissue", price: "₹2,699", note: "60 min" }, { name: "Balinese", price: "₹2,899", note: "75 min" }, { name: "Head, neck & shoulder", price: "₹999", note: "30 min" } ] },
        { category: "Rituals", items: [ { name: "Abhyanga (Ayurvedic oil)", price: "₹2,999", note: "75 min" }, { name: "Body polishing", price: "₹2,499", note: "60 min" }, { name: "Couple spa package", price: "₹5,999", note: "90 min, for two" } ] },
      ] }, style: { background: "light" } },
      { type: "features", content: { items: [
        { icon: "user-check", title: "Certified Therapists", text: "Trained in Swedish, Balinese and Kerala Ayurveda techniques." },
        { icon: "droplet", title: "Cold-Pressed Oils", text: "Organic oils and aromatherapy blends chosen for you." },
        { icon: "shield", title: "Private & Safe", text: "Clean private rooms, fresh linen and same-gender therapists on request." },
      ] }, style: { align: "center", cardRadius: "sm", cardShadow: "sm" } },
      { type: "cta", content: { title: "You deserve a break", highlight: "Book a Massage", phones: ["9000000000"], buttonLabel: "Book Appointment", buttonHref: "/book-appointment" }, style: { background: "dark" } },
    ] },
    { slug: "membership", title: "Membership", isSystem: true, order: 5, sections: [
      { type: "pricingPlans", content: {
        eyebrow: "MEMBERSHIP", title: "Beauty That", titleHighlight: "Pays You Back",
        plans: [
          { name: "Glow", price: "₹4,999", period: "/6 months", features: ["15% off all services", "1 free hair spa", "Birthday facial", "Valid for 1 person"], featured: false, buttonLabel: "Join Glow", buttonHref: "/book-appointment" },
          { name: "Luxe", price: "₹9,999", period: "/year", features: ["25% off all services", "4 free hair spas", "2 free massages", "Priority weekend slots", "Share with 1 family member"], featured: true, buttonLabel: "Join Luxe", buttonHref: "/book-appointment" },
          { name: "Gentleman", price: "₹3,499", period: "/6 months", features: ["Unlimited beard trims", "20% off haircuts & facials", "1 free head massage monthly"], featured: false, buttonLabel: "Join Now", buttonHref: "/book-appointment" },
        ],
      }, style: { cardRadius: "sm", cardShadow: "lg" } },
      { type: "faq", content: { eyebrow: "MEMBER FAQ", title: "How Membership", titleHighlight: "Works", items: [
        { q: "Can I use my membership on bridal packages?", a: "Member discounts apply on all salon and spa services; bridal packages get a flat 10% member discount." },
        { q: "Is the membership transferable?", a: "Luxe membership can be shared with one family member. Glow and Gentleman are personal." },
        { q: "Can I combine member discounts with offers?", a: "The better of the two applies — you always get the best price, never both." },
      ] }, style: { background: "light" } },
      { type: "cta", content: { title: "Join at the counter or online", highlight: "Start Saving Today", phones: ["9000000000"], buttonLabel: "Book Appointment", buttonHref: "/book-appointment" }, style: { background: "primary" } },
    ] },
    { slug: "book-appointment", title: "Book Appointment", isSystem: true, order: 6, sections: [
      { type: "appointmentForm", content: { title: "Book Your Appointment", subtitle: "Choose your service, preferred stylist and time. We'll confirm on WhatsApp within 30 minutes during salon hours." } },
      { type: "openingHours", content: { eyebrow: "SALON HOURS", title: "Open", titleHighlight: "7 Days", note: "Bridal and on-venue appointments available from 4 AM on request.", days: [
        { day: "Monday – Friday", hours: "10:00 AM – 9:00 PM" }, { day: "Saturday – Sunday", hours: "9:00 AM – 9:30 PM" }, { day: "Public Holidays", hours: "10:00 AM – 6:00 PM" },
      ] }, style: { background: "light" } },
      { type: "features", content: { items: [
        { icon: "clock", title: "On-Time Promise", text: "Your stylist is ready when you arrive." },
        { icon: "phone", title: "Easy Rescheduling", text: "Change your slot up to 2 hours before." },
        { icon: "gift", title: "First Visit Treat", text: "Complimentary head massage on your first booking." },
      ] }, style: { align: "center" } },
    ] },
    { slug: "contact", title: "Contact", isSystem: true, order: 7, sections: [
      { type: "contactInfo", content: { eyebrow: "VISIT US", title: "Come Say", titleHighlight: "Hello", address: "Your City", phone: "9000000000", email: "hello@example.com", hours: "Mon–Fri 10 AM – 9 PM · Sat–Sun 9 AM – 9:30 PM", mapEmbed: "" } },
      { type: "map", content: { eyebrow: "", title: "Find", titleHighlight: "the Salon", address: "Your City", mapEmbed: "" } },
      { type: "contactForm", content: { title: "Send a Message", subtitle: "Questions about services, bridal bookings, memberships or gift cards? We'll get back to you the same day." }, style: { background: "light" } },
    ] },
  ],
};
