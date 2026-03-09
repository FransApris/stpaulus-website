const mysql = require('mysql2/promise')
require('dotenv').config()

const faqs = [
    // KATEGORI: Jadwal Misa
    {
        question: "Jadwal misa hari Minggu?",
        answer: `Misa Hari Minggu di Gereja St. Paulus Juanda diadakan pada:
* Pagi: Pukul 07.00 dan 09.00 WIB
* Sore: Pukul 17.00 WIB

Mohon hadir 30 menit lebih awal untuk persiapan. Untuk informasi terbaru, silakan hubungi sekretariat paroki.`,
        category: "jadwal-misa",
        keywords: ["misa", "jadwal", "waktu", "minggu", "sunday"]
    },
    {
        question: "Kapan misa hari biasa/weekday?",
        answer: `Misa Harian (Senin-Sabtu) di Gereja St. Paulus Juanda:
* Pagi: Pukul 06.00 WIB
* Sore: Pukul 18.00 WIB (Kamis dan Jumat)

Jadwal dapat berubah pada hari raya khusus. Silakan cek pengumuman terbaru di gereja atau hubungi sekretariat.`,
        category: "jadwal-misa",
        keywords: ["misa", "harian", "weekday", "senin", "selasa", "rabu", "kamis", "jumat", "sabtu"]
    },
    {
        question: "Ada misa malam Minggu?",
        answer: `Ya, ada Misa Malam Minggu (Misa Sabtu Sore) di Gereja St. Paulus Juanda pada:
* Pukul 18.00 WIB setiap hari Sabtu

Misa Sabtu Sore ini sudah memenuhi kewajiban Misa Hari Minggu. Mohon hadir lebih awal untuk mendapatkan tempat duduk.`,
        category: "jadwal-misa",
        keywords: ["misa", "malam", "sabtu", "vigil", "sore"]
    },
    {
        question: "Berapa lama durasi misa?",
        answer: `Durasi misa di Gereja St. Paulus Juanda umumnya:
* Misa Hari Minggu: sekitar 60-90 menit
* Misa Harian: sekitar 45-60 menit

Durasi bisa lebih panjang pada misa khusus seperti Paskah, Natal, atau misa dengan sakramen (baptis, pernikahan, dll).`,
        category: "jadwal-misa",
        keywords: ["durasi", "lama", "misa", "waktu"]
    },

    // KATEGORI: Sakramen
    {
        question: "Bagaimana cara daftar baptis?",
        answer: `Untuk mendaftarkan Sakramen Baptis di Paroki St. Paulus Juanda:

1. **Syarat Dokumen:**
   * Surat keterangan lahir/Akta kelahiran
   * KTP orang tua
   * Surat keterangan calon wali baptis (KTP + surat dari paroki asal)

2. **Prosedur:**
   * Datang ke sekretariat paroki untuk mendaftar
   * Mengikuti kelas persiapan baptis (3-4 kali pertemuan)
   * Jadwal baptis: biasanya setiap bulan pada Minggu ke-4

Hubungi sekretariat untuk informasi jadwal pendaftaran dan kelas persiapan.`,
        category: "sakramen",
        keywords: ["baptis", "pembaptisan", "daftar", "bayi", "anak", "dewasa"]
    },
    {
        question: "Syarat pernikahan di gereja?",
        answer: `Syarat menikah di Gereja St. Paulus Juanda:

**Dokumen:**
* KTP & Kartu Keluarga
* Surat baptis (baru, max 6 bulan)
* Surat keterangan belum menikah dari kelurahan
* Surat keterangan dari paroki asal
* Surat keterangan calon saksi (2 orang)

**Persiapan:**
* Mengikuti kursus persiapan pernikahan (3-6 bulan sebelum pernikahan)
* Bimbingan perkawinan dengan pastor/diakon (minimal 3x pertemuan)
* Pengumuman pernikahan di gereja (3x berturut-turut)

**Waktu Pendaftaran:**
* Minimal 6 bulan sebelum tanggal pernikahan yang diinginkan

Silakan hubungi sekretariat untuk jadwal kursus persiapan pernikahan.`,
        category: "sakramen",
        keywords: ["nikah", "pernikahan", "perkawinan", "menikah", "wedding", "syarat"]
    },
    {
        question: "Kapan jadwal pengakuan dosa?",
        answer: `Jadwal Sakramen Pengakuan Dosa (Rekonsiliasi) di Gereja St. Paulus Juanda:

**Jadwal Rutin:**
* Setiap hari Sabtu: Pukul 16.00 - 17.30 WIB (sebelum misa sore)
* Setiap hari Minggu: 30 menit sebelum misa (pagi dan sore)

**Masa Khusus:**
* Masa Adven & Prapaskah: ada jadwal tambahan
* Di luar jadwal: bisa menghubungi pastor untuk appointment

Lokasi: Di ruang pengakuan dosa (confession booth) di samping gereja.`,
        category: "sakramen",
        keywords: ["pengakuan", "dosa", "rekonsiliasi", "konfesi", "tobat"]
    },
    {
        question: "Bagaimana cara komuni pertama?",
        answer: `Persiapan Komuni Pertama Anak di Paroki St. Paulus Juanda:

**Syarat:**
* Anak sudah dibaptis
* Usia minimal: sekitar 7-8 tahun (kelas 2-3 SD)
* Sudah mengikuti kelas Bina Iman Anak (BIA)

**Tahapan:**
1. Mendaftar di sekretariat paroki (biasanya di awal tahun ajaran)
2. Mengikuti kelas persiapan komuni (6-12 bulan)
3. Retret/rekoleksi sebelum komuni pertama
4. Perayaan Komuni Pertama (biasanya di bulan Mei-Juni)

**Untuk Orang Dewasa:**
* Mengikuti program katekumen/RCIA
* Persiapan lebih intensif sebelum menerima komuni

Hubungi koordinator Bina Iman Anak (BIA) di sekretariat untuk info pendaftaran.`,
        category: "sakramen",
        keywords: ["komuni", "ekaristi", "pertama", "anak", "BIA"]
    },
    {
        question: "Bagaimana prosedur krisma/penguatan?",
        answer: `Persiapan Sakramen Krisma di Paroki St. Paulus Juanda:

**Syarat:**
* Sudah dibaptis dan sudah komuni pertama
* Usia minimal: remaja kelas 8 SMP atau dewasa
* Sudah mengikuti kelas bina iman

**Tahapan:**
1. Mendaftar di sekretariat paroki
2. Mengikuti kelas persiapan krisma (6-12 bulan)
3. Memilih nama pelindung krisma
4. Menentukan wali krisma (harus sudah krisma)
5. Retret/rekoleksi sebelum krisma
6. Perayaan Krisma (biasanya dipimpin oleh Uskup, 1-2x setahun)

Pendaftaran biasanya dibuka di awal tahun. Hubungi sekretariat untuk jadwal dan informasi lengkap.`,
        category: "sakramen",
        keywords: ["krisma", "penguatan", "confirmation", "remaja", "dewasa"]
    },

    // KATEGORI: Informasi Paroki
    {
        question: "Dimana alamat Gereja St. Paulus?",
        answer: `Alamat Gereja St. Paulus Juanda:

**Alamat Lengkap:**
Jl. Juanda No. 10
Kelurahan [nama kelurahan]
Kecamatan [nama kecamatan]
Kota/Kabupaten [nama kota]
Kode Pos: [kode pos]

**Kontak:**
* Telepon: (021) XXX-XXXX
* Email: info@stpaulus-juanda.org
* Website: www.stpaulus-juanda.org

**Jam Buka Sekretariat:**
* Senin - Jumat: 08.00 - 16.00 WIB
* Sabtu: 08.00 - 13.00 WIB
* Minggu: Tutup (kecuali ada keperluan mendesak)

*Note: Silakan update dengan alamat lengkap yang sebenarnya`,
        category: "informasi-paroki",
        keywords: ["alamat", "lokasi", "dimana", "kontak", "telepon", "email", "sekretariat"]
    },
    {
        question: "Siapa pastor paroki?",
        answer: `Pastor Paroki St. Paulus Juanda:

**Pastor Kepala Paroki:**
* RD. [Nama Pastor Kepala]

**Pastor Rekan/Vikaris Paroki:**
* RD. [Nama Pastor Rekan]

**Diakon:**
* [Nama Diakon jika ada]

Untuk bertemu dengan pastor, silakan membuat janji terlebih dahulu melalui sekretariat paroki. Pastor tersedia untuk konseling, bimbingan rohani, dan keperluan pastoral lainnya.

*Note: Silakan update dengan nama pastor yang sebenarnya`,
        category: "informasi-paroki",
        keywords: ["pastor", "imam", "romo", "pemimpin", "paroki"]
    },
    {
        question: "Bagaimana sejarah Paroki St. Paulus?",
        answer: `Sejarah Paroki St. Paulus Juanda:

Paroki St. Paulus Juanda didirikan pada [tahun] sebagai bagian dari perkembangan umat Katolik di wilayah [nama wilayah]. 

**Tonggak Penting:**
* [Tahun]: Pendirian paroki
* [Tahun]: Pembangunan gedung gereja
* [Tahun]: Renovasi/perluasan gereja
* [Tahun]: Perayaan anniversary ke-[X]

Paroki ini dinamakan St. Paulus (Santo Rasul Paulus) sebagai pelindung, dengan motto "[motto paroki]".

**Wilayah Pelayanan:**
Paroki melayani umat Katolik di wilayah [sebutkan wilayah/kelurahan].

Untuk sejarah lengkap, silakan kunjungi website paroki atau museum paroki.

*Note: Silakan lengkapi dengan data sejarah yang sebenarnya`,
        category: "informasi-paroki",
        keywords: ["sejarah", "history", "berdiri", "didirikan", "santo paulus"]
    },
    {
        question: "Apa saja lingkungan di paroki ini?",
        answer: `Paroki St. Paulus Juanda terbagi dalam beberapa lingkungan (komunitas basis):

**Lingkungan-lingkungan:**
* Lingkungan 1: [Nama wilayah]
* Lingkungan 2: [Nama wilayah]
* Lingkungan 3: [Nama wilayah]
* Lingkungan 4: [Nama wilayah]
* Lingkungan 5: [Nama wilayah]

**Kegiatan Lingkungan:**
* Misa lingkungan (bulanan/sesuai jadwal)
* Doa rosario bersama
* Sharing Kitab Suci
* Kegiatan sosial dan pelayanan

Setiap lingkungan dipimpin oleh seorang ketua lingkungan dan memiliki jadwal kegiatan rutin. Untuk informasi lingkungan Anda, silakan hubungi sekretariat paroki.

*Note: Silakan sesuaikan dengan jumlah dan nama lingkungan yang sebenarnya`,
        category: "informasi-paroki",
        keywords: ["lingkungan", "wilayah", "komunitas", "basis", "KBG"]
    },
    {
        question: "Ada fasilitas apa di gereja?",
        answer: `Fasilitas di Gereja St. Paulus Juanda:

**Fasilitas Ibadah:**
* Gereja utama (kapasitas: [X] orang)
* Ruang adorasi/kapel
* Ruang pengakuan dosa
* Ruang sakramen

**Fasilitas Pendukung:**
* Aula/gedung pertemuan
* Ruang kelas untuk katekese
* Perpustakaan paroki
* Sekretariat paroki
* Parkir kendaraan
* Toilet
* Musholla (untuk non-Katolik)

**Fasilitas Pelayanan:**
* Ruang konseling
* Kantin/warung
* Toko buku rohani

Semua fasilitas dijaga dengan baik dan dapat digunakan oleh umat dengan izin dari sekretariat paroki.

*Note: Silakan sesuaikan dengan fasilitas yang benar-benar ada`,
        category: "informasi-paroki",
        keywords: ["fasilitas", "gedung", "ruangan", "parkir", "toilet", "aula"]
    },

    // KATEGORI: Kegiatan
    {
        question: "Kegiatan apa saja di paroki?",
        answer: `Kegiatan Rutin di Paroki St. Paulus Juanda:

**Kegiatan Harian/Mingguan:**
* Misa harian dan Minggu
* Doa Rosario (sebelum misa sore)
* Adorasi Sakramen Mahakudus
* Ibadat Sabda (berdasarkan jadwal)

**Kegiatan Bulanan:**
* Misa lingkungan
* Pertemuan kategorial (OMK, Wanita Katolik, Pria Katolik, dll)
* Kelas Bina Iman Anak (BIA)
* Kelas persiapan sakramen

**Kegiatan Tahunan:**
* Perayaan Paskah dan Natal
* Perayaan Santo Pelindung (St. Paulus - 29 Juni)
* Ziarah paroki
* Retret dan rekoleksi

**Kegiatan Sosial:**
* Kunjungan orang sakit
* Pelayanan kepada kaum miskin
* Bakti sosial

Untuk jadwal lengkap, cek papan pengumuman gereja atau website paroki.`,
        category: "kegiatan",
        keywords: ["kegiatan", "acara", "program", "jadwal", "event"]
    },
    {
        question: "Ada OMK (Orang Muda Katolik)?",
        answer: `Ya, ada komunitas Orang Muda Katolik (OMK) di Paroki St. Paulus Juanda!

**Kegiatan OMK:**
* Misa OMK (biasanya Minggu sore atau sebulan sekali)
* Sharing Kitab Suci untuk kaum muda
* Retret dan rekoleksi OMK
* Kegiatan sosial dan outbound
* Pelayanan liturgi (misdinar, paduan suara, lektor)
* Kegiatan kreativitas (band, drama, multimedia)

**Jadwal Pertemuan:**
* Pertemuan rutin: [hari & waktu]
* Lokasi: [ruang pertemuan/aula gereja]

**Syarat Bergabung:**
* Usia: remaja SMA hingga sekitar 35 tahun
* Beragama Katolik (sudah krisma lebih diutamakan)
* Memiliki semangat untuk berkarya bagi Gereja

Untuk informasi dan pendaftaran, hubungi sekretariat paroki atau koordinator OMK.

*Note: Silakan update dengan jadwal dan info kontak yang sebenarnya`,
        category: "kegiatan",
        keywords: ["OMK", "orang muda", "pemuda", "remaja", "youth", "mudika"]
    },
    {
        question: "Ada pelayanan untuk anak-anak?",
        answer: `Ya, ada beberapa pelayanan untuk anak-anak di Paroki St. Paulus Juanda:

**Bina Iman Anak (BIA):**
* Program katekese untuk anak usia SD
* Pertemuan: [hari & waktu]
* Materi: pengenalan iman Katolik, persiapan komuni pertama
* Dipandu oleh guru BIA yang terlatih

**Sekolah Minggu:**
* Kegiatan saat misa Minggu berlangsung
* Anak-anak diajarkan nilai-nilai iman dengan cara menyenangkan
* Aktivitas: cerita Alkitab, lagu rohani, kerajinan tangan, games

**Misdinar:**
* Pelayanan altar untuk anak laki-laki
* Pelatihan rutin setiap [hari & waktu]
* Belajar melayani dalam liturgi misa

**Paduan Suara Anak:**
* Latihan: [hari & waktu]
* Tampil saat misa anak atau acara khusus

Pendaftaran: Hubungi koordinator BIA atau sekretariat paroki.

*Note: Silakan update dengan jadwal yang sebenarnya`,
        category: "kegiatan",
        keywords: ["anak", "BIA", "sekolah minggu", "katekese", "komuni", "misdinar"]
    },
    {
        question: "Bagaimana cara menjadi misdinar?",
        answer: `Cara Menjadi Misdinar di Paroki St. Paulus Juanda:

**Syarat:**
* Beragama Katolik dan sudah komuni pertama
* Usia: minimal kelas 4 SD
* Bersedia mengikuti latihan rutin
* Mendapat izin dari orang tua
* Rajin mengikuti misa

**Prosedur Pendaftaran:**
1. Mendaftar di sekretariat paroki atau koordinator misdinar
2. Mengisi formulir pendaftaran
3. Mengikuti pelatihan dasar misdinar
4. Belajar tata cara pelayanan liturgi
5. Magang bersama misdinar senior
6. Dilantik secara resmi saat misa

**Kegiatan Misdinar:**
* Latihan rutin: [hari & waktu]
* Pembagian jadwal pelayanan misa
* Retret dan rekoleksi misdinar
* Kegiatan kebersamaan

**Manfaat:**
* Belajar melayani Tuhan dan Gereja
* Memahami liturgi misa lebih dalam
* Membentuk karakter dan disiplin
* Menjalin persahabatan

Hubungi koordinator misdinar untuk informasi pendaftaran.

*Note: Silakan update dengan jadwal yang sebenarnya`,
        category: "kegiatan",
        keywords: ["misdinar", "putra altar", "altar server", "pelayanan", "liturgi"]
    },
    {
        question: "Ada koor/paduan suara?",
        answer: `Ya, ada beberapa paduan suara di Paroki St. Paulus Juanda:

**Koor Paroki:**
* Koor Utama: melayani misa Minggu pagi
  - Latihan: [hari & waktu]
* Koor Malam: melayani misa Sabtu sore/Minggu sore
  - Latihan: [hari & waktu]
* Koor OMK: melayani misa khusus OMK
  - Latihan: [hari & waktu]
* Koor Anak: untuk anak-anak
  - Latihan: [hari & waktu]

**Cara Bergabung:**
1. Hubungi koordinator koor atau sekretariat
2. Mengikuti audisi sederhana (bisa baca not lebih bagus)
3. Bergabung dalam latihan rutin
4. Komitmen untuk latihan dan pelayanan

**Jadwal Pelayanan:**
* Misa rutin Minggu (sesuai pembagian jadwal)
* Misa-misa khusus (Paskah, Natal, pernikahan, dll)
* Perayaan besar Gereja

Tidak perlu suara bagus sekali, yang penting punya kemauan melayani Tuhan melalui musik dan nyanyian!

*Note: Silakan update dengan jadwal yang sebenarnya`,
        category: "kegiatan",
        keywords: ["koor", "paduan suara", "choir", "nyanyi", "musik", "song"]
    },
    {
        question: "Apakah ada persembahan untuk gereja?",
        answer: `Cara Memberikan Persembahan di Paroki St. Paulus Juanda:

**Jenis Persembahan:**

1. **Kolekte Misa:**
   - Diberikan saat misa berlangsung (amplop/kotak kolekte)
   - Untuk operasional paroki dan kegiatan pastoral

2. **Persepuluhan (10%):**
   - Persembahan rutin dari penghasilan (anjuran 10%)
   - Bisa per bulan atau sesuai kemampuan
   - Gunakan amplop khusus persepuluhan

3. **Intensi Misa:**
   - Untuk arwah, syukuran, atau intensi khusus
   - Hubungi sekretariat untuk booking
   - Sumbangan sesuai kemampuan (anjuran: Rp 50.000 - 100.000)

**Cara Menyumbang:**
* Tunai saat misa (amplop persembahan)
* Transfer bank:
  - Bank: [nama bank]
  - No. Rek: [nomor rekening]
  - A.n: Paroki St. Paulus Juanda
* Langsung ke sekretariat paroki

Semua persembahan akan digunakan untuk pelayanan gereja dan membantu sesama.

*Note: Silakan update dengan rekening bank yang sebenarnya`,
        category: "informasi-paroki",
        keywords: ["persembahan", "kolekte", "sumbangan", "persepuluhan", "donasi", "transfer"]
    },
    {
        question: "Bagaimana cara booking misa arwah?",
        answer: `Cara Booking Misa Arwah di Paroki St. Paulus Juanda:

**Prosedur:**
1. **Datang ke sekretariat paroki** (jam kerja)
2. **Isi formulir** dengan data:
   - Nama almarhum/almarhumah
   - Tanggal meninggal
   - Tanggal misa yang diinginkan
   - Nama pemohon dan kontak

3. **Pilih jenis misa:**
   - Misa arwah khusus (Requiem)
   - Misa harian/Minggu dengan intensi khusus

4. **Persembahan:**
   - Sesuai kemampuan (anjuran: Rp 50.000 - 300.000)
   - Tergantung jenis misa

**Ketentuan:**
* Booking minimal 1 minggu sebelumnya
* Untuk misa Minggu, booking lebih awal (bisa penuh)
* Bawa KK atau surat keterangan kematian (jika diminta)

**Informasi Misa:**
* Nama almarhum akan disebutkan saat misa
* Keluarga bisa hadir dan membawa foto almarhum
* Bisa minta kenang-kenangan untuk dibagikan

Untuk booking, hubungi sekretariat: [nomor telepon]

*Note: Silakan update nomor telepon yang sebenarnya`,
        category: "sakramen",
        keywords: ["misa arwah", "requiem", "meninggal", "almarhum", "booking", "intensi"]
    }
]

async function insertFAQs() {
    const conn = await mysql.createConnection({
        host: process.env.MYSQL_HOST || 'localhost',
        port: parseInt(process.env.MYSQL_PORT) || 3306,
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || '',
        database: process.env.MYSQL_DATABASE || 'stpaulus_cms_db'
    })

    console.log('\n🤖 MENAMBAHKAN FAQ CHATBOT')
    console.log('='.repeat(80))
    console.log(`\nTotal FAQ yang akan ditambahkan: ${faqs.length}\n`)

    let success = 0
    let skipped = 0

    for (const faq of faqs) {
        try {
            // Check if question already exists
            const [existing] = await conn.execute(
                'SELECT id FROM chatbot_faqs WHERE question = ?',
                [faq.question]
            )

            if (existing.length > 0) {
                console.log(`⏭️  Skip: "${faq.question}" (sudah ada)`)
                skipped++
                continue
            }

            // Insert new FAQ
            await conn.execute(
                `INSERT INTO chatbot_faqs (question, answer, category, keywords, is_active)
         VALUES (?, ?, ?, ?, ?)`,
                [
                    faq.question,
                    faq.answer,
                    faq.category,
                    JSON.stringify(faq.keywords),
                    true
                ]
            )

            console.log(`✅ Berhasil: "${faq.question}"`)
            success++

        } catch (error) {
            console.error(`❌ Error pada "${faq.question}": ${error.message}`)
        }
    }

    console.log('\n' + '='.repeat(80))
    console.log('\n📊 HASIL:')
    console.log(`✅ Berhasil ditambahkan: ${success}`)
    console.log(`⏭️  Dilewati (sudah ada): ${skipped}`)
    console.log(`❌ Gagal: ${faqs.length - success - skipped}`)

    // Show statistics
    const [stats] = await conn.execute(`
    SELECT 
      category,
      COUNT(*) as total
    FROM chatbot_faqs
    WHERE is_active = 1
    GROUP BY category
    ORDER BY category
  `)

    console.log('\n📂 STATISTIK PER KATEGORI:')
    stats.forEach(stat => {
        console.log(`   ${stat.category}: ${stat.total} FAQ`)
    })

    console.log('\n' + '='.repeat(80))
    console.log('✅ Selesai!\n')

    await conn.end()
}

insertFAQs().catch(err => {
    console.error('❌ Error:', err.message)
    process.exit(1)
})
