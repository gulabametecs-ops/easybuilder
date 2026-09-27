import { getPlatformConfig } from "./platformConfig";

/** Send demo OTP via WhatsApp Cloud API (or mock when not configured). */
export async function sendDemoOtpWhatsApp(phone: string, otp: string): Promise<{ sent: boolean; mock: boolean }> {
  const cfg = await getPlatformConfig();
  const token = cfg.demoWhatsAppToken || process.env.DEMO_WHATSAPP_TOKEN || "";
  const phoneId = cfg.demoWhatsAppPhoneId || process.env.DEMO_WHATSAPP_PHONE_ID || "";

  const normalized = phone.replace(/\D/g, "");
  const to = normalized.startsWith("91") ? normalized : `91${normalized}`;

  if (!token || !phoneId) {
    console.log(`[demo whatsapp mock] OTP ${otp} → ${to}`);
    return { sent: false, mock: true };
  }

  try {
    const res = await fetch(`https://graph.facebook.com/v19.0/${phoneId}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: `Your StandardSaaS demo OTP is ${otp}. Valid for 10 minutes. Do not share.` },
      }),
    });
    return { sent: res.ok, mock: false };
  } catch {
    return { sent: false, mock: false };
  }
}
