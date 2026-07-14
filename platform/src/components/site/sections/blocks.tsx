import Link from "next/link";
import { Icon, categoryIcon } from "../Icon";
import { img } from "@/lib/img";
import type { SectionContentMap } from "@/lib/config";

type ServiceRow = { id: string; category: string; title: string; description: string; image: string };
type GalleryRow = { id: string; category: string; image: string; caption: string };

// Reusable image block. Falls back to a seeded real photo, then an icon.
function Media({ src, alt, className, iconName, seed }: { src?: string; alt?: string; className?: string; iconName?: string; seed?: string }) {
  const url = src || (seed ? img(seed) : "");
  if (url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt={alt ?? ""} className={`object-cover ${className ?? ""}`} />;
  }
  return (
    <div className={`flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 ${className ?? ""}`}>
      <Icon name={iconName ?? "wrench"} className="w-10 h-10 text-slate-400" />
    </div>
  );
}

function SectionHeading({ eyebrow, title, highlight, center = true }: { eyebrow?: string; title: string; highlight?: string; center?: boolean }) {
  return (
    <div className={center ? "text-center max-w-2xl mx-auto mb-12" : "mb-10"}>
      {eyebrow && <p className="text-primary text-sm font-semibold tracking-wider uppercase mb-2">{eyebrow}</p>}
      <h2 className="text-3xl sm:text-4xl font-extrabold">
        {title} {highlight && <span className="text-primary">{highlight}</span>}
      </h2>
      <div className={`h-1 w-16 bg-primary rounded-full mt-4 ${center ? "mx-auto" : ""}`} />
    </div>
  );
}

// ─── Page banner (inner-page hero) ───────────────────────────────────────────
export function BannerBlock({ c }: { c: SectionContentMap["banner"] }) {
  return (
    <section className="relative bg-secondary text-white overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={img(`${c.title}-${c.titleHighlight}-banner`, 1600, 500)} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--c-dark)] via-[var(--c-dark)]/90 to-[var(--c-dark)]/60" />
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_85%_20%,var(--c-primary),transparent_40%)]" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:py-20">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
          {c.title} <span className="text-primary">{c.titleHighlight}</span>
        </h1>
        {c.subtitle && <p className="mt-3 text-white/70 max-w-2xl">{c.subtitle}</p>}
        <div className="mt-4 flex items-center gap-2 text-sm text-white/60">
          <Link href="/" className="hover:text-primary">Home</Link>
          <Icon name="arrow" className="w-3.5 h-3.5" />
          <span className="text-primary">{c.title} {c.titleHighlight}</span>
        </div>
      </div>
    </section>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────
function HeroText({ c, center = false }: { c: SectionContentMap["hero"]; center?: boolean }) {
  return (
    <div className={center ? "text-center max-w-3xl mx-auto" : ""}>
      {c.badge && (
        <span className="inline-block rounded-full bg-primary/20 text-primary text-xs font-semibold px-4 py-1.5 mb-5 tracking-wide">{c.badge}</span>
      )}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-white">
        {c.titleTop} <br />
        <span className="text-primary">{c.titleHighlight}</span>
      </h1>
      <p className={`mt-5 text-white/80 text-lg ${center ? "mx-auto max-w-2xl" : "max-w-lg"}`}>{c.description}</p>
      {c.features?.length > 0 && (
        <div className={`mt-7 flex flex-wrap gap-x-7 gap-y-3 ${center ? "justify-center" : ""}`}>
          {c.features.map((f) => (
            <div key={f.title} className="flex items-center gap-2 text-sm text-white/90">
              <span className="w-8 h-8 rounded-full bg-primary/25 flex items-center justify-center"><Icon name={f.icon} className="w-4 h-4 text-primary" /></span>
              {f.title}
            </div>
          ))}
        </div>
      )}
      <div className={`mt-8 flex flex-wrap gap-3 ${center ? "justify-center" : ""}`}>
        <Link href={c.primaryBtn.href} className="btn-primary inline-flex items-center gap-2 px-6 py-3.5 font-semibold"><Icon name="phone" className="w-4 h-4" /> {c.primaryBtn.label}</Link>
        <Link href={c.secondaryBtn.href} className="btn-outline inline-flex items-center gap-2 px-6 py-3.5 font-semibold">{c.secondaryBtn.label} <Icon name="arrow" className="w-4 h-4" /></Link>
      </div>
    </div>
  );
}

function HeroImage({ c }: { c: SectionContentMap["hero"] }) {
  return (
    <div className="relative">
      <Media src={c.image} seed={`${c.titleTop}-${c.titleHighlight}`} className="w-full aspect-[4/3] rounded-3xl shadow-2xl ring-1 ring-white/10" />
      <div className="absolute -bottom-5 -left-5 bg-white text-secondary rounded-2xl shadow-xl px-5 py-4 flex items-center gap-3">
        <span className="w-11 h-11 rounded-full bg-primary/15 flex items-center justify-center"><Icon name="star" className="w-5 h-5 text-primary" /></span>
        <div><p className="font-extrabold leading-none">Trusted Service</p><p className="text-xs text-slate-500 mt-0.5">Rated by happy customers</p></div>
      </div>
    </div>
  );
}

export function HeroBlock({ c }: { c: SectionContentMap["hero"] }) {
  const variant = c.variant || "classic";
  const bgSeed = `${c.titleTop}-${c.titleHighlight}-bg`;

  // Fully custom HTML hero.
  if (variant === "custom" && c.customHtml) {
    return <section className="relative" dangerouslySetInnerHTML={{ __html: c.customHtml }} />;
  }

  const bg = (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={img(bgSeed, 1600, 900)} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_75%_25%,var(--c-primary),transparent_45%)]" />
    </>
  );

  // Variant 2: centered content over a full background image.
  if (variant === "centered") {
    return (
      <section className="relative bg-secondary text-white overflow-hidden">
        {bg}
        <div className="absolute inset-0 bg-[var(--c-dark)]/75" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 lg:py-32"><HeroText c={c} center /></div>
      </section>
    );
  }

  // Variant 3: image on the left, content on the right.
  if (variant === "split") {
    return (
      <section className="relative bg-secondary text-white overflow-hidden">
        {bg}
        <div className="absolute inset-0 bg-gradient-to-l from-[var(--c-dark)] via-[var(--c-dark)]/95 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative hidden lg:block order-first"><HeroImage c={c} /></div>
          <HeroText c={c} />
        </div>
      </section>
    );
  }

  // Variant 1 (default): content left, image right.
  return (
    <section className="relative bg-secondary text-white overflow-hidden">
      {bg}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--c-dark)] via-[var(--c-dark)]/95 to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
        <HeroText c={c} />
        <div className="hidden lg:block"><HeroImage c={c} /></div>
      </div>
    </section>
  );
}

// ─── About ───────────────────────────────────────────────────────────────────
export function AboutBlock({ c }: { c: SectionContentMap["about"] }) {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 grid lg:grid-cols-2 gap-12 items-center">
        <Media src={c.image} seed={`${c.title}-${c.titleHighlight}-about`} iconName="home" className="w-full aspect-[4/3] rounded-3xl shadow-lg order-last lg:order-first" />
        <div>
          <SectionHeading eyebrow={c.eyebrow} title={c.title} highlight={c.titleHighlight} center={false} />
          {c.body.map((p, i) => (
            <p key={i} className="text-slate-600 mb-4 leading-relaxed">{p}</p>
          ))}
          {c.points?.length > 0 && (
            <ul className="mt-6 grid sm:grid-cols-2 gap-3">
              {c.points.map((pt) => (
                <li key={pt} className="flex items-center gap-2 text-slate-700">
                  <span className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                    <Icon name="check" className="w-3 h-3 text-primary" />
                  </span>
                  {pt}
                </li>
              ))}
            </ul>
          )}
          {c.buttonLabel && (
            <Link href={c.buttonHref || "#"} className="btn-primary inline-flex items-center gap-2 px-6 py-3 mt-8 font-semibold">
              {c.buttonLabel} <Icon name="arrow" className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </section>
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
    <section className="py-20 bg-light">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading eyebrow={c.eyebrow} title={c.title} highlight={c.titleHighlight} />
        <div className="space-y-14">
          {cats.map((cat) => {
            const items = servicesByCategory.get(cat) ?? [];
            return (
              <div key={cat}>
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-11 h-11 rounded-full bg-primary/15 flex items-center justify-center">
                    <Icon name={categoryIcon(cat)} className="w-5 h-5 text-primary" />
                  </span>
                  <h3 className="text-xl font-bold uppercase tracking-wide">{cat}</h3>
                  <div className="flex-1 h-px bg-primary/30" />
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {items.map((s) => (
                    <Link key={s.id} href="/quote" className="card bg-white border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all overflow-hidden block group">
                      <div className="relative overflow-hidden">
                        <Media src={s.image} seed={s.title} iconName={categoryIcon(cat)} className="w-full h-36 group-hover:scale-105 transition-transform" />
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-sm text-secondary leading-snug">{s.title}</h4>
                        {s.description && <p className="text-xs text-slate-500 mt-1.5">{s.description}</p>}
                        <span className="inline-flex items-center gap-1 text-primary text-xs font-semibold mt-2.5">Enquire now <Icon name="arrow" className="w-3 h-3 group-hover:translate-x-1 transition-transform" /></span>
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
  return (
    <section className="py-16 bg-secondary">
      <div className="mx-auto max-w-7xl px-4 grid grid-cols-2 lg:grid-cols-4 gap-8">
        {c.items.map((s) => (
          <div key={s.label} className="text-center">
            <span className="inline-flex w-12 h-12 rounded-full bg-primary/20 items-center justify-center mb-3">
              <Icon name={s.icon} className="w-6 h-6 text-primary" />
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-white">{s.value}</div>
            <div className="text-white/60 text-sm mt-1">{s.label}</div>
          </div>
        ))}
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
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading eyebrow={c.eyebrow} title={c.title} highlight={c.titleHighlight} />
        <div className="space-y-12">
          {Array.from(galleryByCategory.entries()).map(([cat, items]) => (
            <div key={cat}>
              <div className="flex items-center gap-3 mb-5">
                <span className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
                  <Icon name={categoryIcon(cat)} className="w-5 h-5 text-primary" />
                </span>
                <h3 className="text-lg font-bold uppercase tracking-wide">{cat}</h3>
                <div className="flex-1 h-px bg-primary/30" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {items.map((g) => (
                  <div key={g.id} className="card overflow-hidden group">
                    <Media src={g.image} seed={g.caption} alt={g.caption} iconName={categoryIcon(cat)} className="w-full aspect-square group-hover:scale-105 transition-transform" />
                  </div>
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
  return (
    <section className="py-20 bg-light">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading eyebrow={c.eyebrow} title={c.title} highlight={c.titleHighlight} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {c.items.map((s, i) => (
            <div key={i} className="text-center">
              <div className="relative">
                <span className="inline-flex w-16 h-16 rounded-full bg-secondary items-center justify-center">
                  <Icon name={s.icon} className="w-7 h-7 text-primary" />
                </span>
                <span className="absolute -top-1 -right-1 sm:right-1/3 w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
              </div>
              <h4 className="font-semibold mt-4">{s.title}</h4>
              <p className="text-sm text-slate-500 mt-1">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA band ────────────────────────────────────────────────────────────────
export function CtaBlock({ c }: { c: SectionContentMap["cta"] }) {
  return (
    <section className="py-6">
      <div className="mx-auto max-w-7xl px-4">
        <div className="rounded-3xl bg-dark text-white px-8 py-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shrink-0">
              <Icon name="phone" className="w-6 h-6 text-white" />
            </span>
            <div>
              <p className="text-white/70 text-sm">{c.title}</p>
              <p className="text-2xl font-extrabold">{c.highlight}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xl font-bold">
            <Icon name="phone" className="w-6 h-6 text-primary" />
            <div className="flex flex-col leading-tight">
              {c.phones.map((p) => <a key={p} href={`tel:${p}`} className="hover:text-primary">{p}</a>)}
            </div>
          </div>
          <Link href={c.buttonHref} className="btn-primary inline-flex items-center gap-2 px-6 py-3.5 font-semibold">
            {c.buttonLabel} <Icon name="arrow" className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Team (doctors / trainers / faculty / consultants) ──────────────────────
export function TeamBlock({ c }: { c: SectionContentMap["team"] }) {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading eyebrow={c.eyebrow} title={c.title} highlight={c.titleHighlight} />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {c.members.map((m, i) => (
            <div key={i} className="card bg-white border border-slate-100 shadow-sm overflow-hidden text-center">
              <Media src={m.image} seed={`${m.name}-${m.role}-person`} alt={m.name} iconName="users" className="w-full aspect-square" />
              <div className="p-4">
                <h4 className="font-semibold text-secondary">{m.name}</h4>
                <p className="text-primary text-sm">{m.role}</p>
                {m.note && <p className="text-xs text-slate-400 mt-1">{m.note}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Price list / menu (restaurant menu, course fees, packages) ──────────────
export function PriceListBlock({ c }: { c: SectionContentMap["priceList"] }) {
  return (
    <section className="py-20 bg-light">
      <div className="mx-auto max-w-5xl px-4">
        <SectionHeading eyebrow={c.eyebrow} title={c.title} highlight={c.titleHighlight} />
        {c.note && <p className="text-center text-slate-500 -mt-6 mb-10">{c.note}</p>}
        <div className="space-y-10">
          {c.groups.map((g) => (
            <div key={g.category}>
              <h3 className="text-xl font-bold text-secondary mb-4 pb-2 border-b-2 border-primary/30">{g.category}</h3>
              <ul className="space-y-3">
                {g.items.map((it, i) => (
                  <li key={i} className="flex items-baseline gap-3">
                    <span className="font-medium text-slate-800">{it.name}</span>
                    <span className="flex-1 border-b border-dashed border-slate-300" />
                    {it.note && <span className="text-xs text-slate-400">{it.note}</span>}
                    <span className="font-bold text-primary">{it.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ────────────────────────────────────────────────────────────
export function TestimonialsBlock({ c }: { c: SectionContentMap["testimonials"] }) {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading eyebrow={c.eyebrow} title={c.title} highlight={c.titleHighlight} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {c.items.map((t, i) => (
            <div key={i} className="card bg-light border border-slate-100 p-6">
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Icon key={s} name="star" className={`w-4 h-4 ${s < (t.rating || 5) ? "text-primary" : "text-slate-300"}`} />
                ))}
              </div>
              <p className="text-slate-600 italic">“{t.text}”</p>
              <div className="flex items-center gap-3 mt-5">
                <Media seed={`${t.name}-person`} className="w-11 h-11 rounded-full" />
                <div>
                  <p className="font-semibold text-secondary">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ (native accordion, no JS) ───────────────────────────────────────────
export function FaqBlock({ c }: { c: SectionContentMap["faq"] }) {
  return (
    <section className="py-20 bg-light">
      <div className="mx-auto max-w-3xl px-4">
        <SectionHeading eyebrow={c.eyebrow} title={c.title} highlight={c.titleHighlight} />
        <div className="space-y-3">
          {c.items.map((f, i) => (
            <details key={i} className="card bg-white border border-slate-200 group">
              <summary className="cursor-pointer list-none flex items-center justify-between p-5 font-semibold text-secondary">
                {f.q}
                <Icon name="arrow" className="w-4 h-4 text-primary transition-transform group-open:rotate-90" />
              </summary>
              <p className="px-5 pb-5 text-slate-600 -mt-1">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Partner logos (text-based) ──────────────────────────────────────────────
export function LogosBlock({ c }: { c: SectionContentMap["logos"] }) {
  return (
    <section className="py-14 bg-white border-y border-slate-100">
      <div className="mx-auto max-w-7xl px-4">
        {c.title && <p className="text-center text-slate-400 text-sm font-semibold tracking-wider uppercase mb-8">{c.title}</p>}
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {c.items.map((l) => (
            <span key={l} className="text-xl font-extrabold text-slate-300">{l}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Features / Why choose us ────────────────────────────────────────────────
export function FeaturesBlock({ c }: { c: SectionContentMap["features"] }) {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {c.items.map((f, i) => (
            <div key={i} className="card bg-light border border-slate-100 p-6 text-center hover:shadow-md transition-shadow">
              <span className="inline-flex w-14 h-14 rounded-2xl bg-primary/15 items-center justify-center mb-4">
                <Icon name={f.icon} className="w-6 h-6 text-primary" />
              </span>
              <h4 className="font-semibold text-secondary">{f.title}</h4>
              {f.text && <p className="text-sm text-slate-500 mt-1.5">{f.text}</p>}
            </div>
          ))}
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
  return (
    <section className="py-20 bg-light">
      <div className="mx-auto max-w-4xl px-4">
        <SectionHeading eyebrow={c.eyebrow} title={c.title} highlight={c.titleHighlight} />
        <div className="aspect-video rounded-2xl overflow-hidden shadow-lg bg-slate-900">
          {c.url ? (
            <iframe src={embedUrl(c.url)} className="w-full h-full" allow="accelerate-sensor; autoplay; encrypted-media; picture-in-picture" allowFullScreen title="Video" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/50">Add a video URL in the editor</div>
          )}
        </div>
        {c.caption && <p className="text-center text-slate-500 mt-4">{c.caption}</p>}
      </div>
    </section>
  );
}

// ─── Full-width image banner with CTA ────────────────────────────────────────
export function ImageBannerBlock({ c }: { c: SectionContentMap["imageBanner"] }) {
  return (
    <section className="relative py-24 overflow-hidden">
      <Media src={c.image} seed={`${c.title}-banner`} className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 bg-[var(--c-secondary)]/75" />
      <div className="relative mx-auto max-w-3xl px-4 text-center text-white">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">{c.title}</h2>
        {c.subtitle && <p className="mt-3 text-white/85 text-lg">{c.subtitle}</p>}
        {c.buttonLabel && (
          <Link href={c.buttonHref || "#"} className="btn-primary inline-flex items-center gap-2 mt-7 px-7 py-3.5 font-semibold">
            {c.buttonLabel} <Icon name="arrow" className="w-4 h-4" />
          </Link>
        )}
      </div>
    </section>
  );
}

// ─── Contact info + map ──────────────────────────────────────────────────────
export function ContactInfoBlock({ c }: { c: SectionContentMap["contactInfo"] }) {
  const rows = [
    { icon: "map", label: "Address", value: c.address },
    { icon: "phone", label: "Phone", value: c.phone },
    { icon: "mail", label: "Email", value: c.email },
    { icon: "clock", label: "Working hours", value: c.hours },
  ].filter((r) => r.value);
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading eyebrow={c.eyebrow} title={c.title} highlight={c.titleHighlight} />
        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          <ul className="space-y-5">
            {rows.map((r) => (
              <li key={r.label} className="flex gap-4">
                <span className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                  <Icon name={r.icon} className="w-5 h-5 text-primary" />
                </span>
                <div>
                  <p className="text-sm text-slate-400">{r.label}</p>
                  <p className="font-semibold text-secondary">{r.value}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="card overflow-hidden bg-slate-100 min-h-[300px]">
            {c.mapEmbed ? (
              <iframe src={c.mapEmbed} className="w-full h-full min-h-[300px]" loading="lazy" title="Map" />
            ) : (
              <div className="w-full h-full min-h-[300px] flex items-center justify-center text-slate-400">
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
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-3xl px-4 prose prose-slate" dangerouslySetInnerHTML={{ __html: c.html }} />
    </section>
  );
}
