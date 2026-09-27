"use client";

import { useEffect, useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Trash2, Pencil, Eye, EyeOff, Pin, X, Paperclip, FileText,
  Loader2, Megaphone, ArrowLeft, Search,
} from "lucide-react";
import { addNotice, updateNotice, deleteNotice, toggleNoticePublish, toggleNoticePin } from "@/lib/actions/notices";
import { AdminSplitShell } from "./AdminSplitShell";

type Notice = {
  id: string;
  date: string;
  title: string;
  category: string;
  link: string;
  attachmentUrl: string;
  attachmentName: string;
  pinned: boolean;
  published: boolean;
};

const CATEGORIES = ["Result", "Admission", "Exam", "Event", "Holiday", "News"];
const CAT_CLS: Record<string, string> = {
  result: "bg-emerald-100 text-emerald-700",
  admission: "bg-blue-100 text-blue-700",
  exam: "bg-purple-100 text-purple-700",
  event: "bg-amber-100 text-amber-700",
  holiday: "bg-rose-100 text-rose-700",
  news: "bg-slate-100 text-slate-600",
};
const inputCls =
  "w-full rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800 px-3 py-2 text-sm outline-none focus:border-lime-500";

export function NoticesManager({ notices: initial }: { notices: Notice[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [notices, setNotices] = useState(initial);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [tick, setTick] = useState(0);

  useEffect(() => setNotices(initial), [initial]);

  const bump = () => { setTick((t) => t + 1); router.refresh(); };
  const filtered = notices.filter((n) => {
    const needle = q.trim().toLowerCase();
    if (!needle) return true;
    return n.title.toLowerCase().includes(needle) || n.category.toLowerCase().includes(needle);
  });
  const editingNotice = notices.find((n) => n.id === editing) ?? null;

  return (
    <div className={pending ? "opacity-70 pointer-events-none" : ""}>
      <AdminSplitShell
        title="Notices"
        titleIcon={<Megaphone className="w-4 h-4 text-lime-600 shrink-0" />}
        countLabel={`${notices.length}`}
        previewSrc={`/notices?__edit=1&_r=${tick}`}
        previewKey={`n:${tick}`}
        toolbar={
          !adding && !editing ? (
            <button type="button" onClick={() => setAdding(true)} className="inline-flex items-center gap-1 rounded-md bg-lime-500 text-white text-xs font-semibold px-2.5 py-1.5 hover:bg-lime-600">
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          ) : undefined
        }
        headerExtra={
          !adding && !editing ? (
            <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search notices…" className="w-full rounded-lg border border-slate-200 dark:border-slate-600 dark:bg-slate-800 pl-8 pr-3 py-1.5 text-sm outline-none focus:border-lime-500" />
              </div>
            </div>
          ) : undefined
        }
      >
        {adding ? (
          <div className="p-3 space-y-3">
            <button type="button" onClick={() => setAdding(false)} className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <p className="text-sm font-semibold text-slate-800 dark:text-white">New notice</p>
            <form
              className="space-y-3"
              action={(fd) => {
                start(async () => {
                  await addNotice(fd);
                  setAdding(false);
                  bump();
                });
              }}
            >
              <NoticeFields />
              <button type="submit" className="w-full rounded-xl bg-lime-500 text-white text-sm font-bold py-2.5 hover:bg-lime-600">Post notice</button>
            </form>
          </div>
        ) : editingNotice ? (
          <div className="p-3 space-y-3">
            <button type="button" onClick={() => setEditing(null)} className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <p className="text-sm font-semibold text-slate-800 dark:text-white">Edit notice</p>
            <form
              className="space-y-3"
              action={(fd) => {
                start(async () => {
                  await updateNotice(fd);
                  setEditing(null);
                  bump();
                });
              }}
            >
              <input type="hidden" name="id" value={editingNotice.id} />
              <NoticeFields notice={editingNotice} />
              <button type="submit" className="w-full rounded-xl bg-lime-500 text-white text-sm font-bold py-2.5 hover:bg-lime-600">Save & apply</button>
            </form>
          </div>
        ) : (
          <div className="p-2 space-y-1.5">
            {notices.length === 0 && (
              <div className="text-center py-12 px-4">
                <span className="inline-flex w-12 h-12 rounded-2xl bg-lime-500/15 text-lime-600 items-center justify-center mb-3">
                  <Megaphone className="w-6 h-6" />
                </span>
                <p className="text-sm font-semibold text-slate-800 dark:text-white">No notices yet</p>
                <p className="text-xs text-slate-400 mt-1 mb-3">Post notices for the notice board &amp; /notices page.</p>
                <button type="button" onClick={() => setAdding(true)} className="text-sm font-semibold text-lime-600 hover:underline">Add first notice</button>
              </div>
            )}
            {filtered.map((n) => (
              <div key={n.id} className="rounded-xl border border-slate-100 dark:border-slate-700/80 bg-white dark:bg-slate-900 p-2.5">
                <div className="flex items-start gap-2.5">
                  <div className="flex flex-col items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 w-12 h-12 shrink-0 text-center">
                    <span className="text-sm font-extrabold text-slate-800 dark:text-white leading-none">{n.date.split(" ")[0] || "•"}</span>
                    <span className="text-[9px] text-slate-400 uppercase">{n.date.split(" ")[1] || ""}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${CAT_CLS[n.category.toLowerCase()] ?? CAT_CLS.news}`}>{n.category}</span>
                      {n.pinned && <span className="text-[10px] font-bold text-amber-600 inline-flex items-center gap-0.5"><Pin className="w-3 h-3" /> Pin</span>}
                      {!n.published && <span className="text-[10px] font-bold text-slate-400">Hidden</span>}
                    </div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate leading-tight">{n.title}</p>
                    {n.attachmentUrl && (
                      <p className="text-[10px] text-lime-600 truncate inline-flex items-center gap-1 mt-0.5">
                        <Paperclip className="w-3 h-3" /> {n.attachmentName || "file"}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-2 pl-0.5">
                  <button type="button" onClick={() => start(async () => { await toggleNoticePin(n.id); bump(); })} className={`p-1.5 rounded-md ${n.pinned ? "bg-amber-100 text-amber-600" : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`} title="Pin">
                    <Pin className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={() => start(async () => { await toggleNoticePublish(n.id); bump(); })} className="p-1.5 rounded-md text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" title="Show/hide">
                    {n.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                  <button type="button" onClick={() => setEditing(n.id)} className="p-1.5 rounded-md text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" title="Edit">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!confirm("Delete this notice?")) return;
                      start(async () => {
                        await deleteNotice(n.id);
                        setNotices((prev) => prev.filter((x) => x.id !== n.id));
                        bump();
                      });
                    }}
                    className="p-1.5 rounded-md text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 ml-auto"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && notices.length > 0 && (
              <p className="text-center text-xs text-slate-400 py-8">No matches for “{q}”</p>
            )}
          </div>
        )}
      </AdminSplitShell>
    </div>
  );
}

function NoticeFields({ notice }: { notice?: Notice }) {
  return (
    <>
      <label className="block">
        <span className="text-[10px] font-semibold text-slate-400 mb-1 block">Title</span>
        <input name="title" defaultValue={notice?.title} required placeholder="e.g. Class 10 results declared" className={inputCls} />
      </label>
      <div className="grid grid-cols-2 gap-2">
        <label className="block">
          <span className="text-[10px] font-semibold text-slate-400 mb-1 block">Date</span>
          <input name="date" defaultValue={notice?.date} placeholder="20 Jul 2026" className={inputCls} />
        </label>
        <label className="block">
          <span className="text-[10px] font-semibold text-slate-400 mb-1 block">Category</span>
          <select name="category" defaultValue={notice?.category ?? "News"} className={inputCls}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
      </div>
      <label className="block">
        <span className="text-[10px] font-semibold text-slate-400 mb-1 block">Link (optional)</span>
        <input name="link" defaultValue={notice?.link} placeholder="/result or https://…" className={inputCls} />
      </label>
      <AttachmentInput url={notice?.attachmentUrl ?? ""} fileName={notice?.attachmentName ?? ""} />
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
          <input type="checkbox" name="pinned" defaultChecked={notice?.pinned} className="rounded" /> Pin to top
        </label>
        <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
          <input type="checkbox" name="published" defaultChecked={notice ? notice.published : true} className="rounded" /> Published
        </label>
      </div>
    </>
  );
}

function AttachmentInput({ url, fileName }: { url: string; fileName: string }) {
  const [current, setCurrent] = useState({ url, name: fileName });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  const onFile = async (f: File | undefined) => {
    if (!f) return;
    setBusy(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", f);
      const res = await fetch("/api/upload-file", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setCurrent({ url: data.url, name: data.name || f.name });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <span className="text-[10px] font-semibold text-slate-400 mb-1 block">Attachment (optional)</span>
      <input type="hidden" name="attachmentUrl" value={current.url} />
      <input type="hidden" name="attachmentName" value={current.name} />
      {current.url ? (
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm">
          <FileText className="w-4 h-4 text-lime-600 shrink-0" />
          <a href={current.url} target="_blank" rel="noreferrer" className="flex-1 truncate text-slate-700 dark:text-slate-200 hover:underline">
            {current.name || "View"}
          </a>
          <button type="button" onClick={() => setCurrent({ url: "", name: "" })} className="text-red-500 hover:text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <>
          <button type="button" onClick={() => ref.current?.click()} disabled={busy} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-60">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Paperclip className="w-4 h-4" />}
            {busy ? "Uploading…" : "Attach file"}
          </button>
          <input ref={ref} type="file" accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
        </>
      )}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
