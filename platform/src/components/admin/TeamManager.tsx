"use client";

import { useActionState, useTransition } from "react";
import { inviteTeamMember, removeTeamMember, updateTeamMemberRole, type TeamState } from "@/lib/actions/team";
import { fieldCls, labelCls } from "./AdminWorkspace";

type Member = { id: string; email: string; name: string | null; role: string };

const init: TeamState = { ok: false, message: "" };

export function TeamManager({
  members,
  currentUserId,
  canManage,
  isOwner,
}: {
  members: Member[];
  currentUserId: string;
  canManage: boolean;
  isOwner: boolean;
}) {
  const [state, action, pending] = useActionState(inviteTeamMember, init);
  const [busy, start] = useTransition();

  return (
    <div className="max-w-xl space-y-4">
      <div>
        <p className="text-sm font-semibold text-slate-800 dark:text-white">Team members</p>
        <p className="text-xs text-slate-400 mt-0.5">Invite staff to help manage leads, content and appointments.</p>
      </div>

      <ul className="divide-y divide-slate-100 dark:divide-slate-800 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        {members.map((m) => (
          <li key={m.id} className="flex flex-wrap items-center justify-between gap-3 px-3 py-2.5 bg-white dark:bg-slate-900">
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{m.name || m.email}</p>
              <p className="text-[10px] text-slate-400">{m.email}</p>
            </div>
            <div className="flex items-center gap-2">
              {isOwner && m.id !== currentUserId ? (
                <>
                  <select
                    defaultValue={m.role}
                    disabled={busy}
                    onChange={(e) => start(async () => { await updateTeamMemberRole(m.id, e.target.value); })}
                    className="rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-xs px-2 py-1.5"
                  >
                    <option value="owner">Owner</option>
                    <option value="admin">Admin</option>
                    <option value="staff">Staff</option>
                  </select>
                  <button type="button" disabled={busy} onClick={() => start(async () => { await removeTeamMember(m.id); })} className="text-xs text-rose-600 font-semibold hover:underline">
                    Remove
                  </button>
                </>
              ) : canManage && m.id !== currentUserId && m.role === "staff" ? (
                <button type="button" disabled={busy} onClick={() => start(async () => { await removeTeamMember(m.id); })} className="text-xs text-rose-600 font-semibold hover:underline">
                  Remove
                </button>
              ) : (
                <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">{m.role}</span>
              )}
            </div>
          </li>
        ))}
      </ul>

      {canManage && (
        <form action={action} className="grid sm:grid-cols-2 gap-3 rounded-2xl border border-slate-100 dark:border-slate-800 p-3">
          <p className="sm:col-span-2 text-xs font-semibold text-slate-700 dark:text-slate-200">Invite member</p>
          <label className="block"><span className={labelCls}>Name</span><input name="name" className={fieldCls} placeholder="Optional" /></label>
          <label className="block"><span className={labelCls}>Email</span><input name="email" type="email" required className={fieldCls} /></label>
          <label className="block">
            <span className={labelCls}>Role</span>
            <select name="role" defaultValue="staff" className={fieldCls}>
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
              {isOwner && <option value="owner">Owner</option>}
            </select>
          </label>
          <label className="block"><span className={labelCls}>Temp password</span><input name="password" type="text" required minLength={6} className={fieldCls} placeholder="Min 6 characters" /></label>
          {state.message && <p className={`sm:col-span-2 text-xs ${state.ok ? "text-emerald-600" : "text-rose-600"}`}>{state.message}</p>}
          <div className="sm:col-span-2">
            <button disabled={pending} className="w-full rounded-xl bg-slate-900 text-white text-sm font-bold py-2.5 hover:bg-slate-800 disabled:opacity-60">
              {pending ? "Inviting…" : "Invite member"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
