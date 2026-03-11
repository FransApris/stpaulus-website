import mysql from 'mysql2/promise'
import { readMultipartFormData } from 'h3'

export default defineEventHandler(async (event) => {
    try {
        console.log('[Database Restore] Starting restore process...')

        // Verify admin authentication
        const user = event.context.user
        if (!user || user.role !== 'super_admin') {
            console.log('[Database Restore] Unauthorized access attempt')
            throw createError({
                statusCode: 403,
                statusMessage: 'Unauthorized: Super Admin access required'
            })
        }

        // Read the uploaded file
        const formData = await readMultipartFormData(event)

        if (!formData || formData.length === 0) {
            throw createError({
                statusCode: 400,
                statusMessage: 'No file uploaded'
            })
        }

        // Get the SQL file
        const sqlFile = formData.find(item => item.name === 'sqlFile')

        if (!sqlFile || !sqlFile.data) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Invalid SQL file'
            })
        }

        const sqlContent = sqlFile.data.toString('utf-8')

        if (!sqlContent || sqlContent.trim().length === 0) {
            throw createError({
                statusCode: 400,
                statusMessage: 'SQL file is empty'
            })
        }

        console.log('[Database Restore] SQL file size:', sqlContent.length, 'characters')

        // Helper to get env var (supports both formats)
        const getEnvVar = (withUnderscore: string, withoutUnderscore: string): string | undefined => {
            return process.env[withUnderscore] || process.env[withoutUnderscore]
        }

        // Create database connection
        const connection = await mysql.createConnection({
            host: getEnvVar('MYSQL_HOST', 'MYSQLHOST') || 'localhost',
            port: parseInt(getEnvVar('MYSQL_PORT', 'MYSQLPORT') || '3306'),
            user: getEnvVar('MYSQL_USER', 'MYSQLUSER') || 'root',
            password: getEnvVar('MYSQL_PASSWORD', 'MYSQLPASSWORD') || '',
            database: getEnvVar('MYSQL_DATABASE', 'MYSQLDATABASE') || 'stpaulus_cms_db',
            multipleStatements: true // Important for executing multiple SQL statements
        })

        console.log('[Database Restore] Connected to database')

        // Split SQL content into individual statements
        // Remove comments and empty lines
        const statements = sqlContent
            .split(/;\s*$/gm)
            .map(stmt => stmt.trim())
            .filter(stmt => {
                // Remove comments and empty statements
                return stmt.length > 0 &&
                    !stmt.startsWith('--') &&
                    !stmt.startsWith('/*') &&
                    stmt !== ''
            })

        console.log('[Database Restore] Found', statements.length, 'SQL statements')

        let successCount = 0
        let errorCount = 0
        const errors: string[] = []

        // Execute statements one by one
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i]

            try {
                // Skip if statement is just whitespace
                if (!statement || !statement.trim()) continue

                await connection.query(statement)
                successCount++

                // Log progress every 10 statements
                if ((i + 1) % 10 === 0) {
                    console.log(`[Database Restore] Progress: ${i + 1}/${statements.length} statements`)
                }
            } catch (error: any) {
                errorCount++
                const errorMsg = `Statement ${i + 1}: ${error.message}`
                errors.push(errorMsg)
                console.error('[Database Restore] Error:', errorMsg)

                // Continue with other statements unless it's a critical error
                if (error.message.includes('Access denied') ||
                    error.message.includes('Unknown database')) {
                    // Critical error, stop execution
                    await connection.end()
                    throw createError({
                        statusCode: 500,
                        statusMessage: `Critical database error: ${error.message}`
                    })
                }
            }
        }

        await connection.end()

        console.log('[Database Restore] Restore completed')
        console.log(`[Database Restore] Success: ${successCount}, Errors: ${errorCount}`)

        if (errorCount > 0 && errorCount === statements.length) {
            // All statements failed
            throw createError({
                statusCode: 500,
                statusMessage: 'Database restore failed completely',
                data: { errors: errors.slice(0, 10) } // Return first 10 errors
            })
        }

        return {
            success: true,
            message: 'Database restored successfully',
            stats: {
                totalStatements: statements.length,
                successCount,
                errorCount,
                errors: errorCount > 0 ? errors.slice(0, 5) : [] // Return first 5 errors if any
            }
        }

    } catch (error: any) {
        console.error('[Database Restore] Fatal error:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.statusMessage || 'Failed to restore database',
            data: error.data
        })
    }
})
