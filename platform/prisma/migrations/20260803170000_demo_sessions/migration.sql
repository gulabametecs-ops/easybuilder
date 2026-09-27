-- AlterTable PlatformLead
ALTER TABLE "PlatformLead" ADD COLUMN "verified" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable DemoSession
CREATE TABLE "DemoSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "company" TEXT NOT NULL DEFAULT '',
    "vertical" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "otpHash" TEXT NOT NULL DEFAULT '',
    "otpExpiresAt" DATETIME,
    "verifiedAt" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'pending_otp',
    "expiresAt" DATETIME,
    "overlay" TEXT NOT NULL DEFAULT '{}',
    "pagesViewed" TEXT NOT NULL DEFAULT '[]',
    "platformLeadId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DemoSession_platformLeadId_fkey" FOREIGN KEY ("platformLeadId") REFERENCES "PlatformLead" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "DemoSession_token_key" ON "DemoSession"("token");
CREATE INDEX "DemoSession_phone_vertical_idx" ON "DemoSession"("phone", "vertical");
CREATE INDEX "DemoSession_token_idx" ON "DemoSession"("token");
CREATE INDEX "DemoSession_status_idx" ON "DemoSession"("status");

-- AlterTable PlatformConfig
ALTER TABLE "PlatformConfig" ADD COLUMN "demoOtpMode" TEXT NOT NULL DEFAULT 'screen';
ALTER TABLE "PlatformConfig" ADD COLUMN "demoDurationMinutes" INTEGER NOT NULL DEFAULT 10;
ALTER TABLE "PlatformConfig" ADD COLUMN "demoWhatsAppToken" TEXT NOT NULL DEFAULT '';
ALTER TABLE "PlatformConfig" ADD COLUMN "demoWhatsAppPhoneId" TEXT NOT NULL DEFAULT '';
