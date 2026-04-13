-- Migration 029: Add status column to users table for self-registration flow
-- Status: PENDING (waiting approval), ACTIVE (approved), INACTIVE (rejected/disabled)

ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS account_status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE';

-- Set existing users as ACTIVE (they were created by admin, already approved)
UPDATE users SET account_status = 'ACTIVE' WHERE account_status IS NULL OR account_status = '';

-- Add index for efficient filtering
CREATE INDEX IF NOT EXISTS idx_users_account_status ON users(account_status);
