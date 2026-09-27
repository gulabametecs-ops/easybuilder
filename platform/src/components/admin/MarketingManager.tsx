"use client";

import { useState, useActionState, useMemo, type ReactNode } from "react";
import {
  Share2, QrCode, Megaphone, Send, Target, Copy, Check, MessageCircle, Mail,
  ThumbsUp, Link2, ExternalLink, CheckCircle2, AlertCircle, Rocket, LayoutDashboard,
  ArrowRight, Sparkles, Camera,
} from "lucide-react";
import { savePromo, sendEmailBlast, type MktState } from "@/lib/actions/marketing";
import { CampaignsTab, type Campaign } from "./CampaignsTab";
import { AdminWorkspace, fieldCls, labelCls } from "./AdminWorkspace";
import { DevicePreviewFrame } from "./DevicePreviewFrame";

type Lead = { name: string; phone: string; email: string };
const init: MktState = { ok: false, message: "" };

const TABS = [
  { id: "overview", label: "Overview", hint: "Snapshot", icon: LayoutDashboard },
  { id: "ads", label: "Ads", hint: "Campaigns", icon: Rocket },
  { id: "share", label: "Share", hint: "QR & UTM", icon: Share2 },
  { id: "promo", label: "Promo", hint: "Banner", icon: Megaphone },
  { id: "blast", label: "Blast", hint: "Email & WA", icon: Send },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function MarketingManager({
  siteUrl, announcement, leads, bizName, campaigns, services, vertical, canBlast = true,
}: {
  siteUrl: string;
  announcement: { show: boolean; text: string; link: string };
  leads: Lead[];
  bizName: string;
  campaigns: Campaign[];
  services: string[];
  vertical: string;
  canBlast?: boolean;
}) {
  const [tab, setTab] = useState<TabId>("overview");
  const [tick, setTick] = useState(0);

  return (
    <AdminWorkspace
      title="Marketing"
      titleIcon={<Megaphone className="w-4 h-4 text-lime-600 shrink-0" />}
      tabs={[...TABS]}
      tab={tab}
      onTabChange={(id) => setTab(id as TabId)}
      aside={
        tab === "promo" ? (
          <div className="flex flex-col flex-1 min-h-0 p-2">
            <DevicePreviewFrame
              src={`/?__edit=1&_r=${tick}`}
              reloadKey={`promo:${tick}`}
              className="flex-1 min-h-0 h-[calc(100vh-8rem)]"
            />
          </div>
        ) : undefined
      }
      asideWidth={420}
    >
      {tab === "overview" && (
        <OverviewTab
          campaigns={campaigns}
          leads={leads}
          announcement={announcement}
          siteUrl={siteUrl}
          onGo={(id) => setTab(id)}
        />
      )}
      {tab === "ads" && (
        <CampaignsTab campaigns={campaigns} siteUrl={siteUrl} services={services} bizName={bizName} vertical={vertical} />
      )}
      {tab === "share" && <ShareTab siteUrl={siteUrl} bizName={bizName} />}
      {tab === "promo" && <PromoTab announcement={announcement} onSaved={() => setTick((t) => t + 1)} canEdit={canBlast} />}
      {tab === "blast" && <BlastTab leads={leads} bizName={bizName} canBlast={canBlast} />}
    </AdminWorkspace>
  );
}

function CopyBtn({ text, label = "Copy" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() => { navigator.clipboard?.writeText(text); setDone(true); setTimeout(() => setDone(false), 1500); }}
      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
    >
      {done ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />} {done ? "Copied" : label}
    </button>
  );
}

function Msg({ s }: { s: MktState }) {
  if (!s.message) return null;
  return (
    <p className={`text-xs flex items-center gap-1.5 ${s.ok ? "text-emerald-600" : "text-rose-600"}`}>
      {s.ok ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
      {s.message}
    </p>
  );
}

function Panel({ title, icon: Ic, children, hint }: { title: string; icon: typeof Share2; children: ReactNode; hint?: string }) {
  return (
    <div className="rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden max-w-2xl">
      <div className="px-3 py-2.5 bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
        <Ic className="w-4 h-4 text-lime-600" />
        <div>
          <p className="text-sm font-semibold text-slate-800 dark:text-white">{title}</p>
          {hint && <p className="text-[10px] text-slate-400">{hint}</p>}
        </div>
      </div>
      <div className="p-3 sm:p-4 space-y-3">{children}</div>
    </div>
  );
}

function OverviewTab({
  campaigns, leads, announcement, siteUrl, onGo,
}: {
  campaigns: Campaign[];
  leads: Lead[];
  announcement: { show: boolean; text: string };
  siteUrl: string;
  onGo: (id: TabId) => void;
}) {
  const active = campaigns.filter((c) => c.status === "active").length;
  const spend = campaigns.reduce((s, c) => s + c.spend, 0);
  const adLeads = campaigns.reduce((s, c) => s + c.leads, 0);
  const withEmail = leads.filter((l) => l.email).length;
  const withPhone = leads.filter((l) => l.phone).length;
  const inr = (v: number) => "₹" + v.toLocaleString("en-IN");

  const tips = [
    { ok: campaigns.length > 0, label: "Create your first ad campaign", go: "ads" as TabId },
    { ok: announcement.show && !!announcement.text, label: "Turn on a promo banner", go: "promo" as TabId },
    { ok: withEmail > 0 || withPhone > 0, label: "Capture leads, then blast offers", go: "blast" as TabId },
    { ok: true, label: "Share your site link & QR", go: "share" as TabId },
  ];

  const actions: { id: TabId; label: string; hint: string; icon: typeof Rocket }[] = [
    { id: "ads", label: "Run ads", hint: "Google, Meta, Instagram", icon: Rocket },
    { id: "share", label: "Share & track", hint: "QR, social, UTM links", icon: Share2 },
    { id: "promo", label: "Promo banner", hint: announcement.show ? "Live now" : "Hidden", icon: Megaphone },
    { id: "blast", label: "Email / WhatsApp", hint: `${leads.length} leads`, icon: Send },
  ];

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {[
          { label: "Campaigns", value: String(campaigns.length) },
          { label: "Active", value: String(active) },
          { label: "Ad spend", value: spend ? inr(spend) : "—" },
          { label: "Ad leads", value: adLeads ? String(adLeads) : "—" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 px-3 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{s.label}</p>
            <p className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-2.5">
        {actions.map((a) => {
          const Ic = a.icon;
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => onGo(a.id)}
              className="flex items-center gap-3 rounded-xl border border-slate-100 dark:border-slate-800 px-3.5 py-3 text-left hover:border-lime-400/60 hover:bg-lime-50/40 dark:hover:bg-lime-500/5 transition"
            >
              <span className="w-9 h-9 rounded-lg bg-lime-500/15 text-lime-700 dark:text-lime-400 flex items-center justify-center shrink-0">
                <Ic className="w-4 h-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-slate-800 dark:text-white">{a.label}</span>
                <span className="block text-[11px] text-slate-400 truncate">{a.hint}</span>
              </span>
              <ArrowRight className="w-4 h-4 text-slate-300 shrink-0" />
            </button>
          );
        })}
      </div>

      <Panel title="Get more customers" icon={Sparkles} hint="Quick checklist">
        <ul className="space-y-2">
          {tips.map((t) => (
            <li key={t.label}>
              <button
                type="button"
                onClick={() => onGo(t.go)}
                className="w-full flex items-center gap-2 text-left text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              >
                {t.ok && t.go !== "share" ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                ) : (
                  <CircleTodo />
                )}
                <span className="flex-1">{t.label}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
              </button>
            </li>
          ))}
        </ul>
        <p className="text-[11px] text-slate-400 pt-1">
          Site: <code className="text-slate-600 dark:text-slate-300">{siteUrl}</code>
          {" · "}{withEmail} email · {withPhone} WhatsApp ready
        </p>
      </Panel>
    </div>
  );
}

function CircleTodo() {
  return <span className="w-3.5 h-3.5 rounded-full border-2 border-slate-300 dark:border-slate-600 shrink-0" />;
}

function ShareTab({ siteUrl, bizName }: { siteUrl: string; bizName: string }) {
  const enc = encodeURIComponent(siteUrl);
  const text = encodeURIComponent(`Check out ${bizName}: ${siteUrl}`);
  const plain = `Check out ${bizName}: ${siteUrl}`;
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${enc}`;
  const [igCopied, setIgCopied] = useState(false);

  const shares = [
    { label: "WhatsApp", icon: MessageCircle, href: `https://wa.me/?text=${text}`, cls: "bg-emerald-500 hover:bg-emerald-600" },
    { label: "Facebook", icon: ThumbsUp, href: `https://www.facebook.com/sharer/sharer.php?u=${enc}`, cls: "bg-blue-600 hover:bg-blue-700" },
    { label: "LinkedIn", icon: Link2, href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc}`, cls: "bg-sky-700 hover:bg-sky-800" },
    { label: "X / Twitter", icon: Share2, href: `https://twitter.com/intent/tweet?url=${enc}&text=${text}`, cls: "bg-slate-900 hover:bg-slate-800" },
    { label: "Email", icon: Mail, href: `mailto:?subject=${encodeURIComponent(bizName)}&body=${text}`, cls: "bg-slate-500 hover:bg-slate-600" },
  ];

  const copyForInstagram = () => {
    navigator.clipboard?.writeText(plain);
    setIgCopied(true);
    setTimeout(() => setIgCopied(false), 1500);
  };

  return (
    <div className="space-y-3">
      <Panel title="Share your website" icon={Share2} hint="Copy link or post on social">
        <div className="flex flex-wrap items-center gap-2">
          <code className="flex-1 min-w-[160px] rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs truncate text-slate-800 dark:text-slate-100">{siteUrl}</code>
          <CopyBtn text={siteUrl} label="Copy" />
          <a href={siteUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-2 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800">
            <ExternalLink className="w-3.5 h-3.5" /> Open
          </a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {shares.map((s) => {
            const Ic = s.icon;
            return (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className={`inline-flex items-center justify-center gap-1.5 rounded-xl text-white text-xs font-bold px-2 py-2.5 ${s.cls}`}>
                <Ic className="w-3.5 h-3.5" /> {s.label}
              </a>
            );
          })}
          <button
            type="button"
            onClick={copyForInstagram}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl text-white text-xs font-bold px-2 py-2.5 bg-gradient-to-r from-fuchsia-500 to-amber-400 hover:opacity-90"
          >
            <Camera className="w-3.5 h-3.5" /> {igCopied ? "Copied!" : "Instagram"}
          </button>
        </div>
        <p className="text-[10px] text-slate-400">Instagram has no web share link — we copy your message so you can paste in a Story or post.</p>
      </Panel>

      <Panel title="Website QR code" icon={QrCode} hint="Print on cards, posters & bills">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qr} alt="QR code" className="w-36 h-36 rounded-xl border border-slate-200 dark:border-slate-700 bg-white" />
          <div className="text-xs text-slate-500 space-y-2 text-center sm:text-left">
            <p>Customers scan to open your site instantly.</p>
            <a href={qr} download="website-qr.png" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold px-4 py-2 hover:bg-slate-800">
              Download QR
            </a>
          </div>
        </div>
      </Panel>

      <UtmBuilder siteUrl={siteUrl} />
    </div>
  );
}

function UtmBuilder({ siteUrl }: { siteUrl: string }) {
  const [base, setBase] = useState(siteUrl);
  const [src, setSrc] = useState("facebook");
  const [med, setMed] = useState("cpc");
  const [camp, setCamp] = useState("summer_sale");
  const utm = `${base}${base.includes("?") ? "&" : "?"}utm_source=${encodeURIComponent(src)}&utm_medium=${encodeURIComponent(med)}&utm_campaign=${encodeURIComponent(camp)}`;

  const presets = [
    { label: "Facebook", src: "facebook", med: "paid_social" },
    { label: "Instagram", src: "instagram", med: "paid_social" },
    { label: "Google", src: "google", med: "cpc" },
    { label: "WhatsApp", src: "whatsapp", med: "social" },
  ];

  return (
    <Panel title="Tracked campaign link" icon={Link2} hint="UTM tags for Analytics — Ads campaigns also auto-build these">
      <div className="flex flex-wrap gap-1.5">
        {presets.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => { setSrc(p.src); setMed(p.med); }}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold border transition ${
              src === p.src ? "border-lime-500 bg-lime-500/10 text-lime-700 dark:text-lime-300" : "border-slate-200 dark:border-slate-600 text-slate-500 hover:border-slate-300"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <label className="block sm:col-span-2"><span className={labelCls}>Landing URL</span><input value={base} onChange={(e) => setBase(e.target.value)} className={fieldCls} /></label>
        <label className="block"><span className={labelCls}>Source</span><input value={src} onChange={(e) => setSrc(e.target.value)} placeholder="facebook, google" className={fieldCls} /></label>
        <label className="block"><span className={labelCls}>Medium</span><input value={med} onChange={(e) => setMed(e.target.value)} placeholder="cpc, social" className={fieldCls} /></label>
        <label className="block sm:col-span-2"><span className={labelCls}>Campaign</span><input value={camp} onChange={(e) => setCamp(e.target.value)} className={fieldCls} /></label>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <code className="flex-1 min-w-[160px] rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 text-[10px] break-all text-slate-800 dark:text-slate-100">{utm}</code>
        <CopyBtn text={utm} />
      </div>
      <a href="/admin/seo" className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-lime-700 dark:text-lime-400 hover:underline">
        <Target className="w-3.5 h-3.5" /> Set Meta Pixel / GA4 in SEO → Track
      </a>
    </Panel>
  );
}

function PromoTab({ announcement, onSaved, canEdit = true }: { announcement: { show: boolean; text: string; link: string }; onSaved: () => void; canEdit?: boolean }) {
  const [state, action, pending] = useActionState(async (prev: MktState, fd: FormData) => {
    const next = await savePromo(prev, fd);
    if (next.ok) onSaved();
    return next;
  }, init);
  const [text, setText] = useState(announcement.text);
  const [show, setShow] = useState(announcement.show);

  if (!canEdit) {
    return (
      <Panel title="Promo / offer banner" icon={Megaphone} hint="Owner / admin only">
        <p className="text-xs text-slate-500">Only owners and admins can change the public promo banner.</p>
        {announcement.show && announcement.text && (
          <div className="rounded-xl bg-slate-900 text-white text-center text-xs font-semibold px-3 py-2.5">{announcement.text}</div>
        )}
      </Panel>
    );
  }

  return (
    <Panel title="Promo / offer banner" icon={Megaphone} hint="Top bar on your live website">
      <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 mb-1">
        {show && text ? (
          <div className="bg-slate-900 text-white text-center text-xs font-semibold px-3 py-2.5">{text}</div>
        ) : (
          <div className="bg-slate-100 dark:bg-slate-800 text-slate-400 text-center text-xs px-3 py-2.5">Banner hidden / empty</div>
        )}
      </div>
      <form action={action} className="space-y-3">
        <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
          <input type="checkbox" name="show" checked={show} onChange={(e) => setShow(e.target.checked)} className="rounded" />
          Show promo banner on website
        </label>
        <label className="block">
          <span className={labelCls}>Banner text</span>
          <input name="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Diwali offer — 20% off this week!" className={fieldCls} />
        </label>
        <label className="block">
          <span className={labelCls}>Link when clicked (optional)</span>
          <input name="link" defaultValue={announcement.link} placeholder="/contact or https://…" className={fieldCls} />
        </label>
        <Msg s={state} />
        <button disabled={pending} className="w-full rounded-xl bg-lime-500 text-white text-sm font-bold py-2.5 hover:bg-lime-600 disabled:opacity-60">
          {pending ? "Saving…" : "Save & apply"}
        </button>
      </form>
    </Panel>
  );
}

function BlastTab({ leads, bizName, canBlast = true }: { leads: Lead[]; bizName: string; canBlast?: boolean }) {
  const [state, action, pending] = useActionState(sendEmailBlast, init);
  const [waMsg, setWaMsg] = useState(`Hello! This is ${bizName}. `);
  const [q, setQ] = useState("");
  const withEmail = leads.filter((l) => l.email).length;
  const withPhone = useMemo(() => {
    const list = leads.filter((l) => l.phone);
    const qq = q.trim().toLowerCase();
    if (!qq) return list;
    return list.filter((l) => (l.name || "").toLowerCase().includes(qq) || l.phone.includes(qq));
  }, [leads, q]);

  return (
    <div className="space-y-3">
      <Panel title="Email campaign" icon={Mail} hint={canBlast ? `${withEmail} lead(s) with email` : "Owner / admin only"}>
        {!canBlast ? (
          <p className="text-xs text-slate-500">Only owners and admins can send email campaigns to leads.</p>
        ) : (
          <form action={action} className="space-y-3">
            <label className="block"><span className={labelCls}>Subject</span><input name="subject" required placeholder="Special offer just for you!" className={fieldCls} /></label>
            <label className="block">
              <span className={labelCls}>Message</span>
              <textarea name="body" required rows={4} placeholder={`Hello,\n\nWe have a special offer…\n\nRegards,\n${bizName}`} className={fieldCls} />
            </label>
            <Msg s={state} />
            <button disabled={pending || withEmail === 0} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 text-white text-sm font-bold py-2.5 hover:bg-slate-800 disabled:opacity-60">
              <Send className="w-4 h-4" /> {pending ? "Sending…" : `Send to ${withEmail} leads`}
            </button>
          </form>
        )}
      </Panel>
      <Panel title="WhatsApp leads" icon={MessageCircle} hint="Tap a lead to open chat">
        <textarea value={waMsg} onChange={(e) => setWaMsg(e.target.value)} rows={2} className={fieldCls} />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name or phone…"
          className={fieldCls}
        />
        {withPhone.length === 0 ? (
          <p className="text-xs text-slate-400">{q ? "No matching leads." : "No leads with a phone number yet."}</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-2 max-h-64 overflow-auto">
            {withPhone.map((l, i) => (
              <a
                key={i}
                href={`https://wa.me/${l.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(waMsg)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 dark:border-slate-800 px-3 py-2 text-xs hover:border-emerald-400"
              >
                <span className="truncate"><b className="text-slate-800 dark:text-slate-100">{l.name || "Lead"}</b> <span className="text-slate-400">{l.phone}</span></span>
                <MessageCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              </a>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}
