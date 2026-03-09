-- ============================================
-- Setup Script: News-Kronik Auto Sync
-- ============================================
-- This script configures automatic synchronization between news articles and kronik entries
-- Run this after executing migration 021_add_news_kronik_sync.sql

-- ============================================
-- STEP 1: Check Available Categories
-- ============================================

-- View all article categories
SELECT 
  id,
  name,
  slug,
  sync_to_kronik as is_sync_enabled,
  kronik_category_id as target_kronik_cat
FROM article_categories
ORDER BY name;

-- View all kronik categories
SELECT id, name, slug, description
FROM kronik_categories
ORDER BY id;

-- ============================================
-- STEP 2: Configure Auto-Sync Categories
-- ============================================

-- Example 1: Sync "Peristiwa Paroki" news to "Umum Paroki" kronik
-- Replace with your actual category names/IDs
UPDATE article_categories 
SET sync_to_kronik = TRUE, 
    kronik_category_id = 1  -- 1 = Umum Paroki
WHERE name = 'Peristiwa Paroki' 
   OR slug = 'peristiwa-paroki';

-- Example 2: Sync "Kegiatan Gereja" news to "Umum Paroki" kronik
UPDATE article_categories 
SET sync_to_kronik = TRUE, 
    kronik_category_id = 1
WHERE name LIKE '%Kegiatan%Gereja%';

-- Example 3: Sync "Kegiatan Lingkungan" to "Lingkungan" kronik
UPDATE article_categories 
SET sync_to_kronik = TRUE, 
    kronik_category_id = 5  -- 5 = Lingkungan
WHERE name LIKE '%Lingkungan%';

-- Example 4: Sync "Kegiatan DPP" to "DPP" kronik
UPDATE article_categories 
SET sync_to_kronik = TRUE, 
    kronik_category_id = 2  -- 2 = DPP
WHERE name LIKE '%DPP%' OR name LIKE '%Dewan%';

-- ============================================
-- STEP 3: Verify Configuration
-- ============================================

-- Check which categories are now sync-enabled
SELECT 
  ac.id as article_cat_id,
  ac.name as article_category,
  ac.slug as article_slug,
  kc.id as kronik_cat_id,
  kc.name as kronik_category,
  ac.sync_to_kronik as enabled
FROM article_categories ac
LEFT JOIN kronik_categories kc ON ac.kronik_category_id = kc.id
WHERE ac.sync_to_kronik = TRUE;

-- ============================================  
-- STEP 4: Test Query - Find News Ready to Sync
-- ============================================

-- This shows news articles that WILL be synced to kronik when published
SELECT 
  n.id as news_id,
  n.title,
  n.status,
  n.published_at,
  GROUP_CONCAT(ac.name) as categories,
  COUNT(CASE WHEN ac.sync_to_kronik = TRUE THEN 1 END) as sync_categories
FROM news n
LEFT JOIN news_category_relations ncr ON n.id = ncr.news_id
LEFT JOIN article_categories ac ON ncr.category_id = ac.id
GROUP BY n.id
HAVING sync_categories > 0;

-- ============================================
-- STEP 5: Check Existing Synced Entries
-- ============================================

-- View all kronik entries that were auto-created from news
SELECT 
  ke.id as kronik_id,
  ke.what_title as kronik_title,
  ke.source_news_id,
  ke.is_auto_synced,
  ke.sync_updated_at,
  n.title as source_news_title,
  n.status as news_status,
  kc.name as kronik_category
FROM kronik_entries ke
INNER JOIN news n ON ke.source_news_id = n.id
INNER JOIN kronik_categories kc ON ke.category_id = kc.id
WHERE ke.is_auto_synced = TRUE
ORDER BY ke.created_at DESC;

-- ============================================
-- OPTIONAL: Cleanup & Reset
-- ============================================

-- Disable all auto-sync (if needed)
-- UPDATE article_categories SET sync_to_kronik = FALSE, kronik_category_id = NULL;

-- Delete all auto-synced kronik entries (CAREFUL!)
-- DELETE FROM kronik_entries WHERE is_auto_synced = TRUE;

-- ============================================
-- MONITORING QUERIES
-- ============================================

-- Count total auto-synced entries
SELECT COUNT(*) as total_auto_synced 
FROM kronik_entries 
WHERE is_auto_synced = TRUE;

-- Count by kronik category
SELECT 
  kc.name as category,
  COUNT(ke.id) as total_entries
FROM kronik_categories kc
LEFT JOIN kronik_entries ke ON kc.id = ke.category_id AND ke.is_auto_synced = TRUE
GROUP BY kc.id
ORDER BY total_entries DESC;

-- Find news without kronik sync (published but not synced yet)
SELECT 
  n.id,
  n.title,
  n.status,
  GROUP_CONCAT(ac.name) as categories
FROM news n
LEFT JOIN news_category_relations ncr ON n.id = ncr.news_id
LEFT JOIN article_categories ac ON ncr.category_id = ac.id
LEFT JOIN kronik_entries ke ON n.id = ke.source_news_id AND ke.is_auto_synced = TRUE
WHERE n.status = 'published' 
  AND ke.id IS NULL
GROUP BY n.id;

-- ============================================
-- MAINTENANCE
-- ============================================

-- Remove orphaned kronik entries (source news deleted)
DELETE ke FROM kronik_entries ke
LEFT JOIN news n ON ke.source_news_id = n.id
WHERE ke.is_auto_synced = TRUE 
  AND ke.source_news_id IS NOT NULL 
  AND n.id IS NULL;

-- Fix inconsistent sync status (published news but draft kronik)
UPDATE kronik_entries ke
INNER JOIN news n ON ke.source_news_id = n.id
SET ke.status = 'published'
WHERE ke.is_auto_synced = TRUE 
  AND n.status = 'published' 
  AND ke.status != 'published';

-- ============================================
-- END OF SETUP SCRIPT
-- ============================================
