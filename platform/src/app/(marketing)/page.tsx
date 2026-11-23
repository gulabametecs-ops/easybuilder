import {
  ArrowRight, Palette, Star, ShieldCheck, Sparkles, Clock, Headphones, Wand2, MessageCircle, Phone, Mail,
  CalendarCheck, LayoutGrid, Building2, CreditCard, BarChart3, MousePointerClick, Rocket, BellRing,
  Zap, LayoutDashboard, Search, Lock, Receipt,
} from "lucide-react";
import { VERTICALS, verticalsByCategory } from "@/lib/verticals";
import { DESIGNS } from "@/lib/designs";
import { IndustryGrid } from "@/components/marketing/HomeSections";
import { priceFor, formatINR, resolveTiers, resolveDurations } from "@/lib/plans";
import { getPlatformConfig } from "@/lib/platformConfig";
import { stockImg } from "@/lib/img";
import { DemoForm } from "@/components/marketing/DemoForm";
import { PricingSection } from "@/components/marketing/PricingSection";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { MarketingSection } from "@/components/marketing/MarketingSection";
import { SectionHeader } from "@/components/marketing/SectionHeader";
import { mkt } from "@/lib/marketingTheme";
import { getTemplate } from "@/lib/templates";
import type { HeroShowcase } from "@/components/marketing/MarketingHero";
import { sectorPreview } from "@/lib/sectorPreview";
import { DEMO_PHOTOS } from "@/lib/demoPhotoLibrary";

const liveVerticals = VERTICALS.filter((v) => v.status === "live");

// Hero mad-lib: "I run a <word> in <city>." → preview of <vertical> in <design>.
const SHOWCASE: { word: string; article: "a" | "an"; city: string; brand: string; vertical: string; design: string; img: string }[] = [
  { word: "gym", article: "a", city: "Jaipur", brand: "Fitness", vertical: "gym-fitness", design: "bold", img: "gym fitness training" },
  { word: "school", article: "a", city: "Indore", brand: "Public School", vertical: "school", design: "classic", img: "school campus students" },
  { word: "clinic", article: "a", city: "Mumbai", brand: "Care Clinic", vertical: "hospital-clinic", design: "modern", img: "doctor clinic" },
  { word: "restaurant", article: "a", city: "Delhi", brand: "Kitchen", vertical: "restaurant-hotel", design: "elegant", img: "restaurant fine dining" },
  { word: "salon", article: "a", city: "Bengaluru", brand: "Salon & Spa", vertical: "salon-spa", design: "elegant", img: "salon beauty" },
  { word: "coaching institute", article: "a", city: "Kota", brand: "Academy", vertical: "coaching", design: "modern", img: "students classroom coaching" },
  { word: "café", article: "a", city: "Goa", brand: "Café & Bakery", vertical: "cafe-bakery", design: "minimal", img: "cafe bakery coffee" },
  { word: "dental clinic", article: "a", city: "Chennai", brand: "Smiles", vertical: "dental-clinic", design: "modern", img: "dental dentist" },
  { word: "NGO", article: "an", city: "Pune", brand: "Foundation", vertical: "ngo-charity", design: "minimal", img: "charity children volunteers" },
  { word: "wedding business", article: "a", city: "Udaipur", brand: "Weddings", vertical: "wedding-planner", design: "elegant", img: "wedding" },
];
function buildShowcase(): HeroShowcase[] {
  return SHOWCASE.flatMap(({ word, article, city, brand, vertical, design: designId, img }) => {
    const v = VERTICALS.find((x) => x.id === vertical);
    const d = DESIGNS.find((x) => x.id === designId);
    if (!v || !d) return [];
    const design = {
      id: d.id, name: d.name, blurb: d.blurb, tagline: d.tagline, font: d.font, header: d.header,
      hero: d.hero ?? null, colors: d.palette(getTemplate(v.id).theme.colors),
    };
    const sector = {
      id: v.id, name: v.name, tagline: v.tagline, icon: v.icon, status: v.status, category: "",
      accent: v.accent, ...sectorPreview(v.id), description: v.description, designs: [design],
      image: sectorPreview(v.id).photos[0] ?? stockImg(img, 1280, 720),
    };
    return [{ word, article, city, brand, sector, design }];
  });
}

const STATS = [
  { v: `${liveVerticals.length}+`, l: "industries ready" },
  { v: `${DESIGNS.length}`, l: "design styles each" },
  { v: "5 min", l: "to go live" },
];
// Category cards use a hand-checked photo from a representative sector's demo library.
const CATEGORY_REP: Record<string, string> = {
  "Schools & Coaching": "school",
  "Home & Local Services": "home-services",
  "Food & Hospitality": "restaurant-hotel",
  Healthcare: "hospital-clinic",
  "Trade & Manufacturing": "manufacturing",
  "Real Estate & Property": "real-estate-broker",
  "Fitness & Wellness": "gym-fitness",
  "Community & Non-profit": "ngo-charity",
  "Events & Training": "events-training",
  "Corporate & Professional Services": "it-services",
};
function categoryPhoto(category: string): string | null {
  const id = DEMO_PHOTOS[CATEGORY_REP[category] ?? ""]?.[0]?.id;
  return id ? `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=720&h=420&q=80` : null;
}
const CATEGORY_IMAGES: Record<string, string> = {
  "Schools & Coaching": stockImg("classroom students", 640, 360),
  "Home & Local Services": stockImg("homeservice electrician", 640, 360),
  "Food & Hospitality": stockImg("restaurant food", 640, 360),
  Healthcare: stockImg("doctor hospital", 640, 360),
  "Trade & Manufacturing": stockImg("manufacturing warehouse", 640, 360),
};
// Eight features, one short line each — every plan includes them.
const FEATURES = [
  { icon: LayoutGrid, title: `${liveVerticals.length}+ ready industries`, text: "Pages and content pre-written for your business." },
  { icon: Palette, title: "5 design styles", text: "Change the whole look in one click." },
  { icon: Sparkles, title: "AI website builder", text: "Describe it, then edit by chat." },
  { icon: MessageCircle, title: "Leads on WhatsApp", text: "Every enquiry in your inbox and WhatsApp." },
  { icon: Building2, title: "Sector tools", text: "Listings, causes, events, notices and results." },
  { icon: CreditCard, title: "Donations & invoices", text: "Razorpay/UPI donations and GST invoices." },
  { icon: BarChart3, title: "SEO & visitor stats", text: "Found on Google, with page-view stats." },
  { icon: ShieldCheck, title: "Domain & security", text: "Free SSL, custom domain, private data." },
];
// Strip under the hero: what every plan includes.
const INCLUDED = [
  { icon: Zap, t: "Live in 5 min", d: "No coding needed" },
  { icon: LayoutDashboard, t: "Admin panel", d: "Edit it yourself" },
  { icon: MessageCircle, t: "WhatsApp leads", d: "Instant enquiries" },
  { icon: Search, t: "Google SEO", d: "Built in" },
  { icon: Lock, t: "Hosting & SSL", d: "Free & secure" },
  { icon: Receipt, t: "GST invoice", d: "For every plan" },
];
const STEPS = [
  { icon: MousePointerClick, t: "Pick your industry", d: "Choose a sector, a design and a plan." },
  { icon: Palette, t: "Make it yours", d: "Logo, colours and content — no code." },
  { icon: Rocket, t: "Go live instantly", d: "Site + admin panel ready on payment." },
  { icon: BellRing, t: "Get leads", d: "Enquiries land in your inbox & WhatsApp." },
];
const TESTIMONIALS = [
  { n: "Dr. Anita S.", r: "Clinic owner · Mumbai", t: "Patients now book appointments online and the admin panel is genuinely easy to use." },
  { n: "Vikram R.", r: "Gym owner · Jaipur", t: "Membership plans and free-trial bookings on one page. Walk-ins asking about the website doubled." },
  { n: "Meera J.", r: "School principal · Indore", t: "Notices and board results go up in a minute. Parents check the site instead of calling." },
];
const FAQS = [
  { q: "Do I need any coding or technical skills?", a: "Not at all. Everything is point-and-click from your admin panel — change text, images, colours, services and pages without touching code." },
  { q: "What are the 5 design styles?", a: "Every sector template comes in Original, Modern, Bold, Elegant and Minimal. Each changes the colours, fonts, header, footer and layout. Preview all five on the live demos page and pick one at checkout." },
  { q: "Can I try it before I pay?", a: "Yes — every sector has a live demo with the full website and admin panel. Verify once with OTP and switch between sectors freely." },
  { q: "How fast does my website go live?", a: "Instantly. The moment your payment succeeds, your complete website and admin panel are created automatically." },
  { q: "Can I use my own domain?", a: "Yes. You start on a free subdomain and can connect your own custom domain anytime on the Professional or Premium plan." },
  { q: "How do leads and appointments work?", a: "Every quote, contact and booking form on your site saves directly to your admin panel, where you can track status, call the customer and mark it done." },
  { q: "What does the AI builder do?", a: "Describe your business in plain words and it plans the pages and writes the content. You see a live preview, refine it by chatting, and can buy that exact site." },
  { q: "What if I want to cancel or get a refund?", a: "You can cancel anytime — a time-based plan simply won't renew. We also offer a 7-day refund window on your first purchase (see Terms)." },
];

function Eyebrow({ children }: { children: string }) {
  return <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--mkt-accent-text)]">{children}</span>;
}

function Stars() {
  return (
    <div className="flex gap-0.5" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
      ))}
    </div>
  );
}

function Initials({ name, big }: { name: string; big?: boolean }) {
  const initials = name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2);
  return (
    <span className={`${big ? "h-12 w-12 text-base" : "h-10 w-10 text-sm"} flex shrink-0 items-center justify-center rounded-full mkt-brand-grad font-bold`}>
      {initials}
    </span>
  );
}

export default async function Landing() {
  const cfg = await getPlatformConfig();
  const tiers = resolveTiers(cfg.planOverrides);
  const durations = resolveDurations(cfg.planOverrides);
  const startPrice = formatINR(Math.min(...tiers.map((t) => priceFor(t, durations[0]))));


  return (
    <main>
      <MarketingHero startPrice={startPrice} showcase={buildShowcase()} />

      {/* Included-in-every-plan card, floating over the hero's bottom edge */}
      <div className={`${mkt.container} relative z-10 -mt-6 sm:-mt-8`}>
        <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[var(--mkt-border)] bg-[var(--mkt-border)] shadow-[0_18px_50px_-24px_rgba(15,23,42,0.35)] sm:grid-cols-3 lg:grid-cols-6">
          {INCLUDED.map((x) => (
            <li key={x.t} className="group flex items-center gap-2.5 bg-[var(--mkt-surface)] px-3.5 py-3.5 transition-colors hover:bg-[var(--mkt-surface-muted)]">
              <span className="mkt-brand-grad flex h-8 w-8 shrink-0 items-center justify-center rounded-lg shadow-md shadow-[var(--mkt-brand)]/20 transition-transform duration-300 group-hover:scale-105">
                <x.icon className="h-4 w-4" strokeWidth={2.2} />
              </span>
              <span className="min-w-0 leading-tight">
                <span className="block text-[13px] font-semibold text-[var(--mkt-text)]">{x.t}</span>
                <span className={`mt-0.5 block text-[11.5px] ${mkt.muted}`}>{x.d}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Sectors */}
      <MarketingSection id="sectors" variant="default">
        <div className="mb-10 flex flex-col gap-8 lg:mb-12 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            align="left"
            className="!mb-0"
            eyebrow={<Eyebrow>Industries</Eyebrow>}
            title="A ready website for your industry"
            description="Pick a category, open a sector and try its live demo — or start with it right away."
          />
          <dl className="flex shrink-0 divide-x divide-[var(--mkt-border)]">
            {STATS.map((s) => (
              <div key={s.l} className="px-5 first:pl-0 last:pr-0 sm:px-7">
                <dt className="sr-only">{s.l}</dt>
                <dd className="text-2xl font-bold tracking-tight text-[var(--mkt-text)] sm:text-3xl">{s.v}</dd>
                <dd className={`mt-1 text-xs sm:text-sm ${mkt.muted}`}>{s.l}</dd>
              </div>
            ))}
          </dl>
        </div>

        <IndustryGrid
          categories={verticalsByCategory().map((g) => ({
            name: g.category,
            image: categoryPhoto(g.category) ?? CATEGORY_IMAGES[g.category] ?? stockImg(`${g.category} business`, 640, 360),
            sectors: g.items.map((v) => ({ id: v.id, name: v.name, icon: v.icon })),
          }))}
        />
      </MarketingSection>

      {/* Features */}
      <MarketingSection id="features" variant="alt">
        <SectionHeader
          eyebrow={<Eyebrow>Platform</Eyebrow>}
          title="More than just a website"
          description="Everything a local business needs to get online, win enquiries and get paid."
        />
        {/* Simple feature grid: 2 rows × 4, hairline dividers, no boxes */}
        <ul className="grid overflow-hidden rounded-3xl border border-[var(--mkt-border)] bg-[var(--mkt-border)] [gap:1px] sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <li key={f.title} className="group bg-[var(--mkt-surface)] p-6 transition-colors hover:bg-[var(--mkt-surface-muted)]">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--mkt-accent-soft)] text-[var(--mkt-brand)] transition-transform duration-300 group-hover:-translate-y-0.5">
                <f.icon className="h-5 w-5" strokeWidth={2} />
              </span>
              <h3 className="mt-4 text-[15px] font-semibold text-[var(--mkt-text)]">{f.title}</h3>
              <p className={`mt-1 text-[13px] leading-relaxed ${mkt.muted}`}>{f.text}</p>
            </li>
          ))}
        </ul>
      </MarketingSection>

      {/* How it works */}
      <MarketingSection id="how" variant="default">
        <SectionHeader eyebrow={<Eyebrow>How it works</Eyebrow>} title="Live in four simple steps" />
        <ol className="relative mt-2 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {/* dashed connector through the icon centres */}
          <span className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-7 hidden border-t-2 border-dashed border-[var(--mkt-border-strong)] lg:block" aria-hidden />
          {STEPS.map((s, i) => (
            <li key={s.t} className="group relative flex flex-col items-center text-center">
              <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl mkt-brand-grad shadow-lg shadow-[var(--mkt-brand)]/25 ring-8 ring-[var(--mkt-bg)] transition-transform duration-300 group-hover:-translate-y-1">
                <s.icon className="h-6 w-6" strokeWidth={2} />
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--mkt-text)] text-[11px] font-bold text-[var(--mkt-bg)] ring-2 ring-[var(--mkt-bg)]">
                  {i + 1}
                </span>
              </span>
              <h3 className="mt-4 text-[15px] font-semibold text-[var(--mkt-text)]">{s.t}</h3>
              <p className={`mt-1 max-w-[17rem] text-[13px] leading-relaxed ${mkt.muted}`}>{s.d}</p>
            </li>
          ))}
        </ol>
      </MarketingSection>

      {/* Testimonials */}
      <MarketingSection variant="alt">
        <SectionHeader eyebrow={<Eyebrow>Customers</Eyebrow>} title="Loved by business owners" description="Clinics, schools, gyms and service businesses run their websites on SitePixl." />
        <div className="grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.n} className={`flex flex-col p-6 sm:p-7 ${mkt.card}`}>
              <Stars />
              <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-[var(--mkt-text-secondary)]">&ldquo;{t.t}&rdquo;</blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-[var(--mkt-border)] pt-5">
                <Initials name={t.n} />
                <div className="min-w-0">
                  <p className="truncate font-semibold text-[var(--mkt-text)]">{t.n}</p>
                  <p className={`truncate text-xs ${mkt.muted}`}>{t.r}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </MarketingSection>

      <PricingSection tiers={tiers} durations={durations} />

      {/* FAQ */}
      <MarketingSection id="faq" variant="alt" container="narrow">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <h2 className={mkt.h2}>Questions, answered</h2>
            <p className={`mt-3 text-[15px] leading-relaxed ${mkt.muted}`}>
              Everything you need to know before getting started. Still unsure? Our team is happy to help.
            </p>
            <a href="#contact" className={`mt-6 inline-flex ${mkt.btnPill} px-5 py-2.5 text-sm`}>
              Talk to us <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <div className="divide-y divide-[var(--mkt-border)] border-y border-[var(--mkt-border)]">
            {FAQS.map((f, i) => (
              <details key={f.q} open={i === 0} className="group py-1">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-semibold text-[var(--mkt-text)] [&::-webkit-details-marker]:hidden">
                  <span className="text-[15px] leading-snug">{f.q}</span>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--mkt-border)] text-lg leading-none text-[var(--mkt-text-secondary)] transition-transform duration-300 group-open:rotate-45 group-open:border-[var(--mkt-accent)] group-open:text-[var(--mkt-accent)]">
                    +
                  </span>
                </summary>
                <p className={`pb-5 pr-10 text-sm leading-relaxed ${mkt.muted}`}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </MarketingSection>

      {/* Talk to us — guided demo request */}
      <MarketingSection id="contact" variant="default">
        <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="lg:pt-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--mkt-border)] bg-[var(--mkt-surface)] px-3 py-1 text-xs font-semibold text-[var(--mkt-text-secondary)] shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Free · No obligation
            </span>
            <h2 className={`mt-4 ${mkt.h2}`}>
              Prefer a <span className="mkt-gradient-text">guided walkthrough?</span>
            </h2>
            <p className={`mt-4 max-w-md text-[15px] leading-relaxed ${mkt.muted}`}>
              Tell us about your business and we&apos;ll show you the right sector, design and plan — and help you get set up.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                { icon: Clock, t: "Reply within 24 hours", d: "On call, WhatsApp or email — your choice." },
                { icon: Wand2, t: "Right design for your brand", d: "We help you pick the style that fits." },
                { icon: Headphones, t: "Hands-on setup help", d: "Content, domain and go-live, guided." },
              ].map(({ icon: Icon, t, d }) => (
                <li
                  key={t}
                  className="flex items-center gap-4 rounded-2xl border border-[var(--mkt-border)] bg-[var(--mkt-surface)] p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--mkt-brand)]/40 hover:shadow-md"
                >
                  <span className="mkt-brand-grad flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-md">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block font-semibold text-[var(--mkt-text)]">{t}</span>
                    <span className={`block text-sm ${mkt.muted}`}>{d}</span>
                  </span>
                </li>
              ))}
            </ul>
            {(cfg.supportPhone || cfg.supportEmail) && (
              <div className="mt-6">
                <p className={`text-xs font-semibold uppercase tracking-wider ${mkt.muted}`}>Or reach us directly</p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {cfg.supportPhone && (
                    <a
                      href={`https://wa.me/${cfg.supportPhone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-[#25d366] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-105"
                    >
                      <MessageCircle className="h-4 w-4" /> WhatsApp
                    </a>
                  )}
                  {cfg.supportPhone && (
                    <a href={`tel:${cfg.supportPhone.replace(/\s+/g, "")}`} className={`${mkt.btnPill} px-4 py-2 text-sm`}>
                      <Phone className="h-4 w-4" /> {cfg.supportPhone}
                    </a>
                  )}
                  {cfg.supportEmail && (
                    <a href={`mailto:${cfg.supportEmail}`} className={`${mkt.btnPill} px-4 py-2 text-sm`}>
                      <Mail className="h-4 w-4" /> Email us
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-[var(--mkt-brand)]/15 via-transparent to-[#7c3aed]/15 blur-2xl" aria-hidden />
            <div className={`${mkt.card} relative overflow-hidden p-6 shadow-2xl sm:p-8`}>
              <span className="mkt-brand-grad absolute inset-x-0 top-0 h-1" aria-hidden />
              <div className="mb-6 flex items-start gap-3.5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--mkt-accent-soft)] text-[var(--mkt-brand)] ring-1 ring-[var(--mkt-border)]">
                  <CalendarCheck className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold text-[var(--mkt-text)]">Request a guided demo</h3>
                  <p className={`mt-0.5 text-sm ${mkt.muted}`}>Takes 30 seconds. No payment needed.</p>
                </div>
                <span className="hidden shrink-0 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-700 sm:inline dark:text-emerald-400">
                  FREE
                </span>
              </div>
              <DemoForm sectors={liveVerticals.map((v) => ({ id: v.id, name: v.name }))} />
            </div>
          </div>
        </div>
      </MarketingSection>

    </main>
  );
}
