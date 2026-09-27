import { db } from "@/lib/db";
import { parseJson, type ThemeConfig } from "@/lib/config";
import { defaultTheme } from "@/lib/template";

export type AiSiteContext = {
  businessName: string;
  vertical: string;
  theme: Pick<ThemeConfig["colors"], "primary" | "secondary" | "dark" | "light" | "heading" | "text"> & { font: string };
  pages: {
    id: string;
    slug: string;
    title: string;
    sections: { id: string; type: string; order: number; label?: string }[];
  }[];
};

export async function loadSiteContext(tenantId: string, pageId?: string): Promise<AiSiteContext> {
  const tenant = await db.tenant.findUnique({ where: { id: tenantId } });
  const cfg = await db.siteConfig.findUnique({ where: { tenantId } });
  const theme = parseJson<ThemeConfig>(cfg?.theme, defaultTheme);

  const pages = await db.page.findMany({
    where: { tenantId, ...(pageId ? { id: pageId } : {}) },
    orderBy: { order: "asc" },
    include: { sections: { orderBy: { order: "asc" } } },
  });

  return {
    businessName: tenant?.name ?? "Business",
    vertical: tenant?.vertical ?? "home-services",
    theme: { ...theme.colors, font: theme.font },
    pages: pages.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      sections: p.sections.map((s) => ({ id: s.id, type: s.type, order: s.order })),
    })),
  };
}

export function siteContextPromptBlock(ctx: AiSiteContext): string {
  const pages = ctx.pages
    .map(
      (p) =>
        `Page "${p.title}" slug=${p.slug} id=${p.id}\n` +
        p.sections.map((s) => `  - section id=${s.id} type=${s.type} order=${s.order}`).join("\n"),
    )
    .join("\n\n");
  return `SITE: ${ctx.businessName} (vertical: ${ctx.vertical})
THEME: primary=${ctx.theme.primary} dark=${ctx.theme.dark} light=${ctx.theme.light} font=${ctx.theme.font}

PAGES:
${pages}`;
}
