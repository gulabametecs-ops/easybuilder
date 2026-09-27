import { NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { put } from "@vercel/blob";
import { getAuthedSession } from "@/lib/auth";

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
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
  const authed = await getAuthedSession();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file provided" }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "File must be 10MB or smaller." }, { status: 413 });
  const ext = ALLOWED[file.type];
  if (!ext) return NextResponse.json({ error: "Allowed: images, PDF, Word, Excel, PowerPoint, TXT or CSV." }, { status: 415 });

  const bytes = Buffer.from(await file.arrayBuffer());
  const name = `${randomUUID()}.${ext}`;
  const key = `uploads/${authed.tenant.id}/${name}`;
  const original = (file.name || `file.${ext}`).slice(0, 120);

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(key, bytes, { access: "public", contentType: file.type });
    return NextResponse.json({ url: blob.url, name: original });
  }

  const dir = path.join(process.cwd(), "public", "uploads", authed.tenant.id);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), bytes);
  return NextResponse.json({ url: `/${key}`, name: original });
}
