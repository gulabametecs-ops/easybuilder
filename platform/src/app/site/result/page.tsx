import { notFound } from "next/navigation";
import { Search, FileText, AlertCircle } from "lucide-react";
import { getCurrentTenant, getTenantConfig } from "@/lib/tenant";
import { db } from "@/lib/db";
import { DEFAULT_RESULT_CONFIG, type ResultConfig, type Subject } from "@/lib/results";
import { Marksheet, type MarksheetStudent } from "@/components/site/Marksheet";

export const metadata = { title: "Check Result" };

type Props = { searchParams: Promise<{ exam?: string; roll?: string; dob?: string }> };

export default async function ResultPage({ searchParams }: Props) {
  const tenant = await getCurrentTenant();
  if (!tenant) notFound();
  const sp = await searchParams;

  const [config, exams] = await Promise.all([
    getTenantConfig(tenant.id, tenant.name),
    db.resultExam.findMany({ where: { tenantId: tenant.id, published: true }, orderBy: { createdAt: "desc" } }),
  ]);
  let cfg: ResultConfig = DEFAULT_RESULT_CONFIG;
  try { cfg = { ...DEFAULT_RESULT_CONFIG, ...(JSON.parse(config.resultConfig || "{}") as object) }; } catch { /* defaults */ }

  const school = {
    name: config.header.logoText || tenant.name,
    logo: config.header.logoImage || config.seo.favicon || "",
    address: config.header.topbar.address || config.footer.contact.address || "",
    phone: config.header.topbar.phones?.[0] || "",
  };

  const roll = (sp.roll || "").trim();
  const examId = sp.exam || (exams.length === 1 ? exams[0].id : "");
  const dob = (sp.dob || "").trim();

  let found: MarksheetStudent | null = null;
  let error = "";
  if (roll) {
    const exam = exams.find((e) => e.id === examId) || (exams.length === 1 ? exams[0] : null);
    if (!exam) error = "Please select an examination.";
    else {
      const row = await db.studentResult.findFirst({ where: { examId: exam.id, tenantId: tenant.id, rollNo: roll } });
      const needDob = exam.verifyDob || cfg.verifyByDob;
      if (!row) error = "No result found for this roll number. Please check and try again.";
      else if (needDob && dob && row.dob.trim() !== dob) error = "Roll number and date of birth do not match.";
      else if (needDob && !dob) error = "Please enter your date of birth.";
      else {
        let subjects: Subject[] = [];
        try { subjects = JSON.parse(row.subjects) as Subject[]; } catch { subjects = []; }
        found = { rollNo: row.rollNo, name: row.name, className: row.className, section: row.section, fatherName: row.fatherName, motherName: row.motherName, dob: row.dob, remarks: row.remarks, subjects, total: row.total, maxTotal: row.maxTotal, percentage: row.percentage, grade: row.grade, status: row.status };
        return (
          <section className="py-10 sm:py-14 bg-light min-h-[60vh]">
            <div className="mx-auto max-w-4xl px-4">
              <Marksheet student={found} examName={exam.name} config={cfg} school={school} />
            </div>
          </section>
        );
      }
    }
  }

  // When opened from a notice link (?exam=id) the search is scoped to that exam.
  const scoped = exams.find((e) => e.id === (sp.exam || ""));
  const needDobField = (scoped ? scoped.verifyDob : exams.some((e) => e.verifyDob)) || cfg.verifyByDob;

  return (
    <section className="py-16 sm:py-24 bg-light min-h-[60vh] print:hidden">
      <div className="mx-auto max-w-lg px-4">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4"><Search className="w-7 h-7" /></div>
          <h1 className="text-3xl font-extrabold text-heading">Check Your Result</h1>
          <p className="text-slate-500 mt-2">{scoped ? scoped.name : "Enter your roll number to view and download your marksheet."}</p>
        </div>

        {exams.length === 0 ? (
          <div className="rounded-2xl border border-black/10 bg-white p-8 text-center">
            <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-500">Results have not been published yet. Please check back later.</p>
          </div>
        ) : (
          <form method="get" className="rounded-2xl border border-black/10 bg-white shadow-lg p-6 space-y-4">
            {scoped ? (
              <>
                <input type="hidden" name="exam" value={scoped.id} />
                <div className="rounded-lg bg-primary/[0.06] border border-primary/20 px-3.5 py-2.5 text-sm font-semibold text-heading">{scoped.name}</div>
              </>
            ) : exams.length > 1 ? (
              <label className="block"><span className="block text-sm font-medium text-slate-600 mb-1">Examination</span>
                <select name="exam" defaultValue={examId} className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-primary">
                  {exams.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
                </select>
              </label>
            ) : (
              <input type="hidden" name="exam" value={exams[0].id} />
            )}
            <label className="block"><span className="block text-sm font-medium text-slate-600 mb-1">Roll Number</span>
              <input name="roll" defaultValue={roll} required placeholder="e.g. 101" className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-primary" /></label>
            {needDobField && (
              <label className="block"><span className="block text-sm font-medium text-slate-600 mb-1">Date of Birth</span>
                <input name="dob" defaultValue={dob} placeholder="As entered by school (e.g. 14-05-2010)" className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-primary" /></label>
            )}
            {error && <p className="text-sm text-rose-600 flex items-center gap-1.5"><AlertCircle className="w-4 h-4" /> {error}</p>}
            <button className="btn-primary w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold">
              <Search className="w-4 h-4" /> View Result
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
