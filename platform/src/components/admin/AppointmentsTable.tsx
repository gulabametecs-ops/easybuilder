"use client";

import { useTransition } from "react";
import { Trash2, Phone, CalendarClock } from "lucide-react";
import { updateAppointmentStatus, deleteAppointment } from "@/lib/actions/crm";
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
  createdAt: Date;
};

const STATUSES = ["pending", "confirmed", "completed", "cancelled"];
const tone: Record<string, "amber" | "green" | "blue" | "red"> = {
  pending: "amber",
  confirmed: "green",
  completed: "blue",
  cancelled: "red",
};

export function AppointmentsTable({ appts }: { appts: Appt[] }) {
  const [pending, start] = useTransition();

  return (
    <div className={pending ? "opacity-60 pointer-events-none" : ""}>
      <ul className="divide-y divide-slate-100">
        {appts.map((a) => (
          <li key={a.id} className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-slate-900">{a.name}</p>
                <Badge tone={tone[a.status] ?? "amber"}>{a.status}</Badge>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 mt-1.5">
                <span className="inline-flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{a.phone}</span>
                {(a.date || a.time) && (
                  <span className="inline-flex items-center gap-1"><CalendarClock className="w-3.5 h-3.5" />{a.date} {a.time}</span>
                )}
              </div>
              {a.service && <p className="text-sm text-slate-600 mt-1">Service: <b>{a.service}</b></p>}
              {a.message && <p className="text-sm text-slate-500 mt-1">{a.message}</p>}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <select
                defaultValue={a.status}
                onChange={(e) => start(() => updateAppointmentStatus(a.id, e.target.value))}
                className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm outline-none focus:border-lime-500"
              >
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <button
                onClick={() => { if (confirm("Delete this appointment?")) start(() => deleteAppointment(a.id)); }}
                className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
