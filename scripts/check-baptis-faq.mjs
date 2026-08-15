import * as mysql from 'mysql2/promise'
import * as dotenv from 'dotenv'
dotenv.config()

async function checkFAQ() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST || process.env.MYSQLHOST || 'localhost',
    user: process.env.MYSQL_USER || process.env.MYSQLUSER || 'root',
    password: process.env.MYSQL_PASSWORD || process.env.MYSQLPASSWORD || process.env.MYSQL_ROOT_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || process.env.MYSQLDATABASE || 'stpaulus_cms_db',
    port: parseInt(process.env.MYSQL_PORT || process.env.MYSQLPORT || '3306')
  })

  try {
    const [rows] = await connection.execute('SELECT question, answer FROM chatbot_faqs WHERE question LIKE ?', ['%baptis%'])
    console.log("FAQ Baptis:")
    console.log(JSON.stringify(rows, null, 2))
  } finally {
    await connection.end()
  }
}

checkFAQ().catch(console.error)
