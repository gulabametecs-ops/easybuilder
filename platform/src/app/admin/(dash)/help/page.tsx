import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronDown, Mail, MessageCircle, Phone, Sparkles, LifeBuoy } from "lucide-react";
import { getAuthedSession } from "@/lib/auth";
import { getBusiness } from "@/components/marketing/LegalPage";
import { planFor } from "@/lib/usage";
import { LIMIT_KEYS, LIMIT_LABELS, formatLimit } from "@/lib/plans";
import { PageHeader, Card } from "@/components/admin/ui";

export const metadata = { title: "Help & support" };

// ponytail: hand-written list; move to platform config if it needs updating without a deploy.
const WHATS_NEW = [
  { date: "Nov 2026", title: "Visitor analytics", body: "See daily visits, top pages and how many visitors send an enquiry.", href: "/admin/analytics" },
  { date: "Nov 2026", title: "Share kit & QR poster", body: "Download a QR code and print an A5 poster for your counter.", href: "/admin/share" },
  { date: "Nov 2026", title: "Getting-started checklist", body: "Your dashboard now shows what's left to make your site complete.", href: "/admin" },
  { date: "Nov 2026", title: "Refer & Earn", body: "Earn a commission for every business you refer.", href: "/admin/referrals" },
];

const A = ({ href, children }: { href: string; children: ReactNode }) => (
  <Link href={href} className="font-semibold text-lime-600 hover:underline">{children}</Link>
);

export default async function HelpPage() {
  const authed = await getAuthedSession();
  if (!authed) return null;
  const [b, plan] = await Promise.all([getBusiness(), planFor(authed.tenant)]);

  const digits = b.phone.replace(/\D/g, "");
  const wa = digits ? `https://wa.me/${digits.length === 10 ? `91${digits}` : digits}?text=${encodeURIComponent(`Hi, I need help with my website (${authed.tenant.subdomain}).`)}` : "";
  const mail = b.email ? `mailto:${b.email}?subject=${encodeURIComponent(`Support: ${authed.tenant.name} (${authed.tenant.subdomain})`)}` : "";

  const faqs: { q: string; a: ReactNode }[] = [
    {
      q: "How do I edit the text and pictures on my pages?",
      a: <>Open <A href="/admin/pages">Pages &amp; Sections</A>, open a page and click any section in the preview to change its text, images or buttons, then save. Use <strong>Add a section</strong> for new blocks; sections can be hidden or reordered too.</>,
    },
    {
      q: "How do I add or change my services?",
      a: <>Go to <A href="/admin/services">Services</A> and click <strong>Add service</strong>. Give it a title, short description, price (optional) and photo. Services appear automatically on your Services page and in the enquiry form.</>,
    },
    {
      q: "How do I upload photos to the gallery?",
      a: <>Open <A href="/admin/gallery">Gallery</A>, click <strong>Add photo</strong> and choose an image from your phone or computer. Use categories (e.g. &ldquo;Events&rdquo;, &ldquo;Classroom&rdquo;) to group them. Large photos are fine; check <A href="/admin/storage">Storage</A> to see how much space you&apos;ve used.</>,
    },
    {
      q: "How do I connect my own domain (www.mybusiness.in)?",
      a: <>Buy a domain from any registrar (GoDaddy, Hostinger, BigRock…). In <A href="/admin/settings">Settings</A>, enter it under <strong>Custom domain</strong> and add the DNS records shown there at your registrar. It usually goes live within a few hours. Custom domains are included on paid plans.</>,
    },
    {
      q: "Where do enquiries from my website go?",
      a: <>Every contact form, quote request and booking lands in <A href="/admin/leads">Leads</A> (and <A href="/admin/appointments">Appointments</A> for bookings). New ones show a count in the menu. Turn on email alerts in <A href="/admin/settings">Settings</A>, and mark each lead as contacted or converted to track your sales.</>,
    },
    {
      q: "How do billing and renewal work?",
      a: <>See your plan and expiry date in <A href="/admin/billing">Billing</A>. Renew any time before it ends; the new period is added on top. After expiry there&apos;s a short grace period, then the site goes offline until you renew, but nothing is deleted. GST invoices can be downloaded from the same page.</>,
    },
    {
      q: "What are my plan limits?",
      a: (
        <>
          <p>Your <strong>{plan.tier?.name ?? authed.tenant.plan}</strong> plan includes:</p>
          {plan.limits ? (
            <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
              {LIMIT_KEYS.map((k) => (
                <li key={k} className="flex justify-between gap-3 border-b border-slate-100 dark:border-slate-800 py-1">
                  <span>{LIMIT_LABELS[k]}</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{formatLimit(k, plan.limits![k])}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-1">No limits apply to this account.</p>
          )}
          <p className="mt-2">Need more? Upgrade from <A href="/admin/billing">Billing</A>.</p>
        </>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Help & support" subtitle="Quick guides for common tasks, and how to reach us if you're stuck." />

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Card className="overflow-hidden">
            <p className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 text-sm font-bold text-slate-900 dark:text-white">How-to guides</p>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {faqs.map((f) => (
                <details key={f.q} className="group">
                  <summary className="flex items-center justify-between gap-3 px-4 py-3.5 cursor-pointer list-none text-sm font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="px-4 pb-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{f.a}</div>
                </details>
              ))}
            </div>
          </Card>

          <Card className="overflow-hidden">
            <p className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-lime-500" /> What&apos;s new
            </p>
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {WHATS_NEW.map((n) => (
                <li key={n.title}>
                  <Link href={n.href} className="flex gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-lime-600 w-16 shrink-0 pt-0.5">{n.date}</span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-slate-900 dark:text-white">{n.title}</span>
                      <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">{n.body}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <Card className="p-5 h-fit">
          <span className="inline-flex w-10 h-10 rounded-xl items-center justify-center bg-lime-500/15 text-lime-600 mb-3">
            <LifeBuoy className="w-5 h-5" />
          </span>
          <p className="text-base font-bold text-slate-900 dark:text-white">Contact {b.name} support</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tell us your website address (<strong>{authed.tenant.subdomain}</strong>) and what you were trying to do. We usually reply within one working day.
          </p>
          {wa || mail || b.phone ? (
            <div className="mt-4 space-y-2">
              {wa && (
                <a href={wa} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-lg bg-[#25D366] text-white font-semibold px-4 py-2.5 text-sm hover:opacity-90">
                  <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
                </a>
              )}
              {mail && (
                <a href={mail} className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800">
                  <Mail className="w-4 h-4" /> {b.email}
                </a>
              )}
              {b.phone && (
                <a href={`tel:${b.phone.replace(/[^\d+]/g, "")}`} className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800">
                  <Phone className="w-4 h-4" /> {b.phone}
                </a>
              )}
            </div>
          ) : (
            <p className="mt-4 rounded-lg bg-slate-50 dark:bg-slate-800/60 px-3 py-2.5 text-xs text-slate-500 dark:text-slate-400">
              Support contact details haven&apos;t been published yet. Please reach out through the person who set up your website.
            </p>
          )}
        </Card>
      </div>
    </>
  );
}
