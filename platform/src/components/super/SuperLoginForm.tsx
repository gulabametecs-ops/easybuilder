"use client";

import { useActionState } from "react";
import { superLogin, type SuperAuthState } from "@/lib/actions/superAuth";
import { ShieldCheck } from "lucide-react";

const initial: SuperAuthState = { error: "" };
const inputCls = "w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-lime-400";

export function SuperLoginForm() {
  const [state, action, pending] = useActionState(superLogin, initial);
  return (
    <form action={action} className="space-y-4">
      <div className="flex items-center gap-2 justify-center mb-2 text-lime-400">
        <ShieldCheck className="w-6 h-6" />
        <span className="font-bold text-white text-lg">Super Admin</span>
      </div>
      <input name="email" type="email" required placeholder="Email" className={inputCls} />
      <input name="password" type="password" required placeholder="Password" className={inputCls} />
      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
      <button disabled={pending} className="w-full rounded-lg bg-lime-400 text-slate-900 font-semibold px-5 py-3 hover:bg-lime-300 disabled:opacity-60">
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
