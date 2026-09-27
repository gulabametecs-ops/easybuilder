"use client";

import { useActionState } from "react";
import Link from "next/link";
import { resetPasswordWithToken, type ResetState } from "@/lib/actions/passwordReset";

const init: ResetState = { ok: false, message: "" };

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState(resetPasswordWithToken, init);

  if (state.ok) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-green-600">{state.message}</p>
        <Link href="/admin/login" className="inline-block rounded-lg bg-slate-900 text-white font-semibold px-4 py-2.5 text-sm hover:bg-slate-800">
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">New password</label>
        <input name="password" type="password" required minLength={6} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-lime-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">Confirm password</label>
        <input name="confirm" type="password" required minLength={6} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-lime-500" />
      </div>
      {state.message && <p className="text-sm text-red-600">{state.message}</p>}
      <button type="submit" disabled={pending} className="w-full rounded-lg bg-slate-900 text-white font-semibold px-4 py-2.5 text-sm hover:bg-slate-800 disabled:opacity-60">
        {pending ? "Updating..." : "Update password"}
      </button>
    </form>
  );
}
