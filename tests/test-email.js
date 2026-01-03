// test-email.js
require('dotenv').config();
const emailConfig = require('./config/email');
const emailService = require('./services/emailService');

async function testEmailSystem() {
    console.log('🔧 Testing email configuration...');
    
    // Test 1: Verify SMTP connection
    const connectionOk = await emailConfig.verifyConnection();
    if (!connectionOk) {
        console.error('Failed to connect to email server');
        process.exit(1);
    }
    
    // Test 2: Send test email
    console.log('📧 Sending test email...');
    const testEmail = process.env.EMAIL_USER; // Send to yourself
    const result = await emailService.sendEmail(
        testEmail,
        'Test Email from Node.js',
        '<h1>Test Successful!</h1><p>Your email configuration is working correctly.</p>',
        'Test Successful! Your email configuration is working correctly.'
    );
    
    if (result.success) {
        console.log('🎉 All tests passed! Check your inbox.');
    } else {
        console.error('Test failed:', result.error);
    }
}

testEmailSystem();