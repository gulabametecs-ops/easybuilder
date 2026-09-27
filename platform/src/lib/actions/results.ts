"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireTenantId } from "./guard";
import { parseResultsCsv, DEFAULT_RESULT_CONFIG, resolveResultLayout, type ResultConfig } from "@/lib/results";

export type ResultState = { ok: boolean; message: string };

function s(fd: FormData, k: string) { return (fd.get(k)?.toString() ?? "").trim(); }

async function getResultConfig(tenantId: string): Promise<ResultConfig> {
  const cfg = await db.siteConfig.findUnique({ where: { tenantId } });
  try { return { ...DEFAULT_RESULT_CONFIG, ...(JSON.parse(cfg?.resultConfig || "{}") as object) }; }
  catch { return DEFAULT_RESULT_CONFIG; }
}

// Upload / import a results CSV for an exam.
export async function uploadResults(_prev: ResultState, formData: FormData): Promise<ResultState> {
  const tenantId = await requireTenantId();
  const examName = s(formData, "examName");
  const csv = formData.get("csv")?.toString() ?? "";
  const replace = formData.get("replace") === "on";
  const verifyDob = formData.get("verifyDob") === "on";
  if (!examName) return { ok: false, message: "Please enter an exam name (e.g. Annual Exam 2026)." };
  if (!csv.trim()) return { ok: false, message: "Please choose a CSV file." };

  const cfg = await getResultConfig(tenantId);
  const parsed = parseResultsCsv(csv, cfg.passPercent);
  if (parsed.errors.length) return { ok: false, message: parsed.errors.join(" ") };
  if (!parsed.students.length) return { ok: false, message: "No student rows found in the CSV." };

  // Upsert the exam.
  const exam = await db.resultExam.upsert({
    where: { tenantId_name: { tenantId, name: examName } },
    update: { verifyDob },
    create: { tenantId, name: examName, verifyDob },
  });

  if (replace) await db.studentResult.deleteMany({ where: { examId: exam.id } });

  await db.studentResult.createMany({
    data: parsed.students.map((st) => ({
      examId: exam.id,
      tenantId,
      rollNo: st.rollNo,
      name: st.name,
      className: st.className,
      section: st.section,
      fatherName: st.fatherName,
      motherName: st.motherName,
      dob: st.dob,
      subjects: JSON.stringify(st.subjects),
      total: st.total,
      maxTotal: st.maxTotal,
      percentage: st.percentage,
      grade: st.grade,
      status: st.status,
      remarks: st.remarks,
    })),
  });

  revalidatePath("/admin/results");
  revalidatePath("/result");
  return { ok: true, message: `Imported ${parsed.students.length} student result(s) for "${examName}" · subjects: ${parsed.subjects.join(", ")}.` };
}

function revalidateResults() {
  revalidatePath("/admin/results");
  revalidatePath("/result");
}

export async function deleteExam(examId: string) {
  const tenantId = await requireTenantId();
  await db.resultExam.deleteMany({ where: { id: examId, tenantId } });
  revalidateResults();
}

export async function toggleExamPublish(examId: string) {
  const tenantId = await requireTenantId();
  const e = await db.resultExam.findFirst({ where: { id: examId, tenantId } });
  if (!e) return;
  await db.resultExam.update({ where: { id: examId }, data: { published: !e.published } });
  revalidateResults();
}

// Save the marksheet / report-card template settings.
export async function saveResultConfig(formData: FormData) {
  const tenantId = await requireTenantId();
  const pass = parseInt(s(formData, "passPercent"), 10);
  const next: ResultConfig = {
    layout: resolveResultLayout(s(formData, "layout")),
    heading: s(formData, "heading") || "REPORT CARD",
    affiliation: s(formData, "affiliation"),
    principalName: s(formData, "principalName"),
    classTeacher: s(formData, "classTeacher"),
    footerNote: s(formData, "footerNote"),
    passPercent: isNaN(pass) ? 33 : Math.min(100, Math.max(0, pass)),
    showFather: formData.get("showFather") === "on",
    showMother: formData.get("showMother") === "on",
    showDob: formData.get("showDob") === "on",
    showSection: formData.get("showSection") === "on",
    showPerSubjectGrade: formData.get("showPerSubjectGrade") === "on",
    showRemarks: formData.get("showRemarks") === "on",
    showGradeLegend: formData.get("showGradeLegend") === "on",
    accent: s(formData, "accent"),
    watermark: s(formData, "watermark"),
    verifyByDob: formData.get("verifyByDob") === "on",
  };
  await db.siteConfig.update({ where: { tenantId }, data: { resultConfig: JSON.stringify(next) } });
  revalidateResults();
}
