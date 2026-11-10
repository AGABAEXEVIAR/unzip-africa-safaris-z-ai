-- =====================================================================
-- Add the `overview` column to TourPackage and populate it for the
-- three featured tours. The overview is a short paragraph shown beneath
-- the tour title on the homepage featured-cards carousel.
--
-- Idempotent — uses IF NOT EXISTS on the ALTER and overwrites on UPDATE.
-- Run via: python3 scripts/run-hostinger-migration.py scripts/migrate-tour-overviews.sql
-- =====================================================================

ALTER TABLE `TourPackage` ADD COLUMN IF NOT EXISTS `overview` TEXT NULL;

UPDATE `TourPackage` SET `overview` = 'Witness two million wildebeest thundering across the endless golden plains of the Serengeti and Maasai Mara — nature''s greatest spectacle, unfolding across two countries in a primal tide of life.' WHERE `id` = 'migration';

UPDATE `TourPackage` SET `overview` = 'Trek through mist-shrouded primaeval forest to sit among mountain gorillas and chimpanzees — a quiet, profound encounter with our closest living relatives in the ancient forests of Uganda and Rwanda.' WHERE `id` = 'apes';

UPDATE `TourPackage` SET `overview` = 'Track the Mara''s legendary prides of lion, leopard, and cheetah across short-grass plains teeming with wildlife — the definitive big-cat safari in Kenya''s most iconic reserve.' WHERE `id` = 'maasai-mara-classic';
