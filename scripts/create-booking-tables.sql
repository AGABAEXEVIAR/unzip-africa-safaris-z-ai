-- =====================================================================
-- Create missing booking/inquiry tables (idempotent).
-- ---------------------------------------------------------------------
-- The Next.js app's entity registry (src/lib/entities.ts) references
-- three tables that may not exist on every deployment:
--   * TourBooking
--   * ScheduledTripBooking
--   * FormInquiry
--
-- This script uses CREATE TABLE IF NOT EXISTS so it is safe to re-run.
-- It mirrors the column definitions declared in entities.ts so the
-- existing generic CRUD API (/api/crud?type=...) can INSERT/SELECT
-- against them without errors.
--
-- Run via (Node):
--   DATABASE_URL='mysql://...' node scripts/run-migration.mjs scripts/create-booking-tables.sql
--
-- Or via (PHP on Hostinger — no node in PATH):
--   DATABASE_URL='mysql://...' php scripts/run-migration.php scripts/create-booking-tables.sql
--
-- Or paste directly into phpMyAdmin → SQL tab.
-- =====================================================================

CREATE TABLE IF NOT EXISTS `TourBooking` (
  `id` VARCHAR(191) NOT NULL,
  `tourId` VARCHAR(191) DEFAULT NULL,
  `tripName` VARCHAR(255) NOT NULL,
  `destination` VARCHAR(255) DEFAULT NULL,
  `duration` VARCHAR(255) DEFAULT NULL,
  `pricePerPerson` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `numTravellers` INT NOT NULL DEFAULT 1,
  `totalPrice` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `customerName` VARCHAR(255) NOT NULL,
  `customerEmail` VARCHAR(255) NOT NULL,
  `customerPhone` VARCHAR(255) NOT NULL,
  `notes` TEXT,
  `status` VARCHAR(50) NOT NULL DEFAULT 'PENDING',
  `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `TourBooking_tourId_idx` (`tourId`),
  INDEX `TourBooking_status_idx` (`status`),
  INDEX `TourBooking_customerEmail_idx` (`customerEmail`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `ScheduledTripBooking` (
  `id` VARCHAR(191) NOT NULL,
  `scheduledTripId` VARCHAR(191) DEFAULT NULL,
  `tripName` VARCHAR(255) NOT NULL,
  `destination` VARCHAR(255) DEFAULT NULL,
  `startDate` TIMESTAMP(0) NULL DEFAULT NULL,
  `endDate` TIMESTAMP(0) NULL DEFAULT NULL,
  `duration` VARCHAR(255) DEFAULT NULL,
  `pricePerPerson` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `numTravellers` INT NOT NULL DEFAULT 1,
  `totalPrice` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `customerName` VARCHAR(255) NOT NULL,
  `customerEmail` VARCHAR(255) NOT NULL,
  `customerPhone` VARCHAR(255) NOT NULL,
  `notes` TEXT,
  `status` VARCHAR(50) NOT NULL DEFAULT 'PENDING',
  `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `ScheduledTripBooking_scheduledTripId_idx` (`scheduledTripId`),
  INDEX `ScheduledTripBooking_status_idx` (`status`),
  INDEX `ScheduledTripBooking_customerEmail_idx` (`customerEmail`),
  INDEX `ScheduledTripBooking_startDate_idx` (`startDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `FormInquiry` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) DEFAULT NULL,
  `phone` VARCHAR(255) DEFAULT NULL,
  `travelers` VARCHAR(255) DEFAULT NULL,
  `dates` VARCHAR(255) DEFAULT NULL,
  `destinations` JSON DEFAULT NULL,
  `interests` JSON DEFAULT NULL,
  `budget` VARCHAR(255) DEFAULT NULL,
  `duration` VARCHAR(255) DEFAULT NULL,
  `message` TEXT NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'NEW',
  `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `FormInquiry_email_idx` (`email`),
  INDEX `FormInquiry_status_idx` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- Add a `duration` column to FormInquiry if it doesn't already exist.
-- (Defensive — older deployments may have created FormInquiry without
-- this column. entities.ts declares it as writable, so it must exist.)
-- =====================================================================
-- MySQL doesn't support "ADD COLUMN IF NOT EXISTS" until 8.0.29+.
-- Hostinger is usually MariaDB which DOES support it. We use a stored
-- procedure workaround that works on all MySQL/MariaDB versions:
-- =====================================================================

DELIMITER //
DROP PROCEDURE IF EXISTS _add_column_if_missing //
CREATE PROCEDURE _add_column_if_missing(
  IN tbl VARCHAR(64),
  IN col VARCHAR(64),
  IN coldef TEXT
)
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = tbl
      AND COLUMN_NAME = col
  ) THEN
    SET @sql = CONCAT('ALTER TABLE `', tbl, '` ADD COLUMN `', col, '` ', coldef);
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
  END IF;
END //
DELIMITER ;

CALL _add_column_if_missing('FormInquiry', 'duration', "VARCHAR(255) DEFAULT NULL");
CALL _add_column_if_missing('FormInquiry', 'interests', "JSON DEFAULT NULL");
CALL _add_column_if_missing('TourBooking', 'type', "VARCHAR(50) NOT NULL DEFAULT 'tour'");
CALL _add_column_if_missing('ScheduledTripBooking', 'type', "VARCHAR(50) NOT NULL DEFAULT 'scheduled-trip'");

DROP PROCEDURE IF EXISTS _add_column_if_missing;
