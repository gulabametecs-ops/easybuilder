import { parseSectionContent, parseJson, sectionFrameClasses, type SectionType, type SectionStyle, type FooterConfig } from "@/lib/config";
import {
  BannerBlock,
  HeroBlock,
  AboutBlock,
  ServiceCategoriesBlock,
  StatsBlock,
  GalleryBlock,
  StepsBlock,
  CtaBlock,
  TeamBlock,
  PriceListBlock,
  TestimonialsBlock,
  FaqBlock,
  LogosBlock,
  FeaturesBlock,
  VideoBlock,
  ImageBannerBlock,
  ContactInfoBlock,
  RichTextBlock,
} from "./sections/blocks";
import { QuoteFormBlock, ContactFormBlock, AppointmentFormBlock } from "./sections/FormSections";
import { PricingPlansBlock, OpeningHoursBlock, CountdownBlock, MapBlock } from "./sections/newBlocks";

type ServiceRow = { id: string; category: string; title: string; description: string; image: string };
type GalleryRow = { id: string; category: string; image: string; caption: string };

export type RenderContext = {
  servicesByCategory: Map<string, ServiceRow[]>;
  galleryByCategory: Map<string, GalleryRow[]>;
  serviceOptions: string[];
  footer: FooterConfig;
  phones: string[];
};

export function SectionRenderer({
  section,
  ctx,
  editMode,
}: {
  section: { id?: string; type: string; content: string; style?: string; visible?: boolean };
  ctx: RenderContext;
  editMode?: boolean;
}) {
  const style = parseJson<SectionStyle>(section.style, {});
  const block = renderBlock(section, ctx);
  const frame = sectionFrameClasses(style);
  const anchor = style.anchorId || undefined;

  if (!editMode && !frame && !anchor) return block; // fast path: no wrapper needed
  return (
    <div
      id={anchor}
      data-sid={editMode ? section.id : undefined}
      data-hidden={editMode && section.visible === false ? "1" : undefined}
      className={`${frame} ${editMode ? "builder-section" : ""} ${editMode && section.visible === false ? "opacity-40" : ""}`.trim()}
    >
      {block}
    </div>
  );
}

function renderBlock(section: { type: string; content: string }, ctx: RenderContext) {
  const type = section.type as SectionType;
  switch (type) {
    case "banner":
      return <BannerBlock c={parseSectionContent("banner", section.content)} />;
    case "hero":
      return <HeroBlock c={parseSectionContent("hero", section.content)} />;
    case "about":
      return <AboutBlock c={parseSectionContent("about", section.content)} />;
    case "serviceCategories":
      return <ServiceCategoriesBlock c={parseSectionContent("serviceCategories", section.content)} servicesByCategory={ctx.servicesByCategory} />;
    case "stats":
      return <StatsBlock c={parseSectionContent("stats", section.content)} />;
    case "gallery":
      return <GalleryBlock c={parseSectionContent("gallery", section.content)} galleryByCategory={ctx.galleryByCategory} />;
    case "steps":
      return <StepsBlock c={parseSectionContent("steps", section.content)} />;
    case "cta":
      return <CtaBlock c={parseSectionContent("cta", section.content)} />;
    case "team":
      return <TeamBlock c={parseSectionContent("team", section.content)} />;
    case "priceList":
      return <PriceListBlock c={parseSectionContent("priceList", section.content)} />;
    case "testimonials":
      return <TestimonialsBlock c={parseSectionContent("testimonials", section.content)} />;
    case "faq":
      return <FaqBlock c={parseSectionContent("faq", section.content)} />;
    case "logos":
      return <LogosBlock c={parseSectionContent("logos", section.content)} />;
    case "features":
      return <FeaturesBlock c={parseSectionContent("features", section.content)} />;
    case "video":
      return <VideoBlock c={parseSectionContent("video", section.content)} />;
    case "imageBanner":
      return <ImageBannerBlock c={parseSectionContent("imageBanner", section.content)} />;
    case "contactInfo":
      return <ContactInfoBlock c={parseSectionContent("contactInfo", section.content)} />;
    case "quoteForm":
      return <QuoteFormBlock c={parseSectionContent("quoteForm", section.content)} serviceOptions={ctx.serviceOptions} phones={ctx.phones} />;
    case "contactForm":
      return <ContactFormBlock c={parseSectionContent("contactForm", section.content)} serviceOptions={ctx.serviceOptions} footer={ctx.footer} />;
    case "appointmentForm":
      return <AppointmentFormBlock c={parseSectionContent("appointmentForm", section.content)} serviceOptions={ctx.serviceOptions} />;
    case "richText":
      return <RichTextBlock c={parseSectionContent("richText", section.content)} />;
    case "pricingPlans":
      return <PricingPlansBlock c={parseSectionContent("pricingPlans", section.content)} />;
    case "openingHours":
      return <OpeningHoursBlock c={parseSectionContent("openingHours", section.content)} />;
    case "countdown":
      return <CountdownBlock c={parseSectionContent("countdown", section.content)} />;
    case "map":
      return <MapBlock c={parseSectionContent("map", section.content)} />;
    default:
      return null;
  }
}
