-- Migration: Step 4 - Create Demo DPP Users
-- Membuat users untuk setiap seksi DPP sebagai template/demo
-- Date: 2026-03-09
-- PENTING: Ganti password dengan yang aman setelah login pertama!

-- Get section IDs
SET @biak_id = (SELECT id FROM kronik_sections WHERE slug = 'seksi-biak' LIMIT 1);
SET @keluarga_id = (SELECT id FROM kronik_sections WHERE slug = 'seksi-keluarga' LIMIT 1);
SET @rekat_id = (SELECT id FROM kronik_sections WHERE slug = 'seksi-rekat' LIMIT 1);
SET @omk_id = (SELECT id FROM kronik_sections WHERE slug = 'seksi-omk' LIMIT 1);
SET @lansia_id = (SELECT id FROM kronik_sections WHERE slug = 'seksi-lansia' LIMIT 1);
SET @katekese_id = (SELECT id FROM kronik_sections WHERE slug = 'seksi-katekese' LIMIT 1);
SET @liturgi_id = (SELECT id FROM kronik_sections WHERE slug = 'seksi-liturgi' LIMIT 1);
SET @lektor_id = (SELECT id FROM kronik_sections WHERE slug = 'subseksi-lektor' LIMIT 1);
SET @pemazrnur_id = (SELECT id FROM kronik_sections WHERE slug = 'subseksi-pemazrnur' LIMIT 1);
SET @koor_id = (SELECT id FROM kronik_sections WHERE slug = 'subseksi-koor' LIMIT 1);
SET @prodiakon_id = (SELECT id FROM kronik_sections WHERE slug = 'subseksi-prodiakon' LIMIT 1);
SET @dana_id = (SELECT id FROM kronik_sections WHERE slug = 'seksi-dana' LIMIT 1);
SET @saraspras_id = (SELECT id FROM kronik_sections WHERE slug = 'seksi-sarana-prasarana' LIMIT 1);
SET @karsos_id = (SELECT id FROM kronik_sections WHERE slug = 'seksi-karya-sosial' LIMIT 1);

-- Password: "admin123" (sama dengan password users existing)
-- PENTING: Ganti password setelah login pertama!
SET @default_password = '$2b$10$UclgMfc3PxkkmuCl01UQeeMUt21kN47XiXDCedfRidyh0/m0kpqkq';

-- ============================================
-- BIDANG PEMBINAAN
-- ============================================

-- Ketua Seksi BIAK
INSERT IGNORE INTO users (username, email, password_hash, full_name, role, user_category, unit_name, organization_type, organization_id, contact_phone) 
VALUES ('ketua.biak', 'ketua.biak@stpaulusjuanda.org', @default_password, 'Margarita Novi Kristiyani', 'ketua-dpp', 'CATEGORICAL_GROUP', 'Ketua Seksi BIAK', 'dpp', @biak_id, '081234567001');

-- Pengurus Seksi BIAK
INSERT IGNORE INTO users (username, email, password_hash, full_name, role, user_category, unit_name, organization_type, organization_id, contact_phone) 
VALUES ('pengurus.biak', 'pengurus.biak@stpaulusjuanda.org', @default_password, 'Agnes Fransisca K.', 'pengurus-dpp', 'CATEGORICAL_GROUP', 'Pengurus Seksi BIAK', 'dpp', @biak_id, '081234567002');

-- Ketua Seksi Keluarga
INSERT IGNORE INTO users (username, email, password_hash, full_name, role, user_category, unit_name, organization_type, organization_id, contact_phone) 
VALUES ('ketua.keluarga', 'ketua.keluarga@stpaulusjuanda.org', @default_password, 'Tony Soebjono', 'ketua-dpp', 'CATEGORICAL_GROUP', 'Ketua Seksi Keluarga', 'dpp', @keluarga_id, '081234567003');

-- Ketua Seksi REKAT
INSERT IGNORE INTO users (username, email, password_hash, full_name, role, user_category, unit_name, organization_type, organization_id, contact_phone) 
VALUES ('ketua.rekat', 'ketua.rekat@stpaulusjuanda.org', @default_password, 'Theresia Arina Kristyaningsih', 'ketua-dpp', 'CATEGORICAL_GROUP', 'Ketua Seksi REKAT', 'dpp', @rekat_id, '081234567004');

-- Ketua Seksi OMK
INSERT IGNORE INTO users (username, email, password_hash, full_name, role, user_category, unit_name, organization_type, organization_id, contact_phone) 
VALUES ('ketua.omk', 'ketua.omk@stpaulusjuanda.org', @default_password, 'Christofera Marlina Junaedi', 'ketua-dpp', 'CATEGORICAL_GROUP', 'Ketua Seksi OMK', 'dpp', @omk_id, '081234567005');

-- Ketua Seksi Lansia
INSERT IGNORE INTO users (username, email, password_hash, full_name, role, user_category, unit_name, organization_type, organization_id, contact_phone) 
VALUES ('ketua.lansia', 'ketua.lansia@stpaulusjuanda.org', @default_password, 'Yustinus Pramono', 'ketua-dpp', 'CATEGORICAL_GROUP', 'Ketua Seksi Lansia', 'dpp', @lansia_id, '081234567006');

-- Ketua Seksi Katekese
INSERT IGNORE INTO users (username, email, password_hash, full_name, role, user_category, unit_name, organization_type, organization_id, contact_phone) 
VALUES ('ketua.katekese', 'ketua.katekese@stpaulusjuanda.org', @default_password, 'Maria Goretti Endang Lestari', 'ketua-dpp', 'CATEGORICAL_GROUP', 'Ketua Seksi Katekese', 'dpp', @katekese_id, '081234567007');

-- ============================================
-- BIDANG LITURGI
-- ============================================

-- Ketua Bidang Liturgi
INSERT IGNORE INTO users (username, email, password_hash, full_name, role, user_category, unit_name, organization_type, organization_id, contact_phone) 
VALUES ('ketua.liturgi', 'ketua.liturgi@stpaulusjuanda.org', @default_password, 'Maria Theresia Siska Dwi Purwanti', 'ketua-dpp', 'CATEGORICAL_GROUP', 'Ketua Bidang Liturgi', 'dpp', @liturgi_id, '081234567010');

-- Ketua Sub Seksi Lektor
INSERT IGNORE INTO users (username, email, password_hash, full_name, role, user_category, unit_name, organization_type, organization_id, contact_phone) 
VALUES ('ketua.lektor', 'ketua.lektor@stpaulusjuanda.org', @default_password, 'Albertus Hendro Kurniawan', 'ketua-dpp', 'CATEGORICAL_GROUP', 'Ketua Sub Seksi Lektor', 'dpp', @lektor_id, '081234567011');

-- Ketua Sub Seksi Pemazrnur
INSERT IGNORE INTO users (username, email, password_hash, full_name, role, user_category, unit_name, organization_type, organization_id, contact_phone) 
VALUES ('ketua.pemazrnur', 'ketua.pemazrnur@stpaulusjuanda.org', @default_password, 'Bonifasius Suparno', 'ketua-dpp', 'CATEGORICAL_GROUP', 'Ketua Sub Seksi Pemazrnur', 'dpp', @pemazrnur_id, '081234567012');

-- Ketua Sub Seksi Koor
INSERT IGNORE INTO users (username, email, password_hash, full_name, role, user_category, unit_name, organization_type, organization_id, contact_phone) 
VALUES ('ketua.koor', 'ketua.koor@stpaulusjuanda.org', @default_password, 'Yohanes Sumardi', 'ketua-dpp', 'CATEGORICAL_GROUP', 'Ketua Sub Seksi Koor & Dirigen', 'dpp', @koor_id, '081234567013');

-- Ketua Sub Seksi Prodiakon
INSERT IGNORE INTO users (username, email, password_hash, full_name, role, user_category, unit_name, organization_type, organization_id, contact_phone) 
VALUES ('ketua.prodiakon', 'ketua.prodiakon@stpaulusjuanda.org', @default_password, 'Paulus Adi Nurcahyo', 'ketua-dpp', 'CATEGORICAL_GROUP', 'Ketua Sub Seksi Prodiakon', 'dpp', @prodiakon_id, '081234567014');

-- ============================================
-- BIDANG SUMBER
-- ============================================

-- Ketua Seksi Dana
INSERT IGNORE INTO users (username, email, password_hash, full_name, role, user_category, unit_name, organization_type, organization_id, contact_phone) 
VALUES ('ketua.dana', 'ketua.dana@stpaulusjuanda.org', @default_password, 'Gregorius Heru Prayitno', 'ketua-dpp', 'CATEGORICAL_GROUP', 'Ketua Seksi Dana', 'dpp', @dana_id, '081234567020');

-- Ketua Seksi Sarana Prasarana
INSERT IGNORE INTO users (username, email, password_hash, full_name, role, user_category, unit_name, organization_type, organization_id, contact_phone) 
VALUES ('ketua.saraspras', 'ketua.saraspras@stpaulusjuanda.org', @default_password, 'Antonius Sutrisno', 'ketua-dpp', 'CATEGORICAL_GROUP', 'Ketua Seksi Sarana Prasarana', 'dpp', @saraspras_id, '081234567021');

-- ============================================
-- BIDANG KERASULAN
-- ============================================

-- Ketua Seksi Karya Sosial
INSERT IGNORE INTO users (username, email, password_hash, full_name, role, user_category, unit_name, organization_type, organization_id, contact_phone) 
VALUES ('ketua.karsos', 'ketua.karsos@stpaulusjuanda.org', @default_password, 'Vincentius Dwi Hartanto', 'ketua-dpp', 'CATEGORICAL_GROUP', 'Ketua Seksi Karya Sosial', 'dpp', @karsos_id, '081234567030');

-- ============================================
-- Verification
-- ============================================

SELECT 
    u.id,
    u.username,
    u.email,
    u.full_name,
    u.role,
    u.user_category,
    u.unit_name,
    ks.name as section_name,
    ks.slug as section_slug,  
    '✓ CAN WRITE KRONIK' as access_status
FROM users u
JOIN kronik_sections ks ON u.organization_id = ks.id
WHERE u.organization_type = 'dpp' AND u.user_category = 'CATEGORICAL_GROUP'
ORDER BY ks.order_index;

-- Summary
SELECT 
    'Total DPP Sections Created' as metric,
    COUNT(*) as count
FROM kronik_sections WHERE category_id = 2
UNION ALL
SELECT 
    'DPP Users with Kronik Access' as metric,
    COUNT(*) as count
FROM users 
WHERE user_category = 'CATEGORICAL_GROUP' 
  AND organization_type = 'dpp'
  AND organization_id IN (SELECT id FROM kronik_sections WHERE category_id = 2);
