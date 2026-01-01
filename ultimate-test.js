console.log("🚀 ULTIMATE EMAIL TEST");
console.log("======================\n");

require('dotenv').config();

const email = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;

if (!email || !pass) {
  console.error("❌ Missing email credentials in .env file");
  process.exit(1);
}

console.log("📧 Email:", email);
console.log("🔐 Password length:", pass.length, "characters");
console.log("");

if (pass.length !== 16 && pass.length !== 20) {
  console.warn("⚠️  Warning: App Password should be 16 characters");
  console.log("   Your password is", pass.length, "characters");
  console.log("   Make sure it's an App Password, not your regular password");
}

const nodemailer = require('nodemailer');

// Try different configurations
const configs = [
  { port: 587, secure: false, name: 'TLS (port 587)' },
  { port: 465, secure: true, name: 'SSL (port 465)' },
  { port: 25, secure: false, name: 'Standard (port 25)' }
];

async function testConfig(config) {
  console.log(`\n🔧 Testing ${config.name}...`);
  
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: config.port,
      secure: config.secure,
      auth: { user: email, pass: pass }
    });

    await transporter.verify();
    console.log(`✅ ${config.name}: Connection successful!`);
    
    const info = await transporter.sendMail({
      from: `"KAPEYAMAHA" <${email}>`,
      to: email,
      subject: `✅ Test: ${config.name}`,
      text: `Test email sent via ${config.name}`
    });
    
    console.log(`📧 ${config.name}: Email sent!`);
    return true;
    
  } catch (error) {
    console.error(`❌ ${config.name}:`, error.message.split('\n')[0]);
    return false;
  }
}

async function runTests() {
  console.log("Starting tests...\n");
  
  let success = false;
  
  for (const config of configs) {
    const result = await testConfig(config);
    if (result) {
      success = true;
      break; // Stop at first success
    }
  }
  
  if (success) {
    console.log("\n🎉 CONGRATULATIONS! Your email setup is working!");
    console.log("✅ Your website contact form will now send emails");
    console.log("✅ Customers will receive auto-replies");
    console.log("✅ You'll get notified of new inquiries");
  } else {
    console.log("\n❌ ALL TESTS FAILED");
    console.log("\n🔧 Required fixes:");
    console.log("1. ✅ Make sure 2-Step Verification is ON");
    console.log("2. ✅ Generate App Password at: https://myaccount.google.com/apppasswords");
    console.log("3. ✅ Use 16-character App Password (not regular password)");
    console.log("4. ✅ Update .env file with correct credentials");
    console.log("\n📞 Need help? Contact: +254 758 772 539");
  }
}

runTests();
