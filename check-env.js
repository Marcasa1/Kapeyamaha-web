const fs = require('fs');
console.log("Current directory:", process.cwd());
console.log(".env exists here:", fs.existsSync('.env'));

if (fs.existsSync('.env')) {
    require('dotenv').config();
    console.log("\n✅ Environment variables loaded from project directory:");
    console.log("EMAIL_USER:", process.env.EMAIL_USER ? "✅ SET" : "❌ NOT SET");
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "✅ SET" : "❌ NOT SET");
} else {
    console.log("\n❌ .env not found in project directory!");
    console.log("Create it at:", process.cwd() + '/.env');
}
