-- AlterTable
ALTER TABLE `Product` ADD COLUMN `catalogueUrl` MEDIUMTEXT NOT NULL DEFAULT (''),
    ADD COLUMN `customizable` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `moq` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `specs` MEDIUMTEXT NOT NULL DEFAULT ('[]'),
    ADD COLUMN `unit` MEDIUMTEXT NOT NULL DEFAULT ('');

-- CreateTable
CREATE TABLE `QuoteRequest` (
    `id` VARCHAR(191) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,
    `refNo` INTEGER NOT NULL,
    `kind` MEDIUMTEXT NOT NULL DEFAULT ('bulk'),
    `name` MEDIUMTEXT NOT NULL,
    `company` MEDIUMTEXT NOT NULL DEFAULT (''),
    `phone` MEDIUMTEXT NOT NULL,
    `whatsapp` MEDIUMTEXT NOT NULL DEFAULT (''),
    `email` MEDIUMTEXT NOT NULL DEFAULT (''),
    `gstin` MEDIUMTEXT NOT NULL DEFAULT (''),
    `city` MEDIUMTEXT NOT NULL DEFAULT (''),
    `state` MEDIUMTEXT NOT NULL DEFAULT (''),
    `items` MEDIUMTEXT NOT NULL DEFAULT ('[]'),
    `expectedDate` MEDIUMTEXT NOT NULL DEFAULT (''),
    `projectType` MEDIUMTEXT NOT NULL DEFAULT (''),
    `location` MEDIUMTEXT NOT NULL DEFAULT (''),
    `estQuantity` MEDIUMTEXT NOT NULL DEFAULT (''),
    `details` MEDIUMTEXT NOT NULL DEFAULT (''),
    `customSpecs` MEDIUMTEXT NOT NULL DEFAULT (''),
    `attachments` MEDIUMTEXT NOT NULL DEFAULT ('[]'),
    `status` MEDIUMTEXT NOT NULL DEFAULT ('new'),
    `quoteAmount` INTEGER NOT NULL DEFAULT 0,
    `adminNote` MEDIUMTEXT NOT NULL DEFAULT (''),
    `demoSessionId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `QuoteRequest_tenantId_idx`(`tenantId`),
    INDEX `QuoteRequest_demoSessionId_idx`(`demoSessionId`),
    UNIQUE INDEX `QuoteRequest_tenantId_refNo_key`(`tenantId`, `refNo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `QuoteRequest` ADD CONSTRAINT `QuoteRequest_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `Tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
