"use client";

import { useActionState } from "react";
import { createClient, type CreateClientState } from "@/lib/actions/superAdmin";
import { VERTICALS } from "@/lib/verticals";
import { TIERS } from "@/lib/plans";
import { UserPlus } from "lucide-react";

const ROOT = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost:3000";
const initial: CreateClientState = { error: "" };
const inputCls = "w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-lime-500";
const lbl = "block text-sm font-medium text-slate-600 mb-1";

export function ClientCreateForm() {
  const [state, action, pending] = useActionState(createClient, initial);
  const liveVerticals = VERTICALS.filter((v) => v.status === "live");

  return (
    <form action={action} className="space-y-4 max-w-2xl">
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block"><span className={lbl}>Business name *</span><input name="businessName" required className={inputCls} placeholder="e.g. Sharma Home Services" /></label>
        <label className="block">
          <span className={lbl}>Subdomain *</span>
          <div className="flex items-stretch rounded-lg border border-slate-300 overflow-hidden focus-within:border-lime-500">
            <input name="subdomain" required className="flex-1 px-3.5 py-2.5 text-sm outline-none" placeholder="sharma" />
            <span className="flex items-center px-3 text-sm text-slate-500 bg-slate-50">.{ROOT}</span>
          </div>
        </label>
      </div>

      <label className="block"><span className={lbl}>Sector *</span>
        <select name="vertical" className={inputCls} defaultValue="home-services">
          {liveVerticals.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
        </select>
      </label>

      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block"><span className={lbl}>Owner email *</span><input name="email" type="email" required className={inputCls} placeholder="owner@business.com" /></label>
        <label className="block"><span className={lbl}>Owner password *</span><input name="password" type="password" required minLength={6} className={inputCls} placeholder="min 6 characters" /></label>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block"><span className={lbl}>Plan</span>
          <select name="plan" className={inputCls} defaultValue="professional">
            {TIERS.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </label>
        <label className="block"><span className={lbl}>License duration</span>
          <select name="months" className={inputCls} defaultValue="12">
            <option value="1">1 Month</option>
            <option value="3">3 Months</option>
            <option value="6">6 Months</option>
            <option value="12">1 Year</option>
            <option value="24">2 Years</option>
            <option value="lifetime">Lifetime</option>
          </select>
        </label>
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button disabled={pending} className="inline-flex items-center gap-2 rounded-lg bg-slate-900 text-white font-semibold px-5 py-2.5 text-sm hover:bg-slate-800 disabled:opacity-60">
        <UserPlus className="w-4 h-4" /> {pending ? "Creating..." : "Create client"}
      </button>
      <p className="text-xs text-slate-400">The client website + admin panel will be provisioned instantly.</p>
    </form>
  );
}
