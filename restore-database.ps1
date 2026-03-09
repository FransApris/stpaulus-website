# ====================================================================
# Database Restore Script for StPaulus CMS
# ====================================================================
# File: restore-database.ps1
# Purpose: Restore database from backup file
# Date: February 12, 2026
# ====================================================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  StPaulus CMS - Database Restore" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$BackupFile = "backup DB\stpaulus_backup_2026-02-11T04-28-52.sql"
$DatabaseName = "stpaulus_cms_db"
$MySQLUser = "root"
$MySQLHost = "localhost"

# Check if backup file exists
if (-not (Test-Path $BackupFile)) {
    Write-Host "[ERROR] Backup file not found!" -ForegroundColor Red
    Write-Host "   Expected: $BackupFile" -ForegroundColor Yellow
    exit 1
}

Write-Host "[OK] Backup file found: $BackupFile" -ForegroundColor Green
Write-Host ""

# Get MySQL root password
Write-Host "Please enter MySQL root password:" -ForegroundColor Yellow
$Password = Read-Host -AsSecureString

# Convert secure string to plain text for MySQL command
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($Password)
$PlainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

Write-Host ""
Write-Host "Starting database restore process..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Test MySQL connection
Write-Host "[1/5] Testing MySQL connection..." -ForegroundColor Yellow
try {
    $TestQuery = "SELECT 1"
    $env:MYSQL_PWD = $PlainPassword
    $result = mysql -h $MySQLHost -u $MySQLUser -e $TestQuery 2>&1
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "   [FAIL] Failed to connect to MySQL" -ForegroundColor Red
        Write-Host "   Error: $result" -ForegroundColor Red
        exit 1
    }
    Write-Host "   [OK] MySQL connection successful" -ForegroundColor Green
} catch {
    Write-Host "   [ERROR] Error connecting to MySQL: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 2: Check if database exists
Write-Host "[2/5] Checking database status..." -ForegroundColor Yellow
$DbCheck = mysql -h $MySQLHost -u $MySQLUser -e "SHOW DATABASES LIKE '$DatabaseName';" 2>&1

if ($DbCheck -match $DatabaseName) {
    Write-Host "   [WARN] Database '$DatabaseName' already exists" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   WARNING: This will OVERWRITE existing data!" -ForegroundColor Red
    Write-Host "   Do you want to continue? (y/N): " -ForegroundColor Yellow -NoNewline
    $Confirm = Read-Host
    
    if ($Confirm -ne 'y' -and $Confirm -ne 'Y') {
        Write-Host ""
        Write-Host "[CANCELLED] Restore cancelled by user" -ForegroundColor Yellow
        Remove-Variable MYSQL_PWD -ErrorAction SilentlyContinue
        exit 0
    }
} else {
    Write-Host "   [INFO] Database does not exist, will be created during restore" -ForegroundColor Cyan
}

Write-Host ""

# Step 3: Create database if not exists
Write-Host "[3/5] Ensuring database exists..." -ForegroundColor Yellow
$CreateDb = mysql -h $MySQLHost -u $MySQLUser -e "CREATE DATABASE IF NOT EXISTS $DatabaseName CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "   [OK] Database ready" -ForegroundColor Green
} else {
    Write-Host "   [FAIL] Failed to create database" -ForegroundColor Red
    Write-Host "   Error: $CreateDb" -ForegroundColor Red
    Remove-Variable MYSQL_PWD -ErrorAction SilentlyContinue
    exit 1
}

Write-Host ""

# Step 4: Restore from backup
Write-Host "[4/5] Restoring database from backup..." -ForegroundColor Yellow
Write-Host "   This may take a few moments..." -ForegroundColor Gray

try {
    # Use Get-Content to pipe the file content to mysql
    $RestoreResult = Get-Content $BackupFile | mysql -h $MySQLHost -u $MySQLUser $DatabaseName 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   [OK] Database restored successfully!" -ForegroundColor Green
    } else {
        Write-Host "   [FAIL] Restore failed" -ForegroundColor Red
        Write-Host "   Error: $RestoreResult" -ForegroundColor Red
        Remove-Variable MYSQL_PWD -ErrorAction SilentlyContinue
        exit 1
    }
} catch {
    Write-Host "   [ERROR] Error during restore: $_" -ForegroundColor Red
    Remove-Variable MYSQL_PWD -ErrorAction SilentlyContinue
    exit 1
}

Write-Host ""

# Step 5: Verify restore
Write-Host "[5/5] Verifying restore..." -ForegroundColor Yellow

$VerifyQueries = @"
SELECT 'Users' as TableName, COUNT(*) as Count FROM users
UNION ALL
SELECT 'Articles', COUNT(*) FROM articles
UNION ALL
SELECT 'News', COUNT(*) FROM news
UNION ALL
SELECT 'Gallery Albums', COUNT(*) FROM gallery_albums
UNION ALL
SELECT 'Agendas', COUNT(*) FROM agendas
UNION ALL
SELECT 'Rooms', COUNT(*) FROM rooms
UNION ALL
SELECT 'Roles', COUNT(*) FROM roles
UNION ALL
SELECT 'Permissions', COUNT(*) FROM permissions;
"@

$VerifyResult = mysql -h $MySQLHost -u $MySQLUser $DatabaseName -e $VerifyQueries 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "   Database Statistics:" -ForegroundColor Cyan
    Write-Host "   $VerifyResult" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "   [WARN] Could not verify data (but restore completed)" -ForegroundColor Yellow
}

# Clean up password from environment
Remove-Variable MYSQL_PWD -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Database Restore Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Restart your Nuxt application: npm run dev" -ForegroundColor White
Write-Host "   2. Login to admin panel: http://localhost:3000/admin/login" -ForegroundColor White
Write-Host "   3. Test all features to ensure data integrity" -ForegroundColor White
Write-Host ""
Write-Host "Backup Info:" -ForegroundColor Cyan
Write-Host "   Source: $BackupFile" -ForegroundColor White
Write-Host "   Date: 2026-02-11 04:28 AM" -ForegroundColor White
Write-Host ""

# Pause to show results
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
