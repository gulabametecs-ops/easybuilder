import { DEMO_PHOTOS } from "./demoPhotoLibrary";
import { getTemplate } from "./templates";

const u = (id: string, w: number, h: number) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

/** Preview extras for a sector: curated photos (hero first) and its first service titles. */
export function sectorPreview(vertical: string): { photos: string[]; services: string[] } {
  const lib = DEMO_PHOTOS[vertical] ?? [];
  const services = getTemplate(vertical).services.map((s) => s.title).slice(0, 3);
  // a service-tagged photo for each card where the library has one
  const used = new Set<string>([lib[0]?.id ?? ""]);
  const cardPhotos = services.map((t) => {
    const hit = lib.find((p) => !used.has(p.id) && p.services?.some((x) => x.toLowerCase() === t.toLowerCase())) ?? lib.find((p) => !used.has(p.id));
    if (hit) used.add(hit.id);
    return hit ? u(hit.id, 480, 360) : "";
  });
  return { photos: lib[0] ? [u(lib[0].id, 1600, 1000), ...cardPhotos] : [], services };
}
