"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { signupAction, checkSubdomain, type SignupState } from "@/lib/actions/signup";
import { Check, ArrowRight, ExternalLink } from "lucide-react";

const ROOT = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost:3000";
const initial: SignupState = { status: "idle" };
const inputCls = "w-full rounded-lg border border-black/15 dark:border-white/15 bg-black/[0.02] dark:bg-white/5 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-lime-500";

export function SignupForm() {
  const [state, action, pending] = useActionState(signupAction, initial);
  const [sub, setSub] = useState("");
  const [avail, setAvail] = useState<{ available: boolean; reason?: string } | null>(null);

  // Debounced availability check.
  useEffect(() => {
    if (sub.length < 3) { setAvail(null); return; }
    const t = setTimeout(async () => setAvail(await checkSubdomain(sub)), 400);
    return () => clearTimeout(t);
  }, [sub]);

  if (state.status === "success") {
    return (
      <div className="rounded-2xl border border-lime-500/30 bg-lime-500/10 p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-lime-500/20 flex items-center justify-center mx-auto mb-4">
          <Check className="w-7 h-7 text-lime-600 dark:text-lime-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Your website is live! 🎉</h2>
        <p className="text-slate-600 dark:text-slate-300 mt-2">We've created your site and admin panel.</p>
        <div className="mt-6 space-y-3 text-left">
          <a href={state.url} className="flex items-center justify-between rounded-lg bg-black/[0.03] dark:bg-white/5 border border-black/10 dark:border-white/10 px-4 py-3 hover:bg-black/[0.06] dark:hover:bg-white/10">
            <span className="text-slate-600 dark:text-slate-300 text-sm">Your website</span>
            <span className="text-lime-600 dark:text-lime-400 font-medium text-sm flex items-center gap-1">{state.url.replace(/^https?:\/\//, "")} <ExternalLink className="w-3.5 h-3.5" /></span>
          </a>
          <a href={state.adminUrl} className="flex items-center justify-between rounded-lg bg-lime-500 text-white px-4 py-3 font-semibold hover:bg-lime-600">
            <span>Go to your admin panel</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">Log in with <b className="text-slate-700 dark:text-slate-200">{state.email}</b> and the password you just chose.</p>
      </div>
    );
  }

  const lbl = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1";
  return (
    <form action={action} className="space-y-4">
      <label className="block">
        <span className={lbl}>Business name</span>
        <input name="businessName" required placeholder="e.g. Sharma Home Services" className={inputCls} />
      </label>

      <label className="block">
        <span className={lbl}>Choose your address</span>
        <div className="flex items-stretch rounded-lg border border-black/15 dark:border-white/15 bg-black/[0.02] dark:bg-white/5 overflow-hidden focus-within:border-lime-500">
          <input
            name="subdomain"
            required
            value={sub}
            onChange={(e) => setSub(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
            placeholder="yourbusiness"
            className="flex-1 bg-transparent px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none"
          />
          <span className="flex items-center px-3 text-sm text-slate-500 dark:text-slate-400 bg-black/[0.03] dark:bg-white/5">.{ROOT}</span>
        </div>
        {avail && sub.length >= 3 && (
          <span className={`block text-xs mt-1 ${avail.available ? "text-lime-600 dark:text-lime-400" : "text-red-500"}`}>
            {avail.available ? "✓ Available" : avail.reason === "taken" ? "Already taken" : avail.reason === "reserved" ? "Reserved — pick another" : "Invalid name"}
          </span>
        )}
      </label>

      <label className="block">
        <span className={lbl}>Email</span>
        <input name="email" type="email" required placeholder="you@business.com" className={inputCls} />
      </label>
      <label className="block">
        <span className={lbl}>Password</span>
        <input name="password" type="password" required minLength={6} placeholder="At least 6 characters" className={inputCls} />
      </label>

      {state.status === "error" && <p className="text-sm text-red-500">{state.message}</p>}

      <button disabled={pending} className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-lime-500 text-white font-semibold px-5 py-3 hover:bg-lime-600 disabled:opacity-60">
        {pending ? "Creating your website..." : "Create my website"}
        {!pending && <ArrowRight className="w-4 h-4" />}
      </button>
      <p className="text-center text-xs text-slate-400 dark:text-slate-500">Already have a site? Log in at <span className="text-slate-600 dark:text-slate-300">yourname.{ROOT}/admin</span></p>
    </form>
  );
}
