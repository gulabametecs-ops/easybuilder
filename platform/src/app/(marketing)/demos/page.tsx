import Link from "next/link";
import { ArrowRight, Lock, ExternalLink, LayoutDashboard, Sparkles, Check } from "lucide-react";
import { VERTICALS, DEMO_PASSWORD } from "@/lib/verticals";
import { ROOT_DOMAIN } from "@/lib/domains";
import { img } from "@/lib/img";
import { hasDemoAccess } from "@/lib/actions/demos";
import { VerticalIcon } from "@/components/marketing/VerticalIcon";
import { DemoGate } from "@/components/marketing/DemoGate";

export const metadata = { title: "Live Demos — Standard SaaS" };

const proto = ROOT_DOMAIN.includes("localhost") ? "http" : "https";
const card = "rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/[0.03]";
const muted = "text-slate-500 dark:text-slate-400";
const liveCount = VERTICALS.filter((v) => v.status === "live").length;

export default async function DemosPage() {
  const unlocked = await hasDemoAccess();

  return (
    <main>
      {/* Premium hero band */}
      <section className="relative overflow-hidden border-b border-black/5 dark:border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_-10%,rgba(132,204,22,0.18),transparent_50%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-lime-500/15 text-lime-700 dark:text-lime-300 text-xs font-semibold px-4 py-1.5 mb-5">
            <Sparkles className="w-3.5 h-3.5" /> {liveCount} LIVE DEMOS · {VERTICALS.length} SECTORS
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">Explore demos by sector</h1>
          <p className={`mt-4 max-w-2xl mx-auto ${muted}`}>
            See a real, fully-working website for each industry — and log into its admin panel to feel how easy it is to customize.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            {["Live websites", "Real admin panels", "Fully customizable"].map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-300"><Check className="w-4 h-4 text-lime-500" /> {t}</span>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-14">
        {!unlocked && <div className="mb-12"><DemoGate /></div>}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {VERTICALS.map((v) => {
            const live = v.status === "live";
            const siteUrl = v.demoSubdomain ? `${proto}://${v.demoSubdomain}.${ROOT_DOMAIN}` : "#";
            const adminUrl = `${siteUrl}/admin/login`;
            return (
              <div key={v.id} className={`overflow-hidden flex flex-col ${card} hover:shadow-lg transition`}>
                <div className="relative h-40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img(v.name, 640, 360)} alt={v.name} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <span className="absolute top-3 left-3 w-10 h-10 rounded-xl flex items-center justify-center bg-white/90 text-slate-900"><VerticalIcon name={v.icon} className="w-5 h-5" /></span>
                  <span className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full ${live ? "bg-lime-500 text-white" : "bg-amber-400 text-slate-900"}`}>{live ? "● LIVE" : "COMING SOON"}</span>
                  <h3 className="absolute bottom-3 left-4 right-4 text-white font-bold text-lg drop-shadow">{v.name}</h3>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <p className="text-slate-400 dark:text-slate-500 text-xs">{v.tagline}</p>
                  <p className={`text-sm mt-2 flex-1 ${muted}`}>{v.description}</p>

                  {live ? (
                    unlocked ? (
                      <div className="mt-5 space-y-2.5">
                        <div className="grid grid-cols-2 gap-2">
                          <a href={siteUrl} target="_blank" className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-lime-500 text-white font-semibold px-3 py-2.5 text-sm hover:bg-lime-600">Open demo <ExternalLink className="w-3.5 h-3.5" /></a>
                          <a href={adminUrl} target="_blank" className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-black/15 dark:border-white/15 text-slate-800 dark:text-white font-semibold px-3 py-2.5 text-sm hover:bg-black/5 dark:hover:bg-white/10"><LayoutDashboard className="w-3.5 h-3.5" /> Admin panel</a>
                        </div>
                        <div className="rounded-lg bg-black/[0.03] dark:bg-white/5 px-3 py-2 text-xs text-slate-500 dark:text-slate-400">
                          Admin login: <span className="font-medium text-slate-700 dark:text-slate-200">{v.demoEmail}</span> · <span className="font-medium text-slate-700 dark:text-slate-200">{DEMO_PASSWORD}</span>
                        </div>
                        <Link href={`/subscribe?vertical=${v.id}`} className="block text-center text-sm font-semibold text-lime-600 dark:text-lime-400 hover:underline pt-1">Get this website →</Link>
                      </div>
                    ) : (
                      <div className="mt-5">
                        <span className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-black/5 dark:bg-white/5 text-slate-500 dark:text-slate-400 font-semibold px-4 py-2.5 text-sm"><Lock className="w-3.5 h-3.5" /> Unlock to view demo + admin</span>
                      </div>
                    )
                  ) : (
                    <Link href={`/subscribe?vertical=${v.id}`} className="mt-5 inline-flex items-center justify-center gap-1.5 rounded-lg border border-black/15 dark:border-white/15 text-slate-800 dark:text-white font-semibold px-4 py-2.5 text-sm hover:bg-black/5 dark:hover:bg-white/10">Notify me / enquire <ArrowRight className="w-4 h-4" /></Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
