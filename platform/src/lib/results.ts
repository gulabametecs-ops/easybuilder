// Results / marksheet domain logic — CSV parsing, grade computation and the
// customizable report-card template config.

export type Subject = { name: string; max: number; obtained: number };

export type ParsedStudent = {
  rollNo: string;
  name: string;
  className: string;
  section: string;
  fatherName: string;
  motherName: string;
  dob: string;
  remarks: string;
  subjects: Subject[];
  total: number;
  maxTotal: number;
  percentage: number;
  grade: string;
  status: string; // Pass | Fail
};

// ─── Report-card / marksheet layout presets ───────────────────────────────────
export type MarksheetLayout = "classic" | "formal" | "modern" | "compact" | "elegant" | "bold";

export const RESULT_LAYOUTS: {
  id: MarksheetLayout;
  name: string;
  desc: string;
  /** Suggested accent when picking this preset (user can still override). */
  accent: string;
}[] = [
  { id: "classic", name: "Classic", desc: "Rounded card with coloured badge heading", accent: "#1e40af" },
  { id: "formal", name: "Formal CBSE", desc: "Double-border board-style report card", accent: "#0f172a" },
  { id: "modern", name: "Modern", desc: "Clean left accent bar, flat typography", accent: "#0d9488" },
  { id: "compact", name: "Compact", desc: "Dense table — best for many subjects", accent: "#334155" },
  { id: "elegant", name: "Elegant", desc: "Soft academic look with gold accents", accent: "#92400e" },
  { id: "bold", name: "Bold banner", desc: "Full-width coloured header & result stamp", accent: "#b91c1c" },
];

// ─── Report-card / marksheet template settings (SiteConfig.resultConfig JSON) ──
export type ResultConfig = {
  layout: MarksheetLayout;
  heading: string; // "REPORT CARD"
  affiliation: string; // "Affiliated to CBSE, New Delhi"
  principalName: string;
  classTeacher: string;
  footerNote: string;
  passPercent: number; // 33
  showFather: boolean;
  showMother: boolean;
  showDob: boolean;
  showSection: boolean;
  showPerSubjectGrade: boolean;
  showRemarks: boolean;
  showGradeLegend: boolean;
  accent: string; // "" => use theme primary / layout default
  watermark: string; // "" => use school name
  verifyByDob: boolean; // default require DOB along with roll no
};

export const DEFAULT_RESULT_CONFIG: ResultConfig = {
  layout: "classic",
  heading: "REPORT CARD",
  affiliation: "",
  principalName: "",
  classTeacher: "",
  footerNote: "This is a computer-generated marksheet and does not require a signature.",
  passPercent: 33,
  showFather: true,
  showMother: false,
  showDob: true,
  showSection: true,
  showPerSubjectGrade: true,
  showRemarks: true,
  showGradeLegend: true,
  accent: "",
  watermark: "",
  verifyByDob: false,
};

export function resolveResultLayout(raw: string | undefined | null): MarksheetLayout {
  const id = (raw || "").trim() as MarksheetLayout;
  return RESULT_LAYOUTS.some((l) => l.id === id) ? id : "classic";
}

// ─── Grade scale (CBSE-style) ─────────────────────────────────────────────────
export function gradeFor(percentage: number): string {
  if (percentage >= 91) return "A1";
  if (percentage >= 81) return "A2";
  if (percentage >= 71) return "B1";
  if (percentage >= 61) return "B2";
  if (percentage >= 51) return "C1";
  if (percentage >= 41) return "C2";
  if (percentage >= 33) return "D";
  return "E";
}

export const GRADE_LEGEND: { grade: string; range: string }[] = [
  { grade: "A1", range: "91–100" },
  { grade: "A2", range: "81–90" },
  { grade: "B1", range: "71–80" },
  { grade: "B2", range: "61–70" },
  { grade: "C1", range: "51–60" },
  { grade: "C2", range: "41–50" },
  { grade: "D", range: "33–40" },
  { grade: "E", range: "Below 33" },
];

// ─── CSV parsing ──────────────────────────────────────────────────────────────
// Splits a CSV string into rows of fields, honouring quoted values (with commas
// and escaped "" quotes).
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let field = "";
  let row: string[] = [];
  let inQuotes = false;
  const s = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (inQuotes) {
      if (ch === '"') {
        if (s[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += ch;
    } else if (ch === '"') inQuotes = true;
    else if (ch === ",") { row.push(field); field = ""; }
    else if (ch === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else field += ch;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

const META_KEYS: Record<string, keyof ParsedStudent> = {
  rollno: "rollNo", roll: "rollNo", "roll no": "rollNo", "roll number": "rollNo", "admission no": "rollNo",
  name: "name", "student name": "name", student: "name",
  class: "className", grade: "className", std: "className",
  section: "section", sec: "section",
  father: "fatherName", "father name": "fatherName", "fathers name": "fatherName", "father's name": "fatherName",
  mother: "motherName", "mother name": "motherName", "mothers name": "motherName", "mother's name": "motherName",
  dob: "dob", "date of birth": "dob",
  remarks: "remarks", remark: "remarks",
};

// Parses a subject header like "English", "Maths:100" or "Science (50)" -> {name, max}.
function parseSubjectHeader(h: string): { name: string; max: number } {
  const colon = h.match(/^(.*?)\s*[:/]\s*(\d+)\s*$/);
  if (colon) return { name: colon[1].trim(), max: parseInt(colon[2], 10) || 100 };
  const paren = h.match(/^(.*?)\s*\((\d+)\)\s*$/);
  if (paren) return { name: paren[1].trim(), max: parseInt(paren[2], 10) || 100 };
  return { name: h.trim(), max: 100 };
}

export type CsvResult = { students: ParsedStudent[]; subjects: string[]; errors: string[] };

// Turns raw CSV text into computed student results.
export function parseResultsCsv(text: string, passPercent = 33): CsvResult {
  const rows = parseCsv(text);
  if (rows.length < 2) return { students: [], subjects: [], errors: ["CSV needs a header row and at least one student row."] };

  const headers = rows[0].map((h) => h.trim());
  const errors: string[] = [];
  const colMap: { index: number; kind: "meta" | "subject"; key?: keyof ParsedStudent; subject?: { name: string; max: number } }[] = [];
  const subjectNames: string[] = [];

  headers.forEach((h, i) => {
    const low = h.toLowerCase().trim();
    if (META_KEYS[low]) colMap.push({ index: i, kind: "meta", key: META_KEYS[low] });
    else if (low) {
      const subj = parseSubjectHeader(h);
      colMap.push({ index: i, kind: "subject", subject: subj });
      subjectNames.push(subj.name);
    }
  });

  if (!colMap.some((c) => c.key === "rollNo")) errors.push("CSV must have a 'Roll No' column.");
  if (!colMap.some((c) => c.key === "name")) errors.push("CSV must have a 'Name' column.");
  if (!subjectNames.length) errors.push("CSV must have at least one subject column.");
  if (errors.length) return { students: [], subjects: [], errors };

  const students: ParsedStudent[] = [];
  for (let r = 1; r < rows.length; r++) {
    const cells = rows[r];
    const st: ParsedStudent = { rollNo: "", name: "", className: "", section: "", fatherName: "", motherName: "", dob: "", remarks: "", subjects: [], total: 0, maxTotal: 0, percentage: 0, grade: "", status: "" };
    for (const c of colMap) {
      const val = (cells[c.index] ?? "").trim();
      if (c.kind === "meta" && c.key) (st[c.key] as unknown as string) = val;
      else if (c.kind === "subject" && c.subject) {
        const obtained = val === "" || val.toUpperCase() === "AB" ? 0 : parseFloat(val);
        st.subjects.push({ name: c.subject.name, max: c.subject.max, obtained: isNaN(obtained) ? 0 : obtained });
      }
    }
    if (!st.rollNo && !st.name) continue;
    st.total = Math.round(st.subjects.reduce((s, x) => s + x.obtained, 0));
    st.maxTotal = st.subjects.reduce((s, x) => s + x.max, 0);
    st.percentage = st.maxTotal ? Math.round((st.total / st.maxTotal) * 10000) / 100 : 0;
    st.grade = gradeFor(st.percentage);
    const anyFail = st.subjects.some((x) => x.max > 0 && (x.obtained / x.max) * 100 < passPercent);
    st.status = st.percentage >= passPercent && !anyFail ? "Pass" : "Fail";
    students.push(st);
  }
  return { students, subjects: subjectNames, errors: [] };
}
