import { readdir, stat, rm } from "node:fs/promises";
import path from "node:path";
import { db } from "@/lib/db";
import { deleteDemoUploads } from "@/lib/demoMedia";
import { pruneDisk } from "./previewStore";

// AI-builder leftovers that would otherwise pile up forever:
//  • live preview tenants ("ai-…" subdomains, owner preview@….ai.test) — each opening of
//    "Open site / Open admin" pushes subscriptionEndsAt 2 h ahead; once that passes unused,
//    the whole tenant (pages, sections, services…) and its uploads folder are deleted;
//  • preview blueprint files in .data/ai-previews (2 h TTL);
//  • logo/hero images uploaded in the AI builder (public/uploads/ai) older than 7 days that
//    no real website uses (a bought site may still point at them, so those are kept).
const UPLOAD_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const AI_UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "ai");
const THROTTLE_MS = 10 * 60 * 1000;
let lastRun = 0;

async function inUse(file: string): Promise<boolean> {
  const needle = `/uploads/ai/${file}`;
  const [sections, configs, services, gallery] = await Promise.all([
    db.section.count({ where: { content: { contains: needle } } }),
    db.siteConfig.count({ where: { OR: [{ header: { contains: needle } }, { seo: { contains: needle } }, { footer: { contains: needle } }] } }),
    db.service.count({ where: { image: { contains: needle } } }),
    db.galleryItem.count({ where: { image: { contains: needle } } }),
  ]);
  return sections + configs + services + gallery > 0;
}

/** Run the cleanup. `force` skips the 10-minute throttle (cron). */
export async function sweepAiPreviews({ force = false, now = Date.now() } = {}) {
  if (!force && now - lastRun < THROTTLE_MS) return null;
  lastRun = now;

  const expired = await db.tenant.findMany({
    where: {
      subdomain: { startsWith: "ai-" },
      subscriptionEndsAt: { lt: new Date(now) },
      users: { some: { email: { endsWith: ".ai.test" } } },
    },
    select: { id: true },
    take: 200,
  });
  for (const t of expired) {
    await deleteDemoUploads(`uploads/${t.id}`).catch(() => {});
    await db.tenant.delete({ where: { id: t.id } }).catch(() => {});
  }

  pruneDisk();

  let uploadsDeleted = 0;
  const files = await readdir(AI_UPLOAD_DIR).catch(() => [] as string[]);
  for (const f of files.slice(0, 500)) {
    const full = path.join(AI_UPLOAD_DIR, f);
    const st = await stat(full).catch(() => null);
    if (!st?.isFile() || now - st.mtimeMs < UPLOAD_TTL_MS) continue;
    if (await inUse(f)) continue;
    await rm(full, { force: true });
    uploadsDeleted++;
  }

  return { previewSitesDeleted: expired.length, uploadsDeleted };
}
