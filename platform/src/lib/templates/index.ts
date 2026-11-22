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
import { ngoFoundation } from "./ngoFoundation";
import { pharmacy } from "./pharmacy";
import { events } from "./events";
import { languageInstitute } from "./languageInstitute";
import { drivingSchool } from "./drivingSchool";
import { computerInstitute } from "./computerInstitute";
import { interiorDesign } from "./interiorDesign";
import { carService } from "./carService";
import { packersMovers } from "./packersMovers";
import { cafeBakery } from "./cafeBakery";
import { catering } from "./catering";
import { hotelResort } from "./hotelResort";
import { dentalClinic } from "./dentalClinic";
import { diagnosticLab } from "./diagnosticLab";
import { physioClinic } from "./physioClinic";
import { construction } from "./construction";
import { importExport } from "./importExport";
import { jewelleryStore } from "./jewelleryStore";
import { yogaStudio } from "./yogaStudio";
import { salonSpa } from "./salonSpa";
import { nutritionClinic } from "./nutritionClinic";
import { animalWelfare } from "./animalWelfare";
import { seniorCare } from "./seniorCare";
import { residentWelfare } from "./residentWelfare";
import { weddingPlanner } from "./weddingPlanner";
import { photoStudio } from "./photoStudio";
import { banquetHall } from "./banquetHall";
import { womenEmpowerment } from "./womenEmpowerment";
import { childEducationNgo } from "./childEducationNgo";
import { environmentNgo } from "./environmentNgo";
import { reliefNgo } from "./reliefNgo";
import { foodBank } from "./foodBank";
import { kitchenWholesale } from "./kitchenWholesale";
import { electricalWholesale } from "./electricalWholesale";
import { realEstateBroker } from "./realEstateBroker";
import { pgHostel } from "./pgHostel";
import { builderDeveloper } from "./builderDeveloper";

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
  "social-foundation": ngoFoundation,
  "pharmacy": pharmacy,
  "events-training": events,
  "language-institute": languageInstitute,
  "driving-school": drivingSchool,
  "computer-institute": computerInstitute,
  "interior-design": interiorDesign,
  "car-service": carService,
  "packers-movers": packersMovers,
  "cafe-bakery": cafeBakery,
  "catering": catering,
  "hotel-resort": hotelResort,
  "dental-clinic": dentalClinic,
  "diagnostic-lab": diagnosticLab,
  "physio-clinic": physioClinic,
  "construction": construction,
  "import-export": importExport,
  "jewellery-store": jewelleryStore,
  "yoga-studio": yogaStudio,
  "salon-spa": salonSpa,
  "nutrition-clinic": nutritionClinic,
  "animal-welfare": animalWelfare,
  "senior-care": seniorCare,
  "resident-welfare": residentWelfare,
  "wedding-planner": weddingPlanner,
  "photo-studio": photoStudio,
  "banquet-hall": banquetHall,
  "women-empowerment": womenEmpowerment,
  "child-education-ngo": childEducationNgo,
  "environment-ngo": environmentNgo,
  "health-relief-ngo": reliefNgo,
  "food-bank": foodBank,
  "kitchen-sink-wholesale": kitchenWholesale,
  "electrical-wholesale": electricalWholesale,
  "real-estate-broker": realEstateBroker,
  "pg-hostel": pgHostel,
  "builder-developer": builderDeveloper,
};

export function getTemplate(vertical: string): TemplateDef {
  return TEMPLATES[vertical] ?? homeServices;
}

export function hasTemplate(vertical: string): boolean {
  return vertical in TEMPLATES;
}
