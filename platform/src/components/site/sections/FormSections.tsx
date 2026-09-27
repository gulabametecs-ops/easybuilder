import { Icon } from "../Icon";
import { LeadForm } from "./LeadForm";
import { AppointmentForm } from "./AppointmentForm";
import type { SectionContentMap, FooterConfig } from "@/lib/config";
import { readContentStyles, textStyleProps } from "@/lib/fieldStyle";

// Form panels stay white (inputs are designed for a light surface) even inside dark frames.
const FORM_CARD = "site-form relative rounded-[calc(var(--site-radius)*1.6)] bg-white text-slate-700 ring-1 ring-slate-900/[0.06] shadow-[0_2px_4px_rgb(15_23_42/0.03),0_24px_48px_-20px_rgb(15_23_42/0.18)] p-6 sm:p-10 [--c-heading:#0f172a]";

// ─── Quote form section (sidebar + form) ─────────────────────────────────────
export function QuoteFormBlock({
  c,
  serviceOptions,
  phones,
}: {
  c: SectionContentMap["quoteForm"];
  serviceOptions: string[];
  phones: string[];
}) {
  const fs = readContentStyles(c);
  const reasons = [
    { t: "Experienced Professionals", d: "Skilled team with years of experience." },
    { t: "Transparent Pricing", d: "No hidden charges, 100% transparent." },
    { t: "On-Time Service", d: "We respect your time and deliver on schedule." },
    { t: "Quality Assurance", d: "We use best quality materials and tools." },
    { t: "Customer Satisfaction", d: "Your satisfaction is our top priority." },
  ];
  return (
    <section className="site-sec py-20 sm:py-28 bg-light">
      <div className={`mx-auto px-4 sm:px-6 grid gap-6 lg:gap-8 items-start ${c.showSidebar ? "max-w-7xl lg:grid-cols-[1fr_1.4fr]" : "max-w-3xl"}`}>
        {c.showSidebar && (
          <div className="site-on-dark relative overflow-hidden rounded-[calc(var(--site-radius)*1.6)] bg-dark text-white p-7 sm:p-9 ring-1 ring-white/10">
            <div aria-hidden className="site-blob w-72 h-72 -top-24 -right-24 opacity-30" />
            <div className="relative">
              <h3 className="text-xl sm:text-2xl font-bold mb-7">Why Request a Quote From Us?</h3>
              <ul className="space-y-5">
                {reasons.map((r) => (
                  <li key={r.t} className="flex gap-3.5">
                    <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-[0_0_0_5px_color-mix(in_srgb,var(--c-primary)_20%,transparent)]">
                      <Icon name="check" className="w-4 h-4 text-white" strokeWidth={3} />
                    </span>
                    <div>
                      <p className="font-semibold text-white">{r.t}</p>
                      <p className="text-white/60 text-sm mt-0.5">{r.d}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-9 rounded-[var(--site-radius)] bg-white/[0.06] ring-1 ring-inset ring-white/10 p-5">
                <p className="text-white/70 text-sm">Need Help? We&apos;re Just a Call Away!</p>
                <p className="text-primary text-xl font-bold tracking-tight mt-1 tabular-nums">{phones.join(", ")}</p>
              </div>
            </div>
          </div>
        )}
        <div className={FORM_CARD}>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2" {...textStyleProps(fs.title)}>{c.title}</h2>
          <p className="text-slate-500 mb-8" {...textStyleProps(fs.subtitle)}>{c.subtitle}</p>
          <LeadForm serviceOptions={serviceOptions} submitLabel="Submit Quote Request" />
        </div>
      </div>
    </section>
  );
}

// ─── Contact form section ────────────────────────────────────────────────────
export function ContactFormBlock({
  c,
  serviceOptions,
  footer,
}: {
  c: SectionContentMap["contactForm"];
  serviceOptions: string[];
  footer: FooterConfig;
}) {
  const fs = readContentStyles(c);
  return (
    <section className="site-sec py-20 sm:py-28 bg-light">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-16 items-start">
        <div className="lg:pt-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4" {...textStyleProps(fs.title)}>{c.title}</h2>
          <p className="site-muted text-lg leading-relaxed mb-10" {...textStyleProps(fs.subtitle)}>{c.subtitle}</p>
          <ul className="space-y-3">
            <ContactRow icon="phone" label="Call Us" value={footer.contact.phones.join(", ")} />
            <ContactRow icon="mail" label="Email Us" value={footer.contact.email} />
            <ContactRow icon="map" label="Visit Us" value={footer.contact.address} />
          </ul>
        </div>
        <div className={FORM_CARD}>
          <LeadForm serviceOptions={serviceOptions} submitLabel="Send Message" />
        </div>
      </div>
    </section>
  );
}

function ContactRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  if (!value) return null;
  return (
    <li className="flex items-center gap-4 rounded-[calc(var(--site-radius)*1.2)] bg-[var(--site-surface)] ring-1 ring-[var(--site-line)] shadow-[var(--site-shadow-sm)] p-4">
      <span className="w-11 h-11 rounded-[calc(var(--site-radius)*0.9)] bg-primary/10 text-primary ring-1 ring-inset ring-primary/15 flex items-center justify-center shrink-0">
        <Icon name={icon} className="w-5 h-5" />
      </span>
      <div className="min-w-0">
        <p className="site-muted text-xs font-semibold uppercase tracking-wider">{label}</p>
        <p className="font-semibold mt-0.5 break-words text-[var(--c-heading)]">{value}</p>
      </div>
    </li>
  );
}

// ─── Appointment form section ────────────────────────────────────────────────
export function AppointmentFormBlock({
  c,
  serviceOptions,
}: {
  c: SectionContentMap["appointmentForm"];
  serviceOptions: string[];
}) {
  const fs = readContentStyles(c);
  return (
    <section className="site-sec py-20 sm:py-28 bg-light">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold" {...textStyleProps(fs.title)}>{c.title}</h2>
          <p className="site-muted text-lg mt-4" {...textStyleProps(fs.subtitle)}>{c.subtitle}</p>
        </div>
        <div className={FORM_CARD}>
          <AppointmentForm serviceOptions={serviceOptions} />
        </div>
      </div>
    </section>
  );
}
