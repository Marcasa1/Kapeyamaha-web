const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  console.log('🔍 Testing MongoDB Atlas connection...');
  
  const uri = process.env.MONGODB_URI;
  console.log('URI (masked):', uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@'));
  
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });
    
    console.log('✅ SUCCESS: Connected to MongoDB Atlas!');
    console.log('   Database:', mongoose.connection.name);
    console.log('   Host:', mongoose.connection.host);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ FAILED: Connection error:', error.message);
    
    if (error.name === 'MongoServerSelectionError') {
      console.log('\n💡 Likely causes:');
      console.log('   - IP address not whitelisted in MongoDB Atlas');
      console.log('   - Wrong username/password');
      console.log('   - Cluster is paused or not running');
    }
    
    process.exit(1);
  }
}

testConnection();
