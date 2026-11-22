import { NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { put } from "@vercel/blob";
import { requireAuth, type Authed } from "@/lib/actions/guard";
import { uploadError, recordUpload } from "@/lib/usage";
import { getActiveDemoSessionForTenant } from "@/lib/demoSession";
import { demoUploadPrefix, demoUploadError } from "@/lib/demoMedia";

const MAX_BYTES = 2 * 1024 * 1024; // 2 MB
const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  // SVG intentionally excluded — can carry XSS payloads.
};

// Tenant image upload. Saves to public/uploads/<tenantId>/ and returns the URL.
// Dev/self-host: served from /uploads/*. For serverless (Vercel) swap this for a
// blob store (Vercel Blob / Cloudinary) — the ImageInput contract stays the same.
export async function POST(request: Request) {
  // Same guard as admin actions: also refuses suspended/expired accounts and ended demo sessions.
  let authed: Authed;
  try {
    authed = await requireAuth({ demoOk: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unauthorized";
    return NextResponse.json({ error: msg }, { status: msg === "Unauthorized" ? 401 : 403 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image must be 2MB or smaller." }, { status: 413 });
  }
  const ext = ALLOWED[file.type];
  if (!ext) {
    return NextResponse.json({ error: "Only JPG, PNG, WEBP or GIF allowed." }, { status: 415 });
  }
  // Plan storage quota. Demo sandboxes: own folder, 100 MB cap, wiped when the timer ends.
  const demo = Boolean(authed.session.demo);
  const demoSession = demo ? await getActiveDemoSessionForTenant(authed.tenant) : null;
  if (demo && !demoSession) return NextResponse.json({ error: "Demo session expired." }, { status: 403 });
  const folder = demoSession ? demoUploadPrefix(authed.tenant.id, demoSession.id) : `uploads/${authed.tenant.id}`;
  const quota = demoSession ? await demoUploadError(folder, file.size) : await uploadError(authed.tenant, file.size, MAX_BYTES);
  if (quota) return NextResponse.json({ error: quota }, { status: 413 });

  const bytes = Buffer.from(await file.arrayBuffer());
  const name = `${randomUUID()}.${ext}`;
  const key = `${folder}/${name}`;

  // Production (Vercel): store in Vercel Blob. Dev / self-host: local public/uploads.
  let url = `/${key}`;
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    url = (await put(key, bytes, { access: "public", contentType: file.type })).url;
  } else {
    const dir = path.join(process.cwd(), "public", ...folder.split("/"));
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, name), bytes);
  }
  if (!demo) await recordUpload(authed.tenant.id, url, file.size, file.type, file.name || name);
  return NextResponse.json({ url });
}
