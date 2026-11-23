"use client";

import { useEffect, useRef, useState, useActionState, useMemo, useSyncExternalStore, type ReactNode } from "react";
import QRCode from "qrcode";
import {
  Share2, QrCode, Megaphone, Send, Copy, Check, MessageCircle, Mail,
  ThumbsUp, Link2, ExternalLink, CheckCircle2, AlertCircle, Rocket,
  ArrowRight, Sparkles, Camera, Eye, Inbox, Percent, TrendingUp, TrendingDown, FileText,
  Download, Star, Plug, BarChart3, Lightbulb, CalendarDays, PartyPopper, ChevronDown, Gift, MapPin,
} from "lucide-react";
import { savePromo, sendEmailBlast, type MktState } from "@/lib/actions/marketing";
import { sectorIdeas, type SectorIdeas, type UpcomingOccasion } from "@/lib/marketingIdeas";
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
type Announcement = { show: boolean; text: string; link: string };
const init: MktState = { ok: false, message: "" };

const TABS = [
  { id: "home", label: "Start here", hint: "Goals & ideas", icon: Sparkles },
  { id: "posts", label: "Posts", hint: "Ready to share", icon: FileText },
  { id: "promo", label: "Offer", hint: "Website banner", icon: Megaphone },
  { id: "share", label: "Share & QR", hint: "Link & QR code", icon: QrCode },
  { id: "ads", label: "Ads", hint: "Paid campaigns", icon: Rocket },
  { id: "blast", label: "Message", hint: "Your customers", icon: Send },
] as const;

type TabId = (typeof TABS)[number]["id"];
type PostKind = "all" | "wa" | "ig" | "fb" | "review";

const GOALS: { label: string; what: string; icon: typeof Rocket; tint: string; go: TabId; kind?: PostKind }[] = [
  { label: "Get more enquiries", what: "Share your website link & QR code everywhere", icon: Inbox, tint: "from-emerald-500 to-teal-500", go: "share" },
  { label: "Run an offer", what: "Show a discount banner on your website", icon: Gift, tint: "from-amber-500 to-orange-500", go: "promo" },
  { label: "Get Google reviews", what: "Send happy customers a ready review request", icon: Star, tint: "from-yellow-400 to-amber-500", go: "posts", kind: "review" },
  { label: "Share on WhatsApp / Instagram", what: "Copy a ready-made post in one tap", icon: MessageCircle, tint: "from-fuchsia-500 to-pink-500", go: "posts", kind: "all" },
  { label: "Run an ad", what: "Reach new people nearby on Google or Facebook", icon: Rocket, tint: "from-blue-500 to-violet-500", go: "ads" },
  { label: "Message my customers", what: "Send an offer to people who already enquired", icon: Send, tint: "from-sky-500 to-cyan-500", go: "blast" },
];

// Remembers (per browser) that a review request was copied/sent, so the suggestion can step aside.
const REVIEW_KEY = "mkt:reviewAsked";
const noopSubscribe = () => () => {};
function useReviewAsked() {
  return useSyncExternalStore(
    noopSubscribe,
    () => { try { return localStorage.getItem(REVIEW_KEY) === "1"; } catch { return false; } },
    () => true, // server: assume asked, so the suggestion only appears after hydration
  );
}
const markReviewAsked = () => { try { localStorage.setItem(REVIEW_KEY, "1"); } catch { /* storage blocked */ } };

export function MarketingManager({
  siteUrl, announcement, leads, bizName, campaigns, services, vertical, sector = "", insights, canBlast = true,
  occasions = [], hasAnalytics = false, reviewLink = "",
}: {
  sector?: string;
  insights: MarketingInsights;
  siteUrl: string;
  announcement: Announcement;
  leads: Lead[];
  bizName: string;
  campaigns: Campaign[];
  services: string[];
  vertical: string;
  canBlast?: boolean;
  occasions?: UpcomingOccasion[];
  hasAnalytics?: boolean;
  reviewLink?: string;
}) {
  const [tab, setTab] = useState<TabId>("home");
  const [tick, setTick] = useState(0);
  const [postKind, setPostKind] = useState<PostKind>("all");
  const ideas = useMemo(() => sectorIdeas(vertical), [vertical]);
  const [offer, setOffer] = useState(ideas.offers[0]);
  const [promoDraft, setPromoDraft] = useState<{ text: string; n: number } | null>(null);
  const top = useRef<HTMLDivElement>(null);

  // Each tool opens at its top, even when reached from a card further down the page.
  useEffect(() => { top.current?.closest(".overflow-y-auto")?.scrollTo({ top: 0 }); }, [tab]);

  const go = (t: TabId, kind?: PostKind) => { if (kind) setPostKind(kind); setTab(t); };
  const applyOffer = (text: string) => { setPromoDraft((d) => ({ text, n: (d?.n ?? 0) + 1 })); setTab("promo"); };
  const postAbout = (text: string) => { setOffer(text); go("posts", "all"); };

  return (
    <AdminWorkspace
      title="Marketing"
      subtitle="Simple tools to bring more customers — pick a goal and we'll guide you."
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
      <div ref={top} />
      {tab === "home" && (
        <HomeTab
          campaigns={campaigns} leads={leads} announcement={announcement} bizName={bizName} insights={insights}
          ideas={ideas} occasions={occasions} hasAnalytics={hasAnalytics} reviewLink={reviewLink}
          onGo={go} onOffer={applyOffer} onPost={postAbout}
        />
      )}
      {tab === "ads" && (
        <div className="space-y-4">
          <ToolIntro
            icon={Rocket}
            title="Run an ad"
            what="Pay a small amount to show your business to new people nearby on Google, Facebook or Instagram."
            tips={[
              "Start small — ₹200–500 a day for one week, then keep only what brings enquiries.",
              "One ad = one service + one clear offer. Use a real photo, not a stock image.",
              "Target 5–10 km around your business — most customers come from nearby.",
            ]}
          />
          <CampaignsTab campaigns={campaigns} siteUrl={siteUrl} services={services} bizName={bizName} vertical={vertical} />
        </div>
      )}
      {tab === "posts" && (
        <PostsTab
          siteUrl={siteUrl} bizName={bizName} sector={sector} services={services} ideas={ideas} occasions={occasions}
          kind={postKind} setKind={setPostKind} offer={offer} setOffer={setOffer} reviewLink={reviewLink}
        />
      )}
      {tab === "share" && <ShareTab siteUrl={siteUrl} bizName={bizName} />}
      {tab === "promo" && (
        <PromoTab
          key={promoDraft?.n ?? 0}
          announcement={announcement}
          prefill={promoDraft?.text}
          ideas={ideas}
          occasions={occasions}
          onSaved={() => setTick((t) => t + 1)}
          canEdit={canBlast}
        />
      )}
      {tab === "blast" && (
        <BlastTab
          leads={leads} bizName={bizName} canBlast={canBlast} siteUrl={siteUrl} reviewLink={reviewLink}
          offer={announcement.show && announcement.text ? announcement.text : ideas.offers[0]}
          occasion={occasions[0]} onGo={go}
        />
      )}
    </AdminWorkspace>
  );
}

// ─── Shared bits ──────────────────────────────────────────────────────────────

function CopyBtn({ text, label = "Copy", onCopy }: { text: string; label?: string; onCopy?: () => void }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() => { navigator.clipboard?.writeText(text); onCopy?.(); setDone(true); setTimeout(() => setDone(false), 1500); }}
      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
    >
      {done ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />} {done ? "Copied!" : label}
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

const cardCls = "rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-900 shadow-sm";

function Panel({ title, icon: Ic, children, hint }: { title: string; icon: typeof Share2; children: ReactNode; hint?: string }) {
  return (
    <div className={`${cardCls} overflow-hidden max-w-2xl`}>
      <div className="px-4 py-3 border-b border-slate-100 dark:border-white/10 flex items-center gap-2.5">
        <span className="w-8 h-8 rounded-xl bg-lime-500/12 text-lime-600 flex items-center justify-center shrink-0">
          <Ic className="w-4 h-4" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800 dark:text-white">{title}</p>
          {hint && <p className="text-[11px] text-slate-400">{hint}</p>}
        </div>
      </div>
      <div className="p-4 space-y-3">{children}</div>
    </div>
  );
}

/** Top of every tool: what it does in one line + a few plain-language tips. */
function ToolIntro({ icon: Ic, title, what, tips }: { icon: typeof Share2; title: string; what: string; tips?: string[] }) {
  return (
    <div className="rounded-2xl border border-lime-200/70 dark:border-white/10 bg-gradient-to-r from-lime-50/80 via-white to-violet-50/70 dark:from-lime-500/[0.07] dark:via-slate-900 dark:to-violet-500/[0.07] p-4">
      <div className="flex items-start gap-3">
        <span className="admin-grad w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-md shadow-blue-600/20">
          <Ic className="w-5 h-5" />
        </span>
        <div className="min-w-0">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">{title}</h2>
          <p className="text-[13px] text-slate-600 dark:text-slate-300">{what}</p>
        </div>
      </div>
      {tips && tips.length > 0 && (
        <ul className="mt-3 grid gap-1.5 sm:grid-cols-2 xl:grid-cols-3">
          {tips.map((t) => (
            <li key={t} className="flex items-start gap-1.5 rounded-xl bg-white/70 dark:bg-white/5 px-2.5 py-2 text-xs text-slate-600 dark:text-slate-300">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" /> <span>{t}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Chip({ onClick, active, children }: { onClick: () => void; active?: boolean; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-semibold border transition text-left ${
        active
          ? "border-lime-500 bg-lime-500/10 text-lime-700 dark:text-lime-300"
          : "border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-lime-400"
      }`}
    >
      {children}
    </button>
  );
}

const when = (o: UpcomingOccasion) => (o.ongoing ? "On now" : o.daysAway === 0 ? "Today" : o.daysAway === 1 ? "Tomorrow" : `In ${o.daysAway} days`);
const shortDate = (ymd: string) => new Date(`${ymd}T00:00:00Z`).toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "UTC" });

// ─── Start here ───────────────────────────────────────────────────────────────

type Sug = { title: string; why: string; cta: string; icon: typeof Rocket } & (
  | { go: TabId; kind?: PostKind }
  | { href: string; external?: boolean }
  | { offer: string }
);

function HomeTab({
  campaigns, leads, announcement, bizName, insights, ideas, occasions, hasAnalytics, reviewLink, onGo, onOffer, onPost,
}: {
  campaigns: Campaign[];
  leads: Lead[];
  announcement: Announcement;
  bizName: string;
  insights: MarketingInsights;
  ideas: SectorIdeas;
  occasions: UpcomingOccasion[];
  hasAnalytics: boolean;
  reviewLink: string;
  onGo: (id: TabId, kind?: PostKind) => void;
  onOffer: (text: string) => void;
  onPost: (text: string) => void;
}) {
  const [all, setAll] = useState(false);
  const reviewAsked = useReviewAsked();
  const active = campaigns.filter((c) => c.status === "active").length;
  const withPhone = leads.filter((l) => l.phone).length;
  const bannerOn = announcement.show && !!announcement.text;
  const { visits7, visitsPrev7, leads7, topPages } = insights;
  const delta = visitsPrev7 > 0 ? Math.round(((visits7 - visitsPrev7) / visitsPrev7) * 100) : null;
  const conv = visits7 > 0 ? ((leads7 / visits7) * 100).toFixed(1) + "%" : "—";
  const topMax = Math.max(1, ...topPages.map((p) => p.views));
  const soon = occasions.find((o) => o.daysAway <= 21);

  // Ordered by impact; driven by the tenant's real state.
  const sugs: Sug[] = [];
  if (soon) sugs.push({ title: `${soon.name}: ${when(soon).toLowerCase()}`, why: "People look for offers around festivals. Put a festive offer on your website.", cta: "Use festive offer", icon: PartyPopper, offer: soon.offer });
  if (!bannerOn) sugs.push({ title: "Add an offer to your website", why: "Your website has no offer banner. A small offer gives visitors a reason to contact you today.", cta: "Pick an offer", icon: Gift, offer: ideas.offers[0] });
  if (leads7 < 3) sugs.push({ title: leads7 === 0 ? "No new enquiries this week" : `Only ${leads7} enquir${leads7 === 1 ? "y" : "ies"} this week`, why: "Send your website link to 20 contacts on WhatsApp — it's free and works fast.", cta: "Get WhatsApp message", icon: MessageCircle, go: "posts", kind: "wa" });
  if (visits7 < 20) sugs.push({ title: `Only ${visits7} website visit${visits7 === 1 ? "" : "s"} this week`, why: "Print your QR code and keep it on your counter, bills and visiting cards.", cta: "Get my QR code", icon: QrCode, go: "share" });
  if (!reviewAsked) sugs.push({ title: "Ask 5 happy customers for a Google review", why: "More reviews = more trust on Google Maps. We wrote the message for you.", cta: "Get review message", icon: Star, go: "posts", kind: "review" });
  if (campaigns.length === 0) sugs.push({ title: "Try your first small ad", why: "Even ₹200 a day can reach people near you. We help you write the ad.", cta: "Create an ad", icon: Rocket, go: "ads" });
  else if (active === 0) sugs.push({ title: "None of your ads are running", why: "Your campaigns are paused or drafts. Restart the one that brought enquiries.", cta: "Open ads", icon: Rocket, go: "ads" });
  if (withPhone > 0) sugs.push({ title: `${withPhone} customer${withPhone === 1 ? "" : "s"} can be messaged on WhatsApp`, why: "People who already enquired are the easiest to win. Send them your latest offer.", cta: "Message them", icon: Send, go: "blast" });
  if (!reviewLink) {
    sugs.push({ title: "Claim your free Google Business Profile", why: "Show up on Google Maps when people nearby search for you.", cta: "Open Google", icon: MapPin, href: "https://business.google.com/create", external: true });
    sugs.push({ title: "Add your Google review link", why: "Customers land straight on the review box, so more of them finish the review.", cta: "Add in Integrations", icon: Plug, href: "/admin/integrations" });
  }
  if (!hasAnalytics) sugs.push({ title: "Connect Google Analytics", why: "See where your visitors come from — Google, Instagram, WhatsApp and more.", cta: "Connect", icon: BarChart3, href: "/admin/integrations" });
  sugs.push({ title: "Put your link in your Instagram bio & WhatsApp profile", why: "Every person who visits your profile can open your website in one tap.", cta: "Copy my link", icon: Link2, go: "share" });
  const shown = all ? sugs : sugs.slice(0, 4);

  const stats: { label: string; value: string; hint: ReactNode; icon: typeof Eye; tint: string }[] = [
    {
      label: "Website visits", value: visits7.toLocaleString("en-IN"), icon: Eye, tint: "from-blue-500 to-violet-500",
      hint: delta === null ? "last 7 days" : (
        <span className={`inline-flex items-center gap-0.5 font-semibold ${delta >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
          {delta >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />} {delta >= 0 ? "+" : ""}{delta}% vs last week
        </span>
      ),
    },
    { label: "Enquiries", value: String(leads7), icon: Inbox, tint: "from-emerald-500 to-teal-500", hint: `${insights.leadsTotal} all time` },
    { label: "Visitors who enquired", value: conv, icon: Percent, tint: "from-amber-500 to-orange-500", hint: `${insights.converted} became customers` },
    { label: "Ads running", value: `${active}/${campaigns.length}`, icon: Rocket, tint: "from-sky-500 to-cyan-500", hint: campaigns.length ? "active / total" : "none yet" },
  ];

  return (
    <div className="space-y-4">
      <div className="admin-grad relative overflow-hidden rounded-2xl p-5 sm:p-6">
        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10" aria-hidden />
        <div className="absolute right-16 -bottom-14 w-32 h-32 rounded-full bg-white/10" aria-hidden />
        <p className="relative text-[11px] font-bold uppercase tracking-[0.16em] text-white/75">Marketing made simple</p>
        <h2 className="relative text-xl sm:text-2xl font-extrabold mt-1">What do you want to do today?</h2>
        <p className="relative text-sm text-white/85 mt-1 max-w-lg">Pick a goal for {bizName} — we&apos;ll open the right tool with ready-made text. No marketing knowledge needed.</p>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-2.5">
        {GOALS.map((g) => {
          const Ic = g.icon;
          return (
            <button
              key={g.label}
              type="button"
              onClick={() => onGo(g.go, g.kind)}
              className={`group flex items-center gap-3 ${cardCls} px-4 py-4 text-left hover:shadow-md hover:-translate-y-0.5 hover:border-lime-400/60 transition`}
            >
              <span className={`w-11 h-11 rounded-xl bg-gradient-to-br ${g.tint} text-white flex items-center justify-center shrink-0 shadow-sm`}>
                <Ic className="w-5 h-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-slate-800 dark:text-white">{g.label}</span>
                <span className="block text-xs text-slate-500 dark:text-slate-400">{g.what}</span>
              </span>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-lime-600 group-hover:translate-x-0.5 transition shrink-0" />
            </button>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-[1.35fr_1fr] gap-4 items-start">
        <div className={`${cardCls} overflow-hidden min-w-0`}>
          <div className="px-4 py-3 border-b border-slate-100 dark:border-white/10 flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-lime-500/12 text-lime-600 flex items-center justify-center shrink-0"><Lightbulb className="w-4 h-4" /></span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-800 dark:text-white">Suggested for you</p>
              <p className="text-[11px] text-slate-400">Based on your website this week · do the first one today</p>
            </div>
          </div>
          <ol className="p-2 space-y-1">
            {shown.map((s, i) => {
              const Ic = s.icon;
              const cls = "shrink-0 inline-flex items-center gap-1 rounded-lg admin-grad px-3 py-1.5 text-xs font-bold hover:opacity-90";
              return (
                <li key={s.title} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 rounded-xl px-2.5 py-2.5 hover:bg-slate-50 dark:hover:bg-white/5">
                  <div className="flex items-start gap-2.5 flex-1 min-w-0">
                    <span className="relative w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
                      <Ic className="w-4 h-4" />
                      <span className="absolute -top-1 -left-1 w-4 h-4 rounded-full admin-grad text-[9px] font-bold flex items-center justify-center">{i + 1}</span>
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[13px] font-semibold text-slate-800 dark:text-slate-100">{s.title}</span>
                      <span className="block text-xs text-slate-500 dark:text-slate-400">{s.why}</span>
                    </span>
                  </div>
                  <div className="pl-10 sm:pl-0">
                    {"offer" in s ? (
                      <button type="button" onClick={() => onOffer(s.offer)} className={cls}>{s.cta} <ArrowRight className="w-3 h-3" /></button>
                    ) : "go" in s ? (
                      <button type="button" onClick={() => onGo(s.go, s.kind)} className={cls}>{s.cta} <ArrowRight className="w-3 h-3" /></button>
                    ) : (
                      <a href={s.href} target={s.external ? "_blank" : undefined} rel={s.external ? "noreferrer" : undefined} className={cls}>
                        {s.cta} {s.external ? <ExternalLink className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
                      </a>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
          {sugs.length > 4 && (
            <button type="button" onClick={() => setAll((v) => !v)} className="w-full border-t border-slate-100 dark:border-white/10 px-4 py-2.5 text-xs font-semibold text-lime-700 dark:text-lime-400 hover:bg-slate-50 dark:hover:bg-white/5 inline-flex items-center justify-center gap-1">
              {all ? "Show fewer" : `Show ${sugs.length - 4} more idea${sugs.length - 4 === 1 ? "" : "s"}`}
              <ChevronDown className={`w-3.5 h-3.5 transition ${all ? "rotate-180" : ""}`} />
            </button>
          )}
        </div>

        <div className="space-y-4 min-w-0">
          <div className={`${cardCls} overflow-hidden`}>
            <div className="px-4 py-3 border-b border-slate-100 dark:border-white/10 flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-pink-500 text-white flex items-center justify-center shrink-0"><CalendarDays className="w-4 h-4" /></span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-800 dark:text-white">Coming up</p>
                <p className="text-[11px] text-slate-400">Plan your offer 1–2 weeks before</p>
              </div>
            </div>
            {occasions.length === 0 ? (
              <p className="p-4 text-xs text-slate-500">No festivals in our list right now — try a &quot;weekend special&quot; offer instead.</p>
            ) : (
              <ul className="divide-y divide-slate-100 dark:divide-white/10">
                {occasions.map((o) => (
                  <li key={o.name + o.date} className="p-3.5 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-bold text-slate-800 dark:text-white min-w-0">{o.name}</p>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${o.ongoing || o.daysAway <= 7 ? "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300" : "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300"}`}>{when(o)}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {o.ongoing ? `Season started ${shortDate(o.date)}` : shortDate(o.date)}
                      {o.approx && " · approx. date, check your local calendar"}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300">💡 {o.idea}</p>
                    <div className="flex flex-wrap gap-1.5">
                      <button type="button" onClick={() => onOffer(o.offer)} className="inline-flex items-center gap-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white px-2.5 py-1.5 text-[11px] font-bold"><Gift className="w-3 h-3" /> Use as offer</button>
                      <button type="button" onClick={() => onPost(o.offer)} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-600 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:border-lime-400"><FileText className="w-3 h-3" /> Write a post</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={`${cardCls} p-3.5`}>
            <p className="text-sm font-bold text-slate-800 dark:text-white mb-2.5">This week at a glance</p>
            <div className="grid grid-cols-2 gap-2">
              {stats.map((s) => {
                const Ic = s.icon;
                return (
                  <div key={s.label} className="rounded-xl bg-slate-50 dark:bg-white/5 p-2.5 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-5 h-5 rounded-md bg-gradient-to-br ${s.tint} text-white flex items-center justify-center shrink-0`}><Ic className="w-3 h-3" /></span>
                      <p className="text-[11px] font-semibold text-slate-500 truncate">{s.label}</p>
                    </div>
                    <p className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">{s.value}</p>
                    <p className="text-[10px] text-slate-400 truncate">{s.hint}</p>
                  </div>
                );
              })}
            </div>
            <details className="mt-3 group">
              <summary className="cursor-pointer list-none text-xs font-semibold text-lime-700 dark:text-lime-400 inline-flex items-center gap-1">
                Which pages do people visit? <ChevronDown className="w-3.5 h-3.5 group-open:rotate-180 transition" />
              </summary>
              {topPages.length === 0 ? (
                <p className="pt-2 text-xs text-slate-400">No visits recorded yet — share your link on WhatsApp to get the first ones.</p>
              ) : (
                <ul className="pt-2 space-y-1.5">
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
              <a href="/admin/analytics" className="mt-2 inline-block text-[11px] font-semibold text-lime-700 dark:text-lime-400 hover:underline">Full analytics →</a>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Posts ────────────────────────────────────────────────────────────────────

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

const KINDS: { id: PostKind; label: string }[] = [
  { id: "all", label: "All" }, { id: "wa", label: "WhatsApp" }, { id: "ig", label: "Instagram" }, { id: "fb", label: "Facebook" }, { id: "review", label: "Google review" },
];

function PostsTab({
  siteUrl, bizName, sector, services, ideas, occasions, kind, setKind, offer, setOffer, reviewLink,
}: {
  siteUrl: string; bizName: string; sector: string; services: string[]; ideas: SectorIdeas; occasions: UpcomingOccasion[];
  kind: PostKind; setKind: (k: PostKind) => void; offer: string; setOffer: (s: string) => void; reviewLink: string;
}) {
  const [service, setService] = useState(services[0] ?? "");
  const what = service || sector || "our services";
  const tag = (s: string) => "#" + s.replace(/[^a-z0-9]/gi, "");
  const tags = [tag(bizName), sector && tag(sector), service && tag(service)].filter(Boolean).join(" ");
  const offerIdeas = Array.from(new Set([...ideas.offers, ...occasions.map((o) => o.offer)]));

  const posts: { id: Exclude<PostKind, "all">; label: string; icon: typeof MessageCircle; tint: string; text: string; tip: string; share?: string }[] = [
    {
      id: "wa", label: "WhatsApp message / Status", icon: MessageCircle, tint: "from-emerald-500 to-green-600",
      tip: "Keep it short (3–4 lines). Send to 20–30 contacts a day, not hundreds at once.",
      text: `Hello! 👋 This is ${bizName}.\n\n${offer ? `🎉 ${offer} on ${what}!\n\n` : ""}See our services, photos and prices here 👉 ${siteUrl}\n\nReply to this message to book or ask anything.`,
    },
    {
      id: "ig", label: "Instagram caption", icon: Camera, tint: "from-fuchsia-500 to-amber-400",
      tip: "Post 3 times a week with a real photo or 15-second reel. Put your link in your bio.",
      text: `✨ ${offer ? `${offer} — ` : ""}${what} at ${bizName}!\n\nTrusted by customers who want it done right. DM us or tap the link in bio to book.\n\n🔗 ${siteUrl}\n\n${tags}`,
    },
    {
      id: "fb", label: "Facebook post", icon: ThumbsUp, tint: "from-blue-600 to-blue-500",
      tip: "Also share it in local Facebook groups for your area (follow each group's rules).",
      text: `${bizName}${sector ? ` — your local ${sector.toLowerCase()} expert` : ""}\n\n${offer ? `🎁 ${offer} on ${what}. ` : ""}Visit our website to see everything we offer and send an enquiry in seconds:\n${siteUrl}`,
      share: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl)}`,
    },
    {
      id: "review", label: "Google review request", icon: Star, tint: "from-amber-500 to-orange-500",
      tip: "Ask within a day of the service, while the customer is happy. Ask in person first, then send this.",
      text: `Hi! Thank you for choosing ${bizName} 🙏\n\nIf you were happy with us, could you leave a quick Google review? It really helps a small business like ours.\n\n${
        reviewLink ? `Tap here to review: ${reviewLink}` : `Search "${bizName}" on Google Maps and tap "Write a review".`
      } Thank you!`,
    },
  ];
  const visible = kind === "all" ? posts : posts.filter((p) => p.id === kind);

  return (
    <div className="space-y-4 max-w-4xl">
      <ToolIntro
        icon={FileText}
        title={kind === "review" ? "Get Google reviews" : "Ready-made posts"}
        what={kind === "review"
          ? "Send this message to happy customers — more reviews bring more trust and more calls from Google Maps."
          : "Pick a post, then tap Copy or Send. Your business name and website link are already filled in."}
        tips={[
          "Best time to post: 12–2 pm or 7–9 pm, when people scroll the most.",
          "Add a real photo of your work — it gets far more replies than text alone.",
          kind === "review" && !reviewLink ? "Add your Google review link in Integrations so customers land on the review box directly." : "Change the offer below — every post updates instantly.",
        ]}
      />

      <div className={`${cardCls} p-4 space-y-3`}>
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="block">
            <span className={labelCls}>What do you want to promote?</span>
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
            <span className={labelCls}>Offer (optional — leave empty for a simple post)</span>
            <input value={offer} onChange={(e) => setOffer(e.target.value)} placeholder="Free first visit" className={fieldCls} />
          </label>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-slate-500 mb-1.5">💡 Offer ideas — tap to use</p>
          <div className="flex flex-wrap gap-1.5">
            {offerIdeas.map((o) => <Chip key={o} active={offer === o} onClick={() => setOffer(o)}>{o}</Chip>)}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Post type">
        {KINDS.map((k) => <Chip key={k.id} active={kind === k.id} onClick={() => setKind(k.id)}>{k.label}</Chip>)}
      </div>

      <div className={`grid gap-3 ${visible.length > 1 ? "md:grid-cols-2" : ""}`}>
        {visible.map((p) => {
          const Ic = p.icon;
          const onSend = p.id === "review" ? markReviewAsked : undefined;
          return (
            <div key={p.id} className={`${cardCls} flex flex-col overflow-hidden`}>
              <div className="px-4 py-3 flex items-center gap-2.5 border-b border-slate-100 dark:border-white/10">
                <span className={`w-8 h-8 rounded-xl bg-gradient-to-br ${p.tint} text-white flex items-center justify-center shrink-0`}><Ic className="w-4 h-4" /></span>
                <p className="text-sm font-bold text-slate-800 dark:text-white">{p.label}</p>
              </div>
              <p className="flex-1 px-4 py-3 text-[13px] leading-relaxed text-slate-600 dark:text-slate-300 whitespace-pre-wrap break-words">{p.text}</p>
              <p className="mx-4 mb-3 flex items-start gap-1.5 rounded-lg bg-amber-50 dark:bg-amber-500/10 px-2.5 py-2 text-[11px] text-amber-800 dark:text-amber-200">
                <Lightbulb className="w-3.5 h-3.5 shrink-0 mt-px" /> {p.tip}
              </p>
              <div className="px-4 pb-4 flex flex-wrap gap-2">
                <CopyBtn text={p.text} label="Copy text" onCopy={onSend} />
                {(p.id === "wa" || p.id === "review") && (
                  <a href={`https://wa.me/?text=${encodeURIComponent(p.text)}`} onClick={onSend} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 text-xs font-bold">
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

      <div className={`${cardCls} p-4`}>
        <p className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2"><Sparkles className="w-4 h-4 text-lime-600" /> What else can I post{sector ? ` as a ${sector.toLowerCase()} business` : ""}?</p>
        <p className="text-xs text-slate-500 mt-0.5 mb-3">No idea what to post this week? Pick one — take a photo and use the caption above.</p>
        <ul className="grid sm:grid-cols-2 gap-2">
          {ideas.posts.map((i) => (
            <li key={i} className="flex items-start gap-2 rounded-xl bg-slate-50 dark:bg-white/5 px-3 py-2 text-xs text-slate-700 dark:text-slate-200">
              <Camera className="w-3.5 h-3.5 text-fuchsia-500 shrink-0 mt-px" /> {i}
            </li>
          ))}
          {occasions.map((o) => (
            <li key={o.name} className="flex items-start gap-2 rounded-xl bg-amber-50 dark:bg-amber-500/10 px-3 py-2 text-xs text-slate-700 dark:text-slate-200">
              <PartyPopper className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-px" /> <span><b>{o.name}</b> ({when(o).toLowerCase()}): {o.idea}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── Share & QR ───────────────────────────────────────────────────────────────

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
    { label: "X / Twitter", icon: Share2, href: `https://twitter.com/intent/tweet?url=${enc}&text=${text}`, cls: "bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600" },
    { label: "Email", icon: Mail, href: `mailto:?subject=${encodeURIComponent(bizName)}&body=${text}`, cls: "bg-slate-500 hover:bg-slate-600" },
  ];

  const copyForInstagram = () => {
    navigator.clipboard?.writeText(plain);
    setIgCopied(true);
    setTimeout(() => setIgCopied(false), 1500);
  };

  return (
    <div className="space-y-3">
      <ToolIntro
        icon={Share2}
        title="Get more enquiries"
        what="Share your website link and QR code everywhere — every share is a free chance to get an enquiry."
        tips={[
          "Print the QR code on bills, visiting cards and your shop counter.",
          "Put your link in your Instagram bio, Google profile and WhatsApp Business 'About'.",
          "Ask 5 friends or family to forward your link to their contacts.",
        ]}
      />
      <Panel title="Share your website" icon={Share2} hint="Step 1 · copy your link or tap an app">
        <div className="flex flex-wrap items-center gap-2">
          <code className="flex-1 min-w-[160px] rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs truncate text-slate-800 dark:text-slate-100">{siteUrl}</code>
          <CopyBtn text={siteUrl} label="Copy" />
          <a href={siteUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
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
        <p className="text-[11px] text-slate-400">Instagram has no web share link — we copy your message so you can paste it in a Story or your bio.</p>
      </Panel>

      <Panel title="Website QR code" icon={QrCode} hint="Step 2 · print it where customers can see it">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {qr ? <img src={qr} alt="QR code" className="w-36 h-36 rounded-xl border border-slate-200 dark:border-slate-700 bg-white" /> : <div className="w-36 h-36 rounded-xl bg-slate-100 dark:bg-white/5 animate-pulse" />}
          <div className="text-xs text-slate-500 dark:text-slate-400 space-y-2 text-center sm:text-left">
            <p>Customers scan it with their phone camera to open your website instantly.</p>
            <p>💡 Good places: shop counter, bills, visiting cards, delivery bags, flyers.</p>
            <a href={qr || undefined} download="website-qr.png" className="admin-grad inline-flex items-center gap-1.5 rounded-xl text-xs font-bold px-4 py-2 hover:opacity-90">
              <Download className="w-3.5 h-3.5" /> Download QR
            </a>
          </div>
        </div>
      </Panel>

      <details className={`${cardCls} max-w-2xl group`}>
        <summary className="cursor-pointer list-none px-4 py-3 flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-500 flex items-center justify-center shrink-0"><Link2 className="w-4 h-4" /></span>
          <span className="flex-1 min-w-0">
            <span className="block text-sm font-semibold text-slate-800 dark:text-white">Advanced: tracked link</span>
            <span className="block text-[11px] text-slate-400">Know which post or flyer brought each visitor (optional)</span>
          </span>
          <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition" />
        </summary>
        <div className="border-t border-slate-100 dark:border-white/10 p-4 space-y-3">
          <UtmBuilder siteUrl={siteUrl} />
        </div>
      </details>
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
    { label: "Flyer / poster", src: "flyer", med: "print" },
  ];

  return (
    <>
      <p className="text-xs text-slate-500 dark:text-slate-400">1. Pick where you&apos;ll share it · 2. Name it (e.g. diwali_offer) · 3. Copy. Your Analytics will show visits from this link separately.</p>
      <div className="flex flex-wrap gap-1.5">
        {presets.map((p) => <Chip key={p.label} active={src === p.src} onClick={() => { setSrc(p.src); setMed(p.med); }}>{p.label}</Chip>)}
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <label className="block sm:col-span-2"><span className={labelCls}>Page to open</span><input value={base} onChange={(e) => setBase(e.target.value)} className={fieldCls} /></label>
        <label className="block"><span className={labelCls}>Where you share it (source)</span><input value={src} onChange={(e) => setSrc(e.target.value)} placeholder="facebook, google" className={fieldCls} /></label>
        <label className="block"><span className={labelCls}>Type (medium)</span><input value={med} onChange={(e) => setMed(e.target.value)} placeholder="cpc, social" className={fieldCls} /></label>
        <label className="block sm:col-span-2"><span className={labelCls}>Campaign name</span><input value={camp} onChange={(e) => setCamp(e.target.value)} className={fieldCls} /></label>
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
    </>
  );
}

// ─── Offer banner ─────────────────────────────────────────────────────────────

function PromoTab({
  announcement, onSaved, canEdit = true, prefill, ideas, occasions,
}: {
  announcement: Announcement; onSaved: () => void; canEdit?: boolean; prefill?: string; ideas: SectorIdeas; occasions: UpcomingOccasion[];
}) {
  const [state, action, pending] = useActionState(async (prev: MktState, fd: FormData) => {
    const next = await savePromo(prev, fd);
    if (next.ok) onSaved();
    return next;
  }, init);
  const [text, setText] = useState(prefill ?? announcement.text);
  const [show, setShow] = useState(prefill ? true : announcement.show);
  const offerIdeas = Array.from(new Set([...occasions.map((o) => o.offer), ...ideas.offers]));
  const intro = (
    <ToolIntro
      icon={Megaphone}
      title="Run an offer"
      what="A coloured strip at the top of every page of your website — perfect for a discount or an announcement."
      tips={[
        "Keep it short — under 60 characters reads well on phones.",
        "Add a deadline like \"this week only\" — it makes people act now.",
        "Link it to /contact so visitors can enquire in one tap.",
      ]}
    />
  );

  if (!canEdit) {
    return (
      <div className="space-y-3">
        {intro}
        <Panel title="Offer banner" icon={Megaphone} hint="Owner / admin only">
          <p className="text-xs text-slate-500">Only owners and admins can change the public offer banner. Ask your owner to turn one on.</p>
          {announcement.show && announcement.text && (
            <div className="rounded-xl bg-slate-900 text-white text-center text-xs font-semibold px-3 py-2.5">{announcement.text}</div>
          )}
        </Panel>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {intro}
      <Panel title="Your offer banner" icon={Megaphone} hint={announcement.show && announcement.text ? "Live on your website now" : "Not showing on your website yet"}>
        {prefill && (
          <p className="flex items-start gap-1.5 rounded-xl bg-lime-50 dark:bg-lime-500/10 px-3 py-2 text-xs text-lime-800 dark:text-lime-200">
            <Sparkles className="w-3.5 h-3.5 shrink-0 mt-px" /> We filled in an offer idea for you. Edit it if you like, then tap <b>Save &amp; apply</b>.
          </p>
        )}
        <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
          {show && text ? (
            <div className="bg-slate-900 text-white text-center text-xs font-semibold px-3 py-2.5 break-words">{text}</div>
          ) : (
            <div className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-center text-xs px-3 py-2.5">Banner is off — pick an idea below or type your own</div>
          )}
        </div>
        <div>
          <p className="text-[11px] font-semibold text-slate-500 mb-1.5">💡 Offer ideas — tap to fill</p>
          <div className="flex flex-wrap gap-1.5">
            {offerIdeas.map((o) => <Chip key={o} active={text === o} onClick={() => { setText(o); setShow(true); }}>{o}</Chip>)}
          </div>
        </div>
        <form action={action} className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            <input type="checkbox" name="show" checked={show} onChange={(e) => setShow(e.target.checked)} className="rounded w-4 h-4" />
            Show this banner on my website
          </label>
          <label className="block">
            <span className={labelCls}>Banner text <span className={text.length > 60 ? "text-amber-600" : ""}>· {text.length}/60</span></span>
            <input name="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Diwali offer — 20% off this week!" className={fieldCls} />
          </label>
          <label className="block">
            <span className={labelCls}>Where should it go when clicked? (optional — /contact works well)</span>
            <input name="link" defaultValue={announcement.link} placeholder="/contact or https://…" className={fieldCls} />
          </label>
          <Msg s={state} />
          <button disabled={pending} className="admin-grad w-full rounded-xl text-sm font-bold py-2.5 shadow-md shadow-blue-600/20 hover:opacity-90 disabled:opacity-60">
            {pending ? "Saving…" : "Save & apply"}
          </button>
          <p className="text-[11px] text-slate-400 text-center">Next step: share the same offer on WhatsApp from the Posts tab.</p>
        </form>
      </Panel>
    </div>
  );
}

// ─── Message customers ────────────────────────────────────────────────────────

function BlastTab({
  leads, bizName, canBlast = true, siteUrl, reviewLink, offer, occasion, onGo,
}: {
  leads: Lead[]; bizName: string; canBlast?: boolean; siteUrl: string; reviewLink: string; offer: string;
  occasion?: UpcomingOccasion; onGo: (id: TabId, kind?: PostKind) => void;
}) {
  const [state, action, pending] = useActionState(sendEmailBlast, init);
  const templates: { label: string; subject: string; body: string }[] = [
    { label: "🎁 Share an offer", subject: offer, body: `Hello! This is ${bizName}.\n\n${offer}\n\nDetails here: ${siteUrl}\nReply to book.` },
    ...(occasion ? [{ label: `🎉 ${occasion.name} wishes`, subject: `${occasion.name} wishes from ${bizName}`, body: `Wishing you and your family a very happy ${occasion.name}! 🎉\n\n${occasion.offer}\n\n— ${bizName}\n${siteUrl}` }] : []),
    { label: "👋 Follow up", subject: `Still need help? — ${bizName}`, body: `Hello! This is ${bizName}. You had enquired with us recently — do you still need help? Just reply here and we'll call you back.` },
    { label: "⭐ Ask for a review", subject: `A small favour from ${bizName}`, body: `Thank you for choosing ${bizName}! 🙏 Could you leave us a quick Google review? ${reviewLink || `Search "${bizName}" on Google Maps.`}` },
  ];
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [waMsg, setWaMsg] = useState(templates[0].body);
  const [q, setQ] = useState("");
  const withEmail = leads.filter((l) => l.email).length;
  const withPhone = useMemo(() => {
    const list = leads.filter((l) => l.phone);
    const qq = q.trim().toLowerCase();
    if (!qq) return list;
    return list.filter((l) => (l.name || "").toLowerCase().includes(qq) || l.phone.includes(qq));
  }, [leads, q]);
  const pick = (t: (typeof templates)[number]) => { setWaMsg(t.body); setSubject(t.subject); setBody(t.body); };

  const intro = (
    <ToolIntro
      icon={Send}
      title="Message my customers"
      what="Send an offer or greeting to people who already enquired on your website."
      tips={[
        "Keep WhatsApp messages short — 3 to 4 lines.",
        "Say who you are in the first line so people don't ignore it.",
        "Don't message the same person more than once a week.",
      ]}
    />
  );

  if (leads.length === 0) {
    return (
      <div className="space-y-3">
        {intro}
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-white/15 bg-gradient-to-br from-lime-50/60 to-violet-50/60 dark:from-lime-500/[0.05] dark:to-violet-500/[0.05] p-8 text-center max-w-2xl">
          <span className="admin-grad inline-flex w-14 h-14 rounded-2xl items-center justify-center mb-4 shadow-lg shadow-blue-600/20"><Inbox className="w-6 h-6" /></span>
          <p className="text-base font-bold text-slate-800 dark:text-white">No customers to message yet</p>
          <p className="text-sm text-slate-500 mt-1 mb-4 max-w-sm mx-auto">When someone fills the enquiry form on your website, they show up here. First step: share your website so people can find you.</p>
          <div className="flex flex-wrap justify-center gap-2">
            <button type="button" onClick={() => onGo("posts", "wa")} className="admin-grad inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold hover:opacity-90"><MessageCircle className="w-4 h-4" /> Share on WhatsApp</button>
            <button type="button" onClick={() => onGo("share")} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-600 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200"><QrCode className="w-4 h-4" /> Get my QR code</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {intro}
      <div className={`${cardCls} p-4 max-w-2xl`}>
        <p className="text-[11px] font-semibold text-slate-500 mb-1.5">💡 Start from a ready message — fills both WhatsApp and email below</p>
        <div className="flex flex-wrap gap-1.5">
          {templates.map((t) => <Chip key={t.label} active={waMsg === t.body} onClick={() => pick(t)}>{t.label}</Chip>)}
        </div>
      </div>
      <Panel title="WhatsApp — one by one" icon={MessageCircle} hint={`${withPhone.length} customer(s) with a phone number · tap a name to open the chat`}>
        <textarea value={waMsg} onChange={(e) => setWaMsg(e.target.value)} rows={4} className={fieldCls} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or phone…" className={fieldCls} />
        {withPhone.length === 0 ? (
          <p className="text-xs text-slate-400">{q ? "No matching customers — try another name." : "None of your enquiries have a phone number yet. Ask for it in your contact form."}</p>
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
                <span className="truncate"><b className="text-slate-800 dark:text-slate-100">{l.name || "Customer"}</b> <span className="text-slate-400">{l.phone}</span></span>
                <MessageCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              </a>
            ))}
          </div>
        )}
      </Panel>
      <Panel title="Email everyone at once" icon={Mail} hint={canBlast ? `${withEmail} customer(s) with an email` : "Owner / admin only"}>
        {!canBlast ? (
          <p className="text-xs text-slate-500">Only owners and admins can send emails to all customers.</p>
        ) : withEmail === 0 ? (
          <p className="text-xs text-slate-500">None of your enquiries have an email yet — use WhatsApp above instead.</p>
        ) : (
          <form action={action} className="space-y-3">
            <label className="block"><span className={labelCls}>Subject</span><input name="subject" required value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Special offer just for you!" className={fieldCls} /></label>
            <label className="block">
              <span className={labelCls}>Message</span>
              <textarea name="body" required rows={5} value={body} onChange={(e) => setBody(e.target.value)} placeholder={`Hello,\n\nWe have a special offer…\n\nRegards,\n${bizName}`} className={fieldCls} />
            </label>
            <Msg s={state} />
            <button disabled={pending} className="admin-grad w-full inline-flex items-center justify-center gap-2 rounded-xl text-sm font-bold py-2.5 shadow-md shadow-blue-600/20 hover:opacity-90 disabled:opacity-60">
              <Send className="w-4 h-4" /> {pending ? "Sending…" : `Send to ${withEmail} customer${withEmail === 1 ? "" : "s"}`}
            </button>
          </form>
        )}
      </Panel>
    </div>
  );
}
