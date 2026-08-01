-- Migration 034: Add quota settings to user_categories and users
-- Adds configurable monthly booking quota per category and per-user override
-- DPP / BGKP categories are marked as unlimited by default

-- ─────────────────────────────────────────────────────────────
-- 1. Add quota columns to user_categories
-- ─────────────────────────────────────────────────────────────
ALTER TABLE user_categories
  ADD COLUMN IF NOT EXISTS is_unlimited  BOOLEAN NOT NULL DEFAULT FALSE
    COMMENT 'TRUE = no monthly booking limit (e.g. DPP / BGKP)',
  ADD COLUMN IF NOT EXISTS monthly_quota INT      NOT NULL DEFAULT 3
    COMMENT 'Max bookings per calendar month for this category (ignored when is_unlimited = TRUE)';

-- ─────────────────────────────────────────────────────────────
-- 2. Add per-user quota override column to users
-- ─────────────────────────────────────────────────────────────
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS monthly_quota_override INT DEFAULT NULL
    COMMENT 'NULL = use category default. Set by Super Admin to override per-user limit.',
  ADD COLUMN IF NOT EXISTS quota_is_unlimited_override BOOLEAN DEFAULT NULL
    COMMENT 'NULL = use category default. TRUE/FALSE = force override unlimited status for this user.';

-- ─────────────────────────────────────────────────────────────
-- 3. Seed defaults for existing DPP / BGKP categories
--    (case-insensitive match on common name variants)
-- ─────────────────────────────────────────────────────────────
UPDATE user_categories
SET is_unlimited = TRUE, monthly_quota = 999
WHERE UPPER(name) IN (
  'PARISH_COUNCIL',
  'CATEGORICAL_GROUP',
  'DPP',
  'BGKP',
  'DEWAN PASTORAL PAROKI',
  'BADAN GEREJA KATOLIK PAROKI'
);

-- ─────────────────────────────────────────────────────────────
-- 4. Add indexes
-- ─────────────────────────────────────────────────────────────
ALTER TABLE user_categories
  ADD INDEX IF NOT EXISTS idx_user_categories_is_unlimited (is_unlimited);

ALTER TABLE users
  ADD INDEX IF NOT EXISTS idx_users_quota_override (monthly_quota_override);
