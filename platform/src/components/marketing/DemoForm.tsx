"use client";

import { useActionState } from "react";
import { submitDemoRequest, type ContactState } from "@/lib/actions/signup";
import { Check } from "lucide-react";
import { mkt } from "@/lib/marketingTheme";

const initial: ContactState = { ok: false, message: "" };

export function DemoForm() {
  const [state, action, pending] = useActionState(submitDemoRequest, initial);

  if (state.ok) {
    return (
      <div className="rounded-2xl bg-lime-500/10 border border-lime-500/30 p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-lime-500/20 flex items-center justify-center mx-auto mb-3">
          <Check className="w-6 h-6 text-lime-600 dark:text-lime-400" />
        </div>
        <p className="text-lime-800 dark:text-lime-200 font-medium">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="type" value="demo" />
      <div className="grid sm:grid-cols-2 gap-4">
        <input name="name" required placeholder="Your name" className={mkt.input} />
        <input name="email" type="email" required placeholder="Email" className={mkt.input} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <input name="phone" placeholder="Phone (optional)" className={mkt.input} />
        <input name="company" placeholder="Business name (optional)" className={mkt.input} />
      </div>
      <textarea
        name="message"
        rows={4}
        placeholder="Tell us about your business..."
        className={`${mkt.input} resize-none`}
      />
      {state.message && !state.ok && (
        <p className="text-sm text-red-500 dark:text-red-400">{state.message}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className={`w-full ${mkt.btnPrimary} py-3.5 disabled:opacity-60`}
      >
        {pending ? "Sending…" : "Request a demo"}
      </button>
    </form>
  );
}
