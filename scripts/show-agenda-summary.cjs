const mysql = require('mysql2/promise');

async function showAgendaSummary() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'pressgk31',
      database: 'stpaulus_cms_db'
    });

    console.log('📊 RINGKASAN AGENDA PAROKI ST. PAULUS 2026\n');
    console.log('='.repeat(70));

    // Get count by category
    const [summary] = await connection.query(`
      SELECT 
        c.id,
        c.name as category_name,
        c.color,
        COUNT(a.id) as total_agenda
      FROM agenda_categories c
      LEFT JOIN agendas a ON c.id = a.category_id
      GROUP BY c.id, c.name, c.color
      ORDER BY total_agenda DESC
    `);

    let grandTotal = 0;
    console.log('\n📂 Jumlah Agenda per Kategori:\n');
    
    summary.forEach((cat, index) => {
      const num = (index + 1).toString().padStart(2, ' ');
      const name = cat.category_name.padEnd(25, ' ');
      const total = cat.total_agenda.toString().padStart(3, ' ');
      const bar = '█'.repeat(Math.ceil(cat.total_agenda / 3));
      
      console.log(`   ${num}. ${name} : ${total} agenda ${bar}`);
      grandTotal += cat.total_agenda;
    });

    console.log('\n' + '─'.repeat(70));
    console.log(`   TOTAL KESELURUHAN         : ${grandTotal.toString().padStart(3, ' ')} agenda`);
    console.log('═'.repeat(70));

    // Upcoming agendas (next 7 days)
    console.log('\n📅 AGENDA MENDATANG (7 Hari Ke Depan):\n');
    
    const [upcoming] = await connection.query(`
      SELECT 
        a.title,
        DATE_FORMAT(a.start_date, '%a, %d %b %Y %H:%i') as date_time,
        c.name as category_name,
        a.location
      FROM agendas a
      LEFT JOIN agenda_categories c ON a.category_id = c.id
      WHERE a.start_date >= NOW() 
        AND a.start_date <= DATE_ADD(NOW(), INTERVAL 7 DAY)
      ORDER BY a.start_date ASC
      LIMIT 10
    `);

    if (upcoming.length > 0) {
      upcoming.forEach((agenda, index) => {
        console.log(`   ${index + 1}. ${agenda.title}`);
        console.log(`      📅 ${agenda.date_time}`);
        console.log(`      📍 ${agenda.location}`);
        console.log(`      🏷️  ${agenda.category_name}\n`);
      });
    } else {
      console.log('   Tidak ada agenda dalam 7 hari ke depan.\n');
    }

    // This month's agendas
    console.log('─'.repeat(70));
    console.log('\n📆 AGENDA BULAN INI (Februari 2026):\n');
    
    const [thisMonth] = await connection.query(`
      SELECT 
        a.title,
        DATE_FORMAT(a.start_date, '%d %b') as date_short,
        TIME_FORMAT(a.start_date, '%H:%i') as time,
        c.name as category_name
      FROM agendas a
      LEFT JOIN agenda_categories c ON a.category_id = c.id
      WHERE YEAR(a.start_date) = 2026 AND MONTH(a.start_date) = 2
      ORDER BY a.start_date ASC
    `);

    if (thisMonth.length > 0) {
      console.log(`   📊 Total: ${thisMonth.length} agenda bulan ini\n`);
      thisMonth.forEach((agenda, index) => {
        const num = (index + 1).toString().padStart(2, ' ');
        console.log(`   ${num}. [${agenda.date_short} ${agenda.time}] ${agenda.title}`);
        console.log(`       🏷️  ${agenda.category_name}\n`);
      });
    } else {
      console.log('   Tidak ada agenda di bulan Februari 2026.\n');
    }

    console.log('═'.repeat(70));

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

showAgendaSummary();
