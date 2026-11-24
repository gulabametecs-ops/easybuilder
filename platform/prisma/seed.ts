import "dotenv/config";
import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";
import { db } from "../src/lib/db";
import { createTenantFromTemplate } from "../src/lib/provision";
import { fillDemoImages } from "../src/lib/demoImages";
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
  // Local MySQL (localhost / 127.0.0.1) gets easy demo logins; anything else is treated as production.
  const isLocal = /^mysql:\/\/[^@]*@(localhost|127\.0\.0\.1)(:\d+)?\//i.test(process.env.DATABASE_URL ?? "");
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
    { subdomain: "demo-foundation", vertical: "social-foundation", name: "Rise Social Foundation", email: "demo@foundation.test" },
    { subdomain: "demo-pharmacy", vertical: "pharmacy", name: "CareWell Pharmacy", email: "demo@pharmacy.test" },
    { subdomain: "demo-events", vertical: "events-training", name: "SummitHub Events", email: "demo@events.test" },
    { subdomain: "demo-language", vertical: "language-institute", name: "Lingua Bridge Academy", email: "demo@language.test" },
    { subdomain: "demo-driving", vertical: "driving-school", name: "SafeDrive Motor Training", email: "demo@driving.test" },
    { subdomain: "demo-computer", vertical: "computer-institute", name: "CodeCraft Computer Institute", email: "demo@computer.test" },
    { subdomain: "demo-interior", vertical: "interior-design", name: "Nest & Nook Interiors", email: "demo@interior.test" },
    { subdomain: "demo-carcare", vertical: "car-service", name: "TorqueCare Auto Studio", email: "demo@carcare.test" },
    { subdomain: "demo-movers", vertical: "packers-movers", name: "ShiftRight Packers & Movers", email: "demo@movers.test" },
    { subdomain: "demo-cafe", vertical: "cafe-bakery", name: "Crumb & Co. Café", email: "demo@cafe.test" },
    { subdomain: "demo-catering", vertical: "catering", name: "Rasoi Royale Caterers", email: "demo@catering.test" },
    { subdomain: "demo-resort", vertical: "hotel-resort", name: "Aranya Bay Resort", email: "demo@resort.test" },
    { subdomain: "demo-dental", vertical: "dental-clinic", name: "BrightSmile Dental Care", email: "demo@dental.test" },
    { subdomain: "demo-lab", vertical: "diagnostic-lab", name: "PrimeCheck Diagnostics", email: "demo@lab.test" },
    { subdomain: "demo-physio", vertical: "physio-clinic", name: "MoveWell Physio & Rehab", email: "demo@physio.test" },
    { subdomain: "demo-construction", vertical: "construction", name: "SolidStone Builders", email: "demo@construction.test" },
    { subdomain: "demo-export", vertical: "import-export", name: "Indus Global Exim", email: "demo@export.test" },
    { subdomain: "demo-jewellery", vertical: "jewellery-store", name: "Swarna Mahal Jewellers", email: "demo@jewellery.test" },
    { subdomain: "demo-yoga", vertical: "yoga-studio", name: "Prana Yoga Studio", email: "demo@yoga.test" },
    { subdomain: "demo-salon", vertical: "salon-spa", name: "Velvet Salon & Spa", email: "demo@salon.test" },
    { subdomain: "demo-nutrition", vertical: "nutrition-clinic", name: "NourishFit Nutrition Clinic", email: "demo@nutrition.test" },
    { subdomain: "demo-animal", vertical: "animal-welfare", name: "Paws of Hope Shelter", email: "demo@animal.test" },
    { subdomain: "demo-seniorcare", vertical: "senior-care", name: "Sukoon Senior Living", email: "demo@seniorcare.test" },
    { subdomain: "demo-rwa", vertical: "resident-welfare", name: "Green Meadows Residents Association", email: "demo@rwa.test" },
    { subdomain: "demo-wedding", vertical: "wedding-planner", name: "Shubh Vivah Weddings", email: "demo@wedding.test" },
    { subdomain: "demo-photo", vertical: "photo-studio", name: "Frame & Focus Studio", email: "demo@photo.test" },
    { subdomain: "demo-banquet", vertical: "banquet-hall", name: "Grand Utsav Banquets", email: "demo@banquet.test" },
    { subdomain: "demo-women", vertical: "women-empowerment", name: "Shakti Mahila Foundation", email: "demo@women.test" },
    { subdomain: "demo-childedu", vertical: "child-education-ngo", name: "Akshar Bachpan Trust", email: "demo@childedu.test" },
    { subdomain: "demo-green", vertical: "environment-ngo", name: "Haritam Earth Collective", email: "demo@green.test" },
    { subdomain: "demo-relief", vertical: "health-relief-ngo", name: "Raksha Relief Foundation", email: "demo@relief.test" },
    { subdomain: "demo-foodbank", vertical: "food-bank", name: "Annapurna Roti Bank", email: "demo@foodbank.test" },
    { subdomain: "demo-kitchen", vertical: "kitchen-sink-wholesale", name: "SinkWorld Kitchen Traders", email: "demo@kitchen.test" },
    { subdomain: "demo-electrical", vertical: "electrical-wholesale", name: "Volt Line Electricals", email: "demo@electrical.test" },
    { subdomain: "demo-realestate", vertical: "real-estate-broker", name: "Prime Nest Realty", email: "demo@realestate.test" },
    { subdomain: "demo-pg", vertical: "pg-hostel", name: "Comfort Stay PG", email: "demo@pg.test" },
    { subdomain: "demo-builder", vertical: "builder-developer", name: "Skyline Developers", email: "demo@builder.test" },
    { subdomain: "demo-tiffin", vertical: "tiffin-service", name: "Maa Ki Rasoi Tiffins", email: "demo@tiffin.test" },
    { subdomain: "demo-canteen", vertical: "canteen-catering", name: "WorkFuel Canteen Services", email: "demo@canteen.test" },
    { subdomain: "demo-livecounter", vertical: "live-counter-catering", name: "Angaar Live Kitchens", email: "demo@livecounter.test" },
    { subdomain: "demo-halwai", vertical: "halwai-sweets", name: "Mithaas Halwai & Caterers", email: "demo@halwai.test" },
    { subdomain: "demo-satvik", vertical: "jain-satvik-catering", name: "Navkar Satvik Caterers", email: "demo@satvik.test" },
    { subdomain: "demo-ca", vertical: "ca-firm", name: "Agarwal Iyer & Co.", email: "demo@ca.test" },
    { subdomain: "demo-law", vertical: "law-firm", name: "Mehra & Rao Advocates", email: "demo@law.test" },
    { subdomain: "demo-it", vertical: "it-services", name: "CodeNest Technologies", email: "demo@it.test" },
    { subdomain: "demo-digital", vertical: "digital-marketing", name: "GrowthLoop Digital", email: "demo@digital.test" },
    { subdomain: "demo-hr", vertical: "hr-staffing", name: "TalentBridge Staffing", email: "demo@hr.test" },
    { subdomain: "demo-consulting", vertical: "business-consulting", name: "Northstar Advisory Partners", email: "demo@consulting.test" },
    { subdomain: "demo-insurance", vertical: "insurance-advisor", name: "SurakshaPlus Advisors", email: "demo@insurance.test" },
    { subdomain: "demo-cowork", vertical: "coworking-space", name: "HiveWorks Coworking", email: "demo@cowork.test" },
    { subdomain: "demo-fashion", vertical: "fashion-store", name: "Rangoli Threads", email: "demo@fashion.test" },
    { subdomain: "demo-grocery", vertical: "grocery-store", name: "FreshKart Kirana", email: "demo@grocery.test" },
    { subdomain: "demo-electronics", vertical: "electronics-store", name: "GadgetHub India", email: "demo@electronics.test" },
    { subdomain: "demo-gifts", vertical: "gifts-store", name: "Kalakriti Gifts", email: "demo@gifts.test" },
    { subdomain: "demo-beauty", vertical: "beauty-store", name: "Glow Theory Beauty", email: "demo@beauty.test" },
    { subdomain: "demo-homedecor", vertical: "home-decor-store", name: "Woodnest Living", email: "demo@homedecor.test" },
    { subdomain: "demo-store", vertical: "online-store", name: "ShopNest", email: "demo@store.test" },
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
    await fillDemoImages(tenant.id, d.vertical); // demo sites only: sector photos + logo
    console.log(`✅ ${d.vertical}: http://${d.subdomain}.localhost:3000  (admin: ${d.email}${isLocal ? ` / ${demoPassword}` : ""})`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
