"use client";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export type WorkspaceTab = {
  id: string;
  label: string;
  hint?: string;
  icon: LucideIcon;
};

/** Left icon-tabs + main content (+ optional sticky aside). Matches Appearance / Results polish. */
export function AdminWorkspace({
  title,
  titleIcon,
  tabs,
  tab,
  onTabChange,
  toolbar,
  headerExtra,
  children,
  aside,
  asideWidth = 380,
}: {
  title: string;
  titleIcon?: ReactNode;
  tabs: WorkspaceTab[];
  tab: string;
  onTabChange: (id: string) => void;
  toolbar?: ReactNode;
  headerExtra?: ReactNode;
  children: ReactNode;
  aside?: ReactNode;
  asideWidth?: number;
}) {
  const many = tabs.length > 6;

  return (
    <div className="admin-full-bleed flex flex-col flex-1 min-h-0">
      <div className="flex flex-col xl:flex-row xl:items-stretch flex-1 min-h-0 gap-0">
        <div className="w-full flex flex-col min-h-0 order-2 xl:order-1 flex-1 min-w-0">
          <div className="flex flex-col rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden flex-1 min-h-0 h-full">
            <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/40 shrink-0 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                {titleIcon}
                <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{title}</p>
              </div>
              {toolbar}
            </div>

            {tabs.length > 1 && (
              <div
                className={
                  many
                    ? "flex flex-wrap gap-1 p-2 border-b border-slate-100 dark:border-slate-800 shrink-0"
                    : "grid gap-1 p-2 border-b border-slate-100 dark:border-slate-800 shrink-0"
                }
                style={many ? undefined : { gridTemplateColumns: `repeat(${Math.min(Math.max(tabs.length, 1), 6)}, minmax(0, 1fr))` }}
              >
                {tabs.map((t) => {
                  const Ic = t.icon;
                  const on = tab === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => onTabChange(t.id)}
                      className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2 transition ${
                        many ? "min-w-[4.5rem] flex-1" : ""
                      } ${
                        on
                          ? "bg-slate-900 text-white dark:bg-lime-500 dark:text-slate-900 shadow-sm"
                          : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <Ic className="w-4 h-4" />
                      <span className="text-[10px] font-bold leading-tight text-center">{t.label}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {headerExtra}

            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-3 sm:p-4">{children}</div>
          </div>
        </div>

        {aside && (
          <>
            <div className="hidden xl:block w-px bg-slate-200 dark:bg-slate-700 shrink-0 order-1 xl:order-2 self-stretch" />
            <div
              className="hidden xl:flex flex-col min-h-0 order-1 xl:order-3 shrink-0"
              style={{ width: asideWidth, flex: `0 0 ${asideWidth}px` }}
            >
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden flex-1 min-h-0 flex flex-col sticky top-0 max-h-[calc(100vh-6rem)]">
                {aside}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export const fieldCls =
  "w-full rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 text-sm outline-none focus:border-lime-500 placeholder:text-slate-400";
export const labelCls = "block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1";
