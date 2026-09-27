"use client";

import { useActionState } from "react";
import { updateBusiness, changePassword, type SettingsState } from "@/lib/actions/settings";
import { fieldCls, labelCls } from "./AdminWorkspace";

const init: SettingsState = { ok: false, message: "" };

function Msg({ state }: { state: SettingsState }) {
  if (!state.message) return null;
  return <p className={`text-xs ${state.ok ? "text-emerald-600" : "text-rose-600"}`}>{state.message}</p>;
}

export function BusinessForm({ name }: { name: string }) {
  const [state, action, pending] = useActionState(updateBusiness, init);
  return (
    <form action={action} className="space-y-3 max-w-md">
      <label className="block">
        <span className={labelCls}>Business name</span>
        <input name="name" defaultValue={name} className={fieldCls} />
      </label>
      <Msg state={state} />
      <button disabled={pending} className="w-full rounded-xl bg-lime-500 text-white text-sm font-bold py-2.5 hover:bg-lime-600 disabled:opacity-60">
        {pending ? "Saving…" : "Save business name"}
      </button>
    </form>
  );
}

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePassword, init);
  return (
    <form action={action} className="space-y-3 max-w-md">
      <label className="block">
        <span className={labelCls}>Current password</span>
        <input name="current" type="password" required className={fieldCls} />
      </label>
      <label className="block">
        <span className={labelCls}>New password</span>
        <input name="next" type="password" required className={fieldCls} />
      </label>
      <Msg state={state} />
      <button disabled={pending} className="w-full rounded-xl bg-slate-900 text-white text-sm font-bold py-2.5 hover:bg-slate-800 disabled:opacity-60">
        {pending ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}
