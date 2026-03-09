@echo off
echo ========================================
echo MySQL Password Reset to: pressgk31
echo ========================================
echo.

echo Stopping MySQL service...
net stop MySQL84
if errorlevel 1 (
    echo ERROR: Failed to stop MySQL. Make sure you run as Administrator!
    pause
    exit /b 1
)
echo MySQL stopped successfully.
echo.

echo Creating password reset file...
echo ALTER USER 'root'@'localhost' IDENTIFIED BY 'pressgk31'; > C:\mysql-init.txt
echo FLUSH PRIVILEGES; >> C:\mysql-init.txt
echo Password reset file created.
echo.

echo Resetting password (this will take about 10 seconds)...
start /B "" "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqld.exe" --init-file=C:\mysql-init.txt
timeout /t 10 /nobreak > nul

echo Stopping temporary MySQL instance...
taskkill /F /IM mysqld.exe > nul 2>&1
timeout /t 2 /nobreak > nul

echo Cleaning up...
del C:\mysql-init.txt > nul 2>&1

echo Starting MySQL service normally...
net start MySQL84
if errorlevel 1 (
    echo WARNING: Failed to start MySQL automatically
    echo Please start it manually: net start MySQL84
    pause
    exit /b 1
)
echo.

echo Testing connection...
timeout /t 3 /nobreak > nul
"C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe" -u root -ppressgk31 -e "SELECT 'Password reset successful!' AS status;"
if errorlevel 1 (
    echo WARNING: Connection test failed
    echo But password might still be set correctly
) else (
    echo.
    echo ========================================
    echo SUCCESS! Password reset to: pressgk31
    echo ========================================
)

echo.
echo You can now close this window and run: npm run dev
echo.
pause
