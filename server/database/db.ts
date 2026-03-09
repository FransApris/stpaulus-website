import * as mysql from 'mysql2/promise'
import type { RowDataPacket, ResultSetHeader } from 'mysql2/promise'
import * as path from 'path'
import * as fs from 'fs'

// Validate required environment variables
const requiredEnvVars = ['MYSQL_HOST', 'MYSQL_USER', 'MYSQL_DATABASE']
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName])

if (missingEnvVars.length > 0) {
  console.warn(
    `⚠️ WARNING: Missing database environment variables: ${missingEnvVars.join(', ')}\n` +
    `Application will continue but database features may not work.`
  )
}

// Database configuration with fallbacks for development
const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'stpaulus_cms_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
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
    let retries = 5 // Increase retries
    const delayMs = 3000 // 3 seconds delay

    while (retries > 0) {
      try {
        connection = await pool.getConnection()
        console.log('✅ MySQL database connected successfully')
        break
      } catch (error: any) {
        retries--
        if (retries === 0) {
          console.error('\n❌ Failed to connect to MySQL after 5 attempts')
          console.error('📋 Connection config:', {
            host: dbConfig.host,
            port: dbConfig.port,
            user: dbConfig.user,
            database: dbConfig.database
          })
          console.error('\n💡 Possible solutions:')
          console.error('   1. Start MySQL: npm run mysql:start')
          console.error('   2. Use auto-start: npm run dev:auto')
          console.error('   3. Check MySQL status: npm run mysql:status')
          console.error('\n🔍 Error details:', error.message)
          throw error
        }
        console.log(`⏳ Retrying database connection... (${5 - retries}/5) - waiting ${delayMs / 1000}s`)
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
