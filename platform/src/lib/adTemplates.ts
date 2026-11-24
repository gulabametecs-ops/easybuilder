// Ready-made ad campaign templates for the Marketing → Ads tab. Pure data + date math
// (no DB), so one click can pre-fill the campaign wizard. Uses the tenant's sector,
// first service and upcoming festivals.
import { suggestInterests } from "./adSuggest";
import type { UpcomingOccasion } from "./marketingIdeas";

export type AdDraft = {
  name: string; platform: string; objective: string; service: string;
  headline: string; adText: string; interests: string[];
  ageMin: number; ageMax: number; radiusKm: number; budget: number; startDate: string; endDate: string;
};
export type AdTemplate = {
  id: string;
  group: "sector" | "festival" | "goal";
  title: string;
  why: string;
  emoji: string;
  perDay: number;
  draft: AdDraft;
};

const DAY = 86_400_000;
export const addDays = (ymd: string, n: number) => new Date(Date.parse(`${ymd}T00:00:00Z`) + n * DAY).toISOString().slice(0, 10);

type Seed = Omit<AdTemplate, "draft" | "group"> & {
  platform: string; objective: string; headline: string; adText: string;
  age?: [number, number]; radius?: number; days?: number;
};

// {b} = business name, {s} = service (or "our services"), {ay} = next academic year ("2027–28").
const SECTOR_ADS: { match: RegExp; seeds: Seed[] }[] = [
  {
    match: /school|education|coaching|institute|learning|language|driving|computer/,
    seeds: [
      { id: "admission", title: "Admissions open", emoji: "🎒", why: "Reach parents nearby when they choose a school or class.", perDay: 300, platform: "meta", objective: "leads", age: [28, 45], radius: 10, headline: "Admissions Open {ay} at {b}", adText: "Limited seats! Book a free campus visit or demo class today. Experienced teachers, safe campus, great results. 📞 Enquire now." },
      { id: "demo-class", title: "Free demo class", emoji: "📚", why: "A free trial removes doubt — the easiest way to get enquiries.", perDay: 200, platform: "instagram", objective: "leads", age: [18, 45], radius: 10, headline: "Attend a FREE Demo Class at {b}", adText: "Not sure yet? Try a class for free this week. No fees, no pressure — just come and see. Book your seat now!" },
    ],
  },
  {
    match: /clinic|hospital|dental|diagnostic|physio|pharmacy|nutrition|senior/,
    seeds: [
      { id: "free-consult", title: "Free first consultation", emoji: "🩺", why: "People search on Google when they need a doctor — be there with a call button.", perDay: 400, platform: "google", objective: "calls", age: [25, 65], radius: 10, headline: "{s} Near You — Free First Consultation", adText: "Experienced doctors at {b}. Book your appointment in 1 minute. Call now — same-day slots available." },
      { id: "checkup", title: "Health check-up package", emoji: "❤️", why: "Packages with a clear price get more bookings on Facebook.", perDay: 300, platform: "meta", objective: "leads", age: [30, 65], radius: 10, headline: "Full Body Check-up at a Special Price", adText: "Stay ahead of your health. Complete check-up at {b} with quick reports. Limited-period price — book today!" },
    ],
  },
  {
    match: /gym|yoga|fitness/,
    seeds: [
      { id: "free-trial", title: "7-day free trial", emoji: "💪", why: "A free trial brings people through the door. Most join after they visit.", perDay: 300, platform: "instagram", objective: "leads", age: [18, 44], radius: 5, headline: "7-Day FREE Trial at {b}", adText: "New year, new you — start today! Expert trainers, flexible batches. Claim your free 7-day pass now. 💪" },
    ],
  },
  {
    match: /salon|spa|jewellery|photo|wedding/,
    seeds: [
      { id: "first-visit", title: "20% off first visit", emoji: "✨", why: "Beautiful photos + a first-visit offer work great on Instagram.", perDay: 250, platform: "instagram", objective: "leads", age: [18, 44], radius: 8, headline: "20% Off Your First Visit at {b}", adText: "Look your best this season ✨ Book your slot today and get 20% off on your first visit. Limited slots!" },
      { id: "bridal", title: "Bridal / festive bookings", emoji: "💍", why: "Wedding season — people book weeks in advance.", perDay: 400, platform: "meta", objective: "leads", age: [22, 40], radius: 15, headline: "Bridal & Festive Bookings Open — {b}", adText: "Make your big day perfect. Packages for bride, family and guests. Book early and get a special price. 💍" },
    ],
  },
  {
    match: /restaurant|cafe|bakery|catering|hotel|banquet|tiffin|canteen|halwai|live-counter|satvik/,
    seeds: [
      { id: "family-combo", title: "Weekend family combo", emoji: "🍽️", why: "Food ads work best on weekends, close to your location.", perDay: 250, platform: "instagram", objective: "sales", age: [18, 55], radius: 5, days: 3, headline: "Weekend Family Combo — 15% Off at {b}", adText: "Bring the whole family this weekend 😋 Special combo, 15% off. Dine in or order now!" },
      { id: "party-order", title: "Party & bulk orders", emoji: "🎉", why: "Get bulk/party orders for birthdays, pujas and office events.", perDay: 300, platform: "meta", objective: "leads", age: [25, 55], radius: 15, headline: "Party & Bulk Orders by {b}", adText: "Birthday, puja or office party? Tasty food, on time, at the right price. Get a free quote on WhatsApp today!" },
    ],
  },
  {
    match: /real-estate|builder|construction|interior|pg-hostel/,
    seeds: [
      { id: "site-visit", title: "Free site visit", emoji: "🏠", why: "Serious buyers book a visit — get their number first.", perDay: 500, platform: "meta", objective: "leads", age: [28, 60], radius: 25, days: 10, headline: "Free Site Visit This Weekend — {b}", adText: "Your dream home is waiting. Book a free site visit with pickup & drop. Limited units at launch price — enquire now!" },
    ],
  },
  {
    match: /ngo|foundation|charity|welfare|food-bank|empowerment|animal|environment|relief/,
    seeds: [
      { id: "donate", title: "Donation drive", emoji: "🤝", why: "Show real impact — people give when they see a clear result.", perDay: 200, platform: "meta", objective: "awareness", age: [25, 60], radius: 0, days: 14, headline: "₹500 Can Feed 10 Children — Donate Today", adText: "Every rupee reaches those who need it. Donate to {b} today — 80G tax benefit available. 🙏" },
    ],
  },
  {
    match: /ca-firm|law|it-services|digital-marketing|hr-staffing|consult|insurance|coworking/,
    seeds: [
      { id: "free-consult-pro", title: "Free consultation", emoji: "💼", why: "Business owners search Google for experts — offer a free first call.", perDay: 400, platform: "google", objective: "leads", age: [25, 60], radius: 25, headline: "Free Consultation — {s} by {b}", adText: "Talk to an expert today. Clear advice, honest pricing, quick turnaround. Book your free 15-minute call now." },
    ],
  },
  {
    match: /wholesale|shop|store|manufactur|import/,
    seeds: [
      { id: "bulk", title: "Bulk order enquiry", emoji: "📦", why: "Find shop owners and buyers who need stock in bulk.", perDay: 300, platform: "meta", objective: "leads", age: [25, 60], radius: 50, headline: "Bulk Orders at Best Rates — {b}", adText: "Retailers & resellers: get wholesale prices, fast delivery and genuine products. Send your requirement on WhatsApp!" },
    ],
  },
  {
    match: /home-services|car-service|packers|electric|plumb/,
    seeds: [
      { id: "same-day", title: "Same-day service — call now", emoji: "🛠️", why: "When something breaks, people Google and call the first number.", perDay: 300, platform: "google", objective: "calls", age: [25, 65], radius: 10, headline: "{s} Near You — Same-Day Service", adText: "Trusted experts from {b}. Fair prices, on-time visit, work guaranteed. Call now for a free quote!" },
    ],
  },
];

const GOAL_ADS: Seed[] = [
  { id: "nearby-enquiries", title: "Get more enquiries nearby", emoji: "📍", why: "Show your business to people within 10 km on Facebook & Instagram.", perDay: 300, platform: "meta", objective: "leads", age: [25, 55], radius: 10, headline: "Looking for {s}? {b} Is Near You", adText: "Trusted by local customers. Quick service, honest prices. Send us a message today and get a special offer!" },
  { id: "google-call", title: "Google search — Call now", emoji: "📞", why: "Appear on top of Google when someone searches for what you sell.", perDay: 400, platform: "google", objective: "calls", age: [18, 65], radius: 15, headline: "{s} Near You — Call {b} Now", adText: "Fast, reliable {s}. Open today. Tap to call and get a free quote in minutes." },
  { id: "whatsapp-chat", title: "WhatsApp click-to-chat", emoji: "💬", why: "People tap the ad and start a WhatsApp chat with you directly.", perDay: 200, platform: "whatsapp", objective: "leads", age: [18, 55], radius: 10, headline: "Chat With {b} on WhatsApp", adText: "Have a question? Message us on WhatsApp — we reply fast! Ask about prices, timings and today's offer. 💬" },
  { id: "weekend-discount", title: "Weekend discount", emoji: "🛍️", why: "A short 3-day offer creates urgency — people act now.", perDay: 300, platform: "instagram", objective: "sales", age: [18, 44], radius: 10, days: 3, headline: "Weekend Special — Flat 15% Off at {b}", adText: "This weekend only! Flat 15% off on {s}. Hurry — offer ends Sunday night. 🛍️" },
  { id: "new-launch", title: "New launch / now open", emoji: "🚀", why: "Tell your area about something new — a service, branch or product.", perDay: 250, platform: "instagram", objective: "awareness", age: [18, 55], radius: 10, headline: "New at {b} — Now Open!", adText: "Something new is here 🎉 Come visit us this week and be among the first to try it. Launch offer for early customers!" },
];

export const festTemplateId = (name: string) => `fest-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

/** Next Friday (or today if Fri–Sun) — used for weekend offers. */
function nextWeekend(today: string) {
  const dow = new Date(`${today}T00:00:00Z`).getUTCDay(); // 0 Sun … 6 Sat
  if (dow === 0 || dow >= 5) return today;
  return addDays(today, 5 - dow);
}

export function adTemplates({ vertical, bizName, services, occasions, today }: {
  vertical: string; bizName: string; services: string[]; occasions: UpcomingOccasion[]; today: string;
}): AdTemplate[] {
  const service = services[0] ?? "";
  const svc = service || "our services";
  const biz = bizName || "us";
  // Indian sessions start in April; from September on, admissions are for next year's session.
  const y = Number(today.slice(0, 4)) + (Number(today.slice(5, 7)) >= 9 ? 1 : 0);
  const ay = `${y}–${String(y + 1).slice(2)}`;
  const fill = (t: string) => t.replaceAll("{b}", biz).replaceAll("{s}", svc).replaceAll("{ay}", ay);
  const interests = suggestInterests(service, vertical).slice(0, 4);

  const build = (group: AdTemplate["group"], s: Seed): AdTemplate => {
    const start = s.id === "weekend-discount" || s.id === "family-combo" ? nextWeekend(today) : today;
    return {
      id: s.id, group, title: s.title, why: s.why, emoji: s.emoji, perDay: s.perDay,
      draft: {
        name: `${s.title} — ${start.slice(0, 7)}`, platform: s.platform, objective: s.objective, service,
        headline: fill(s.headline), adText: fill(s.adText), interests,
        ageMin: s.age?.[0] ?? 18, ageMax: s.age?.[1] ?? 65, radiusKm: s.radius ?? 10,
        budget: s.perDay * (s.days ?? 7), startDate: start, endDate: addDays(start, (s.days ?? 7) - 1),
      },
    };
  };

  const sector = (SECTOR_ADS.find((x) => x.match.test(vertical))?.seeds ?? []).map((s) => build("sector", s));
  const festival = occasions.slice(0, 3).map((o): AdTemplate => {
    // Run the 2 weeks up to the festival day (min 5 days), or one week if it's on now / too close.
    const near = o.ongoing || o.daysAway < 5;
    const end = near ? addDays(today, 6) : o.date;
    const start = near || o.daysAway <= 13 ? today : addDays(o.date, -13);
    const days = Math.round((Date.parse(end) - Date.parse(start)) / DAY) + 1;
    const perDay = 300;
    return {
      id: festTemplateId(o.name), group: "festival",
      title: `${o.name} offer`, emoji: "🎉", perDay,
      why: o.ongoing ? `${o.name} is on now — people are looking for offers.` : `${o.name} is in ${o.daysAway} days. Start your ad early.`,
      draft: {
        name: `${o.name} offer ${o.date.slice(0, 4)}`, platform: "instagram", objective: "sales", service,
        headline: o.offer, adText: `${o.offer} Celebrate with ${biz} 🎉 Limited days only — book or message us today!`,
        interests, ageMin: 18, ageMax: 55, radiusKm: 10, budget: perDay * days, startDate: start, endDate: end,
      },
    };
  });
  return [...sector, ...festival, ...GOAL_ADS.map((s) => build("goal", s))];
}
