@echo off
echo Stopping all Node.js processes...
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul
echo Starting KapeYamaha server on port 3001...
set PORT=3001
npm run dev
pause