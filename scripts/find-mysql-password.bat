@echo off
echo Testing common MySQL passwords...
echo.

set passwords=pressgk31 root password admin 123456 gk31 Press31 stpaulus

(for %%p in (%passwords%) do (
    echo Testing password: %%p
    "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe" -u root -p%%p -e "SELECT 'SUCCESS with password: %%p' AS result;" 2>nul
    if !errorlevel! equ 0 (
        echo.
        echo ========================================
        echo FOUND! Password is: %%p
        echo ========================================
        echo.
        echo Updating .env file...
        powershell -Command "(Get-Content '.env') -replace 'MYSQL_PASSWORD=.*', 'MYSQL_PASSWORD=%%p' | Set-Content '.env'"
        echo Done!
        pause
        exit /b 0
    )
))

echo.
echo ========================================
echo Password NOT found in common list
echo ========================================
echo.
echo Please run this command manually:
echo mysql -u root -p
echo.
echo And enter the correct password when prompted.
echo Then tell me the password so I can update .env
echo.
pause
