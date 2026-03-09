const mysql = require('mysql2/promise');

async function checkAgendasTable() {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'pressgk31',
            database: 'stpaulus_cms_db'
        });

        console.log('📋 Checking agendas table structure...\n');

        // Check table structure
        const [columns] = await connection.query('DESCRIBE agendas');
        console.log('Struktur tabel agendas:');
        columns.forEach(col => {
            console.log(`  ${col.Field.padEnd(20)} ${col.Type}`);
        });

        // Check categories
        console.log('\n📂 Agenda categories:');
        const [categories] = await connection.query('SELECT id, name, color FROM agenda_categories');
        categories.forEach(cat => {
            console.log(`  [${cat.id}] ${cat.name} (${cat.color})`);
        });

        // Count existing agendas
        const [count] = await connection.query('SELECT COUNT(*) as total FROM agendas');
        console.log(`\n📊 Total agendas: ${count[0].total}`);

        // Show sample if any
        if (count[0].total > 0) {
            const [sample] = await connection.query('SELECT * FROM agendas LIMIT 3');
            console.log('\n📝 Sample agendas:');
            sample.forEach(a => {
                console.log(`  - ${a.title} (${a.start_date})`);
            });
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        if (connection) await connection.end();
    }
}

checkAgendasTable();
