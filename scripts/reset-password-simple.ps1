# Simple MySQL Password Reset
# Run as Administrator

Write-Host "Stopping MySQL..." -ForegroundColor Yellow
net stop MySQL84

Write-Host ""
Write-Host "Starting MySQL in safe mode..." -ForegroundColor Yellow
Write-Host "This will open MySQL without password. Please wait..." -ForegroundColor Cyan
Write-Host ""

# Create init file
$initFile = "C:\mysql-init.txt"
@"
ALTER USER 'root'@'localhost' IDENTIFIED BY 'pressgk31';
FLUSH PRIVILEGES;
"@ | Out-File -FilePath $initFile -Encoding ASCII

Write-Host "Resetting password..." -ForegroundColor Yellow
& "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqld.exe" --init-file="$initFile" --console

Remove-Item $initFile -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "Starting MySQL normally..." -ForegroundColor Yellow
net start MySQL84

Write-Host ""
Write-Host "Testing connection..." -ForegroundColor Yellow
& "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe" -u root -ppressgk31 -e "SELECT 'Success!' AS status;"

Write-Host ""
Write-Host "Done! Press any key to exit..." -ForegroundColor Green
Read-Host
