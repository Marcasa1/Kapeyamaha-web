const nodemailer = require('nodemailer');

async function testEmail() {
  try {
    console.log('Testing nodemailer v' + nodemailer.version);
    
    let testAccount = await nodemailer.createTestAccount();
    
    console.log('Test account created:', testAccount.user);
    
    let transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });

    let info = await transporter.sendMail({
      from: '"Nodemailer Test" <test@example.com>',
      to: 'test@example.com',
      subject: 'Test Email',
      text: 'Hello from nodemailer v7!',
      html: '<b>Hello from nodemailer v7!</b>'
    });

    console.log(' Email test successful!');
    console.log('Message ID:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    
  } catch (error) {
    console.error(' Email test failed:', error.message);
  }
}

testEmail();