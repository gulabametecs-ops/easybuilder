import Link from "next/link";
import { FileText, HardDrive } from "lucide-react";
import { getAuthedSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatBytes, formatLimit } from "@/lib/plans";
import { planFor, storageUsedBytes } from "@/lib/usage";
import { PageHeader, Card, EmptyState } from "@/components/admin/ui";
import { DeleteMediaButton } from "@/components/admin/DeleteMediaButton";

export const metadata = { title: "Storage" };

export default async function StoragePage() {
  const authed = await getAuthedSession();
  if (!authed) return null;
  const tenantId = authed.tenant.id;

  const [files, used, { limits }] = await Promise.all([
    db.mediaFile.findMany({ where: { tenantId }, orderBy: { createdAt: "desc" }, take: 500 }),
    storageUsedBytes(tenantId),
    planFor(authed.tenant),
  ]);
  const quota = (limits?.storageMb ?? 0) * 1024 * 1024;
  const pct = quota ? Math.min(100, (used / quota) * 100) : 0;
  const canDelete = authed.session.role === "owner" || authed.session.role === "admin";

  return (
    <>
      <PageHeader
        title="Storage"
        subtitle="Images, PDFs and documents you've uploaded. Your website, leads and text don't count."
      />
      <Card className="p-5 mb-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
          <span className="font-semibold text-slate-900 dark:text-white">
            {formatBytes(used)} used {quota ? `of ${formatBytes(quota)}` : `· ${formatLimit("storageMb", 0)} storage`}
          </span>
          {limits?.uploadMb ? <span className="text-xs text-slate-400">Max {formatLimit("uploadMb", limits.uploadMb)} per file</span> : null}
        </div>
        {quota > 0 && (
          <div className="mt-2 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div className={`h-full rounded-full ${pct >= 100 ? "bg-red-500" : pct >= 80 ? "bg-amber-500" : "bg-lime-500"}`} style={{ width: `${pct}%` }} />
          </div>
        )}
        {pct >= 80 && (
          <p className="text-xs text-amber-700 dark:text-amber-300 mt-2">
            Running low — delete files you no longer use, or <Link href="/admin/billing" className="font-semibold underline">upgrade your plan</Link>.
          </p>
        )}
      </Card>

      <Card>
        {files.length === 0 ? (
          <EmptyState icon={<HardDrive />} title="No uploads yet" hint="Images and documents you upload anywhere in the admin panel show up here." />
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {files.map((f) => (
              <li key={f.id} className="flex items-center gap-3 px-4 py-3">
                <a href={f.url} target="_blank" rel="noreferrer" className="w-12 h-12 shrink-0 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 overflow-hidden flex items-center justify-center">
                  {f.mime.startsWith("image/") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={f.url} alt="" loading="lazy" className="w-full h-full object-cover" />
                  ) : (
                    <FileText className="w-5 h-5 text-slate-400" />
                  )}
                </a>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{f.originalName || f.url.split("/").pop()}</p>
                  <p className="text-xs text-slate-400">
                    {formatBytes(f.bytes)} · {f.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                {canDelete && <DeleteMediaButton id={f.id} />}
              </li>
            ))}
          </ul>
        )}
      </Card>
      <p className="text-xs text-slate-400 mt-3">Files still used on your website can&apos;t be deleted here — remove them from the page, gallery or service first.</p>
    </>
  );
}
