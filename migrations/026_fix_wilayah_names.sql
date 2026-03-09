-- Fix wilayah name typos to match DPP data
-- Run: mysql -u root -p stpaulus_cms_db < fix-wilayah-names.sql

-- Fix: Fransikus -> Fransiskus
UPDATE wilayah
SET
    nama = 'Fransiskus Asisi'
WHERE
    nama = 'Fransikus Asisi';

-- Fix: Teresia -> Theresia
UPDATE wilayah SET nama = 'Theresia' WHERE nama = 'Teresia';

-- Fix: Vincentius A Paulo -> Vincentius a Paulo (standardize case)
UPDATE wilayah
SET
    nama = 'Vincentius a Paulo'
WHERE
    nama = 'Vincentius A Paulo';

-- Verify changes
SELECT id, nama, is_visible FROM wilayah ORDER BY nama;