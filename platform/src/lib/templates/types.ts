import type {
  ThemeConfig,
  HeaderConfig,
  FooterConfig,
  SeoConfig,
  SectionContentMap,
} from "../config";

export type SectionSeed<T extends keyof SectionContentMap = keyof SectionContentMap> = {
  type: T;
  content: SectionContentMap[T];
};

export type PageSeed = {
  slug: string;
  title: string;
  isSystem: boolean;
  order: number;
  sections: SectionSeed[];
};

// A complete website blueprint for one vertical/sector.
export type TemplateDef = {
  theme: ThemeConfig;
  header: (biz: string) => HeaderConfig;
  footer: (biz: string) => FooterConfig;
  // Templates supply the SEO basics; the rest of SeoConfig is filled from
  // defaults when the stored value is read back (see getTenantConfig).
  seo: (biz: string) => Partial<SeoConfig> & Pick<SeoConfig, "title" | "description">;
  services: { category: string; title: string; description: string }[];
  gallery: { category: string; caption: string }[];
  pages: (biz: string) => PageSeed[];
};
