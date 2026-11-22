import { unlink } from "node:fs/promises";
import path from "node:path";
import { del } from "@vercel/blob";
import { db } from "@/lib/db";
import { getPlatformConfig } from "@/lib/platformConfig";
import { isDemoSubdomain } from "@/lib/demoSession";
import { resolveTier, limitMessage, wouldExceed, type PlanLimits, type Tier } from "@/lib/plans";

type TenantRef = { id: string; plan: string; subdomain: string };

/** Hard cap for document uploads (/api/upload-file); the plan can set a lower per-file limit. */
export const FILE_UPLOAD_CAP_MB = 25;

// The tenant's plan + limits. limits = null → unlimited (legacy plan or demo tenant).
export async function planFor(tenant: TenantRef): Promise<{ tier?: Tier; limits: PlanLimits | null }> {
  if (isDemoSubdomain(tenant.subdomain)) return { limits: null };
  const tier = resolveTier(tenant.plan, (await getPlatformConfig()).planOverrides);
  return { tier, limits: tier?.limits ?? null };
}

/** Largest document a tenant can upload right now, in MB (for upload hints). */
export async function fileUploadMb(tenant: TenantRef): Promise<number> {
  const { limits } = await planFor(tenant);
  return Math.min(FILE_UPLOAD_CAP_MB, limits?.uploadMb || FILE_UPLOAD_CAP_MB);
}

function monthStart(): Date {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

// Demo-sandbox rows (demoSessionId set) never count.
export type CountKey = "pages" | "services" | "gallery" | "users" | "aiEdits";
const counters: Record<CountKey, (tenantId: string) => Promise<number>> = {
  pages: (tenantId) => db.page.count({ where: { tenantId, isSystem: false } }),
  services: (tenantId) => db.service.count({ where: { tenantId, demoSessionId: null } }),
  gallery: (tenantId) => db.galleryItem.count({ where: { tenantId, demoSessionId: null } }),
  users: (tenantId) => db.user.count({ where: { tenantId } }),
  aiEdits: (tenantId) =>
    db.aiGeneration.count({ where: { tenantId, kind: { in: ["plan", "modify"] }, status: "completed", createdAt: { gte: monthStart() } } }),
};

export async function storageUsedBytes(tenantId: string): Promise<number> {
  return (await db.mediaFile.aggregate({ where: { tenantId }, _sum: { bytes: true } }))._sum.bytes ?? 0;
}

export async function getUsage(tenantId: string): Promise<Record<CountKey, number> & { storageBytes: number }> {
  const [pages, services, gallery, users, aiEdits, storageBytes] = await Promise.all([
    counters.pages(tenantId), counters.services(tenantId), counters.gallery(tenantId),
    counters.users(tenantId), counters.aiEdits(tenantId), storageUsedBytes(tenantId),
  ]);
  return { pages, services, gallery, users, aiEdits, storageBytes };
}

// Friendly error if creating `adding` more of `key` would go past the plan; null if OK.
// Over-limit after a downgrade only blocks new creates — existing content is never touched.
export async function limitError(tenant: TenantRef, key: CountKey, adding = 1): Promise<string | null> {
  const { tier, limits } = await planFor(tenant);
  if (adding <= 0 || !tier || !limits || limits[key] === 0) return null;
  return wouldExceed(limits[key], await counters[key](tenant.id), adding) ? limitMessage(key, limits[key], tier.name) : null;
}

// Upload gate: per-file size + total storage. `capBytes` is the route's own hard cap.
export async function uploadError(tenant: TenantRef, size: number, capBytes: number): Promise<string | null> {
  const { tier, limits } = await planFor(tenant);
  const planMax = limits?.uploadMb ? limits.uploadMb * 1024 * 1024 : Infinity;
  const max = Math.min(capBytes, planMax);
  if (size > max) {
    const mb = Math.round(max / 1024 / 1024);
    return planMax < capBytes && tier
      ? `Files on the ${tier.name} plan can be up to ${mb} MB. Upgrade your plan from Billing for bigger files.`
      : `File must be ${mb} MB or smaller.`;
  }
  if (!tier || !limits?.storageMb) return null;
  if (wouldExceed(limits.storageMb * 1024 * 1024, await storageUsedBytes(tenant.id), size)) {
    return `${limitMessage("storageMb", limits.storageMb, tier.name)} You can also free space under Storage.`;
  }
  return null;
}

// ponytail: concurrent uploads can overshoot the quota by one file each; fine for a soft quota.
export async function recordUpload(tenantId: string, url: string, bytes: number, mime: string, originalName: string) {
  await db.mediaFile.create({ data: { tenantId, url, bytes, mime, originalName: originalName.slice(0, 200) } });
}

// Is this uploaded file still used anywhere on the tenant's site?
// Matches the unique file name (uuid.ext), so blob and local URLs both hit.
export async function isMediaReferenced(tenantId: string, url: string): Promise<boolean> {
  const c = { contains: url.split("/").pop() || url };
  const counts = await Promise.all([
    db.siteConfig.count({ where: { tenantId, OR: [{ theme: c }, { header: c }, { footer: c }, { seo: c }, { customCss: c }, { payments: c }] } }),
    db.section.count({ where: { page: { tenantId }, OR: [{ content: c }, { style: c }] } }),
    db.page.count({ where: { tenantId, seoImage: c } }),
    db.service.count({ where: { tenantId, OR: [{ image: c }, { description: c }, { longDescription: c }] } }),
    db.galleryItem.count({ where: { tenantId, image: c } }),
    db.person.count({ where: { tenantId, OR: [{ image: c }, { bio: c }] } }),
    db.siteEvent.count({ where: { tenantId, OR: [{ coverImage: c }, { gallery: c }, { documents: c }, { blocks: c }, { qrImage: c }, { programDescription: c }] } }),
    db.notice.count({ where: { tenantId, OR: [{ attachmentUrl: c }, { link: c }] } }),
    db.campaign.count({ where: { tenantId, adImage: c } }),
    db.property.count({ where: { tenantId, OR: [{ coverImage: c }, { gallery: c }, { floorPlans: c }, { brochureUrl: c }, { description: c }] } }),
    db.cause.count({ where: { tenantId, OR: [{ coverImage: c }, { gallery: c }, { story: c }] } }),
  ]);
  return counts.some((n) => n > 0);
}

async function removeStoredFile(tenantId: string, url: string) {
  if (/^https?:\/\//.test(url)) {
    if (process.env.BLOB_READ_WRITE_TOKEN) await del(url);
    return;
  }
  const prefix = `/uploads/${tenantId}/`;
  const name = url.slice(prefix.length);
  if (!url.startsWith(prefix) || !/^[\w-]+\.\w+$/.test(name)) return; // never touch anything else
  await unlink(path.join(process.cwd(), "public", "uploads", tenantId, name)).catch(() => {});
}

// Delete one tracked file (row + blob/local file). Refuses while it's still in use.
export async function deleteMediaFile(tenantId: string, id: string): Promise<string | null> {
  const f = await db.mediaFile.findFirst({ where: { id, tenantId } });
  if (!f) return "File not found.";
  if (await isMediaReferenced(tenantId, f.url)) {
    return "This file is still used on your website. Remove it there first, then delete it here.";
  }
  await removeStoredFile(tenantId, f.url);
  await db.mediaFile.delete({ where: { id: f.id } });
  return null;
}

// After deleting a row (gallery item, service, notice…), free any uploaded file it
// owned that nothing else references. Pass the deleted row (or any text containing URLs).
export async function releaseMediaIn(tenantId: string, deleted: unknown) {
  if (!deleted) return;
  const text = JSON.stringify(deleted);
  const files = await db.mediaFile.findMany({ where: { tenantId }, select: { id: true, url: true } });
  for (const f of files) {
    if (!text.includes(f.url.split("/").pop() || f.url)) continue;
    if (await isMediaReferenced(tenantId, f.url)) continue;
    await removeStoredFile(tenantId, f.url).catch(() => {});
    await db.mediaFile.delete({ where: { id: f.id } }).catch(() => {});
  }
}
