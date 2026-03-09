-- Migration: Step 3 - Link DPP Members to Sections
-- Update users dengan organization_id dan permissions
-- Date: 2026-03-09

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
SET @kesehatan_id = (SELECT id FROM kronik_sections WHERE slug = 'seksi-kesehatan' LIMIT 1);
SET @kominfo_id = (SELECT id FROM kronik_sections WHERE slug = 'seksi-komunikasi' LIMIT 1);
SET @humas_id = (SELECT id FROM kronik_sections WHERE slug = 'seksi-humas' LIMIT 1);
SET @dokumentasi_id = (SELECT id FROM kronik_sections WHERE slug = 'seksi-dokumentasi' LIMIT 1);

-- Update berdasarkan email (lebih akurat dari nama)
-- Jika email belum ada, akan dilewati

-- BIDANG PEMBINAAN

-- Seksi BIAK
UPDATE users 
SET user_category = 'CATEGORICAL_GROUP',
    unit_name = 'Ketua Seksi BIAK',
    role = 'ketua-dpp',
    organization_type = 'dpp',
    organization_id = @biak_id
WHERE email LIKE '%biak%' AND email LIKE '%ketua%'
LIMIT 1;

-- Seksi REKAT
UPDATE users 
SET user_category = 'CATEGORICAL_GROUP',
    unit_name = 'Ketua Seksi REKAT',
    role = 'ketua-dpp',
    organization_type = 'dpp',
    organization_id = @rekat_id
WHERE email LIKE '%rekat%' AND email LIKE '%ketua%'
LIMIT 1;

-- Seksi OMK
UPDATE users 
SET user_category = 'CATEGORICAL_GROUP',
    unit_name = 'Ketua Seksi OMK',
    role = 'ketua-dpp',
    organization_type = 'dpp',
    organization_id = @omk_id
WHERE email LIKE '%omk%' AND email LIKE '%ketua%'
LIMIT 1;

-- Seksi Lansia
UPDATE users 
SET user_category = 'CATEGORICAL_GROUP',
    unit_name = 'Ketua Seksi Lansia',
    role = 'ketua-dpp',
    organization_type = 'dpp',
    organization_id = @lansia_id
WHERE email LIKE '%lansia%' AND email LIKE '%ketua%'
LIMIT 1;

-- Seksi Katekese
UPDATE users 
SET user_category = 'CATEGORICAL_GROUP',
    unit_name = 'Ketua Seksi Katekese',
    role = 'ketua-dpp',
    organization_type = 'dpp',
    organization_id = @katekese_id
WHERE email LIKE '%katekese%' AND email LIKE '%ketua%'
LIMIT 1;

-- Seksi Keluarga
UPDATE users 
SET user_category = 'CATEGORICAL_GROUP',
    unit_name = 'Ketua Seksi Keluarga',
    role = 'ketua-dpp',
    organization_type = 'dpp',
    organization_id = @keluarga_id
WHERE email LIKE '%keluarga%' AND email LIKE '%ketua%'
LIMIT 1;

-- BIDANG LITURGI

-- Seksi Liturgi
UPDATE users 
SET user_category = 'CATEGORICAL_GROUP',
    unit_name = 'Ketua Bidang Liturgi',
    role = 'ketua-dpp',
    organization_type = 'dpp',
    organization_id = @liturgi_id
WHERE email LIKE '%liturgi%' AND email LIKE '%ketua%'
LIMIT 1;

-- Sub Seksi Lektor
UPDATE users 
SET user_category = 'CATEGORICAL_GROUP',
    unit_name = 'Ketua Sub Seksi Lektor',
    role = 'ketua-dpp',
    organization_type = 'dpp',
    organization_id = @lektor_id
WHERE email LIKE '%lektor%' AND email LIKE '%ketua%'
LIMIT 1;

-- Sub Seksi Pemazrnur
UPDATE users 
SET user_category = 'CATEGORICAL_GROUP',
    unit_name = 'Ketua Sub Seksi Pemazrnur',
    role = 'ketua-dpp',
    organization_type = 'dpp',
    organization_id = @pemazrnur_id
WHERE email LIKE '%pemazrnur%' AND email LIKE '%ketua%'
LIMIT 1;

-- Sub Seksi Koor
UPDATE users 
SET user_category = 'CATEGORICAL_GROUP',
    unit_name = 'Ketua Sub Seksi Koor',
    role = 'ketua-dpp',
    organization_type = 'dpp',
    organization_id = @koor_id
WHERE email LIKE '%koor%' AND email LIKE '%ketua%'
LIMIT 1;

-- Sub Seksi Prodiakon
UPDATE users 
SET user_category = 'CATEGORICAL_GROUP',
    unit_name = 'Ketua Sub Seksi Prodiakon',
    role = 'ketua-dpp',
    organization_type = 'dpp',
    organization_id = @prodiakon_id
WHERE email LIKE '%prodiakon%' AND email LIKE '%ketua%'
LIMIT 1;

-- BIDANG SUMBER

-- Seksi Dana
UPDATE users 
SET user_category = 'CATEGORICAL_GROUP',
    unit_name = 'Ketua Seksi Dana',
    role = 'ketua-dpp',
    organization_type = 'dpp',
    organization_id = @dana_id
WHERE email LIKE '%dana%' AND email LIKE '%ketua%'
LIMIT 1;

-- Seksi Sarana Prasarana
UPDATE users 
SET user_category = 'CATEGORICAL_GROUP',
    unit_name = 'Ketua Seksi Sarana Prasarana',
    role = 'ketua-dpp',
    organization_type = 'dpp',
    organization_id = @saraspras_id
WHERE email LIKE '%sarana%' AND email LIKE '%ketua%'
LIMIT 1;

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
    u.organization_type,
    u.organization_id,
    ks.name as section_name,
    ks.slug as section_slug,
    CASE 
        WHEN u.user_category = 'CATEGORICAL_GROUP' AND u.organization_id IS NOT NULL 
        THEN '✓ CAN WRITE KRONIK'
        ELSE '✗ NO ACCESS'
    END as kronik_access
FROM users u
LEFT JOIN kronik_sections ks ON u.organization_id = ks.id
WHERE u.organization_type = 'dpp' 
   OR u.organization_id IN (SELECT id FROM kronik_sections WHERE category_id = 2)
   OR u.role LIKE '%dpp%'
ORDER BY u.organization_id, u.role DESC;

-- Summary
SELECT 
    COUNT(*) as total_dpp_users_with_kronik_access
FROM users 
WHERE user_category = 'CATEGORICAL_GROUP' 
  AND organization_type = 'dpp'
  AND organization_id IN (SELECT id FROM kronik_sections WHERE category_id = 2);
