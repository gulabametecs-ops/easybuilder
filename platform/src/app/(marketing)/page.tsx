import Link from "next/link";
import {
  Palette, LayoutDashboard, Inbox, Globe, Rocket, Wrench, ArrowRight, Star, ShieldCheck,
  FileStack, Sparkles, Clock, Headphones, Wand2,
} from "lucide-react";
import { VERTICALS, verticalsByCategory } from "@/lib/verticals";
import { DESIGNS } from "@/lib/designs";
import { SectorExplorer } from "@/components/marketing/SectorExplorer";
import { DURATIONS, priceFor, formatINR, resolveTiers } from "@/lib/plans";
import { getPlatformConfig } from "@/lib/platformConfig";
import { stockImg } from "@/lib/img";
import { DemoForm } from "@/components/marketing/DemoForm";
import { VerticalIcon } from "@/components/marketing/VerticalIcon";
import { PricingSection } from "@/components/marketing/PricingSection";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { MarketingSection } from "@/components/marketing/MarketingSection";
import { SectionHeader } from "@/components/marketing/SectionHeader";
import { mkt } from "@/lib/marketingTheme";

const liveVerticals = VERTICALS.filter((v) => v.status === "live");

const STATS = [
  { v: `${liveVerticals.length}+`, l: "industries ready" },
  { v: `${DESIGNS.length}`, l: "design styles each" },
  { v: "5 min", l: "to go live" },
];
const CATEGORY_IMAGES: Record<string, string> = {
  "Schools & Coaching": stockImg("classroom students", 640, 360),
  "Home & Local Services": stockImg("homeservice electrician", 640, 360),
  "Food & Hospitality": stockImg("restaurant food", 640, 360),
  Healthcare: stockImg("doctor hospital", 640, 360),
  "Trade & Manufacturing": stockImg("manufacturing warehouse", 640, 360),
};
// Grouped so the section reads as three clear jobs instead of nine identical boxes.
const FEATURE_GROUPS = [
  {
    title: "Build your site",
    text: "Launch a complete website without a designer.",
    items: [
      { icon: FileStack, title: "30+ ready sections", text: "Hero, services, gallery, pricing, forms and more." },
      { icon: Palette, title: "5 design styles", text: "Plus your own logo, colours and fonts." },
      { icon: Sparkles, title: "AI website builder", text: "Describe your business, get a full draft." },
    ],
  },
  {
    title: "Run your business",
    text: "One admin panel for everything after launch.",
    items: [
      { icon: Inbox, title: "Leads & bookings inbox", text: "Every enquiry tracked with status." },
      { icon: LayoutDashboard, title: "Full admin panel", text: "Pages, services, gallery, billing and team." },
      { icon: Wrench, title: "Ready sector content", text: "Services and FAQs pre-written for you." },
    ],
  },
  {
    title: "Grow online",
    text: "Get found on Google and look professional.",
    items: [
      { icon: Rocket, title: "SEO & marketing", text: "Meta tags, sitemap and instant indexing." },
      { icon: Globe, title: "Your own domain", text: "Free subdomain, custom domain anytime." },
      { icon: ShieldCheck, title: "Secure by default", text: "Isolated data — your leads stay yours." },
    ],
  },
];
const STEPS = [
  { t: "Pick sector & design", d: "Choose your industry, one of 5 styles and a plan." },
  { t: "Make it yours", d: "Logo, colours, fonts and content from your admin — no code." },
  { t: "Go live instantly", d: "Your site and admin panel are created the moment you pay." },
  { t: "Get leads & bookings", d: "Enquiries and appointments land straight in your inbox." },
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
  { q: "Can I use my own domain?", a: "Yes. You start on a free subdomain and can connect your own custom domain anytime on the Premium plan." },
  { q: "How do leads and appointments work?", a: "Every quote, contact and booking form on your site saves directly to your admin panel, where you can track status, call the customer and mark it done." },
  { q: "What does the AI builder do?", a: "Describe your business in plain words and it plans the pages and writes the content. You see a live preview, refine it by chatting, and can buy that exact site." },
  { q: "What if I want to cancel or get a refund?", a: "You can cancel anytime — a time-based plan simply won't renew. We also offer a 7-day refund window on your first purchase (see Terms)." },
];

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
    <span className={`${big ? "h-12 w-12 text-base" : "h-10 w-10 text-sm"} flex shrink-0 items-center justify-center rounded-full bg-[var(--mkt-ink)] font-bold text-white`}>
      {initials}
    </span>
  );
}

export default async function Landing() {
  const cfg = await getPlatformConfig();
  const tiers = resolveTiers(cfg.planOverrides);
  const startPrice = formatINR(Math.min(...tiers.map((t) => priceFor(t, DURATIONS[0]))));


  return (
    <main>
      <MarketingHero startPrice={startPrice} />

      {/* Industry strip — quiet, logo-cloud style */}
      <div className="border-y border-[var(--mkt-border)] bg-[var(--mkt-surface)]/60 py-6 overflow-hidden" aria-label="Industries with ready templates">
        <div className="mkt-marquee-mask">
          <div className="mkt-marquee flex w-max items-center gap-10">
            {[...liveVerticals, ...liveVerticals].map((v, i) => (
              <Link
                key={`${v.id}-${i}`}
                href={`/demos?vertical=${v.id}`}
                tabIndex={i >= liveVerticals.length ? -1 : undefined}
                aria-hidden={i >= liveVerticals.length ? true : undefined}
                className="group inline-flex shrink-0 items-center gap-2 text-[15px] font-semibold text-[var(--mkt-text-muted)] transition-colors hover:text-[var(--mkt-text)]"
              >
                <VerticalIcon name={v.icon} className="h-4 w-4 opacity-70 transition group-hover:opacity-100 group-hover:text-[var(--mkt-accent)]" />
                {v.name.replace(/\s*\(.*$/, "").split(" / ")[0]}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Sectors */}
      <MarketingSection id="sectors" variant="default">
        <div className="mb-10 flex flex-col gap-8 lg:mb-12 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            align="left"
            className="!mb-0"
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

      {/* Features */}
      <MarketingSection id="features" variant="alt">
        <SectionHeader
          title="More than just a website"
          description="Every plan includes the tools to build your site, run your business and grow online."
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {FEATURE_GROUPS.map((g, gi) => (
            <div key={g.title} className={`flex flex-col p-6 sm:p-7 ${mkt.card} ${mkt.cardHover}`}>
              <span className="text-xs font-bold text-[var(--mkt-accent-text)]">0{gi + 1}</span>
              <h3 className="mt-2 text-lg font-bold text-[var(--mkt-text)]">{g.title}</h3>
              <p className={`mt-1 text-sm ${mkt.muted}`}>{g.text}</p>
              <ul className="mt-6 space-y-5 border-t border-[var(--mkt-border)] pt-6">
                {g.items.map((f) => (
                  <li key={f.title} className="flex gap-3.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--mkt-accent-soft)]">
                      <f.icon className="h-[18px] w-[18px] text-[var(--mkt-accent-text)]" strokeWidth={2.25} />
                    </span>
                    <span>
                      <span className="block text-[15px] font-semibold text-[var(--mkt-text)]">{f.title}</span>
                      <span className={`mt-0.5 block text-sm leading-relaxed ${mkt.muted}`}>{f.text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </MarketingSection>

      {/* How it works */}
      <MarketingSection id="how" variant="default">
        <SectionHeader title="Live in four simple steps" description="From choosing a sector to your first enquiry — no code, no waiting." />
        <ol className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <span className="pointer-events-none absolute left-[12%] right-[12%] top-9 hidden h-px bg-gradient-to-r from-transparent via-[var(--mkt-accent)]/35 to-transparent lg:block" aria-hidden />
          {STEPS.map((s, i) => (
            <li key={s.t} className={`relative overflow-hidden p-6 sm:p-7 ${mkt.card} ${mkt.cardHover}`}>
              <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--mkt-accent)] text-sm font-bold text-[var(--mkt-accent-on)] shadow-md shadow-[var(--mkt-accent)]/30">
                {i + 1}
              </span>
              <h3 className="relative mt-5 text-lg font-semibold text-[var(--mkt-text)]">{s.t}</h3>
              <p className={`relative mt-2 text-sm leading-relaxed ${mkt.muted}`}>{s.d}</p>
            </li>
          ))}
        </ol>
      </MarketingSection>

      {/* Testimonials */}
      <MarketingSection variant="alt">
        <SectionHeader title="Loved by business owners" description="Clinics, schools, gyms and service businesses run their websites on StandardSaaS." />
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

      <PricingSection tiers={tiers} />

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
          <div className="lg:pt-4">
            <h2 className={mkt.h2}>Prefer a guided walkthrough?</h2>
            <p className={`mt-4 text-[15px] leading-relaxed ${mkt.muted}`}>
              Tell us about your business and we&apos;ll show you the right sector, design and plan — and help you get set up.
            </p>
            <ul className="mt-8 space-y-5">
              {[
                { icon: Clock, t: "Reply within 24 hours", d: "On call, WhatsApp or email — your choice." },
                { icon: Wand2, t: "Right design for your brand", d: "We help you pick the style that fits." },
                { icon: Headphones, t: "Hands-on setup help", d: "Content, domain and go-live, guided." },
              ].map(({ icon: Icon, t, d }) => (
                <li key={t} className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--mkt-accent-soft)]">
                    <Icon className="h-5 w-5 text-[var(--mkt-accent-text)]" />
                  </span>
                  <span>
                    <span className="block font-semibold text-[var(--mkt-text)]">{t}</span>
                    <span className={`block text-sm ${mkt.muted}`}>{d}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className={`${mkt.card} p-6 sm:p-8 shadow-2xl`}>
            <h3 className="text-lg font-bold text-[var(--mkt-text)]">Request a guided demo</h3>
            <p className={`mt-1 mb-6 text-sm ${mkt.muted}`}>Takes 30 seconds. No payment needed.</p>
            <DemoForm sectors={liveVerticals.map((v) => ({ id: v.id, name: v.name }))} />
          </div>
        </div>
      </MarketingSection>

      <section className="relative overflow-hidden bg-[var(--mkt-ink)] text-white">
        <div className={`relative ${mkt.container} flex flex-col items-start gap-6 py-16 sm:py-20 lg:flex-row lg:items-center lg:justify-between`}>
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--mkt-accent-2)]">Ready when you are</p>
            <h2 className="font-display mt-3 text-3xl sm:text-4xl">Your industry already has a site. Launch yours today.</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/65 sm:text-base">Pick a ready template, or describe the business and let AI draft every page.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/subscribe" className={`${mkt.btnPrimary} ${mkt.btnPrimaryLg} bg-[var(--mkt-accent-on)] text-[var(--mkt-ink)] hover:bg-white`}>
              Get started <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/ai-builder" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">
              <Wand2 className="h-4 w-4" /> Build with AI
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
