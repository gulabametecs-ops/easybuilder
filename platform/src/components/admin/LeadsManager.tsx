"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import {
  Inbox, Search, Phone, Mail, MapPin, Trash2, MessageCircle, Download,
  Sparkles, PhoneCall, Trophy, CalendarRange, X, Tag, Clock, ArrowUpDown,
} from "lucide-react";
import { updateLeadStatus, deleteLead } from "@/lib/actions/crm";
import { PageHeader, StatCard, Card, EmptyState, btnSecondary } from "./ui";

type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  location: string;
  message: string;
  status: string;
  createdAt: Date | string;
};

const STATUSES = ["new", "contacted", "converted", "closed"] as const;
const FILTERS = ["all", ...STATUSES] as const;
const chip: Record<string, string> = {
  new: "bg-lime-500/12 text-lime-700 dark:text-lime-300 border-lime-500/25",
  contacted: "bg-amber-500/12 text-amber-700 dark:text-amber-300 border-amber-500/25",
  converted: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 border-emerald-500/25",
  closed: "bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/20",
};
const AVATARS = [
  "from-blue-500 to-violet-500", "from-emerald-500 to-teal-500", "from-amber-500 to-orange-500",
  "from-rose-500 to-pink-500", "from-sky-500 to-cyan-500", "from-violet-500 to-fuchsia-500",
];
const DAY = 86_400_000;

const initialsOf = (name: string) =>
  name.split(/\s+/).filter(Boolean).map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "?";
const avatarOf = (name: string) => AVATARS[[...name].reduce((h, c) => h + c.charCodeAt(0), 0) % AVATARS.length];
const digits = (phone: string) => phone.replace(/[^0-9]/g, "");
const fmtDate = (d: Date | string) =>
  new Date(d).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });

function timeAgo(d: Date | string, now: number) {
  const s = Math.max(0, Math.round((now - new Date(d).getTime()) / 1000));
  if (s < 60) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.round(h / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function downloadCsv(leads: Lead[]) {
  const rows = [
    ["Name", "Phone", "Email", "Service", "Location", "Message", "Status", "Date"],
    ...leads.map((l) => [
      l.name, l.phone, l.email, l.service, l.location, l.message, l.status,
      new Date(l.createdAt).toISOString(),
    ]),
  ];
  const esc = (v: string) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = rows.map((r) => r.map(esc).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function LeadsManager({ leads: initial, bizName }: { leads: Lead[]; bizName: string }) {
  const [pending, start] = useTransition();
  const [leads, setLeads] = useState(initial);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sort, setSort] = useState<"new" | "old" | "name">("new");
  const [openId, setOpenId] = useState<string | null>(null);
  // Fixed at mount so render stays pure; time-ago labels are minute-accurate anyway.
  const [now] = useState(() => Date.now());

  // Re-sync when the server sends fresh data (adjust state during render, not in an effect).
  const [prevInitial, setPrevInitial] = useState(initial);
  if (prevInitial !== initial) {
    setPrevInitial(initial);
    setLeads(initial);
  }

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const fromT = from ? new Date(`${from}T00:00:00`).getTime() : -Infinity;
    const toT = to ? new Date(`${to}T23:59:59.999`).getTime() : Infinity;
    const list = leads.filter((l) => {
      if (status !== "all" && l.status !== status) return false;
      const t = new Date(l.createdAt).getTime();
      if (t < fromT || t > toT) return false;
      if (!needle) return true;
      return [l.name, l.phone, l.email, l.service, l.location, l.message]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
    const time = (l: Lead) => new Date(l.createdAt).getTime();
    return list.sort((a, b) =>
      sort === "name" ? a.name.localeCompare(b.name) : sort === "old" ? time(a) - time(b) : time(b) - time(a),
    );
  }, [leads, q, status, from, to, sort]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: leads.length };
    for (const s of STATUSES) c[s] = leads.filter((l) => l.status === s).length;
    return c;
  }, [leads]);
  const thisWeek = leads.filter((l) => now - new Date(l.createdAt).getTime() < 7 * DAY).length;

  const setLeadStatus = (id: string, next: string) => {
    setLeads((prev) => prev.map((x) => (x.id === id ? { ...x, status: next } : x)));
    start(() => updateLeadStatus(id, next));
  };
  const removeLead = (id: string) => {
    if (!confirm("Delete this lead?")) return;
    setLeads((prev) => prev.filter((x) => x.id !== id));
    setOpenId(null);
    start(() => deleteLead(id));
  };

  const open = leads.find((l) => l.id === openId) ?? null;
  const filtersOn = !!(q || from || to || status !== "all");

  return (
    <div className="space-y-5">
      <PageHeader
        title="Leads"
        subtitle="Every enquiry from your website — follow up fast and track each one."
        icon={<Inbox />}
        action={
          <button type="button" onClick={() => downloadCsv(filtered)} disabled={filtered.length === 0} className={btnSecondary}>
            <Download className="w-4 h-4" /> Export CSV
            <span className="text-xs font-medium text-slate-400">({filtered.length})</span>
          </button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard label="Total leads" value={counts.all} icon={<Inbox />} tone="brand" />
        <StatCard label="New" value={counts.new} hint="Waiting for a reply" icon={<Sparkles />} tone="violet" />
        <StatCard label="Contacted" value={counts.contacted} icon={<PhoneCall />} tone="amber" />
        <StatCard label="Converted" value={counts.converted} hint={counts.all ? `${Math.round((counts.converted / counts.all) * 100)}% conversion` : undefined} icon={<Trophy />} tone="green" />
        <div className="col-span-2 sm:col-span-1">
          <StatCard label="This week" value={thisWeek} hint="Last 7 days" icon={<CalendarRange />} tone="sky" />
        </div>
      </div>

      <Card className="overflow-hidden">
        {/* Pipeline tabs */}
        <div className="flex gap-1 p-2 overflow-x-auto border-b border-slate-100 dark:border-white/10">
          {FILTERS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={`shrink-0 inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold capitalize transition ${
                status === s
                  ? "admin-grad shadow-md shadow-blue-600/20"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
              }`}
            >
              {s === "all" ? "All leads" : s}
              <span className={`rounded-full px-1.5 min-w-[1.25rem] text-[11px] leading-5 ${status === s ? "bg-white/25" : "bg-slate-100 dark:bg-white/10"}`}>
                {counts[s] ?? 0}
              </span>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="p-3 grid gap-2 sm:grid-cols-[1fr_auto_auto] border-b border-slate-100 dark:border-white/10">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name, phone, email, service…"
              aria-label="Search leads"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-800 text-slate-900 dark:text-slate-100 pl-9 pr-3 py-2 text-sm outline-none focus:border-lime-500 focus:ring-4 focus:ring-lime-500/15"
            />
          </div>
          <div className="flex items-center gap-1.5 min-w-0">
            <input type="date" value={from} max={to || undefined} onChange={(e) => setFrom(e.target.value)} aria-label="From date" className="min-w-0 flex-1 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-800 text-slate-700 dark:text-slate-100 px-2.5 py-2 text-sm outline-none focus:border-lime-500" />
            <span className="text-slate-400 text-xs">to</span>
            <input type="date" value={to} min={from || undefined} onChange={(e) => setTo(e.target.value)} aria-label="To date" className="min-w-0 flex-1 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-800 text-slate-700 dark:text-slate-100 px-2.5 py-2 text-sm outline-none focus:border-lime-500" />
          </div>
          <label className="relative flex items-center">
            <ArrowUpDown className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none" />
            <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} aria-label="Sort" className="w-full rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-800 text-slate-700 dark:text-slate-100 pl-9 pr-3 py-2 text-sm outline-none focus:border-lime-500">
              <option value="new">Newest first</option>
              <option value="old">Oldest first</option>
              <option value="name">Name A–Z</option>
            </select>
          </label>
        </div>

        {leads.length === 0 ? (
          <EmptyState icon={<Inbox />} title="No leads yet" hint="When visitors fill your contact or quote forms, their enquiries land here instantly." />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Search />}
            title="No leads match"
            hint="Try a different search, status or date range."
            action={filtersOn ? (
              <button type="button" className={btnSecondary} onClick={() => { setQ(""); setFrom(""); setTo(""); setStatus("all"); }}>
                Clear filters
              </button>
            ) : undefined}
          />
        ) : (
          <ul className={`divide-y divide-slate-100 dark:divide-white/5 ${pending ? "opacity-70" : ""}`}>
            {filtered.map((l) => (
              <li key={l.id} className="group flex gap-3 px-3 sm:px-4 py-3.5 hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition">
                <span className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarOf(l.name)} text-white text-sm font-bold flex items-center justify-center shrink-0`}>
                  {initialsOf(l.name)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <button type="button" onClick={() => setOpenId(l.id)} className="font-semibold text-slate-900 dark:text-white hover:text-lime-600 text-left truncate max-w-full">
                      {l.name}
                    </button>
                    {l.status === "new" && <span className="w-1.5 h-1.5 rounded-full bg-lime-500" aria-label="New" />}
                    <span className="text-xs text-slate-400 inline-flex items-center gap-1" title={fmtDate(l.createdAt)} suppressHydrationWarning>
                      <Clock className="w-3 h-3" /> {timeAgo(l.createdAt, now)}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {l.service && <span className="inline-flex items-center gap-1 font-medium text-slate-700 dark:text-slate-200"><Tag className="w-3 h-3 text-lime-600" />{l.service}</span>}
                    {l.location && <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" />{l.location}</span>}
                    <span className="inline-flex items-center gap-1"><Phone className="w-3 h-3" />{l.phone}</span>
                  </div>
                  {l.message && (
                    <button type="button" onClick={() => setOpenId(l.id)} className="block text-left text-sm text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-1 hover:text-slate-700 dark:hover:text-slate-200">
                      “{l.message}”
                    </button>
                  )}
                  <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                    <StatusSelect value={l.status} onChange={(v) => setLeadStatus(l.id, v)} />
                    <Actions lead={l} bizName={bizName} />
                    <button type="button" onClick={() => setOpenId(l.id)} className="text-xs font-semibold text-lime-600 hover:underline px-1.5">
                      Details
                    </button>
                    <button
                      type="button"
                      onClick={() => removeLead(l.id)}
                      className="ml-auto p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                      title="Delete"
                      aria-label={`Delete ${l.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {open && (
        <LeadDrawer
          lead={open}
          bizName={bizName}
          now={now}
          onClose={() => setOpenId(null)}
          onStatus={(v) => setLeadStatus(open.id, v)}
          onDelete={() => removeLead(open.id)}
        />
      )}
    </div>
  );
}

function StatusSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Lead status"
      className={`rounded-full border px-3 py-1 text-xs font-bold capitalize outline-none cursor-pointer focus:ring-4 focus:ring-lime-500/15 ${chip[value] ?? chip.closed}`}
    >
      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
    </select>
  );
}

function Actions({ lead, bizName, big = false }: { lead: Lead; bizName: string; big?: boolean }) {
  const cls = big
    ? "flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold"
    : "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold";
  const greeting = `Hi ${lead.name}, thanks for contacting ${bizName}! ${lead.service ? `About your enquiry for ${lead.service} — ` : ""}how can we help you?`;
  return (
    <>
      {lead.phone && (
        <a href={`tel:${lead.phone}`} className={`${cls} bg-lime-500/12 text-lime-700 dark:text-lime-300 hover:bg-lime-500/20`}>
          <Phone className="w-3.5 h-3.5" /> Call
        </a>
      )}
      {lead.phone && (
        <a
          href={`https://wa.me/${digits(lead.phone)}?text=${encodeURIComponent(greeting)}`}
          target="_blank"
          rel="noreferrer"
          className={`${cls} bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20`}
        >
          <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
        </a>
      )}
      {lead.email && (
        <a
          href={`mailto:${lead.email}?subject=${encodeURIComponent(`Your enquiry with ${bizName}`)}&body=${encodeURIComponent(`${greeting}\n\n`)}`}
          className={`${cls} bg-violet-500/12 text-violet-700 dark:text-violet-300 hover:bg-violet-500/20`}
        >
          <Mail className="w-3.5 h-3.5" /> Email
        </a>
      )}
    </>
  );
}

function LeadDrawer({
  lead, bizName, now, onClose, onStatus, onDelete,
}: {
  lead: Lead; bizName: string; now: number; onClose: () => void; onStatus: (v: string) => void; onDelete: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const rows: [string, string, typeof Phone][] = [
    ["Phone", lead.phone, Phone],
    ["Email", lead.email, Mail],
    ["Service", lead.service, Tag],
    ["Location", lead.location, MapPin],
    ["Received", fmtDate(lead.createdAt), Clock],
  ];

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label={`Lead: ${lead.name}`}>
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" />
      <aside className="absolute right-0 inset-y-0 w-full sm:w-[28rem] bg-white dark:bg-slate-900 shadow-2xl flex flex-col">
        <div className="admin-grad px-5 pt-5 pb-6">
          <div className="flex items-start justify-between gap-3">
            <span className="w-12 h-12 rounded-2xl bg-white/20 text-white text-lg font-bold flex items-center justify-center">
              {initialsOf(lead.name)}
            </span>
            <button type="button" onClick={onClose} aria-label="Close" className="p-2 rounded-xl hover:bg-white/15">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xl font-extrabold mt-3 break-words">{lead.name}</p>
          <p className="text-sm text-white/80" suppressHydrationWarning>Enquiry · {timeAgo(lead.createdAt, now)}</p>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div className="flex gap-2"><Actions lead={lead} bizName={bizName} big /></div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Status</p>
            <StatusSelect value={lead.status} onChange={onStatus} />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Message</p>
            <p className="rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 p-4 text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap break-words">
              {lead.message || <span className="text-slate-400">No message left.</span>}
            </p>
          </div>
          <dl className="rounded-2xl border border-slate-100 dark:border-white/10 divide-y divide-slate-100 dark:divide-white/5">
            {rows.filter(([, v]) => v).map(([k, v, Ic]) => (
              <div key={k} className="flex items-start gap-3 px-4 py-3">
                <Ic className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <dt className="text-xs text-slate-500 w-20 shrink-0 mt-0.5">{k}</dt>
                <dd className="text-sm font-medium text-slate-800 dark:text-slate-100 break-all">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="p-4 border-t border-slate-100 dark:border-white/10">
          <button type="button" onClick={onDelete} className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 dark:border-rose-500/30 text-rose-600 py-2.5 text-sm font-semibold hover:bg-rose-50 dark:hover:bg-rose-500/10">
            <Trash2 className="w-4 h-4" /> Delete lead
          </button>
        </div>
      </aside>
    </div>
  );
}
