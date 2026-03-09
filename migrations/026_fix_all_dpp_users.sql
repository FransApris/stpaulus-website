-- Fix All DPP Users - Batch Update
-- Tanggal: 9 Maret 2026
-- Memperbaiki semua user DPP yang user_category = 'Dewan Pastoral Paroki'

-- Update user seksi Keluarga
UPDATE users 
SET user_category = 'CATEGORICAL_GROUP',
    unit_name = 'Ketua Seksi Keluarga',
    role = 'ketua-dpp',
    organization_type = 'dpp',
    organization_id = 14
WHERE username = 'keluarga';

-- Update user seksi REKAT
UPDATE users 
SET user_category = 'CATEGORICAL_GROUP',
    unit_name = 'Ketua Seksi REKAT',
    role = 'ketua-dpp',
    organization_type = 'dpp',
    organization_id = 16
WHERE username = 'rekat';

-- Update user seksi OMK
UPDATE users 
SET user_category = 'CATEGORICAL_GROUP',
    unit_name = 'Ketua Seksi OMK',
    role = 'ketua-dpp',
    organization_type = 'dpp',
    organization_id = 17
WHERE username = 'omk';

-- Update user seksi Lansia
UPDATE users 
SET user_category = 'CATEGORICAL_GROUP',
    unit_name = 'Ketua Seksi Lansia',
    role = 'ketua-dpp',
    organization_type = 'dpp',
    organization_id = 18
WHERE username = 'lansia';

-- Update user seksi Katekese
UPDATE users 
SET user_category = 'CATEGORICAL_GROUP',
    unit_name = 'Ketua Seksi Katekese',
    role = 'ketua-dpp',
    organization_type = 'dpp',
    organization_id = 19
WHERE username = 'katekese';

-- Update user seksi Liturgi
UPDATE users 
SET user_category = 'CATEGORICAL_GROUP',
    unit_name = 'Ketua Seksi Liturgi',
    role = 'ketua-dpp',
    organization_type = 'dpp',
    organization_id = 20
WHERE username = 'liturgi';

-- Update user seksi Komunikasi (komsos)
UPDATE users 
SET user_category = 'CATEGORICAL_GROUP',
    unit_name = 'Ketua Seksi Komunikasi',
    role = 'ketua-dpp',
    organization_type = 'dpp',
    organization_id = 29
WHERE username = 'komsos';

-- Update user seksi Pendidikan
UPDATE users 
SET user_category = 'CATEGORICAL_GROUP',
    unit_name = 'Ketua Seksi Pendidikan',
    role = 'ketua-dpp',
    organization_type = 'dpp',
    organization_id = 19
WHERE username = 'pendidikan';

-- Update user Karya Misioner (karyamisioner)
UPDATE users 
SET user_category = 'CATEGORICAL_GROUP',
    unit_name = 'Ketua Seksi Karya Sosial',
    role = 'ketua-dpp',
    organization_type = 'dpp',
    organization_id = 27
WHERE username = 'karyamisioner';

-- Update user Phubb (Pelayanan Hukum & Bimbingan Batin?)
UPDATE users 
SET user_category = 'CATEGORICAL_GROUP',
    unit_name = 'Pengurus DPP',
    role = 'pengurus-dpp',
    organization_type = 'dpp',
    organization_id = 1
WHERE username = 'phubb';

-- Update user PSE (Pastoral Sosial Ekonomi?)
UPDATE users 
SET user_category = 'CATEGORICAL_GROUP',
    unit_name = 'Pengurus DPP',
    role = 'pengurus-dpp',
    organization_type = 'dpp',
    organization_id = 1
WHERE username = 'pse';

-- Update user Kitab Suci
UPDATE users 
SET user_category = 'CATEGORICAL_GROUP',
    unit_name = 'Pengurus Seksi Katekese',
    role = 'pengurus-dpp',
    organization_type = 'dpp',
    organization_id = 19
WHERE username = 'kitabsuci';

-- Verifikasi hasil
SELECT 
    id,
    username,
    email,
    role,
    user_category,
    unit_name,
    organization_type,
    organization_id,
    '✓ FIXED' as status
FROM users 
WHERE username IN (
    'keluarga', 'biak', 'rekat', 'omk', 'lansia', 'katekese', 
    'liturgi', 'komsos', 'pendidikan', 'karyamisioner', 'phubb', 
    'pse', 'kitabsuci'
)
ORDER BY organization_id, username;
