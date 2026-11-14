"use client";

import { useActionState } from "react";
import { submitVolunteer, type FormState } from "@/lib/actions/site";
import { Icon } from "../Icon";

const initial: FormState = { ok: false, message: "" };

const field =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-[var(--c-primary)] focus:ring-2 focus:ring-[var(--c-primary)]/20";

export function VolunteerForm({ interests }: { interests: string[] }) {
  const [state, action, pending] = useActionState(submitVolunteer, initial);

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
      <input name="name" required placeholder="Full Name" className={field} />
      <div className="grid sm:grid-cols-2 gap-4">
        <input name="phone" required placeholder="Mobile Number" className={field} />
        <input name="email" type="email" required placeholder="Email Address" className={field} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <input name="age" placeholder="Age" className={field} />
        <select name="gender" className={field} defaultValue="">
          <option value="">Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <input name="city" required placeholder="City" className={field} />
        <input name="state" placeholder="State" className={field} />
      </div>
      <select name="interest" className={field} defaultValue="">
        <option value="">Area of Interest</option>
        {interests.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
      <div className="grid sm:grid-cols-2 gap-4">
        <select name="availability" className={field} defaultValue="">
          <option value="">Availability</option>
          <option>Weekdays</option>
          <option>Weekends</option>
          <option>Both</option>
        </select>
        <select name="mode" className={field} defaultValue="">
          <option value="">Preferred Mode</option>
          <option>Online</option>
          <option>Offline</option>
          <option>Both</option>
        </select>
      </div>
      <textarea name="experience" rows={4} placeholder="Previous volunteering experience (if any)" className={field} />
      {state.message && !state.ok && <p className="text-sm text-red-600">{state.message}</p>}
      <button
        type="submit"
        disabled={pending}
        className="btn-primary w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 font-semibold disabled:opacity-60"
      >
        {pending ? "Submitting…" : "Submit Application"} <Icon name="arrow" className="w-4 h-4" />
      </button>
    </form>
  );
}
