import { getQuery as getOne, allQuery } from '~/server/database/db'

export default defineEventHandler(async (event) => {
    try {
        // Check if kronik tables exist
        const tables = await allQuery("SHOW TABLES LIKE 'kronik_%'") as any[]

        const tableNames = tables.map((row: any) => Object.values(row)[0])

        if (tableNames.length === 0) {
            return {
                success: false,
                message: 'Kronik tables not found',
                tables: [],
                needsMigration: true,
                migrationFile: 'migrations/020_create_kronik_system.sql'
            }
        }

        // Check kronik_entries count
        let entriesCount = 0
        try {
            const result = await getOne('SELECT COUNT(*) as count FROM kronik_entries') as any
            entriesCount = result?.count || 0
        } catch (error: any) {
            console.error('Error counting entries:', error.message)
        }

        // Check kronik_categories count
        let categoriesCount = 0
        try {
            const result = await getOne('SELECT COUNT(*) as count FROM kronik_categories') as any
            categoriesCount = result?.count || 0
        } catch (error: any) {
            console.error('Error counting categories:', error.message)
        }

        // Check kronik_sections count
        let sectionsCount = 0
        try {
            const result = await getOne('SELECT COUNT(*) as count FROM kronik_sections') as any
            sectionsCount = result?.count || 0
        } catch (error: any) {
            console.error('Error counting sections:', error.message)
        }

        return {
            success: true,
            message: 'Kronik system status',
            tables: tableNames,
            counts: {
                entries: entriesCount,
                categories: categoriesCount,
                sections: sectionsCount
            },
            needsMigration: tableNames.length === 0
        }
    } catch (error: any) {
        console.error('Error checking kronik status:', error)
        return {
            success: false,
            error: error.message,
            needsMigration: true
        }
    }
})
