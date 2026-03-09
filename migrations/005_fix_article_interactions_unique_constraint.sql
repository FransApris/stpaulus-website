-- Migration: Fix article_interactions unique constraint
-- Date: 2026-01-19
-- Description: Remove incorrect unique constraint that was blocking views and shares

-- Problem: The original UNIQUE constraint (article_id, user_session, interaction_type, user_ip)
-- prevents recording multiple views/shares from the same user, which is incorrect behavior.
-- Views are already deduplicated in the code using timestamp checks (1 hour window).

-- Solution: Drop the constraint entirely since we handle deduplication in application code
ALTER TABLE article_interactions DROP INDEX unique_like;
