-- Migration: Step 2 - Check Existing Users
-- Cek users yang ada di DPP untuk mapping ke sections
-- Date: 2026-03-09

-- Cek users yang ada di tabel users
SELECT 
    id,
    name,
    email,
    role,
    user_category,
    unit_name,
    organization_id
FROM users
WHERE name LIKE '%Margarita%' 
   OR name LIKE '%Agnes%'
   OR name LIKE '%Theresia Arina%'
   OR name LIKE '%Brigitta Puji%'
   OR name LIKE '%Christofera%'
   OR name LIKE '%Yohanes Dwi%'
   OR name LIKE '%Yustinus Pramono%'
   OR name LIKE '%Hendrikus Marsudi%'
   OR name LIKE '%Maria Goretti Endang%'
   OR name LIKE '%Theresia Tri Wahyu%'
ORDER BY name;

-- Cek semua section IDs yang baru dibuat
SELECT 
    id,
    name,
    slug
FROM kronik_sections
WHERE category_id = 2
ORDER BY order_index;
