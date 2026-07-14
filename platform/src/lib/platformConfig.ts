import { db } from "./db";

export type PlatformConfig = {
  id: string;
  razorpayKeyId: string;
  razorpayKeySecret: string;
  platformName: string;
  supportEmail: string;
  supportPhone: string;
  broadcastShow: boolean;
  broadcastText: string;
  gstin: string;
  businessAddress: string;
  gstRate: number;
  invoicePrefix: string;
  planOverrides: string;
  remindersEnabled: boolean;
  reminderDays: number;
  resendApiKey: string;
  senderEmail: string;
};

const DEFAULTS: PlatformConfig = {
  id: "singleton",
  razorpayKeyId: "",
  razorpayKeySecret: "",
  platformName: "StandardSaaS",
  supportEmail: "",
  supportPhone: "",
  broadcastShow: false,
  broadcastText: "",
  gstin: "",
  businessAddress: "",
  gstRate: 18,
  invoicePrefix: "INV",
  planOverrides: "{}",
  remindersEnabled: false,
  reminderDays: 7,
  resendApiKey: "",
  senderEmail: "",
};

// The single platform settings row (or defaults if not yet created).
export async function getPlatformConfig(): Promise<PlatformConfig> {
  const cfg = await db.platformConfig.findUnique({ where: { id: "singleton" } });
  return cfg ?? DEFAULTS;
}

// Razorpay keys: DB settings take priority, then env vars as fallback.
export async function getRazorpayKeys(): Promise<{ keyId: string; keySecret: string }> {
  const cfg = await getPlatformConfig();
  return {
    keyId: cfg.razorpayKeyId || process.env.RAZORPAY_KEY_ID || "",
    keySecret: cfg.razorpayKeySecret || process.env.RAZORPAY_KEY_SECRET || "",
  };
}
