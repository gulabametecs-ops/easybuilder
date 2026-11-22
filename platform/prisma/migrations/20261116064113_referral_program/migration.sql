-- AlterTable
ALTER TABLE `Tenant` ADD COLUMN `referralCode` VARCHAR(191) NULL,
    ADD COLUMN `referredByTenantId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `PlatformConfig` ADD COLUMN `referralSettings` MEDIUMTEXT NOT NULL DEFAULT ('{}');

-- AlterTable
ALTER TABLE `Order` ADD COLUMN `referrerTenantId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `ReferralCommission` (
    `id` VARCHAR(191) NOT NULL,
    `referrerTenantId` VARCHAR(191) NOT NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `referredTenantId` VARCHAR(191) NULL,
    `referredName` MEDIUMTEXT NOT NULL DEFAULT (''),
    `baseAmount` INTEGER NOT NULL,
    `ratePct` INTEGER NOT NULL,
    `amount` INTEGER NOT NULL,
    `status` MEDIUMTEXT NOT NULL DEFAULT ('earned'),
    `availableAt` DATETIME(3) NOT NULL,
    `withdrawalId` VARCHAR(191) NULL,
    `reversedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `ReferralCommission_orderId_key`(`orderId`),
    INDEX `ReferralCommission_referrerTenantId_idx`(`referrerTenantId`),
    INDEX `ReferralCommission_withdrawalId_idx`(`withdrawalId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReferralWithdrawal` (
    `id` VARCHAR(191) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,
    `tdsPct` INTEGER NOT NULL DEFAULT 0,
    `tdsAmount` INTEGER NOT NULL DEFAULT 0,
    `netAmount` INTEGER NOT NULL,
    `method` MEDIUMTEXT NOT NULL,
    `upiId` MEDIUMTEXT NOT NULL DEFAULT (''),
    `accountName` MEDIUMTEXT NOT NULL DEFAULT (''),
    `accountNumber` MEDIUMTEXT NOT NULL DEFAULT (''),
    `ifsc` MEDIUMTEXT NOT NULL DEFAULT (''),
    `pan` MEDIUMTEXT NOT NULL DEFAULT (''),
    `status` MEDIUMTEXT NOT NULL DEFAULT ('requested'),
    `reference` MEDIUMTEXT NOT NULL DEFAULT (''),
    `rejectReason` MEDIUMTEXT NOT NULL DEFAULT (''),
    `processedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ReferralWithdrawal_tenantId_idx`(`tenantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Tenant_referralCode_key` ON `Tenant`(`referralCode`);

-- AddForeignKey
ALTER TABLE `ReferralCommission` ADD CONSTRAINT `ReferralCommission_referrerTenantId_fkey` FOREIGN KEY (`referrerTenantId`) REFERENCES `Tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReferralWithdrawal` ADD CONSTRAINT `ReferralWithdrawal_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `Tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
