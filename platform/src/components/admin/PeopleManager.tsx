"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, Users } from "lucide-react";
import { savePerson, deletePerson } from "@/lib/actions/people";
import { ImageInput } from "./ImageInput";
import { AdminWorkspace, labelCls } from "./AdminWorkspace";
import { Badge, EmptyState, btnPrimary, btnSecondary } from "./ui";

type Person = {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  groupName: string;
  experience: string;
  linkedin: string;
  instagram: string;
  published: boolean;
};

const input = "w-full rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 text-sm outline-none focus:border-lime-500";

export function PeopleManager({ people: initial }: { people: Person[] }) {
  const [pending, start] = useTransition();
  const [people, setPeople] = useState(initial);
  const [editing, setEditing] = useState<Person | null | "new">(null);

  const [prevInitial, setPrevInitial] = useState(initial);
  if (prevInitial !== initial) {
    setPrevInitial(initial);
    setPeople(initial);
  }

  return (
    <div className={pending ? "opacity-70 pointer-events-none" : ""}>
      <AdminWorkspace
        title="People"
        subtitle="Team members shown in the Team section of your website."
        titleIcon={<Users className="w-4 h-4 text-lime-600 shrink-0" />}
        tabs={[{ id: "team", label: "Public team", icon: Users }]}
        tab="team"
        onTabChange={() => {}}
        toolbar={
          <button type="button" onClick={() => setEditing("new")} className="inline-flex items-center gap-1 rounded-md bg-lime-500 text-white text-xs font-semibold px-2.5 py-1.5 hover:bg-lime-600">
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        }
      >
        {editing ? (
          <PersonForm
            person={editing === "new" ? null : editing}
            onCancel={() => setEditing(null)}
            onSave={(fd) => start(async () => { await savePerson(fd); setEditing(null); })}
          />
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {people.map((p) => (
              <li key={p.id} className="flex items-center gap-3 px-4 py-3">
                <button type="button" className="flex-1 flex items-center gap-3 text-left min-w-0" onClick={() => setEditing(p)}>
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image} alt="" className="w-10 h-10 rounded-full object-cover shrink-0 bg-slate-100" />
                  ) : (
                    <span className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center text-sm font-bold shrink-0">{p.name.charAt(0).toUpperCase()}</span>
                  )}
                  <span className="min-w-0">
                    <span className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 dark:text-white truncate">{p.name}</span>
                      {!p.published && <Badge tone="amber">Hidden</Badge>}
                    </span>
                    <span className="block text-xs text-slate-500">{[p.role, p.groupName === "leadership" ? "Leadership" : "Core team"].filter(Boolean).join(" · ")}</span>
                  </span>
                </button>
                <button type="button" className="p-1.5 text-slate-400 hover:text-red-500" onClick={() => { if (confirm(`Remove ${p.name} from the team?`)) start(async () => { await deletePerson(p.id); }); }} aria-label="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
            {people.length === 0 && (
              <li>
                <EmptyState icon={<Users />} title="No team members yet" hint="People you add here appear in the Team section of your website." action={<button type="button" onClick={() => setEditing("new")} className={btnPrimary}><Plus className="w-4 h-4" /> Add first person</button>} />
              </li>
            )}
          </ul>
        )}
      </AdminWorkspace>
    </div>
  );
}

function PersonForm({ person, onCancel, onSave }: { person: Person | null; onCancel: () => void; onSave: (fd: FormData) => void }) {
  return (
    <form action={(fd) => onSave(fd)} className="p-4 space-y-3 max-w-xl">
      {person && <input type="hidden" name="id" value={person.id} />}
      <ImageInput name="image" label="Photo" defaultValue={person?.image} aspect="aspect-square" />
      <label className="block"><span className={labelCls}>Full name *</span><input name="name" required defaultValue={person?.name} className={input} /></label>
      <div className="grid sm:grid-cols-2 gap-3">
        <label className="block"><span className={labelCls}>Role / designation</span><input name="role" defaultValue={person?.role} placeholder="e.g. Principal" className={input} /></label>
        <label className="block">
          <span className={labelCls}>Group</span>
          <select name="groupName" defaultValue={person?.groupName || "core"} className={input}>
            <option value="leadership">Leadership</option>
            <option value="core">Core team</option>
          </select>
        </label>
      </div>
      <label className="block"><span className={labelCls}>Experience line</span><input name="experience" defaultValue={person?.experience} placeholder="e.g. 10+ years · Mathematics" className={input} /></label>
      <label className="block"><span className={labelCls}>Short bio</span><textarea name="bio" rows={3} defaultValue={person?.bio} className={input} /></label>
      <div className="grid sm:grid-cols-2 gap-3">
        <label className="block"><span className={labelCls}>LinkedIn URL</span><input name="linkedin" defaultValue={person?.linkedin} placeholder="https://linkedin.com/in/…" className={input} /></label>
        <label className="block"><span className={labelCls}>Instagram URL</span><input name="instagram" defaultValue={person?.instagram} placeholder="https://instagram.com/…" className={input} /></label>
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
        <input type="checkbox" name="published" defaultChecked={person?.published !== false} /> Published on website
      </label>
      <div className="flex gap-2">
        <button type="submit" className={btnPrimary}>{person ? "Save changes" : "Add person"}</button>
        <button type="button" onClick={onCancel} className={btnSecondary}>Cancel</button>
      </div>
    </form>
  );
}
