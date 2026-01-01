@echo off
echo Creating KAPEYAMAHA Email Setup...
echo.

cd /d "C:\Users\marcu\Desktop\KAPEYAMAHA WEB"

echo Creating test-email.js...
echo // test-email.js > test-email.js
echo console.log("Testing email setup..."); >> test-email.js
echo const fs = require('fs'); >> test-email.js
echo console.log("Current directory:", __dirname); >> test-email.js
echo if (fs.existsSync('.env')) { >> test-email.js
echo   console.log(".env file exists"); >> test-email.js
echo } else { >> test-email.js
echo   console.log("Creating .env file..."); >> test-email.js
echo   fs.writeFileSync('.env', 'EMAIL_USER=your_email@gmail.com\nEMAIL_PASS=your_password'); >> test-email.js
echo } >> test-email.js

echo Creating package.json...
echo { > package.json
echo   "name": "kapeyamaha", >> package.json
echo   "scripts": { >> package.json
echo     "test": "node test-email.js" >> package.json
echo   } >> package.json
echo } >> package.json

echo Setup complete!
echo.
echo Next steps:
echo 1. Edit the .env file with your Gmail credentials
echo 2. Run: npm install nodemailer dotenv
echo 3. Run: node test-email.js
pause