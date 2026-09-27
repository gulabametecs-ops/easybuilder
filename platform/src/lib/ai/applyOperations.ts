import { db } from "@/lib/db";
import { parseJson, type ThemeConfig, type HeaderConfig } from "@/lib/config";
import { SECTION_DEFAULTS } from "@/lib/sectionDefaults";
import type { SectionType } from "@/lib/config";
import type { AiOperation } from "./blueprintSchema";
import { isAllowedSectionType } from "./builderRegistry";
import { resolvePageSections, slugify } from "./hydrate";
import type { WebsiteBlueprint } from "./blueprintSchema";

function deepMerge(base: Record<string, unknown>, patch: Record<string, unknown>): Record<string, unknown> {
  const out = { ...base };
  for (const [k, v] of Object.entries(patch)) {
    if (v && typeof v === "object" && !Array.isArray(v) && typeof out[k] === "object" && out[k] && !Array.isArray(out[k])) {
      out[k] = deepMerge(out[k] as Record<string, unknown>, v as Record<string, unknown>);
    } else if (v !== undefined) {
      out[k] = v;
    }
  }
  return out;
}

export async function applyOperations(tenantId: string, operations: AiOperation[]): Promise<string[]> {
  const touchedPages = new Set<string>();

  for (const op of operations) {
    switch (op.op) {
      case "update_section": {
        const section = await db.section.findFirst({
          where: { id: op.sectionId, page: { tenantId } },
          include: { page: true },
        });
        if (!section) continue;
        let content = section.content;
        let style = section.style;
        if (op.content) {
          const parsed = JSON.parse(section.content || "{}") as Record<string, unknown>;
          content = JSON.stringify(deepMerge(parsed, op.content));
        }
        if (op.style) {
          const parsed = JSON.parse(section.style || "{}") as Record<string, unknown>;
          style = JSON.stringify(deepMerge(parsed, op.style));
        }
        await db.section.update({ where: { id: section.id }, data: { content, style } });
        touchedPages.add(section.pageId);
        break;
      }
      case "add_section": {
        let pageId = op.pageId;
        if (!pageId && op.pageSlug) {
          const slug = slugify(op.pageSlug);
          const page = await db.page.findFirst({ where: { tenantId, slug } });
          pageId = page?.id;
        }
        // pageId comes from model output — only accept this tenant's pages.
        if (pageId && !(await db.page.findFirst({ where: { id: pageId, tenantId }, select: { id: true } }))) continue;
        if (!pageId || !isAllowedSectionType(op.sectionType)) continue;
        const t = op.sectionType as SectionType;
        const max = await db.section.aggregate({ where: { pageId }, _max: { order: true } });
        let order = (max._max.order ?? -1) + 1;
        if (op.afterSectionId) {
          const after = await db.section.findFirst({ where: { id: op.afterSectionId, pageId } });
          if (after) {
            order = after.order + 1;
            await db.section.updateMany({
              where: { pageId, order: { gte: order } },
              data: { order: { increment: 1 } },
            });
          }
        }
        const base = SECTION_DEFAULTS[t] as Record<string, unknown>;
        const content = JSON.stringify(op.content ? deepMerge(base, op.content) : base);
        const style = JSON.stringify(op.style ?? {});
        await db.section.create({ data: { pageId, type: t, order, content, style } });
        touchedPages.add(pageId);
        break;
      }
      case "delete_section": {
        const section = await db.section.findFirst({
          where: { id: op.sectionId, page: { tenantId } },
        });
        if (!section) continue;
        await db.section.delete({ where: { id: section.id } });
        touchedPages.add(section.pageId);
        break;
      }
      case "move_section": {
        const section = await db.section.findFirst({
          where: { id: op.sectionId, page: { tenantId } },
        });
        if (!section) continue;
        const swap = await db.section.findFirst({
          where: {
            pageId: section.pageId,
            order: op.direction === "up" ? { lt: section.order } : { gt: section.order },
          },
          orderBy: { order: op.direction === "up" ? "desc" : "asc" },
        });
        if (!swap) continue;
        await db.$transaction([
          db.section.update({ where: { id: section.id }, data: { order: swap.order } }),
          db.section.update({ where: { id: swap.id }, data: { order: section.order } }),
        ]);
        touchedPages.add(section.pageId);
        break;
      }
      case "update_theme": {
        const cfg = await db.siteConfig.findUnique({ where: { tenantId } });
        if (!cfg) break;
        const theme = parseJson<ThemeConfig>(cfg.theme, {} as ThemeConfig);
        const next = deepMerge(theme as Record<string, unknown>, op.theme) as ThemeConfig;
        await db.siteConfig.update({ where: { tenantId }, data: { theme: JSON.stringify(next) } });
        break;
      }
      case "update_header": {
        const cfg = await db.siteConfig.findUnique({ where: { tenantId } });
        if (!cfg) break;
        const header = parseJson<HeaderConfig>(cfg.header, {} as HeaderConfig);
        const patch: Record<string, unknown> = { ...(op.header ?? {}) };
        if (op.nav) patch.nav = op.nav;
        const next = deepMerge(header as Record<string, unknown>, patch) as HeaderConfig;
        await db.siteConfig.update({ where: { tenantId }, data: { header: JSON.stringify(next) } });
        break;
      }
      case "create_page": {
        const slug = slugify(op.slug);
        const exists = await db.page.findFirst({ where: { tenantId, slug } });
        if (exists) {
          touchedPages.add(exists.id);
          break;
        }
        const pageDef: WebsiteBlueprint["pages"][number] = {
          name: op.name,
          slug,
          pageTemplateId: op.pageTemplateId,
          sections: op.sections,
        };
        const sections = resolvePageSections(pageDef);
        const max = await db.page.aggregate({ where: { tenantId }, _max: { order: true } });
        const page = await db.page.create({
          data: {
            tenantId,
            slug,
            title: op.name,
            isSystem: false,
            published: true,
            showInNav: true,
            order: (max._max.order ?? 0) + 1,
            sections: {
              create: sections.map((s, i) => ({
                type: s.type,
                order: i,
                content: s.content,
                style: s.style,
              })),
            },
          },
        });
        touchedPages.add(page.id);
        break;
      }
    }
  }

  return [...touchedPages];
}
