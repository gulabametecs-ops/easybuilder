-- CreateTable
CREATE TABLE `Tenant` (
    `id` VARCHAR(191) NOT NULL,
    `name` MEDIUMTEXT NOT NULL,
    `subdomain` VARCHAR(191) NOT NULL,
    `customDomain` VARCHAR(191) NULL,
    `domainStatus` MEDIUMTEXT NOT NULL DEFAULT ('none'),
    `vertical` MEDIUMTEXT NOT NULL DEFAULT ('home-services'),
    `status` MEDIUMTEXT NOT NULL DEFAULT ('active'),
    `plan` MEDIUMTEXT NOT NULL DEFAULT ('free'),
    `subscriptionEndsAt` DATETIME(3) NULL,
    `lastRenewalReminderAt` DATETIME(3) NULL,
    `cancelledAt` DATETIME(3) NULL,
    `cancelReason` MEDIUMTEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Tenant_subdomain_key`(`subdomain`),
    UNIQUE INDEX `Tenant_customDomain_key`(`customDomain`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` MEDIUMTEXT NOT NULL,
    `name` MEDIUMTEXT NULL,
    `role` MEDIUMTEXT NOT NULL DEFAULT ('owner'),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_tenantId_email_key`(`tenantId`, `email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SiteConfig` (
    `id` VARCHAR(191) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,
    `theme` MEDIUMTEXT NOT NULL DEFAULT ('{}'),
    `header` MEDIUMTEXT NOT NULL DEFAULT ('{}'),
    `footer` MEDIUMTEXT NOT NULL DEFAULT ('{}'),
    `seo` MEDIUMTEXT NOT NULL DEFAULT ('{}'),
    `customCss` MEDIUMTEXT NOT NULL DEFAULT (''),
    `resultConfig` MEDIUMTEXT NOT NULL DEFAULT ('{}'),
    `adminPrefs` MEDIUMTEXT NOT NULL DEFAULT ('{}'),
    `payments` MEDIUMTEXT NOT NULL DEFAULT ('{}'),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `SiteConfig_tenantId_key`(`tenantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Campaign` (
    `id` VARCHAR(191) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,
    `name` MEDIUMTEXT NOT NULL,
    `platform` MEDIUMTEXT NOT NULL DEFAULT ('google'),
    `objective` MEDIUMTEXT NOT NULL DEFAULT ('leads'),
    `service` MEDIUMTEXT NOT NULL DEFAULT (''),
    `adImage` MEDIUMTEXT NOT NULL DEFAULT (''),
    `headline` MEDIUMTEXT NOT NULL DEFAULT (''),
    `adText` MEDIUMTEXT NOT NULL DEFAULT (''),
    `targetUrl` MEDIUMTEXT NOT NULL DEFAULT (''),
    `budget` INTEGER NOT NULL DEFAULT 0,
    `startDate` MEDIUMTEXT NOT NULL DEFAULT (''),
    `endDate` MEDIUMTEXT NOT NULL DEFAULT (''),
    `gender` MEDIUMTEXT NOT NULL DEFAULT ('all'),
    `ageMin` INTEGER NOT NULL DEFAULT 18,
    `ageMax` INTEGER NOT NULL DEFAULT 65,
    `interests` MEDIUMTEXT NOT NULL DEFAULT ('[]'),
    `locations` MEDIUMTEXT NOT NULL DEFAULT ('[]'),
    `radiusKm` INTEGER NOT NULL DEFAULT 0,
    `status` MEDIUMTEXT NOT NULL DEFAULT ('draft'),
    `spend` INTEGER NOT NULL DEFAULT 0,
    `clicks` INTEGER NOT NULL DEFAULT 0,
    `leads` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Campaign_tenantId_idx`(`tenantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notice` (
    `id` VARCHAR(191) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,
    `date` MEDIUMTEXT NOT NULL DEFAULT (''),
    `title` MEDIUMTEXT NOT NULL,
    `category` MEDIUMTEXT NOT NULL DEFAULT ('News'),
    `link` MEDIUMTEXT NOT NULL DEFAULT (''),
    `attachmentUrl` MEDIUMTEXT NOT NULL DEFAULT (''),
    `attachmentName` MEDIUMTEXT NOT NULL DEFAULT (''),
    `pinned` BOOLEAN NOT NULL DEFAULT false,
    `published` BOOLEAN NOT NULL DEFAULT true,
    `order` INTEGER NOT NULL DEFAULT 0,
    `demoSessionId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Notice_tenantId_idx`(`tenantId`),
    INDEX `Notice_demoSessionId_idx`(`demoSessionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ResultExam` (
    `id` VARCHAR(191) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `published` BOOLEAN NOT NULL DEFAULT true,
    `verifyDob` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `ResultExam_tenantId_name_key`(`tenantId`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudentResult` (
    `id` VARCHAR(191) NOT NULL,
    `examId` VARCHAR(191) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,
    `rollNo` VARCHAR(191) NOT NULL,
    `name` MEDIUMTEXT NOT NULL,
    `className` MEDIUMTEXT NOT NULL DEFAULT (''),
    `section` MEDIUMTEXT NOT NULL DEFAULT (''),
    `fatherName` MEDIUMTEXT NOT NULL DEFAULT (''),
    `motherName` MEDIUMTEXT NOT NULL DEFAULT (''),
    `dob` MEDIUMTEXT NOT NULL DEFAULT (''),
    `subjects` MEDIUMTEXT NOT NULL DEFAULT ('[]'),
    `total` INTEGER NOT NULL DEFAULT 0,
    `maxTotal` INTEGER NOT NULL DEFAULT 0,
    `percentage` DOUBLE NOT NULL DEFAULT 0,
    `grade` MEDIUMTEXT NOT NULL DEFAULT (''),
    `status` MEDIUMTEXT NOT NULL DEFAULT (''),
    `remarks` MEDIUMTEXT NOT NULL DEFAULT (''),

    INDEX `StudentResult_tenantId_rollNo_idx`(`tenantId`, `rollNo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Page` (
    `id` VARCHAR(191) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `title` MEDIUMTEXT NOT NULL,
    `isSystem` BOOLEAN NOT NULL DEFAULT false,
    `published` BOOLEAN NOT NULL DEFAULT true,
    `order` INTEGER NOT NULL DEFAULT 0,
    `showInNav` BOOLEAN NOT NULL DEFAULT true,
    `seoTitle` MEDIUMTEXT NOT NULL DEFAULT (''),
    `seoDescription` MEDIUMTEXT NOT NULL DEFAULT (''),
    `seoImage` MEDIUMTEXT NOT NULL DEFAULT (''),
    `noindex` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Page_tenantId_slug_key`(`tenantId`, `slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Section` (
    `id` VARCHAR(191) NOT NULL,
    `pageId` VARCHAR(191) NOT NULL,
    `type` MEDIUMTEXT NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `visible` BOOLEAN NOT NULL DEFAULT true,
    `content` MEDIUMTEXT NOT NULL DEFAULT ('{}'),
    `style` MEDIUMTEXT NOT NULL DEFAULT ('{}'),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Service` (
    `id` VARCHAR(191) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,
    `category` MEDIUMTEXT NOT NULL,
    `title` MEDIUMTEXT NOT NULL,
    `description` MEDIUMTEXT NOT NULL DEFAULT (''),
    `image` MEDIUMTEXT NOT NULL DEFAULT (''),
    `order` INTEGER NOT NULL DEFAULT 0,
    `slug` MEDIUMTEXT NOT NULL DEFAULT (''),
    `longDescription` MEDIUMTEXT NOT NULL DEFAULT (''),
    `seoTitle` MEDIUMTEXT NOT NULL DEFAULT (''),
    `seoDescription` MEDIUMTEXT NOT NULL DEFAULT (''),
    `demoSessionId` VARCHAR(191) NULL,

    INDEX `Service_demoSessionId_idx`(`demoSessionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GalleryItem` (
    `id` VARCHAR(191) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,
    `category` MEDIUMTEXT NOT NULL,
    `image` MEDIUMTEXT NOT NULL,
    `caption` MEDIUMTEXT NOT NULL DEFAULT (''),
    `order` INTEGER NOT NULL DEFAULT 0,
    `demoSessionId` VARCHAR(191) NULL,

    INDEX `GalleryItem_demoSessionId_idx`(`demoSessionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Person` (
    `id` VARCHAR(191) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,
    `name` MEDIUMTEXT NOT NULL,
    `role` MEDIUMTEXT NOT NULL DEFAULT (''),
    `bio` MEDIUMTEXT NOT NULL DEFAULT (''),
    `image` MEDIUMTEXT NOT NULL DEFAULT (''),
    `groupName` MEDIUMTEXT NOT NULL DEFAULT ('core'),
    `experience` MEDIUMTEXT NOT NULL DEFAULT (''),
    `linkedin` MEDIUMTEXT NOT NULL DEFAULT (''),
    `instagram` MEDIUMTEXT NOT NULL DEFAULT (''),
    `order` INTEGER NOT NULL DEFAULT 0,
    `published` BOOLEAN NOT NULL DEFAULT true,
    `demoSessionId` VARCHAR(191) NULL,

    INDEX `Person_tenantId_idx`(`tenantId`),
    INDEX `Person_demoSessionId_idx`(`demoSessionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SiteEvent` (
    `id` VARCHAR(191) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL DEFAULT '',
    `title` MEDIUMTEXT NOT NULL,
    `activityName` MEDIUMTEXT NOT NULL DEFAULT (''),
    `shortDescription` MEDIUMTEXT NOT NULL DEFAULT (''),
    `programDescription` MEDIUMTEXT NOT NULL DEFAULT (''),
    `date` MEDIUMTEXT NOT NULL DEFAULT (''),
    `location` MEDIUMTEXT NOT NULL DEFAULT (''),
    `organizedBy` MEDIUMTEXT NOT NULL DEFAULT (''),
    `dignitaries` MEDIUMTEXT NOT NULL DEFAULT (''),
    `impact` MEDIUMTEXT NOT NULL DEFAULT (''),
    `coverImage` MEDIUMTEXT NOT NULL DEFAULT (''),
    `gallery` MEDIUMTEXT NOT NULL DEFAULT ('[]'),
    `objectives` MEDIUMTEXT NOT NULL DEFAULT ('[]'),
    `documents` MEDIUMTEXT NOT NULL DEFAULT ('[]'),
    `status` MEDIUMTEXT NOT NULL DEFAULT ('auto'),
    `mapUrl` MEDIUMTEXT NOT NULL DEFAULT (''),
    `venueNote` MEDIUMTEXT NOT NULL DEFAULT (''),
    `blocks` MEDIUMTEXT NOT NULL DEFAULT ('[]'),
    `enableDonate` BOOLEAN NOT NULL DEFAULT false,
    `donateAmount` INTEGER NOT NULL DEFAULT 0,
    `donateLabel` MEDIUMTEXT NOT NULL DEFAULT (''),
    `showQr` BOOLEAN NOT NULL DEFAULT false,
    `qrImage` MEDIUMTEXT NOT NULL DEFAULT (''),
    `qrCaption` MEDIUMTEXT NOT NULL DEFAULT (''),
    `published` BOOLEAN NOT NULL DEFAULT true,
    `order` INTEGER NOT NULL DEFAULT 0,
    `demoSessionId` VARCHAR(191) NULL,

    INDEX `SiteEvent_tenantId_idx`(`tenantId`),
    INDEX `SiteEvent_demoSessionId_idx`(`demoSessionId`),
    UNIQUE INDEX `SiteEvent_tenantId_slug_key`(`tenantId`, `slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SiteDonation` (
    `id` VARCHAR(191) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,
    `eventId` MEDIUMTEXT NOT NULL DEFAULT (''),
    `name` MEDIUMTEXT NOT NULL DEFAULT (''),
    `email` MEDIUMTEXT NOT NULL DEFAULT (''),
    `phone` MEDIUMTEXT NOT NULL DEFAULT (''),
    `amount` INTEGER NOT NULL DEFAULT 0,
    `status` MEDIUMTEXT NOT NULL DEFAULT ('created'),
    `gateway` MEDIUMTEXT NOT NULL DEFAULT ('upi'),
    `gatewayOrderId` MEDIUMTEXT NOT NULL DEFAULT (''),
    `gatewayPayId` MEDIUMTEXT NOT NULL DEFAULT (''),
    `note` MEDIUMTEXT NOT NULL DEFAULT (''),
    `demoSessionId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `SiteDonation_tenantId_idx`(`tenantId`),
    INDEX `SiteDonation_demoSessionId_idx`(`demoSessionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Volunteer` (
    `id` VARCHAR(191) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,
    `name` MEDIUMTEXT NOT NULL,
    `phone` MEDIUMTEXT NOT NULL,
    `email` MEDIUMTEXT NOT NULL DEFAULT (''),
    `age` MEDIUMTEXT NOT NULL DEFAULT (''),
    `gender` MEDIUMTEXT NOT NULL DEFAULT (''),
    `city` MEDIUMTEXT NOT NULL DEFAULT (''),
    `state` MEDIUMTEXT NOT NULL DEFAULT (''),
    `interest` MEDIUMTEXT NOT NULL DEFAULT (''),
    `availability` MEDIUMTEXT NOT NULL DEFAULT (''),
    `mode` MEDIUMTEXT NOT NULL DEFAULT (''),
    `experience` MEDIUMTEXT NOT NULL DEFAULT (''),
    `status` MEDIUMTEXT NOT NULL DEFAULT ('new'),
    `demoSessionId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Volunteer_tenantId_idx`(`tenantId`),
    INDEX `Volunteer_demoSessionId_idx`(`demoSessionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Lead` (
    `id` VARCHAR(191) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,
    `name` MEDIUMTEXT NOT NULL,
    `phone` MEDIUMTEXT NOT NULL,
    `email` MEDIUMTEXT NOT NULL DEFAULT (''),
    `service` MEDIUMTEXT NOT NULL DEFAULT (''),
    `location` MEDIUMTEXT NOT NULL DEFAULT (''),
    `message` MEDIUMTEXT NOT NULL DEFAULT (''),
    `status` MEDIUMTEXT NOT NULL DEFAULT ('new'),
    `demoSessionId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Lead_tenantId_idx`(`tenantId`),
    INDEX `Lead_demoSessionId_idx`(`demoSessionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Appointment` (
    `id` VARCHAR(191) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,
    `name` MEDIUMTEXT NOT NULL,
    `phone` MEDIUMTEXT NOT NULL,
    `email` MEDIUMTEXT NOT NULL DEFAULT (''),
    `service` MEDIUMTEXT NOT NULL DEFAULT (''),
    `date` MEDIUMTEXT NOT NULL DEFAULT (''),
    `time` MEDIUMTEXT NOT NULL DEFAULT (''),
    `message` MEDIUMTEXT NOT NULL DEFAULT (''),
    `status` MEDIUMTEXT NOT NULL DEFAULT ('pending'),
    `demoSessionId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Appointment_tenantId_idx`(`tenantId`),
    INDEX `Appointment_demoSessionId_idx`(`demoSessionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PlatformLead` (
    `id` VARCHAR(191) NOT NULL,
    `name` MEDIUMTEXT NOT NULL,
    `email` MEDIUMTEXT NOT NULL,
    `phone` MEDIUMTEXT NOT NULL DEFAULT (''),
    `company` MEDIUMTEXT NOT NULL DEFAULT (''),
    `vertical` MEDIUMTEXT NOT NULL DEFAULT (''),
    `type` MEDIUMTEXT NOT NULL DEFAULT ('demo'),
    `message` MEDIUMTEXT NOT NULL DEFAULT (''),
    `status` MEDIUMTEXT NOT NULL DEFAULT ('new'),
    `verified` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DemoSession` (
    `id` VARCHAR(191) NOT NULL,
    `name` MEDIUMTEXT NOT NULL,
    `email` MEDIUMTEXT NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `company` MEDIUMTEXT NOT NULL DEFAULT (''),
    `vertical` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `otpHash` MEDIUMTEXT NOT NULL DEFAULT (''),
    `otpExpiresAt` DATETIME(3) NULL,
    `verifiedAt` DATETIME(3) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'pending_otp',
    `expiresAt` DATETIME(3) NULL,
    `overlay` MEDIUMTEXT NOT NULL DEFAULT ('{}'),
    `pagesViewed` MEDIUMTEXT NOT NULL DEFAULT ('[]'),
    `adminUsername` VARCHAR(191) NOT NULL DEFAULT '',
    `adminPassword` MEDIUMTEXT NOT NULL DEFAULT (''),
    `platformLeadId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `DemoSession_token_key`(`token`),
    INDEX `DemoSession_phone_vertical_idx`(`phone`, `vertical`),
    INDEX `DemoSession_token_idx`(`token`),
    INDEX `DemoSession_status_idx`(`status`),
    INDEX `DemoSession_adminUsername_idx`(`adminUsername`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PlatformConfig` (
    `id` VARCHAR(191) NOT NULL DEFAULT 'singleton',
    `razorpayKeyId` MEDIUMTEXT NOT NULL DEFAULT (''),
    `razorpayKeySecret` MEDIUMTEXT NOT NULL DEFAULT (''),
    `platformName` MEDIUMTEXT NOT NULL DEFAULT ('StandardSaaS'),
    `supportEmail` MEDIUMTEXT NOT NULL DEFAULT (''),
    `supportPhone` MEDIUMTEXT NOT NULL DEFAULT (''),
    `broadcastShow` BOOLEAN NOT NULL DEFAULT false,
    `broadcastText` MEDIUMTEXT NOT NULL DEFAULT (''),
    `gstin` MEDIUMTEXT NOT NULL DEFAULT (''),
    `businessAddress` MEDIUMTEXT NOT NULL DEFAULT (''),
    `gstRate` INTEGER NOT NULL DEFAULT 18,
    `invoicePrefix` MEDIUMTEXT NOT NULL DEFAULT ('INV'),
    `planOverrides` MEDIUMTEXT NOT NULL DEFAULT ('{}'),
    `remindersEnabled` BOOLEAN NOT NULL DEFAULT false,
    `reminderDays` INTEGER NOT NULL DEFAULT 7,
    `resendApiKey` MEDIUMTEXT NOT NULL DEFAULT (''),
    `senderEmail` MEDIUMTEXT NOT NULL DEFAULT (''),
    `demoOtpMode` MEDIUMTEXT NOT NULL DEFAULT ('screen'),
    `demoDurationMinutes` INTEGER NOT NULL DEFAULT 10,
    `demoWhatsAppToken` MEDIUMTEXT NOT NULL DEFAULT (''),
    `demoWhatsAppPhoneId` MEDIUMTEXT NOT NULL DEFAULT (''),
    `groqApiKey` MEDIUMTEXT NOT NULL DEFAULT (''),
    `groqModel` MEDIUMTEXT NOT NULL DEFAULT (''),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Coupon` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `percentOff` INTEGER NOT NULL DEFAULT 0,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `maxUses` INTEGER NOT NULL DEFAULT 0,
    `usedCount` INTEGER NOT NULL DEFAULT 0,
    `expiresAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Coupon_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AiGeneration` (
    `id` VARCHAR(191) NOT NULL,
    `tenantId` VARCHAR(191) NOT NULL,
    `kind` MEDIUMTEXT NOT NULL,
    `prompt` MEDIUMTEXT NOT NULL,
    `blueprint` MEDIUMTEXT NOT NULL DEFAULT ('{}'),
    `operations` MEDIUMTEXT NOT NULL DEFAULT ('[]'),
    `snapshot` MEDIUMTEXT NOT NULL DEFAULT ('{}'),
    `status` MEDIUMTEXT NOT NULL DEFAULT ('completed'),
    `error` MEDIUMTEXT NOT NULL DEFAULT (''),
    `pageId` MEDIUMTEXT NOT NULL DEFAULT (''),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `AiGeneration_tenantId_createdAt_idx`(`tenantId`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PlatformUser` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` MEDIUMTEXT NOT NULL,
    `name` MEDIUMTEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `PlatformUser_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `id` VARCHAR(191) NOT NULL,
    `customerName` MEDIUMTEXT NOT NULL,
    `email` MEDIUMTEXT NOT NULL,
    `phone` MEDIUMTEXT NOT NULL DEFAULT (''),
    `company` MEDIUMTEXT NOT NULL DEFAULT (''),
    `vertical` MEDIUMTEXT NOT NULL,
    `subdomain` MEDIUMTEXT NOT NULL,
    `plan` MEDIUMTEXT NOT NULL,
    `amount` INTEGER NOT NULL,
    `currency` MEDIUMTEXT NOT NULL DEFAULT ('INR'),
    `status` MEDIUMTEXT NOT NULL DEFAULT ('created'),
    `gateway` MEDIUMTEXT NOT NULL DEFAULT ('mock'),
    `gatewayOrderId` MEDIUMTEXT NOT NULL DEFAULT (''),
    `gatewayPayId` MEDIUMTEXT NOT NULL DEFAULT (''),
    `invoiceNo` VARCHAR(191) NULL,
    `refundReason` MEDIUMTEXT NOT NULL DEFAULT (''),
    `refundedAt` DATETIME(3) NULL,
    `passwordHash` MEDIUMTEXT NOT NULL DEFAULT (''),
    `provisionError` MEDIUMTEXT NOT NULL DEFAULT (''),
    `couponCode` MEDIUMTEXT NOT NULL DEFAULT (''),
    `aiBlueprint` MEDIUMTEXT NOT NULL DEFAULT ('{}'),
    `design` MEDIUMTEXT NOT NULL DEFAULT (''),
    `kind` MEDIUMTEXT NOT NULL DEFAULT ('new'),
    `tenantId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Order_invoiceNo_key`(`invoiceNo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `Tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SiteConfig` ADD CONSTRAINT `SiteConfig_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `Tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Campaign` ADD CONSTRAINT `Campaign_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `Tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notice` ADD CONSTRAINT `Notice_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `Tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ResultExam` ADD CONSTRAINT `ResultExam_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `Tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentResult` ADD CONSTRAINT `StudentResult_examId_fkey` FOREIGN KEY (`examId`) REFERENCES `ResultExam`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Page` ADD CONSTRAINT `Page_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `Tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Section` ADD CONSTRAINT `Section_pageId_fkey` FOREIGN KEY (`pageId`) REFERENCES `Page`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Service` ADD CONSTRAINT `Service_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `Tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GalleryItem` ADD CONSTRAINT `GalleryItem_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `Tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Person` ADD CONSTRAINT `Person_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `Tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SiteEvent` ADD CONSTRAINT `SiteEvent_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `Tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SiteDonation` ADD CONSTRAINT `SiteDonation_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `Tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Volunteer` ADD CONSTRAINT `Volunteer_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `Tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lead` ADD CONSTRAINT `Lead_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `Tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `Tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DemoSession` ADD CONSTRAINT `DemoSession_platformLeadId_fkey` FOREIGN KEY (`platformLeadId`) REFERENCES `PlatformLead`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `Tenant`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

