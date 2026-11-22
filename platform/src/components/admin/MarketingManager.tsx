"use client";

import { useEffect, useState, useActionState, useMemo, type ReactNode } from "react";
import QRCode from "qrcode";
import {
  Share2, QrCode, Megaphone, Send, Copy, Check, MessageCircle, Mail,
  ThumbsUp, Link2, ExternalLink, CheckCircle2, AlertCircle, Rocket, LayoutDashboard,
  ArrowRight, Sparkles, Camera, Eye, Inbox, Percent, TrendingUp, TrendingDown, FileText,
  Download, Store, Star, Plug, BarChart3,
} from "lucide-react";
import { savePromo, sendEmailBlast, type MktState } from "@/lib/actions/marketing";
import { CampaignsTab, type Campaign } from "./CampaignsTab";
import { AdminWorkspace, fieldCls, labelCls } from "./AdminWorkspace";
import { DevicePreviewFrame } from "./DevicePreviewFrame";

type Lead = { name: string; phone: string; email: string };
export type MarketingInsights = {
  visits7: number;
  visitsPrev7: number;
  leads7: number;
  leadsTotal: number;
  converted: number;
  topPages: { path: string; views: number }[];
};
const init: MktState = { ok: false, message: "" };

const TABS = [
  { id: "overview", label: "Overview", hint: "Snapshot", icon: LayoutDashboard },
  { id: "ads", label: "Ads", hint: "Campaigns", icon: Rocket },
  { id: "posts", label: "Posts", hint: "Templates", icon: FileText },
  { id: "share", label: "Share", hint: "QR & UTM", icon: Share2 },
  { id: "promo", label: "Promo", hint: "Banner", icon: Megaphone },
  { id: "blast", label: "Blast", hint: "Email & WA", icon: Send },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function MarketingManager({
  siteUrl, announcement, leads, bizName, campaigns, services, vertical, sector = "", insights, canBlast = true,
}: {
  sector?: string;
  insights: MarketingInsights;
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
      subtitle="Insights, ads, ready-made posts, tracked links, promo banner and lead messaging."
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
          bizName={bizName}
          insights={insights}
          onGo={(id) => setTab(id)}
        />
      )}
      {tab === "ads" && (
        <CampaignsTab campaigns={campaigns} siteUrl={siteUrl} services={services} bizName={bizName} vertical={vertical} />
      )}
      {tab === "posts" && <PostsTab siteUrl={siteUrl} bizName={bizName} sector={sector} services={services} />}
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
    <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 overflow-hidden max-w-2xl bg-white dark:bg-slate-900 shadow-sm">
      <div className="px-4 py-3 border-b border-slate-100 dark:border-white/10 flex items-center gap-2.5">
        <span className="w-8 h-8 rounded-xl bg-lime-500/12 text-lime-600 flex items-center justify-center shrink-0">
          <Ic className="w-4 h-4" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-800 dark:text-white">{title}</p>
          {hint && <p className="text-[10px] text-slate-400">{hint}</p>}
        </div>
      </div>
      <div className="p-4 space-y-3">{children}</div>
    </div>
  );
}

function OverviewTab({
  campaigns, leads, announcement, siteUrl, bizName, insights, onGo,
}: {
  campaigns: Campaign[];
  leads: Lead[];
  announcement: { show: boolean; text: string };
  siteUrl: string;
  bizName: string;
  insights: MarketingInsights;
  onGo: (id: TabId) => void;
}) {
  const active = campaigns.filter((c) => c.status === "active").length;
  const spend = campaigns.reduce((s, c) => s + c.spend, 0);
  const withEmail = leads.filter((l) => l.email).length;
  const withPhone = leads.filter((l) => l.phone).length;
  const inr = (v: number) => "₹" + v.toLocaleString("en-IN");
  const { visits7, visitsPrev7, leads7, topPages } = insights;
  const delta = visitsPrev7 > 0 ? Math.round(((visits7 - visitsPrev7) / visitsPrev7) * 100) : null;
  const conv = visits7 > 0 ? ((leads7 / visits7) * 100).toFixed(1) + "%" : "—";
  const topMax = Math.max(1, ...topPages.map((p) => p.views));
  const statusText = encodeURIComponent(`✨ Visit ${bizName} online: ${siteUrl}`);

  const stats: { label: string; value: string; hint: ReactNode; icon: typeof Eye; tint: string }[] = [
    {
      label: "Visits · 7 days", value: visits7.toLocaleString("en-IN"), icon: Eye, tint: "from-blue-500 to-violet-500",
      hint: delta === null ? "Page views" : (
        <span className={`inline-flex items-center gap-0.5 font-semibold ${delta >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
          {delta >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />} {delta >= 0 ? "+" : ""}{delta}% vs last week
        </span>
      ),
    },
    { label: "Leads · 7 days", value: String(leads7), icon: Inbox, tint: "from-emerald-500 to-teal-500", hint: `${insights.leadsTotal} all time` },
    { label: "Visit → lead", value: conv, icon: Percent, tint: "from-amber-500 to-orange-500", hint: `${insights.converted} converted overall` },
    { label: "Ad campaigns", value: `${active}/${campaigns.length}`, icon: Rocket, tint: "from-sky-500 to-cyan-500", hint: spend ? `${inr(spend)} spent` : "active / total" },
  ];

  const actions: { id: TabId; label: string; hint: string; icon: typeof Rocket; tint: string }[] = [
    { id: "ads", label: "Run ads", hint: "Google, Meta, Instagram", icon: Rocket, tint: "from-blue-500 to-violet-500" },
    { id: "posts", label: "Ready-made posts", hint: "WhatsApp, Instagram, Facebook", icon: FileText, tint: "from-fuchsia-500 to-pink-500" },
    { id: "share", label: "Tracked links & QR", hint: "UTM links, QR codes", icon: Share2, tint: "from-sky-500 to-cyan-500" },
    { id: "promo", label: "Offer banner", hint: announcement.show && announcement.text ? "Live now" : "Hidden", icon: Megaphone, tint: "from-amber-500 to-orange-500" },
    { id: "blast", label: "Message leads", hint: `${withEmail} email · ${withPhone} WhatsApp`, icon: Send, tint: "from-emerald-500 to-teal-500" },
  ];

  type Step = { label: string; hint: string; done?: boolean } & ({ go: TabId } | { href: string; external?: boolean });
  const steps: Step[] = [
    { label: "Create your first ad campaign", hint: "Target nearby customers", done: campaigns.length > 0, go: "ads" },
    { label: "Turn on an offer banner", hint: "Top bar on every page", done: announcement.show && !!announcement.text, go: "promo" },
    { label: "Claim your Google Business Profile", hint: "Show up on Google Maps & Search", href: "https://business.google.com/create", external: true },
    { label: "Ask happy customers for reviews", hint: "Copy a ready review request", go: "posts" },
    { label: "Share on your WhatsApp Status", hint: "One tap, reaches all contacts", href: `https://wa.me/?text=${statusText}`, external: true },
    { label: "Connect Meta Pixel / Google Analytics", hint: "Measure ads & retarget visitors", href: "/admin/integrations" },
  ];
  const done = steps.filter((t) => t.done).length;

  return (
    <div className="space-y-4">
      <div className="admin-grad relative overflow-hidden rounded-2xl p-5 sm:p-6">
        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10" aria-hidden />
        <div className="absolute right-16 -bottom-14 w-32 h-32 rounded-full bg-white/10" aria-hidden />
        <p className="relative text-[11px] font-bold uppercase tracking-[0.16em] text-white/75">Growth hub</p>
        <p className="relative text-xl sm:text-2xl font-extrabold mt-1">Bring more customers to {bizName}</p>
        <p className="relative text-sm text-white/80 mt-1 max-w-lg">Run ads, post ready-made offers, share tracked links and message your leads — all from here.</p>
        <div className="relative flex flex-wrap gap-2 mt-4">
          <button type="button" onClick={() => onGo("ads")} className="inline-flex items-center gap-1.5 rounded-xl bg-white/95 text-blue-700 px-3.5 py-2 text-sm font-bold hover:bg-white/90">
            <Rocket className="w-4 h-4" /> Create a campaign
          </button>
          <button type="button" onClick={() => onGo("posts")} className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 hover:bg-white/25 px-3.5 py-2 text-sm font-semibold">
            <FileText className="w-4 h-4" /> Get post ideas
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-2.5">
        {stats.map((s) => {
          const Ic = s.icon;
          return (
            <div key={s.label} className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-900 p-3.5 shadow-sm min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-semibold text-slate-500 truncate">{s.label}</p>
                <span className={`w-7 h-7 rounded-lg bg-gradient-to-br ${s.tint} text-white flex items-center justify-center shrink-0`}><Ic className="w-3.5 h-3.5" /></span>
              </div>
              <p className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">{s.value}</p>
              <p className="text-[11px] text-slate-400 mt-0.5 truncate">{s.hint}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-4 items-start">
        <div className="space-y-4 min-w-0">
          <div className="grid sm:grid-cols-2 gap-2.5">
            {actions.map((a) => {
              const Ic = a.icon;
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => onGo(a.id)}
                  className="group flex items-center gap-3 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-900 px-4 py-3.5 text-left shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-lime-400/60 transition"
                >
                  <span className={`w-10 h-10 rounded-xl bg-gradient-to-br ${a.tint} text-white flex items-center justify-center shrink-0 shadow-sm`}>
                    <Ic className="w-5 h-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-slate-800 dark:text-white">{a.label}</span>
                    <span className="block text-xs text-slate-500 truncate">{a.hint}</span>
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-lime-600 group-hover:translate-x-0.5 transition shrink-0" />
                </button>
              );
            })}
          </div>

          <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 dark:border-white/10 flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-lime-500/12 text-lime-600 flex items-center justify-center shrink-0"><BarChart3 className="w-4 h-4" /></span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-800 dark:text-white">Top pages</p>
                <p className="text-[10px] text-slate-400">Most visited · last 30 days</p>
              </div>
              <a href="/admin/analytics" className="text-xs font-semibold text-lime-600 hover:underline shrink-0">Analytics</a>
            </div>
            {topPages.length === 0 ? (
              <p className="p-6 text-center text-xs text-slate-400">No visits recorded yet — share your link to get the first ones.</p>
            ) : (
              <ul className="p-3 space-y-2">
                {topPages.map((p) => (
                  <li key={p.path} className="relative rounded-lg overflow-hidden">
                    <div className="absolute inset-y-0 left-0 bg-lime-500/10" style={{ width: `${(p.views / topMax) * 100}%` }} />
                    <div className="relative flex items-center justify-between gap-3 px-2.5 py-1.5 text-xs">
                      <span className="font-medium text-slate-700 dark:text-slate-200 truncate">{p.path}</span>
                      <span className="font-bold text-slate-900 dark:text-white shrink-0">{p.views.toLocaleString("en-IN")}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <p className="px-4 pb-3 text-[10px] text-slate-400">Traffic sources aren&apos;t recorded yet — use tracked (UTM) links + Google Analytics to see them.</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-white/10">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2"><Sparkles className="w-4 h-4 text-lime-600" /> Grow checklist</p>
              <span className="text-[11px] font-semibold text-slate-500">{done}/{steps.length}</span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-100 dark:bg-white/10 mt-2.5 overflow-hidden">
              <div className="h-full admin-grad rounded-full" style={{ width: `${(done / steps.length) * 100}%` }} />
            </div>
          </div>
          <ul className="p-2">
            {steps.map((t) => {
              const inner = (
                <>
                  {t.done ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> : <CircleTodo />}
                  <span className="flex-1 min-w-0">
                    <span className={`block text-[13px] font-semibold ${t.done ? "text-slate-400 line-through" : "text-slate-800 dark:text-slate-100"}`}>{t.label}</span>
                    <span className="block text-[11px] text-slate-400">{t.hint}</span>
                  </span>
                  {"external" in t && t.external ? <ExternalLink className="w-3.5 h-3.5 text-slate-300 shrink-0 mt-1" /> : <ArrowRight className="w-3.5 h-3.5 text-slate-300 shrink-0 mt-1" />}
                </>
              );
              const cls = "w-full flex items-start gap-2.5 rounded-xl px-2.5 py-2 text-left hover:bg-slate-50 dark:hover:bg-white/5";
              return (
                <li key={t.label}>
                  {"go" in t ? (
                    <button type="button" onClick={() => onGo(t.go)} className={cls}>{inner}</button>
                  ) : (
                    <a href={t.href} target={t.external ? "_blank" : undefined} rel={t.external ? "noreferrer" : undefined} className={cls}>{inner}</a>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

/** QR code as a PNG data URL, generated locally (no third-party request). */
function useQr(text: string, width = 480) {
  const [png, setPng] = useState("");
  useEffect(() => {
    let live = true;
    QRCode.toDataURL(text, { errorCorrectionLevel: "M", margin: 1, width, color: { dark: "#0f172a", light: "#ffffff" } })
      .then((d) => live && setPng(d))
      .catch(() => live && setPng(""));
    return () => { live = false; };
  }, [text, width]);
  return png;
}

function PostsTab({ siteUrl, bizName, sector, services }: { siteUrl: string; bizName: string; sector: string; services: string[] }) {
  const [service, setService] = useState(services[0] ?? "");
  const [offer, setOffer] = useState("10% off this week");
  const what = service || sector || "our services";
  const tag = (s: string) => "#" + s.replace(/[^a-z0-9]/gi, "");
  const tags = [tag(bizName), sector && tag(sector), service && tag(service)].filter(Boolean).join(" ");

  const posts: { id: string; label: string; icon: typeof MessageCircle; tint: string; text: string; share?: string }[] = [
    {
      id: "wa", label: "WhatsApp message / Status", icon: MessageCircle, tint: "from-emerald-500 to-green-600",
      text: `Hello! 👋 This is ${bizName}.\n\n${offer ? `🎉 ${offer} on ${what}!\n\n` : ""}See our services, photos and prices here 👉 ${siteUrl}\n\nReply to this message to book or ask anything.`,
    },
    {
      id: "ig", label: "Instagram caption", icon: Camera, tint: "from-fuchsia-500 to-amber-400",
      text: `✨ ${offer ? `${offer} — ` : ""}${what} at ${bizName}!\n\nTrusted by customers who want it done right. DM us or tap the link in bio to book.\n\n🔗 ${siteUrl}\n\n${tags}`,
    },
    {
      id: "fb", label: "Facebook post", icon: ThumbsUp, tint: "from-blue-600 to-blue-500",
      text: `${bizName} ${sector ? `— your local ${sector.toLowerCase()} expert` : ""}\n\n${offer ? `🎁 ${offer} on ${what}. ` : ""}Visit our website to see everything we offer and send an enquiry in seconds:\n${siteUrl}`,
      share: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl)}`,
    },
    {
      id: "review", label: "Review request", icon: Star, tint: "from-amber-500 to-orange-500",
      text: `Hi! Thank you for choosing ${bizName} 🙏\n\nIf you were happy with us, could you leave a quick Google review? It really helps a small business like ours.\n\nSearch "${bizName}" on Google Maps and tap "Write a review". Thank you!`,
    },
  ];

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-900 p-4 shadow-sm grid sm:grid-cols-2 gap-3">
        <label className="block">
          <span className={labelCls}>Promote</span>
          {services.length > 0 ? (
            <select value={service} onChange={(e) => setService(e.target.value)} className={fieldCls}>
              <option value="">Whole business</option>
              {services.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          ) : (
            <input value={service} onChange={(e) => setService(e.target.value)} placeholder="e.g. Personal training" className={fieldCls} />
          )}
        </label>
        <label className="block">
          <span className={labelCls}>Offer (optional)</span>
          <input value={offer} onChange={(e) => setOffer(e.target.value)} placeholder="Free first visit" className={fieldCls} />
        </label>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {posts.map((p) => {
          const Ic = p.icon;
          return (
            <div key={p.id} className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-900 shadow-sm flex flex-col overflow-hidden">
              <div className="px-4 py-3 flex items-center gap-2.5 border-b border-slate-100 dark:border-white/10">
                <span className={`w-8 h-8 rounded-xl bg-gradient-to-br ${p.tint} text-white flex items-center justify-center shrink-0`}><Ic className="w-4 h-4" /></span>
                <p className="text-sm font-bold text-slate-800 dark:text-white">{p.label}</p>
              </div>
              <p className="flex-1 px-4 py-3 text-[13px] leading-relaxed text-slate-600 dark:text-slate-300 whitespace-pre-wrap break-words">{p.text}</p>
              <div className="px-4 pb-4 flex flex-wrap gap-2">
                <CopyBtn text={p.text} label="Copy text" />
                {(p.id === "wa" || p.id === "review") && (
                  <a href={`https://wa.me/?text=${encodeURIComponent(p.text)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 text-xs font-bold">
                    <MessageCircle className="w-3.5 h-3.5" /> Send on WhatsApp
                  </a>
                )}
                {p.share && (
                  <a href={p.share} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 text-xs font-bold">
                    <ThumbsUp className="w-3.5 h-3.5" /> Share on Facebook
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
        <Store className="w-3.5 h-3.5" /> Tip: post at lunch (12–2pm) or evening (7–9pm) when people scroll most. Add a real photo of your work.
      </p>
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
  const qr = useQr(siteUrl);
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
          {qr ? <img src={qr} alt="QR code" className="w-36 h-36 rounded-xl border border-slate-200 dark:border-slate-700 bg-white" /> : <div className="w-36 h-36 rounded-xl bg-slate-100 dark:bg-white/5 animate-pulse" />}
          <div className="text-xs text-slate-500 space-y-2 text-center sm:text-left">
            <p>Customers scan to open your site instantly.</p>
            <a href={qr || undefined} download="website-qr.png" className="admin-grad inline-flex items-center gap-1.5 rounded-xl text-xs font-bold px-4 py-2 hover:opacity-90">
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
  const utmQr = useQr(utm, 360);

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
      <div className="flex items-center gap-3 rounded-xl border border-slate-100 dark:border-white/10 p-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {utmQr ? <img src={utmQr} alt="QR code for tracked link" className="w-24 h-24 rounded-lg bg-white border border-slate-200 dark:border-slate-700" /> : <div className="w-24 h-24 rounded-lg bg-slate-100 dark:bg-white/5 animate-pulse" />}
        <div className="text-xs text-slate-500 space-y-2 min-w-0">
          <p>QR for this tracked link — print it on flyers to see how many visits they bring.</p>
          <a href={utmQr || undefined} download={`qr-${camp || "campaign"}.png`} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-1.5 font-semibold text-slate-700 dark:text-slate-200 hover:border-lime-400">
            <Download className="w-3.5 h-3.5" /> Download QR
          </a>
        </div>
      </div>
      <a href="/admin/integrations" className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-lime-700 dark:text-lime-400 hover:underline">
        <Plug className="w-3.5 h-3.5" /> Connect Meta Pixel / Google Analytics in Integrations
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
        <button disabled={pending} className="admin-grad w-full rounded-xl text-sm font-bold py-2.5 shadow-md shadow-blue-600/20 hover:opacity-90 disabled:opacity-60">
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
            <button disabled={pending || withEmail === 0} className="admin-grad w-full inline-flex items-center justify-center gap-2 rounded-xl text-sm font-bold py-2.5 shadow-md shadow-blue-600/20 hover:opacity-90 disabled:opacity-60">
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
