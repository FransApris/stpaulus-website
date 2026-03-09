import { readFileSync } from 'fs'
import { join } from 'path'
import { runQuery, allQuery, getQuery as getOne } from '~/server/database/db'

export default defineEventHandler(async (event) => {
    try {
        console.log('[MIGRATION] Starting kronik system migration...')

        // Read SQL file
        const sqlFile = join(process.cwd(), 'migrations', '020_create_kronik_system_fixed.sql')
        const sqlContent = readFileSync(sqlFile, 'utf8')

        console.log('[MIGRATION] SQL file loaded, size:', sqlContent.length, 'bytes')

        // Split SQL into individual statements
        const statements = sqlContent
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.startsWith('--'))

        console.log('[MIGRATION] Found', statements.length, 'SQL statements')

        let successCount = 0
        let skipCount = 0
        let errorCount = 0

        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i]
            
            // Skip if statement is undefined, empty, or a comment
            if (!statement || statement.startsWith('--') || statement.length < 5) {
                continue
            }

            try {
                await runQuery(statement)
                successCount++

                // Log progress every 10 statements
                if (successCount % 10 === 0) {
                    console.log(`[MIGRATION] Progress: ${successCount}/${statements.length}`)
                }
            } catch (error: any) {
                // Ignore "table already exists" errors
                if (error.code === 'ER_TABLE_EXISTS_ERROR' || error.errno === 1050) {
                    skipCount++
                } else if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
                    // Ignore duplicate entry errors
                    skipCount++
                } else {
                    console.error('[MIGRATION] Error on statement', i, ':', error.message)
                    console.error('[MIGRATION] Statement:', statement.substring(0, 100))
                    errorCount++
                }
            }
        }

        console.log('[MIGRATION] Completed!')
        console.log('[MIGRATION] Success:', successCount, 'Skip:', skipCount, 'Errors:', errorCount)

        // Verify tables
        const tables = await allQuery("SHOW TABLES LIKE 'kronik_%'") as any[]
        const tableNames = tables.map(row => Object.values(row)[0])

        // Check counts
        let categoriesCount = 0
        let sectionsCount = 0
        let entriesCount = 0

        try {
            const catResult = await getOne('SELECT COUNT(*) as count FROM kronik_categories') as any
            categoriesCount = catResult?.count || 0

            const secResult = await getOne('SELECT COUNT(*) as count FROM kronik_sections') as any
            sectionsCount = secResult?.count || 0

            const entResult = await getOne('SELECT COUNT(*) as count FROM kronik_entries') as any
            entriesCount = entResult?.count || 0
        } catch (error) {
            console.error('[MIGRATION] Error checking counts:', error)
        }

        return {
            success: true,
            message: 'Migration completed successfully',
            statistics: {
                statementsExecuted: successCount,
                statementsSkipped: skipCount,
                errors: errorCount,
                tablesCreated: tableNames.length
            },
            tables: tableNames,
            data: {
                categories: categoriesCount,
                sections: sectionsCount,
                entries: entriesCount
            }
        }

    } catch (error: any) {
        console.error('[MIGRATION] Fatal error:', error)
        return {
            success: false,
            error: error.message,
            stack: error.stack
        }
    }
})
