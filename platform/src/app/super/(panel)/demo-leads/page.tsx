import { BadgeCheck, Ban, CalendarPlus, Mail, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { db } from "@/lib/db";
import { sweepExpiredDemoSessions } from "@/lib/demoSession";
import { verticalName } from "@/lib/verticals";
import { BLOCKED, FOLLOW_UP_STATUSES, leadSearch, splitLeadMessage } from "@/lib/leadStatus";
import { PageHeader, Card, EmptyState } from "@/components/admin/ui";
import { Kpi, Avatar, Pill, Chips, LEAD_TONE, ago } from "@/components/super/kit";
import { LeadFollowUp } from "@/components/super/LeadFollowUp";
import { LeadActions } from "@/components/super/LeadActions";
import { FilterBar } from "@/components/super/FilterBar";

export const metadata = { title: "Demo leads" };

const fmt = (d: Date) => new Date(d).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });
const waLink = (phone: string) => {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits.length === 10 ? `91${digits}` : digits}`;
};
const STATUSES = [...FOLLOW_UP_STATUSES, BLOCKED];

export default async function DemoLeadsPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string; sector?: string }> }) {
  // Viewing the list also wipes any abandoned sandboxes (their data + uploads). Leads are kept.
  await sweepExpiredDemoSessions();
  const sp = await searchParams;
  const filter = STATUSES.find((s) => s === sp.status);
  const qs = (s?: string) => {
    const u = new URLSearchParams();
    if (s) u.set("status", s);
    if (sp.q) u.set("q", sp.q);
    if (sp.sector) u.set("sector", sp.sector);
    return u.size ? `/super/demo-leads?${u}` : "/super/demo-leads";
  };

  const weekAgo = new Date(new Date().getTime() - 7 * 86400000);
  const [leads, counts, sectors, week, verifiedCount] = await Promise.all([
    db.platformLead.findMany({
      // Blocked contacts only show under the "blocked" chip.
      where: { type: "demo", ...leadSearch(sp.q), ...(sp.sector ? { vertical: sp.sector } : {}), status: filter ?? { not: BLOCKED } },
      orderBy: { createdAt: "desc" },
      take: 200,
      include: { demoSessions: { orderBy: { createdAt: "asc" }, select: { vertical: true, pagesViewed: true } } },
    }),
    db.platformLead.groupBy({ by: ["status"], where: { type: "demo" }, _count: { _all: true } }),
    db.platformLead.groupBy({ by: ["vertical"], where: { type: "demo" } }),
    db.platformLead.count({ where: { type: "demo", status: { not: BLOCKED }, createdAt: { gte: weekAgo } } }),
    db.platformLead.count({ where: { type: "demo", status: { not: BLOCKED }, verified: true } }),
  ]);
  const total = counts.reduce((n, c) => n + (c.status === BLOCKED ? 0 : c._count._all), 0);
  const countOf = (s: string) => counts.find((c) => c.status === s)?._count._all ?? 0;

  return (
    <>
      <PageHeader
        title="Demo leads"
        subtitle="Sandboxes and their uploads are deleted when the timer ends; the lead stays here for follow-up."
        icon={<ShieldCheck />}
      />
      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Kpi label="Demo leads" value={total} hint="Excluding blocked" icon={<ShieldCheck />} tone="blue" />
        <Kpi label="New this week" value={week} hint="Last 7 days" icon={<CalendarPlus />} tone="violet" />
        <Kpi label="OTP verified" value={verifiedCount} hint={total ? `${Math.round((verifiedCount / total) * 100)}% verify rate` : undefined} icon={<BadgeCheck />} tone="green" />
        <Kpi label="Blocked" value={countOf(BLOCKED)} hint="Can't request demos" icon={<Ban />} tone="red" href={qs(BLOCKED)} />
      </div>

      <FilterBar
        q={sp.q}
        hidden={{ status: filter }}
        selects={[
          {
            name: "sector",
            label: "Sector",
            value: sp.sector,
            options: sectors.filter((s) => s.vertical).map((s) => ({ value: s.vertical, label: verticalName(s.vertical) })).sort((a, b) => a.label.localeCompare(b.label)),
          },
        ]}
      />
      <Chips items={[undefined, ...STATUSES].map((s) => ({ href: qs(s), label: s ?? "All", count: s ? countOf(s) : total, active: s === filter }))} />

      {leads.length === 0 ? (
        <Card>
          <EmptyState icon={<ShieldCheck />} title={filter ? `No ${filter} leads` : "No demo requests yet"} hint="Visitors start sector demos from the /demos page." />
        </Card>
      ) : (
        <div className="space-y-3">
          {leads.map((l) => {
            const { details, notes } = splitLeadMessage(l.message);
            const sectors = [...new Set(l.demoSessions.map((s) => s.vertical))];
            const pages = new Set<string>();
            for (const s of l.demoSessions) {
              try {
                for (const p of JSON.parse(s.pagesViewed || "[]") as string[]) pages.add(p);
              } catch {
                /* ignore bad JSON */
              }
            }
            return (
              <Card key={l.id} className="p-4 sm:p-5 transition hover:shadow-lg">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <Avatar name={l.name} size="lg" />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-base font-bold text-slate-900 dark:text-white">{l.name}</p>
                          <Pill tone={LEAD_TONE[l.status] ?? "slate"}>{l.status}</Pill>
                          {l.verified && <Pill tone="green">OTP verified</Pill>}
                        </div>
                        <p className="truncate text-xs text-slate-400 dark:text-slate-500">{l.company ? `${l.company} · ` : ""}{ago(l.createdAt)}</p>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {l.phone && (
                        <>
                          <a href={`tel:${l.phone.replace(/\s+/g, "")}`} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5">
                            <Phone className="h-3.5 w-3.5" /> {l.phone}
                          </a>
                          <a href={waLink(l.phone)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
                            <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                          </a>
                        </>
                      )}
                      {l.email && (
                        <a href={`mailto:${l.email}`} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5">
                          <Mail className="h-3.5 w-3.5" /> {l.email}
                        </a>
                      )}
                    </div>
                    <dl className="mt-3 grid gap-x-6 gap-y-1 rounded-xl bg-slate-50 p-3 text-sm dark:bg-white/[0.03] sm:grid-cols-2">
                      <div className="flex gap-2">
                        <dt className="shrink-0 text-slate-400">Sector{sectors.length > 1 ? "s tried" : ""}:</dt>
                        <dd className="min-w-0 break-words text-slate-700 dark:text-slate-200">{(sectors.length ? sectors : [l.vertical]).map(verticalName).join(", ")}</dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="shrink-0 text-slate-400">Requested:</dt>
                        <dd className="min-w-0 break-words text-slate-700 dark:text-slate-200">{fmt(l.createdAt)}</dd>
                      </div>
                      {details.map((d) => {
                        const [k, ...v] = d.split(":");
                        return (
                          <div key={d} className="flex gap-2">
                            <dt className="shrink-0 text-slate-400">{k}:</dt>
                            <dd className="min-w-0 break-words text-slate-700 dark:text-slate-200">{v.join(":").trim()}</dd>
                          </div>
                        );
                      })}
                      {pages.size > 0 && (
                        <div className="flex gap-2 sm:col-span-2">
                          <dt className="shrink-0 text-slate-400">Viewed:</dt>
                          <dd className="min-w-0 break-words text-slate-700 dark:text-slate-200">{[...pages].join(", ")}</dd>
                        </div>
                      )}
                    </dl>
                  </div>

                  <div className="w-full shrink-0 lg:w-96">
                    <div className="mb-3 flex justify-end">
                      <LeadActions leadId={l.id} blocked={l.status === BLOCKED} name={l.name} />
                    </div>
                    {l.status !== BLOCKED && <LeadFollowUp leadId={l.id} status={l.status} />}
                    {notes.length > 0 && (
                      <ul className="mt-3 space-y-2">
                        {notes.map((n, i) => (
                          <li key={i} className="rounded-lg border-l-2 border-lime-500 bg-slate-50 px-3 py-2 text-sm dark:bg-white/[0.03]">
                            <p className="text-[11px] font-medium text-slate-400">{n.when}</p>
                            <p className="whitespace-pre-wrap text-slate-700 dark:text-slate-200">{n.text}</p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
