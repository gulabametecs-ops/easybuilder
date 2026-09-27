"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { getPlatformConfig } from "@/lib/platformConfig";
import { getVertical } from "@/lib/verticals";
import { rateLimit } from "@/lib/rateLimit";
import { sendDemoOtpWhatsApp } from "@/lib/demoWhatsApp";
import { createTenantFromTemplate } from "@/lib/provision";
import { randomBytes } from "node:crypto";
import {
  demoDurationMs,
  demoSiteUrl,
  getActiveDemoSession,
  getDemoSessionByToken,
  setDemoCookie,
  clearDemoCookie,
} from "@/lib/demoSession";

export type DemoFlowState =
  | { step: "idle" }
  | { step: "error"; message: string }
  | { step: "otp"; sessionId: string; vertical: string; otpMode: "screen" | "whatsapp"; displayOtp?: string; message: string }
  | {
      step: "active";
      vertical: string;
      siteUrl: string;
      adminUrl: string;
      adminUsername: string;
      adminPassword: string;
      expiresAt: string;
      minutesLeft: number;
    };

const formSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  company: z.string().min(2, "Please enter your business name"),
  vertical: z.string().min(1),
});

function genOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function genAdminPassword(): string {
  const n = String(Math.floor(1000 + Math.random() * 9000));
  return `Demo@${n}`;
}

function genAdminUsername(): string {
  return `demo_${Math.random().toString(36).slice(2, 8)}`;
}

// A newly added vertical may not have its demo tenant seeded yet — create it on first
// use so the demo (and the temp admin login) works without a manual re-seed.
async function ensureDemoTenant(verticalId: string) {
  const v = getVertical(verticalId);
  if (!v?.demoSubdomain) return;
  if (await db.tenant.findUnique({ where: { subdomain: v.demoSubdomain }, select: { id: true } })) return;
  await createTenantFromTemplate({
    businessName: v.name,
    subdomain: v.demoSubdomain,
    ownerEmail: v.demoEmail ?? `demo@${v.demoSubdomain}.test`,
    ownerPassword: randomBytes(18).toString("base64url"),
    plan: "pro",
    vertical: v.id,
  }).catch(() => {}); // lost a race with a parallel request — the tenant exists now
}

function establishUrl(base: string, token: string, path: string) {
  const to = `${path}${path.includes("?") ? "&" : "?"}dt=${token}`;
  return `${base}/api/demo/establish?dt=${encodeURIComponent(token)}&to=${encodeURIComponent(to)}`;
}

/** Step 1: collect lead + send OTP for ONE vertical only. */
export async function requestDemoOtp(_prev: DemoFlowState, formData: FormData): Promise<DemoFlowState> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const phone = (formData.get("phone")?.toString() ?? "").trim();
  const rl = rateLimit(`demo-otp:${ip}:${phone}`, 5, 15 * 60_000);
  if (!rl.ok) return { step: "error", message: `Too many attempts. Wait ${rl.retryAfterSec}s.` };

  const parsed = formSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    company: formData.get("company"),
    vertical: formData.get("vertical"),
  });
  if (!parsed.success) return { step: "error", message: parsed.error.issues[0]?.message ?? "Invalid input" };

  const vertical = getVertical(parsed.data.vertical);
  if (!vertical || vertical.status !== "live" || !vertical.demoSubdomain) {
    return { step: "error", message: "This sector demo is not available yet." };
  }

  const cfg = await getPlatformConfig();
  const otp = genOtp();
  const otpHash = await bcrypt.hash(otp, 10);
  const otpExpiresAt = new Date(Date.now() + 10 * 60_000);

  const lead = await db.platformLead.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      company: parsed.data.company,
      vertical: vertical.id,
      type: "demo",
      verified: false,
    },
  });

  const session = await db.demoSession.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      company: parsed.data.company,
      vertical: vertical.id,
      otpHash,
      otpExpiresAt,
      status: "pending_otp",
      platformLeadId: lead.id,
    },
  });

  const mode = cfg.demoOtpMode === "whatsapp" ? "whatsapp" : "screen";
  let message = "";
  let displayOtp: string | undefined;

  if (mode === "screen") {
    displayOtp = otp;
    message = "Enter the 6-digit code shown below to start your demo.";
  } else {
    const wa = await sendDemoOtpWhatsApp(parsed.data.phone, otp);
    message = wa.sent
      ? "OTP sent to your WhatsApp. Enter it below to start your demo."
      : wa.mock
        ? "WhatsApp is not configured — use the test OTP shown below (dev mode)."
        : "Could not send WhatsApp OTP. Contact support or try again.";
    if (!wa.sent) displayOtp = otp;
  }

  return {
    step: "otp",
    sessionId: session.id,
    vertical: vertical.id,
    otpMode: mode,
    displayOtp,
    message,
  };
}

/** Step 2: verify OTP → 10-minute isolated demo session + temp admin credentials. */
export async function verifyDemoOtp(_prev: DemoFlowState, formData: FormData): Promise<DemoFlowState> {
  const sessionId = formData.get("sessionId")?.toString() ?? "";
  const otp = (formData.get("otp")?.toString() ?? "").trim();
  const vertical = formData.get("vertical")?.toString() ?? "";

  if (!sessionId || otp.length < 4) return { step: "error", message: "Enter the OTP code." };

  const session = await db.demoSession.findUnique({ where: { id: sessionId } });
  if (!session || session.vertical !== vertical) return { step: "error", message: "Invalid demo session." };
  if (session.status !== "pending_otp") return { step: "error", message: "This OTP was already used or expired. Request a new demo." };
  if (!session.otpExpiresAt || session.otpExpiresAt.getTime() < Date.now()) {
    await db.demoSession.update({ where: { id: session.id }, data: { status: "expired" } });
    return { step: "error", message: "OTP expired. Please request a new demo." };
  }

  const ok = await bcrypt.compare(otp, session.otpHash);
  if (!ok) return { step: "error", message: "Incorrect OTP. Please try again." };

  const durationMs = await demoDurationMs();
  const expiresAt = new Date(Date.now() + durationMs);
  const adminPassword = genAdminPassword();
  const adminUsername = genAdminUsername();

  await db.demoSession.update({
    where: { id: session.id },
    data: {
      status: "active",
      verifiedAt: new Date(),
      expiresAt,
      otpHash: "",
      adminUsername,
      adminPassword,
    },
  });

  if (session.platformLeadId) {
    await db.platformLead.update({ where: { id: session.platformLeadId }, data: { verified: true, status: "verified" } });
  }

  await setDemoCookie(session.token, Math.ceil(durationMs / 1000));
  await ensureDemoTenant(vertical);

  const base = demoSiteUrl(vertical);
  if (!base) return { step: "error", message: "Demo URL not found." };

  return {
    step: "active",
    vertical,
    siteUrl: establishUrl(base, session.token, "/"),
    adminUrl: establishUrl(base, session.token, "/admin/login"),
    adminUsername,
    adminPassword,
    expiresAt: expiresAt.toISOString(),
    minutesLeft: Math.ceil(durationMs / 60000),
  };
}

/**
 * Switch sectors without a second OTP. A visitor who already verified can jump to
 * any other live demo: the current sandbox is cleaned up and a fresh session (new
 * timer + temp admin login) starts for the new sector. One active demo at a time
 * keeps the sandbox model simple (overlay + cookie are per session).
 */
export async function switchDemo(_prev: DemoFlowState, formData: FormData): Promise<DemoFlowState> {
  const verticalId = formData.get("vertical")?.toString() ?? "";
  const vertical = getVertical(verticalId);
  if (!vertical || vertical.status !== "live" || !vertical.demoSubdomain) {
    return { step: "error", message: "This sector demo is not available yet." };
  }

  const current = await getActiveDemoSession();
  if (!current?.verifiedAt) return { step: "error", message: "Your demo has ended — verify with OTP to start a new one." };
  if (current.vertical === vertical.id) return getDemoStatusForVertical(vertical.id);

  const rl = rateLimit(`demo-switch:${current.phone}`, 20, 60 * 60_000);
  if (!rl.ok) return { step: "error", message: `Too many switches. Try again in ${rl.retryAfterSec}s.` };

  const durationMs = await demoDurationMs();
  const expiresAt = new Date(Date.now() + durationMs);
  const adminPassword = genAdminPassword();
  const adminUsername = genAdminUsername();

  await ensureDemoTenant(vertical.id);
  const next = await db.demoSession.create({
    data: {
      name: current.name,
      email: current.email,
      phone: current.phone,
      company: current.company,
      vertical: vertical.id,
      status: "active",
      verifiedAt: new Date(),
      expiresAt,
      adminUsername,
      adminPassword,
      platformLeadId: current.platformLeadId,
    },
  });

  const { cleanupDemoSessionData } = await import("@/lib/demoSession");
  await cleanupDemoSessionData(current.id); // also clears the old cookies
  await setDemoCookie(next.token, Math.ceil(durationMs / 1000));

  const base = demoSiteUrl(vertical.id);
  if (!base) return { step: "error", message: "Demo URL not found." };
  return {
    step: "active",
    vertical: vertical.id,
    siteUrl: establishUrl(base, next.token, "/"),
    adminUrl: establishUrl(base, next.token, "/admin/login"),
    adminUsername,
    adminPassword,
    expiresAt: expiresAt.toISOString(),
    minutesLeft: Math.ceil(durationMs / 60000),
  };
}

export async function getDemoStatusForVertical(verticalId: string): Promise<DemoFlowState> {
  const session = await getActiveDemoSession();
  if (!session || session.vertical !== verticalId) return { step: "idle" };
  const base = demoSiteUrl(verticalId);
  if (!base) return { step: "idle" };
  const msLeft = session.expiresAt ? session.expiresAt.getTime() - Date.now() : 0;
  if (msLeft <= 0) return { step: "idle" };
  return {
    step: "active",
    vertical: verticalId,
    siteUrl: establishUrl(base, session.token, "/"),
    adminUrl: establishUrl(base, session.token, "/admin/login"),
    adminUsername: session.adminUsername || "",
    adminPassword: session.adminPassword || "",
    expiresAt: session.expiresAt!.toISOString(),
    minutesLeft: Math.ceil(msLeft / 60000),
  };
}

export async function endDemoSession() {
  const { cookies } = await import("next/headers");
  const t = (await cookies()).get("demo_session")?.value;
  if (t) {
    const s = await getDemoSessionByToken(t);
    if (s) {
      const { cleanupDemoSessionData } = await import("@/lib/demoSession");
      await cleanupDemoSessionData(s.id);
    }
  }
  await clearDemoCookie();
}

/** Legacy — replaced by per-vertical OTP flow. */
export async function hasDemoAccess(): Promise<boolean> {
  return !!(await getActiveDemoSession());
}
