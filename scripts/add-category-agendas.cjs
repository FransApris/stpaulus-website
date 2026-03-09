const mysql = require('mysql2/promise');

async function addCategoryAgendas() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'pressgk31',
      database: 'stpaulus_cms_db'
    });

    console.log('📅 Menambahkan 5 agenda untuk setiap kategori...\n');

    const agendaData = [
      // Kategori 1: Rapat
      {
        category_id: 1,
        agendas: [
          {
            title: 'Rapat Dewan Pastoral Paroki',
            description: 'Rapat rutin Dewan Pastoral Paroki membahas program kerja triwulan II tahun 2026, evaluasi kegiatan yang telah berjalan, dan perencanaan kegiatan mendatang.',
            start_date: new Date('2026-03-15 19:00:00'),
            end_date: new Date('2026-03-15 21:00:00'),
            location: 'Ruang Pertemuan Pastoran',
            contact_person: 'Ketua DPP (081234567890)'
          },
          {
            title: 'Rapat Koordinasi Seksi Liturgi',
            description: 'Koordinasi petugas liturgi dan perencanaan perayaan Tritunggal Mahakudus, pembagian jadwal petugas misa, dan evaluasi tata cara perayaan liturgi.',
            start_date: new Date('2026-04-05 15:00:00'),
            end_date: new Date('2026-04-05 17:00:00'),
            location: 'Sekretariat Paroki',
            contact_person: 'Koordinator Liturgi (081345678901)'
          },
          {
            title: 'Rapat Pengurus OMK Paroki',
            description: 'Rapat pengurus Orang Muda Katolik (OMK) membahas kegiatan bulan Mei, persiapan rekoleksi OMK, dan program pembinaan iman kaum muda.',
            start_date: new Date('2026-04-20 16:00:00'),
            end_date: new Date('2026-04-20 18:00:00'),
            location: 'Aula Gereja St. Paulus',
            contact_person: 'Ketua OMK (082345678912)'
          },
          {
            title: 'Rapat Komisi Seminari & Hidup Bakti',
            description: 'Rapat koordinasi komisi seminari membahas program pendampingan calon imam, kunjungan seminaris, dan doa bersama untuk panggilan hidup bakti.',
            start_date: new Date('2026-05-10 14:00:00'),
            end_date: new Date('2026-05-10 16:00:00'),
            location: 'Ruang Pertemuan Pastoran',
            contact_person: 'Komisi Seminari (083456789123)'
          },
          {
            title: 'Rapat Evaluasi Keuangan Paroki',
            description: 'Rapat evaluasi keuangan semester I tahun 2026, transparansi penggunaan dana kolekte, laporan keuangan, dan perencanaan anggaran semester II.',
            start_date: new Date('2026-06-28 19:00:00'),
            end_date: new Date('2026-06-28 21:30:00'),
            location: 'Ruang Pertemuan Pastoran',
            contact_person: 'Bendahara Paroki (084567891234)'
          }
        ]
      },
      // Kategori 2: Perayaan Ekaristi
      {
        category_id: 2,
        agendas: [
          {
            title: 'Misa Pesta Santo Yosef (Pelindung Gereja Universal)',
            description: 'Perayaan Pesta Santo Yosef, pelindung para pekerja dan kepala keluarga. Misa Syukur khusus untuk para kepala keluarga dan pekerja paroki.',
            start_date: new Date('2026-03-19 18:00:00'),
            end_date: new Date('2026-03-19 19:30:00'),
            location: 'Gereja St. Paulus Juanda',
            contact_person: 'Sekretariat Paroki (031-1234567)'
          },
          {
            title: 'Misa Kamis Putih - Perjamuan Terakhir',
            description: 'Perayaan Kamis Putih mengenang Perjamuan Terakhir Yesus dengan para rasul, imamat, dan Ekaristi. Dilanjutkan adorasi hingga tengah malam.',
            start_date: new Date('2026-04-02 19:00:00'),
            end_date: new Date('2026-04-02 21:00:00'),
            location: 'Gereja St. Paulus Juanda',
            contact_person: 'Romo Paroki (031-1234567)'
          },
          {
            title: 'Perayaan Jalan Salib - Jumat Agung',
            description: 'Liturgi Jumat Agung: Ibadat Sabda, penghormatan Salib, dan komuni kudus. Mengenang sengsara dan wafat Yesus Kristus di kayu salib.',
            start_date: new Date('2026-04-03 15:00:00'),
            end_date: new Date('2026-04-03 17:00:00'),
            location: 'Gereja St. Paulus Juanda',
            contact_person: 'Romo Paroki (031-1234567)'
          },
          {
            title: 'Misa Malam Paskah - Vigili Paskah',
            description: 'Puncak perayaan liturgis tahunan: pemberkatan api baru, lilin Paskah, liturgi sabda, liturgi baptis, dan liturgi Ekaristi. Perayaan kebangkitan Kristus.',
            start_date: new Date('2026-04-04 20:00:00'),
            end_date: new Date('2026-04-04 22:30:00'),
            location: 'Gereja St. Paulus Juanda',
            contact_person: 'Romo Paroki (031-1234567)'
          },
          {
            title: 'Misa Pentakosta - Turunnya Roh Kudus',
            description: 'Perayaan Pentakosta mengenang turunnya Roh Kudus kepada para rasul. Misa Syukur dengan pembaharuan janji baptis dan pengutusan umat.',
            start_date: new Date('2026-05-24 08:00:00'),
            end_date: new Date('2026-05-24 09:30:00'),
            location: 'Gereja St. Paulus Juanda',
            contact_person: 'Sekretariat Paroki (031-1234567)'
          }
        ]
      },
      // Kategori 3: Kegiatan (sudah banyak dari katekese, tambah yang berbeda)
      {
        category_id: 3,
        agendas: [
          {
            title: 'Ziarah Keluarga ke Gua Maria Sendang Sono',
            description: 'Ziarah keluarga Katolik ke Gua Maria Sendang Sono, Kalibawang, Kulon Progo. Doa bersama, misa di gua, dan sharing keluarga Katolik.',
            start_date: new Date('2026-05-02 05:00:00'),
            end_date: new Date('2026-05-02 18:00:00'),
            location: 'Gua Maria Sendang Sono (meeting point: parkiran gereja)',
            contact_person: 'Koordinator Ziarah (081234111222)'
          },
          {
            title: 'Rekoleksi Wanita Katolik Paroki',
            description: 'Rekoleksi tahunan Wanita Katolik dengan tema "Maria, Teladan Wanita Beriman". Renungan, sharing, dan komitmen menjadi saksi Kristus dalam keluarga.',
            start_date: new Date('2026-05-16 08:00:00'),
            end_date: new Date('2026-05-16 15:00:00'),
            location: 'Wisma Retreat Sanggar Agung',
            contact_person: 'Ketua Wanita Katolik (082345111333)'
          },
          {
            title: 'Lomba Paduan Suara Antar Wilayah',
            description: 'Lomba paduan suara tingkat paroki antar 12 wilayah. Lagu wajib dan lagu pilihan bertema liturgi. Pembinaan talenta dan kebersamaan umat.',
            start_date: new Date('2026-06-14 13:00:00'),
            end_date: new Date('2026-06-14 17:00:00'),
            location: 'Aula Gereja St. Paulus',
            contact_person: 'Koordinator Musik Liturgi (083456111444)'
          },
          {
            title: 'Donor Darah Paroki St. Paulus',
            description: 'Kegiatan bakti sosial donor darah bekerja sama dengan PMI. Terbuka untuk umum. Berbagi kehidupan untuk sesama yang membutuhkan.',
            start_date: new Date('2026-07-12 08:00:00'),
            end_date: new Date('2026-07-12 12:00:00'),
            location: 'Halaman Gereja St. Paulus',
            contact_person: 'Sie Sosial Paroki (084567111555)'
          },
          {
            title: 'Camp Anak Sekolah Minggu',
            description: 'Perkemahan anak sekolah minggu untuk kelas 4-6 SD. Kegiatan outbound, pendalaman iman, games, dan pembentukan karakter Katolik.',
            start_date: new Date('2026-07-25 14:00:00'),
            end_date: new Date('2026-07-26 15:00:00'),
            location: 'Kampoeng Djowo Sekatul (2 hari 1 malam)',
            contact_person: 'Ketua Sekolah Minggu (085678111666)'
          }
        ]
      },
      // Kategori 4: Baptis
      {
        category_id: 4,
        agendas: [
          {
            title: 'Pembaptisan Anak Periode Maret 2026',
            description: 'Sakramen Baptis untuk bayi dan anak-anak usia 0-7 tahun yang telah mengikuti katekese baptis. Orang tua dan wali baptis wajib hadir.',
            start_date: new Date('2026-03-22 10:00:00'),
            end_date: new Date('2026-03-22 11:30:00'),
            location: 'Gereja St. Paulus Juanda',
            contact_person: 'Seksi Sakramen (031-1234567)'
          },
          {
            title: 'Pembaptisan Dewasa Vigili Paskah 2026',
            description: 'Sakramen Baptis, Krisma, dan Komuni Pertama untuk katekumen dewasa (RCIA). Puncak perjalanan iman calon Katolik dalam Malam Paskah.',
            start_date: new Date('2026-04-04 20:00:00'),
            end_date: new Date('2026-04-04 22:30:00'),
            location: 'Gereja St. Paulus Juanda',
            contact_person: 'Koordinator RCIA (081234222333)'
          },
          {
            title: 'Katekese Baptis Anak Periode April',
            description: 'Persiapan sakramen baptis untuk orang tua dan wali baptis. Penjelasan tentang makna baptis, tanggung jawab orang tua, dan liturgi baptis.',
            start_date: new Date('2026-04-12 15:00:00'),
            end_date: new Date('2026-04-12 17:00:00'),
            location: 'Aula Gereja St. Paulus',
            contact_person: 'Seksi Sakramen (031-1234567)'
          },
          {
            title: 'Pembaptisan Anak Periode Mei 2026',
            description: 'Sakramen Baptis untuk bayi dan anak-anak yang telah mengikuti persiapan. Pemberian nama baptis dan menyalakan lilin dari lilin Paskah.',
            start_date: new Date('2026-05-17 10:00:00'),
            end_date: new Date('2026-05-17 11:30:00'),
            location: 'Gereja St. Paulus Juanda',
            contact_person: 'Seksi Sakramen (031-1234567)'
          },
          {
            title: 'Reuni Katekumen & Anak Baptis',
            description: 'Pertemuan temu kangen para katekumen dewasa dan orang tua anak baptis. Sharing pengalaman hidup beriman setelah menerima sakramen baptis.',
            start_date: new Date('2026-06-21 16:00:00'),
            end_date: new Date('2026-06-21 18:00:00'),
            location: 'Aula Gereja St. Paulus',
            contact_person: 'Koordinator RCIA (081234222333)'
          }
        ]
      },
      // Kategori 5: Peristiwa Paroki
      {
        category_id: 5,
        agendas: [
          {
            title: 'Tahbisan Diakon Transisi',
            description: 'Perayaan sakramen tahbisan diakon transisi bagi seminaris Keuskupan Surabaya yang akan ditahbiskan menjadi imam. Doa syafaat bagi panggilan.',
            start_date: new Date('2026-08-15 09:00:00'),
            end_date: new Date('2026-08-15 12:00:00'),
            location: 'Katedral Hati Kudus Yesus Surabaya',
            contact_person: 'Komisi Seminari Paroki (083456789123)'
          },
          {
            title: 'Syukuran Perak Imamat Romo Paroki',
            description: 'Perayaan syukur 25 tahun imamat Pastor Kepala Paroki. Misa Syukur, doa bersama, dan makan bersama umat paroki sebagai ungkapan terima kasih.',
            start_date: new Date('2026-09-20 08:00:00'),
            end_date: new Date('2026-09-20 13:00:00'),
            location: 'Gereja & Halaman St. Paulus',
            contact_person: 'Panitia Syukuran (085678222777)'
          },
          {
            title: 'Kunjungan Uskup Keuskupan Surabaya',
            description: 'Kunjungan pastoral Uskup Keuskupan Surabaya ke Paroki St. Paulus. Misa bersama, dialog dengan umat, dan penguatan iman persekutuan Gereja.',
            start_date: new Date('2026-10-11 09:00:00'),
            end_date: new Date('2026-10-11 12:00:00'),
            location: 'Gereja St. Paulus Juanda',
            contact_person: 'Dewan Pastoral Paroki (081234567890)'
          },
          {
            title: 'Peresmian Gedung Sekretariat Baru',
            description: 'Pemberkatan dan peresmian gedung sekretariat paroki yang baru. Misa Syukur, pemberkatan gedung, dan open house sekretariat.',
            start_date: new Date('2026-11-01 10:00:00'),
            end_date: new Date('2026-11-01 13:00:00'),
            location: 'Gedung Sekretariat St. Paulus',
            contact_person: 'Sekretariat Paroki (031-1234567)'
          },
          {
            title: 'Penutupan Tahun Liturgi 2026',
            description: 'Perayaan penutupan tahun liturgi dengan misa syukur atas berkat sepanjang tahun. Evaluasi program pastoral dan persiapan tahun liturgi baru.',
            start_date: new Date('2026-11-29 18:00:00'),
            end_date: new Date('2026-11-29 20:00:00'),
            location: 'Gereja St. Paulus Juanda',
            contact_person: 'Dewan Pastoral Paroki (081234567890)'
          }
        ]
      },
      // Kategori 6: Krisma
      {
        category_id: 6,
        agendas: [
          {
            title: 'Pendaftaran Katekese Krisma 2026',
            description: 'Pembukaan pendaftaran calon penerima sakramen Krisma 2026 untuk remaja dan dewasa. Persyaratan: sudah dibaptis dan mengikuti katekese selama 6 bulan.',
            start_date: new Date('2026-03-01 08:00:00'),
            end_date: new Date('2026-03-31 16:00:00'),
            location: 'Sekretariat Paroki',
            contact_person: 'Seksi Sakramen (031-1234567)'
          },
          {
            title: 'Katekese Krisma Sesi 1: Roh Kudus',
            description: 'Katekese persiapan Krisma sesi pertama tentang Allah Tritunggal Mahakudus, pribadi dan karya Roh Kudus dalam Gereja dan kehidupan beriman.',
            start_date: new Date('2026-04-06 15:00:00'),
            end_date: new Date('2026-04-06 17:00:00'),
            location: 'Aula Gereja St. Paulus',
            contact_person: 'Koordinator Katekese Krisma (082345333444)'
          },
          {
            title: 'Retret Calon Krisma 2026',
            description: 'Retret krisma untuk calon penerima sakramen. Tema: Dipilih dan Diutus. Renungan, pengakuan dosa, sharing, dan pemantapan iman.',
            start_date: new Date('2026-09-19 08:00:00'),
            end_date: new Date('2026-09-19 16:00:00'),
            location: 'Wisma Samadi Gading',
            contact_person: 'Koordinator Katekese Krisma (082345333444)'
          },
          {
            title: 'Gladi Resik Upacara Krisma',
            description: 'Latihan upacara sakramen Krisma untuk calon penerima. Penjelasan liturgi, tata tertib, dan simulasi prosesi pengurapan oleh Uskup.',
            start_date: new Date('2026-10-17 14:00:00'),
            end_date: new Date('2026-10-17 16:00:00'),
            location: 'Gereja St. Paulus Juanda',
            contact_person: 'Seksi Liturgi (081345678901)'
          },
          {
            title: 'Sakramen Krisma 2026',
            description: 'Perayaan sakramen Krisma oleh Uskup Keuskupan Surabaya. Penguatan iman dan penerimaan karunia Roh Kudus untuk menjadi saksi Kristus.',
            start_date: new Date('2026-10-25 09:00:00'),
            end_date: new Date('2026-10-25 11:30:00'),
            location: 'Gereja St. Paulus Juanda',
            contact_person: 'Seksi Sakramen (031-1234567)'
          }
        ]
      }
    ];

    let totalSuccess = 0;
    let totalSkip = 0;

    for (const categoryData of agendaData) {
      const categoryId = categoryData.category_id;
      
      // Get category name
      const [categoryInfo] = await connection.query(
        'SELECT name, color FROM agenda_categories WHERE id = ?',
        [categoryId]
      );
      
      const categoryName = categoryInfo[0]?.name || `Kategori ${categoryId}`;
      console.log(`\n📂 ${categoryName}`);
      console.log('─'.repeat(60));

      for (const agenda of categoryData.agendas) {
        // Check if already exists
        const [existing] = await connection.query(
          'SELECT id FROM agendas WHERE title = ? AND DATE(start_date) = DATE(?)',
          [agenda.title, agenda.start_date]
        );

        if (existing.length > 0) {
          console.log(`   ⏭️  ${agenda.title} (sudah ada)`);
          totalSkip++;
          continue;
        }

        // Insert
        await connection.query(
          `INSERT INTO agendas 
          (title, description, start_date, end_date, location, category_id, contact_person) 
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            agenda.title,
            agenda.description,
            agenda.start_date,
            agenda.end_date,
            agenda.location,
            categoryId,
            agenda.contact_person
          ]
        );

        const dateStr = agenda.start_date.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
        console.log(`   ✅ ${agenda.title} (${dateStr})`);
        totalSuccess++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`📊 SUMMARY:`);
    console.log(`   ✅ Berhasil ditambahkan: ${totalSuccess} agenda`);
    console.log(`   ⏭️  Dilewati (sudah ada): ${totalSkip} agenda`);
    console.log(`   📂 Kategori yang diproses: 6 kategori`);
    console.log('='.repeat(60));

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    if (connection) await connection.end();
  }
}

addCategoryAgendas();
