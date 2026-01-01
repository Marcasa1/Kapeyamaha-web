require('dotenv').config(); // Load environment variables
const nodemailer = require('nodemailer');

async function testRealEmail() {
  console.log('🔍 Looking for email configuration...');
  
  // Try common environment variable names
  const possibleConfigs = {
    host: process.env.EMAIL_HOST || process.env.SMTP_HOST,
    port: process.env.EMAIL_PORT || process.env.SMTP_PORT || 587,
    secure: process.env.EMAIL_SECURE || false,
    user: process.env.EMAIL_USER || process.env.SMTP_USER,
    pass: process.env.EMAIL_PASS || process.env.SMTP_PASS,
    from: process.env.EMAIL_FROM || process.env.FROM_EMAIL
  };
  
  console.log('Current env variables found:');
  console.log(possibleConfigs);
  
  if (!possibleConfigs.user || !possibleConfigs.pass) {
    console.error('\n❌ No email credentials found in environment variables!');
    console.log('\nPlease check your .env file for:');
    console.log('- EMAIL_USER / SMTP_USER');
    console.log('- EMAIL_PASS / SMTP_PASS');
    console.log('- EMAIL_HOST / SMTP_HOST');
    return;
  }
  
  try {
    const transporter = nodemailer.createTransport({
      host: possibleConfigs.host || 'smtp.gmail.com', // Default to Gmail
      port: possibleConfigs.port,
      secure: possibleConfigs.secure,
      auth: {
        user: possibleConfigs.user,
        pass: possibleConfigs.pass
      }
    });
    
    const info = await transporter.sendMail({
      from: possibleConfigs.from || possibleConfigs.user,
      to: possibleConfigs.user, // Send to yourself
      subject: '✅ REAL EMAIL TEST - Kapeyamaha Backend',
      text: `This is a test from your Kapeyamaha backend.\nNodemailer v7 upgrade successful!\nTime: ${new Date().toISOString()}`,
      html: `<h2>✅ REAL EMAIL TEST - Kapeyamaha Backend</h2>
             <p>This is a test from your Kapeyamaha backend.</p>
             <p><strong>Nodemailer v7 upgrade successful!</strong></p>
             <p>Time: ${new Date().toLocaleString()}</p>`
    });
    
    console.log('\n✅ REAL EMAIL SENT SUCCESSFULLY!');
    console.log('Message ID:', info.messageId);
    console.log('Sent to:', possibleConfigs.user);
    
  } catch (error) {
    console.error('\n❌ Real email failed:', error.message);
    console.log('\nTroubleshooting tips:');
    console.log('1. For Gmail: Use App Password (not regular password)');
    console.log('2. Enable "Less secure apps" or use OAuth2');
    console.log('3. Check if port 587 is blocked by firewall');
    console.log('4. Verify SMTP settings with your email provider');
  }
}

testRealEmail();