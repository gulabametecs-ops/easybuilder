"use client";

import { useActionState, useState } from "react";
import {
  Settings, Sparkles, Globe, Building2, Lock, Users, Info, ExternalLink,
  Bell, Download, UserCircle, Link2, Palette, Search, CreditCard, AlertTriangle,
} from "lucide-react";
import { AdminWorkspace, fieldCls, labelCls } from "./AdminWorkspace";
import { BusinessForm, PasswordForm } from "./SettingsForms";
import { CustomDomainCard } from "./CustomDomainCard";
import { TeamManager } from "./TeamManager";
import {
  updateProfile, saveAdminPrefs, requestCancellation,
  type SettingsState,
} from "@/lib/actions/settings";
import type { AdminPrefs } from "@/lib/adminPrefs";

type Member = { id: string; email: string; name: string | null; role: string };
type LeadRow = { name: string; phone: string; email: string; message: string; createdAt: string };
type ApptRow = { name: string; phone: string; email: string; date: string; time: string; message: string; createdAt: string };

const init: SettingsState = { ok: false, message: "" };

const TABS = [
  { id: "plan", label: "Plan", icon: Sparkles },
  { id: "profile", label: "Profile", icon: UserCircle },
  { id: "domain", label: "Domain", icon: Globe },
  { id: "business", label: "Business", icon: Building2 },
  { id: "notify", label: "Alerts", icon: Bell },
  { id: "data", label: "Data", icon: Download },
  { id: "security", label: "Security", icon: Lock },
  { id: "team", label: "Team", icon: Users },
  { id: "site", label: "Site", icon: Info },
] as const;

type TabId = (typeof TABS)[number]["id"];

function Msg({ state }: { state: SettingsState }) {
  if (!state.message) return null;
  return <p className={`text-xs ${state.ok ? "text-emerald-600" : "text-rose-600"}`}>{state.message}</p>;
}

function downloadCsv(filename: string, rows: string[][]) {
  const esc = (v: string) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = rows.map((r) => r.map(esc).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function SettingsManager(props: {
  planName: string;
  serviceCount: number;
  serviceLimit: number;
  expiry: string;
  status: string;
  liveUrl: string;
  subdomain: string;
  customDomain: string | null;
  domainStatus: string;
  aTarget: string;
  cnameTarget: string;
  businessName: string;
  planId: string;
  sessionEmail: string;
  sessionRole: string;
  sessionName: string;
  members: Member[];
  currentUserId: string;
  canManageTeam: boolean;
  isOwner: boolean;
  prefs: AdminPrefs;
  leads: LeadRow[];
  appointments: ApptRow[];
  cancelRequested: boolean;
  supportEmail: string;
}) {
  const [tab, setTab] = useState<TabId>("plan");
  const {
    planName, serviceCount, serviceLimit, expiry, status, liveUrl, subdomain,
    customDomain, domainStatus, aTarget, cnameTarget, businessName, planId,
    sessionEmail, sessionRole, sessionName, members, currentUserId,
    canManageTeam, isOwner, prefs, leads, appointments, cancelRequested, supportEmail,
  } = props;

  return (
    <AdminWorkspace
      title="Settings"
      titleIcon={<Settings className="w-4 h-4 text-lime-600 shrink-0" />}
      tabs={[...TABS]}
      tab={tab}
      onTabChange={(id) => setTab(id as TabId)}
    >
      {tab === "plan" && (
        <div className="max-w-xl space-y-4">
          <div className="rounded-2xl border border-lime-200 dark:border-lime-900/50 bg-gradient-to-br from-lime-50 to-white dark:from-lime-950/30 dark:to-slate-900 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-lime-600" /> {planName}
                </p>
                <div className="grid grid-cols-3 gap-3 mt-3 text-xs">
                  <div>
                    <p className="text-slate-500 dark:text-slate-400">Services</p>
                    <p className="font-semibold text-slate-800 dark:text-slate-100">{serviceCount}{serviceLimit > 0 ? ` / ${serviceLimit}` : " / ∞"}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 dark:text-slate-400">Expires</p>
                    <p className="font-semibold text-slate-800 dark:text-slate-100">{expiry}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 dark:text-slate-400">Status</p>
                    <p className="font-semibold text-slate-800 dark:text-slate-100 capitalize">{status}</p>
                  </div>
                </div>
                {serviceLimit > 0 && serviceCount >= serviceLimit && (
                  <p className="text-xs text-amber-600 dark:text-amber-300 mt-3">Service limit reached — upgrade to add more.</p>
                )}
                {cancelRequested && (
                  <p className="text-xs text-amber-600 dark:text-amber-300 mt-3 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Cancellation requested — support will contact you.
                  </p>
                )}
              </div>
              <a href="/admin/billing" className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 dark:bg-lime-500 dark:text-slate-900 text-white text-xs font-bold px-4 py-2.5 hover:opacity-90">
                <Sparkles className="w-3.5 h-3.5" /> Renew / Upgrade
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 dark:border-slate-800 p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Quick links</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { href: "/admin/appearance", label: "Appearance", icon: Palette },
                { href: "/admin/seo", label: "SEO", icon: Search },
                { href: "/admin/billing", label: "Billing", icon: CreditCard },
                { href: liveUrl, label: "Live site", icon: ExternalLink, ext: true },
              ].map((l) => {
                const Ic = l.icon;
                return (
                  <a
                    key={l.href}
                    href={l.href}
                    {...(l.ext ? { target: "_blank", rel: "noreferrer" } : {})}
                    className="flex items-center gap-2 rounded-xl border border-slate-100 dark:border-slate-800 px-3 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-lime-400"
                  >
                    <Ic className="w-3.5 h-3.5 text-lime-600" /> {l.label}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {tab === "profile" && <ProfileForm name={sessionName} email={sessionEmail} role={sessionRole} />}

      {tab === "domain" && (
        <CustomDomainCard domain={customDomain} status={domainStatus} aTarget={aTarget} cnameTarget={cnameTarget} />
      )}

      {tab === "business" && <BusinessForm name={businessName} />}

      {tab === "notify" && <NotifyForm prefs={prefs} />}

      {tab === "data" && (
        <DataExport leads={leads} appointments={appointments} isOwner={isOwner} cancelRequested={cancelRequested} supportEmail={supportEmail} />
      )}

      {tab === "security" && <PasswordForm />}

      {tab === "team" && (
        <TeamManager members={members} currentUserId={currentUserId} canManage={canManageTeam} isOwner={isOwner} />
      )}

      {tab === "site" && (
        <div className="max-w-xl space-y-3">
          <div className="grid sm:grid-cols-2 gap-2">
            <Detail label="Live website" value={liveUrl} isLink />
            <Detail label="Subdomain" value={subdomain} />
            <Detail label="Custom domain" value={customDomain ?? "Not connected"} />
            <Detail label="Plan" value={planId} />
            <Detail label="Signed in as" value={`${sessionEmail} (${sessionRole})`} />
            <Detail label="Status" value={status} />
          </div>
          <CopySiteUrl url={liveUrl} />
        </div>
      )}
    </AdminWorkspace>
  );
}

function ProfileForm({ name, email, role }: { name: string; email: string; role: string }) {
  const [state, action, pending] = useActionState(updateProfile, init);
  return (
    <form action={action} className="space-y-3 max-w-md">
      <p className="text-sm font-semibold text-slate-800 dark:text-white">Your profile</p>
      <p className="text-xs text-slate-500 dark:text-slate-400">Name shown in the admin panel and team list.</p>
      <label className="block">
        <span className={labelCls}>Display name</span>
        <input name="name" defaultValue={name} required className={fieldCls} />
      </label>
      <label className="block">
        <span className={labelCls}>Email (login)</span>
        <input value={email} disabled className={fieldCls + " opacity-70"} />
      </label>
      <label className="block">
        <span className={labelCls}>Role</span>
        <input value={role} disabled className={fieldCls + " opacity-70 capitalize"} />
      </label>
      <Msg state={state} />
      <button disabled={pending} className="w-full rounded-xl bg-lime-500 text-white text-sm font-bold py-2.5 hover:bg-lime-600 disabled:opacity-60">
        {pending ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}

function NotifyForm({ prefs }: { prefs: AdminPrefs }) {
  const [state, action, pending] = useActionState(saveAdminPrefs, init);
  return (
    <form action={action} className="space-y-3 max-w-md">
      <p className="text-sm font-semibold text-slate-800 dark:text-white">Email alerts</p>
      <p className="text-xs text-slate-500 dark:text-slate-400">Choose what you want emailed when platform mail is configured.</p>
      {([
        ["notifyLeads", "New lead / enquiry", prefs.notifyLeads],
        ["notifyAppointments", "New appointment booking", prefs.notifyAppointments],
        ["notifyWeeklySummary", "Weekly summary digest", prefs.notifyWeeklySummary],
      ] as const).map(([name, label, val]) => (
        <label key={name} className="flex items-center gap-2.5 rounded-xl border border-slate-100 dark:border-slate-800 px-3 py-2.5 text-xs text-slate-700 dark:text-slate-200">
          <input type="checkbox" name={name} defaultChecked={val} className="rounded" />
          {label}
        </label>
      ))}
      <Msg state={state} />
      <button disabled={pending} className="w-full rounded-xl bg-lime-500 text-white text-sm font-bold py-2.5 hover:bg-lime-600 disabled:opacity-60">
        {pending ? "Saving…" : "Save alerts"}
      </button>
    </form>
  );
}

function DataExport({
  leads, appointments, isOwner, cancelRequested, supportEmail,
}: {
  leads: LeadRow[];
  appointments: ApptRow[];
  isOwner: boolean;
  cancelRequested: boolean;
  supportEmail: string;
}) {
  const [state, action, pending] = useActionState(requestCancellation, init);

  return (
    <div className="max-w-md space-y-4">
      <div>
        <p className="text-sm font-semibold text-slate-800 dark:text-white">Export data</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Download CSV backups of your leads and appointments.</p>
      </div>
      <div className="grid gap-2">
        <button
          type="button"
          onClick={() => downloadCsv("leads.csv", [
            ["Name", "Phone", "Email", "Message", "Date"],
            ...leads.map((l) => [l.name, l.phone, l.email, l.message, l.createdAt]),
          ])}
          className="flex items-center justify-between rounded-xl border border-slate-100 dark:border-slate-800 px-3 py-3 text-xs font-semibold text-slate-800 dark:text-slate-100 hover:border-lime-400"
        >
          <span className="inline-flex items-center gap-2"><Download className="w-3.5 h-3.5 text-lime-600" /> Export leads</span>
          <span className="text-slate-400">{leads.length}</span>
        </button>
        <button
          type="button"
          onClick={() => downloadCsv("appointments.csv", [
            ["Name", "Phone", "Email", "Date", "Time", "Message", "Created"],
            ...appointments.map((a) => [a.name, a.phone, a.email, a.date, a.time, a.message, a.createdAt]),
          ])}
          className="flex items-center justify-between rounded-xl border border-slate-100 dark:border-slate-800 px-3 py-3 text-xs font-semibold text-slate-800 dark:text-slate-100 hover:border-lime-400"
        >
          <span className="inline-flex items-center gap-2"><Download className="w-3.5 h-3.5 text-lime-600" /> Export appointments</span>
          <span className="text-slate-400">{appointments.length}</span>
        </button>
      </div>

      {isOwner && (
        <div className="rounded-2xl border border-rose-200 dark:border-rose-900/50 p-3 space-y-3">
          <p className="text-sm font-semibold text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" /> Danger zone
          </p>
          {cancelRequested ? (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              A cancellation request is already on file.
              {supportEmail ? <> Email {supportEmail} if you need to undo it.</> : null}
            </p>
          ) : (
            <form action={action} className="space-y-2">
              <p className="text-xs text-slate-500 dark:text-slate-400">Request to cancel your subscription. Your site stays online until support processes it.</p>
              <label className="block">
                <span className={labelCls}>Reason</span>
                <textarea name="reason" required rows={3} placeholder="Why are you cancelling?" className={fieldCls} />
              </label>
              <Msg state={state} />
              <button disabled={pending} className="w-full rounded-xl border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm font-bold py-2.5 hover:bg-rose-50 dark:hover:bg-rose-950/40 disabled:opacity-60">
                {pending ? "Submitting…" : "Request cancellation"}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

function CopySiteUrl({ url }: { url: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() => { navigator.clipboard?.writeText(url); setDone(true); setTimeout(() => setDone(false), 1500); }}
      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200"
    >
      <Link2 className="w-3.5 h-3.5 text-lime-600" /> {done ? "Copied!" : "Copy live URL"}
    </button>
  );
}

function Detail({ label, value, isLink }: { label: string; value: string; isLink?: boolean }) {
  return (
    <div className="rounded-xl border border-slate-100 dark:border-slate-800 px-3 py-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      <p className="text-xs font-medium text-slate-800 dark:text-slate-100 break-all mt-0.5">
        {isLink ? (
          <a href={value} target="_blank" rel="noreferrer" className="text-lime-600 dark:text-lime-400 hover:underline inline-flex items-center gap-1">
            {value} <ExternalLink className="w-3 h-3 shrink-0" />
          </a>
        ) : (
          value
        )}
      </p>
    </div>
  );
}
