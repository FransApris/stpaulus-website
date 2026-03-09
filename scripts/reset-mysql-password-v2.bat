@echo off
setlocal enabledelayedexpansion

echo ============================================================
echo   MySQL Root Password Reset Utility
echo   Target Password: pressgk31
echo ============================================================
echo.

REM Check for Administrator
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: This script requires Administrator privileges!
    echo.
    echo Please:
    echo 1. Right-click this file
    echo 2. Select "Run as administrator"
    echo.
    pause
    exit /b 1
)

echo [1/6] Stopping MySQL service...
net stop MySQL84 >nul 2>&1
if %errorLevel% equ 0 (
    echo       SUCCESS: MySQL stopped
) else (
    echo       WARNING: MySQL was not running or failed to stop
)
echo.

echo [2/6] Creating temporary directory...
if not exist "C:\temp\" mkdir "C:\temp\"
set TEMP_DIR=C:\temp\mysql_reset_%random%
mkdir "%TEMP_DIR%"
echo       Temp dir: %TEMP_DIR%
echo.

echo [3/6] Creating reset script...
set RESET_SQL=%TEMP_DIR%\reset.sql
(
    echo FLUSH PRIVILEGES;
    echo ALTER USER 'root'@'localhost' IDENTIFIED BY 'pressgk31';
    echo FLUSH PRIVILEGES;
) > "%RESET_SQL%"
echo       Script created: %RESET_SQL%
echo.

echo [4/6] Starting MySQL in safe mode with password reset...
echo       This will take about 15 seconds...
set MYSQL_BIN=C:\Program Files\MySQL\MySQL Server 8.4\bin
set MYSQL_DATA=C:\ProgramData\MySQL\MySQL Server 8.4\Data

start /B "" "%MYSQL_BIN%\mysqld.exe" --defaults-file="%MYSQL_DATA%\..\my.ini" --init-file="%RESET_SQL%" --console > "%TEMP_DIR%\mysqld.log" 2>&1

timeout /t 15 /nobreak > nul
echo       Done waiting
echo.

echo [5/6] Stopping temporary MySQL instance...
taskkill /F /IM mysqld.exe > nul 2>&1
timeout /t 3 /nobreak > nul
echo       Stopped
echo.

echo [6/6] Starting MySQL service normally...
net start MySQL84
if %errorLevel% equ 0 (
    echo       SUCCESS: MySQL started
) else (
    echo       ERROR: Failed to start MySQL
    echo       Try manually: net start MySQL84
    pause
    exit /b 1
)
echo.

echo Waiting for MySQL to be ready...
timeout /t 5 /nobreak > nul

echo Testing connection...
"%MYSQL_BIN%\mysql.exe" -u root -ppressgk31 -e "SELECT 'Connection successful!' AS result, USER() AS connected_as, @@version AS mysql_version;" 2>"%TEMP_DIR%\test.err"
set TEST_RESULT=%errorLevel%

echo.
if %TEST_RESULT% equ 0 (
    echo ============================================================
    echo   SUCCESS! Password has been reset to: pressgk31
    echo ============================================================
    echo.
    echo Your .env file already contains this password.
    echo You can now run: npm run dev
) else (
    echo ============================================================
    echo   WARNING: Connection test failed
    echo ============================================================
    echo.
    echo The password may have been set, but connection test failed.
    echo Error details:
    type "%TEMP_DIR%\test.err" 2>nul
    echo.
    echo MySQL log:
    type "%TEMP_DIR%\mysqld.log" 2>nul | findstr /I "error password"
)

echo.
echo Cleaning up...
RD /S /Q "%TEMP_DIR%" 2>nul

echo.
echo Press any key to close this window...
pause > nul
