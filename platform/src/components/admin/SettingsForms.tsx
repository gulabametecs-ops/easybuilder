"use client";

import { useActionState } from "react";
import { updateBusiness, changePassword, type SettingsState } from "@/lib/actions/settings";
import { Card } from "./ui";

const init: SettingsState = { ok: false, message: "" };
const inputCls = "w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20";

function Msg({ state }: { state: SettingsState }) {
  if (!state.message) return null;
  return <p className={`text-sm ${state.ok ? "text-green-600" : "text-red-600"}`}>{state.message}</p>;
}

export function BusinessForm({ name }: { name: string }) {
  const [state, action, pending] = useActionState(updateBusiness, init);
  return (
    <Card className="p-6">
      <h3 className="font-semibold text-slate-900 mb-4">Business info</h3>
      <form action={action} className="space-y-4">
        <label className="block">
          <span className="block text-sm font-medium text-slate-600 mb-1">Business name</span>
          <input name="name" defaultValue={name} className={inputCls} />
        </label>
        <Msg state={state} />
        <button disabled={pending} className="rounded-lg bg-slate-900 text-white text-sm font-semibold px-5 py-2.5 hover:bg-slate-800 disabled:opacity-60">
          {pending ? "Saving..." : "Save"}
        </button>
      </form>
    </Card>
  );
}

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePassword, init);
  return (
    <Card className="p-6">
      <h3 className="font-semibold text-slate-900 mb-4">Change password</h3>
      <form action={action} className="space-y-4">
        <label className="block">
          <span className="block text-sm font-medium text-slate-600 mb-1">Current password</span>
          <input name="current" type="password" required className={inputCls} />
        </label>
        <label className="block">
          <span className="block text-sm font-medium text-slate-600 mb-1">New password</span>
          <input name="next" type="password" required className={inputCls} />
        </label>
        <Msg state={state} />
        <button disabled={pending} className="rounded-lg bg-slate-900 text-white text-sm font-semibold px-5 py-2.5 hover:bg-slate-800 disabled:opacity-60">
          {pending ? "Updating..." : "Update password"}
        </button>
      </form>
    </Card>
  );
}
