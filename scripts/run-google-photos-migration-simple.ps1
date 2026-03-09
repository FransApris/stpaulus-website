# Simple PowerShell script to run Google Photos migration
# Usage: .\scripts\run-google-photos-migration-simple.ps1

$MySQLUser = "root"
$MySQLPassword = "pressgk31"
$Database = "stpaulus_cms_db"

Write-Host ""
Write-Host "[MIGRATION] Running Google Photos Integration Migration..." -ForegroundColor Cyan
Write-Host ""

# Run migration dan tangkap output
$migrationFile = "server/database/migrations/add-google-photos-integration.sql"

if (-not (Test-Path $migrationFile)) {
    Write-Host "[ERROR] Migration file not found!" -ForegroundColor Red
    exit 1
}

Write-Host "[RUNNING] Executing migration..." -ForegroundColor Cyan

# Run dengan error handling
$output = & {
    Get-Content $migrationFile | & mysql -u $MySQLUser --password=$MySQLPassword $Database 2>&1
}

# Check output
$hasRealError = $false
$duplicateCount = 0

foreach ($line in $output) {
    $lineStr = $line.ToString()
    
    # Skip password warning
    if ($lineStr -match "Using a password") {
        continue
    }
    
    # Count duplicate column/index (ini normal jika migration sudah pernah dijalankan)
    if ($lineStr -match "Duplicate column" -or $lineStr -match "Duplicate key" -or $lineStr -match "column already exists") {
        $duplicateCount++
        Write-Host "  [SKIP] $lineStr" -ForegroundColor Yellow
        continue
    }
    
    # Real errors
    if ($lineStr -match "ERROR") {
        $hasRealError = $true
        Write-Host "  [ERROR] $lineStr" -ForegroundColor Red
    }
}

Write-Host ""

if ($hasRealError) {
    Write-Host "[FAILED] Migration failed with errors" -ForegroundColor Red
    Write-Host ""
    Write-Host "If you see 'Duplicate column' errors, migration may have run before." -ForegroundColor Yellow
    Write-Host "Check database manually to verify tables exist." -ForegroundColor Yellow 
    exit 1
}

if ($duplicateCount -gt 0) {
    Write-Host "[SUCCESS] Migration completed - $duplicateCount columns already existed" -ForegroundColor Green
} else {
    Write-Host "[SUCCESS] Migration completed successfully!" -ForegroundColor Green
}

Write-Host ""
Write-Host "[READY] Database ready for Google Photos integration!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor White
Write-Host "  1. npm run dev" -ForegroundColor Gray
Write-Host "  2. Open: http://localhost:3000/admin/google-photos" -ForegroundColor Gray
Write-Host "  3. Connect and sync your photos" -ForegroundColor Gray
Write-Host ""
