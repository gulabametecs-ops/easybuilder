"use client";

import { useEffect, useState, useTransition } from "react";
import { Plus, Trash2, Users } from "lucide-react";
import { savePerson, deletePerson } from "@/lib/actions/people";
import { ImageInput } from "./ImageInput";
import { AdminWorkspace } from "./AdminWorkspace";

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

const input = "w-full rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800 px-3 py-2 text-sm outline-none focus:border-lime-500";

export function PeopleManager({ people: initial }: { people: Person[] }) {
  const [pending, start] = useTransition();
  const [people, setPeople] = useState(initial);
  const [editing, setEditing] = useState<Person | null | "new">(null);

  useEffect(() => setPeople(initial), [initial]);

  return (
    <div className={pending ? "opacity-70 pointer-events-none" : ""}>
      <AdminWorkspace
        title="People"
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
              <li key={p.id} className="flex items-start gap-3 px-4 py-3">
                <button type="button" className="flex-1 text-left min-w-0" onClick={() => setEditing(p)}>
                  <p className="font-semibold text-slate-900 dark:text-white truncate">{p.name}</p>
                  <p className="text-xs text-slate-500">{p.role} · {p.groupName}</p>
                </button>
                <button type="button" className="p-1.5 text-slate-400 hover:text-red-500" onClick={() => start(async () => { await deletePerson(p.id); })} aria-label="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
            {people.length === 0 && <li className="px-4 py-10 text-sm text-slate-500 text-center">No public team members yet. These appear on the Team section of the website.</li>}
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
      <input name="name" required defaultValue={person?.name} placeholder="Full name" className={input} />
      <input name="role" defaultValue={person?.role} placeholder="Role / designation" className={input} />
      <select name="groupName" defaultValue={person?.groupName || "core"} className={input}>
        <option value="leadership">Leadership</option>
        <option value="core">Core team</option>
      </select>
      <input name="experience" defaultValue={person?.experience} placeholder="Experience line (e.g. 10+ years · Health)" className={input} />
      <textarea name="bio" rows={3} defaultValue={person?.bio} placeholder="Short bio" className={input} />
      <input name="linkedin" defaultValue={person?.linkedin} placeholder="LinkedIn URL" className={input} />
      <input name="instagram" defaultValue={person?.instagram} placeholder="Instagram URL" className={input} />
      <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
        <input type="checkbox" name="published" defaultChecked={person?.published !== false} /> Published on website
      </label>
      <div className="flex gap-2">
        <button type="submit" className="rounded-md bg-lime-500 text-white text-sm font-semibold px-3 py-2">Save</button>
        <button type="button" onClick={onCancel} className="rounded-md border border-slate-200 dark:border-slate-600 text-sm px-3 py-2">Cancel</button>
      </div>
    </form>
  );
}
