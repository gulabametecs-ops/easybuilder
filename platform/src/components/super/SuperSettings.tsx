"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { saveRazorpay, savePlatform, saveBroadcast, savePlans, saveGst, saveReminders, triggerReminders, changeSuperPassword, addSuperAdmin, saveDemoSettings, saveAi, testAi, saveReferralSettings, type SettingsState } from "@/lib/actions/superSettings";
import { AI_PROVIDERS, getProvider } from "@/lib/ai/providers";
import { type Tier, type Duration, LIMIT_KEYS, LIMIT_LABELS } from "@/lib/plans";
import type { ReferralSettings } from "@/lib/referral";
import { Card, btnPrimary, btnSecondary } from "@/components/admin/ui";
import { CreditCard, Building2, KeyRound, UserPlus, CheckCircle2, AlertCircle, Megaphone, Layers, FileText, BellRing, Smartphone, Sparkles, Gift } from "lucide-react";

const init: SettingsState = { ok: false, message: "" };
const inputCls = "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-lime-500 focus:ring-4 focus:ring-lime-500/15";
const lbl = "block text-sm font-medium text-slate-600 mb-1";
const h3 = "flex items-center gap-2.5 text-base font-bold text-slate-900";
const chip = "admin-grad inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-md shadow-blue-600/20 [&>svg]:h-4 [&>svg]:w-4";
const card = "p-5 sm:p-6";

function Msg({ s }: { s: SettingsState }) {
  if (!s.message) return null;
  return <p className={`text-sm flex items-center gap-1.5 ${s.ok ? "text-green-600" : "text-red-600"}`}>{s.ok ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}{s.message}</p>;
}

type Cfg = {
  razorpayKeyId: string; hasSecret: boolean; platformName: string; supportEmail: string; supportPhone: string;
  broadcastShow: boolean; broadcastText: string;
  gstin: string; businessAddress: string; gstRate: number; invoicePrefix: string;
  remindersEnabled: boolean; reminderDays: number; hasResendKey: boolean; senderEmail: string;
  demoOtpMode: string; demoDurationMinutes: number; hasWhatsAppToken: boolean; demoWhatsAppPhoneId: string;
  aiProvider: string; aiKeyed: string[]; aiModels: Record<string, string>; aiBaseUrl: string;
};

export function SuperSettings({ cfg, admins, tiers, durations, referral }: { cfg: Cfg; admins: { email: string; name: string | null }[]; tiers: Tier[]; durations: Duration[]; referral: ReferralSettings }) {
  const live = Boolean(cfg.razorpayKeyId && cfg.hasSecret);
  const groups = [
    { label: "Sales & demos", items: [
      { id: "demo", label: "Demo gate", icon: Smartphone, el: <DemoSettingsForm cfg={cfg} /> },
      { id: "ai", label: "AI builder", icon: Sparkles, el: <AiForm cfg={cfg} /> },
    ] },
    { label: "Billing", items: [
      { id: "payments", label: "Payments", icon: CreditCard, el: <RazorpayForm cfg={cfg} live={live} /> },
      { id: "plans", label: "Plans", icon: Layers, el: <PlansForm tiers={tiers} durations={durations} /> },
      { id: "gst", label: "GST & invoices", icon: FileText, el: <GstForm cfg={cfg} /> },
      { id: "referral", label: "Referral program", icon: Gift, el: <ReferralForm r={referral} /> },
    ] },
    { label: "Communication", items: [
      { id: "reminders", label: "Reminders", icon: BellRing, el: <RemindersForm cfg={cfg} /> },
      { id: "broadcast", label: "Broadcast", icon: Megaphone, el: <BroadcastForm cfg={cfg} /> },
    ] },
    { label: "Account", items: [
      { id: "platform", label: "Platform info", icon: Building2, el: <PlatformForm cfg={cfg} /> },
      {
        id: "security", label: "Security & admins", icon: KeyRound,
        el: <div className="grid gap-6 md:grid-cols-2"><PasswordForm /><AddAdminForm admins={admins} /></div>,
      },
    ] },
  ];
  return (
    <div className="lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-8">
      {/* Section nav: sticky sidebar on desktop, scrollable chip row on phones */}
      <nav aria-label="Settings sections" className="mb-6 lg:mb-0">
        <div className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 lg:sticky lg:top-24 lg:mx-0 lg:block lg:space-y-4 lg:overflow-visible lg:px-0">
          {groups.map((g) => (
            <div key={g.label} className="contents lg:block">
              <p className="hidden px-2.5 pb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 lg:block">{g.label}</p>
              {g.items.map((it) => (
                <a key={it.id} href={`#${it.id}`} className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 hover:border-lime-400 hover:text-lime-600 lg:border-transparent lg:bg-transparent lg:py-2">
                  <it.icon className="h-4 w-4 text-slate-400" /> {it.label}
                </a>
              ))}
            </div>
          ))}
        </div>
      </nav>
      <div className="min-w-0 max-w-3xl space-y-10">
        {groups.map((g) => (
          <section key={g.label} className="space-y-6">
            <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
              {g.label} <span className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
            </p>
            {g.items.map((it) => <div key={it.id} id={it.id} className="scroll-mt-24">{it.el}</div>)}
          </section>
        ))}
      </div>
    </div>
  );
}

function AiForm({ cfg }: { cfg: Cfg }) {
  const router = useRouter();
  const [state, action, pending] = useActionState(saveAi, init);
  const [test, runTest, testing] = useActionState(testAi, init);
  const [pick, setPick] = useState(cfg.aiProvider || "groq");
  const p = getProvider(pick);
  const active = getProvider(cfg.aiProvider);
  const keyed = new Set(cfg.aiKeyed);
  const live = keyed.has(active.id);

  useEffect(() => {
    if (state.ok) router.refresh();
  }, [state.ok, router]);

  return (
    <Card className={card}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className={h3}>
          <span className={chip}><Sparkles /></span> AI Website Builder
        </h3>
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${live ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
          {live ? `● Using ${active.name}` : "Not configured"}
        </span>
      </div>
      <p className="mb-4 text-sm text-slate-500">
        Pick which AI powers the homepage AI builder and the client admin AI. Keys are stored server-side only and kept per provider — switch any time.
      </p>

      <form action={action} className="space-y-4">
        <input type="hidden" name="aiProvider" value={pick} />
        <div className="grid gap-2 sm:grid-cols-3">
          {AI_PROVIDERS.map((x) => (
            <button
              key={x.id}
              type="button"
              onClick={() => setPick(x.id)}
              className={`rounded-xl border px-3 py-2.5 text-left transition ${
                pick === x.id ? "admin-grad border-transparent shadow-md shadow-blue-600/20" : "border-slate-200 hover:border-lime-400"
              }`}
            >
              <span className="block text-sm font-semibold">{x.name}</span>
              <span className={`block text-[11px] ${pick === x.id ? "text-white/70" : "text-slate-500"}`}>
                {cfg.aiProvider === x.id ? "Active" : keyed.has(x.id) ? "Key saved" : "No key"}
              </span>
            </button>
          ))}
        </div>
        <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">{p.note}</p>

        {/* key on the provider so its fields reset when switching */}
        <div key={p.id} className="space-y-4">
          {p.id === "custom" && (
            <label className="block">
              <span className={lbl}>Base URL</span>
              <input name="aiBaseUrl" defaultValue={cfg.aiBaseUrl} placeholder="https://api.together.xyz/v1" className={inputCls} />
              <span className="mt-1 block text-xs text-slate-400">The OpenAI-compatible endpoint; /chat/completions is added automatically.</span>
            </label>
          )}
          <label className="block">
            <span className={lbl}>{p.name} API key</span>
            <input
              name="aiKey"
              type="password"
              autoComplete="off"
              placeholder={keyed.has(p.id) ? "•••••••• (saved — leave blank to keep)" : p.keyHint}
              className={inputCls}
            />
            {p.keysUrl && (
              <span className="mt-1 block text-xs text-slate-400">
                Get a key at{" "}
                <a href={p.keysUrl} target="_blank" rel="noreferrer" className="text-lime-600 underline">
                  {new URL(p.keysUrl).hostname}
                </a>
              </span>
            )}
          </label>
          <label className="block">
            <span className={lbl}>Model {p.id === "custom" ? "" : "(optional)"}</span>
            <input
              name="aiModel"
              list={`ai-models-${p.id}`}
              defaultValue={cfg.aiModels[p.id] ?? ""}
              placeholder={p.defaultModel || "model-id"}
              className={inputCls}
            />
            <datalist id={`ai-models-${p.id}`}>
              {p.models.map((m) => (
                <option key={m} value={m} />
              ))}
            </datalist>
            {p.defaultModel && <span className="mt-1 block text-xs text-slate-400">Blank = {p.defaultModel}. Any model id your account can use works.</span>}
          </label>
        </div>

        <Msg s={state} />
        <div className="flex flex-wrap gap-2">
          <button disabled={pending} className={btnPrimary}>
            {pending ? "Saving..." : `Save & use ${p.name}`}
          </button>
          <button
            type="submit"
            formAction={runTest}
            disabled={testing}
            className={btnSecondary}
          >
            {testing ? "Testing..." : `Test ${active.name}`}
          </button>
        </div>
        <Msg s={test} />
      </form>
    </Card>
  );
}

function DemoSettingsForm({ cfg }: { cfg: Cfg }) {
  const [state, action, pending] = useActionState(saveDemoSettings, init);
  return (
    <Card className={card}>
      <h3 className={`${h3} mb-1`}><span className={chip}><Smartphone /></span> Demo gate (OTP &amp; sandbox)</h3>
      <p className="text-sm text-slate-500 mb-4">
        Control how visitors unlock sector demos. <strong>Screen (test)</strong> shows OTP on the page. <strong>WhatsApp</strong> sends OTP via Meta WhatsApp Cloud API.
      </p>
      <form action={action} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className={lbl}>OTP delivery</span>
            <select name="demoOtpMode" defaultValue={cfg.demoOtpMode} className={inputCls}>
              <option value="screen">Screen (test) — show OTP on page</option>
              <option value="whatsapp">WhatsApp — send OTP to phone</option>
            </select>
          </label>
          <label className="block">
            <span className={lbl}>Demo duration (minutes)</span>
            <input name="demoDurationMinutes" type="number" min={5} max={60} defaultValue={cfg.demoDurationMinutes} className={inputCls} />
          </label>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className={lbl}>WhatsApp API token</span>
            <input name="demoWhatsAppToken" type="password" placeholder={cfg.hasWhatsAppToken ? "•••••••• (blank to keep)" : "Meta Cloud API token"} className={inputCls} />
          </label>
          <label className="block">
            <span className={lbl}>WhatsApp Phone Number ID</span>
            <input name="demoWhatsAppPhoneId" defaultValue={cfg.demoWhatsAppPhoneId} placeholder="From Meta developer console" className={inputCls} />
          </label>
        </div>
        <Msg s={state} />
        <button disabled={pending} className={btnPrimary}>{pending ? "Saving..." : "Save demo settings"}</button>
      </form>
    </Card>
  );
}

function PlansForm({ tiers, durations }: { tiers: Tier[]; durations: Duration[] }) {
  const [state, action, pending] = useActionState(savePlans, init);
  return (
    <Card className={card}>
      <h3 className={`${h3} mb-1`}><span className={chip}><Layers /></span> Plans (prices &amp; limits)</h3>
      <p className="text-sm text-slate-500 mb-4">Edit each plan&apos;s monthly price and limits (0 = unlimited; storage &amp; file size in MB, 1024 = 1 GB). Changes apply to the pricing page, checkout and enforcement instantly.</p>
      <form action={action} className="space-y-4">
        {tiers.map((t) => (
          <fieldset key={t.id} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
            <legend className="px-1 text-sm font-semibold text-slate-700">{t.name}</legend>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <label className="block"><span className={lbl}>Price (₹/month)</span><input name={`price_${t.id}`} type="number" min="0" defaultValue={Math.round(t.monthlyBase / 100)} className={inputCls} /></label>
              {LIMIT_KEYS.map((k) => (
                <label key={k} className="block"><span className={lbl}>{LIMIT_LABELS[k]}{k === "storageMb" || k === "uploadMb" ? " (MB)" : ""}</span><input name={`${k}_${t.id}`} type="number" min="0" defaultValue={t.limits[k]} className={inputCls} /></label>
              ))}
            </div>
            <label className="mt-3 flex items-center gap-2 text-sm font-medium text-slate-700"><input type="checkbox" name={`customDomain_${t.id}`} defaultChecked={t.customDomain} className="rounded" /> Custom domain included</label>
          </fieldset>
        ))}
        <fieldset className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
          <legend className="px-1 text-sm font-semibold text-slate-700">Billing period discounts (%)</legend>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {durations.map((d) => (
              <label key={d.id} className="block"><span className={lbl}>{d.label}</span><input name={`discount_${d.id}`} type="number" min="0" max="90" defaultValue={d.discountPct} className={inputCls} /></label>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-2">Applies to every plan on the pricing page, checkout and in-admin renewals.</p>
        </fieldset>
        <Msg s={state} />
        <button disabled={pending} className={btnPrimary}>{pending ? "Saving..." : "Save plans"}</button>
      </form>
    </Card>
  );
}

function GstForm({ cfg }: { cfg: Cfg }) {
  const [state, action, pending] = useActionState(saveGst, init);
  return (
    <Card className={card}>
      <h3 className={`${h3} mb-1`}><span className={chip}><FileText /></span> GST &amp; invoicing</h3>
      <p className="text-sm text-slate-500 mb-4">These details appear on the auto-generated invoices your clients download.</p>
      <form action={action} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block"><span className={lbl}>GSTIN</span><input name="gstin" defaultValue={cfg.gstin} placeholder="22AAAAA0000A1Z5" className={inputCls} /></label>
          <label className="block"><span className={lbl}>GST rate (%)</span><input name="gstRate" type="number" min="0" max="28" defaultValue={cfg.gstRate} className={inputCls} /></label>
        </div>
        <label className="block"><span className={lbl}>Business address</span><textarea name="businessAddress" defaultValue={cfg.businessAddress} rows={2} className={inputCls} /></label>
        <label className="block"><span className={lbl}>Invoice number prefix</span><input name="invoicePrefix" defaultValue={cfg.invoicePrefix} placeholder="INV" className={inputCls} /></label>
        <Msg s={state} />
        <button disabled={pending} className={btnPrimary}>{pending ? "Saving..." : "Save GST details"}</button>
      </form>
    </Card>
  );
}

function RemindersForm({ cfg }: { cfg: Cfg }) {
  const [state, action, pending] = useActionState(saveReminders, init);
  const [runState, runAction, running] = useActionState(triggerReminders, init);
  return (
    <Card className={card}>
      <h3 className={`${h3} mb-1`}><span className={chip}><BellRing /></span> Renewal reminders</h3>
      <p className="text-sm text-slate-500 mb-4">Automatically email clients before their license expires. Runs daily (Vercel cron) or on demand below.</p>
      <form action={action} className="space-y-4">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700"><input type="checkbox" name="remindersEnabled" defaultChecked={cfg.remindersEnabled} className="rounded" /> Enable automatic renewal reminders</label>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block"><span className={lbl}>Remind days before expiry</span><input name="reminderDays" type="number" min="1" max="60" defaultValue={cfg.reminderDays} className={inputCls} /></label>
          <label className="block"><span className={lbl}>Sender email</span><input name="senderEmail" type="email" defaultValue={cfg.senderEmail} placeholder="noreply@yourdomain.com" className={inputCls} /></label>
        </div>
        <label className="block"><span className={lbl}>Resend API key</span><input name="resendApiKey" type="password" placeholder={cfg.hasResendKey ? "•••••••• (saved — blank to keep)" : "re_xxxxxxxx"} className={inputCls} /><span className="block text-xs text-slate-400 mt-1">Get a free key at resend.com. Blank = mock mode (no real emails).</span></label>
        <Msg s={state} />
        <button disabled={pending} className={btnPrimary}>{pending ? "Saving..." : "Save reminder settings"}</button>
      </form>
      <div className="mt-4 pt-4 border-t border-slate-100">
        <form action={runAction}>
          <button disabled={running} className={btnSecondary}>{running ? "Sending..." : "Send reminders now"}</button>
        </form>
        <div className="mt-2"><Msg s={runState} /></div>
      </div>
    </Card>
  );
}

function BroadcastForm({ cfg }: { cfg: Cfg }) {
  const [state, action, pending] = useActionState(saveBroadcast, init);
  return (
    <Card className={card}>
      <h3 className={`${h3} mb-1`}><span className={chip}><Megaphone /></span> Broadcast to all clients</h3>
      <p className="text-sm text-slate-500 mb-4">Shows a banner at the top of every client&apos;s admin panel (e.g. an offer or maintenance notice).</p>
      <form action={action} className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700"><input type="checkbox" name="broadcastShow" defaultChecked={cfg.broadcastShow} className="rounded" /> Show broadcast banner</label>
        <input name="broadcastText" defaultValue={cfg.broadcastText} placeholder="e.g. 🎉 New feature: add videos to your site!" className={inputCls} />
        <Msg s={state} />
        <button disabled={pending} className={btnPrimary}>{pending ? "Saving..." : "Save broadcast"}</button>
      </form>
    </Card>
  );
}

function RazorpayForm({ cfg, live }: { cfg: Cfg; live: boolean }) {
  const [state, action, pending] = useActionState(saveRazorpay, init);
  return (
    <Card className={card}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={h3}><span className={chip}><CreditCard /></span> Razorpay payments</h3>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${live ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{live ? "● Live payments ON" : "Test / mock mode"}</span>
      </div>
      <p className="text-sm text-slate-500 mb-4">Get your keys from <a href="https://dashboard.razorpay.com/app/keys" target="_blank" className="text-lime-600 underline">Razorpay → Settings → API Keys</a>. Leave keys empty to keep checkout in test mode (no real charge).</p>
      <form action={action} className="space-y-4">
        <label className="block"><span className={lbl}>Key ID</span><input name="razorpayKeyId" defaultValue={cfg.razorpayKeyId} placeholder="rzp_live_xxxxxxxx or rzp_test_xxxxxxxx" className={inputCls} /></label>
        <label className="block"><span className={lbl}>Key Secret</span><input name="razorpayKeySecret" type="password" placeholder={cfg.hasSecret ? "•••••••• (saved — leave blank to keep)" : "Enter key secret"} className={inputCls} /><span className="block text-xs text-slate-400 mt-1">Stored securely. Leave blank to keep the existing secret.</span></label>
        <Msg s={state} />
        <button disabled={pending} className={btnPrimary}>{pending ? "Saving..." : "Save payment keys"}</button>
      </form>
    </Card>
  );
}

function PlatformForm({ cfg }: { cfg: Cfg }) {
  const [state, action, pending] = useActionState(savePlatform, init);
  return (
    <Card className={card}>
      <h3 className={`${h3} mb-4`}><span className={chip}><Building2 /></span> Platform information</h3>
      <form action={action} className="space-y-4">
        <label className="block"><span className={lbl}>Platform name</span><input name="platformName" defaultValue={cfg.platformName} className={inputCls} /></label>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block"><span className={lbl}>Support email</span><input name="supportEmail" type="email" defaultValue={cfg.supportEmail} className={inputCls} placeholder="support@yourplatform.com" /></label>
          <label className="block"><span className={lbl}>Support phone</span><input name="supportPhone" defaultValue={cfg.supportPhone} className={inputCls} placeholder="+91 ..." /></label>
        </div>
        <Msg s={state} />
        <button disabled={pending} className={btnPrimary}>{pending ? "Saving..." : "Save"}</button>
      </form>
    </Card>
  );
}

function PasswordForm() {
  const [state, action, pending] = useActionState(changeSuperPassword, init);
  return (
    <Card className={card}>
      <h3 className={`${h3} mb-4`}><span className={chip}><KeyRound /></span> Change your password</h3>
      <form action={action} className="space-y-4">
        <label className="block"><span className={lbl}>Current password</span><input name="current" type="password" required className={inputCls} /></label>
        <label className="block"><span className={lbl}>New password</span><input name="next" type="password" required className={inputCls} /></label>
        <Msg s={state} />
        <button disabled={pending} className={btnPrimary}>{pending ? "Updating..." : "Update password"}</button>
      </form>
    </Card>
  );
}

function AddAdminForm({ admins }: { admins: { email: string; name: string | null }[] }) {
  const [state, action, pending] = useActionState(addSuperAdmin, init);
  return (
    <Card className={card}>
      <h3 className={`${h3} mb-4`}><span className={chip}><UserPlus /></span> Super admins</h3>
      <ul className="text-sm text-slate-600 mb-4 space-y-1">
        {admins.map((a) => <li key={a.email} className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-lime-500" /> {a.email}</li>)}
      </ul>
      <form action={action} className="space-y-3">
        <input name="name" placeholder="Name (optional)" className={inputCls} />
        <input name="email" type="email" required placeholder="Email" className={inputCls} />
        <input name="password" type="password" required placeholder="Password (min 6)" className={inputCls} />
        <Msg s={state} />
        <button disabled={pending} className={btnSecondary}>{pending ? "Adding..." : "Add super admin"}</button>
      </form>
    </Card>
  );
}

function ReferralForm({ r }: { r: ReferralSettings }) {
  const [state, action, pending] = useActionState(saveReferralSettings, init);
  return (
    <Card className={card}>
      <h3 className={`${h3} mb-1`}><span className={chip}><Gift /></span> Referral program</h3>
      <p className="text-sm text-slate-500 mb-4">Customers share their link and earn a commission on qualifying purchases by the people they refer. Buyers get no discount.</p>
      <form action={action} className="space-y-4">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700"><input type="checkbox" name="enabled" defaultChecked={r.enabled} className="rounded" /> Program enabled</label>
        <div className="grid sm:grid-cols-3 gap-4">
          <label className="block"><span className={lbl}>Commission (%)</span><input name="commissionPct" type="number" min="0" max="100" defaultValue={r.commissionPct} className={inputCls} /></label>
          <label className="block"><span className={lbl}>Min order, before GST (₹)</span><input name="minOrder" type="number" min="0" defaultValue={r.minOrderPaise / 100} className={inputCls} /><span className="block text-xs text-slate-400 mt-1">Order must be above this.</span></label>
          <label className="block"><span className={lbl}>Min withdrawal (₹)</span><input name="minWithdrawal" type="number" min="0" defaultValue={r.minWithdrawalPaise / 100} className={inputCls} /></label>
          <label className="block"><span className={lbl}>Hold period (days)</span><input name="holdDays" type="number" min="0" max="365" defaultValue={r.holdDays} className={inputCls} /><span className="block text-xs text-slate-400 mt-1">Matches the refund window.</span></label>
          <label className="block"><span className={lbl}>TDS on payouts (%)</span><input name="tdsPct" type="number" min="0" max="100" defaultValue={r.tdsPct} className={inputCls} /><span className="block text-xs text-slate-400 mt-1">Commission payouts may need TDS under Indian tax law — confirm with your CA.</span></label>
        </div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700"><input type="checkbox" name="firstPurchaseOnly" defaultChecked={r.firstPurchaseOnly} className="rounded" /> Commission on first purchase only (off = renewals also earn)</label>
        <Msg s={state} />
        <button disabled={pending} className={btnPrimary}>{pending ? "Saving..." : "Save referral program"}</button>
      </form>
    </Card>
  );
}
