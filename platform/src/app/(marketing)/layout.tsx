import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Newsreader, Outfit } from "next/font/google";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { VERTICALS } from "@/lib/verticals";
import { mkt } from "@/lib/marketingTheme";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-mkt-body",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const display = Newsreader({
  subsets: ["latin"],
  variable: "--font-mkt-display",
  display: "swap",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${outfit.variable} ${display.variable} mkt-root min-h-screen flex flex-col ${mkt.shell}`}>
      <MarketingHeader />
      <div className="flex-1">{children}</div>

      <footer className="relative bg-[var(--mkt-ink)] text-stone-400">
        <div className="h-px bg-gradient-to-r from-transparent via-[var(--mkt-accent-2)]/50 to-transparent" aria-hidden />
        <div className={`${mkt.container} py-14 sm:py-16`}>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
            <div className="sm:col-span-2 lg:col-span-5">
              <Link href="/" className="inline-flex items-center gap-2.5 group">
                <span className={mkt.logoMark}>S</span>
                <span className="font-bold text-white text-lg tracking-tight">
                  Standard<span className="text-[var(--mkt-accent-2)]">SaaS</span>
                </span>
              </Link>
              <p className="mt-4 text-sm leading-relaxed text-stone-400 max-w-sm">
                Complete, customizable websites and admin panels for every service business — launch in minutes.
              </p>
              <Link href="/subscribe" className={`mt-6 ${mkt.btnPrimary} ${mkt.btnPrimaryMd} bg-[var(--mkt-accent-on)] text-[var(--mkt-ink)] hover:bg-white`}>
                Get started <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:col-span-2 lg:col-span-7 sm:grid-cols-4 gap-8">
              <FooterCol
                title="Product"
                links={[
                  ["Live demos", "/demos"],
                  ["AI Builder", "/ai-builder"],
                  ["Pricing", "/#pricing"],
                  ["Get started", "/subscribe"],
                ]}
              />
              <FooterCol
                title="Popular sectors"
                links={VERTICALS.filter((v) => v.status === "live")
                  .slice(0, 5)
                  .map((v) => [v.name.split(" / ")[0], `/demos?vertical=${v.id}`] as [string, string])}
              />
              <FooterCol
                title="Company"
                links={[
                  ["How it works", "/#how"],
                  ["Features", "/#features"],
                  ["FAQ", "/#faq"],
                  ["Contact", "/#contact"],
                ]}
              />
              <FooterCol
                title="Legal"
                links={[
                  ["Terms & Conditions", "/terms"],
                  ["Privacy Policy", "/privacy"],
                  ["Refund Policy", "/terms#refund"],
                ]}
              />
            </div>
          </div>
        </div>

        <div className="border-t border-white/[0.08]">
          <div className={`${mkt.container} py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-stone-500`}>
            <span>© {new Date().getFullYear()} StandardSaaS. All rights reserved. · Made in India</span>
            <div className="flex items-center gap-5">
              <Link href="/terms" className="hover:text-[var(--mkt-accent-2)] transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-[var(--mkt-accent-2)] transition-colors">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="font-semibold text-white text-[15px] mb-4">{title}</h4>
      <ul className="space-y-2.5">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link
              href={href}
              className="text-sm text-stone-400 hover:text-[var(--mkt-accent-2)] transition-colors"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
