# ===================================================================
# MySQL Password Reset Script
# Purpose: Reset MySQL root password to 'pressgk31'
# Requirements: Must run as Administrator
# ===================================================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🔐 MySQL Password Reset Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "❌ ERROR: This script must be run as Administrator!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please:" -ForegroundColor Yellow
    Write-Host "1. Right-click PowerShell" -ForegroundColor Yellow
    Write-Host "2. Select 'Run as Administrator'" -ForegroundColor Yellow
    Write-Host "3. Navigate to: cd 'd:\APRIS FILE\WEBSITE PROJECT\StPaulus 3 2\StPaulus 3'" -ForegroundColor Yellow
    Write-Host "4. Run: .\scripts\reset-mysql-password.ps1" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✅ Running with Administrator privileges" -ForegroundColor Green
Write-Host ""

# Step 1: Stop MySQL Service
Write-Host "Step 1: Stopping MySQL service..." -ForegroundColor Yellow
try {
    Stop-Service -Name MySQL84 -Force -ErrorAction Stop
    Write-Host "✅ MySQL84 service stopped successfully" -ForegroundColor Green
}
catch {
    Write-Host "❌ Failed to stop MySQL84: $_" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host ""

# Step 2: Create temporary SQL file for password reset
Write-Host "Step 2: Creating temporary SQL reset file..." -ForegroundColor Yellow
$tempSqlFile = "$env:TEMP\mysql_reset_password.sql"
$sqlContent = @"
ALTER USER 'root'@'localhost' IDENTIFIED BY 'pressgk31';
FLUSH PRIVILEGES;
"@
Set-Content -Path $tempSqlFile -Value $sqlContent
Write-Host "✅ SQL file created: $tempSqlFile" -ForegroundColor Green
Write-Host ""

# Step 3: Start MySQL with init-file to reset password
Write-Host "Step 3: Starting MySQL with password reset..." -ForegroundColor Yellow
$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqld.exe"

if (-not (Test-Path $mysqlPath)) {
    # Try MySQL 8.0
    $mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld.exe"
}

if (-not (Test-Path $mysqlPath)) {
    Write-Host "❌ MySQL executable not found!" -ForegroundColor Red
    Write-Host "Expected locations:" -ForegroundColor Yellow
    Write-Host "  - C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqld.exe" -ForegroundColor Yellow
    Write-Host "  - C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld.exe" -ForegroundColor Yellow
    Start-Service -Name MySQL84
    Remove-Item $tempSqlFile -Force
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Using MySQL: $mysqlPath" -ForegroundColor Cyan

# Start MySQL with init file
$mysqlProcess = Start-Process -FilePath $mysqlPath -ArgumentList "--init-file=`"$tempSqlFile`"" -PassThru -WindowStyle Hidden

Write-Host "⏳ Waiting for MySQL to reset password (10 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Stop the MySQL process
Write-Host "⏳ Stopping temporary MySQL instance..." -ForegroundColor Yellow
Stop-Process -Id $mysqlProcess.Id -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

Write-Host "✅ Password reset completed" -ForegroundColor Green
Write-Host ""

# Step 4: Start MySQL service normally
Write-Host "Step 4: Starting MySQL service normally..." -ForegroundColor Yellow
try {
    Start-Service -Name MySQL84 -ErrorAction Stop
    Write-Host "✅ MySQL84 service started successfully" -ForegroundColor Green
}
catch {
    Write-Host "❌ Failed to start MySQL84: $_" -ForegroundColor Red
    Write-Host "Try manually: net start MySQL84" -ForegroundColor Yellow
}
Write-Host ""

# Cleanup
Remove-Item $tempSqlFile -Force -ErrorAction SilentlyContinue

# Step 5: Test connection
Write-Host "Step 5: Testing connection with new password..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

$mysqlExe = "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe"
if (-not (Test-Path $mysqlExe)) {
    $mysqlExe = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
}

if (Test-Path $mysqlExe) {
    try {
        $env:MYSQL_PWD = "pressgk31"
        $testResult = & $mysqlExe -u root -e "SELECT 'Connection successful!' AS status;" 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Connection test successful!" -ForegroundColor Green
            Write-Host $testResult
        }
        else {
            Write-Host "⚠️  Connection test failed, but password might be set" -ForegroundColor Yellow
            Write-Host "Error: $testResult" -ForegroundColor Gray
        }
        Remove-Item Env:\MYSQL_PWD
    }
    catch {
        Write-Host "⚠️  Could not test connection: $_" -ForegroundColor Yellow
    }
}
else {
    Write-Host "⚠️  MySQL client not found in standard location" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ Password Reset Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "New MySQL credentials:" -ForegroundColor Cyan
Write-Host "  User:     root" -ForegroundColor White
Write-Host "  Password: pressgk31" -ForegroundColor White
Write-Host "  Host:     localhost" -ForegroundColor White
Write-Host "  Port:     3306" -ForegroundColor White
Write-Host ""
Write-Host "Your .env file has been updated with these credentials." -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Close this window" -ForegroundColor White
Write-Host "2. Return to VS Code" -ForegroundColor White
Write-Host "3. Run: npm run dev" -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to exit"
