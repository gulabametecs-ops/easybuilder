import { MarketingPageHero } from "@/components/marketing/MarketingPageHero";
import { mkt } from "@/lib/marketingTheme";

export const metadata = { title: "Privacy Policy — Standard SaaS" };

const H = "text-slate-900 dark:text-white font-bold text-lg mt-8 mb-2";
const P = "text-slate-600 dark:text-slate-400 leading-relaxed mb-3";

export default function PrivacyPage() {
  return (
    <main>
      <MarketingPageHero title="Privacy Policy" description="Last updated: 2026" />
      <div className={`${mkt.containerNarrow} max-w-3xl py-12 sm:py-14`}>
        <h2 className={H}>Information we collect</h2>
        <p className={P}>
          We collect the details you provide when requesting a demo, signing up, or subscribing — such as your name,
          email, phone, and business name. Websites you create may collect enquiries from your own visitors, which are
          stored in your admin panel.
        </p>

        <h2 className={H}>How we use it</h2>
        <p className={P}>
          To provide and improve the service, process payments, provision your website, and contact you about your
          account. We do not sell your personal information.
        </p>

        <h2 className={H}>Data storage</h2>
        <p className={P}>
          Your data is stored securely. Leads and appointments captured on your website belong to you and are accessible
          only from your admin panel.
        </p>

        <h2 className={H}>Your rights</h2>
        <p className={P}>
          You may request access to, correction of, or deletion of your personal data at any time by contacting us.
        </p>

        <h2 className={H}>Cookies</h2>
        <p className={P}>
          We use essential cookies for sign-in sessions and to remember preferences such as your theme choice.
        </p>

        <p className="text-xs text-slate-400 mt-10">
          This is a template privacy policy — replace with your own before going live.
        </p>
      </div>
    </main>
  );
}
