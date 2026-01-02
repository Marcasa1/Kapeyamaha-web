const axios = require('axios');
require('dotenv').config();

async function testTestmailAPI() {
    console.log('🔍 Testing Testmail API...\n');
    
    const apiKey = process.env.TESTMAIL_API_KEY;
    const namespace = process.env.TESTMAIL_NAMESPACE;
    
    if (!apiKey || !namespace) {
        console.error('❌ Missing Testmail credentials in .env file');
        console.log('Add these to your .env file:');
        console.log('TESTMAIL_API_KEY=your_api_key');
        console.log('TESTMAIL_NAMESPACE=your_namespace');
        return false;
    }
    
    try {
        const response = await axios.get('https://api.testmail.app/api/json', {
            params: {
                apikey: apiKey,
                namespace: namespace,
                pretty: true
            }
        });
        
        console.log('✅ Testmail API is working!');
        console.log(`📧 Emails in inbox: ${response.data.count}`);
        console.log(`👤 Account: ${response.data.account}`);
        
        if (response.data.emails && response.data.emails.length > 0) {
            console.log('\n📨 Recent emails:');
            response.data.emails.slice(0, 3).forEach((email, i) => {
                console.log(`  ${i+1}. ${email.subject} (${new Date(email.timestamp).toLocaleTimeString()})`);
            });
        }
        
        return true;
    } catch (error) {
        console.error('❌ Testmail API failed:', error.message);
        return false;
    }
}

// Run if called directly
if (require.main === module) {
    testTestmailAPI()
        .then(success => {
            process.exit(success ? 0 : 1);
        })
        .catch(error => {
            console.error('Error:', error);
            process.exit(1);
        });
}

module.exports = testTestmailAPI;