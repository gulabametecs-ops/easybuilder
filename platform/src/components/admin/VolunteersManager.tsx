"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { HeartHandshake, Search, Trash2 } from "lucide-react";
import { updateVolunteerStatus, deleteVolunteer } from "@/lib/actions/volunteers";
import { AdminWorkspace } from "./AdminWorkspace";
import { Badge } from "./ui";

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
  useEffect(() => setRows(initial), [initial]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (status !== "all" && r.status !== status) return false;
      if (!needle) return true;
      return [r.name, r.phone, r.email, r.city, r.interest, r.experience].join(" ").toLowerCase().includes(needle);
    });
  }, [rows, q, status]);

  return (
    <div className={pending ? "opacity-70 pointer-events-none" : ""}>
      <AdminWorkspace
        title="Volunteers"
        titleIcon={<HeartHandshake className="w-4 h-4 text-lime-600 shrink-0" />}
        tabs={[{ id: "inbox", label: "Applications", icon: HeartHandshake }]}
        tab="inbox"
        onTabChange={() => {}}
        headerExtra={
          <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search volunteers…" className="w-full rounded-lg border border-slate-200 dark:border-slate-600 dark:bg-slate-800 pl-8 pr-3 py-1.5 text-sm outline-none focus:border-lime-500" />
            </div>
            <div className="flex flex-wrap gap-1">
              {STATUSES.map((s) => (
                <button key={s} type="button" onClick={() => setStatus(s)} className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${status === s ? "bg-lime-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600"}`}>
                  {s}
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
                  <p className="text-xs text-slate-500">{r.phone} · {r.email}</p>
                  <p className="text-xs text-slate-500 mt-1">{[r.city, r.state].filter(Boolean).join(", ")} · {r.interest || "Any interest"} · {r.availability} · {r.mode}</p>
                  {r.experience && <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{r.experience}</p>}
                </div>
                <select
                  value={r.status}
                  onChange={(e) => {
                    const status = e.target.value;
                    setRows((prev) => prev.map((x) => x.id === r.id ? { ...x, status } : x));
                    start(async () => { await updateVolunteerStatus(r.id, status); });
                  }}
                  className="rounded-md border border-slate-200 dark:border-slate-600 text-xs px-2 py-1"
                >
                  <option value="new">new</option>
                  <option value="contacted">contacted</option>
                  <option value="accepted">accepted</option>
                  <option value="declined">declined</option>
                </select>
                <button type="button" className="p-1.5 text-slate-400 hover:text-red-500" onClick={() => start(async () => { await deleteVolunteer(r.id); })} aria-label="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <Badge tone="slate">{new Date(r.createdAt).toLocaleString("en-IN")}</Badge>
            </li>
          ))}
          {filtered.length === 0 && <li className="px-4 py-10 text-sm text-slate-500 text-center">No volunteer applications yet.</li>}
        </ul>
      </AdminWorkspace>
    </div>
  );
}
