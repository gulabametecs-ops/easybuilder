-- CreateTable
CREATE TABLE `MediaFile` (
    `id` VARCHAR(191) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,
    `url` VARCHAR(512) NOT NULL,
    `bytes` INTEGER NOT NULL,
    `mime` MEDIUMTEXT NOT NULL,
    `originalName` MEDIUMTEXT NOT NULL DEFAULT (''),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `MediaFile_url_key`(`url`),
    INDEX `MediaFile_tenantId_idx`(`tenantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MediaFile` ADD CONSTRAINT `MediaFile_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `Tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
