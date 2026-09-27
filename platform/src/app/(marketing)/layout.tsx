import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Outfit } from "next/font/google";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { mkt } from "@/lib/marketingTheme";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-mkt-body",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${outfit.variable} mkt-root min-h-screen flex flex-col ${mkt.shell}`}>
      <MarketingHeader />
      <div className="flex-1">{children}</div>

      <footer className="bg-[#050806] text-slate-400">
        <div className="h-1 bg-lime-500" aria-hidden />
        <div className={`${mkt.container} py-14 sm:py-16`}>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
            <div className="sm:col-span-2 lg:col-span-5">
              <Link href="/" className="inline-flex items-center gap-2.5 group">
                <span className={mkt.logoMark}>S</span>
                <span className="font-bold text-white text-lg tracking-tight">
                  Standard<span className="text-lime-400">SaaS</span>
                </span>
              </Link>
              <p className="mt-4 text-sm leading-relaxed text-slate-400 max-w-sm">
                Complete, customizable websites and admin panels for every service business — launch in minutes.
              </p>
              <Link href="/subscribe" className={`mt-6 ${mkt.btnPrimary} ${mkt.btnPrimaryMd}`}>
                Get started <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:col-span-2 lg:col-span-7 sm:grid-cols-3 gap-8">
              <FooterCol
                title="Product"
                links={[
                  ["Sectors", "/#sectors"],
                  ["Live demos", "/demos"],
                  ["Pricing", "/#pricing"],
                  ["Get started", "/subscribe"],
                ]}
              />
              <FooterCol
                title="Company"
                links={[
                  ["How it works", "/#how"],
                  ["Features", "/#features"],
                  ["FAQ", "/#faq"],
                  ["Contact", "/#demo"],
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
          <div className={`${mkt.container} py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500`}>
            <span>© {new Date().getFullYear()} StandardSaaS. All rights reserved.</span>
            <div className="flex items-center gap-5">
              <Link href="/terms" className="hover:text-lime-400 transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-lime-400 transition-colors">Privacy</Link>
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
              className="text-sm text-slate-400 hover:text-lime-400 transition-colors"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
