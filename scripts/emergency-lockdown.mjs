import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import crypto from 'crypto';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Muat variabel environment
dotenv.config();

console.log('==================================================');
console.log('⚠️  EMERGENCY LOCKDOWN INITIATED ⚠️');
console.log('==================================================');

async function runLockdown() {
  // 1. DATABASE BACKUP (Forensic Evidence)
  console.log('\n[1/3] Memulai snapshot database darurat...');
  try {
    // Memanggil skrip backup yang sudah ada
    console.log('Menjalankan utilitas backup-database...');
    execSync('node scripts/backup-database.mjs', { stdio: 'inherit' });
    console.log('✅ Snapshot database berhasil diambil.');
  } catch (err) {
    console.error('❌ Gagal membuat snapshot database. Melanjutkan prosedur...', err.message);
  }

  // 2. ENABLE GLOBAL MAINTENANCE MODE (Containment)
  console.log('\n[2/3] Mengunci akses publik (Maintenance Mode)...');
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'stpaulus'
  });

  try {
    // Daftar semua halaman yang dikunci (berdasarkan MANAGED_PAGES di utils/maintenance.ts)
    const lockedConfig = {
      "beranda": true,
      "about-us": true,
      "sejarah": true,
      "kontak": true,
      "contact-us": true,
      "help-center": true,
      "artikel": true,
      "berita": true,
      "blog": true,
      "jadwal-misa": true,
      "misa": true,
      "agenda": true,
      "romo-bertugas": true,
      "booking": true,
      "pemesanan-ruang": true,
      "cek-status": true,
      "dokumen-paroki": true,
      "dpp-paroki": true,
      "bgkp-paroki": true,
      "teritorial-paroki": true,
      "data-statistika-paroki": true,
      "kronik-gereja": true,
      "galeri": true,
      "layar-tv": true,
      "search": true
    };

    const configString = JSON.stringify(lockedConfig);
    
    await connection.execute(
      `INSERT INTO app_settings (setting_key, setting_value) 
       VALUES ('maintenance_config', ?) 
       ON DUPLICATE KEY UPDATE setting_value = ?`,
      [configString, configString]
    );
    console.log('✅ Maintenance Mode global berhasil diaktifkan di database.');
  } catch (err) {
    console.error('❌ Gagal mengunci database:', err.message);
  } finally {
    await connection.end();
  }

  // 3. JWT SECRET ROTATION (Session Revocation)
  console.log('\n[3/3] Membatalkan seluruh sesi pengguna (Key Rotation)...');
  try {
    const envPath = join(process.cwd(), '.env');
    let envContent = readFileSync(envPath, 'utf-8');
    
    // Generate new secure secret (64 characters hex)
    const newSecret = crypto.randomBytes(32).toString('hex');
    
    // Replace existing JWT_SECRET or append it
    if (envContent.includes('JWT_SECRET=')) {
      envContent = envContent.replace(/JWT_SECRET=.*/g, `JWT_SECRET=${newSecret}`);
    } else {
      envContent += `\nJWT_SECRET=${newSecret}\n`;
    }
    
    writeFileSync(envPath, envContent, 'utf-8');
    console.log('✅ JWT_SECRET berhasil diubah. Semua sesi login saat ini menjadi INVALID (Termasuk milik peretas).');
  } catch (err) {
    console.error('❌ Gagal mengubah JWT_SECRET:', err.message);
  }

  console.log('\n==================================================');
  console.log('🔒 LOCKDOWN SELESAI');
  console.log('==================================================');
  console.log('TINDAKAN SELANJUTNYA YANG HARUS ANDA LAKUKAN:');
  console.log('1. RESTART aplikasi (Nuxt Server/PM2) agar JWT_SECRET baru dimuat.');
  console.log('2. Matikan instance server dari jaringan publik jika ini adalah serangan aktif.');
  console.log('3. Lakukan analisis forensik pada file backup database yang baru saja dibuat.');
}

runLockdown().catch(console.error);
