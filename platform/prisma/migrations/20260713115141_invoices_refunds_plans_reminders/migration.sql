-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN "cancelledAt" DATETIME;
ALTER TABLE "Tenant" ADD COLUMN "lastRenewalReminderAt" DATETIME;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL DEFAULT '',
    "company" TEXT NOT NULL DEFAULT '',
    "vertical" TEXT NOT NULL,
    "subdomain" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" TEXT NOT NULL DEFAULT 'created',
    "gateway" TEXT NOT NULL DEFAULT 'mock',
    "gatewayOrderId" TEXT NOT NULL DEFAULT '',
    "gatewayPayId" TEXT NOT NULL DEFAULT '',
    "invoiceNo" TEXT,
    "refundReason" TEXT NOT NULL DEFAULT '',
    "refundedAt" DATETIME,
    "tenantId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Order_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("amount", "company", "createdAt", "currency", "customerName", "email", "gateway", "gatewayOrderId", "gatewayPayId", "id", "phone", "plan", "status", "subdomain", "tenantId", "updatedAt", "vertical") SELECT "amount", "company", "createdAt", "currency", "customerName", "email", "gateway", "gatewayOrderId", "gatewayPayId", "id", "phone", "plan", "status", "subdomain", "tenantId", "updatedAt", "vertical" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE UNIQUE INDEX "Order_invoiceNo_key" ON "Order"("invoiceNo");
CREATE TABLE "new_PlatformConfig" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
    "razorpayKeyId" TEXT NOT NULL DEFAULT '',
    "razorpayKeySecret" TEXT NOT NULL DEFAULT '',
    "platformName" TEXT NOT NULL DEFAULT 'StandardSaaS',
    "supportEmail" TEXT NOT NULL DEFAULT '',
    "supportPhone" TEXT NOT NULL DEFAULT '',
    "broadcastShow" BOOLEAN NOT NULL DEFAULT false,
    "broadcastText" TEXT NOT NULL DEFAULT '',
    "gstin" TEXT NOT NULL DEFAULT '',
    "businessAddress" TEXT NOT NULL DEFAULT '',
    "gstRate" INTEGER NOT NULL DEFAULT 18,
    "invoicePrefix" TEXT NOT NULL DEFAULT 'INV',
    "planOverrides" TEXT NOT NULL DEFAULT '{}',
    "remindersEnabled" BOOLEAN NOT NULL DEFAULT false,
    "reminderDays" INTEGER NOT NULL DEFAULT 7,
    "resendApiKey" TEXT NOT NULL DEFAULT '',
    "senderEmail" TEXT NOT NULL DEFAULT '',
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_PlatformConfig" ("broadcastShow", "broadcastText", "id", "platformName", "razorpayKeyId", "razorpayKeySecret", "supportEmail", "supportPhone", "updatedAt") SELECT "broadcastShow", "broadcastText", "id", "platformName", "razorpayKeyId", "razorpayKeySecret", "supportEmail", "supportPhone", "updatedAt" FROM "PlatformConfig";
DROP TABLE "PlatformConfig";
ALTER TABLE "new_PlatformConfig" RENAME TO "PlatformConfig";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
