-- Migration: Create BGKP (Badan Gereja Katolik Paroki) Table
-- Date: 2026-02-16
-- Description: Table untuk menyimpan data pengurus BGKP Santo Paulus Juanda

CREATE TABLE IF NOT EXISTS bgkp_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL COMMENT 'Jabatan: Ketua, Wakil Ketua, Sekretaris, Bendahara, Anggota, dll',
  position_type ENUM('ketua', 'wakil_ketua', 'sekretaris', 'bendahara', 'anggota') NOT NULL DEFAULT 'anggota',
  position_level VARCHAR(50) NULL COMMENT 'Level jabatan: I, II, III (untuk Sekretaris/Bendahara)',
  is_ex_officio BOOLEAN DEFAULT FALSE COMMENT 'Apakah jabatan ex officio (otomatis karena jabatan gerejawi)',
  display_order INT DEFAULT 0 COMMENT 'Urutan tampilan',
  period_start_date DATE NULL COMMENT 'Tanggal mulai periode jabatan',
  period_end_date DATE NULL COMMENT 'Tanggal berakhir periode jabatan',
  decree_number VARCHAR(100) NULL COMMENT 'Nomor surat keputusan pengangkatan',
  decree_date DATE NULL COMMENT 'Tanggal surat keputusan',
  notes TEXT NULL COMMENT 'Catatan tambahan',
  is_active BOOLEAN DEFAULT TRUE COMMENT 'Status aktif/tidak aktif',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_position_type (position_type),
  INDEX idx_is_active (is_active),
  INDEX idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample data from the decree
INSERT INTO bgkp_members (name, position, position_type, position_level, is_ex_officio, display_order, period_start_date, period_end_date, decree_number, decree_date, is_active) VALUES
('RD. Ignatius Kaderi', 'Ketua Badan Gereja Katolik Paroki Santo Paulus Juanda, Sidoarjo', 'ketua', NULL, TRUE, 1, '2025-06-13', '2028-06-12', '465/G.113/V/2025', '2025-05-30', TRUE),
('RD. Matheus Juli', 'Wakil Ketua Badan Gereja Katolik Paroki Santo Paulus Juanda, Sidoarjo', 'wakil_ketua', NULL, TRUE, 2, '2025-06-13', '2028-06-12', '465/G.113/V/2025', '2025-05-30', TRUE),
('Nicolaus Yosep Smith', 'Ketua Harian', 'ketua', NULL, FALSE, 3, '2025-06-13', '2028-06-12', '465/G.113/V/2025', '2025-05-30', TRUE),
('Silvester Mikael Agung Prasetyo', 'Sekretaris I', 'sekretaris', 'I', FALSE, 4, '2025-06-13', '2028-06-12', '465/G.113/V/2025', '2025-05-30', TRUE),
('Mikael Trikarilca Heri Wardhana', 'Sekretaris II', 'sekretaris', 'II', FALSE, 5, '2025-06-13', '2028-06-12', '465/G.113/V/2025', '2025-05-30', TRUE),
('Brigita Asriani', 'Sekretaris III', 'sekretaris', 'III', FALSE, 6, '2025-06-13', '2028-06-12', '465/G.113/V/2025', '2025-05-30', TRUE),
('Antonius Sugihartono', 'Bendahara II', 'bendahara', 'II', FALSE, 7, '2025-06-13', '2028-06-12', '465/G.113/V/2025', '2025-05-30', TRUE),
('Patricia Wahiyu Westarianti', 'Bendahara III', 'bendahara', 'III', FALSE, 8, '2025-06-13', '2028-06-12', '465/G.113/V/2025', '2025-05-30', TRUE),
('Robertus Rudi Atmono', 'Anggota', 'anggota', NULL, FALSE, 9, '2025-06-13', '2028-06-12', '465/G.113/V/2025', '2025-05-30', TRUE),
('Makarius Dicky Pangayantaka', 'Anggota', 'anggota', NULL, FALSE, 10, '2025-06-13', '2028-06-12', '465/G.113/V/2025', '2025-05-30', TRUE),
('Petrus Sudardjono', 'Anggota', 'anggota', NULL, FALSE, 11, '2025-06-13', '2028-06-12', '465/G.113/V/2025', '2025-05-30', TRUE),
('Fransiskus Hugo Hary Adi R.', 'Anggota', 'anggota', NULL, FALSE, 12, '2025-06-13', '2028-06-12', '465/G.113/V/2025', '2025-05-30', TRUE),
('Philipus Bryan', 'Anggota', 'anggota', NULL, FALSE, 13, '2025-06-13', '2028-06-12', '465/G.113/V/2025', '2025-05-30', TRUE),
('Martinus Rumoetko Haris', 'Anggota', 'anggota', NULL, FALSE, 14, '2025-06-13', '2028-06-12', '465/G.113/V/2025', '2025-05-30', TRUE),
('Damasus Hasta Prastomo', 'Anggota', 'anggota', NULL, FALSE, 15, '2025-06-13', '2028-06-12', '465/G.113/V/2025', '2025-05-30', TRUE),
('F.X. Tri Harminto Mahendrad', 'Anggota', 'anggota', NULL, FALSE, 16, '2025-06-13', '2028-06-12', '465/G.113/V/2025', '2025-05-30', TRUE),
('Fransiska Tri Okta Indriani', 'Anggota', 'anggota', NULL, FALSE, 17, '2025-06-13', '2028-06-12', '465/G.113/V/2025', '2025-05-30', TRUE),
('Antonius Haryotejo Wasono', 'Anggota', 'anggota', NULL, FALSE, 18, '2025-06-13', '2028-06-12', '465/G.113/V/2025', '2025-05-30', TRUE),
('Vitalis Anggara Kristianto', 'Anggota', 'anggota', NULL, FALSE, 19, '2025-06-13', '2028-06-12', '465/G.113/V/2025', '2025-05-30', TRUE),
('Maria Yuni Buntartri', 'Anggota', 'anggota', NULL, FALSE, 20, '2025-06-13', '2028-06-12', '465/G.113/V/2025', '2025-05-30', TRUE),
('Felisda Sarono Kustiani', 'Anggota', 'anggota', NULL, FALSE, 21, '2025-06-13', '2028-06-12', '465/G.113/V/2025', '2025-05-30', TRUE),
('Catarina Emi Sujiartri', 'Anggota', 'anggota', NULL, FALSE, 22, '2025-06-13', '2028-06-12', '465/G.113/V/2025', '2025-05-30', TRUE);
