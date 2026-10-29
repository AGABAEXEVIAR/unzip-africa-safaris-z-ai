-- =====================================================================
-- Normalize accommodationLevel column values to the new three-tier system:
--   Mid-range | Luxury | Ultra-luxury
--
-- Run via: node scripts/run-migration.mjs scripts/normalize-accommodation-levels.sql
-- Idempotent — safe to run multiple times.
-- =====================================================================

-- TourPackage.accommodationLevel
UPDATE `TourPackage`
  SET `accommodationLevel` = 'Luxury'
  WHERE `accommodationLevel` IN (
    'Luxury Lodges', 'Luxury Tented Camp', 'Forest Lodge',
    'Desert Lodge', 'Wilderness Lodge', 'Lodge & Tented Camp'
  );

UPDATE `TourPackage`
  SET `accommodationLevel` = 'Mid-range'
  WHERE `accommodationLevel` IN (
    'Mid-Range Lodges', 'Tented Camp', 'Lodge', 'Mobile Bush Camp'
  );

UPDATE `TourPackage`
  SET `accommodationLevel` = 'Ultra-luxury'
  WHERE `accommodationLevel` IN (
    'Luxury Mobile Camp'
  );

-- ScheduledTrip.accommodationLevel
UPDATE `ScheduledTrip`
  SET `accommodationLevel` = 'Luxury'
  WHERE `accommodationLevel` IN (
    'Luxury Lodges', 'Luxury Tented Camp', 'Forest Lodge',
    'Desert Lodge', 'Wilderness Lodge', 'Lodge & Tented Camp'
  );

UPDATE `ScheduledTrip`
  SET `accommodationLevel` = 'Mid-range'
  WHERE `accommodationLevel` IN (
    'Mid-Range Lodges', 'Tented Camp', 'Lodge', 'Mobile Bush Camp'
  );

UPDATE `ScheduledTrip`
  SET `accommodationLevel` = 'Ultra-luxury'
  WHERE `accommodationLevel` IN (
    'Luxury Mobile Camp'
  );

-- Defensive: set any remaining non-canonical value to 'Luxury' (the most
-- common default for safari packages) so the admin dropdown never breaks.
UPDATE `TourPackage`
  SET `accommodationLevel` = 'Luxury'
  WHERE `accommodationLevel` NOT IN ('Mid-range', 'Luxury', 'Ultra-luxury')
  OR `accommodationLevel` IS NULL OR `accommodationLevel` = '';

UPDATE `ScheduledTrip`
  SET `accommodationLevel` = 'Luxury'
  WHERE `accommodationLevel` NOT IN ('Mid-range', 'Luxury', 'Ultra-luxury')
  OR `accommodationLevel` IS NULL OR `accommodationLevel` = '';
