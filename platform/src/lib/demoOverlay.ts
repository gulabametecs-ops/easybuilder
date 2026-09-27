import type { DemoOverlay } from "./demoSession";

type SectionRow = {
  id: string;
  pageId: string;
  type: string;
  order: number;
  visible: boolean;
  content: string;
  style: string;
};

/** Merge per-session overlay onto tenant site config JSON strings. */
export function applySiteConfigOverlay(
  base: { theme: string; header: string; footer: string; seo: string; customCss: string },
  overlay: DemoOverlay,
) {
  const o = overlay.siteConfig ?? {};
  return {
    theme: o.theme ?? base.theme,
    header: o.header ?? base.header,
    footer: o.footer ?? base.footer,
    seo: o.seo ?? base.seo,
    customCss: o.customCss ?? base.customCss,
  };
}

/** Apply section overlay: content/style/visibility/deletes/reorder/additions. */
export function applySectionsOverlay(sections: SectionRow[], pageId: string, overlay: DemoOverlay): SectionRow[] {
  const o = overlay;
  let list = sections.map((s) => {
    const patch = o.sections?.[s.id];
    if (patch?.deleted) return null;
    return {
      ...s,
      content: patch?.content ?? s.content,
      style: patch?.style ?? s.style,
      visible: patch?.visible ?? s.visible,
    };
  }).filter((s): s is SectionRow => s !== null);

  // Inject overlay-only sections (duplicate/add during demo).
  if (o.addedSections) {
    for (const [id, add] of Object.entries(o.addedSections)) {
      if (add.pageId !== pageId) continue;
      list.push({
        id,
        pageId: add.pageId,
        type: add.type,
        order: add.order,
        visible: add.visible,
        content: add.content,
        style: add.style,
      });
    }
  }

  const order = o.sectionOrder?.[pageId];
  if (order?.length) {
    const map = new Map(list.map((s) => [s.id, s]));
    const ordered: SectionRow[] = [];
    for (const id of order) {
      const s = map.get(id);
      if (s) ordered.push(s);
    }
    for (const s of list) {
      if (!order.includes(s.id)) ordered.push(s);
    }
    list = ordered;
  } else {
    list.sort((a, b) => a.order - b.order);
  }

  return list;
}

export function patchSectionOverlay(
  overlay: DemoOverlay,
  sectionId: string,
  patch: { content?: string; style?: string; visible?: boolean; deleted?: boolean },
): DemoOverlay {
  const next = { ...overlay, sections: { ...overlay.sections } };
  next.sections![sectionId] = { ...next.sections?.[sectionId], ...patch };
  return next;
}

export function patchSiteConfigOverlay(
  overlay: DemoOverlay,
  patch: DemoOverlay["siteConfig"],
): DemoOverlay {
  return { ...overlay, siteConfig: { ...overlay.siteConfig, ...patch } };
}

export function addOverlaySection(
  overlay: DemoOverlay,
  id: string,
  data: { pageId: string; type: string; order: number; visible: boolean; content: string; style: string },
): DemoOverlay {
  const next = { ...overlay, addedSections: { ...overlay.addedSections } };
  next.addedSections![id] = data;
  return next;
}

export function setSectionOrderOverlay(overlay: DemoOverlay, pageId: string, orderedIds: string[]): DemoOverlay {
  return { ...overlay, sectionOrder: { ...overlay.sectionOrder, [pageId]: orderedIds } };
}
