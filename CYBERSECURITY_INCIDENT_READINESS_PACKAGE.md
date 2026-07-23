# 🛡️ CYBERSECURITY INCIDENT READINESS & DISASTER RECOVERY PACKAGE

**Paroki St. Paulus Juanda — Website & Sistem Informasi**
**Versi Dokumen:** 1.0 | **Tanggal:** 2026-07-23 | **Klasifikasi:** KONFIDENSIAL — INTERNAL TIM IT

> ⚠️ **PERINGATAN KERAHASIAAN**: Dokumen ini mengandung informasi teknis kritis mengenai prosedur keamanan sistem. Distribusi dokumen ini hanya diizinkan kepada personel IT yang berwenang.

---

## 📋 DAFTAR ISI

| Bagian | Judul |
|--------|-------|
| **BAGIAN 1** | Incident Response & Disaster Recovery Plan (IR/DRP) |
| 1.1 | Strategi Isolasi & Sanitasi (Containment) |
| 1.2 | Skenario Pemulihan — Restoration & Data Cleanliness |
| 1.3 | Hardening Pasca-Insiden (Re-building) |
| 1.4 | Audit & Post-Mortem / Root Cause Analysis |
| **BAGIAN 2** | Prosedur Darurat Keamanan Siber & Strategi Backup |
| 2.1 | RPO & RTO — Kerangka Toleransi Data & Downtime |
| 2.2 | Arsitektur Tahan Ransomware (Push vs. Pull) |
| 2.3 | Aturan 3-2-1 & Immutable Backup |
| **BAGIAN 3** | SOP Komunikasi Krisis & Hubungan Masyarakat |
| 3.1 | Template Pengumuman Pemeliharaan Darurat |
| 3.2 | Prosedur Notifikasi Kebocoran Data (Data Breach) |
| 3.3 | Strategi Pemulihan Kepercayaan (Trust Restoration) |

---

# ═══════════════════════════════════════════
# BAGIAN 1: INCIDENT RESPONSE & DISASTER RECOVERY PLAN (IR/DRP)
# ═══════════════════════════════════════════

## DEFINISI TINGKAT KEPARAHAN INSIDEN

Tentukan **Severity Level** sebelum memulai prosedur untuk menentukan skala respons:

| Level | Nama | Deskripsi | Contoh | Respons |
|-------|------|-----------|--------|---------|
| **SEV-1** | KRITIS | Sistem produksi mati total atau data dikonfirmasi bocor | Ransomware aktif, DB dump terdeteksi | Respons segera < 15 menit |
| **SEV-2** | TINGGI | Layanan terdegradasi atau indikasi kompromi | Login anomali berulang, file termodifikasi | Respons < 1 jam |
| **SEV-3** | SEDANG | Kerentanan ditemukan namun belum dieksploitasi | CVE kritis di dependensi | Respons dalam 24 jam |
| **SEV-4** | RENDAH | Gangguan minor atau anomali kecil | Percobaan brute-force gagal | Monitoring dan dokumentasi |

---

## §1.1 — STRATEGI ISOLASI & SANITASI (CONTAINMENT)

> **Tujuan:** Menghentikan pergerakan peretas dan mencegah eksfiltrasi data lebih lanjut **tanpa merusak jejak digital (bukti forensik)**.
> ⏱️ **Target Waktu Eksekusi:** < 30 menit dari deteksi (SEV-1)

### 🔴 FASE A: DETEKSI & DEKLARASI INSIDEN (T+0 menit)

```
CHECKLIST AWAL:

[ ] Identifikasi sumber alert:
    - Monitoring sistem (uptime check, error rate spike)
    - Laporan pengguna (anomali login, konten berubah)
    - Log anomali (akses jam tidak wajar, IP asing, volume query tidak normal)
    - Alert WAF / IDS / SIEM

[ ] Kumpulkan data awal:
    - Catat WAKTU TEPAT deteksi pertama (timestamp ISO 8601)
    - Screenshot/capture bukti awal dari dashboard monitoring
    - JANGAN hapus, restart, atau modifikasi apapun sebelum forensik

[ ] Deklarasikan Severity Level (SEV-1 s/d SEV-4)

[ ] Aktifkan Incident Response Team (IRT):
    - Incident Commander    (pengambil keputusan teknis)
    - Security Analyst      (investigasi forensik)
    - System Administrator  (eksekusi teknis)
    - Communications Officer (koordinasi non-teknis)
```

---

### 🔴 FASE B: ISOLASI JARINGAN (NETWORK SEGREGATION)

**⚠️ PRINSIP KRITIS: JANGAN MATIKAN SERVER — ISOLASI JARINGAN SAJA**

Mematikan server (shutdown/reboot) akan **menghapus permanen**:
- Data volatile di RAM: active network connections, malware payload in-memory, decryption keys
- State proses yang berjalan — bukti forensik terpenting yang tidak bisa dipulihkan

**Langkah B1 — Amankan Bukti Volatile (Lakukan SEBELUM isolasi)**

```bash
# 1. Dump active network connections
ss -tulnp > /forensic/network_connections_$(date +%Y%m%d_%H%M%S).txt
netstat -anlp >> /forensic/network_connections_$(date +%Y%m%d_%H%M%S).txt

# 2. Dump running processes
ps auxf > /forensic/running_processes_$(date +%Y%m%d_%H%M%S).txt

# 3. Dump bash history semua user
for user in $(cut -f1 -d: /etc/passwd); do
  if [ -f "/home/$user/.bash_history" ]; then
    cp "/home/$user/.bash_history" "/forensic/bash_history_${user}_$(date +%Y%m%d_%H%M%S).txt"
  fi
done

# 4. Catat siapa yang sedang login
who > /forensic/who_logged_in_$(date +%Y%m%d_%H%M%S).txt
last -n 50 >> /forensic/who_logged_in_$(date +%Y%m%d_%H%M%S).txt

# 5. List file yang dimodifikasi dalam 7 hari terakhir
find / -mtime -7 -not -path "/proc/*" -not -path "/sys/*" \
  > /forensic/recently_modified_files_$(date +%Y%m%d_%H%M%S).txt 2>/dev/null
```

**Langkah B2 — Bekukan Log Sebelum Tertimpa**

```bash
mkdir -p /forensic/logs/
cp -r /var/log/ /forensic/logs/system_logs_$(date +%Y%m%d_%H%M%S)/
cp -r /home/app/logs/ /forensic/logs/app_logs_$(date +%Y%m%d_%H%M%S)/ 2>/dev/null

# Set log files menjadi immutable sementara (mencegah penimpaan)
chattr +i /forensic/logs/ -R
```

**Langkah B3 — Pilih Metode Isolasi Jaringan**

*Opsi 1: Level Cloudflare/DNS (Paling Aman — tidak menyentuh server)*
```
1. Login ke Cloudflare Dashboard
2. Firewall Rules → Block All Traffic (sementara)
   ATAU
3. DNS → Ubah A Record ke IP halaman 503 statis
```

*Opsi 2: Level Web Server/Nginx*
```nginx
server {
    listen 80;
    listen 443 ssl;
    allow 203.0.113.1;  # IP Administrator yang diizinkan
    deny all;
    return 503;
    error_page 503 /maintenance.html;
}
```

*Opsi 3: Level Firewall/iptables (Linux VPS)*
```bash
IP_ADMIN="203.0.113.1"  # Ganti dengan IP admin sesungguhnya

# Simpan aturan existing terlebih dahulu
iptables-save > /forensic/iptables_backup_$(date +%Y%m%d_%H%M%S).rules

# KRITIS: Gunakan -j LOG sebelum -j DROP agar log forensik tetap berjalan
iptables -I INPUT 1 -s $IP_ADMIN -j ACCEPT
iptables -I INPUT 2 -j LOG --log-prefix "INCIDENT-BLOCKED: "
iptables -I INPUT 3 -j DROP
iptables -I OUTPUT 1 -d $IP_ADMIN -j ACCEPT
iptables -I OUTPUT 2 -j LOG --log-prefix "INCIDENT-BLOCKED-OUT: "
iptables -I OUTPUT 3 -j DROP
```

*Opsi 4: Platform Railway*
```
Railway: Settings → Networking → Custom Domains → Remove domain
ATAU: Environment Variable → tambahkan MAINTENANCE_MODE=true
```

---

### 🔴 FASE C: MEMUTUS KOMUNIKASI C2 (COMMAND & CONTROL)

Malware modern menggunakan saluran C2 untuk menerima instruksi dan mengeksfiltrasi data. Memutus C2 mencegah eskalasi lanjutan.

**Langkah C1 — Identifikasi Koneksi C2**

```bash
# Tampilkan semua koneksi ESTABLISHED yang mencurigakan
ss -tulnp | grep ESTABLISHED

# Resolusi IP mencurigakan
for ip in $(netstat -an | grep ESTABLISHED | awk '{print $5}' | cut -d: -f1 | sort -u); do
  echo "IP: $ip -> $(dig +short -x $ip)"
done

# Cek DNS query mencurigakan
cat /var/log/syslog | grep "named\|resolv" | grep -v "localhost"
```

**Langkah C2 — Blokir Koneksi C2 yang Teridentifikasi**

```bash
iptables -I OUTPUT 1 -d [IP_C2_MENCURIGAKAN] -j LOG --log-prefix "C2-BLOCKED: "
iptables -I OUTPUT 2 -d [IP_C2_MENCURIGAKAN] -j DROP

# Blokir domain C2 via hosts file
echo "0.0.0.0 malicious-c2-domain.com" >> /etc/hosts
```

**Langkah C3 — Revokasi Massal Kredensial (Dilakukan Serentak)**

> **Prinsip:** Anggap SEMUA kredensial telah dikompromisi. Revoke dulu, investigasi kemudian.

```
CHECKLIST REVOKASI KREDENSIAL — Lakukan dalam urutan prioritas:

[ ] [PRIORITAS TERTINGGI] Database:
    ALTER USER 'appuser'@'%' IDENTIFIED BY '[PASSWORD_BARU_KUAT]';
    REVOKE ALL ON *.* FROM 'appuser_lama'@'%';

[ ] [PRIORITAS TINGGI] JWT Secret:
    - Ganti JWT_SECRET di environment variables
    - Efek: Semua sesi login aktif akan ter-logout otomatis
    - Railway: Variables → Edit JWT_SECRET → Deploy ulang

[ ] [PRIORITAS TINGGI] API Keys Eksternal:
    - Cloudinary: Settings → Access Keys → Generate New Key → Delete Old
    - Google API: Cloud Console → Credentials → Delete/Regenerate
    - SMTP: Regenerate App Password
    - Gemini API: Google AI Studio → Delete & Create New

[ ] [PRIORITAS SEDANG] SSH Keys:
    - Hapus authorized_keys yang tidak dikenal
    - Generate SSH key pair baru: ssh-keygen -t ed25519

[ ] SSL/TLS Certificates:
    - Revoke sertifikat lama di Certificate Authority (Let's Encrypt/Cloudflare)
    - Re-issue sertifikat baru (private key mungkin sudah diekstrak peretas)

[ ] Session Database:
    - Invalidate semua session token: DELETE FROM sessions;
    - ATAU: UPDATE sessions SET invalidated_at = NOW() WHERE 1=1;
```

---

## §1.2 — SKENARIO PEMULIHAN (RESTORATION & DATA CLEANLINESS)

> **Tujuan:** Mengembalikan sistem ke kondisi operasional dengan data yang **terjamin bersih** dari kontaminasi.

### 🟡 FASE D: ANALISIS BACKUP & IDENTIFIKASI TITIK BERSIH

**Langkah D1 — Rekonstruksi Timeline Infeksi**

Sebelum memilih backup, tentukan kapan tepatnya sistem pertama kali dikompromikan:

```bash
# Cari file yang dimodifikasi dalam rentang waktu mencurigakan
find /var/www/ -newer /var/www/last_known_good_file -type f 2>/dev/null

# Analisis log Nginx untuk request anomali
grep -E "(eval|base64_decode|system\(|exec\(|shell_exec)" /var/log/nginx/access.log

# Cari webshell/backdoor di direktori publik
find /var/www/public/ -name "*.php" -newer /var/www/index.php -exec ls -la {} \;
find /uploads/ -name "*.php" -o -name "*.phtml" -o -name "*.php5"
```

```
DIAGRAM PEMILIHAN BACKUP:

T0          T1          T2         T3            T4
|           |           |          |              |
Backup      Backup      INFECTION  Backup         INSIDEN
Hari-7      Hari-1      POINT      (TERKONTAM.)   TERDETEKSI
(AMAN v)    (AMAN v)    [unknown]  (JANGAN x)     [Sekarang]

ATURAN:
→ Gunakan backup TERBARU yang timestampnya SEBELUM T2
→ Jika tidak yakin timestamp T2, gunakan backup paling jauh yang aman
→ Lebih baik data lama yang bersih daripada data baru yang terkontaminasi
```

**Langkah D2 — Verifikasi Keaslian & Integritas Backup**

```bash
# 1. Verifikasi hash integritas (harus identik dengan hash saat backup dibuat)
sha256sum backup_2026-07-20_00-00.sql.gz

# 2. Verifikasi signature digital (jika backup menggunakan GPG signing)
gpg --verify backup_2026-07-20_00-00.sql.gz.sig backup_2026-07-20_00-00.sql.gz

# 3. Cek backup tidak corrupt
gzip -t backup_2026-07-20_00-00.sql.gz && echo "File OK" || echo "File CORRUPT"

# 4. Preview isi backup tanpa decompress penuh
gzip -dc backup_2026-07-20_00-00.sql.gz | head -100
```

---

### 🟡 FASE E: STAGING RESTORE DI LINGKUNGAN TERISOLASI (SANDBOX)

> **Aturan Emas:** JANGAN pernah langsung restore backup ke production. **Selalu gunakan sandbox terisolasi terlebih dahulu.**

**Langkah E1 — Setup Sandbox Environment**

```bash
# Docker Isolated Container — network internal tidak ada akses internet
# Mencegah malware (jika ada di backup) membuat koneksi keluar
docker network create --internal sandbox-network

docker run -d \
  --name sandbox-db \
  --network sandbox-network \
  -e POSTGRES_PASSWORD=sandbox_pass_$(openssl rand -hex 8) \
  -p 127.0.0.1:5433:5432 \
  postgres:15-alpine

# Restore database ke sandbox
gzip -dc backup_2026-07-20_00-00.sql.gz | \
  docker exec -i sandbox-db psql -U postgres -d stpaulus_sandbox
```

**Langkah E2 — CHECKLIST PEMERIKSAAN KEBERSIHAN DATA (Wajib 100%)**

```
CHECKLIST AUDIT SANDBOX — WAJIB SELESAI 100% SEBELUM PROMOSI KE PRODUCTION
════════════════════════════════════════════════════════════════════════════

A. PEMERIKSAAN DATABASE:

[ ] [DB-01] Cek user/admin siluman yang tidak dikenal:
    SQL: SELECT id, email, role, created_at FROM users
         WHERE role IN ('admin', 'superadmin')
         ORDER BY created_at DESC;
    → Verifikasi setiap akun admin — apakah semuanya legitimate?

[ ] [DB-02] Cek modifikasi data mencurigakan (tabel yang diupdate saat insiden):
    SQL: SELECT table_name, update_time FROM information_schema.tables
         WHERE update_time BETWEEN '[WAKTU_SEBELUM_INSIDEN]' AND NOW()
         ORDER BY update_time DESC;

[ ] [DB-03] Cek stored procedure/trigger berbahaya:
    SQL: SELECT routine_name FROM information_schema.routines
         WHERE routine_type = 'PROCEDURE';
    → Bandingkan dengan daftar yang seharusnya ada

[ ] [DB-04] Verifikasi jumlah record total masuk akal (tidak berkurang signifikan)

B. PEMERIKSAAN FILESYSTEM:

[ ] [FS-01] Scan malware dengan ClamAV:
    clamscan -r --infected /path/to/restored/files/

[ ] [FS-02] Cari webshell di direktori publik:
    find ./public/ ./uploads/ -type f \( -name "*.php" -o -name "*.phtml" \) |
      xargs grep -l "eval\|base64_decode\|system\|exec"

[ ] [FS-03] Verifikasi hash file konfigurasi:
    sha256sum nuxt.config.ts package.json
    # Bandingkan dengan repository Git

[ ] [FS-04] Cek file dengan timestamp anomali (dibuat saat insiden terjadi)

C. PENGUJIAN FUNGSIONAL APLIKASI DI SANDBOX:

[ ] [APP-01] Deploy aplikasi ke sandbox (tanpa koneksi production)
[ ] [APP-02] Uji login user normal dan admin
[ ] [APP-03] Uji operasi CRUD utama (berita, kronik, booking)
[ ] [APP-04] Monitor network — tidak ada request ke domain mencurigakan
[ ] [APP-05] Performance test — tidak ada CPU/memory spike anomali

════════════════════════════════════════════════════════════════════════════
HASIL: [ ] LULUS → Lanjut ke Promosi Production
       [ ] GAGAL → Kembali ke D2, pilih backup lebih lama
════════════════════════════════════════════════════════════════════════════
```

---

## §1.3 — HARDENING PASCA-INSIDEN (RE-BUILDING FROM ZERO)

> **Prinsip:** Server lama = diasumsikan **permanently compromised**. Tidak boleh digunakan kembali.

### 🟢 FASE F: RE-PROVISIONING SERVER

```
CHECKLIST RE-PROVISIONING SERVER
══════════════════════════════════════════════════════════

[ ] [SRV-01] BUAT INSTANCE SERVER BARU dari fresh OS image:
    - Railway: New Service → Deploy from Docker/GitHub
    - VPS: Create new droplet/instance dari official image terbaru
    - JANGAN clone/snapshot dari server lama yang terinfeksi
    - OS: Ubuntu 22.04 LTS atau Debian 12 (minimal image)

[ ] [SRV-02] UPDATE SISTEM TERLEBIH DAHULU:
    apt update && apt upgrade -y
    apt install -y unattended-upgrades

[ ] [SRV-03] SSH HARDENING:
    - PermitRootLogin no
    - PasswordAuthentication no
    - Gunakan SSH key BARU (bukan key dari server lama)
    - Ubah port SSH ke non-standard (misal: 2222)
    - Aktifkan fail2ban: apt install fail2ban

[ ] [SRV-04] SETUP FIREWALL:
    ufw default deny incoming
    ufw default allow outgoing
    ufw allow 2222/tcp    # SSH (port custom)
    ufw allow 80/tcp      # HTTP
    ufw allow 443/tcp     # HTTPS
    ufw enable

[ ] [SRV-05] SETUP AUDIT LOGGING:
    apt install auditd
    auditctl -w /etc/passwd -p wa -k user-modify
    auditctl -w /etc/ssh/sshd_config -p wa -k ssh-config

[ ] [SRV-06] DEPLOY DARI SOURCE CODE REPOSITORY (bukan dari server lama):
    git clone git@github.com:org/stpaulus.git
    git log --oneline -5  # Verifikasi commit yang akan di-deploy

[ ] [DB-01] Buat instance DATABASE BARU (jangan restore dari server lama)
[ ] [DB-02] Gunakan nama database, username, password BERBEDA dari sebelumnya
[ ] [DB-03] Aktifkan SSL/TLS untuk koneksi database
[ ] [DB-04] Batasi akses database hanya dari IP server aplikasi
[ ] [DB-05] Setup backup otomatis dari awal (lihat Bagian 2)
[ ] [DB-06] Restore data bersih dari hasil sandbox (Fase E)
[ ] [DB-07] Verifikasi jumlah record setelah restore
```

---

### 🟢 FASE G: ROTASI MASSAL KREDENSIAL (THE GREAT KEY ROTATION)

> **Aturan:** Tidak ada satu pun secret lama yang boleh digunakan kembali. Semua dianggap bocor.

```
MATRIKS ROTASI KREDENSIAL PASCA-INSIDEN
══════════════════════════════════════════════════════════════════════════════
ITEM                  | PRIORITAS    | CARA ROTASI
══════════════════════════════════════════════════════════════════════════════
JWT_SECRET            | KRITIS 🔴   | openssl rand -base64 64
DATABASE_PASSWORD     | KRITIS 🔴   | Buat baru di panel database
DATABASE_USERNAME     | KRITIS 🔴   | Buat user baru, hapus yang lama
SESSION_SECRET        | KRITIS 🔴   | openssl rand -hex 32
GEMINI_API_KEY        | TINGGI 🟠   | Google AI Studio → Regenerate
CLOUDINARY_API_SECRET | TINGGI 🟠   | Cloudinary Console → Access Keys
CLOUDINARY_API_KEY    | TINGGI 🟠   | (sama dengan di atas)
GOOGLE_CLIENT_SECRET  | TINGGI 🟠   | Google Cloud Console → Credentials
SMTP_PASSWORD         | TINGGI 🟠   | Email provider → App Password baru
SSL Certificate       | TINGGI 🟠   | Revoke & Re-issue di CA
SSH Private Keys      | SEDANG 🟡   | ssh-keygen -t ed25519
Railway API Token     | SEDANG 🟡   | Railway Settings → Tokens → Revoke
GitHub PAT            | SEDANG 🟡   | GitHub Settings → Developer Settings
══════════════════════════════════════════════════════════════════════════════
```

```bash
# Generator Credentials Aman
echo "JWT_SECRET=$(openssl rand -base64 64 | tr -d '\n')"
echo "SESSION_SECRET=$(openssl rand -hex 32)"
echo "DB_PASSWORD=$(openssl rand -base64 32 | tr -dc 'a-zA-Z0-9!@#$%' | head -c 24)"

# Verifikasi tidak ada credential lama yang ter-hardcode di source code
grep -r "JWT_SECRET=\|password=" --include="*.ts" --include="*.vue" \
  --include="*.js" ./ | grep -v ".env" | grep -v node_modules

# Pastikan .env tidak ter-commit ke Git
echo ".env" >> .gitignore
git rm --cached .env 2>/dev/null || true
```

**Rotasi SSL/TLS Certificate:**
```bash
# Let's Encrypt — Revoke dan issue ulang
certbot revoke --cert-name stpaulus-juanda.com
certbot delete --cert-name stpaulus-juanda.com
certbot certonly --standalone -d stpaulus-juanda.com -d www.stpaulus-juanda.com

# Verifikasi sertifikat baru
openssl s_client -connect stpaulus-juanda.com:443 -showcerts 2>/dev/null | \
  openssl x509 -noout -dates
```

---

## §1.4 — AUDIT & POST-MORTEM (ROOT CAUSE ANALYSIS)

> **Tujuan:** Memahami bagaimana insiden terjadi untuk mencegah pengulangan. Post-mortem bukan ajang menyalahkan individu, melainkan perbaikan sistem.

### Kerangka Laporan RCA — Template Standar

```
══════════════════════════════════════════════════════════════════
      LAPORAN ROOT CAUSE ANALYSIS (RCA) PASCA-INSIDEN
══════════════════════════════════════════════════════════════════
Nomor Insiden  : INC-[YYYY]-[NNN]
Tanggal Insiden: [YYYY-MM-DD HH:MM] WIB
Severity Level : SEV-[1/2/3/4]
Status         : CLOSED / UNDER INVESTIGATION
Penyusun       : [Nama] / [Jabatan]
Review oleh    : [Nama] / [Tanggal Review]
══════════════════════════════════════════════════════════════════
```

**BAGIAN A — RINGKASAN EKSEKUTIF**

[Deskripsi singkat 3-5 kalimat: apa yang terjadi, kapan, dampak bisnis, dan langkah pemulihan yang diambil. Ditulis untuk audiens non-teknis.]

---

**BAGIAN B — KRONOLOGI TIMELINE**

| Waktu (WIB) | Event | Sumber Data |
|-------------|-------|-------------|
| YYYY-MM-DD HH:MM | Titik awal infeksi / entry point | Log Nginx |
| YYYY-MM-DD HH:MM | Peretas mendapatkan akses X | Audit Log |
| YYYY-MM-DD HH:MM | Aktivitas berbahaya dilakukan | DB Query Log |
| YYYY-MM-DD HH:MM | Insiden terdeteksi oleh tim / monitoring | Alert System |
| YYYY-MM-DD HH:MM | Deklarasi insiden & aktivasi IRT | Incident Log |
| YYYY-MM-DD HH:MM | Isolasi jaringan diterapkan | syslog |
| YYYY-MM-DD HH:MM | Restore staging dimulai | Deploy Log |
| YYYY-MM-DD HH:MM | Layanan production kembali online | Uptime Monitor |
| YYYY-MM-DD HH:MM | Semua kredensial dirotasi | Incident Log |

---

**BAGIAN C — ANALISIS DAMPAK**

- **Sistem Terdampak:** [Daftar sistem/komponen]
- **Data Terdampak:** [Jenis data, estimasi jumlah record]
- **Downtime:** [Durasi total downtime]
- **Data Loss (RPO aktual):** [Berapa jam/menit data hilang]
- **Dampak Bisnis:** [Gangguan layanan, pengguna terdampak]

---

**BAGIAN D — AKAR PENYEBAB (Root Cause)**

**Primary Root Cause:**
[Satu kalimat penjelasan teknis utama]
*Contoh: "SQL Injection pada endpoint /api/search yang tidak menggunakan parameterized query"*

**Analisis 5-Why:**
- Why 1: [Kenapa insiden terjadi?] → [Jawaban]
- Why 2: [Kenapa W1 bisa terjadi?] → [Jawaban]
- Why 3: [Kenapa W2 bisa terjadi?] → [Jawaban]
- Why 4: [Kenapa W3 bisa terjadi?] → [Jawaban]
- Why 5: **Root Cause sesungguhnya**

---

**BAGIAN E — TINDAKAN KOREKTIF & PREVENTIF (CAPA)**

| ID | Tindakan | PIC | Deadline | Status |
|----|----------|-----|----------|--------|
| CA-001 | Patch kerentanan SQL Injection | [Dev Lead] | YYYY-MM-DD | [ ] Open |
| CA-002 | Implementasi WAF (Cloudflare Rules) | [Sysadmin] | YYYY-MM-DD | [ ] Open |
| CA-003 | Aktifkan 2FA untuk semua admin | [Sysadmin] | YYYY-MM-DD | [ ] Open |
| CA-004 | Review dan audit kode autentikasi | [Dev Lead] | YYYY-MM-DD | [ ] Open |
| PA-001 | Setup anomaly detection & alerting | [DevOps] | YYYY-MM-DD | [ ] Open |
| PA-002 | Jadwal penetration test berkala | [Manager] | YYYY-MM-DD | [ ] Open |
| PA-003 | Training security awareness tim IT | [Manager] | YYYY-MM-DD | [ ] Open |

*CA = Corrective Action | PA = Preventive Action*

---

**BAGIAN F — LESSONS LEARNED**

- **Yang Berjalan Baik:** [Hal positif yang membantu respons cepat]
- **Yang Perlu Diperbaiki:** [Hal yang menghambat atau memperlambat respons]
- **Rekomendasi Strategis:** [Saran untuk mencegah kelas insiden serupa]

---

# ═══════════════════════════════════════════
# BAGIAN 2: PROSEDUR KONDISI DARURAT KEAMANAN SIBER & STRATEGI BACKUP
# ═══════════════════════════════════════════

## §2.1 — RPO & RTO: KERANGKA TOLERANSI DATA & DOWNTIME

### Definisi Konsep

```
KONSEP RPO & RTO
────────────────────────────────────────────────────────────

T0                   T1                T2
|                    |                 |
Backup terakhir      INSIDEN           Sistem Pulih
yang bersih          terjadi           kembali online

|────────────────────|
         RPO (Data hilang antara backup terakhir dan insiden)

                     |─────────────────|
                              RTO (Durasi sistem tidak bisa diakses)
```

### Matriks Klasifikasi Layanan — RPO & RTO

| LAYANAN | TIPE DATA | RPO MAX | RTO MAX | STRATEGI |
|---------|-----------|---------|---------|----------|
| Database Utama | Kritis | 1 jam | 2 jam | WAL Shipping / PITR |
| Booking / Pendaftaran | Kritis | 1 jam | 2 jam | WAL Shipping / PITR |
| Berita / Konten Web | Penting | 4 jam | 4 jam | Backup per 4 jam |
| Upload Gambar (Cloudinary) | Penting | 24 jam | 8 jam | Cloudinary CDN |
| Konfigurasi Aplikasi | Penting | N/A | 1 jam | Git Repository |
| Log Sistem | Forensik | 7 hari | N/A | Log aggregation |

### Teknik Near-Zero RPO: Point-in-Time Recovery (PITR) dengan WAL Shipping

PITR memungkinkan pemulihan database ke titik waktu tepat sebelum insiden — bukan hanya ke snapshot backup terakhir.

```
ARSITEKTUR PITR:

PostgreSQL Server (Production)
├── Data Pages (file data utama)
└── WAL (Write-Ahead Log) ────────────► Backup Server (WAL Archive)
    (setiap transaksi dilog)                 |
                                             ▼
                                 Saat recovery: replay WAL dari
                                 titik manapun yang dipilih
                                 (misal: 2026-07-23 14:30:00 — 1 detik sbl insiden)
```

```bash
# Konfigurasi PostgreSQL untuk WAL Archiving (postgresql.conf):
wal_level = replica
archive_mode = on
archive_command = 'cp %p /backup/wal_archive/%f'
# Atau ke S3: 'aws s3 cp %p s3://backup-bucket/wal/%f'

# Recovery PITR (recovery.conf / postgresql.conf v12+):
restore_command = 'cp /backup/wal_archive/%f %p'
recovery_target_time = '2026-07-23 14:29:59'  # 1 detik sebelum insiden
recovery_target_action = 'promote'
```

### Kalkulasi RPO & RTO Praktis

```
FORMULA KALKULASI RPO:
RPO_aktual = Waktu_Insiden - Waktu_Backup_Terakhir_Bersih

Contoh:
- Backup terakhir : 2026-07-23 00:00:00
- Insiden terjadi : 2026-07-23 15:30:00
- RPO_aktual      = 15.5 jam (tanpa PITR)
- Dengan PITR     = 1-5 menit (hanya data dalam WAL buffer)

BREAKDOWN RTO TARGET (SEV-1):
- Deteksi + Deklarasi         :  15 menit
- Isolasi jaringan            :  30 menit
- Verifikasi backup           :  60 menit
- Staging restore + audit     : 120 menit
- Re-provisioning server baru :  60 menit
- Deploy aplikasi             :  30 menit
- DNS propagasi               :  15 menit
- Smoke testing               :  30 menit
──────────────────────────────────────────
Total RTO target              : ~5.5 jam
```

---

## §2.2 — ARSITEKTUR TAHAN RANSOMWARE: BACKUP PUSH vs. PULL

### Perbandingan Konsep

```
BACKUP PUSH (TIDAK AMAN):
[SERVER PRODUKSI] ──push backup──► [BACKUP SERVER]
  (Terinfeksi Ransomware)                │
       │                                 │
       └── Enkripsi file SENDIRI         │
           + Hapus/enkripsi backup ─────►│
           (Punya credential akses tulis)│
                                    ❌ BACKUP IKUT TERENKRIPSI

BACKUP PULL (AMAN):
[SERVER PRODUKSI]                    [BACKUP SERVER]
  (Terinfeksi Ransomware)                │
       │◄──── Pull data setiap 4 jam ───┘
       │      (Hanya read-only ke produksi)
       │
       │  Ransomware hanya tahu server produksi
       │  Tidak mengetahui keberadaan backup server
       │  Tidak punya credential ke backup server
       │
                                     ✅ BACKUP TETAP AMAN
```

### Perbandingan Detail

| ASPEK | PUSH | PULL |
|-------|------|------|
| Initiator | Server produksi | Backup server |
| Arah Transfer | Produksi → Backup | Backup ← Produksi |
| Akses dari produksi ke backup | Read + Write | Tidak ada |
| Risiko jika produksi hacked | TINGGI — backup bisa dihapus | RENDAH — backup tidak terekspos |
| Credential backup di produksi | Ada (berbahaya) | Tidak ada (aman) |
| Rekomendasi | ❌ Tidak disarankan | ✅ Direkomendasikan |

### Implementasi Backup Pull untuk Sistem St. Paulus

```bash
#!/bin/bash
# File: /backup/scripts/pull_backup.sh
# Dijalankan via cron di BACKUP SERVER (bukan di produksi)

set -euo pipefail

PROD_HOST="prod.stpaulus.id"
PROD_USER="backup-readonly"           # User khusus, read-only
PROD_DB_NAME="stpaulus_production"
BACKUP_DIR="/backup/stpaulus"
DATE=$(date +%Y%m%d_%H%M%S)

# 1. Pull database dump dari server produksi (via SSH read-only)
ssh -i /backup/.ssh/prod_readonly_key \
    -o StrictHostKeyChecking=yes \
    -o ConnectTimeout=30 \
    ${PROD_USER}@${PROD_HOST} \
    "pg_dump -U $PROD_DB_NAME --no-password -F c" \
    | gzip > "${BACKUP_DIR}/db_${DATE}.dump.gz"

# 2. Hitung dan simpan hash integritas
sha256sum "${BACKUP_DIR}/db_${DATE}.dump.gz" > "${BACKUP_DIR}/db_${DATE}.dump.gz.sha256"

# 3. Push ke offsite immutable storage
aws s3 cp "${BACKUP_DIR}/db_${DATE}.dump.gz" \
    "s3://stpaulus-offsite-backup/$(date +%Y/%m/%d)/db_${DATE}.dump.gz" \
    --storage-class STANDARD_IA

# 4. Cleanup backup lokal lama (lebih dari 30 hari)
find "${BACKUP_DIR}" -name "*.dump.gz" -mtime +30 -delete

# Cron di backup server (setiap 4 jam):
# 0 */4 * * * /backup/scripts/pull_backup.sh >> /backup/logs/cron.log 2>&1
```

```bash
# Konfigurasi User Read-Only di Server Produksi
useradd -r -s /bin/bash -m backup-readonly

# Pasang public key dari backup server di authorized_keys dengan forced command:
# command="pg_dump -U stpaulus --no-password -F c stpaulus_production",
# no-port-forwarding,no-X11-forwarding,no-agent-forwarding,no-pty
# ssh-ed25519 AAAA...[PUBLIC KEY DARI BACKUP SERVER]

# Efek: Backup server hanya bisa menjalankan pg_dump, tidak bisa perintah lain
```

---

## §2.3 — ATURAN 3-2-1 & IMMUTABLE BACKUP

### Konsep Aturan 3-2-1

```
ATURAN 3-2-1 BACKUP
═══════════════════════════════════════════════════════════════

3 SALINAN DATA:
  Salinan 1: Data LIVE/Produksi (Railway)
  Salinan 2: Backup Lokal (backup server / NAS kantor)
  Salinan 3: Backup Offsite (S3 / Backblaze B2)

2 MEDIA/TIPE STORAGE BERBEDA:
  Media A: SSD/Volume di Cloud (Railway, Supabase)
  Media B: Object Storage terpisah (S3, Backblaze B2)

1 SALINAN OFFSITE (Lokasi Fisik/Geografis Berbeda):
  Tujuan: Proteksi dari bencana fisik (kebakaran, banjir,
          listrik mati) yang menimpa satu lokasi fisik
```

### Arsitektur 3-2-1 St. Paulus

```
LAYER 1: PRODUKSI (Railway)
  ├── Database PostgreSQL (Live)
  ├── Cloudinary (Gambar — sudah offsite by design)
  └── Git Repository (Kode — GitHub)
          │
          ▼ Pull setiap 4 jam (cron di backup server)

LAYER 2: BACKUP LOKAL (Server/NAS)
  ├── Daily snapshot database (retain 30 hari)
  ├── WAL archive (continuous, retain 7 hari)
  └── File upload backup (sync harian)
          │
          ▼ Sync otomatis setelah setiap backup

LAYER 3: OFFSITE BACKUP (Backblaze B2 / AWS S3)
  ├── Encrypted database dumps (retain 90 hari)
  ├── Immutable copies / WORM lock 30 hari
  └── Monthly full backup (retain 12 bulan)

VERIFIKASI: Test restore otomatis setiap minggu ke sandbox
```

### Cara Kerja WORM (Write Once, Read Many)

```
TANPA Immutable:             DENGAN Immutable (Object Lock):

backup.sql.gz                 backup.sql.gz
     │                              │
     ▼                              │ [LOCKED: 30 hari]
Siapa pun (termasuk           │
peretas dengan root)          Siapapun yang coba hapus/edit
bisa hapus/enkripsi           akan DITOLAK oleh storage provider
backup ini                    Bahkan admin tidak bisa delete!
```

### Implementasi S3 Object Lock (WORM)

```bash
# Aktifkan Object Lock saat buat bucket (tidak bisa dimatikan setelah aktif)
aws s3api create-bucket \
    --bucket stpaulus-immutable-backup \
    --region ap-southeast-1 \
    --object-lock-enabled-for-bucket

# Set default retention policy (30 hari COMPLIANCE mode)
aws s3api put-object-lock-configuration \
    --bucket stpaulus-immutable-backup \
    --object-lock-configuration '{
        "ObjectLockEnabled": "Enabled",
        "Rule": {
            "DefaultRetention": {
                "Mode": "COMPLIANCE",
                "Days": 30
            }
        }
    }'

# COMPLIANCE mode: Bahkan root AWS account tidak bisa hapus sebelum retention expires
# GOVERNANCE mode: Admin dengan izin khusus bisa bypass (kurang ketat)

# Upload backup — otomatis terkunci 30 hari
aws s3 cp backup_2026-07-23.sql.gz \
    s3://stpaulus-immutable-backup/2026/07/23/ \
    --storage-class STANDARD_IA

# Verifikasi lock status
aws s3api get-object-retention \
    --bucket stpaulus-immutable-backup \
    --key 2026/07/23/backup_2026-07-23.sql.gz
```

### Checklist Implementasi Backup Immutable

```
[ ] [IMM-01] Buat dedicated bucket untuk immutable backup (terpisah dari backup biasa)
[ ] [IMM-02] Aktifkan Object Lock COMPLIANCE mode (bukan Governance)
[ ] [IMM-03] Set retention minimum 30 hari untuk backup harian
[ ] [IMM-04] Set retention 365 hari untuk backup bulanan (keperluan audit)
[ ] [IMM-05] IAM policy backup user: HANYA bisa upload, tidak bisa delete/overwrite
[ ] [IMM-06] Aktifkan versioning pada bucket (backup lama tidak tertimpa)
[ ] [IMM-07] Aktifkan S3 Access Logging (catat siapa mengakses bucket)
[ ] [IMM-08] MFA Delete: Hapus bucket hanya bisa dengan autentikasi MFA
[ ] [IMM-09] Setup alert jika ada percobaan hapus yang ditolak sistem
[ ] [IMM-10] Test restore bulanan: verifikasi backup bisa di-restore dengan sukses
[ ] [IMM-11] Enkripsi backup dengan kunci yang tersimpan terpisah dari server utama
[ ] [IMM-12] Simpan recovery documentation OFFLINE (cetak / USB terenkripsi)
```

---

# ═══════════════════════════════════════════
# BAGIAN 3: SOP KOMUNIKASI KRISIS & HUBUNGAN MASYARAKAT
# ═══════════════════════════════════════════

## §3.1 — TEMPLATE PENGUMUMAN PEMELIHARAAN DARURAT

> **Lima Prinsip Komunikasi Krisis:**
> 1. **Proaktif** — Sampaikan sebelum isu menyebar sendiri
> 2. **Transparan** — Akui masalah, jangan disembunyikan
> 3. **Non-teknis** — Jangan sebut detail kerentanan yang bisa dieksploitasi
> 4. **Actionable** — Beri tahu pengguna apa yang perlu mereka lakukan
> 5. **Empati** — Akui ketidaknyamanan yang dialami pengguna

---

### TEMPLATE A — PENGUMUMAN WEBSITE (Status Page / Banner)

**Versi Singkat (Header Banner):**

```
⚠️  PEMELIHARAAN SISTEM SEDANG BERLANGSUNG
Kami sedang melakukan peningkatan keamanan sistem.
Beberapa layanan mungkin tidak dapat diakses sementara.
Estimasi selesai: [HH:MM] WIB. Terima kasih atas kesabaran Anda.
```

**Versi Lengkap (Halaman Status):**

```
════════════════════════════════════════════════════════════════
        PENGUMUMAN RESMI PEMELIHARAAN SISTEM
        Paroki St. Paulus Juanda
════════════════════════════════════════════════════════════════

Diperbarui: [Hari], [DD Bulan YYYY], pukul [HH:MM] WIB

STATUS LAYANAN SAAT INI:
🔴 Website Utama               — Tidak Tersedia
🔴 Portal Informasi & Berita   — Tidak Tersedia
🟡 Pendaftaran Sakramen        — Terbatas
🟢 Informasi Misa              — Tersedia (via kontak langsung)

APA YANG SEDANG TERJADI?
Tim IT Paroki saat ini sedang melaksanakan pemeliharaan sistem
terencana untuk meningkatkan keamanan dan performa infrastruktur
digital kami. Proses ini memerlukan penghentian layanan sementara.

APA YANG HARUS DILAKUKAN?
Selama periode pemeliharaan berlangsung, hubungi kami melalui:
  📞 Sekretariat Paroki: [NOMOR TELEPON]
  📧 Email: [EMAIL PAROKI]
  💬 WhatsApp Sekretariat: [NOMOR WA]

ESTIMASI PEMULIHAN:
⏰ [Hari], [DD Bulan YYYY], pukul [HH:MM] WIB
Pembaruan status setiap [X] jam.

Kami mohon maaf atas ketidaknyamanan yang ditimbulkan.
Keamanan dan kenyamanan data Anda adalah prioritas utama kami.

Hormat kami,
Tim IT Paroki St. Paulus Juanda
════════════════════════════════════════════════════════════════
```

---

### TEMPLATE B — PESAN WHATSAPP & MEDIA SOSIAL

**Pesan WhatsApp (Format Umat):**

```
🔔 *INFORMASI PENTING — WEBSITE PAROKI ST. PAULUS JUANDA*

Kepada Umat Paroki yang terkasih,

Kami ingin menginformasikan bahwa *website paroki* saat ini
sedang dalam proses *pemeliharaan sistem* untuk meningkatkan
keamanan layanan digital kita bersama.

📌 *Layanan yang terdampak:*
• Website utama (stpaulus-juanda.com)
• Sistem pendaftaran online

⏰ *Estimasi selesai:* [Hari], [Tanggal], pukul [HH:MM] WIB

📞 *Selama pemeliharaan, hubungi kami di:*
• Sekretariat Paroki: [Nomor Telepon]
• WhatsApp Paroki: [Nomor WA]

Kami mohon maaf atas ketidaknyamanan ini.
Pembaruan informasi akan kami sampaikan di grup ini.

Salam Damai Kristus 🙏
_Tim Paroki St. Paulus Juanda_
```

**Update Resolusi (Saat Sistem Pulih):**

```
✅ *SISTEM TELAH PULIH — TERIMA KASIH ATAS KESABARAN ANDA*

Kepada Umat Paroki yang terkasih,

Website paroki St. Paulus Juanda telah kembali beroperasi
secara normal per pukul [HH:MM] WIB.

🌐 Website: [URL]
📱 Semua layanan online telah aktif kembali.

Sebagai bagian dari komitmen kami terhadap keamanan sistem,
kami telah melakukan pembaruan dan peningkatan proteksi
pada infrastruktur digital paroki.

Terima kasih atas kepercayaan dan kesabaran Anda.

Salam Damai Kristus 🙏
_Tim IT Paroki St. Paulus Juanda_
```

**Caption Instagram/Facebook:**

```
━━━━━━━━━━━━━━━━━━━━━━━━
🔧 PEMELIHARAAN SISTEM SEDANG BERLANGSUNG
━━━━━━━━━━━━━━━━━━━━━━━━

Saat ini website kami sedang menjalani pemeliharaan
untuk meningkatkan layanan dan keamanan sistem.

🕐 Estimasi selesai: [Hari, Tanggal, Jam] WIB

Selama masa ini, Anda tetap dapat menghubungi kami
melalui sekretariat paroki.

📞 [Nomor Telepon]
📧 [Email Paroki]

Terima kasih atas pengertian dan kesabaran Anda 🙏
God bless you! ✝️

#StPaulusJuanda #PemeliharaanSistem
━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## §3.2 — PROSEDUR PENANGANAN KEBOCORAN DATA (DATA BREACH NOTIFICATION)

### Alur Koordinasi Internal

```
ALUR RESPONS KEBOCORAN DATA
════════════════════════════════════════════════════════════════

[T+0]      DETEKSI INDIKASI KEBOCORAN DATA
                    │
                    ▼
[T+0~15]   Laporkan ke Incident Commander
                    │
                    ▼
[T+15]     ASESMEN AWAL:
           [ ] Jenis data apa yang mungkin bocor?
           [ ] Berapa estimasi pengguna terdampak?
           [ ] Apakah masih berlangsung atau sudah berhenti?
                    │
           ┌────────┴────────────────────┐
           │ MASIH BERLANGSUNG           │ SUDAH BERHENTI
           │                             │
           ▼                             ▼
   Eksekusi Bagian 1           Lanjut ke Asesmen Mendalam
   (Isolasi segera)
                    │
                    ▼
[T+1 jam]  ASESMEN MENDALAM:
           [ ] Konfirmasi jenis data yang bocor
           [ ] Tentukan scope kebocoran (sudah dipublikasi?)
           [ ] Cek dark web / forum hacker

                    │
                    ▼
[T+2 jam]  KEPUTUSAN NOTIFIKASI:
           [ ] Data pribadi bocor → WAJIB NOTIFIKASI
           [ ] Konsultasikan dengan DPO / Legal
           [ ] Pertimbangkan regulasi UU PDP No. 27/2022

                    │
                    ▼
[T+72 jam] NOTIFIKASI PENGGUNA & REGULATOR
           (72 jam = batas waktu umum per GDPR/PDPA)

                    │
                    ▼
           MONITORING BERKELANJUTAN & CAPA
════════════════════════════════════════════════════════════════
```

### Klasifikasi Data (UU PDP No. 27 Tahun 2022)

| Jenis Data | Contoh | Kewajiban |
|------------|--------|-----------|
| **Data Spesifik/Sensitif** | Kesehatan, biometrik, genetika, agama, data anak | Lapor BSSN dalam 14 hari kerja |
| **Data Umum** | Nama, email, nomor HP, alamat, tanggal lahir | Notifikasi pengguna dalam waktu wajar |

### Template Email Notifikasi Resmi Data Breach

```
═══════════════════════════════════════════════════════════════════
SUBJEK: Pemberitahuan Penting Mengenai Keamanan Akun Anda
        di Paroki St. Paulus Juanda
═══════════════════════════════════════════════════════════════════

Kepada Yth.,
[Nama Pengguna]

Kami menghubungi Anda untuk menyampaikan pemberitahuan penting
dan terbuka mengenai insiden keamanan yang memengaruhi informasi
Anda di sistem digital Paroki St. Paulus Juanda.

─────────────────────────────────────────────────────────────────
APA YANG TERJADI?
─────────────────────────────────────────────────────────────────
Pada [TANGGAL], tim kami mendeteksi akses tidak sah terhadap
sistem database kami. Setelah penyelidikan menyeluruh, kami
mengkonfirmasi bahwa insiden ini berlangsung antara [TANGGAL AWAL]
hingga [TANGGAL AKHIR].

─────────────────────────────────────────────────────────────────
INFORMASI APA YANG MUNGKIN TERDAMPAK?
─────────────────────────────────────────────────────────────────
[ ] Nama lengkap      — YA / TIDAK
[ ] Alamat email      — YA / TIDAK
[ ] Nomor telepon     — YA / TIDAK
[ ] Password (hash)   — YA / TIDAK

Kami TIDAK menyimpan: Nomor kartu kredit/debit atau data rekening bank.

─────────────────────────────────────────────────────────────────
LANGKAH YANG TELAH KAMI AMBIL
─────────────────────────────────────────────────────────────────
1. Mengamankan dan mengisolasi sistem yang terdampak
2. Melibatkan tim keamanan siber untuk investigasi menyeluruh
3. Memperbarui dan memperkuat seluruh sistem keamanan
4. Berkoordinasi dengan pihak berwenang terkait

─────────────────────────────────────────────────────────────────
LANGKAH YANG SEBAIKNYA ANDA AMBIL
─────────────────────────────────────────────────────────────────
1. GANTI PASSWORD — Ubah password akun Anda di website paroki
   dan akun lain yang menggunakan password yang sama.

2. WASPADA PHISHING — Kami TIDAK akan meminta password Anda
   melalui email atau telepon.

3. PANTAU AKUN — Perhatikan aktivitas tidak biasa di akun
   email dan media sosial Anda dalam beberapa minggu ke depan.

─────────────────────────────────────────────────────────────────
INFORMASI KONTAK
─────────────────────────────────────────────────────────────────
📧 Email Keamanan : security@stpaulus-juanda.com
📞 Hotline        : [NOMOR TELEPON]
🕐 Jam Layanan    : Senin-Sabtu, 08.00-16.00 WIB

Kami sangat menyesali insiden ini. Kepercayaan Anda adalah hal
yang tidak ternilai, dan kami berkomitmen untuk terus meningkatkan
keamanan sistem demi melindungi data Anda.

Hormat kami,
[Nama Pimpinan Paroki]
Paroki St. Paulus Juanda
═══════════════════════════════════════════════════════════════════
```

---

## §3.3 — STRATEGI PEMULIHAN KEPERCAYAAN (TRUST RESTORATION)

### Roadmap Trust Restoration

```
FASE 1: RESPONS SEGERA (Hari 1-3)
─────────────────────────────────────
[ ] Komunikasi proaktif (jangan tunggu rumor berkembang)
[ ] Pengumuman resmi di semua saluran komunikasi
[ ] Hotline khusus untuk pertanyaan pengguna
[ ] Pembaruan status setiap 4-6 jam

FASE 2: STABILISASI (Minggu 1-2)
─────────────────────────────────────
[ ] Notifikasi langsung ke semua pengguna terdampak
[ ] Update berkala tentang kemajuan pemulihan
[ ] Transparansi: publikasi fakta insiden (tanpa detail teknis berbahaya)

FASE 3: PEMULIHAN AKTIF (Minggu 2-4)
─────────────────────────────────────
[ ] Publikasi "Security Enhancement Report" (lihat template di bawah)
[ ] Implementasi kontrol keamanan baru (bisa diumumkan publik)
[ ] Sesi edukasi keamanan untuk pengguna (cara proteksi diri)

FASE 4: KOMITMEN JANGKA PANJANG (Bulan 1-6)
─────────────────────────────────────
[ ] Audit keamanan independen oleh pihak ketiga
[ ] Laporan transparansi tahunan
[ ] Review & pembaruan dokumen IR/DRP ini (setiap 6 bulan)
```

### Template: Security Enhancement Report (Laporan Peningkatan Keamanan)

```
═══════════════════════════════════════════════════════════════════
        LAPORAN PENINGKATAN KEAMANAN SISTEM
        Paroki St. Paulus Juanda
        Periode: [Bulan Tahun]
═══════════════════════════════════════════════════════════════════

KOMITMEN KAMI KEPADA ANDA
Demi menjaga kepercayaan dan keamanan data umat paroki yang kami
layani, kami secara terbuka menyampaikan langkah-langkah peningkatan
keamanan yang telah kami implementasikan.

─────────────────────────────────────────────────────────────────
PENINGKATAN YANG TELAH DIIMPLEMENTASIKAN
─────────────────────────────────────────────────────────────────

🔐 AUTENTIKASI & AKSES
  ✅ Verifikasi Dua Langkah (2FA) untuk semua akun administrator
  ✅ Kebijakan password baru: minimum 12 karakter, kombinasi kompleks
  ✅ Sesi login otomatis berakhir setelah 30 menit tidak aktif
  ✅ Pemantauan login anomali (deteksi dari lokasi tidak biasa)

🛡️ KEAMANAN INFRASTRUKTUR
  ✅ Web Application Firewall (WAF) aktif memblokir serangan umum
  ✅ Pemindaian kerentanan otomatis setiap minggu
  ✅ Enkripsi data sensitif dengan standar AES-256
  ✅ Pemisahan jaringan antara database dan server aplikasi

💾 BACKUP & PEMULIHAN
  ✅ Backup otomatis setiap 4 jam ke 3 lokasi berbeda (aturan 3-2-1)
  ✅ Backup immutable tidak dapat dihapus selama 30 hari (WORM)
  ✅ Uji pemulihan (restore test) dilakukan setiap bulan
  ✅ Target pemulihan: sistem online dalam 4 jam (RTO target)

👁️ MONITORING & DETEKSI
  ✅ Pemantauan sistem 24/7 dengan notifikasi otomatis
  ✅ Analisis log keamanan secara berkala
  ✅ Sistem deteksi intrusi (IDS) aktif

📋 KEBIJAKAN & PROSEDUR
  ✅ Prosedur respons insiden terdokumentasi dan telah diuji
  ✅ Pelatihan keamanan siber untuk seluruh tim IT
  ✅ Kebijakan pengungkapan kerentanan yang bertanggung jawab

─────────────────────────────────────────────────────────────────
YANG SEDANG DALAM PROSES
─────────────────────────────────────────────────────────────────
🔄 Audit keamanan independen oleh pihak ketiga — Target: [Bulan]
🔄 Enkripsi end-to-end untuk data pribadi sensitif
🔄 Program pelatihan keamanan digital untuk pengurus paroki

─────────────────────────────────────────────────────────────────
KOMITMEN KE DEPAN
─────────────────────────────────────────────────────────────────
• Laporan keamanan ini diterbitkan setiap 6 bulan
• Notifikasi kepada Anda dalam 72 jam jika ada insiden yang
  berpotensi memengaruhi data Anda
• Peningkatan standar keamanan berkelanjutan

Pertanyaan tentang keamanan: security@stpaulus-juanda.com

[Tanda tangan & Nama Ketua Dewan Paroki / Pastor Kepala]
═══════════════════════════════════════════════════════════════════
```

---

# LAMPIRAN: KARTU REFERENSI CEPAT

> CETAK DAN TEMPEL DI TEMPAT YANG MUDAH DILIHAT TIM IT

```
══════════════════════════════════════════════════════════════════
   🚨 INCIDENT RESPONSE QUICK CARD — ST. PAULUS JUANDA
══════════════════════════════════════════════════════════════════

LANGKAH 1 — JANGAN PANIK. CATAT WAKTU SEKARANG.

LANGKAH 2 — HUBUNGI INCIDENT COMMANDER:
   📞 [NAMA UTAMA]  : [NOMOR HP]
   📞 [NAMA BACKUP] : [NOMOR HP]

LANGKAH 3 — JANGAN MATIKAN SERVER. JANGAN HAPUS FILE.

LANGKAH 4 — ISOLASI JARINGAN (pilih satu):
   A. Cloudflare → Firewall Rules → Block All
   B. Nginx → Tambah: return 503;
   C. Railway → Remove custom domain

LANGKAH 5 — AMANKAN BUKTI FORENSIK:
   ss -tulnp > /tmp/connections.txt
   cp -r /var/log/ /tmp/forensic_logs/

LANGKAH 6 — REVOKE KREDENSIAL (urutan ini):
   1. Database password (PALING KRITIS)
   2. JWT_SECRET (logout semua user otomatis)
   3. API Keys (Cloudinary, Google, Gemini, dll)

LANGKAH 7 — LOKASI BACKUP BERSIH:
   📁 Backup Lokal : [PATH_BACKUP_SERVER]
   ☁️  Offsite      : [S3_BUCKET_URL]

⚠️  CATAT semua langkah + timestamp untuk RCA!

══════════════════════════════════════════════════════════════════
KONTAK DARURAT:
• Incident Commander  : [Nama] — [HP]
• System Admin        : [Nama] — [HP]
• Railway Support     : support.railway.app
• Cloudflare Support  : dash.cloudflare.com/support
• BSSN (Data Breach)  : 021-2149-2000 / info@bssn.go.id
══════════════════════════════════════════════════════════════════
```

---

**Dokumen ini disiapkan oleh:** Tim IT Paroki St. Paulus Juanda
**Versi:** 1.0 | **Tanggal Berlaku:** 2026-07-23
**Jadwal Review Berikutnya:** 2027-01-23 *(review setiap 6 bulan)*
**Lokasi Penyimpanan:** Repository Git (encrypted) + Salinan Offline Terenkripsi

> *"By failing to prepare, you are preparing to fail."* — Benjamin Franklin
