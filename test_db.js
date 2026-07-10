import { allQuery } from './server/database/db.js';

async function main() {
  const schedules = await allQuery('SELECT id, title, status, date FROM liturgy_schedules');
  console.log("Liturgy Schedules:", schedules);

  const devotions = await allQuery('SELECT id, title, is_active FROM devotions');
  console.log("Devotions:", devotions);
  
  process.exit(0);
}

main().catch(console.error);
