"use client";

import { useActionState, useState } from "react";
import { KeyRound, Eye, EyeOff, Wand2, Copy } from "lucide-react";
import { setClientLogin, type ClientLoginState } from "@/lib/actions/superAdmin";

const inputCls = "w-full rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-900 px-3 py-2 text-sm";

function genPassword() {
  const abc = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  const a = crypto.getRandomValues(new Uint32Array(12));
  return Array.from(a, (n) => abc[n % abc.length]).join("");
}

// Super Admin → client: change the owner's login email and/or set a new password.
export function ClientLoginForm({ tenantId, email }: { tenantId: string; email: string }) {
  const [state, action, pending] = useActionState<ClientLoginState, FormData>(setClientLogin, { ok: false, message: "" });
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="tenantId" value={tenantId} />
      <label className="block">
        <span className="block text-xs font-medium text-slate-500 mb-1">Login email</span>
        <input name="email" type="email" required defaultValue={email} className={inputCls} />
      </label>
      <label className="block">
        <span className="block text-xs font-medium text-slate-500 mb-1">New password <span className="font-normal">(leave blank to keep current)</span></span>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input name="password" type={show ? "text" : "password"} minLength={8} value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Min 8 characters" autoComplete="new-password" className={inputCls + " pr-9"} />
            <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <button type="button" onClick={() => { setPw(genPassword()); setShow(true); }} title="Generate" className="rounded-lg border border-slate-300 dark:border-white/10 px-2.5 text-slate-600 dark:text-slate-300"><Wand2 className="w-4 h-4" /></button>
          {pw && (
            <button type="button" onClick={() => { navigator.clipboard.writeText(pw).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }); }} title="Copy" className="rounded-lg border border-slate-300 dark:border-white/10 px-2.5 text-slate-600 dark:text-slate-300">
              {copied ? <span className="text-xs font-semibold">✓</span> : <Copy className="w-4 h-4" />}
            </button>
          )}
        </div>
      </label>
      <button disabled={pending} className="admin-grad inline-flex items-center gap-2 rounded-lg text-sm font-semibold px-4 py-2 disabled:opacity-60">
        <KeyRound className="w-4 h-4" /> {pending ? "Saving…" : "Save login"}
      </button>
      {state.message && (
        <p role="status" className={`text-sm font-medium ${state.ok ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>{state.message}</p>
      )}
    </form>
  );
}
