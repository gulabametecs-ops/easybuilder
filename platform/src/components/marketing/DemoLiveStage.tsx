"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, Copy, Check, LayoutDashboard, X } from "lucide-react";
import { DesignPicker } from "./DesignPicker";
import { previewUrl } from "./DemoVerticalPanel";
import type { ActiveInfo, DemoSector } from "./DemosExplorer";

export function DemoLiveStage({
  sector,
  active,
  design,
  onDesign,
  onClose,
}: {
  sector: DemoSector;
  active: ActiveInfo;
  design: string;
  onDesign: (id: string) => void;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const current = sector.designs.find((d) => d.id === design) ?? sector.designs[0];
  const src = previewUrl(active.siteUrl, current?.id ?? "classic");
  const [copied, setCopied] = useState<"user" | "pass" | null>(null);
  const [showCreds, setShowCreds] = useState(true);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  async function copyText(kind: "user" | "pass", text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex flex-col bg-[#111110]"
      role="dialog"
      aria-modal="true"
      aria-label={`${sector.name} live demo`}
    >
      <header className="flex shrink-0 flex-col gap-2 border-b border-white/10 bg-[#161410] px-3 py-2 text-white sm:px-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close demo"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 hover:bg-white/15"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{sector.name}</p>
            <p className="truncate text-[11px] text-white/50">{current?.name} · live sandbox</p>
          </div>
          <span className="hidden items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white/80 sm:inline-flex">
            <Clock className="h-3.5 w-3.5" /> ~{active.minutesLeft} min
          </span>
          <a
            href={active.adminUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10"
          >
            <LayoutDashboard className="h-3.5 w-3.5" /> Admin
          </a>
          {current && (
            <Link
              href={`/subscribe?vertical=${sector.id}&design=${current.id}`}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#161410] hover:bg-stone-200"
            >
              Use this design <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-none">
          <DesignPicker designs={sector.designs} value={current?.id ?? "classic"} onChange={onDesign} layout="bar" label="Design" />
        </div>
      </header>

      {showCreds && active.adminUsername && active.adminPassword && (
        <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-1 border-b border-amber-500/20 bg-amber-950/80 px-4 py-1.5 text-[11px] text-amber-50">
          <span className="font-semibold">Admin login</span>
          <Cred kind="user" label="User" value={active.adminUsername} copied={copied} onCopy={copyText} />
          <Cred kind="pass" label="Pass" value={active.adminPassword} copied={copied} onCopy={copyText} />
          <button type="button" onClick={() => setShowCreds(false)} className="ml-auto text-amber-200/70 hover:text-white">
            Hide
          </button>
        </div>
      )}

      <iframe
        key={src}
        title={`${sector.name} ${current?.name ?? ""} website`}
        src={src}
        className="h-full min-h-0 w-full flex-1 border-0 bg-white"
        allow="clipboard-read; clipboard-write"
      />
    </div>
  );
}

function Cred({
  kind,
  label,
  value,
  copied,
  onCopy,
}: {
  kind: "user" | "pass";
  label: string;
  value: string;
  copied: "user" | "pass" | null;
  onCopy: (kind: "user" | "pass", text: string) => void;
}) {
  return (
    <span className="inline-flex items-center gap-1">
      {label}: <span className="font-mono font-bold">{value}</span>
      <button type="button" onClick={() => onCopy(kind, value)} aria-label={`Copy ${label}`} className="rounded p-0.5 hover:bg-white/10">
        {copied === kind ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      </button>
    </span>
  );
}
