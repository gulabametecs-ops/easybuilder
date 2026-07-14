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
    "passwordHash" TEXT NOT NULL DEFAULT '',
    "provisionError" TEXT NOT NULL DEFAULT '',
    "tenantId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Order_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("amount", "company", "createdAt", "currency", "customerName", "email", "gateway", "gatewayOrderId", "gatewayPayId", "id", "invoiceNo", "phone", "plan", "refundReason", "refundedAt", "status", "subdomain", "tenantId", "updatedAt", "vertical") SELECT "amount", "company", "createdAt", "currency", "customerName", "email", "gateway", "gatewayOrderId", "gatewayPayId", "id", "invoiceNo", "phone", "plan", "refundReason", "refundedAt", "status", "subdomain", "tenantId", "updatedAt", "vertical" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE UNIQUE INDEX "Order_invoiceNo_key" ON "Order"("invoiceNo");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
