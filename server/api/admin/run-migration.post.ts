// API: Run a pending migration SQL
// Path: POST /api/admin/run-migration
// Access: super_admin only
// Body: { migration: '007_add_agenda_id_to_announcements' }

import { runQuery } from '~/server/database/db'
import { requireAuth } from '~/server/utils/auth'

// SQL embedded directly — safer than reading from disk in Nitro production
const MIGRATIONS: Record<string, string[]> = {
  '007_add_agenda_id_to_announcements': [
    `ALTER TABLE church_announcements ADD COLUMN agenda_id INT NULL DEFAULT NULL AFTER display_order`,
    `ALTER TABLE church_announcements ADD INDEX idx_agenda_id (agenda_id)`,
    `ALTER TABLE church_announcements ADD CONSTRAINT fk_announcement_agenda FOREIGN KEY (agenda_id) REFERENCES agendas(id) ON DELETE SET NULL`
  ],
  '008_add_manage_users_permission_to_sekretariat': [
    `INSERT IGNORE INTO role_permissions (role_id, permission_id) SELECT r.id, p.id FROM roles r JOIN permissions p ON p.name = 'manage_users_komsos_sekretariat' WHERE r.name = 'admin_sekretariat'`
  ],
  '009_add_liturgy_types_permission_to_sekretariat': [
    `INSERT IGNORE INTO role_permissions (role_id, permission_id) SELECT r.id, p.id FROM roles r JOIN permissions p ON p.name = 'manage_liturgy_types' WHERE r.name = 'admin_sekretariat'`
  ],
  '031_create_app_settings': [
    `CREATE TABLE IF NOT EXISTS app_settings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      setting_key VARCHAR(100) UNIQUE NOT NULL,
      setting_value JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_setting_key (setting_key)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
    `INSERT IGNORE INTO app_settings (setting_key, setting_value) VALUES ('maintenance_config', '{}')`
  ],
  '032_add_force_password_reset': [
    `ALTER TABLE users ADD COLUMN requires_password_reset TINYINT(1) DEFAULT 0`
  ],
  '030_add_kronik_sections_wilayah_lingkungan': [
    // Wilayah sections
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Wilayah Petrus', 'wilayah-petrus', 'Kronik kegiatan Wilayah Petrus', 1, TRUE FROM kronik_categories WHERE slug = 'wilayah'`,
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Wilayah Paulus', 'wilayah-paulus', 'Kronik kegiatan Wilayah Paulus', 2, TRUE FROM kronik_categories WHERE slug = 'wilayah'`,
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Wilayah Yeseph', 'wilayah-yeseph', 'Kronik kegiatan Wilayah Yeseph', 3, TRUE FROM kronik_categories WHERE slug = 'wilayah'`,
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Wilayah Bartholomeus', 'wilayah-bartholomeus', 'Kronik kegiatan Wilayah Bartholomeus', 4, TRUE FROM kronik_categories WHERE slug = 'wilayah'`,
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Wilayah Yakobus', 'wilayah-yakobus', 'Kronik kegiatan Wilayah Yakobus', 5, TRUE FROM kronik_categories WHERE slug = 'wilayah'`,
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Wilayah Maria Regina', 'wilayah-maria-regina', 'Kronik kegiatan Wilayah Maria Regina', 6, TRUE FROM kronik_categories WHERE slug = 'wilayah'`,
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Wilayah Fransiskus Asisi', 'wilayah-fransiskus-asisi', 'Kronik kegiatan Wilayah Fransiskus Asisi', 7, TRUE FROM kronik_categories WHERE slug = 'wilayah'`,
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Wilayah Vincentius a Paulo', 'wilayah-vincentius-a-paulo', 'Kronik kegiatan Wilayah Vincentius a Paulo', 8, TRUE FROM kronik_categories WHERE slug = 'wilayah'`,
    // Lingkungan Petrus
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Lingkungan Petrus 1', 'lingkungan-petrus-1', 'Lingkungan Petrus 1', 101, TRUE FROM kronik_categories WHERE slug = 'lingkungan'`,
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Lingkungan Petrus 2', 'lingkungan-petrus-2', 'Lingkungan Petrus 2', 102, TRUE FROM kronik_categories WHERE slug = 'lingkungan'`,
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Lingkungan Petrus 3', 'lingkungan-petrus-3', 'Lingkungan Petrus 3', 103, TRUE FROM kronik_categories WHERE slug = 'lingkungan'`,
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Lingkungan Petrus 4', 'lingkungan-petrus-4', 'Lingkungan Petrus 4', 104, TRUE FROM kronik_categories WHERE slug = 'lingkungan'`,
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Lingkungan Petrus 5', 'lingkungan-petrus-5', 'Lingkungan Petrus 5', 105, TRUE FROM kronik_categories WHERE slug = 'lingkungan'`,
    // Lingkungan Paulus
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Lingkungan Paulus 1', 'lingkungan-paulus-1', 'Lingkungan Paulus 1', 201, TRUE FROM kronik_categories WHERE slug = 'lingkungan'`,
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Lingkungan Paulus 2', 'lingkungan-paulus-2', 'Lingkungan Paulus 2', 202, TRUE FROM kronik_categories WHERE slug = 'lingkungan'`,
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Lingkungan Paulus 3', 'lingkungan-paulus-3', 'Lingkungan Paulus 3', 203, TRUE FROM kronik_categories WHERE slug = 'lingkungan'`,
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Lingkungan Paulus 4', 'lingkungan-paulus-4', 'Lingkungan Paulus 4', 204, TRUE FROM kronik_categories WHERE slug = 'lingkungan'`,
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Lingkungan Paulus 5', 'lingkungan-paulus-5', 'Lingkungan Paulus 5', 205, TRUE FROM kronik_categories WHERE slug = 'lingkungan'`,
    // Lingkungan Yeseph
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Lingkungan Yeseph 1', 'lingkungan-yeseph-1', 'Lingkungan Yeseph 1', 301, TRUE FROM kronik_categories WHERE slug = 'lingkungan'`,
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Lingkungan Yeseph 2', 'lingkungan-yeseph-2', 'Lingkungan Yeseph 2', 302, TRUE FROM kronik_categories WHERE slug = 'lingkungan'`,
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Lingkungan Yeseph 3', 'lingkungan-yeseph-3', 'Lingkungan Yeseph 3', 303, TRUE FROM kronik_categories WHERE slug = 'lingkungan'`,
    // Lingkungan Bartholomeus
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Lingkungan Bartholomeus 1', 'lingkungan-bartholomeus-1', 'Lingkungan Bartholomeus 1', 401, TRUE FROM kronik_categories WHERE slug = 'lingkungan'`,
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Lingkungan Bartholomeus 2', 'lingkungan-bartholomeus-2', 'Lingkungan Bartholomeus 2', 402, TRUE FROM kronik_categories WHERE slug = 'lingkungan'`,
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Lingkungan Bartholomeus 3', 'lingkungan-bartholomeus-3', 'Lingkungan Bartholomeus 3', 403, TRUE FROM kronik_categories WHERE slug = 'lingkungan'`,
    // Lingkungan Yakobus
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Lingkungan Yakobus 1', 'lingkungan-yakobus-1', 'Lingkungan Yakobus 1', 501, TRUE FROM kronik_categories WHERE slug = 'lingkungan'`,
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Lingkungan Yakobus 2', 'lingkungan-yakobus-2', 'Lingkungan Yakobus 2', 502, TRUE FROM kronik_categories WHERE slug = 'lingkungan'`,
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Lingkungan Yakobus 3', 'lingkungan-yakobus-3', 'Lingkungan Yakobus 3', 503, TRUE FROM kronik_categories WHERE slug = 'lingkungan'`,
    // Lingkungan Maria Regina
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Lingkungan Maria Regina 1', 'lingkungan-maria-regina-1', 'Lingkungan Maria Regina 1', 601, TRUE FROM kronik_categories WHERE slug = 'lingkungan'`,
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Lingkungan Maria Regina 2', 'lingkungan-maria-regina-2', 'Lingkungan Maria Regina 2', 602, TRUE FROM kronik_categories WHERE slug = 'lingkungan'`,
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Lingkungan Maria Regina 3', 'lingkungan-maria-regina-3', 'Lingkungan Maria Regina 3', 603, TRUE FROM kronik_categories WHERE slug = 'lingkungan'`,
    // Lingkungan Fransiskus Asisi
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Lingkungan Fransiskus Asisi 1', 'lingkungan-fransiskus-asisi-1', 'Lingkungan Fransiskus Asisi 1', 701, TRUE FROM kronik_categories WHERE slug = 'lingkungan'`,
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Lingkungan Fransiskus Asisi 2', 'lingkungan-fransiskus-asisi-2', 'Lingkungan Fransiskus Asisi 2', 702, TRUE FROM kronik_categories WHERE slug = 'lingkungan'`,
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Lingkungan Fransiskus Asisi 3', 'lingkungan-fransiskus-asisi-3', 'Lingkungan Fransiskus Asisi 3', 703, TRUE FROM kronik_categories WHERE slug = 'lingkungan'`,
    // Lingkungan Vincentius a Paulo
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Lingkungan Vincentius a Paulo 1', 'lingkungan-vincentius-a-paulo-1', 'Lingkungan Vincentius a Paulo 1', 801, TRUE FROM kronik_categories WHERE slug = 'lingkungan'`,
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Lingkungan Vincentius a Paulo 2', 'lingkungan-vincentius-a-paulo-2', 'Lingkungan Vincentius a Paulo 2', 802, TRUE FROM kronik_categories WHERE slug = 'lingkungan'`,
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Lingkungan Vincentius a Paulo 3', 'lingkungan-vincentius-a-paulo-3', 'Lingkungan Vincentius a Paulo 3', 803, TRUE FROM kronik_categories WHERE slug = 'lingkungan'`
  ],
  '040_add_news_organization_filters': [
    `CREATE TABLE IF NOT EXISTS seksi (id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT, nama VARCHAR(100) NOT NULL, bidang VARCHAR(100) NULL, is_active TINYINT(1) DEFAULT 1, display_order INT DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`,
    `INSERT IGNORE INTO seksi (nama, bidang, display_order) VALUES ('Keluarga','Pembinaan',1),('BIAK','Pembinaan',2),('REKAT','Pembinaan',3),('OMK','Pembinaan',4),('Lansia','Pembinaan',5),('Katekese','Sumber',6),('Kerasulan Kitab Suci','Sumber',7),('Liturgi','Sumber',8),('Karya Misioner','Kerasulan Khusus',9),('Pendidikan','Kerasulan Khusus',10),('Komunikasi Sosial','Kerasulan Khusus',11),('PHUBB','Kerasulan Umum',12),('Komisi PSE','Kerasulan Umum',13)`,
    `CREATE TABLE IF NOT EXISTS news_wilayah_relations (news_id INT NOT NULL, wilayah_id INT UNSIGNED NOT NULL, PRIMARY KEY (news_id, wilayah_id), FOREIGN KEY (news_id) REFERENCES news(id) ON DELETE CASCADE, FOREIGN KEY (wilayah_id) REFERENCES wilayah(id) ON DELETE CASCADE)`,
    `CREATE TABLE IF NOT EXISTS news_lingkungan_relations (news_id INT NOT NULL, lingkungan_id INT UNSIGNED NOT NULL, PRIMARY KEY (news_id, lingkungan_id), FOREIGN KEY (news_id) REFERENCES news(id) ON DELETE CASCADE, FOREIGN KEY (lingkungan_id) REFERENCES lingkungan(id) ON DELETE CASCADE)`,
    `CREATE TABLE IF NOT EXISTS news_seksi_relations (news_id INT NOT NULL, seksi_id INT UNSIGNED NOT NULL, PRIMARY KEY (news_id, seksi_id), FOREIGN KEY (news_id) REFERENCES news(id) ON DELETE CASCADE, FOREIGN KEY (seksi_id) REFERENCES seksi(id) ON DELETE CASCADE)`,
    `ALTER TABLE news ADD COLUMN is_bgkp TINYINT(1) DEFAULT 0`
  ],
  '050_create_news_interactions': [
    // Add missing columns to news table (runner skips "Duplicate column name" automatically)
    `ALTER TABLE news ADD COLUMN image VARCHAR(1000) NULL`,
    `ALTER TABLE news ADD COLUMN gallery_images JSON NULL`,
    `ALTER TABLE news ADD COLUMN when_date DATE NULL`,
    `ALTER TABLE news ADD COLUMN when_time VARCHAR(50) NULL`,
    `ALTER TABLE news ADD COLUMN where_location VARCHAR(500) NULL`,
    `ALTER TABLE news ADD COLUMN who_participants TEXT NULL`,
    `ALTER TABLE news ADD COLUMN why_purpose TEXT NULL`,
    `ALTER TABLE news ADD COLUMN how_process TEXT NULL`,
    `ALTER TABLE news ADD COLUMN ai_generated TINYINT(1) DEFAULT 0`,
    `ALTER TABLE news ADD COLUMN ai_prompt TEXT NULL`,
    `ALTER TABLE news ADD COLUMN likes_count INT DEFAULT 0`,
    `ALTER TABLE news ADD COLUMN shares_count INT DEFAULT 0`,
    `ALTER TABLE news ADD COLUMN views_count INT DEFAULT 0`,
    // Create news_interactions table
    `CREATE TABLE IF NOT EXISTS news_interactions (
      id INT PRIMARY KEY AUTO_INCREMENT,
      news_id INT NOT NULL,
      interaction_type ENUM('view', 'like', 'share') NOT NULL,
      user_ip VARCHAR(100) NOT NULL DEFAULT '0.0.0.0',
      user_agent TEXT NULL,
      user_session VARCHAR(255) NOT NULL DEFAULT '',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_news_interactions_news_id (news_id),
      INDEX idx_news_interactions_type (interaction_type),
      INDEX idx_news_interactions_session (user_session(64)),
      FOREIGN KEY (news_id) REFERENCES news(id) ON DELETE CASCADE
    )`
  ],
  '046_insert_ketua_wilayah_faqs': [
    `INSERT INTO chatbot_faqs (question, answer, category, keywords, is_active) VALUES 
('Siapa saja ketua wilayah di Paroki St. Paulus Juanda?', 'Berikut adalah daftar Ketua Wilayah di Paroki St. Paulus Juanda:\n- Wilayah Simon: Petrus Tri Dhanny Yuniarto\n- Wilayah Petrus: Ferdinandus Jerry Yuniarto\n- Wilayah Theresia: Alfonsus Asfriyono Eko Pramono\n- Wilayah Bartolomeus: Raden Tarsisius Haryo Kusuma\n- Wilayah Yakobus: Yohanes Sukimin\n- Wilayah Maria Regina: F.X. Arief Witjaksono\n- Wilayah Fransiskus Asisi: Maria Anna Widjaja\n- Wilayah Vincentius a Paulo: Andreas Suroso', 'parish_info', '["ketua", "wilayah", "daftar wilayah", "pengurus wilayah"]', 1),
('Siapa ketua wilayah dan lingkungan di Wilayah Simon?', 'Berikut adalah daftar pengurus di Wilayah Simon:\n- Ketua Wilayah: Petrus Tri Dhanny Yuniarto\n- Ketua Lingkungan Simon 1: John Berty P.\n- Ketua Lingkungan Simon 2: Michael Arimono\n- Ketua Lingkungan Simon 3: Cecilia Maria Retno K.\n- Ketua Lingkungan Simon 4: Fransiskus Tambing\n- Ketua Lingkungan Simon 5: Markus Tri Wibowo\n- Ketua Lingkungan Simon 6: Gregorius Yahya Frank Hendarto\n- Ketua Lingkungan Petrus 7: F.A. Christian Billy', 'parish_info', '["ketua", "wilayah simon", "lingkungan simon", "simon"]', 1),
('Siapa ketua wilayah dan lingkungan di Wilayah Petrus?', 'Berikut adalah daftar pengurus di Wilayah Petrus:\n- Ketua Wilayah: Ferdinandus Jerry Yuniarto\n- Ketua Lingkungan Petrus 1: Yohanes Rusbiyanto\n- Ketua Lingkungan Petrus 2: Albertus Daru D.\n- Ketua Lingkungan Petrus 3: Florentinus Firman Wijayanto\n- Ketua Lingkungan Petrus 4: Fransiskus Gunarso\n- Ketua Lingkungan Petrus 5: Gregorius Wahyu Yoga Purwoko\n- Ketua Lingkungan Petrus 6: Bonaventura Suyanto', 'parish_info', '["ketua", "wilayah petrus", "lingkungan petrus", "petrus"]', 1),
('Siapa ketua wilayah dan lingkungan di Wilayah Theresia?', 'Berikut adalah daftar pengurus di Wilayah Theresia:\n- Ketua Wilayah: Alfonsus Asfriyono Eko Pramono\n- Ketua Lingkungan Theresia 1: Eduardus Adi\n- Ketua Lingkungan Theresia 2: Fransiscus Tito Dekaduanto\n- Ketua Lingkungan Theresia 3: Domitilla Arie Ferinawati Kusnamyah\n- Ketua Lingkungan Theresia 4: Fransiscus Xaverius Sularno\n- Ketua Lingkungan Theresia 5: Ignatius Loyola Hendro Siswanto\n- Ketua Lingkungan Theresia 6: Maria Poppy Aritha\n- Ketua Lingkungan Theresia 7: F.X. Galih Priyo Pamungkas\n- Ketua Lingkungan Theresia 8: Yoseph Nahak Seran', 'parish_info', '["ketua", "wilayah theresia", "lingkungan theresia", "theresia"]', 1),
('Siapa ketua wilayah dan lingkungan di Wilayah Bartolomeus?', 'Berikut adalah daftar pengurus di Wilayah Bartolomeus:\n- Ketua Wilayah: Raden Tarsisius Haryo Kusuma\n- Ketua Lingkungan Bartolomeus 1: Alexy Michaelov Woga\n- Ketua Lingkungan Bartolomeus 2: Robertus Sales Cundawan\n- Ketua Lingkungan Bartolomeus 3: Stefanus Isda Pambudi\n- Ketua Lingkungan Bartolomeus 4: Gregorius Tri Mei', 'parish_info', '["ketua", "wilayah bartolomeus", "lingkungan bartolomeus", "bartolomeus"]', 1),
('Siapa ketua wilayah dan lingkungan di Wilayah Yakobus?', 'Berikut adalah daftar pengurus di Wilayah Yakobus:\n- Ketua Wilayah: Yohanes Sukimin\n- Ketua Lingkungan Yakobus 1: Viktor Armando Y.L.K.\n- Ketua Lingkungan Yakobus 2: Cicilia Winarti Handrayani\n- Ketua Lingkungan Yakobus 3: Yoseph Nico Gunawan', 'parish_info', '["ketua", "wilayah yakobus", "lingkungan yakobus", "yakobus"]', 1),
('Siapa ketua wilayah dan lingkungan di Wilayah Maria Regina?', 'Berikut adalah daftar pengurus di Wilayah Maria Regina:\n- Ketua Wilayah: F.X. Arief Witjaksono\n- Ketua Lingkungan Maria Regina 1: Fransisco Budi Sugitantono\n- Ketua Lingkungan MR 2: Tarsisius Taryanto\n- Ketua Lingkungan MR 3: Roserius Astovo', 'parish_info', '["ketua", "wilayah maria regina", "lingkungan maria regina", "maria regina", "mr"]', 1),
('Siapa ketua wilayah dan lingkungan di Wilayah Fransiskus Asisi?', 'Berikut adalah daftar pengurus di Wilayah Fransiskus Asisi:\n- Ketua Wilayah: Maria Anna Widjaja\n- Ketua Lingkungan Fransiskus Asisi 1: Diego Arief Budiyanto\n- Ketua Lingkungan Fransiskus Asisi 2: Agustina Sriwurudju\n- Ketua Lingkungan Fransiskus Asisi 3: Franciscus Pranoto', 'parish_info', '["ketua", "wilayah fransiskus asisi", "lingkungan fransiskus asisi", "fransiskus asisi", "asisi"]', 1),
('Siapa ketua wilayah dan lingkungan di Wilayah Vincentius a Paulo?', 'Berikut adalah daftar pengurus di Wilayah Vincentius a Paulo:\n- Ketua Wilayah: Andreas Suroso\n- Ketua Lingkungan Vincentius a Paulo 1: Augustinus Vishnu Danardono\n- Ketua Lingkungan Vincentius a Paulo 2: Augustinus Willem Albert\n- Ketua Lingkungan Vincentius a Paulo 3: Yohanes Bagus Yudantyo\n- Ketua Lingkungan Vincentius a Paulo 4: Melani Werdiarso', 'parish_info', '["ketua", "wilayah vincentius a paulo", "lingkungan vincentius a paulo", "vincentius a paulo", "vincentius"]', 1)`
  ],
  '047_insert_dpp_pengurus_faqs': [
    `INSERT INTO chatbot_faqs (question, answer, category, keywords, is_active) VALUES 
('Siapa saja Pengurus Inti DPP Paroki St. Paulus Juanda?', 'Berikut adalah daftar Pengurus Inti DPP (Dewan Pastoral Paroki):\n- Ketua Umum: RD. Ignatius Kaderi\n- Wakil Ketua: RD. Matheus Juli\n- Sekretaris I: Silvester Miko Agung Prasetyo\n- Sekretaris II: Michael Trikartika Heri Wardhana\n- Bendahara I: Brigita Asriani\n- Bendahara II: Antonius Sugihartono\n- Bendahara III: Patricia Wahioe Moelandari', 'parish_info', '["pengurus inti", "dpp", "ketua umum", "sekretaris", "bendahara", "dewan pastoral paroki"]', 1),
('Siapa pengurus Bidang Pembinaan di DPP?', 'Berikut adalah susunan pengurus Bidang Pembinaan:\n- Ketua Bidang Pembinaan: Laurentia Elalia Sulis Setyawati\n- Sekretaris Bidang Pembinaan: Yosafat Susiadi\n\nSeksi Keluarga:\n- Aloysius Tony Soebjono\n- Maria Roesdiana Siharianti\n- Nikolas Ardianto Kusumawardhana\n- Chatarina LaboureSri Indrawati Salim\n\nSeksi BIAK:\n- Margarita Novi Kristiyani\n- Agnes Fransisca K.\n\nSeksi REKAT:\n- Theresia Arina Kristyaningsih\n- Brigitta Puji Ardhana Reswari\n\nSeksi OMK:\n- Christofera Marlina Junaedi\n- Yohanes Dwi Yunianto\n- Yosephus Widyawan\n\nSeksi Lansia:\n- Antonius Djoko Sumaryanto\n- Yohanes Capistrano Budi Iswanto', 'parish_info', '["bidang pembinaan", "seksi keluarga", "seksi biak", "seksi rekat", "seksi omk", "seksi lansia"]', 1),
('Siapa pengurus Bidang Sumber di DPP?', 'Berikut adalah susunan pengurus Bidang Sumber:\n- Ketua Bidang Sumber: Teresa Indah Rukmini\n- Sekretaris Bidang Sumber: Vincensius Heri Dwi Oprasetyo\n\nSeksi Katekese:\n- Laurensius Babo\n- Aloysius Tugiyo Pranoto\n\nSeksi Kerasulan Kitab Suci:\n- Vinansius Seran\n- Marissa Hosbach\n\nSeksi Liturgi:\n- Lukas Arisono\n- Endrika Luh Ayu Sulistyanti P.R.\n- Bernadeth Fransisca Hendrojono (Lektor)\n- Fransisca Desi Ika Dewanti (Pemazmur)\n- Agustina Wahyu Budiyati (Koor & Dirigen)\n- Giovannio Andrian Soares De Jesus (Misdinar)\n- F.X. Tri Widjayanto (Organis)\n- Maria Erlina Magdalena (Bunga Altar)', 'parish_info', '["bidang sumber", "seksi katekese", "kerasulan kitab suci", "seksi liturgi", "lektor", "pemazmur", "koor", "dirigen", "misdinar", "organis", "bunga altar"]', 1),
('Siapa pengurus Bidang Kerasulan Khusus di DPP?', 'Berikut adalah susunan pengurus Bidang Kerasulan Khusus:\n- Ketua Bidang Kerasulan Khusus: Andri Kurniawan\n- Sekretaris Bidang Kerasulan Khusus: Lusia Permata Sari Hartani\n\nKarya Misioner:\n- Ignatius Jaka Mulyana\n- Dominique Wahyu Pradana\n\nPendidikan:\n- Maria Magdalena Kariyatun\n- Elisabeth Budi Pihatningsih\n\nKomunikasi Sosial (Komsos):\n- Aurelia Margaretha Debby\n- Fransiscus Apris Dwiharta\n\nLainnya:\n- Ethaviana Suchnistyani', 'parish_info', '["bidang kerasulan khusus", "karya misioner", "pendidikan", "komunikasi sosial", "komsos"]', 1),
('Siapa pengurus Bidang Kerasulan Umum di DPP?', 'Berikut adalah susunan pengurus Bidang Kerasulan Umum:\n- Ketua Bidang Kerasulan Umum: Yosef Arpo Trilaksono\n- Sekretaris Bidang Kerasulan Umum: Norbertus Puger Luxeto\n\nPHUBB:\n- Matheus Wahyu Hardani\n- Andreas Bambang Eko Endryatno\n- Yohanes I Dewa Gde Dharmajaya\n\nKomisi PSE:\n- Cornelius Suminto Gondo\n- Agnes Dian Amurwani Tyas Utami', 'parish_info', '["bidang kerasulan umum", "phubb", "komisi pse", "pse"]', 1)`
  ],
  '034_add_quota_settings': [
    // Add is_unlimited and monthly_quota columns to user_categories
    `ALTER TABLE user_categories ADD COLUMN is_unlimited BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'TRUE = no monthly booking limit (DPP/BGKP)'`,
    `ALTER TABLE user_categories ADD COLUMN monthly_quota INT NOT NULL DEFAULT 3 COMMENT 'Max bookings per calendar month'`,
    `ALTER TABLE user_categories ADD INDEX idx_user_categories_is_unlimited (is_unlimited)`,
    // Add per-user quota override columns to users
    `ALTER TABLE users ADD COLUMN monthly_quota_override INT DEFAULT NULL COMMENT 'NULL = use category default. Set by Super Admin per user.'`,
    `ALTER TABLE users ADD COLUMN quota_is_unlimited_override BOOLEAN DEFAULT NULL COMMENT 'NULL = use category default. Override unlimited status per user.'`,
    `ALTER TABLE users ADD INDEX idx_users_quota_override (monthly_quota_override)`,
    // Seed DPP and BGKP categories as unlimited
    `UPDATE user_categories SET is_unlimited = TRUE, monthly_quota = 999 WHERE UPPER(name) IN ('PARISH_COUNCIL','CATEGORICAL_GROUP','DPP','BGKP','DEWAN PASTORAL PAROKI','BADAN GEREJA KATOLIK PAROKI')`
  ],
  '035_add_kontributor_role': [
    `INSERT IGNORE INTO roles (name, display_name, description) VALUES ('kontributor_berita', 'Kontributor Berita', 'Bisa membuat draft berita tapi tidak bisa mempublikasikannya langsung')`,
    // Safe: migration runner already catches 'Duplicate column name' and skips
    `ALTER TABLE news ADD COLUMN author_id INT NULL AFTER author`,
    // Safe: migration runner already catches 'Duplicate foreign key' and skips
    `ALTER TABLE news ADD CONSTRAINT fk_news_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL`
  ]
}

export default defineEventHandler(async (event) => {
  // Only super_admin
  const decoded = requireAuth(event)
  const user = await runQuery('SELECT role FROM users WHERE id = ? LIMIT 1', [decoded.userId]) as any[]
  const userRole = Array.isArray(user) ? user[0]?.role : (user as any)?.role
  if (userRole !== 'super_admin') {
    throw createError({ statusCode: 403, statusMessage: 'Hanya super_admin yang dapat menjalankan migration' })
  }

  const body = await readBody(event)
  const { migration } = body

  if (!migration || !MIGRATIONS[migration]) {
    throw createError({
      statusCode: 400,
      statusMessage: `Migration tidak dikenal. Tersedia: ${Object.keys(MIGRATIONS).join(', ')}`
    })
  }

  const statements = MIGRATIONS[migration]
  const results: { statement: string; status: string; error?: string }[] = []

  for (const statement of statements) {
    try {
      await runQuery(statement)
      results.push({ statement: statement.slice(0, 80) + (statement.length > 80 ? '...' : ''), status: 'ok' })
    } catch (err: any) {
      const msg: string = err?.message || ''
      const alreadyExists =
        msg.includes('Duplicate column name') ||
        msg.includes('Duplicate key name') ||
        msg.includes('already exists') ||
        msg.includes('Duplicate foreign key')

      if (alreadyExists) {
        results.push({ statement: statement.slice(0, 80) + '...', status: 'skipped (already exists)' })
      } else {
        results.push({ statement: statement.slice(0, 80) + '...', status: 'error', error: msg })
        return { success: false, message: `Migration gagal: ${msg}`, results }
      }
    }
  }

  console.log(`[Migration] ${migration} selesai`, results)
  return { success: true, message: `Migration "${migration}" berhasil dijalankan`, results }
})

