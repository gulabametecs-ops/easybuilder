"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { submitDemoRequest, type ContactState } from "@/lib/actions/signup";
import { Check, User, Mail, Phone, Building2, LayoutGrid, MessageCircle, Lock, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { LegalConsent } from "./LegalConsent";
import { BrandSpinner } from "@/components/BrandLogo";

const initial: ContactState = { ok: false, message: "" };

const CONTACT_VIA = [
  { id: "call", label: "Call", icon: Phone },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { id: "email", label: "Email", icon: Mail },
] as const;

const fieldCls =
  "w-full rounded-xl border border-slate-200 bg-slate-50/60 py-3 pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[var(--mkt-accent)] focus:bg-white focus:ring-4 focus:ring-[var(--mkt-accent)]/15 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-white/[0.06]";
const labelCls = "mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300";

function Field({ icon: Icon, label, top, children }: { icon: LucideIcon; label: string; top?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className={labelCls}>{label}</span>
      <span className="relative block">
        <Icon className={`pointer-events-none absolute left-3.5 h-4 w-4 text-slate-400 ${top ? "top-3.5" : "top-1/2 -translate-y-1/2"}`} />
        {children}
      </span>
    </label>
  );
}

export function DemoForm({ sectors = [] }: { sectors?: { id: string; name: string }[] }) {
  const [state, action, pending] = useActionState(submitDemoRequest, initial);
  const [via, setVia] = useState<(typeof CONTACT_VIA)[number]["id"]>("call");

  if (state.ok) {
    return (
      <div className="py-6 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--mkt-accent)] text-[var(--mkt-accent-on)] shadow-lg shadow-[var(--mkt-accent)]/30">
          <Check className="h-7 w-7" strokeWidth={3} />
        </div>
        <p className="text-lg font-bold text-slate-900 dark:text-white">Request received!</p>
        <p className="mx-auto mt-2 max-w-xs text-sm text-slate-600 dark:text-slate-400">{state.message}</p>
        <ol className="mx-auto mt-6 max-w-xs space-y-2 text-left text-sm text-slate-600 dark:text-slate-300">
          {["We review your business details", "We contact you within 24 hours", "Guided walkthrough of your site & admin"].map((t, i) => (
            <li key={t} className="flex items-center gap-2.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--mkt-accent-soft)] text-[11px] font-bold text-[var(--mkt-accent-text)] dark:text-[var(--mkt-accent-text)]">{i + 1}</span>
              {t}
            </li>
          ))}
        </ol>
        <Link href="/demos" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--mkt-accent-text)] hover:underline dark:text-[var(--mkt-accent-text)]">
          Meanwhile, try a live demo <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="type" value="demo" />
      <input type="hidden" name="contactVia" value={via} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field icon={User} label="Your name *">
          <input name="name" required minLength={2} maxLength={80} autoComplete="name" placeholder="Rahul Sharma" className={fieldCls} />
        </Field>
        <Field icon={Mail} label="Email *">
          <input name="email" type="email" required maxLength={120} autoComplete="email" placeholder="you@business.com" className={fieldCls} />
        </Field>
        <Field icon={Phone} label={via === "email" ? "Phone (optional)" : "Phone / WhatsApp *"}>
          <input name="phone" type="tel" required={via !== "email"} maxLength={20} autoComplete="tel" placeholder="+91 98765 43210" className={fieldCls} />
        </Field>
        <Field icon={Building2} label="Business name">
          <input name="company" maxLength={120} autoComplete="organization" placeholder="Bright Homes" className={fieldCls} />
        </Field>
      </div>

      {sectors.length > 0 && (
        <Field icon={LayoutGrid} label="Your sector">
          <select name="vertical" defaultValue="" className={`${fieldCls} appearance-none`}>
            <option value="">Select your industry…</option>
            {sectors.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </Field>
      )}

      <Field icon={MessageCircle} label="What do you need?" top>
        <textarea
          name="message"
          rows={3}
          maxLength={2000}
          placeholder="e.g. A website for my clinic with online appointments…"
          className={`${fieldCls} resize-none`}
        />
      </Field>

      <fieldset>
        <legend className={labelCls}>Best way to reach you</legend>
        <div className="grid grid-cols-3 gap-2">
          {CONTACT_VIA.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setVia(c.id)}
              aria-pressed={via === c.id}
              className={`inline-flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                via === c.id
                  ? "border-[var(--mkt-brand)] bg-[var(--mkt-brand)]/[0.08] text-[var(--mkt-brand)] ring-1 ring-[var(--mkt-brand)]"
                  : "border-slate-200 text-slate-600 hover:border-[var(--mkt-brand)]/50 hover:text-slate-900 dark:border-white/10 dark:text-slate-300 dark:hover:text-white"
              }`}
            >
              <c.icon className={`h-4 w-4 ${c.id === "whatsapp" && via !== c.id ? "text-[#25d366]" : ""}`} />
              {c.label}
            </button>
          ))}
        </div>
      </fieldset>

      {state.message && !state.ok && (
        <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-600 dark:text-red-400">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mkt-brand-grad group inline-flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold shadow-[0_10px_28px_-10px_rgba(47,91,255,0.65)] transition hover:brightness-110 disabled:opacity-60"
      >
        {pending ? <BrandSpinner className="h-4 w-4" /> : null}
        {pending ? "Sending…" : "Request my guided demo"}
        {!pending && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />}
      </button>
      <p className="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
        <Lock className="h-3.5 w-3.5" /> We only use your details to contact you about your demo.
      </p>
      <LegalConsent className="text-center" />
    </form>
  );
}
