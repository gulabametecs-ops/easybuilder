import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MarketingPageHero } from "@/components/marketing/MarketingPageHero";
import { getBusiness, BusinessDetails, GrievanceOfficer, PROSE, LAST_UPDATED } from "@/components/marketing/LegalPage";
import { mkt } from "@/lib/marketingTheme";

export const metadata: Metadata = {
  title: "Contact Us — SitePixl",
  description: "Business address, email, phone, GSTIN and Grievance Officer details for SitePixl.",
};

export default async function ContactPage() {
  const b = await getBusiness();
  return (
    <main>
      <MarketingPageHero title="Contact Us" description="Questions about plans, billing, your website or your data? We're here to help." />
      <div className={`${mkt.containerNarrow} max-w-3xl py-10 sm:py-14`}>
        <div className={PROSE}>
        <h2 className="font-display text-xl sm:text-2xl text-[var(--mkt-text)] mb-4">Business details</h2>
        <BusinessDetails b={b} />
        </div>

        <div className={`${mkt.cardSoft} p-5 sm:p-6 my-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
          <div>
            <div className="font-semibold text-[var(--mkt-text)]">Want a demo or a call back?</div>
            <div className="text-sm text-[var(--mkt-text-muted)] mt-1">Use the form on our home page and we&rsquo;ll get in touch.</div>
          </div>
          <Link href="/#contact" className={`${mkt.btnPrimary} ${mkt.btnPrimaryMd} shrink-0`}>
            Open contact form <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className={PROSE}>
        <h2 className="font-display text-xl sm:text-2xl text-[var(--mkt-text)] mb-4">Grievance Officer</h2>
        <GrievanceOfficer b={b} />

        <p className="text-sm text-[var(--mkt-text-muted)] mt-8">
          See also our <a href="/terms">Terms &amp; Conditions</a>, <a href="/privacy">Privacy Policy</a>,{" "}
          <a href="/refund">Refund &amp; Cancellation Policy</a> and <a href="/shipping">Shipping &amp; Delivery Policy</a>.
          Last updated: {LAST_UPDATED}.
        </p>
        </div>
      </div>
    </main>
  );
}

// Business details come from Super Admin → Settings; refresh them every 5 minutes.
export const revalidate = 300;
