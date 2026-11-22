import type { TemplateDef, SectionSeed } from "./types";
import type { SectionContentMap } from "../config";

// Packers & Movers (home shifting, office relocation, vehicle transport, storage):
// safety orange + deep indigo + cream, trustworthy and quote-driven.
const cta = (title: string, highlight: string): SectionSeed<"cta"> => ({
  type: "cta", content: { title, highlight, phones: ["9000000000"], buttonLabel: "Get Free Quote", buttonHref: "/get-quote" },
});

export const packersMovers: TemplateDef = {
  theme: {
    colors: { primary: "#f97316", primaryDark: "#ea580c", secondary: "#1e1b4b", accent: "#0ea5e9", dark: "#17153b", light: "#fff7ed", text: "#475569", heading: "#1e1b4b" },
    font: "Poppins", radius: "0.75rem",
  },
  header: (biz) => ({
    design: "modern",
    logoText: biz, logoImage: "",
    announcement: { show: true, text: "Free pre-move survey & 10% off on intercity shifting booked 15 days in advance", link: "/get-quote" },
    topbar: { show: true, address: "Local · Intercity · All-India network", phones: ["9000000000"], email: "hello@example.com", social: { facebook: "#", instagram: "#", whatsapp: "#" } },
    nav: [
      { label: "Home", href: "/" }, { label: "Services", href: "/services" }, { label: "How It Works", href: "/how-it-works" },
      { label: "Pricing", href: "/pricing" }, { label: "About", href: "/about" }, { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Get Free Quote", href: "/get-quote" },
  }),
  footer: (biz) => ({
    design: "modern",
    about: `${biz} provides safe, insured household shifting, office relocation, car & bike transport and storage — with trained packers, GPS-tracked trucks and no hidden charges.`,
    columns: [
      { title: "Services", links: [ { label: "Home Shifting", href: "/services" }, { label: "Office Relocation", href: "/services" }, { label: "Car & Bike Transport", href: "/services" }, { label: "Storage & Warehousing", href: "/services" } ] },
      { title: "Company", links: [ { label: "About Us", href: "/about" }, { label: "How It Works", href: "/how-it-works" }, { label: "Pricing", href: "/pricing" }, { label: "Get a Quote", href: "/get-quote" }, { label: "Contact", href: "/contact" } ] },
    ],
    serviceAreas: ["Local Shifting", "Delhi NCR", "Mumbai & Pune", "Bengaluru", "Hyderabad", "Chennai", "Kolkata", "All-India"],
    contact: { phones: ["9000000000"], email: "hello@example.com", address: "Your City" },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. Moving made easy.`,
  }),
  seo: (biz) => ({
    title: `${biz} — Packers and Movers in Your City | Home, Office & Vehicle Shifting`,
    description: "Trusted packers and movers for local and intercity home shifting, office relocation, car & bike transport and storage. Insured moves, GPS-tracked trucks, local shifting from ₹4,999.",
    favicon: "", ogImage: "",
    keywords: "packers and movers near me, home shifting, house shifting, office relocation, car transport, bike transport, storage services, intercity movers",
    businessType: "MovingCompany", priceRange: "₹₹",
  }),
  services: [
    { category: "Household Shifting", title: "Local Home Shifting", description: "Same-day packing, loading and unpacking within the city." },
    { category: "Household Shifting", title: "Intercity Relocation", description: "Door-to-door moves across India with dedicated or shared trucks." },
    { category: "Household Shifting", title: "Packing & Unpacking", description: "5-layer packing with bubble wrap, foam sheets and corrugated boxes." },
    { category: "Office & Commercial", title: "Office Relocation", description: "Weekend moves with IT equipment handling and zero downtime." },
    { category: "Office & Commercial", title: "Industrial & Machinery Shifting", description: "Crane and hydraulic-trolley handling for heavy equipment." },
    { category: "Vehicle Transport", title: "Car Transport", description: "Enclosed car carriers with doorstep pickup and delivery." },
    { category: "Vehicle Transport", title: "Bike Transport", description: "Wooden-crate or carrier transport for bikes and scooters." },
    { category: "Storage & Insurance", title: "Storage & Warehousing", description: "CCTV-secured, pest-controlled storage for days or months." },
    { category: "Storage & Insurance", title: "Transit Insurance", description: "Comprehensive coverage for goods in transit at nominal premium." },
    { category: "Storage & Insurance", title: "Furniture Dismantling & Assembly", description: "Beds, wardrobes and modular units taken apart and refitted by carpenters." },
  ],
  gallery: [
    "Trained packing crew", "Bubble-wrapped furniture", "Closed container truck", "Car carrier loading", "Office IT packing", "Warehouse storage", "Bike crating", "Unpacking at new home",
  ].map((caption) => ({ category: "Our Moves", caption })),
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "slideshow", customHtml: "",
          badge: "INSURED · GPS-TRACKED · ON-TIME", titleTop: "Shift Your Home,", titleHighlight: "Not Your Peace of Mind",
          subtitle: "", description: `${biz} packs, moves and sets up your home or office with trained crews, quality packing material and closed trucks — local or anywhere in India.`, image: "",
          primaryBtn: { label: "Get Free Quote", href: "/get-quote" }, secondaryBtn: { label: "See Pricing", href: "/pricing" },
          features: [ { icon: "package", title: "5-Layer Packing", text: "" }, { icon: "truck", title: "Closed Trucks", text: "" }, { icon: "shield", title: "Transit Insurance", text: "" }, { icon: "map-pin", title: "Live Tracking", text: "" } ],
          slides: [
            { titleTop: "Shift Your Home,", titleHighlight: "Not Your Peace of Mind", description: `${biz} packs, moves and sets up your home with trained crews, 5-layer packing and closed, GPS-tracked trucks.`, image: "", primaryBtn: { label: "Get Free Quote", href: "/get-quote" }, secondaryBtn: { label: "See Pricing", href: "/pricing" } },
            { titleTop: "Office Moves Over the Weekend,", titleHighlight: "Back to Work on Monday", description: "Labelled IT packing, workstation dismantling and server handling — zero downtime for your team.", image: "", primaryBtn: { label: "Plan an Office Move", href: "/get-quote" }, secondaryBtn: { label: "Our Services", href: "/services" } },
            { titleTop: "Car, Bike & Household —", titleHighlight: "One Booking, One Truck Date", description: "Enclosed car carriers and wooden-crated bikes delivered alongside your goods, anywhere in India.", image: "", primaryBtn: { label: "Get Vehicle Quote", href: "/get-quote" }, secondaryBtn: { label: "How It Works", href: "/how-it-works" } },
          ],
        } },
        { type: "quoteForm", content: { title: "Get a Fixed Quote in 2 Hours", subtitle: "Moving date, pickup & drop city and home size — that's all we need to start.", showSidebar: false }, style: { background: "light" } },
        { type: "features", content: { eyebrow: "WHY US", title: "Moves Done", titleHighlight: "the Careful Way", items: [
          { icon: "user-check", title: "Verified, Trained Crew", text: "Background-checked packers in uniform — full-time staff, no casual labour." },
          { icon: "package", title: "Premium Materials", text: "Bubble wrap, foam, stretch film and 5-ply boxes for every item." },
          { icon: "map-pin", title: "GPS Tracking", text: "Follow your truck live on your phone, city to city." },
          { icon: "tag", title: "Fixed Written Quote", text: "Survey-based quote in writing. What we quote is what you pay." },
        ] } as SectionContentMap["features"], style: { layout: "split" } },
        { type: "serviceCategories", content: { eyebrow: "OUR SERVICES", title: "Moves of", titleHighlight: "Every Size", categories: ["Household Shifting", "Office & Commercial", "Vehicle Transport", "Storage & Insurance"] } },
        { type: "stats", content: { items: [ { value: "18,000+", label: "Moves Completed", icon: "truck" }, { value: "350+", label: "Cities Covered", icon: "map" }, { value: "99.2%", label: "Damage-Free Moves", icon: "shield" }, { value: "4.7★", label: "Customer Rating", icon: "star" } ] }, style: { layout: "cards", background: "light" } },
        { type: "steps", content: { eyebrow: "HOW IT WORKS", title: "Moving in", titleHighlight: "5 Easy Steps", items: [
          { title: "Free Survey", text: "Video or in-person inventory check", icon: "clipboard" },
          { title: "Fixed Quote", text: "Written quote within 2 hours", icon: "tag" },
          { title: "Pack & Load", text: "Item-wise, room-wise labelling", icon: "package" },
          { title: "Safe Transit", text: "GPS-tracked closed truck", icon: "truck" },
          { title: "Unpack & Set Up", text: "Furniture reassembled at new home", icon: "home" },
        ] }, style: { background: "dark" } },
        { type: "priceList", content: { eyebrow: "ESTIMATED COST", title: "Shifting", titleHighlight: "Charges", note: "Indicative prices including packing, loading, transport and unloading. Final quote after free survey. GST & insurance extra.", groups: [
          { category: "Local (within city)", items: [ { name: "1 RK / 1 BHK", price: "₹4,999 – ₹8,999", note: "" }, { name: "2 BHK", price: "₹8,999 – ₹14,999", note: "" }, { name: "3 BHK", price: "₹13,999 – ₹22,999", note: "" } ] },
          { category: "Intercity (up to 1,000 km)", items: [ { name: "1 BHK", price: "₹14,999 – ₹24,999", note: "" }, { name: "2 BHK", price: "₹21,999 – ₹34,999", note: "" }, { name: "3 BHK", price: "₹29,999 – ₹49,999", note: "" } ] },
          { category: "Long Distance (1,000 km +)", items: [ { name: "1 BHK", price: "₹22,999 – ₹34,999", note: "" }, { name: "2 BHK", price: "₹32,999 – ₹49,999", note: "" }, { name: "3 BHK", price: "₹44,999 – ₹69,999", note: "" } ] },
        ] } },
        { type: "imageBanner", content: { title: "Between homes? Store with us.", subtitle: "CCTV-secured, pest-controlled warehouse storage from ₹2,500/month — weekly inventory photos on WhatsApp.", buttonLabel: "Enquire About Storage", buttonHref: "/get-quote", image: "" } },
        { type: "testimonials", content: { eyebrow: "HAPPY MOVES", title: "What Our", titleHighlight: "Customers Say", items: [
          { name: "Abhishek Tiwari", role: "2 BHK · Pune to Bengaluru", text: "Not a single scratch on our sofa or the TV. The truck reached a day early and the team reassembled every bed and wardrobe.", rating: 5 },
          { name: "Revathi Subramanian", role: "Local shift · 3 BHK", text: "Packing started at 8 AM and we were sleeping in our new home the same night. The crew labelled every box room-wise.", rating: 5 },
          { name: "Sandeep Joshi", role: "Admin Head · 120-seat office", text: "Moved our entire office over a weekend. Systems were up on Monday morning — zero downtime.", rating: 5 },
          { name: "Major Vikram Rathore (Retd.)", role: "Transfer move · Jaipur to Kochi", text: "Fourth transfer in ten years and easily the smoothest. Even my old almirah and crockery reached intact.", rating: 5 },
        ] }, style: { layout: "featured" } },
        { type: "logos", content: { title: "Trusted by families, offices and corporate HR teams", items: ["IT Parks", "Banks", "Hospitals", "Defence Families", "Startups", "Schools"] }, style: { background: "light", spacingTop: "sm", spacingBottom: "sm" } },
        { type: "gallery", content: { eyebrow: "ON THE JOB", title: "Moves We've", titleHighlight: "Handled" }, style: { layout: "strip" } },
        { type: "faq", content: { eyebrow: "FAQ", title: "Moving", titleHighlight: "Questions", items: [
          { q: "How is the shifting cost calculated?", a: "It depends on the volume of goods, distance, floor/lift access and services like packing, insurance or vehicle transport. A free survey gives you a fixed, written quote." },
          { q: "Are my household goods insured?", a: "Yes, transit insurance is available at about 3% of the declared value and covers damage or loss during the move." },
          { q: "How long does intercity shifting take?", a: "Usually 2–4 days up to 1,000 km and 5–8 days for longer distances. You can track the truck live." },
          { q: "Do you shift cars and bikes too?", a: "Yes, we transport cars in enclosed carriers and bikes in wooden crates along with your household goods." },
          { q: "Do you give a GST bill for company reimbursement?", a: "Yes. We issue a GST invoice and an IBA-format bill that most employers and PSUs accept for relocation claims." },
          { q: "Do I need to pay an advance?", a: "Only a 10% booking amount. The balance is paid after loading for local moves or on delivery for intercity moves." },
        ] } },
        { ...cta("Planning a move?", "Get Your Free Quote in 2 Hours"), style: { layout: "split" } },
      ],
    },
    { slug: "services", title: "Services", isSystem: true, order: 1, sections: [
      { type: "serviceCategories", content: { eyebrow: "SERVICES", title: "Complete Relocation", titleHighlight: "Solutions", categories: ["Household Shifting", "Office & Commercial", "Vehicle Transport", "Storage & Insurance"] } },
      { type: "imageBanner", content: { title: "Need to store your goods for a while?", subtitle: "CCTV-secured, pest-controlled warehouse storage from ₹2,500/month — short or long term.", buttonLabel: "Enquire About Storage", buttonHref: "/get-quote", image: "" } },
      { type: "features", content: { items: [
        { icon: "package", title: "Fragile Item Care", text: "Custom crates for glass, idols, artwork and electronics." },
        { icon: "hammer", title: "Carpenter on Call", text: "Dismantling and reassembly of beds, wardrobes and modular units." },
        { icon: "zap", title: "AC & Appliance Fitting", text: "Uninstall and reinstall ACs, geysers and washing machines." },
        { icon: "leaf", title: "Pet & Plant Moving", text: "Special arrangements for plants and pet relocation partners." },
      ] }, style: { background: "light" } },
      { type: "faq", content: { eyebrow: "SERVICE FAQ", title: "What We", titleHighlight: "Move", intro: "Special items need special handling — here is how we take care of them.", items: [
        { q: "Do you shift pooja items and idols?", a: "Yes, with extra care — wrapped in cloth and foam, packed in a separate labelled box that travels with the crew supervisor." },
        { q: "Can you move plants and aquariums?", a: "We move potted plants in ventilated cartons for local moves. Aquariums are drained, packed and refilled on request." },
        { q: "Do you handle pianos, gym equipment and safes?", a: "Yes. Heavy items are moved with hydraulic trolleys and extra crew; we quote them separately after the survey." },
      ] } as SectionContentMap["faq"], style: { layout: "split" } },
      cta("Tell us what you're moving", "Get a Custom Quote"),
    ] },
    { slug: "how-it-works", title: "How It Works", isSystem: true, order: 2, sections: [
      { type: "steps", content: { eyebrow: "OUR PROCESS", title: "A Stress-Free", titleHighlight: "Move", items: [
        { title: "Request a Quote", text: "Share your move details online", icon: "edit" },
        { title: "Survey", text: "Video or home visit — free", icon: "clipboard" },
        { title: "Confirm Booking", text: "10% advance, date locked", icon: "calendar" },
        { title: "Pack & Move", text: "Crew, materials and truck arrive", icon: "truck" },
        { title: "Deliver & Settle", text: "Unpack, assemble, done", icon: "home" },
      ] } },
      { type: "imageBanner", content: { title: "A 2 BHK packed, loaded and moved in under 6 hours", subtitle: "Trained crew, multi-layer packing and a GPS-tracked truck — get a fixed quote after a free survey.", buttonLabel: "Get a Free Quote", buttonHref: "/get-quote", image: "" } },
      { type: "faq", content: { eyebrow: "BEFORE MOVING DAY", title: "Helpful", titleHighlight: "Tips", items: [
        { q: "What should I pack myself?", a: "Keep jewellery, cash, important documents and medicines with you. We pack everything else." },
        { q: "Do I need permission from my society?", a: "Many societies require a move-out NOC and lift booking. Inform your society office 2–3 days in advance." },
        { q: "Can you move on weekends or holidays?", a: "Yes, we operate all 7 days. Book weekends at least a week ahead." },
      ] } },
      cta("Ready when you are", "Book Your Free Survey"),
    ] },
    { slug: "pricing", title: "Pricing", isSystem: true, order: 3, sections: [
      { type: "pricingPlans", content: {
        eyebrow: "MOVING PACKAGES", title: "Choose Your", titleHighlight: "Package",
        plans: [
          { name: "Economy", price: "₹4,999", period: "local 1 BHK onwards", features: ["Loading & unloading", "Standard packing", "Shared truck (intercity)", "Basic labelling"], featured: false, buttonLabel: "Get Quote", buttonHref: "/get-quote" },
          { name: "Premium", price: "₹8,999", period: "local 2 BHK onwards", features: ["5-layer packing", "Dedicated closed truck", "Furniture dismantle & assembly", "Unpacking at destination", "GPS tracking"], featured: true, buttonLabel: "Get Quote", buttonHref: "/get-quote" },
          { name: "Elite Relocation", price: "₹19,999", period: "local 3 BHK onwards", features: ["Everything in Premium", "Wooden crating for fragiles", "AC & appliance fitting", "Transit insurance included", "Move manager on call"], featured: false, buttonLabel: "Get Quote", buttonHref: "/get-quote" },
        ],
      }, style: { cardRadius: "lg", cardShadow: "lg" } },
      { type: "priceList", content: { eyebrow: "ADD-ONS", title: "Extra", titleHighlight: "Services", note: "Prices are indicative and vary with distance and volume. GST extra.", groups: [
        { category: "Vehicles", items: [ { name: "Bike transport (intercity)", price: "₹3,500 onwards", note: "" }, { name: "Car transport (intercity)", price: "₹9,999 onwards", note: "enclosed carrier" } ] },
        { category: "Other", items: [ { name: "Storage", price: "₹2,500/month", note: "per 1 BHK volume" }, { name: "AC uninstall + install", price: "₹1,499", note: "per split AC" }, { name: "Transit insurance", price: "3% of value", note: "" } ] },
      ] }, style: { background: "light" } },
      cta("Want an exact price?", "Get a Free Survey"),
    ] },
    { slug: "about", title: "About Us", isSystem: true, order: 4, sections: [
      { type: "about", content: {
        eyebrow: "ABOUT US", title: "Moving Families", titleHighlight: "Since 2012",
        body: [`${biz} started with one truck and a promise: treat every home like our own. Today we run a fleet of closed container trucks and partner branches across India.`, "Our packers are full-time, trained employees — not daily-wage labour — which is why our damage claims stay under 1%."],
        image: "", points: ["IBA-approved transporter", "Own fleet of closed trucks", "Full-time trained packers", "Pan-India branch network"],
        buttonLabel: "Get Free Quote", buttonHref: "/get-quote",
      } },
      { type: "stats", content: { items: [ { value: "12+", label: "Years", icon: "award" }, { value: "60+", label: "Trucks", icon: "truck" }, { value: "200+", label: "Trained Packers", icon: "users" }, { value: "350+", label: "Cities", icon: "map" } ] }, style: { background: "primary" } },
      { type: "team", content: { eyebrow: "LEADERSHIP", title: "The People Who", titleHighlight: "Move You", members: [
        { name: "Harish Choudhary", role: "Founder & Director", image: "", note: "Logistics · 20 yrs" },
        { name: "Sunita Reddy", role: "Operations Head", image: "", note: "Intercity network" },
        { name: "Vinod Kumar", role: "Fleet Manager", image: "", note: "60+ trucks" },
        { name: "Ayesha Siddiqui", role: "Customer Experience", image: "", note: "Move coordination" },
      ] } },
      { type: "visionMission", content: {
        eyebrow: "WHAT WE STAND FOR",
        visionTitle: "Our Vision", visionText: "To make shifting home in India as predictable as booking a train ticket — fixed price, fixed date, no surprises.",
        missionTitle: "Our Mission", missionText: "Full-time trained crews, quality material and honest written quotes on every single move, big or small.",
        valuesTitle: "Our Promises",
        values: [
          { icon: "tag", title: "Fixed Pricing", text: "The written quote is the final bill." },
          { icon: "clock", title: "On-Time Delivery", text: "Delivery dates committed in writing." },
          { icon: "shield", title: "Care for Every Box", text: "Under 1% damage claims, settled within 7 days." },
        ],
      }, style: { background: "light" } },
      cta("Let's plan your move", "Talk to a Move Expert"),
    ] },
    { slug: "get-quote", title: "Get a Quote", isSystem: true, order: 5, sections: [
      { type: "quoteForm", content: { title: "Get a Free Moving Quote", subtitle: "Tell us your moving date, pickup and drop locations and home size — we'll send a fixed quote within 2 hours.", showSidebar: true } },
      { type: "features", content: { items: [
        { icon: "clock", title: "Quote in 2 Hours", text: "Fast, written estimate." },
        { icon: "tag", title: "No Hidden Charges", text: "Packing, labour and transport included." },
        { icon: "shield", title: "Insured Moves", text: "Peace of mind, door to door." },
      ] }, style: { background: "light" } },
      { type: "testimonials", content: { eyebrow: "REVIEWS", title: "Moves Done", titleHighlight: "Right", items: [
        { name: "Neeraj Saxena", role: "Car + 2 BHK · Delhi to Hyderabad", text: "Car and household goods arrived the same day. The quote they gave on day one was exactly what I paid.", rating: 5 },
        { name: "Pallavi Deshmukh", role: "Local shift · 1 BHK", text: "Booked in the morning, moved by evening. Super polite crew.", rating: 5 },
      ] } },
    ] },
    { slug: "contact", title: "Contact", isSystem: true, order: 6, sections: [
      { type: "contactInfo", content: { eyebrow: "CONTACT", title: "Talk to Our", titleHighlight: "Move Desk", address: "Your City", phone: "9000000000", email: "hello@example.com", hours: "Open 7 days · 8 AM – 9 PM", mapEmbed: "" } },
      { type: "map", content: { eyebrow: "HEAD OFFICE", title: "Find", titleHighlight: "Us", address: "Your City", mapEmbed: "" } },
      { type: "contactForm", content: { title: "Send Us a Message", subtitle: "Questions about storage, vehicle transport or corporate moves? We reply within an hour." } },
    ] },
  ],
};
