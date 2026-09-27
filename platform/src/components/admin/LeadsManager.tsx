"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import {
  Inbox, Search, Phone, Mail, MapPin, Trash2, MessageCircle, Download,
  Filter,
} from "lucide-react";
import { updateLeadStatus, deleteLead } from "@/lib/actions/crm";
import { AdminWorkspace } from "./AdminWorkspace";
import { Badge } from "./ui";

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

const STATUSES = ["all", "new", "contacted", "converted", "closed"] as const;
const tone: Record<string, "green" | "blue" | "amber" | "slate"> = {
  new: "green",
  contacted: "blue",
  converted: "amber",
  closed: "slate",
};

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
  a.download = "leads.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export function LeadsManager({ leads: initial }: { leads: Lead[] }) {
  const [pending, start] = useTransition();
  const [leads, setLeads] = useState(initial);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");

  useEffect(() => setLeads(initial), [initial]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return leads.filter((l) => {
      if (status !== "all" && l.status !== status) return false;
      if (!needle) return true;
      return [l.name, l.phone, l.email, l.service, l.location, l.message]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [leads, q, status]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: leads.length };
    for (const s of STATUSES) {
      if (s === "all") continue;
      c[s] = leads.filter((l) => l.status === s).length;
    }
    return c;
  }, [leads]);

  return (
    <div className={pending ? "opacity-70 pointer-events-none" : ""}>
      <AdminWorkspace
        title="Leads"
        titleIcon={<Inbox className="w-4 h-4 text-lime-600 shrink-0" />}
        tabs={[{ id: "inbox", label: "Inbox", icon: Inbox }]}
        tab="inbox"
        onTabChange={() => {}}
        toolbar={
          <button
            type="button"
            onClick={() => downloadCsv(filtered)}
            className="inline-flex items-center gap-1 rounded-md border border-slate-200 dark:border-slate-600 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-lime-400"
          >
            <Download className="w-3.5 h-3.5" /> CSV
          </button>
        }
        headerExtra={
          <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search name, phone, email…"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-600 dark:bg-slate-800 text-slate-900 dark:text-slate-100 pl-8 pr-3 py-1.5 text-sm outline-none focus:border-lime-500"
              />
            </div>
            <div className="flex flex-wrap gap-1">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold capitalize ${
                    status === s
                      ? "bg-slate-900 text-white dark:bg-lime-500 dark:text-slate-900"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  <Filter className="w-3 h-3" /> {s} · {counts[s] ?? 0}
                </button>
              ))}
            </div>
          </div>
        }
      >
        {leads.length === 0 ? (
          <div className="text-center py-14 px-4">
            <span className="inline-flex w-12 h-12 rounded-2xl bg-lime-500/15 text-lime-600 items-center justify-center mb-3">
              <Inbox className="w-6 h-6" />
            </span>
            <p className="text-sm font-semibold text-slate-800 dark:text-white">No leads yet</p>
            <p className="text-xs text-slate-400 mt-1">Quote & contact form submissions will show up here.</p>
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-xs text-slate-400 py-10">No matches</p>
        ) : (
          <div className="space-y-2">
            {filtered.map((l) => (
              <div
                key={l.id}
                className="rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{l.name}</p>
                      <Badge tone={tone[l.status] ?? "slate"}>{l.status}</Badge>
                      <span className="text-[10px] text-slate-400">
                        {new Date(l.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                      <span className="inline-flex items-center gap-1"><Phone className="w-3 h-3" />{l.phone}</span>
                      {l.email && <span className="inline-flex items-center gap-1"><Mail className="w-3 h-3" />{l.email}</span>}
                      {l.location && <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" />{l.location}</span>}
                    </div>
                    {l.service && <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">Service: <b>{l.service}</b></p>}
                    {l.message && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{l.message}</p>}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 mt-2.5 pt-2 border-t border-slate-50 dark:border-slate-800">
                  <select
                    value={l.status}
                    onChange={(e) => {
                      const next = e.target.value;
                      setLeads((prev) => prev.map((x) => (x.id === l.id ? { ...x, status: next } : x)));
                      start(() => updateLeadStatus(l.id, next));
                    }}
                    className="rounded-lg border border-slate-200 dark:border-slate-600 dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-2 py-1.5 text-xs outline-none focus:border-lime-500"
                  >
                    {STATUSES.filter((s) => s !== "all").map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <a href={`tel:${l.phone}`} className="p-1.5 rounded-lg bg-lime-500/15 text-lime-700 dark:text-lime-400" title="Call">
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                  {l.phone && (
                    <a
                      href={`https://wa.me/${l.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hi ${l.name}, regarding your enquiry…`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-600"
                      title="WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {l.email && (
                    <a href={`mailto:${l.email}`} className="p-1.5 rounded-lg bg-sky-500/15 text-sky-600" title="Email">
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (!confirm("Delete this lead?")) return;
                      setLeads((prev) => prev.filter((x) => x.id !== l.id));
                      start(() => deleteLead(l.id));
                    }}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 ml-auto"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminWorkspace>
    </div>
  );
}
