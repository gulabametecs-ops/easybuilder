"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, Copy, Check, KeyRound, LayoutDashboard, Monitor, Smartphone, Tablet, X, ExternalLink } from "lucide-react";
import { previewUrl } from "./DemoVerticalPanel";
import { VerticalIcon } from "./VerticalIcon";
import type { ActiveInfo, DemoSector } from "./DemosExplorer";

// Real device viewports (CSS px). The iframe renders at this exact size so the site's own
// mobile/tablet layouts kick in; the whole device is then scaled down to fit the screen.
const DEVICES = {
  tablet: { w: 820, h: 1180, bezel: 14, radius: 36, label: "Tablet · 820 × 1180" },
  mobile: { w: 390, h: 844, bezel: 10, radius: 44, label: "Phone · 390 × 844" },
} as const;
type Device = "desktop" | keyof typeof DEVICES;

/**
 * Full-screen live sandbox: one light toolbar (designs, device, timer, admin login, buy)
 * above the real site in an iframe. The site's own demo timer bar is hidden when framed.
 */
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
  const [device, setDevice] = useState<Device>("desktop");
  const stageRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [copied, setCopied] = useState<"user" | "pass" | null>(null);
  // null until mounted: server and client clocks differ, so the timer renders only on the client.
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const tick = window.setInterval(() => setNow(Date.now()), 1000);
    setNow(Date.now()); // eslint-disable-line react-hooks/set-state-in-effect
    const ro = new ResizeObserver(([e]) => setBox({ w: e.contentRect.width, h: e.contentRect.height }));
    if (stageRef.current) ro.observe(stageRef.current);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearInterval(tick);
      ro.disconnect();
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const left = now === null ? 0 : Math.max(0, new Date(active.expiresAt).getTime() - now);
  const mm = Math.floor(left / 60000);
  const ss = String(Math.floor((left % 60000) / 1000)).padStart(2, "0");
  const low = now !== null && left < 2 * 60000;

  async function copyText(kind: "user" | "pass", text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      /* clipboard blocked — the value is visible to copy by hand */
    }
  }

  const btn = "inline-flex h-9 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50";

  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-slate-100" role="dialog" aria-modal="true" aria-label={`${sector.name} live demo`}>
      <header className="shrink-0 border-b border-slate-200 bg-white/95 px-3 py-2 backdrop-blur sm:px-4">
        <div className="flex flex-wrap items-center gap-2 lg:flex-nowrap lg:gap-3">
          {/* Identity */}
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close demo"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            <X className="h-4 w-4" />
          </button>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50" style={{ color: sector.accent }}>
            <VerticalIcon name={sector.icon} className="h-4 w-4" />
          </span>
          <div className="mr-auto min-w-0 lg:mr-0 lg:w-52 lg:shrink-0">
            <p className="truncate text-sm font-semibold text-slate-900">{sector.name}</p>
            <p className="flex items-center gap-1.5 truncate text-[11px] text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Live sandbox
            </p>
          </div>

          {/* Designs */}
          <div role="radiogroup" aria-label="Design" className="order-last flex w-full gap-1.5 overflow-x-auto [scrollbar-width:none] lg:order-none lg:w-auto lg:flex-1 lg:justify-center">
            {sector.designs.map((d) => {
              const on = d.id === current?.id;
              return (
                <button
                  key={d.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => onDesign(d.id)}
                  className={`flex h-8 shrink-0 items-center gap-1.5 rounded-full border pl-1.5 pr-3 text-xs font-medium transition ${
                    on ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <span className="flex -space-x-1">
                    <span className="h-4 w-4 rounded-full ring-2 ring-white" style={{ background: d.colors.primary }} />
                    <span className="h-4 w-4 rounded-full ring-2 ring-white" style={{ background: d.colors.secondary }} />
                  </span>
                  {d.name}
                </button>
              );
            })}
          </div>

          {/* Device */}
          <div className="hidden items-center rounded-full border border-slate-200 bg-slate-50 p-0.5 md:flex" role="group" aria-label="Preview size">
            {(["desktop", "tablet", "mobile"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setDevice(v)}
                aria-pressed={device === v}
                aria-label={v === "desktop" ? "Desktop view" : v === "tablet" ? "Tablet view" : "Mobile view"}
                className={`flex h-8 w-9 items-center justify-center rounded-full transition ${device === v ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
              >
                {v === "desktop" ? <Monitor className="h-4 w-4" /> : v === "tablet" ? <Tablet className="h-4 w-4" /> : <Smartphone className="h-4 w-4" />}
              </button>
            ))}
          </div>

          {/* Timer */}
          <span
            className={`inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-semibold tabular-nums ${low ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-700"}`}
            title="Time left in your sandbox"
          >
            <Clock className="h-3.5 w-3.5" /> {now === null ? "--:--" : `${mm}:${ss}`}
          </span>

          {/* Admin login popover (native <details>, no extra state) */}
          {active.adminUsername && active.adminPassword && (
            <details className="relative">
              <summary className={`${btn} cursor-pointer list-none [&::-webkit-details-marker]:hidden`}>
                <KeyRound className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Admin login</span>
              </summary>
              <div className="absolute right-0 top-11 z-10 w-72 rounded-2xl border border-slate-200 bg-white p-4 text-slate-700 shadow-xl">
                <p className="text-sm font-semibold text-slate-900">Your demo admin login</p>
                <p className="mt-0.5 text-xs text-slate-500">Also shown on the admin login page.</p>
                <Cred kind="user" label="Username" value={active.adminUsername} copied={copied} onCopy={copyText} />
                <Cred kind="pass" label="Password" value={active.adminPassword} copied={copied} onCopy={copyText} />
                <a href={active.adminUrl} target="_blank" rel="noopener noreferrer" className="mt-3 flex h-9 items-center justify-center gap-1.5 rounded-xl bg-slate-900 text-xs font-semibold text-white hover:bg-slate-800">
                  Open admin panel <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </details>
          )}
          <a href={active.adminUrl} target="_blank" rel="noopener noreferrer" className={`${btn} hidden xl:inline-flex`}>
            <LayoutDashboard className="h-3.5 w-3.5" /> Admin
          </a>
          {current && (
            <Link
              href={`/subscribe?vertical=${sector.id}&design=${current.id}`}
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-slate-900 px-4 text-xs font-semibold text-white transition hover:bg-slate-800"
            >
              <span className="hidden sm:inline">Use this design</span>
              <span className="sm:hidden">Buy</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </header>

      {/* Site */}
      <div ref={stageRef} className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden">
        {device === "desktop" ? (
          <iframe
            key={src}
            title={`${sector.name} ${current?.name ?? ""} website`}
            src={src}
            className="absolute inset-0 h-full w-full border-0 bg-white"
            allow="clipboard-read; clipboard-write"
          />
        ) : (
          <DeviceFrame device={DEVICES[device]} box={box}>
            <iframe
              key={src}
              title={`${sector.name} ${current?.name ?? ""} website`}
              src={src}
              className="h-full w-full border-0 bg-white"
              allow="clipboard-read; clipboard-write"
            />
          </DeviceFrame>
        )}
      </div>
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
    <div className="mt-3 flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
      <div className="min-w-0">
        <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">{label}</p>
        <p className="truncate font-mono text-sm font-semibold text-slate-900">{value}</p>
      </div>
      <button
        type="button"
        onClick={() => onCopy(kind, value)}
        aria-label={`Copy ${label}`}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-white hover:text-slate-900"
      >
        {copied === kind ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
}

/** A device at its true viewport size, scaled down (never up) to fit the stage. */
function DeviceFrame({
  device,
  box,
  children,
}: {
  device: (typeof DEVICES)[keyof typeof DEVICES];
  box: { w: number; h: number };
  children: React.ReactNode;
}) {
  const outerW = device.w + device.bezel * 2;
  const outerH = device.h + device.bezel * 2;
  const LABEL = 28; // room for the size label under the device
  const scale = box.w && box.h ? Math.min(1, (box.w - 48) / outerW, (box.h - 40 - LABEL) / outerH) : 0;
  return (
    <div className="flex flex-col items-center" style={{ visibility: scale ? "visible" : "hidden" }}>
      <div style={{ width: outerW * scale, height: outerH * scale }}>
        <div
          className="origin-top-left bg-slate-900 shadow-2xl"
          style={{ width: outerW, height: outerH, padding: device.bezel, borderRadius: device.radius, transform: `scale(${scale})` }}
        >
          <div className="h-full w-full overflow-hidden bg-white" style={{ borderRadius: device.radius - device.bezel }}>
            {children}
          </div>
        </div>
      </div>
      <p className="mt-3 text-[11px] font-medium text-slate-500">
        {device.label}
        {scale < 1 && ` · shown at ${Math.round(scale * 100)}%`}
      </p>
    </div>
  );
}
