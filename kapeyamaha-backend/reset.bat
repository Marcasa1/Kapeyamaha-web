@echo off
echo Resetting KAPEYAMAHA Backend setup...
echo.

echo Deleting corrupted files...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
if exist package.json del package.json

echo Creating fresh package.json...
echo { > package.json
echo   "name": "kapeyamaha-backend", >> package.json
echo   "version": "1.0.0", >> package.json
echo   "description": "Backend for KAPEYAMAHA Enterprises", >> package.json
echo   "main": "src/server.js", >> package.json
echo   "scripts": { >> package.json
echo     "start": "node src/server.js", >> package.json
echo     "dev": "nodemon src/server.js" >> package.json
echo   }, >> package.json
echo   "dependencies": {}, >> package.json
echo   "devDependencies": {} >> package.json
echo } >> package.json

echo.
echo Fresh package.json created!
echo Run: npm install express cors
pause