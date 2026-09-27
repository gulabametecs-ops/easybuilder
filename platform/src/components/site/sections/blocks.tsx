import Link from "next/link";
import { Plus } from "lucide-react";
import { Icon, categoryIcon } from "../Icon";
import { IMAGE_SLOTS } from "@/lib/img";
import { ImageSlot } from "../ImageSlot";
import type { SectionContentMap } from "@/lib/config";
import { sanitizeHtml } from "@/lib/sanitizeHtml";
import { headingStylesFrom, textStyleProps, cardStyleCss, readContentStyles, readItemStyle, type FieldStyle } from "@/lib/fieldStyle";
import { HeroSlideshowBlock } from "./newBlocks";

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
export function AboutBlock({ c }: { c: SectionContentMap["about"] }) {
  const fs = readContentStyles(c);
  return (
    <section className={`${SEC} bg-white`}>
      <div className={`${WRAP} grid lg:grid-cols-2 gap-12 lg:gap-20 items-center`}>
        <div className="relative order-last lg:order-first">
          <div aria-hidden className={`absolute -inset-3 sm:-inset-5 ${RADIUS_LG} bg-gradient-to-br from-primary/20 to-transparent blur-xl`} />
          <Media src={c.image} w={IMAGE_SLOTS.about.w} h={IMAGE_SLOTS.about.h} className={`relative w-full aspect-[4/3] ${RADIUS_LG} shadow-[var(--site-shadow-lg)] ring-1 ring-[var(--site-line)]`} />
        </div>
        <div>
          <SectionHeading eyebrow={c.eyebrow} title={c.title} highlight={c.titleHighlight} center={false} styles={headingStylesFrom(c)} />
          <div className="-mt-6 space-y-4">
            {c.body.map((p, i) => (
              <p key={i} className="site-muted text-lg leading-relaxed" {...textStyleProps(fs.body)}>{p}</p>
            ))}
          </div>
          {c.points?.length > 0 && (
            <ul className="mt-8 grid sm:grid-cols-2 gap-x-6 gap-y-3.5">
              {c.points.map((pt) => (
                <li key={pt} className="flex items-center gap-3 font-medium" {...textStyleProps(fs.points)}>
                  <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Icon name="check" className="w-3.5 h-3.5" strokeWidth={3} />
                  </span>
                  {pt}
                </li>
              ))}
            </ul>
          )}
          {c.buttonLabel && (
            <Link href={c.buttonHref || "#"} className="btn-primary inline-flex items-center gap-2 px-7 py-3.5 mt-10 font-semibold" {...textStyleProps(fs.buttonLabel)}>
              {c.buttonLabel} <Icon name="arrow" className="w-4 h-4" />
            </Link>
          )}
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
export function ServiceCategoriesBlock({
  c,
  servicesByCategory,
}: {
  c: SectionContentMap["serviceCategories"];
  servicesByCategory: Map<string, ServiceRow[]>;
}) {
  const cats = c.categories?.length ? c.categories : Array.from(servicesByCategory.keys());
  return (
    <section className={`${SEC} bg-light`}>
      <div className={WRAP}>
        <SectionHeading eyebrow={c.eyebrow} title={c.title} highlight={c.titleHighlight} styles={headingStylesFrom(c)} />
        <div className="space-y-16">
          {cats.map((cat) => {
            const items = servicesByCategory.get(cat) ?? [];
            return (
              <div key={cat}>
                <CategoryHeading cat={cat} />
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {items.map((s) => (
                    <Link key={s.id} href={`/services/${s.slug || svcSlug(s.title)}`} className="card sec-card site-lift overflow-hidden flex flex-col group">
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
export function StatsBlock({ c }: { c: SectionContentMap["stats"] }) {
  const allCards = readContentStyles(c).items;
  return (
    <section className="site-on-dark relative py-16 sm:py-20 bg-dark overflow-hidden">
      <div aria-hidden className="site-blob w-[30rem] h-[18rem] left-1/2 -translate-x-1/2 -top-40 opacity-25" />
      <div className={`relative ${WRAP} grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6`}>
        {c.items.map((s, i) => {
          const row = s as typeof s & { __style?: FieldStyle; __styles?: Record<string, FieldStyle> };
          const cardCss = cardStyleCss(readItemStyle(row) ?? allCards);
          const t = row.__styles ?? {};
          return (
            <div key={s.label || i} className="text-center sec-card p-6 sm:p-8" style={cardCss}>
              <span className={`${CHIP} w-11 h-11 mb-4`}>
                <Icon name={s.icon} className="w-5 h-5" />
              </span>
              <div className="text-4xl sm:text-5xl font-extrabold tracking-[-0.04em] tabular-nums text-[var(--card-text,#fff)]" {...textStyleProps(t.value)}>{s.value}</div>
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
}: {
  c: SectionContentMap["gallery"];
  galleryByCategory: Map<string, GalleryRow[]>;
}) {
  return (
    <section className={`${SEC} bg-white`}>
      <div className={WRAP}>
        <SectionHeading eyebrow={c.eyebrow} title={c.title} highlight={c.titleHighlight} styles={headingStylesFrom(c)} />
        <div className="space-y-14">
          {Array.from(galleryByCategory.entries()).map(([cat, items]) => (
            <div key={cat}>
              <CategoryHeading cat={cat} />
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {items.map((g) => (
                  <figure key={g.id} className="card relative overflow-hidden group ring-1 ring-[var(--site-line)]">
                    <Media src={g.image} w={IMAGE_SLOTS.gallery.w} h={IMAGE_SLOTS.gallery.h} alt={g.caption} className="w-full aspect-square transition-transform duration-500 group-hover:scale-105" />
                    {g.caption && (
                      <figcaption className="absolute inset-x-0 bottom-0 p-3 text-xs font-medium text-white bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        {g.caption}
                      </figcaption>
                    )}
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
export function StepsBlock({ c }: { c: SectionContentMap["steps"] }) {
  const styles = readContentStyles(c);
  const allCards = styles.items;
  return (
    <section className={`${SEC} bg-light`}>
      <div className={WRAP}>
        <SectionHeading eyebrow={c.eyebrow} title={c.title} highlight={c.titleHighlight} styles={headingStylesFrom(c)} />
        <div className="sec-grid grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
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
export function CtaBlock({ c }: { c: SectionContentMap["cta"] }) {
  const fs = readContentStyles(c);
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
export function TeamBlock({ c }: { c: SectionContentMap["team"] }) {
  const styles = readContentStyles(c);
  const allCards = styles.members;
  return (
    <section className={`${SEC} bg-white`}>
      <div className={WRAP}>
        <SectionHeading eyebrow={c.eyebrow} title={c.title} highlight={c.titleHighlight} styles={headingStylesFrom(c)} />
        <div className="sec-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
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

export function TestimonialsBlock({ c }: { c: SectionContentMap["testimonials"] }) {
  const styles = readContentStyles(c);
  const allCards = styles.items;
  return (
    <section className={`${SEC} bg-white`}>
      <div className={WRAP}>
        <SectionHeading eyebrow={c.eyebrow} title={c.title} highlight={c.titleHighlight} styles={headingStylesFrom(c)} />
        <div className="sec-grid grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {c.items.map((t, i) => {
            const row = t as typeof t & { __style?: FieldStyle; __styles?: Record<string, FieldStyle> };
            const cardCss = cardStyleCss(readItemStyle(row) ?? allCards);
            const fs = row.__styles ?? {};
            const rating = Math.min(5, Math.max(0, Math.round(t.rating || 5)));
            return (
            <figure key={i} className="sec-card card site-lift relative p-7 flex flex-col text-left" style={cardCss}>
              <span aria-hidden className="absolute top-3 right-5 text-7xl leading-none font-serif text-primary/15 select-none">&rdquo;</span>
              <div className="flex gap-0.5 mb-5" role="img" aria-label={`${rating} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, s) => (
                  <Icon key={s} name="star" className={`w-4 h-4 ${s < rating ? "text-amber-400 fill-current" : "text-slate-300"}`} />
                ))}
              </div>
              <blockquote className="text-[1.05rem] leading-relaxed flex-1" {...textStyleProps(fs.text)}>“{t.text}”</blockquote>
              <figcaption className="flex items-center gap-3 mt-6 pt-5 border-t border-[var(--site-line)]">
                <span aria-hidden className="w-11 h-11 rounded-full shrink-0 flex items-center justify-center text-sm font-bold text-white bg-gradient-to-br from-primary to-[var(--c-primary-dark)] ring-2 ring-[var(--site-surface)] shadow-sm">
                  {initials(t.name)}
                </span>
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
export function FaqBlock({ c }: { c: SectionContentMap["faq"] }) {
  const allCards = readContentStyles(c).items;
  return (
    <section className={`${SEC} bg-light`}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading eyebrow={c.eyebrow} title={c.title} highlight={c.titleHighlight} styles={headingStylesFrom(c)} />
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
export function FeaturesBlock({ c }: { c: SectionContentMap["features"] }) {
  const styles = readContentStyles(c);
  const allCards = styles.items;
  return (
    <section className={`${SEC} bg-white`}>
      <div className={WRAP}>
        <div className="sec-grid grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
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
export function VideoBlock({ c }: { c: SectionContentMap["video"] }) {
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
