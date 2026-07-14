"use client";

import { useActionState } from "react";
import { saveRazorpay, savePlatform, saveBroadcast, savePlans, saveGst, saveReminders, triggerReminders, changeSuperPassword, addSuperAdmin, type SettingsState } from "@/lib/actions/superSettings";
import { type Tier } from "@/lib/plans";
import { Card } from "@/components/admin/ui";
import { CreditCard, Building2, KeyRound, UserPlus, CheckCircle2, AlertCircle, Megaphone, Layers, FileText, BellRing } from "lucide-react";

const init: SettingsState = { ok: false, message: "" };
const inputCls = "w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-lime-500";
const lbl = "block text-sm font-medium text-slate-600 mb-1";

function Msg({ s }: { s: SettingsState }) {
  if (!s.message) return null;
  return <p className={`text-sm flex items-center gap-1.5 ${s.ok ? "text-green-600" : "text-red-600"}`}>{s.ok ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}{s.message}</p>;
}

type Cfg = {
  razorpayKeyId: string; hasSecret: boolean; platformName: string; supportEmail: string; supportPhone: string;
  broadcastShow: boolean; broadcastText: string;
  gstin: string; businessAddress: string; gstRate: number; invoicePrefix: string;
  remindersEnabled: boolean; reminderDays: number; hasResendKey: boolean; senderEmail: string;
};

export function SuperSettings({ cfg, admins, tiers }: { cfg: Cfg; admins: { email: string; name: string | null }[]; tiers: Tier[] }) {
  const live = Boolean(cfg.razorpayKeyId && cfg.hasSecret);
  return (
    <div className="space-y-6 max-w-3xl">
      <RazorpayForm cfg={cfg} live={live} />
      <PlansForm tiers={tiers} />
      <GstForm cfg={cfg} />
      <RemindersForm cfg={cfg} />
      <BroadcastForm cfg={cfg} />
      <PlatformForm cfg={cfg} />
      <div className="grid md:grid-cols-2 gap-6">
        <PasswordForm />
        <AddAdminForm admins={admins} />
      </div>
    </div>
  );
}

function PlansForm({ tiers }: { tiers: Tier[] }) {
  const [state, action, pending] = useActionState(savePlans, init);
  return (
    <Card className="p-6">
      <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-1"><Layers className="w-5 h-5 text-lime-600" /> Plans (prices &amp; limits)</h3>
      <p className="text-sm text-slate-500 mb-4">Edit each plan&apos;s monthly price and service limit — changes apply to the pricing page and checkout instantly.</p>
      <form action={action} className="space-y-4">
        {tiers.map((t) => (
          <div key={t.id} className="grid sm:grid-cols-3 gap-3 items-end">
            <div className="text-sm font-medium text-slate-700 pb-2.5">{t.name}</div>
            <label className="block"><span className={lbl}>Price (₹/month)</span><input name={`price_${t.id}`} type="number" min="0" defaultValue={Math.round(t.monthlyBase / 100)} className={inputCls} /></label>
            <label className="block"><span className={lbl}>Max services (0 = ∞)</span><input name={`limit_${t.id}`} type="number" min="0" defaultValue={t.maxServices} className={inputCls} /></label>
          </div>
        ))}
        <Msg s={state} />
        <button disabled={pending} className="rounded-lg bg-slate-900 text-white text-sm font-semibold px-5 py-2.5 hover:bg-slate-800 disabled:opacity-60">{pending ? "Saving..." : "Save plans"}</button>
      </form>
    </Card>
  );
}

function GstForm({ cfg }: { cfg: Cfg }) {
  const [state, action, pending] = useActionState(saveGst, init);
  return (
    <Card className="p-6">
      <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-1"><FileText className="w-5 h-5 text-lime-600" /> GST &amp; invoicing</h3>
      <p className="text-sm text-slate-500 mb-4">These details appear on the auto-generated invoices your clients download.</p>
      <form action={action} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block"><span className={lbl}>GSTIN</span><input name="gstin" defaultValue={cfg.gstin} placeholder="22AAAAA0000A1Z5" className={inputCls} /></label>
          <label className="block"><span className={lbl}>GST rate (%)</span><input name="gstRate" type="number" min="0" max="28" defaultValue={cfg.gstRate} className={inputCls} /></label>
        </div>
        <label className="block"><span className={lbl}>Business address</span><textarea name="businessAddress" defaultValue={cfg.businessAddress} rows={2} className={inputCls} /></label>
        <label className="block"><span className={lbl}>Invoice number prefix</span><input name="invoicePrefix" defaultValue={cfg.invoicePrefix} placeholder="INV" className={inputCls} /></label>
        <Msg s={state} />
        <button disabled={pending} className="rounded-lg bg-slate-900 text-white text-sm font-semibold px-5 py-2.5 hover:bg-slate-800 disabled:opacity-60">{pending ? "Saving..." : "Save GST details"}</button>
      </form>
    </Card>
  );
}

function RemindersForm({ cfg }: { cfg: Cfg }) {
  const [state, action, pending] = useActionState(saveReminders, init);
  const [runState, runAction, running] = useActionState(triggerReminders, init);
  return (
    <Card className="p-6">
      <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-1"><BellRing className="w-5 h-5 text-lime-600" /> Renewal reminders</h3>
      <p className="text-sm text-slate-500 mb-4">Automatically email clients before their license expires. Runs daily (Vercel cron) or on demand below.</p>
      <form action={action} className="space-y-4">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700"><input type="checkbox" name="remindersEnabled" defaultChecked={cfg.remindersEnabled} className="rounded" /> Enable automatic renewal reminders</label>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block"><span className={lbl}>Remind days before expiry</span><input name="reminderDays" type="number" min="1" max="60" defaultValue={cfg.reminderDays} className={inputCls} /></label>
          <label className="block"><span className={lbl}>Sender email</span><input name="senderEmail" type="email" defaultValue={cfg.senderEmail} placeholder="noreply@yourdomain.com" className={inputCls} /></label>
        </div>
        <label className="block"><span className={lbl}>Resend API key</span><input name="resendApiKey" type="password" placeholder={cfg.hasResendKey ? "•••••••• (saved — blank to keep)" : "re_xxxxxxxx"} className={inputCls} /><span className="block text-xs text-slate-400 mt-1">Get a free key at resend.com. Blank = mock mode (no real emails).</span></label>
        <Msg s={state} />
        <button disabled={pending} className="rounded-lg bg-slate-900 text-white text-sm font-semibold px-5 py-2.5 hover:bg-slate-800 disabled:opacity-60">{pending ? "Saving..." : "Save reminder settings"}</button>
      </form>
      <div className="mt-4 pt-4 border-t border-slate-100">
        <form action={runAction}>
          <button disabled={running} className="rounded-lg border border-slate-300 text-slate-700 text-sm font-semibold px-4 py-2 hover:bg-slate-50 disabled:opacity-60">{running ? "Sending..." : "Send reminders now"}</button>
        </form>
        <div className="mt-2"><Msg s={runState} /></div>
      </div>
    </Card>
  );
}

function BroadcastForm({ cfg }: { cfg: Cfg }) {
  const [state, action, pending] = useActionState(saveBroadcast, init);
  return (
    <Card className="p-6">
      <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-1"><Megaphone className="w-5 h-5 text-lime-600" /> Broadcast to all clients</h3>
      <p className="text-sm text-slate-500 mb-4">Shows a banner at the top of every client&apos;s admin panel (e.g. an offer or maintenance notice).</p>
      <form action={action} className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700"><input type="checkbox" name="broadcastShow" defaultChecked={cfg.broadcastShow} className="rounded" /> Show broadcast banner</label>
        <input name="broadcastText" defaultValue={cfg.broadcastText} placeholder="e.g. 🎉 New feature: add videos to your site!" className={inputCls} />
        <Msg s={state} />
        <button disabled={pending} className="rounded-lg bg-slate-900 text-white text-sm font-semibold px-5 py-2.5 hover:bg-slate-800 disabled:opacity-60">{pending ? "Saving..." : "Save broadcast"}</button>
      </form>
    </Card>
  );
}

function RazorpayForm({ cfg, live }: { cfg: Cfg; live: boolean }) {
  const [state, action, pending] = useActionState(saveRazorpay, init);
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-900 flex items-center gap-2"><CreditCard className="w-5 h-5 text-lime-600" /> Razorpay payments</h3>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${live ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{live ? "● Live payments ON" : "Test / mock mode"}</span>
      </div>
      <p className="text-sm text-slate-500 mb-4">Get your keys from <a href="https://dashboard.razorpay.com/app/keys" target="_blank" className="text-lime-600 underline">Razorpay → Settings → API Keys</a>. Leave keys empty to keep checkout in test mode (no real charge).</p>
      <form action={action} className="space-y-4">
        <label className="block"><span className={lbl}>Key ID</span><input name="razorpayKeyId" defaultValue={cfg.razorpayKeyId} placeholder="rzp_live_xxxxxxxx or rzp_test_xxxxxxxx" className={inputCls} /></label>
        <label className="block"><span className={lbl}>Key Secret</span><input name="razorpayKeySecret" type="password" placeholder={cfg.hasSecret ? "•••••••• (saved — leave blank to keep)" : "Enter key secret"} className={inputCls} /><span className="block text-xs text-slate-400 mt-1">Stored securely. Leave blank to keep the existing secret.</span></label>
        <Msg s={state} />
        <button disabled={pending} className="rounded-lg bg-slate-900 text-white text-sm font-semibold px-5 py-2.5 hover:bg-slate-800 disabled:opacity-60">{pending ? "Saving..." : "Save payment keys"}</button>
      </form>
    </Card>
  );
}

function PlatformForm({ cfg }: { cfg: Cfg }) {
  const [state, action, pending] = useActionState(savePlatform, init);
  return (
    <Card className="p-6">
      <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-4"><Building2 className="w-5 h-5 text-lime-600" /> Platform information</h3>
      <form action={action} className="space-y-4">
        <label className="block"><span className={lbl}>Platform name</span><input name="platformName" defaultValue={cfg.platformName} className={inputCls} /></label>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block"><span className={lbl}>Support email</span><input name="supportEmail" type="email" defaultValue={cfg.supportEmail} className={inputCls} placeholder="support@yourplatform.com" /></label>
          <label className="block"><span className={lbl}>Support phone</span><input name="supportPhone" defaultValue={cfg.supportPhone} className={inputCls} placeholder="+91 ..." /></label>
        </div>
        <Msg s={state} />
        <button disabled={pending} className="rounded-lg bg-slate-900 text-white text-sm font-semibold px-5 py-2.5 hover:bg-slate-800 disabled:opacity-60">{pending ? "Saving..." : "Save"}</button>
      </form>
    </Card>
  );
}

function PasswordForm() {
  const [state, action, pending] = useActionState(changeSuperPassword, init);
  return (
    <Card className="p-6">
      <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-4"><KeyRound className="w-5 h-5 text-lime-600" /> Change your password</h3>
      <form action={action} className="space-y-4">
        <label className="block"><span className={lbl}>Current password</span><input name="current" type="password" required className={inputCls} /></label>
        <label className="block"><span className={lbl}>New password</span><input name="next" type="password" required className={inputCls} /></label>
        <Msg s={state} />
        <button disabled={pending} className="rounded-lg bg-slate-900 text-white text-sm font-semibold px-5 py-2.5 hover:bg-slate-800 disabled:opacity-60">{pending ? "Updating..." : "Update password"}</button>
      </form>
    </Card>
  );
}

function AddAdminForm({ admins }: { admins: { email: string; name: string | null }[] }) {
  const [state, action, pending] = useActionState(addSuperAdmin, init);
  return (
    <Card className="p-6">
      <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-4"><UserPlus className="w-5 h-5 text-lime-600" /> Super admins</h3>
      <ul className="text-sm text-slate-600 mb-4 space-y-1">
        {admins.map((a) => <li key={a.email} className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-lime-500" /> {a.email}</li>)}
      </ul>
      <form action={action} className="space-y-3">
        <input name="name" placeholder="Name (optional)" className={inputCls} />
        <input name="email" type="email" required placeholder="Email" className={inputCls} />
        <input name="password" type="password" required placeholder="Password (min 6)" className={inputCls} />
        <Msg s={state} />
        <button disabled={pending} className="rounded-lg border border-slate-300 text-slate-700 text-sm font-semibold px-5 py-2.5 hover:bg-slate-50 disabled:opacity-60">{pending ? "Adding..." : "Add super admin"}</button>
      </form>
    </Card>
  );
}
