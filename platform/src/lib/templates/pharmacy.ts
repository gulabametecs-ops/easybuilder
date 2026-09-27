import type { TemplateDef } from "./types";

// Pharmacy / Medical Store / Chemist: clean clinical teal-green, trust-first —
// genuine medicines, licensed pharmacist, prescription orders, home delivery, lab tests.
export const pharmacy: TemplateDef = {
  theme: {
    colors: { primary: "#0d9488", primaryDark: "#0f766e", secondary: "#064e3b", accent: "#22c55e", dark: "#042f2e", light: "#f0fdfa", text: "#334155", heading: "#0f2a2a" },
    font: "Manrope", radius: "0.9rem",
  },
  header: (biz) => ({
    design: "modern",
    logoText: biz, logoImage: "",
    announcement: { show: true, text: "Free home delivery on orders above ₹499 · Upload your prescription & order in minutes", link: "/order" },
    topbar: { show: true, address: "Licensed Pharmacy · Open 8am – 11pm, 7 days", phones: ["9000000000"], email: "hello@example.com", social: { facebook: "#", instagram: "#", whatsapp: "#" } },
    nav: [
      { label: "Home", href: "/" }, { label: "Products", href: "/products" }, { label: "Lab Tests", href: "/lab-tests" }, { label: "Store Hours", href: "/store" }, { label: "About", href: "/about" }, { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Order Medicines", href: "/order" },
  }),
  footer: (biz) => ({
    design: "modern",
    about: "Your neighbourhood licensed pharmacy — 100% genuine medicines, expert pharmacist advice and fast home delivery.",
    columns: [
      { title: "Quick Links", links: [ { label: "Home", href: "/" }, { label: "About Us", href: "/about" }, { label: "Order Medicines", href: "/order" }, { label: "Store Hours & Location", href: "/store" }, { label: "Contact", href: "/contact" } ] },
      { title: "Shop", links: [ { label: "Prescription Medicines", href: "/products" }, { label: "Wellness & Nutrition", href: "/products" }, { label: "Personal Care", href: "/products" }, { label: "Baby & Mother Care", href: "/products" }, { label: "Health Devices", href: "/products" } ] },
      { title: "Health Services", links: [ { label: "Lab Tests at Home", href: "/lab-tests" }, { label: "Health Checkup Packages", href: "/lab-tests" }, { label: "Upload Prescription", href: "/order" }, { label: "Chronic Care Refills", href: "/order" } ] },
    ],
    serviceAreas: ["Prescription Medicines", "Home Delivery", "Lab Tests", "Wellness", "Baby Care", "Health Devices"],
    contact: { phones: ["9000000000"], email: "hello@example.com", address: "Your City" },
    social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
    copyright: `© {year} ${biz}. Licensed retail pharmacy. Medicines dispensed only against a valid prescription where required.`,
  }),
  seo: (biz) => ({
    title: `${biz} — Pharmacy, Medical Store & Home Delivery`,
    description: "Genuine medicines, expert pharmacist advice, fast home delivery and lab tests at home. Upload your prescription and order online.",
    keywords: "pharmacy near me, medical store, chemist, medicine home delivery, upload prescription, lab test at home, health checkup",
    businessType: "Pharmacy", priceRange: "₹₹",
    favicon: "", ogImage: "",
  }),
  services: [
    { category: "Medicines", title: "Prescription Medicines", description: "All branded & generic medicines, dispensed by a licensed pharmacist." },
    { category: "Medicines", title: "Chronic Care Refills", description: "Monthly refills for diabetes, BP, thyroid & heart care — never run out." },
    { category: "Medicines", title: "Generic Alternatives", description: "Save up to 50% with quality-approved generic substitutes." },
    { category: "Wellness & Personal Care", title: "Vitamins & Supplements", description: "Multivitamins, protein, immunity boosters and Ayurvedic products." },
    { category: "Wellness & Personal Care", title: "Personal & Skin Care", description: "Dermatologist-recommended skin, hair and hygiene essentials." },
    { category: "Wellness & Personal Care", title: "Baby & Mother Care", description: "Diapers, baby food, feeding essentials and maternity care." },
    { category: "Health Devices", title: "BP Monitors & Glucometers", description: "Trusted brands with free demo and warranty support." },
    { category: "Health Devices", title: "Mobility & Home Care", description: "Nebulizers, thermometers, oximeters, supports and wheelchairs." },
    { category: "Health Services", title: "Lab Tests at Home", description: "NABL-partner labs with free home sample collection." },
    { category: "Health Services", title: "Pharmacist Consultation", description: "Free advice on dosage, interactions and side effects." },
  ],
  gallery: [
    ...["Our pharmacy counter", "Well-stocked medicine shelves", "Temperature-controlled storage", "Wellness & nutrition aisle"].map((c) => ({ category: "Our Store", caption: c })),
    ...["Pharmacist consultation", "Home delivery team", "Home sample collection", "Free BP & sugar check camp"].map((c) => ({ category: "Our Services", caption: c })),
  ],
  pages: (biz) => [
    {
      slug: "home", title: "Home", isSystem: true, order: 0,
      sections: [
        { type: "hero", content: {
          variant: "split", customHtml: "",
          badge: "LICENSED PHARMACY · 100% GENUINE MEDICINES", titleTop: "Genuine Medicines,", titleHighlight: "Delivered to Your Door",
          subtitle: "", description: `Upload your prescription and ${biz} delivers the same day. Expert pharmacist advice, everyday discounts and lab tests at home — all from one trusted store.`, image: "",
          primaryBtn: { label: "Upload Prescription", href: "/order" }, secondaryBtn: { label: "Book a Lab Test", href: "/lab-tests" },
          features: [ { icon: "badge-check", title: "100% Genuine", text: "" }, { icon: "truck", title: "Same-day Delivery", text: "" }, { icon: "user-check", title: "Licensed Pharmacist", text: "" }, { icon: "tag", title: "Up to 20% Off", text: "" } ],
        } },
        { type: "features", content: { items: [
          { icon: "shield", title: "Genuine & Sourced Right", text: "Every medicine comes directly from authorised distributors, stored at the right temperature." },
          { icon: "user-check", title: "Licensed Pharmacist", text: "Each order is checked by a registered pharmacist before it leaves the store." },
          { icon: "truck", title: "Fast Home Delivery", text: "Same-day delivery across Your City. Free on orders above ₹499." },
          { icon: "tag", title: "Everyday Discounts", text: "Flat savings on medicines and more on generics and wellness products." },
        ] } },
        { type: "steps", style: { background: "light" }, content: { eyebrow: "ORDER IN 3 MINUTES", title: "How to", titleHighlight: "Order Medicines", items: [
          { title: "Upload Prescription", text: "Share a photo of your prescription or list your medicines", icon: "edit" },
          { title: "Pharmacist Confirms", text: "We verify, check stock and call you with the final bill", icon: "user-check" },
          { title: "Pay Your Way", text: "UPI, card or cash on delivery", icon: "check" },
          { title: "Delivered Home", text: "Packed safely and delivered the same day", icon: "truck" },
        ] } },
        { type: "serviceCategories", content: { eyebrow: "SHOP BY CATEGORY", title: "Everything for", titleHighlight: "Your Health", categories: ["Medicines", "Wellness & Personal Care", "Health Devices", "Health Services"] } },
        { type: "about", content: { eyebrow: "WHY US", title: "Your Trusted", titleHighlight: "Neighbourhood Pharmacy", body: [`${biz} has served families in Your City with care and honesty for years. We stock thousands of medicines and health products so you rarely have to look elsewhere.`, "Our pharmacists take the time to explain dosage, interactions and generic alternatives — because good health starts with the right advice."], image: "", points: ["Registered pharmacist on every shift", "Cold-chain storage for insulin & vaccines", "Monthly refill reminders", "Generic options to cut your bill"], buttonLabel: "About Us", buttonHref: "/about" } },
        { type: "pricingPlans", style: { background: "light" }, content: { eyebrow: "LAB TESTS AT HOME", title: "Popular Health", titleHighlight: "Checkup Packages", plans: [
          { name: "Basic Wellness", price: "₹799", period: "per person", features: ["CBC (Complete Blood Count)", "Blood Sugar (Fasting)", "Lipid Profile", "Free home sample collection", "Reports in 24 hours"], featured: false, buttonLabel: "Book Test", buttonHref: "/lab-tests#book" },
          { name: "Full Body Checkup", price: "₹1,499", period: "per person", features: ["60+ parameters", "Liver, Kidney & Thyroid", "HbA1c & Vitamin D", "Free home sample collection", "Free doctor consultation"], featured: true, buttonLabel: "Book Test", buttonHref: "/lab-tests#book" },
          { name: "Senior Citizen Care", price: "₹2,299", period: "per person", features: ["80+ parameters", "Cardiac risk markers", "Vitamin B12 & D", "Urine routine", "Priority home collection"], featured: false, buttonLabel: "Book Test", buttonHref: "/lab-tests#book" },
        ] } },
        { type: "stats", content: { items: [ { value: "25,000+", label: "Happy Customers", icon: "users" }, { value: "10,000+", label: "Products in Stock", icon: "package" }, { value: "60 min", label: "Avg. Local Delivery", icon: "truck" }, { value: "4.8★", label: "Customer Rating", icon: "star" } ] } },
        { type: "testimonials", content: { eyebrow: "CUSTOMER STORIES", title: "Trusted by", titleHighlight: "Families Nearby", items: [
          { name: "Sunita Sharma", role: "Regular customer", text: "My father's diabetes and BP medicines arrive every month without me even asking. The refill reminder is a lifesaver.", rating: 5 },
          { name: "Rahul Mehta", role: "Home delivery", text: "Uploaded the prescription on WhatsApp at 9 pm and had the medicines within the hour. The pharmacist even called to explain the dosage.", rating: 5 },
          { name: "Farah Khan", role: "Lab test customer", text: "Booked the full body checkup — the technician came home at 7 am and reports were on my phone the same evening.", rating: 5 },
        ] } },
        { type: "faq", style: { background: "light" }, content: { eyebrow: "FAQ", title: "Common", titleHighlight: "Questions", items: [
          { q: "Do I need a prescription to order?", a: "Prescription medicines (Schedule H/H1) are dispensed only against a valid doctor's prescription. Wellness, OTC and personal care products can be ordered without one." },
          { q: "How fast is home delivery?", a: "Most orders within Your City are delivered the same day, often within 60 minutes. Delivery is free on orders above ₹499." },
          { q: "Are your medicines genuine?", a: "Yes. We buy only from authorised distributors, check every batch and expiry date, and store medicines as per manufacturer guidelines." },
          { q: "Do you offer discounts?", a: "We offer everyday discounts on medicines, extra savings on generics and special prices for monthly refills and senior citizens." },
          { q: "Can I book a lab test at home?", a: "Yes. Choose a package, pick a time slot and a trained phlebotomist will collect the sample from your home at no extra charge." },
        ] } },
        { type: "cta", content: { title: "Running low on medicines?", highlight: "Order Now — Delivered Today", phones: ["9000000000"], buttonLabel: "Upload Prescription", buttonHref: "/order" } },
      ],
    },
    { slug: "about", title: "About Us", isSystem: true, order: 1, sections: [
      { type: "about", content: { eyebrow: "OUR STORY", title: "Care You Can", titleHighlight: "Trust", body: [`${biz} began as a small neighbourhood chemist with one simple promise — the right medicine, at the right price, with honest advice.`, "Today we serve thousands of families across Your City with a fully licensed pharmacy, same-day delivery and home lab tests, while keeping the personal touch that made our customers trust us."], image: "", points: ["Drug Licence & GST registered", "Registered pharmacists on every shift", "Authorised distributor sourcing", "Cold-chain storage", "Transparent pricing", "Senior citizen priority"], buttonLabel: "Visit Our Store", buttonHref: "/store" } },
      { type: "stats", style: { background: "light" }, content: { items: [ { value: "15+", label: "Years of Service", icon: "award" }, { value: "25,000+", label: "Families Served", icon: "users" }, { value: "10,000+", label: "Products", icon: "package" }, { value: "5", label: "Pharmacists", icon: "user-check" } ] } },
      { type: "team", content: { eyebrow: "OUR TEAM", title: "Meet Our", titleHighlight: "Pharmacists", members: [
        { name: "Full Name", role: "Chief Pharmacist", image: "", note: "B.Pharm · 15 yrs" },
        { name: "Full Name", role: "Pharmacist", image: "", note: "D.Pharm · 8 yrs" },
        { name: "Full Name", role: "Pharmacist", image: "", note: "M.Pharm · 5 yrs" },
        { name: "Full Name", role: "Delivery & Customer Care", image: "", note: "Always a call away" },
      ] } },
      { type: "gallery", style: { background: "light" }, content: { eyebrow: "INSIDE OUR STORE", title: "Take a", titleHighlight: "Look Around" } },
      { type: "cta", content: { title: "Questions about your medicines?", highlight: "Talk to a Pharmacist", phones: ["9000000000"], buttonLabel: "Contact Us", buttonHref: "/contact" } },
    ] },
    { slug: "products", title: "Products", isSystem: true, order: 2, sections: [
      { type: "serviceCategories", content: { eyebrow: "", title: "Shop by", titleHighlight: "Category", categories: ["Medicines", "Wellness & Personal Care", "Health Devices", "Health Services"] } },
      { type: "priceList", style: { background: "light" }, content: { eyebrow: "POPULAR ITEMS", title: "Best", titleHighlight: "Sellers", note: "Prices are indicative MRP-based offer prices and may change. Final price is confirmed by our pharmacist at the time of order.", groups: [
        { category: "Health Devices", items: [ { name: "Digital BP Monitor", price: "₹1,499", note: "MRP ₹2,200" }, { name: "Glucometer + 25 Strips", price: "₹899", note: "Free demo" }, { name: "Pulse Oximeter", price: "₹699", note: "" }, { name: "Digital Thermometer", price: "₹149", note: "" }, { name: "Compressor Nebulizer", price: "₹1,599", note: "1-yr warranty" } ] },
        { category: "Wellness & Nutrition", items: [ { name: "Multivitamin (60 tabs)", price: "₹399", note: "" }, { name: "Vitamin D3 60K (4 caps)", price: "₹129", note: "" }, { name: "Whey Protein 1 kg", price: "₹2,199", note: "" }, { name: "Chyawanprash 1 kg", price: "₹349", note: "" } ] },
        { category: "Personal & Baby Care", items: [ { name: "Baby Diapers (M, 56 pcs)", price: "₹749", note: "" }, { name: "Sunscreen SPF 50", price: "₹449", note: "" }, { name: "Hand Sanitizer 500 ml", price: "₹199", note: "" }, { name: "Adult Diapers (L, 10 pcs)", price: "₹499", note: "" } ] },
      ] } },
      { type: "imageBanner", content: { title: "Save up to 50% with Generic Medicines", subtitle: "Ask our pharmacist for quality-approved generic alternatives to your prescribed brands.", buttonLabel: "Order Now", buttonHref: "/order", image: "" } },
    ] },
    { slug: "order", title: "Order Medicines", isSystem: true, order: 3, sections: [
      { type: "steps", content: { eyebrow: "SIMPLE & SAFE", title: "How Your", titleHighlight: "Order Works", items: [
        { title: "Send Your Request", text: "Fill the form below with your medicines or prescription details", icon: "edit" },
        { title: "Pharmacist Review", text: "A licensed pharmacist verifies the prescription and checks stock", icon: "user-check" },
        { title: "Confirmation Call", text: "We call you with availability, discounts and the final amount", icon: "phone" },
        { title: "Doorstep Delivery", text: "Pay by UPI, card or cash on delivery", icon: "truck" },
      ] } },
      { type: "quoteForm", style: { background: "light" }, content: { title: "Upload Prescription / Order Enquiry", subtitle: "List your medicines or attach a clear photo of your prescription. A licensed pharmacist will review it and call you to confirm availability and price before dispatch. Prescription medicines are supplied only against a valid prescription.", showSidebar: true } },
      { type: "faq", content: { eyebrow: "GOOD TO KNOW", title: "Ordering", titleHighlight: "FAQs", items: [
        { q: "What if a medicine is out of stock?", a: "Our pharmacist will tell you on the confirmation call and arrange it, usually within 24 hours, or suggest an approved alternative with your consent." },
        { q: "Can I set up monthly refills?", a: "Yes. Mention it in your enquiry and we'll remind you and deliver your regular medicines every month." },
        { q: "Is my prescription kept private?", a: "Absolutely. Your prescription and health details are used only to process your order and are never shared." },
      ] } },
    ] },
    { slug: "lab-tests", title: "Lab Tests", isSystem: true, order: 4, sections: [
      { type: "pricingPlans", content: { eyebrow: "HOME SAMPLE COLLECTION", title: "Health Checkup", titleHighlight: "Packages", plans: [
        { name: "Basic Wellness", price: "₹799", period: "per person", features: ["CBC (Complete Blood Count)", "Blood Sugar (Fasting)", "Lipid Profile", "Free home sample collection", "Reports in 24 hours"], featured: false, buttonLabel: "Book Now", buttonHref: "/lab-tests#book" },
        { name: "Full Body Checkup", price: "₹1,499", period: "per person", features: ["60+ parameters", "Liver & Kidney function", "Thyroid profile (T3, T4, TSH)", "HbA1c & Vitamin D", "Free doctor consultation"], featured: true, buttonLabel: "Book Now", buttonHref: "/lab-tests#book" },
        { name: "Senior Citizen Care", price: "₹2,299", period: "per person", features: ["80+ parameters", "Cardiac risk markers", "Vitamin B12 & D", "Urine routine", "Priority home collection"], featured: false, buttonLabel: "Book Now", buttonHref: "/lab-tests#book" },
      ] } },
      { type: "priceList", style: { background: "light" }, content: { eyebrow: "INDIVIDUAL TESTS", title: "Popular", titleHighlight: "Tests", note: "Tests are processed by our NABL-accredited partner labs. Fasting of 10–12 hours is needed for sugar and lipid tests.", groups: [
        { category: "Blood Tests", items: [ { name: "CBC", price: "₹299", note: "" }, { name: "HbA1c", price: "₹399", note: "" }, { name: "Lipid Profile", price: "₹499", note: "" }, { name: "Thyroid Profile", price: "₹449", note: "" } ] },
        { category: "Vitamins & Others", items: [ { name: "Vitamin D (25-OH)", price: "₹899", note: "" }, { name: "Vitamin B12", price: "₹699", note: "" }, { name: "Liver Function Test", price: "₹599", note: "" }, { name: "Kidney Function Test", price: "₹599", note: "" } ] },
      ] } },
      { type: "appointmentForm", style: { anchorId: "book" }, content: { title: "Book a Lab Test at Home", subtitle: "Pick your package and a convenient date & time — a trained phlebotomist will visit your home for sample collection." } },
    ] },
    { slug: "store", title: "Store Hours", isSystem: true, order: 5, sections: [
      { type: "openingHours", content: { eyebrow: "VISIT US", title: "Store", titleHighlight: "Hours", note: "Home delivery runs during store hours. For urgent late-night needs, call us — we'll do our best to help.", days: [
        { day: "Monday", hours: "8:00 AM – 11:00 PM" }, { day: "Tuesday", hours: "8:00 AM – 11:00 PM" }, { day: "Wednesday", hours: "8:00 AM – 11:00 PM" }, { day: "Thursday", hours: "8:00 AM – 11:00 PM" }, { day: "Friday", hours: "8:00 AM – 11:00 PM" }, { day: "Saturday", hours: "8:00 AM – 11:00 PM" }, { day: "Sunday", hours: "9:00 AM – 10:00 PM" },
      ] } },
      { type: "map", style: { background: "light" }, content: { eyebrow: "LOCATION", title: "Find", titleHighlight: "Our Store", address: "Shop No. 1, Main Market Road, Your City", mapEmbed: "" } },
      { type: "cta", content: { title: "Can't visit the store?", highlight: "We'll Deliver to You", phones: ["9000000000"], buttonLabel: "Order Medicines", buttonHref: "/order" } },
    ] },
    { slug: "contact", title: "Contact", isSystem: true, order: 6, sections: [
      { type: "contactInfo", content: { eyebrow: "REACH US", title: "Get In", titleHighlight: "Touch", address: "Shop No. 1, Main Market Road, Your City", phone: "9000000000", email: "hello@example.com", hours: "Mon–Sat: 8am – 11pm · Sun: 9am – 10pm", mapEmbed: "" } },
      { type: "contactForm", style: { background: "light" }, content: { title: "Send Us a Message", subtitle: "Questions about a medicine, a lab test booking or bulk orders — our team replies quickly." } },
    ] },
  ],
};
