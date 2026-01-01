const nodemailer = require('nodemailer');

async function testEmail() {
  try {
    console.log('Testing nodemailer v' + nodemailer.version);
    
    // Generate a test account (Ethereal - for testing only)
    let testAccount = await nodemailer.createTestAccount();
    
    console.log('Test account created:', testAccount.user);
    
    // Create transporter
    let transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });

    // Send test email
    let info = await transporter.sendMail({
      from: '"Nodemailer Test" <test@example.com>',
      to: 'test@example.com',
      subject: 'Test Email',
      text: 'Hello from nodemailer v7!',
      html: '<b>Hello from nodemailer v7!</b>'
    });

    console.log('✅ Email test successful!');
    console.log('Message ID:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    console.error('Full error:', error);
  }
}

testEmail();