-- =====================================================================
-- Migration: add missing columns for API persistence
-- ---------------------------------------------------------------------
-- The original Prisma migration (0_init/migration.sql) created the base
-- schema. The application code, however, sends a few extra fields that
-- have no corresponding column. We now store these "extra" fields
-- inline as JSON columns (or TEXT for mapEmbed). This script is
-- idempotent — IF NOT EXISTS guards each statement so it can be
-- re-run safely.
-- =====================================================================

ALTER TABLE `TourPackage`
  ADD COLUMN IF NOT EXISTS `days` JSON NULL;

ALTER TABLE `TourPackage`
  ADD COLUMN IF NOT EXISTS `inclusions` JSON NULL;

ALTER TABLE `TourPackage`
  ADD COLUMN IF NOT EXISTS `exclusions` JSON NULL;

ALTER TABLE `TourPackage`
  ADD COLUMN IF NOT EXISTS `mapEmbed` TEXT NULL;

ALTER TABLE `ScheduledTrip`
  ADD COLUMN IF NOT EXISTS `stops` JSON NULL;

ALTER TABLE `ScheduledTrip`
  ADD COLUMN IF NOT EXISTS `mapEmbed` TEXT NULL;

ALTER TABLE `Destination`
  ADD COLUMN IF NOT EXISTS `gameParks` JSON NULL;

ALTER TABLE `Accommodation`
  ADD COLUMN IF NOT EXISTS `pricePerNight` VARCHAR(191) NULL;

ALTER TABLE `Settings`
  ADD COLUMN IF NOT EXISTS `contentOverrides` JSON NULL;
