// test-email.js - MINIMAL VERSION
console.log("Starting email test...");

// Check if we can access the filesystem
const fs = require('fs');
const path = require('path');

console.log("Current directory:", __dirname);
console.log("Files in directory:");
fs.readdirSync(__dirname).forEach(file => {
    console.log("  - " + file);
});

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    console.log("✅ .env file exists!");
    require('dotenv').config();
    
    console.log("\n📋 Environment variables:");
    console.log("PORT:", process.env.PORT || "Not set");
    console.log("EMAIL_HOST:", process.env.EMAIL_HOST || "Not set");
    console.log("EMAIL_USER:", process.env.EMAIL_USER || "Not set");
    console.log("SITE_NAME:", process.env.SITE_NAME || "Not set");
    
    // Try to load nodemailer
    try {
        const nodemailer = require('nodemailer');
        console.log("\n✅ nodemailer module loaded successfully!");
        
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            console.log("\n🚀 Email credentials found! Ready to test.");
            console.log("\nTo send a test email, run: npm run test-email");
        } else {
            console.log("\n⚠️  Email credentials missing in .env file!");
            console.log("Add these to your .env file:");
            console.log("EMAIL_USER=your_email@gmail.com");
            console.log("EMAIL_PASS=your_app_password");
        }
    } catch (error) {
        console.log("\n❌ nodemailer not installed. Run: npm install nodemailer");
    }
} else {
    console.log("\n❌ .env file not found! Creating template...");
    
    const envTemplate = `# ==============================================
# SERVER CONFIGURATION
# ==============================================
PORT=5000
NODE_ENV=development

# ==============================================
# EMAIL CONFIGURATION (Gmail)
# ==============================================
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password
EMAIL_FROM=kapeyamaha@gmail.com

# ==============================================
# WEBSITE INFORMATION
# ==============================================
SITE_NAME=KAPEYAMAHA ENTERPRISES LIMITED
SITE_EMAIL=kapeyamaha@gmail.com
SITE_PHONE=+254758772539`;

    fs.writeFileSync(envPath, envTemplate);
    console.log("✅ Created .env template file!");
    console.log("\n📝 Please edit the .env file with your actual email credentials.");
    console.log("\n📧 For Gmail setup:");
    console.log("1. Enable 2-Factor Authentication");
    console.log("2. Generate App Password: https://myaccount.google.com/apppasswords");
    console.log("3. Select 'Mail' and copy the 16-character password");
    console.log("4. Add to .env file: EMAIL_PASS=your_16_char_password");
}

console.log("\n🎯 Next steps:");
console.log("1. Edit .env file with your email credentials");
console.log("2. Run: npm install nodemailer dotenv");
console.log("3. Run: node test-email.js again");