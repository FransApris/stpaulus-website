// Check kronik data in database
const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkKronikData() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'stpaulus_cms_db'
  });

  try {
    console.log('✓ Connected to database\n');

    // Check categories
    const [categories] = await connection.execute(
      'SELECT id, name, slug, (SELECT COUNT(*) FROM kronik_entries WHERE category_id = kronik_categories.id) as entries_count FROM kronik_categories ORDER BY name'
    );

    console.log('=== KRONIK CATEGORIES ===');
    console.table(categories);

    // Check entries
    const [entries] = await connection.execute(`
      SELECT 
        e.id,
        e.what_title,
        e.status,
        e.when_date,
        c.name as category_name,
        c.slug as category_slug
      FROM kronik_entries e
      INNER JOIN kronik_categories c ON e.category_id = c.id
      ORDER BY e.when_date DESC
      LIMIT 20
    `);

    console.log('\n=== KRONIK ENTRIES (Last 20) ===');
    if (entries.length === 0) {
      console.log('⚠️  No entries found in database!');
    } else {
      console.table(entries);
    }

    // Check by status
    const [statusCount] = await connection.execute(`
      SELECT status, COUNT(*) as count 
      FROM kronik_entries 
      GROUP BY status
    `);

    console.log('\n=== ENTRIES BY STATUS ===');
    console.table(statusCount);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

checkKronikData();
