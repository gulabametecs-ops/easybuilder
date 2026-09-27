"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordReset, type ResetState } from "@/lib/actions/passwordReset";

const init: ResetState = { ok: false, message: "" };

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(requestPasswordReset, init);
  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
        <input
          name="email"
          type="email"
          required
          placeholder="you@business.com"
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20"
        />
      </div>
      {state.message && (
        <p className={`text-sm ${state.ok ? "text-green-600" : "text-red-600"}`}>{state.message}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-slate-900 text-white font-semibold px-4 py-2.5 text-sm hover:bg-slate-800 disabled:opacity-60"
      >
        {pending ? "Sending..." : "Send reset link"}
      </button>
      <p className="text-center text-sm text-slate-500">
        <Link href="/admin/login" className="text-lime-700 font-medium hover:underline">Back to login</Link>
      </p>
    </form>
  );
}
