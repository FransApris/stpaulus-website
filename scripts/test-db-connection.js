#!/usr/bin/env node

/**
 * Database Connection Test Script
 * Tests connection to MySQL database using credentials from .env
 * 
 * Usage: node scripts/test-db-connection.js
 */

import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env') })

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
}

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`)
}

async function testConnection() {
  log('\n🔍 Testing MySQL Database Connection', colors.bright + colors.cyan)
  log('='.repeat(60), colors.blue)
  
  const config = {
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT || '3306'),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  }
  
  // Display configuration (mask password)
  log('\n📋 Configuration:', colors.bright)
  log(`   Host:     ${config.host}`)
  log(`   Port:     ${config.port}`)
  log(`   User:     ${config.user}`)
  log(`   Password: ${'*'.repeat(config.password?.length || 0)}`)
  log(`   Database: ${config.database}`)
  
  // Check for missing values
  const missing = []
  if (!config.host) missing.push('MYSQL_HOST')
  if (!config.user) missing.push('MYSQL_USER')
  if (!config.password) missing.push('MYSQL_PASSWORD')
  if (!config.database) missing.push('MYSQL_DATABASE')
  
  if (missing.length > 0) {
    log('\n❌ Missing environment variables:', colors.red)
    missing.forEach(v => log(`   - ${v}`, colors.red))
    log('\nPlease check your .env file\n', colors.yellow)
    process.exit(1)
  }
  
  log('\n🔌 Attempting connection...', colors.cyan)
  
  try {
    // Create connection
    const connection = await mysql.createConnection(config)
    log('✅ Connection successful!', colors.green + colors.bright)
    
    // Get MySQL version
    log('\n📊 Database Information:', colors.bright)
    const [versionRows] = await connection.execute('SELECT VERSION() as version')
    log(`   MySQL Version: ${versionRows[0].version}`, colors.green)
    
    // Get database charset
    const [charsetRows] = await connection.execute(
      `SELECT DEFAULT_CHARACTER_SET_NAME, DEFAULT_COLLATION_NAME 
       FROM information_schema.SCHEMATA 
       WHERE SCHEMA_NAME = ?`,
      [config.database]
    )
    if (charsetRows.length > 0) {
      log(`   Character Set: ${charsetRows[0].DEFAULT_CHARACTER_SET_NAME}`, colors.green)
      log(`   Collation:     ${charsetRows[0].DEFAULT_COLLATION_NAME}`, colors.green)
    }
    
    // Count tables
    const [tableRows] = await connection.execute(
      `SELECT COUNT(*) as count 
       FROM information_schema.tables 
       WHERE table_schema = ?`,
      [config.database]
    )
    log(`   Total Tables:  ${tableRows[0].count}`, colors.green)
    
    // Get table sizes
    const [sizeRows] = await connection.execute(
      `SELECT 
        ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS size_mb
       FROM information_schema.tables 
       WHERE table_schema = ?`,
      [config.database]
    )
    log(`   Database Size: ${sizeRows[0].size_mb} MB`, colors.green)
    
    // Count records in key tables
    log('\n📈 Key Table Record Counts:', colors.bright)
    const keyTables = ['users', 'articles', 'news', 'agendas', 'church_announcements']
    
    for (const table of keyTables) {
      try {
        const [countRows] = await connection.execute(
          `SELECT COUNT(*) as count FROM ${table}`
        )
        log(`   ${table.padEnd(25)}: ${countRows[0].count}`, colors.cyan)
      } catch (error) {
        log(`   ${table.padEnd(25)}: Table not found`, colors.yellow)
      }
    }
    
    // Check connection variables
    log('\n⚙️  Connection Settings:', colors.bright)
    const [maxConn] = await connection.execute(
      "SHOW VARIABLES LIKE 'max_connections'"
    )
    log(`   Max Connections:       ${maxConn[0].Value}`, colors.cyan)
    
    const [threadsConn] = await connection.execute(
      "SHOW STATUS LIKE 'Threads_connected'"
    )
    log(`   Current Connections:   ${threadsConn[0].Value}`, colors.cyan)
    
    const [maxUsed] = await connection.execute(
      "SHOW STATUS LIKE 'Max_used_connections'"
    )
    log(`   Peak Connections:      ${maxUsed[0].Value}`, colors.cyan)
    
    // Performance check - simple query timing
    log('\n⚡ Performance Test:', colors.bright)
    const start = Date.now()
    await connection.execute('SELECT 1')
    const duration = Date.now() - start
    log(`   Simple Query Time:     ${duration}ms`, duration < 10 ? colors.green : colors.yellow)
    
    await connection.end()
    
    log('\n' + '='.repeat(60), colors.blue)
    log('✅ All tests passed! Database is ready.', colors.green + colors.bright)
    log('='.repeat(60) + '\n', colors.blue)
    
    process.exit(0)
    
  } catch (error) {
    log('\n❌ Connection failed!', colors.red + colors.bright)
    log('='.repeat(60), colors.red)
    log(`\n🔥 Error: ${error.message}\n`, colors.red)
    
    // Provide troubleshooting tips
    log('💡 Troubleshooting Steps:', colors.yellow + colors.bright)
    log('\n1. Check if MySQL is running:', colors.yellow)
    log('   macOS:  mysql.server status', colors.cyan)
    log('   Linux:  sudo systemctl status mysql', colors.cyan)
    log('   Start:  mysql.server start or brew services start mysql', colors.cyan)
    
    log('\n2. Verify credentials in .env file:', colors.yellow)
    log('   cat .env | grep MYSQL', colors.cyan)
    
    log('\n3. Test manual connection:', colors.yellow)
    log(`   mysql -h ${config.host} -u ${config.user} -p`, colors.cyan)
    
    log('\n4. Check MySQL port is listening:', colors.yellow)
    log('   netstat -an | grep 3306', colors.cyan)
    log('   lsof -i :3306', colors.cyan)
    
    log('\n5. Check MySQL error logs:', colors.yellow)
    log('   macOS:  tail -f /usr/local/var/mysql/*.err', colors.cyan)
    log('   Linux:  sudo tail -f /var/log/mysql/error.log', colors.cyan)
    
    log('\n6. Test network connectivity:', colors.yellow)
    log(`   ping ${config.host}`, colors.cyan)
    log(`   telnet ${config.host} ${config.port}`, colors.cyan)
    
    if (error.code === 'ECONNREFUSED') {
      log('\n⚠️  Connection refused - MySQL might not be running', colors.red)
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      log('\n⚠️  Access denied - Check username/password in .env', colors.red)
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      log('\n⚠️  Database not found - Run schema initialization', colors.red)
    } else if (error.code === 'ETIMEDOUT') {
      log('\n⚠️  Connection timeout - Check network/firewall', colors.red)
    }
    
    log('\n' + '='.repeat(60) + '\n', colors.red)
    
    process.exit(1)
  }
}

// Run the test
testConnection().catch(error => {
  log(`\n💥 Unexpected error: ${error.message}\n`, colors.red)
  process.exit(1)
})
