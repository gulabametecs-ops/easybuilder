import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-700 dark:bg-slate-950 dark:text-slate-200">
      <MarketingHeader />
      <div className="flex-1">{children}</div>

      {/* Branded footer — dark in both themes with a lime accent bar */}
      <footer className="bg-slate-950 text-slate-400">
        <div className="h-1 bg-gradient-to-r from-lime-500 via-lime-400 to-emerald-500" />
        <div className="mx-auto max-w-6xl px-4 py-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-8 rounded-lg bg-lime-500 text-white font-extrabold flex items-center justify-center">S</span>
              <span className="font-bold text-white text-lg">Standard<span className="text-lime-400">SaaS</span></span>
            </div>
            <p className="text-sm text-slate-400 max-w-xs">Complete, customizable websites and admin panels for every service business — launch in minutes.</p>
            <Link href="/subscribe" className="mt-5 inline-flex items-center gap-2 rounded-full bg-lime-500 text-white text-sm font-semibold px-5 py-2.5 hover:bg-lime-600">
              Get started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <FooterCol title="Product" links={[["Sectors", "/#sectors"], ["Live demos", "/demos"], ["Pricing", "/#pricing"], ["Get started", "/subscribe"]]} />
          <FooterCol title="Company" links={[["How it works", "/#how"], ["Features", "/#features"], ["FAQ", "/#faq"], ["Contact", "/#demo"]]} />
          <FooterCol title="Legal" links={[["Terms & Conditions", "/terms"], ["Privacy Policy", "/privacy"], ["Refund Policy", "/terms#refund"]]} />
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto max-w-6xl px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500">
            <span>© {new Date().getFullYear()} StandardSaaS. All rights reserved.</span>
            <div className="flex items-center gap-4">
              <Link href="/terms" className="hover:text-lime-400">Terms</Link>
              <Link href="/privacy" className="hover:text-lime-400">Privacy</Link>
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
      <h4 className="font-semibold text-white mb-3">{title}</h4>
      <ul className="space-y-2 text-sm">
        {links.map(([label, href]) => (
          <li key={label}><Link href={href} className="text-slate-400 hover:text-lime-400 transition-colors">{label}</Link></li>
        ))}
      </ul>
    </div>
  );
}
