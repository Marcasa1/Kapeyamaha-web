const mongoose = require('mongoose');
require('dotenv').config();

async function testMongoDB() {
  console.log('🧪 Testing MongoDB Atlas Connection...\n');
  
  const uri = process.env.MONGODB_URI;
  console.log('📦 Using connection string (masked):');
  console.log(uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@'));
  
  console.log('\n🔧 Mongoose version:', mongoose.version);
  
  try {
    console.log('\n⏳ Attempting connection...');
    
    // Set a timeout for the connection attempt
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Connection timeout after 10 seconds')), 10000);
    });
    
    const connectionPromise = mongoose.connect(uri);
    
    // Race between connection and timeout
    await Promise.race([connectionPromise, timeoutPromise]);
    
    console.log('\n✅ SUCCESS: Connected to MongoDB Atlas!');
    console.log('   Host:', mongoose.connection.host);
    console.log('   Database:', mongoose.connection.name);
    console.log('   State:', mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected');
    
    // List collections to verify access
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`   Collections: ${collections.length} found`);
    
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected.');
    
  } catch (error) {
    console.error('\n❌ FAILED:', error.name);
    console.error('   Message:', error.message);
    
    // Detailed error analysis
    if (error.name === 'MongoServerSelectionError') {
      console.log('\n💡 This error typically means:');
      console.log('   1. Your IP is not whitelisted in MongoDB Atlas');
      console.log('   2. The cluster is paused');
      console.log('   3. Network/firewall issue');
      console.log('\n🔧 Fix: Go to MongoDB Atlas → Network Access → Add IP Address');
    }
    
    if (error.message.includes('authentication')) {
      console.log('\n💡 Authentication failed:');
      console.log('   - Check username and password');
      console.log('   - Make sure user exists in MongoDB Atlas');
    }
  }
  
  process.exit();
}

testMongoDB();
