import { NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { put } from "@vercel/blob";
import { getAuthedSession } from "@/lib/auth";

const MAX_BYTES = 2 * 1024 * 1024; // 2 MB
const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};

// Tenant image upload. Saves to public/uploads/<tenantId>/ and returns the URL.
// Dev/self-host: served from /uploads/*. For serverless (Vercel) swap this for a
// blob store (Vercel Blob / Cloudinary) — the ImageInput contract stays the same.
export async function POST(request: Request) {
  const authed = await getAuthedSession();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
    return NextResponse.json({ error: "Only JPG, PNG, WEBP, GIF or SVG allowed." }, { status: 415 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const name = `${randomUUID()}.${ext}`;
  const key = `uploads/${authed.tenant.id}/${name}`;

  // Production (Vercel): store in Vercel Blob. Dev / self-host: local public/uploads.
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(key, bytes, { access: "public", contentType: file.type });
    return NextResponse.json({ url: blob.url });
  }

  const dir = path.join(process.cwd(), "public", "uploads", authed.tenant.id);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), bytes);
  return NextResponse.json({ url: `/${key}` });
}
