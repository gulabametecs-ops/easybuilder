import "dotenv/config";
import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";
import { db } from "../src/lib/db";
import { createTenantFromTemplate } from "../src/lib/provision";
import { gradeFor } from "../src/lib/results";

const EDU = new Set(["play-school", "primary-school", "school", "coaching"]);

type Sub = { name: string; max: number; obtained: number };
function compute(subjects: Sub[]) {
  const total = Math.round(subjects.reduce((s, x) => s + x.obtained, 0));
  const maxTotal = subjects.reduce((s, x) => s + x.max, 0);
  const percentage = maxTotal ? Math.round((total / maxTotal) * 10000) / 100 : 0;
  const anyFail = subjects.some((x) => x.max > 0 && (x.obtained / x.max) * 100 < 33);
  return { total, maxTotal, percentage, grade: gradeFor(percentage), status: percentage >= 33 && !anyFail ? "Pass" : "Fail" };
}

// Sample notices + one result exam so education demos look populated.
async function seedEducation(tenantId: string, vertical: string) {
  const withResult = vertical !== "play-school";
  // Results are published as their own notices automatically (see getSiteNotices),
  // so these are just the manual announcements.
  const notices = [
    { date: "12 Jul 2026", title: "Admissions open for the new session — apply today", category: "Admission", link: "/admission", pinned: true },
    { date: "05 Jul 2026", title: "Parent-Teacher Meeting scheduled on 20th July", category: "Event", link: "", pinned: false },
    { date: "28 Jun 2026", title: "Annual Day celebration on 25th July", category: "Event", link: "", pinned: false },
    { date: "20 Jun 2026", title: "Fee submission last date extended to 30th July", category: "News", link: "", pinned: false },
    { date: "15 Jun 2026", title: "Institute reopens on 1st July after summer break", category: "Holiday", link: "", pinned: false },
  ];
  await db.notice.createMany({ data: notices.map((n, i) => ({ tenantId, date: n.date, title: n.title, category: n.category, link: n.link, pinned: n.pinned, published: true, order: notices.length - i })) });

  if (!withResult) return;

  const isCoaching = vertical === "coaching";
  const subjectDefs = isCoaching
    ? ["Physics", "Chemistry", "Mathematics"]
    : vertical === "primary-school"
      ? ["English", "Mathematics", "EVS", "Hindi", "General Knowledge"]
      : ["English", "Mathematics", "Science", "Social Science", "Hindi"];
  const className = isCoaching ? "JEE Batch" : vertical === "primary-school" ? "5" : "10";
  const examName = isCoaching ? "Weekly Test — July 2026" : "Annual Examination 2026";

  const roster: { roll: string; name: string; father: string; dob: string; marks: number[] }[] = [
    { roll: isCoaching ? "J101" : "101", name: "Aarav Sharma", father: "Rajesh Sharma", dob: "14-05-2010", marks: [92, 88, 95, 90, 85] },
    { roll: isCoaching ? "J102" : "102", name: "Diya Patel", father: "Amit Patel", dob: "02-08-2010", marks: [85, 79, 88, 91, 80] },
    { roll: isCoaching ? "J103" : "103", name: "Kabir Khan", father: "Imran Khan", dob: "21-11-2010", marks: [70, 65, 74, 68, 72] },
    { roll: isCoaching ? "J104" : "104", name: "Ananya Gupta", father: "Suresh Gupta", dob: "09-03-2010", marks: [96, 98, 94, 92, 90] },
    { roll: isCoaching ? "J105" : "105", name: "Rohan Mehta", father: "Vijay Mehta", dob: "30-06-2010", marks: [40, 28, 45, 50, 38] },
  ];

  const exam = await db.resultExam.create({ data: { tenantId, name: examName, published: true, verifyDob: false } });
  await db.studentResult.createMany({
    data: roster.map((r) => {
      const subjects: Sub[] = subjectDefs.map((name, i) => ({ name, max: 100, obtained: r.marks[i] ?? 0 }));
      const c = compute(subjects);
      return {
        examId: exam.id, tenantId, rollNo: r.roll, name: r.name, className, section: isCoaching ? "" : "A",
        fatherName: r.father, motherName: "", dob: r.dob, subjects: JSON.stringify(subjects),
        total: c.total, maxTotal: c.maxTotal, percentage: c.percentage, grade: c.grade, status: c.status, remarks: c.status === "Pass" ? "Keep it up!" : "Needs improvement",
      };
    }),
  });
}

// Seeds a demo tenant used for the public live-demo (demo.<yourdomain>) and for
// local testing. Re-running wipes and recreates the demo tenant only.
async function main() {
  // Local SQLite keeps the easy dev logins; any real database needs explicit credentials
  // (the defaults are public in this repo, so they'd hand out super-admin + demo-owner access).
  const isLocal = (process.env.DATABASE_URL ?? "file:").startsWith("file:");
  const superEmail = process.env.SUPER_ADMIN_EMAIL || "super@platform.test";
  const superPassword = process.env.SUPER_ADMIN_PASSWORD || (isLocal ? "super1234" : "");
  if (superPassword.length < (isLocal ? 1 : 12)) {
    throw new Error("Set SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD (12+ chars) before seeding a production database.");
  }
  const demoPassword = isLocal ? "demo1234" : randomBytes(18).toString("base64url");

  // Super admin (platform owner) account — idempotent.
  await db.platformUser.upsert({
    where: { email: superEmail },
    update: {},
    create: { email: superEmail, password: await bcrypt.hash(superPassword, 10), name: "Platform Owner" },
  });
  console.log(`✅ Super admin: ${superEmail}${isLocal ? ` / ${superPassword}  → http://localhost:3000/super` : ""}`);

  // One demo tenant per live vertical.
  const demos = [
    { subdomain: "demo", vertical: "home-services", name: "Standard Services", email: "demo@standard.test" },
    { subdomain: "demo-edu", vertical: "education-consultancy", name: "Bright Future Consultants", email: "demo@edu.test" },
    { subdomain: "demo-restaurant", vertical: "restaurant-hotel", name: "Spice Garden", email: "demo@restaurant.test" },
    { subdomain: "demo-hospital", vertical: "hospital-clinic", name: "CityCare Clinic", email: "demo@hospital.test" },
    { subdomain: "demo-playschool", vertical: "play-school", name: "Little Stars Play School", email: "demo@play.test" },
    { subdomain: "demo-primary", vertical: "primary-school", name: "Green Valley Primary School", email: "demo@primary.test" },
    { subdomain: "demo-school", vertical: "school", name: "St. Xavier's Senior School", email: "demo@school.test" },
    { subdomain: "demo-coaching", vertical: "coaching", name: "Achievers Coaching Institute", email: "demo@coaching.test" },
    { subdomain: "demo-wholesale", vertical: "wholesale-shop", name: "MegaMart Wholesale", email: "demo@wholesale.test" },
    { subdomain: "demo-mfg", vertical: "manufacturing", name: "PrecisionTech Industries", email: "demo@mfg.test" },
    { subdomain: "demo-skill", vertical: "skill-learning", name: "TalentHub Academy", email: "demo@skill.test" },
    { subdomain: "demo-gym", vertical: "gym-fitness", name: "IronPulse Fitness", email: "demo@gym.test" },
    { subdomain: "demo-ngo", vertical: "ngo-charity", name: "Asha Foundation", email: "demo@ngo.test" },
    { subdomain: "demo-pharmacy", vertical: "pharmacy", name: "CareWell Pharmacy", email: "demo@pharmacy.test" },
    { subdomain: "demo-events", vertical: "events-training", name: "SummitHub Events", email: "demo@events.test" },
  ];

  for (const d of demos) {
    const existing = await db.tenant.findUnique({ where: { subdomain: d.subdomain } });
    if (existing) await db.tenant.delete({ where: { id: existing.id } });
    const tenant = await createTenantFromTemplate({
      businessName: d.name,
      subdomain: d.subdomain,
      ownerEmail: d.email,
      ownerPassword: demoPassword,
      plan: "pro",
      vertical: d.vertical,
    });
    if (EDU.has(d.vertical)) await seedEducation(tenant.id, d.vertical);
    console.log(`✅ ${d.vertical}: http://${d.subdomain}.localhost:3000  (admin: ${d.email}${isLocal ? ` / ${demoPassword}` : ""})`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
