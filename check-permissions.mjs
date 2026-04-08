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

        // Check roles
        const [roles] = await connection.execute('SELECT id, name FROM roles');
        console.log('Roles:');
        roles.forEach(role => console.log('  -', role.id, role.name));

        // Check permissions for admin_sekretariat (role_id = 3)
        const [rolePerms] = await connection.execute('SELECT p.name FROM permissions p JOIN role_permissions rp ON p.id = rp.permission_id WHERE rp.role_id = 3');
        console.log('Permissions for admin_sekretariat:');
        rolePerms.forEach(perm => console.log('  -', perm.name));

        // Check if manage_church_announcements exists
        const [announcePerm] = await connection.execute('SELECT id, name FROM permissions WHERE name = "manage_church_announcements"');
        console.log('manage_church_announcements permission:', announcePerm.length > 0 ? announcePerm[0] : 'NOT FOUND');

        await connection.end();
    } catch (error) {
        console.error('Database error:', error.message);
    }
}

checkPermissions();