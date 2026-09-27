import type { TemplateDef } from "./types";
import {
  defaultTheme,
  defaultHeader,
  defaultFooter,
  defaultSeo,
  defaultServices,
  defaultGallery,
  defaultPages,
} from "../template";
import { educationConsultancy } from "./educationConsultancy";
import { restaurant } from "./restaurant";
import { hospital } from "./hospital";
import { school } from "./school";
import { playSchool } from "./playSchool";
import { primarySchool } from "./primarySchool";
import { coaching } from "./coaching";
import { wholesale } from "./wholesale";
import { manufacturing } from "./manufacturing";
import { skill } from "./skill";
import { gym } from "./gym";
import { ngo } from "./ngo";
import { pharmacy } from "./pharmacy";
import { events } from "./events";

// The original home-services template, assembled from template.ts.
const homeServices: TemplateDef = {
  theme: defaultTheme,
  header: defaultHeader,
  footer: defaultFooter,
  seo: defaultSeo,
  services: defaultServices,
  gallery: defaultGallery,
  pages: defaultPages,
};

// vertical id -> website blueprint. Adding a vertical = add its file here.
export const TEMPLATES: Record<string, TemplateDef> = {
  "home-services": homeServices,
  "education-consultancy": educationConsultancy,
  "restaurant-hotel": restaurant,
  "hospital-clinic": hospital,
  "play-school": playSchool,
  "primary-school": primarySchool,
  "school": school,
  "coaching": coaching,
  "school-coaching": school, // legacy alias (old demo tenant) → senior school
  "wholesale-shop": wholesale,
  "manufacturing": manufacturing,
  "skill-learning": skill,
  "gym-fitness": gym,
  "ngo-charity": ngo,
  "pharmacy": pharmacy,
  "events-training": events,
};

export function getTemplate(vertical: string): TemplateDef {
  return TEMPLATES[vertical] ?? homeServices;
}

export function hasTemplate(vertical: string): boolean {
  return vertical in TEMPLATES;
}
