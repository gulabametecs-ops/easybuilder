import Link from "next/link";
import { notFound } from "next/navigation";
import { Bell, ArrowRight, FileCheck2, Paperclip } from "lucide-react";
import { getCurrentTenant, getSiteNotices } from "@/lib/tenant";

export const metadata = { title: "Notices & Circulars" };

type Props = { searchParams: Promise<{ cat?: string }> };

const CAT_ORDER = ["Result", "Admission", "Exam", "Event", "Holiday", "News"];
const CAT_CLS: Record<string, string> = {
  result: "bg-emerald-100 text-emerald-700", admission: "bg-blue-100 text-blue-700", exam: "bg-purple-100 text-purple-700",
  event: "bg-amber-100 text-amber-700", holiday: "bg-rose-100 text-rose-700", news: "bg-slate-100 text-slate-600",
};

export default async function NoticesPage({ searchParams }: Props) {
  const tenant = await getCurrentTenant();
  if (!tenant) notFound();
  const { cat } = await searchParams;
  const all = await getSiteNotices(tenant.id);

  const present = CAT_ORDER.filter((c) => all.some((n) => n.category.toLowerCase() === c.toLowerCase()));
  const active = cat && present.some((c) => c.toLowerCase() === cat.toLowerCase()) ? cat.toLowerCase() : "all";
  const list = active === "all" ? all : all.filter((n) => n.category.toLowerCase() === active);

  return (
    <section className="py-14 sm:py-20 bg-light min-h-[60vh]">
      <div className="mx-auto max-w-4xl px-4">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4"><Bell className="w-7 h-7" /></div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-heading">Notices &amp; Circulars</h1>
          <p className="text-slate-500 mt-2">Latest announcements, results, admissions and events.</p>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <Tab label="All" href="/notices" active={active === "all"} />
          {present.map((c) => <Tab key={c} label={c} href={`/notices?cat=${c.toLowerCase()}`} active={active === c.toLowerCase()} />)}
        </div>

        <div className="rounded-2xl border border-black/10 bg-white shadow-sm overflow-hidden">
          {list.length === 0 ? (
            <p className="py-16 text-center text-slate-400">No notices in this category.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {list.map((n, i) => {
                const parts = (n.date || "").split(" ");
                const cls = CAT_CLS[n.category.toLowerCase()] ?? CAT_CLS.news;
                const primary = n.link || n.attachmentUrl || "";
                return (
                  <li key={i} className="group flex items-center gap-4 px-4 sm:px-6 py-4 hover:bg-primary/[0.04] transition-colors">
                    <div className="flex flex-col items-center justify-center rounded-xl bg-slate-50 border border-slate-100 w-16 h-16 shrink-0">
                      <span className="text-xl font-extrabold text-heading leading-none">{parts[0] || "•"}</span>
                      <span className="text-[9px] text-slate-400 uppercase mt-0.5 tracking-wide">{parts[1] || ""} {parts[2] || ""}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cls}`}>{n.category}</span>
                        {n.isNew && <span className="text-[10px] font-bold text-white bg-red-500 px-2 py-0.5 rounded-full">NEW</span>}
                      </div>
                      {primary ? (
                        <Link href={primary} target={!n.link && n.attachmentUrl ? "_blank" : undefined} className="text-sm sm:text-base font-semibold text-heading leading-snug hover:text-primary transition-colors">{n.title}</Link>
                      ) : (
                        <p className="text-sm sm:text-base font-semibold text-heading leading-snug">{n.title}</p>
                      )}
                      {n.isResult && <p className="text-xs text-primary font-medium mt-0.5 inline-flex items-center gap-1"><FileCheck2 className="w-3.5 h-3.5" /> Click to check your result</p>}
                      {n.attachmentUrl && <a href={n.attachmentUrl} target="_blank" rel="noopener" className="text-xs text-lime-600 font-medium mt-1 inline-flex items-center gap-1 hover:underline"><Paperclip className="w-3.5 h-3.5" /> {n.attachmentName || "Download attachment"}</a>}
                    </div>
                    {n.isResult && n.link ? (
                      <Link href={n.link} className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-primary text-white text-xs font-bold px-3 py-2 shrink-0 hover:opacity-90">Check Result <ArrowRight className="w-3.5 h-3.5" /></Link>
                    ) : n.link ? (
                      <Link href={n.link} className="shrink-0"><ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" /></Link>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

function Tab({ label, href, active }: { label: string; href: string; active: boolean }) {
  return (
    <Link href={href} className={`text-sm font-semibold px-4 py-2 rounded-full transition-colors ${active ? "bg-primary text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-primary hover:text-primary"}`}>
      {label}
    </Link>
  );
}
