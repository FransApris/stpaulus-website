const mysql = require('mysql2/promise');

async function addWeeklyCatechesis() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'pressgk31',
      database: 'stpaulus_cms_db'
    });

    console.log('📅 Menambahkan agenda Katekese Umum tahun 2026...\n');

    // Get all Saturdays in 2026
    const saturdays = [];
    const year = 2026;
    
    for (let month = 0; month < 12; month++) {
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      
      for (let day = firstDay.getDate(); day <= lastDay.getDate(); day++) {
        const date = new Date(year, month, day);
        if (date.getDay() === 6) { // Saturday = 6
          saturdays.push(date);
        }
      }
    }

    console.log(`✅ Ditemukan ${saturdays.length} hari Sabtu di tahun 2026\n`);

    // Category: Kegiatan (id: 3)
    const categoryId = 3;
    const location = 'Aula Gereja St. Paulus';
    const contactPerson = 'Sekretariat Paroki (031-1234567)';
    
    let successCount = 0;
    let skipCount = 0;

    for (let i = 0; i < saturdays.length; i++) {
      const saturday = saturdays[i];
      
      // Format dates for MySQL
      const startDate = new Date(saturday);
      startDate.setHours(16, 0, 0); // 16:00 (4 PM)
      
      const endDate = new Date(saturday);
      endDate.setHours(18, 0, 0); // 18:00 (6 PM) - 2 hour session
      
      const weekNumber = i + 1;
      const monthName = startDate.toLocaleString('id-ID', { month: 'long' });
      const dateString = startDate.toLocaleDateString('id-ID', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });

      // Create varied titles to make the agenda more interesting
      let title = '';
      let description = '';
      
      // Different themes throughout the year
      if (i < 5) {
        title = `Katekese Umum: Pengenalan Kitab Suci (Minggu ${weekNumber})`;
        description = `Katekese umum mingguan membahas pengenalan Kitab Suci, pentingnya Sabda Allah dalam kehidupan beriman, dan cara membaca Injil dengan benar. Terbuka untuk seluruh umat.`;
      } else if (i < 13) {
        title = `Katekese Umum: Sakramen-Sakramen Gereja (Minggu ${weekNumber})`;
        description = `Pembahasan mendalam tentang 7 Sakramen dalam Gereja Katolik, makna, dan pelaksanaannya dalam kehidupan beriman. Sesi interaktif dengan tanya jawab.`;
      } else if (i < 22) {
        title = `Katekese Umum: Ekaristi dan Perayaan Misa (Minggu ${weekNumber})`;
        description = `Mempelajari makna Perayaan Ekaristi, bagian-bagian dalam Misa, dan pentingnya Ekaristi sebagai sumber dan puncak kehidupan Kristiani.`;
      } else if (i < 30) {
        title = `Katekese Umum: Devosi dan Doa Katolik (Minggu ${weekNumber})`;
        description = `Mengenal berbagai devosi Katolik seperti Rosario, Jalan Salib, Novena, dan doa-doa tradisional. Praktik doa bersama dan meditasi.`;
      } else if (i < 39) {
        title = `Katekese Umum: Ajaran Sosial Gereja (Minggu ${weekNumber})`;
        description = `Memahami Ajaran Sosial Gereja tentang kemiskinan, keadilan, perdamaian, dan tanggung jawab terhadap sesama serta lingkungan hidup.`;
      } else if (i < 47) {
        title = `Katekese Umum: Kehidupan Rohani dan Iman (Minggu ${weekNumber})`;
        description = `Pembinaan kehidupan rohani, pendalaman iman, dan cara menghadapi tantangan iman di zaman modern. Sharing dan diskusi kelompok.`;
      } else {
        title = `Katekese Umum: Menjelang Akhir Tahun (Minggu ${weekNumber})`;
        description = `Refleksi akhir tahun, evaluasi perjalanan iman, dan persiapan menyambut tahun baru dengan iman yang lebih kokoh.`;
      }

      // Check if this date already has a catechesis event
      const [existing] = await connection.query(
        'SELECT id FROM agendas WHERE DATE(start_date) = DATE(?) AND title LIKE ?',
        [startDate, 'Katekese Umum:%']
      );

      if (existing.length > 0) {
        console.log(`⏭️  Skip: ${dateString} (sudah ada)`);
        skipCount++;
        continue;
      }

      // Insert the agenda
      await connection.query(
        `INSERT INTO agendas 
        (title, description, start_date, end_date, location, category_id, contact_person) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [title, description, startDate, endDate, location, categoryId, contactPerson]
      );

      successCount++;
      console.log(`✅ ${successCount}. ${dateString}: ${title}`);
    }

    console.log('\n' + '='.repeat(60));
    console.log(`📊 SUMMARY:`);
    console.log(`   ✅ Berhasil ditambahkan: ${successCount} agenda`);
    console.log(`   ⏭️  Dilewati (sudah ada): ${skipCount} agenda`);
    console.log(`   📅 Total hari Sabtu: ${saturdays.length}`);
    console.log('='.repeat(60));

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

addWeeklyCatechesis();
