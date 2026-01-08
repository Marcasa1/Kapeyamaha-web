@echo off
echo ========================================
echo    FIXING DNS FOR MONGODB ATLAS
echo ========================================
echo.
echo Running as Administrator is REQUIRED!
echo.

REM Check if running as admin
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: Please run this as Administrator!
    echo Right-click -> Run as Administrator
    pause
    exit /b 1
)

echo Step 1: Setting Google DNS for all adapters...
echo.

REM For Wi-Fi
netsh interface ip set dns "Wi-Fi" static 8.8.8.8 >nul 2>&1
netsh interface ip add dns "Wi-Fi" 8.8.4.4 index=2 >nul 2>&1
echo ✅ Wi-Fi DNS set to 8.8.8.8, 8.8.4.4

REM For Ethernet
netsh interface ip set dns "Ethernet" static 8.8.8.8 >nul 2>&1
netsh interface ip add dns "Ethernet" 8.8.4.4 index=2 >nul 2>&1
echo ✅ Ethernet DNS set to 8.8.8.8, 8.8.4.4

echo.
echo Step 2: Flushing DNS cache...
ipconfig /flushdns >nul 2>&1
echo ✅ DNS cache flushed

echo.
echo Step 3: Registering DNS...
ipconfig /registerdns >nul 2>&1
echo ✅ DNS registered

echo.
echo Step 4: Testing DNS resolution...
echo Testing nslookup for MongoDB Atlas...
nslookup cluster0.vqqw5ym.mongodb.net 8.8.8.8
echo.

echo Step 5: Testing internet connectivity...
ping 8.8.8.8 -n 2 >nul 2>&1
if %errorLevel% equ 0 (
    echo ✅ Internet connection working
) else (
    echo ❌ No internet connection
)

echo.
echo ========================================
echo    FIX COMPLETE!
echo ========================================
echo.
echo Please RESTART your computer for changes
echo to take full effect.
echo.
echo After restart, test with:
echo    node test-connection.js
echo.
pause
