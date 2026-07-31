-- Migration 047: Insert FAQ Pengurus Inti dan Bidang DPP

INSERT INTO chatbot_faqs (question, answer, category, keywords, is_active) VALUES 
(
  'Siapa saja Pengurus Inti DPP Paroki St. Paulus Juanda?', 
  'Berikut adalah daftar Pengurus Inti DPP (Dewan Pastoral Paroki):\n- Ketua Umum: RD. Ignatius Kaderi\n- Wakil Ketua: RD. Matheus Juli\n- Sekretaris I: Silvester Miko Agung Prasetyo\n- Sekretaris II: Michael Trikartika Heri Wardhana\n- Bendahara I: Brigita Asriani\n- Bendahara II: Antonius Sugihartono\n- Bendahara III: Patricia Wahioe Moelandari', 
  'parish_info', 
  '["pengurus inti", "dpp", "ketua umum", "sekretaris", "bendahara", "dewan pastoral paroki"]', 
  1
),
(
  'Siapa pengurus Bidang Pembinaan di DPP?', 
  'Berikut adalah susunan pengurus Bidang Pembinaan:\n- Ketua Bidang Pembinaan: Laurentia Elalia Sulis Setyawati\n- Sekretaris Bidang Pembinaan: Yosafat Susiadi\n\nSeksi Keluarga:\n- Aloysius Tony Soebjono\n- Maria Roesdiana Siharianti\n- Nikolas Ardianto Kusumawardhana\n- Chatarina LaboureSri Indrawati Salim\n\nSeksi BIAK:\n- Margarita Novi Kristiyani\n- Agnes Fransisca K.\n\nSeksi REKAT:\n- Theresia Arina Kristyaningsih\n- Brigitta Puji Ardhana Reswari\n\nSeksi OMK:\n- Christofera Marlina Junaedi\n- Yohanes Dwi Yunianto\n- Yosephus Widyawan\n\nSeksi Lansia:\n- Antonius Djoko Sumaryanto\n- Yohanes Capistrano Budi Iswanto', 
  'parish_info', 
  '["bidang pembinaan", "seksi keluarga", "seksi biak", "seksi rekat", "seksi omk", "seksi lansia"]', 
  1
),
(
  'Siapa pengurus Bidang Sumber di DPP?', 
  'Berikut adalah susunan pengurus Bidang Sumber:\n- Ketua Bidang Sumber: Teresa Indah Rukmini\n- Sekretaris Bidang Sumber: Vincensius Heri Dwi Oprasetyo\n\nSeksi Katekese:\n- Laurensius Babo\n- Aloysius Tugiyo Pranoto\n\nSeksi Kerasulan Kitab Suci:\n- Vinansius Seran\n- Marissa Hosbach\n\nSeksi Liturgi:\n- Lukas Arisono\n- Endrika Luh Ayu Sulistyanti P.R.\n- Bernadeth Fransisca Hendrojono (Lektor)\n- Fransisca Desi Ika Dewanti (Pemazmur)\n- Agustina Wahyu Budiyati (Koor & Dirigen)\n- Giovannio Andrian Soares De Jesus (Misdinar)\n- F.X. Tri Widjayanto (Organis)\n- Maria Erlina Magdalena (Bunga Altar)', 
  'parish_info', 
  '["bidang sumber", "seksi katekese", "kerasulan kitab suci", "seksi liturgi", "lektor", "pemazmur", "koor", "dirigen", "misdinar", "organis", "bunga altar"]', 
  1
),
(
  'Siapa pengurus Bidang Kerasulan Khusus di DPP?', 
  'Berikut adalah susunan pengurus Bidang Kerasulan Khusus:\n- Ketua Bidang Kerasulan Khusus: Andri Kurniawan\n- Sekretaris Bidang Kerasulan Khusus: Lusia Permata Sari Hartani\n\nKarya Misioner:\n- Ignatius Jaka Mulyana\n- Dominique Wahyu Pradana\n\nPendidikan:\n- Maria Magdalena Kariyatun\n- Elisabeth Budi Pihatningsih\n\nKomunikasi Sosial (Komsos):\n- Aurelia Margaretha Debby\n- Fransiscus Apris Dwiharta\n\nLainnya:\n- Ethaviana Suchnistyani', 
  'parish_info', 
  '["bidang kerasulan khusus", "karya misioner", "pendidikan", "komunikasi sosial", "komsos"]', 
  1
),
(
  'Siapa pengurus Bidang Kerasulan Umum di DPP?', 
  'Berikut adalah susunan pengurus Bidang Kerasulan Umum:\n- Ketua Bidang Kerasulan Umum: Yosef Arpo Trilaksono\n- Sekretaris Bidang Kerasulan Umum: Norbertus Puger Luxeto\n\nPHUBB:\n- Matheus Wahyu Hardani\n- Andreas Bambang Eko Endryatno\n- Yohanes I Dewa Gde Dharmajaya\n\nKomisi PSE:\n- Cornelius Suminto Gondo\n- Agnes Dian Amurwani Tyas Utami', 
  'parish_info', 
  '["bidang kerasulan umum", "phubb", "komisi pse", "pse"]', 
  1
);
