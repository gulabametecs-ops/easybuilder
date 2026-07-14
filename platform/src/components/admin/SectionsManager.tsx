"use client";

import { useState, useTransition } from "react";
import { ChevronUp, ChevronDown, Eye, EyeOff, Trash2, Plus, Pencil } from "lucide-react";
import { toggleSection, deleteSection, moveSection, addSection } from "@/lib/actions/content";
import { SECTION_META } from "@/lib/sectionDefaults";
import { SectionContentEditor } from "./SectionContentEditor";
import { Card } from "./ui";

type Section = { id: string; type: string; visible: boolean; content: string };

const typeLabel = (t: string) => SECTION_META.find((m) => m.type === t)?.label ?? t;

export function SectionsManager({ pageId, sections }: { pageId: string; sections: Section[] }) {
  const [pending, start] = useTransition();
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  return (
    <div className={pending ? "opacity-70" : ""}>
      <div className="space-y-3">
        {sections.map((s, i) => (
          <Card key={s.id} className="overflow-hidden">
            <div className="flex items-center gap-3 p-4">
              <div className="flex flex-col">
                <button disabled={i === 0} onClick={() => start(() => moveSection(s.id, "up"))} className="text-slate-400 hover:text-slate-700 disabled:opacity-30"><ChevronUp className="w-4 h-4" /></button>
                <button disabled={i === sections.length - 1} onClick={() => start(() => moveSection(s.id, "down"))} className="text-slate-400 hover:text-slate-700 disabled:opacity-30"><ChevronDown className="w-4 h-4" /></button>
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-900">{typeLabel(s.type)}</p>
                <p className="text-xs text-slate-400">{s.visible ? "Visible" : "Hidden"}</p>
              </div>
              <button onClick={() => setEditing(editing === s.id ? null : s.id)} className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200" title="Edit content"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => start(() => toggleSection(s.id))} className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200" title="Show/hide">
                {s.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button onClick={() => { if (confirm("Delete this section?")) start(() => deleteSection(s.id)); }} className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100" title="Delete"><Trash2 className="w-4 h-4" /></button>
            </div>
            {editing === s.id && (
              <div className="border-t border-slate-100 p-4 bg-slate-50">
                <SectionContentEditor id={s.id} type={s.type} content={s.content} />
              </div>
            )}
          </Card>
        ))}
      </div>

      <div className="mt-4">
        {!adding ? (
          <button onClick={() => setAdding(true)} className="inline-flex items-center gap-2 rounded-lg border-2 border-dashed border-slate-300 text-slate-600 px-4 py-3 text-sm font-medium hover:border-lime-500 hover:text-lime-600 w-full justify-center">
            <Plus className="w-4 h-4" /> Add a section
          </button>
        ) : (
          <Card className="p-4">
            <p className="font-medium text-slate-900 mb-3">Choose a section to add</p>
            <div className="grid sm:grid-cols-2 gap-2">
              {SECTION_META.map((m) => (
                <button key={m.type} onClick={() => { setAdding(false); start(() => addSection(pageId, m.type)); }}
                  className="text-left p-3 rounded-lg border border-slate-200 hover:border-lime-500 hover:bg-lime-50">
                  <p className="font-medium text-slate-800 text-sm">{m.label}</p>
                  <p className="text-xs text-slate-400">{m.description}</p>
                </button>
              ))}
            </div>
            <button onClick={() => setAdding(false)} className="text-sm text-slate-400 mt-3 hover:text-slate-600">Cancel</button>
          </Card>
        )}
      </div>
    </div>
  );
}
