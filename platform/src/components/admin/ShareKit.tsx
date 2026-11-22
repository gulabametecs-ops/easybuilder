"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Copy, Check, Download, Printer, Mail, MessageCircle, Share2 } from "lucide-react";
import { Card } from "./ui";

const QR_OPTS = { errorCorrectionLevel: "M" as const, margin: 1, color: { dark: "#0f172a", light: "#ffffff" } };

export function ShareKit({ url, bizName, logo }: { url: string; bizName: string; logo: string }) {
  const [png, setPng] = useState("");
  const [copied, setCopied] = useState(false);
  const display = url.replace(/^https?:\/\//, "");

  useEffect(() => {
    QRCode.toDataURL(url, { ...QR_OPTS, width: 1024 }).then(setPng).catch(() => setPng(""));
  }, [url]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.prompt("Copy your website link:", url);
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = (href: string, ext: string) => {
    const a = document.createElement("a");
    a.href = href;
    a.download = `${bizName.replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "website"}-qr.${ext}`;
    a.click();
  };

  const downloadSvg = async () => {
    const svg = await QRCode.toString(url, { ...QR_OPTS, type: "svg" });
    const href = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    download(href, "svg");
    setTimeout(() => URL.revokeObjectURL(href), 1000);
  };

  const msg = `Visit ${bizName} online: ${url}`;
  const shares = [
    { label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(msg)}`, icon: MessageCircle, cls: "bg-[#25D366] text-white hover:opacity-90" },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, icon: Share2, cls: "bg-[#1877F2] text-white hover:opacity-90" },
    { label: "Email", href: `mailto:?subject=${encodeURIComponent(bizName)}&body=${encodeURIComponent(msg)}`, icon: Mail, cls: "border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800" },
  ];

  const btn = "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold";

  return (
    <>
      {/* Print only the poster, on one A5 sheet. */}
      <style>{`@media print {
        @page { size: A5 portrait; margin: 0; }
        html, body { height: 210mm !important; overflow: hidden !important; }
        body * { visibility: hidden !important; }
        #qr-poster, #qr-poster * { visibility: visible !important; }
        #qr-poster { position: fixed; inset: 0; width: 148mm; height: 210mm; border: 0 !important; border-radius: 0 !important; box-shadow: none !important; padding: 16mm 12mm !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      }`}</style>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="space-y-5 min-w-0">
          <Card className="p-5">
            <p className="text-sm font-bold text-slate-900 dark:text-white">Your website link</p>
            <div className="mt-3 flex flex-col sm:flex-row gap-2">
              <input readOnly value={url} onFocus={(e) => e.currentTarget.select()} aria-label="Website link"
                className="min-w-0 flex-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 text-sm" />
              <button type="button" onClick={copy} className={`${btn} bg-lime-500 text-white hover:bg-lime-600 shrink-0`}>
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {copied ? "Copied" : "Copy link"}
              </button>
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-white mt-5">Share it</p>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
              {shares.map((s) => {
                const Ic = s.icon;
                return (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className={`${btn} ${s.cls}`}>
                    <Ic className="w-4 h-4" /> {s.label}
                  </a>
                );
              })}
            </div>
          </Card>

          <Card className="p-5">
            <p className="text-sm font-bold text-slate-900 dark:text-white">QR code</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Put it on visiting cards, menus, letterheads, banners or your Instagram bio.</p>
            <div className="mt-4 flex flex-col sm:flex-row items-center gap-5">
              <div className="w-44 h-44 shrink-0 rounded-xl border border-slate-200 dark:border-slate-700 bg-white p-2 flex items-center justify-center">
                {png ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={png} alt={`QR code for ${display}`} className="w-full h-full" />
                ) : (
                  <span className="text-xs text-slate-400">Generating…</span>
                )}
              </div>
              <div className="flex flex-col gap-2 w-full sm:w-auto">
                <button type="button" disabled={!png} onClick={() => download(png, "png")} className={`${btn} bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 disabled:opacity-50`}>
                  <Download className="w-4 h-4" /> Download PNG
                </button>
                <button type="button" onClick={downloadSvg} className={`${btn} border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800`}>
                  <Download className="w-4 h-4" /> Download SVG (for printers)
                </button>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Printable poster (A5)</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Stick it at your counter, reception or notice board.</p>
            </div>
            <button type="button" disabled={!png} onClick={() => window.print()} className={`${btn} bg-lime-500 text-white hover:bg-lime-600 disabled:opacity-50`}>
              <Printer className="w-4 h-4" /> Print poster
            </button>
          </div>
          <div
            id="qr-poster"
            className="mx-auto w-full max-w-[340px] aspect-[148/210] rounded-xl border border-slate-200 bg-white text-slate-900 shadow-sm flex flex-col items-center justify-between text-center p-6"
          >
            <div className="flex flex-col items-center gap-3 w-full">
              {logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logo} alt="" className="max-h-14 max-w-[70%] object-contain" />
              ) : null}
              <p className="text-xl font-extrabold leading-tight break-words w-full">{bizName}</p>
            </div>
            <div className="flex flex-col items-center gap-2 w-full">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Scan to visit our website</p>
              {png ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={png} alt="" className="w-[70%] aspect-square" />
              ) : (
                <div className="w-[70%] aspect-square bg-slate-100 rounded" />
              )}
            </div>
            <p className="text-sm font-bold break-all">{display}</p>
          </div>
        </Card>
      </div>
    </>
  );
}
