import type { SectionType } from "./config";

export type PageTemplate = {
  id: string;
  label: string;
  icon: string;
  description: string;
  category: "popular" | "content" | "business" | "school";
  sections: SectionType[];
};

export const PAGE_TEMPLATES: PageTemplate[] = [
  // Popular
  { id: "blank", label: "Blank", icon: "file", description: "Empty page — add any blocks you want", category: "popular", sections: ["richText"] },
  { id: "landing", label: "Landing page", icon: "rocket", description: "Hero, features, services, reviews & CTA", category: "popular", sections: ["hero", "features", "about", "serviceCategories", "testimonials", "cta"] },
  { id: "about", label: "About us", icon: "info", description: "Story, stats, team and call-to-action", category: "content", sections: ["banner", "about", "stats", "team", "cta"] },
  { id: "services", label: "Services", icon: "grid", description: "Service grid with features and CTA", category: "business", sections: ["banner", "serviceCategories", "features", "cta"] },
  { id: "gallery", label: "Gallery", icon: "images", description: "Photo gallery with banner & CTA", category: "content", sections: ["banner", "gallery", "cta"] },
  { id: "pricing", label: "Pricing", icon: "tag", description: "Plans, FAQs and conversion CTA", category: "business", sections: ["banner", "pricingPlans", "faq", "cta"] },
  { id: "faq", label: "FAQ", icon: "help", description: "Questions accordion with CTA", category: "content", sections: ["banner", "faq", "cta"] },
  { id: "team", label: "Team", icon: "users", description: "People / trainers / faculty showcase", category: "content", sections: ["banner", "team", "cta"] },
  { id: "contact", label: "Contact", icon: "mail", description: "Address, map and contact form", category: "popular", sections: ["banner", "contactInfo", "contactForm"] },
  { id: "booking", label: "Book appointment", icon: "calendar", description: "Booking form with hours & map", category: "business", sections: ["banner", "appointmentForm", "openingHours", "map"] },
  { id: "quote", label: "Get a quote", icon: "filetext", description: "Lead quote form with contact info", category: "business", sections: ["banner", "quoteForm", "contactInfo"] },
  { id: "video", label: "Video page", icon: "play", description: "Video embed, features and CTA", category: "content", sections: ["banner", "video", "features", "cta"] },
  { id: "event", label: "Event / offer", icon: "timer", description: "Countdown, details and booking CTA", category: "business", sections: ["hero", "countdown", "about", "cta"] },
  { id: "notices", label: "Notices", icon: "bell", description: "Notice board + downloads", category: "school", sections: ["banner", "noticeBoard", "downloads"] },
  { id: "results", label: "Results / toppers", icon: "trophy", description: "Toppers showcase with CTA", category: "school", sections: ["banner", "toppers", "stats", "cta"] },
  { id: "downloads", label: "Downloads", icon: "download", description: "Prospectus, forms & files", category: "school", sections: ["banner", "downloads", "cta"] },
  { id: "fees", label: "Fees / menu", icon: "list", description: "Price list with FAQ", category: "business", sections: ["banner", "priceList", "faq", "cta"] },
  { id: "how-it-works", label: "How it works", icon: "steps", description: "Step-by-step process page", category: "content", sections: ["banner", "steps", "features", "cta"] },
];

export const TEMPLATE_CATEGORIES: { id: PageTemplate["category"]; label: string }[] = [
  { id: "popular", label: "Popular" },
  { id: "content", label: "Content" },
  { id: "business", label: "Business" },
  { id: "school", label: "School / coaching" },
];

export function getPageTemplate(id: string): PageTemplate {
  return PAGE_TEMPLATES.find((t) => t.id === id) ?? PAGE_TEMPLATES[0];
}
