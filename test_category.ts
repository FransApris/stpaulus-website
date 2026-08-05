import { getQuery } from './server/database/db'; async function run() { const res = await getQuery('SELECT DISTINCT user_category FROM users'); console.log(res); process.exit(0); } run();
