"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import {
  CalendarClock, Search, Phone, Mail, Trash2, MessageCircle, Download, Filter, Check,
} from "lucide-react";
import { updateAppointmentStatus, deleteAppointment } from "@/lib/actions/crm";
import { AdminWorkspace } from "./AdminWorkspace";
import { Badge } from "./ui";

type Appt = {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  date: string;
  time: string;
  message: string;
  status: string;
  createdAt: Date | string;
};

const STATUSES = ["all", "pending", "confirmed", "completed", "cancelled"] as const;
const tone: Record<string, "amber" | "green" | "blue" | "red" | "slate"> = {
  pending: "amber",
  confirmed: "green",
  completed: "blue",
  cancelled: "red",
};

function downloadCsv(rows: Appt[]) {
  const data = [
    ["Name", "Phone", "Email", "Service", "Date", "Time", "Message", "Status", "Created"],
    ...rows.map((a) => [
      a.name, a.phone, a.email, a.service, a.date, a.time, a.message, a.status,
      new Date(a.createdAt).toISOString(),
    ]),
  ];
  const esc = (v: string) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = data.map((r) => r.map(esc).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "appointments.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export function AppointmentsManager({ appts: initial }: { appts: Appt[] }) {
  const [pending, start] = useTransition();
  const [appts, setAppts] = useState(initial);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");

  useEffect(() => setAppts(initial), [initial]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return appts.filter((a) => {
      if (status !== "all" && a.status !== status) return false;
      if (!needle) return true;
      return [a.name, a.phone, a.email, a.service, a.date, a.time, a.message]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [appts, q, status]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: appts.length };
    for (const s of STATUSES) {
      if (s === "all") continue;
      c[s] = appts.filter((a) => a.status === s).length;
    }
    return c;
  }, [appts]);

  const setStatusFor = (id: string, next: string) => {
    setAppts((prev) => prev.map((x) => (x.id === id ? { ...x, status: next } : x)));
    start(() => updateAppointmentStatus(id, next));
  };

  return (
    <div className={pending ? "opacity-70 pointer-events-none" : ""}>
      <AdminWorkspace
        title="Appointments"
        titleIcon={<CalendarClock className="w-4 h-4 text-lime-600 shrink-0" />}
        tabs={[{ id: "bookings", label: "Bookings", icon: CalendarClock }]}
        tab="bookings"
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
                placeholder="Search name, date, service…"
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
        {appts.length === 0 ? (
          <div className="text-center py-14 px-4">
            <span className="inline-flex w-12 h-12 rounded-2xl bg-lime-500/15 text-lime-600 items-center justify-center mb-3">
              <CalendarClock className="w-6 h-6" />
            </span>
            <p className="text-sm font-semibold text-slate-800 dark:text-white">No appointments yet</p>
            <p className="text-xs text-slate-400 mt-1">Booking requests from your website appear here.</p>
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-xs text-slate-400 py-10">No matches</p>
        ) : (
          <div className="space-y-2">
            {filtered.map((a) => (
              <div
                key={a.id}
                className="rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-3"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{a.name}</p>
                  <Badge tone={tone[a.status] ?? "amber"}>{a.status}</Badge>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                  <span className="inline-flex items-center gap-1"><Phone className="w-3 h-3" />{a.phone}</span>
                  {(a.date || a.time) && (
                    <span className="inline-flex items-center gap-1">
                      <CalendarClock className="w-3 h-3" />{a.date} {a.time}
                    </span>
                  )}
                  {a.email && <span className="inline-flex items-center gap-1"><Mail className="w-3 h-3" />{a.email}</span>}
                </div>
                {a.service && <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">Service: <b>{a.service}</b></p>}
                {a.message && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{a.message}</p>}

                <div className="flex flex-wrap items-center gap-1.5 mt-2.5 pt-2 border-t border-slate-50 dark:border-slate-800">
                  <select
                    value={a.status}
                    onChange={(e) => setStatusFor(a.id, e.target.value)}
                    className="rounded-lg border border-slate-200 dark:border-slate-600 dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-2 py-1.5 text-xs outline-none focus:border-lime-500"
                  >
                    {STATUSES.filter((s) => s !== "all").map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {a.status === "pending" && (
                    <button
                      type="button"
                      onClick={() => setStatusFor(a.id, "confirmed")}
                      className="inline-flex items-center gap-1 rounded-lg bg-lime-500 text-white text-[10px] font-bold px-2.5 py-1.5 hover:bg-lime-600"
                    >
                      <Check className="w-3 h-3" /> Confirm
                    </button>
                  )}
                  <a href={`tel:${a.phone}`} className="p-1.5 rounded-lg bg-lime-500/15 text-lime-700 dark:text-lime-400" title="Call">
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                  {a.phone && (
                    <a
                      href={`https://wa.me/${a.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hi ${a.name}, confirming your appointment${a.date ? ` on ${a.date}` : ""}${a.time ? ` at ${a.time}` : ""}.`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-600"
                      title="WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {a.email && (
                    <a href={`mailto:${a.email}`} className="p-1.5 rounded-lg bg-sky-500/15 text-sky-600" title="Email">
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (!confirm("Delete this appointment?")) return;
                      setAppts((prev) => prev.filter((x) => x.id !== a.id));
                      start(() => deleteAppointment(a.id));
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
