require('dotenv').config();
const emailService = require('./services/emailService');

async function testEmail() {
    console.log('📧 Testing Email Configuration...\n');
    
    const testData = {
        name: 'John Doe',
        email: 'customer@example.com',
        phone: '+254712345678',
        subject: 'Test Vehicle Inquiry',
        message: 'Hello, I would like to test if the email system is working properly. Please confirm you received this message.'
    };

    try {
        console.log('Sending test email...');
        const result = await emailService.sendContactFormEmail(testData);
        
        if (result.success) {
            console.log('✅ Test email sent successfully!');
            console.log('Message ID:', result.messageId);
        } else {
            console.log('❌ Failed to send email:', result.error);
        }
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testEmail();