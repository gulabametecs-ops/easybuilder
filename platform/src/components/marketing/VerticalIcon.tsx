import {
  Wrench,
  GraduationCap,
  School,
  Utensils,
  Stethoscope,
  Store,
  Factory,
  Music,
  type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  wrench: Wrench,
  graduation: GraduationCap,
  school: School,
  utensils: Utensils,
  stethoscope: Stethoscope,
  store: Store,
  factory: Factory,
  music: Music,
};

export function VerticalIcon({ name, className }: { name: string; className?: string }) {
  const C = MAP[name] ?? Wrench;
  return <C className={className} />;
}
