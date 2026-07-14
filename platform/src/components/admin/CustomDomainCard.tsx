"use client";

import { useActionState, useTransition } from "react";
import { saveCustomDomain, verifyCustomDomain, removeCustomDomain, type DomainState } from "@/lib/actions/domain";
import { Card } from "./ui";
import { Globe, CheckCircle2, AlertCircle, Clock, Trash2, RefreshCw } from "lucide-react";

const init: DomainState = { ok: false, message: "" };

type Props = { domain: string | null; status: string; aTarget: string; cnameTarget: string };

function DnsRow({ type, name, value }: { type: string; name: string; value: string }) {
  return (
    <div className="grid grid-cols-[70px_60px_1fr] gap-2 items-center text-xs py-1.5 border-b border-slate-100 dark:border-slate-700 last:border-0">
      <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">{type}</span>
      <span className="font-mono text-slate-500">{name}</span>
      <span className="font-mono text-slate-700 dark:text-slate-200 break-all">{value}</span>
    </div>
  );
}

export function CustomDomainCard({ domain, status, aTarget, cnameTarget }: Props) {
  const [saveState, saveAction, saving] = useActionState(saveCustomDomain, init);
  const [verifyState, verifyAction, verifying] = useActionState(verifyCustomDomain, init);
  const [removing, startRemove] = useTransition();

  const connected = status === "connected";
  const pending = status === "pending";

  return (
    <Card className="p-6 lg:col-span-2">
      <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-1"><Globe className="w-5 h-5 text-lime-600" /> Custom domain</h3>
      <p className="text-sm text-slate-500 mb-4">Connect your own domain (like <span className="font-mono">www.yourbusiness.com</span>) so your website runs on your brand.</p>

      {domain && (
        <div className={`flex flex-wrap items-center gap-2 rounded-lg px-3 py-2 mb-4 text-sm font-medium ${connected ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
          {connected ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
          <span className="font-mono">{domain}</span>
          <span>· {connected ? "Connected" : "Pending DNS verification"}</span>
          <button onClick={() => { if (confirm(`Disconnect ${domain}?`)) startRemove(() => removeCustomDomain()); }} disabled={removing} className="ml-auto inline-flex items-center gap-1 text-red-600 hover:text-red-700 text-xs font-semibold">
            <Trash2 className="w-3.5 h-3.5" /> Disconnect
          </button>
        </div>
      )}

      <form action={saveAction} className="flex flex-wrap gap-2 items-end mb-2">
        <label className="flex-1 min-w-[220px]">
          <span className="block text-xs font-medium text-slate-500 mb-1">Your domain</span>
          <input name="domain" defaultValue={domain ?? ""} placeholder="www.yourbusiness.com" className="w-full rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800 px-3.5 py-2.5 text-sm outline-none focus:border-lime-500" />
        </label>
        <button disabled={saving} className="rounded-lg bg-slate-900 text-white text-sm font-semibold px-5 py-2.5 hover:bg-slate-800 disabled:opacity-60">{saving ? "Saving..." : domain ? "Update domain" : "Connect domain"}</button>
      </form>
      <Msg s={saveState} />

      {domain && (
        <div className="mt-4 rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2">Step 1 — Add these DNS records at your domain provider</p>
          <div className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-1">
            <div className="grid grid-cols-[70px_60px_1fr] gap-2 text-[10px] uppercase tracking-wide text-slate-400 font-semibold pb-1 border-b border-slate-100 dark:border-slate-700">
              <span>Type</span><span>Name</span><span>Value / Points to</span>
            </div>
            <DnsRow type="A" name="@" value={aTarget} />
            <DnsRow type="CNAME" name="www" value={cnameTarget} />
          </div>
          <p className="text-xs text-slate-400 mt-2">DNS changes can take from a few minutes up to 24 hours to take effect.</p>

          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">Step 2 — Verify</p>
          <form action={verifyAction}>
            <button disabled={verifying} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm font-semibold px-4 py-2 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-60">
              <RefreshCw className={`w-4 h-4 ${verifying ? "animate-spin" : ""}`} /> {verifying ? "Checking..." : "Verify connection"}
            </button>
          </form>
          <div className="mt-2"><Msg s={verifyState} /></div>
        </div>
      )}
    </Card>
  );
}

function Msg({ s }: { s: DomainState }) {
  if (!s.message) return null;
  return <p className={`text-sm flex items-center gap-1.5 mt-1 ${s.ok ? "text-green-600" : "text-red-600"}`}>{s.ok ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}{s.message}</p>;
}
