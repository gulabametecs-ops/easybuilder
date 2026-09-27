import Link from "next/link";
import {
  Palette, LayoutDashboard, Inbox, Globe, Rocket, Wrench, Check, ArrowRight, Star, ShieldCheck,
  MousePointerClick, PencilRuler, Images, Send, HelpCircle, FileStack, Sparkles, Phone, Clock,
} from "lucide-react";
import { VERTICALS, verticalsByCategory, verticalName } from "@/lib/verticals";
import { DESIGNS } from "@/lib/designs";
import { getTemplate } from "@/lib/templates";
import { SectorExplorer } from "@/components/marketing/SectorExplorer";
import { DURATIONS, priceFor, formatINR, resolveTiers } from "@/lib/plans";
import { getPlatformConfig } from "@/lib/platformConfig";
import { stockImg } from "@/lib/img";
import { DemoForm } from "@/components/marketing/DemoForm";
import { DemoDesignThumb } from "@/components/marketing/DemoDesignThumb";
import { PricingSection } from "@/components/marketing/PricingSection";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { MarketingSection } from "@/components/marketing/MarketingSection";
import { SectionHeader } from "@/components/marketing/SectionHeader";
import { mkt } from "@/lib/marketingTheme";

const liveVerticals = VERTICALS.filter((v) => v.status === "live");

const STATS = [
  { v: `${liveVerticals.length}+`, l: "Industries ready" },
  { v: `${DESIGNS.length}`, l: "Design styles each" },
  { v: "5 min", l: "To go live" },
  { v: "24/7", l: "Always online" },
];
const CATEGORY_IMAGES: Record<string, string> = {
  "Schools & Coaching": stockImg("classroom students", 640, 360),
  "Home & Local Services": stockImg("homeservice electrician", 640, 360),
  "Food & Hospitality": stockImg("restaurant food", 640, 360),
  Healthcare: stockImg("doctor hospital", 640, 360),
  "Trade & Manufacturing": stockImg("manufacturing warehouse", 640, 360),
};
// Small feature cards (the two big ones are laid out by hand in the bento grid).
const FEATURES = [
  { icon: FileStack, title: "Pages & sections", text: "Visual builder with 30+ ready sections — hero, services, gallery, pricing, forms and more." },
  { icon: Wrench, title: "Ready sector content", text: "Services, gallery, FAQs and testimonials pre-written per industry. Edit, don't start from scratch." },
  { icon: Rocket, title: "SEO & marketing", text: "Meta tags, sitemap, instant indexing, campaigns and promo banners built into every site." },
  { icon: Globe, title: "Your own domain", text: "Start on a free subdomain, connect a custom domain from settings whenever you're ready." },
  { icon: Sparkles, title: "AI website builder", text: "Describe your business and get a complete multi-page draft — then refine it by chatting." },
  { icon: ShieldCheck, title: "Secure by default", text: "Isolated data per business, secure sessions and the leads you collect belong only to you." },
];
const STEPS = [
  { icon: MousePointerClick, t: "Pick sector & design", d: "Choose your industry, one of 5 design styles and a plan — pay securely in seconds." },
  { icon: PencilRuler, t: "Make it yours", d: "Logo, colours, fonts, header and footer from your admin panel — no code." },
  { icon: Images, t: "Add your content", d: "Services, photos, pages and business details. Everything stays editable." },
  { icon: Send, t: "Go live & get leads", d: "Share your link — enquiries and bookings land straight in your inbox." },
];
const TESTIMONIALS = [
  { n: "Rahul M.", r: "Home services · Delhi", s: "home-services", t: "Got my website live in minutes and started getting quote requests the same week." },
  { n: "Dr. Anita S.", r: "Clinic · Mumbai", s: "hospital-clinic", t: "Patients now book appointments online and the admin panel is genuinely easy to use." },
  { n: "Sana K.", r: "Study-abroad consultancy · Pune", s: "education-consultancy", t: "The template already had universities, courses and enquiry forms — I only added my details." },
  { n: "Vikram R.", r: "Gym owner · Jaipur", s: "gym-fitness", t: "Membership plans and free-trial bookings on one page. Walk-ins asking about the website doubled." },
  { n: "Meera J.", r: "School principal · Indore", s: "school", t: "Notices and board results go up in a minute. Parents check the site instead of calling the office." },
  { n: "Arjun P.", r: "Restaurant · Hyderabad", s: "restaurant-hotel", t: "Switched to the Elegant design — the menu and table booking look premium without a designer." },
];
const FAQS = [
  { q: "Do I need any coding or technical skills?", a: "Not at all. Everything is point-and-click from your admin panel — change text, images, colours, services and pages without touching code." },
  { q: "What are the 5 design styles?", a: "Every sector template comes in Original, Modern, Bold, Elegant and Minimal. Each changes the colours, fonts, header, footer and layout. Preview all five on the live demos page and pick one at checkout." },
  { q: "Can I try it before I pay?", a: "Yes — every sector has a live demo with the full website and admin panel. Verify once with OTP and switch between sectors freely." },
  { q: "How fast does my website go live?", a: "Instantly. The moment your payment succeeds, your complete website and admin panel are created automatically." },
  { q: "Can I use my own domain?", a: "Yes. You start on a free subdomain and can connect your own custom domain anytime on the Premium plan." },
  { q: "How do leads and appointments work?", a: "Every quote, contact and booking form on your site saves directly to your admin panel, where you can track status, call the customer and mark it done." },
  { q: "What does the AI builder do?", a: "Describe your business in plain words and it plans the pages and writes the content. You see a live preview, refine it by chatting, and can buy that exact site." },
  { q: "What if I want to cancel or get a refund?", a: "You can cancel anytime — a time-based plan simply won't renew. We also offer a 7-day refund window on your first purchase (see Terms)." },
];

export default async function Landing() {
  const cfg = await getPlatformConfig();
  const tiers = resolveTiers(cfg.planOverrides);
  const startPrice = formatINR(Math.min(...tiers.map((t) => priceFor(t, DURATIONS[0]))));

  // One template shown in every design style — palettes computed from its real theme.
  const showcaseColors = getTemplate("home-services").theme.colors;
  const showcase = DESIGNS.map((d) => ({
    id: d.id,
    name: d.name,
    tagline: d.tagline,
    font: d.font || "Template font",
    header: d.header,
    hero: d.hero ?? null,
    colors: d.palette(showcaseColors),
  }));

  return (
    <main>
      <MarketingHero startPrice={startPrice} />

      {/* Sectors */}
      <MarketingSection id="sectors" variant="default">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-14 sm:mb-16">
          {STATS.map((s) => (
            <div key={s.l} className={mkt.statCard}>
              <div className={mkt.statValue}>{s.v}</div>
              <div className={`text-sm mt-1.5 font-medium ${mkt.muted}`}>{s.l}</div>
            </div>
          ))}
        </div>

        <SectionHeader
          eyebrow={<p className={mkt.eyebrow}>Every industry covered</p>}
          title="Explore by category"
          description="Pick a category, browse every sector inside, then try a live demo or subscribe in minutes."
        />

        <SectorExplorer
          categories={verticalsByCategory().map((g) => ({
            name: g.category,
            image: CATEGORY_IMAGES[g.category] ?? stockImg(`${g.category} business`, 640, 360),
            count: g.items.length,
            sectors: g.items.map((v) => ({
              id: v.id,
              name: v.name,
              tagline: v.tagline,
              icon: v.icon,
              status: v.status,
              image: stockImg(v.name, 640, 360),
              description: v.description,
            })),
          }))}
        />
      </MarketingSection>

      {/* Design styles showcase */}
      <MarketingSection id="designs" variant="alt">
        <SectionHeader
          eyebrow={<p className={mkt.eyebrow}>One template · five looks</p>}
          title="Pick the style that fits your brand"
          description="Every sector comes in five complete design styles — colours, fonts, header, footer and layout all change. Switch anytime from your admin."
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {showcase.map((d) => (
            <div key={d.id} className={`group p-2.5 ${mkt.card} ${mkt.cardHover} hover:-translate-y-1`}>
              <div className="overflow-hidden rounded-xl ring-1 ring-black/5 dark:ring-white/10">
                <DemoDesignThumb design={d} />
              </div>
              <div className="px-1.5 pt-3 pb-1">
                <p className="font-semibold text-[var(--mkt-text)]">{d.name}</p>
                <p className={`text-xs mt-1 leading-snug ${mkt.muted}`}>{d.tagline}</p>
                <p className="mt-2 text-[11px] font-medium text-[var(--mkt-accent-text)]">{d.font}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link href="/demos" className={`${mkt.btnPrimary} ${mkt.btnPrimaryLg}`}>
            Preview all designs live <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/ai-builder" className={`${mkt.btnPill} px-6 py-3.5 text-sm`}>
            <Sparkles className="w-4 h-4" /> Or build with AI
          </Link>
        </div>
      </MarketingSection>

      {/* Features — bento */}
      <MarketingSection id="features" variant="default">
        <SectionHeader
          eyebrow={<p className={mkt.eyebrow}>Built for agencies & business owners</p>}
          title="Everything a business website needs"
          description="Website, admin panel and lead inbox in one — the same tools for you and every client you launch."
        />

        <div className="grid gap-4 sm:gap-5 lg:grid-cols-3">
          {/* Big card: admin panel + leads */}
          <div className={`relative overflow-hidden p-6 sm:p-7 lg:col-span-2 ${mkt.card}`}>
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-lime-500/10 blur-3xl" aria-hidden />
            <div className="relative grid gap-6 sm:grid-cols-2 sm:items-center">
              <div>
                <span className="inline-flex w-11 h-11 rounded-xl bg-[var(--mkt-accent-soft)] items-center justify-center">
                  <LayoutDashboard className="w-5 h-5 text-[var(--mkt-accent-text)]" strokeWidth={2.25} />
                </span>
                <h3 className="mt-4 text-xl font-bold text-[var(--mkt-text)]">A real admin panel, not just a website</h3>
                <p className={`mt-2 text-sm leading-relaxed ${mkt.muted}`}>
                  Every site gets its own dashboard — leads, appointments, pages, services, gallery, SEO, billing and team access.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-[var(--mkt-text-secondary)]">
                  {["Lead & booking inbox with status", "Visual page & section editor", "Billing, renewals & invoices"].map((t) => (
                    <li key={t} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-lime-500" strokeWidth={2.5} /> {t}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Mini lead inbox mock */}
              <div className="rounded-xl border border-[var(--mkt-border)] bg-[var(--mkt-surface-muted)] p-3 shadow-sm" aria-hidden>
                <div className="flex items-center justify-between px-1 pb-2">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-[var(--mkt-text)]">
                    <Inbox className="w-3.5 h-3.5 text-lime-500" /> Leads
                  </span>
                  <span className="rounded-full bg-lime-500 px-1.5 text-[10px] font-bold text-slate-950">3 new</span>
                </div>
                {[
                  { n: "Aisha Khan", s: "Quote · Painting", st: "New", c: "bg-lime-500/15 text-lime-700 dark:text-lime-400" },
                  { n: "Vikram S.", s: "Appointment · Dental", st: "Called", c: "bg-sky-500/15 text-sky-700 dark:text-sky-400" },
                  { n: "Priya M.", s: "Admission enquiry", st: "Done", c: "bg-slate-500/15 text-[var(--mkt-text-muted)]" },
                ].map((l) => (
                  <div key={l.n} className="mt-1.5 flex items-center justify-between gap-2 rounded-lg bg-[var(--mkt-surface)] px-2.5 py-2 ring-1 ring-[var(--mkt-border)]">
                    <span className="min-w-0">
                      <span className="block truncate text-xs font-semibold text-[var(--mkt-text)]">{l.n}</span>
                      <span className={`block text-[10px] ${mkt.muted}`}>{l.s}</span>
                    </span>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${l.c}`}>{l.st}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tall card: design control */}
          <div className={`relative overflow-hidden p-6 sm:p-7 ${mkt.card}`}>
            <span className="inline-flex w-11 h-11 rounded-xl bg-[var(--mkt-accent-soft)] items-center justify-center">
              <Palette className="w-5 h-5 text-[var(--mkt-accent-text)]" strokeWidth={2.25} />
            </span>
            <h3 className="mt-4 text-xl font-bold text-[var(--mkt-text)]">Full design control</h3>
            <p className={`mt-2 text-sm leading-relaxed ${mkt.muted}`}>
              5 styles per sector, plus your own logo, colours and fonts. Changes go live instantly.
            </p>
            <p className={`mt-6 text-[11px] font-semibold uppercase tracking-wider ${mkt.muted}`}>Brand colours</p>
            <div className="mt-2 flex flex-wrap gap-2" aria-hidden>
              {liveVerticals.slice(0, 10).map((v) => (
                <span key={v.id} className="h-7 w-7 rounded-full ring-2 ring-[var(--mkt-surface)] shadow-sm" style={{ background: v.accent }} title={v.name} />
              ))}
            </div>
            <p className={`mt-5 text-[11px] font-semibold uppercase tracking-wider ${mkt.muted}`}>Typography</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {DESIGNS.filter((d) => d.font).map((d) => (
                <span key={d.id} className="rounded-lg border border-[var(--mkt-border)] bg-[var(--mkt-surface-muted)] px-2.5 py-1 text-xs text-[var(--mkt-text)]">
                  <span className="font-bold">Aa</span> {d.font}
                </span>
              ))}
            </div>
          </div>

          {FEATURES.map((f) => (
            <div key={f.title} className={`group p-6 ${mkt.card} ${mkt.cardHover}`}>
              <span className="inline-flex w-10 h-10 rounded-xl bg-[var(--mkt-accent-soft)] group-hover:bg-lime-500/20 items-center justify-center transition-colors">
                <f.icon className="w-5 h-5 text-[var(--mkt-accent-text)]" strokeWidth={2.25} />
              </span>
              <h3 className="mt-4 font-semibold text-[var(--mkt-text)]">{f.title}</h3>
              <p className={`text-sm mt-1.5 leading-relaxed ${mkt.muted}`}>{f.text}</p>
            </div>
          ))}
        </div>
      </MarketingSection>

      {/* How it works — timeline */}
      <MarketingSection id="how" variant="alt">
        <SectionHeader
          eyebrow={<p className={mkt.eyebrow}>Get started in minutes</p>}
          title="From sign-up to first lead"
          description="Four simple steps, zero code."
        />

        <ol className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          <div className="hidden lg:block absolute top-7 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-lime-500/0 via-lime-500/40 to-lime-500/0" aria-hidden />
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <li key={s.t} className="relative text-center">
                <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-500 text-slate-950 shadow-lg shadow-lime-600/25">
                  <Icon className="w-6 h-6" strokeWidth={2.25} />
                </div>
                <p className="mt-5 text-xs font-bold tracking-[0.2em] text-[var(--mkt-accent-text)]">STEP {String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-1.5 font-semibold text-lg text-[var(--mkt-text)]">{s.t}</h3>
                <p className={`mx-auto mt-2 max-w-[16rem] text-sm leading-relaxed ${mkt.muted}`}>{s.d}</p>
              </li>
            );
          })}
        </ol>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-12 sm:mt-14">
          <Link href="/subscribe" className={`${mkt.btnPrimary} ${mkt.btnPrimaryLg}`}>
            Get started now <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/demos" className={`${mkt.btnPill} px-7 py-3.5 text-sm`}>
            Try live demos
          </Link>
        </div>
      </MarketingSection>

      {/* Testimonials */}
      <MarketingSection variant="default">
        <SectionHeader
          eyebrow={<p className={mkt.eyebrow}>Real businesses</p>}
          title="Loved by business owners"
          description="Clinics, schools, gyms, restaurants and service businesses use StandardSaaS to go live fast."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => {
            const initials = t.n.split(/\s+/).map((w) => w[0]).join("").slice(0, 2);
            return (
              <figure key={t.n} className={`flex flex-col p-6 sm:p-7 ${mkt.card} ${mkt.cardHover}`}>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex gap-0.5" aria-label="5 out of 5 stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <span className="rounded-full bg-[var(--mkt-accent-soft)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--mkt-accent-text)]">
                    {verticalName(t.s)}
                  </span>
                </div>
                <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-[var(--mkt-text-secondary)]">&ldquo;{t.t}&rdquo;</blockquote>
                <figcaption className="mt-6 flex items-center gap-3 pt-5 border-t border-[var(--mkt-border)]">
                  <span className="w-10 h-10 rounded-full bg-gradient-to-br from-lime-400 to-emerald-500 text-slate-950 font-bold text-sm flex items-center justify-center shrink-0">
                    {initials}
                  </span>
                  <div>
                    <p className="font-semibold text-[var(--mkt-text)]">{t.n}</p>
                    <p className={`text-xs mt-0.5 ${mkt.muted}`}>{t.r}</p>
                  </div>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </MarketingSection>

      <PricingSection tiers={tiers} />

      {/* FAQ */}
      <MarketingSection id="faq" variant="alt" container="narrow">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <span className={mkt.badge}>
              <HelpCircle className="w-3.5 h-3.5" /> FAQ
            </span>
            <h2 className={`${mkt.h2} mt-4`}>Questions? Answered.</h2>
            <p className={`mt-3 text-[15px] leading-relaxed ${mkt.muted}`}>
              Everything you need to know before getting started. Can&apos;t find your answer?
            </p>
            <a href="#demo" className={`mt-6 inline-flex ${mkt.btnPill} px-5 py-2.5 text-sm`}>
              Talk to us <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <details
                key={f.q}
                open={i === 0}
                className={`group ${mkt.card} open:border-lime-500/40 open:shadow-md open:shadow-lime-500/5 transition-all duration-300`}
              >
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4 px-5 py-4 font-semibold text-[var(--mkt-text)] [&::-webkit-details-marker]:hidden">
                  <span className="text-[15px] leading-snug">{f.q}</span>
                  <span className="shrink-0 w-7 h-7 rounded-full bg-lime-500/15 flex items-center justify-center text-lime-600 dark:text-lime-400 text-lg leading-none transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className={`px-5 pb-5 -mt-1 text-sm leading-relaxed ${mkt.muted}`}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </MarketingSection>

      {/* Final CTA + demo request */}
      <MarketingSection id="demo" variant="default">
        <div className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-10 sm:px-10 sm:py-14 text-white ring-1 ring-white/10">
          <div className="absolute -left-20 -top-24 h-72 w-72 rounded-full bg-lime-500/25 blur-3xl" aria-hidden />
          <div className="absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl" aria-hidden />
          <div className="relative grid gap-10 lg:grid-cols-2 lg:gap-12 lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-lime-400">Get started today</p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
                Launch your website <span className="text-lime-400">this week.</span>
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-slate-300">
                Pick a sector, choose a design and go live — or ask us for a guided walkthrough.
              </p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {["Try a live demo before you buy", "Website ready in minutes", "Free subdomain included", "Cancel anytime — no lock-in"].map((t) => (
                  <li key={t} className="flex items-center gap-2.5 text-sm text-slate-200">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lime-500/20">
                      <Check className="w-3 h-3 text-lime-400" strokeWidth={3} />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/subscribe" className={`${mkt.btnPrimary} ${mkt.btnPrimaryLg}`}>
                  Start from {startPrice} <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/demos" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition">
                  Browse live demos
                </Link>
              </div>
              <p className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Reply within 24 hours</span>
                <span className="inline-flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Guided setup on request</span>
              </p>
            </div>

            <div className="rounded-2xl bg-[var(--mkt-surface)] p-6 sm:p-8 text-[var(--mkt-text-secondary)] shadow-2xl ring-1 ring-black/5">
              <h3 className="font-bold text-lg text-[var(--mkt-text)]">Request a guided demo</h3>
              <p className={`text-sm mt-1 mb-6 ${mkt.muted}`}>Tell us about your business — we&apos;ll reach out within 24 hours.</p>
              <DemoForm />
            </div>
          </div>
        </div>
      </MarketingSection>
    </main>
  );
}
