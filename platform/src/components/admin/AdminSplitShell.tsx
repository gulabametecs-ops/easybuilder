"use client";

import { useState, type ReactNode } from "react";
import { Eye } from "lucide-react";
import { DevicePreviewFrame } from "./DevicePreviewFrame";

/** Shared left-editor + right live-preview shell (Pages / Services / Gallery / …). */
export function AdminSplitShell({
  title,
  titleIcon,
  countLabel,
  toolbar,
  children,
  previewSrc,
  previewKey,
  headerExtra,
}: {
  title: string;
  titleIcon?: ReactNode;
  countLabel?: string;
  toolbar?: ReactNode;
  children: ReactNode;
  previewSrc: string;
  previewKey?: string;
  headerExtra?: ReactNode;
}) {
  const [previewHidden, setPreviewHidden] = useState(false);

  return (
    <div className="admin-full-bleed flex flex-col flex-1 min-h-0">
      <div className="flex flex-col xl:flex-row xl:items-stretch flex-1 min-h-0 gap-0">
        <div
          className="w-full flex flex-col min-h-0 order-2 xl:order-1"
          style={previewHidden ? { flex: "1 1 auto", width: "100%" } : { width: 400, flex: "0 0 400px", minWidth: 300, maxWidth: "100%" }}
        >
          <div className="flex flex-col rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden flex-1 min-h-0 h-full">
            <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/40 shrink-0 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                {titleIcon}
                <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{title}</p>
                {countLabel && <span className="text-xs text-slate-400 shrink-0">{countLabel}</span>}
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {previewHidden && (
                  <button
                    type="button"
                    onClick={() => setPreviewHidden(false)}
                    className="inline-flex items-center gap-1 rounded-md border border-slate-200 dark:border-slate-600 px-2 py-1.5 text-xs font-medium text-lime-600"
                  >
                    <Eye className="w-3.5 h-3.5" /> Preview
                  </button>
                )}
                {toolbar}
              </div>
            </div>
            {headerExtra}
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">{children}</div>
          </div>
        </div>

        {!previewHidden && <div className="hidden xl:block w-px bg-slate-200 dark:bg-slate-700 shrink-0 order-1 xl:order-2 self-stretch" />}

        {!previewHidden && (
          <div className="flex-1 min-w-0 min-h-[420px] xl:min-h-0 order-1 xl:order-3 flex flex-col">
            <DevicePreviewFrame
              src={previewSrc}
              reloadKey={previewKey}
              className="flex-1 min-h-0 h-[calc(100vh-8rem)]"
              onToggleHidden={() => setPreviewHidden(true)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
