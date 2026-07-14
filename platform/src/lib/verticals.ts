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
    id: "school-coaching",
    name: "School / Coaching",
    tagline: "Schools, coaching & tuition centres",
    icon: "school",
    description: "Courses, faculty, admissions, results and enquiry forms for schools and coaching institutes.",
    status: "live",
    demoSubdomain: "demo-school",
    demoEmail: "demo@school.test",
    accent: "#f59e0b",
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
];

export function getVertical(id: string): Vertical | undefined {
  return VERTICALS.find((v) => v.id === id);
}

export function verticalName(id: string): string {
  return getVertical(id)?.name ?? id;
}
