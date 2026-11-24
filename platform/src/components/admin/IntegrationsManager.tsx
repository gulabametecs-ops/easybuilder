"use client";

import { useMemo, useState, useTransition } from "react";
import {
  BadgeCheck, BarChart3, Bot, Briefcase, CalendarCheck, Check, CheckCircle2, ChevronDown, ClipboardPaste, CreditCard,
  ExternalLink, Flame, Link as LinkIcon, Mail, Megaphone, MessageCircle, MessagesSquare, MousePointerClick, Puzzle,
  QrCode, Search, Sparkles, Star, Tags, Target, Wallet, X, XCircle, type LucideIcon,
} from "lucide-react";
import {
  BENEFIT, COPY_HINT, FREE_IDS, HOW_TO, INTEGRATIONS, INTEGRATION_CATEGORIES, PROVIDER_URL, fieldError, integrationStatus, recommendedFor,
  smartExtract, type IntegrationCategory, type IntegrationDef, type IntegrationStatus, type IntegrationsConfig,
} from "@/lib/integrations";
import { saveIntegration, toggleIntegration, disconnectIntegration, type IntegrationResult } from "@/lib/actions/integrations";
import { ImageInput } from "./ImageInput";
import { fieldCls, labelCls } from "./AdminWorkspace";

const ICONS: Record<string, LucideIcon> = {
  BadgeCheck, BarChart3, Bot, Briefcase, CalendarCheck, CreditCard, Flame, Link: LinkIcon, Mail, Megaphone,
  MessageCircle, MessagesSquare, MousePointerClick, QrCode, Star, Tags, Target, Wallet,
};

type PaymentsView = { razorpayKeyId: string; upiId: string; upiQrImage: string };
type Flash = IntegrationResult & { link?: string };

const CAT_BLURB: Record<IntegrationCategory, string> = {
  payments: "Get paid online — UPI, cards and payment links.",
  chat: "Talk to visitors live and answer questions fast.",
  analytics: "Know who visits and measure your ads.",
  booking: "Let customers book a slot themselves.",
  reviews: "Collect more Google reviews.",
  verification: "Prove you own your site to Google, Bing & Meta.",
  marketing: "Grow your email list.",
};

const STATUS: Record<IntegrationStatus, { label: string; cls: string }> = {
  connected: { label: "Connected", cls: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300" },
  off: { label: "Off", cls: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400" },
  setup: { label: "Needs setup", cls: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300" },
  none: { label: "Not connected", cls: "text-slate-400" },
};

// Dark glyph on light brand colours (Mailchimp yellow etc.), white otherwise.
function onColor(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const lum = 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255);
  return lum > 170 ? "#111827" : "#ffffff";
}

function Tile({ def, size = "w-11 h-11" }: { def: IntegrationDef; size?: string }) {
  const Icon = ICONS[def.icon] ?? Puzzle;
  return (
    <span className={`${size} shrink-0 rounded-xl grid place-items-center shadow-sm`} style={{ background: def.color, color: onColor(def.color) }}>
      <Icon className="w-5 h-5" />
    </span>
  );
}

function ago(iso?: string) {
  if (!iso) return "";
  const s = Math.max(0, (Date.now() - Date.parse(iso)) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function IntegrationsManager({
  integrations, legacy, payments, hasRazorpaySecret, readOnly, demo, sector, siteUrl,
}: {
  integrations: IntegrationsConfig;
  legacy: string[];
  payments: PaymentsView;
  hasRazorpaySecret: boolean;
  readOnly: boolean;
  demo: boolean;
  sector: { category: string; name: string };
  siteUrl: string;
}) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<IntegrationCategory | "all" | "connected">("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [flash, setFlash] = useState<Flash | null>(null);
  const [pending, start] = useTransition();

  const statusOf = (d: IntegrationDef) =>
    integrationStatus(d, integrations, payments, { hasRazorpaySecret, legacy: legacy.includes(d.id) });
  const live = (d: IntegrationDef) => statusOf(d) !== "none";
  const connectedCount = INTEGRATIONS.filter(live).length;
  const recommended = recommendedFor(sector.category).map((id) => INTEGRATIONS.find((d) => d.id === id)!).filter(Boolean);
  const recIds = new Set(recommended.map((d) => d.id));
  const recDone = recommended.filter(live).length;
  const recPct = recommended.length ? Math.round((recDone / recommended.length) * 100) : 0;

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return INTEGRATIONS.filter((d) =>
      (cat === "all" || (cat === "connected" ? integrationStatus(d, integrations, payments) !== "none" : d.category === cat)) &&
      (!q || `${d.name} ${d.description} ${d.category}`.toLowerCase().includes(q)),
    );
  }, [query, cat, integrations, payments]);

  const run = (fn: () => Promise<IntegrationResult>, opts: { after?: () => void; link?: boolean } = {}) =>
    start(async () => {
      const res = await fn();
      setFlash({ ...res, link: res.ok && opts.link ? siteUrl : undefined });
      if (res.ok) opts.after?.();
      setTimeout(() => setFlash(null), 6000);
    });

  const open = openId ? INTEGRATIONS.find((d) => d.id === openId) ?? null : null;
  const tabs: { id: typeof cat; label: string; count?: number }[] = [
    { id: "all", label: "All", count: INTEGRATIONS.length },
    { id: "connected", label: "Connected", count: connectedCount },
    ...INTEGRATION_CATEGORIES.map((c) => ({ ...c, count: INTEGRATIONS.filter((d) => d.category === c.id).length })),
  ];

  const card = (d: IntegrationDef) => {
            const st = statusOf(d);
            const entry = integrations[d.id];
            const togglable = (st === "connected" || st === "off") && !legacy.includes(d.id);
            const isOnNow = st === "connected";
            return (
              <div key={d.id} className="group relative rounded-2xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                <button type="button" onClick={() => setOpenId(d.id)} className="absolute inset-0 rounded-2xl" aria-label={`Configure ${d.name}`} />
                <div className="flex items-start gap-3">
                  <Tile def={d} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">{d.name}</p>
                    <p className="flex flex-wrap items-center gap-1 mt-0.5">
                      {recIds.has(d.id) && <span className="rounded-full bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300 px-1.5 py-px text-[10px] font-bold">★ For you</span>}
                      {FREE_IDS.has(d.id) && <span className="rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300 px-1.5 py-px text-[10px] font-bold">Free</span>}
                      {!recIds.has(d.id) && !FREE_IDS.has(d.id) && <span className="text-[11px] uppercase tracking-wide text-slate-400">{INTEGRATION_CATEGORIES.find((c) => c.id === d.category)?.label}</span>}
                    </p>
                  </div>
                  {togglable && (
                    <button
                      type="button"
                      role="switch"
                      aria-checked={isOnNow}
                      aria-label={isOnNow ? `Turn off ${d.name}` : `Turn on ${d.name}`}
                      disabled={readOnly || pending}
                      onClick={() => run(() => toggleIntegration(d.id, !isOnNow))}
                      className={`relative z-10 w-10 h-6 rounded-full transition-colors disabled:opacity-50 ${isOnNow ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${isOnNow ? "translate-x-4" : ""}`} />
                    </button>
                  )}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 line-clamp-2 min-h-[2.5rem]">{BENEFIT[d.id] ?? d.description}</p>
                <div className="mt-4 flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 min-w-0">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold shrink-0 ${STATUS[st].cls} ${st === "none" ? "px-0" : ""}`}>
                      {st === "connected" && <Check className="w-3 h-3" />} {STATUS[st].label}
                    </span>
                    {entry?.updatedAt && st !== "none" && <span className="text-[11px] text-slate-400 truncate">· {ago(entry.updatedAt)}</span>}
                  </span>
                  <span className="text-xs font-semibold text-lime-600 dark:text-lime-400 group-hover:underline shrink-0">{st === "none" ? "Connect" : "Manage"} →</span>
                </div>
              </div>
            );
  };

  return (
    <div className="space-y-6">
      {/* Header + summary */}
      <div className="rounded-2xl bg-gradient-to-br from-[#0b1020] via-[#1e2a6b] to-[#4c1d95] text-white p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-violet-400/20 blur-2xl" />
        <div className="relative flex flex-col lg:flex-row lg:items-end gap-5 justify-between">
          <div>
            <p className="text-xs font-semibold tracking-widest text-sky-300 flex items-center gap-1.5"><Puzzle className="w-3.5 h-3.5" /> INTEGRATIONS</p>
            <h1 className="text-2xl sm:text-3xl font-bold mt-2">Connect your favourite tools</h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">Paste a link or code from the provider — we pick out what&apos;s needed and it goes live on your website.</p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-white/10 ring-1 ring-white/15 px-4 py-3 lg:order-last">
            <span className="relative w-12 h-12 shrink-0 rounded-full grid place-items-center" style={{ background: `conic-gradient(#a3e635 ${recPct * 3.6}deg, rgba(255,255,255,.15) 0)` }}>
              <span className="absolute inset-1 rounded-full bg-[#1e2a6b]" />
              <span className="relative text-xs font-bold">{recPct}%</span>
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold">Setup for {sector.name}</span>
              <span className="block text-xs text-slate-300">{recDone} of {recommended.length} recommended tools connected</span>
            </span>
          </div>
          <label className="relative block w-full lg:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search integrations…"
              className="w-full rounded-xl bg-white/10 border border-white/15 pl-9 pr-3 py-2.5 text-sm placeholder:text-slate-400 outline-none focus:bg-white/15 focus:border-lime-400"
            />
          </label>
        </div>
        <div className="relative mt-6 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-white text-slate-900 text-sm font-bold px-3 py-1">{connectedCount} connected</span>
          {INTEGRATION_CATEGORIES.map((c) => {
            const n = INTEGRATIONS.filter((d) => d.category === c.id && live(d)).length;
            return (
              <button key={c.id} type="button" onClick={() => setCat(c.id)}
                className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${n ? "bg-white/15 ring-white/20 text-white" : "ring-white/10 text-slate-400"} hover:bg-white/20`}>
                {c.label} · {n}
              </button>
            );
          })}
        </div>
      </div>

      {readOnly && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 text-sm px-4 py-3">
          {demo
            ? "Integrations are view-only in the demo — third-party scripts can't be added to demo sites."
            : "Only the owner or an admin can change integrations."}
        </p>
      )}

      {/* Recommended for this sector */}
      {!query && cat === "all" && (
        <section>
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 mb-3">
            <Sparkles className="w-4 h-4 text-amber-500" /> Recommended for {sector.name}
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1 snap-x">
            {recommended.map((d) => {
              const st = statusOf(d);
              return (
                <button key={d.id} type="button" onClick={() => setOpenId(d.id)}
                  className="snap-start shrink-0 w-64 text-left rounded-2xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/60 ring-1 ring-slate-200 dark:ring-slate-800 p-4 hover:ring-sky-300 dark:hover:ring-lime-700 transition">
                  <div className="flex items-center gap-3">
                    <Tile def={d} size="w-9 h-9" />
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">{d.name}</p>
                      <p className={`text-[11px] font-semibold ${st === "none" ? "text-lime-600 dark:text-lime-400" : "text-slate-400"}`}>
                        {st === "none" ? "Connect in 1 minute →" : STATUS[st].label}
                      </p>
                    </div>
                  </div>
                  {BENEFIT[d.id] && <p className="mt-2.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{BENEFIT[d.id]}</p>}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setCat(t.id)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              cat === t.id
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-800"
            }`}
          >
            {t.label} <span className="opacity-60">{t.count}</span>
          </button>
        ))}
      </div>

      {/* Grid */}
      {list.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <Puzzle className="w-8 h-8 mx-auto text-slate-300" />
          <p className="text-sm text-slate-500 mt-2">
            {query ? <>No integrations match “{query}”.</> : cat === "connected" ? "Nothing connected yet — start with a recommended one above." : "Nothing here yet."}
          </p>
          <button type="button" onClick={() => { setQuery(""); setCat("all"); }} className="mt-3 text-sm font-semibold text-lime-600 hover:underline">Show all</button>
        </div>
      ) : (
        cat === "all" && !query ? (
          <div className="space-y-7">
            {/* Categories with a recommended tool come first. */}
            {[...INTEGRATION_CATEGORIES].sort((x, y) => Number(recommended.some((d) => d.category === y.id)) - Number(recommended.some((d) => d.category === x.id))).map((c) => {
              const items = list.filter((d) => d.category === c.id);
              if (!items.length) return null;
              return (
                <section key={c.id}>
                  <div className="flex items-end justify-between gap-3 mb-3">
                    <div>
                      <h2 className="text-base font-bold text-slate-900 dark:text-white">{c.label}</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{CAT_BLURB[c.id]}</p>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400 shrink-0">{items.filter(live).length}/{items.length} on</span>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{items.map(card)}</div>
                </section>
              );
            })}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{list.map(card)}</div>
        )
      )}

      {open && (
        <Drawer
          key={open.id}
          def={open}
          initial={open.storage ? (payments as unknown as Record<string, string>) : integrations[open.id]?.values ?? {}}
          status={statusOf(open)}
          updatedAt={integrations[open.id]?.updatedAt}
          hasRazorpaySecret={hasRazorpaySecret}
          readOnly={readOnly}
          pending={pending}
          siteUrl={siteUrl}
          onClose={() => setOpenId(null)}
          onSave={(values) => run(() => saveIntegration({ id: open.id, values }), { after: () => setOpenId(null), link: true })}
          onDisconnect={() => run(() => disconnectIntegration(open.id), { after: () => setOpenId(null) })}
        />
      )}

      {flash && (
        <div role="status" className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] w-[calc(100%-2rem)] sm:w-auto max-w-md rounded-xl px-4 py-3 text-sm font-medium shadow-2xl flex items-center gap-3 ${flash.ok ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"}`}>
          {flash.ok ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <XCircle className="w-5 h-5 shrink-0" />}
          <span className="flex-1">{flash.message}</span>
          {flash.link && (
            <a href={flash.link} target="_blank" rel="noopener noreferrer" className="shrink-0 rounded-lg bg-white/20 hover:bg-white/30 px-2.5 py-1 text-xs font-semibold inline-flex items-center gap-1">
              Check on my site <ExternalLink className="w-3 h-3" />
            </a>
          )}
          <button type="button" onClick={() => setFlash(null)} aria-label="Dismiss" className="shrink-0 opacity-80 hover:opacity-100"><X className="w-4 h-4" /></button>
        </div>
      )}
    </div>
  );
}

function Drawer({
  def, initial, status, updatedAt, hasRazorpaySecret, readOnly, pending, siteUrl, onClose, onSave, onDisconnect,
}: {
  def: IntegrationDef;
  initial: Record<string, string>;
  status: IntegrationStatus;
  updatedAt?: string;
  hasRazorpaySecret: boolean;
  readOnly: boolean;
  pending: boolean;
  siteUrl: string;
  onClose: () => void;
  onSave: (values: Record<string, string>) => void;
  onDisconnect: () => void;
}) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(def.fields.map((f) => [f.key, f.type === "secret" ? "" : initial[f.key] ?? ""])),
  );
  const [paste, setPaste] = useState("");
  const [manual, setManual] = useState(status !== "none");
  const set = (k: string, v: string) => setValues((s) => ({ ...s, [k]: v }));
  const detected = paste.trim() ? smartExtract(def.id, paste) : {};
  const detectedKeys = Object.keys(detected);
  const isOn = status !== "none";
  const textFields = def.fields.filter((f) => f.type !== "select" && f.type !== "image" && f.type !== "secret");
  // Required fields still invalid after applying what we detected (blocks one-click connect).
  const merged = { ...values, ...detected };
  const missing = def.fields.filter((f) => !f.optional && f.type !== "secret" && fieldError(f, merged[f.key]));
  const needsSecret = def.id === "razorpay" && !hasRazorpaySecret && !values.razorpayKeySecret;

  const onPaste = (text: string) => {
    setPaste(text);
    const found = smartExtract(def.id, text);
    if (Object.keys(found).length) setValues((s) => ({ ...s, ...found }));
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label={def.name}>
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]" />
      <form onSubmit={(e) => { e.preventDefault(); onSave(values); }} className="relative w-full sm:max-w-lg h-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-start gap-3">
          <Tile def={def} size="w-12 h-12" />
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2 flex-wrap">
              {def.name}
              {isOn && <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUS[status].cls}`}>{STATUS[status].label}</span>}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{def.description}</p>
            {updatedAt && <p className="text-[11px] text-slate-400 mt-0.5">Last updated {ago(updatedAt)}</p>}
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {status === "setup" && (
            <p className="text-xs rounded-lg bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200 px-3 py-2">
              {def.id === "razorpay" ? "Add your Key secret to start taking online payments." : "Imported from your SEO settings — press Save to manage it here."}
            </p>
          )}

          {BENEFIT[def.id] && (
            <p className="rounded-xl bg-gradient-to-r from-sky-50 to-violet-50 dark:from-sky-500/10 dark:to-violet-500/10 px-3.5 py-2.5 text-sm text-slate-700 dark:text-slate-200 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" /> <span><b>Why connect:</b> {BENEFIT[def.id]}{FREE_IDS.has(def.id) && " Free to start."}</span>
            </p>
          )}

          {/* 3-step wizard */}
          <ol className="space-y-3">
            <Step n={1} title={`Open ${def.name}`}>
              <a href={PROVIDER_URL[def.id] ?? def.helpUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold shadow-sm hover:opacity-90"
                style={{ background: def.color, color: onColor(def.color) }}>
                Open {def.name} <ExternalLink className="w-3 h-3" />
              </a>
              <a href={def.helpUrl} target="_blank" rel="noopener noreferrer" className="ml-3 text-xs font-medium text-lime-600 dark:text-lime-400 hover:underline">Where do I find this?</a>
            </Step>
            <Step n={2} title="Copy">
              <p className="text-xs text-slate-500 dark:text-slate-400">{COPY_HINT[def.id]}</p>
              {HOW_TO[def.id] && (
                <details className="mt-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 px-3 py-2 group">
                  <summary className="cursor-pointer list-none text-xs font-semibold text-slate-700 dark:text-slate-200 inline-flex items-center gap-1">
                    Step-by-step: how to get this <ChevronDown className="w-3.5 h-3.5 transition group-open:rotate-180" />
                  </summary>
                  <ol className="mt-2 space-y-1.5 list-decimal pl-4 text-xs text-slate-600 dark:text-slate-300">
                    {HOW_TO[def.id].map((h) => <li key={h}>{h}</li>)}
                  </ol>
                </details>
              )}
            </Step>
            <Step n={3} title="Paste here">
              <div className="relative">
                <ClipboardPaste className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <textarea
                  value={paste}
                  onChange={(e) => onPaste(e.target.value)}
                  rows={3}
                  disabled={readOnly}
                  spellCheck={false}
                  placeholder="Paste the link, code snippet or ID — anything works"
                  className={`${fieldCls} pl-9 font-mono text-xs resize-none`}
                />
              </div>
              {paste.trim() && (
                detectedKeys.length ? (
                  <div className="mt-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 px-3 py-2 text-xs text-emerald-800 dark:text-emerald-200 space-y-0.5">
                    {detectedKeys.map((k) => (
                      <p key={k} className="flex items-center gap-1.5 break-all">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        Detected {def.fields.find((f) => f.key === k)?.label}: <b className="font-mono">{detected[k]}</b>
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-xs text-rose-600 flex items-center gap-1.5"><XCircle className="w-3.5 h-3.5" /> Couldn&apos;t find a {def.name} {def.fields[0].label.toLowerCase()} in that. Try copying again, or enter it manually below.</p>
                )
              )}
              {detectedKeys.length > 0 && !missing.length && !needsSecret && !readOnly && (
                <button type="submit" disabled={pending} className="mt-3 w-full rounded-xl admin-grad hover:opacity-90 text-white px-4 py-2.5 text-sm font-semibold disabled:opacity-50 inline-flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" /> {pending ? "Connecting…" : `Connect ${def.name}`}
                </button>
              )}
            </Step>
          </ol>

          {/* Manual fields */}
          <div className="rounded-xl ring-1 ring-slate-200 dark:ring-slate-800">
            <button type="button" onClick={() => setManual((m) => !m)} className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
              {textFields.length === def.fields.length ? "Enter manually" : "Settings"}
              <ChevronDown className={`w-4 h-4 transition-transform ${manual ? "rotate-180" : ""}`} />
            </button>
            {manual && (
              <div className="px-4 pb-4 space-y-4">
                {def.storage === "payments" && (
                  <p className="text-xs rounded-lg bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300 px-3 py-2">
                    Shared with Settings → Payments and used by your Donate / Pay online blocks.
                  </p>
                )}
                {def.fields.map((f) => {
                  const v = values[f.key] ?? "";
                  const err = v.trim() && f.type !== "select" && f.type !== "image" ? fieldError(f, v) : null;
                  const ok = v.trim() && !err && f.type !== "select";
                  return (
                    <label key={f.key} className="block">
                      <span className={labelCls}>
                        {f.label} {f.optional && <span className="font-normal text-slate-400">(optional)</span>}
                      </span>
                      {f.type === "select" ? (
                        <select value={v || f.options![0].value} onChange={(e) => set(f.key, e.target.value)} className={fieldCls} disabled={readOnly}>
                          {f.options!.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                      ) : f.type === "image" ? (
                        <ImageInput value={v} onChange={(u) => set(f.key, u)} aspect="aspect-square" />
                      ) : (
                        <span className="relative block">
                          <input
                            type={f.type === "secret" ? "password" : "text"}
                            value={v}
                            onChange={(e) => set(f.key, e.target.value)}
                            placeholder={f.key === "razorpayKeySecret" && hasRazorpaySecret ? "•••••••• saved — leave blank to keep" : f.placeholder}
                            autoComplete="off"
                            spellCheck={false}
                            disabled={readOnly}
                            aria-invalid={Boolean(err)}
                            className={`${fieldCls} font-mono pr-9 ${err ? "!border-rose-400" : ok ? "!border-emerald-400" : ""}`}
                          />
                          {ok && <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-3 top-1/2 -translate-y-1/2" />}
                          {err && <XCircle className="w-4 h-4 text-rose-500 absolute right-3 top-1/2 -translate-y-1/2" />}
                        </span>
                      )}
                      {err ? <span className="block text-[11px] text-rose-600 mt-1">{err}</span> : f.help && <span className="block text-[11px] text-slate-400 mt-1">{f.help}</span>}
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          <Preview def={def} values={values} />

        </div>

        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
          {isOn && (
            <>
              <button type="button" disabled={readOnly || pending} onClick={() => { if (confirm(`Disconnect ${def.name}? Its settings will be removed.`)) onDisconnect(); }}
                className="rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 disabled:opacity-50">
                Disconnect
              </button>
              <a href={siteUrl} target="_blank" rel="noopener noreferrer" className="rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 inline-flex items-center gap-1">
                Check on my site <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </>
          )}
          <button type="submit" disabled={readOnly || pending} className="ml-auto rounded-xl admin-grad hover:opacity-90 text-white px-5 py-2.5 text-sm font-semibold disabled:opacity-50">
            {pending ? "Saving…" : isOn ? "Save changes" : "Connect"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="w-6 h-6 shrink-0 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold grid place-items-center">{n}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-1.5">{title}</p>
        {children}
      </div>
    </li>
  );
}

/** "How it shows on your site" — a tiny mock, only where there's something visible. */
function Preview({ def, values }: { def: IntegrationDef; values: Record<string, string> }) {
  let body: React.ReactNode = null;
  if (def.category === "chat") {
    body = (
      <div className="absolute right-3 bottom-3 flex items-end gap-2">
        <span className="rounded-xl rounded-br-sm bg-white text-slate-700 text-[11px] px-3 py-2 shadow-md ring-1 ring-black/5">Hi! How can we help? 👋</span>
        <span className="w-10 h-10 rounded-full grid place-items-center text-white shadow-lg" style={{ background: def.color }}><MessageCircle className="w-5 h-5" /></span>
      </div>
    );
  } else if (def.id === "upi") {
    body = (
      <div className="absolute inset-0 grid place-items-center">
        <div className="rounded-xl bg-white p-3 text-center shadow ring-1 ring-black/5">
          <QrCode className="w-14 h-14 mx-auto text-slate-800" />
          <p className="text-[10px] font-mono text-slate-600 mt-1">{values.upiId || "you@upi"}</p>
        </div>
      </div>
    );
  } else if (def.category === "payments") {
    body = (
      <div className="absolute inset-0 grid place-items-center px-6">
        <span className="w-full max-w-[220px] rounded-xl bg-white shadow ring-1 ring-black/5 px-3 py-2.5 flex items-center gap-2 text-xs font-semibold text-slate-800">
          <span className="w-7 h-7 rounded-lg grid place-items-center text-white" style={{ background: def.color }}><CreditCard className="w-4 h-4" /></span>
          {values.label || (def.id === "razorpay" ? "Donate / Pay now" : `Pay with ${def.name.split(" ")[0]}`)}
        </span>
      </div>
    );
  } else if (def.category === "reviews") {
    body = (
      <div className="absolute inset-x-0 bottom-4 grid place-items-center">
        <span className="rounded-full bg-white shadow-md ring-1 ring-black/5 px-4 py-2 text-xs font-semibold text-slate-800 inline-flex items-center gap-1.5">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> Review us on Google
          {values.ratingText && <span className="font-normal text-slate-500">{values.ratingText}</span>}
        </span>
      </div>
    );
  } else if (def.category === "booking") {
    body = values.display === "section" ? (
      <div className="absolute inset-0 grid place-items-center">
        <span className="rounded-full bg-lime-600 text-white px-4 py-2 text-xs font-semibold inline-flex items-center gap-1.5"><CalendarCheck className="w-4 h-4" /> {values.label || "Book a call"}</span>
      </div>
    ) : (
      <span className="absolute right-3 bottom-3 rounded-full bg-lime-600 text-white px-3 py-2 text-[11px] font-semibold shadow-lg inline-flex items-center gap-1.5"><CalendarCheck className="w-4 h-4" /> {values.label || "Book a call"}</span>
    );
  } else if (def.category === "marketing") {
    body = (
      <div className="absolute inset-x-3 bottom-3 rounded-xl bg-white shadow ring-1 ring-black/5 p-2.5 flex items-center gap-2">
        <Mail className="w-4 h-4 text-lime-600 shrink-0" />
        <span className="text-[11px] font-semibold text-slate-800 flex-1 truncate">{values.title || "Join our newsletter"}</span>
        <span className="rounded-full bg-lime-600 text-white px-2.5 py-1 text-[10px] font-semibold">Subscribe</span>
      </div>
    );
  }
  if (!body) {
    return (
      <p className="text-xs text-slate-500 dark:text-slate-400 rounded-lg bg-slate-50 dark:bg-slate-800/60 px-3 py-2">
        {def.category === "verification" ? "Adds an invisible ownership tag to your site's <head> — visitors won't see anything." : "Runs quietly in the background — visitors won't see anything. Not loaded in previews or demos."}
      </p>
    );
  }
  return (
    <div>
      <p className={labelCls}>How it shows on your site</p>
      <div className="relative h-36 rounded-xl overflow-hidden ring-1 ring-slate-200 dark:ring-slate-800 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
        <div className="absolute top-3 left-3 right-3 space-y-1.5" aria-hidden>
          <div className="h-2 w-24 rounded bg-slate-300/80 dark:bg-slate-700" />
          <div className="h-2 w-40 rounded bg-slate-300/60 dark:bg-slate-700/70" />
          <div className="h-2 w-32 rounded bg-slate-300/60 dark:bg-slate-700/70" />
        </div>
        {body}
      </div>
    </div>
  );
}
