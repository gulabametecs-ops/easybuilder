// The sectors (verticals) the platform offers. Each maps to a website template.
// `status: "live"` means a working demo tenant + template exists today.
// `status: "soon"` sectors appear in the catalog (enquiries captured) but aren't
// purchasable yet — their templates are the ongoing build.

export type VerticalStatus = "live" | "soon";

export type Vertical = {
  id: string;
  name: string;
  tagline: string;
  icon: string; // lucide icon name (see components/marketing/VerticalIcon)
  description: string;
  status: VerticalStatus;
  demoSubdomain?: string; // demo tenant subdomain when live
  demoEmail?: string; // demo admin login (password is always demo1234)
  accent: string; // hex, for catalog card
};

// Shared demo admin password for all live demos.
export const DEMO_PASSWORD = "demo1234";

export const VERTICALS: Vertical[] = [
  {
    id: "home-services",
    name: "Home Services",
    tagline: "Electrical, plumbing, carpentry, painting",
    icon: "wrench",
    description: "Complete home-solution website with services, gallery, quote & appointment booking.",
    status: "live",
    demoSubdomain: "demo",
    demoEmail: "demo@standard.test",
    accent: "#7cb518",
  },
  {
    id: "education-consultancy",
    name: "Education Consultancy",
    tagline: "Study abroad & in-India admissions",
    icon: "graduation",
    description: "Universities, courses, apply forms, counsellors — for education consultants (India + abroad).",
    status: "live",
    demoSubdomain: "demo-edu",
    demoEmail: "demo@edu.test",
    accent: "#2563eb",
  },
  {
    id: "play-school",
    name: "Play School / Preschool",
    tagline: "Nursery, LKG, UKG — ages 2 to 5",
    icon: "baby",
    description: "Playful, colourful website for preschools — programs, daily routine, safety, facilities and admission enquiries.",
    status: "live",
    demoSubdomain: "demo-playschool",
    demoEmail: "demo@play.test",
    accent: "#fb923c",
  },
  {
    id: "primary-school",
    name: "Primary School",
    tagline: "Classes 1 to 5 — ages 5 to 11",
    icon: "backpack",
    description: "Friendly website for primary schools — curriculum, activities, facilities, transport, fees and admissions.",
    status: "live",
    demoSubdomain: "demo-primary",
    demoEmail: "demo@primary.test",
    accent: "#0ea5e9",
  },
  {
    id: "school",
    name: "School (Secondary / Senior)",
    tagline: "CBSE / ICSE / State — classes 6 to 12",
    icon: "school",
    description: "Professional website for schools — streams, faculty, board results & toppers, facilities, notices and admissions.",
    status: "live",
    demoSubdomain: "demo-school",
    demoEmail: "demo@school.test",
    accent: "#1e40af",
  },
  {
    id: "coaching",
    name: "Coaching Institute",
    tagline: "JEE, NEET, UPSC, SSC, tuition",
    icon: "target",
    description: "Results-driven website for coaching centres — batches, expert faculty, toppers & ranks, free demo booking and test series.",
    status: "live",
    demoSubdomain: "demo-coaching",
    demoEmail: "demo@coaching.test",
    accent: "#e11d48",
  },
  {
    id: "restaurant-hotel",
    name: "Restaurant / Hotel",
    tagline: "Restaurants, cafes, pubs & hotels",
    icon: "utensils",
    description: "Menu, gallery, table/room booking and reviews for food & hospitality businesses.",
    status: "live",
    demoSubdomain: "demo-restaurant",
    demoEmail: "demo@restaurant.test",
    accent: "#dc2626",
  },
  {
    id: "hospital-clinic",
    name: "Hospital / Clinic",
    tagline: "Dental, eye, skin, mental & general",
    icon: "stethoscope",
    description: "Departments, doctors, appointment booking and patient enquiries for clinics & hospitals.",
    status: "live",
    demoSubdomain: "demo-hospital",
    demoEmail: "demo@hospital.test",
    accent: "#0891b2",
  },
  {
    id: "wholesale-shop",
    name: "Wholesale Shop",
    tagline: "Wholesale & distribution businesses",
    icon: "store",
    description: "Product catalog, bulk enquiry and quote forms for wholesale shops and distributors.",
    status: "live",
    demoSubdomain: "demo-wholesale",
    demoEmail: "demo@wholesale.test",
    accent: "#7c3aed",
  },
  {
    id: "manufacturing",
    name: "Manufacturing / Bulk Orders",
    tagline: "Product manufacturing & bulk supply",
    icon: "factory",
    description: "Products, capabilities and bulk-order request forms for manufacturers.",
    status: "live",
    demoSubdomain: "demo-mfg",
    demoEmail: "demo@mfg.test",
    accent: "#475569",
  },
  {
    id: "skill-learning",
    name: "Skill Learning",
    tagline: "Karate, music, dance & more",
    icon: "music",
    description: "Classes, batches, trainers and enrollment forms for skill academies.",
    status: "live",
    demoSubdomain: "demo-skill",
    demoEmail: "demo@skill.test",
    accent: "#db2777",
  },
  {
    id: "gym-fitness",
    name: "Gym / Fitness Studio",
    tagline: "Gyms, CrossFit, yoga & personal training",
    icon: "dumbbell",
    description: "High-energy website for gyms and studios — programs, memberships, trainers, class schedule and free-trial booking.",
    status: "live",
    demoSubdomain: "demo-gym",
    demoEmail: "demo@gym.test",
    accent: "#f97316",
  },
  {
    id: "ngo-charity",
    name: "NGO / Charity / Trust",
    tagline: "Causes, programs, donations & volunteers",
    icon: "heart",
    description: "Trustworthy website for NGOs and trusts — causes, impact, donation tiers with 80G note, volunteer sign-up and events.",
    status: "live",
    demoSubdomain: "demo-ngo",
    demoEmail: "demo@ngo.test",
    accent: "#0d9488",
  },
  {
    id: "pharmacy",
    name: "Pharmacy / Medical Store",
    tagline: "Medicines, prescriptions, delivery & lab tests",
    icon: "pill",
    description: "Clean website for chemists — product categories, prescription order enquiries, home delivery, lab test packages and store hours.",
    status: "live",
    demoSubdomain: "demo-pharmacy",
    demoEmail: "demo@pharmacy.test",
    accent: "#059669",
  },
  {
    id: "events-training",
    name: "Events, Webinars & Training",
    tagline: "Webinars, seminars, workshops & corporate training",
    icon: "calendar",
    description: "Online booking website for events and training — upcoming events, speakers, agenda, ticket passes and seat registration.",
    status: "live",
    demoSubdomain: "demo-events",
    demoEmail: "demo@events.test",
    accent: "#6366f1",
  },
];

export function getVertical(id: string): Vertical | undefined {
  return VERTICALS.find((v) => v.id === id);
}

export function verticalName(id: string): string {
  return getVertical(id)?.name ?? id;
}

// ─── Sector categories (for the storefront) ───────────────────────────────────
export const VERTICAL_CATEGORIES = [
  "Schools & Coaching",
  "Home & Local Services",
  "Food & Hospitality",
  "Healthcare",
  "Trade & Manufacturing",
  "Fitness & Wellness",
  "Community & Non-profit",
  "Events & Training",
] as const;

const CATEGORY_OF: Record<string, string> = {
  "education-consultancy": "Schools & Coaching",
  "play-school": "Schools & Coaching",
  "primary-school": "Schools & Coaching",
  "school": "Schools & Coaching",
  "coaching": "Schools & Coaching",
  "skill-learning": "Schools & Coaching",
  "home-services": "Home & Local Services",
  "restaurant-hotel": "Food & Hospitality",
  "hospital-clinic": "Healthcare",
  "wholesale-shop": "Trade & Manufacturing",
  "manufacturing": "Trade & Manufacturing",
  "gym-fitness": "Fitness & Wellness",
  "ngo-charity": "Community & Non-profit",
  "pharmacy": "Healthcare",
  "events-training": "Events & Training",
};

export function categoryOf(id: string): string {
  return CATEGORY_OF[id] ?? "Other";
}

// Verticals grouped by category (only non-empty groups, in the defined order).
export function verticalsByCategory(): { category: string; items: Vertical[] }[] {
  return VERTICAL_CATEGORIES
    .map((category) => ({ category, items: VERTICALS.filter((v) => categoryOf(v.id) === category) }))
    .filter((g) => g.items.length > 0);
}
