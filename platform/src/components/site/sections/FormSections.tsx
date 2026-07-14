import { Icon } from "../Icon";
import { LeadForm } from "./LeadForm";
import { AppointmentForm } from "./AppointmentForm";
import type { SectionContentMap, FooterConfig } from "@/lib/config";

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
  const reasons = [
    { t: "Experienced Professionals", d: "Skilled team with years of experience." },
    { t: "Transparent Pricing", d: "No hidden charges, 100% transparent." },
    { t: "On-Time Service", d: "We respect your time and deliver on schedule." },
    { t: "Quality Assurance", d: "We use best quality materials and tools." },
    { t: "Customer Satisfaction", d: "Your satisfaction is our top priority." },
  ];
  return (
    <section className="py-16 bg-light">
      <div className="mx-auto max-w-7xl px-4 grid lg:grid-cols-[1fr_1.4fr] gap-8 items-start">
        {c.showSidebar && (
          <div className="card bg-secondary text-white p-8">
            <h3 className="text-xl font-bold mb-6 uppercase tracking-wide">Why Request a Quote From Us?</h3>
            <ul className="space-y-5">
              {reasons.map((r) => (
                <li key={r.t} className="flex gap-3">
                  <span className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Icon name="check" className="w-4 h-4 text-primary" />
                  </span>
                  <div>
                    <p className="font-semibold text-white">{r.t}</p>
                    <p className="text-white/60 text-sm">{r.d}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-8 rounded-xl border border-white/15 p-5">
              <p className="text-white/70 text-sm">Need Help? We're Just a Call Away!</p>
              <p className="text-primary text-xl font-extrabold mt-1">{phones.join(", ")}</p>
            </div>
          </div>
        )}
        <div className="card bg-white shadow-lg p-8">
          <h2 className="text-2xl font-extrabold mb-1">{c.title}</h2>
          <p className="text-slate-500 mb-6">{c.subtitle}</p>
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
  return (
    <section className="py-16 bg-light">
      <div className="mx-auto max-w-7xl px-4 grid lg:grid-cols-2 gap-8 items-start">
        <div>
          <h2 className="text-3xl font-extrabold mb-2">{c.title}</h2>
          <p className="text-slate-500 mb-8">{c.subtitle}</p>
          <ul className="space-y-5">
            <ContactRow icon="phone" label="Call Us" value={footer.contact.phones.join(", ")} />
            <ContactRow icon="mail" label="Email Us" value={footer.contact.email} />
            <ContactRow icon="map" label="Visit Us" value={footer.contact.address} />
          </ul>
        </div>
        <div className="card bg-white shadow-lg p-8">
          <LeadForm serviceOptions={serviceOptions} submitLabel="Send Message" />
        </div>
      </div>
    </section>
  );
}

function ContactRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <li className="flex gap-4">
      <span className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
        <Icon name={icon} className="w-5 h-5 text-primary" />
      </span>
      <div>
        <p className="text-sm text-slate-400">{label}</p>
        <p className="font-semibold text-secondary">{value}</p>
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
  return (
    <section className="py-16 bg-light">
      <div className="mx-auto max-w-3xl px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold">{c.title}</h2>
          <p className="text-slate-500 mt-2">{c.subtitle}</p>
        </div>
        <div className="card bg-white shadow-lg p-8">
          <AppointmentForm serviceOptions={serviceOptions} />
        </div>
      </div>
    </section>
  );
}
