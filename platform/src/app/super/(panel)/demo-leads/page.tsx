import Link from "next/link";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { db } from "@/lib/db";
import { sweepExpiredDemoSessions } from "@/lib/demoSession";
import { verticalName } from "@/lib/verticals";
import { BLOCKED, FOLLOW_UP_STATUSES, leadSearch, splitLeadMessage } from "@/lib/leadStatus";
import { PageHeader, Card, Badge, EmptyState } from "@/components/admin/ui";
import { LeadFollowUp } from "@/components/super/LeadFollowUp";
import { LeadActions } from "@/components/super/LeadActions";
import { FilterBar } from "@/components/super/FilterBar";

export const metadata = { title: "Demo leads" };

const fmt = (d: Date) => new Date(d).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });
const waLink = (phone: string) => {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits.length === 10 ? `91${digits}` : digits}`;
};
const TONE: Record<string, "slate" | "green" | "amber" | "blue" | "red"> = {
  new: "amber",
  verified: "blue",
  contacted: "blue",
  interested: "green",
  converted: "green",
  "not interested": "slate",
  blocked: "red",
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

  const [leads, counts, sectors] = await Promise.all([
    db.platformLead.findMany({
      // Blocked contacts only show under the "blocked" chip.
      where: { type: "demo", ...leadSearch(sp.q), ...(sp.sector ? { vertical: sp.sector } : {}), status: filter ?? { not: BLOCKED } },
      orderBy: { createdAt: "desc" },
      take: 200,
      include: { demoSessions: { orderBy: { createdAt: "asc" }, select: { vertical: true, pagesViewed: true } } },
    }),
    db.platformLead.groupBy({ by: ["status"], where: { type: "demo" }, _count: { _all: true } }),
    db.platformLead.groupBy({ by: ["vertical"], where: { type: "demo" } }),
  ]);
  const total = counts.reduce((n, c) => n + (c.status === BLOCKED ? 0 : c._count._all), 0);
  const countOf = (s: string) => counts.find((c) => c.status === s)?._count._all ?? 0;

  return (
    <>
      <PageHeader
        title="Demo leads"
        subtitle={`${total} people asked for a demo · sandboxes and their uploads are deleted when the timer ends; the lead stays here for follow-up`}
      />

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
      <div className="mb-4 flex flex-wrap gap-2">
        {[undefined, ...STATUSES].map((s) => {
          const on = s === filter;
          return (
            <Link
              key={s ?? "all"}
              href={qs(s)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${on ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"}`}
            >
              {s ?? "All"} <span className="opacity-60">{s ? countOf(s) : total}</span>
            </Link>
          );
        })}
      </div>

      {leads.length === 0 ? (
        <Card>
          <EmptyState title={filter ? `No ${filter} leads` : "No demo requests yet"} hint="Visitors start sector demos from the /demos page." />
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
              <Card key={l.id} className="p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-base font-semibold text-slate-900">{l.name}</p>
                      {l.company && <span className="text-sm text-slate-500">· {l.company}</span>}
                      <Badge tone={TONE[l.status] ?? "slate"}>{l.status}</Badge>
                      {l.verified && <Badge tone="green">OTP verified</Badge>}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {l.phone && (
                        <>
                          <a href={`tel:${l.phone.replace(/\s+/g, "")}`} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50">
                            <Phone className="h-3.5 w-3.5" /> {l.phone}
                          </a>
                          <a href={waLink(l.phone)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100">
                            <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                          </a>
                        </>
                      )}
                      {l.email && (
                        <a href={`mailto:${l.email}`} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50">
                          <Mail className="h-3.5 w-3.5" /> {l.email}
                        </a>
                      )}
                    </div>
                    <dl className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
                      <div className="flex gap-2">
                        <dt className="text-slate-400">Sector{sectors.length > 1 ? "s tried" : ""}:</dt>
                        <dd className="text-slate-700">{(sectors.length ? sectors : [l.vertical]).map(verticalName).join(", ")}</dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="text-slate-400">Requested:</dt>
                        <dd className="text-slate-700">{fmt(l.createdAt)}</dd>
                      </div>
                      {details.map((d) => {
                        const [k, ...v] = d.split(":");
                        return (
                          <div key={d} className="flex gap-2">
                            <dt className="text-slate-400">{k}:</dt>
                            <dd className="text-slate-700">{v.join(":").trim()}</dd>
                          </div>
                        );
                      })}
                      {pages.size > 0 && (
                        <div className="flex gap-2 sm:col-span-2">
                          <dt className="text-slate-400">Viewed:</dt>
                          <dd className="text-slate-700">{[...pages].join(", ")}</dd>
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
                          <li key={i} className="rounded-lg bg-slate-50 px-3 py-2 text-sm">
                            <p className="text-[11px] font-medium text-slate-400">{n.when}</p>
                            <p className="whitespace-pre-wrap text-slate-700">{n.text}</p>
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
