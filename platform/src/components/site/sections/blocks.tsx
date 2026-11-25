import type { CSSProperties } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Icon, categoryIcon } from "../Icon";
import { IMAGE_SLOTS } from "@/lib/img";
import { ImageSlot } from "../ImageSlot";
import type { SectionContentMap } from "@/lib/config";
import { sanitizeHtml } from "@/lib/sanitizeHtml";
import { headingStylesFrom, textStyleProps, cardStyleCss, readContentStyles, readItemStyle, type FieldStyle } from "@/lib/fieldStyle";
import { HeroSlideshowBlock } from "./newBlocks";
import { cardSize } from "./cardGrid";

type ServiceRow = { id: string; category: string; title: string; description: string; image: string; slug?: string };
type GalleryRow = { id: string; category: string; image: string; caption: string };
const svcSlug = (t: string) => t.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

// Shared layout tokens
const WRAP = "mx-auto max-w-7xl px-4 sm:px-6";
const SEC = "site-sec py-20 sm:py-28";
const RADIUS_LG = "rounded-[calc(var(--site-radius)*1.6)]";
const CHIP = "inline-flex items-center justify-center rounded-[calc(var(--site-radius)*0.9)] bg-primary/10 text-primary ring-1 ring-inset ring-primary/15";

function hrefOf(value: unknown, fallback: string): string {
  if (typeof value === "string") {
    const t = value.trim();
    if (t && t !== "undefined" && t !== "null") return t;
  }
  return fallback;
}

function normalizeHero(c: SectionContentMap["hero"]): SectionContentMap["hero"] {
  return {
    ...c,
    primaryBtn: {
      label: c.primaryBtn?.label || "Contact",
      href: hrefOf(c.primaryBtn?.href, "/contact"),
    },
    secondaryBtn: {
      label: c.secondaryBtn?.label || "Learn more",
      href: hrefOf(c.secondaryBtn?.href, "/about"),
    },
  };
}

// Reusable image block. Empty src → labeled blank slot with upload size.
function Media({ src, alt, className, w = 800, h = 600, showBadge }: { src?: string; alt?: string; className?: string; iconName?: string; seed?: string; w?: number; h?: number; showBadge?: boolean }) {
  return <ImageSlot src={src} alt={alt} className={className} w={w} h={h} showBadge={showBadge ?? Math.min(w, h) >= 160} />;
}

function SectionHeading({
  eyebrow, title, highlight, center = true, styles,
}: {
  eyebrow?: string;
  title: string;
  highlight?: string;
  center?: boolean;
  styles?: { eyebrow?: FieldStyle; title?: FieldStyle; titleHighlight?: FieldStyle };
}) {
  return (
    <div className={`sec-heading${center ? "" : " sec-heading--left"}`}>
      {eyebrow && (
        <p className="site-eyebrow mb-5" {...textStyleProps(styles?.eyebrow)}>
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold" {...textStyleProps(styles?.title)}>
        {title}{" "}
        {highlight && (
          <span className="text-primary" {...textStyleProps(styles?.titleHighlight)}>
            {highlight}
          </span>
        )}
      </h2>
    </div>
  );
}

// ─── Page banner (inner-page hero) ───────────────────────────────────────────
export function BannerBlock({ c }: { c: SectionContentMap["banner"] }) {
  const fs = readContentStyles(c);
  const hasCustomImage = Boolean(c.image?.trim());
  const imageOpacity = Math.min(100, Math.max(0, Number(c.imageOpacity ?? (hasCustomImage ? 50 : 20)))) / 100;
  const overlayOpacity = Math.min(100, Math.max(0, Number(c.overlayOpacity ?? 75))) / 100;
  const bgColor = c.bgColor?.trim() || "var(--c-dark)";

  return (
    <section className="site-on-dark relative text-white overflow-hidden" style={{ backgroundColor: bgColor }}>
      <ImageSlot
        src={c.image}
        w={IMAGE_SLOTS.banner.w}
        h={IMAGE_SLOTS.banner.h}
        className="absolute inset-0"
        imgClassName="w-full h-full object-cover"
        style={{ opacity: imageOpacity }}
        showBadge={!hasCustomImage}
      />
      <div className="absolute inset-0" style={{ backgroundColor: bgColor, opacity: overlayOpacity }} />
      <div aria-hidden className="site-blob w-[28rem] h-[28rem] -top-40 -right-24 opacity-30" />
      <div aria-hidden className="site-gridlines" />
      <div className={`relative ${WRAP} py-20 sm:py-28`}>
        <nav aria-label="Breadcrumb" className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 ring-1 ring-inset ring-white/15 backdrop-blur px-3.5 py-1.5 text-xs font-medium text-white/70">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <Icon name="arrow" className="w-3 h-3 opacity-60" />
          <span className="text-white">{c.title} {c.titleHighlight}</span>
        </nav>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white max-w-4xl" {...textStyleProps(fs.title)}>
          {c.title}{" "}
          <span className="text-primary" {...textStyleProps(fs.titleHighlight)}>{c.titleHighlight}</span>
        </h1>
        {c.subtitle && <p className="mt-5 text-lg text-white/70 max-w-2xl leading-relaxed" {...textStyleProps(fs.subtitle)}>{c.subtitle}</p>}
      </div>
    </section>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────
function HeroText({ c, center = false, dark = true, hideBadge = false }: { c: SectionContentMap["hero"]; center?: boolean; dark?: boolean; hideBadge?: boolean }) {
  const fs = readContentStyles(c);
  const primaryBtn = c.primaryBtn as typeof c.primaryBtn & { __styles?: Record<string, FieldStyle> };
  const secondaryBtn = c.secondaryBtn as typeof c.secondaryBtn & { __styles?: Record<string, FieldStyle> };
  const primaryHref = hrefOf(c.primaryBtn?.href, "/contact");
  const secondaryHref = hrefOf(c.secondaryBtn?.href, "/about");
  const heading = dark ? "text-white" : "";
  const body = dark ? "text-white/75" : "site-muted";
  const chip = dark ? "bg-white/[0.07] ring-white/15 text-white/90" : "bg-[var(--site-surface)] ring-[var(--site-line)] shadow-sm";
  return (
    <div className={center ? "text-center max-w-4xl mx-auto" : ""}>
      {c.badge && !hideBadge && (
        <span
          className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-7 text-xs font-semibold tracking-wide ring-1 ring-inset ${dark ? "bg-white/10 ring-white/15 text-white backdrop-blur" : "bg-primary/10 ring-primary/20 text-primary"}`}
          {...textStyleProps(fs.badge)}
        >
          <span className="relative flex h-2 w-2" aria-hidden>
            <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 motion-safe:animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          {c.badge}
        </span>
      )}
      <h1 className={`text-[2.6rem] leading-[1.05] sm:text-6xl lg:text-7xl font-extrabold ${heading}`} {...textStyleProps(fs.titleTop)}>
        {c.titleTop} <br />
        <span className="text-primary" {...textStyleProps(fs.titleHighlight)}>{c.titleHighlight}</span>
      </h1>
      <p className={`mt-6 ${body} text-lg sm:text-xl leading-relaxed ${center ? "mx-auto max-w-2xl" : "max-w-xl"}`} {...textStyleProps(fs.description)}>{c.description}</p>
      <div className={`mt-9 flex flex-wrap gap-3 ${center ? "justify-center" : ""}`}>
        <a href={primaryHref} className="btn-primary inline-flex items-center gap-2 px-6 sm:px-7 py-3.5 sm:py-4 font-semibold" {...textStyleProps(primaryBtn?.__styles?.label)}>
          <Icon name="phone" className="w-4 h-4" /> {c.primaryBtn?.label || "Contact"}
        </a>
        <a href={secondaryHref} className={`group inline-flex items-center gap-2 px-6 sm:px-7 py-3.5 sm:py-4 font-semibold ${dark ? "btn-outline" : "btn-ghost"}`} {...textStyleProps(secondaryBtn?.__styles?.label)}>
          {c.secondaryBtn?.label || "Learn more"} <Icon name="arrow" className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </a>
      </div>
      {c.features?.length > 0 && (
        <div className={`mt-10 flex flex-wrap gap-2.5 ${center ? "justify-center" : ""}`}>
          {c.features.map((f, i) => {
            const row = f as typeof f & { __style?: FieldStyle; __styles?: Record<string, FieldStyle> };
            const tip = textStyleProps(row.__styles?.title);
            return (
              <div
                key={f.title || i}
                className={`inline-flex items-center gap-2 rounded-full pl-1.5 pr-3.5 py-1.5 text-sm font-medium ring-1 ring-inset ${chip}`}
                style={{ ...cardStyleCss(readItemStyle(row)), ...tip.style }}
                {...(tip["data-fs"] ? { "data-fs": tip["data-fs"] } : {})}
              >
                <span className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center"><Icon name={f.icon} className="w-3.5 h-3.5 text-primary" /></span>
                {f.title}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function HeroImage({ c }: { c: SectionContentMap["hero"] }) {
  return (
    <div className="relative">
      <div aria-hidden className="absolute -inset-4 rounded-[calc(var(--site-radius)*2.4)] bg-gradient-to-tr from-primary/30 via-transparent to-white/10 blur-2xl" />
      <Media src={c.image} w={IMAGE_SLOTS.hero.w} h={IMAGE_SLOTS.hero.h} className="relative w-full aspect-[4/3] rounded-[calc(var(--site-radius)*2)] shadow-2xl ring-1 ring-white/15" />
      <div className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-md text-slate-900 rounded-[calc(var(--site-radius)*1.2)] shadow-[0_20px_40px_-12px_rgb(0_0_0/0.35)] ring-1 ring-black/5 px-5 py-4 flex items-center gap-3">
        <span className="w-11 h-11 rounded-full bg-primary/15 flex items-center justify-center"><Icon name="star" className="w-5 h-5 text-primary fill-current" /></span>
        <div><p className="font-bold leading-none tracking-tight">Trusted Service</p><p className="text-xs text-slate-500 mt-1">Rated by happy customers</p></div>
      </div>
    </div>
  );
}

/** Dark hero backdrop: base colour + soft primary glows + faint grid. */
function HeroGlow({ flip = false }: { flip?: boolean }) {
  return (
    <>
      <div aria-hidden className={`site-blob w-[34rem] h-[34rem] -top-48 ${flip ? "-left-40" : "-right-40"}`} />
      <div aria-hidden className={`site-blob w-[22rem] h-[22rem] -bottom-40 opacity-20 ${flip ? "right-1/4" : "left-1/4"}`} />
      <div aria-hidden className="site-gridlines" />
    </>
  );
}

export function HeroBlock({ c: raw }: { c: SectionContentMap["hero"] }) {
  const c = normalizeHero(raw);
  const variant = c.variant || "classic";

  // Fully custom HTML hero.
  if (variant === "custom" && c.customHtml) {
    return <section className="relative" dangerouslySetInnerHTML={{ __html: sanitizeHtml(c.customHtml) }} />;
  }

  // Auto-rotating slideshow (multiple editable slides).
  if (variant === "slideshow") {
    return <HeroSlideshowBlock c={c} />;
  }

  const bg = (
    <ImageSlot
      src={c.image}
      w={IMAGE_SLOTS.hero.w}
      h={IMAGE_SLOTS.hero.h}
      className="absolute inset-0 opacity-25 pointer-events-none"
      imgClassName="w-full h-full object-cover"
    />
  );

  // Variant 2: centered content over a full background image ("middle text + bg").
  if (variant === "centered") {
    return (
      <section className="site-on-dark relative bg-dark text-white overflow-hidden">
        {bg}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--c-dark)]/70 via-[var(--c-dark)]/80 to-[var(--c-dark)]" />
        <div aria-hidden className="site-blob w-[40rem] h-[24rem] left-1/2 -translate-x-1/2 -top-40 opacity-25" />
        <div className={`relative ${WRAP} py-28 lg:py-40`}><HeroText c={c} center /></div>
      </section>
    );
  }

  // Variant: scrolling marquee header + centered content.
  if (variant === "marquee") {
    const items = [c.badge, ...(c.features?.map((f) => f.title) ?? [])].filter(Boolean) as string[];
    const strip = items.length ? [...items, ...items, ...items] : [];
    return (
      <section className="site-on-dark relative bg-dark text-white overflow-hidden">
        {bg}
        <div className="absolute inset-0 bg-[var(--c-dark)]/80" />
        <HeroGlow />
        <div className="relative">
          {strip.length > 0 && (
            <div className="border-b border-white/10 bg-white/[0.03] backdrop-blur overflow-hidden py-3.5 [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
              <div className="flex gap-12 whitespace-nowrap w-max animate-marquee">
                {strip.map((t, i) => (
                  <span key={i} className="inline-flex items-center gap-2.5 text-sm font-semibold text-white/80 uppercase tracking-[0.14em]"><Icon name="star" className="w-3.5 h-3.5 text-primary fill-current" /> {t}</span>
                ))}
              </div>
            </div>
          )}
          <div className={`${WRAP} py-24 lg:py-32`}><HeroText c={c} center hideBadge /></div>
        </div>
      </section>
    );
  }

  // Variant: vibrant gradient background, centered content (trending).
  if (variant === "gradient") {
    return (
      <section className="site-on-dark relative overflow-hidden text-white [background:linear-gradient(140deg,var(--c-primary)_0%,color-mix(in_srgb,var(--c-primary)_40%,var(--c-dark))_45%,var(--c-dark)_85%)]">
        <div aria-hidden className="absolute -top-32 left-[10%] w-[28rem] h-[28rem] rounded-full bg-white/20 blur-[100px] pointer-events-none" />
        <div aria-hidden className="absolute -bottom-40 right-[5%] w-[32rem] h-[32rem] rounded-full bg-[var(--c-accent)]/30 blur-[110px] pointer-events-none" />
        <div aria-hidden className="site-gridlines" />
        <div className={`relative ${WRAP} py-28 lg:py-40`}><HeroText c={c} center /></div>
      </section>
    );
  }

  // Variant: clean light hero, dark text (trending / minimal SaaS style).
  if (variant === "minimal") {
    return (
      <section className="relative bg-light overflow-hidden">
        <div aria-hidden className="site-blob w-[36rem] h-[26rem] left-1/2 -translate-x-1/2 -top-56 opacity-25" />
        <div aria-hidden className="absolute inset-0 pointer-events-none opacity-60 [background-image:radial-gradient(rgb(15_23_42/0.07)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_60%_55%_at_50%_35%,#000,transparent_75%)]" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 py-28 lg:py-40 text-center"><HeroText c={c} center dark={false} /></div>
      </section>
    );
  }

  // Variant 3: image on the left, content on the right.
  if (variant === "split") {
    return (
      <section className="site-on-dark relative bg-dark text-white overflow-hidden">
        <HeroGlow flip />
        <div className={`relative ${WRAP} py-20 sm:py-24 lg:py-32 grid lg:grid-cols-2 gap-14 lg:gap-20 items-center`}>
          <div className="relative hidden lg:block order-first"><HeroImage c={c} /></div>
          <HeroText c={c} />
        </div>
      </section>
    );
  }

  // Variant 1 (default): content left, image right — no full-bleed placeholder layer
  // (that layer used to sit in document flow and look like a second band above the hero).
  return (
    <section className="site-on-dark relative bg-dark text-white overflow-hidden">
      <HeroGlow />
      <div className={`relative ${WRAP} py-20 sm:py-24 lg:py-32 grid lg:grid-cols-2 gap-14 lg:gap-20 items-center`}>
        <HeroText c={c} />
        <div className="hidden lg:block"><HeroImage c={c} /></div>
      </div>
    </section>
  );
}

// ─── About ───────────────────────────────────────────────────────────────────
export function AboutBlock({ c, layout }: { c: SectionContentMap["about"]; layout?: string }) {
  const fs = readContentStyles(c);
  const body = (cls: string) => (
    <div className={cls}>
      {(c.body ?? []).map((p, i) => (
        <p key={i} className="site-muted text-lg leading-relaxed" {...textStyleProps(fs.body)}>{p}</p>
      ))}
    </div>
  );
  const points = (cls: string) => c.points?.length > 0 && (
    <ul className={cls}>
      {c.points.map((pt) => (
        <li key={pt} className="flex items-center gap-3 font-medium" {...textStyleProps(fs.points)}>
          <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shrink-0 shadow-sm">
            <Icon name="check" className="w-3.5 h-3.5" strokeWidth={3} />
          </span>
          {pt}
        </li>
      ))}
    </ul>
  );
  const button = (cls: string) => c.buttonLabel && (
    <Link href={c.buttonHref || "#"} className={`btn-primary inline-flex items-center gap-2 px-7 py-3.5 font-semibold ${cls}`} {...textStyleProps(fs.buttonLabel)}>
      {c.buttonLabel} <Icon name="arrow" className="w-4 h-4" />
    </Link>
  );
  const heading = (center: boolean) => <SectionHeading eyebrow={c.eyebrow} title={c.title} highlight={c.titleHighlight} center={center} styles={headingStylesFrom(c)} />;

  // Centred statement: no image, large text, points as pill chips.
  if (layout === "centered") {
    return (
      <section className={`${SEC} bg-white`}>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          {heading(true)}
          <div className="-mt-6 space-y-5">
            {(c.body ?? []).map((p, i) => (
              <p key={i} className={`site-muted leading-relaxed ${i === 0 ? "text-xl sm:text-2xl" : "text-lg"}`} {...textStyleProps(fs.body)}>{p}</p>
            ))}
          </div>
          {c.points?.length > 0 && (
            <ul className="mt-10 flex flex-wrap justify-center gap-2.5">
              {c.points.map((pt) => (
                <li key={pt} className={`${CHIP} gap-2 rounded-full px-4 py-2 text-sm font-semibold`} {...textStyleProps(fs.points)}>
                  <Icon name="check" className="w-3.5 h-3.5" strokeWidth={3} /> {pt}
                </li>
              ))}
            </ul>
          )}
          {button("mt-10")}
        </div>
      </section>
    );
  }

  // Wide image on top, text + points in two columns below.
  if (layout === "stacked") {
    return (
      <section className={`${SEC} bg-white`}>
        <div className={WRAP}>
          <Media src={c.image} w={IMAGE_SLOTS.about.w} h={IMAGE_SLOTS.about.h} className={`w-full aspect-[16/10] sm:aspect-[21/9] ${RADIUS_LG} shadow-[var(--site-shadow-lg)] ring-1 ring-[var(--site-line)]`} />
          <div className="mt-12 sm:mt-16 grid lg:grid-cols-2 gap-10 lg:gap-20">
            <div>
              {heading(false)}
              {body("-mt-6 space-y-4")}
            </div>
            <div className="lg:pt-2">
              {points("grid gap-y-4")}
              {button("mt-10")}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // "split" (default) = image left; "reverse" = image right.
  const reverse = layout === "reverse";
  return (
    <section className={`${SEC} bg-white`}>
      <div className={`${WRAP} grid lg:grid-cols-2 gap-12 lg:gap-20 items-center`}>
        <div className={`relative order-last${reverse ? "" : " lg:order-first"}`}>
          <div aria-hidden className={`absolute -inset-3 sm:-inset-5 ${RADIUS_LG} bg-gradient-to-br from-primary/20 to-transparent blur-xl`} />
          <Media src={c.image} w={IMAGE_SLOTS.about.w} h={IMAGE_SLOTS.about.h} className={`relative w-full aspect-[4/3] ${RADIUS_LG} shadow-[var(--site-shadow-lg)] ring-1 ring-[var(--site-line)]`} />
        </div>
        <div>
          {heading(false)}
          {body("-mt-6 space-y-4")}
          {points("mt-8 grid sm:grid-cols-2 gap-x-6 gap-y-3.5")}
          {button("mt-10")}
        </div>
      </div>
    </section>
  );
}

/** Category divider used by services + gallery. */
function CategoryHeading({ cat }: { cat: string }) {
  return (
    <div className="flex items-center gap-3 mb-7">
      <span className={`${CHIP} w-10 h-10`}>
        <Icon name={categoryIcon(cat)} className="w-5 h-5" />
      </span>
      <h3 className="text-lg sm:text-xl font-bold">{cat}</h3>
      <div className="flex-1 h-px bg-gradient-to-r from-[var(--site-line)] to-transparent" />
    </div>
  );
}

// ─── Service categories ──────────────────────────────────────────────────────
// Service cards: up to 3 per row (2 on tablet), and a short last row sits centred.
const CARD_ROW = "flex flex-wrap justify-center gap-5";

export function ServiceCategoriesBlock({
  c,
  servicesByCategory,
  layout,
}: {
  c: SectionContentMap["serviceCategories"];
  servicesByCategory: Map<string, ServiceRow[]>;
  layout?: string;
}) {
  // Categories may arrive as objects (AI output) or name categories with no services;
  // keep only real names that have services, else show every service category.
  const named = (c.categories ?? [])
    .map((x: unknown) => (typeof x === "string" ? x : ((x as { name?: string; title?: string; category?: string } | null)?.name ?? (x as { title?: string })?.title ?? (x as { category?: string })?.category ?? "")))
    .filter((x): x is string => !!x && servicesByCategory.has(x));
  const cats = [...new Set(named.length ? named : Array.from(servicesByCategory.keys()))];
  return (
    <section className={`${SEC} bg-light`}>
      <div className={WRAP}>
        <SectionHeading eyebrow={c.eyebrow} title={c.title} highlight={c.titleHighlight} styles={headingStylesFrom(c)} />
        <div className="space-y-16">
          {cats.map((cat) => {
            const items = servicesByCategory.get(cat) ?? [];
            const href = (s: ServiceRow) => `/services/${s.slug || svcSlug(s.title)}`;
            if (layout === "list") {
              return (
                <div key={cat}>
                  <CategoryHeading cat={cat} />
                  <div className="divide-y divide-[var(--site-line)] border-y border-[var(--site-line)]">
                    {items.map((s) => (
                      <Link key={s.id} href={href(s)} className="group grid grid-cols-[1fr_auto] sm:grid-cols-[minmax(0,18rem)_1fr_auto] items-center gap-x-6 gap-y-1.5 py-6 sm:px-2 transition-colors hover:bg-primary/[0.04]">
                        <h4 className="font-semibold text-lg leading-snug group-hover:text-primary transition-colors">{s.title}</h4>
                        {s.description && <p className="site-muted text-sm leading-relaxed line-clamp-2 col-start-1 row-start-2 sm:col-start-auto sm:row-start-auto">{s.description}</p>}
                        <span className="col-start-2 row-span-2 sm:col-start-auto sm:row-span-1 w-10 h-10 rounded-full ring-1 ring-inset ring-[var(--site-line)] text-primary flex items-center justify-center transition-colors group-hover:bg-primary group-hover:text-white group-hover:ring-primary">
                          <Icon name="arrow" className="w-4 h-4" />
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }
            if (layout === "tiles") {
              return (
                <div key={cat}>
                  <CategoryHeading cat={cat} />
                  <div className={CARD_ROW}>
                    {items.map((s) => (
                      <Link key={s.id} href={href(s)} style={cardSize(items.length, 20).style} className={`${cardSize(items.length, 20).className} group relative block overflow-hidden aspect-[4/3] sm:aspect-[4/5] ${RADIUS_LG} ring-1 ring-[var(--site-line)] shadow-[var(--site-shadow-sm)]`}>
                        <Media src={s.image} w={IMAGE_SLOTS.service.w} h={IMAGE_SLOTS.service.h} className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-105" />
                        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 text-white">
                          <h4 className="text-xl font-bold leading-snug text-white">{s.title}</h4>
                          {s.description && <p className="text-white/75 text-sm mt-1.5 leading-relaxed line-clamp-2">{s.description}</p>}
                          <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-white">View details <Icon name="arrow" className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" /></span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }
            return (
              <div key={cat}>
                <CategoryHeading cat={cat} />
                <div className={CARD_ROW}>
                  {items.map((s) => (
                    <Link key={s.id} href={`/services/${s.slug || svcSlug(s.title)}`} style={cardSize(items.length, 20).style} className={`${cardSize(items.length, 20).className} card sec-card site-lift overflow-hidden flex flex-col group`}>
                      <div className="relative overflow-hidden">
                        <Media src={s.image} w={IMAGE_SLOTS.service.w} h={IMAGE_SLOTS.service.h} className="w-full aspect-[16/10] transition-transform duration-500 group-hover:scale-105" />
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <h4 className="font-semibold leading-snug">{s.title}</h4>
                        {s.description && <p className="site-muted text-sm mt-2 leading-relaxed line-clamp-3">{s.description}</p>}
                        <span className="mt-auto pt-4 inline-flex items-center gap-1.5 text-primary text-sm font-semibold">View details <Icon name="arrow" className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" /></span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Stats ───────────────────────────────────────────────────────────────────
// Long values ("38 Lakh sq ft") shrink a step instead of wrapping onto two lines.
function StatValue({ v }: { v: string }) {
  const len = (v ?? "").length;
  const scale = len > 10 ? 0.62 : len > 7 ? 0.78 : 1;
  return <span className="whitespace-nowrap" style={scale < 1 ? { fontSize: `${scale}em` } : undefined}>{v}</span>;
}
export function StatsBlock({ c, layout }: { c: SectionContentMap["stats"]; layout?: string }) {
  const allCards = readContentStyles(c).items;
  const rows = (c.items ?? []).map((s, i) => {
    const row = s as typeof s & { __style?: FieldStyle; __styles?: Record<string, FieldStyle> };
    return { s, i, cardCss: cardStyleCss(readItemStyle(row) ?? allCards), t: row.__styles ?? {} };
  });

  // Full-width brand band, big white numbers.
  if (layout === "band") {
    return (
      <section className="site-on-dark relative py-14 sm:py-16 bg-primary text-white overflow-hidden">
        <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20" />
        <div className={`relative ${WRAP} sec-cols grid grid-cols-2 lg:grid-cols-4 gap-y-10 lg:divide-x lg:divide-white/20`}>
          {rows.map(({ s, i, t }) => (
            <div key={s.label || i} className="text-center px-4">
              <div className="text-5xl sm:text-6xl font-extrabold tracking-[-0.04em] tabular-nums text-white" {...textStyleProps(t.value)}><StatValue v={s.value} /></div>
              <div className="mt-2 text-sm sm:text-base font-semibold uppercase tracking-[0.12em] text-white/80" {...textStyleProps(t.label)}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Each stat in its own light card, icon + number left-aligned.
  if (layout === "cards") {
    return (
      <section className="site-sec py-16 sm:py-20 bg-light">
        <div className={`${WRAP} sec-cols grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6`}>
          {rows.map(({ s, i, t, cardCss }) => (
            <div key={s.label || i} className="sec-card site-lift p-5 sm:p-7 flex flex-col" style={cardCss}>
              <span className={`${CHIP} w-11 h-11 mb-6`}><Icon name={s.icon} className="w-5 h-5" /></span>
              <div className="text-3xl sm:text-5xl font-extrabold tracking-[-0.04em] tabular-nums text-primary" {...textStyleProps(t.value)}><StatValue v={s.value} /></div>
              <div className="mt-2 font-semibold text-[var(--card-text,var(--c-heading))]" {...textStyleProps(t.label)}>{s.label}</div>
              <span aria-hidden className="mt-5 h-1 w-10 rounded-full bg-primary/30" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // One divided row, no icons, large numbers.
  if (layout === "minimal") {
    return (
      <section className="site-sec py-12 sm:py-16 bg-white">
        <div className={`${WRAP} sec-cols grid grid-cols-2 lg:grid-cols-4 border-y border-[var(--site-line)]`}>
          {rows.map(({ s, i, t }) => (
            <div key={s.label || i} className="py-8 sm:py-10 px-3 text-center border-[var(--site-line)] odd:border-r lg:border-r lg:last:border-r-0 [&:nth-child(n+3)]:border-t lg:[&:nth-child(n+3)]:border-t-0">
              <div className="text-4xl sm:text-6xl font-bold tracking-[-0.05em] tabular-nums text-[var(--c-heading)]" {...textStyleProps(t.value)}><StatValue v={s.value} /></div>
              <div className="site-muted mt-2 text-sm font-medium" {...textStyleProps(t.label)}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="site-on-dark relative py-16 sm:py-20 bg-dark overflow-hidden">
      <div aria-hidden className="site-blob w-[30rem] h-[18rem] left-1/2 -translate-x-1/2 -top-40 opacity-25" />
      <div className={`relative ${WRAP} sec-cols grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6`}>
        {c.items.map((s, i) => {
          const row = s as typeof s & { __style?: FieldStyle; __styles?: Record<string, FieldStyle> };
          const cardCss = cardStyleCss(readItemStyle(row) ?? allCards);
          const t = row.__styles ?? {};
          return (
            <div key={s.label || i} className="text-center sec-card p-6 sm:p-8" style={cardCss}>
              <span className={`${CHIP} w-11 h-11 mb-4`}>
                <Icon name={s.icon} className="w-5 h-5" />
              </span>
              <div className="text-4xl sm:text-5xl font-extrabold tracking-[-0.04em] tabular-nums text-[var(--card-text,#fff)]" {...textStyleProps(t.value)}><StatValue v={s.value} /></div>
              <div className="site-muted text-sm font-medium mt-2" {...textStyleProps(t.label)}>{s.label}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ─── Gallery ─────────────────────────────────────────────────────────────────
export function GalleryBlock({
  c,
  galleryByCategory,
  layout,
}: {
  c: SectionContentMap["gallery"];
  galleryByCategory: Map<string, GalleryRow[]>;
  layout?: string;
}) {
  const caption = (g: GalleryRow) => g.caption && (
    <figcaption className="absolute inset-x-0 bottom-0 p-3 text-xs font-medium text-white bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
      {g.caption}
    </figcaption>
  );
  return (
    <section className={`${SEC} bg-white`}>
      <div className={WRAP}>
        <SectionHeading eyebrow={c.eyebrow} title={c.title} highlight={c.titleHighlight} styles={headingStylesFrom(c)} />
        <div className="space-y-14">
          {Array.from(galleryByCategory.entries()).map(([cat, items]) => layout === "masonry" ? (
            <div key={cat}>
              <CategoryHeading cat={cat} />
              <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 sm:gap-4">
                {items.map((g, i) => (
                  <figure key={g.id} className="card relative mb-3 sm:mb-4 break-inside-avoid overflow-hidden group ring-1 ring-[var(--site-line)]">
                    <Media src={g.image} w={IMAGE_SLOTS.gallery.w} h={IMAGE_SLOTS.gallery.h} alt={g.caption} className={`w-full ${["aspect-[3/4]", "aspect-square", "aspect-[4/5]", "aspect-[4/3]", "aspect-[2/3]"][i % 5]} transition-transform duration-500 group-hover:scale-105`} />
                    {caption(g)}
                  </figure>
                ))}
              </div>
            </div>
          ) : layout === "strip" ? (
            <div key={cat}>
              <CategoryHeading cat={cat} />
              <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-px-4 sm:scroll-px-0 pb-4 [scrollbar-width:thin]">
                {items.map((g) => (
                  <figure key={g.id} className="shrink-0 w-[78%] sm:w-72 lg:w-80 snap-start group">
                    <div className={`overflow-hidden ${RADIUS_LG} ring-1 ring-[var(--site-line)]`}>
                      <Media src={g.image} w={IMAGE_SLOTS.gallery.w} h={IMAGE_SLOTS.gallery.h} alt={g.caption} className="w-full aspect-[4/5] transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    {g.caption && <figcaption className="site-muted mt-3 text-sm font-medium">{g.caption}</figcaption>}
                  </figure>
                ))}
              </div>
            </div>
          ) : (
            <div key={cat}>
              <CategoryHeading cat={cat} />
              <div className="sec-cols grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {items.map((g) => (
                  <figure key={g.id} className="card relative overflow-hidden group ring-1 ring-[var(--site-line)]">
                    <Media src={g.image} w={IMAGE_SLOTS.gallery.w} h={IMAGE_SLOTS.gallery.h} alt={g.caption} className="w-full aspect-square transition-transform duration-500 group-hover:scale-105" />
                    {caption(g)}
                  </figure>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Steps (How it works) ────────────────────────────────────────────────────
export function StepsBlock({ c, layout }: { c: SectionContentMap["steps"]; layout?: string }) {
  const styles = readContentStyles(c);
  const allCards = styles.items;
  const items = c.items ?? [];
  const styled = (s: (typeof items)[number]) => {
    const row = s as typeof s & { __style?: FieldStyle; __styles?: Record<string, FieldStyle> };
    return { cardCss: cardStyleCss(readItemStyle(row) ?? allCards), t: row.__styles ?? {} };
  };

  // Vertical timeline with a connecting line.
  if (layout === "timeline") {
    return (
      <section className={`${SEC} bg-light`}>
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <SectionHeading eyebrow={c.eyebrow} title={c.title} highlight={c.titleHighlight} styles={headingStylesFrom(c)} />
          <ol>
            {items.map((s, i) => {
              const { t } = styled(s);
              return (
                <li key={i} className="relative pl-16 sm:pl-20 pb-10 last:pb-0">
                  {i < items.length - 1 && <span aria-hidden className="absolute left-6 sm:left-7 top-14 bottom-0 w-0.5 -translate-x-1/2 bg-primary/25" />}
                  <span className="absolute left-0 top-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary text-white font-bold tabular-nums flex items-center justify-center shadow-[0_0_0_6px_color-mix(in_srgb,var(--c-primary)_14%,transparent)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="pt-1.5 sm:pt-2.5">
                    <div className="flex items-center gap-2.5">
                      <Icon name={s.icon} className="w-5 h-5 text-primary shrink-0" />
                      <h4 className="font-semibold text-lg sm:text-xl" {...textStyleProps(t.title)}>{s.title}</h4>
                    </div>
                    <p className="site-muted mt-2 leading-relaxed" {...textStyleProps(t.text)}>{s.text}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>
    );
  }

  // Big-number cards in a grid.
  if (layout === "cards") {
    return (
      <section className={`${SEC} bg-light`}>
        <div className={WRAP}>
          <SectionHeading eyebrow={c.eyebrow} title={c.title} highlight={c.titleHighlight} styles={headingStylesFrom(c)} />
          <div className="sec-cols grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {items.map((s, i) => {
              const { cardCss, t } = styled(s);
              return (
                <div key={i} className="sec-card site-lift relative p-7 sm:p-8 text-left" style={cardCss}>
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-6xl sm:text-7xl font-extrabold leading-none tracking-tighter tabular-nums text-primary">{String(i + 1).padStart(2, "0")}</span>
                    <span className={`${CHIP} w-12 h-12 shrink-0`}><Icon name={s.icon} className="w-5 h-5" /></span>
                  </div>
                  <div className="mt-8 h-px bg-[var(--site-line)]" />
                  <h4 className="font-semibold text-xl mt-6" {...textStyleProps(t.title)}>{s.title}</h4>
                  <p className="site-muted mt-2 leading-relaxed" {...textStyleProps(t.text)}>{s.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`${SEC} bg-light`}>
      <div className={WRAP}>
        <SectionHeading eyebrow={c.eyebrow} title={c.title} highlight={c.titleHighlight} styles={headingStylesFrom(c)} />
        <div className="sec-grid sec-cols grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {c.items.map((s, i) => {
            const row = s as typeof s & { __style?: FieldStyle; __styles?: Record<string, FieldStyle> };
            const cardCss = cardStyleCss(readItemStyle(row) ?? allCards);
            const t = row.__styles ?? {};
            return (
              <div key={i} className="relative text-center sec-card site-lift p-7" style={cardCss}>
                <span aria-hidden className="absolute top-3 right-4 text-4xl font-extrabold tracking-tighter tabular-nums text-primary/15 select-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={`${CHIP} w-14 h-14`}>
                  <Icon name={s.icon} className="w-6 h-6" />
                </span>
                <h4 className="font-semibold text-lg mt-5" {...textStyleProps(t.title)}>{s.title}</h4>
                <p className="site-muted text-sm mt-2 leading-relaxed" {...textStyleProps(t.text)}>{s.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── CTA band ────────────────────────────────────────────────────────────────
export function CtaBlock({ c, layout }: { c: SectionContentMap["cta"]; layout?: string }) {
  const fs = readContentStyles(c);
  if (layout === "split" || layout === "minimal") {
    const split = layout === "split";
    const actions = (
      <div className={`flex flex-col sm:flex-row flex-wrap gap-3 ${split ? "lg:justify-end" : "justify-center"}`}>
        <Link href={c.buttonHref || "/contact"} className="btn-primary inline-flex items-center justify-center gap-2 px-7 py-4 font-semibold" {...textStyleProps(fs.buttonLabel)}>
          {c.buttonLabel} <Icon name="arrow" className="w-4 h-4" />
        </Link>
        {(c.phones ?? []).map((p) => (
          <a key={p} href={`tel:${p}`} className="btn-ghost inline-flex items-center justify-center gap-2 px-6 py-4 font-semibold tabular-nums" {...textStyleProps(fs.phones)}>
            <Icon name="phone" className="w-4 h-4 text-primary" /> {p}
          </a>
        ))}
      </div>
    );
    if (split) {
      return (
        <section className="site-sec py-14 sm:py-20">
          <div className={WRAP}>
            <div className={`relative overflow-hidden ${RADIUS_LG} border border-[var(--site-line)] bg-[var(--site-surface)] shadow-[var(--site-shadow-lg)] px-6 py-10 sm:px-12 sm:py-14 grid lg:grid-cols-[1fr_auto] gap-8 lg:gap-12 items-center`}>
              <span aria-hidden className="absolute inset-y-0 left-0 w-1.5 bg-primary" />
              <div>
                <p className="text-primary text-sm font-semibold uppercase tracking-[0.12em]" {...textStyleProps(fs.title)}>{c.title}</p>
                <h2 className="text-3xl sm:text-4xl font-bold mt-3" {...textStyleProps(fs.highlight)}>{c.highlight}</h2>
              </div>
              {actions}
            </div>
          </div>
        </section>
      );
    }
    return (
      <section className="site-sec py-20 sm:py-24 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <p className="site-muted text-lg font-medium" {...textStyleProps(fs.title)}>{c.title}</p>
          <h2 className="text-4xl sm:text-5xl font-bold mt-3 mb-10" {...textStyleProps(fs.highlight)}>{c.highlight}</h2>
          {actions}
        </div>
      </section>
    );
  }
  return (
    <section className="py-10 sm:py-14">
      <div className={WRAP}>
        <div className={`site-on-dark relative overflow-hidden ${RADIUS_LG} bg-dark text-white px-6 py-10 sm:px-12 sm:py-14 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.5)] ring-1 ring-white/10`}>
          <div aria-hidden className="site-blob w-[26rem] h-[26rem] -top-40 -right-20 opacity-40" />
          <div aria-hidden className="site-gridlines" />
          <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="flex items-center gap-5">
              <span className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-[0_0_0_8px_color-mix(in_srgb,var(--c-primary)_20%,transparent)]">
                <Icon name="phone" className="w-6 h-6 text-white" />
              </span>
              <div>
                <p className="text-white/70 text-sm font-medium" {...textStyleProps(fs.title)}>{c.title}</p>
                <p className="text-2xl sm:text-3xl font-bold tracking-tight mt-0.5" {...textStyleProps(fs.highlight)}>{c.highlight}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8 w-full lg:w-auto">
              <div className="flex items-center gap-3 text-lg sm:text-xl font-bold">
                <Icon name="phone" className="w-5 h-5 text-primary" />
                <div className="flex flex-col leading-tight">
                  {c.phones.map((p) => <a key={p} href={`tel:${p}`} className="hover:text-primary transition-colors tabular-nums" {...textStyleProps(fs.phones)}>{p}</a>)}
                </div>
              </div>
              <Link href={c.buttonHref || "/contact"} className="btn-primary inline-flex items-center justify-center gap-2 px-7 py-4 font-semibold" {...textStyleProps(fs.buttonLabel)}>
                {c.buttonLabel} <Icon name="arrow" className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Team (doctors / trainers / faculty / consultants) ──────────────────────
export type LivePerson = {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  groupName: string;
  experience: string;
  linkedin: string;
  instagram: string;
};

function PersonCard({
  name, role, image, note, bio, linkedin, instagram, featured, cardCss,
}: {
  name: string; role: string; image: string; note?: string; bio?: string;
  linkedin?: string; instagram?: string; featured?: boolean; cardCss?: CSSProperties;
}) {
  return (
    <div className={`sec-card card site-lift overflow-hidden text-center group ${featured ? "sm:col-span-1" : ""}`} style={cardCss}>
      <div className="overflow-hidden">
        <Media src={image} w={IMAGE_SLOTS.team.w} h={IMAGE_SLOTS.team.h} alt={name} className="w-full aspect-square transition-transform duration-500 group-hover:scale-105" />
      </div>
      <div className={`p-5 ${featured ? "sm:p-7" : ""}`}>
        <h4 className={`font-semibold ${featured ? "text-lg sm:text-xl" : "text-base sm:text-lg"}`}>{name}</h4>
        <p className="text-primary text-sm font-medium mt-0.5">{role}</p>
        {note && <p className="site-muted text-xs mt-2">{note}</p>}
        {bio && <p className="site-muted text-sm mt-3 leading-relaxed">{bio}</p>}
        {(linkedin || instagram) && (
          <div className="mt-4 flex justify-center gap-2">
            {linkedin ? <a href={linkedin} className="w-8 h-8 rounded-full bg-primary/10 text-primary inline-flex items-center justify-center" aria-label="LinkedIn"><Icon name="linkedin" className="w-3.5 h-3.5" /></a> : null}
            {instagram ? <a href={instagram} className="w-8 h-8 rounded-full bg-primary/10 text-primary inline-flex items-center justify-center" aria-label="Instagram"><Icon name="instagram" className="w-3.5 h-3.5" /></a> : null}
          </div>
        )}
      </div>
    </div>
  );
}

/** Horizontal person row (team.list layout). */
function PersonRow({ name, role, image, note, bio, linkedin, instagram, t = {} }: {
  name: string; role: string; image: string; note?: string; bio?: string;
  linkedin?: string; instagram?: string; t?: Record<string, FieldStyle>;
}) {
  return (
    <div className="flex items-start sm:items-center gap-4 sm:gap-8 py-6 sm:py-7">
      <Media src={image} w={IMAGE_SLOTS.team.w} h={IMAGE_SLOTS.team.h} alt={name} className="w-16 h-16 sm:w-24 sm:h-24 rounded-full shrink-0 ring-4 ring-primary/10" />
      <div className="min-w-0 flex-1 sm:grid sm:grid-cols-[minmax(0,14rem)_1fr] sm:gap-8 sm:items-center">
        <div>
          <h4 className="font-semibold text-lg" {...textStyleProps(t.name)}>{name}</h4>
          <p className="text-primary text-sm font-medium mt-0.5" {...textStyleProps(t.role)}>{role}</p>
          {note && <p className="site-muted text-xs mt-1.5" {...textStyleProps(t.note)}>{note}</p>}
        </div>
        {bio && <p className="site-muted text-sm leading-relaxed mt-2 sm:mt-0">{bio}</p>}
      </div>
      {(linkedin || instagram) && (
        <div className="hidden sm:flex gap-2 shrink-0">
          {linkedin ? <a href={linkedin} className="w-9 h-9 rounded-full bg-primary/10 text-primary inline-flex items-center justify-center" aria-label="LinkedIn"><Icon name="linkedin" className="w-4 h-4" /></a> : null}
          {instagram ? <a href={instagram} className="w-9 h-9 rounded-full bg-primary/10 text-primary inline-flex items-center justify-center" aria-label="Instagram"><Icon name="instagram" className="w-4 h-4" /></a> : null}
        </div>
      )}
    </div>
  );
}

export function TeamBlock({ c, people, layout }: { c: SectionContentMap["team"]; people?: LivePerson[]; layout?: string }) {
  const styles = readContentStyles(c);
  const allCards = styles.members;
  const live = (people ?? []).filter((p) => p.name);
  const leadership = live.filter((p) => p.groupName === "leadership");
  const core = live.filter((p) => p.groupName !== "leadership");

  if (layout === "list") {
    return (
      <section className={`${SEC} bg-white`}>
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <SectionHeading eyebrow={c.eyebrow} title={c.title} highlight={c.titleHighlight} styles={headingStylesFrom(c)} />
          <div className="divide-y divide-[var(--site-line)] border-y border-[var(--site-line)]">
            {live.length > 0
              ? [...leadership, ...core].map((m) => (
                <PersonRow key={m.id} name={m.name} role={m.role} image={m.image} note={m.experience} bio={m.bio} linkedin={m.linkedin} instagram={m.instagram} />
              ))
              : (c.members ?? []).map((m, i) => (
                <PersonRow key={i} name={m.name} role={m.role} image={m.image} note={m.note} t={(m as typeof m & { __styles?: Record<string, FieldStyle> }).__styles} />
              ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`${SEC} bg-white`}>
      <div className={WRAP}>
        <SectionHeading eyebrow={c.eyebrow} title={c.title} highlight={c.titleHighlight} styles={headingStylesFrom(c)} />
        {live.length > 0 ? (
          <>
            {leadership.length > 0 && (
              <div className={`sec-grid grid gap-6 ${leadership.length === 1 ? "max-w-md mx-auto" : "sm:grid-cols-2 max-w-4xl mx-auto"} mb-10`}>
                {leadership.map((m) => (
                  <PersonCard key={m.id} name={m.name} role={m.role} image={m.image} note={m.experience} bio={m.bio} linkedin={m.linkedin} instagram={m.instagram} featured cardCss={cardStyleCss(allCards)} />
                ))}
              </div>
            )}
            {core.length > 0 && (
              <div className="sec-grid sec-cols grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {core.map((m) => (
                  <PersonCard key={m.id} name={m.name} role={m.role} image={m.image} note={m.experience} bio={m.bio} linkedin={m.linkedin} instagram={m.instagram} cardCss={cardStyleCss(allCards)} />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="sec-grid sec-cols grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {c.members.map((m, i) => {
              const row = m as typeof m & { __style?: FieldStyle; __styles?: Record<string, FieldStyle> };
              const cardCss = cardStyleCss(readItemStyle(row) ?? allCards);
              const t = row.__styles ?? {};
              return (
                <div key={i} className="sec-card card site-lift overflow-hidden text-center group" style={cardCss}>
                  <div className="overflow-hidden">
                    <Media src={m.image} w={IMAGE_SLOTS.team.w} h={IMAGE_SLOTS.team.h} alt={m.name} className="w-full aspect-square transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-5">
                    <h4 className="font-semibold text-base sm:text-lg" {...textStyleProps(t.name)}>{m.name}</h4>
                    <p className="text-primary text-sm font-medium mt-0.5" {...textStyleProps(t.role)}>{m.role}</p>
                    {m.note && <p className="site-muted text-xs mt-2" {...textStyleProps(t.note)}>{m.note}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export function VisionMissionBlock({ c }: { c: SectionContentMap["visionMission"] }) {
  const fs = readContentStyles(c);
  return (
    <section className={`${SEC} bg-light`}>
      <div className={WRAP}>
        {c.eyebrow && <p className="text-center text-xs font-bold tracking-[0.2em] text-primary mb-8">{c.eyebrow}</p>}
        <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
          {[
            { icon: "star", title: c.visionTitle, text: c.visionText, titleKey: "visionTitle", textKey: "visionText" },
            { icon: "trending", title: c.missionTitle, text: c.missionText, titleKey: "missionTitle", textKey: "missionText" },
          ].map((card) => (
            <div key={card.title} className="site-on-dark relative overflow-hidden rounded-[calc(var(--site-radius)*1.6)] bg-dark text-white p-8 sm:p-10 min-h-[240px] flex flex-col justify-end">
              <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-primary/35 via-transparent to-black/40" />
              <div className="relative">
                <span className="w-12 h-12 rounded-2xl bg-white/10 ring-1 ring-white/15 inline-flex items-center justify-center mb-4">
                  <Icon name={card.icon} className="w-6 h-6 text-primary" />
                </span>
                <h3 className="text-2xl font-bold" {...textStyleProps(fs[card.titleKey as keyof typeof fs])}>{card.title}</h3>
                <p className="mt-3 text-white/75 leading-relaxed" {...textStyleProps(fs[card.textKey as keyof typeof fs])}>{card.text}</p>
              </div>
            </div>
          ))}
        </div>
        {c.values?.length > 0 && (
          <div className="mt-12">
            <h3 className="text-center text-xl sm:text-2xl font-bold mb-8" {...textStyleProps(fs.valuesTitle)}>{c.valuesTitle}</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {c.values.map((v, i) => (
                <div key={i} className="rounded-[calc(var(--site-radius)*1.2)] bg-[var(--site-surface)] ring-1 ring-[var(--site-line)] p-6 text-center">
                  <span className={`${CHIP} w-12 h-12 mx-auto mb-3`}><Icon name={v.icon || "star"} className="w-5 h-5" /></span>
                  <h4 className="font-semibold">{v.title}</h4>
                  {v.text && <p className="site-muted text-sm mt-2">{v.text}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export type LiveEvent = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  date: string;
  coverImage: string;
  location?: string;
  status?: "upcoming" | "completed";
};

function eventStatus(ev: LiveEvent): { label: string; upcoming: boolean } {
  const upcoming = ev.status ? ev.status === "upcoming" : (() => {
    if (!ev.date) return true;
    const t = new Date(ev.date).getTime();
    if (Number.isNaN(t)) return true;
    return t >= Date.now() - 24 * 3600 * 1000;
  })();
  return { label: upcoming ? "Upcoming" : "Completed", upcoming };
}

function EventCards({ list }: { list: LiveEvent[] }) {
  return (
    <div className="sec-cols grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {list.map((ev) => {
        const st = eventStatus(ev);
        const formatted = ev.date ? new Date(ev.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";
        return (
          <Link key={ev.id} href={`/events/${ev.slug}`} className="sec-card card site-lift overflow-hidden group block">
            <div className="relative">
              <Media src={ev.coverImage} w={800} h={500} alt={ev.title} className="w-full aspect-[16/10]" />
              {formatted && (
                <span className="absolute top-3 left-3 rounded-full bg-white/95 text-slate-800 text-[11px] font-semibold px-3 py-1">{formatted}</span>
              )}
              <span className={`absolute top-3 right-3 rounded-full text-[11px] font-semibold px-3 py-1 ${st.upcoming ? "bg-primary text-white" : "bg-slate-900/80 text-white"}`}>{st.label}</span>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{ev.title}</h3>
              {ev.location && <p className="text-xs site-muted mt-1">{ev.location}</p>}
              {ev.shortDescription && <p className="site-muted text-sm mt-2 line-clamp-3">{ev.shortDescription}</p>}
              <span className="inline-flex items-center gap-1 text-primary text-sm font-semibold mt-4">
                {st.upcoming ? "View details" : "See report & photos"} <Icon name="arrow" className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export function EventListBlock({ c, events }: { c: SectionContentMap["eventList"]; events?: LiveEvent[] }) {
  const fs = readContentStyles(c);
  const limit = c.limit && c.limit > 0 ? c.limit : 6;
  const all = events ?? [];
  const grouped = !!c.groupByStatus;
  const upcoming = all.filter((e) => eventStatus(e).upcoming);
  const completed = all.filter((e) => !eventStatus(e).upcoming);
  const list = grouped ? all : all.slice(0, limit);
  return (
    <section className={`${SEC} bg-white`}>
      <div className={WRAP}>
        <SectionHeading eyebrow={c.eyebrow} title={c.title} highlight={c.titleHighlight} styles={headingStylesFrom(c)} />
        {c.subtitle && <p className="text-center site-muted -mt-8 mb-12 max-w-2xl mx-auto" {...textStyleProps(fs.subtitle)}>{c.subtitle}</p>}
        {list.length === 0 && upcoming.length === 0 && completed.length === 0 ? (
          <p className="text-center site-muted">{c.emptyText || "Events will appear here once published."}</p>
        ) : grouped ? (
          <div className="space-y-14">
            <div>
              <h3 className="text-xl font-bold mb-6">Upcoming</h3>
              {upcoming.length ? <EventCards list={upcoming.slice(0, limit)} /> : <p className="site-muted">No upcoming events right now.</p>}
            </div>
            <div>
              <h3 className="text-xl font-bold mb-6">Completed</h3>
              {completed.length ? <EventCards list={completed.slice(0, limit)} /> : <p className="site-muted">Completed programs will show here with reports and photos.</p>}
            </div>
          </div>
        ) : (
          <EventCards list={list} />
        )}
      </div>
    </section>
  );
}

// ─── Price list / menu (restaurant menu, course fees, packages) ──────────────
export function PriceListBlock({ c }: { c: SectionContentMap["priceList"] }) {
  const fs = readContentStyles(c);
  return (
    <section className={`${SEC} bg-light`}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading eyebrow={c.eyebrow} title={c.title} highlight={c.titleHighlight} styles={headingStylesFrom(c)} />
        {c.note && <p className="site-muted text-center -mt-8 mb-12" {...textStyleProps(fs.note)}>{c.note}</p>}
        <div className="grid gap-6 md:grid-cols-2">
          {c.groups.map((g, gi) => {
            const group = g as typeof g & { __styles?: Record<string, FieldStyle> };
            const gs = group.__styles ?? {};
            return (
              <div key={g.category || gi} className={`${RADIUS_LG} bg-[var(--site-surface)] ring-1 ring-[var(--site-line)] shadow-[var(--site-shadow-sm)] p-6 sm:p-7`}>
                <h3 className="text-lg font-bold mb-5 flex items-center gap-2.5" {...textStyleProps(gs.category)}>
                  <span aria-hidden className="w-1.5 h-5 rounded-full bg-primary" />
                  {g.category}
                </h3>
                <ul className="space-y-3.5">
                  {g.items.map((it, i) => {
                    const row = it as typeof it & { __style?: FieldStyle; __styles?: Record<string, FieldStyle> };
                    const t = row.__styles ?? {};
                    return (
                      <li key={i} className="flex items-baseline gap-3" style={cardStyleCss(readItemStyle(row))}>
                        <span className="font-medium" {...textStyleProps(t.name)}>{it.name}</span>
                        <span className="flex-1 border-b border-dashed border-[var(--site-line)] translate-y-[-4px]" />
                        {it.note && <span className="site-muted text-xs" {...textStyleProps(t.note)}>{it.note}</span>}
                        <span className="font-bold text-primary tabular-nums" {...textStyleProps(t.price)}>{it.price}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ────────────────────────────────────────────────────────────
function initials(name: string): string {
  return (name || "?").split(/\s+/).filter(Boolean).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function Stars({ rating, className = "" }: { rating: number; className?: string }) {
  return (
    <div className={`flex gap-0.5 ${className}`} role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, s) => (
        <Icon key={s} name="star" className={`w-4 h-4 ${s < rating ? "text-amber-400 fill-current" : "text-slate-300"}`} />
      ))}
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  return (
    <span aria-hidden className={`w-11 h-11 rounded-full shrink-0 flex items-center justify-center text-sm font-bold text-white bg-gradient-to-br from-primary to-[var(--c-primary-dark)] ring-2 ring-[var(--site-surface)] shadow-sm`}>
      {initials(name)}
    </span>
  );
}

export function TestimonialsBlock({ c, layout }: { c: SectionContentMap["testimonials"]; layout?: string }) {
  const styles = readContentStyles(c);
  const allCards = styles.items;
  const rows = (c.items ?? []).map((t) => {
    const row = t as typeof t & { __style?: FieldStyle; __styles?: Record<string, FieldStyle> };
    return { t, cardCss: cardStyleCss(readItemStyle(row) ?? allCards), fs: row.__styles ?? {}, rating: Math.min(5, Math.max(0, Math.round(t.rating || 5))) };
  });
  const heading = <SectionHeading eyebrow={c.eyebrow} title={c.title} highlight={c.titleHighlight} styles={headingStylesFrom(c)} />;
  const person = ({ t, fs }: (typeof rows)[number], cls = "") => (
    <figcaption className={`flex items-center gap-3 ${cls}`}>
      <Avatar name={t.name} />
      <div className="min-w-0 text-left">
        <p className="font-semibold truncate" {...textStyleProps(fs.name)}>{t.name}</p>
        <p className="site-muted text-xs" {...textStyleProps(fs.role)}>{t.role}</p>
      </div>
    </figcaption>
  );

  // First quote large / full width, the rest in a small grid.
  if (layout === "featured" && rows.length > 0) {
    const [first, ...rest] = rows;
    return (
      <section className={`${SEC} bg-white`}>
        <div className={WRAP}>
          {heading}
          <figure className={`sec-card relative p-8 sm:p-12 lg:p-16 text-left`} style={first.cardCss}>
            <span aria-hidden className="absolute -top-4 right-6 sm:right-12 text-[10rem] sm:text-[14rem] leading-none font-serif text-primary/10 select-none">&ldquo;</span>
            <Stars rating={first.rating} className="mb-6" />
            <blockquote className="relative text-xl sm:text-3xl lg:text-4xl font-semibold leading-snug tracking-tight max-w-4xl text-[var(--card-text,var(--c-heading))]" {...textStyleProps(first.fs.text)}>“{first.t.text}”</blockquote>
            {person(first, "mt-8 sm:mt-10")}
          </figure>
          {rest.length > 0 && (
            <div className="mt-5 sm:mt-6 sec-cols grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {rest.map((r, i) => (
                <figure key={i} className="sec-card p-6 flex flex-col text-left" style={r.cardCss}>
                  <Stars rating={r.rating} className="mb-4" />
                  <blockquote className="text-sm leading-relaxed flex-1" {...textStyleProps(r.fs.text)}>“{r.t.text}”</blockquote>
                  {person(r, "mt-5")}
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  // No cards: centred large quotes stacked.
  if (layout === "minimal") {
    return (
      <section className={`${SEC} bg-white`}>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
          {heading}
          <div className="space-y-16 sm:space-y-20">
            {rows.map(({ t, fs, rating }, i) => (
              <figure key={i}>
                <Stars rating={rating} className="justify-center mb-6" />
                <blockquote className="text-2xl sm:text-3xl font-medium leading-snug tracking-tight text-[var(--c-heading)]" {...textStyleProps(fs.text)}>“{t.text}”</blockquote>
                <figcaption className="mt-6 text-sm">
                  <span className="font-semibold" {...textStyleProps(fs.name)}>{t.name}</span>
                  {t.role && <span className="site-muted" {...textStyleProps(fs.role)}> · {t.role}</span>}
                </figcaption>
                {i < rows.length - 1 && <span aria-hidden className="block mx-auto mt-16 sm:mt-20 h-1 w-12 rounded-full bg-primary/30" />}
              </figure>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Dark background, glass cards.
  if (layout === "dark") {
    return (
      <section className="site-on-dark relative py-20 sm:py-28 bg-dark overflow-hidden">
        <div aria-hidden className="site-blob w-[32rem] h-[22rem] -top-40 left-1/2 -translate-x-1/2 opacity-30" />
        <div aria-hidden className="site-gridlines" />
        <div className={`relative ${WRAP}`}>
          {heading}
          <div className="sec-cols grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {rows.map((r, i) => (
              <figure key={i} className="sec-card relative p-7 flex flex-col text-left backdrop-blur-md" style={r.cardCss}>
                <span aria-hidden className="text-5xl leading-none font-serif text-primary">&ldquo;</span>
                <blockquote className="mt-2 text-[1.05rem] leading-relaxed flex-1 text-white/90" {...textStyleProps(r.fs.text)}>{r.t.text}</blockquote>
                <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between gap-3">
                  {person(r, "min-w-0")}
                  <Stars rating={r.rating} className="shrink-0" />
                </div>
              </figure>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`${SEC} bg-white`}>
      <div className={WRAP}>
        <SectionHeading eyebrow={c.eyebrow} title={c.title} highlight={c.titleHighlight} styles={headingStylesFrom(c)} />
        <div className="sec-grid sec-cols grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {c.items.map((t, i) => {
            const row = t as typeof t & { __style?: FieldStyle; __styles?: Record<string, FieldStyle> };
            const cardCss = cardStyleCss(readItemStyle(row) ?? allCards);
            const fs = row.__styles ?? {};
            const rating = Math.min(5, Math.max(0, Math.round(t.rating || 5)));
            return (
            <figure key={i} className="sec-card card site-lift relative p-7 flex flex-col text-left" style={cardCss}>
              <span aria-hidden className="absolute top-3 right-5 text-7xl leading-none font-serif text-primary/15 select-none">&rdquo;</span>
              <Stars rating={rating} className="mb-5" />
              <blockquote className="text-[1.05rem] leading-relaxed flex-1" {...textStyleProps(fs.text)}>“{t.text}”</blockquote>
              <figcaption className="flex items-center gap-3 mt-6 pt-5 border-t border-[var(--site-line)]">
                <Avatar name={t.name} />
                <div className="min-w-0">
                  <p className="font-semibold truncate" {...textStyleProps(fs.name)}>{t.name}</p>
                  <p className="site-muted text-xs" {...textStyleProps(fs.role)}>{t.role}</p>
                </div>
              </figcaption>
            </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ (native accordion, no JS) ───────────────────────────────────────────
export function FaqBlock({ c, layout }: { c: SectionContentMap["faq"]; layout?: string }) {
  const allCards = readContentStyles(c).items;
  const split = layout === "split";
  // ponytail: faq content has no intro field; split reads an optional `intro`/`subtitle` key if a template sets one.
  const intro = (c as { intro?: string; subtitle?: string }).intro || (c as { subtitle?: string }).subtitle;
  return (
    <section className={`${SEC} bg-light`}>
      <div className={split ? `${WRAP} grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] gap-6 lg:gap-16 items-start` : "mx-auto max-w-3xl px-4 sm:px-6"}>
        <div className={split ? "lg:sticky lg:top-28" : "contents"}>
          <SectionHeading eyebrow={c.eyebrow} title={c.title} highlight={c.titleHighlight} center={!split} styles={headingStylesFrom(c)} />
          {split && intro && <p className="site-muted text-lg leading-relaxed -mt-8 mb-10 lg:mb-0">{intro}</p>}
        </div>
        <div className="space-y-3">
          {c.items.map((f, i) => {
            const row = f as typeof f & { __style?: FieldStyle; __styles?: Record<string, FieldStyle> };
            const t = row.__styles ?? {};
            return (
              <details key={i} className="site-faq card group sec-card transition-shadow open:shadow-[var(--site-shadow-lg)]" style={cardStyleCss(readItemStyle(row) ?? allCards)}>
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4 px-6 py-5 font-semibold text-left" {...textStyleProps(t.q)}>
                  {f.q}
                  <span className="w-8 h-8 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center transition-transform duration-300 group-open:rotate-45 group-open:bg-primary group-open:text-white">
                    <Plus className="w-4 h-4" />
                  </span>
                </summary>
                <p className="site-muted px-6 pb-6 -mt-1 leading-relaxed text-left" {...textStyleProps(t.a)}>{f.a}</p>
              </details>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Partner logos (text-based) ──────────────────────────────────────────────
export function LogosBlock({ c }: { c: SectionContentMap["logos"] }) {
  const fs = readContentStyles(c);
  return (
    <section className="site-sec py-14 sm:py-16 bg-white border-y border-[var(--site-line)]">
      <div className={WRAP}>
        {c.title && <p className="site-muted text-center text-xs font-semibold tracking-[0.16em] uppercase mb-8" {...textStyleProps(fs.title)}>{c.title}</p>}
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-5">
          {c.items.map((l) => (
            <span key={l} className="text-xl sm:text-2xl font-bold tracking-tight opacity-40 hover:opacity-80 transition-opacity" {...textStyleProps(fs.items)}>{l}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Features / Why choose us ────────────────────────────────────────────────
export function FeaturesBlock({ c, layout }: { c: SectionContentMap["features"]; layout?: string }) {
  const styles = readContentStyles(c);
  const allCards = styles.items;
  const rows = (c.items ?? []).map((f) => ({ f, fs: (f as typeof f & { __styles?: Record<string, FieldStyle> }).__styles ?? {} }));

  // No card boxes: icon + title + text under a thin top rule.
  if (layout === "minimal") {
    return (
      <section className={`${SEC} bg-white`}>
        <div className={`${WRAP} sec-cols grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12`}>
          {rows.map(({ f, fs }, i) => (
            <div key={i} className="group border-t-2 border-[var(--site-line)] pt-7 transition-colors hover:border-primary">
              <Icon name={f.icon} className="w-7 h-7 text-primary" />
              <h4 className="font-semibold text-lg mt-5" {...textStyleProps(fs.title)}>{f.title}</h4>
              {f.text && <p className="site-muted text-sm mt-2 leading-relaxed" {...textStyleProps(fs.text)}>{f.text}</p>}
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Big 01/02/03 numerals, 2-column list.
  if (layout === "numbered") {
    return (
      <section className={`${SEC} bg-white`}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 grid md:grid-cols-2 gap-x-14">
          {rows.map(({ f, fs }, i) => (
            <div key={i} className="flex gap-5 sm:gap-7 py-8 border-b border-[var(--site-line)]">
              <span aria-hidden className="text-5xl sm:text-6xl font-extrabold leading-none tracking-tighter tabular-nums text-primary/25 shrink-0 w-16 sm:w-20">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h4 className="font-semibold text-xl" {...textStyleProps(fs.title)}>{f.title}</h4>
                {f.text && <p className="site-muted mt-2 leading-relaxed" {...textStyleProps(fs.text)}>{f.text}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Sticky heading left, items stacked right. features content has no heading fields,
  // so read optional eyebrow/title keys a template may add, else a generic heading.
  if (layout === "split") {
    const h = c as { eyebrow?: string; title?: string; titleHighlight?: string };
    return (
      <section className={`${SEC} bg-white`}>
        <div className={`${WRAP} grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-4 lg:gap-20 items-start`}>
          <div className="lg:sticky lg:top-28">
            <SectionHeading eyebrow={h.eyebrow} title={h.title || "Why choose"} highlight={h.title ? h.titleHighlight : "us"} center={false} styles={headingStylesFrom(c)} />
          </div>
          <div className="divide-y divide-[var(--site-line)]">
            {rows.map(({ f, fs }, i) => (
              <div key={i} className="flex gap-5 py-7 first:pt-0">
                <span className={`${CHIP} w-12 h-12 shrink-0`}><Icon name={f.icon} className="w-5 h-5" /></span>
                <div>
                  <h4 className="font-semibold text-lg" {...textStyleProps(fs.title)}>{f.title}</h4>
                  {f.text && <p className="site-muted mt-1.5 leading-relaxed" {...textStyleProps(fs.text)}>{f.text}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`${SEC} bg-white`}>
      <div className={WRAP}>
        <div className="sec-grid sec-cols grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {c.items.map((f, i) => {
            const row = f as typeof f & { __style?: FieldStyle; __styles?: Record<string, FieldStyle> };
            const cardCss = cardStyleCss(readItemStyle(row) ?? allCards);
            const fs = row.__styles ?? {};
            return (
            <div key={i} className="sec-card card site-lift p-7 text-center group" style={cardCss}>
              <span className={`${CHIP} w-14 h-14 mb-5 transition-colors group-hover:bg-primary group-hover:text-white`}>
                <Icon name={f.icon} className="w-6 h-6" />
              </span>
              <h4 className="font-semibold text-lg" {...textStyleProps(fs.title)}>{f.title}</h4>
              {f.text && <p className="site-muted text-sm mt-2 leading-relaxed" {...textStyleProps(fs.text)}>{f.text}</p>}
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Video ───────────────────────────────────────────────────────────────────
function embedUrl(url: string): string {
  const yt = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  return url;
}
export function VideoBlock({ c, editMode }: { c: SectionContentMap["video"]; editMode?: boolean }) {
  // Empty video: show the placeholder only in the builder, render nothing on the live site.
  if (!c.url?.trim() && !editMode) return null;
  const fs = readContentStyles(c);
  return (
    <section className="py-20 sm:py-28 bg-light">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading eyebrow={c.eyebrow} title={c.title} highlight={c.titleHighlight} styles={headingStylesFrom(c)} />
        <div className={`aspect-video ${RADIUS_LG} overflow-hidden bg-slate-900 ring-1 ring-black/10 shadow-[0_30px_60px_-24px_rgb(15_23_42/0.45)]`}>
          {c.url ? (
            <iframe src={embedUrl(c.url)} className="w-full h-full" allow="accelerate-sensor; autoplay; encrypted-media; picture-in-picture" allowFullScreen title="Video" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/50">Add a video URL in the editor</div>
          )}
        </div>
        {c.caption && <p className="site-muted text-center mt-5" {...textStyleProps(fs.caption)}>{c.caption}</p>}
      </div>
    </section>
  );
}

// ─── Full-width image banner with CTA ────────────────────────────────────────
export function ImageBannerBlock({ c }: { c: SectionContentMap["imageBanner"] }) {
  const fs = readContentStyles(c);
  return (
    <section className="site-on-dark relative py-28 sm:py-36 overflow-hidden">
      <Media src={c.image} w={IMAGE_SLOTS.imageBanner.w} h={IMAGE_SLOTS.imageBanner.h} className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--c-dark)]/95 via-[var(--c-secondary)]/75 to-[var(--c-secondary)]/55" />
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 text-center text-white">
        <h2 className="text-3xl sm:text-5xl font-bold text-white" {...textStyleProps(fs.title)}>{c.title}</h2>
        {c.subtitle && <p className="mt-5 text-white/80 text-lg sm:text-xl leading-relaxed" {...textStyleProps(fs.subtitle)}>{c.subtitle}</p>}
        {c.buttonLabel && (
          <Link href={c.buttonHref || "#"} className="btn-primary inline-flex items-center gap-2 mt-9 px-7 py-4 font-semibold" {...textStyleProps(fs.buttonLabel)}>
            {c.buttonLabel} <Icon name="arrow" className="w-4 h-4" />
          </Link>
        )}
      </div>
    </section>
  );
}

// ─── Contact info + map ──────────────────────────────────────────────────────
export function ContactInfoBlock({ c }: { c: SectionContentMap["contactInfo"] }) {
  const fs = readContentStyles(c);
  const rows = [
    { icon: "map", label: "Address", value: c.address, vk: "address" as const },
    { icon: "phone", label: "Phone", value: c.phone, vk: "phone" as const },
    { icon: "mail", label: "Email", value: c.email, vk: "email" as const },
    { icon: "clock", label: "Working hours", value: c.hours, vk: "hours" as const },
  ].filter((r) => r.value);
  return (
    <section className={`${SEC} bg-white`}>
      <div className={WRAP}>
        <SectionHeading eyebrow={c.eyebrow} title={c.title} highlight={c.titleHighlight} styles={headingStylesFrom(c)} />
        <div className="grid lg:grid-cols-[1fr_1.3fr] gap-6 lg:gap-8 items-stretch">
          <ul className="grid gap-4">
            {rows.map((r) => (
              <li key={r.label} className="sec-card site-lift flex gap-4 items-center p-5">
                <span className={`${CHIP} w-12 h-12 shrink-0`}>
                  <Icon name={r.icon} className="w-5 h-5" />
                </span>
                <div className="min-w-0">
                  <p className="site-muted text-xs font-semibold uppercase tracking-wider">{r.label}</p>
                  <p className="font-semibold mt-0.5 break-words" {...textStyleProps(fs[r.vk])}>{r.value}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className={`card overflow-hidden bg-slate-100 min-h-[320px] ring-1 ring-[var(--site-line)] shadow-[var(--site-shadow-sm)]`}>
            {c.mapEmbed ? (
              <iframe src={c.mapEmbed} className="w-full h-full min-h-[320px]" loading="lazy" title="Map" />
            ) : (
              <div className="w-full h-full min-h-[320px] flex items-center justify-center text-slate-400">
                <Icon name="map" className="w-10 h-10" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Rich text / raw HTML ────────────────────────────────────────────────────
export function RichTextBlock({ c }: { c: SectionContentMap["richText"] }) {
  return (
    <section className="site-sec py-16 sm:py-20 bg-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 prose prose-slate prose-lg" dangerouslySetInnerHTML={{ __html: sanitizeHtml(c.html) }} />
    </section>
  );
}
