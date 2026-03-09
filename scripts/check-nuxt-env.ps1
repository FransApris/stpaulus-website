# Script: Check and prepare Nuxt environment
# Purpose: Prevent VSCode crash due to missing .nuxt directory
# Usage: Run automatically on VSCode open or manually

$ErrorActionPreference = "Stop"

$PROJECT_DIR = Split-Path -Parent $PSScriptRoot
$NUXT_DIR = Join-Path $PROJECT_DIR ".nuxt"

Write-Host "Checking Nuxt environment..." -ForegroundColor Cyan

# Check if .nuxt directory exists
if (-not (Test-Path -Path $NUXT_DIR -PathType Container)) {
    Write-Host "WARNING: .nuxt directory not found!" -ForegroundColor Yellow
    Write-Host "Generating .nuxt directory..." -ForegroundColor Cyan
    Set-Location $PROJECT_DIR
    npm run prepare:nuxt
    Write-Host "SUCCESS: .nuxt directory generated successfully" -ForegroundColor Green
}
else {
    Write-Host "OK: .nuxt directory exists" -ForegroundColor Green
    
    # Check if tsconfig.json exists
    $TSCONFIG_PATH = Join-Path $NUXT_DIR "tsconfig.json"
    if (-not (Test-Path -Path $TSCONFIG_PATH -PathType Leaf)) {
        Write-Host "WARNING: .nuxt/tsconfig.json missing!" -ForegroundColor Yellow
        Write-Host "Regenerating .nuxt directory..." -ForegroundColor Cyan
        Set-Location $PROJECT_DIR
        npm run prepare:nuxt
        Write-Host "SUCCESS: .nuxt/tsconfig.json generated successfully" -ForegroundColor Green
    }
    else {
        Write-Host "OK: .nuxt/tsconfig.json exists" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Nuxt environment is ready!" -ForegroundColor Green
Write-Host ""
