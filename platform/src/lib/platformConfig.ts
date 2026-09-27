import { db } from "./db";
import { resolveGroqModel } from "./groqModel";

export { GROQ_DEFAULT_MODEL, isValidGroqModelId, normalizeGroqModelInput, resolveGroqModel } from "./groqModel";

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
  demoOtpMode: string;
  demoDurationMinutes: number;
  demoWhatsAppToken: string;
  demoWhatsAppPhoneId: string;
  groqApiKey: string;
  groqModel: string;
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
  demoOtpMode: "screen",
  demoDurationMinutes: 10,
  demoWhatsAppToken: "",
  demoWhatsAppPhoneId: "",
  groqApiKey: "",
  groqModel: "",
};

// The single platform settings row (or defaults if not yet created).
// Falls back to defaults if the DB is unreachable (e.g. during build-time
// prerender before the database is provisioned) so deploys never hard-fail here.
export async function getPlatformConfig(): Promise<PlatformConfig> {
  try {
    const cfg = await db.platformConfig.findUnique({ where: { id: "singleton" } });
    return cfg ?? DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

// Razorpay keys: DB settings take priority, then env vars as fallback.
export async function getRazorpayKeys(): Promise<{ keyId: string; keySecret: string }> {
  const cfg = await getPlatformConfig();
  return {
    keyId: cfg.razorpayKeyId || process.env.RAZORPAY_KEY_ID || "",
    keySecret: cfg.razorpayKeySecret || process.env.RAZORPAY_KEY_SECRET || "",
  };
}

/** Groq AI keys: Super Admin DB settings take priority, then env vars. */
export async function getGroqConfig(): Promise<{ apiKey: string; model: string }> {
  const cfg = await getPlatformConfig();
  return {
    apiKey: cfg.groqApiKey || process.env.GROQ_API_KEY || "",
    model: resolveGroqModel(cfg.groqModel || process.env.GROQ_MODEL),
  };
}
