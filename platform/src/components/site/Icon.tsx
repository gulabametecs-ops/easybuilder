import {
  UserCheck,
  BadgeCheck,
  Tag,
  Clock,
  Home,
  Users,
  Wrench,
  Award,
  Phone,
  Mail,
  MapPin,
  Share2,
  Camera,
  MessageCircle,
  SquarePen,
  Headset,
  ClipboardCheck,
  Calendar,
  Zap,
  Droplets,
  Hammer,
  PaintRoller,
  Check,
  ShieldCheck,
  Star,
  Handshake,
  TrendingUp,
  ArrowRight,
  GraduationCap,
  Stethoscope,
  Utensils,
  Store,
  BookOpen,
  Plane,
  HeartPulse,
  ThumbsUp,
  Gift,
  Package,
  Factory,
  Heart,
  Truck,
  type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  "user-check": UserCheck,
  "badge-check": BadgeCheck,
  tag: Tag,
  clock: Clock,
  home: Home,
  users: Users,
  wrench: Wrench,
  award: Award,
  phone: Phone,
  mail: Mail,
  map: MapPin,
  "map-pin": MapPin,
  facebook: Share2,
  instagram: Camera,
  whatsapp: MessageCircle,
  edit: SquarePen,
  headset: Headset,
  clipboard: ClipboardCheck,
  calendar: Calendar,
  bolt: Zap,
  zap: Zap,
  droplet: Droplets,
  hammer: Hammer,
  roller: PaintRoller,
  check: Check,
  shield: ShieldCheck,
  star: Star,
  handshake: Handshake,
  trending: TrendingUp,
  arrow: ArrowRight,
  graduation: GraduationCap,
  "graduation-cap": GraduationCap,
  stethoscope: Stethoscope,
  utensils: Utensils,
  store: Store,
  book: BookOpen,
  "book-open": BookOpen,
  plane: Plane,
  heart: Heart,
  "heart-pulse": HeartPulse,
  "thumbs-up": ThumbsUp,
  gift: Gift,
  package: Package,
  factory: Factory,
  truck: Truck,
};

/** Icon keys shown in the admin visual picker. */
export const ICON_OPTIONS = [
  "star", "check", "badge-check", "award", "thumbs-up", "heart", "shield",
  "home", "users", "user-check", "phone", "mail", "map", "calendar",
  "clock", "zap", "gift", "tag", "edit", "wrench", "hammer", "droplet",
  "roller", "package", "factory", "truck", "book", "graduation", "stethoscope",
  "utensils", "store", "plane", "headset", "clipboard", "handshake", "trending",
  "arrow", "whatsapp", "instagram", "facebook",
] as const;

export function Icon({
  name,
  className,
  strokeWidth = 2,
}: {
  name: string;
  className?: string;
  strokeWidth?: number;
}) {
  const C = MAP[name] ?? Wrench;
  return <C className={className} strokeWidth={strokeWidth} />;
}

// Maps a service category to a representative icon.
export function categoryIcon(category: string): string {
  const c = category.toLowerCase();
  if (c.includes("electric")) return "bolt";
  if (c.includes("plumb")) return "droplet";
  if (c.includes("carpen") || c.includes("interior")) return "hammer";
  if (c.includes("paint")) return "roller";
  if (c.includes("abroad") || c.includes("universit")) return "graduation";
  if (c.includes("india")) return "graduation";
  if (c.includes("test") || c.includes("prep") || c.includes("course")) return "book";
  if (c.includes("visa") || c.includes("document")) return "plane";
  if (c.includes("dental") || c.includes("eye") || c.includes("skin") || c.includes("mental") || c.includes("medicine") || c.includes("clinic")) return "stethoscope";
  if (c.includes("health")) return "heart";
  if (c.includes("dining") || c.includes("food") || c.includes("menu") || c.includes("event") || c.includes("cater")) return "utensils";
  if (c.includes("product") || c.includes("wholesale") || c.includes("shop")) return "store";
  return "wrench";
}
