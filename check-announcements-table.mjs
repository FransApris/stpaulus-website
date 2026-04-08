import mysql from 'mysql2/promise';

const config = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'pressgk31',
    database: 'stpaulus_cms_db'
};

async function checkTable() {
    try {
        const connection = await mysql.createConnection(config);
        console.log('Connected to database');

        // Check if church_announcements table exists
        const [tables] = await connection.execute('SHOW TABLES LIKE "church_announcements"');
        console.log('Table exists:', tables.length > 0);

        if (tables.length > 0) {
            // Check table structure
            const [columns] = await connection.execute('DESCRIBE church_announcements');
            console.log('Table structure:');
            columns.forEach(col => console.log('  -', col.Field, col.Type, col.Null, col.Key, col.Default, col.Extra));

            // Check data count
            const [count] = await connection.execute('SELECT COUNT(*) as total FROM church_announcements');
            console.log('Total records:', count[0].total);
        }

        await connection.end();
    } catch (error) {
        console.error('Database error:', error.message);
    }
}

checkTable();