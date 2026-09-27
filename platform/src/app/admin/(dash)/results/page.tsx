import { getAuthedSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { ROOT_DOMAIN } from "@/lib/domains";
import { DEFAULT_RESULT_CONFIG, type ResultConfig } from "@/lib/results";
import { ResultsManager } from "@/components/admin/ResultsManager";

export const metadata = { title: "Results" };

export default async function ResultsPage() {
  const authed = await getAuthedSession();
  if (!authed) return null;
  const { tenant } = authed;

  const [exams, siteConfig] = await Promise.all([
    db.resultExam.findMany({
      where: { tenantId: tenant.id },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { results: true } } },
    }),
    db.siteConfig.findUnique({ where: { tenantId: tenant.id } }),
  ]);

  let cfg: ResultConfig = DEFAULT_RESULT_CONFIG;
  try { cfg = { ...DEFAULT_RESULT_CONFIG, ...(JSON.parse(siteConfig?.resultConfig || "{}") as object) }; } catch { /* defaults */ }

  const base = tenant.customDomain ? `https://${tenant.customDomain}` : `http://${tenant.subdomain}.${ROOT_DOMAIN}`;

  return (
    <div className="admin-full-bleed flex flex-col flex-1 min-h-0">
      <ResultsManager
        exams={exams.map((e) => ({ id: e.id, name: e.name, published: e.published, verifyDob: e.verifyDob, count: e._count.results }))}
        config={cfg}
        resultUrl={`${base}/result`}
      />
    </div>
  );
}
