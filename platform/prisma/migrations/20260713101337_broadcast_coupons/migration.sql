-- CreateTable
CREATE TABLE "Coupon" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "percentOff" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "maxUses" INTEGER NOT NULL DEFAULT 0,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PlatformConfig" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
    "razorpayKeyId" TEXT NOT NULL DEFAULT '',
    "razorpayKeySecret" TEXT NOT NULL DEFAULT '',
    "platformName" TEXT NOT NULL DEFAULT 'StandardSaaS',
    "supportEmail" TEXT NOT NULL DEFAULT '',
    "supportPhone" TEXT NOT NULL DEFAULT '',
    "broadcastShow" BOOLEAN NOT NULL DEFAULT false,
    "broadcastText" TEXT NOT NULL DEFAULT '',
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_PlatformConfig" ("id", "platformName", "razorpayKeyId", "razorpayKeySecret", "supportEmail", "supportPhone", "updatedAt") SELECT "id", "platformName", "razorpayKeyId", "razorpayKeySecret", "supportEmail", "supportPhone", "updatedAt" FROM "PlatformConfig";
DROP TABLE "PlatformConfig";
ALTER TABLE "new_PlatformConfig" RENAME TO "PlatformConfig";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Coupon_code_key" ON "Coupon"("code");
