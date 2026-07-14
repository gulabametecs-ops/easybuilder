import { db } from "@/lib/db";
import { getPlatformConfig } from "@/lib/platformConfig";
import { resolveTiers } from "@/lib/plans";
import { PageHeader } from "@/components/admin/ui";
import { SuperSettings } from "@/components/super/SuperSettings";

export const metadata = { title: "Settings" };

export default async function SuperSettingsPage() {
  const [cfg, admins] = await Promise.all([
    getPlatformConfig(),
    db.platformUser.findMany({ orderBy: { createdAt: "asc" }, select: { email: true, name: true } }),
  ]);
  const tiers = resolveTiers(cfg.planOverrides);

  return (
    <>
      <PageHeader title="Settings" subtitle="Payments, plans, GST, reminders and admin accounts." />
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
        }}
        admins={admins}
        tiers={tiers}
      />
    </>
  );
}
