/** Blank image slots with recommended upload size. Clients replace these from Admin. */

export type ImageSlotSize = { w: number; h: number };

export const IMAGE_SLOTS: Record<string, ImageSlotSize> = {
  hero: { w: 1600, h: 900 },
  banner: { w: 1600, h: 500 },
  about: { w: 1200, h: 900 },
  imageBanner: { w: 1600, h: 700 },
  service: { w: 800, h: 500 },
  gallery: { w: 800, h: 800 },
  team: { w: 600, h: 600 },
  toppers: { w: 400, h: 400 },
  logo: { w: 240, h: 80 },
};

/** Blank slot with recommended upload size drawn on the image. */
export function placeholderImage(w: number, h: number): string {
  const size = Math.max(18, Math.min(48, Math.round(Math.min(w, h) / 14)));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs>
      <pattern id="g" width="24" height="24" patternUnits="userSpaceOnUse">
        <path d="M24 0H0v24" fill="none" stroke="#cbd5e1" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="#eef2f6"/>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <rect x="12" y="12" width="${w - 24}" height="${h - 24}" fill="none" stroke="#94a3b8" stroke-width="3" stroke-dasharray="12 10" rx="8"/>
    <text x="50%" y="50%" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="${size}" font-weight="700" fill="#64748b">${w} × ${h}</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function isPlaceholderSrc(src?: string | null): boolean {
  return !!src && (src.startsWith("data:image/svg+xml;charset=utf-8,") || src.includes("Upload in Admin"));
}

/** Fallback used wherever a tenant section has no uploaded photo. */
export function img(_seed: string, w = 800, h = 600): string {
  return placeholderImage(w, h);
}

// Order matters — first match wins, so specific sectors come before generic words.
export const STOCK: [RegExp, string][] = [
  [/pg|hostel|co-?living/i, "1555854877-bab0e564b8d5"],
  [/developer/i, "1460317442991-0ec209397118"],
  [/real estate|realty|property|broker/i, "1600596542815-ffad4c1539a9"],
  [/\bsinks?\b/i,"1556909114-f6e7ad7d3136"],
  [/electrical|lighting/i, "1621905252507-b35492cc74b4"],
  [/women|empower/i, "1532629345422-7515f3d16bb6"],
  [/child/i, "1497486751825-1233686d5d80"],
  [/environment|green ngo|climate/i, "1466692476868-aef1dfb1e735"],
  [/food bank|roti|hunger/i, "1593113598332-cd288d649433"],
  [/yoga|meditation/i, "1544367567-0f2fcb009e0b"],
  [/salon|spa\b|beauty/i, "1560066984-138dadb4c035"],
  [/caf[eé]|bakery|coffee/i, "1509440159596-0249088772ff"],
  [/catering|cloud kitchen/i, "1555244162-803834f70033"],
  [/resort/i, "1566073771259-6a8506099945"],
  [/wedding/i, "1519741497674-611481863552"],
  [/photo/i, "1516035069371-29a1b244cc32"],
  [/banquet|venue/i, "1519167758481-83f550bb49b3"],
  [/construction|builder/i, "1504307651254-35680f356dfd"],
  [/export|import/i, "1494412574643-ff11b0a5c1c3"],
  [/jewel/i, "1515562141207-7a88fb7ce338"],
  [/diagnostic|lab\b|patholog/i, "1579154204601-01588f351e67"],
  [/physio|rehab/i, "1571019613454-1cb2f99b2d8b"],
  [/nutrition|dietitian|diet/i, "1512621776951-a57141f2eefd"],
  [/animal|shelter|pet\b/i, "1548199973-03cce0bbc87b"],
  [/senior|old age|elder/i, "1581579438747-1dc8d17bbce4"],
  [/housing|society|rwa|resident/i, "1545324418-cc1a3fa10c00"],
  [/language|ielts|english/i, "1456513080510-7bf3a84b82f8"],
  [/driving/i, "1449965408869-eaa3f722e40d"],
  [/computer|\bit\b institute|coding/i, "1517694712202-14dd9538aa97"],
  [/car service|detailing|mechanic/i, "1487754180451-c456f719a1fc"],
  [/packers|movers|relocation/i, "1600518464441-9154a4dea21b"],
  [/gym|fitness|workout/i, "1534438327276-14e5300c3a48"],
  [/plantation|sapling|rural village|grassroots|foundation/i, "1542601906990-b4d3fb778b09"],
  [/ngo|charity|non-profit|community/i, "1488521787991-ed7bbaae773c"],
  [/pharmac|medicine|chemist/i, "1631549916768-4119b2e5f926"],
  [/event|webinar|seminar|conference/i, "1540575467063-178a50c2df87"],
  [/play ?school|preschool|nursery/i, "1503454537195-1dcabb73ffb9"],
  [/primary/i, "1509062522246-3755977927d7"],
  [/coaching|tuition|library/i, "1427504494785-3a9ca7044f45"],
  [/consult|abroad|universit/i, "1522202176988-66273c2fd55f"],
  [/skill|music|dance/i, "1511379938547-c1f69419868d"],
  [/wholesale|grocery|shop/i, "1604719312566-8912e9227c6a"],
  [/manufactur|factory|trade/i, "1581091226825-a6a2a5aee158"],
  [/electric|wiring|homeservice|home/i, "1621905251918-48416bd8575a"],
  [/plumb/i, "1585704032915-c3400ca199e7"],
  [/paint/i, "1589939705384-5185137a7f0f"],
  [/interior|furniture/i, "1497366754035-f200968a6e72"],
  [/food|restaurant/i, "1517248135467-4c7edcad34c4"],
  [/doctor|hospital|health/i, "1519494026892-80bbd2d6fd0d"],
  [/dental|dentist/i, "1588776814546-1ffcf47267a5"],
  [/skin|therapy/i, "1512290923902-8a9f81dc236c"],
  [/eye/i, "1577401239170-897942555fb3"],
  [/classroom|school|student/i, "1580582932707-520aed937b7b"],
  [/warehouse/i, "1565043666747-69f6646db940"],
  [/portrait|professional|avatar/i, "1560250097-0b93528c311a"],
];

/** Marketing-only photos (not used on client websites). */
export function stockImg(seed: string, w = 800, h = 600): string {
  for (const [re, id] of STOCK) {
    if (re.test(seed)) return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;
  }
  return `https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=${w}&h=${h}&q=80`;
}
