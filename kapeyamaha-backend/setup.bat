@echo off
echo Setting up KAPEYAMAHA Backend...
echo.

echo Creating package.json...
echo { > package.json
echo   "name": "kapeyamaha-backend", >> package.json
echo   "version": "1.0.0", >> package.json
echo   "description": "Backend for KAPEYAMAHA Enterprises", >> package.json
echo   "main": "src/server.js", >> package.json
echo   "scripts": { >> package.json
echo     "start": "node src/server.js", >> package.json
echo     "dev": "nodemon src/server.js", >> package.json
echo     "seed": "node src/seeds/seedDatabase.js" >> package.json
echo   }, >> package.json
echo   "dependencies": { >> package.json
echo     "express": "^4.18.2", >> package.json
echo     "mongoose": "^7.6.3", >> package.json
echo     "bcryptjs": "^2.4.3", >> package.json
echo     "jsonwebtoken": "^9.0.2", >> package.json
echo     "dotenv": "^16.3.1", >> package.json
echo     "cors": "^2.8.5", >> package.json
echo     "express-validator": "^7.0.1" >> package.json
echo   }, >> package.json
echo   "devDependencies": { >> package.json
echo     "nodemon": "^3.0.1" >> package.json
echo   } >> package.json
echo } >> package.json

echo Creating necessary directories...
mkdir src 2>nul
mkdir src\config 2>nul
mkdir src\models 2>nul
mkdir src\controllers 2>nul
mkdir src\routes 2>nul
mkdir src\middleware 2>nul
mkdir src\utils 2>nul
mkdir src\seeds 2>nul
mkdir uploads 2>nul

echo Creating .env file...
echo PORT=5000 > .env
echo MONGODB_URI=mongodb://localhost:27017/kapeyamaha >> .env
echo JWT_SECRET=your_super_secret_jwt_key_change_this >> .env
echo ADMIN_EMAIL=admin@kapeyamaha.com >> .env
echo ADMIN_PASSWORD=Admin@123 >> .env

echo Installing dependencies...
npm install

echo.
echo Setup complete!
echo Run the following commands:
echo   npm run dev  - Start development server
echo   npm start    - Start production server
echo.
pause