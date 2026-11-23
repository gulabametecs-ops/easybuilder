// Static marketing ideas for the admin Marketing page: Indian occasions + sector-aware post/offer ideas.
// Pure data + date math only (no DB), so it is safe on server and client.

export type Occasion = {
  name: string;
  /** Fixed "MM-DD" every year, or per-year approximate dates for lunar festivals. */
  fixed?: string;
  approxByYear?: Record<number, string>;
  /** Length in days (seasons). Default 1. */
  days?: number;
  idea: string;
  offer: string;
};

// ponytail: lunar dates are hand-entered approximations for 2026–2028; add the next years when they run out
// (festivals with no entry for a year are simply skipped, never guessed).
export const OCCASIONS: Occasion[] = [
  { name: "New Year", fixed: "01-01", idea: "Thank your customers for the year and share what's new.", offer: "New Year special — 15% off this week!" },
  { name: "Makar Sankranti / Pongal / Lohri", approxByYear: { 2027: "01-14", 2028: "01-14" }, idea: "Share a festive greeting with a photo of your team.", offer: "Sankranti offer — special prices this week!" },
  { name: "Republic Day", fixed: "01-26", idea: "Post a tricolour greeting with your logo.", offer: "Republic Day sale — 26% off on select services!" },
  { name: "Valentine's Day", fixed: "02-14", idea: "Couple / family offer post — 'bring someone you love'.", offer: "Valentine's week — bring a friend, both get 20% off!" },
  { name: "Women's Day", fixed: "03-08", idea: "Celebrate the women on your team or among your customers.", offer: "Women's Day — special offer for all women customers!" },
  { name: "Holi", approxByYear: { 2026: "03-04", 2027: "03-22", 2028: "03-11" }, idea: "Colourful greeting post + a 'Holi hai' offer.", offer: "Holi offer — flat 20% off this week!" },
  { name: "Eid al-Fitr", approxByYear: { 2026: "03-20", 2027: "03-10", 2028: "02-27" }, idea: "Eid Mubarak greeting for your customers.", offer: "Eid special — festive discount this week!" },
  { name: "Summer holidays", fixed: "04-15", days: 60, idea: "Summer camp, vacation packages or summer-care tips.", offer: "Summer special — book now and save 15%!" },
  { name: "Mother's Day", approxByYear: { 2026: "05-10", 2027: "05-09", 2028: "05-14" }, idea: "Ask customers to share a photo with their mom.", offer: "Mother's Day — a special gift for every mom!" },
  { name: "Eid al-Adha", approxByYear: { 2026: "05-27", 2027: "05-17", 2028: "05-05" }, idea: "Eid greeting with a warm thank-you message.", offer: "Eid al-Adha festive offer — this week only!" },
  { name: "Monsoon season", fixed: "06-15", days: 75, idea: "Monsoon tips for your customers (safety, care, health).", offer: "Monsoon offer — 10% off on all bookings!" },
  { name: "Independence Day", fixed: "08-15", idea: "Freedom-themed greeting; share your local 'Made in India' story.", offer: "Independence Day sale — 15% off till 15th!" },
  { name: "Raksha Bandhan", approxByYear: { 2026: "08-28", 2027: "08-17", 2028: "08-05" }, idea: "Brother–sister offer or gift-idea post.", offer: "Raksha Bandhan special — sibling offer this week!" },
  { name: "Ganesh Chaturthi", approxByYear: { 2026: "09-14", 2027: "09-04", 2028: "08-23" }, idea: "Ganpati Bappa greeting — a fresh-start offer.", offer: "Ganesh Chaturthi — shubh aarambh offer!" },
  { name: "Teachers' Day", fixed: "09-05", idea: "Thank a teacher or mentor who inspired you.", offer: "Teachers' Day — special offer for teachers!" },
  { name: "Navratri & Dussehra", approxByYear: { 2026: "10-11", 2027: "09-30", 2028: "09-19" }, days: 10, idea: "9 days, 9 posts — one tip or offer each day.", offer: "Navratri offer — 9 days of special prices!" },
  { name: "Diwali", approxByYear: { 2026: "11-08", 2027: "10-29", 2028: "10-17" }, idea: "Diwali greeting + festive offer — your biggest week of the year.", offer: "Diwali dhamaka — up to 25% off this week!" },
  { name: "Wedding season", fixed: "11-01", days: 105, idea: "Wedding packages, bulk orders or 'get ready for the shaadi' tips.", offer: "Wedding season — special packages, book early!" },
  { name: "Children's Day", fixed: "11-14", idea: "A fun post for kids and parents.", offer: "Children's Day — special treat for kids!" },
  { name: "Christmas", fixed: "12-25", idea: "Merry Christmas greeting + year-end offer.", offer: "Christmas & year-end sale — 20% off!" },
];

export type UpcomingOccasion = Occasion & { date: string; daysAway: number; approx: boolean; ongoing: boolean };

const DAY = 86_400_000;
const utc = (ymd: string) => Date.parse(`${ymd}T00:00:00Z`);

/** Next `n` occasions that are ongoing or start on/after `today` ("YYYY-MM-DD"). */
export function upcomingOccasions(today: string, n = 3): UpcomingOccasion[] {
  const t = utc(today);
  const y = Number(today.slice(0, 4));
  const out: UpcomingOccasion[] = [];
  for (const year of [y - 1, y, y + 1]) {
    for (const o of OCCASIONS) {
      const md = o.fixed ?? o.approxByYear?.[year];
      if (!md) continue;
      const date = `${year}-${md}`;
      const start = utc(date);
      const end = start + ((o.days ?? 1) - 1) * DAY;
      if (end < t) continue;
      const daysAway = Math.max(0, Math.round((start - t) / DAY));
      out.push({ ...o, date, daysAway, approx: !o.fixed, ongoing: start <= t });
    }
  }
  return out.sort((a, b) => a.daysAway - b.daysAway || utc(a.date) - utc(b.date)).slice(0, n);
}

/** Today's date in India as "YYYY-MM-DD". */
export const istToday = (now = Date.now()) => new Date(now + 5.5 * 3600_000).toISOString().slice(0, 10);

// ─── Sector ideas ─────────────────────────────────────────────────────────────
export type SectorIdeas = { posts: string[]; offers: string[] };

const SECTORS: { match: RegExp; ideas: SectorIdeas }[] = [
  {
    match: /school|education|coaching|institute|learning|language|driving|computer/,
    ideas: {
      posts: ["Share a student result or topper photo", "'A day in our class' — 3 real photos", "Parent or student testimonial", "Admission open — dates and fees in one post"],
      offers: ["Admissions open — free demo class this week!", "Early-bird offer: 10% off fees till month end", "Refer a friend — get ₹500 off your fees"],
    },
  },
  {
    match: /restaurant|cafe|bakery|catering|hotel|banquet/,
    ideas: {
      posts: ["Today's special — a close-up photo of the dish", "Behind the scenes in our kitchen", "Customer of the week (with permission)", "Party / bulk order menu"],
      offers: ["Free dessert on orders above ₹499!", "Weekend family combo — 15% off", "Book a table for 4, get a free starter"],
    },
  },
  {
    match: /clinic|hospital|dental|diagnostic|physio|pharmacy|nutrition|senior/,
    ideas: {
      posts: ["Health tip of the week (short and simple)", "Meet our doctor / staff", "Patient thank-you note (no personal details)", "Our timings and how to book"],
      offers: ["Free first consultation this week!", "Full body check-up at a special price", "Free BP & sugar check every Sunday"],
    },
  },
  {
    match: /gym|yoga|fitness/,
    ideas: {
      posts: ["Member transformation (before / after)", "30-second workout tip reel", "Our batch timings", "Healthy diet tip of the day"],
      offers: ["7-day free trial — just walk in!", "Bring a friend — both get 20% off", "Free diet plan with any 3-month plan"],
    },
  },
  {
    match: /salon|spa|jewellery|photo|wedding/,
    ideas: {
      posts: ["Before / after look", "Our newest design or package", "Happy client photo (with permission)", "Bridal / festive bookings open"],
      offers: ["20% off on your first visit!", "Bridal package bookings open — book early", "Free gift with every booking this week"],
    },
  },
  {
    match: /ngo|foundation|charity|welfare|food-bank|empowerment|animal/,
    ideas: {
      posts: ["Impact story with a real photo", "Thank-you post for volunteers / donors", "What ₹500 can do — simple breakdown", "Upcoming drive or event"],
      offers: ["Donate ₹500 — feed 10 children this month", "Volunteer this Sunday — register now!", "Donations eligible for 80G tax benefit"],
    },
  },
  {
    match: /real-estate|builder|construction|interior|pg-hostel/,
    ideas: {
      posts: ["Site progress photos", "New listing / project walkthrough video", "Happy family key handover", "Locality guide — schools, markets, transport"],
      offers: ["Free site visit this weekend!", "Free design consultation — book now", "Limited units at launch price"],
    },
  },
  {
    match: /wholesale|shop|store|manufactur|import/,
    ideas: {
      posts: ["New stock arrived — photo of the shelf", "Best-seller of the week", "How to place a bulk order", "Our brands / product range"],
      offers: ["Bulk order discount — extra 5% off", "Free delivery above ₹2,000", "Festive stock sale — up to 20% off"],
    },
  },
];

const GENERIC: SectorIdeas = {
  posts: ["Before / after of a recent job", "One quick tip your customers will love", "Happy customer review (screenshot)", "Meet the team behind the business"],
  offers: ["₹200 off on your first booking!", "Free inspection / consultation this week", "Refer a friend — both get 10% off"],
};

export function sectorIdeas(vertical: string): SectorIdeas {
  return SECTORS.find((s) => s.match.test(vertical))?.ideas ?? GENERIC;
}
