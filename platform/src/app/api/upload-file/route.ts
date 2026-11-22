import { NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { put } from "@vercel/blob";
import { requireAuth, type Authed } from "@/lib/actions/guard";
import { uploadError, recordUpload, FILE_UPLOAD_CAP_MB } from "@/lib/usage";
import { getActiveDemoSessionForTenant } from "@/lib/demoSession";
import { demoUploadPrefix, demoUploadError } from "@/lib/demoMedia";

const MAX_BYTES = FILE_UPLOAD_CAP_MB * 1024 * 1024; // hard cap; the plan sets the real per-file limit
const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif",
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/vnd.ms-excel": "xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "application/vnd.ms-powerpoint": "ppt",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
  "text/plain": "txt",
  "text/csv": "csv",
};

// General attachment upload (notices): images, PDF and common documents.
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
  if (!(file instanceof File)) return NextResponse.json({ error: "No file provided" }, { status: 400 });
  const ext = ALLOWED[file.type];
  if (!ext) return NextResponse.json({ error: "Allowed: images, PDF, Word, Excel, PowerPoint, TXT or CSV." }, { status: 415 });
  // Per-file size (plan) + storage quota. Demo sandboxes: own folder, 10 MB/file, 100 MB total, wiped at expiry.
  const demo = Boolean(authed.session.demo);
  const demoSession = demo ? await getActiveDemoSessionForTenant(authed.tenant) : null;
  if (demo && !demoSession) return NextResponse.json({ error: "Demo session expired." }, { status: 403 });
  const folder = demoSession ? demoUploadPrefix(authed.tenant.id, demoSession.id) : `uploads/${authed.tenant.id}`;
  const quota = demoSession
    ? file.size > 10 * 1024 * 1024 ? "File must be 10MB or smaller." : await demoUploadError(folder, file.size)
    : await uploadError(authed.tenant, file.size, MAX_BYTES);
  if (quota) return NextResponse.json({ error: quota }, { status: 413 });

  const bytes = Buffer.from(await file.arrayBuffer());
  const name = `${randomUUID()}.${ext}`;
  const key = `${folder}/${name}`;
  const original = (file.name || `file.${ext}`).slice(0, 120);

  let url = `/${key}`;
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    url = (await put(key, bytes, { access: "public", contentType: file.type })).url;
  } else {
    const dir = path.join(process.cwd(), "public", ...folder.split("/"));
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, name), bytes);
  }
  if (!demo) await recordUpload(authed.tenant.id, url, file.size, file.type, original);
  return NextResponse.json({ url, name: original });
}
