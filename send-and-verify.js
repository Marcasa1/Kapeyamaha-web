const axios = require('axios');
const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailTester {
    constructor() {
        this.apiKey = process.env.TESTMAIL_API_KEY;
        this.namespace = process.env.TESTMAIL_NAMESPACE;
        
        if (!this.apiKey || !this.namespace) {
            throw new Error('Missing TESTMAIL_API_KEY or TESTMAIL_NAMESPACE in .env file');
        }
        
        this.testTag = `test-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
        this.testEmail = `${this.testTag}.${this.namespace}@inbox.testmail.app`;
    }
    
    async sendEmail() {
        console.log(`📤 Test Email Address: ${this.testEmail}`);
        console.log(`🏷️  Test Tag: ${this.testTag}\n`);
        
        // Check if we have SMTP credentials
        if (process.env.SMTP_USER && process.env.SMTP_PASS) {
            console.log('📤 Using SMTP to send email...');
            
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST || 'smtp.gmail.com',
                port: process.env.SMTP_PORT || 587,
                secure: false,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                }
            });
            
            try {
                const info = await transporter.sendMail({
                    from: process.env.SMTP_USER,
                    to: this.testEmail,
                    subject: `Test Email - ${this.testTag}`,
                    text: `This is a test email sent at ${new Date().toISOString()}\nTag: ${this.testTag}`,
                    html: `
                        <h1>Test Email</h1>
                        <p>This is a test email sent at ${new Date().toISOString()}</p>
                        <p><strong>Tag:</strong> ${this.testTag}</p>
                        <p>This email was sent via GitHub Actions test.</p>
                    `
                });
                
                console.log('✅ Email sent successfully via SMTP');
                console.log(`📫 Message ID: ${info.messageId}`);
                return true;
            } catch (error) {
                console.error('❌ SMTP failed:', error.message);
                console.log('\n⚠️  Continuing without sending email automatically...');
            }
        } else {
            console.log('ℹ️  No SMTP credentials found in .env file.');
            console.log('\n👉 To test sending, you can:');
            console.log('   1. Add SMTP credentials to .env file');
            console.log('   2. Or manually send an email to the address above');
            console.log(`   Subject: "Test Email - ${this.testTag}"`);
            console.log('\n⏳ Waiting 30 seconds for manual email sending...');
            await new Promise(resolve => setTimeout(resolve, 30000));
        }
        
        return true;
    }
    
    async verifyEmailReceived(maxAttempts = 12, delay = 5000) {
        console.log('\n🔍 Verifying email delivery via Testmail API...');
        
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                const response = await axios.get('https://api.testmail.app/api/json', {
                    params: {
                        apikey: this.apiKey,
                        namespace: this.namespace,
                        tag: this.testTag
                    },
                    timeout: 10000
                });
                
                if (response.data.emails && response.data.emails.length > 0) {
                    const email = response.data.emails[0];
                    console.log('\n✅ Email received successfully!');
                    console.log(`📨 Subject: ${email.subject}`);
                    console.log(`📧 From: ${email.from}`);
                    console.log(`🕐 Received: ${new Date(email.timestamp).toLocaleTimeString()}`);
                    console.log(`📊 Size: ${email.size} bytes`);
                    return {
                        success: true,
                        email: email
                    };
                }
                
                console.log(`⏳ Waiting for email... (attempt ${attempt}/${maxAttempts})`);
                await new Promise(resolve => setTimeout(resolve, delay));
                
            } catch (error) {
                console.error(`   API error on attempt ${attempt}: ${error.message}`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
        
        console.log('❌ Email not received within timeout period');
        return { success: false };
    }
    
    async runFullTest() {
        console.log('🚀 Starting full email test with Testmail\n');
        
        // Step 1: Send email
        console.log('1. Setting up test email...');
        const sendSuccess = await this.sendEmail();
        
        if (!sendSuccess) {
            return { 
                success: false, 
                message: 'Failed to send email',
                testEmail: this.testEmail,
                tag: this.testTag
            };
        }
        
        // Step 2: Verify receipt
        console.log('\n2. Checking Testmail inbox...');
        const verification = await this.verifyEmailReceived();
        
        const result = {
            success: verification.success,
            testEmail: this.testEmail,
            tag: this.testTag,
            timestamp: new Date().toISOString(),
            details: verification.email || null
        };
        
        console.log('\n📋 Test Summary:');
        console.log(JSON.stringify(result, null, 2));
        
        return result;
    }
}

// Run if called directly
if (require.main === module) {
    const tester = new EmailTester();
    
    tester.runFullTest()
        .then(result => {
            console.log(`\n${result.success ? '🎉 Email test PASSED!' : '💥 Email test FAILED!'}`);
            process.exit(result.success ? 0 : 1);
        })
        .catch(error => {
            console.error('❌ Unhandled error:', error.message);
            process.exit(1);
        });
}

module.exports = EmailTester;