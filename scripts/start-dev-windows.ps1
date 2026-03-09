# Start Development Server - Windows Version
# Usage: powershell -ExecutionPolicy Bypass -File scripts/start-dev-windows.ps1

# Colors
function Write-ColorOutput($ForegroundColor, $Message) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    Write-Output $Message
    $host.UI.RawUI.ForegroundColor = $fc
}

Write-ColorOutput Cyan "`n🚀 Starting Development Server - Windows"
Write-ColorOutput Blue "=========================================="

# Check Node.js
Write-ColorOutput Cyan "`n📦 Checking Node.js..."
$nodeVersion = node --version
if ($LASTEXITCODE -eq 0) {
    Write-ColorOutput Green "✅ Node.js: $nodeVersion"
} else {
    Write-ColorOutput Red "❌ Node.js not found. Please install Node.js 18+"
    exit 1
}

# Check npm
$npmVersion = npm --version
if ($LASTEXITCODE -eq 0) {
    Write-ColorOutput Green "✅ npm: v$npmVersion"
} else {
    Write-ColorOutput Red "❌ npm not found"
    exit 1
}

# Check if MySQL service is running
Write-ColorOutput Cyan "`n🗄️  Checking MySQL service..."
$ServiceName = "MySQL80"  # Adjust if different
$MySQLService = Get-Service $ServiceName -ErrorAction SilentlyContinue

if (-not $MySQLService) {
    Write-ColorOutput Yellow "⚠️  MySQL80 service not found. Trying 'MySQL'..."
    $ServiceName = "MySQL"
    $MySQLService = Get-Service $ServiceName -ErrorAction SilentlyContinue
}

if (-not $MySQLService) {
    Write-ColorOutput Red "❌ MySQL service not found"
    Write-ColorOutput Yellow "   Please start MySQL manually or check service name"
    $continue = Read-Host "`nContinue anyway? (y/N)"
    if ($continue -ne 'y' -and $continue -ne 'Y') {
        exit 1
    }
} elseif ($MySQLService.Status -ne 'Running') {
    Write-ColorOutput Yellow "⚠️  MySQL is not running. Attempting to start..."
    try {
        Start-Service $ServiceName
        Start-Sleep -Seconds 2
        $MySQLService = Get-Service $ServiceName
        if ($MySQLService.Status -eq 'Running') {
            Write-ColorOutput Green "✅ MySQL started successfully"
        } else {
            Write-ColorOutput Red "❌ Failed to start MySQL"
            exit 1
        }
    } catch {
        Write-ColorOutput Red "❌ Failed to start MySQL: $_"
        Write-ColorOutput Yellow "   Try running PowerShell as Administrator"
        exit 1
    }
} else {
    Write-ColorOutput Green "✅ MySQL is running"
}

# Check .env file
Write-ColorOutput Cyan "`n⚙️  Checking configuration..."
if (Test-Path .env) {
    Write-ColorOutput Green "✅ .env file found"
} else {
    Write-ColorOutput Yellow "⚠️  .env file not found"
    if (Test-Path .env.example) {
        Write-Output "   Creating .env from .env.example..."
        Copy-Item .env.example .env
        Write-ColorOutput Green "✅ .env created"
        Write-ColorOutput Yellow "   Please edit .env with your MySQL credentials"
        notepad .env
        $continue = Read-Host "`nPress Enter to continue after saving .env..."
    } else {
        Write-ColorOutput Red "❌ .env.example not found"
        exit 1
    }
}

# Test database connection
Write-ColorOutput Cyan "`n🔌 Testing database connection..."
npm run db:test
if ($LASTEXITCODE -ne 0) {
    Write-ColorOutput Red "❌ Database connection failed"
    Write-ColorOutput Yellow "   Please check your .env configuration"
    Write-ColorOutput Yellow "   MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE"
    $continue = Read-Host "`nContinue anyway? (y/N)"
    if ($continue -ne 'y' -and $continue -ne 'Y') {
        exit 1
    }
} else {
    Write-ColorOutput Green "✅ Database connection successful"
}

# Check node_modules
if (-not (Test-Path node_modules)) {
    Write-ColorOutput Yellow "`n⚠️  node_modules not found. Installing dependencies..."
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-ColorOutput Red "❌ Failed to install dependencies"
        exit 1
    }
}

# Start Nuxt dev server
Write-ColorOutput Cyan "`n🎯 Starting Nuxt development server..."
Write-ColorOutput Blue "=========================================="
Write-Output ""
Write-ColorOutput Green "Server will be available at:"
Write-Output "   http://localhost:3000 (or 3001 if 3000 is busy)"
Write-Output ""
Write-ColorOutput Yellow "Press Ctrl+C to stop the server"
Write-Output ""

# Set NODE_OPTIONS and start dev server
$env:NODE_OPTIONS = "--no-deprecation"
npm run dev
