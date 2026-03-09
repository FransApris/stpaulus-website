-- Migration: Step 1 - Add DPP Sections Only
-- Menambahkan seksi-seksi DPP ke kronik_sections
-- Date: 2026-03-09

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

-- Verification
SELECT 
    id, 
    name, 
    slug, 
    order_index,
    description
FROM kronik_sections 
WHERE category_id = 2
ORDER BY order_index;
