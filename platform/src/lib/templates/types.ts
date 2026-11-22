import type {
  ThemeConfig,
  HeaderConfig,
  FooterConfig,
  SeoConfig,
  SectionContentMap,
  SectionStyle,
} from "../config";

export type SectionSeed<T extends keyof SectionContentMap = keyof SectionContentMap> = {
  type: T;
  content: SectionContentMap[T];
  /** Optional per-section design (background, card look, alignment…). */
  style?: SectionStyle;
};

export type PageSeed = {
  slug: string;
  title: string;
  isSystem: boolean;
  order: number;
  showInNav?: boolean;
  sections: SectionSeed[];
};

export type PersonSeed = {
  name: string;
  role: string;
  bio?: string;
  groupName?: "leadership" | "core";
  experience?: string;
  image?: string;
};

export type EventSeed = {
  title: string;
  slug?: string;
  activityName?: string;
  shortDescription?: string;
  programDescription?: string;
  date: string;
  location?: string;
  organizedBy?: string;
  dignitaries?: string;
  impact?: string;
  objectives?: string[];
  status?: "auto" | "upcoming" | "completed";
  mapUrl?: string;
  venueNote?: string;
  documents?: { label: string; url: string }[];
  blocks?: { type: string; text?: string; url?: string; caption?: string; html?: string; label?: string; image?: string; urls?: string[] }[];
  enableDonate?: boolean;
  donateAmount?: number;
  showQr?: boolean;
  qrCaption?: string;
};

export type CauseSeed = {
  title: string;
  slug?: string;
  category: string;
  summary: string;
  story: string; // paragraphs separated by blank lines
  goalAmount: number; // INR
  offlineRaised?: number; // INR already raised (seed realistic progress)
  offlineDonors?: number;
  deadline?: string; // YYYY-MM-DD, "" = ongoing
  urgent?: boolean;
  beneficiaries?: string;
  location?: string;
  impactTiers?: { amount: number; label: string }[];
  updates?: { date: string; title: string; text: string }[];
  status?: "active" | "completed" | "paused";
  featured?: boolean;
};

export type PropertySeed = {
  title: string;
  slug?: string;
  purpose: "sale" | "rent" | "pg" | "project";
  propertyType: string;
  price: number;
  priceNote?: string;
  deposit?: number;
  maintenance?: number;
  bhk?: string;
  areaSqft?: number;
  furnishing?: string;
  bathrooms?: number;
  floor?: string;
  facing?: string;
  parking?: string;
  availableFrom?: string;
  possession?: string;
  rera?: string;
  sharing?: string;
  foodIncluded?: boolean;
  gender?: string;
  locality: string;
  city: string;
  address?: string;
  summary: string;
  description: string;
  highlights?: string[];
  amenities?: string[]; // ids from lib/property AMENITIES
  floorPlans?: { label: string; area?: string }[];
  status?: "available" | "under-offer" | "sold" | "rented";
  featured?: boolean;
};

// A complete website blueprint for one vertical/sector.
export type TemplateDef = {
  theme: ThemeConfig;
  header: (biz: string) => HeaderConfig;
  footer: (biz: string) => FooterConfig;
  // Templates supply the SEO basics; the rest of SeoConfig is filled from
  // defaults when the stored value is read back (see getTenantConfig).
  seo: (biz: string) => Partial<SeoConfig> & Pick<SeoConfig, "title" | "description">;
  services: { category: string; title: string; description: string; longDescription?: string }[];
  gallery: { category: string; caption: string }[];
  people?: (biz: string) => PersonSeed[];
  events?: (biz: string) => EventSeed[];
  properties?: (biz: string) => PropertySeed[];
  causes?: (biz: string) => CauseSeed[];
  pages: (biz: string) => PageSeed[];
};
