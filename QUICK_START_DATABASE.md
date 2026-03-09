# 🚀 Quick Start Guide - Database Management

## 📋 Table of Contents
- [Environment Setup](#environment-setup)
- [Common Commands](#common-commands)
- [Daily Operations](#daily-operations)
- [Emergency Procedures](#emergency-procedures)
- [Useful Scripts](#useful-scripts)

---

## 🔧 Environment Setup

### 1. Initial Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit with your credentials
nano .env
```

### 2. Required Environment Variables

```env
# MySQL Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=your_username
MYSQL_PASSWORD=your_secure_password
MYSQL_DATABASE=stpaulus_cms_db

# JWT Secret (generate with command below)
JWT_SECRET=your_random_64_char_hex_string
```

### 3. Generate Secure Secrets

```bash
# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate database password
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 💻 Common Commands

### NPM Scripts (Recommended)

```bash
# Test database connection
npm run db:test

# Run database migrations
npm run db:migrate

# Backup database to backups/ folder
npm run db:backup

# Show database information
npm run db:info

# Start MySQL service
npm run mysql:start

# Stop MySQL service
npm run mysql:stop

# Check MySQL status
npm run mysql:status
```

### Direct MySQL Commands

```bash
# Connect to MySQL
mysql -u root -p

# Connect to specific database
mysql -u root -p stpaulus_cms_db

# Show databases
mysql -u root -p -e "SHOW DATABASES;"

# Show tables
mysql -u root -p stpaulus_cms_db -e "SHOW TABLES;"

# Check MySQL version
mysql --version
```

### Backup & Restore

```bash
# Backup via NPM script (recommended)
npm run db:backup

# Manual backup with mysqldump
mysqldump -u root -p stpaulus_cms_db > backup_$(date +%Y%m%d).sql

# Compress backup
gzip backup_$(date +%Y%m%d).sql

# Restore from backup
mysql -u root -p stpaulus_cms_db < backup_20260211.sql

# Restore from compressed backup
gunzip < backup_20260211.sql.gz | mysql -u root -p stpaulus_cms_db
```

---

## 📅 Daily Operations

### Morning Checklist

```bash
# 1. Check MySQL is running
npm run mysql:status

# 2. Test database connection
npm run db:test

# 3. Start development server
npm run dev

# 4. Check application logs
tail -f logs/security.log
```

### Before Making Changes

```bash
# 1. Backup current database
npm run db:backup

# 2. Save .env configuration
cp .env .env.backup_$(date +%Y%m%d)

# 3. Run migrations (if any)
npm run db:migrate

# 4. Test application
npm run dev
```

### End of Day

```bash
# 1. Final backup (if important changes made)
npm run db:backup

# 2. Commit code changes (NEVER commit .env!)
git add .
git commit -m "Your commit message"
git push

# 3. Stop MySQL (optional)
npm run mysql:stop
```

---

## 🚨 Emergency Procedures

### Database Connection Failed

```bash
# 1. Check if MySQL is running
npm run mysql:status

# 2. If not running, start it
npm run mysql:start

# 3. Test connection
npm run db:test

# 4. Check error logs
tail -f /usr/local/var/mysql/*.err

# 5. Verify .env credentials
cat .env | grep MYSQL
```

### Application Won't Start

```bash
# 1. Test database connection
npm run db:test

# 2. Check for TypeScript errors
npm run build

# 3. Clear Nuxt cache
rm -rf .nuxt
npm run dev

# 4. Reinstall dependencies (if needed)
rm -rf node_modules package-lock.json
npm install
```

### Data Loss / Need to Restore

```bash
# 1. Stop application immediately
Ctrl+C (or pm2 stop stpaulus-cms)

# 2. List available backups
ls -lh backups/*.sql

# 3. Choose backup to restore
# Via Admin UI: Latest backup shown
# Or via command line:

# 4. Restore database
mysql -u root -p stpaulus_cms_db < backups/stpaulus_cms_db_backup_TIMESTAMP.sql

# 5. Verify restoration
npm run db:test

# 6. Restart application
npm run dev
```

### Password Reset

```bash
# 1. Connect to MySQL as root
mysql -u root -p

# 2. Change user password
ALTER USER 'username'@'localhost' IDENTIFIED BY 'new_strong_password';
FLUSH PRIVILEGES;
exit;

# 3. Update .env file
nano .env
# Update MYSQL_PASSWORD=new_strong_password

# 4. Test connection
npm run db:test
```

### Corrupted Database

```bash
# 1. Backup current state (even if corrupted)
npm run db:backup

# 2. Try to repair tables
mysql -u root -p stpaulus_cms_db

# In MySQL:
REPAIR TABLE table_name;
OPTIMIZE TABLE table_name;
exit;

# 3. If repair fails, restore from last good backup
mysql -u root -p stpaulus_cms_db < backups/last_good_backup.sql

# 4. Test application
npm run db:test
npm run dev
```

---

## 🛠️ Useful Scripts

### Quick Database Info

```bash
# Show database size
mysql -u root -p -e "
SELECT 
  table_schema AS 'Database',
  ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables 
WHERE table_schema = 'stpaulus_cms_db'
GROUP BY table_schema;"
```

### Table Record Counts

```bash
# Count records in all tables
mysql -u root -p stpaulus_cms_db -e "
SELECT 
  TABLE_NAME,
  TABLE_ROWS
FROM information_schema.tables
WHERE TABLE_SCHEMA = 'stpaulus_cms_db'
ORDER BY TABLE_ROWS DESC;"
```

### Find Large Tables

```bash
# Show largest tables
mysql -u root -p -e "
SELECT 
  TABLE_NAME,
  ROUND(((DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.tables
WHERE TABLE_SCHEMA = 'stpaulus_cms_db'
ORDER BY (DATA_LENGTH + INDEX_LENGTH) DESC
LIMIT 10;"
```

### Check Active Connections

```bash
# Show current connections
mysql -u root -p -e "SHOW PROCESSLIST;"

# Count connections
mysql -u root -p -e "SHOW STATUS LIKE 'Threads_connected';"

# Show max connections used
mysql -u root -p -e "SHOW STATUS LIKE 'Max_used_connections';"
```

### Export Single Table

```bash
# Export specific table
mysqldump -u root -p stpaulus_cms_db table_name > table_name_backup.sql

# Import table
mysql -u root -p stpaulus_cms_db < table_name_backup.sql
```

### Search for Data

```bash
# Find records containing text
mysql -u root -p stpaulus_cms_db -e "
SELECT * FROM articles 
WHERE title LIKE '%search term%' 
OR content LIKE '%search term%'
LIMIT 10;"
```

### Clean Old Data

```bash
# Delete old search logs (older than 90 days)
mysql -u root -p stpaulus_cms_db -e "
DELETE FROM search_logs 
WHERE created_at < DATE_SUB(NOW(), INTERVAL 90 DAY);"

# Clean old sessions
mysql -u root -p stpaulus_cms_db -e "
DELETE FROM sessions 
WHERE expires_at < NOW();"
```

---

## 📊 Monitoring Scripts

### Create monitoring script `scripts/db-health-check.sh`

```bash
#!/bin/bash

echo "🏥 Database Health Check"
echo "========================"

# Check MySQL status
echo ""
echo "📊 MySQL Status:"
mysql.server status

# Check database size
echo ""
echo "💾 Database Size:"
mysql -u root -p'YOUR_PASSWORD' -e "
SELECT 
  ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables 
WHERE table_schema = 'stpaulus_cms_db';"

# Check connections
echo ""
echo "🔌 Connections:"
mysql -u root -p'YOUR_PASSWORD' -e "
SHOW STATUS WHERE Variable_name IN 
('Threads_connected', 'Max_used_connections', 'Connections');"

# Check for errors
echo ""
echo "❌ Recent Errors:"
tail -20 /usr/local/var/mysql/*.err | grep -i error

echo ""
echo "✅ Health check complete"
```

### Make it executable

```bash
chmod +x scripts/db-health-check.sh
./scripts/db-health-check.sh
```

---

## 🔄 Upgrade Workflow

### Pre-Upgrade

```bash
# 1. Backup database
npm run db:backup

# 2. Backup .env
cp .env .env.backup_$(date +%Y%m%d)

# 3. Document current version
mysql --version > mysql_version_before.txt
npm run db:test > db_info_before.txt
```

### Upgrade MySQL

```bash
# macOS (Homebrew)
brew update
brew upgrade mysql

# Or specific version
brew install mysql@8.0
brew services start mysql@8.0

# Verify upgrade
mysql --version
```

### Post-Upgrade

```bash
# 1. Run MySQL upgrade
mysql_upgrade -u root -p

# 2. Fix authentication (if needed)
mysql -u root -p
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
FLUSH PRIVILEGES;
exit;

# 3. Test connection
npm run db:test

# 4. Run migrations
npm run db:migrate

# 5. Start application
npm run dev

# 6. Verify functionality
# - Login to admin
# - Create test article
# - Upload test image
# - Check all features work
```

---

## 📖 Related Documentation

- **MYSQL_UPGRADE_MIGRATION_GUIDE.md** - Complete upgrade guide
- **DATABASE_DOCUMENTATION.md** - Full schema documentation
- **DATABASE_BACKUP_DOCUMENTATION.md** - Backup system details
- **.env.example** - Configuration template

---

## 🆘 Getting Help

### Troubleshooting Steps
1. Check error logs: `tail -f /usr/local/var/mysql/*.err`
2. Test connection: `npm run db:test`
3. Verify .env: `cat .env | grep MYSQL`
4. Check MySQL status: `npm run mysql:status`
5. Review documentation in MYSQL_UPGRADE_MIGRATION_GUIDE.md

### Common Issues
- **Connection refused**: MySQL not running → `npm run mysql:start`
- **Access denied**: Wrong password → Check .env file
- **Database not found**: Not created → See setup guide
- **Slow performance**: Check indexes and optimize tables

---

## ✅ Quick Reference Card

```bash
# Start/Stop MySQL
npm run mysql:start     # Start MySQL
npm run mysql:stop      # Stop MySQL
npm run mysql:status    # Check status

# Database Operations
npm run db:test         # Test connection
npm run db:migrate      # Run migrations
npm run db:backup       # Create backup
npm run db:info         # Show database info

# Application
npm run dev             # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build

# Backup & Restore
npm run db:backup                                  # Create backup
mysql -u root -p DB < backups/backup_file.sql     # Restore backup

# Emergency
Ctrl+C                  # Stop application
npm run mysql:stop      # Stop MySQL
npm run db:backup       # Emergency backup
```

---

**Last Updated**: February 11, 2026
**Quick Start Version**: 1.0

**Remember**: Always backup before making changes! 💾
