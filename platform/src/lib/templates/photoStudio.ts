import type { TemplateDef } from "./types";

// Photography Studio: bold monochrome editorial (near-black + one electric orange
// accent), sharp corners, portfolio-led — weddings, maternity, product, headshots, rentals.
export const photoStudio: TemplateDef = {
  theme: {
    colors: { primary: "#18181b", primaryDark: "#09090b", secondary: "#3f3f46", accent: "#f97316", dark: "#0a0a0a", light: "#f4f4f5", text: "#3f3f46", heading: "#09090b" },
    font: "Montserrat", radius: "0rem",
  },
  header: (biz) => ({
    design: "minimal",
    logoText: biz, logoImage: "",
    announcement: { show: true, text: "Festive offer · 20% off pre-wedding shoots booked this month", link: "/packages" },
    topbar: { show: false, address: "Your City", phones: ["9000000000"], email: "hello@example.com", social: { facebook: "#", instagram: "#", whatsapp: "#" } },
    nav: [
      { label: "Work", href: "/portfolio" }, { label: "Services", href: "/services" }, { label: "Packages", href: "/packages" }, { label: "Studio Rental", href: "/studio-rental" }, { label: "About", href: "/about" }, { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Book a Shoot", href: "/book" },
  }),
  footer: (biz) => ({
    design: "minimal",
    about: `${biz} is an independent photography studio for weddings, portraits, brands and products — honest light, strong frames, fast delivery.`,
    columns: [
      { title: "Studio", links: [ { label: "Portfolio", href: "/portfolio" }, { label: "Services", href: "/services" }, { label: "Packages", href: "/packages" }, { label: "Studio Rental", href: "/studio-rental" } ] },
      { title: "Info", links: [ { label: "About", href: "/about" }, { label: "Book a Shoot", href: "/book" }, { label: "Contact", href: "/contact" } ] },
    ],
    serviceAreas: ["Weddings", "Pre-Wedding", "Maternity & Newborn", "Product & E-commerce", "Corporate Headshots", "Studio Rental"],
    contact: { phones: ["9000000000"], email: "hello@example.com", address: "Your City" },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. All images © their respective clients.`,
  }),
  seo: (biz) => ({
    title: `${biz} — Photography Studio for Weddings, Portraits & Products`,
    description: "Wedding and pre-wedding photography, maternity & newborn shoots, product and e-commerce photography, corporate headshots and a fully equipped studio for rent.",
    keywords: "photography studio, wedding photographer, pre-wedding shoot, newborn photography, product photography, e-commerce photoshoot, headshots, studio rental",
    businessType: "ProfessionalService", priceRange: "₹₹",
    favicon: "", ogImage: "",
  }),
  services: [
    { category: "Weddings & Couples", title: "Wedding Photography", description: "Candid + traditional coverage, two photographers, 600+ edited images." },
    { category: "Weddings & Couples", title: "Wedding Cinematography", description: "4K highlight film, teaser reel and full-length documentary edit." },
    { category: "Weddings & Couples", title: "Pre-Wedding Shoot", description: "Concept, location scouting and styling for a 1-day couple shoot." },
    { category: "Portraits & Family", title: "Maternity Shoot", description: "Studio or outdoor, gowns provided, 30 retouched images." },
    { category: "Portraits & Family", title: "Newborn & Baby", description: "Safe, sanitised newborn posing with props, within the first 15 days." },
    { category: "Portraits & Family", title: "Family & Birthday Portraits", description: "Relaxed studio sessions for families, kids and milestone birthdays." },
    { category: "Commercial & Brands", title: "Product & E-commerce", description: "White-background Amazon/Flipkart-ready packshots from ₹149 per image." },
    { category: "Commercial & Brands", title: "Lifestyle & Catalogue", description: "Model shoots and styled catalogues for fashion, jewellery and D2C brands." },
    { category: "Commercial & Brands", title: "Corporate Headshots", description: "On-site or in-studio headshots for teams, LinkedIn and annual reports." },
    { category: "Commercial & Brands", title: "Food & Restaurant", description: "Menu, social and delivery-app photography with a food stylist." },
  ],
  gallery: [
    ...["Candid varmala moment", "Bride portrait in window light", "Couple silhouette at dusk"].map((c) => ({ category: "Weddings", caption: c })),
    ...["Monochrome maternity portrait", "Newborn in a wicker basket", "Family studio portrait"].map((c) => ({ category: "Portraits", caption: c })),
    ...["Perfume bottle on black acrylic", "Jewellery macro detail", "Sneaker e-commerce packshot"].map((c) => ({ category: "Products", caption: c })),
    ...["Founder headshot", "Team portrait on grey seamless"].map((c) => ({ category: "Corporate", caption: c })),
  ],
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "marquee", customHtml: "",
          badge: "WEDDINGS · PORTRAITS · PRODUCTS · HEADSHOTS", titleTop: "We Don't Take Pictures.", titleHighlight: "We Make Frames.",
          subtitle: "", description: `${biz} is a photography studio for people and brands who want images with intent — sharp, honest and unmistakably yours.`, image: "",
          primaryBtn: { label: "Book a Shoot", href: "/book" }, secondaryBtn: { label: "View Portfolio", href: "/portfolio" },
          features: [ { icon: "instagram", title: "1,200+ Shoots", text: "" }, { icon: "clock", title: "7-Day Delivery", text: "" }, { icon: "home", title: "2,000 sq ft Studio", text: "" }, { icon: "award", title: "Award-winning", text: "" } ],
        } },
        { type: "gallery", style: { layout: "masonry", spacingTop: "sm" }, content: { eyebrow: "SELECTED WORK", title: "Recent", titleHighlight: "Frames" } },
        { type: "stats", style: { layout: "minimal" }, content: { items: [ { value: "1,200+", label: "Shoots Delivered", icon: "instagram" }, { value: "350+", label: "Weddings", icon: "heart" }, { value: "80+", label: "Brand Clients", icon: "store" }, { value: "7 days", label: "Avg. Delivery", icon: "clock" } ] } },
        { type: "serviceCategories", style: { layout: "list" }, content: { eyebrow: "WHAT WE SHOOT", title: "Three Studios.", titleHighlight: "One Eye.", categories: ["Weddings & Couples", "Portraits & Family", "Commercial & Brands"] } },
        { type: "about", style: { layout: "reverse", background: "dark" }, content: { eyebrow: "THE STUDIO", title: "Documentary Instinct,", titleHighlight: "Editorial Finish", body: [`${biz} was started by two photojournalists who wanted to bring documentary honesty to weddings and brand work.`, "We direct when it helps and disappear when it matters — then colour-grade every frame in-house so your gallery looks like one story, not 600 random photos."], image: "", points: ["Founded 2016 · team of 14", "In-house retouching & colour", "Online gallery in 7 days", "Travel anywhere in India"], buttonLabel: "About Us", buttonHref: "/about" } },
        { type: "testimonials", style: { layout: "minimal" }, content: { eyebrow: "CLIENTS", title: "In Their", titleHighlight: "Words", items: [
          { name: "Ishita & Dev", role: "Wedding · Your City", text: "We cried looking at our album. They caught moments we didn't even know happened.", rating: 5 },
          { name: "Rakesh Jain", role: "Founder, Kesar Jewels", text: "Our product images doubled click-through on marketplaces. Fast, consistent, zero fuss.", rating: 5 },
          { name: "Priya Menon", role: "Maternity & Newborn", text: "Patient, gentle and so careful with our 9-day-old. The photos are pure art.", rating: 5 },
        ] } },
        { type: "logos", style: { background: "light" }, content: { title: "Brands that trust our lens", items: ["UrbanThread", "Kesar Jewels", "BrewHouse", "FitFuel", "Nayaa Home", "CloudKart"] } },
        { type: "steps", style: { layout: "cards" }, content: { eyebrow: "THE PROCESS", title: "Brief. Shoot.", titleHighlight: "Deliver.", items: [
          { title: "Brief Call", text: "Mood, references, shot list and budget in 20 minutes", icon: "phone" },
          { title: "Pre-production", text: "Location, styling, props and crew locked in", icon: "clipboard" },
          { title: "Shoot Day", text: "Directed, relaxed and on schedule", icon: "instagram" },
          { title: "Edit & Deliver", text: "Colour-graded online gallery in 7 days", icon: "check" },
        ] } },
        { type: "pricingPlans", style: { background: "dark", cardRadius: "none" }, content: { eyebrow: "WEDDING COLLECTIONS", title: "Starting", titleHighlight: "Packages", plans: [
          { name: "Essential", price: "₹65,000", period: "1 day", features: ["1 candid + 1 traditional photographer", "400+ edited images", "Online gallery", "30-page album"], featured: false, buttonLabel: "Book", buttonHref: "/book" },
          { name: "Signature", price: "₹1,45,000", period: "2 days", features: ["2 candid photographers", "Cinematographer + drone", "3-min highlight film", "800+ edited images", "40-page premium album"], featured: true, buttonLabel: "Book", buttonHref: "/book" },
          { name: "Editorial", price: "₹2,75,000", period: "3 days", features: ["Full team of 6", "Pre-wedding shoot included", "Documentary + highlight film", "Same-day edit reel", "Two luxury albums"], featured: false, buttonLabel: "Book", buttonHref: "/book" },
        ] } },
        { type: "team", style: { cardRadius: "none" }, content: { eyebrow: "THE CREW", title: "Behind the", titleHighlight: "Camera", members: [
          { name: "Arnav Sethi", role: "Founder & Lead Photographer", image: "", note: "Weddings & portraits" },
          { name: "Zoya Qureshi", role: "Co-founder & Creative Director", image: "", note: "Brands & editorial" },
          { name: "Harsh Patel", role: "Lead Cinematographer", image: "", note: "Wedding films" },
          { name: "Neelam Das", role: "Head Retoucher", image: "", note: "Colour & post" },
        ] } },
        { type: "imageBanner", content: { title: "Need a space, not a photographer?", subtitle: "Rent our 2,000 sq ft daylight studio with cyc wall, strobes and makeup room — from ₹1,800 an hour.", buttonLabel: "Studio Rental", buttonHref: "/studio-rental", image: "" } },
        { type: "faq", style: { layout: "split", background: "light" }, content: { ...{ intro: "Dates, delivery timelines and travel — the essentials before your shoot." }, eyebrow: "FAQ", title: "Before You", titleHighlight: "Book", items: [
          { q: "How do I lock my date?", a: "A 30% advance confirms your date. The balance is due on the shoot day for portraits, or before delivery for weddings." },
          { q: "How soon do we get our photos?", a: "Previews in 48 hours, the full edited gallery in 7 days for portraits and 3–4 weeks for weddings. Albums follow after your selection." },
          { q: "Do you travel for destination weddings?", a: "Yes — anywhere in India and abroad. Travel and stay for the crew are charged at actuals." },
          { q: "Can you shoot products for Amazon and Flipkart listings?", a: "Yes. We deliver marketplace-compliant white-background packshots plus lifestyle images, from ₹149 per image (minimum 25)." },
        ] } },
        { type: "cta", style: { layout: "minimal" }, content: { title: "Have a shoot in mind?", highlight: "Let's Talk Frames", phones: ["9000000000"], buttonLabel: "Book a Shoot", buttonHref: "/book" } },
      ],
    },
    { slug: "portfolio", title: "Portfolio", isSystem: true, order: 1, sections: [
      { type: "banner", content: { title: "The", titleHighlight: "Work", subtitle: "Weddings, portraits, products and people — a selection from 1,200+ shoots.", image: "", bgColor: "#0a0a0a", imageOpacity: 40, overlayOpacity: 70 } },
      { type: "gallery", content: { eyebrow: "PORTFOLIO", title: "Selected", titleHighlight: "Frames" } },
      { type: "imageBanner", content: { title: "We shoot films, too", subtitle: "Cinematic wedding highlights and event films, shot alongside your photos by the same team.", buttonLabel: "See Packages", buttonHref: "/packages", image: "" } },
      { type: "cta", content: { title: "Like what you see?", highlight: "Book Your Date", phones: ["9000000000"], buttonLabel: "Book a Shoot", buttonHref: "/book" } },
    ] },
    { slug: "services", title: "Services", isSystem: true, order: 2, sections: [
      { type: "serviceCategories", content: { eyebrow: "SERVICES", title: "What We", titleHighlight: "Shoot", categories: ["Weddings & Couples", "Portraits & Family", "Commercial & Brands"] } },
      { type: "features", style: { background: "dark", cardRadius: "none" }, content: { items: [
        { icon: "instagram", title: "Full-frame Kit", text: "Full-frame mirrorless bodies, fast prime lenses and a licensed drone." },
        { icon: "zap", title: "Pro Lighting", text: "Studio strobes, softboxes and continuous LED panels." },
        { icon: "edit", title: "In-house Retouching", text: "Skin, colour and background work by our own editors." },
        { icon: "clock", title: "Fast Turnaround", text: "Previews in 48 hours, full galleries in 7 days." },
      ] } },
      { type: "gallery", content: { eyebrow: "", title: "Behind the", titleHighlight: "Lens" } },
      { type: "testimonials", style: { layout: "featured", background: "light" }, content: { eyebrow: "CLIENTS", title: "Shoots That", titleHighlight: "Delivered", items: [
        { name: "Tanya Bhalla", role: "Founder, D2C skincare", text: "Sixty SKUs shot, retouched and delivered in five days — and they suggested lifestyle angles we hadn't thought of.", rating: 5 },
        { name: "Mohan & Lata Iyer", role: "Family portrait", text: "Three generations in one frame without a single forced smile.", rating: 5 },
        { name: "Aakash Verma", role: "HR, IT services", text: "120 headshots in one day on-site, consistent and on brand.", rating: 5 },
      ] } },
      { type: "cta", content: { title: "Brand or personal shoot?", highlight: "Get a Quote", phones: ["9000000000"], buttonLabel: "Book a Shoot", buttonHref: "/book" } },
    ] },
    { slug: "packages", title: "Packages", isSystem: true, order: 3, sections: [
      { type: "pricingPlans", style: { cardRadius: "none" }, content: { eyebrow: "WEDDING PACKAGES", title: "Wedding", titleHighlight: "Collections", plans: [
        { name: "Essential", price: "₹65,000", period: "1 day", features: ["1 candid + 1 traditional photographer", "400+ edited images", "Online gallery", "30-page album"], featured: false, buttonLabel: "Book", buttonHref: "/book" },
        { name: "Signature", price: "₹1,45,000", period: "2 days", features: ["2 candid photographers", "Cinematographer + drone", "3-min highlight film", "800+ edited images", "40-page premium album"], featured: true, buttonLabel: "Book", buttonHref: "/book" },
        { name: "Editorial", price: "₹2,75,000", period: "3 days", features: ["Full team of 6", "Pre-wedding shoot included", "Documentary + highlight film", "Same-day edit reel", "Two luxury albums"], featured: false, buttonLabel: "Book", buttonHref: "/book" },
      ] } },
      { type: "priceList", style: { background: "light" }, content: { eyebrow: "OTHER SHOOTS", title: "Session", titleHighlight: "Rates", note: "Prices exclusive of GST. Travel outside Your City charged at actuals.", groups: [
        { category: "Portraits", items: [ { name: "Pre-wedding shoot", price: "₹35,000", note: "1 day, 2 locations, 40 edits" }, { name: "Maternity shoot", price: "₹12,000", note: "2 hours, gowns included" }, { name: "Newborn session", price: "₹15,000", note: "3 hours, props included" }, { name: "Family portrait", price: "₹6,500", note: "1 hour, 15 edits" } ] },
        { category: "Commercial", items: [ { name: "E-commerce packshot", price: "₹149", note: "Per image, min. 25" }, { name: "Lifestyle / model shoot", price: "₹28,000", note: "Half day, model extra" }, { name: "Corporate headshot", price: "₹1,500", note: "Per person, min. 10" }, { name: "Food & menu shoot", price: "₹18,000", note: "Up to 20 dishes" } ] },
      ] } },
      { type: "faq", content: { eyebrow: "", title: "Booking", titleHighlight: "FAQs", items: [
        { q: "How do I lock my date?", a: "A 30% advance confirms your date. The balance is due on the shoot day for portraits, or before delivery for weddings." },
        { q: "Do we get the raw files?", a: "Raw files are available on request for wedding collections. We deliver all edited images in high resolution." },
        { q: "Do you travel for destination weddings?", a: "Yes — anywhere in India and abroad. Travel and stay for the crew are charged at actuals." },
      ] } },
      { type: "cta", content: { title: "Want a custom package?", highlight: "Ask Us", phones: ["9000000000"], buttonLabel: "Book a Shoot", buttonHref: "/book" } },
    ] },
    { slug: "studio-rental", title: "Studio Rental", isSystem: true, order: 4, sections: [
      { type: "about", content: { eyebrow: "RENT THE SPACE", title: "2,000 sq ft of", titleHighlight: "Daylight", body: ["Our ground-floor studio has north-facing windows, a 20 ft white cyclorama wall and blackout curtains for full control.", "Perfect for fashion, product, podcast and video shoots. Book by the hour with or without our lighting kit."], image: "", points: ["20 ft white cyc wall", "Coloured paper backdrops", "Makeup & changing room", "Wi-Fi, AC & power backup", "Parking for 6 cars", "Freight lift access"] , buttonLabel: "Check Availability", buttonHref: "/book" } },
      { type: "priceList", style: { background: "light" }, content: { eyebrow: "RATES", title: "Rental", titleHighlight: "Rates", note: "Minimum booking 2 hours. Assistants available at ₹1,500 per shift.", groups: [
        { category: "Space", items: [ { name: "Hourly", price: "₹1,800", note: "Per hour" }, { name: "Half day", price: "₹6,500", note: "4 hours" }, { name: "Full day", price: "₹11,000", note: "9 hours" } ] },
        { category: "Equipment", items: [ { name: "Strobe kit (3 heads)", price: "₹2,500", note: "Per day" }, { name: "LED video panels", price: "₹2,000", note: "Per day" }, { name: "Tethering station", price: "₹800", note: "Per day" } ] },
      ] } },
      { type: "openingHours", content: { eyebrow: "", title: "Studio", titleHighlight: "Hours", note: "Early-morning and overnight slots on request.", days: [
        { day: "Monday – Friday", hours: "8:00 AM – 9:00 PM" }, { day: "Saturday", hours: "8:00 AM – 10:00 PM" }, { day: "Sunday", hours: "9:00 AM – 6:00 PM" },
      ] } },
      { type: "cta", style: { background: "dark" }, content: { title: "Ready to shoot?", highlight: "Book the Studio", phones: ["9000000000"], buttonLabel: "Book Now", buttonHref: "/book" } },
    ] },
    { slug: "about", title: "About", isSystem: true, order: 5, sections: [
      { type: "about", content: { eyebrow: "ABOUT", title: "Light, Patience,", titleHighlight: "Instinct", body: [`${biz} was started by two photojournalists who wanted to bring documentary honesty to weddings and brand work.`, "Today we are a team of photographers, cinematographers and retouchers — still obsessed with the one frame that tells the whole story."], image: "", points: ["Founded 2016", "Team of 14", "Wedding & commercial specialists", "Featured in leading wedding blogs"], buttonLabel: "See the Work", buttonHref: "/portfolio" } },
      { type: "team", style: { background: "light", cardRadius: "none" }, content: { eyebrow: "THE CREW", title: "Behind the", titleHighlight: "Camera", members: [
        { name: "Arnav Sethi", role: "Founder & Lead Photographer", image: "", note: "Weddings & portraits" },
        { name: "Zoya Qureshi", role: "Co-founder & Creative Director", image: "", note: "Brands & editorial" },
        { name: "Harsh Patel", role: "Lead Cinematographer", image: "", note: "Wedding films" },
        { name: "Neelam Das", role: "Head Retoucher", image: "", note: "Colour & post" },
      ] } },
      { type: "logos", content: { title: "As featured in", items: ["WedMag", "Studio Monthly", "Brand Lens", "Frame Awards", "Bride Diaries"] } },
      { type: "cta", content: { title: "Let's make something", highlight: "Worth Framing", phones: ["9000000000"], buttonLabel: "Book a Shoot", buttonHref: "/book" } },
    ] },
    { slug: "book", title: "Book a Shoot", isSystem: true, order: 6, showInNav: false, sections: [
      { type: "appointmentForm", content: { title: "Book a Shoot", subtitle: "Pick the shoot type and your preferred date. We'll confirm availability and send a brief form within a few hours." } },
      { type: "steps", style: { background: "light" }, content: { eyebrow: "", title: "What Happens", titleHighlight: "Next", items: [
        { title: "We Call You", text: "A quick brief to understand the shoot", icon: "phone" },
        { title: "Quote & Advance", text: "Clear quote; 30% advance locks the date", icon: "tag" },
        { title: "Shoot & Deliver", text: "Shoot day, then your gallery in 7 days", icon: "check" },
      ] } },
      { type: "faq", content: { eyebrow: "", title: "Quick", titleHighlight: "Answers", items: [
        { q: "How far ahead should I book?", a: "Weddings: 3–6 months. Portraits and product shoots: usually within a week." },
        { q: "Can I reschedule?", a: "Yes, once at no cost with 72 hours' notice, subject to availability." },
      ] } },
    ] },
    { slug: "contact", title: "Contact", isSystem: true, order: 7, sections: [
      { type: "contactInfo", content: { eyebrow: "STUDIO", title: "Drop", titleHighlight: "By", address: "Your City", phone: "9000000000", email: "hello@example.com", hours: "Mon–Sat: 10am – 8pm · Shoots by appointment", mapEmbed: "" } },
      { type: "map", style: { spacingTop: "none" }, content: { eyebrow: "", title: "Studio", titleHighlight: "Location", address: "Your City", mapEmbed: "" } },
      { type: "contactForm", style: { background: "light" }, content: { title: "Write to Us", subtitle: "Brand collaborations, wedding enquiries or studio bookings — we reply the same day." } },
    ] },
  ],
};
