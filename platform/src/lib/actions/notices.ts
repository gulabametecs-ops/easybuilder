"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireTenantId, getDemoSessionId } from "./guard";

function s(fd: FormData, k: string) { return (fd.get(k)?.toString() ?? "").trim(); }

function revalidateNotices() {
  revalidatePath("/admin/notices");
  revalidatePath("/");
  revalidatePath("/notices");
}

export async function addNotice(formData: FormData) {
  const tenantId = await requireTenantId({ demoOk: true });
  const title = s(formData, "title");
  if (!title) return;
  const max = await db.notice.aggregate({ where: { tenantId }, _max: { order: true } });
  const demoSessionId = await getDemoSessionId();
  await db.notice.create({
    data: {
      tenantId,
      title,
      date: s(formData, "date"),
      category: s(formData, "category") || "News",
      link: s(formData, "link"),
      attachmentUrl: s(formData, "attachmentUrl"),
      attachmentName: s(formData, "attachmentName"),
      pinned: formData.get("pinned") === "on",
      published: formData.get("published") === "on",
      order: (max._max.order ?? 0) + 1,
      demoSessionId,
    },
  });
  revalidateNotices();
}

export async function updateNotice(formData: FormData) {
  const tenantId = await requireTenantId({ demoOk: true });
  const id = s(formData, "id");
  const demoId = await getDemoSessionId();
  if (demoId) {
    const n = await db.notice.findFirst({ where: { id, tenantId } });
    if (!n || n.demoSessionId !== demoId) return;
  }
  await db.notice.updateMany({
    where: { id, tenantId },
    data: {
      title: s(formData, "title"),
      date: s(formData, "date"),
      category: s(formData, "category") || "News",
      link: s(formData, "link"),
      attachmentUrl: s(formData, "attachmentUrl"),
      attachmentName: s(formData, "attachmentName"),
      pinned: formData.get("pinned") === "on",
      published: formData.get("published") === "on",
    },
  });
  revalidateNotices();
}

export async function deleteNotice(id: string) {
  const tenantId = await requireTenantId({ demoOk: true });
  const demoId = await getDemoSessionId();
  if (demoId) {
    const n = await db.notice.findFirst({ where: { id, tenantId } });
    if (!n || n.demoSessionId !== demoId) return;
  }
  await db.notice.deleteMany({ where: { id, tenantId } });
  revalidateNotices();
}

export async function toggleNoticePublish(id: string) {
  const tenantId = await requireTenantId({ demoOk: true });
  const n = await db.notice.findFirst({ where: { id, tenantId } });
  if (!n) return;
  const demoId = await getDemoSessionId();
  if (demoId && n.demoSessionId !== demoId) return;
  await db.notice.update({ where: { id }, data: { published: !n.published } });
  revalidateNotices();
}

export async function toggleNoticePin(id: string) {
  const tenantId = await requireTenantId({ demoOk: true });
  const n = await db.notice.findFirst({ where: { id, tenantId } });
  if (!n) return;
  const demoId = await getDemoSessionId();
  if (demoId && n.demoSessionId !== demoId) return;
  await db.notice.update({ where: { id }, data: { pinned: !n.pinned } });
  revalidateNotices();
}
