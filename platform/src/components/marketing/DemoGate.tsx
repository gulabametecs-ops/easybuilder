"use client";

import { useActionState } from "react";
import { unlockDemoAccess, type UnlockState } from "@/lib/actions/demos";
import { Lock } from "lucide-react";

const initial: UnlockState = { ok: false, message: "" };
const inputCls = "w-full rounded-lg border border-black/15 dark:border-white/15 bg-black/[0.02] dark:bg-white/5 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-lime-500";

export function DemoGate() {
  const [state, action, pending] = useActionState(
    async (prev: UnlockState, fd: FormData) => {
      const res = await unlockDemoAccess(prev, fd);
      if (res.ok && typeof window !== "undefined") window.location.reload();
      return res;
    },
    initial,
  );

  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/[0.03] p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <span className="w-11 h-11 rounded-xl bg-lime-500/15 flex items-center justify-center">
          <Lock className="w-5 h-5 text-lime-600 dark:text-lime-400" />
        </span>
        <div>
          <h2 className="text-slate-900 dark:text-white font-bold text-lg">Unlock all live demos</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Fill your details to explore every sector demo.</p>
        </div>
      </div>
      <form action={action} className="space-y-3">
        <div className="grid sm:grid-cols-2 gap-3">
          <input name="name" required placeholder="Your name *" className={inputCls} />
          <input name="phone" required placeholder="Phone number *" className={inputCls} />
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <input name="email" type="email" required placeholder="Email *" className={inputCls} />
          <input name="company" required placeholder="Business / company name *" className={inputCls} />
        </div>
        {state.message && !state.ok && <p className="text-sm text-red-500">{state.message}</p>}
        <button disabled={pending} className="w-full rounded-lg bg-lime-500 text-white font-semibold px-5 py-3 hover:bg-lime-600 disabled:opacity-60">
          {pending ? "Unlocking..." : "Unlock demos"}
        </button>
        <p className="text-center text-xs text-slate-400 dark:text-slate-500">All fields are required to view the demos.</p>
      </form>
    </div>
  );
}
