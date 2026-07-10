import mysql from 'mysql2/promise';

async function main() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'stpaulus_cms_db',
    password: process.env.MYSQL_PASSWORD || process.env.MYSQL_ROOT_PASSWORD || ''
  });

  try {
    const [liturgy] = await connection.execute('SELECT id, title, status, date, liturgy_type_id FROM liturgy_schedules');
    console.log("Liturgy Schedules:");
    console.table(liturgy);
    
    const [types] = await connection.execute('SELECT id, name FROM liturgy_types');
    console.log("Liturgy Types:");
    console.table(types);

    const [devotions] = await connection.execute('SELECT id, title, is_active FROM devotions');
    console.log("Devotions:");
    console.table(devotions);
  } catch (err) {
    console.error(err);
  } finally {
    await connection.end();
  }
}

main();
