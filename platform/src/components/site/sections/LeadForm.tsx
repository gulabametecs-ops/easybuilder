"use client";

import { useActionState, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { submitLead, type FormState } from "@/lib/actions/site";
import { Icon } from "../Icon";
import { PrivacyConsent } from "../PrivacyConsent";
import { waLink, waNumber } from "@/lib/whatsapp";

const initial: FormState = { ok: false, message: "" };

export function LeadForm({
  serviceOptions,
  submitLabel = "Get Free Quote",
  compact = false,
  whatsapp,
}: {
  serviceOptions: string[];
  submitLabel?: string;
  compact?: boolean;
  /** Site WhatsApp link; when it has a number, a "Send on WhatsApp" button is shown. */
  whatsapp?: string;
}) {
  const [state, action, pending] = useActionState(submitLead, initial);
  const formRef = useRef<HTMLFormElement>(null);
  // Product / service pages link here with ?service=<name> — keep it selected.
  const params = useSearchParams();
  const [service, setService] = useState(() => params.get("service")?.slice(0, 200) ?? "");
  const waNum = waNumber(whatsapp);
  const options = service && !serviceOptions.includes(service) ? [service, ...serviceOptions] : serviceOptions;

  // Opens WhatsApp with the filled details (synchronously, so popup blockers allow it) and also saves the enquiry.
  const sendOnWhatsApp = () => {
    const f = formRef.current;
    if (!f || !f.reportValidity()) return;
    const d = new FormData(f);
    const line = (k: string, label: string) => (d.get(k)?.toString().trim() ? `${label}: ${d.get(k)}` : "");
    const text = [
      `Hi, I'm enquiring from your website (${window.location.hostname}).`,
      line("service", "Product / service"),
      line("name", "Name"), line("phone", "Mobile"), line("email", "Email"), line("location", "Location"),
      line("message", "Requirement"),
    ].filter(Boolean).join("\n");
    window.open(waLink(waNum, text), "_blank", "noopener");
    f.requestSubmit();
  };

  if (state.ok) {
    return (
      <div className="rounded-2xl bg-green-50 border border-green-200 p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-4">
          <Icon name="check" className="w-7 h-7 text-primary" />
        </div>
        <p className="text-green-800 font-medium">{state.message}</p>
      </div>
    );
  }

  return (
    <form ref={formRef} action={action} className="space-y-4">
      <div className={compact ? "space-y-4" : "grid sm:grid-cols-2 gap-4"}>
        <Field name="name" placeholder="Your Name" icon="user-check" required />
        <Field name="phone" placeholder="Your Mobile Number" icon="phone" required />
      </div>
      <div className={compact ? "space-y-4" : "grid sm:grid-cols-2 gap-4"}>
        <Field name="email" type="email" placeholder="Your Email (optional)" icon="mail" />
        <Select name="service" options={options} value={service} onChange={setService} />
      </div>
      <Field name="location" placeholder="Your Location" icon="map" />
      <div className="relative">
        <textarea
          name="message"
          rows={compact ? 3 : 4}
          placeholder="Your Requirement / Message"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-[var(--c-primary)] focus:ring-2 focus:ring-[var(--c-primary)]/20"
        />
      </div>

      {state.message && !state.ok && (
        <p className="text-sm text-red-600">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn-primary w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold disabled:opacity-60"
      >
        {pending ? "Sending..." : submitLabel}
        {!pending && <Icon name="arrow" className="w-4 h-4" />}
      </button>
      {waNum && (
        <button
          type="button"
          onClick={sendOnWhatsApp}
          disabled={pending}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[#1ebe5b] disabled:opacity-60"
        >
          <Icon name="whatsapp" className="w-4 h-4" /> Send on WhatsApp
        </button>
      )}
      <p className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
        <Icon name="shield" className="w-3.5 h-3.5" />
        Your information is used only to respond to your request.
      </p>
      <PrivacyConsent />
    </form>
  );
}

function Field({
  name,
  placeholder,
  icon,
  type = "text",
  required = false,
}: {
  name: string;
  placeholder: string;
  icon: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="relative">
      <Icon name={icon} className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-3 text-sm text-slate-700 outline-none focus:border-[var(--c-primary)] focus:ring-2 focus:ring-[var(--c-primary)]/20"
      />
    </div>
  );
}

function Select({ name, options, value, onChange }: { name: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <select
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 outline-none focus:border-[var(--c-primary)] focus:ring-2 focus:ring-[var(--c-primary)]/20"
    >
      <option value="" disabled>
        Select Service
      </option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}
