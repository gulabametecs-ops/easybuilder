-- AlterTable
ALTER TABLE `Product` ADD COLUMN `allowBackorder` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `gstRate` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `hsn` MEDIUMTEXT NOT NULL DEFAULT (''),
    ADD COLUMN `seoDescription` MEDIUMTEXT NOT NULL DEFAULT (''),
    ADD COLUMN `seoTitle` MEDIUMTEXT NOT NULL DEFAULT (''),
    ADD COLUMN `sku` MEDIUMTEXT NOT NULL DEFAULT (''),
    ADD COLUMN `tags` MEDIUMTEXT NOT NULL DEFAULT ('[]'),
    ADD COLUMN `trackStock` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `weightGrams` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `StoreOrder` ADD COLUMN `addressLine2` MEDIUMTEXT NOT NULL DEFAULT (''),
    ADD COLUMN `awb` MEDIUMTEXT NOT NULL DEFAULT (''),
    ADD COLUMN `cancelReason` MEDIUMTEXT NOT NULL DEFAULT (''),
    ADD COLUMN `codFee` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `couponCode` MEDIUMTEXT NOT NULL DEFAULT (''),
    ADD COLUMN `courier` MEDIUMTEXT NOT NULL DEFAULT (''),
    ADD COLUMN `customerId` VARCHAR(191) NULL,
    ADD COLUMN `deliveredAt` DATETIME(3) NULL,
    ADD COLUMN `invoiceNo` MEDIUMTEXT NOT NULL DEFAULT (''),
    ADD COLUMN `paymentId` MEDIUMTEXT NOT NULL DEFAULT (''),
    ADD COLUMN `paymentRef` MEDIUMTEXT NOT NULL DEFAULT (''),
    ADD COLUMN `refundAmount` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `returnReason` MEDIUMTEXT NOT NULL DEFAULT (''),
    ADD COLUMN `returnStatus` MEDIUMTEXT NOT NULL DEFAULT ('none'),
    ADD COLUMN `shipmentRef` MEDIUMTEXT NOT NULL DEFAULT (''),
    ADD COLUMN `shippingProvider` MEDIUMTEXT NOT NULL DEFAULT ('manual'),
    ADD COLUMN `state` MEDIUMTEXT NOT NULL DEFAULT (''),
    ADD COLUMN `tax` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `timeline` MEDIUMTEXT NOT NULL DEFAULT ('[]'),
    ADD COLUMN `trackToken` VARCHAR(64) NOT NULL DEFAULT '',
    ADD COLUMN `trackingUrl` MEDIUMTEXT NOT NULL DEFAULT (''),
    ADD COLUMN `weightGrams` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `ProductVariant` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,
    `title` MEDIUMTEXT NOT NULL,
    `options` MEDIUMTEXT NOT NULL DEFAULT ('{}'),
    `sku` MEDIUMTEXT NOT NULL DEFAULT (''),
    `price` INTEGER NOT NULL DEFAULT 0,
    `mrp` INTEGER NOT NULL DEFAULT 0,
    `stock` INTEGER NOT NULL DEFAULT 0,
    `image` MEDIUMTEXT NOT NULL DEFAULT (''),
    `order` INTEGER NOT NULL DEFAULT 0,

    INDEX `ProductVariant_productId_idx`(`productId`),
    INDEX `ProductVariant_tenantId_idx`(`tenantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Collection` (
    `id` VARCHAR(191) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL DEFAULT '',
    `title` MEDIUMTEXT NOT NULL,
    `description` MEDIUMTEXT NOT NULL DEFAULT (''),
    `image` MEDIUMTEXT NOT NULL DEFAULT (''),
    `productIds` MEDIUMTEXT NOT NULL DEFAULT ('[]'),
    `published` BOOLEAN NOT NULL DEFAULT true,
    `order` INTEGER NOT NULL DEFAULT 0,
    `demoSessionId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Collection_tenantId_idx`(`tenantId`),
    INDEX `Collection_demoSessionId_idx`(`demoSessionId`),
    UNIQUE INDEX `Collection_tenantId_slug_key`(`tenantId`, `slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductReview` (
    `id` VARCHAR(191) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `name` MEDIUMTEXT NOT NULL,
    `rating` INTEGER NOT NULL DEFAULT 5,
    `title` MEDIUMTEXT NOT NULL DEFAULT (''),
    `body` MEDIUMTEXT NOT NULL DEFAULT (''),
    `status` MEDIUMTEXT NOT NULL DEFAULT ('pending'),
    `verified` BOOLEAN NOT NULL DEFAULT false,
    `demoSessionId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ProductReview_productId_idx`(`productId`),
    INDEX `ProductReview_tenantId_idx`(`tenantId`),
    INDEX `ProductReview_demoSessionId_idx`(`demoSessionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StoreCoupon` (
    `id` VARCHAR(191) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,
    `code` VARCHAR(40) NOT NULL,
    `type` MEDIUMTEXT NOT NULL DEFAULT ('percent'),
    `value` INTEGER NOT NULL DEFAULT 0,
    `minOrder` INTEGER NOT NULL DEFAULT 0,
    `maxDiscount` INTEGER NOT NULL DEFAULT 0,
    `startsAt` DATETIME(3) NULL,
    `endsAt` DATETIME(3) NULL,
    `usageLimit` INTEGER NOT NULL DEFAULT 0,
    `perCustomerLimit` INTEGER NOT NULL DEFAULT 0,
    `used` INTEGER NOT NULL DEFAULT 0,
    `firstOrderOnly` BOOLEAN NOT NULL DEFAULT false,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `demoSessionId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `StoreCoupon_demoSessionId_idx`(`demoSessionId`),
    UNIQUE INDEX `StoreCoupon_tenantId_code_key`(`tenantId`, `code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StoreCustomer` (
    `id` VARCHAR(191) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `name` MEDIUMTEXT NOT NULL DEFAULT (''),
    `phone` MEDIUMTEXT NOT NULL DEFAULT (''),
    `addresses` MEDIUMTEXT NOT NULL DEFAULT ('[]'),
    `wishlist` MEDIUMTEXT NOT NULL DEFAULT ('[]'),
    `marketingOptIn` BOOLEAN NOT NULL DEFAULT false,
    `otpHash` MEDIUMTEXT NOT NULL DEFAULT (''),
    `otpExpiresAt` DATETIME(3) NULL,
    `blocked` BOOLEAN NOT NULL DEFAULT false,
    `demoSessionId` VARCHAR(191) NULL,
    `lastLoginAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `StoreCustomer_demoSessionId_idx`(`demoSessionId`),
    UNIQUE INDEX `StoreCustomer_tenantId_email_key`(`tenantId`, `email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AbandonedCart` (
    `id` VARCHAR(191) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,
    `token` VARCHAR(64) NOT NULL,
    `name` MEDIUMTEXT NOT NULL DEFAULT (''),
    `phone` MEDIUMTEXT NOT NULL DEFAULT (''),
    `email` MEDIUMTEXT NOT NULL DEFAULT (''),
    `items` MEDIUMTEXT NOT NULL DEFAULT ('[]'),
    `subtotal` INTEGER NOT NULL DEFAULT 0,
    `recovered` BOOLEAN NOT NULL DEFAULT false,
    `orderId` VARCHAR(191) NULL,
    `reminderSentAt` DATETIME(3) NULL,
    `demoSessionId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `AbandonedCart_demoSessionId_idx`(`demoSessionId`),
    UNIQUE INDEX `AbandonedCart_tenantId_token_key`(`tenantId`, `token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `StoreOrder_customerId_idx` ON `StoreOrder`(`customerId`);

-- CreateIndex
CREATE INDEX `StoreOrder_trackToken_idx` ON `StoreOrder`(`trackToken`);

-- AddForeignKey
ALTER TABLE `ProductVariant` ADD CONSTRAINT `ProductVariant_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Collection` ADD CONSTRAINT `Collection_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `Tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductReview` ADD CONSTRAINT `ProductReview_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StoreCoupon` ADD CONSTRAINT `StoreCoupon_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `Tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StoreCustomer` ADD CONSTRAINT `StoreCustomer_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `Tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AbandonedCart` ADD CONSTRAINT `AbandonedCart_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `Tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
