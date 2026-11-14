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
  pages: (biz: string) => PageSeed[];
};
