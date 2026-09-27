import type { WebsiteBlueprint } from "./blueprintSchema";
import { canonicalPageSlug, completeHomePage } from "./completeHome";

type PageSeed = { name: string; slug: string; pageTemplateId: string };

type Playbook = {
  keywords: string[];
  websiteType: string;
  pages: PageSeed[];
  requirements: string[];
};

const PLAYBOOKS: Playbook[] = [
  {
    keywords: ["ngo", "nonprofit", "non-profit", "charity", "foundation", "trust", "volunteer", "donation", "csr", "social work"],
    websiteType: "ngo",
    pages: [
      { name: "Home", slug: "home", pageTemplateId: "landing" },
      { name: "About Us", slug: "about", pageTemplateId: "about" },
      { name: "Our Programs", slug: "programs", pageTemplateId: "services" },
      { name: "Impact", slug: "impact", pageTemplateId: "about" },
      { name: "Get Involved", slug: "get-involved", pageTemplateId: "contact" },
      { name: "Gallery", slug: "gallery", pageTemplateId: "gallery" },
      { name: "Contact", slug: "contact", pageTemplateId: "contact" },
    ],
    requirements: [
      "NGO / trust registration number",
      "Office address and helpline number",
      "Donation UPI, bank details or payment link",
      "80G / CSR certificate info (if applicable)",
    ],
  },
  {
    keywords: ["restaurant", "cafe", "food", "dining", "menu", "catering", "bakery"],
    websiteType: "restaurant",
    pages: [
      { name: "Home", slug: "home", pageTemplateId: "landing" },
      { name: "Menu", slug: "menu", pageTemplateId: "fees" },
      { name: "Gallery", slug: "gallery", pageTemplateId: "gallery" },
      { name: "About", slug: "about", pageTemplateId: "about" },
      { name: "Book a Table", slug: "booking", pageTemplateId: "booking" },
      { name: "Contact", slug: "contact", pageTemplateId: "contact" },
    ],
    requirements: ["Restaurant address & map pin", "Opening hours", "Reservation phone / WhatsApp", "Special dietary options"],
  },
  {
    keywords: ["school", "college", "university", "academy", "education", "institute"],
    websiteType: "school",
    pages: [
      { name: "Home", slug: "home", pageTemplateId: "landing" },
      { name: "About", slug: "about", pageTemplateId: "about" },
      { name: "Admissions", slug: "admissions", pageTemplateId: "contact" },
      { name: "Notices", slug: "notices", pageTemplateId: "notices" },
      { name: "Results", slug: "results", pageTemplateId: "results" },
      { name: "Gallery", slug: "gallery", pageTemplateId: "gallery" },
      { name: "Contact", slug: "contact", pageTemplateId: "contact" },
    ],
    requirements: ["School address & contact numbers", "Admission dates & fee structure", "Affiliation / board details", "Transport or hostel info"],
  },
  {
    keywords: ["coaching", "tuition", "jee", "neet", "competitive", "classes"],
    websiteType: "coaching",
    pages: [
      { name: "Home", slug: "home", pageTemplateId: "landing" },
      { name: "Courses", slug: "courses", pageTemplateId: "services" },
      { name: "Results", slug: "results", pageTemplateId: "results" },
      { name: "Faculty", slug: "faculty", pageTemplateId: "team" },
      { name: "Admissions", slug: "admissions", pageTemplateId: "contact" },
      { name: "Contact", slug: "contact", pageTemplateId: "contact" },
    ],
    requirements: ["Centre address & batch timings", "Course fees & duration", "Demo class booking number", "Past results / achievements"],
  },
  {
    keywords: ["agency", "marketing", "digital", "seo", "branding", "advertising", "studio"],
    websiteType: "agency",
    pages: [
      { name: "Home", slug: "home", pageTemplateId: "landing" },
      { name: "Services", slug: "services", pageTemplateId: "services" },
      { name: "Portfolio", slug: "portfolio", pageTemplateId: "gallery" },
      { name: "Pricing", slug: "pricing", pageTemplateId: "pricing" },
      { name: "About", slug: "about", pageTemplateId: "about" },
      { name: "Contact", slug: "contact", pageTemplateId: "contact" },
    ],
    requirements: ["Business email & phone", "Service areas or industries served", "Portfolio case studies", "Consultation booking link"],
  },
  {
    keywords: ["clinic", "hospital", "doctor", "medical", "health", "dental", "physio"],
    websiteType: "healthcare",
    pages: [
      { name: "Home", slug: "home", pageTemplateId: "landing" },
      { name: "Services", slug: "services", pageTemplateId: "services" },
      { name: "Doctors", slug: "doctors", pageTemplateId: "team" },
      { name: "Book Appointment", slug: "appointment", pageTemplateId: "booking" },
      { name: "Contact", slug: "contact", pageTemplateId: "contact" },
    ],
    requirements: ["Clinic address & emergency number", "Doctor qualifications", "OPD / appointment timings", "Insurance or payment modes"],
  },
];

const DEFAULT_PAGES: PageSeed[] = [
  { name: "Home", slug: "home", pageTemplateId: "landing" },
  { name: "About", slug: "about", pageTemplateId: "about" },
  { name: "Services", slug: "services", pageTemplateId: "services" },
  { name: "Contact", slug: "contact", pageTemplateId: "contact" },
];

function detectPlaybook(text: string): Playbook | null {
  const lower = text.toLowerCase();
  for (const pb of PLAYBOOKS) {
    if (pb.keywords.some((k) => lower.includes(k))) return pb;
  }
  return null;
}

function mergePages(existing: WebsiteBlueprint["pages"], seeds: PageSeed[]): WebsiteBlueprint["pages"] {
  const merged = existing.map((p) => ({
    ...p,
    slug: canonicalPageSlug(p.slug || p.name, p.name),
  }));
  const bySlug = new Map(merged.map((p) => [p.slug, p]));

  for (const seed of seeds) {
    const slug = canonicalPageSlug(seed.slug, seed.name);
    if (bySlug.has(slug)) {
      const page = bySlug.get(slug)!;
      if (!page.pageTemplateId && (!page.sections || page.sections.length === 0)) {
        page.pageTemplateId = seed.pageTemplateId;
      }
      if (!page.name?.trim()) page.name = seed.name;
      continue;
    }
    const row = {
      name: seed.name,
      slug,
      pageTemplateId: seed.pageTemplateId,
      showInNav: true,
      published: true,
      sections: [],
    };
    merged.push(row);
    bySlug.set(slug, row);
  }

  const homeIdx = merged.findIndex((p) => p.slug === "home");
  if (homeIdx > 0) {
    const [home] = merged.splice(homeIdx, 1);
    merged.unshift(home);
  }

  return merged.slice(0, 10);
}

function mergeQuestions(existing: string[] | undefined, extra: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const q of [...(existing ?? []), ...extra]) {
    const t = q.trim();
    if (!t || seen.has(t.toLowerCase())) continue;
    seen.add(t.toLowerCase());
    out.push(t);
    if (out.length >= 6) break;
  }
  return out;
}

/** Closest live platform vertical for checkout (AI sites still overwrite template content). */
export function inferVerticalId(
  blueprint: { website?: { type?: string; description?: string; name?: string } },
  prompt = "",
): string {
  const t = `${prompt} ${blueprint.website?.type ?? ""} ${blueprint.website?.description ?? ""} ${blueprint.website?.name ?? ""}`.toLowerCase();
  if (/\bngo\b|nonprofit|non-profit|charity|foundation|\btrust\b|volunteer|donat/.test(t)) return "ngo-charity";
  if (/\bgym\b|fitness|crossfit|yoga|workout|personal train/.test(t)) return "gym-fitness";
  if (/pharmac|chemist|medical store|medicine/.test(t)) return "pharmacy";
  if (/webinar|seminar|workshop|conference|\bevents?\b|training program|corporate training/.test(t)) return "events-training";
  if (/school|education|child/.test(t)) {
    if (/play.?school|preschool|nursery/.test(t)) return "play-school";
    if (/coaching|tuition|jee|neet/.test(t)) return "coaching";
    return "school";
  }
  if (/restaurant|cafe|hotel|food|dining/.test(t)) return "restaurant-hotel";
  if (/clinic|hospital|doctor|dental|health/.test(t)) return "hospital-clinic";
  if (/coaching|tuition/.test(t)) return "coaching";
  if (/agency|marketing|seo/.test(t)) return "education-consultancy";
  return "home-services";
}
export function enrichBlueprint(blueprint: WebsiteBlueprint, prompt: string): WebsiteBlueprint {
  const corpus = `${prompt} ${blueprint.website.type ?? ""} ${blueprint.website.description ?? ""} ${blueprint.website.name}`;
  const playbook = detectPlaybook(corpus);

  const seeds = playbook?.pages ?? (blueprint.pages.length < 3 ? DEFAULT_PAGES : []);
  const pages = mergePages(blueprint.pages, seeds);

  for (const page of pages) {
    page.slug = canonicalPageSlug(page.slug || page.name, page.name);
    if (page.slug === "home") page.slug = "home";
    if (!page.sections?.length && !page.pageTemplateId) {
      page.pageTemplateId = page.slug === "home" ? "landing" : "about";
    }
  }

  const requirements = playbook?.requirements ?? [
    "Business address & city",
    "Phone / WhatsApp contact",
    "Logo or brand colors (optional)",
    "Social media links (optional)",
  ];

  let services = blueprint.services;
  if (playbook?.websiteType === "ngo" && (!services || services.length === 0)) {
    services = [
      { category: "Programs", title: "Child Education", description: "Classroom learning, books and after-school support for children." },
      { category: "Programs", title: "Community Outreach", description: "Awareness drives and family support in underserved areas." },
      { category: "Get Involved", title: "Volunteer", description: "Teach, mentor or help at events — every hour counts." },
      { category: "Get Involved", title: "Donate", description: "Support meals, fees and learning materials with a contribution." },
    ];
  }

  return completeHomePage({
    ...blueprint,
    website: {
      ...blueprint.website,
      type: blueprint.website.type || playbook?.websiteType || "business",
    },
    pages,
    services,
    questions: mergeQuestions(blueprint.questions, requirements),
  });
}
