-- Migration: Add kronik sections for Wilayah and Lingkungan
-- Paroki St. Paulus - 8 Wilayah, masing-masing dengan lingkungan-lingkungannya

-- ============================================================
-- WILAYAH SECTIONS (category: wilayah)
-- ============================================================
INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active)
SELECT id, 'Wilayah Petrus', 'wilayah-petrus', 'Kronik kegiatan Wilayah Petrus', 1, TRUE
FROM kronik_categories WHERE slug = 'wilayah';

INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active)
SELECT id, 'Wilayah Paulus', 'wilayah-paulus', 'Kronik kegiatan Wilayah Paulus', 2, TRUE
FROM kronik_categories WHERE slug = 'wilayah';

INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active)
SELECT id, 'Wilayah Yeseph', 'wilayah-yeseph', 'Kronik kegiatan Wilayah Yeseph', 3, TRUE
FROM kronik_categories WHERE slug = 'wilayah';

INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active)
SELECT id, 'Wilayah Bartholomeus', 'wilayah-bartholomeus', 'Kronik kegiatan Wilayah Bartholomeus', 4, TRUE
FROM kronik_categories WHERE slug = 'wilayah';

INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active)
SELECT id, 'Wilayah Yakobus', 'wilayah-yakobus', 'Kronik kegiatan Wilayah Yakobus', 5, TRUE
FROM kronik_categories WHERE slug = 'wilayah';

INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active)
SELECT id, 'Wilayah Maria Regina', 'wilayah-maria-regina', 'Kronik kegiatan Wilayah Maria Regina', 6, TRUE
FROM kronik_categories WHERE slug = 'wilayah';

INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active)
SELECT id, 'Wilayah Fransiskus Asisi', 'wilayah-fransiskus-asisi', 'Kronik kegiatan Wilayah Fransiskus Asisi', 7, TRUE
FROM kronik_categories WHERE slug = 'wilayah';

INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active)
SELECT id, 'Wilayah Vincentius a Paulo', 'wilayah-vincentius-a-paulo', 'Kronik kegiatan Wilayah Vincentius a Paulo', 8, TRUE
FROM kronik_categories WHERE slug = 'wilayah';


-- ============================================================
-- LINGKUNGAN SECTIONS (category: lingkungan)
-- ============================================================

-- Wilayah Petrus (5 lingkungan)
INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active)
SELECT id, 'Lingkungan Petrus 1', 'lingkungan-petrus-1', 'Lingkungan Petrus 1', 101, TRUE
FROM kronik_categories WHERE slug = 'lingkungan';

INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active)
SELECT id, 'Lingkungan Petrus 2', 'lingkungan-petrus-2', 'Lingkungan Petrus 2', 102, TRUE
FROM kronik_categories WHERE slug = 'lingkungan';

INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active)
SELECT id, 'Lingkungan Petrus 3', 'lingkungan-petrus-3', 'Lingkungan Petrus 3', 103, TRUE
FROM kronik_categories WHERE slug = 'lingkungan';

INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active)
SELECT id, 'Lingkungan Petrus 4', 'lingkungan-petrus-4', 'Lingkungan Petrus 4', 104, TRUE
FROM kronik_categories WHERE slug = 'lingkungan';

INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active)
SELECT id, 'Lingkungan Petrus 5', 'lingkungan-petrus-5', 'Lingkungan Petrus 5', 105, TRUE
FROM kronik_categories WHERE slug = 'lingkungan';

-- Wilayah Paulus (5 lingkungan)
INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active)
SELECT id, 'Lingkungan Paulus 1', 'lingkungan-paulus-1', 'Lingkungan Paulus 1', 201, TRUE
FROM kronik_categories WHERE slug = 'lingkungan';

INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active)
SELECT id, 'Lingkungan Paulus 2', 'lingkungan-paulus-2', 'Lingkungan Paulus 2', 202, TRUE
FROM kronik_categories WHERE slug = 'lingkungan';

INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active)
SELECT id, 'Lingkungan Paulus 3', 'lingkungan-paulus-3', 'Lingkungan Paulus 3', 203, TRUE
FROM kronik_categories WHERE slug = 'lingkungan';

INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active)
SELECT id, 'Lingkungan Paulus 4', 'lingkungan-paulus-4', 'Lingkungan Paulus 4', 204, TRUE
FROM kronik_categories WHERE slug = 'lingkungan';

INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active)
SELECT id, 'Lingkungan Paulus 5', 'lingkungan-paulus-5', 'Lingkungan Paulus 5', 205, TRUE
FROM kronik_categories WHERE slug = 'lingkungan';

-- Wilayah Yeseph (3 lingkungan)
INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active)
SELECT id, 'Lingkungan Yeseph 1', 'lingkungan-yeseph-1', 'Lingkungan Yeseph 1', 301, TRUE
FROM kronik_categories WHERE slug = 'lingkungan';

INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active)
SELECT id, 'Lingkungan Yeseph 2', 'lingkungan-yeseph-2', 'Lingkungan Yeseph 2', 302, TRUE
FROM kronik_categories WHERE slug = 'lingkungan';

INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active)
SELECT id, 'Lingkungan Yeseph 3', 'lingkungan-yeseph-3', 'Lingkungan Yeseph 3', 303, TRUE
FROM kronik_categories WHERE slug = 'lingkungan';

-- Wilayah Bartholomeus (3 lingkungan)
INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active)
SELECT id, 'Lingkungan Bartholomeus 1', 'lingkungan-bartholomeus-1', 'Lingkungan Bartholomeus 1', 401, TRUE
FROM kronik_categories WHERE slug = 'lingkungan';

INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active)
SELECT id, 'Lingkungan Bartholomeus 2', 'lingkungan-bartholomeus-2', 'Lingkungan Bartholomeus 2', 402, TRUE
FROM kronik_categories WHERE slug = 'lingkungan';

INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active)
SELECT id, 'Lingkungan Bartholomeus 3', 'lingkungan-bartholomeus-3', 'Lingkungan Bartholomeus 3', 403, TRUE
FROM kronik_categories WHERE slug = 'lingkungan';

-- Wilayah Yakobus (3 lingkungan)
INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active)
SELECT id, 'Lingkungan Yakobus 1', 'lingkungan-yakobus-1', 'Lingkungan Yakobus 1', 501, TRUE
FROM kronik_categories WHERE slug = 'lingkungan';

INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active)
SELECT id, 'Lingkungan Yakobus 2', 'lingkungan-yakobus-2', 'Lingkungan Yakobus 2', 502, TRUE
FROM kronik_categories WHERE slug = 'lingkungan';

INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active)
SELECT id, 'Lingkungan Yakobus 3', 'lingkungan-yakobus-3', 'Lingkungan Yakobus 3', 503, TRUE
FROM kronik_categories WHERE slug = 'lingkungan';

-- Wilayah Maria Regina (3 lingkungan)
INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active)
SELECT id, 'Lingkungan Maria Regina 1', 'lingkungan-maria-regina-1', 'Lingkungan Maria Regina 1', 601, TRUE
FROM kronik_categories WHERE slug = 'lingkungan';

INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active)
SELECT id, 'Lingkungan Maria Regina 2', 'lingkungan-maria-regina-2', 'Lingkungan Maria Regina 2', 602, TRUE
FROM kronik_categories WHERE slug = 'lingkungan';

INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active)
SELECT id, 'Lingkungan Maria Regina 3', 'lingkungan-maria-regina-3', 'Lingkungan Maria Regina 3', 603, TRUE
FROM kronik_categories WHERE slug = 'lingkungan';

-- Wilayah Fransiskus Asisi (3 lingkungan)
INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active)
SELECT id, 'Lingkungan Fransiskus Asisi 1', 'lingkungan-fransiskus-asisi-1', 'Lingkungan Fransiskus Asisi 1', 701, TRUE
FROM kronik_categories WHERE slug = 'lingkungan';

INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active)
SELECT id, 'Lingkungan Fransiskus Asisi 2', 'lingkungan-fransiskus-asisi-2', 'Lingkungan Fransiskus Asisi 2', 702, TRUE
FROM kronik_categories WHERE slug = 'lingkungan';

INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active)
SELECT id, 'Lingkungan Fransiskus Asisi 3', 'lingkungan-fransiskus-asisi-3', 'Lingkungan Fransiskus Asisi 3', 703, TRUE
FROM kronik_categories WHERE slug = 'lingkungan';

-- Wilayah Vincentius a Paulo (3 lingkungan)
INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active)
SELECT id, 'Lingkungan Vincentius a Paulo 1', 'lingkungan-vincentius-a-paulo-1', 'Lingkungan Vincentius a Paulo 1', 801, TRUE
FROM kronik_categories WHERE slug = 'lingkungan';

INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active)
SELECT id, 'Lingkungan Vincentius a Paulo 2', 'lingkungan-vincentius-a-paulo-2', 'Lingkungan Vincentius a Paulo 2', 802, TRUE
FROM kronik_categories WHERE slug = 'lingkungan';

INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active)
SELECT id, 'Lingkungan Vincentius a Paulo 3', 'lingkungan-vincentius-a-paulo-3', 'Lingkungan Vincentius a Paulo 3', 803, TRUE
FROM kronik_categories WHERE slug = 'lingkungan';
