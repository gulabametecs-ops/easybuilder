import type { TemplateDef, SectionSeed } from "./types";
import type { SectionContentMap } from "../config";

// Car Service & Detailing (periodic service, denting-painting, ceramic/PPF, AC, insurance):
// racing red + gunmetal + carbon black, high-contrast and booking-driven.
const cta = (title: string, highlight: string): SectionSeed<"cta"> => ({
  type: "cta", content: { title, highlight, phones: ["9000000000"], buttonLabel: "Book a Service", buttonHref: "/book-service" },
});

export const carService: TemplateDef = {
  theme: {
    colors: { primary: "#dc2626", primaryDark: "#b91c1c", secondary: "#1f2937", accent: "#facc15", dark: "#0b0d10", light: "#f4f4f5", text: "#3f3f46", heading: "#111827" },
    font: "Barlow", radius: "0.375rem",
  },
  header: (biz) => ({
    design: "bold",
    logoText: biz, logoImage: "",
    announcement: { show: true, text: "Free pickup & drop + 15-point health check with every periodic service", link: "/book-service" },
    topbar: { show: true, address: "Open 7 days · 8 AM – 8 PM · Your City", phones: ["9000000000"], email: "hello@example.com", social: { facebook: "#", instagram: "#", whatsapp: "#" } },
    nav: [
      { label: "Home", href: "/" }, { label: "Services", href: "/services" }, { label: "Price List", href: "/price-list" }, { label: "Detailing", href: "/detailing" },
      { label: "Insurance", href: "/insurance" }, { label: "About", href: "/about" }, { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Book Service", href: "/book-service" },
  }),
  footer: (biz) => ({
    design: "classic",
    about: `${biz} is a multi-brand car workshop for periodic service, denting-painting, detailing, ceramic coating, PPF and insurance claims — with genuine parts, transparent bills and free pickup-drop.`,
    columns: [
      { title: "Services", links: [ { label: "Periodic Service", href: "/services" }, { label: "Denting & Painting", href: "/services" }, { label: "Ceramic Coating & PPF", href: "/detailing" }, { label: "AC Repair", href: "/services" }, { label: "Insurance Claims", href: "/insurance" } ] },
      { title: "Company", links: [ { label: "About Us", href: "/about" }, { label: "Price List", href: "/price-list" }, { label: "Book a Service", href: "/book-service" }, { label: "Contact", href: "/contact" } ] },
    ],
    serviceAreas: ["Maruti Suzuki", "Hyundai", "Tata", "Mahindra", "Honda", "Toyota", "Kia", "Skoda & VW"],
    contact: { phones: ["9000000000"], email: "hello@example.com", address: "Your City" },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. Drive easy.`,
  }),
  seo: (biz) => ({
    title: `${biz} — Car Service, Denting-Painting, Ceramic Coating & PPF in Your City`,
    description: "Multi-brand car service from ₹2,499 with free pickup-drop, genuine parts and 1,000 km warranty. Denting-painting, ceramic coating, PPF, AC repair and cashless insurance claims.",
    favicon: "", ogImage: "",
    keywords: "car service near me, car repair, denting painting, ceramic coating, ppf, car ac repair, car insurance claim, car detailing",
    businessType: "AutoRepair", priceRange: "₹₹",
  }),
  services: [
    { category: "Service & Repair", title: "Periodic Service", description: "Engine oil, filters, brake check and 50-point inspection as per manufacturer schedule." },
    { category: "Service & Repair", title: "Brakes, Clutch & Suspension", description: "Pad and disc replacement, clutch overhaul and shock absorber repair." },
    { category: "Service & Repair", title: "Car AC Repair", description: "Gas top-up, compressor and condenser repair, cooling coil cleaning." },
    { category: "Service & Repair", title: "Batteries & Electricals", description: "Battery replacement, alternator, wiring and scanner-based diagnostics." },
    { category: "Body Shop", title: "Denting & Painting", description: "Panel-wise dent removal and oven-baked paint with exact colour match." },
    { category: "Body Shop", title: "Accident Repair", description: "Major collision repair with chassis alignment and genuine body parts." },
    { category: "Body Shop", title: "Insurance Claims", description: "Cashless claims with all major insurers — survey, approval and paperwork handled." },
    { category: "Detailing & Protection", title: "Ceramic Coating", description: "9H nano-ceramic layer for deep gloss and 3–5 years of protection." },
    { category: "Detailing & Protection", title: "Paint Protection Film (PPF)", description: "Self-healing TPU film against stone chips, scratches and swirl marks." },
    { category: "Detailing & Protection", title: "Interior Deep Cleaning", description: "Steam cleaning, upholstery shampoo and odour treatment." },
    { category: "Convenience", title: "Free Pickup & Drop", description: "We collect your car from home or office and return it serviced." },
    { category: "Convenience", title: "24×7 Roadside Assistance", description: "Jump-start, flat tyre and towing support anywhere in the city." },
  ],
  gallery: [
    "Service bay", "Ceramic coating finish", "PPF installation", "Paint booth", "Scanner diagnostics", "Interior detailing", "Customer lounge", "Pickup & drop fleet",
  ].map((caption) => ({ category: "Workshop", caption })),
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "gradient", customHtml: "",
          badge: "MULTI-BRAND · GENUINE PARTS · 1,000 KM WARRANTY", titleTop: "Your Car Deserves", titleHighlight: "Expert Hands",
          subtitle: "", description: `${biz} services every make and model with factory-trained technicians, genuine spares and upfront pricing. Book online, we pick it up — and return it shining.`, image: "",
          primaryBtn: { label: "Book a Service", href: "/book-service" }, secondaryBtn: { label: "See Price List", href: "/price-list" },
          features: [ { icon: "truck", title: "Free Pickup & Drop", text: "" }, { icon: "shield", title: "Genuine Parts", text: "" }, { icon: "clock", title: "Same-Day Delivery", text: "" }, { icon: "badge-check", title: "1,000 km Warranty", text: "" } ],
        } },
        { type: "stats", content: { items: [ { value: "25,000+", label: "Cars Serviced", icon: "wrench" }, { value: "40+", label: "Trained Technicians", icon: "user-check" }, { value: "4.8★", label: "Google Rating", icon: "star" }, { value: "18", label: "Insurance Partners", icon: "handshake" } ] }, style: { layout: "band" } },
        { type: "features", content: { items: [
          { icon: "tag", title: "Upfront Pricing", text: "Fixed package prices — no extra work without your approval on WhatsApp." },
          { icon: "shield", title: "OEM / OES Parts", text: "Genuine and OES spares with bills, warranty and old parts returned." },
          { icon: "wrench", title: "Brand-Trained Techs", text: "Technicians with 8+ years of authorised-dealer experience." },
          { icon: "badge-check", title: "Service Warranty", text: "1,000 km / 1 month warranty on every service and repair." },
        ] }, style: { layout: "numbered" } },
        { type: "serviceCategories", content: { eyebrow: "WHAT WE DO", title: "Complete Car", titleHighlight: "Care", categories: ["Service & Repair", "Body Shop", "Detailing & Protection", "Convenience"] }, style: { background: "dark" } },
        { type: "countdown", content: { eyebrow: "WINTER OFFER", title: "Ceramic Coating at", titleHighlight: "Flat 25% Off", subtitle: "Book before the offer ends and get a free interior detailing worth ₹2,500.", targetDate: "2027-01-31T23:59:00", buttonLabel: "Claim Offer", buttonHref: "/detailing" }, style: { background: "primary" } },
        { type: "pricingPlans", content: {
          eyebrow: "SERVICE PACKAGES", title: "Pick Your", titleHighlight: "Service",
          plans: [
            { name: "Basic Service", price: "₹2,499", period: "hatchback", features: ["Engine oil & oil filter", "Air filter cleaning", "Brake & coolant check", "Exterior wash", "15-point inspection"], featured: false, buttonLabel: "Book Now", buttonHref: "/book-service" },
            { name: "Standard Service", price: "₹4,299", period: "hatchback", features: ["Everything in Basic", "AC filter & fuel filter", "Wheel alignment & balancing", "Battery & spark plug check", "Interior vacuum", "50-point inspection"], featured: true, buttonLabel: "Book Now", buttonHref: "/book-service" },
            { name: "Comprehensive", price: "₹6,999", period: "hatchback", features: ["Everything in Standard", "Brake pad cleaning", "Throttle body cleaning", "AC gas top-up", "Rubbing & polishing", "Scanner diagnostics"], featured: false, buttonLabel: "Book Now", buttonHref: "/book-service" },
          ],
        }, style: { background: "light", cardRadius: "sm", cardShadow: "lg" } },
        { type: "logos", content: { title: "Every body type, every fuel", items: ["Hatchbacks", "Sedans", "Compact SUVs", "SUVs & MUVs", "CNG Cars", "Diesel", "Hybrids & EVs", "Luxury Imports"] }, style: { spacingTop: "sm", spacingBottom: "sm" } },
        { type: "steps", content: { eyebrow: "HOW IT WORKS", title: "Service in", titleHighlight: "4 Simple Steps", items: [
          { title: "Book Online", text: "Choose service, date and a 2-hour pickup slot", icon: "calendar" },
          { title: "Free Pickup", text: "Our insured driver collects your car", icon: "truck" },
          { title: "Live Updates", text: "Job card, photos & approvals on WhatsApp", icon: "phone" },
          { title: "Doorstep Delivery", text: "Pay only after you inspect the car", icon: "check" },
        ] }, style: { layout: "timeline" } },
        { type: "priceList", content: { eyebrow: "QUICK FIXES", title: "Popular Jobs,", titleHighlight: "Fixed Prices", note: "Hatchback prices incl. GST. Sedan +15%, SUV +25%. Full list on the Price List page.", groups: [
          { category: "AC & Electricals", items: [ { name: "AC gas top-up", price: "₹1,499", note: "R134a" }, { name: "Battery replacement", price: "from ₹3,999", note: "with old-battery exchange" }, { name: "Scanner diagnostics", price: "₹599", note: "free with service" } ] },
          { category: "Wheels & Body", items: [ { name: "Wheel alignment + balancing", price: "₹1,099", note: "" }, { name: "Per panel paint", price: "₹2,800", note: "oven-baked" }, { name: "Windshield replacement", price: "from ₹4,500", note: "insurance-covered" } ] },
        ] }, style: { background: "light" } },
        { type: "testimonials", content: { eyebrow: "REVIEWS", title: "Trusted by", titleHighlight: "Car Owners", items: [
          { name: "Rahul Verma", role: "Compact SUV owner", text: "Dealer quoted ₹14,000 for the same work. These guys did it for ₹8,600 with genuine parts and sent me photos of every replaced part.", rating: 5 },
          { name: "Sneha Pillai", role: "Premium hatchback owner", text: "Pickup at 9 AM, car back by 6 PM — washed and smelling fresh. I didn't have to leave office once.", rating: 5 },
          { name: "Gurpreet Singh", role: "7-seater SUV · Ceramic + PPF", text: "The ceramic coating finish is unreal. Six months in and water still beads off like day one.", rating: 5 },
          { name: "Ananya Krishnan", role: "Insurance claim · sedan", text: "Rear-ended at a signal. They towed the car, handled the surveyor and I paid only the ₹1,000 deductible.", rating: 5 },
        ] }, style: { layout: "dark" } },
        { type: "imageBanner", content: { title: "Accident? We handle the claim.", subtitle: "Free towing, cashless repairs with 18 insurers and survey coordination — you only pay the deductible.", buttonLabel: "Start a Cashless Claim", buttonHref: "/insurance", image: "" } },
        { type: "openingHours", content: { eyebrow: "WORKSHOP TIMINGS", title: "Open", titleHighlight: "7 Days", note: "Roadside assistance available 24×7 on 9000000000.", days: [
          { day: "Monday – Saturday", hours: "8:00 AM – 8:00 PM" }, { day: "Sunday", hours: "9:00 AM – 5:00 PM" }, { day: "Roadside assistance", hours: "24 × 7" },
        ] } },
        { type: "faq", content: { eyebrow: "FAQ", title: "Common", titleHighlight: "Questions", items: [
          { q: "Will servicing outside the dealer void my warranty?", a: "No. Your manufacturer warranty stays valid as long as the service follows the recommended schedule with quality parts — which we document on every job card." },
          { q: "Is pickup and drop really free?", a: "Yes, within city limits for all periodic service and body shop jobs." },
          { q: "Do you handle cashless insurance claims?", a: "Yes. We work with 18 insurers and handle the survey, approval and paperwork. You only pay the compulsory deductible." },
          { q: "Do you service CNG and electric cars?", a: "Yes. We service factory and retro-fitted CNG kits, and do general service, AC, tyres and body work on EVs and hybrids." },
          { q: "How long does ceramic coating take?", a: "Usually 2 days including paint correction and curing. PPF takes 2–3 days depending on coverage." },
          { q: "Which payment modes do you accept?", a: "UPI, cards, net banking and cash. Pay only after you inspect the car." },
        ] }, style: { background: "light" } },
        cta("Due for a service?", "Book in 60 Seconds"),
      ],
    },
    { slug: "services", title: "Services", isSystem: true, order: 1, sections: [
      { type: "banner", content: { title: "Car", titleHighlight: "Services", subtitle: "From oil change to accident repair — all makes, all models.", image: "", bgColor: "#0b0d10", imageOpacity: 30, overlayOpacity: 75 } },
      { type: "serviceCategories", content: { eyebrow: "SERVICES", title: "Everything Your Car", titleHighlight: "Needs", categories: ["Service & Repair", "Body Shop", "Detailing & Protection", "Convenience"] } },
      { type: "logos", content: { title: "We service all major brands", items: ["Maruti Suzuki", "Hyundai", "Tata", "Mahindra", "Honda", "Toyota", "Kia", "MG"] }, style: { background: "light" } },
      cta("Need a repair estimate?", "Get a Free Inspection"),
    ] },
    { slug: "price-list", title: "Price List", isSystem: true, order: 2, sections: [
      { type: "priceList", content: { eyebrow: "TRANSPARENT PRICING", title: "Service", titleHighlight: "Price List", note: "Hatchback prices shown; sedan +15%, SUV +25%. Parts as actuals for repairs. Prices incl. GST.", groups: [
        { category: "Periodic Service", items: [ { name: "Basic service", price: "₹2,499", note: "every 5,000 km" }, { name: "Standard service", price: "₹4,299", note: "every 10,000 km" }, { name: "Comprehensive service", price: "₹6,999", note: "every 20,000 km" } ] },
        { category: "Denting & Painting", items: [ { name: "Per panel paint", price: "₹2,800", note: "oven-baked" }, { name: "Bumper dent + paint", price: "₹3,200", note: "" }, { name: "Full body paint", price: "₹38,000", note: "5–7 days" } ] },
        { category: "AC & Electricals", items: [ { name: "AC gas top-up", price: "₹1,499", note: "R134a" }, { name: "AC full service", price: "₹2,999", note: "incl. coil cleaning" }, { name: "Scanner diagnostics", price: "₹599", note: "free with service" } ] },
        { category: "Wheels & Tyres", items: [ { name: "Wheel alignment", price: "₹599", note: "" }, { name: "Wheel balancing (4)", price: "₹699", note: "" }, { name: "Tyre rotation", price: "₹299", note: "" } ] },
      ] } },
      { type: "features", content: { items: [
        { icon: "check", title: "Approve Before We Fix", text: "Any extra work is quoted on WhatsApp first." },
        { icon: "package", title: "Old Parts Returned", text: "See and keep what we replaced." },
        { icon: "badge-check", title: "Warranty on Labour", text: "1,000 km / 1 month on all jobs." },
      ] }, style: { background: "dark" } },
      cta("Prices you can trust", "Book Your Slot"),
    ] },
    { slug: "detailing", title: "Detailing & PPF", isSystem: true, order: 3, sections: [
      { type: "imageBanner", content: { title: "Showroom shine. Every single day.", subtitle: "Paint correction, 9H ceramic coating and self-healing PPF applied in a dust-free detailing studio.", buttonLabel: "Book Detailing", buttonHref: "/book-service", image: "" } },
      { type: "pricingPlans", content: {
        eyebrow: "PROTECTION PACKAGES", title: "Detailing", titleHighlight: "Packages",
        plans: [
          { name: "Gloss Detail", price: "₹4,999", period: "hatchback", features: ["Foam wash & clay bar", "Single-stage polish", "Interior steam clean", "Tyre & trim dressing"], featured: false, buttonLabel: "Book", buttonHref: "/book-service" },
          { name: "Ceramic 9H", price: "₹17,999", period: "3-year coating", features: ["2-stage paint correction", "9H ceramic coating", "Glass & alloy coating", "Free maintenance wash × 2", "Warranty card"], featured: true, buttonLabel: "Book", buttonHref: "/book-service" },
          { name: "Full-Body PPF", price: "₹1,10,000", period: "5-year film", features: ["Self-healing TPU film", "Full body coverage", "Gloss or matte finish", "Paint correction included", "5-year warranty"], featured: false, buttonLabel: "Book", buttonHref: "/book-service" },
        ],
      }, style: { background: "dark", cardRadius: "md" } },
      { type: "gallery", content: { eyebrow: "BEFORE & AFTER", title: "Detailing", titleHighlight: "Results" } },
      { type: "faq", content: { eyebrow: "DETAILING FAQ", title: "Ceramic vs", titleHighlight: "PPF", intro: "Protect your paint the right way — here is what most owners ask us first.", items: [
        { q: "What's the difference between ceramic coating and PPF?", a: "Ceramic adds gloss and makes washing easy; PPF is a physical film that absorbs stone chips and light scratches. Many owners do PPF on the front and ceramic on the rest." },
        { q: "Can I wash my car after coating?", a: "Wait 7 days, then use pH-neutral shampoo. We include two free maintenance washes with every ceramic package." },
        { q: "Does PPF turn yellow?", a: "Our TPU films are non-yellowing and carry a 5-year warranty against yellowing, cracking and peeling." },
      ] } as SectionContentMap["faq"], style: { layout: "split", background: "light" } },
      cta("Protect your paint", "Book Ceramic or PPF"),
    ] },
    { slug: "insurance", title: "Insurance Claims", isSystem: true, order: 4, sections: [
      { type: "steps", content: { eyebrow: "CASHLESS CLAIMS", title: "Accident? We", titleHighlight: "Handle It All", items: [
        { title: "Call or WhatsApp", text: "Share photos and policy copy", icon: "phone" },
        { title: "Towing", text: "Free towing within city limits", icon: "truck" },
        { title: "Survey & Approval", text: "We coordinate with the surveyor", icon: "clipboard" },
        { title: "Repair & Deliver", text: "Pay only the deductible", icon: "check" },
      ] } },
      { type: "logos", content: { title: "Cashless with leading insurers", items: ["Private Insurers", "Public Sector Insurers", "Zero-Dep Policies", "Bank-Linked Policies", "Corporate Fleet Policies"] }, style: { background: "light" } },
      { type: "faq", content: { eyebrow: "CLAIMS FAQ", title: "Insurance", titleHighlight: "Questions", items: [
        { q: "What documents do I need?", a: "RC, insurance policy, driving licence and an FIR for theft or third-party damage." },
        { q: "How long does a claim repair take?", a: "Minor claims take 3–5 days; major accident repairs 7–15 days depending on parts availability." },
        { q: "Can I claim for a minor scratch?", a: "You can, but we'll advise honestly whether a claim is worth losing your No-Claim Bonus." },
      ] } },
      cta("Had an accident?", "Start Your Claim"),
    ] },
    { slug: "about", title: "About Us", isSystem: true, order: 5, sections: [
      { type: "about", content: {
        eyebrow: "ABOUT US", title: "Dealer Quality,", titleHighlight: "Honest Prices",
        body: [`${biz} was started by ex-dealership service engineers tired of inflated bills and vague job cards.`, "Today our 12,000 sq ft workshop runs modern lifts, a paint booth, a detailing studio and brand-specific scanners — with the same promise: no work without your approval."],
        image: "", points: ["12,000 sq ft workshop", "Downdraft paint booth", "Dust-free detailing studio", "Brand-specific diagnostic scanners"],
        buttonLabel: "Book a Service", buttonHref: "/book-service",
      } },
      { type: "team", content: { eyebrow: "OUR CREW", title: "Meet the", titleHighlight: "Experts", members: [
        { name: "Manoj Yadav", role: "Workshop Head", image: "", note: "Ex-dealer · 16 yrs" },
        { name: "Faisal Ansari", role: "Body Shop Lead", image: "", note: "Paint & denting · 12 yrs" },
        { name: "Deepak Nair", role: "Detailing Specialist", image: "", note: "Certified PPF installer" },
        { name: "Priya Chauhan", role: "Customer & Claims Manager", image: "", note: "Insurance desk" },
      ] }, style: { background: "light" } },
      { type: "stats", content: { items: [ { value: "9+", label: "Years", icon: "award" }, { value: "25,000+", label: "Cars Serviced", icon: "wrench" }, { value: "3,000+", label: "Claims Settled", icon: "shield" }, { value: "92%", label: "Repeat Customers", icon: "thumbs-up" } ] }, style: { background: "primary" } },
      { type: "testimonials", content: { eyebrow: "CUSTOMER VOICES", title: "Why Drivers", titleHighlight: "Stay With Us", items: [
        { name: "Kiran Patil", role: "Fleet owner · 14 cabs", text: "All my cabs are serviced here on a monthly plan. Downtime is minimal and the billing is clean for GST.", rating: 5 },
        { name: "Meenakshi Sundaram", role: "Sedan owner · 6 years", text: "I trust them more than the dealer. They tell me what can wait and what can't — that honesty is rare.", rating: 5 },
      ] }, style: { layout: "minimal" } },
      cta("See the workshop yourself", "Visit Us Today"),
    ] },
    { slug: "book-service", title: "Book a Service", isSystem: true, order: 6, sections: [
      { type: "appointmentForm", content: { title: "Book Your Car Service", subtitle: "Select a date and time slot. Free pickup & drop within city limits — we'll confirm on WhatsApp within 30 minutes." } },
      { type: "features", content: { items: [
        { icon: "truck", title: "Free Pickup", text: "From home or office." },
        { icon: "phone", title: "WhatsApp Updates", text: "Photos at every stage." },
        { icon: "tag", title: "Pay After Delivery", text: "UPI, card or cash." },
      ] }, style: { background: "light" } },
      { type: "openingHours", content: { eyebrow: "SLOTS", title: "Pickup", titleHighlight: "Timings", note: "Same-day delivery for bookings picked up before 11 AM.", days: [
        { day: "Monday – Saturday", hours: "8:00 AM – 6:00 PM" }, { day: "Sunday", hours: "9:00 AM – 2:00 PM" },
      ] } },
    ] },
    { slug: "contact", title: "Contact", isSystem: true, order: 7, sections: [
      { type: "contactInfo", content: { eyebrow: "CONTACT", title: "Get in", titleHighlight: "Touch", address: "Your City", phone: "9000000000", email: "hello@example.com", hours: "Mon–Sat 8 AM – 8 PM · Sun 9 AM – 5 PM", mapEmbed: "" } },
      { type: "map", content: { eyebrow: "WORKSHOP", title: "Find", titleHighlight: "Our Workshop", address: "Your City", mapEmbed: "" } },
      { type: "contactForm", content: { title: "Send an Enquiry", subtitle: "Share your car model and issue — our service advisor will call you back with an estimate." } },
    ] },
  ],
};
