-- AlterTable
ALTER TABLE `SiteConfig` ADD COLUMN `store` MEDIUMTEXT NOT NULL DEFAULT ('{}');

-- CreateTable
CREATE TABLE `Product` (
    `id` VARCHAR(191) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL DEFAULT '',
    `name` MEDIUMTEXT NOT NULL,
    `category` MEDIUMTEXT NOT NULL DEFAULT (''),
    `price` INTEGER NOT NULL DEFAULT 0,
    `mrp` INTEGER NOT NULL DEFAULT 0,
    `images` MEDIUMTEXT NOT NULL DEFAULT ('[]'),
    `description` MEDIUMTEXT NOT NULL DEFAULT (''),
    `stock` INTEGER NOT NULL DEFAULT 0,
    `options` MEDIUMTEXT NOT NULL DEFAULT ('[]'),
    `badge` MEDIUMTEXT NOT NULL DEFAULT (''),
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `published` BOOLEAN NOT NULL DEFAULT true,
    `order` INTEGER NOT NULL DEFAULT 0,
    `demoSessionId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Product_tenantId_idx`(`tenantId`),
    INDEX `Product_demoSessionId_idx`(`demoSessionId`),
    UNIQUE INDEX `Product_tenantId_slug_key`(`tenantId`, `slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StoreOrder` (
    `id` VARCHAR(191) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,
    `orderNo` INTEGER NOT NULL,
    `customerName` MEDIUMTEXT NOT NULL,
    `phone` MEDIUMTEXT NOT NULL,
    `email` MEDIUMTEXT NOT NULL DEFAULT (''),
    `address` MEDIUMTEXT NOT NULL DEFAULT (''),
    `city` MEDIUMTEXT NOT NULL DEFAULT (''),
    `pincode` MEDIUMTEXT NOT NULL DEFAULT (''),
    `items` MEDIUMTEXT NOT NULL DEFAULT ('[]'),
    `subtotal` INTEGER NOT NULL DEFAULT 0,
    `shipping` INTEGER NOT NULL DEFAULT 0,
    `discount` INTEGER NOT NULL DEFAULT 0,
    `total` INTEGER NOT NULL DEFAULT 0,
    `paymentMethod` MEDIUMTEXT NOT NULL DEFAULT ('cod'),
    `paymentStatus` MEDIUMTEXT NOT NULL DEFAULT ('pending'),
    `status` MEDIUMTEXT NOT NULL DEFAULT ('new'),
    `note` MEDIUMTEXT NOT NULL DEFAULT (''),
    `demoSessionId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `StoreOrder_tenantId_idx`(`tenantId`),
    INDEX `StoreOrder_demoSessionId_idx`(`demoSessionId`),
    UNIQUE INDEX `StoreOrder_tenantId_orderNo_key`(`tenantId`, `orderNo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `Tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StoreOrder` ADD CONSTRAINT `StoreOrder_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `Tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
