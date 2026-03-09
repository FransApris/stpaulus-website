-- Migration: Add DPP Sections to Kronik System
-- Menambahkan seksi-seksi DPP agar bisa menulis kronik
-- Date: 2026-03-09

-- ============================================
-- 1. Tambah Seksi-seksi DPP ke kronik_sections
-- ============================================

-- Bidang Pembinaan
INSERT IGNORE INTO kronik_sections (category_id, name, slug, order_index, is_active, description) VALUES
(2, 'Seksi Keluarga', 'seksi-keluarga', 1, TRUE, 'Pembinaan kehidupan berkeluarga Katolik'),
(2, 'Seksi BIAK (Bina Iman Anak & Keluarga)', 'seksi-biak', 2, TRUE, 'Pembinaan iman anak dan keluarga'),
(2, 'Seksi REKAT (Remaja Katolik)', 'seksi-rekat', 3, TRUE, 'Pembinaan remaja Katolik'),
(2, 'Seksi OMK (Orang Muda Katolik)', 'seksi-omk', 4, TRUE, 'Pembinaan orang muda Katolik'),
(2, 'Seksi Lansia', 'seksi-lansia', 5, TRUE, 'Pembinaan umat lanjut usia'),
(2, 'Seksi Katekese', 'seksi-katekese', 6, TRUE, 'Pendidikan dan pengajaran iman');

-- Bidang Liturgi
INSERT IGNORE INTO kronik_sections (category_id, name, slug, order_index, is_active, description) VALUES
(2, 'Seksi Liturgi', 'seksi-liturgi', 10, TRUE, 'Koordinasi dan pembinaan liturgi'),
(2, 'Sub Seksi Lektor', 'subseksi-lektor', 11, TRUE, 'Pelayanan pewartaan sabda'),
(2, 'Sub Seksi Pemazrnur', 'subseksi-pemazrnur', 12, TRUE, 'Pelayanan nyanyian mazmur'),
(2, 'Sub Seksi Koor & Dirigen', 'subseksi-koor', 13, TRUE, 'Pelayanan paduan suara'),
(2, 'Sub Seksi Prodiakon', 'subseksi-prodiakon', 14, TRUE, 'Pelayanan ibadat sabda dan komuni');

-- Bidang Sumber
INSERT IGNORE INTO kronik_sections (category_id, name, slug, order_index, is_active, description) VALUES
(2, 'Seksi Dana', 'seksi-dana', 20, TRUE, 'Pengelolaan keuangan paroki'),
(2, 'Seksi Sarana Prasarana', 'seksi-sarana-prasarana', 21, TRUE, 'Pengelolaan fasilitas dan infrastruktur');

-- Bidang Kerasulan Khusus
INSERT IGNORE INTO kronik_sections (category_id, name, slug, order_index, is_active, description) VALUES
(2, 'Seksi Karya Sosial', 'seksi-karya-sosial', 30, TRUE, 'Pelayanan sosial kepada masyarakat'),
(2, 'Seksi Kesehatan', 'seksi-kesehatan', 31, TRUE, 'Pelayanan kesehatan umat');

-- Bidang Kerasulan Umum
INSERT IGNORE INTO kronik_sections (category_id, name, slug, order_index, is_active, description) VALUES
(2, 'Seksi Komunikasi & Informasi', 'seksi-komunikasi', 40, TRUE, 'Komunikasi dan media paroki'),
(2, 'Seksi Humas', 'seksi-humas', 41, TRUE, 'Hubungan masyarakat dan eksternal'),
(2, 'Seksi Dokumentasi', 'seksi-dokumentasi', 42, TRUE, 'Dokumentasi kegiatan paroki');

-- ============================================
-- 2. Update Users: Link ke Organization & Set Permissions
-- ============================================

-- Get section IDs (menggunakan variables)
SET @biak_id = (SELECT id FROM kronik_sections WHERE slug = 'seksi-biak');
SET @keluarga_id = (SELECT id FROM kronik_sections WHERE slug = 'seksi-keluarga');
SET @rekat_id = (SELECT id FROM kronik_sections WHERE slug = 'seksi-rekat');
SET @omk_id = (SELECT id FROM kronik_sections WHERE slug = 'seksi-omk');
SET @lansia_id = (SELECT id FROM kronik_sections WHERE slug = 'seksi-lansia');
SET @katekese_id = (SELECT id FROM kronik_sections WHERE slug = 'seksi-katekese');
SET @liturgi_id = (SELECT id FROM kronik_sections WHERE slug = 'seksi-liturgi');
SET @lektor_id = (SELECT id FROM kronik_sections WHERE slug = 'subseksi-lektor');
SET @pemazrnur_id = (SELECT id FROM kronik_sections WHERE slug = 'subseksi-pemazrnur');
SET @koor_id = (SELECT id FROM kronik_sections WHERE slug = 'subseksi-koor');
SET @prodiakon_id = (SELECT id FROM kronik_sections WHERE slug = 'subseksi-prodiakon');
SET @dana_id = (SELECT id FROM kronik_sections WHERE slug = 'seksi-dana');
SET @saraspras_id = (SELECT id FROM kronik_sections WHERE slug = 'seksi-sarana-prasarana');
SET @karsos_id = (SELECT id FROM kronik_sections WHERE slug = 'seksi-karya-sosial');
SET @kesehatan_id = (SELECT id FROM kronik_sections WHERE slug = 'seksi-kesehatan');
SET @kominfo_id = (SELECT id FROM kronik_sections WHERE slug = 'seksi-komunikasi');
SET @humas_id = (SELECT id FROM kronik_sections WHERE slug = 'seksi-humas');
SET @dokumentasi_id = (SELECT id FROM kronik_sections WHERE slug = 'seksi-dokumentasi');

-- ============================================
-- BIDANG PEMBINAAN
-- ============================================

-- Seksi Keluarga (Pasutri / Couples)
UPDATE users 
SET user_category = 'CATEGORICAL_GROUP',
    unit_name = 'Pengurus Seksi Keluarga',
    role = COALESCE(role, 'pengurus-dpp'),
    organization_id = @keluarga_id
WHERE name IN (
    'Aloysius Tony Soebjono',
    'Maria Roesdiana Siharianti',
    'Nikolas Ardianto Kusumawardhana',
    'Chatarina LaboureSri Indrawati Salim'
);

-- Seksi BIAK
UPDATE users 
SET user_category = 'CATEGORICAL_GROUP',
    unit_name = 'Ketua Seksi BIAK',
    role = 'ketua-dpp',
    organization_id = @biak_id
WHERE name LIKE '%Margarita Novi Kristiyani%';

UPDATE users 
SET user_category = 'CATEGORICAL_GROUP',
    unit_name = 'Pengurus Seksi BIAK',
    role = COALESCE(role, 'pengurus-dpp'),
    organization_id = @biak_id
WHERE name LIKE '%Agnes Fransisca%';

-- Seksi REKAT
UPDATE users 
SET user_category = 'CATEGORICAL_GROUP',
    unit_name = 'Ketua Seksi REKAT',
    role = 'ketua-dpp',
    organization_id = @rekat_id
WHERE name LIKE '%Theresia Arina Kristyaningsih%';

UPDATE users 
SET user_category = 'CATEGORICAL_GROUP',
    unit_name = 'Pengurus Seksi REKAT',
    role = COALESCE(role, 'pengurus-dpp'),
    organization_id = @rekat_id
WHERE name LIKE '%Brigitta Puji Ardhana Reswari%';

-- Seksi OMK
UPDATE users 
SET user_category = 'CATEGORICAL_GROUP',
    unit_name = 'Ketua Seksi OMK',
    role = 'ketua-dpp',
    organization_id = @omk_id
WHERE name LIKE '%Christofera Marlina Junaedi%';

UPDATE users 
SET user_category = 'CATEGORICAL_GROUP',
    unit_name = 'Pengurus Seksi OMK',
    role = COALESCE(role, 'pengurus-dpp'),
    organization_id = @omk_id
WHERE name LIKE '%Yohanes Dwi Yunianto%';

-- Seksi Lansia
UPDATE users 
SET user_category = 'CATEGORICAL_GROUP',
    unit_name = 'Ketua Seksi Lansia',
    role = 'ketua-dpp',
    organization_id = @lansia_id
WHERE name LIKE '%Yustinus Pramono%';

UPDATE users 
SET user_category = 'CATEGORICAL_GROUP',
    unit_name = 'Pengurus Seksi Lansia',
    role = COALESCE(role, 'pengurus-dpp'),
    organization_id = @lansia_id
WHERE name LIKE '%Hendrikus Marsudi%';

-- Seksi Katekese
UPDATE users 
SET user_category = 'CATEGORICAL_GROUP',
    unit_name = 'Ketua Seksi Katekese',
    role = 'ketua-dpp',
    organization_id = @katekese_id
WHERE name LIKE '%Maria Goretti Endang Lestari%';

UPDATE users 
SET user_category = 'CATEGORICAL_GROUP',
    unit_name = 'Pengurus Seksi Katekese',
    role = COALESCE(role, 'pengurus-dpp'),
    organization_id = @katekese_id
WHERE name LIKE '%Theresia Tri Wahyuningsih%';

-- ============================================
-- BIDANG LITURGI
-- ============================================

-- Ketua Bidang Liturgi
UPDATE users 
SET user_category = 'CATEGORICAL_GROUP',
    unit_name = 'Ketua Bidang Liturgi',
    role = 'ketua-dpp',
    organization_id = @liturgi_id
WHERE name LIKE '%Maria Theresia Siska Dwi Purwanti%';

-- Sekretaris Bidang Liturgi
UPDATE users 
SET user_category = 'CATEGORICAL_GROUP',
    unit_name = 'Sekretaris Bidang Liturgi',
    role = 'pengurus-dpp',
    organization_id = @liturgi_id
WHERE name LIKE '%Kristiana Sri Mulijanti%';

-- Sub Seksi Lektor
UPDATE users 
SET user_category = 'CATEGORICAL_GROUP',
    unit_name = CASE 
        WHEN name LIKE '%Albertus Hendro%' THEN 'Ketua Sub Seksi Lektor'
        ELSE 'Pengurus Sub Seksi Lektor'
    END,
    role = CASE 
        WHEN name LIKE '%Albertus Hendro%' THEN 'ketua-dpp'
        ELSE COALESCE(role, 'pengurus-dpp')
    END,
    organization_id = @lektor_id
WHERE name IN (
    'Albertus Hendro Kurniawan',
    'Natalia Triti Resti Andayani'
);

-- Sub Seksi Pemazrnur
UPDATE users 
SET user_category = 'CATEGORICAL_GROUP',
    unit_name = CASE 
        WHEN name LIKE '%Bonifasius Suparno%' THEN 'Ketua Sub Seksi Pemazrnur'
        ELSE 'Pengurus Sub Seksi Pemazrnur'
    END,
    role = CASE 
        WHEN name LIKE '%Bonifasius Suparno%' THEN 'ketua-dpp'
        ELSE COALESCE(role, 'pengurus-dpp')
    END,
    organization_id = @pemazrnur_id
WHERE name IN (
    'Bonifasius Suparno',
    'Maria Martina Putri Astuti'
);

-- Sub Seksi Koor & Dirigen
UPDATE users 
SET user_category = 'CATEGORICAL_GROUP',
    unit_name = CASE 
        WHEN name LIKE '%Yohanes Sumardi%' THEN 'Ketua Sub Seksi Koor'
        ELSE 'Pengurus Sub Seksi Koor'
    END,
    role = CASE 
        WHEN name LIKE '%Yohanes Sumardi%' THEN 'ketua-dpp'
        ELSE COALESCE(role, 'pengurus-dpp')
    END,
    organization_id = @koor_id
WHERE name IN (
    'Yohanes Sumardi',
    'Theresia Iin Fatmawati'
);

-- Sub Seksi Prodiakon
UPDATE users 
SET user_category = 'CATEGORICAL_GROUP',
    unit_name = CASE 
        WHEN name LIKE '%Paulus Adi Nurcahyo%' THEN 'Ketua Sub Seksi Prodiakon'
        ELSE 'Pengurus Sub Seksi Prodiakon'
    END,
    role = CASE 
        WHEN name LIKE '%Paulus Adi Nurcahyo%' THEN 'ketua-dpp'
        ELSE COALESCE(role, 'pengurus-dpp')
    END,
    organization_id = @prodiakon_id
WHERE name IN (
    'Paulus Adi Nurcahyo',
    'Maria Goretti Chatarina Supraptini'
);

-- ============================================
-- BIDANG SUMBER
-- ============================================

-- Seksi Dana
UPDATE users 
SET user_category = 'CATEGORICAL_GROUP',
    unit_name = CASE 
        WHEN name LIKE '%Gregorius Heru%' THEN 'Ketua Seksi Dana'
        ELSE 'Pengurus Seksi Dana'
    END,
    role = CASE 
        WHEN name LIKE '%Gregorius Heru%' THEN 'ketua-dpp'
        ELSE COALESCE(role, 'pengurus-dpp')
    END,
    organization_id = @dana_id
WHERE name LIKE '%Gregorius Heru%' OR name LIKE '%Fransiska Xaveria%';

-- Seksi Sarana Prasarana
UPDATE users 
SET user_category = 'CATEGORICAL_GROUP',
    unit_name = CASE 
        WHEN name LIKE '%Antonius Sutrisno%' THEN 'Ketua Seksi Sarana Prasarana'
        ELSE 'Pengurus Seksi Sarana Prasarana'
    END,
    role = CASE 
        WHEN name LIKE '%Antonius Sutrisno%' THEN 'ketua-dpp'
        ELSE COALESCE(role, 'pengurus-dpp')
    END,
    organization_id = @saraspras_id
WHERE name LIKE '%Antonius Sutrisno%' OR name LIKE '%Yohanes Tri Wahyudi%';

-- ============================================
-- BIDANG KERASULAN KHUSUS & UMUM
-- ============================================

-- Seksi Karya Sosial
UPDATE users 
SET user_category = 'CATEGORICAL_GROUP',
    unit_name = 'Pengurus Seksi Karya Sosial',
    role = COALESCE(role, 'pengurus-dpp'),
    organization_id = @karsos_id
WHERE name LIKE '%Karya Sosial%' OR name LIKE '%Vincentius%';

-- Seksi Komunikasi & Informasi
UPDATE users 
SET user_category = 'CATEGORICAL_GROUP',
    unit_name = 'Pengurus Seksi Komunikasi',
    role = COALESCE(role, 'pengurus-dpp'),
    organization_id = @kominfo_id
WHERE name LIKE '%Komunikasi%' OR name LIKE '%Media%';

-- ============================================
-- 3. Verification Query
-- ============================================

-- View all DPP members with their kronik access
SELECT 
    u.id,
    u.name,
    u.email,
    u.role,
    u.user_category,
    u.unit_name,
    u.organization_id,
    ks.name as section_name,
    ks.slug as section_slug,
    kc.name as category_name,
    CASE 
        WHEN u.user_category = 'CATEGORICAL_GROUP' AND u.organization_id IS NOT NULL 
        THEN 'CAN WRITE KRONIK'
        ELSE 'NO KRONIK ACCESS'
    END as kronik_access
FROM users u
LEFT JOIN kronik_sections ks ON u.organization_id = ks.id
LEFT JOIN kronik_categories kc ON ks.category_id = kc.id
WHERE u.user_category = 'CATEGORICAL_GROUP' 
   OR u.role LIKE '%dpp%'
ORDER BY u.organization_id, u.role DESC, u.name;

-- Summary statistics
SELECT 
    'Total DPP Sections' as metric,
    COUNT(*) as count
FROM kronik_sections 
WHERE category_id = 2

UNION ALL

SELECT 
    'DPP Members with Kronik Access' as metric,
    COUNT(*) as count
FROM users 
WHERE user_category = 'CATEGORICAL_GROUP' 
  AND organization_id IN (SELECT id FROM kronik_sections WHERE category_id = 2);
