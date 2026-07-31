-- Migration 046: Insert FAQ Ketua Wilayah & Lingkungan

INSERT INTO chatbot_faqs (question, answer, category, keywords, is_active) VALUES 
(
  'Siapa saja ketua wilayah di Paroki St. Paulus Juanda?', 
  'Berikut adalah daftar Ketua Wilayah di Paroki St. Paulus Juanda:\n- Wilayah Simon: Petrus Tri Dhanny Yuniarto\n- Wilayah Petrus: Ferdinandus Jerry Yuniarto\n- Wilayah Theresia: Alfonsus Asfriyono Eko Pramono\n- Wilayah Bartolomeus: Raden Tarsisius Haryo Kusuma\n- Wilayah Yakobus: Yohanes Sukimin\n- Wilayah Maria Regina: F.X. Arief Witjaksono\n- Wilayah Fransiskus Asisi: Maria Anna Widjaja\n- Wilayah Vincentius a Paulo: Andreas Suroso', 
  'parish_info', 
  '["ketua", "wilayah", "daftar wilayah", "pengurus wilayah"]', 
  1
),
(
  'Siapa ketua wilayah dan lingkungan di Wilayah Simon?', 
  'Berikut adalah daftar pengurus di Wilayah Simon:\n- Ketua Wilayah: Petrus Tri Dhanny Yuniarto\n- Ketua Lingkungan Simon 1: John Berty P.\n- Ketua Lingkungan Simon 2: Michael Arimono\n- Ketua Lingkungan Simon 3: Cecilia Maria Retno K.\n- Ketua Lingkungan Simon 4: Fransiskus Tambing\n- Ketua Lingkungan Simon 5: Markus Tri Wibowo\n- Ketua Lingkungan Simon 6: Gregorius Yahya Frank Hendarto\n- Ketua Lingkungan Petrus 7: F.A. Christian Billy', 
  'parish_info', 
  '["ketua", "wilayah simon", "lingkungan simon", "simon"]', 
  1
),
(
  'Siapa ketua wilayah dan lingkungan di Wilayah Petrus?', 
  'Berikut adalah daftar pengurus di Wilayah Petrus:\n- Ketua Wilayah: Ferdinandus Jerry Yuniarto\n- Ketua Lingkungan Petrus 1: Yohanes Rusbiyanto\n- Ketua Lingkungan Petrus 2: Albertus Daru D.\n- Ketua Lingkungan Petrus 3: Florentinus Firman Wijayanto\n- Ketua Lingkungan Petrus 4: Fransiskus Gunarso\n- Ketua Lingkungan Petrus 5: Gregorius Wahyu Yoga Purwoko\n- Ketua Lingkungan Petrus 6: Bonaventura Suyanto', 
  'parish_info', 
  '["ketua", "wilayah petrus", "lingkungan petrus", "petrus"]', 
  1
),
(
  'Siapa ketua wilayah dan lingkungan di Wilayah Theresia?', 
  'Berikut adalah daftar pengurus di Wilayah Theresia:\n- Ketua Wilayah: Alfonsus Asfriyono Eko Pramono\n- Ketua Lingkungan Theresia 1: Eduardus Adi\n- Ketua Lingkungan Theresia 2: Fransiscus Tito Dekaduanto\n- Ketua Lingkungan Theresia 3: Domitilla Arie Ferinawati Kusnamyah\n- Ketua Lingkungan Theresia 4: Fransiscus Xaverius Sularno\n- Ketua Lingkungan Theresia 5: Ignatius Loyola Hendro Siswanto\n- Ketua Lingkungan Theresia 6: Maria Poppy Aritha\n- Ketua Lingkungan Theresia 7: F.X. Galih Priyo Pamungkas\n- Ketua Lingkungan Theresia 8: Yoseph Nahak Seran', 
  'parish_info', 
  '["ketua", "wilayah theresia", "lingkungan theresia", "theresia"]', 
  1
),
(
  'Siapa ketua wilayah dan lingkungan di Wilayah Bartolomeus?', 
  'Berikut adalah daftar pengurus di Wilayah Bartolomeus:\n- Ketua Wilayah: Raden Tarsisius Haryo Kusuma\n- Ketua Lingkungan Bartolomeus 1: Alexy Michaelov Woga\n- Ketua Lingkungan Bartolomeus 2: Robertus Sales Cundawan\n- Ketua Lingkungan Bartolomeus 3: Stefanus Isda Pambudi\n- Ketua Lingkungan Bartolomeus 4: Gregorius Tri Mei', 
  'parish_info', 
  '["ketua", "wilayah bartolomeus", "lingkungan bartolomeus", "bartolomeus"]', 
  1
),
(
  'Siapa ketua wilayah dan lingkungan di Wilayah Yakobus?', 
  'Berikut adalah daftar pengurus di Wilayah Yakobus:\n- Ketua Wilayah: Yohanes Sukimin\n- Ketua Lingkungan Yakobus 1: Viktor Armando Y.L.K.\n- Ketua Lingkungan Yakobus 2: Cicilia Winarti Handrayani\n- Ketua Lingkungan Yakobus 3: Yoseph Nico Gunawan', 
  'parish_info', 
  '["ketua", "wilayah yakobus", "lingkungan yakobus", "yakobus"]', 
  1
),
(
  'Siapa ketua wilayah dan lingkungan di Wilayah Maria Regina?', 
  'Berikut adalah daftar pengurus di Wilayah Maria Regina:\n- Ketua Wilayah: F.X. Arief Witjaksono\n- Ketua Lingkungan Maria Regina 1: Fransisco Budi Sugitantono\n- Ketua Lingkungan MR 2: Tarsisius Taryanto\n- Ketua Lingkungan MR 3: Roserius Astovo', 
  'parish_info', 
  '["ketua", "wilayah maria regina", "lingkungan maria regina", "maria regina", "mr"]', 
  1
),
(
  'Siapa ketua wilayah dan lingkungan di Wilayah Fransiskus Asisi?', 
  'Berikut adalah daftar pengurus di Wilayah Fransiskus Asisi:\n- Ketua Wilayah: Maria Anna Widjaja\n- Ketua Lingkungan Fransiskus Asisi 1: Diego Arief Budiyanto\n- Ketua Lingkungan Fransiskus Asisi 2: Agustina Sriwurudju\n- Ketua Lingkungan Fransiskus Asisi 3: Franciscus Pranoto', 
  'parish_info', 
  '["ketua", "wilayah fransiskus asisi", "lingkungan fransiskus asisi", "fransiskus asisi", "asisi"]', 
  1
),
(
  'Siapa ketua wilayah dan lingkungan di Wilayah Vincentius a Paulo?', 
  'Berikut adalah daftar pengurus di Wilayah Vincentius a Paulo:\n- Ketua Wilayah: Andreas Suroso\n- Ketua Lingkungan Vincentius a Paulo 1: Augustinus Vishnu Danardono\n- Ketua Lingkungan Vincentius a Paulo 2: Augustinus Willem Albert\n- Ketua Lingkungan Vincentius a Paulo 3: Yohanes Bagus Yudantyo\n- Ketua Lingkungan Vincentius a Paulo 4: Melani Werdiarso', 
  'parish_info', 
  '["ketua", "wilayah vincentius a paulo", "lingkungan vincentius a paulo", "vincentius a paulo", "vincentius"]', 
  1
);
