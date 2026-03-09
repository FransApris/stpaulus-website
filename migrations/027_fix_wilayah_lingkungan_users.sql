-- Fix All Wilayah & Lingkungan Users - Batch Update
-- Tanggal: 9 Maret 2026
-- Memperbaiki user Wilayah dan Lingkungan untuk akses kronik

-- ============================================
-- UPDATE USER WILAYAH
-- ============================================

-- Wilayah Simon
UPDATE users 
SET user_category = 'REGION',
    unit_name = 'Ketua Wilayah Simon',
    role = 'ketua-wilayah',
    organization_type = 'wilayah'
WHERE username = 'wilsimon';

-- Wilayah Petrus
UPDATE users 
SET user_category = 'REGION',
    unit_name = 'Ketua Wilayah Petrus',
    role = 'ketua-wilayah',
    organization_type = 'wilayah'
WHERE username = 'wilpetrus';

-- Wilayah VAP (Vincentius a Paulo)
UPDATE users 
SET user_category = 'REGION',
    unit_name = 'Ketua Wilayah Vincentius a Paulo',
    role = 'ketua-wilayah',
    organization_type = 'wilayah'
WHERE username = 'wilvap';

-- Wilayah Bartolomeus
UPDATE users 
SET user_category = 'REGION',
    unit_name = 'Ketua Wilayah Bartolomeus',
    role = 'ketua-wilayah',
    organization_type = 'wilayah'
WHERE username = 'wilbartolomeus';

-- Wilayah Yakobus
UPDATE users 
SET user_category = 'REGION',
    unit_name = 'Ketua Wilayah Yakobus',
    role = 'ketua-wilayah',
    organization_type = 'wilayah'
WHERE username = 'wilyakobus';

-- Wilayah Maria Regina
UPDATE users 
SET user_category = 'REGION',
    unit_name = 'Ketua Wilayah Maria Regina',
    role = 'ketua-wilayah',
    organization_type = 'wilayah'
WHERE username = 'wilmr';

-- Wilayah Theresia
UPDATE users 
SET user_category = 'REGION',
    unit_name = 'Ketua Wilayah Theresia',
    role = 'ketua-wilayah',
    organization_type = 'wilayah'
WHERE username = 'wilteresia';

-- Wilayah Fransiskus Asisi
UPDATE users 
SET user_category = 'REGION',
    unit_name = 'Ketua Wilayah Fransiskus Asisi',
    role = 'ketua-wilayah',
    organization_type = 'wilayah'
WHERE username = 'wilfa';

-- ============================================
-- UPDATE USER LINGKUNGAN - WILAYAH SIMON
-- ============================================

UPDATE users 
SET user_category = 'COMMUNITY',
    unit_name = 'Ketua Lingkungan Simon 1',
    role = 'ketua-lingkungan',
    organization_type = 'lingkungan'
WHERE username = 'simon1';

UPDATE users 
SET user_category = 'COMMUNITY',
    unit_name = 'Ketua Lingkungan Simon 2',
    role = 'ketua-lingkungan',
    organization_type = 'lingkungan'
WHERE username = 'simon2';

UPDATE users 
SET user_category = 'COMMUNITY',
    unit_name = 'Ketua Lingkungan Simon 3',
    role = 'ketua-lingkungan',
    organization_type = 'lingkungan'
WHERE username = 'simon3';

UPDATE users 
SET user_category = 'COMMUNITY',
    unit_name = 'Ketua Lingkungan Simon 4',
    role = 'ketua-lingkungan',
    organization_type = 'lingkungan'
WHERE username = 'simon4';

UPDATE users 
SET user_category = 'COMMUNITY',
    unit_name = 'Ketua Lingkungan Simon 5',
    role = 'ketua-lingkungan',
    organization_type = 'lingkungan'
WHERE username = 'simon5';

UPDATE users 
SET user_category = 'COMMUNITY',
    unit_name = 'Ketua Lingkungan Simon 6',
    role = 'ketua-lingkungan',
    organization_type = 'lingkungan'
WHERE username = 'simon6';

UPDATE users 
SET user_category = 'COMMUNITY',
    unit_name = 'Ketua Lingkungan Simon 7',
    role = 'ketua-lingkungan',
    organization_type = 'lingkungan'
WHERE username = 'simon7';

-- ============================================
-- UPDATE USER LINGKUNGAN - WILAYAH PETRUS
-- ============================================

UPDATE users 
SET user_category = 'COMMUNITY',
    unit_name = 'Ketua Lingkungan Petrus 1',
    role = 'ketua-lingkungan',
    organization_type = 'lingkungan'
WHERE username = 'petrus1';

UPDATE users 
SET user_category = 'COMMUNITY',
    unit_name = 'Ketua Lingkungan Petrus 2',
    role = 'ketua-lingkungan',
    organization_type = 'lingkungan'
WHERE username = 'petrus2';

UPDATE users 
SET user_category = 'COMMUNITY',
    unit_name = 'Ketua Lingkungan Petrus 3',
    role = 'ketua-lingkungan',
    organization_type = 'lingkungan'
WHERE username = 'petrus3';

UPDATE users 
SET user_category = 'COMMUNITY',
    unit_name = 'Ketua Lingkungan Petrus 4',
    role = 'ketua-lingkungan',
    organization_type = 'lingkungan'
WHERE username = 'petrus4';

UPDATE users 
SET user_category = 'COMMUNITY',
    unit_name = 'Ketua Lingkungan Petrus 5',
    role = 'ketua-lingkungan',
    organization_type = 'lingkungan'
WHERE username = 'petrus5';

UPDATE users 
SET user_category = 'COMMUNITY',
    unit_name = 'Ketua Lingkungan Petrus 6',
    role = 'ketua-lingkungan',
    organization_type = 'lingkungan'
WHERE username = 'petrus6';

-- ============================================
-- UPDATE USER LINGKUNGAN - WILAYAH THERESIA
-- ============================================

UPDATE users 
SET user_category = 'COMMUNITY',
    unit_name = 'Ketua Lingkungan Theresia 1',
    role = 'ketua-lingkungan',
    organization_type = 'lingkungan'
WHERE username = 'teresia1';

UPDATE users 
SET user_category = 'COMMUNITY',
    unit_name = 'Ketua Lingkungan Theresia 2',
    role = 'ketua-lingkungan',
    organization_type = 'lingkungan'
WHERE username = 'teresia2';

UPDATE users 
SET user_category = 'COMMUNITY',
    unit_name = 'Ketua Lingkungan Theresia 3',
    role = 'ketua-lingkungan',
    organization_type = 'lingkungan'
WHERE username = 'teresia3';

UPDATE users 
SET user_category = 'COMMUNITY',
    unit_name = 'Ketua Lingkungan Theresia 4',
    role = 'ketua-lingkungan',
    organization_type = 'lingkungan'
WHERE username = 'teresia4';

UPDATE users 
SET user_category = 'COMMUNITY',
    unit_name = 'Ketua Lingkungan Theresia 5',
    role = 'ketua-lingkungan',
    organization_type = 'lingkungan'
WHERE username = 'teresia5';

UPDATE users 
SET user_category = 'COMMUNITY',
    unit_name = 'Ketua Lingkungan Theresia 6',
    role = 'ketua-lingkungan',
    organization_type = 'lingkungan'
WHERE username = 'teresia6';

UPDATE users 
SET user_category = 'COMMUNITY',
    unit_name = 'Ketua Lingkungan Theresia 7',
    role = 'ketua-lingkungan',
    organization_type = 'lingkungan'
WHERE username = 'teresia7';

UPDATE users 
SET user_category = 'COMMUNITY',
    unit_name = 'Ketua Lingkungan Theresia 8',
    role = 'ketua-lingkungan',
    organization_type = 'lingkungan'
WHERE username = 'teresia8';

-- ============================================
-- UPDATE USER LINGKUNGAN - WILAYAH BARTOLOMEUS
-- ============================================

UPDATE users 
SET user_category = 'COMMUNITY',
    unit_name = 'Ketua Lingkungan Bartolomeus 1',
    role = 'ketua-lingkungan',
    organization_type = 'lingkungan'
WHERE username = 'bartolomeus1';

UPDATE users 
SET user_category = 'COMMUNITY',
    unit_name = 'Ketua Lingkungan Bartolomeus 2',
    role = 'ketua-lingkungan',
    organization_type = 'lingkungan'
WHERE username = 'bartolomeus2';

UPDATE users 
SET user_category = 'COMMUNITY',
    unit_name = 'Ketua Lingkungan Bartolomeus 3',
    role = 'ketua-lingkungan',
    organization_type = 'lingkungan'
WHERE username = 'bartolomeus3';

UPDATE users 
SET user_category = 'COMMUNITY',
    unit_name = 'Ketua Lingkungan Bartolomeus 4',
    role = 'ketua-lingkungan',
    organization_type = 'lingkungan'
WHERE username = 'bartolomeus4';

-- ============================================
-- UPDATE USER LINGKUNGAN - WILAYAH YAKOBUS
-- ============================================

UPDATE users 
SET user_category = 'COMMUNITY',
    unit_name = 'Ketua Lingkungan Yakobus 1',
    role = 'ketua-lingkungan',
    organization_type = 'lingkungan'
WHERE username = 'yakobus1';

UPDATE users 
SET user_category = 'COMMUNITY',
    unit_name = 'Ketua Lingkungan Yakobus 2',
    role = 'ketua-lingkungan',
    organization_type = 'lingkungan'
WHERE username = 'yakobus2';

UPDATE users 
SET user_category = 'COMMUNITY',
    unit_name = 'Ketua Lingkungan Yakobus 3',
    role = 'ketua-lingkungan',
    organization_type = 'lingkungan'
WHERE username = 'yakobus3';

-- ============================================
-- UPDATE USER LINGKUNGAN - WILAYAH VAP
-- ============================================

UPDATE users 
SET user_category = 'COMMUNITY',
    unit_name = 'Ketua Lingkungan VAP 1',
    role = 'ketua-lingkungan',
    organization_type = 'lingkungan'
WHERE username = 'vap1';

UPDATE users 
SET user_category = 'COMMUNITY',
    unit_name = 'Ketua Lingkungan VAP 2',
    role = 'ketua-lingkungan',
    organization_type = 'lingkungan'
WHERE username = 'vap2';

UPDATE users 
SET user_category = 'COMMUNITY',
    unit_name = 'Ketua Lingkungan VAP 3',
    role = 'ketua-lingkungan',
    organization_type = 'lingkungan'
WHERE username = 'vap3';

UPDATE users 
SET user_category = 'COMMUNITY',
    unit_name = 'Ketua Lingkungan VAP 4',
    role = 'ketua-lingkungan',
    organization_type = 'lingkungan'
WHERE username = 'vap4';

-- ============================================
-- UPDATE USER LINGKUNGAN - WILAYAH FRANSISKUS ASISI
-- ============================================

UPDATE users 
SET user_category = 'COMMUNITY',
    unit_name = 'Ketua Lingkungan FA 1',
    role = 'ketua-lingkungan',
    organization_type = 'lingkungan'
WHERE username = 'fa1';

UPDATE users 
SET user_category = 'COMMUNITY',
    unit_name = 'Ketua Lingkungan FA 2',
    role = 'ketua-lingkungan',
    organization_type = 'lingkungan'
WHERE username = 'fa2';

UPDATE users 
SET user_category = 'COMMUNITY',
    unit_name = 'Ketua Lingkungan FA 3',
    role = 'ketua-lingkungan',
    organization_type = 'lingkungan'
WHERE username = 'fa3';

-- ============================================
-- UPDATE USER LINGKUNGAN - WILAYAH MARIA REGINA
-- ============================================

UPDATE users 
SET user_category = 'COMMUNITY',
    unit_name = 'Ketua Lingkungan MR 1',
    role = 'ketua-lingkungan',
    organization_type = 'lingkungan'
WHERE username = 'mr1';

UPDATE users 
SET user_category = 'COMMUNITY',
    unit_name = 'Ketua Lingkungan MR 2',
    role = 'ketua-lingkungan',
    organization_type = 'lingkungan'
WHERE username = 'mr2';

UPDATE users 
SET user_category = 'COMMUNITY',
    unit_name = 'Ketua Lingkungan MR 3',
    role = 'ketua-lingkungan',
    organization_type = 'lingkungan'
WHERE username = 'mr3';

-- ============================================
-- VERIFIKASI HASIL
-- ============================================

-- Verifikasi Wilayah
SELECT 
    id, username, email, role, user_category, unit_name, organization_type,
    '✓ WILAYAH FIXED' as status
FROM users 
WHERE username LIKE 'wil%'
ORDER BY username;

-- Verifikasi Lingkungan
SELECT 
    id, username, email, role, user_category, unit_name, organization_type,
    '✓ LINGKUNGAN FIXED' as status
FROM users 
WHERE username IN (
    'simon1', 'simon2', 'simon3', 'simon4', 'simon5', 'simon6', 'simon7',
    'petrus1', 'petrus2', 'petrus3', 'petrus4', 'petrus5', 'petrus6',
    'teresia1', 'teresia2', 'teresia3', 'teresia4', 'teresia5', 'teresia6', 'teresia7', 'teresia8',
    'bartolomeus1', 'bartolomeus2', 'bartolomeus3', 'bartolomeus4',
    'yakobus1', 'yakobus2', 'yakobus3',
    'vap1', 'vap2', 'vap3', 'vap4',
    'fa1', 'fa2', 'fa3',
    'mr1', 'mr2', 'mr3'
)
ORDER BY unit_name;

-- Summary
SELECT 
    'Total Wilayah Users Fixed' as metric,
    COUNT(*) as count
FROM users 
WHERE username LIKE 'wil%' AND user_category = 'REGION'

UNION ALL

SELECT 
    'Total Lingkungan Users Fixed' as metric,
    COUNT(*) as count
FROM users 
WHERE organization_type = 'lingkungan' AND user_category = 'COMMUNITY';
