import { db } from "@/lib/db";
import { parseJson, type HeaderConfig, type ThemeConfig } from "@/lib/config";
import { defaultHeader } from "@/lib/template";
import { img } from "@/lib/img";
import type { WebsiteBlueprint } from "./blueprintSchema";
import { designToTheme, resolvePageSections, slugify } from "./hydrate";
import { blueprintHeader, blueprintFooter } from "./blueprintPreview";
import { canonicalPageSlug } from "./completeHome";

export type ApplyBlueprintOptions = {
  tenantId: string;
  blueprint: WebsiteBlueprint;
  mode?: "create_pages" | "replace_home" | "overwrite";
};

export type ApplyBlueprintResult = {
  pageIds: string[];
  updatedTheme: boolean;
  servicesAdded: number;
};

function buildNav(pages: { title: string; slug: string }[]): HeaderConfig["nav"] {
  return pages.map((p) => ({
    label: p.title,
    href: p.slug === "home" ? "/" : `/${p.slug}`,
  }));
}

export async function applyBlueprint(opts: ApplyBlueprintOptions): Promise<ApplyBlueprintResult> {
  const { tenantId, blueprint, mode = "create_pages" } = opts;
  const biz = blueprint.website.name;
  const pageIds: string[] = [];
  let updatedTheme = false;
  let servicesAdded = 0;

  await db.$transaction(async (tx) => {
    const tenant = await tx.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new Error("Tenant not found");

    const cfg = await tx.siteConfig.findUnique({ where: { tenantId } });
    if (!cfg) throw new Error("Site config not found");

    if (mode === "overwrite") {
    const keepSlugs = blueprint.pages.map((p) => canonicalPageSlug(p.slug || p.name, p.name));
      await tx.service.deleteMany({ where: { tenantId } });
      await tx.galleryItem.deleteMany({ where: { tenantId } });
      const extraPages = await tx.page.findMany({
        where: { tenantId, slug: { notIn: keepSlugs } },
        select: { id: true },
      });
      if (extraPages.length) {
        await tx.section.deleteMany({ where: { pageId: { in: extraPages.map((p) => p.id) } } });
        await tx.page.deleteMany({ where: { id: { in: extraPages.map((p) => p.id) } } });
      }
    }

    const navPages = blueprint.pages.map((p) => ({
      title: p.name,
      slug: canonicalPageSlug(p.slug || p.name, p.name),
    }));
    const header =
      mode === "overwrite"
        ? { ...blueprintHeader(blueprint), nav: buildNav(navPages) }
        : { ...parseJson<HeaderConfig>(cfg.header, defaultHeader(biz)), logoText: biz, nav: buildNav(navPages) };
    const nextTheme = blueprint.design
      ? designToTheme(blueprint.design, parseJson<ThemeConfig>(cfg.theme, designToTheme(blueprint.design)))
      : parseJson<ThemeConfig>(cfg.theme, designToTheme(undefined));

    await tx.siteConfig.update({
      where: { tenantId },
      data: {
        theme: JSON.stringify(nextTheme),
        header: JSON.stringify(header),
        ...(mode === "overwrite" ? { footer: JSON.stringify(blueprintFooter(blueprint)) } : {}),
        seo: JSON.stringify({
          ...parseJson(cfg.seo, {}),
          title: `${biz} — ${blueprint.website.type ?? "Official Website"}`,
          description: blueprint.website.description ?? "",
        }),
      },
    });
    updatedTheme = true;

    if (blueprint.services?.length) {
      const maxOrder = await tx.service.aggregate({ where: { tenantId }, _max: { order: true } });
      let order = (maxOrder._max.order ?? -1) + 1;
      const seen = new Set<string>();
      for (const s of blueprint.services) {
        let slug = slugify(s.title);
        if (seen.has(slug)) slug = `${slug}-${order}`;
        seen.add(slug);
        await tx.service.create({
          data: {
            tenantId,
            category: s.category,
            title: s.title,
            description: s.description,
            image: img(s.title, 600, 400),
            order: order++,
            slug,
          },
        });
        servicesAdded++;
      }
    }

    for (const [idx, pageDef] of blueprint.pages.entries()) {
      const slug = canonicalPageSlug(pageDef.slug || pageDef.name, pageDef.name);
      const sections = resolvePageSections(pageDef, blueprint.design);

      if (mode === "replace_home" && slug === "home") {
        const home = await tx.page.findFirst({ where: { tenantId, slug: "home" } });
        if (home) {
          await tx.section.deleteMany({ where: { pageId: home.id } });
          await tx.section.createMany({
            data: sections.map((s, i) => ({
              pageId: home.id,
              type: s.type,
              order: i,
              content: s.content,
              style: s.style,
            })),
          });
          await tx.page.update({
            where: { id: home.id },
            data: { title: pageDef.name || home.title },
          });
          pageIds.push(home.id);
        }
        continue;
      }

      const existing = await tx.page.findFirst({ where: { tenantId, slug } });
      if (existing && mode === "overwrite") {
        await tx.section.deleteMany({ where: { pageId: existing.id } });
        await tx.section.createMany({
          data: sections.map((s, i) => ({
            pageId: existing.id,
            type: s.type,
            order: i,
            content: s.content,
            style: s.style,
          })),
        });
        await tx.page.update({
          where: { id: existing.id },
          data: {
            title: pageDef.name,
            published: pageDef.published ?? existing.published,
            showInNav: pageDef.showInNav ?? existing.showInNav,
          },
        });
        pageIds.push(existing.id);
        continue;
      }

      if (existing) {
        pageIds.push(existing.id);
        continue;
      }

      const max = await tx.page.aggregate({ where: { tenantId }, _max: { order: true } });
      const page = await tx.page.create({
        data: {
          tenantId,
          slug,
          title: pageDef.name,
          isSystem: slug === "home",
          published: pageDef.published ?? true,
          showInNav: pageDef.showInNav ?? slug !== "home",
          order: pageDef.slug === "home" ? 0 : (max._max.order ?? 0) + 1 + idx,
          seoTitle: pageDef.name,
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
      pageIds.push(page.id);
    }
  });

  return { pageIds, updatedTheme, servicesAdded };
}
