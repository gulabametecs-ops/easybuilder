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
import { wholesale } from "./wholesale";
import { manufacturing } from "./manufacturing";
import { skill } from "./skill";

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
  "school-coaching": school,
  "wholesale-shop": wholesale,
  "manufacturing": manufacturing,
  "skill-learning": skill,
};

export function getTemplate(vertical: string): TemplateDef {
  return TEMPLATES[vertical] ?? homeServices;
}

export function hasTemplate(vertical: string): boolean {
  return vertical in TEMPLATES;
}
