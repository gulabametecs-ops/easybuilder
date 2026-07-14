import { getPlatformConfig } from "./platformConfig";

// Sends an email via Resend when an API key + sender are configured; otherwise
// runs in mock mode (logs) so the flow works without credentials. Configure the
// key + sender in Super Admin → Settings → Reminders.
export async function sendEmail(to: string, subject: string, html: string): Promise<{ sent: boolean; mock: boolean }> {
  const cfg = await getPlatformConfig();
  const key = cfg.resendApiKey || process.env.RESEND_API_KEY || "";
  const from = cfg.senderEmail || process.env.SENDER_EMAIL || "";
  if (!key || !from) {
    console.log(`[email mock] to=${to} subject="${subject}"`);
    return { sent: false, mock: true };
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({ from, to, subject, html }),
    });
    return { sent: res.ok, mock: false };
  } catch {
    return { sent: false, mock: false };
  }
}
