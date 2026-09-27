"use client";

import {
  FileStack,
  Images,
  Inbox,
  LayoutDashboard,
  Palette,
  Settings,
  Wrench,
} from "lucide-react";
import type { WebsiteBlueprint } from "@/lib/ai/blueprintSchema";
import { blueprintStats } from "@/lib/ai/blueprintPreview";

const NAV = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Pages", icon: FileStack, active: true },
  { label: "Services", icon: Wrench },
  { label: "Gallery", icon: Images },
  { label: "Leads", icon: Inbox },
  { label: "Appearance", icon: Palette },
  { label: "Settings", icon: Settings },
];

export function AiAdminPreview({ blueprint }: { blueprint: WebsiteBlueprint }) {
  const stats = blueprintStats(blueprint);

  return (
    <div className="flex min-h-[520px] h-full bg-slate-100 text-slate-800 text-left">
      <aside className="w-44 shrink-0 bg-slate-900 text-slate-300 p-3 hidden sm:flex flex-col gap-1">
        <p className="text-[11px] font-bold text-white truncate px-2 py-2">{blueprint.website.name}</p>
        {NAV.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className={`flex items-center gap-2 rounded-lg px-2 py-2 text-xs font-medium ${
                item.active ? "bg-lime-500 text-slate-950" : "text-slate-400"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {item.label}
            </div>
          );
        })}
      </aside>
      <div className="flex-1 p-4 sm:p-5 overflow-auto">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Preview only</p>
        <h3 className="text-lg font-bold text-slate-900 mt-1">Pages & sections</h3>
        <p className="text-xs text-slate-500 mt-1 mb-4">
          This is a quick preview. Click <strong>Open admin</strong> to use the real editor — pages, images and content are all editable there.
        </p>
        <div className="space-y-2">
          {stats.pages.map((p, i) => (
            <div key={p.slug} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2.5">
              <div>
                <p className="text-sm font-semibold text-slate-900">{p.name}</p>
                <p className="text-[11px] text-slate-500">
                  /{p.slug === "home" ? "" : p.slug} · {p.sectionCount} sections
                </p>
              </div>
              <span className="text-[11px] font-semibold text-lime-700 bg-lime-50 px-2 py-1 rounded-md">
                {i === 0 ? "Home" : "Edit"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
