"use client";

import { useState, useRef, useTransition, useActionState } from "react";
import { useRouter } from "next/navigation";
import {
  Upload, Trash2, Eye, EyeOff, FileSpreadsheet, Download, CheckCircle2, AlertCircle,
  Users, FileText, Settings2, ScrollText,
} from "lucide-react";
import { uploadResults, deleteExam, toggleExamPublish, saveResultConfig, type ResultState } from "@/lib/actions/results";
import { AdminSplitShell } from "./AdminSplitShell";
import { RESULT_LAYOUTS, resolveResultLayout, type MarksheetLayout, type ResultConfig } from "@/lib/results";

type Exam = { id: string; name: string; published: boolean; verifyDob: boolean; count: number };
const init: ResultState = { ok: false, message: "" };
const inputCls =
  "w-full rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800 px-3 py-2 text-sm outline-none focus:border-lime-500";
const lbl = "block text-[10px] font-semibold text-slate-400 mb-1";

const SAMPLE_CSV = `Roll No,Name,Class,Section,Father Name,DOB,English:100,Maths:100,Science:100,Social:100,Hindi:100
101,Aarav Sharma,10,A,Rajesh Sharma,14-05-2010,92,88,95,90,85
102,Diya Patel,10,A,Amit Patel,02-08-2010,85,79,88,91,80
103,Kabir Khan,10,A,Imran Khan,21-11-2010,70,65,74,68,72`;

type Tab = "upload" | "exams" | "template";

export function ResultsManager({ exams, config, resultUrl }: { exams: Exam[]; config: ResultConfig; resultUrl: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [tab, setTab] = useState<Tab>("upload");
  const [csv, setCsv] = useState("");
  const [fileName, setFileName] = useState("");
  const [state, action, uploading] = useActionState(uploadResults, init);
  const [tick, setTick] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const bump = () => { setTick((t) => t + 1); router.refresh(); };

  const onFile = (f: File | undefined) => {
    if (!f) return;
    setFileName(f.name);
    const reader = new FileReader();
    reader.onload = () => setCsv(String(reader.result || ""));
    reader.readAsText(f);
  };

  const downloadSample = () => {
    const blob = new Blob([SAMPLE_CSV], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "results-sample.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs: { id: Tab; label: string; icon: typeof Upload }[] = [
    { id: "upload", label: "Upload", icon: Upload },
    { id: "exams", label: "Exams", icon: FileText },
    { id: "template", label: "Template", icon: Settings2 },
  ];

  return (
    <div className={pending ? "opacity-70 pointer-events-none" : ""}>
      <AdminSplitShell
        title="Results"
        titleIcon={<ScrollText className="w-4 h-4 text-lime-600 shrink-0" />}
        countLabel={`${exams.length} exams`}
        previewSrc={`/result?__edit=1&_r=${tick}`}
        previewKey={`r:${tick}`}
        headerExtra={
          <div className="grid grid-cols-3 gap-1 p-2 border-b border-slate-100 dark:border-slate-800">
            {tabs.map((t) => {
              const Ic = t.icon;
              const on = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`flex flex-col items-center gap-1 rounded-xl px-1 py-2 transition ${
                    on ? "bg-slate-900 text-white dark:bg-lime-500 dark:text-slate-900" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Ic className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold">{t.label}</span>
                </button>
              );
            })}
          </div>
        }
      >
        {tab === "upload" && (
          <div className="p-3 space-y-4">
            <p className="text-xs text-slate-500">Upload CSV marks — students check by roll number on the live result page.</p>
            <form
              action={async (fd) => {
                await action(fd);
                bump();
              }}
              className="space-y-3"
            >
              <input type="hidden" name="csv" value={csv} />
              <label className="block">
                <span className={lbl}>Exam name</span>
                <input name="examName" required placeholder="e.g. Annual Examination 2026" className={inputCls} />
              </label>
              <div>
                <span className={lbl}>CSV file</span>
                <button type="button" onClick={() => fileRef.current?.click()} className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:border-lime-500">
                  <FileSpreadsheet className="w-4 h-4 text-lime-600" />
                  {fileName || "Choose CSV"}
                </button>
                <input ref={fileRef} type="file" accept=".csv,text/csv" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
              </div>
              <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                <input type="checkbox" name="replace" defaultChecked className="rounded" /> Replace existing for this exam
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                <input type="checkbox" name="verifyDob" className="rounded" /> Require DOB to view
              </label>
              {state.message && (
                <p className={`text-xs flex items-center gap-1.5 ${state.ok ? "text-green-600" : "text-red-600"}`}>
                  {state.ok ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                  {state.message}
                </p>
              )}
              <button type="submit" disabled={uploading || !csv} className="w-full rounded-xl bg-lime-500 text-white text-sm font-bold py-2.5 hover:bg-lime-600 disabled:opacity-60">
                {uploading ? "Uploading…" : "Upload results"}
              </button>
            </form>
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-3 text-xs text-slate-500 space-y-2">
              <p className="font-semibold text-slate-700 dark:text-slate-200">CSV format</p>
              <p>Roll No, Name, Class… then subjects as <span className="font-mono">Subject:Max</span> (e.g. Maths:100).</p>
              <button type="button" onClick={downloadSample} className="inline-flex items-center gap-1.5 font-semibold text-lime-600 hover:underline">
                <Download className="w-3.5 h-3.5" /> Sample CSV
              </button>
            </div>
          </div>
        )}

        {tab === "exams" && (
          <div className="p-2 space-y-1.5">
            {exams.length === 0 ? (
              <div className="text-center py-12 px-4">
                <p className="text-sm font-semibold text-slate-800 dark:text-white">No exams yet</p>
                <p className="text-xs text-slate-400 mt-1 mb-3">Upload a CSV to create your first exam.</p>
                <button type="button" onClick={() => setTab("upload")} className="text-sm font-semibold text-lime-600 hover:underline">Go to Upload</button>
              </div>
            ) : (
              exams.map((e) => (
                <div key={e.id} className="rounded-xl border border-slate-100 dark:border-slate-700/80 p-3 flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {e.name} {!e.published && <span className="text-[10px] text-slate-400">(hidden)</span>}
                    </p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Users className="w-3 h-3" /> {e.count} students {e.verifyDob && "· DOB"}
                    </p>
                  </div>
                  <button type="button" onClick={() => start(async () => { await toggleExamPublish(e.id); bump(); })} className="p-1.5 rounded-md text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" title="Show/hide">
                    {e.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!confirm(`Delete "${e.name}" and all results?`)) return;
                      start(async () => { await deleteExam(e.id); bump(); });
                    }}
                    className="p-1.5 rounded-md text-red-400 hover:bg-red-50"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
            <a href={resultUrl} target="_blank" rel="noreferrer" className="block text-center text-xs font-semibold text-lime-600 hover:underline pt-2">
              Open public result page ↗
            </a>
          </div>
        )}

        {tab === "template" && (
          <div className="p-3">
            <p className="text-xs text-slate-500 mb-3">Pick a ready marksheet design, then tweak labels &amp; fields.</p>
            <form
              action={async (fd) => {
                await saveResultConfig(fd);
                bump();
              }}
              className="space-y-4"
            >
              <LayoutPicker value={resolveResultLayout(config.layout)} />

              <div className="space-y-3 pt-1 border-t border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Details</p>
                <label className="block"><span className={lbl}>Heading</span><input name="heading" defaultValue={config.heading} placeholder="REPORT CARD" className={inputCls} /></label>
                <label className="block"><span className={lbl}>Affiliation</span><input name="affiliation" defaultValue={config.affiliation} placeholder="Affiliated to CBSE…" className={inputCls} /></label>
                <label className="block"><span className={lbl}>Principal name</span><input name="principalName" defaultValue={config.principalName} className={inputCls} /></label>
                <label className="block"><span className={lbl}>Class teacher label</span><input name="classTeacher" defaultValue={config.classTeacher} className={inputCls} /></label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="block"><span className={lbl}>Pass %</span><input name="passPercent" type="number" min={0} max={100} defaultValue={config.passPercent} className={inputCls} /></label>
                  <label className="block"><span className={lbl}>Accent colour</span><input name="accent" defaultValue={config.accent} placeholder="#1e40af" className={inputCls} /></label>
                </div>
                <label className="block"><span className={lbl}>Watermark</span><input name="watermark" defaultValue={config.watermark} className={inputCls} /></label>
                <label className="block"><span className={lbl}>Footer note</span><input name="footerNote" defaultValue={config.footerNote} className={inputCls} /></label>
              </div>

              <div className="grid grid-cols-1 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Show on marksheet</p>
                {([
                  ["showFather", "Show father's name", config.showFather],
                  ["showMother", "Show mother's name", config.showMother],
                  ["showDob", "Show date of birth", config.showDob],
                  ["showSection", "Show section", config.showSection],
                  ["showPerSubjectGrade", "Grade per subject", config.showPerSubjectGrade],
                  ["showRemarks", "Show remarks", config.showRemarks],
                  ["showGradeLegend", "Grading legend", config.showGradeLegend],
                  ["verifyByDob", "Require DOB (default)", config.verifyByDob],
                ] as const).map(([name, label, val]) => (
                  <label key={name} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                    <input type="checkbox" name={name} defaultChecked={val} className="rounded" /> {label}
                  </label>
                ))}
              </div>
              <button type="submit" className="w-full rounded-xl bg-lime-500 text-white text-sm font-bold py-2.5 hover:bg-lime-600">Save template</button>
            </form>
          </div>
        )}
      </AdminSplitShell>
    </div>
  );
}

function LayoutThumb({ id, accent }: { id: MarksheetLayout; accent: string }) {
  if (id === "formal") {
    return (
      <div className="h-full w-full p-1.5 bg-white flex flex-col" style={{ border: `2px double ${accent}` }}>
        <div className="h-1.5 w-8 mx-auto rounded-sm mb-1" style={{ background: accent }} />
        <div className="h-1 w-10 mx-auto bg-slate-200 mb-1" />
        <div className="flex-1 border border-slate-200 mt-0.5 space-y-0.5 p-0.5">
          <div className="h-0.5 bg-slate-200" /><div className="h-0.5 bg-slate-100" /><div className="h-0.5 bg-slate-200" />
        </div>
      </div>
    );
  }
  if (id === "modern") {
    return (
      <div className="h-full w-full bg-white flex">
        <div className="w-1.5 shrink-0" style={{ background: accent }} />
        <div className="flex-1 p-1.5 space-y-1">
          <div className="h-1.5 w-10 rounded" style={{ background: accent }} />
          <div className="h-5 rounded bg-slate-100" />
          <div className="h-4 rounded bg-slate-50 border border-slate-100" />
        </div>
      </div>
    );
  }
  if (id === "compact") {
    return (
      <div className="h-full w-full bg-white flex flex-col">
        <div className="h-3 flex items-center px-1 gap-1" style={{ background: `${accent}22` }}>
          <div className="w-2 h-2 rounded-full" style={{ background: accent }} />
          <div className="h-1 flex-1 bg-slate-200 rounded" />
        </div>
        <div className="flex-1 p-1 space-y-0.5">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-1 bg-slate-100 rounded" />)}
        </div>
      </div>
    );
  }
  if (id === "elegant") {
    return (
      <div className="h-full w-full flex flex-col" style={{ background: "#fffef8", border: `1px solid ${accent}` }}>
        <div className="h-1" style={{ background: `linear-gradient(90deg, ${accent}, #d4a017, ${accent})` }} />
        <div className="flex-1 p-1.5 flex flex-col items-center gap-1">
          <div className="w-3 h-3 rounded-full" style={{ background: accent }} />
          <div className="h-1 w-8 rounded" style={{ background: accent }} />
          <div className="flex-1 w-full rounded border mt-0.5" style={{ borderColor: `${accent}44` }} />
        </div>
      </div>
    );
  }
  if (id === "bold") {
    return (
      <div className="h-full w-full bg-white flex flex-col overflow-hidden">
        <div className="h-5 px-1.5 flex items-center justify-between" style={{ background: accent }}>
          <div className="w-6 h-1 bg-white/70 rounded" />
          <div className="w-3 h-3 rounded-full bg-white/30 border border-white/80" />
        </div>
        <div className="flex-1 p-1.5 space-y-1">
          <div className="h-2 rounded bg-slate-100" />
          <div className="grid grid-cols-2 gap-1">
            <div className="h-3 rounded" style={{ background: accent }} />
            <div className="h-3 rounded border" style={{ borderColor: accent }} />
          </div>
        </div>
      </div>
    );
  }
  // classic
  return (
    <div className="h-full w-full bg-white border-2 rounded-sm p-1.5 flex flex-col gap-1" style={{ borderColor: accent }}>
      <div className="flex items-center gap-1">
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: accent }} />
        <div className="h-1.5 flex-1 rounded" style={{ background: accent }} />
      </div>
      <div className="h-2 w-10 mx-auto rounded-full" style={{ background: accent }} />
      <div className="flex-1 rounded bg-slate-50 border border-slate-100" />
    </div>
  );
}

function LayoutPicker({ value }: { value: MarksheetLayout }) {
  const [sel, setSel] = useState(value);
  const selected = RESULT_LAYOUTS.find((l) => l.id === sel);
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Marksheet template</p>
      <input type="hidden" name="layout" value={sel} />
      <div className="grid grid-cols-2 gap-2">
        {RESULT_LAYOUTS.map((d) => (
          <button
            type="button"
            key={d.id}
            onClick={() => setSel(d.id)}
            className={`text-left rounded-xl border-2 p-1.5 transition ${
              sel === d.id ? "border-lime-500 ring-2 ring-lime-500/20" : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
            }`}
          >
            <div className="rounded-lg overflow-hidden aspect-[4/3] border border-slate-100 dark:border-slate-700 bg-slate-50">
              <LayoutThumb id={d.id} accent={d.accent} />
            </div>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 mt-1.5 flex items-center gap-1 px-0.5">
              {d.name}
              {sel === d.id && <CheckCircle2 className="w-3.5 h-3.5 text-lime-600" />}
            </p>
            <p className="text-[10px] text-slate-400 px-0.5 leading-snug">{d.desc}</p>
          </button>
        ))}
      </div>
      {selected && (
        <p className="text-[10px] text-slate-400 mt-2">
          Tip: leave accent empty to use this template&apos;s default colour ({selected.accent}).
        </p>
      )}
    </div>
  );
}
