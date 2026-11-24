import type { WebsiteBlueprint } from "./blueprintSchema";
import { canonicalPageSlug, completeHomePage } from "./completeHome";
import { dedupePages } from "./dedupePages";
import { detectStoreIntent, isStoreBlueprint, storeSector, storeifyBlueprint } from "./storeIntent";
import { VERTICALS } from "@/lib/verticals";
import { isStoreVertical } from "@/lib/store";

type PageSeed = { name: string; slug: string; pageTemplateId: string };

type Playbook = {
  keywords: string[];
  websiteType: string;
  pages: PageSeed[];
  requirements: string[];
};

const PLAYBOOKS: Playbook[] = [
  {
    keywords: ["gym", "fitness", "crossfit", "yoga", "workout", "personal training", "bodybuilding", "zumba"],
    websiteType: "fitness",
    pages: [
      { name: "Home", slug: "home", pageTemplateId: "landing" },
      { name: "About", slug: "about", pageTemplateId: "about" },
      { name: "Programs", slug: "programs", pageTemplateId: "services" },
      { name: "Membership", slug: "membership", pageTemplateId: "pricing" },
      { name: "Trainers", slug: "trainers", pageTemplateId: "team" },
      { name: "Free Trial", slug: "free-trial", pageTemplateId: "booking" },
      { name: "Contact", slug: "contact", pageTemplateId: "contact" },
    ],
    requirements: ["Gym address & timings", "Membership plans & prices", "Trainer names & certifications", "Free trial / joining offer"],
  },
  {
    keywords: ["pharmacy", "chemist", "medical store", "medicines", "drug store"],
    websiteType: "pharmacy",
    pages: [
      { name: "Home", slug: "home", pageTemplateId: "landing" },
      { name: "Products", slug: "products", pageTemplateId: "services" },
      { name: "Order Medicines", slug: "order", pageTemplateId: "quote" },
      { name: "Store Hours", slug: "store", pageTemplateId: "booking" },
      { name: "Contact", slug: "contact", pageTemplateId: "contact" },
    ],
    requirements: ["Drug licence number", "Store address & hours", "Home delivery areas", "WhatsApp number for orders"],
  },
  {
    keywords: ["webinar", "seminar", "workshop", "conference", "event", "events", "summit", "training program", "corporate training"],
    websiteType: "events",
    pages: [
      { name: "Home", slug: "home", pageTemplateId: "landing" },
      { name: "Events", slug: "events", pageTemplateId: "services" },
      { name: "Speakers", slug: "speakers", pageTemplateId: "team" },
      { name: "Tickets", slug: "tickets", pageTemplateId: "pricing" },
      { name: "Register", slug: "register", pageTemplateId: "booking" },
      { name: "Contact", slug: "contact", pageTemplateId: "contact" },
    ],
    requirements: ["Event dates, venue or online link", "Ticket prices & passes", "Speaker names & bios", "Registration / payment link"],
  },
  {
    keywords: ["section 8", "social foundation", "financial literacy", "grassroots", "initiatives"],
    websiteType: "foundation",
    pages: [
      { name: "Home", slug: "home", pageTemplateId: "landing" },
      { name: "About Us", slug: "about", pageTemplateId: "about" },
      { name: "Our Team", slug: "team", pageTemplateId: "team" },
      { name: "Initiatives", slug: "initiatives", pageTemplateId: "services" },
      { name: "Events", slug: "events", pageTemplateId: "events-list" },
      { name: "Gallery", slug: "gallery", pageTemplateId: "gallery" },
      { name: "Volunteer", slug: "volunteer", pageTemplateId: "volunteer" },
      { name: "Donate", slug: "donate", pageTemplateId: "pricing" },
      { name: "Contact", slug: "contact", pageTemplateId: "contact" },
    ],
    requirements: [
      "CIN / Section 8 registration",
      "Regional and registered office addresses",
      "Donation UPI or payment link",
      "Program areas you actually run",
    ],
  },
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
    keywords: ["coaching", "tuition", "jee", "neet", "upsc", "competitive exam"],
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
    keywords: ["agency", "marketing agency", "digital marketing", "seo", "branding", "advertising"],
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
  const has = (k: string) => new RegExp(`\\b${k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(lower);
  for (const pb of PLAYBOOKS) {
    if (pb.keywords.some(has)) return pb;
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

  // Seeds come after the AI's pages, so dedupe keeps the AI page over a synonym seed (e.g. "booking" vs "reservations").
  return dedupePages(merged).slice(0, 10);
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
  // Online stores first: "online saree shop" must not become a service site.
  if (isStoreBlueprint(blueprint)) return storeSector(t);
  const store = detectStoreIntent(t);
  if (store.isStore && store.vertical) return store.vertical;
  if (/section 8|social foundation|financial literacy|grassroots/.test(t)) return "social-foundation";
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
  if (/digital marketing|marketing agency|\bseo\b|social media agency|advertising/.test(t)) return "digital-marketing";
  return verticalByName(t) ?? "home-services";
}

const NAME_STOP = new Set(["services", "service", "store", "school", "company", "centre", "center", "studio", "consultants", "agency", "shop"]);

/** Any live sector whose own name (or a part of it, like "interior design") appears in the text. */
function verticalByName(t: string): string | null {
  let best: { id: string; len: number } | null = null;
  for (const v of VERTICALS) {
    if (v.status !== "live" || isStoreVertical(v.id)) continue; // stores need an e-commerce signal (detectStoreIntent)
    for (const raw of v.name.toLowerCase().split(/\s*(?:&|\/|\(|\)|,|\band\b)\s*/)) {
      const phrase = raw.trim();
      if (phrase.length < 5 || NAME_STOP.has(phrase)) continue;
      const re = new RegExp(`\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`);
      if (re.test(t) && (!best || phrase.length > best.len)) best = { id: v.id, len: phrase.length };
    }
  }
  return best?.id ?? null;
}
/** When no category has 2+ services, show them all as one grid instead of 1-card rows. */
function groupThinServices(services: WebsiteBlueprint["services"]): WebsiteBlueprint["services"] {
  if (!services?.length) return services;
  const counts = new Map<string, number>();
  for (const s of services) counts.set(s.category, (counts.get(s.category) ?? 0) + 1);
  if ([...counts.values()].some((n) => n >= 2)) return services;
  return services.map((s) => ({ ...s, category: "Our Services" }));
}

export function enrichBlueprint(blueprint: WebsiteBlueprint, prompt: string): WebsiteBlueprint {
  blueprint = { ...blueprint, services: groupThinServices(blueprint.services) };
  // Online store? Build the shop structure instead of a services playbook.
  const store =
    isStoreBlueprint(blueprint) ||
    detectStoreIntent(`${prompt} ${blueprint.website.type ?? ""} ${blueprint.website.description ?? ""}`).isStore;
  if (store) {
    const shop = storeifyBlueprint(blueprint);
    return completeHomePage({ ...shop, pages: dedupePages(shop.pages) });
  }

  const playbook =
    detectPlaybook(`${prompt} ${blueprint.website.type ?? ""} ${blueprint.website.name}`) ??
    detectPlaybook(blueprint.website.description ?? "");

  // Custom / unusual requests: when the AI already planned a real site (4+ pages), keep its
  // structure — a keyword playbook only fills thin plans, it never pads a custom one.
  const thin = blueprint.pages.length < 4;
  const seeds = thin ? playbook?.pages ?? (blueprint.pages.length < 3 ? DEFAULT_PAGES : []) : [];
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
