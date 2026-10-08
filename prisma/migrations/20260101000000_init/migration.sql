-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'EDITOR') NOT NULL DEFAULT 'ADMIN',
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    INDEX `User_email_idx`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TourPackage` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `subtitle` VARCHAR(191) NOT NULL,
    `duration` VARCHAR(191) NOT NULL,
    `durationDays` INTEGER NOT NULL,
    `durationNights` INTEGER NOT NULL,
    `price` VARCHAR(191) NOT NULL,
    `priceFrom` DECIMAL(12, 2) NOT NULL,
    `priceOriginal` DECIMAL(12, 2) NULL,
    `highlights` JSON NOT NULL,
    `image` TEXT NOT NULL,
    `galleryImages` JSON NULL,
    `destination` VARCHAR(191) NOT NULL,
    `activities` JSON NOT NULL,
    `tripType` VARCHAR(191) NOT NULL,
    `accommodationLevel` VARCHAR(191) NOT NULL,
    `nationalPark` VARCHAR(191) NOT NULL,
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `minAge` INTEGER NOT NULL DEFAULT 6,
    `accommodationIds` JSON NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,

    INDEX `TourPackage_destination_idx`(`destination`),
    INDEX `TourPackage_featured_idx`(`featured`),
    INDEX `TourPackage_tripType_idx`(`tripType`),
    INDEX `TourPackage_accommodationLevel_idx`(`accommodationLevel`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TourDay` (
    `id` VARCHAR(191) NOT NULL,
    `day` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `image` TEXT NOT NULL,
    `tourId` VARCHAR(191) NOT NULL,

    INDEX `TourDay_tourId_idx`(`tourId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Accommodation` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `image` TEXT NOT NULL,
    `galleryImages` JSON NULL,
    `features` JSON NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,

    INDEX `Accommodation_location_idx`(`location`),
    INDEX `Accommodation_type_idx`(`type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ScheduledTrip` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `destination` VARCHAR(191) NOT NULL,
    `startDate` TIMESTAMP(0) NOT NULL,
    `endDate` TIMESTAMP(0) NOT NULL,
    `durationDays` INTEGER NOT NULL,
    `priceFrom` DECIMAL(12, 2) NOT NULL,
    `priceOriginal` DECIMAL(12, 2) NULL,
    `image` TEXT NOT NULL,
    `galleryImages` JSON NULL,
    `description` TEXT NOT NULL,
    `highlights` JSON NOT NULL,
    `inclusions` JSON NOT NULL,
    `exclusions` JSON NOT NULL,
    `groupSize` VARCHAR(191) NOT NULL,
    `spotsLeft` INTEGER NOT NULL,
    `accommodationLevel` VARCHAR(191) NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,

    INDEX `ScheduledTrip_destination_idx`(`destination`),
    INDEX `ScheduledTrip_startDate_idx`(`startDate`),
    INDEX `ScheduledTrip_accommodationLevel_idx`(`accommodationLevel`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ScheduledTripStop` (
    `id` VARCHAR(191) NOT NULL,
    `day` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `image` TEXT NOT NULL,
    `scheduledTripId` VARCHAR(191) NOT NULL,

    INDEX `ScheduledTripStop_scheduledTripId_idx`(`scheduledTripId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Destination` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `tagline` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `image` TEXT NOT NULL,
    `imagePortrait` TEXT NOT NULL,
    `days` VARCHAR(191) NOT NULL,
    `price` VARCHAR(191) NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,

    INDEX `Destination_country_idx`(`country`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GamePark` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `destinationId` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `image` TEXT NOT NULL,
    `wildlife` JSON NOT NULL,

    INDEX `GamePark_destinationId_idx`(`destinationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Testimonial` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `avatar` TEXT NOT NULL,
    `content` TEXT NOT NULL,
    `published` BOOLEAN NOT NULL DEFAULT false,
    `date` TIMESTAMP(0) NOT NULL,

    INDEX `Testimonial_published_idx`(`published`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BlogPost` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `excerpt` TEXT NOT NULL,
    `body` LONGTEXT NOT NULL,
    `coverImage` TEXT NOT NULL,
    `author` VARCHAR(191) NOT NULL,
    `authorRole` VARCHAR(191) NULL,
    `authorAvatar` TEXT NULL,
    `publishedDate` TIMESTAMP(0) NOT NULL,
    `tags` JSON NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `readTimeMins` INTEGER NOT NULL,
    `published` BOOLEAN NOT NULL DEFAULT false,
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,

    INDEX `BlogPost_published_idx`(`published`),
    INDEX `BlogPost_featured_idx`(`featured`),
    INDEX `BlogPost_category_idx`(`category`),
    INDEX `BlogPost_publishedDate_idx`(`publishedDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Booking` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('TOUR', 'SCHEDULED_TRIP') NOT NULL,
    `tourId` VARCHAR(191) NULL,
    `scheduledTripId` VARCHAR(191) NULL,
    `tripName` VARCHAR(191) NOT NULL,
    `destination` VARCHAR(191) NOT NULL,
    `startDate` TIMESTAMP(0) NULL,
    `endDate` TIMESTAMP(0) NULL,
    `duration` VARCHAR(191) NULL,
    `pricePerPerson` DECIMAL(12, 2) NOT NULL,
    `numTravellers` INTEGER NOT NULL,
    `totalPrice` DECIMAL(12, 2) NOT NULL,
    `customerName` VARCHAR(191) NOT NULL,
    `customerEmail` VARCHAR(191) NOT NULL,
    `customerPhone` VARCHAR(191) NOT NULL,
    `notes` TEXT NULL,
    `status` ENUM('PENDING', 'CONFIRMED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,

    INDEX `Booking_tourId_idx`(`tourId`),
    INDEX `Booking_scheduledTripId_idx`(`scheduledTripId`),
    INDEX `Booking_status_idx`(`status`),
    INDEX `Booking_customerEmail_idx`(`customerEmail`),
    INDEX `Booking_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `QuoteRequest` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `travelers` VARCHAR(191) NULL,
    `dates` VARCHAR(191) NULL,
    `destinations` JSON NULL,
    `budget` VARCHAR(191) NULL,
    `message` TEXT NOT NULL,
    `status` ENUM('NEW', 'CONTACTED', 'WON', 'LOST') NOT NULL DEFAULT 'NEW',
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,

    INDEX `QuoteRequest_status_idx`(`status`),
    INDEX `QuoteRequest_email_idx`(`email`),
    INDEX `QuoteRequest_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Settings` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `companyName` VARCHAR(191) NOT NULL,
    `tagline` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `logoUrl` TEXT NULL,
    `facebook` TEXT NULL,
    `instagram` TEXT NULL,
    `twitter` TEXT NULL,
    `youtube` TEXT NULL,
    `primaryColor` VARCHAR(191) NULL,
    `accentColor` VARCHAR(191) NULL,
    `whatsappNumber` VARCHAR(191) NULL,
    `whatsappMessage` TEXT NULL,
    `copyright` VARCHAR(191) NULL,
    `developedBy` VARCHAR(191) NULL,
    `updatedAt` TIMESTAMP(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TourDay` ADD CONSTRAINT `TourDay_tourId_fkey` FOREIGN KEY (`tourId`) REFERENCES `TourPackage`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ScheduledTripStop` ADD CONSTRAINT `ScheduledTripStop_scheduledTripId_fkey` FOREIGN KEY (`scheduledTripId`) REFERENCES `ScheduledTrip`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GamePark` ADD CONSTRAINT `GamePark_destinationId_fkey` FOREIGN KEY (`destinationId`) REFERENCES `Destination`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_tourId_fkey` FOREIGN KEY (`tourId`) REFERENCES `TourPackage`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_scheduledTripId_fkey` FOREIGN KEY (`scheduledTripId`) REFERENCES `ScheduledTrip`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

