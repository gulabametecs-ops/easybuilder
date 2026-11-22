-- AlterTable
ALTER TABLE `SiteDonation` ADD COLUMN `causeId` MEDIUMTEXT NOT NULL DEFAULT ('');

-- CreateTable
CREATE TABLE `Cause` (
    `id` VARCHAR(191) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL DEFAULT '',
    `title` MEDIUMTEXT NOT NULL,
    `category` MEDIUMTEXT NOT NULL DEFAULT (''),
    `summary` MEDIUMTEXT NOT NULL DEFAULT (''),
    `story` MEDIUMTEXT NOT NULL DEFAULT (''),
    `coverImage` MEDIUMTEXT NOT NULL DEFAULT (''),
    `gallery` MEDIUMTEXT NOT NULL DEFAULT ('[]'),
    `goalAmount` INTEGER NOT NULL DEFAULT 0,
    `offlineRaised` INTEGER NOT NULL DEFAULT 0,
    `offlineDonors` INTEGER NOT NULL DEFAULT 0,
    `deadline` MEDIUMTEXT NOT NULL DEFAULT (''),
    `urgent` BOOLEAN NOT NULL DEFAULT false,
    `beneficiaries` MEDIUMTEXT NOT NULL DEFAULT (''),
    `location` MEDIUMTEXT NOT NULL DEFAULT (''),
    `impactTiers` MEDIUMTEXT NOT NULL DEFAULT ('[]'),
    `updates` MEDIUMTEXT NOT NULL DEFAULT ('[]'),
    `status` MEDIUMTEXT NOT NULL DEFAULT ('active'),
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `published` BOOLEAN NOT NULL DEFAULT true,
    `order` INTEGER NOT NULL DEFAULT 0,
    `demoSessionId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Cause_tenantId_idx`(`tenantId`),
    INDEX `Cause_demoSessionId_idx`(`demoSessionId`),
    UNIQUE INDEX `Cause_tenantId_slug_key`(`tenantId`, `slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Cause` ADD CONSTRAINT `Cause_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `Tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
