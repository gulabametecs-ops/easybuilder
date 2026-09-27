-- AlterTable
ALTER TABLE "Notice" ADD COLUMN "demoSessionId" TEXT;
CREATE INDEX "Notice_demoSessionId_idx" ON "Notice"("demoSessionId");

-- AlterTable
ALTER TABLE "Service" ADD COLUMN "demoSessionId" TEXT;
CREATE INDEX "Service_demoSessionId_idx" ON "Service"("demoSessionId");

-- AlterTable
ALTER TABLE "GalleryItem" ADD COLUMN "demoSessionId" TEXT;
CREATE INDEX "GalleryItem_demoSessionId_idx" ON "GalleryItem"("demoSessionId");

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN "demoSessionId" TEXT;
CREATE INDEX "Lead_tenantId_idx" ON "Lead"("tenantId");
CREATE INDEX "Lead_demoSessionId_idx" ON "Lead"("demoSessionId");

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN "demoSessionId" TEXT;
CREATE INDEX "Appointment_tenantId_idx" ON "Appointment"("tenantId");
CREATE INDEX "Appointment_demoSessionId_idx" ON "Appointment"("demoSessionId");

-- AlterTable
ALTER TABLE "DemoSession" ADD COLUMN "adminUsername" TEXT NOT NULL DEFAULT '';
CREATE INDEX "DemoSession_adminUsername_idx" ON "DemoSession"("adminUsername");
