"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { HeartHandshake, Search, Trash2, Phone, Mail, MessageCircle } from "lucide-react";
import { updateVolunteerStatus, deleteVolunteer } from "@/lib/actions/volunteers";
import { AdminWorkspace } from "./AdminWorkspace";
import { EmptyState, btnSecondary } from "./ui";

type Row = {
  id: string;
  name: string;
  phone: string;
  email: string;
  age: string;
  gender: string;
  city: string;
  state: string;
  interest: string;
  availability: string;
  mode: string;
  experience: string;
  status: string;
  createdAt: Date | string;
};

const STATUSES = ["all", "new", "contacted", "accepted", "declined"] as const;

export function VolunteersManager({ volunteers: initial }: { volunteers: Row[] }) {
  const [pending, start] = useTransition();
  const [rows, setRows] = useState(initial);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  // Re-sync when the server sends fresh data (adjust state during render, not in an effect).
  const [prevInitial, setPrevInitial] = useState(initial);
  if (prevInitial !== initial) {
    setPrevInitial(initial);
    setRows(initial);
  }

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (status !== "all" && r.status !== status) return false;
      if (!needle) return true;
      return [r.name, r.phone, r.email, r.city, r.interest, r.experience].join(" ").toLowerCase().includes(needle);
    });
  }, [rows, q, status]);
  const count = (s: string) => (s === "all" ? rows.length : rows.filter((r) => r.status === s).length);

  return (
    <div className={pending ? "opacity-70 pointer-events-none" : ""}>
      <AdminWorkspace
        title="Volunteers"
        subtitle="Applications from your website's volunteer form."
        titleIcon={<HeartHandshake className="w-4 h-4 text-lime-600 shrink-0" />}
        tabs={[{ id: "inbox", label: "Applications", icon: HeartHandshake }]}
        tab="inbox"
        onTabChange={() => {}}
        headerExtra={
          <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, phone, city…" className="w-full rounded-lg border border-slate-200 dark:border-slate-600 dark:bg-slate-800 text-slate-900 dark:text-slate-100 pl-8 pr-3 py-1.5 text-sm outline-none focus:border-lime-500" />
            </div>
            <div className="flex flex-wrap gap-1">
              {STATUSES.map((s) => (
                <button key={s} type="button" onClick={() => setStatus(s)} className={`rounded-full px-2.5 py-1 text-[10px] font-bold capitalize ${status === s ? "bg-slate-900 text-white dark:bg-lime-500 dark:text-slate-900" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"}`}>
                  {s} · {count(s)}
                </button>
              ))}
            </div>
          </div>
        }
      >
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {filtered.map((r) => (
            <li key={r.id} className="px-4 py-3 space-y-1">
              <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-white">{r.name}</p>
                  <p className="text-xs text-slate-500">{[r.phone, r.email].filter(Boolean).join(" · ")}</p>
                  <p className="text-xs text-slate-500 mt-1">{[[r.city, r.state].filter(Boolean).join(", "), r.interest || "Any interest", r.availability, r.mode].filter(Boolean).join(" · ")}</p>
                  {r.experience && <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{r.experience}</p>}
                </div>
                <select
                  value={r.status}
                  onChange={(e) => {
                    const status = e.target.value;
                    setRows((prev) => prev.map((x) => x.id === r.id ? { ...x, status } : x));
                    start(async () => { await updateVolunteerStatus(r.id, status); });
                  }}
                  className="rounded-md border border-slate-200 dark:border-slate-600 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs px-2 py-1"
                >
                  <option value="new">new</option>
                  <option value="contacted">contacted</option>
                  <option value="accepted">accepted</option>
                  <option value="declined">declined</option>
                </select>
                <button type="button" className="p-1.5 text-slate-400 hover:text-red-500" onClick={() => { if (confirm("Delete this volunteer application?")) start(async () => { await deleteVolunteer(r.id); }); }} aria-label="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[10px] text-slate-400 mr-auto">{new Date(r.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" })}</span>
                {r.phone && <a href={`tel:${r.phone}`} className="p-1.5 rounded-lg bg-lime-500/15 text-lime-700 dark:text-lime-400" title="Call"><Phone className="w-3.5 h-3.5" /></a>}
                {r.phone && <a href={`https://wa.me/${r.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-600" title="WhatsApp"><MessageCircle className="w-3.5 h-3.5" /></a>}
                {r.email && <a href={`mailto:${r.email}`} className="p-1.5 rounded-lg bg-sky-500/15 text-sky-600" title="Email"><Mail className="w-3.5 h-3.5" /></a>}
              </div>
            </li>
          ))}
          {filtered.length === 0 && (
            <li>
              {rows.length === 0 ? (
                <EmptyState icon={<HeartHandshake />} title="No volunteer applications yet" hint="Submissions from a Volunteer form section on your website show up here. Add one from Pages & Sections." action={<Link href="/admin/pages" className={btnSecondary}>Go to Pages</Link>} />
              ) : (
                <p className="text-center text-xs text-slate-400 py-10">No matches</p>
              )}
            </li>
          )}
        </ul>
      </AdminWorkspace>
    </div>
  );
}
