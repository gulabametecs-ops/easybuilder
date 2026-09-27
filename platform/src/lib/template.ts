// ─────────────────────────────────────────────────────────────────────────────
// The default "Home Services" template — a full ready-made website.
// A brand-new tenant is provisioned from this blueprint, then the client
// customizes it from their admin panel. This is the recreation of the
// "Standard Services" concept as data (theme + pages + sections + catalogue).
// ─────────────────────────────────────────────────────────────────────────────
import type { ThemeConfig, HeaderConfig, FooterConfig, SeoConfig } from "./config";
import type { PageSeed } from "./templates/types";

export const defaultTheme: ThemeConfig = {
  colors: {
    primary: "#65a30d",
    primaryDark: "#4d7c0f",
    secondary: "#0b2540",
    accent: "#a3e635",
    dark: "#071a2e",
    light: "#f5f8f0",
    text: "#3f4b5c",
    heading: "#0b2540",
  },
  font: "Plus Jakarta Sans",
  radius: "1rem",
};

const PHONES = ["9014469297", "6300194229"];

export const defaultHeader = (biz: string): HeaderConfig => ({
  design: "classic",
  logoText: biz,
  logoImage: "",
  announcement: { show: false, text: "🎉 First booking? Get 10% off any home service — book today!", link: "/quote" },
  topbar: {
    show: true,
    address: "Tolichowki, Shaikpet, Manikonda, Alkapur, Narsingi, Gachibowli",
    phones: PHONES,
    email: "hello@example.com",
    social: { facebook: "#", instagram: "#", whatsapp: "#" },
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Pricing", href: "/pricing" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact Us", href: "/contact" },
  ],
  cta: { label: "Get Free Quote", href: "/quote" },
});

export const defaultFooter = (biz: string): FooterConfig => ({
  about: "Electrical, plumbing, carpentry and painting — one trusted team for every job in your home. Verified technicians, upfront pricing and a 30-day service warranty.",
  columns: [
    {
      title: "Quick Links",
      links: [
        { label: "Home", href: "/" },
        { label: "About Us", href: "/about" },
        { label: "Services", href: "/services" },
        { label: "Pricing & AMC", href: "/pricing" },
        { label: "Gallery", href: "/gallery" },
        { label: "Contact Us", href: "/contact" },
      ],
    },
    {
      title: "Our Services",
      links: [
        { label: "Electrical Services", href: "/services" },
        { label: "Plumbing Services", href: "/services" },
        { label: "Carpentry & Interior Works", href: "/services" },
        { label: "Painting Services", href: "/services" },
        { label: "Annual Maintenance Plans", href: "/pricing" },
      ],
    },
  ],
  serviceAreas: ["Tolichowki", "Shaikpet", "Manikonda", "Alkapur", "Narsingi", "Gachibowli"],
  contact: {
    phones: PHONES,
    email: "hello@example.com",
    address: "Tolichowki, Shaikpet, Manikonda, Alkapur, Narsingi, Gachibowli, Hyderabad, Telangana",
  },
  social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
  copyright: `© ${"{year}"} ${biz}. All Rights Reserved.`,
});

export const defaultSeo = (biz: string): SeoConfig => ({
  title: `${biz} — Electricians, Plumbers, Carpenters & Painters in Hyderabad`,
  description:
    "Verified electricians, plumbers, carpenters and painters at your doorstep. Upfront pricing, same-day visits and a 30-day service warranty. Book a free quote today.",
  favicon: "",
  ogImage: "",
  keywords: "electrician, plumber, carpenter, painter, home repair, home maintenance, AMC, Hyderabad",
  twitterHandle: "",
  ogType: "website",
  gaId: "",
  gtmId: "",
  fbPixelId: "",
  clarityId: "",
  googleVerification: "",
  bingVerification: "",
  indexable: true,
  robotsFollow: true,
  localBusiness: true,
  businessType: "HomeAndConstructionBusiness",
  priceRange: "₹₹",
  geoLat: "",
  geoLng: "",
  ratingValue: "",
  ratingCount: "",
  faqSchema: true,
});

// ─── Services catalogue (category → items) ───────────────────────────────────
export const defaultServices: { category: string; title: string; description: string }[] = [
  // Electrical & Home Maintenance
  { category: "Electrical & Home Maintenance", title: "House Electrical Wiring", description: "ISI-grade wiring with neat concealed conduits and proper load planning." },
  { category: "Electrical & Home Maintenance", title: "New Construction & Renovation Electrical Works", description: "Complete electrical layouts for new builds and renovations, start to handover." },
  { category: "Electrical & Home Maintenance", title: "Earthing Installation & Maintenance", description: "Tested earthing that protects your family and your appliances." },
  { category: "Electrical & Home Maintenance", title: "Inverter & UPS Installation", description: "Right-sized backup so power cuts never stop your day." },
  { category: "Electrical & Home Maintenance", title: "Fan, Light & Switch Installation", description: "Fans, lights, chandeliers and modular switches fitted cleanly." },
  { category: "Electrical & Home Maintenance", title: "AC Installation, Repair & Service", description: "Installation, gas top-up and deep-clean servicing for all brands." },
  { category: "Electrical & Home Maintenance", title: "Washing Machine Repair & Service", description: "Front and top-load repairs with genuine spare parts." },
  { category: "Electrical & Home Maintenance", title: "Refrigerator Repair & Service", description: "Cooling, gas and compressor issues diagnosed and fixed on-site." },
  { category: "Electrical & Home Maintenance", title: "Geyser Installation & Repair", description: "Safe mounting, thermostat and element repairs for every model." },
  { category: "Electrical & Home Maintenance", title: "Water Motor Installation & Maintenance", description: "Motors, pumps and auto-controllers installed and serviced." },
  // Plumbing
  { category: "Plumbing", title: "CPVC & UPVC Pipeline Works", description: "Leak-proof, long-life pipelines for new homes and upgrades." },
  { category: "Plumbing", title: "Bathroom & Kitchen Plumbing", description: "Complete fit-outs — inlets, outlets, sinks and drainage." },
  { category: "Plumbing", title: "Water Tank Installation", description: "Overhead and sump tanks fitted, connected and cleaned." },
  { category: "Plumbing", title: "Leak Detection & Repairs", description: "Find the leak fast, fix it without breaking the whole wall." },
  { category: "Plumbing", title: "Tap, Shower & Sanitary Fittings", description: "Taps, mixers, rain showers and WCs fitted to perfection." },
  // Carpentry & Interior
  { category: "Carpentry & Interior", title: "Wooden Wardrobes", description: "Made-to-measure wardrobes with soft-close hardware." },
  { category: "Carpentry & Interior", title: "Modular Kitchens", description: "Smart, easy-clean kitchens designed around how you cook." },
  { category: "Carpentry & Interior", title: "TV Units & Storage Cabinets", description: "Sleek units that hide the clutter and show off the space." },
  { category: "Carpentry & Interior", title: "Doors & Windows Installation", description: "Precise fitting, smooth operation, zero gaps." },
  { category: "Carpentry & Interior", title: "Furniture Repair & Custom Woodwork", description: "Repairs, polishing and one-off custom pieces." },
  // Painting
  { category: "Painting", title: "Interior Wall Painting", description: "Dust-free painting with putty, primer and premium emulsions." },
  { category: "Painting", title: "Exterior Painting", description: "Weather-shield finishes that stay bright through every monsoon." },
  { category: "Painting", title: "Texture & Decorative Finishes", description: "Designer textures and accent walls that transform a room." },
  { category: "Painting", title: "Waterproof Coating", description: "Terrace and wall waterproofing that stops seepage for good." },
];

export const defaultGallery: { category: string; caption: string }[] = [
  ...["Electrical panel", "Pendant lights", "Meter box wiring", "Modular switches", "Inverter setup", "Ceiling fan"].map((c) => ({ category: "Electrical & Home Maintenance", caption: c })),
  ...["Pipeline works", "Wash basin", "Water tanks", "Pipe repair", "Rain shower", "Sanitary fittings"].map((c) => ({ category: "Plumbing", caption: c })),
  ...["Wardrobe", "Modular kitchen", "TV unit", "Wooden door", "Custom woodwork"].map((c) => ({ category: "Carpentry & Interior", caption: c })),
  ...["Interior painting", "Exterior painting", "Texture finish", "Accent wall", "Waterproof coating"].map((c) => ({ category: "Painting", caption: c })),
];

// ─── Pages + their sections ──────────────────────────────────────────────────
const CATEGORIES = ["Electrical & Home Maintenance", "Plumbing", "Carpentry & Interior", "Painting"];

const cta = {
  type: "cta" as const,
  content: {
    title: "Something needs fixing?",
    highlight: "A Verified Expert Is One Call Away",
    phones: PHONES,
    buttonLabel: "Get Free Quote",
    buttonHref: "/quote",
  },
};

const plans = {
  type: "pricingPlans" as const,
  content: {
    eyebrow: "HOME CARE PLANS",
    title: "Annual Maintenance,",
    titleHighlight: "Zero Stress",
    plans: [
      {
        name: "Essential", price: "₹2,999", period: "/year",
        features: ["2 scheduled home check-ups", "Electrical & plumbing inspection", "Free visiting charges on repairs", "10% off spare parts"],
        featured: false, buttonLabel: "Choose Essential", buttonHref: "/quote",
      },
      {
        name: "Family", price: "₹5,999", period: "/year",
        features: ["4 scheduled home check-ups", "AC service ×2 (up to 2 units)", "Water tank cleaning ×1", "Priority same-day visits", "15% off spare parts"],
        featured: true, buttonLabel: "Choose Family", buttonHref: "/quote",
      },
      {
        name: "Premium", price: "₹9,999", period: "/year",
        features: ["Unlimited breakdown visits", "AC service ×3 (up to 4 units)", "Water tank cleaning ×2", "Dedicated service manager", "20% off spare parts & labour"],
        featured: false, buttonLabel: "Choose Premium", buttonHref: "/quote",
      },
    ],
  },
};

const steps = {
  type: "steps" as const,
  content: {
    eyebrow: "HOW IT WORKS",
    title: "Booked in Minutes,",
    titleHighlight: "Fixed the Same Day",
    items: [
      { title: "Tell Us the Problem", text: "Call, WhatsApp or fill the quick form — takes under a minute.", icon: "edit" },
      { title: "Get an Upfront Quote", text: "Clear pricing before any work starts. No surprises on the bill.", icon: "clipboard" },
      { title: "Expert at Your Door", text: "A verified technician arrives on time, fully equipped.", icon: "user-check" },
      { title: "Job Done, Warranty On", text: "Clean finish, site tidied up, and a 30-day service warranty.", icon: "shield" },
    ],
  },
};

export function defaultPages(biz: string): PageSeed[] {
  return [
    {
      slug: "home",
      title: "Home",
      isSystem: true,
      order: 0,
      sections: [
        {
          type: "hero",
          content: {
            variant: "split",
            customHtml: "",
            badge: "VERIFIED EXPERTS · UPFRONT PRICING · 30-DAY WARRANTY",
            titleTop: "Every Home Repair,",
            titleHighlight: "One Trusted Team",
            subtitle: "",
            description:
              `Electricians, plumbers, carpenters and painters — ${biz} sends background-verified experts to your door, often the same day, with prices agreed before work begins.`,
            image: "",
            primaryBtn: { label: "Book a Visit", href: "/quote" },
            secondaryBtn: { label: "Explore Services", href: "/services" },
            features: [
              { icon: "user-check", title: "Verified Technicians", text: "" },
              { icon: "zap", title: "Same-Day Visits", text: "" },
              { icon: "tag", title: "Upfront Pricing", text: "" },
              { icon: "shield", title: "30-Day Warranty", text: "" },
            ],
          },
        },
        {
          type: "features",
          content: {
            items: [
              { icon: "user-check", title: "Background-Verified", text: "Every technician is ID-checked, trained and reviewed by real customers." },
              { icon: "tag", title: "Transparent Rates", text: "You approve the quote first. No hidden charges, no upselling." },
              { icon: "clock", title: "On Time, Every Time", text: "Punctual arrivals with a 2-hour slot you choose." },
              { icon: "shield", title: "Work Guaranteed", text: "Something not right? We come back and fix it free for 30 days." },
            ],
          },
          style: { cardShadow: "md" },
        },
        {
          type: "about",
          content: {
            eyebrow: "ABOUT US",
            title: "The Only Number You Need",
            titleHighlight: "For Your Home",
            body: [
              `${biz} started with a simple idea: homeowners shouldn't need five different contacts to keep one house running. Today our in-house team handles electrical, plumbing, carpentry and painting — all under one roof.`,
              "We turn up on time, explain the problem in plain words, quote honestly and leave your home cleaner than we found it.",
            ],
            image: "",
            points: [
              "Trained, uniformed and verified professionals",
              "Genuine materials with bills",
              "Fixed quotes before work starts",
              "Clean-up included on every job",
              "30-day service warranty",
            ],
            buttonLabel: "Know More About Us",
            buttonHref: "/about",
          },
        },
        {
          type: "serviceCategories",
          content: {
            eyebrow: "OUR SERVICES",
            title: "Everything Your Home Needs,",
            titleHighlight: "Handled",
            categories: CATEGORIES,
          },
        },
        {
          type: "stats",
          content: {
            items: [
              { value: "5,000+", label: "Jobs Completed", icon: "home" },
              { value: "4.8★", label: "Average Rating", icon: "star" },
              { value: "25+", label: "In-House Experts", icon: "wrench" },
              { value: "8+", label: "Years in Hyderabad", icon: "award" },
            ],
          },
        },
        steps,
        plans,
        {
          type: "testimonials",
          content: {
            eyebrow: "CUSTOMER STORIES",
            title: "Homeowners Who",
            titleHighlight: "Trust Us",
            items: [
              { name: "Ramesh Reddy", role: "Manikonda", text: "Complete rewiring of our 3BHK done in two days. The team was punctual, neat and the final bill matched the quote exactly.", rating: 5 },
              { name: "Ayesha Siddiqui", role: "Tolichowki", text: "Had a bathroom leak nobody could trace. They found it in 20 minutes without breaking tiles. Very professional.", rating: 5 },
              { name: "Suresh Kumar", role: "Gachibowli", text: "Got our modular kitchen and wardrobes done here. Finish quality is excellent and they delivered a week early.", rating: 5 },
              { name: "Priya Nair", role: "Narsingi", text: "We're on the Family AMC plan — AC servicing, tank cleaning, everything happens on schedule. Zero follow-ups needed.", rating: 5 },
            ],
          },
        },
        {
          type: "faq",
          content: {
            eyebrow: "FAQ",
            title: "Questions,",
            titleHighlight: "Answered",
            items: [
              { q: "How quickly can a technician reach me?", a: "For most areas we serve, same-day visits are available when you book before 2 PM. Emergency electrical and plumbing calls are prioritised." },
              { q: "Is there a visiting or inspection charge?", a: "A small inspection charge applies only if you decide not to go ahead with the work. AMC members never pay visiting charges." },
              { q: "Do you provide the materials?", a: "Yes. We supply genuine, branded materials with bills, or we can work with materials you have already bought — your choice." },
              { q: "What does the 30-day warranty cover?", a: "If the same issue comes back within 30 days of our service, we fix it again at no labour cost." },
              { q: "Which areas do you serve?", a: "Tolichowki, Shaikpet, Manikonda, Alkapur, Narsingi, Gachibowli and nearby localities across Hyderabad." },
              { q: "How can I pay?", a: "UPI, cards, net banking or cash — pay after the job is done and you are satisfied." },
            ],
          },
        },
        cta,
      ],
    },
    {
      slug: "about",
      title: "About Us",
      isSystem: true,
      order: 1,
      sections: [
        {
          type: "about",
          content: {
            eyebrow: "WHO WE ARE",
            title: "Complete Home Solutions",
            titleHighlight: "Under One Roof",
            body: [
              `${biz} is a team of skilled electricians, plumbers, carpenters and painters serving families across Hyderabad. We built the company around the things homeowners actually care about — punctuality, honest pricing and work that lasts.`,
              "From a tripping switch to a full home renovation, every job gets the same care: a clear diagnosis, a fixed quote, quality materials and a clean finish.",
            ],
            image: "",
            points: ["Trusted & reliable", "Skilled in-house professionals", "On-time, every time", "Warranty on every job"],
            buttonLabel: "",
            buttonHref: "",
          },
        },
        {
          type: "features",
          content: {
            items: [
              { icon: "handshake", title: "Honesty First", text: "We only recommend work your home really needs." },
              { icon: "badge-check", title: "Quality Materials", text: "Branded, ISI-marked parts — never cheap substitutes." },
              { icon: "users", title: "Trained Team", text: "Regular skill and safety training for every technician." },
              { icon: "heart", title: "Respect for Your Home", text: "Shoe covers, dust sheets and full clean-up, always." },
            ],
          },
        },
        {
          type: "stats",
          content: {
            items: [
              { value: "3,000+", label: "Happy Families", icon: "users" },
              { value: "5,000+", label: "Jobs Completed", icon: "clipboard" },
              { value: "25+", label: "Skilled Technicians", icon: "wrench" },
              { value: "8+", label: "Years of Experience", icon: "award" },
            ],
          },
        },
        cta,
      ],
    },
    {
      slug: "services",
      title: "Services",
      isSystem: true,
      order: 2,
      sections: [
        {
          type: "serviceCategories",
          content: { eyebrow: "", title: "Our", titleHighlight: "Services", categories: CATEGORIES },
        },
        steps,
        cta,
      ],
    },
    {
      slug: "gallery",
      title: "Gallery",
      isSystem: true,
      order: 3,
      sections: [
        { type: "gallery", content: { eyebrow: "", title: "Our", titleHighlight: "Work" } },
        cta,
      ],
    },
    {
      slug: "contact",
      title: "Contact Us",
      isSystem: true,
      order: 4,
      sections: [
        {
          type: "contactForm",
          content: { title: "Contact", subtitle: "Call, WhatsApp or send a message — we usually respond within 30 minutes." },
        },
      ],
    },
    {
      slug: "quote",
      title: "Get a Quote",
      isSystem: true,
      order: 5,
      sections: [
        {
          type: "quoteForm",
          content: {
            title: "Request Your Free Quote",
            subtitle: "Tell us what needs doing — we'll call back with a clear, fixed price and the earliest slot.",
            showSidebar: true,
          },
        },
        steps,
      ],
    },
    {
      slug: "pricing",
      title: "Pricing",
      isSystem: true,
      order: 6,
      sections: [
        {
          type: "priceList",
          content: {
            eyebrow: "RATE CARD",
            title: "Popular Jobs,",
            titleHighlight: "Clear Prices",
            note: "Starting prices for labour. Materials are charged at MRP with bills. Final quote shared before work begins.",
            groups: [
              { category: "Electrical", items: [
                { name: "Fan / light installation", price: "₹199", note: "per point" },
                { name: "Switchboard repair", price: "₹149", note: "" },
                { name: "Inverter installation", price: "₹499", note: "" },
                { name: "AC service (split)", price: "₹549", note: "per unit" },
              ] },
              { category: "Plumbing", items: [
                { name: "Tap / mixer replacement", price: "₹199", note: "" },
                { name: "Leak detection & repair", price: "₹399", note: "onwards" },
                { name: "Water tank cleaning", price: "₹799", note: "up to 1000 L" },
              ] },
              { category: "Carpentry & Painting", items: [
                { name: "Door lock / hinge repair", price: "₹249", note: "" },
                { name: "Interior painting", price: "₹14", note: "per sq ft" },
                { name: "Terrace waterproofing", price: "₹45", note: "per sq ft" },
              ] },
            ],
          },
        },
        plans,
        cta,
      ],
    },
  ];
}
