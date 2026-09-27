-- AlterTable
ALTER TABLE "PlatformConfig" ADD COLUMN "groqApiKey" TEXT NOT NULL DEFAULT '';
ALTER TABLE "PlatformConfig" ADD COLUMN "groqModel" TEXT NOT NULL DEFAULT '';
