"use client";

import { useEffect, useRef, useState } from "react";
import { Monitor, Tablet, Smartphone, RefreshCw, ExternalLink, EyeOff, Eye } from "lucide-react";

export type PreviewDevice = "desktop" | "tablet" | "mobile";

/** Intrinsic viewport widths — CSS media queries use these, not the scaled size on screen. */
export const PREVIEW_DEVICES: { id: PreviewDevice; label: string; icon: typeof Monitor; width: number; height: number }[] = [
  { id: "desktop", label: "Desktop", icon: Monitor, width: 1280, height: 800 },
  { id: "tablet", label: "Tablet", icon: Tablet, width: 768, height: 1024 },
  { id: "mobile", label: "Phone", icon: Smartphone, width: 390, height: 844 },
];

type Props = {
  src: string;
  reloadKey?: string;
  className?: string;
  iframeRef?: React.RefObject<HTMLIFrameElement | null>;
  hidden?: boolean;
  onToggleHidden?: () => void;
  device?: PreviewDevice;
  onDeviceChange?: (device: PreviewDevice) => void;
};

export function DevicePreviewFrame({
  src,
  reloadKey,
  className = "",
  iframeRef: externalRef,
  hidden = false,
  onToggleHidden,
  device: controlledDevice,
  onDeviceChange,
}: Props) {
  const internalRef = useRef<HTMLIFrameElement | null>(null);
  const iframeRef = externalRef ?? internalRef;
  const stageRef = useRef<HTMLDivElement | null>(null);
  const scaleRef = useRef(0.5);
  const stageSizeRef = useRef({ w: 800, h: 600 });
  const rafRef = useRef(0);
  const [innerDevice, setInnerDevice] = useState<PreviewDevice>(controlledDevice ?? "desktop");
  const device = controlledDevice ?? innerDevice;
  const [scale, setScale] = useState(0.5);
  const [stageSize, setStageSize] = useState({ w: 800, h: 600 });
  const active = PREVIEW_DEVICES.find((d) => d.id === device)!;

  useEffect(() => {
    if (controlledDevice) setInnerDevice(controlledDevice);
  }, [controlledDevice]);

  const setDevice = (id: PreviewDevice) => {
    setInnerDevice(id);
    onDeviceChange?.(id);
  };

  const refresh = () => {
    try { iframeRef.current?.contentWindow?.location.reload(); } catch { /* ignore */ }
  };

  const isDesktop = device === "desktop";
  const border = isDesktop ? 0 : 10;
  const chromeTop = isDesktop ? 28 : device === "tablet" ? 14 : 28;
  const chromeBottom = isDesktop ? 0 : device === "tablet" ? 12 : 20;
  const frameW = active.width + border * 2;
  const frameH = active.height + chromeTop + chromeBottom + border * 2;

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const apply = () => {
      const pad = 12;
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      const availW = Math.max(160, w - pad);
      const availH = Math.max(160, h - pad);

      let next = isDesktop
        ? Math.min(1, availW / frameW)
        : Math.min(availW / frameW, availH / frameH, 1.15);

      // Quantize — stops micro oscillation between e.g. 0.552 / 0.548
      next = Math.round(next * 200) / 200; // 0.5% steps

      const prev = scaleRef.current;
      const sizeChanged = stageSizeRef.current.w !== w || stageSizeRef.current.h !== h;
      const scaleChanged = Math.abs(prev - next) >= 0.005;

      if (!scaleChanged && !sizeChanged) return;

      if (scaleChanged) {
        scaleRef.current = next;
        setScale(next);
      }
      if (sizeChanged) {
        stageSizeRef.current = { w, h };
        setStageSize({ w, h });
      }
    };

    const schedule = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(apply);
    };

    apply();
    const ro = new ResizeObserver(schedule);
    ro.observe(stage);
    return () => {
      ro.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isDesktop, frameH, frameW, device]);

  const cleanUrl = src
    .replace(/([?&])__edit=1&?/, "$1")
    .replace(/[?&]__edit=1$/, "")
    .replace(/([?&])_r=[^&]*&?/, "$1")
    .replace(/[?&]$/, "")
    .replace(/\?$/, "");

  // Shell size is driven by STAGE (not content) so scale never fights a scrollbar.
  const shellPad = 12;
  const shellW = Math.max(1, Math.min(frameW * scale, stageSize.w - shellPad));
  const shellH = isDesktop
    ? Math.max(1, stageSize.h - shellPad)
    : Math.min(frameH * scale, Math.max(1, stageSize.h - shellPad));

  const desktopIframeH = isDesktop
    ? Math.max(active.height, Math.round(shellH / Math.max(scale, 0.05) - chromeTop))
    : active.height;

  if (hidden) {
    return (
      <div className={`flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 px-4 py-6 ${className}`}>
        <p className="text-sm text-slate-500">Preview hidden</p>
        <button type="button" onClick={onToggleHidden} className="inline-flex items-center gap-2 rounded-lg bg-lime-500 text-white text-sm font-semibold px-3.5 py-2 hover:bg-lime-600">
          <Eye className="w-4 h-4" /> Show preview
        </button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-950 overflow-hidden ${className}`}>
      <div className="flex items-center gap-2 px-2.5 py-1.5 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shrink-0">
        <div className="flex rounded-lg border border-slate-200 dark:border-slate-600 p-0.5 bg-slate-50 dark:bg-slate-800">
          {PREVIEW_DEVICES.map((d) => {
            const Ic = d.icon;
            const on = device === d.id;
            return (
              <button
                key={d.id}
                type="button"
                title={d.label}
                onClick={() => setDevice(d.id)}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold transition ${
                  on ? "bg-lime-500 text-white" : "text-slate-500 hover:bg-white dark:hover:bg-slate-700"
                }`}
              >
                <Ic className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{d.label}</span>
              </button>
            );
          })}
        </div>
        <span className="hidden md:inline text-[10px] text-slate-400 font-medium tabular-nums">
          {active.width}px · {Math.round(scale * 100)}%
        </span>
        <div className="ml-auto flex items-center gap-0.5">
          <button type="button" onClick={refresh} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" title="Refresh">
            <RefreshCw className="w-4 h-4" />
          </button>
          <a href={cleanUrl || "/"} target="_blank" className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" title="Open live">
            <ExternalLink className="w-4 h-4" />
          </a>
          {onToggleHidden && (
            <button type="button" onClick={onToggleHidden} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" title="Hide preview">
              <EyeOff className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* overflow-hidden is critical: scrollbar appearing/disappearing caused the shake loop */}
      <div
        ref={stageRef}
        className="flex-1 min-h-0 overflow-hidden flex items-start justify-center p-3 bg-[linear-gradient(160deg,#cbd5e1_0%,#e2e8f0_40%,#f1f5f9_100%)] dark:bg-[linear-gradient(160deg,#0f172a_0%,#1e293b_50%,#0f172a_100%)]"
      >
        <div style={{ width: shellW, height: shellH, flexShrink: 0 }} className="shadow-2xl overflow-hidden rounded-lg">
          <div
            style={{
              width: frameW,
              height: isDesktop ? chromeTop + desktopIframeH : frameH,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              willChange: "transform",
            }}
          >
            {isDesktop ? (
              <div className="flex flex-col bg-slate-800 overflow-hidden rounded-lg border border-slate-700" style={{ width: active.width }}>
                <div className="shrink-0 flex items-center gap-2 px-3" style={{ height: chromeTop }}>
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 mx-2 bg-slate-700/80 rounded-md px-2 py-0.5 text-[10px] text-slate-300 truncate font-mono text-center">
                    {cleanUrl || "/"}
                  </div>
                </div>
                <iframe
                  ref={iframeRef}
                  key={reloadKey}
                  src={src}
                  title="Preview"
                  className="border-0 block bg-white"
                  style={{ width: active.width, height: desktopIframeH }}
                />
              </div>
            ) : (
              <div
                className={
                  device === "tablet"
                    ? "rounded-[18px] bg-slate-800 shadow-xl overflow-hidden"
                    : "rounded-[2rem] bg-slate-900 shadow-xl overflow-hidden"
                }
                style={{ width: frameW, borderWidth: border, borderStyle: "solid", borderColor: device === "tablet" ? "#1e293b" : "#0f172a" }}
              >
                {device === "tablet" ? (
                  <div className="bg-slate-800" style={{ height: chromeTop }} />
                ) : (
                  <div className="bg-slate-900 flex items-center justify-center" style={{ height: chromeTop }}>
                    <div className="w-16 h-3.5 bg-slate-800 rounded-full" />
                  </div>
                )}
                <iframe
                  ref={iframeRef}
                  key={`${reloadKey}-${device}`}
                  src={src}
                  title="Preview"
                  className="border-0 block bg-white"
                  style={{ width: active.width, height: active.height }}
                />
                {device === "tablet" ? (
                  <div className="bg-slate-800" style={{ height: chromeBottom }} />
                ) : (
                  <div className="bg-slate-900 flex items-center justify-center" style={{ height: chromeBottom }}>
                    <div className="w-16 h-1 bg-slate-700 rounded-full" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
