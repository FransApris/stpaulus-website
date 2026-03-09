# 📚 Database Management Documentation Index

## 🎯 Purpose
This directory contains comprehensive documentation for managing the MySQL database for St. Paulus CMS. All documentation is designed to support database upgrades, migrations, and daily operations.

---

## 📖 Documentation Files

### 1. 🚀 [QUICK_START_DATABASE.md](./QUICK_START_DATABASE.md)
**Start here for daily operations!**

Quick reference guide for common database tasks:
- ✅ Environment setup
- ✅ Common commands (npm scripts)
- ✅ Daily operations checklist
- ✅ Emergency procedures
- ✅ Useful SQL queries

**When to use**: Daily operations, quick reference, emergency situations

---

### 2. 🔄 [MYSQL_UPGRADE_MIGRATION_GUIDE.md](./MYSQL_UPGRADE_MIGRATION_GUIDE.md)
**Complete guide for MySQL upgrades and migrations**

Comprehensive guide covering:
- ✅ Pre-migration checklist
- ✅ MySQL version compatibility (5.7 → 8.0+)
- ✅ Step-by-step upgrade procedures
- ✅ Breaking changes and solutions
- ✅ Multiple migration scenarios
- ✅ Password security best practices
- ✅ Configuration management (dev/staging/prod)
- ✅ Rollback procedures
- ✅ Testing guide
- ✅ Troubleshooting common issues

**When to use**: Planning MySQL upgrade, changing database credentials, moving to new server

---

### 3. 📊 [DATABASE_DOCUMENTATION.md](./DATABASE_DOCUMENTATION.md)
**Complete database schema reference**

Full technical documentation (1100+ lines):
- ✅ All 40+ tables with complete specifications
- ✅ Column definitions, types, constraints
- ✅ Foreign key relationships
- ✅ Indexes and performance optimization
- ✅ Entity Relationship Diagram (ERD)
- ✅ Sample data and business rules
- ✅ Full-text search indexes
- ✅ Security & best practices

**When to use**: Development, understanding schema, creating new features, debugging

---

### 4. 💾 [DATABASE_BACKUP_DOCUMENTATION.md](./DATABASE_BACKUP_DOCUMENTATION.md)
**Backup system specifications**

Complete backup feature documentation:
- ✅ Admin UI specifications (colors, layout, components)
- ✅ API endpoint details
- ✅ Technical implementation
- ✅ Security & permissions
- ✅ Testing checklist
- ✅ Known issues & solutions
- ✅ Future enhancements

**When to use**: Understanding backup system, modifying backup UI, troubleshooting backups

---

### 5. 💾 [UI_BACKUP_README.md](./UI_BACKUP_README.md)
**UI preservation guide**

Documentation for preserving backup UI:
- ✅ File backup locations
- ✅ Restore procedures
- ✅ UI consistency rules
- ✅ Technical constraints
- ✅ Changelog

**When to use**: Restoring UI after accidental changes

---

## 🛠️ Utility Scripts

All scripts are located in `scripts/` directory:

### Test Connection
```bash
npm run db:test
```
Tests database connectivity and displays comprehensive information about the database.

**Output includes**:
- Connection status
- MySQL version
- Database size and table count
- Record counts for key tables
- Connection pool statistics
- Performance metrics

---

### Run Migrations
```bash
npm run db:migrate
```
Executes SQL migration files in order and tracks execution history.

**Features**:
- ✅ Automatic migration tracking
- ✅ Skips already executed migrations
- ✅ Colorful progress output
- ✅ Error handling with rollback
- ✅ Execution time tracking

---

### Backup Database
```bash
npm run db:backup
```
Creates complete SQL dump of database (command-line version of admin UI backup).

**Output**:
- File saved to: `backups/stpaulus_cms_db_backup_TIMESTAMP.sql`
- Includes: Structure + Data for all tables
- Compression: Optional (gzip)
- Restore command provided

---

### Show Database Info
```bash
npm run db:info
```
Alias for `db:test` - displays database information.

---

## 🔧 Environment Configuration

### Required Files

#### `.env` (Active configuration - NEVER commit!)
```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=your_username
MYSQL_PASSWORD=your_secure_password
MYSQL_DATABASE=stpaulus_cms_db
JWT_SECRET=your_random_hex_string
```

#### `.env.example` (Template - safe to commit)
Contains example configuration with security tips.

---

## 📋 Quick Command Reference

### MySQL Service
```bash
npm run mysql:start      # Start MySQL
npm run mysql:stop       # Stop MySQL
npm run mysql:status     # Check MySQL status
```

### Database Operations
```bash
npm run db:test          # Test connection
npm run db:migrate       # Run migrations
npm run db:backup        # Create backup
npm run db:info          # Show database info
```

### Application
```bash
npm run dev              # Start development server
npm run build            # Build for production
```

### Manual MySQL Commands
```bash
# Connect to database
mysql -u root -p stpaulus_cms_db

# Backup manually
mysqldump -u root -p stpaulus_cms_db > backup.sql

# Restore
mysql -u root -p stpaulus_cms_db < backup.sql
```

---

## 🔄 Common Workflows

### 1. Daily Development

```bash
# Morning
npm run mysql:status     # Check MySQL running
npm run db:test          # Verify connection
npm run dev              # Start app

# Before changes
npm run db:backup        # Backup current state

# After changes
git add .
git commit -m "..."
git push
```

### 2. Database Migration

```bash
# 1. Create migration file
nano server/database/migrations/XXX_description.sql

# 2. Test locally
npm run db:migrate

# 3. Verify application
npm run dev

# 4. Commit migration
git add server/database/migrations/
git commit -m "Add migration: XXX"
```

### 3. MySQL Upgrade

```bash
# 1. Backup everything
npm run db:backup
cp .env .env.backup

# 2. Document current state
npm run db:test > before_upgrade.txt
mysql --version >> before_upgrade.txt

# 3. Upgrade MySQL
# See MYSQL_UPGRADE_MIGRATION_GUIDE.md

# 4. Test after upgrade
npm run db:test
npm run db:migrate
npm run dev

# 5. Verify all features work
```

### 4. Emergency Recovery

```bash
# 1. Stop application
Ctrl+C

# 2. Identify backup
ls -lh backups/

# 3. Restore database
mysql -u root -p stpaulus_cms_db < backups/backup_file.sql

# 4. Test
npm run db:test

# 5. Restart
npm run dev
```

---

## 🎓 Learning Path

### Beginner
1. Read **QUICK_START_DATABASE.md** - Learn daily commands
2. Practice `npm run db:test` and `npm run db:backup`
3. Understand `.env` configuration

### Intermediate
1. Study **DATABASE_DOCUMENTATION.md** - Understand schema
2. Practice creating migrations
3. Learn backup/restore procedures

### Advanced
1. Read **MYSQL_UPGRADE_MIGRATION_GUIDE.md** - Plan upgrades
2. Understand RBAC permissions system
3. Optimize queries and indexes
4. Implement monitoring

---

## 🆘 Troubleshooting Guide

### Issue: Connection Failed

```bash
# 1. Check MySQL status
npm run mysql:status

# 2. If not running
npm run mysql:start

# 3. Test connection
npm run db:test

# 4. Check .env
cat .env | grep MYSQL
```

### Issue: Migration Failed

```bash
# 1. Check migrations table
mysql -u root -p stpaulus_cms_db -e "SELECT * FROM migrations;"

# 2. Fix SQL error in migration file
nano server/database/migrations/problematic_file.sql

# 3. Run migrations again
npm run db:migrate
```

### Issue: Backup Failed

```bash
# 1. Check disk space
df -h

# 2. Check backups directory exists
ls -ld backups/

# 3. Try manual backup
mysqldump -u root -p stpaulus_cms_db > manual_backup.sql

# 4. Use admin UI backup
# Navigate to: http://localhost:3001/admin/backup
```

### Issue: Slow Performance

```bash
# 1. Check database size
npm run db:info

# 2. Optimize tables
mysql -u root -p stpaulus_cms_db -e "OPTIMIZE TABLE articles, news, agendas;"

# 3. Check slow query log
tail -f /usr/local/var/mysql/*-slow.log

# 4. Analyze queries
mysql -u root -p stpaulus_cms_db
EXPLAIN SELECT * FROM articles WHERE status = 'published';
```

---

## 📊 Database Statistics (Current)

| Property | Value |
|----------|-------|
| **MySQL Version** | 8.0.28 |
| **Database Name** | stpaulus_cms_db |
| **Character Set** | UTF8MB4 |
| **Total Tables** | 48 |
| **Database Size** | 2.94 MB |
| **Total Users** | 31 |
| **Total Articles** | 3 |
| **Total News** | 10 |
| **Total Agendas** | 20 |
| **Church Announcements** | 11 |

*Last updated: February 11, 2026*

---

## 🔐 Security Reminders

### ❌ NEVER DO THIS:
- Commit `.env` file to Git
- Hardcode passwords in code
- Use weak passwords (< 16 chars)
- Share production credentials
- Run migrations on production without testing

### ✅ ALWAYS DO THIS:
- Use strong passwords (32+ chars)
- Backup before changes
- Test migrations locally first
- Keep `.env.example` updated
- Rotate passwords regularly
- Use environment-specific configs

---

## 📞 Support & Resources

### Documentation Files
- `QUICK_START_DATABASE.md` - Daily operations
- `MYSQL_UPGRADE_MIGRATION_GUIDE.md` - Upgrade guide
- `DATABASE_DOCUMENTATION.md` - Schema reference
- `DATABASE_BACKUP_DOCUMENTATION.md` - Backup system
- `UI_BACKUP_README.md` - UI preservation

### Scripts
- `scripts/test-db-connection.js` - Connection tester
- `scripts/run-migrations.js` - Migration runner
- `scripts/backup-database.js` - Backup creator

### External Resources
- MySQL 8.0 Documentation: https://dev.mysql.com/doc/refman/8.0/en/
- mysql2 Package: https://github.com/sidorares/node-mysql2
- Nuxt 3 Documentation: https://nuxt.com/docs

---

## ✅ Quick Checklist

### Before Upgrade
- [ ] Read MYSQL_UPGRADE_MIGRATION_GUIDE.md
- [ ] Backup database (`npm run db:backup`)
- [ ] Backup .env file
- [ ] Document current version
- [ ] Test in development first

### After Upgrade
- [ ] Run `mysql_upgrade`
- [ ] Fix authentication if needed
- [ ] Test connection (`npm run db:test`)
- [ ] Run migrations (`npm run db:migrate`)
- [ ] Test application thoroughly
- [ ] Update documentation

### Daily Operations
- [ ] Check MySQL status
- [ ] Test database connection
- [ ] Backup before major changes
- [ ] Monitor application logs
- [ ] Keep documentation updated

---

## 🎯 Next Steps

1. **New to the system?**
   - Start with QUICK_START_DATABASE.md
   - Practice basic commands
   - Understand .env configuration

2. **Planning an upgrade?**
   - Read MYSQL_UPGRADE_MIGRATION_GUIDE.md completely
   - Test in development environment
   - Follow pre-migration checklist

3. **Need to modify schema?**
   - Study DATABASE_DOCUMENTATION.md
   - Create migration file
   - Test locally before deploying

4. **Troubleshooting issues?**
   - Check QUICK_START_DATABASE.md troubleshooting section
   - Run `npm run db:test` for diagnostics
   - Review error logs

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Feb 11, 2026 | Initial comprehensive documentation |
|     |              | - Created MYSQL_UPGRADE_MIGRATION_GUIDE.md |
|     |              | - Created DATABASE_DOCUMENTATION.md |
|     |              | - Created QUICK_START_DATABASE.md |
|     |              | - Added utility scripts (test, migrate, backup) |
|     |              | - Updated package.json with npm scripts |

---

**Maintained by**: Development Team
**Last Updated**: February 11, 2026
**Documentation Status**: ✅ Complete & Production Ready

**Remember**: Always backup before making changes! 💾
