import * as mysql from 'mysql2/promise'
import type { RowDataPacket, ResultSetHeader } from 'mysql2/promise'
import * as path from 'path'
import * as fs from 'fs'

// Helper function to get env var (supports multiple Railway MySQL formats)
const getEnvVar = (withUnderscore: string, withoutUnderscore: string): string | undefined => {
  return process.env[withUnderscore] || process.env[withoutUnderscore]
}

// Special handler for password (Railway uses MYSQL_ROOT_PASSWORD)
const getPassword = (): string => {
  return process.env.MYSQL_PASSWORD ||
    process.env.MYSQLPASSWORD ||
    process.env.MYSQL_ROOT_PASSWORD ||
    ''
}

// Validate required environment variables (check both formats)
const hasRequiredVars =
  (getEnvVar('MYSQL_HOST', 'MYSQLHOST') &&
    getEnvVar('MYSQL_USER', 'MYSQLUSER') &&
    getEnvVar('MYSQL_DATABASE', 'MYSQLDATABASE'))

if (!hasRequiredVars) {
  console.warn(
    `⚠️ WARNING: Missing database environment variables\n` +
    `Application will continue but database features may not work.`
  )
}

// Database configuration with fallbacks for development
// Supports Railway MySQL formats: MYSQL_*, MYSQL*, and MYSQL_ROOT_PASSWORD
const dbConfig = {
  host: getEnvVar('MYSQL_HOST', 'MYSQLHOST') || 'localhost',
  port: parseInt(getEnvVar('MYSQL_PORT', 'MYSQLPORT') || '3306'),
  user: getEnvVar('MYSQL_USER', 'MYSQLUSER') || 'root',
  password: getPassword(),
  database: getEnvVar('MYSQL_DATABASE', 'MYSQLDATABASE') || 'stpaulus_cms_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Keep connections alive so Railway doesn't drop idle connections
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
  // Fail fast on connect timeout instead of hanging
  connectTimeout: 10000
}

// Initialize database connection pool
let pool: mysql.Pool | null = null

// Initialize database
export const initDatabase = async () => {
  try {
    // Create connection pool if not exists
    if (!pool) {
      pool = mysql.createPool(dbConfig)
    }

    // Test connection with retry
    let connection
    let retries = 3 // Reduced from 5 to fail faster
    const delayMs = 1000 // Reduced from 3000ms to 1s per retry

    while (retries > 0) {
      try {
        connection = await pool.getConnection()
        console.log('✅ MySQL database connected successfully')
        break
      } catch (error: any) {
        retries--
        if (retries === 0) {
          console.error('\n❌ Failed to connect to MySQL after 3 attempts')
          console.error('📋 Connection config:', {
            host: dbConfig.host,
            port: dbConfig.port,
            user: dbConfig.user,
            database: dbConfig.database,
            passwordLength: dbConfig.password?.length || 0
          })
          console.error('🔑 Password status:', dbConfig.password ? `Set (${dbConfig.password.length} chars)` : 'NOT SET or EMPTY')
          console.error('\n💡 Possible solutions:')
          console.error('   1. Verify MYSQL_PASSWORD in Railway Variables')
          console.error('   2. Use reference: ${{MySQL.MYSQL_PASSWORD}}')
          console.error('   3. Check MySQL service credentials')
          console.error('\n🔍 Error details:', error.message)
          throw error
        }
        console.log(`⏳ Retrying database connection... (${3 - retries}/3) - waiting ${delayMs / 1000}s`)
        await new Promise(resolve => setTimeout(resolve, delayMs))
      }
    }

    if (!connection) {
      throw new Error('Failed to get database connection')
    }

    // Check if tables already exist
    const [tables] = await connection.execute(
      "SHOW TABLES LIKE 'users'"
    )

    if ((tables as any[]).length > 0) {
      console.log('Database already initialized')
      connection.release()
      return
    }

    // Initialize schema
    const projectRoot = process.cwd().replace(/\\/g, '/')
    const schemaPath = path.join(projectRoot, 'server', 'database', 'schema-mysql.sql').replace(/\\/g, '/')
    const schema = fs.readFileSync(schemaPath, 'utf8')

    // Split schema into individual statements
    const statements = schema.split(';').filter(stmt => stmt.trim().length > 0)

    // Execute each statement
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.execute(statement.trim() + ';')
      }
    }

    console.log('Database initialized successfully')
    connection.release()
  } catch (error: any) {
    console.error('❌ Database initialization failed:', error.message || error)

    // Don't throw error, just log it to prevent server crash
    // The application will retry on next request
    if (pool) {
      await pool.end().catch(() => { })
      pool = null
    }
  }
}

// Get database connection
export const getConnection = async () => {
  if (!pool) {
    console.log('⚠️  Pool not initialized, initializing now...')
    await initDatabase()
  }

  if (!pool) {
    throw new Error('Database connection pool is not available. Please check your MySQL server.')
  }

  return pool.getConnection()
}

// Helper functions for queries
export const runQuery = async (query: string, params?: any[]): Promise<any> => {
  const connection = await getConnection()
  try {
    // Use query() instead of execute() - execute() doesn't support LIMIT/OFFSET placeholders
    // query() returns [rows, fields], we only need rows
    const [rows] = params && params.length > 0
      ? await connection.query(query, params)
      : await connection.query(query)
    return rows
  } finally {
    connection.release()
  }
}

export const getQuery = async (query: string, params?: any[]): Promise<RowDataPacket | null> => {
  const connection = await getConnection()
  try {
    const [rows] = params && params.length > 0
      ? await connection.query(query, params)
      : await connection.query(query)
    return (rows as RowDataPacket[])[0] || null
  } finally {
    connection.release()
  }
}

export const allQuery = async (query: string, params?: any[]): Promise<RowDataPacket[]> => {
  const connection = await getConnection()
  try {
    const [rows] = params && params.length > 0
      ? await connection.query(query, params)
      : await connection.query(query)
    return rows as RowDataPacket[]
  } finally {
    connection.release()
  }
}

// Alias for backward compatibility with Google Photos integration
export const executeQuery = runQuery

// Close database connection pool
export const closeDatabase = async () => {
  if (pool) {
    await pool.end()
    pool = null
    console.log('Database connection pool closed')
  }
}

// Export pool for direct access if needed
export { pool as db }

// Default export for backward compatibility
export default pool
