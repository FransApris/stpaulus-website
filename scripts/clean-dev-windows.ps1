# Clean Development Environment - Windows Version
# Usage: powershell -ExecutionPolicy Bypass -File scripts/clean-dev-windows.ps1

# Colors
function Write-ColorOutput($ForegroundColor, $Message) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    Write-Output $Message
    $host.UI.RawUI.ForegroundColor = $fc
}

Write-ColorOutput Cyan "`n🧹 Cleaning Development Environment"
Write-ColorOutput Blue "====================================="

# Remove .nuxt directory
if (Test-Path .nuxt) {
    Write-ColorOutput Yellow "`n🗑️  Removing .nuxt directory..."
    try {
        Remove-Item -Recurse -Force .nuxt
        Write-ColorOutput Green "✅ .nuxt removed"
    } catch {
        Write-ColorOutput Red "❌ Failed to remove .nuxt: $_"
    }
} else {
    Write-Output "`n.nuxt directory not found (already clean)"
}

# Remove .output directory
if (Test-Path .output) {
    Write-ColorOutput Yellow "🗑️  Removing .output directory..."
    try {
        Remove-Item -Recurse -Force .output
        Write-ColorOutput Green "✅ .output removed"
    } catch {
        Write-ColorOutput Red "❌ Failed to remove .output: $_"
    }
}

# Ask about node_modules
$removeModules = Read-Host "`nRemove node_modules? (y/N)"
if ($removeModules -eq 'y' -or $removeModules -eq 'Y') {
    if (Test-Path node_modules) {
        Write-ColorOutput Yellow "🗑️  Removing node_modules..."
        try {
            Remove-Item -Recurse -Force node_modules
            Write-ColorOutput Green "✅ node_modules removed"
        } catch {
            Write-ColorOutput Red "❌ Failed to remove node_modules: $_"
        }
        
        # Remove package-lock.json
        if (Test-Path package-lock.json) {
            Write-ColorOutput Yellow "🗑️  Removing package-lock.json..."
            Remove-Item package-lock.json
        }
        
        # Reinstall dependencies
        Write-ColorOutput Cyan "`n📦 Reinstalling dependencies..."
        npm install
        if ($LASTEXITCODE -eq 0) {
            Write-ColorOutput Green "✅ Dependencies reinstalled"
        } else {
            Write-ColorOutput Red "❌ Failed to reinstall dependencies"
        }
    } else {
        Write-Output "node_modules not found"
    }
}

# Clear npm cache (optional)
$clearCache = Read-Host "`nClear npm cache? (y/N)"
if ($clearCache -eq 'y' -or $clearCache -eq 'Y') {
    Write-ColorOutput Cyan "🧹 Clearing npm cache..."
    npm cache clean --force
    if ($LASTEXITCODE -eq 0) {
        Write-ColorOutput Green "✅ npm cache cleared"
    }
}

Write-ColorOutput Green "`n✅ Cleanup complete!"
Write-ColorOutput Yellow "`nYou can now run: npm run dev"
