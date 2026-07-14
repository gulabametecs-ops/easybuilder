-- CreateTable
CREATE TABLE "PlatformConfig" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
    "razorpayKeyId" TEXT NOT NULL DEFAULT '',
    "razorpayKeySecret" TEXT NOT NULL DEFAULT '',
    "platformName" TEXT NOT NULL DEFAULT 'StandardSaaS',
    "supportEmail" TEXT NOT NULL DEFAULT '',
    "supportPhone" TEXT NOT NULL DEFAULT '',
    "updatedAt" DATETIME NOT NULL
);
