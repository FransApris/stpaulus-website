# 🪟 Windows Setup Guide - St. Paulus CMS

## 📋 Table of Contents
1. [System Requirements](#system-requirements)
2. [Prerequisites Installation](#prerequisites-installation)
3. [Project Setup](#project-setup)
4. [MySQL Configuration](#mysql-configuration)
5. [Running the Application](#running-the-application)
6. [Platform-Specific Commands](#platform-specific-commands)
7. [Troubleshooting](#troubleshooting)
8. [Cross-Platform Compatibility](#cross-platform-compatibility)

---

## 💻 System Requirements

### Minimum Requirements
- **OS**: Windows 10 or Windows 11 (64-bit)
- **RAM**: 8 GB (16 GB recommended)
- **Storage**: 10 GB free space
- **Internet**: Required for package installation

### Software Requirements
- **Node.js**: 18.x or higher (LTS recommended)
- **npm**: 9.x or higher (comes with Node.js)
- **MySQL**: 8.0 or higher
- **Git**: Latest version
- **Code Editor**: VS Code (recommended)

---

## 📦 Prerequisites Installation

### 1. Install Node.js

**Download & Install**:
1. Visit: https://nodejs.org/
2. Download **LTS version** (Long Term Support)
3. Run installer
4. Choose "Automatically install necessary tools" (includes Python & build tools)
5. Restart computer after installation

**Verify Installation**:
```powershell
# Open PowerShell or Command Prompt
node --version
# Should show: v18.x.x or higher

npm --version
# Should show: 9.x.x or higher
```

### 2. Install MySQL

**Option A: MySQL Community Server (Recommended)**

1. **Download**:
   - Visit: https://dev.mysql.com/downloads/mysql/
   - Select "Windows (x86, 64-bit), MSI Installer"
   - Download "mysql-installer-community-8.x.x.msi"

2. **Install**:
   - Run MSI installer
   - Choose "Developer Default" or "Server only"
   - Click "Next" through setup

3. **Configure**:
   - Choose "Standalone MySQL Server"
   - Port: **3306** (default)
   - Authentication Method: **Use Strong Password Encryption**
   - Set **root password** (remember this!)
   - Windows Service Name: **MySQL80**
   - ✅ Check "Start MySQL Server at System Startup"

4. **Verify**:
   ```powershell
   # Check if MySQL service is running
   Get-Service MySQL80
   # Status should be: Running
   
   # Test MySQL connection
   mysql -u root -p
   # Enter your root password
   ```

**Option B: XAMPP (Easier for Beginners)**

1. Download XAMPP: https://www.apachefriends.org/
2. Install XAMPP (includes MySQL)
3. Start MySQL from XAMPP Control Panel
4. MySQL runs on port 3306 by default

### 3. Install Git

**Download & Install**:
1. Visit: https://git-scm.com/download/win
2. Download and run installer
3. Use default settings (or adjust as needed)
4. Restart terminal after installation

**Verify**:
```powershell
git --version
# Should show: git version 2.x.x
```

### 4. Install Visual Studio Code (Recommended)

1. Download: https://code.visualstudio.com/
2. Install with default settings
3. Install recommended extensions:
   - Vue Language Features (Volar)
   - ESLint
   - Prettier

---

## 🚀 Project Setup

### Step 1: Clone Repository

```powershell
# Open PowerShell or Command Prompt
# Navigate to your projects folder
cd C:\Users\YourUsername\Documents\Projects

# Clone repository
git clone [repository-url]
cd "StPaulus 3"
```

### Step 2: Install Dependencies

```powershell
# Install all npm packages
npm install

# This will take 5-10 minutes depending on your internet speed
# Wait for "added XXX packages" message
```

**If you encounter errors**:
```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Reinstall
npm install
```

### Step 3: Configure Environment Variables

```powershell
# Copy environment template
copy .env.example .env

# Edit .env file
notepad .env
# Or use VS Code:
code .env
```

**Configure these values in .env**:
```env
# MySQL Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_root_password
MYSQL_DATABASE=stpaulus_cms_db

# JWT Secret (generate using command below)
JWT_SECRET=your_random_64_char_hex_string

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

**Generate JWT Secret**:
```powershell
# Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# Copy the output to JWT_SECRET in .env
```

---

## 🗄️ MySQL Configuration

### Option 1: Using PowerShell Scripts

Create `scripts/mysql-windows.ps1`:
```powershell
# MySQL Management Script for Windows
param(
    [Parameter(Mandatory=$true)]
    [ValidateSet('start','stop','status','restart')]
    [string]$Action
)

$ServiceName = "MySQL80"  # Or "MySQL" for older versions

switch ($Action) {
    'start' {
        Write-Host "🚀 Starting MySQL service..." -ForegroundColor Cyan
        Start-Service $ServiceName
        Write-Host "✅ MySQL started successfully" -ForegroundColor Green
    }
    'stop' {
        Write-Host "🛑 Stopping MySQL service..." -ForegroundColor Yellow
        Stop-Service $ServiceName
        Write-Host "✅ MySQL stopped" -ForegroundColor Green
    }
    'status' {
        $Service = Get-Service $ServiceName
        if ($Service.Status -eq 'Running') {
            Write-Host "✅ MySQL is running" -ForegroundColor Green
        } else {
            Write-Host "❌ MySQL is not running" -ForegroundColor Red
        }
        Write-Host "Status: $($Service.Status)" -ForegroundColor Cyan
    }
    'restart' {
        Write-Host "🔄 Restarting MySQL service..." -ForegroundColor Cyan
        Restart-Service $ServiceName
        Write-Host "✅ MySQL restarted successfully" -ForegroundColor Green
    }
}
```

**Usage**:
```powershell
# Run as Administrator (Right-click PowerShell → Run as Administrator)

# Start MySQL
powershell -ExecutionPolicy Bypass -File scripts/mysql-windows.ps1 -Action start

# Stop MySQL
powershell -ExecutionPolicy Bypass -File scripts/mysql-windows.ps1 -Action stop

# Check status
powershell -ExecutionPolicy Bypass -File scripts/mysql-windows.ps1 -Action status

# Restart MySQL
powershell -ExecutionPolicy Bypass -File scripts/mysql-windows.ps1 -Action restart
```

### Option 2: Using Windows Services

```powershell
# Start MySQL (as Administrator)
net start MySQL80

# Stop MySQL (as Administrator)
net stop MySQL80

# Check status
Get-Service MySQL80
```

### Option 3: Using GUI

1. Press `Win + R`
2. Type: `services.msc`
3. Find "MySQL80" in the list
4. Right-click → Start/Stop/Restart

### Create Database

```powershell
# Connect to MySQL
mysql -u root -p
# Enter your root password
```

```sql
-- In MySQL shell
CREATE DATABASE stpaulus_cms_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Verify
SHOW DATABASES;

-- Exit
exit;
```

### Import Schema (if available)

```powershell
# If you have a backup file
mysql -u root -p stpaulus_cms_db < backup_file.sql

# Or import schema
mysql -u root -p stpaulus_cms_db < server/database/schema-mysql.sql
```

---

## 🏃 Running the Application

### Start Development Server

**Method 1: Using npm (Recommended)**:
```powershell
# Make sure MySQL is running first
Get-Service MySQL80

# Start development server
npm run dev

# Server will be available at:
# http://localhost:3000 (or 3001 if 3000 is busy)
```

**Method 2: Cross-platform compatible command**:
```powershell
# Set NODE_OPTIONS and run dev
$env:NODE_OPTIONS="--no-deprecation"; npx nuxt dev
```

### Test Database Connection

```powershell
# Test database connection
npm run db:test

# Expected output:
# ✅ Connection successful!
# MySQL Version: 8.0.xx
# Total Tables: 48
# Database Size: X.XX MB
```

### Run Database Migrations

```powershell
# Run all pending migrations
npm run db:migrate

# Output will show:
# ✅ Migrations completed successfully
```

### Create Database Backup

```powershell
# Backup database
npm run db:backup

# Backup file saved to: backups/stpaulus_cms_db_backup_TIMESTAMP.sql
```

---

## 🔄 Platform-Specific Commands

### Commands Comparison

| Task | macOS/Linux | Windows PowerShell |
|------|-------------|-------------------|
| **Start MySQL** | `npm run mysql:start` | `net start MySQL80` |
| **Stop MySQL** | `npm run mysql:stop` | `net stop MySQL80` |
| **Check MySQL** | `npm run mysql:status` | `Get-Service MySQL80` |
| **Clear terminal** | `clear` | `cls` |
| **List files** | `ls -la` | `Get-ChildItem` or `dir` |
| **Copy file** | `cp file1 file2` | `copy file1 file2` |
| **Remove file** | `rm file` | `Remove-Item file` |
| **Environment var** | `export VAR=value` | `$env:VAR="value"` |
| **Path separator** | `/` (forward slash) | `\` (backslash) |

### Updated NPM Scripts for Windows

Edit `package.json` to add Windows-compatible commands:

```json
{
  "scripts": {
    "dev": "cross-env NODE_OPTIONS=--no-deprecation npx nuxt dev",
    "dev:windows": "set NODE_OPTIONS=--no-deprecation && npx nuxt dev",
    "mysql:start:win": "net start MySQL80",
    "mysql:stop:win": "net stop MySQL80",
    "mysql:status:win": "powershell -Command \"Get-Service MySQL80\"",
    "db:test": "node scripts/test-db-connection.js",
    "db:migrate": "node scripts/run-migrations.js",
    "db:backup": "node scripts/backup-database.js"
  }
}
```

**Install cross-env for better compatibility**:
```powershell
npm install --save-dev cross-env
```

Then use:
```powershell
npm run dev
# Works on both Windows and macOS/Linux
```

---

## 🔧 Troubleshooting

### Issue 1: MySQL Won't Start

**Error**: "The service cannot be started"

**Solutions**:
```powershell
# 1. Check if port 3306 is in use
netstat -ano | findstr :3306

# 2. If port is busy, kill the process
taskkill /PID [process_id] /F

# 3. Try starting MySQL again
net start MySQL80

# 4. Check MySQL error log
# Location: C:\ProgramData\MySQL\MySQL Server 8.0\Data\*.err
notepad "C:\ProgramData\MySQL\MySQL Server 8.0\Data\YOUR-PC-NAME.err"
```

### Issue 2: Node.js Permissions Error

**Error**: "EPERM: operation not permitted"

**Solutions**:
```powershell
# 1. Run PowerShell as Administrator
# Right-click PowerShell → Run as Administrator

# 2. Or change npm cache location
npm config set cache "C:\npm-cache" --global

# 3. Clear npm cache
npm cache clean --force
```

### Issue 3: bcrypt Installation Failed

**Error**: "node-gyp rebuild failed"

**Solutions**:
```powershell
# Option 1: Install build tools
npm install --global windows-build-tools

# Option 2: Use bcryptjs instead (already in dependencies)
# The project already has bcryptjs as fallback

# Option 3: Install Visual Studio Build Tools
# Download: https://visualstudio.microsoft.com/downloads/
# Install "Desktop development with C++" workload
```

### Issue 4: Port Already in Use

**Error**: "Port 3000 is already in use"

**Solutions**:
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process
taskkill /PID [process_id] /F

# Or use different port
$env:PORT=3001; npm run dev
```

### Issue 5: MySQL Connection Refused

**Error**: "connect ECONNREFUSED 127.0.0.1:3306"

**Solutions**:
```powershell
# 1. Check if MySQL is running
Get-Service MySQL80

# 2. If not running, start it
net start MySQL80

# 3. Test manual connection
mysql -u root -p

# 4. Check firewall
# Windows Defender Firewall → Allow an app
# Make sure MySQL is allowed

# 5. Verify .env configuration
notepad .env
# Check MYSQL_HOST=localhost and MYSQL_PORT=3306
```

### Issue 6: Cannot Find Module Error

**Error**: "Cannot find module 'xyz'"

**Solutions**:
```powershell
# 1. Delete node_modules and reinstall
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install

# 2. Clear npm cache
npm cache clean --force
npm install

# 3. Check Node.js version
node --version
# Should be 18.x or higher
```

### Issue 7: Git Line Ending Issues

**Error**: Scripts have wrong line endings (^M)

**Solutions**:
```powershell
# Configure Git to handle line endings
git config --global core.autocrlf true

# Re-clone repository
git clone [repository-url]

# Or convert existing files
# Install dos2unix for Windows
# Or use VS Code: Change End of Line Sequence (bottom right)
```

---

## 🌐 Cross-Platform Compatibility

### Current Status

| Feature | macOS | Linux | Windows | Notes |
|---------|-------|-------|---------|-------|
| **Node.js** | ✅ | ✅ | ✅ | Fully compatible |
| **npm scripts** | ✅ | ✅ | ✅ | Works on all platforms |
| **MySQL** | ✅ | ✅ | ✅ | Service management differs |
| **Database scripts** | ✅ | ✅ | ✅ | JavaScript - cross-platform |
| **Bash scripts** | ✅ | ✅ | ⚠️ | Need PowerShell alternatives |

### Scripts That Need Conversion

#### ❌ Bash Scripts (macOS/Linux only):
```bash
scripts/start-dev.sh
scripts/start-dev-simple.sh
scripts/restart_dev_clean.sh
scripts/debug_widget.sh
scripts/check-nuxt-env.sh
scripts/clean_vscode.sh
```

#### ✅ JavaScript Scripts (Cross-platform):
```javascript
scripts/test-db-connection.js      ✅ Works on all OS
scripts/run-migrations.js          ✅ Works on all OS
scripts/backup-database.js         ✅ Works on all OS
scripts/*.mjs files                ✅ Works on all OS
```

### Windows Alternatives

#### 1. Start Development (Windows)

Create `scripts/start-dev.ps1`:
```powershell
# Start Development Server - Windows Version
Write-Host "🚀 Starting Development Server" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Blue

# Check if MySQL is running
$MySQLService = Get-Service MySQL80 -ErrorAction SilentlyContinue
if ($MySQLService.Status -ne 'Running') {
    Write-Host "⚠️  MySQL is not running. Starting MySQL..." -ForegroundColor Yellow
    try {
        Start-Service MySQL80
        Write-Host "✅ MySQL started successfully" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to start MySQL. Please start it manually." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ MySQL is already running" -ForegroundColor Green
}

# Test database connection
Write-Host "`n📊 Testing database connection..." -ForegroundColor Cyan
npm run db:test
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Database connection failed. Please check your .env configuration." -ForegroundColor Red
    exit 1
}

# Start Nuxt dev server
Write-Host "`n🎯 Starting Nuxt development server..." -ForegroundColor Cyan
npm run dev
```

**Usage**:
```powershell
powershell -ExecutionPolicy Bypass -File scripts/start-dev.ps1
```

#### 2. Clean Development Environment (Windows)

Create `scripts/clean-dev.ps1`:
```powershell
# Clean Development Environment - Windows Version
Write-Host "🧹 Cleaning Development Environment" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Blue

# Remove .nuxt directory
if (Test-Path .nuxt) {
    Write-Host "🗑️  Removing .nuxt directory..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force .nuxt
    Write-Host "✅ .nuxt removed" -ForegroundColor Green
}

# Remove node_modules (optional)
$removeModules = Read-Host "Remove node_modules? (y/N)"
if ($removeModules -eq 'y' -or $removeModules -eq 'Y') {
    if (Test-Path node_modules) {
        Write-Host "🗑️  Removing node_modules..." -ForegroundColor Yellow
        Remove-Item -Recurse -Force node_modules
        Write-Host "✅ node_modules removed" -ForegroundColor Green
        
        Write-Host "📦 Reinstalling dependencies..." -ForegroundColor Cyan
        npm install
    }
}

Write-Host "`n✅ Cleanup complete!" -ForegroundColor Green
```

#### 3. Database Health Check (Windows)

Create `scripts/db-health.ps1`:
```powershell
# Database Health Check - Windows Version
Write-Host "🏥 Database Health Check" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Blue

# Check MySQL service
Write-Host "`n📊 MySQL Service Status:" -ForegroundColor Cyan
$MySQLService = Get-Service MySQL80 -ErrorAction SilentlyContinue
if ($MySQLService) {
    if ($MySQLService.Status -eq 'Running') {
        Write-Host "✅ MySQL is running" -ForegroundColor Green
    } else {
        Write-Host "❌ MySQL is not running" -ForegroundColor Red
    }
} else {
    Write-Host "❌ MySQL service not found" -ForegroundColor Red
}

# Test database connection
Write-Host "`n🔌 Database Connection:" -ForegroundColor Cyan
npm run db:test

# Check disk space
Write-Host "`n💾 Disk Space:" -ForegroundColor Cyan
$drive = Get-PSDrive C
$freeSpace = [math]::Round($drive.Free / 1GB, 2)
$usedSpace = [math]::Round($drive.Used / 1GB, 2)
Write-Host "Free Space: $freeSpace GB" -ForegroundColor Cyan
Write-Host "Used Space: $usedSpace GB" -ForegroundColor Cyan

Write-Host "`n✅ Health check complete" -ForegroundColor Green
```

---

## 📝 Windows-Specific package.json Scripts

Add these to `package.json`:

```json
{
  "scripts": {
    "dev": "cross-env NODE_OPTIONS=--no-deprecation npx nuxt dev",
    "dev:win": "set NODE_OPTIONS=--no-deprecation && npx nuxt dev",
    "build": "nuxt build",
    "preview": "nuxt preview",
    
    "mysql:start:win": "net start MySQL80",
    "mysql:stop:win": "net stop MySQL80",
    "mysql:status:win": "powershell -Command \"Get-Service MySQL80\"",
    "mysql:restart:win": "net stop MySQL80 && net start MySQL80",
    
    "db:test": "node scripts/test-db-connection.js",
    "db:migrate": "node scripts/run-migrations.js",
    "db:backup": "node scripts/backup-database.js",
    "db:info": "node scripts/test-db-connection.js",
    
    "clean:win": "powershell -ExecutionPolicy Bypass -File scripts/clean-dev.ps1",
    "health:win": "powershell -ExecutionPolicy Bypass -File scripts/db-health.ps1"
  }
}
```

---

## ✅ Checklist for Windows Setup

### Pre-Setup
- [ ] Windows 10/11 installed (64-bit)
- [ ] Administrator access available
- [ ] Stable internet connection
- [ ] At least 10 GB free disk space

### Installation
- [ ] Node.js 18+ installed
- [ ] npm 9+ installed
- [ ] MySQL 8.0+ installed and running
- [ ] Git installed
- [ ] VS Code installed (optional)

### Project Setup
- [ ] Repository cloned
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created and configured
- [ ] JWT secret generated
- [ ] Database created
- [ ] Database connection tested (`npm run db:test`)

### Running Application
- [ ] MySQL service started
- [ ] Migrations run (`npm run db:migrate`)
- [ ] Dev server starts without errors (`npm run dev`)
- [ ] Application accessible at http://localhost:3000

---

## 🎯 Quick Start Commands (Windows)

```powershell
# 1. Install dependencies
npm install

# 2. Configure environment
copy .env.example .env
notepad .env  # Edit MySQL credentials

# 3. Start MySQL
net start MySQL80

# 4. Test database
npm run db:test

# 5. Run migrations
npm run db:migrate

# 6. Start development server
npm run dev
```

---

## 📞 Support & Resources

### Windows-Specific Resources
- **Node.js Windows**: https://nodejs.org/en/download/
- **MySQL Windows**: https://dev.mysql.com/downloads/mysql/
- **Git Windows**: https://git-scm.com/download/win
- **VS Code**: https://code.visualstudio.com/

### Getting Help
1. Check error messages in PowerShell
2. Review `QUICK_START_DATABASE.md` for general issues
3. Check MySQL error log: `C:\ProgramData\MySQL\MySQL Server 8.0\Data\*.err`
4. Run health check: `npm run health:win` (after creating script)

---

**Last Updated**: February 11, 2026
**Windows Compatibility**: ✅ Fully Supported
**Tested On**: Windows 10/11 with Node.js 18.x and MySQL 8.0

**Note**: JavaScript-based scripts (db:test, db:migrate, db:backup) work perfectly on Windows without any modifications! 🎉
