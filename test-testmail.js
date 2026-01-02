const axios = require('axios');
require('dotenv').config();

const TESTMAIL_API_KEY = process.env.TESTMAIL_API_KEY;
const TESTMAIL_NAMESPACE = process.env.TESTMAIL_NAMESPACE;

async function testTestmailConnection() {
    console.log('🔍 Testing Testmail API connection...');
    
    if (!TESTMAIL_API_KEY || !TESTMAIL_NAMESPACE) {
        console.error('❌ Missing Testmail API credentials.');
        console.log('Please set TESTMAIL_API_KEY and TESTMAIL_NAMESPACE in .env file');
        return false;
    }
    
    try {
        const response = await axios.get('https://api.testmail.app/api/json', {
            params: {
                apikey: TESTMAIL_API_KEY,
                namespace: TESTMAIL_NAMESPACE,
                pretty: true,
                limit: 5
            },
            timeout: 10000
        });
        
        console.log('✅ Testmail API is working!');
        console.log(`📧 Emails in inbox: ${response.data.count}`);
        console.log(`👤 Account: ${response.data.account}`);
        
        // Show recent emails if any
        if (response.data.emails && response.data.emails.length > 0) {
            console.log('\n📨 Recent emails:');
            response.data.emails.slice(0, 3).forEach((email, index) => {
                console.log(`  ${index + 1}. ${email.subject} - ${new Date(email.timestamp).toLocaleTimeString()}`);
            });
        }
        
        return true;
    } catch (error) {
        console.error('❌ Testmail API connection failed:');
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            if (error.response.status === 401) {
                console.error('API Key is invalid. Please check your Testmail credentials.');
            }
        } else if (error.code === 'ENOTFOUND') {
            console.error('Network error. Check your internet connection.');
        } else {
            console.error(error.message);
        }
        return false;
    }
}

// Run test
if (require.main === module) {
    testTestmailConnection()
        .then(success => {
            process.exit(success ? 0 : 1);
        })
        .catch(error => {
            console.error('Unexpected error:', error);
            process.exit(1);
        });
}

module.exports = { testTestmailConnection };