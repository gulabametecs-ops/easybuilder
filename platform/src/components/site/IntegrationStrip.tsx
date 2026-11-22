import { Mail, Star } from "lucide-react";
import type { SiteIntegrations } from "@/lib/integrations";

// "Review us on Google" + Mailchimp signup, shown above the footer only when connected.
export function IntegrationStrip({ review, mailchimp }: Pick<SiteIntegrations, "review" | "mailchimp">) {
  if (!review && !mailchimp) return null;
  return (
    <section className="site-sec py-10 border-t border-black/5 print:hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        {review && (
          <a
            href={review.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-full bg-white text-slate-800 shadow-md ring-1 ring-black/5 px-5 py-3 hover:shadow-lg transition-shadow"
          >
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            <span className="font-semibold">Review us on Google</span>
            {review.ratingText && <span className="text-sm text-slate-500">{review.ratingText}</span>}
          </a>
        )}
        {mailchimp && (
          <form action={mailchimp.action} method="post" target="_blank" className="w-full md:w-auto flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="font-semibold flex items-center gap-2"><Mail className="w-5 h-5 text-primary" /> {mailchimp.title}</span>
            <div className="flex gap-2">
              <input type="email" name="EMAIL" required placeholder="you@example.com" aria-label="Email address"
                className="flex-1 min-w-0 sm:w-64 rounded-full border border-slate-300 bg-white text-slate-900 px-4 py-2.5 text-sm" />
              <button type="submit" className="rounded-full bg-primary text-white px-5 py-2.5 text-sm font-semibold hover:opacity-90">Subscribe</button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
