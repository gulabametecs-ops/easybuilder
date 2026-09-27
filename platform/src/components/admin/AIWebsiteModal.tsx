"use client";

import { useState } from "react";
import { X, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { AIWebsiteGenerator } from "./AIBuilderPanel";

export function AIWebsiteModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const router = useRouter();
  const [key, setKey] = useState(0);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-lime-500" />
            <h2 className="font-bold text-slate-900 dark:text-white">AI Website Builder</h2>
          </div>
          <button type="button" onClick={() => onOpenChange(false)} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 max-h-[70vh] overflow-y-auto">
          <AIWebsiteGenerator
            key={key}
            onDone={(pageIds) => {
              onOpenChange(false);
              setKey((k) => k + 1);
              router.refresh();
              if (pageIds[0]) router.push(`/admin/pages/${pageIds[0]}`);
            }}
          />
        </div>
      </div>
    </div>
  );
}
