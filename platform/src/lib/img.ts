// Topical demo images. Maps content keywords to hand-verified Unsplash photos so
// every service/gallery/hero image is RELEVANT to the business (not random).
// Clients replace these with their own uploads from the admin panel.

const U: Record<string, string> = {
  // trades / home services
  electrician: "1621905251918-48416bd8575a",
  wiring: "1558618666-fcd25c85cd64",
  plumbing: "1621905252507-b35492cc74b4",
  plumber: "1585704032915-c3400ca199e7",
  carpentry: "1504148455328-c376907d081c",
  furniture: "1555041469-a586c61ea9bc",
  painting: "1589939705384-5185137a7f0f",
  paint: "1562259949-e8e7689d7828",
  tools: "1581578731548-c64695cc6952",
  handyman: "1504328345606-18bbc8c9d7d1",
  homeservice: "1621905251189-08b45d6a269e",
  interior: "1497366754035-f200968a6e72",
  // food
  food: "1517248135467-4c7edcad34c4",
  indianfood: "1585937421612-70a008356fbe",
  dessert: "1551024601-bec78aea704b",
  restaurant: "1555396273-367ea4eb4db5",
  coffee: "1495474472287-4d71bcdd2085",
  pizza: "1513104890138-7c749659a591",
  // healthcare
  dentist: "1588776814546-1ffcf47267a5",
  eyecare: "1577401239170-897942555fb3",
  doctor: "1622253692010-333f2da6031d",
  hospital: "1519494026892-80bbd2d6fd0d",
  skin: "1512290923902-8a9f81dc236c",
  therapy: "1573497491765-dccce02b29df",
  // education
  university: "1562774053-701939374585",
  students: "1523240795612-9a054b0db644",
  graduation: "1627556704302-624286467c65",
  study: "1434030216411-0b793f4b4173",
  library: "1541339907198-e08756dedf3f",
  classroom: "1580582932707-520aed937b7b",
  coaching: "1524178232363-1fb2b075b655",
  // commerce / industry
  warehouse: "1553413077-190dd305871c",
  wholesale: "1586528116311-ad8dd3c8310d",
  manufacturing: "1565043666747-69f6646db940",
  // skills
  karate: "1555597673-b21d5c935865",
  martial: "1544367567-0f2fcb009e0b",
  music: "1511671782779-c97d3d27a1d4",
  dance: "1508700115892-45ecd05ae2ad",
  // people / generic professional
  portrait: "1560250097-0b93528c311a",
  person: "1573496359142-b8d87734a5a2",
  office: "1497366216548-37526070297c",
  consultant: "1600880292203-757bb62b4baf",
  handshake: "1521791136064-7986c2920216",
};

// keyword → image key. First match wins, so put specific rules before generic.
const RULES: [RegExp, string][] = [
  // trades
  [/wiring|circuit|earthing|switch|fan|light/i, "wiring"],
  [/electric|inverter|ups|geyser|motor|appliance|washing|refriger|ac\b/i, "electrician"],
  [/plumb|cpvc|upvc|pipe|tank|leak|tap|shower|sanitary|bathroom/i, "plumbing"],
  [/wardrobe|cabinet|tv unit|door|window|woodwork|carpen|furniture/i, "furniture"],
  [/modular kitchen|interior/i, "interior"],
  [/texture|coating|wall paint|exterior paint/i, "paint"],
  [/paint/i, "painting"],
  [/handyman|maintenance|repair|installation|home solution|home service/i, "homeservice"],
  // food
  [/biryani|main course|curry|paneer|chicken|naan|rice/i, "indianfood"],
  [/dessert|sweet|gulab|ice cream/i, "dessert"],
  [/coffee|beverage|drink|lime|soda|tea|cafe/i, "coffee"],
  [/pizza/i, "pizza"],
  [/starter|dine|menu|takeaway|delivery|catering|party|food|restaurant|hotel/i, "food"],
  // healthcare
  [/dental|teeth|tooth/i, "dentist"],
  [/eye|vision|cataract|ophthal/i, "eyecare"],
  [/skin|hair|derma|acne/i, "skin"],
  [/mental|counsel|therapy|psych/i, "therapy"],
  [/hospital|clinic|patient|emergency|department/i, "hospital"],
  [/doctor|physician|medicine|health|check-?up|consultation|ent\b/i, "doctor"],
  // education
  [/visa|sop|lor|scholar|document/i, "graduation"],
  [/ielts|toefl|pte|gre|gmat|sat|test|prep|course/i, "study"],
  [/usa|uk\b|canada|australia|germany|abroad|admission|universit/i, "university"],
  [/engineering|medical|mba|law|neet|jee/i, "students"],
  [/school|tuition|faculty|exam|batch/i, "classroom"],
  [/coaching|study in india|india admission/i, "coaching"],
  // commerce / industry
  [/wholesale|distribution|supply|shop/i, "wholesale"],
  [/warehouse|stock|inventory|product/i, "warehouse"],
  [/manufactur|factory|production|bulk|order/i, "manufacturing"],
  // skills
  [/karate|martial|taekwondo|boxing/i, "karate"],
  [/dance|choreo/i, "dance"],
  [/music|song|guitar|singing|piano|instrument/i, "music"],
  [/skill|academy|trainer|enroll|class/i, "martial"],
  // education generic
  [/consult|counsell|gateway|global education/i, "consultant"],
  // people
  [/-person$|portrait|team|staff/i, "portrait"],
];

// neutral, professional fallbacks (NOT random) chosen deterministically by seed.
const NEUTRAL = ["office", "handshake", "consultant", "interior", "homeservice"];

function unsplashUrl(id: string, w: number, h: number): string {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;
}
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

// Returns a topical image URL for the given text; falls back to a neutral
// professional photo (deterministic) when no keyword matches.
export function img(seed: string, w = 800, h = 600): string {
  const text = seed.toLowerCase();
  for (const [re, key] of RULES) {
    if (re.test(text)) return unsplashUrl(U[key], w, h);
  }
  const n = NEUTRAL[hash(seed) % NEUTRAL.length];
  return unsplashUrl(U[n], w, h);
}
