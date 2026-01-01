console.log("🎯 FINAL EMAIL TEST");
console.log("===================");

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Verify credentials
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("❌ ERROR: Update .env file with your email credentials!");
    console.log("\nRun: nano .env");
    console.log("Add:");
    console.log("EMAIL_USER=your_email@gmail.com");
    console.log("EMAIL_PASS=your_app_password");
    process.exit(1);
}

console.log("✅ Credentials found");
console.log("📧 Testing email sending...");

const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: 'Final Test - KAPEYAMAHA',
    text: 'If you receive this, your email system is working!'
})
.then(info => {
    console.log("✅ SUCCESS! Email sent!");
    console.log("Message ID:", info.messageId);
    console.log("\n🚀 Your website contact form is now ready!");
})
.catch(error => {
    console.error("❌ FAILED:", error.message);
    console.log("\n💡 Fix: Use Google App Password, not regular password");
});
