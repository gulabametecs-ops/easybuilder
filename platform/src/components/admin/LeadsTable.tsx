"use client";

import { useTransition } from "react";
import { Trash2, Phone, Mail, MapPin } from "lucide-react";
import { updateLeadStatus, deleteLead } from "@/lib/actions/crm";
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
  createdAt: Date;
};

const STATUSES = ["new", "contacted", "converted", "closed"];
const tone: Record<string, "green" | "blue" | "amber" | "slate"> = {
  new: "green",
  contacted: "blue",
  converted: "amber",
  closed: "slate",
};

export function LeadsTable({ leads }: { leads: Lead[] }) {
  const [pending, start] = useTransition();

  return (
    <div className={pending ? "opacity-60 pointer-events-none" : ""}>
      <ul className="divide-y divide-slate-100">
        {leads.map((l) => (
          <li key={l.id} className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-slate-900">{l.name}</p>
                <Badge tone={tone[l.status] ?? "slate"}>{l.status}</Badge>
                <span className="text-xs text-slate-400">{new Date(l.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 mt-1.5">
                <span className="inline-flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{l.phone}</span>
                {l.email && <span className="inline-flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{l.email}</span>}
                {l.location && <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{l.location}</span>}
              </div>
              {l.service && <p className="text-sm text-slate-600 mt-1">Service: <b>{l.service}</b></p>}
              {l.message && <p className="text-sm text-slate-500 mt-1">{l.message}</p>}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <select
                defaultValue={l.status}
                onChange={(e) => start(() => updateLeadStatus(l.id, e.target.value))}
                className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm outline-none focus:border-lime-500"
              >
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <a href={`tel:${l.phone}`} className="p-2 rounded-lg bg-lime-100 text-lime-700 hover:bg-lime-200" title="Call"><Phone className="w-4 h-4" /></a>
              <button
                onClick={() => { if (confirm("Delete this lead?")) start(() => deleteLead(l.id)); }}
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
