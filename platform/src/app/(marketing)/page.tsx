import Link from "next/link";
import {
  Palette, LayoutDashboard, Inbox, Globe, Rocket, Wrench, Check, ArrowRight, Star, ShieldCheck,
  MousePointerClick, PencilRuler, Images, Send, HelpCircle, FileStack, CalendarClock,
} from "lucide-react";
import { VERTICALS, verticalsByCategory } from "@/lib/verticals";
import { DESIGNS } from "@/lib/designs";
import { SectorExplorer } from "@/components/marketing/SectorExplorer";
import { DURATIONS, priceFor, formatINR, resolveTiers } from "@/lib/plans";
import { getPlatformConfig } from "@/lib/platformConfig";
import { stockImg } from "@/lib/img";
import { DemoForm } from "@/components/marketing/DemoForm";
import { PricingSection } from "@/components/marketing/PricingSection";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { AiPromptTeaser } from "@/components/marketing/AiPromptTeaser";
import { MarketingSection } from "@/components/marketing/MarketingSection";
import { SectionHeader } from "@/components/marketing/SectionHeader";
import { mkt } from "@/lib/marketingTheme";

const FEATURES = [
  { icon: Palette, title: "5 design styles", text: "Every sector comes in Original, Modern, Bold, Elegant and Minimal — then tweak colours, fonts and logo anytime." },
  { icon: LayoutDashboard, title: "Own admin panel", text: "Private dashboard for every client — dashboard, billing, settings and team access included." },
  { icon: Inbox, title: "Leads & appointments", text: "Quote, contact and booking forms save to the admin inbox with status tracking." },
  { icon: FileStack, title: "Pages & sections", text: "Visual page builder with drag-ready sections — hero, services, gallery, forms and more." },
  { icon: Wrench, title: "Ready sector content", text: "Services, gallery, notices and results pre-filled per industry. Edit, don't build from scratch." },
  { icon: Rocket, title: "SEO & marketing", text: "Meta tags, indexing, campaigns, social share and promo tools built into every site." },
  { icon: Globe, title: "Own domain", text: "Start on a free subdomain, connect a custom domain anytime from settings." },
  { icon: CalendarClock, title: "Launch in minutes", text: "Pay once — website, admin panel and content are provisioned automatically." },
];
const STEPS = [
  { n: 1, icon: MousePointerClick, t: "Pick your sector & plan", d: "Choose your industry and a subscription that fits — pay securely in seconds." },
  { n: 2, icon: PencilRuler, t: "Customize your site", d: "Change theme colors, fonts, logo, header & footer from your admin panel — no code." },
  { n: 3, icon: Images, t: "Add your content", d: "Add your services, photos, pages and business details. Everything is editable." },
  { n: 4, icon: Send, t: "Go live & get leads", d: "Share your link. Quote and appointment requests land straight in your inbox." },
];
const STATS = [
  { v: `${VERTICALS.filter((v) => v.status === "live").length}+`, l: "Industries ready" },
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
const TESTIMONIALS = [
  { n: "Rahul M.", r: "Home-service owner", t: "Got my website live in minutes and started getting leads the same week." },
  { n: "Dr. Anita", r: "Clinic owner", t: "Patients now book appointments online. The admin panel is so easy." },
  { n: "Sana K.", r: "Consultancy founder", t: "The study-abroad template had everything — universities, courses, forms." },
];
const FAQS = [
  { q: "Do I need any coding or technical skills?", a: "Not at all. Everything is point-and-click from your admin panel — change text, images, colours, services and pages without touching code." },
  { q: "Can I use my own domain?", a: "Yes. You start on a free subdomain (yourname.ourdomain.com) and can connect your own custom domain anytime on the Premium plan." },
  { q: "How fast does my website go live?", a: "Instantly. The moment your payment succeeds, your complete website and admin panel are created automatically." },
  { q: "Can I change my content later?", a: "Anytime. Add or edit services, gallery photos, pages, testimonials, contact details and theme whenever you want — changes go live immediately." },
  { q: "How do leads and appointments work?", a: "Every quote, contact and booking form on your site saves directly to your admin panel, where you can track status, call the customer and mark it done." },
  { q: "What if I want to cancel or get a refund?", a: "You can cancel anytime — a time-based plan simply won't renew. We also offer a 7-day refund window on your first purchase (see Terms)." },
  { q: "Do you offer a demo first?", a: "Yes — explore fully-working live demos for every sector, including the admin panel, before you buy." },
  { q: "Is my data safe?", a: "Yes. Each business is fully isolated, sessions are secure, and the leads you collect belong only to you." },
];

export default async function Landing() {
  const cfg = await getPlatformConfig();
  const tiers = resolveTiers(cfg.planOverrides);
  const startPrice = formatINR(Math.min(...tiers.map((t) => priceFor(t, DURATIONS[0]))));

  return (
    <main>
      <MarketingHero startPrice={startPrice} />

      <AiPromptTeaser />

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

      {/* Features */}
      <MarketingSection id="features" variant="alt">
        <SectionHeader
          eyebrow={<p className={mkt.eyebrow}>Built for agencies & resellers</p>}
          title="Everything a client needs"
          description="One platform to launch, manage and grow branded websites — with the same admin your clients use every day."
        />

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
          {FEATURES.map((f) => (
            <div key={f.title} className={`group p-6 ${mkt.card} ${mkt.cardHover}`}>
              <span className="inline-flex w-11 h-11 rounded-xl bg-[var(--mkt-accent-soft)] group-hover:bg-lime-500/20 items-center justify-center mb-4 transition-colors">
                <f.icon className="w-5 h-5 text-[var(--mkt-accent-text)]" strokeWidth={2.25} />
              </span>
              <h3 className="font-semibold text-[var(--mkt-text)]">{f.title}</h3>
              <p className={`text-sm mt-2 leading-relaxed ${mkt.muted}`}>{f.text}</p>
            </div>
          ))}
        </div>
      </MarketingSection>

      {/* How it works */}
      <MarketingSection id="how" variant="default">
        <SectionHeader
          eyebrow={<p className={mkt.eyebrow}>Get started in minutes</p>}
          title="How it works"
          description="From sign-up to your first lead — four simple steps, zero code."
        />

        <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <div
            className="hidden lg:block absolute top-10 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-lime-500/30 to-transparent"
            aria-hidden
          />
          {STEPS.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.n} className={`relative p-6 sm:p-7 text-center ${mkt.card} ${mkt.cardHover}`}>
                <div className="relative w-14 h-14 mx-auto">
                  <div className="w-14 h-14 rounded-2xl bg-lime-500/15 flex items-center justify-center ring-1 ring-lime-500/15">
                    <Icon className="w-6 h-6 text-[var(--mkt-accent-text)]" strokeWidth={2} />
                  </div>
                  <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-lime-500 text-slate-950 text-xs font-bold flex items-center justify-center">
                    {s.n}
                  </span>
                </div>
                <h3 className="font-semibold mt-5 text-[var(--mkt-text)]">{s.t}</h3>
                <p className={`text-sm mt-2 leading-relaxed ${mkt.muted}`}>{s.d}</p>
              </div>
            );
          })}
        </div>

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
      <MarketingSection variant="alt">
        <SectionHeader
          eyebrow={<p className={mkt.eyebrow}>Real businesses</p>}
          title="Loved by business owners"
          description="Clinics, schools, gyms, restaurants and service businesses use StandardSaaS to go live fast."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => {
            const initials = t.n.split(/\s+/).map((w) => w[0]).join("").slice(0, 2);
            return (
              <article key={t.n} className={`flex flex-col p-6 sm:p-7 ${mkt.card} ${mkt.cardHover}`}>
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-lime-500 fill-lime-500" />
                  ))}
                </div>
                <p className="text-[var(--mkt-text-secondary)] text-[15px] leading-relaxed flex-1">
                  &ldquo;{t.t}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3 pt-5 border-t border-black/6 dark:border-white/10">
                  <span className="w-10 h-10 rounded-full bg-lime-500/15 text-lime-700 dark:text-lime-400 font-bold text-sm flex items-center justify-center shrink-0">
                    {initials}
                  </span>
                  <div>
                    <p className="font-semibold text-[var(--mkt-text)]">{t.n}</p>
                    <p className={`text-xs mt-0.5 ${mkt.muted}`}>{t.r}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </MarketingSection>

      <PricingSection tiers={tiers} />

      {/* FAQ */}
      <MarketingSection id="faq" variant="alt" container="narrow">
        <SectionHeader
          eyebrow={
            <span className={mkt.badge}>
              <HelpCircle className="w-3.5 h-3.5" /> FAQ
            </span>
          }
          title="Questions? Answered."
          description="Everything you need to know before getting started."
        />

        <div className="grid md:grid-cols-2 gap-3 sm:gap-4">
          {FAQS.map((f) => (
            <details
              key={f.q}
              className={`group ${mkt.card} open:border-lime-500/40 open:shadow-md open:shadow-lime-500/5 transition-all duration-300`}
            >
              <summary className="cursor-pointer list-none flex items-start justify-between gap-4 p-5 font-semibold text-[var(--mkt-text)] [&::-webkit-details-marker]:hidden">
                <span className="text-[15px] leading-snug pr-2">{f.q}</span>
                <span className="shrink-0 w-7 h-7 rounded-full bg-lime-500/15 flex items-center justify-center group-open:bg-lime-500/25 transition-colors">
                  <ArrowRight className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400 group-open:rotate-90 transition-transform duration-300" />
                </span>
              </summary>
              <div className="px-5 pb-5 -mt-1">
                <p className={`text-sm leading-relaxed ${mkt.muted}`}>{f.a}</p>
              </div>
            </details>
          ))}
        </div>

        <div className={`mt-8 sm:mt-10 ${mkt.card} p-8 text-center`}>
            <p className="font-semibold text-lg text-[var(--mkt-text)]">Still have questions?</p>
          <p className={`text-sm mt-2 ${mkt.muted}`}>We&apos;re happy to help you get set up.</p>
          <a href="#demo" className={`mt-5 inline-flex ${mkt.btnPill} px-6 py-2.5 text-sm`}>
            Contact us <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </MarketingSection>

      {/* CTA + demo */}
      <MarketingSection id="demo" variant="default" container="narrow">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-start">
          <div className="lg:sticky lg:top-24">
            <div className="mb-8">
              <p className={`${mkt.eyebrow} mb-2`}>Get started today</p>
              <h2 className={mkt.h2}>Ready to launch?</h2>
              <p className={`mt-3 text-[15px] leading-relaxed ${mkt.muted}`}>
                Start now, or request a guided demo. Every sector includes a full admin panel.
              </p>
            </div>
            <p className={`text-sm -mt-4 mb-6 ${mkt.muted}`}>
              Prefer to explore first?{" "}
              <Link href="/demos" className="text-lime-600 dark:text-lime-400 font-medium hover:underline">
                Browse live demos →
              </Link>
            </p>
            <ul className="space-y-3">
              {[
                "Try a live demo before you buy",
                "Website ready in minutes",
                "Free subdomain included",
                "Cancel anytime — no lock-in",
              ].map((t) => (
                <li key={t} className="flex items-center gap-3 text-[var(--mkt-text-secondary)]">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--mkt-accent-soft)]">
                    <Check className="w-3.5 h-3.5 text-[var(--mkt-accent-text)]" strokeWidth={2.5} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
            <div className={`mt-8 flex items-center gap-2 text-sm ${mkt.muted}`}>
              <ShieldCheck className="w-4 h-4 text-lime-500 shrink-0" />
              Trusted, secure &amp; always online.
            </div>
            <Link href="/subscribe" className={`mt-8 inline-flex ${mkt.btnPrimary} ${mkt.btnPrimaryMd} rounded-full`}>
              Subscribe now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className={`${mkt.card} p-6 sm:p-8`}>
            <h3 className="font-bold text-lg text-[var(--mkt-text)]">Request a demo</h3>
            <p className={`text-sm mt-1 mb-6 ${mkt.muted}`}>We&apos;ll reach out within 24 hours.</p>
            <DemoForm />
          </div>
        </div>
      </MarketingSection>
    </main>
  );
}
