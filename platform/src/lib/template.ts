// ─────────────────────────────────────────────────────────────────────────────
// The default "Home Services" template — a full ready-made website.
// A brand-new tenant is provisioned from this blueprint, then the client
// customizes it from their admin panel. This is the recreation of the
// "Standard Services" concept as data (theme + pages + sections + catalogue).
// ─────────────────────────────────────────────────────────────────────────────
import type {
  ThemeConfig,
  HeaderConfig,
  FooterConfig,
  SeoConfig,
  SectionContentMap,
} from "./config";

export const defaultTheme: ThemeConfig = {
  colors: {
    primary: "#7cb518",
    primaryDark: "#5c8a12",
    secondary: "#0f2942",
    accent: "#8bc34a",
    dark: "#0a1f33",
    light: "#f4f7ee",
    text: "#334155",
    heading: "#0f2942",
  },
  font: "Poppins",
  radius: "0.9rem",
};

export const defaultHeader = (biz: string): HeaderConfig => ({
  logoText: biz,
  logoImage: "",
  announcement: { show: false, text: "🎉 Special offer — Get 10% off your first service!", link: "/quote" },
  topbar: {
    show: true,
    address: "Tolichowki, Shaikpet, Manikonda, Alkapur, Narsingi, Gachibowli",
    phones: ["9014469297", "6300194229"],
    email: "hello@example.com",
    social: { facebook: "#", instagram: "#", whatsapp: "#" },
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact Us", href: "/contact" },
  ],
  cta: { label: "Get Free Quote", href: "/quote" },
});

export const defaultFooter = (biz: string): FooterConfig => ({
  about: "COMPLETE HOME SOLUTION UNDER ONE ROOF",
  columns: [
    {
      title: "Quick Links",
      links: [
        { label: "Home", href: "/" },
        { label: "About Us", href: "/about" },
        { label: "Services", href: "/services" },
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
        { label: "Maintenance Services", href: "/services" },
      ],
    },
  ],
  serviceAreas: ["Tolichowki", "Shaikpet", "Manikonda", "Alkapur", "Narsingi", "Gachibowli"],
  contact: {
    phones: ["9014469297", "6300194229"],
    email: "hello@example.com",
    address: "Tolichowki, Shaikpet, Manikonda, Alkapur, Narsingi, Gachibowli, Hyderabad, Telangana",
  },
  social: { facebook: "#", instagram: "#", whatsapp: "#", location: "#" },
  copyright: `© ${"{year}"} ${biz}. All Rights Reserved.`,
});

export const defaultSeo = (biz: string): SeoConfig => ({
  title: `${biz} — Complete Home Solution Under One Roof`,
  description:
    "Electrical, plumbing, carpentry and painting — all home services with quality, trust & perfection.",
  favicon: "",
  ogImage: "",
  keywords: "",
  twitterHandle: "",
  gaId: "",
  googleVerification: "",
  indexable: true,
  localBusiness: true,
  businessType: "LocalBusiness",
  priceRange: "₹₹",
  geoLat: "",
  geoLng: "",
});

// ─── Services catalogue (category → items) ───────────────────────────────────
export const defaultServices: { category: string; title: string; description: string }[] = [
  // Electrical & Home Maintenance
  { category: "Electrical & Home Maintenance", title: "House Electrical Wiring", description: "Safe & reliable wiring for homes." },
  { category: "Electrical & Home Maintenance", title: "New Construction & Renovation Electrical Works", description: "Complete electrical for new & renovated buildings." },
  { category: "Electrical & Home Maintenance", title: "Earthing Installation & Maintenance", description: "Proper earthing for safety." },
  { category: "Electrical & Home Maintenance", title: "Inverter & UPS Installation", description: "Backup power solutions." },
  { category: "Electrical & Home Maintenance", title: "Fan, Light & Switch Installation", description: "Fittings installed neatly." },
  { category: "Electrical & Home Maintenance", title: "AC Installation, Repair & Service", description: "All AC services." },
  { category: "Electrical & Home Maintenance", title: "Washing Machine Repair & Service", description: "Quick appliance repair." },
  { category: "Electrical & Home Maintenance", title: "Refrigerator Repair & Service", description: "Cooling issues fixed." },
  { category: "Electrical & Home Maintenance", title: "Geyser Installation & Repair", description: "Hot water, sorted." },
  { category: "Electrical & Home Maintenance", title: "Water Motor Installation & Maintenance", description: "Motors & pumps." },
  // Plumbing
  { category: "Plumbing", title: "CPVC & UPVC Pipeline Works", description: "Durable pipeline fitting." },
  { category: "Plumbing", title: "Bathroom & Kitchen Plumbing", description: "Complete plumbing works." },
  { category: "Plumbing", title: "Water Tank Installation", description: "Tanks fitted & connected." },
  { category: "Plumbing", title: "Leak Detection & Repairs", description: "Stop leaks fast." },
  { category: "Plumbing", title: "Tap, Shower & Sanitary Fittings", description: "Quality fittings." },
  // Carpentry & Interior
  { category: "Carpentry & Interior", title: "Wooden Wardrobes", description: "Custom wardrobes." },
  { category: "Carpentry & Interior", title: "Modular Kitchens", description: "Modern modular kitchens." },
  { category: "Carpentry & Interior", title: "TV Units & Storage Cabinets", description: "Smart storage." },
  { category: "Carpentry & Interior", title: "Doors & Windows Installation", description: "Neat installation." },
  { category: "Carpentry & Interior", title: "Furniture Repair & Custom Woodwork", description: "Repairs & custom work." },
  // Painting
  { category: "Painting", title: "Interior Wall Painting", description: "Fresh interiors." },
  { category: "Painting", title: "Exterior Painting", description: "Weatherproof exteriors." },
  { category: "Painting", title: "Texture & Decorative Finishes", description: "Designer finishes." },
  { category: "Painting", title: "Waterproof Coating", description: "Long-lasting protection." },
];

export const defaultGallery: { category: string; caption: string }[] = [
  ...["Electrical panel", "Pendant lights", "Meter box wiring", "Modular switches", "Inverter setup", "Ceiling fan"].map((c) => ({ category: "Electrical & Home Maintenance", caption: c })),
  ...["Pipeline works", "Wash basin", "Water tanks", "Pipe repair", "Rain shower", "Sanitary fittings"].map((c) => ({ category: "Plumbing", caption: c })),
  ...["Wardrobe", "Modular kitchen", "TV unit", "Wooden door", "Custom woodwork"].map((c) => ({ category: "Carpentry & Interior", caption: c })),
  ...["Interior painting", "Exterior painting", "Texture finish", "Accent wall", "Waterproof coating"].map((c) => ({ category: "Painting", caption: c })),
];

// ─── Pages + their sections ──────────────────────────────────────────────────
type SectionSeed<T extends keyof SectionContentMap = keyof SectionContentMap> = {
  type: T;
  content: SectionContentMap[T];
};
type PageSeed = {
  slug: string;
  title: string;
  isSystem: boolean;
  order: number;
  sections: SectionSeed[];
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
            variant: "classic",
            customHtml: "",
            badge: "PROFESSIONAL · RELIABLE · AFFORDABLE",
            titleTop: "Complete Home Solution",
            titleHighlight: "Under One Roof",
            subtitle: "",
            description:
              "From electrical work to plumbing, carpentry to painting — we provide all home services with quality, trust & perfection.",
            image: "",
            primaryBtn: { label: "Call Now", href: "tel:9014469297" },
            secondaryBtn: { label: "Our Services", href: "/services" },
            features: [
              { icon: "user-check", title: "Skilled Technicians", text: "" },
              { icon: "badge-check", title: "Quality Workmanship", text: "" },
              { icon: "tag", title: "Affordable Pricing", text: "" },
              { icon: "clock", title: "On-Time Completion", text: "" },
            ],
          },
        },
        {
          type: "about",
          content: {
            eyebrow: "ABOUT US",
            title: "We Provide Reliable &",
            titleHighlight: "Complete Home Solutions",
            body: [
              `At ${biz}, we are committed to delivering reliable, high-quality and complete home solutions under one roof.`,
              "Our skilled team ensures every job is done with professionalism, honesty and your complete satisfaction.",
            ],
            image: "",
            points: [
              "Experienced & Verified Technicians",
              "Quality Workmanship",
              "Affordable Pricing",
              "On-Time Service",
              "Customer Satisfaction Guaranteed",
            ],
            buttonLabel: "Know More About Us",
            buttonHref: "/about",
          },
        },
        {
          type: "serviceCategories",
          content: {
            eyebrow: "OUR SERVICES",
            title: "Explore Our",
            titleHighlight: "Services",
            categories: ["Electrical & Home Maintenance", "Plumbing", "Carpentry & Interior", "Painting"],
          },
        },
        {
          type: "stats",
          content: {
            items: [
              { value: "500+", label: "Projects Completed", icon: "home" },
              { value: "100%", label: "Happy Customers", icon: "users" },
              { value: "10+", label: "Expert Technicians", icon: "wrench" },
              { value: "5+", label: "Years of Experience", icon: "award" },
            ],
          },
        },
        {
          type: "cta",
          content: {
            title: "Need Any Help?",
            highlight: "We're Just a Call Away",
            phones: ["9014469297", "6300194229"],
            buttonLabel: "Get Free Quote",
            buttonHref: "/quote",
          },
        },
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
            title: "Complete Home Solution",
            titleHighlight: "Under One Roof",
            body: [
              `At ${biz}, we are committed to delivering reliable, high-quality and complete home solutions under one roof. Our skilled team ensures every job is done with professionalism, honesty and your complete satisfaction.`,
              "From small repairs to complete installations, we handle everything with care and precision.",
            ],
            image: "",
            points: ["Trusted & Reliable", "Skilled Professionals", "On-Time Service"],
            buttonLabel: "",
            buttonHref: "",
          },
        },
        {
          type: "stats",
          content: {
            items: [
              { value: "500+", label: "Happy Customers", icon: "users" },
              { value: "1000+", label: "Projects Completed", icon: "clipboard" },
              { value: "10+", label: "Skilled Technicians", icon: "wrench" },
              { value: "5+", label: "Years of Experience", icon: "award" },
            ],
          },
        },
        {
          type: "cta",
          content: {
            title: "Need Any Help?",
            highlight: "We're Just a Call Away",
            phones: ["9014469297", "6300194229"],
            buttonLabel: "Get Free Quote",
            buttonHref: "/quote",
          },
        },
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
          content: {
            eyebrow: "",
            title: "Our",
            titleHighlight: "Services",
            categories: ["Electrical & Home Maintenance", "Plumbing", "Carpentry & Interior", "Painting"],
          },
        },
        {
          type: "cta",
          content: {
            title: "Need Any Help?",
            highlight: "We're Just a Call Away",
            phones: ["9014469297", "6300194229"],
            buttonLabel: "Get Free Quote",
            buttonHref: "/quote",
          },
        },
      ],
    },
    {
      slug: "gallery",
      title: "Gallery",
      isSystem: true,
      order: 3,
      sections: [
        {
          type: "gallery",
          content: { eyebrow: "", title: "Our", titleHighlight: "Gallery" },
        },
        {
          type: "cta",
          content: {
            title: "Need Any Help?",
            highlight: "We're Just a Call Away",
            phones: ["9014469297", "6300194229"],
            buttonLabel: "Get Free Quote",
            buttonHref: "/quote",
          },
        },
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
          content: { title: "Contact", subtitle: "We'd love to hear from you. Reach out and we'll respond quickly." },
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
            subtitle: "Tell us about your requirement and we'll get back with the best solution and pricing.",
            showSidebar: true,
          },
        },
        {
          type: "steps",
          content: {
            eyebrow: "",
            title: "How It",
            titleHighlight: "Works",
            items: [
              { title: "Fill the Form", text: "Submit your requirements", icon: "edit" },
              { title: "We Contact You", text: "Our team will call you for details", icon: "headset" },
              { title: "Get a Quote", text: "Receive best quote from our experts", icon: "clipboard" },
              { title: "Schedule Service", text: "Choose the time that suits you", icon: "calendar" },
              { title: "We Get It Done", text: "Sit back and relax, we'll handle the rest", icon: "home" },
            ],
          },
        },
      ],
    },
  ];
}
