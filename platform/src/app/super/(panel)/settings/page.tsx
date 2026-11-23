import { db } from "@/lib/db";
import { getPlatformConfig } from "@/lib/platformConfig";
import { resolveTiers, resolveDurations } from "@/lib/plans";
import { resolveReferralSettings } from "@/lib/referral";
import { Settings } from "lucide-react";
import { PageHeader } from "@/components/admin/ui";
import { SuperSettings } from "@/components/super/SuperSettings";
import { parseMap } from "@/lib/ai/providers";

export const metadata = { title: "Settings" };

export default async function SuperSettingsPage() {
  const [cfg, admins] = await Promise.all([
    getPlatformConfig(),
    db.platformUser.findMany({ orderBy: { createdAt: "asc" }, select: { email: true, name: true } }),
  ]);
  const tiers = resolveTiers(cfg.planOverrides);

  return (
    <>
      <PageHeader title="Settings" subtitle="Payments, plans, GST, reminders and admin accounts." icon={<Settings />} />
      <SuperSettings
        cfg={{
          razorpayKeyId: cfg.razorpayKeyId,
          hasSecret: Boolean(cfg.razorpayKeySecret),
          platformName: cfg.platformName,
          supportEmail: cfg.supportEmail,
          supportPhone: cfg.supportPhone,
          broadcastShow: cfg.broadcastShow,
          broadcastText: cfg.broadcastText,
          gstin: cfg.gstin,
          businessAddress: cfg.businessAddress,
          gstRate: cfg.gstRate,
          invoicePrefix: cfg.invoicePrefix,
          remindersEnabled: cfg.remindersEnabled,
          reminderDays: cfg.reminderDays,
          hasResendKey: Boolean(cfg.resendApiKey),
          senderEmail: cfg.senderEmail,
          demoOtpMode: cfg.demoOtpMode,
          demoDurationMinutes: cfg.demoDurationMinutes,
          hasWhatsAppToken: Boolean(cfg.demoWhatsAppToken),
          demoWhatsAppPhoneId: cfg.demoWhatsAppPhoneId,
          aiProvider: cfg.aiProvider,
          // which providers have a saved key (never the keys themselves)
          aiKeyed: Object.keys(parseMap(cfg.aiKeys)).concat(cfg.groqApiKey || process.env.GROQ_API_KEY ? ["groq"] : []),
          aiModels: { ...(cfg.groqModel ? { groq: cfg.groqModel } : {}), ...parseMap(cfg.aiModels) },
          aiBaseUrl: cfg.aiBaseUrl,
        }}
        admins={admins}
        tiers={tiers}
        durations={resolveDurations(cfg.planOverrides)}
        referral={resolveReferralSettings(cfg.referralSettings)}
      />
    </>
  );
}
