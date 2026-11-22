import { VERTICALS, categoryOf } from "@/lib/verticals";
import { stockImg } from "@/lib/img";
import { getTemplate } from "@/lib/templates";
import { DESIGNS } from "@/lib/designs";
import { demoSiteUrl } from "@/lib/demoSession";
import type { DemoSector } from "@/components/marketing/DemosExplorer";
import { sectorPreview } from "@/lib/sectorPreview";

// Every sector with its 5 design palettes — shared by /demos and /demos/start.
export function buildSectors(): DemoSector[] {
  return VERTICALS.map((v) => {
    const colors = getTemplate(v.id).theme.colors;
    return {
      id: v.id,
      name: v.name,
      tagline: v.tagline,
      icon: v.icon,
      status: v.status,
      category: categoryOf(v.id),
      accent: v.accent,
      image:
        v.id === "ngo-charity"
          ? stockImg("charity children volunteers", 640, 400)
          : v.id === "social-foundation"
            ? stockImg("grassroots foundation rural village plantation", 640, 400)
            : stockImg(v.name, 640, 400),
      ...sectorPreview(v.id),
      description: v.description,
      look: v.look,
      demoUrl: v.status === "live" ? demoSiteUrl(v.id) : null,
      designs: DESIGNS.map((d) => ({
        id: d.id,
        name: d.name,
        blurb: d.blurb,
        tagline: d.tagline,
        font: d.font,
        header: d.header,
        hero: d.hero ?? null,
        colors: d.palette(colors),
      })),
    };
  });
}
