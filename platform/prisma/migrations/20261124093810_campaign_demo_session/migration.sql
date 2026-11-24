-- AlterTable
ALTER TABLE `Campaign` ADD COLUMN `demoSessionId` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `Campaign_demoSessionId_idx` ON `Campaign`(`demoSessionId`);
