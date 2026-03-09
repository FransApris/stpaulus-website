const mysql = require('mysql2/promise');

async function showCatechesisAgendas() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'pressgk31',
      database: 'stpaulus_cms_db'
    });

    console.log('📚 Agenda Katekese Umum 2026\n');

    // Get catechesis agendas grouped by theme
    const [agendas] = await connection.query(`
      SELECT title, DATE_FORMAT(start_date, '%W, %d %M %Y') as formatted_date,
             TIME_FORMAT(start_date, '%H:%i') as start_time,
             TIME_FORMAT(end_date, '%H:%i') as end_time,
             location, contact_person
      FROM agendas
      WHERE title LIKE 'Katekese Umum:%'
      ORDER BY start_date ASC
    `);

    console.log(`✅ Total Jadwal Katekese: ${agendas.length}\n`);

    // Group by theme
    const themes = {
      'Pengenalan Kitab Suci': [],
      'Sakramen-Sakramen Gereja': [],
      'Ekaristi dan Perayaan Misa': [],
      'Devosi dan Doa Katolik': [],
      'Ajaran Sosial Gereja': [],
      'Kehidupan Rohani dan Iman': [],
      'Menjelang Akhir Tahun': []
    };

    agendas.forEach(agenda => {
      for (let theme in themes) {
        if (agenda.title.includes(theme)) {
          themes[theme].push(agenda);
          break;
        }
      }
    });

    // Display by theme
    for (let theme in themes) {
      if (themes[theme].length > 0) {
        console.log(`\n📖 ${theme} (${themes[theme].length} sesi)`);
        console.log('─'.repeat(60));
        
        // Show first and last session
        const first = themes[theme][0];
        const last = themes[theme][themes[theme].length - 1];
        
        console.log(`   Mulai: ${first.formatted_date}, ${first.start_time}-${first.end_time}`);
        console.log(`   Akhir: ${last.formatted_date}, ${last.start_time}-${last.end_time}`);
        console.log(`   Lokasi: ${first.location}`);
        console.log(`   Kontak: ${first.contact_person}`);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📅 Jadwal: Setiap Sabtu pukul 16:00 - 18:00');
    console.log('📍 Lokasi: Aula Gereja St. Paulus');
    console.log('☎️  Informasi: Sekretariat Paroki (031-1234567)');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

showCatechesisAgendas();
