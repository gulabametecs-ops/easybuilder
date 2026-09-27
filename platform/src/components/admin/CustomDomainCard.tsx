"use client";

import { useActionState, useTransition } from "react";
import { saveCustomDomain, verifyCustomDomain, removeCustomDomain, type DomainState } from "@/lib/actions/domain";
import { Globe, CheckCircle2, AlertCircle, Clock, Trash2, RefreshCw } from "lucide-react";
import { fieldCls, labelCls } from "./AdminWorkspace";

const init: DomainState = { ok: false, message: "" };

type Props = { domain: string | null; status: string; aTarget: string; cnameTarget: string };

function DnsRow({ type, name, value }: { type: string; name: string; value: string }) {
  return (
    <div className="grid grid-cols-[70px_60px_1fr] gap-2 items-center text-[11px] py-1.5 border-b border-slate-100 dark:border-slate-700 last:border-0">
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

  return (
    <div className="max-w-xl space-y-3">
      <div>
        <p className="text-sm font-semibold text-slate-800 dark:text-white flex items-center gap-2">
          <Globe className="w-4 h-4 text-lime-600" /> Custom domain
        </p>
        <p className="text-xs text-slate-400 mt-0.5">Connect www.yourbusiness.com so the site runs on your brand.</p>
      </div>

      {domain && (
        <div className={`flex flex-wrap items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium ${connected ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40" : "bg-amber-50 text-amber-700 dark:bg-amber-950/40"}`}>
          {connected ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
          <span className="font-mono">{domain}</span>
          <span>· {connected ? "Connected" : "Pending DNS"}</span>
          <button
            type="button"
            onClick={() => { if (confirm(`Disconnect ${domain}?`)) startRemove(() => removeCustomDomain()); }}
            disabled={removing}
            className="ml-auto inline-flex items-center gap-1 text-rose-600 text-[11px] font-bold"
          >
            <Trash2 className="w-3.5 h-3.5" /> Disconnect
          </button>
        </div>
      )}

      <form action={saveAction} className="flex flex-wrap gap-2 items-end">
        <label className="flex-1 min-w-[200px]">
          <span className={labelCls}>Your domain</span>
          <input name="domain" defaultValue={domain ?? ""} placeholder="www.yourbusiness.com" className={fieldCls} />
        </label>
        <button disabled={saving} className="rounded-xl bg-slate-900 text-white text-xs font-bold px-4 py-2.5 hover:bg-slate-800 disabled:opacity-60">
          {saving ? "Saving…" : domain ? "Update" : "Connect"}
        </button>
      </form>
      <Msg s={saveState} />

      {domain && (
        <div className="rounded-xl border border-slate-100 dark:border-slate-800 p-3 bg-slate-50/80 dark:bg-slate-800/40 space-y-3">
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">1 — Add DNS records</p>
          <div className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-1">
            <div className="grid grid-cols-[70px_60px_1fr] gap-2 text-[9px] uppercase tracking-wide text-slate-400 font-bold pb-1 border-b border-slate-100 dark:border-slate-700">
              <span>Type</span><span>Name</span><span>Value</span>
            </div>
            <DnsRow type="A" name="@" value={aTarget} />
            <DnsRow type="CNAME" name="www" value={cnameTarget} />
          </div>
          <p className="text-[10px] text-slate-400">DNS can take a few minutes up to 24 hours.</p>
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">2 — Verify</p>
          <form action={verifyAction}>
            <button disabled={verifying} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold px-4 py-2 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-60">
              <RefreshCw className={`w-3.5 h-3.5 ${verifying ? "animate-spin" : ""}`} /> {verifying ? "Checking…" : "Verify connection"}
            </button>
          </form>
          <Msg s={verifyState} />
        </div>
      )}
    </div>
  );
}

function Msg({ s }: { s: DomainState }) {
  if (!s.message) return null;
  return (
    <p className={`text-xs flex items-center gap-1.5 ${s.ok ? "text-emerald-600" : "text-rose-600"}`}>
      {s.ok ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
      {s.message}
    </p>
  );
}
