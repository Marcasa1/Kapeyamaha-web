console.log("Starting email test...");

const fs = require('fs');
const path = require('path');

console.log("Current directory:", __dirname);

console.log("Files in this directory:");
const files = fs.readdirSync('.');
files.forEach(file => {
    console.log("  - " + file);
});

console.log("\nChecking for .env file...");
if (fs.existsSync('.env')) {
    console.log("✅ .env file found!");
    
    // Load environment variables
    require('dotenv').config();
    
    console.log("\nEnvironment variables found:");
    console.log("PORT:", process.env.PORT || "Not set");
    console.log("EMAIL_HOST:", process.env.EMAIL_HOST || "Not set");
    console.log("EMAIL_USER:", process.env.EMAIL_USER || "Not set");
    
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        console.log("\n✅ Email credentials found in .env!");
    } else {
        console.log("\n❌ Email credentials missing in .env");
    }
} else {
    console.log("❌ .env file not found!");
    console.log("\nCreating .env template...");
    
    const envContent = `# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=kapeyamaha@gmail.com

# Website Info
SITE_NAME=KAPEYAMAHA ENTERPRISES LIMITED
SITE_EMAIL=kapeyamaha@gmail.com
SITE_PHONE=+254758772539

# Server
PORT=5000
NODE_ENV=development`;
    
    fs.writeFileSync('.env', envContent);
    console.log("✅ Created .env template file!");
    console.log("\n📝 Please edit .env with your actual email credentials.");
}
