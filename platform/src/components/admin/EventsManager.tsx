"use client";

import { useRef, useState, useTransition } from "react";
import { Plus, Trash2, CalendarDays, FileText, Paperclip, X, GripVertical, CalendarCheck, CalendarClock } from "lucide-react";
import { saveEvent, deleteEvent } from "@/lib/actions/events";
import { ImageInput } from "./ImageInput";
import { AdminWorkspace } from "./AdminWorkspace";
import { Badge, EmptyState, btnPrimary } from "./ui";
import { parseBlocks, parseDocs, parseStringList, resolveEventKind, type EventBlock, type EventDoc } from "@/lib/eventContent";
import { BrandSpinner } from "@/components/BrandLogo";

type Ev = {
  id: string;
  slug: string;
  title: string;
  activityName: string;
  shortDescription: string;
  programDescription: string;
  date: string;
  location: string;
  organizedBy: string;
  dignitaries: string;
  impact: string;
  coverImage: string;
  gallery: string;
  objectives: string;
  documents: string;
  published: boolean;
  status?: string;
  mapUrl?: string;
  venueNote?: string;
  blocks?: string;
  enableDonate?: boolean;
  donateAmount?: number;
  donateLabel?: string;
  showQr?: boolean;
  qrImage?: string;
  qrCaption?: string;
};

const input = "w-full rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800 px-3 py-2 text-sm outline-none focus:border-lime-500";
const label = "text-xs font-semibold text-slate-500 uppercase tracking-wide";

function listText(raw: string) {
  try {
    const v = JSON.parse(raw || "[]");
    return Array.isArray(v) ? v.join("\n") : "";
  } catch {
    return "";
  }
}

async function uploadFile(file: File): Promise<{ url: string; name: string }> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/upload-file", { method: "POST", body: fd });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Upload failed");
  return { url: data.url, name: data.name || file.name };
}

export function EventsManager({ events: initial, maxFileMb = 25 }: { events: Ev[]; maxFileMb?: number }) {
  const [pending, start] = useTransition();
  const [events, setEvents] = useState(initial);
  const [editing, setEditing] = useState<Ev | null | "new">(null);
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed">("all");
  // Re-sync when the server sends fresh data (adjust state during render, not in an effect).
  const [prevInitial, setPrevInitial] = useState(initial);
  if (prevInitial !== initial) {
    setPrevInitial(initial);
    setEvents(initial);
  }

  const visible = events.filter((e) => {
    if (filter === "all") return true;
    return resolveEventKind(e.date, e.status || "auto") === filter;
  });

  return (
    <div className={pending ? "opacity-70 pointer-events-none" : ""}>
      <AdminWorkspace
        title="Events"
        subtitle="Upcoming programs and completed event reports shown on /events."
        titleIcon={<CalendarDays className="w-4 h-4 text-lime-600 shrink-0" />}
        tabs={[
          { id: "all", label: "All", icon: CalendarDays },
          { id: "upcoming", label: "Upcoming", icon: CalendarClock },
          { id: "completed", label: "Completed", icon: CalendarCheck },
        ]}
        tab={filter}
        onTabChange={(id) => setFilter(id as typeof filter)}
        toolbar={
          <button type="button" onClick={() => setEditing("new")} className="inline-flex items-center gap-1 rounded-md bg-lime-500 text-white text-xs font-semibold px-2.5 py-1.5 hover:bg-lime-600">
            <Plus className="w-3.5 h-3.5" /> Add event
          </button>
        }
      >
        {editing ? (
          <EventForm
            event={editing === "new" ? null : editing}
            maxFileMb={maxFileMb}
            onCancel={() => setEditing(null)}
            onSave={(fd) => start(async () => { await saveEvent(fd); setEditing(null); })}
          />
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {visible.map((e) => {
              const kind = resolveEventKind(e.date, e.status || "auto");
              return (
                <li key={e.id} className="flex items-start gap-3 px-4 py-3">
                  <button type="button" className="flex-1 text-left min-w-0" onClick={() => setEditing(e)}>
                    <span className="flex items-center gap-2 min-w-0">
                      <span className="font-semibold text-slate-900 dark:text-white truncate">{e.title}</span>
                      {!e.published && <Badge tone="amber">Draft</Badge>}
                    </span>
                    <p className="text-xs text-slate-500">
                      {kind === "upcoming" ? "Upcoming" : "Completed"} · {e.date || "No date"} · {e.location || "No location"}
                    </p>
                  </button>
                  <button type="button" className="p-1.5 text-slate-400 hover:text-red-500" onClick={() => { if (confirm(`Delete "${e.title}"? This cannot be undone.`)) start(async () => { await deleteEvent(e.id); }); }} aria-label="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              );
            })}
            {visible.length === 0 && (
              <li>
                {filter === "all" ? (
                  <EmptyState icon={<CalendarDays />} title="No events yet" hint="Add an upcoming camp or a completed program report — it appears on your /events page." action={<button type="button" onClick={() => setEditing("new")} className={btnPrimary}><Plus className="w-4 h-4" /> Add first event</button>} />
                ) : (
                  <p className="text-center text-xs text-slate-400 py-10">No {filter} events.</p>
                )}
              </li>
            )}
          </ul>
        )}
      </AdminWorkspace>
    </div>
  );
}

function EventForm({ event, maxFileMb, onCancel, onSave }: { event: Ev | null; maxFileMb: number; onCancel: () => void; onSave: (fd: FormData) => void }) {
  const [docs, setDocs] = useState<EventDoc[]>(parseDocs(event?.documents || "[]"));
  const [gallery, setGallery] = useState<string[]>(parseStringList(event?.gallery || "[]"));
  const [blocks, setBlocks] = useState<EventBlock[]>(parseBlocks(event?.blocks || "[]"));
  const [status, setStatus] = useState(event?.status || "auto");

  return (
    <form
      action={(fd) => {
        fd.set("documentsJson", JSON.stringify(docs));
        fd.set("galleryJson", JSON.stringify(gallery));
        fd.set("blocksJson", JSON.stringify(blocks));
        onSave(fd);
      }}
      className="p-4 space-y-8 max-w-3xl"
    >
      {event && <input type="hidden" name="id" value={event.id} />}

      <section className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">1. Basic details</h3>
        <p className="text-xs text-slate-500">Title, date and type. Visitors see this first.</p>
        <ImageInput name="coverImage" label="Cover image" defaultValue={event?.coverImage} />
        <input name="title" required defaultValue={event?.title} placeholder="Event title" className={input} />
        <input name="slug" defaultValue={event?.slug} placeholder="URL slug (optional)" className={input} />
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="block">
            <span className={label}>Date</span>
            <input name="date" type="date" defaultValue={event?.date} className={`${input} mt-1`} />
          </label>
          <label className="block">
            <span className={label}>Type</span>
            <select name="status" value={status} onChange={(e) => setStatus(e.target.value)} className={`${input} mt-1`}>
              <option value="auto">Auto from date</option>
              <option value="upcoming">Upcoming (not yet held)</option>
              <option value="completed">Completed (report / photos)</option>
            </select>
          </label>
        </div>
        <input name="activityName" defaultValue={event?.activityName} placeholder="Activity name (e.g. Health camp)" className={input} />
        <input name="organizedBy" defaultValue={event?.organizedBy} placeholder="Organised by" className={input} />
        <textarea name="shortDescription" rows={2} defaultValue={event?.shortDescription} placeholder="Short card description" className={input} />
        <textarea name="programDescription" rows={4} defaultValue={event?.programDescription} placeholder="Full program description" className={input} />
        <textarea name="objectives" rows={3} defaultValue={listText(event?.objectives ?? "[]")} placeholder="Objectives — one per line" className={input} />
        <textarea name="dignitaries" rows={2} defaultValue={event?.dignitaries} placeholder="Dignitaries & participants" className={input} />
        <textarea name="impact" rows={2} defaultValue={event?.impact} placeholder="Impact of the program" className={input} />
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">2. Location</h3>
        <input name="location" defaultValue={event?.location} placeholder="Venue / address" className={input} />
        <input name="mapUrl" defaultValue={event?.mapUrl} placeholder="Google Maps link (optional)" className={input} />
        <textarea name="venueNote" rows={2} defaultValue={event?.venueNote} placeholder="How to reach, landmark, hall name…" className={input} />
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">3. Documents</h3>
        <p className="text-xs text-slate-500">PDF, Word or images — reports, declarations, attendance.</p>
        <DocsEditor docs={docs} onChange={setDocs} maxFileMb={maxFileMb} />
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">4. Photo gallery</h3>
        <GalleryEditor urls={gallery} onChange={setGallery} />
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">5. Extra story (best for completed events)</h3>
        <p className="text-xs text-slate-500">Add headings, text, photos, files or a QR in any order.</p>
        <BlocksEditor blocks={blocks} onChange={setBlocks} />
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">6. Donate & QR</h3>
        <p className="text-xs text-slate-500">Uses bank / UPI / Razorpay from Settings → Payments. You can also pin a QR on this page.</p>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="enableDonate" defaultChecked={event?.enableDonate} /> Show donate box on this event
        </label>
        <div className="grid sm:grid-cols-2 gap-3">
          <input name="donateAmount" type="number" min={0} defaultValue={event?.donateAmount || ""} placeholder="Suggested amount (₹)" className={input} />
          <input name="donateLabel" defaultValue={event?.donateLabel} placeholder="Button label e.g. Support this camp" className={input} />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="showQr" defaultChecked={event?.showQr} /> Show QR code on this event
        </label>
        <ImageInput name="qrImage" label="QR image (or leave blank to auto-make from UPI)" defaultValue={event?.qrImage} aspect="aspect-square" />
        <input name="qrCaption" defaultValue={event?.qrCaption} placeholder="QR caption e.g. Scan to donate" className={input} />
      </section>

      <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
        <input type="checkbox" name="published" defaultChecked={event?.published !== false} /> Published on the website
      </label>
      <div className="flex gap-2">
        <button type="submit" className="rounded-md bg-lime-500 text-white text-sm font-semibold px-3 py-2">Save event</button>
        <button type="button" onClick={onCancel} className="rounded-md border border-slate-200 dark:border-slate-600 text-sm px-3 py-2">Cancel</button>
      </div>
    </form>
  );
}

function DocsEditor({ docs, onChange, maxFileMb }: { docs: EventDoc[]; onChange: (v: EventDoc[]) => void; maxFileMb: number }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [label, setLabel] = useState("");

  async function add(file?: File) {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const up = await uploadFile(file);
      onChange([...docs, { label: label.trim() || up.name.replace(/\.[^.]+$/, "") || "Document", url: up.url }]);
      setLabel("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      {docs.map((d, i) => (
        <div key={`${d.url}-${i}`} className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm">
          <FileText className="w-4 h-4 text-lime-600 shrink-0" />
          <input
            value={d.label}
            onChange={(e) => onChange(docs.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))}
            className="flex-1 bg-transparent outline-none"
          />
          <a href={d.url} target="_blank" rel="noreferrer" className="text-xs text-lime-700">Open</a>
          <button type="button" onClick={() => onChange(docs.filter((_, j) => j !== i))} className="text-red-500" aria-label="Remove">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
      <div className="flex flex-wrap gap-2">
        <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="File name e.g. Activity report" className={`${input} sm:max-w-xs`} />
        <button type="button" onClick={() => ref.current?.click()} disabled={busy} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm">
          {busy ? <BrandSpinner className="w-4 h-4" /> : <Paperclip className="w-4 h-4" />}
          {busy ? "Uploading…" : "Add document"}
        </button>
        <input ref={ref} type="file" className="hidden" accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv" onChange={(e) => { add(e.target.files?.[0]); e.target.value = ""; }} />
      </div>
      <p className="text-xs text-slate-400">PDF, Word, Excel, PowerPoint, images or text · max {maxFileMb} MB per file</p>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

function GalleryEditor({ urls, onChange }: { urls: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className="space-y-3">
      {urls.map((url, i) => (
        <div key={`${url}-${i}`} className="flex items-start gap-2">
          <div className="flex-1">
            <ImageInput value={url} onChange={(u) => onChange(urls.map((x, j) => (j === i ? u : x)))} />
          </div>
          <button type="button" className="mt-2 text-red-500" onClick={() => onChange(urls.filter((_, j) => j !== i))} aria-label="Remove photo">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...urls, ""])} className="text-sm font-medium text-lime-700">+ Add photo</button>
    </div>
  );
}

function BlocksEditor({ blocks, onChange }: { blocks: EventBlock[]; onChange: (v: EventBlock[]) => void }) {
  function add(type: EventBlock["type"]) {
    const blank: Record<EventBlock["type"], EventBlock> = {
      heading: { type: "heading", text: "" },
      text: { type: "text", text: "" },
      image: { type: "image", url: "", caption: "" },
      gallery: { type: "gallery", urls: [""] },
      document: { type: "document", label: "", url: "" },
      qr: { type: "qr", image: "", caption: "Scan to donate" },
      html: { type: "html", html: "" },
    };
    onChange([...blocks, blank[type]]);
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= blocks.length) return;
    const next = [...blocks];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  return (
    <div className="space-y-3">
      {blocks.map((b, i) => (
        <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="inline-flex items-center gap-1 font-semibold capitalize"><GripVertical className="w-3.5 h-3.5" /> {b.type}</span>
            <div className="flex gap-2">
              <button type="button" onClick={() => move(i, -1)}>Up</button>
              <button type="button" onClick={() => move(i, 1)}>Down</button>
              <button type="button" className="text-red-500" onClick={() => onChange(blocks.filter((_, j) => j !== i))}>Remove</button>
            </div>
          </div>
          {b.type === "heading" && <input className={input} value={b.text} onChange={(e) => onChange(blocks.map((x, j) => (j === i ? { ...b, text: e.target.value } : x)))} placeholder="Heading" />}
          {b.type === "text" && <textarea className={input} rows={4} value={b.text} onChange={(e) => onChange(blocks.map((x, j) => (j === i ? { ...b, text: e.target.value } : x)))} placeholder="Paragraph" />}
          {b.type === "html" && <textarea className={input} rows={4} value={b.html} onChange={(e) => onChange(blocks.map((x, j) => (j === i ? { ...b, html: e.target.value } : x)))} placeholder="Custom HTML" />}
          {b.type === "image" && (
            <>
              <ImageInput value={b.url} onChange={(url) => onChange(blocks.map((x, j) => (j === i ? { ...b, url } : x)))} />
              <input className={input} value={b.caption} onChange={(e) => onChange(blocks.map((x, j) => (j === i ? { ...b, caption: e.target.value } : x)))} placeholder="Caption" />
            </>
          )}
          {b.type === "qr" && (
            <>
              <ImageInput value={b.image} onChange={(image) => onChange(blocks.map((x, j) => (j === i ? { ...b, image } : x)))} aspect="aspect-square" />
              <input className={input} value={b.caption} onChange={(e) => onChange(blocks.map((x, j) => (j === i ? { ...b, caption: e.target.value } : x)))} placeholder="Caption under QR" />
            </>
          )}
          {b.type === "document" && (
            <DocRow
              doc={{ label: b.label, url: b.url }}
              onChange={(d) => onChange(blocks.map((x, j) => (j === i ? { type: "document", ...d } : x)))}
            />
          )}
          {b.type === "gallery" && (
            <GalleryEditor
              urls={b.urls}
              onChange={(urls) => onChange(blocks.map((x, j) => (j === i ? { ...b, urls } : x)))}
            />
          )}
        </div>
      ))}
      <div className="flex flex-wrap gap-2">
        {(["heading", "text", "image", "gallery", "document", "qr", "html"] as const).map((t) => (
          <button key={t} type="button" onClick={() => add(t)} className="rounded-full border border-slate-200 dark:border-slate-600 px-3 py-1 text-xs font-medium capitalize hover:border-lime-400">
            + {t}
          </button>
        ))}
      </div>
    </div>
  );
}

function DocRow({ doc, onChange }: { doc: EventDoc; onChange: (d: EventDoc) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  return (
    <div className="space-y-2">
      <input className={input} value={doc.label} onChange={(e) => onChange({ ...doc, label: e.target.value })} placeholder="Document title" />
      {doc.url ? (
        <div className="flex items-center gap-2 text-sm">
          <a href={doc.url} className="text-lime-700 truncate" target="_blank" rel="noreferrer">File attached</a>
          <button type="button" className="text-red-500" onClick={() => onChange({ ...doc, url: "" })}>Remove</button>
        </div>
      ) : (
        <button type="button" onClick={() => ref.current?.click()} className="text-sm">{busy ? "Uploading…" : "Upload file"}</button>
      )}
      <input ref={ref} type="file" className="hidden" onChange={async (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        setBusy(true);
        try {
          const up = await uploadFile(f);
          onChange({ label: doc.label || up.name, url: up.url });
        } catch (err) {
          alert(err instanceof Error ? err.message : "Upload failed");
        } finally { setBusy(false); e.target.value = ""; }
      }} />
    </div>
  );
}
