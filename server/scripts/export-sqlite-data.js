import Database from 'better-sqlite3'
import fs from 'fs'
import path from 'path'

// SQLite database path
const SQLITE_DB_PATH = path.join(process.cwd(), 'server/database/cms.db')

// Output file for exported data
const EXPORT_FILE = path.join(process.cwd(), 'server/database/sqlite-data-export.sql')

console.log('Starting SQLite data export...')

try {
  // Connect to SQLite database
  const sqliteDb = new Database(SQLITE_DB_PATH, { readonly: true })

  // Get all table names
  const tables = sqliteDb.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all()

  console.log(`Found ${tables.length} tables to export`)

  let exportSql = '-- SQLite Data Export for Migration to MySQL\n'
  exportSql += '-- Generated on ' + new Date().toISOString() + '\n\n'
  exportSql += 'SET FOREIGN_KEY_CHECKS = 0;\n\n'

  for (const table of tables) {
    const tableName = table.name
    console.log(`Exporting table: ${tableName}`)

    // Get table schema (for reference)
    const schema = sqliteDb.prepare(`PRAGMA table_info(${tableName})`).all()
    exportSql += `-- Table: ${tableName}\n`
    exportSql += `-- Columns: ${schema.map(col => col.name).join(', ')}\n\n`

    // Get all data from table
    const rows = sqliteDb.prepare(`SELECT * FROM ${tableName}`).all()

    if (rows.length === 0) {
      console.log(`  No data in table ${tableName}`)
      continue
    }

    console.log(`  Exporting ${rows.length} rows from ${tableName}`)

    // Process data in batches to avoid memory issues
    const batchSize = 1000
    for (let i = 0; i < rows.length; i += batchSize) {
      const batch = rows.slice(i, i + batchSize)

      // Build INSERT statements
      for (const row of batch) {
        const columns = Object.keys(row)
        const values = columns.map(col => {
          const value = row[col]
          if (value === null) return 'NULL'
          if (typeof value === 'string') {
            // Escape single quotes and handle special characters
            return `'${value.replace(/'/g, "''")}'`
          }
          if (typeof value === 'boolean') {
            return value ? '1' : '0'
          }
          return value
        })

        exportSql += `INSERT INTO \`${tableName}\` (\`${columns.join('`, `')}\`) VALUES (${values.join(', ')});\n`
      }
    }

    exportSql += '\n'
  }

  exportSql += 'SET FOREIGN_KEY_CHECKS = 1;\n'

  // Write to file
  fs.writeFileSync(EXPORT_FILE, exportSql, 'utf8')

  console.log(`\nExport completed successfully!`)
  console.log(`Data exported to: ${EXPORT_FILE}`)
  console.log(`File size: ${(fs.statSync(EXPORT_FILE).size / 1024 / 1024).toFixed(2)} MB`)

  sqliteDb.close()

} catch (error) {
  console.error('Export failed:', error)
  process.exit(1)
}
