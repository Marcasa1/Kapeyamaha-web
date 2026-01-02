cat > test-smtp.js << 'EOF'
const nodemailer = require('nodemailer');
require('dotenv').config();

async function testSMTP() {
    console.log('🔍 Testing SMTP Configuration...\n');
    
    // Check required environment variables
    const requiredVars = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASS'];
    const missing = requiredVars.filter(varName => !process.env[varName]);
    
    if (missing.length > 0) {
        console.error('❌ Missing environment variables:', missing.join(', '));
        console.log('\nAdd these to your .env file:');
        console.log('EMAIL_HOST=smtp.gmail.com');
        console.log('EMAIL_PORT=587');
        console.log('EMAIL_USER=your-email@gmail.com');
        console.log('EMAIL_PASS=your-app-password');
        console.log('EMAIL_FROM=your-email@gmail.com');
        return false;
    }
    
    console.log('📧 SMTP Configuration:');
    console.log(`  Host: ${process.env.EMAIL_HOST}`);
    console.log(`  Port: ${process.env.EMAIL_PORT}`);
    console.log(`  User: ${process.env.EMAIL_USER}`);
    console.log(`  From: ${process.env.EMAIL_FROM || process.env.EMAIL_USER}`);
    
    try {
        // Create transporter
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        
        // Test connection
        console.log('\n🔄 Testing SMTP connection...');
        await transporter.verify();
        console.log('✅ SMTP connection successful!');
        
        // Send test email
        console.log('\n📤 Sending test email...');
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to yourself
            subject: 'Test Email from Kape Yamaha',
            text: 'This is a test email to verify SMTP configuration is working.',
            html: `
                <h1>Test Email from Kape Yamaha</h1>
                <p>This email confirms that your SMTP configuration is working correctly.</p>
                <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
                <p><strong>Environment:</strong> ${process.env.NODE_ENV || 'development'}</p>
            `
        });
        
        console.log('✅ Test email sent successfully!');
        console.log(`📫 Message ID: ${info.messageId}`);
        console.log('\n📩 Check your inbox for the test email.');
        
        return true;
    } catch (error) {
        console.error('❌ SMTP test failed:', error.message);
        
        // Provide helpful error messages
        if (error.code === 'EAUTH') {
            console.log('\n🔑 Authentication failed. Check:');
            console.log('1. Your email and password are correct');
            console.log('2. You\'re using an App Password (not your regular password)');
            console.log('3. 2-Step Verification is enabled in Google Account');
        } else if (error.code === 'ECONNECTION') {
            console.log('\n🌐 Connection failed. Check:');
            console.log('1. Internet connection');
            console.log('2. Firewall/antivirus settings');
            console.log('3. SMTP host and port are correct');
        }
        
        return false;
    }
}

// Run if called directly
if (require.main === module) {
    testSMTP()
        .then(success => {
            process.exit(success ? 0 : 1);
        })
        .catch(error => {
            console.error('Error:', error);
            process.exit(1);
        });
}

module.exports = testSMTP;
EOF