export const metadata = { title: "Terms & Conditions — Standard SaaS" };

const H = "text-slate-900 dark:text-white font-bold text-lg mt-8 mb-2";
const P = "text-slate-600 dark:text-slate-400 leading-relaxed mb-3";

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Terms &amp; Conditions</h1>
      <p className="text-slate-500 dark:text-slate-400 mt-2">Last updated: 2026</p>

      <h2 className={H}>1. Overview</h2>
      <p className={P}>These terms govern your use of the StandardSaaS platform and the websites created through it. By subscribing you agree to these terms. Please read them carefully.</p>

      <h2 className={H}>2. Subscriptions &amp; billing</h2>
      <p className={P}>Subscriptions are billed for the duration you select (1 month, 6 months, 1 year, 2 years, or lifetime). Access to your website and admin panel remains active for the paid period. Time-based plans do not auto-renew unless stated; a lifetime plan is a one-time payment with no expiry.</p>

      <h2 className={H} id="refund">3. Refund policy</h2>
      <p className={P}>If you are not satisfied, you may request a refund within 7 days of your first purchase, provided the website has not been substantially used or published to a custom domain. Renewals and lifetime plans after the 7-day window are non-refundable. Refunds are processed to the original payment method within 5–10 business days.</p>

      <h2 className={H}>4. Acceptable use</h2>
      <p className={P}>You agree not to use the platform for unlawful content, spam, malware, or to impersonate others. We may suspend accounts that violate these terms or applicable law.</p>

      <h2 className={H}>5. Your content</h2>
      <p className={P}>You own the content you add (text, images, logos). You are responsible for having the rights to any material you upload. You grant us a limited licence to host and display it as part of delivering the service.</p>

      <h2 className={H}>6. Availability</h2>
      <p className={P}>We aim for high availability but do not guarantee uninterrupted service. Planned maintenance will be communicated where possible.</p>

      <h2 className={H}>7. Changes</h2>
      <p className={P}>We may update these terms. Continued use after changes constitutes acceptance. For questions, contact us via the website.</p>

      <p className="text-xs text-slate-400 mt-10">This is a template terms document — replace with your own legal text before going live.</p>
    </main>
  );
}
