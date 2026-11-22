import { readdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import { del, list } from "@vercel/blob";

// Demo sandboxes get their own upload folder so we can cap them (100 MB) and wipe them
// completely when the timer ends — no DB tracking needed.
export const DEMO_STORAGE_BYTES = 100 * 1024 * 1024;

export function demoUploadPrefix(tenantId: string, sessionId: string): string {
  return `uploads/${tenantId}/demo-${sessionId}`;
}

const blobEnabled = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);
const localDir = (prefix: string) => path.join(process.cwd(), "public", ...prefix.split("/"));

async function blobsUnder(prefix: string) {
  const out: { url: string; size: number }[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: `${prefix}/`, cursor });
    out.push(...page.blobs.map((b) => ({ url: b.url, size: b.size })));
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return out;
}

/** Bytes already uploaded in this demo sandbox. */
export async function demoUsedBytes(prefix: string): Promise<number> {
  if (blobEnabled()) return (await blobsUnder(prefix)).reduce((sum, b) => sum + b.size, 0);
  try {
    const dir = localDir(prefix);
    const names = await readdir(dir);
    const sizes = await Promise.all(names.map(async (n) => (await stat(path.join(dir, n))).size));
    return sizes.reduce((a, b) => a + b, 0);
  } catch {
    return 0; // folder not created yet
  }
}

/** Error message if this upload would push the sandbox over its cap, else null. */
export async function demoUploadError(prefix: string, size: number): Promise<string | null> {
  const used = await demoUsedBytes(prefix);
  return used + size > DEMO_STORAGE_BYTES ? "Demo storage is limited to 100 MB. Delete a file or buy a plan for more space." : null;
}

/** Permanently delete every file the sandbox uploaded. */
export async function deleteDemoUploads(prefix: string): Promise<void> {
  if (blobEnabled()) {
    const urls = (await blobsUnder(prefix)).map((b) => b.url);
    if (urls.length) await del(urls);
    return;
  }
  await rm(localDir(prefix), { recursive: true, force: true });
}
