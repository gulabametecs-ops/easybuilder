import { db } from "./db";
import { resolveGroqModel } from "./groqModel";
import { getProvider, chatUrlFromBase, parseMap, type AiProvider } from "./ai/providers";

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
  aiProvider: string;
  aiKeys: string;
  aiModels: string;
  aiBaseUrl: string;
  referralSettings: string;
};

const DEFAULTS: PlatformConfig = {
  id: "singleton",
  razorpayKeyId: "",
  razorpayKeySecret: "",
  platformName: "SitePixl",
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
  aiProvider: "groq",
  aiKeys: "{}",
  aiModels: "{}",
  aiBaseUrl: "",
  referralSettings: "{}",
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


/**
 * Active AI provider for the website builder (Super Admin → Settings → AI).
 * Keys/models are stored per provider so switching never loses one; Groq also falls
 * back to the legacy groqApiKey/groqModel fields and GROQ_* env vars.
 */
export async function getAiConfig(): Promise<{ provider: AiProvider; url: string; apiKey: string; model: string }> {
  const cfg = await getPlatformConfig();
  const provider = getProvider(cfg.aiProvider);
  const keys = parseMap(cfg.aiKeys);
  const models = parseMap(cfg.aiModels);
  let apiKey = keys[provider.id] || "";
  let model = models[provider.id] || "";
  if (provider.id === "groq") {
    apiKey ||= cfg.groqApiKey || process.env.GROQ_API_KEY || "";
    model = resolveGroqModel(model || cfg.groqModel || process.env.GROQ_MODEL);
  }
  if (provider.id === "openai") apiKey ||= process.env.OPENAI_API_KEY || "";
  const url = provider.id === "custom" ? chatUrlFromBase(cfg.aiBaseUrl) : provider.url;
  return { provider, url, apiKey, model: model || provider.defaultModel };
}
