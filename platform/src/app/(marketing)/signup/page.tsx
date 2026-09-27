import Link from "next/link";
import { Check } from "lucide-react";
import { SignupForm } from "@/components/marketing/SignupForm";
import { MarketingPageHero } from "@/components/marketing/MarketingPageHero";
import { mkt } from "@/lib/marketingTheme";

export const metadata = { title: "Sign up — Standard SaaS" };

export default function SignupPage() {
  return (
    <main>
      <MarketingPageHero
        title="Create your free website"
        description="14-day free trial · no credit card"
        align="left"
      />
      <div className={`${mkt.container} py-12 sm:py-14 grid lg:grid-cols-2 gap-12 items-start`}>
        <div className="hidden lg:block">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
            Launch your <span className="text-lime-600 dark:text-lime-400">business website</span> in minutes
          </h2>
          <p className={`${mkt.muted} mt-4`}>
            A complete, ready-to-edit website plus your own admin panel — no code needed.
          </p>
          <ul className="mt-8 space-y-3">
            {[
              "Pre-built pages, services and gallery",
              "Change theme, colors and content anytime",
              "Collect leads and appointments instantly",
              "Your own subdomain, free",
            ].map((t) => (
              <li key={t} className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <span className="w-6 h-6 rounded-full bg-lime-500/15 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className={`${mkt.card} p-6 sm:p-8 shadow-sm`}>
          <SignupForm />
          <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-4">
            <Link href="/" className="hover:text-slate-600 dark:hover:text-slate-300">← Back to home</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
