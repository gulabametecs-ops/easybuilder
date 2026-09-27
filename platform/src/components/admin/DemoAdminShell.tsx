import Link from "next/link";
import { ExternalLink, FileStack, Palette } from "lucide-react";
import { DemoTimerBar } from "@/components/site/DemoTimerBar";

export function DemoAdminShell({
  bizName,
  expiresAt,
  children,
}: {
  bizName: string;
  expiresAt: Date;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <DemoTimerBar expiresAt={expiresAt.toISOString()} />
      <header className="bg-slate-900 text-white px-5 h-14 flex items-center justify-between gap-4">
        <div>
          <p className="font-bold text-sm">{bizName}</p>
          <p className="text-xs text-slate-400">Demo sandbox — changes are private &amp; auto-reset</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/pages" className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold hover:bg-white/20">
            <FileStack className="w-3.5 h-3.5" /> Pages
          </Link>
          <Link href="/admin/appearance" className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold hover:bg-white/20">
            <Palette className="w-3.5 h-3.5" /> Appearance
          </Link>
          <a href="/" target="_blank" className="inline-flex items-center gap-1.5 rounded-lg bg-lime-500 text-slate-900 px-3 py-1.5 text-xs font-semibold hover:bg-lime-400">
            <ExternalLink className="w-3.5 h-3.5" /> Live preview
          </a>
        </div>
      </header>
      <main className="p-5 sm:p-8 max-w-6xl mx-auto w-full">{children}</main>
    </div>
  );
}
