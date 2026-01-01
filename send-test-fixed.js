const path = require('path');
const fs = require('fs');

console.log("🔧 Fixed Email Test - Looking for .env in correct location");
console.log("===========================================================");

// Set the path to .env in project directory
const projectDir = __dirname;
const envPath = path.join(projectDir, '.env');

console.log("Project directory:", projectDir);
console.log(".env file path:", envPath);
console.log(".env exists:", fs.existsSync(envPath));

if (!fs.existsSync(envPath)) {
    console.error("\n❌ ERROR: .env file not found in project directory!");
    console.log("\n💡 Solution: Create .env file at:");
    console.log(envPath);
    console.log("\n📝 Or run: cp ~/.env .env");
    process.exit(1);
}

// Load environment variables from project directory
require('dotenv').config({ path: envPath });

console.log("\n📋 Environment variables found:");
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_HOST:", process.env.EMAIL_HOST);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "✅ SET (hidden)" : "❌ NOT SET");

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("\n❌ ERROR: Email credentials missing in .env file!");
    console.log("\n📝 Open .env file and add:");
    console.log("EMAIL_USER=your_email@gmail.com");
    console.log("EMAIL_PASS=your_app_password");
    process.exit(1);
}

console.log("\n🚀 Starting email test...");

const nodemailer = require('nodemailer');

async function testEmail() {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT || 587),
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        console.log("🔌 Testing connection...");
        await transporter.verify();
        console.log("✅ Connection verified!");

        console.log("📤 Sending test email...");
        
        const info = await transporter.sendMail({
            from: `"${process.env.SITE_NAME}" <${process.env.EMAIL_FROM}>`,
            to: process.env.EMAIL_USER,
            subject: '✅ KAPEYAMAHA Email Test - SUCCESS!',
            text: `Test email sent successfully from ${process.env.SITE_NAME}!`,
            html: `<h1>Test Successful!</h1><p>Your email setup is working.</p>`
        });

        console.log("\n🎉 Email sent successfully!");
        console.log("📧 Message ID:", info.messageId);
        console.log("\n✅ Your contact form will now send emails!");

    } catch (error) {
        console.error("\n❌ Error:", error.message);
        
        if (error.code === 'EAUTH') {
            console.log("\n🔐 Authentication failed.");
            console.log("Make sure you're using an App Password, not your regular password.");
            console.log("Get one from: https://myaccount.google.com/apppasswords");
        }
    }
}

testEmail();
