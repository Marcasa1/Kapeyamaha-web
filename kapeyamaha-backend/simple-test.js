// simple-test.js
const { MongoClient } = require('mongodb');
require('dotenv').config();

async function test() {
  console.log('Testing MongoDB Atlas connection...\n');
  
  // Get the URI from .env
  const uri = process.env.MONGODB_URI;
  
  console.log('Connection string (masked):');
  console.log(uri.replace(/:\/\/[^:]+:[^@]+@/, '://****:****@'));
  
  const client = new MongoClient(uri);
  
  try {
    console.log('\n⏳ Connecting...');
    await client.connect();
    
    console.log('✅ Connected successfully!');
    
    // List databases to verify
    const databases = await client.db().admin().listDatabases();
    console.log(`\n📊 Found ${databases.databases.length} databases:`);
    databases.databases.forEach(db => {
      console.log(`   - ${db.name}`);
    });
    
  } catch (error) {
    console.error('\n❌ Connection failed:', error.message);
    
    if (error.message.includes('Authentication failed')) {
      console.log('\n🔧 TROUBLESHOOTING STEPS:');
      console.log('1. Verify the password for kapeyamaha-admin user');
      console.log('2. Check if user exists in MongoDB Atlas');
      console.log('3. Make sure user has database access permissions');
      console.log('4. Your IP might need to be whitelisted in Network Access');
    }
    
  } finally {
    await client.close();
    console.log('\n🔌 Connection closed');
  }
}

test();