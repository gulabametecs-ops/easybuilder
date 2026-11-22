import type { TemplateDef, SectionSeed } from "./types";
import type { SectionContentMap } from "../config";

// Interior Design Studio (modular kitchens, wardrobes, full-home & office interiors):
// warm ochre + espresso + ivory, editorial and calm, consultation-led.
const cta = (title: string, highlight: string): SectionSeed<"cta"> => ({
  type: "cta", content: { title, highlight, phones: ["9000000000"], buttonLabel: "Book Free Consultation", buttonHref: "/consultation" },
});

export const interiorDesign: TemplateDef = {
  theme: {
    colors: { primary: "#a16207", primaryDark: "#854d0e", secondary: "#3b2f2a", accent: "#c2a878", dark: "#1f1a17", light: "#faf6ef", text: "#57534e", heading: "#292524" },
    font: "Jost", radius: "0.25rem",
  },
  header: (biz) => ({
    design: "centered",
    logoText: biz, logoImage: "",
    announcement: { show: true, text: "Festive offer · Free 3D design + 10% off on modular kitchens booked this month", link: "/consultation" },
    topbar: { show: false, address: "Your City", phones: ["9000000000"], email: "hello@example.com", social: { facebook: "#", instagram: "#", whatsapp: "#" } },
    nav: [
      { label: "Home", href: "/" }, { label: "Studio", href: "/about" }, { label: "Services", href: "/services" }, { label: "Portfolio", href: "/portfolio" },
      { label: "Packages", href: "/packages" }, { label: "Process", href: "/process" }, { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Free Consultation", href: "/consultation" },
  }),
  footer: (biz) => ({
    design: "minimal",
    about: `${biz} designs and delivers thoughtful, functional interiors — modular kitchens, wardrobes and complete homes, crafted in our own factory and installed by our own team.`,
    columns: [
      { title: "Studio", links: [ { label: "About Us", href: "/about" }, { label: "Our Process", href: "/process" }, { label: "Portfolio", href: "/portfolio" }, { label: "Contact", href: "/contact" } ] },
      { title: "Design", links: [ { label: "Modular Kitchens", href: "/services" }, { label: "Wardrobes", href: "/services" }, { label: "Full-Home Packages", href: "/packages" }, { label: "Free Consultation", href: "/consultation" } ] },
    ],
    serviceAreas: ["Modular Kitchens", "Wardrobes", "Living Rooms", "Bedrooms", "Office Interiors", "Turnkey Projects"],
    contact: { phones: ["9000000000"], email: "hello@example.com", address: "Your City" },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. Designed with care.`,
  }),
  seo: (biz) => ({
    title: `${biz} — Interior Designers, Modular Kitchens & Wardrobes in Your City`,
    description: "Full-home interiors, modular kitchens, wardrobes and office fit-outs with free 3D design, factory-finished quality, 45-day delivery and up to 10-year warranty. Packages from ₹3.9 lakh.",
    favicon: "", ogImage: "",
    keywords: "interior designer near me, modular kitchen, wardrobe design, 2bhk interior cost, 3bhk interior package, office interior, turnkey interiors",
    businessType: "HomeAndConstructionBusiness", priceRange: "₹₹₹",
  }),
  services: [
    { category: "Modular Kitchens", title: "L-Shaped & U-Shaped Kitchens", description: "Space-smart layouts with soft-close hardware, tall units and corner solutions." },
    { category: "Modular Kitchens", title: "Island & Parallel Kitchens", description: "Open-plan kitchens with breakfast counters, quartz tops and handle-less shutters." },
    { category: "Modular Kitchens", title: "Kitchen Renovation", description: "Replace old carcasses, shutters and countertops in as little as 15 days." },
    { category: "Wardrobes & Storage", title: "Sliding & Hinged Wardrobes", description: "Lacquered glass, laminate or PU finishes with internal drawers and lofts." },
    { category: "Wardrobes & Storage", title: "Walk-in Wardrobes", description: "Open-shelf dressing rooms with profile lighting and accessory organisers." },
    { category: "Wardrobes & Storage", title: "TV Units & Crockery Units", description: "Custom storage walls that hide wires and show off what matters." },
    { category: "Full-Home Interiors", title: "2 & 3 BHK Home Interiors", description: "Kitchen, wardrobes, living, bedrooms, false ceiling and lighting — one team, one timeline." },
    { category: "Full-Home Interiors", title: "Villa & Luxury Homes", description: "Bespoke furniture, wall panelling, marble and curated décor for large homes." },
    { category: "Full-Home Interiors", title: "3D Design & Visualisation", description: "Photo-realistic renders and walkthroughs before a single panel is cut." },
    { category: "Commercial & Turnkey", title: "Office Interiors", description: "Workstations, cabins, conference rooms and breakout zones that reflect your brand." },
    { category: "Commercial & Turnkey", title: "Retail & Clinic Fit-outs", description: "Showrooms, cafés and clinics designed for flow, hygiene and footfall." },
    { category: "Commercial & Turnkey", title: "Turnkey Execution", description: "Civil, electrical, plumbing, painting and furniture handled end to end." },
  ],
  gallery: [
    "Warm-oak modular kitchen", "Living room with fluted panelling", "Master bedroom wardrobe", "Walk-in dressing room", "Kids' bedroom", "Pooja unit in teak veneer", "Corporate office cabin", "Villa dining space",
  ].map((caption) => ({ category: "Portfolio", caption })),
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "minimal", customHtml: "",
          badge: "INTERIORS · KITCHENS · WARDROBES", titleTop: "Homes Designed Around", titleHighlight: "the Way You Live",
          subtitle: "", description: `${biz} turns empty apartments into warm, personal homes. Free 3D design, factory-finished furniture and a single project manager from first sketch to final handover.`, image: "",
          primaryBtn: { label: "Book Free Consultation", href: "/consultation" }, secondaryBtn: { label: "View Portfolio", href: "/portfolio" },
          features: [ { icon: "edit", title: "Free 3D Design", text: "" }, { icon: "clock", title: "45-Day Delivery", text: "" }, { icon: "shield", title: "10-Year Warranty", text: "" } ],
        } },
        { type: "logos", content: { title: "Materials & hardware we trust", items: ["BWP Marine Ply", "Soft-Close Hinges", "Quartz Countertops", "Acrylic Finishes", "PU Lacquer", "Italian Laminates", "Teak Veneer"] }, style: { spacingTop: "sm", spacingBottom: "sm" } },
        { type: "about", content: {
          eyebrow: "THE STUDIO", title: "Quiet Luxury,", titleHighlight: "Built to Last",
          body: [`${biz} is a team of architects, interior designers and craftsmen who believe a home should feel calm, look timeless and work hard every day — for the morning tiffin rush as much as for Diwali guests.`, "We manufacture in our own facility, so every shutter, edge-band and hinge passes a 40-point quality check before it reaches your home."],
          image: "", points: ["In-house design & manufacturing", "Itemised quotations", "One project manager", "Vastu-aware layouts", "Post-handover service"],
          buttonLabel: "Meet the Studio", buttonHref: "/about",
        }, style: { layout: "centered" } },
        { type: "gallery", content: { eyebrow: "PORTFOLIO", title: "Recent", titleHighlight: "Spaces" }, style: { layout: "masonry" } },
        { type: "serviceCategories", content: { eyebrow: "WHAT WE DESIGN", title: "Every Room,", titleHighlight: "One Studio", categories: ["Modular Kitchens", "Wardrobes & Storage", "Full-Home Interiors", "Commercial & Turnkey"] }, style: { layout: "list", background: "light" } },
        { type: "visionMission", content: {
          eyebrow: "OUR DESIGN PHILOSOPHY",
          visionTitle: "Design for Real Life", visionText: "Homes that look editorial but are built for Indian kitchens, joint families, monsoon humidity and the way you actually use every corner.",
          missionTitle: "Honest Craft", missionText: "Factory precision, itemised pricing and our own installation crews — so what you approved in 3D is exactly what you live in.",
          valuesTitle: "What Guides Every Project",
          values: [
            { icon: "leaf", title: "Natural Materials", text: "Wood, cane, stone and linen over loud, trendy finishes." },
            { icon: "grid", title: "Storage First", text: "Every wall is a chance to hide clutter beautifully." },
            { icon: "heart", title: "Personal Touches", text: "Pooja units, heirloom displays and family-photo walls." },
            { icon: "shield", title: "Built to Last", text: "BWP ply, branded hardware and a 10-year warranty." },
          ],
        } },
        { type: "imageBanner", content: { title: "See your home before it's built", subtitle: "Photo-realistic 3D renders of every room — change finishes, colours and layouts until it feels just right.", buttonLabel: "Get My Free 3D Design", buttonHref: "/consultation", image: "" } },
        { type: "steps", content: { eyebrow: "HOW WE WORK", title: "From Idea to", titleHighlight: "Handover", items: [
          { title: "Meet & Measure", text: "Site visit, laser measurement and a lifestyle brief", icon: "map-pin" },
          { title: "Design in 3D", text: "Layouts, material board and up to 3 revisions", icon: "edit" },
          { title: "Craft in Factory", text: "Precision-cut panels with 40-point QC", icon: "factory" },
          { title: "Install & Style", text: "Clean installation, styling and handover", icon: "home" },
        ] }, style: { layout: "cards", background: "dark" } },
        { type: "stats", content: { items: [ { value: "1,200+", label: "Homes Delivered", icon: "home" }, { value: "45 days", label: "Average Delivery", icon: "clock" }, { value: "10 yrs", label: "Warranty", icon: "shield" }, { value: "4.8★", label: "Google Rating", icon: "star" } ] }, style: { layout: "minimal" } },
        { type: "testimonials", content: { eyebrow: "CLIENT STORIES", title: "Homes That", titleHighlight: "Feel Like Ours", items: [
          { name: "Shruti & Nikhil Agarwal", role: "3 BHK · Apartment", text: "They listened more than they talked. The kitchen works exactly the way I cook, and the whole home was ready a week before our griha pravesh.", rating: 5 },
          { name: "Dr. Ramesh Iyer", role: "Clinic fit-out", text: "Clean, hygienic and beautiful. Patients compliment the waiting area every single day. The project manager kept us updated on WhatsApp throughout.", rating: 5 },
          { name: "Farah Khan", role: "2 BHK · First home", text: "The quotation was itemised to the last handle — no surprises at the end. Five years later the shutters still look new.", rating: 5 },
        ] }, style: { layout: "minimal", background: "light" } },
        { type: "pricingPlans", content: {
          eyebrow: "PACKAGES", title: "Honest", titleHighlight: "Starting Prices",
          plans: [
            { name: "Essential 2 BHK", price: "₹3.9 L", period: "onwards", features: ["Modular kitchen", "2 wardrobes", "TV unit", "Free 3D design", "5-year warranty"], featured: false, buttonLabel: "Get Estimate", buttonHref: "/consultation" },
            { name: "Signature 3 BHK", price: "₹7.5 L", period: "onwards", features: ["Premium modular kitchen", "3 wardrobes + loft", "Living & dining storage", "False ceiling & lighting", "Pooja unit", "10-year warranty"], featured: true, buttonLabel: "Get Estimate", buttonHref: "/consultation" },
            { name: "Luxe Villa", price: "₹18 L", period: "onwards", features: ["Bespoke furniture & panelling", "Walk-in wardrobes", "Marble & veneer finishes", "Décor & soft furnishing", "Turnkey civil & electrical"], featured: false, buttonLabel: "Get Estimate", buttonHref: "/consultation" },
          ],
        }, style: { cardRadius: "sm", cardShadow: "sm" } },
        { type: "team", content: { eyebrow: "YOUR DESIGN TEAM", title: "The People Who", titleHighlight: "Draw Your Home", members: [
          { name: "Ar. Meera Kulkarni", role: "Founder & Principal Designer", image: "", note: "M.Arch · 14 years · 400+ homes" },
          { name: "Siddharth Rao", role: "Head of Design", image: "", note: "Kitchens & compact apartments" },
          { name: "Imran Sheikh", role: "Projects & Installation", image: "", note: "Site lead · 11 years" },
        ] }, style: { layout: "list", background: "light" } },
        { type: "faq", content: { eyebrow: "FAQ", title: "Before You", titleHighlight: "Begin", intro: "Honest answers on cost, timelines and warranty — before you commit to anything.", items: [
          { q: "How much does a 2 BHK interior cost?", a: "Our Essential 2 BHK package starts at ₹3.9 lakh. The final cost depends on materials, finishes and how many rooms you include — we share an itemised quote after the 3D design." },
          { q: "How long does the project take?", a: "Most modular projects are installed within 45 working days of design sign-off. Turnkey and villa projects typically take 75–120 days." },
          { q: "Is the 3D design really free?", a: "Yes. Your first consultation, site measurement and 3D design are free with no obligation to book." },
          { q: "Can you work with my builder's possession timeline?", a: "Yes. Book design 4–6 weeks before possession and we start manufacturing the day you get the keys." },
          { q: "Do you offer EMI?", a: "Yes, no-cost EMI options are available for up to 12 months through partner banks and NBFCs." },
          { q: "What warranty do you give?", a: "Up to 10 years on modular furniture and hardware, plus free service visits during the first year." },
        ] } as SectionContentMap["faq"], style: { layout: "split" } },
        { ...cta("Let's design your home", "Book a Free Consultation"), style: { layout: "minimal" } },
      ],
    },
    { slug: "about", title: "Our Studio", isSystem: true, order: 1, sections: [
      { type: "banner", content: { title: "Our", titleHighlight: "Studio", subtitle: "Designers, makers and project managers under one roof.", image: "", bgColor: "", imageOpacity: 35, overlayOpacity: 70 } },
      { type: "about", content: {
        eyebrow: "OUR STORY", title: "Design That Respects", titleHighlight: "Your Budget",
        body: [`${biz} began as a two-person design studio and grew into a full-service interiors company with its own manufacturing unit.`, "We still work the same way we did on day one — one family, one home, one dedicated team at a time."],
        image: "", points: ["Architects & certified interior designers", "15,000 sq ft manufacturing unit", "Own installation crews — no sub-contracting", "Itemised, fixed-price quotations"],
        buttonLabel: "See Our Process", buttonHref: "/process",
      } },
      { type: "team", content: { eyebrow: "THE TEAM", title: "People Behind", titleHighlight: "the Designs", members: [
        { name: "Ar. Meera Kulkarni", role: "Founder & Principal Designer", image: "", note: "M.Arch · 14 yrs" },
        { name: "Siddharth Rao", role: "Head of Design", image: "", note: "Residential specialist" },
        { name: "Kavya Menon", role: "3D Visualiser", image: "", note: "500+ homes rendered" },
        { name: "Imran Sheikh", role: "Projects & Installation", image: "", note: "Site lead · 11 yrs" },
      ] }, style: { background: "light", cardRadius: "none" } },
      cta("Ready to start?", "Talk to a Designer"),
    ] },
    { slug: "services", title: "Services", isSystem: true, order: 2, sections: [
      { type: "serviceCategories", content: { eyebrow: "SERVICES", title: "Interiors for", titleHighlight: "Every Space", categories: ["Modular Kitchens", "Wardrobes & Storage", "Full-Home Interiors", "Commercial & Turnkey"] } },
      { type: "features", content: { items: [
        { icon: "shield", title: "BWP Plywood Carcass", text: "Boiling-water-proof ply for kitchens and bathrooms — termite and moisture resistant." },
        { icon: "badge-check", title: "40-Point Quality Check", text: "Every panel is inspected for edge-banding, finish and hardware before dispatch." },
        { icon: "wrench", title: "Branded Hardware", text: "Soft-close hinges, tandem drawers and lift-up systems built for daily use." },
        { icon: "grid", title: "200+ Finishes", text: "Laminates, acrylic, PU, veneer and glass — sample them at our experience centre." },
      ] }, style: { background: "dark", cardRadius: "none" } },
      { type: "priceList", content: { eyebrow: "INDICATIVE RATES", title: "Price", titleHighlight: "Guide", note: "Indicative starting rates incl. installation. Final price depends on size, material and finish. GST extra.", groups: [
        { category: "Kitchens", items: [ { name: "Straight kitchen (8 ft)", price: "₹1,10,000", note: "laminate finish" }, { name: "L-shaped kitchen", price: "₹1,65,000", note: "with tall unit" }, { name: "Island kitchen", price: "₹3,20,000", note: "quartz top" } ] },
        { category: "Wardrobes & Units", items: [ { name: "Hinged wardrobe", price: "₹1,450/sq ft", note: "" }, { name: "Sliding wardrobe", price: "₹1,850/sq ft", note: "" }, { name: "TV unit", price: "₹38,000", note: "with back panel" } ] },
      ] } },
      { type: "faq", content: { eyebrow: "MATERIALS FAQ", title: "Finishes &", titleHighlight: "Materials", intro: "Every material we use is chosen for Indian kitchens, humidity and daily wear.", items: [
        { q: "Laminate, acrylic or PU — which is best for a kitchen?", a: "Laminate is the most durable for budget kitchens, acrylic gives a high-gloss look that is easy to wipe, and PU offers a seamless painted finish at a premium. We bring samples to help you decide." },
        { q: "Is MDF okay for wardrobes?", a: "We use HDHMR or BWR ply for wardrobes and BWP ply for kitchens and bathrooms — never plain MDF for anything that faces moisture." },
        { q: "Can I see the materials before ordering?", a: "Yes, visit our experience centre to touch and compare 200+ finishes, handles and countertop samples." },
      ] } as SectionContentMap["faq"], style: { layout: "split" } },
      cta("Not sure where to begin?", "Get a Free 3D Design"),
    ] },
    { slug: "portfolio", title: "Portfolio", isSystem: true, order: 3, sections: [
      { type: "gallery", content: { eyebrow: "PORTFOLIO", title: "Spaces We've", titleHighlight: "Created" } },
      { type: "stats", content: { items: [ { value: "1,200+", label: "Homes", icon: "home" }, { value: "80+", label: "Offices & Clinics", icon: "store" }, { value: "35+", label: "Villas", icon: "award" }, { value: "92%", label: "Referral Rate", icon: "thumbs-up" } ] }, style: { background: "primary" } },
      { type: "testimonials", content: { eyebrow: "REVIEWS", title: "What Clients", titleHighlight: "Say", items: [
        { name: "Ankit Bansal", role: "Office interiors · 60 seats", text: "Delivered our new office in 52 days without disturbing our running operations. The team feels proud to come to work now.", rating: 5 },
        { name: "Lakshmi Narayanan", role: "Villa · 4,200 sq ft", text: "Meera's team understood our love for teak and brass. Every room feels personal and nothing looks like a catalogue.", rating: 5 },
      ] } },
      cta("Love what you see?", "Design Yours Next"),
    ] },
    { slug: "packages", title: "Packages", isSystem: true, order: 4, sections: [
      { type: "pricingPlans", content: {
        eyebrow: "HOME PACKAGES", title: "Choose a", titleHighlight: "Starting Point",
        plans: [
          { name: "Essential 2 BHK", price: "₹3.9 L", period: "onwards", features: ["Modular kitchen", "2 wardrobes", "TV unit", "Free 3D design", "5-year warranty"], featured: false, buttonLabel: "Get Estimate", buttonHref: "/consultation" },
          { name: "Signature 3 BHK", price: "₹7.5 L", period: "onwards", features: ["Premium modular kitchen", "3 wardrobes + loft", "Living & dining storage", "False ceiling & lighting", "Pooja unit", "10-year warranty"], featured: true, buttonLabel: "Get Estimate", buttonHref: "/consultation" },
          { name: "Luxe Villa", price: "₹18 L", period: "onwards", features: ["Bespoke furniture & panelling", "Walk-in wardrobes", "Marble & veneer finishes", "Décor & soft furnishing", "Turnkey civil & electrical"], featured: false, buttonLabel: "Get Estimate", buttonHref: "/consultation" },
        ],
      } },
      { type: "features", content: { items: [
        { icon: "tag", title: "No Hidden Costs", text: "Itemised quote covering material, hardware, installation and transport." },
        { icon: "gift", title: "No-Cost EMI", text: "Spread payments over up to 12 months." },
        { icon: "calendar", title: "Milestone Payments", text: "Pay in stages linked to design, production and installation." },
      ] }, style: { background: "light" } },
      cta("Want a custom package?", "Get Your Estimate"),
    ] },
    { slug: "process", title: "Our Process", isSystem: true, order: 5, sections: [
      { type: "steps", content: { eyebrow: "OUR PROCESS", title: "Six Steps to", titleHighlight: "Your New Home", items: [
        { title: "Consultation", text: "Understand your lifestyle and budget", icon: "users" },
        { title: "Site Measurement", text: "Laser-accurate measurement of every wall", icon: "clipboard" },
        { title: "3D Design", text: "Renders, material board and revisions", icon: "edit" },
        { title: "Sign-off & Quote", text: "Fixed, itemised quotation", icon: "check" },
        { title: "Production", text: "Factory manufacturing & QC", icon: "factory" },
        { title: "Installation", text: "Installed, cleaned and handed over", icon: "home" },
      ] } },
      { type: "faq", content: { eyebrow: "GOOD TO KNOW", title: "Process", titleHighlight: "Questions", items: [
        { q: "How many design revisions are included?", a: "Up to three rounds of revisions on layouts and finishes before final sign-off." },
        { q: "Can I live at home during installation?", a: "For kitchen and wardrobe projects, yes. Our team works in sections and cleans up daily." },
        { q: "How will I track progress?", a: "Your project manager shares photo updates and a timeline on WhatsApp every week." },
      ] }, style: { background: "light" } },
      cta("Start with a conversation", "Book Your Consultation"),
    ] },
    { slug: "consultation", title: "Free Consultation", isSystem: true, order: 6, sections: [
      { type: "appointmentForm", content: { title: "Book a Free Design Consultation", subtitle: "Choose a date — visit our experience centre or have a designer visit your site. Includes free measurement and 3D design." } },
      { type: "features", content: { items: [
        { icon: "edit", title: "Free 3D Design", text: "See every room before you commit." },
        { icon: "tag", title: "Itemised Quote", text: "Clear pricing within 72 hours." },
        { icon: "handshake", title: "No Obligation", text: "Decide at your own pace." },
      ] }, style: { background: "light" } },
      { type: "openingHours", content: { eyebrow: "EXPERIENCE CENTRE", title: "Visiting", titleHighlight: "Hours", note: "Weekend slots fill fast — book a day in advance.", days: [
        { day: "Monday – Saturday", hours: "10:00 AM – 8:00 PM" }, { day: "Sunday", hours: "11:00 AM – 6:00 PM (by appointment)" },
      ] } },
    ] },
    { slug: "contact", title: "Contact", isSystem: true, order: 7, sections: [
      { type: "contactInfo", content: { eyebrow: "CONTACT", title: "Visit Our", titleHighlight: "Experience Centre", address: "Your City", phone: "9000000000", email: "hello@example.com", hours: "Mon–Sat 10 AM – 8 PM · Sun by appointment", mapEmbed: "" } },
      { type: "map", content: { eyebrow: "FIND US", title: "Get", titleHighlight: "Directions", address: "Your City", mapEmbed: "" } },
      { type: "contactForm", content: { title: "Send Us a Message", subtitle: "Tell us about your space — a designer will call you back within one working day." } },
    ] },
  ],
};
