"use client";

import { useActionState } from "react";
import { submitAppointment, type FormState } from "@/lib/actions/site";
import { Icon } from "../Icon";

const initial: FormState = { ok: false, message: "" };

export function AppointmentForm({ serviceOptions }: { serviceOptions: string[] }) {
  const [state, action, pending] = useActionState(submitAppointment, initial);

  if (state.ok) {
    return (
      <div className="rounded-2xl bg-green-50 border border-green-200 p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-4">
          <Icon name="calendar" className="w-7 h-7 text-primary" />
        </div>
        <p className="text-green-800 font-medium">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <input name="name" required placeholder="Your Name" className={inputCls} />
        <input name="phone" required placeholder="Your Mobile Number" className={inputCls} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <input name="email" type="email" placeholder="Your Email (optional)" className={inputCls} />
        <select name="service" defaultValue="" className={inputCls + " text-slate-500"}>
          <option value="" disabled>Select Service</option>
          {serviceOptions.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Preferred Date</label>
          <input name="date" type="date" className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Preferred Time</label>
          <input name="time" type="time" className={inputCls} />
        </div>
      </div>
      <textarea name="message" rows={3} placeholder="Tell us more about your requirement..." className={inputCls} />

      {state.message && !state.ok && <p className="text-sm text-red-600">{state.message}</p>}

      <button type="submit" disabled={pending} className="btn-primary w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold disabled:opacity-60">
        {pending ? "Booking..." : "Book Appointment"}
        {!pending && <Icon name="arrow" className="w-4 h-4" />}
      </button>
    </form>
  );
}

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-[var(--c-primary)] focus:ring-2 focus:ring-[var(--c-primary)]/20";
