import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { Mail, Phone, MapPin, ShieldCheck, ArrowRight, Wand2 } from "lucide-react";
import { getPlatformConfig } from "@/lib/platformConfig";
import { priceFor, formatINR, resolveTiers, resolveDurations } from "@/lib/plans";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { VERTICALS } from "@/lib/verticals";
import { mkt } from "@/lib/marketingTheme";
import { getBusiness } from "@/components/marketing/LegalPage";
import { PageIntro } from "@/components/PageIntro";

const body = Inter({
  subsets: ["latin"],
  variable: "--font-mkt-body",
  display: "swap",
});

const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-mkt-display",
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

// Footer sector links: well-known sectors, short names ("School (Secondary / Senior)" → "School").
const FOOTER_SECTORS = ["school", "hospital-clinic", "gym-fitness", "restaurant-hotel", "coaching", "salon-spa"];
const shortName = (name: string) => name.replace(/\s*\(.*\)/, "").split(" / ")[0];

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const b = await getBusiness();
  const cfg = await getPlatformConfig();
  const tiers = resolveTiers(cfg.planOverrides);
  const startPrice = formatINR(Math.min(...tiers.map((t) => priceFor(t, resolveDurations(cfg.planOverrides)[0]))));
  const sectors = FOOTER_SECTORS.flatMap((id) => VERTICALS.filter((v) => v.id === id && v.status === "live"));
  return (
    <div className={`${body.variable} ${display.variable} mkt-root min-h-screen flex flex-col ${mkt.shell}`}>
      <MarketingHeader />
      <PageIntro />
      <div className="flex-1">{children}</div>

      <footer className="border-t border-[var(--mkt-border)] bg-[var(--mkt-bg-alt)]">
        {/* Light launch CTA, part of the footer */}
        <div className={`${mkt.container} pt-12 sm:pt-14`}>
          <div className="relative isolate flex flex-col items-center gap-5 overflow-hidden rounded-3xl border border-[var(--mkt-brand)]/15 bg-gradient-to-r from-[var(--mkt-accent-soft)] via-[var(--mkt-surface)] to-[color-mix(in_srgb,var(--mkt-brand-2)_10%,var(--mkt-surface))] px-6 py-8 text-center sm:px-10 md:flex-row md:justify-between md:text-left">
            <div className="pointer-events-none absolute -right-16 -top-20 -z-10 h-56 w-72 rounded-full bg-[var(--mkt-brand-2)] opacity-15 blur-[90px]" aria-hidden />
            <div>
              <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-[var(--mkt-text)] sm:text-[1.65rem]">
                Launch your website <span className="mkt-gradient-text">today.</span>
              </h2>
              <p className={`mt-1 text-sm ${mkt.muted}`}>Ready in 5 minutes · Cancel anytime · 7-day refund</p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center justify-center gap-3">
              <Link
                href="/subscribe"
                className="mkt-brand-grad group inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold shadow-[0_10px_28px_-10px_rgba(47,91,255,0.6)] transition hover:brightness-110"
              >
                Get started · from {startPrice} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/ai-builder"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--mkt-border-strong)] bg-[var(--mkt-surface)] px-5 py-3 text-sm font-semibold text-[var(--mkt-text)] transition hover:border-[var(--mkt-brand)] hover:text-[var(--mkt-brand)]"
              >
                <Wand2 className="h-4 w-4" /> Build with AI
              </Link>
            </div>
          </div>
        </div>

        <div className={`${mkt.container} py-14 sm:py-16`}>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-4">
              <Link href="/" className="inline-flex items-center" aria-label="SitePixl home">
                <BrandLogo size={34} tagline id="spx-f" />
              </Link>
              <p className={`mt-4 max-w-xs text-sm leading-relaxed ${mkt.muted}`}>
                Ready-made websites with a full admin panel for schools, clinics, gyms, NGOs and 40+ other industries.
              </p>
              <ul className={`mt-6 space-y-2.5 text-sm ${mkt.muted}`}>
                {b.email && (
                  <li>
                    <a href={`mailto:${b.email}`} className="inline-flex items-center gap-2.5 hover:text-[var(--mkt-text)]">
                      <Mail className="h-4 w-4 shrink-0" /> {b.email}
                    </a>
                  </li>
                )}
                {b.phone && (
                  <li>
                    <a href={`tel:${b.phone.replace(/\s+/g, "")}`} className="inline-flex items-center gap-2.5 hover:text-[var(--mkt-text)]">
                      <Phone className="h-4 w-4 shrink-0" /> {b.phone}
                    </a>
                  </li>
                )}
                {b.address && (
                  <li className="flex items-start gap-2.5">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" /> <span className="max-w-xs">{b.address}</span>
                  </li>
                )}
                {!b.email && !b.phone && (
                  <li>
                    <Link href="/contact" className="inline-flex items-center gap-2.5 hover:text-[var(--mkt-text)]">
                      <Mail className="h-4 w-4 shrink-0" /> Contact us
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 lg:col-span-8">
              <FooterCol
                title="Product"
                links={[
                  ["Live demos", "/demos"],
                  ["AI website builder", "/ai-builder"],
                  ["Pricing", "/#pricing"],
                  ["Features", "/#features"],
                  ["Get started", "/subscribe"],
                ]}
              />
              <FooterCol
                title="Industries"
                links={[...sectors.map((v) => [shortName(v.name), `/demos?vertical=${v.id}`] as [string, string]), ["All industries →", "/demos"]]}
              />
              <FooterCol
                title="Company"
                links={[
                  ["How it works", "/#how"],
                  ["FAQ", "/#faq"],
                  ["Book a demo", "/#contact"],
                  ["Contact us", "/contact"],
                  ["Refer & earn 20%", "/terms#referral-program"],
                ]}
              />
              <FooterCol
                title="Legal"
                links={[
                  ["Terms of service", "/terms"],
                  ["Privacy policy", "/privacy"],
                  ["Refund policy", "/refund"],
                  ["Delivery policy", "/shipping"],
                ]}
              />
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--mkt-border)]">
          <div className={`${mkt.container} flex flex-col items-center justify-between gap-3 py-5 text-[13px] ${mkt.muted} sm:flex-row`}>
            <span>
              © {new Date().getFullYear()} {b.name}. All rights reserved. · Made in India
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Secure payments by Razorpay · GST invoices
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div className="min-w-0">
      <h4 className="mb-4 text-sm font-semibold text-[var(--mkt-text)]">{title}</h4>
      <ul className="space-y-2.5">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link href={href} className={`text-sm ${mkt.muted} transition-colors hover:text-[var(--mkt-text)]`}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
