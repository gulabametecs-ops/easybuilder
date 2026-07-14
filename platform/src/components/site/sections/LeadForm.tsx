"use client";

import { useActionState } from "react";
import { submitLead, type FormState } from "@/lib/actions/site";
import { Icon } from "../Icon";

const initial: FormState = { ok: false, message: "" };

export function LeadForm({
  serviceOptions,
  submitLabel = "Get Free Quote",
  compact = false,
}: {
  serviceOptions: string[];
  submitLabel?: string;
  compact?: boolean;
}) {
  const [state, action, pending] = useActionState(submitLead, initial);

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
    <form action={action} className="space-y-4">
      <div className={compact ? "space-y-4" : "grid sm:grid-cols-2 gap-4"}>
        <Field name="name" placeholder="Your Name" icon="user-check" required />
        <Field name="phone" placeholder="Your Mobile Number" icon="phone" required />
      </div>
      <div className={compact ? "space-y-4" : "grid sm:grid-cols-2 gap-4"}>
        <Field name="email" type="email" placeholder="Your Email (optional)" icon="mail" />
        <Select name="service" options={serviceOptions} />
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
      <p className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
        <Icon name="shield" className="w-3.5 h-3.5" />
        Your information is safe with us. We never share your data.
      </p>
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

function Select({ name, options }: { name: string; options: string[] }) {
  return (
    <select
      name={name}
      defaultValue=""
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
