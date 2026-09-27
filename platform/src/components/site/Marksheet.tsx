import { gradeFor, GRADE_LEGEND, RESULT_LAYOUTS, resolveResultLayout, type ResultConfig, type Subject } from "@/lib/results";
import { PrintButton } from "@/components/PrintButton";
import type { ReactNode } from "react";

export type MarksheetStudent = {
  rollNo: string; name: string; className: string; section: string;
  fatherName: string; motherName: string; dob: string; remarks: string;
  subjects: Subject[]; total: number; maxTotal: number; percentage: number; grade: string; status: string;
};

type School = { name: string; logo: string; address: string; phone: string };

type Ctx = {
  student: MarksheetStudent;
  examName: string;
  config: ResultConfig;
  school: School;
  accent: string;
  watermark: string;
  pass: boolean;
  classLabel: string;
};

function subjectGrade(s: Subject) {
  return gradeFor(s.max ? (s.obtained / s.max) * 100 : 0);
}

function Logo({ school, accent, size = "w-16 h-16" }: { school: School; accent: string; size?: string }) {
  if (school.logo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={school.logo} alt="" className={`${size} object-contain shrink-0`} />;
  }
  return (
    <div className={`${size} rounded-full flex items-center justify-center text-white text-2xl font-black shrink-0`} style={{ background: accent }}>
      {school.name.charAt(0)}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex text-sm">
      <span className="w-32 shrink-0 text-slate-500">{label}</span>
      <span className="font-semibold text-slate-800">: {value || "—"}</span>
    </div>
  );
}

function StudentFields({ ctx, cols = 2 }: { ctx: Ctx; cols?: 1 | 2 }) {
  const { student: st, config } = ctx;
  const items: { label: string; value: string }[] = [
    { label: "Student Name", value: st.name },
    { label: "Roll Number", value: st.rollNo },
    { label: "Class", value: ctx.classLabel },
  ];
  if (config.showFather) items.push({ label: "Father's Name", value: st.fatherName });
  if (config.showMother) items.push({ label: "Mother's Name", value: st.motherName });
  if (config.showDob) items.push({ label: "Date of Birth", value: st.dob });
  return (
    <div className={cols === 2 ? "grid sm:grid-cols-2 gap-x-8 gap-y-1.5" : "space-y-1"}>
      {items.map((it) => <InfoRow key={it.label} label={it.label} value={it.value} />)}
    </div>
  );
}

function MarksTable({ ctx, dense = false }: { ctx: Ctx; dense?: boolean }) {
  const { student: st, config, accent } = ctx;
  const py = dense ? "py-1.5" : "py-2";
  const text = dense ? "text-xs" : "text-sm";
  return (
    <table className={`w-full mt-4 ${text} border-collapse`}>
      <thead>
        <tr className="text-white" style={{ background: accent }}>
          <th className={`text-left px-3 ${py} font-semibold`}>Subject</th>
          <th className={`px-3 ${py} font-semibold w-20 text-center`}>Max</th>
          <th className={`px-3 ${py} font-semibold w-24 text-center`}>Obtained</th>
          {config.showPerSubjectGrade && <th className={`px-3 ${py} font-semibold w-16 text-center`}>Grade</th>}
        </tr>
      </thead>
      <tbody>
        {st.subjects.map((s, i) => (
          <tr key={i} className={i % 2 ? "bg-slate-50" : ""}>
            <td className={`px-3 ${py} border border-slate-200 font-medium`}>{s.name}</td>
            <td className={`px-3 ${py} border border-slate-200 text-center`}>{s.max}</td>
            <td className={`px-3 ${py} border border-slate-200 text-center font-semibold`}>{s.obtained}</td>
            {config.showPerSubjectGrade && <td className={`px-3 ${py} border border-slate-200 text-center`}>{subjectGrade(s)}</td>}
          </tr>
        ))}
        <tr className="font-bold" style={{ background: `color-mix(in srgb, ${accent} 12%, white)` }}>
          <td className={`px-3 ${py} border border-slate-200`}>Total</td>
          <td className={`px-3 ${py} border border-slate-200 text-center`}>{st.maxTotal}</td>
          <td className={`px-3 ${py} border border-slate-200 text-center`}>{st.total}</td>
          {config.showPerSubjectGrade && <td className={`px-3 ${py} border border-slate-200 text-center`}>{st.grade}</td>}
        </tr>
      </tbody>
    </table>
  );
}

function SummaryCards({ ctx }: { ctx: Ctx }) {
  const { student: st, accent, pass } = ctx;
  return (
    <div className="grid grid-cols-3 gap-3 mt-5 text-center">
      <div className="rounded-lg border border-slate-200 py-3">
        <p className="text-xs text-slate-500">Percentage</p>
        <p className="text-xl font-black" style={{ color: accent }}>{st.percentage}%</p>
      </div>
      <div className="rounded-lg border border-slate-200 py-3">
        <p className="text-xs text-slate-500">Grade</p>
        <p className="text-xl font-black" style={{ color: accent }}>{st.grade}</p>
      </div>
      <div className={`rounded-lg py-3 ${pass ? "bg-emerald-50 border border-emerald-200" : "bg-rose-50 border border-rose-200"}`}>
        <p className="text-xs text-slate-500">Result</p>
        <p className={`text-xl font-black ${pass ? "text-emerald-600" : "text-rose-600"}`}>{st.status}</p>
      </div>
    </div>
  );
}

function Signatures({ ctx }: { ctx: Ctx }) {
  return (
    <div className="flex justify-between items-end mt-10 pt-2">
      <div className="text-center">
        <div className="w-36 border-t border-slate-400" />
        <p className="text-xs text-slate-500 mt-1">{ctx.config.classTeacher || "Class Teacher"}</p>
      </div>
      <div className="text-center">
        <div className="w-36 border-t border-slate-400" />
        <p className="text-xs text-slate-500 mt-1">{ctx.config.principalName || "Principal"}</p>
      </div>
    </div>
  );
}

function FooterBits({ ctx }: { ctx: Ctx }) {
  const { config, student: st } = ctx;
  return (
    <>
      {config.showRemarks && st.remarks && (
        <p className="mt-4 text-sm"><span className="text-slate-500">Remarks:</span> <span className="font-medium">{st.remarks}</span></p>
      )}
      {config.showGradeLegend && (
        <div className="mt-4 text-[11px] text-slate-500">
          <span className="font-semibold">Grading:</span> {GRADE_LEGEND.map((g) => `${g.grade} (${g.range})`).join("  ·  ")}
        </div>
      )}
      {config.footerNote && <p className="text-center text-[11px] text-slate-400 mt-6">{config.footerNote}</p>}
    </>
  );
}

function Watermark({ text }: { text: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
      <span className="text-6xl sm:text-7xl font-black uppercase opacity-[0.04] rotate-[-25deg] whitespace-nowrap text-center leading-none">{text}</span>
    </div>
  );
}

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="print:m-0">
      <div className="flex items-center justify-end gap-3 mb-4 no-print print:hidden">
        <PrintButton />
        <a href="/result" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">Check another</a>
      </div>
      {children}
    </div>
  );
}

/* ── Layouts ─────────────────────────────────────────────────────────────────── */

function ClassicLayout({ ctx }: { ctx: Ctx }) {
  const { school, config, accent, examName, watermark } = ctx;
  return (
    <div className="marksheet relative bg-white text-slate-800 max-w-3xl mx-auto border-2 rounded-lg overflow-hidden shadow-lg print:shadow-none" style={{ borderColor: accent }}>
      <Watermark text={watermark} />
      <div className="relative p-6 sm:p-8">
        <div className="flex items-center gap-4 border-b-2 pb-4" style={{ borderColor: accent }}>
          <Logo school={school} accent={accent} />
          <div className="flex-1 text-center">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: accent }}>{school.name}</h1>
            {config.affiliation && <p className="text-xs text-slate-500">{config.affiliation}</p>}
            {school.address && <p className="text-xs text-slate-500">{school.address}{school.phone ? ` · ${school.phone}` : ""}</p>}
          </div>
        </div>
        <div className="text-center my-4">
          <span className="inline-block text-white text-sm font-bold tracking-widest px-5 py-1.5 rounded-full" style={{ background: accent }}>{config.heading || "REPORT CARD"}</span>
          <p className="mt-2 text-sm font-semibold text-slate-600">{examName}</p>
        </div>
        <div className="py-4 border-y border-slate-200"><StudentFields ctx={ctx} /></div>
        <MarksTable ctx={ctx} />
        <SummaryCards ctx={ctx} />
        <FooterBits ctx={ctx} />
        <Signatures ctx={ctx} />
      </div>
    </div>
  );
}

function FormalLayout({ ctx }: { ctx: Ctx }) {
  const { school, config, accent, examName, watermark, student: st, pass } = ctx;
  return (
    <div className="marksheet relative bg-white text-slate-900 max-w-3xl mx-auto shadow-lg print:shadow-none" style={{ border: `3px double ${accent}`, padding: 4 }}>
      <div className="border border-slate-800 relative p-5 sm:p-7">
        <Watermark text={watermark} />
        <div className="relative text-center border-b border-slate-800 pb-3">
          <div className="flex justify-center mb-2"><Logo school={school} accent={accent} size="w-14 h-14" /></div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold uppercase tracking-wide">{school.name}</h1>
          {config.affiliation && <p className="text-[11px] italic text-slate-600 mt-0.5">{config.affiliation}</p>}
          {school.address && <p className="text-[10px] text-slate-500 mt-1">{school.address}{school.phone ? ` · Ph: ${school.phone}` : ""}</p>}
          <p className="mt-3 text-sm font-bold uppercase tracking-[0.2em] underline underline-offset-4">{config.heading || "ANNUAL REPORT CARD"}</p>
          <p className="text-xs mt-1 font-medium">{examName}</p>
        </div>
        <div className="relative mt-4 text-sm space-y-1 border border-slate-300 p-3 bg-slate-50/50">
          <StudentFields ctx={ctx} cols={1} />
        </div>
        <MarksTable ctx={ctx} />
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm border border-slate-800 px-3 py-2">
          <span><b>Percentage:</b> {st.percentage}%</span>
          <span><b>Grade:</b> {st.grade}</span>
          <span className={pass ? "text-emerald-700 font-bold" : "text-rose-700 font-bold"}>RESULT: {st.status.toUpperCase()}</span>
        </div>
        <FooterBits ctx={ctx} />
        <Signatures ctx={ctx} />
      </div>
    </div>
  );
}

function ModernLayout({ ctx }: { ctx: Ctx }) {
  const { school, config, accent, examName, watermark, student: st, pass } = ctx;
  return (
    <div className="marksheet relative bg-white text-slate-800 max-w-3xl mx-auto shadow-lg print:shadow-none overflow-hidden flex">
      <div className="w-2 sm:w-3 shrink-0" style={{ background: accent }} />
      <div className="relative flex-1 p-6 sm:p-8">
        <Watermark text={watermark} />
        <div className="relative flex items-start gap-4">
          <Logo school={school} accent={accent} size="w-12 h-12" />
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">{school.name}</h1>
            <p className="text-xs text-slate-500 mt-0.5">{config.affiliation || school.address}</p>
            <p className="text-[11px] font-semibold uppercase tracking-wider mt-3" style={{ color: accent }}>{config.heading || "Report card"} · {examName}</p>
          </div>
          <div className={`shrink-0 rounded-xl px-3 py-2 text-center ${pass ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
            <p className="text-[10px] uppercase font-bold opacity-70">Result</p>
            <p className="text-sm font-black">{st.status}</p>
          </div>
        </div>
        <div className="relative mt-5 grid sm:grid-cols-2 gap-4">
          <div className="rounded-xl bg-slate-50 p-3"><StudentFields ctx={ctx} cols={1} /></div>
          <div className="rounded-xl border border-slate-100 p-3 flex flex-col justify-center gap-2 text-center">
            <div><p className="text-[10px] text-slate-400 uppercase">Percentage</p><p className="text-3xl font-black" style={{ color: accent }}>{st.percentage}%</p></div>
            <div><p className="text-[10px] text-slate-400 uppercase">Grade</p><p className="text-xl font-bold">{st.grade}</p></div>
          </div>
        </div>
        <MarksTable ctx={ctx} />
        <FooterBits ctx={ctx} />
        <Signatures ctx={ctx} />
      </div>
    </div>
  );
}

function CompactLayout({ ctx }: { ctx: Ctx }) {
  const { school, config, accent, examName, watermark, student: st, pass } = ctx;
  return (
    <div className="marksheet relative bg-white text-slate-800 max-w-3xl mx-auto border border-slate-300 shadow print:shadow-none overflow-hidden">
      <Watermark text={watermark} />
      <div className="relative px-4 py-3 flex items-center gap-3 border-b" style={{ borderColor: accent, background: `color-mix(in srgb, ${accent} 8%, white)` }}>
        <Logo school={school} accent={accent} size="w-10 h-10" />
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-bold truncate">{school.name}</h1>
          <p className="text-[10px] text-slate-500 truncate">{config.heading || "REPORT CARD"} · {examName}</p>
        </div>
        <div className="text-right text-xs shrink-0">
          <p className="font-bold" style={{ color: accent }}>{st.percentage}% · {st.grade}</p>
          <p className={`font-semibold ${pass ? "text-emerald-600" : "text-rose-600"}`}>{st.status}</p>
        </div>
      </div>
      <div className="relative px-4 py-2 text-xs border-b border-slate-200 flex flex-wrap gap-x-4 gap-y-0.5">
        <span><b>Name:</b> {st.name}</span>
        <span><b>Roll:</b> {st.rollNo}</span>
        <span><b>Class:</b> {ctx.classLabel}</span>
        {config.showFather && st.fatherName && <span><b>Father:</b> {st.fatherName}</span>}
        {config.showDob && st.dob && <span><b>DOB:</b> {st.dob}</span>}
      </div>
      <div className="relative px-3 pb-4">
        <MarksTable ctx={ctx} dense />
        <FooterBits ctx={ctx} />
        <div className="flex justify-between items-end mt-6 text-[10px] text-slate-500">
          <div className="text-center w-28"><div className="border-t border-slate-400" /><p className="mt-1">{config.classTeacher || "Class Teacher"}</p></div>
          <div className="text-center w-28"><div className="border-t border-slate-400" /><p className="mt-1">{config.principalName || "Principal"}</p></div>
        </div>
      </div>
    </div>
  );
}

function ElegantLayout({ ctx }: { ctx: Ctx }) {
  const { school, config, accent, examName, watermark } = ctx;
  return (
    <div className="marksheet relative max-w-3xl mx-auto shadow-lg print:shadow-none overflow-hidden" style={{ background: "#fffef8", border: `1px solid ${accent}` }}>
      <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${accent}, #d4a017, ${accent})` }} />
      <div className="relative p-6 sm:p-8">
        <Watermark text={watermark} />
        <div className="relative text-center">
          <div className="flex justify-center mb-2"><Logo school={school} accent={accent} size="w-14 h-14" /></div>
          <h1 className="text-2xl font-serif font-semibold tracking-wide" style={{ color: accent }}>{school.name}</h1>
          {config.affiliation && <p className="text-xs text-amber-900/60 mt-1">{config.affiliation}</p>}
          <div className="mx-auto my-4 w-24 h-px" style={{ background: accent }} />
          <p className="text-sm font-serif italic tracking-widest uppercase" style={{ color: accent }}>{config.heading || "Certificate of Achievement"}</p>
          <p className="text-xs text-slate-500 mt-1">{examName}</p>
        </div>
        <div className="relative mt-5 rounded-sm border px-4 py-3" style={{ borderColor: `${accent}55` }}>
          <StudentFields ctx={ctx} />
        </div>
        <MarksTable ctx={ctx} />
        <SummaryCards ctx={ctx} />
        <FooterBits ctx={ctx} />
        <Signatures ctx={ctx} />
      </div>
      <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${accent}, #d4a017, ${accent})` }} />
    </div>
  );
}

function BoldLayout({ ctx }: { ctx: Ctx }) {
  const { school, config, accent, examName, watermark, student: st, pass } = ctx;
  return (
    <div className="marksheet relative bg-white text-slate-800 max-w-3xl mx-auto overflow-hidden shadow-lg print:shadow-none border border-slate-200">
      <div className="relative text-white px-6 py-5" style={{ background: accent }}>
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-white/15 p-1"><Logo school={school} accent={accent} size="w-14 h-14" /></div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-black tracking-tight">{school.name}</h1>
            {config.affiliation && <p className="text-xs text-white/80">{config.affiliation}</p>}
            <p className="text-sm font-bold mt-2 uppercase tracking-wider opacity-95">{config.heading || "REPORT CARD"}</p>
            <p className="text-xs text-white/75">{examName}</p>
          </div>
          <div className={`shrink-0 w-20 h-20 rounded-full border-4 border-white flex flex-col items-center justify-center ${pass ? "bg-emerald-500" : "bg-rose-600"}`}>
            <span className="text-[9px] font-bold uppercase opacity-90">Result</span>
            <span className="text-sm font-black leading-tight">{st.status}</span>
          </div>
        </div>
      </div>
      <div className="relative p-6">
        <Watermark text={watermark} />
        <StudentFields ctx={ctx} />
        <MarksTable ctx={ctx} />
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl text-white p-4 text-center" style={{ background: accent }}>
            <p className="text-xs uppercase opacity-80">Percentage</p>
            <p className="text-3xl font-black">{st.percentage}%</p>
          </div>
          <div className="rounded-xl border-2 p-4 text-center" style={{ borderColor: accent }}>
            <p className="text-xs uppercase text-slate-500">Overall grade</p>
            <p className="text-3xl font-black" style={{ color: accent }}>{st.grade}</p>
          </div>
        </div>
        <FooterBits ctx={ctx} />
        <Signatures ctx={ctx} />
      </div>
    </div>
  );
}

export function Marksheet({ student, examName, config, school }: { student: MarksheetStudent; examName: string; config: ResultConfig; school: School }) {
  const layout = resolveResultLayout(config.layout);
  const preset = RESULT_LAYOUTS.find((l) => l.id === layout);
  const accent = config.accent || preset?.accent || "var(--c-primary, #1e40af)";
  const pass = student.status === "Pass";
  const watermark = config.watermark || school.name;
  const classLabel = config.showSection && student.section ? `${student.className} - ${student.section}` : student.className;

  const ctx: Ctx = { student, examName, config, school, accent, watermark, pass, classLabel };

  const body =
    layout === "formal" ? <FormalLayout ctx={ctx} /> :
    layout === "modern" ? <ModernLayout ctx={ctx} /> :
    layout === "compact" ? <CompactLayout ctx={ctx} /> :
    layout === "elegant" ? <ElegantLayout ctx={ctx} /> :
    layout === "bold" ? <BoldLayout ctx={ctx} /> :
    <ClassicLayout ctx={ctx} />;

  return <Shell>{body}</Shell>;
}
