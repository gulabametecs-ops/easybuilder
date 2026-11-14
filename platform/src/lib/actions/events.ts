"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireTenantId, getDemoSessionId } from "./guard";
import { parseBlocks, parseDocs, parseStringList } from "@/lib/eventContent";

function str(form: FormData, key: string) {
  return (form.get(key)?.toString() ?? "").trim();
}

function slugify(input: string) {
  return input.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "event";
}

function lines(form: FormData, key: string) {
  return str(form, key).split("\n").map((s) => s.trim()).filter(Boolean);
}

export async function saveEvent(formData: FormData) {
  const tenantId = await requireTenantId({ demoOk: true });
  const demoSessionId = await getDemoSessionId();
  const id = str(formData, "id");
  const title = str(formData, "title") || "Untitled event";
  let slug = slugify(str(formData, "slug") || title);
  const existing = await db.siteEvent.findFirst({
    where: { tenantId, slug, ...(id ? { NOT: { id } } : {}) },
  });
  if (existing) slug = `${slug}-${Date.now().toString().slice(-4)}`;

  const docsRaw = str(formData, "documentsJson");
  const blocksRaw = str(formData, "blocksJson");
  const galleryFromJson = str(formData, "galleryJson");
  const documents = docsRaw ? JSON.stringify(parseDocs(docsRaw)) : JSON.stringify(
    [
      { label: "Declaration", url: str(formData, "docDeclaration") },
      { label: "Activity Report", url: str(formData, "docReport") },
      { label: "Participation Record", url: str(formData, "docParticipation") },
    ].filter((d) => d.url),
  );
  const gallery = galleryFromJson
    ? JSON.stringify(parseStringList(galleryFromJson))
    : JSON.stringify(lines(formData, "gallery"));
  const blocks = JSON.stringify(parseBlocks(blocksRaw || "[]"));

  const statusRaw = str(formData, "status") || "auto";
  const status = statusRaw === "upcoming" || statusRaw === "completed" ? statusRaw : "auto";

  const data = {
    title,
    slug,
    activityName: str(formData, "activityName"),
    shortDescription: str(formData, "shortDescription"),
    programDescription: str(formData, "programDescription"),
    date: str(formData, "date"),
    location: str(formData, "location"),
    organizedBy: str(formData, "organizedBy"),
    dignitaries: str(formData, "dignitaries"),
    impact: str(formData, "impact"),
    coverImage: str(formData, "coverImage"),
    gallery,
    objectives: JSON.stringify(lines(formData, "objectives")),
    documents,
    status,
    mapUrl: str(formData, "mapUrl"),
    venueNote: str(formData, "venueNote"),
    blocks,
    enableDonate: formData.get("enableDonate") === "on",
    donateAmount: Math.max(0, parseInt(str(formData, "donateAmount") || "0", 10) || 0),
    donateLabel: str(formData, "donateLabel"),
    showQr: formData.get("showQr") === "on",
    qrImage: str(formData, "qrImage"),
    qrCaption: str(formData, "qrCaption"),
    published: formData.get("published") === "on",
  };

  if (id) {
    await db.siteEvent.updateMany({ where: { id, tenantId }, data });
  } else {
    const max = await db.siteEvent.aggregate({ where: { tenantId }, _max: { order: true } });
    await db.siteEvent.create({
      data: { tenantId, ...data, order: (max._max.order ?? 0) + 1, demoSessionId },
    });
  }
  revalidatePath("/admin/events");
  revalidatePath("/events");
  revalidatePath(`/events/${slug}`);
  revalidatePath("/");
}

export async function deleteEvent(id: string) {
  const tenantId = await requireTenantId({ demoOk: true });
  await db.siteEvent.deleteMany({ where: { id, tenantId } });
  revalidatePath("/admin/events");
  revalidatePath("/events");
  revalidatePath("/");
}
