import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import readline from 'readline';

// Muat variabel environment
dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('==================================================');
console.log('🛡️  CLEAN SLATE TRIGGER (FORCE PASSWORD RESET) 🛡️');
console.log('==================================================');
console.log('Peringatan: Menjalankan skrip ini akan memaksa SELURUH pengguna');
console.log('(kecuali Super Admin) untuk mereset password mereka. Mereka tidak');
console.log('akan bisa login dengan password lama mereka.');
console.log('');

rl.question('Apakah Anda yakin ingin melanjutkan? (Ketik YES untuk lanjut): ', async (answer) => {
  if (answer !== 'YES') {
    console.log('Operasi dibatalkan.');
    rl.close();
    process.exit(0);
  }

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'stpaulus'
    });

    // Menandai seluruh user yang memiliki role_id (admin panel users) kecuali yang role-nya super_admin
    // Jika tabel roles belum ter-join dengan baik, kita kecualikan saja id 1 (Super Admin bawaan)
    // Asumsi: super admin memiliki role string 'super_admin'
    const [result] = await connection.execute(
      `UPDATE users 
       SET requires_password_reset = 1 
       WHERE role != 'super_admin' AND role != 'admin_sekretariat'` // Jika mau mengecualikan admin sekretariat utama
    );

    console.log('\n✅ BERHASIL: Proses Clean Slate telah diterapkan!');
    console.log(`Jumlah akun yang dibekukan / diwajibkan reset password: ${(result as any).affectedRows}`);
    console.log('\nSeluruh pengguna yang terdampak kini akan ditolak saat login dan diinstruksikan untuk menghubungi Anda.');
    
    await connection.end();
  } catch (error) {
    console.error('\n❌ Terjadi kesalahan saat menghubungi database:', error.message);
  } finally {
    rl.close();
  }
});
