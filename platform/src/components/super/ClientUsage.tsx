import { CalendarClock, Database, FileStack, Images, Sparkles, Users, Wrench, ShieldAlert, Globe, Lock, Archive } from "lucide-react";
import { formatBytes, formatLimit, type PlanLimits } from "@/lib/plans";
import { ADMIN_GRACE_DAYS } from "@/lib/subscription";
import { Card } from "@/components/admin/ui";

type Usage = { pages: number; services: number; gallery: number; users: number; aiEdits: number; storageBytes: number };

const ROWS = [
  { key: "storageMb", label: "Storage", icon: Database },
  { key: "pages", label: "Custom pages", icon: FileStack },
  { key: "services", label: "Services", icon: Wrench },
  { key: "gallery", label: "Gallery photos", icon: Images },
  { key: "users", label: "Admin logins", icon: Users },
  { key: "aiEdits", label: "AI edits this month", icon: Sparkles },
] as const;

const DAY = 86_400_000;
const fmtDate = (d: Date) => d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });

/** Plan usage: one bar per limit with used / limit and what's left. */
export function PlanUsage({ usage, limits, planName }: { usage: Usage; limits: PlanLimits | null; planName: string }) {
  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="font-semibold text-slate-900">Plan usage</h3>
        <span className="rounded-full bg-lime-50 px-2.5 py-0.5 text-xs font-semibold text-lime-700 dark:bg-lime-950/40 dark:text-lime-300">{planName}</span>
      </div>
      <ul className="space-y-4">
        {ROWS.map(({ key, label, icon: Icon }) => {
          const limit = limits?.[key] ?? 0; // 0 = unlimited
          const usedNum = key === "storageMb" ? usage.storageBytes : usage[key];
          const limitNum = key === "storageMb" ? limit * 1024 * 1024 : limit;
          const pct = limitNum > 0 ? Math.min(100, (usedNum / limitNum) * 100) : 0;
          const used = key === "storageMb" ? formatBytes(usedNum) : usedNum.toLocaleString("en-IN");
          const left = limitNum > 0 ? Math.max(0, limitNum - usedNum) : null;
          const leftLabel = left === null ? "No limit" : `${key === "storageMb" ? formatBytes(left) : left.toLocaleString("en-IN")} left`;
          const bar = pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-amber-500" : "admin-grad";
          return (
            <li key={key}>
              <div className="mb-1.5 flex items-center justify-between gap-2 text-sm">
                <span className="flex items-center gap-2 font-medium text-slate-700">
                  <Icon className="h-4 w-4 text-slate-400" /> {label}
                </span>
                <span className="text-slate-500">
                  <b className="text-slate-900">{used}</b> / {formatLimit(key, limit)}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div className={`h-full rounded-full ${bar}`} style={{ width: `${limitNum > 0 ? Math.max(pct, usedNum > 0 ? 2 : 0) : 100}%`, opacity: limitNum > 0 ? 1 : 0.25 }} />
              </div>
              <p className={`mt-1 text-right text-[11px] font-medium ${pct >= 90 ? "text-red-600" : "text-slate-400"}`}>{leftLabel}</p>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

/** What happens when: license end → site offline → admin grace ends. Data is never auto-deleted. */
export function LicenseTimeline({ endsAt, status, now = new Date() }: { endsAt: Date | null; status: string; now?: Date }) {
  if (status === "suspended") {
    return (
      <Card className="p-5">
        <h3 className="mb-2 flex items-center gap-2 font-semibold text-slate-900"><ShieldAlert className="h-4 w-4 text-red-500" /> Suspended</h3>
        <p className="text-sm text-slate-500">Site and admin are offline until you re-activate it. Data is kept.</p>
      </Card>
    );
  }
  if (!endsAt) {
    return (
      <Card className="p-5">
        <h3 className="mb-2 flex items-center gap-2 font-semibold text-slate-900"><CalendarClock className="h-4 w-4 text-lime-600" /> Lifetime licence</h3>
        <p className="text-sm text-slate-500">Never expires. Data is kept until you delete the client.</p>
      </Card>
    );
  }
  const graceEnds = new Date(endsAt.getTime() + ADMIN_GRACE_DAYS * DAY);
  const daysLeft = Math.ceil((endsAt.getTime() - now.getTime()) / DAY);
  const graceLeft = Math.ceil((graceEnds.getTime() - now.getTime()) / DAY);
  const total = 365 * DAY;
  const pct = Math.max(0, Math.min(100, ((endsAt.getTime() - now.getTime()) / total) * 100));
  const steps = [
    { icon: Globe, title: "Licence ends · site goes offline", when: endsAt, done: daysLeft <= 0 },
    { icon: Lock, title: `Admin locked (after ${ADMIN_GRACE_DAYS}-day renew window)`, when: graceEnds, done: graceLeft <= 0 },
    { icon: Archive, title: "Data kept — never auto-deleted", when: null, done: false },
  ];
  const tone = daysLeft <= 0 ? "text-red-600" : daysLeft <= 30 ? "text-amber-600" : "text-emerald-600";
  return (
    <Card className="p-5">
      <h3 className="mb-3 flex items-center gap-2 font-semibold text-slate-900"><CalendarClock className="h-4 w-4 text-lime-600" /> Licence timeline</h3>
      <p className={`font-display text-3xl font-extrabold ${tone}`}>
        {daysLeft > 0 ? `${daysLeft} days left` : graceLeft > 0 ? `Expired · ${graceLeft} days to renew` : "Expired"}
      </p>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div className={`h-full rounded-full ${daysLeft <= 30 ? "bg-amber-500" : "admin-grad"}`} style={{ width: `${pct}%` }} />
      </div>
      <ol className="mt-4 space-y-3">
        {steps.map((s) => (
          <li key={s.title} className="flex items-start gap-3 text-sm">
            <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${s.done ? "bg-red-50 text-red-600 dark:bg-red-950/40" : "bg-slate-100 text-slate-500 dark:bg-slate-800"}`}>
              <s.icon className="h-3.5 w-3.5" />
            </span>
            <span>
              <span className="block font-medium text-slate-800">{s.title}</span>
              {s.when && <span className="text-xs text-slate-400">{fmtDate(s.when)}{s.done ? " · passed" : ""}</span>}
            </span>
          </li>
        ))}
      </ol>
    </Card>
  );
}
