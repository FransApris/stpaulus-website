# MySQL Management Script for Windows
# Usage: powershell -ExecutionPolicy Bypass -File scripts/mysql-windows.ps1 -Action [start|stop|status|restart]

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet('start','stop','status','restart')]
    [string]$Action
)

# Auto-detect MySQL service name
$ServiceName = $null
$PossibleNames = @("MySQL84", "MySQL80", "MySQL", "MySQL57")
foreach ($name in $PossibleNames) {
    $testService = Get-Service $name -ErrorAction SilentlyContinue
    if ($testService) {
        $ServiceName = $name
        break
    }
}

if (-not $ServiceName) {
    Write-Host "ERROR: MySQL service not found" -ForegroundColor Red
    Write-Host "`nSearching for MySQL services..." -ForegroundColor Yellow
    $mysqlServices = Get-Service | Where-Object {$_.Name -like '*mysql*'}
    if ($mysqlServices) {
        Write-Host "Found MySQL services:" -ForegroundColor Green
        $mysqlServices | Format-Table Name, DisplayName, Status
    } else {
        Write-Host "No MySQL service found. Please install MySQL first." -ForegroundColor Red
    }
    exit 1
}

# Colors
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

switch ($Action) {
    'start' {
        Write-ColorOutput Cyan "Starting MySQL service..."
        try {
            Start-Service $ServiceName -ErrorAction Stop
            Start-Sleep -Seconds 2
            $Service = Get-Service $ServiceName
            if ($Service.Status -eq 'Running') {
                Write-ColorOutput Green "SUCCESS: MySQL started successfully"
            } else {
                Write-ColorOutput Red "ERROR: MySQL failed to start properly"
            }
        }
        catch {
            Write-ColorOutput Red "ERROR: Failed to start MySQL: $_"
            Write-ColorOutput Yellow "`nTry running PowerShell as Administrator"
            exit 1
        }
    }
    
    'stop' {
        Write-ColorOutput Yellow "Stopping MySQL service..."
        try {
            Stop-Service $ServiceName -ErrorAction Stop
            Start-Sleep -Seconds 2
            $Service = Get-Service $ServiceName
            if ($Service.Status -eq 'Stopped') {
                Write-ColorOutput Green "SUCCESS: MySQL stopped successfully"
            } else {
                Write-ColorOutput Yellow "WARNING: MySQL is stopping..."
            }
        }
        catch {
            Write-ColorOutput Red "ERROR: Failed to stop MySQL: $_"
            Write-ColorOutput Yellow "`nTry running PowerShell as Administrator"
            exit 1
        }
    }
    
    'status' {
        Write-ColorOutput Cyan "MySQL Service Status"
        Write-Output "========================"
        $Service = Get-Service $ServiceName
        
        Write-Output "Service Name: $($Service.Name)"
        Write-Output "Display Name: $($Service.DisplayName)"
        
        if ($Service.Status -eq 'Running') {
            Write-ColorOutput Green "Status: Running"
        } elseif ($Service.Status -eq 'Stopped') {
            Write-ColorOutput Red "Status: Stopped"
        } else {
            Write-ColorOutput Yellow "Status: $($Service.Status)"
        }
        
        Write-Output "Start Type: $($Service.StartType)"
        
        # Check if port 3306 is listening
        $Port = netstat -ano | Select-String ":3306 " | Select-Object -First 1
        if ($Port) {
            Write-ColorOutput Green "`nPort 3306 is listening"
        } else {
            Write-ColorOutput Yellow "`nPort 3306 is not listening"
        }
    }
    
    'restart' {
        Write-ColorOutput Cyan "Restarting MySQL service..."
        try {
            Restart-Service $ServiceName -ErrorAction Stop
            Start-Sleep -Seconds 3
            $Service = Get-Service $ServiceName
            if ($Service.Status -eq 'Running') {
                Write-ColorOutput Green "SUCCESS: MySQL restarted successfully"
            } else {
                Write-ColorOutput Red "ERROR: MySQL failed to restart properly"
            }
        }
        catch {
            Write-ColorOutput Red "ERROR: Failed to restart MySQL: $_"
            Write-ColorOutput Yellow "`nTry running PowerShell as Administrator"
            exit 1
        }
    }
}
