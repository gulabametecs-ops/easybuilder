-- AlterTable
ALTER TABLE "SiteConfig" ADD COLUMN "payments" TEXT NOT NULL DEFAULT '{}';

-- AlterTable
ALTER TABLE "SiteEvent" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'auto';
ALTER TABLE "SiteEvent" ADD COLUMN "mapUrl" TEXT NOT NULL DEFAULT '';
ALTER TABLE "SiteEvent" ADD COLUMN "venueNote" TEXT NOT NULL DEFAULT '';
ALTER TABLE "SiteEvent" ADD COLUMN "blocks" TEXT NOT NULL DEFAULT '[]';
ALTER TABLE "SiteEvent" ADD COLUMN "enableDonate" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "SiteEvent" ADD COLUMN "donateAmount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "SiteEvent" ADD COLUMN "donateLabel" TEXT NOT NULL DEFAULT '';
ALTER TABLE "SiteEvent" ADD COLUMN "showQr" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "SiteEvent" ADD COLUMN "qrImage" TEXT NOT NULL DEFAULT '';
ALTER TABLE "SiteEvent" ADD COLUMN "qrCaption" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "SiteDonation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL DEFAULT '',
    "name" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "amount" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'created',
    "gateway" TEXT NOT NULL DEFAULT 'upi',
    "gatewayOrderId" TEXT NOT NULL DEFAULT '',
    "gatewayPayId" TEXT NOT NULL DEFAULT '',
    "note" TEXT NOT NULL DEFAULT '',
    "demoSessionId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SiteDonation_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "SiteDonation_tenantId_idx" ON "SiteDonation"("tenantId");
CREATE INDEX "SiteDonation_demoSessionId_idx" ON "SiteDonation"("demoSessionId");
