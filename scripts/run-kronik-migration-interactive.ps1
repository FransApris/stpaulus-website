# Interactive Kronik Migration Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Kronik System Database Migration" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Prompt for database credentials
Write-Host "Please enter your database credentials:" -ForegroundColor Yellow
Write-Host ""

$dbHost = Read-Host "MySQL Host (default: localhost)"
if ([string]::IsNullOrWhiteSpace($dbHost)) { $dbHost = "localhost" }

$dbPort = Read-Host "MySQL Port (default: 3306)"
if ([string]::IsNullOrWhiteSpace($dbPort)) { $dbPort = "3306" }

$dbUser = Read-Host "MySQL User (default: root)"
if ([string]::IsNullOrWhiteSpace($dbUser)) { $dbUser = "root" }

$dbPassword = Read-Host "MySQL Password (leave empty if none)" -AsSecureString
$dbPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbPassword)
)

$dbName = Read-Host "Database Name (default: stpaulus_cms_db)"
if ([string]::IsNullOrWhiteSpace($dbName)) { $dbName = "stpaulus_cms_db" }

Write-Host ""
Write-Host "Configuration:" -ForegroundColor Cyan
Write-Host "  Host: $dbHost`:$dbPort" -ForegroundColor White
Write-Host "  User: $dbUser" -ForegroundColor White
Write-Host "  Database: $dbName" -ForegroundColor White
Write-Host ""

# Check if migration file exists
$migrationFile = "migrations\020_create_kronik_system_fixed.sql"
if (!(Test-Path $migrationFile)) {
    Write-Host "❌ Migration file not found: $migrationFile" -ForegroundColor Red
    exit 1
}

# Check if mysql client exists
$mysqlPath = Get-Command mysql -ErrorAction SilentlyContinue
if (!$mysqlPath) {
    Write-Host "❌ MySQL client (mysql.exe) not found in PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "Options:" -ForegroundColor Yellow
    Write-Host "1. Import manually via phpMyAdmin:" -ForegroundColor White
    Write-Host "   - Open http://localhost/phpmyadmin" -ForegroundColor Gray
    Write-Host "   - Select database: $dbName" -ForegroundColor Gray
    Write-Host "   - Go to Import tab" -ForegroundColor Gray
    Write-Host "   - Choose file: $migrationFile" -ForegroundColor Gray
    Write-Host "   - Click 'Go'" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Or add MySQL bin folder to PATH" -ForegroundColor White
    exit 1
}

Write-Host "✓ MySQL client found: $($mysqlPath.Source)" -ForegroundColor Green
Write-Host ""

# Prepare mysql command
Write-Host "Running migration..." -ForegroundColor Yellow

# Set password environment variable if provided
if (![string]::IsNullOrWhiteSpace($dbPasswordPlain)) {
    $env:MYSQL_PWD = $dbPasswordPlain
}

try {
    # Run migration
    Get-Content $migrationFile | mysql --host=$dbHost --port=$dbPort --user=$dbUser $dbName 2>&1 | Out-String | Write-Host
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Migration completed successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Kronik tables created:" -ForegroundColor Cyan
        Write-Host "  ✓ kronik_categories" -ForegroundColor White
        Write-Host "  ✓ kronik_sections" -ForegroundColor White  
        Write-Host "  ✓ kronik_entries" -ForegroundColor White
        Write-Host "  ✓ kronik_views" -ForegroundColor White
        Write-Host "  ✓ kronik_comments" -ForegroundColor White
        Write-Host ""
        Write-Host "You can now use the Kronik management feature!" -ForegroundColor Green
    }
    else {
        Write-Host ""
        Write-Host "❌ Migration failed with exit code: $LASTEXITCODE" -ForegroundColor Red
        Write-Host ""
        Write-Host "Try importing manually via phpMyAdmin" -ForegroundColor Yellow
        exit 1
    }
}
catch {
    Write-Host ""
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Try importing manually via phpMyAdmin" -ForegroundColor Yellow
    exit 1
}
finally {
    # Clear password from environment
    if ($env:MYSQL_PWD) {
        Remove-Item Env:\MYSQL_PWD -ErrorAction SilentlyContinue
    }
}
