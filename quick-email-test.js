const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendTestEmail() {
  console.log('📧 Preparing to send test email...');
  console.log('Using configuration:');
  console.log(`  Host: ${process.env.EMAIL_HOST}`);
  console.log(`  Port: ${process.env.EMAIL_PORT}`);
  console.log(`  User: ${process.env.EMAIL_USER}`);
  console.log(`  From: ${process.env.EMAIL_FROM}`);
  
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify connection
    console.log('\n🔍 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified!');

    // Send test email
    console.log('\n📤 Sending test email...');
    const info = await transporter.sendMail({
      from: `"Kapeyamaha Test" <${process.env.EMAIL_FROM}>`,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: '✅ Test Email from Kapeyamaha Backend',
      text: 'This is a test email sent from your Kapeyamaha backend server.',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #2c3e50;">✅ Test Email Successful!</h2>
          <p>This is a test email sent from your Kapeyamaha backend server.</p>
          <p>If you're receiving this, your email configuration is working correctly!</p>
          <hr>
          <p><small>Sent at: ${new Date().toString()}</small></p>
        </div>
      `,
    });

    console.log('✅ Email sent successfully!');
    console.log(`📨 Message ID: ${info.messageId}`);
    console.log(`📬 Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    
  } catch (error) {
    console.error('❌ Error sending email:');
    console.error(error.message);
    
    if (error.code === 'EAUTH') {
      console.log('\n🔑 Authentication failed! Possible issues:');
      console.log('1. App Password might be incorrect');
      console.log('2. 2-Step Verification might not be enabled');
      console.log('3. Allow less secure apps might need to be enabled (not recommended)');
      console.log('\n📋 Solution: Generate a new App Password at:');
      console.log('https://myaccount.google.com/apppasswords');
    } else if (error.code === 'ECONNECTION') {
      console.log('\n🔌 Connection failed! Check:');
      console.log('1. Internet connection');
      console.log('2. Firewall settings');
      console.log('3. SMTP host/port settings');
    }
  }
}

// Run the test
sendTestEmail();