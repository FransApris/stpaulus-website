-- ============================================
-- DIAGNOSE: News-Kronik Sync Issue
-- ============================================
-- Jalankan query ini untuk identifikasi masalah

-- ============================================
-- 1. CEK MIGRATION: Apakah field sync sudah ada?
-- ============================================
SHOW COLUMNS FROM kronik_entries LIKE '%source_news%';
-- Expected: source_news_id, is_auto_synced, sync_updated_at

SHOW COLUMNS FROM article_categories LIKE '%sync%';
-- Expected: sync_to_kronik, kronik_category_id

-- ============================================
-- 2. CEK BERITA: Apakah berita "peristiwa parok" ada?
-- ============================================
SELECT 
  n.id,
  n.title,
  n.slug,
  n.status,
  n.published_at,
  n.created_at,
  GROUP_CONCAT(ac.name) as categories,
  GROUP_CONCAT(ac.id) as category_ids
FROM news n
LEFT JOIN news_category_relations ncr ON n.id = ncr.news_id
LEFT JOIN article_categories ac ON ncr.category_id = ac.id
WHERE n.title LIKE '%peristiwa%'
  OR n.title LIKE '%parok%'
GROUP BY n.id
ORDER BY n.id DESC;

-- ============================================
-- 3. CEK KONFIGURASI: Kategori mana yang di-enable sync?
-- ============================================
SELECT 
  ac.id,
  ac.name,
  ac.slug,
  ac.sync_to_kronik,
  ac.kronik_category_id,
  kc.name as target_kronik_category
FROM article_categories ac
LEFT JOIN kronik_categories kc ON ac.kronik_category_id = kc.id
ORDER BY ac.sync_to_kronik DESC, ac.name;

-- ============================================
-- 4. CEK KRONIK: Apakah sudah ada entry auto-synced?
-- ============================================
SELECT 
  ke.id,
  ke.what_title,
  ke.source_news_id,
  ke.is_auto_synced,
  ke.created_at,
  n.title as source_news_title
FROM kronik_entries ke
LEFT JOIN news n ON ke.source_news_id = n.id
WHERE ke.is_auto_synced = TRUE
ORDER BY ke.id DESC
LIMIT 10;

-- ============================================
-- 5. DIAGNOSE PROBLEM
-- ============================================
-- Check berita yang SEHARUSNYA di-sync tapi belum
SELECT 
  n.id as news_id,
  n.title,
  n.status,
  n.published_at,
  GROUP_CONCAT(ac.name) as categories,
  GROUP_CONCAT(ac.sync_to_kronik) as sync_flags,
  GROUP_CONCAT(ac.kronik_category_id) as target_kronik_cats,
  ke.id as kronik_id,
  CASE 
    WHEN n.status != 'published' THEN '❌ Status bukan Published'
    WHEN MAX(ac.sync_to_kronik) = 0 THEN '❌ Kategori tidak di-enable sync'
    WHEN MAX(ac.kronik_category_id) IS NULL THEN '❌ kronik_category_id tidak di-set'
    WHEN ke.id IS NULL THEN '❌ Belum ter-sync (cek server log)'
    ELSE '✅ Sudah ter-sync'
  END as diagnosis
FROM news n
LEFT JOIN news_category_relations ncr ON n.id = ncr.news_id
LEFT JOIN article_categories ac ON ncr.category_id = ac.id
LEFT JOIN kronik_entries ke ON n.id = ke.source_news_id AND ke.is_auto_synced = TRUE
WHERE n.title LIKE '%peristiwa%' OR n.title LIKE '%parok%'
GROUP BY n.id
ORDER BY n.id DESC;

-- ============================================
-- 6. SOLUSI QUICK FIX
-- ============================================
-- Setelah tahu masalahnya, uncomment query yang sesuai:

-- Masalah: Migration belum dijalankan
-- SOLUSI: Jalankan migrations/021_add_news_kronik_sync.sql dulu!

-- Masalah: Kategori belum di-enable
-- SOLUSI: Enable kategori (ganti ID sesuai hasil query #2)
-- UPDATE article_categories 
-- SET sync_to_kronik = TRUE, kronik_category_id = 1
-- WHERE id = [ID_KATEGORI_DARI_QUERY_2];

-- Masalah: Status bukan published
-- SOLUSI: Publish berita (ganti ID sesuai hasil query #2)
-- UPDATE news SET status = 'published', published_at = NOW() WHERE id = [ID_NEWS];

-- Masalah: Server belum di-restart
-- SOLUSI: Restart npm run dev

-- ============================================
-- 7. MANUAL SYNC (jika auto-sync gagal)
-- ============================================
-- Jika semua sudah benar tapi tetap tidak sync, manual sync:
-- (GANTI [NEWS_ID] dengan ID dari query #2)
/*
INSERT INTO kronik_entries (
  category_id,
  what_title,
  what_description,
  when_date,
  featured_image,
  status,
  author_id,
  source_news_id,
  is_auto_synced,
  sync_updated_at,
  published_at,
  created_at,
  updated_at
)
SELECT 
  1 as category_id, -- 1 = Umum Paroki (sesuaikan!)
  n.title,
  n.content,
  COALESCE(n.published_at, n.created_at),
  n.image,
  'published',
  1 as author_id, -- 1 = Admin
  n.id,
  TRUE,
  NOW(),
  n.published_at,
  NOW(),
  NOW()
FROM news n
WHERE n.id = [NEWS_ID];
*/
