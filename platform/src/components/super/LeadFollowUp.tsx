"use client";

import { useRef, useTransition } from "react";
import { addLeadNote, setLeadStatus } from "@/lib/actions/leadFollowUp";
import { FOLLOW_UP_STATUSES } from "@/lib/leadStatus";

/** Status picker (saves on change) + "add note" box for one sales lead. */
export function LeadFollowUp({ leadId, status }: { leadId: string; status: string }) {
  const [pending, start] = useTransition();
  const form = useRef<HTMLFormElement>(null);
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-xs font-medium text-slate-500">
        Follow-up
        <select
          defaultValue={status}
          disabled={pending}
          onChange={(e) => start(() => setLeadStatus(leadId, e.target.value))}
          className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm capitalize text-slate-800"
        >
          {FOLLOW_UP_STATUSES.map((s) => (
            <option key={s} value={s} className="capitalize">
              {s}
            </option>
          ))}
        </select>
      </label>
      <form
        ref={form}
        action={async (fd) => {
          await addLeadNote(leadId, fd);
          form.current?.reset();
        }}
        className="flex gap-2"
      >
        <input
          name="note"
          required
          maxLength={1000}
          placeholder="Add a note — e.g. Called, wants a demo call Friday"
          className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
        />
        <button className="shrink-0 rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-800">Add</button>
      </form>
    </div>
  );
}
