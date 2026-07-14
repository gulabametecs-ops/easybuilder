"use client";

import { useActionState } from "react";
import { submitDemoRequest, type ContactState } from "@/lib/actions/signup";
import { Check } from "lucide-react";

const initial: ContactState = { ok: false, message: "" };
const inputCls = "w-full rounded-lg border border-black/15 dark:border-white/15 bg-black/[0.02] dark:bg-white/5 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-lime-500";

export function DemoForm() {
  const [state, action, pending] = useActionState(submitDemoRequest, initial);

  if (state.ok) {
    return (
      <div className="rounded-2xl bg-lime-500/10 border border-lime-500/30 p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-lime-500/20 flex items-center justify-center mx-auto mb-3">
          <Check className="w-6 h-6 text-lime-600 dark:text-lime-400" />
        </div>
        <p className="text-lime-700 dark:text-lime-200">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="type" value="demo" />
      <div className="grid sm:grid-cols-2 gap-3">
        <input name="name" required placeholder="Your name" className={inputCls} />
        <input name="email" type="email" required placeholder="Email" className={inputCls} />
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <input name="phone" placeholder="Phone (optional)" className={inputCls} />
        <input name="company" placeholder="Business name (optional)" className={inputCls} />
      </div>
      <textarea name="message" rows={3} placeholder="Tell us about your business..." className={inputCls} />
      {state.message && !state.ok && <p className="text-sm text-red-500">{state.message}</p>}
      <button disabled={pending} className="w-full rounded-lg bg-lime-500 text-white font-semibold px-5 py-3 hover:bg-lime-600 disabled:opacity-60">
        {pending ? "Sending..." : "Request a demo"}
      </button>
    </form>
  );
}
