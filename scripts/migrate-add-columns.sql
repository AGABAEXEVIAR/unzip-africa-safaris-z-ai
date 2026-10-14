-- =====================================================================
-- Migration: add missing columns for API persistence
-- ---------------------------------------------------------------------
-- The original Prisma migration (0_init/migration.sql) created the base
-- schema. The application code, however, sends a few extra fields that
-- have no corresponding column:
--   • TourPackage: days, inclusions, exclusions, mapEmbed
--   • ScheduledTrip: stops, mapEmbed
--   • Destination: gameParks
--   • Settings: contentOverrides
-- Previously, Prisma's strict validation silently rejected these
-- extra fields, so POST /api/crud?type=tours returned 500 and the
-- optimistic update stayed in localStorage only — meaning the admin
-- dashboard showed the tour but /api/crud?type=tours returned [].
--
-- We now store these "extra" fields inline as JSON columns (or as a
-- TEXT for mapEmbed). This script is idempotent — IF NOT EXISTS
-- guards each statement so it can be re-run safely.
-- =====================================================================

-- TourPackage: days, inclusions, exclusions, mapEmbed
ALTER TABLE `TourPackage`
  ADD COLUMN IF NOT EXISTS `days` JSON NULL AFTER `accommodationIds`;
ALTER TABLE `TourPackage`
  ADD COLUMN IF NOT EXISTS `inclusions` JSON NULL AFTER `days`;
ALTER TABLE `TourPackage`
  ADD COLUMN IF NOT EXISTS `exclusions` JSON NULL AFTER `inclusions`;
ALTER TABLE `TourPackage`
  ADD COLUMN IF NOT EXISTS `mapEmbed` TEXT NULL AFTER `exclusions`;

-- ScheduledTrip: stops, mapEmbed
ALTER TABLE `ScheduledTrip`
  ADD COLUMN IF NOT EXISTS `stops` JSON NULL AFTER `accommodationLevel`;
ALTER TABLE `ScheduledTrip`
  ADD COLUMN IF NOT EXISTS `mapEmbed` TEXT NULL AFTER `stops`;

-- Destination: gameParks (stored inline as JSON; GamePark table stays for backward compat)
ALTER TABLE `Destination`
  ADD COLUMN IF NOT EXISTS `gameParks` JSON NULL AFTER `price`;

-- Accommodation: pricePerNight (was a TS-only field, persist to column)
ALTER TABLE `Accommodation`
  ADD COLUMN IF NOT EXISTS `pricePerNight` VARCHAR(191) NULL AFTER `features`;

-- Settings: contentOverrides (admin-managed founder/FAQ/safari-cars content)
ALTER TABLE `Settings`
  ADD COLUMN IF NOT EXISTS `contentOverrides` JSON NULL AFTER `developedBy`;
