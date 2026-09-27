// Smart / AI-assisted ad-copy + targeting suggestions. Generates contextual ad
// headlines, body copy and audience interests from the service, business and
// sector — no external API, works offline. Client shuffles for fresh options.

function cap(s: string) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
function shuffle<T>(a: T[]): T[] { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }

export function suggestHeadlines(service: string, biz: string): string[] {
  const s = service || "Our Services";
  const t = [
    `${cap(s)} Near You — Book Today!`,
    `Looking for ${cap(s)}? ${biz} Has You Covered`,
    `Get 20% Off ${cap(s)} — This Week Only`,
    `Trusted ${cap(s)} · Rated 5★ by Locals`,
    `${cap(s)} Made Easy with ${biz}`,
    `Limited Slots! Book ${cap(s)} Now`,
    `Best ${cap(s)} in Town — Free Consultation`,
    `${biz}: Quality ${cap(s)} at Honest Prices`,
    `Need ${cap(s)}? Call ${biz} — Same-Day Service`,
  ];
  return shuffle(t).slice(0, 4);
}

export function suggestAdTexts(service: string, biz: string): string[] {
  const s = (service || "our services").toLowerCase();
  const t = [
    `Get top-quality ${s} from ${biz}. Trusted by hundreds of happy customers. Book now and enjoy a special offer! 🎉`,
    `Why wait? ${biz} offers reliable ${s} at the best prices. Limited-time discount — enquire today and save.`,
    `Looking for ${s} you can trust? ${biz} delivers fast, friendly and affordable service. Contact us for a free quote!`,
    `⭐ 5-star rated ${s} by ${biz}. Book online in seconds and get expert help right away.`,
  ];
  return shuffle(t).slice(0, 3);
}

const INTEREST_SETS: { match: string[]; interests: string[] }[] = [
  { match: ["school", "coaching", "education", "play", "primary", "student", "tuition"], interests: ["Parents", "Students", "Education", "Exam Preparation", "Career Growth", "Online Learning", "Kids Activities"] },
  { match: ["home", "electric", "plumb", "carpent", "paint", "repair"], interests: ["Homeowners", "Home Improvement", "Real Estate", "Interior Design", "DIY", "New Home Buyers"] },
  { match: ["restaurant", "hotel", "food", "cafe", "cater"], interests: ["Foodies", "Dining Out", "Family Outings", "Food Delivery", "Events & Parties", "Local Cuisine"] },
  { match: ["hospital", "clinic", "dental", "health", "doctor", "medical"], interests: ["Health & Wellness", "Fitness", "Families", "Senior Care", "Preventive Health"] },
  { match: ["wholesale", "shop", "retail", "product", "manufactur", "bulk"], interests: ["Small Business Owners", "Retailers", "Bulk Buyers", "Entrepreneurs", "B2B", "Distributors"] },
  { match: ["skill", "music", "dance", "karate", "art", "class"], interests: ["Hobbies", "Self Improvement", "Parents", "Youth", "Fitness", "Performing Arts"] },
];

export function suggestInterests(service: string, vertical: string): string[] {
  const hay = `${service} ${vertical}`.toLowerCase();
  for (const set of INTEREST_SETS) if (set.match.some((m) => hay.includes(m))) return set.interests;
  return ["Local Community", "Deal Seekers", "Families", "Working Professionals", "Small Business"];
}
