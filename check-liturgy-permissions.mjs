import mysql from 'mysql2/promise';

const config = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'pressgk31',
    database: 'stpaulus_cms_db'
};

async function checkPermissions() {
    try {
        const connection = await mysql.createConnection(config);
        console.log('Connected to database');

        // Check permissions for admin_sekretariat (role_id = 3)
        const [rolePerms] = await connection.execute('SELECT p.name FROM permissions p JOIN role_permissions rp ON p.id = rp.permission_id WHERE rp.role_id = 3 AND p.name LIKE "%liturgy%"');
        console.log('Liturgy permissions for admin_sekretariat:');
        rolePerms.forEach(perm => console.log('  -', perm.name));

        // Check if manage_liturgy_types exists
        const [liturgyPerm] = await connection.execute('SELECT id, name FROM permissions WHERE name = "manage_liturgy_types"');
        console.log('manage_liturgy_types permission:', liturgyPerm.length > 0 ? liturgyPerm[0] : 'NOT FOUND');

        await connection.end();
    } catch (error) {
        console.error('Database error:', error.message);
    }
}

checkPermissions();