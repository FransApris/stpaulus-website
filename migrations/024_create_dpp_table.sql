-- Migration: Create DPP (Dewan Pastoral Paroki) Table
-- SK No. 464/G.113/V/2025 dated 30 Mei 2025

CREATE TABLE IF NOT EXISTS dpp_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL COMMENT 'Nama lengkap anggota',
    position VARCHAR(255) NOT NULL COMMENT 'Jabatan lengkap',
    
    -- Position hierarchy
    position_category ENUM(
        'pengurus_inti',
        'bidang_pembinaan',
        'bidang_sumber',
        'bidang_kerasulan_khusus',
        'bidang_kerasulan_umum',
        'ketua_wilayah',
        'ketua_lingkungan'
    ) NOT NULL COMMENT 'Kategori jabatan',
    
    position_type VARCHAR(100) COMMENT 'Tipe jabatan: ketua_umum, wakil_ketua, sekretaris, bendahara, ketua_bidang, sekretaris_bidang, ketua_seksi, anggota_seksi, sub_sie',
    position_level VARCHAR(50) COMMENT 'Level: I, II, III untuk sekretaris/bendahara',
    
    -- Bidang & Seksi information
    bidang_name VARCHAR(100) COMMENT 'Nama bidang: Pembinaan, Sumber, Kerasulan Khusus, Kerasulan Umum',
    seksi_name VARCHAR(100) COMMENT 'Nama seksi: Keluarga, BIAK, REKAT, OMK, Lansia, Katekese, Liturgi, dll',
    sub_seksi_name VARCHAR(100) COMMENT 'Nama sub seksi: Lektor, Pemazrnur, Koor & Dirigen, dll',
    
    -- Wilayah & Lingkungan for Ketua Wilayah
    wilayah_name VARCHAR(100) COMMENT 'Nama wilayah: Simon, Petrus, Theresia, Bartolomeus, Yakobus, Maria Regina, Fransiskus Asisi, Vincentius a Paulo',
    lingkungan_number VARCHAR(50) COMMENT 'Nomor lingkungan dalam wilayah',
    
    -- Additional member info
    is_couple BOOLEAN DEFAULT FALSE COMMENT 'Apakah pasangan suami-istri (Pasutri)',
    couple_member_id INT COMMENT 'ID pasangan jika is_couple = true',
    
    -- Position attributes
    is_ex_officio BOOLEAN DEFAULT FALSE COMMENT 'Jabatan otomatis karena posisi gerejawi',
    display_order INT DEFAULT 0 COMMENT 'Urutan tampilan',
    
    -- Period information
    period_start_date DATE COMMENT 'Tanggal mulai masa jabatan',
    period_end_date DATE COMMENT 'Tanggal berakhir masa jabatan',
    
    -- Decree information
    decree_number VARCHAR(100) COMMENT 'Nomor SK',
    decree_date DATE COMMENT 'Tanggal SK',
    
    -- Additional info
    notes TEXT COMMENT 'Catatan tambahan',
    is_active BOOLEAN DEFAULT TRUE COMMENT 'Status aktif',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_position_category (position_category),
    INDEX idx_bidang_seksi (bidang_name, seksi_name),
    INDEX idx_wilayah (wilayah_name),
    INDEX idx_active (is_active),
    INDEX idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert DPP Members from SK 464/G.113/V/2025
-- Period: 13 Juni 2025 - 12 Juni 2028

-- PENGURUS INTI
INSERT INTO dpp_members (name, position, position_category, position_type, is_ex_officio, display_order, period_start_date, period_end_date, decree_number, decree_date, is_active) VALUES
('RD Ignatius Tri Budi Utomo', 'Ketua Umum', 'pengurus_inti', 'ketua_umum', TRUE, 1, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('RD. Matheus Juli', 'Wakil Ketua', 'pengurus_inti', 'wakil_ketua', TRUE, 2, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Silvester Miko Agung Prasetyo', 'Sekretaris I', 'pengurus_inti', 'sekretaris', FALSE, 3, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Michael Trikartika Heri Wardhana', 'Sekretaris II', 'pengurus_inti', 'sekretaris', FALSE, 4, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Brigita Asriani', 'Bendahara I', 'pengurus_inti', 'bendahara', FALSE, 5, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Antonius Sugihartono', 'Bendahara II', 'pengurus_inti', 'bendahara', FALSE, 6, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Patricia Wahioe Moelandari', 'Bendahara III', 'pengurus_inti', 'bendahara', FALSE, 7, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE);

-- BIDANG PEMBINAAN
INSERT INTO dpp_members (name, position, position_category, position_type, bidang_name, display_order, period_start_date, period_end_date, decree_number, decree_date, is_active) VALUES
('Laurentia Elalia Sulis Setyawati', 'Ketua Bidang Pembinaan', 'bidang_pembinaan', 'ketua_bidang', 'Pembinaan', 10, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Yoesiat Susiadi', 'Sekretaris Bidang Pembinaan', 'bidang_pembinaan', 'sekretaris_bidang', 'Pembinaan', 11, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE);

-- Seksi Keluarga
INSERT INTO dpp_members (name, position, position_category, position_type, bidang_name, seksi_name, is_couple, display_order, period_start_date, period_end_date, decree_number, decree_date, is_active) VALUES
('Aloysius Tony Soebjono', 'Seksi Keluarga', 'bidang_pembinaan', 'anggota_seksi', 'Pembinaan', 'Keluarga', TRUE, 12, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Maria Roesdiana Siharianti', 'Seksi Keluarga', 'bidang_pembinaan', 'anggota_seksi', 'Pembinaan', 'Keluarga', TRUE, 13, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Nikolas Ardianto Kusumawardhana', 'Seksi Keluarga', 'bidang_pembinaan', 'anggota_seksi', 'Pembinaan', 'Keluarga', TRUE, 14, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Chatarina LaboureSri Indrawati Salim', 'Seksi Keluarga', 'bidang_pembinaan', 'anggota_seksi', 'Pembinaan', 'Keluarga', TRUE, 15, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE);

-- Seksi BIAK
INSERT INTO dpp_members (name, position, position_category, position_type, bidang_name, seksi_name, display_order, period_start_date, period_end_date, decree_number, decree_date, is_active) VALUES
('Margarita Novi Kristiyani', 'Seksi BIAK', 'bidang_pembinaan', 'anggota_seksi', 'Pembinaan', 'BIAK', 16, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Agnes Fransisca K.', 'Seksi BIAK', 'bidang_pembinaan', 'anggota_seksi', 'Pembinaan', 'BIAK', 17, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE);

-- Seksi REKAT
INSERT INTO dpp_members (name, position, position_category, position_type, bidang_name, seksi_name, display_order, period_start_date, period_end_date, decree_number, decree_date, is_active) VALUES
('Theresia Arina Kristyaningsih', 'Seksi REKAT', 'bidang_pembinaan', 'anggota_seksi', 'Pembinaan', 'REKAT', 18, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Brigitta Puji Ardhana Reswari', 'Seksi REKAT', 'bidang_pembinaan', 'anggota_seksi', 'Pembinaan', 'REKAT', 19, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE);

-- Seksi OMK
INSERT INTO dpp_members (name, position, position_category, position_type, bidang_name, seksi_name, display_order, period_start_date, period_end_date, decree_number, decree_date, is_active) VALUES
('Christofera Marlina Junaedi', 'Seksi OMK', 'bidang_pembinaan', 'anggota_seksi', 'Pembinaan', 'OMK', 20, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Yohanes Dwi Yunianto', 'Seksi OMK', 'bidang_pembinaan', 'anggota_seksi', 'Pembinaan', 'OMK', 21, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Yosephus Widyawan', 'Seksi OMK', 'bidang_pembinaan', 'anggota_seksi', 'Pembinaan', 'OMK', 22, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE);

-- Seksi Lansia
INSERT INTO dpp_members (name, position, position_category, position_type, bidang_name, seksi_name, display_order, period_start_date, period_end_date, decree_number, decree_date, is_active) VALUES
('Antonius Djoko Sumaryanto', 'Seksi Lansia', 'bidang_pembinaan', 'anggota_seksi', 'Pembinaan', 'Lansia', 23, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Yohanes Capistrano Budi Iswanto', 'Seksi Lansia', 'bidang_pembinaan', 'anggota_seksi', 'Pembinaan', 'Lansia', 24, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE);

-- BIDANG SUMBER
INSERT INTO dpp_members (name, position, position_category, position_type, bidang_name, display_order, period_start_date, period_end_date, decree_number, decree_date, is_active) VALUES
('Teresa Indah Rukmini', 'Ketua Bidang Sumber', 'bidang_sumber', 'ketua_bidang', 'Sumber', 30, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Vincensius Heri Dwi Oprasetyo', 'Sekretaris Bidang Sumber', 'bidang_sumber', 'sekretaris_bidang', 'Sumber', 31, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE);

-- Seksi Katekese
INSERT INTO dpp_members (name, position, position_category, position_type, bidang_name, seksi_name, display_order, period_start_date, period_end_date, decree_number, decree_date, is_active) VALUES
('Laurensius Babo', 'Seksi Katekese', 'bidang_sumber', 'anggota_seksi', 'Sumber', 'Katekese', 32, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Aloysius Tugiyo Pranoto', 'Seksi Katekese', 'bidang_sumber', 'anggota_seksi', 'Sumber', 'Katekese', 33, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE);

-- Seksi Kerasulan Kitab Suci
INSERT INTO dpp_members (name, position, position_category, position_type, bidang_name, seksi_name, display_order, period_start_date, period_end_date, decree_number, decree_date, is_active) VALUES
('Vinansius Seran', 'Seksi Kerasulan Kitab Suci', 'bidang_sumber', 'anggota_seksi', 'Sumber', 'Kerasulan Kitab Suci', 34, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Marissa Hosbach', 'Seksi Kerasulan Kitab Suci', 'bidang_sumber', 'anggota_seksi', 'Sumber', 'Kerasulan Kitab Suci', 35, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE);

-- Seksi Liturgi (Ketua)
INSERT INTO dpp_members (name, position, position_category, position_type, bidang_name, seksi_name, display_order, period_start_date, period_end_date, decree_number, decree_date, is_active) VALUES
('Lukas Arisono', 'Seksi Liturgi', 'bidang_sumber', 'ketua_seksi', 'Sumber', 'Liturgi', 36, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Endrika Luh Ayu Sulistyanti P.R.', 'Seksi Liturgi', 'bidang_sumber', 'ketua_seksi', 'Sumber', 'Liturgi', 37, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE);

-- Sub Sie Liturgi
INSERT INTO dpp_members (name, position, position_category, position_type, bidang_name, seksi_name, sub_seksi_name, display_order, period_start_date, period_end_date, decree_number, decree_date, is_active) VALUES
('Bernadeth Fransisca Hendrojono', 'Sub Sie Lektor', 'bidang_sumber', 'sub_sie', 'Sumber', 'Liturgi', 'Lektor', 38, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Fransisca Desi Ika Dewanti', 'Sub sie Pemazmur', 'bidang_sumber', 'sub_sie', 'Sumber', 'Liturgi', 'Pemazmur', 39, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Agustina Wahyu Budiyati', 'Sub Sie Koor & Dirigen', 'bidang_sumber', 'sub_sie', 'Sumber', 'Liturgi', 'Koor & Dirigen', 40, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Giovannio Andrian Soares De Jesus', 'Sub Sie Misdinar', 'bidang_sumber', 'sub_sie', 'Sumber', 'Liturgi', 'Misdinar', 41, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('F.X. Tri Widjayanto', 'Sub Sie Organis', 'bidang_sumber', 'sub_sie', 'Sumber', 'Liturgi', 'Organis', 42, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Maria Erlina Magdalena', 'Sub Sie Bunga Altar', 'bidang_sumber', 'sub_sie', 'Sumber', 'Liturgi', 'Bunga Altar', 43, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Robertus Prabowo', 'Sub sie Asisten Imam', 'bidang_sumber', 'sub_sie', 'Sumber', 'Liturgi', 'Asisten Imam', 44, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Yustinus Gandung Cahyono', 'Sub sie Pemandu Umat', 'bidang_sumber', 'sub_sie', 'Sumber', 'Liturgi', 'Pemandu Umat', 45, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE);

-- BIDANG KERASULAN KHUSUS
INSERT INTO dpp_members (name, position, position_category, position_type, bidang_name, display_order, period_start_date, period_end_date, decree_number, decree_date, is_active) VALUES
('Andri Kurniawan', 'Ketua Bidang Kerasulan Khusus', 'bidang_kerasulan_khusus', 'ketua_bidang', 'Kerasulan Khusus', 50, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Lusia Permata Sari Hartani', 'Sekretaris Bidang Kerasulan Khusus', 'bidang_kerasulan_khusus', 'sekretaris_bidang', 'Kerasulan Khusus', 51, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE);

-- Seksi Karya Misioner
INSERT INTO dpp_members (name, position, position_category, position_type, bidang_name, seksi_name, display_order, period_start_date, period_end_date, decree_number, decree_date, is_active) VALUES
('Ignatius Jaka Mulyana', 'Seksi Karya Misioner', 'bidang_kerasulan_khusus', 'anggota_seksi', 'Kerasulan Khusus', 'Karya Misioner', 52, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Dominique Wahyu Pradana', 'Seksi Karya Misioner', 'bidang_kerasulan_khusus', 'anggota_seksi', 'Kerasulan Khusus', 'Karya Misioner', 53, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE);

-- Seksi Pendidikan
INSERT INTO dpp_members (name, position, position_category, position_type, bidang_name, seksi_name, display_order, period_start_date, period_end_date, decree_number, decree_date, is_active) VALUES
('Maria Magdalena Kariyatun', 'Seksi Pendidikan', 'bidang_kerasulan_khusus', 'anggota_seksi', 'Kerasulan Khusus', 'Pendidikan', 54, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Elisabeth Budi Pihatningsih', 'Seksi Pendidikan', 'bidang_kerasulan_khusus', 'anggota_seksi', 'Kerasulan Khusus', 'Pendidikan', 55, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE);

-- Seksi Komunikasi Sosial
INSERT INTO dpp_members (name, position, position_category, position_type, bidang_name, seksi_name, display_order, period_start_date, period_end_date, decree_number, decree_date, is_active) VALUES
('Aurelia Margaretha Debby', 'Seksi Komunikasi Sosial', 'bidang_kerasulan_khusus', 'anggota_seksi', 'Kerasulan Khusus', 'Komunikasi Sosial', 56, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Fransiscus Apris Dwiharta', 'Seksi Komunikasi Sosial', 'bidang_kerasulan_khusus', 'anggota_seksi', 'Kerasulan Khusus', 'Komunikasi Sosial', 57, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE);

-- Koordinator Kelompok Kategorial
INSERT INTO dpp_members (name, position, position_category, position_type, bidang_name, display_order, period_start_date, period_end_date, decree_number, decree_date, is_active) VALUES
('Ethaviana Suchnistyani', 'Koordinator Kelompok Kategorial', 'bidang_kerasulan_khusus', 'koordinator', 'Kerasulan Khusus', 58, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE);

-- BIDANG KERASULAN UMUM
INSERT INTO dpp_members (name, position, position_category, position_type, bidang_name, display_order, period_start_date, period_end_date, decree_number, decree_date, is_active) VALUES
('Yosef Arpo Trilaksono', 'Ketua Bidang Kerasulan Umum', 'bidang_kerasulan_umum', 'ketua_bidang', 'Kerasulan Umum', 60, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Norbertus Puger Luxeto', 'Sekretaris Bidang Kerasulan Umum', 'bidang_kerasulan_umum', 'sekretaris_bidang', 'Kerasulan Umum', 61, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE);

-- Seksi PHUBB
INSERT INTO dpp_members (name, position, position_category, position_type, bidang_name, seksi_name, display_order, period_start_date, period_end_date, decree_number, decree_date, is_active) VALUES
('Matheus Wahyu Hardani', 'Seksi PHUBB', 'bidang_kerasulan_umum', 'anggota_seksi', 'Kerasulan Umum', 'PHUBB', 62, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Andreas Bambang Eko Endryatno', 'Seksi PHUBB', 'bidang_kerasulan_umum', 'anggota_seksi', 'Kerasulan Umum', 'PHUBB', 63, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Yohanes I Dewa Gde Dharmajaya', 'Seksi PHUBB', 'bidang_kerasulan_umum', 'anggota_seksi', 'Kerasulan Umum', 'PHUBB', 64, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE);

-- Ketua Komisi PSE
INSERT INTO dpp_members (name, position, position_category, position_type, bidang_name, seksi_name, display_order, period_start_date, period_end_date, decree_number, decree_date, is_active) VALUES
('Cornelius Suminto Gondo', 'Ketua Komisi PSE', 'bidang_kerasulan_umum', 'ketua_seksi', 'Kerasulan Umum', 'Komisi PSE', 65, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Agnes Dian Amurwani Tyas Ulami', 'Ketua Komisi PSE', 'bidang_kerasulan_umum', 'ketua_seksi', 'Kerasulan Umum', 'Komisi PSE', 66, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE);

-- KETUA WILAYAH - Wilayah Simon
INSERT INTO dpp_members (name, position, position_category, position_type, wilayah_name, lingkungan_number, display_order, period_start_date, period_end_date, decree_number, decree_date, is_active) VALUES
('Petrus Tri Dhanny Yuniarto', 'Ketua Wilayah Simon', 'ketua_wilayah', 'ketua_wilayah', 'Simon', '1', 100, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Ferdinandus Jerry Yuniarto', 'Ketua Lingkungan Simon 2', 'ketua_lingkungan', 'ketua_lingkungan', 'Simon', '2', 101, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Alfonsus Asffiyono Eko Pramono', 'Ketua Lingkungan Simon 3', 'ketua_lingkungan', 'ketua_lingkungan', 'Simon', '3', 102, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Raden Tarsisius Haryo Kusuma', 'Ketua Lingkungan Simon 4', 'ketua_lingkungan', 'ketua_lingkungan', 'Simon', '4', 103, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Yohanes Sukirmin', 'Ketua Lingkungan Simon 5', 'ketua_lingkungan', 'ketua_lingkungan', 'Simon', '5', 104, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Benediktus Wiratmoso', 'Ketua Lingkungan Simon 6', 'ketua_lingkungan', 'ketua_lingkungan', 'Simon', '6', 105, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Maria Anna Widajja', 'Ketua Lingkungan Simon 7', 'ketua_lingkungan', 'ketua_lingkungan', 'Simon', '7', 106, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Andreas Surooso', 'Ketua Lingkungan Simon 8', 'ketua_lingkungan', 'ketua_lingkungan', 'Simon', '8', 107, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE);

-- KETUA WILAYAH - Wilayah Petrus
INSERT INTO dpp_members (name, position, position_category, position_type, wilayah_name, lingkungan_number, display_order, period_start_date, period_end_date, decree_number, decree_date, is_active) VALUES
('John Berty P.', 'Ketua Wilayah Petrus', 'ketua_wilayah', 'ketua_wilayah', 'Petrus', '1', 110, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Michael Arimono', 'Ketua Lingkungan Petrus 2', 'ketua_lingkungan', 'ketua_lingkungan', 'Petrus', '2', 111, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Cecilia Maria Retno K.', 'Ketua Lingkungan Petrus 3', 'ketua_lingkungan', 'ketua_lingkungan', 'Petrus', '3', 112, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Fransiskus Tambing', 'Ketua Lingkungan Petrus 4', 'ketua_lingkungan', 'ketua_lingkungan', 'Petrus', '4', 113, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Yohanes Rusbiyanto', 'Ketua Lingkungan Petrus 5', 'ketua_lingkungan', 'ketua_lingkungan', 'Petrus', '5', 114, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Gregorius Yahya Frank Hendarto', 'Ketua Lingkungan Petrus 6', 'ketua_lingkungan', 'ketua_lingkungan', 'Petrus', '6', 115, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('F.A. Christian Billy', 'Ketua Lingkungan Petrus 7', 'ketua_lingkungan', 'ketua_lingkungan', 'Petrus', '7', 116, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE);

-- Additional Ketua Lingkungan Petrus
INSERT INTO dpp_members (name, position, position_category, position_type, wilayah_name, lingkungan_number, display_order, period_start_date, period_end_date, decree_number, decree_date, is_active) VALUES
('Albertus Daru D.', 'Ketua Lingkungan Petrus 2', 'ketua_lingkungan', 'ketua_lingkungan', 'Petrus', '2', 117, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Florentinus Firman Wijayanto', 'Ketua Lingkungan Petrus 3', 'ketua_lingkungan', 'ketua_lingkungan', 'Petrus', '3', 118, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Fransiskus Gunarso', 'Ketua Lingkungan Petrus 4', 'ketua_lingkungan', 'ketua_lingkungan', 'Petrus', '4', 119, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Gregorius Wahyu Yoga Purwoko', 'Ketua Lingkungan Petrus 5', 'ketua_lingkungan', 'ketua_lingkungan', 'Petrus', '5', 120, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Bonaventura Suyanto', 'Ketua Lingkungan Petrus 6', 'ketua_lingkungan', 'ketua_lingkungan', 'Petrus', '6', 121, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE);

-- KETUA WILAYAH - Wilayah Theresia
INSERT INTO dpp_members (name, position, position_category, position_type, wilayah_name, lingkungan_number, display_order, period_start_date, period_end_date, decree_number, decree_date, is_active) VALUES
('Eduardus Adi', 'Ketua Wilayah Theresia', 'ketua_wilayah', 'ketua_wilayah', 'Theresia', '1', 130, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Fransiscus Tito Dekaduanto', 'Ketua Lingkungan Theresia 2', 'ketua_lingkungan', 'ketua_lingkungan', 'Theresia', '2', 131, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Domitilla Arie Ferinawati Kusnamyah', 'Ketua Lingkungan Theresia 3', 'ketua_lingkungan', 'ketua_lingkungan', 'Theresia', '3', 132, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Fransiscus Xaverius Sularno', 'Ketua Lingkungan Theresia 4', 'ketua_lingkungan', 'ketua_lingkungan', 'Theresia', '4', 133, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Ignatius Loyola Hendro Siswanto', 'Ketua Lingkungan Theresia 5', 'ketua_lingkungan', 'ketua_lingkungan', 'Theresia', '5', 134, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Maria Poppy Aritha', 'Ketua Lingkungan Theresia 6', 'ketua_lingkungan', 'ketua_lingkungan', 'Theresia', '6', 135, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('F.X. Galih Priyo Pamungkas', 'Ketua Lingkungan Theresia 7', 'ketua_lingkungan', 'ketua_lingkungan', 'Theresia', '7', 136, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Yoseph Nahak Seran', 'Ketua Lingkungan Theresia 8', 'ketua_lingkungan', 'ketua_lingkungan', 'Theresia', '8', 137, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE);

-- KETUA WILAYAH - Wilayah Bartolomeus
INSERT INTO dpp_members (name, position, position_category, position_type, wilayah_name, lingkungan_number, display_order, period_start_date, period_end_date, decree_number, decree_date, is_active) VALUES
('Alexy Michaelov Woga', 'Ketua Wilayah Bartolomeus', 'ketua_wilayah', 'ketua_wilayah', 'Bartolomeus', '1', 140, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Robertus Sales Cundawan', 'Ketua Lingkungan Bartolomeus 2', 'ketua_lingkungan', 'ketua_lingkungan', 'Bartolomeus', '2', 141, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Stefanus Isda Pambudi', 'Ketua Lingkungan Bartolomeus 3', 'ketua_lingkungan', 'ketua_lingkungan', 'Bartolomeus', '3', 142, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Gregorius Tri Mei', 'Ketua Lingkungan Bartolomeus 4', 'ketua_lingkungan', 'ketua_lingkungan', 'Bartolomeus', '4', 143, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE);

-- KETUA WILAYAH - Wilayah Yakobus
INSERT INTO dpp_members (name, position, position_category, position_type, wilayah_name, lingkungan_number, display_order, period_start_date, period_end_date, decree_number, decree_date, is_active) VALUES
('Viktor Armando Y.L.K.', 'Ketua Wilayah Yakobus', 'ketua_wilayah', 'ketua_wilayah', 'Yakobus', '1', 150, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Cicilia Winarti Handrayani', 'Ketua Lingkungan Yakobus 2', 'ketua_lingkungan', 'ketua_lingkungan', 'Yakobus', '2', 151, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Yoseph Nico Gunawan', 'Ketua Lingkungan Yakobus 3', 'ketua_lingkungan', 'ketua_lingkungan', 'Yakobus', '3', 152, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE);

-- KETUA WILAYAH - Wilayah Maria Regina
INSERT INTO dpp_members (name, position, position_category, position_type, wilayah_name, lingkungan_number, display_order, period_start_date, period_end_date, decree_number, decree_date, is_active) VALUES
('Fransisco Budi Sugitantono', 'Ketua Wilayah Maria Regina', 'ketua_wilayah', 'ketua_wilayah', 'Maria Regina', '1', 160, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Tarsisius Taryanto', 'Ketua Lingkungan MR 2', 'ketua_lingkungan', 'ketua_lingkungan', 'Maria Regina', '2', 161, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Roserius Astovo', 'Ketua Lingkungan MR 3', 'ketua_lingkungan', 'ketua_lingkungan', 'Maria Regina', '3', 162, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE);

-- KETUA WILAYAH - Wilayah Fransiskus Asisi
INSERT INTO dpp_members (name, position, position_category, position_type, wilayah_name, lingkungan_number, display_order, period_start_date, period_end_date, decree_number, decree_date, is_active) VALUES
('Diego Arief Budiyanto', 'Ketua Wilayah Fransiskus Asisi', 'ketua_wilayah', 'ketua_wilayah', 'Fransiskus Asisi', '1', 170, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Agustina Sriwurudju', 'Ketua Lingkungan FA 2', 'ketua_lingkungan', 'ketua_lingkungan', 'Fransiskus Asisi', '2', 171, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Franciscus Pranoto', 'Ketua Lingkungan FA 3', 'ketua_lingkungan', 'ketua_lingkungan', 'Fransiskus Asisi', '3', 172, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE);

-- KETUA WILAYAH - Wilayah Vincentius a Paulo
INSERT INTO dpp_members (name, position, position_category, position_type, wilayah_name, lingkungan_number, display_order, period_start_date, period_end_date, decree_number, decree_date, is_active) VALUES
('Augustinus Lukas Nugroho Hardono', 'Ketua Wilayah Vincentius a Paulo', 'ketua_wilayah', 'ketua_wilayah', 'Vincentius a Paulo', '1', 180, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Augustinus Willem Albert', 'Ketua Lingkungan VAP 2', 'ketua_lingkungan', 'ketua_lingkungan', 'Vincentius a Paulo', '2', 181, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Yohanes Bagus Yudantyo', 'Ketua Lingkungan VAP 3', 'ketua_lingkungan', 'ketua_lingkungan', 'Vincentius a Paulo', '3', 182, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE),
('Melani Werdiarso', 'Ketua Lingkungan VAP 4', 'ketua_lingkungan', 'ketua_lingkungan', 'Vincentius a Paulo', '4', 183, '2025-06-13', '2028-06-12', '464/G.113/V/2025', '2025-05-30', TRUE);
