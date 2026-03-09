#!/usr/bin/env node

/**
 * Database Backup Script (Command Line Version)
 * Creates SQL dump of database similar to admin UI backup
 * 
 * Usage: node scripts/backup-database.js [output-directory]
 */

import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') })

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

function escapeString(str) {
  if (str === null) return 'NULL'
  return `'${str.toString().replace(/'/g, "''")}'`
}

async function backupDatabase() {
  log('\n💾 Database Backup Script', colors.bright + colors.cyan)
  log('='.repeat(60), colors.blue)
  
  const config = {
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT || '3306'),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  }
  
  // Get output directory from command line or use default
  const outputDir = process.argv[2] || path.join(__dirname, '../backups')
  
  // Create backups directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
    log(`\n📁 Created directory: ${outputDir}`, colors.cyan)
  }
  
  // Generate filename
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
  const filename = `${config.database}_backup_${timestamp}.sql`
  const filepath = path.join(outputDir, filename)
  
  log('\n📋 Backup Configuration:', colors.bright)
  log(`   Database:     ${config.database}`)
  log(`   Host:         ${config.host}:${config.port}`)
  log(`   Output File:  ${filename}`)
  log(`   Full Path:    ${filepath}`)
  
  let connection
  let sqlDump = ''
  
  try {
    // Connect to database
    log('\n🔌 Connecting to database...', colors.cyan)
    connection = await mysql.createConnection(config)
    log('✅ Connected', colors.green)
    
    // Start SQL dump
    sqlDump += `-- MySQL Database Backup\n`
    sqlDump += `-- Database: ${config.database}\n`
    sqlDump += `-- Generated: ${new Date().toISOString()}\n`
    sqlDump += `-- Host: ${config.host}\n`
    sqlDump += `-- MySQL Version: (see below)\n\n`
    
    // Get MySQL version
    const [versionRows] = await connection.execute('SELECT VERSION() as version')
    sqlDump += `-- MySQL Version: ${versionRows[0].version}\n\n`
    
    sqlDump += `SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";\n`
    sqlDump += `SET AUTOCOMMIT = 0;\n`
    sqlDump += `START TRANSACTION;\n`
    sqlDump += `SET time_zone = "+00:00";\n\n`
    
    // Get all tables
    log('\n📊 Fetching table list...', colors.cyan)
    const [tables] = await connection.execute('SHOW TABLES')
    const tableNames = tables.map(row => Object.values(row)[0])
    
    log(`✅ Found ${tableNames.length} tables`, colors.green)
    
    // Process each table
    for (let i = 0; i < tableNames.length; i++) {
      const tableName = tableNames[i]
      log(`\n[${i + 1}/${tableNames.length}] Processing: ${tableName}`, colors.cyan)
      
      try {
        // Get CREATE TABLE statement
        const [createTable] = await connection.execute(`SHOW CREATE TABLE \`${tableName}\``)
        const createStatement = createTable[0]['Create Table']
        
        sqlDump += `--\n-- Table structure for table \`${tableName}\`\n--\n\n`
        sqlDump += `DROP TABLE IF EXISTS \`${tableName}\`;\n`
        sqlDump += `${createStatement};\n\n`
        
        // Get table data
        const [rows] = await connection.execute(`SELECT * FROM \`${tableName}\``)
        
        if (rows.length > 0) {
          log(`   Records: ${rows.length}`, colors.yellow)
          
          sqlDump += `--\n-- Dumping data for table \`${tableName}\`\n--\n\n`
          
          // Get column names
          const columns = Object.keys(rows[0])
          const columnList = columns.map(col => `\`${col}\``).join(', ')
          
          // Split into chunks of 100 rows
          const chunkSize = 100
          for (let j = 0; j < rows.length; j += chunkSize) {
            const chunk = rows.slice(j, Math.min(j + chunkSize, rows.length))
            
            sqlDump += `INSERT INTO \`${tableName}\` (${columnList}) VALUES\n`
            
            const values = chunk.map(row => {
              const rowValues = columns.map(col => {
                const value = row[col]
                if (value === null) return 'NULL'
                if (value instanceof Date) return escapeString(value.toISOString().slice(0, 19).replace('T', ' '))
                if (typeof value === 'number') return value
                if (typeof value === 'boolean') return value ? 1 : 0
                return escapeString(value)
              })
              return `(${rowValues.join(', ')})`
            })
            
            sqlDump += values.join(',\n')
            sqlDump += ';\n\n'
          }
          
          log(`   ✅ Exported ${rows.length} records`, colors.green)
        } else {
          log(`   Empty table`, colors.yellow)
        }
        
      } catch (error) {
        log(`   ❌ Error: ${error.message}`, colors.red)
      }
    }
    
    sqlDump += `COMMIT;\n`
    
    // Write to file
    log('\n💾 Writing to file...', colors.cyan)
    fs.writeFileSync(filepath, sqlDump, 'utf8')
    
    const stats = fs.statSync(filepath)
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2)
    
    log('✅ Backup file created', colors.green)
    
    await connection.end()
    
    // Summary
    log('\n' + '='.repeat(60), colors.blue)
    log('\n📊 Backup Summary:', colors.bright)
    log(`   Tables exported:   ${tableNames.length}`)
    log(`   File size:         ${sizeMB} MB`)
    log(`   Output file:       ${filename}`)
    log(`   Full path:         ${filepath}`)
    
    log('\n✅ Backup completed successfully!', colors.green + colors.bright)
    
    // Restore instructions
    log('\n📝 To restore this backup:', colors.yellow)
    log(`   mysql -u ${config.user} -p ${config.database} < ${filepath}`, colors.cyan)
    log('\n' + '='.repeat(60) + '\n', colors.blue)
    
    process.exit(0)
    
  } catch (error) {
    log('\n❌ Backup failed!', colors.red + colors.bright)
    log(`\n🔥 Error: ${error.message}\n`, colors.red)
    
    if (connection) {
      await connection.end()
    }
    
    // Clean up partial file
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath)
      log('🧹 Cleaned up partial backup file\n', colors.yellow)
    }
    
    process.exit(1)
  }
}

// Run backup
backupDatabase().catch(error => {
  log(`\n💥 Unexpected error: ${error.message}\n`, colors.red)
  process.exit(1)
})
