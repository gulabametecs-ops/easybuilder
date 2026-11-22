// Real-estate listings shared by admin, public site and templates. Client-safe (no DB imports).

export type PropertyPurpose = "sale" | "rent" | "pg" | "project";
export type PropertyStatus = "available" | "under-offer" | "sold" | "rented";

export const PURPOSES: { id: PropertyPurpose; label: string; short: string }[] = [
  { id: "sale", label: "For sale", short: "Buy" },
  { id: "rent", label: "For rent", short: "Rent" },
  { id: "pg", label: "PG / Hostel", short: "PG" },
  { id: "project", label: "New project", short: "Projects" },
];

export const PROPERTY_TYPES: { id: string; label: string }[] = [
  { id: "apartment", label: "Apartment / Flat" },
  { id: "villa", label: "Villa" },
  { id: "house", label: "Independent house" },
  { id: "plot", label: "Plot / Land" },
  { id: "commercial", label: "Commercial" },
  { id: "office", label: "Office space" },
  { id: "shop", label: "Shop / Showroom" },
  { id: "pg-room", label: "PG room" },
  { id: "hostel", label: "Hostel / Co-living" },
];

export const STATUSES: { id: PropertyStatus; label: string }[] = [
  { id: "available", label: "Available" },
  { id: "under-offer", label: "Under offer" },
  { id: "sold", label: "Sold" },
  { id: "rented", label: "Rented out" },
];

export const FURNISHING = ["Furnished", "Semi-furnished", "Unfurnished"];

/** Amenity ids → label + icon name (site Icon component). */
export const AMENITIES: { id: string; label: string; icon: string }[] = [
  { id: "parking", label: "Parking", icon: "car" },
  { id: "lift", label: "Lift", icon: "arrow-up" },
  { id: "power-backup", label: "Power backup", icon: "zap" },
  { id: "security", label: "24×7 security", icon: "shield" },
  { id: "cctv", label: "CCTV", icon: "camera" },
  { id: "gym", label: "Gym", icon: "dumbbell" },
  { id: "pool", label: "Swimming pool", icon: "waves" },
  { id: "clubhouse", label: "Clubhouse", icon: "building" },
  { id: "garden", label: "Garden / park", icon: "leaf" },
  { id: "play-area", label: "Kids play area", icon: "smile" },
  { id: "wifi", label: "Wi-Fi", icon: "wifi" },
  { id: "ac", label: "Air conditioning", icon: "snowflake" },
  { id: "meals", label: "Meals included", icon: "utensils" },
  { id: "laundry", label: "Laundry", icon: "shirt" },
  { id: "housekeeping", label: "Housekeeping", icon: "sparkles" },
  { id: "water", label: "24×7 water", icon: "droplets" },
  { id: "gas", label: "Piped gas", icon: "flame" },
  { id: "study", label: "Study area", icon: "book" },
  { id: "tv", label: "TV / common room", icon: "tv" },
  { id: "fridge", label: "Fridge", icon: "box" },
];

export type FloorPlan = { label: string; image: string; area?: string };

/** What the public site renders (parsed JSON fields). */
export type PublicProperty = {
  id: string;
  slug: string;
  title: string;
  purpose: PropertyPurpose;
  propertyType: string;
  price: number;
  priceNote: string;
  deposit: number;
  maintenance: number;
  bhk: string;
  areaSqft: number;
  furnishing: string;
  bathrooms: number;
  floor: string;
  facing: string;
  parking: string;
  availableFrom: string;
  possession: string;
  rera: string;
  sharing: string;
  foodIncluded: boolean;
  gender: string;
  locality: string;
  city: string;
  address: string;
  mapUrl: string;
  summary: string;
  description: string;
  highlights: string[];
  amenities: string[];
  coverImage: string;
  gallery: string[];
  floorPlans: FloorPlan[];
  brochureUrl: string;
  videoUrl: string;
  status: PropertyStatus;
  featured: boolean;
};

function jsonArr<T>(raw: string | null | undefined): T[] {
  try {
    const v = JSON.parse(raw || "[]");
    return Array.isArray(v) ? (v as T[]) : [];
  } catch {
    return [];
  }
}

/** DB row → public shape. */
export function mapProperty(r: {
  id: string; slug: string; title: string; purpose: string; propertyType: string; price: number; priceNote: string;
  deposit: number; maintenance: number; bhk: string; areaSqft: number; furnishing: string; bathrooms: number; floor: string;
  facing: string; parking: string; availableFrom: string; possession: string; rera: string; sharing: string;
  foodIncluded: boolean; gender: string; locality: string; city: string; address: string; mapUrl: string; summary: string;
  description: string; highlights: string; amenities: string; coverImage: string; gallery: string; floorPlans: string;
  brochureUrl: string; videoUrl: string; status: string; featured: boolean;
}): PublicProperty {
  return {
    ...r,
    purpose: (PURPOSES.some((p) => p.id === r.purpose) ? r.purpose : "sale") as PropertyPurpose,
    status: (STATUSES.some((s) => s.id === r.status) ? r.status : "available") as PropertyStatus,
    highlights: jsonArr<string>(r.highlights).filter((x) => typeof x === "string"),
    amenities: jsonArr<string>(r.amenities).filter((x) => typeof x === "string"),
    gallery: jsonArr<string>(r.gallery).filter((x) => typeof x === "string" && x),
    floorPlans: jsonArr<FloorPlan>(r.floorPlans).filter((f) => f && typeof f.label === "string"),
  };
}

/** ₹ in Indian style: 4500000 → "₹45 Lakh", 12500000 → "₹1.25 Cr", 18000 → "₹18,000". */
export function formatPrice(inr: number): string {
  if (!inr || inr <= 0) return "Price on request";
  if (inr >= 1_00_00_000) return `₹${trimNum(inr / 1_00_00_000)} Cr`;
  if (inr >= 1_00_000) return `₹${trimNum(inr / 1_00_000)} Lakh`;
  return `₹${inr.toLocaleString("en-IN")}`;
}
function trimNum(n: number): string {
  return n.toFixed(2).replace(/\.?0+$/, "");
}

/** Price line for cards: "₹45 Lakh", "₹18,000 /month", "₹9,500 /bed". */
export function priceLabel(p: Pick<PublicProperty, "price" | "priceNote" | "purpose">): string {
  const base = formatPrice(p.price);
  if (!p.price) return base;
  const note = p.priceNote.trim() || (p.purpose === "rent" ? "/month" : p.purpose === "pg" ? "/month" : "");
  return note ? `${base} ${note.startsWith("/") ? note : note}` : base;
}

/** Monthly EMI (reducing balance). rateAnnualPct e.g. 8.5, years e.g. 20. */
export function emi(principal: number, rateAnnualPct: number, years: number): number {
  const n = Math.round(years * 12);
  if (principal <= 0 || n <= 0) return 0;
  const r = rateAnnualPct / 12 / 100;
  if (r === 0) return Math.round(principal / n);
  const f = Math.pow(1 + r, n);
  return Math.round((principal * r * f) / (f - 1));
}

export const amenityLabel = (id: string) => AMENITIES.find((a) => a.id === id)?.label ?? id;
export const typeLabel = (id: string) => PROPERTY_TYPES.find((t) => t.id === id)?.label ?? id;
export const purposeLabel = (id: string) => PURPOSES.find((p) => p.id === id)?.label ?? id;
