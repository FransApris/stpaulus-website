#!/usr/bin/env node

/**
 * Database Migration Runner
 * Executes SQL migration files in order and tracks execution
 * 
 * Usage: node scripts/run-migrations.js
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

async function runMigrations() {
  log('\n🔄 Database Migration Runner', colors.bright + colors.cyan)
  log('='.repeat(60), colors.blue)
  
  const config = {
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT || '3306'),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    multipleStatements: true
  }
  
  log('\n📋 Configuration:', colors.bright)
  log(`   Database: ${config.database}`)
  log(`   Host:     ${config.host}:${config.port}`)
  
  let connection
  
  try {
    // Connect to database
    log('\n🔌 Connecting to database...', colors.cyan)
    connection = await mysql.createConnection(config)
    log('✅ Connected', colors.green)
    
    // Create migrations tracking table
    log('\n📊 Setting up migrations tracking...', colors.cyan)
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        filename VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_filename (filename),
        INDEX idx_executed_at (executed_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    log('✅ Migrations table ready', colors.green)
    
    // Get already executed migrations
    const [executed] = await connection.execute(
      'SELECT filename FROM migrations ORDER BY executed_at'
    )
    const executedFiles = new Set(executed.map(row => row.filename))
    
    log(`\n📝 Already executed: ${executedFiles.size} migrations`, colors.cyan)
    
    // Find migration files
    const migrationsDir = path.join(__dirname, '../server/database/migrations')
    const rootMigrationsDir = path.join(__dirname, '../migrations')
    
    const files = []
    
    // Get migrations from server/database/migrations
    if (fs.existsSync(migrationsDir)) {
      const serverFiles = fs.readdirSync(migrationsDir)
        .filter(f => f.endsWith('.sql'))
        .map(f => ({ file: f, dir: migrationsDir }))
      files.push(...serverFiles)
    }
    
    // Get migrations from root migrations folder
    if (fs.existsSync(rootMigrationsDir)) {
      const rootFiles = fs.readdirSync(rootMigrationsDir)
        .filter(f => f.endsWith('.sql'))
        .map(f => ({ file: f, dir: rootMigrationsDir }))
      files.push(...rootFiles)
    }
    
    // Remove duplicates (prefer server/database/migrations)
    const uniqueFiles = []
    const seen = new Set()
    for (const item of files) {
      if (!seen.has(item.file)) {
        uniqueFiles.push(item)
        seen.add(item.file)
      }
    }
    
    // Sort by filename
    uniqueFiles.sort((a, b) => a.file.localeCompare(b.file))
    
    log(`📁 Found: ${uniqueFiles.length} migration files\n`, colors.cyan)
    
    if (uniqueFiles.length === 0) {
      log('⚠️  No migration files found', colors.yellow)
      await connection.end()
      process.exit(0)
    }
    
    // Execute migrations
    let applied = 0
    let skipped = 0
    let failed = 0
    
    for (const { file, dir } of uniqueFiles) {
      const fullPath = path.join(dir, file)
      
      if (executedFiles.has(file)) {
        log(`⏭️  ${file}`, colors.yellow)
        log(`   Already executed - skipping`, colors.yellow)
        skipped++
        continue
      }
      
      log(`▶️  ${file}`, colors.bright)
      log(`   Path: ${fullPath}`, colors.cyan)
      
      try {
        // Read SQL file
        const sql = fs.readFileSync(fullPath, 'utf8')
        
        // Split into statements (handle multiple statements)
        const statements = sql
          .split(';')
          .map(s => s.trim())
          .filter(s => s.length > 0 && !s.startsWith('--'))
        
        log(`   Statements: ${statements.length}`, colors.cyan)
        
        // Execute statements
        const startTime = Date.now()
        
        for (const statement of statements) {
          if (statement.trim()) {
            await connection.query(statement)
          }
        }
        
        const duration = Date.now() - startTime
        
        // Record migration
        await connection.execute(
          'INSERT INTO migrations (filename) VALUES (?)',
          [file]
        )
        
        log(`   ✅ Success (${duration}ms)`, colors.green)
        applied++
        
      } catch (error) {
        log(`   ❌ FAILED: ${error.message}`, colors.red)
        log(`   SQL Error Code: ${error.code}`, colors.red)
        log(`   SQL State: ${error.sqlState}`, colors.red)
        
        failed++
        
        log('\n⚠️  Migration failed. Stopping execution.', colors.red)
        log('   Fix the error and run again.', colors.yellow)
        log('   Already executed migrations will be skipped.\n', colors.yellow)
        break
      }
      
      console.log() // Empty line between migrations
    }
    
    // Summary
    log('='.repeat(60), colors.blue)
    log('\n📊 Migration Summary:', colors.bright)
    log(`   Total migrations:   ${uniqueFiles.length}`)
    log(`   Already executed:   ${skipped}`, colors.yellow)
    log(`   Applied now:        ${applied}`, colors.green)
    if (failed > 0) {
      log(`   Failed:             ${failed}`, colors.red)
    }
    
    await connection.end()
    
    if (failed > 0) {
      log('\n❌ Migration process completed with errors\n', colors.red)
      process.exit(1)
    } else {
      log('\n✅ All migrations completed successfully!\n', colors.green + colors.bright)
      process.exit(0)
    }
    
  } catch (error) {
    log('\n❌ Migration failed!', colors.red + colors.bright)
    log(`\n🔥 Error: ${error.message}\n`, colors.red)
    
    if (connection) {
      await connection.end()
    }
    
    process.exit(1)
  }
}

// Run migrations
runMigrations().catch(error => {
  log(`\n💥 Unexpected error: ${error.message}\n`, colors.red)
  process.exit(1)
})
