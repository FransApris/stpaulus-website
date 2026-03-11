# Run Kronik System Migration
# This script will create kronik tables in the database

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Kronik System Database Migration" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if migration file exists
$migrationFile = "migrations/020_create_kronik_system.sql"

if (!(Test-Path $migrationFile)) {
    Write-Host "❌ Migration file not found: $migrationFile" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Found migration file: $migrationFile" -ForegroundColor Green
Write-Host ""

# Read database config from environment or prompt
Write-Host "Database Configuration:" -ForegroundColor Yellow
$dbHost = if ($env:MYSQL_HOST) { $env:MYSQL_HOST } else { Read-Host "MySQL Host [localhost]" }
if ([string]::IsNullOrEmpty($dbHost)) { $dbHost = "localhost" }

$dbUser = if ($env:MYSQL_USER) { $env:MYSQL_USER } else { Read-Host "MySQL User [root]" }
if ([string]::IsNullOrEmpty($dbUser)) { $dbUser = "root" }

$dbPassword = if ($env:MYSQL_PASSWORD) { $env:MYSQL_PASSWORD } else { Read-Host "MySQL Password" -AsSecureString }
if ($dbPassword -is [SecureString]) {
    $dbPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
        [Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbPassword)
    )
}
else {
    $dbPasswordPlain = $dbPassword
}

$dbName = if ($env:MYSQL_DATABASE) { $env:MYSQL_DATABASE } else { Read-Host "Database Name [stpaulus_cms_db]" }
if ([string]::IsNullOrEmpty($dbName)) { $dbName = "stpaulus_cms_db" }

Write-Host ""
Write-Host "Connecting to: $dbUser@$dbHost/$dbName" -ForegroundColor Cyan

# Check if mysql command is available
$mysqlCmd = Get-Command mysql -ErrorAction SilentlyContinue

if (!$mysqlCmd) {
    Write-Host "❌ MySQL client not found in PATH" -ForegroundColor Red
    Write-Host "Please install MySQL client or add it to PATH" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Alternative: Import the SQL file manually using phpMyAdmin or MySQL Workbench" -ForegroundColor Yellow
    Write-Host "File location: $migrationFile" -ForegroundColor Cyan
    exit 1
}

Write-Host "✓ MySQL client found" -ForegroundColor Green
Write-Host ""

# Run migration
Write-Host "Running migration..." -ForegroundColor Yellow

try {
    if ([string]::IsNullOrEmpty($dbPasswordPlain)) {
        # No password
        $sqlContent = Get-Content $migrationFile -Raw
        $sqlContent | mysql --host=$dbHost --user=$dbUser $dbName
    }
    else {
        # With password
        $env:MYSQL_PWD = $dbPasswordPlain
        $sqlContent = Get-Content $migrationFile -Raw
        $sqlContent | mysql --host=$dbHost --user=$dbUser $dbName
        Remove-Item Env:\MYSQL_PWD
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Migration completed successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Kronik system tables created:" -ForegroundColor Cyan
        Write-Host "  - kronik_categories" -ForegroundColor White
        Write-Host "  - kronik_sections" -ForegroundColor White
        Write-Host "  - kronik_entries" -ForegroundColor White
        Write-Host "  - kronik_views" -ForegroundColor White
        Write-Host "  - kronik_comments" -ForegroundColor White
        Write-Host ""
        Write-Host "You can now use the Kronik management feature!" -ForegroundColor Green
    }
    else {
        Write-Host ""
        Write-Host "❌ Migration failed with exit code: $LASTEXITCODE" -ForegroundColor Red
        Write-Host "Please check the error messages above" -ForegroundColor Yellow
        exit 1
    }
}
catch {
    Write-Host ""
    Write-Host "❌ Error running migration:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}
