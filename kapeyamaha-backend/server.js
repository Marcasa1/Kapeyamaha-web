const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 KAPEYAMAHA Backend API',
    status: 'running',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    mongoState: mongoose.connection.readyState,
    version: '1.0.0'
  });
});

// Database connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    console.log('🔍 Attempting MongoDB Atlas connection...');
    
    if (!mongoURI) {
      console.log('❌ MONGODB_URI is not defined in .env file');
      return null;
    }
    
    // Mask the password in logs for security
    const maskedURI = mongoURI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
    console.log(`📦 Connection string: ${maskedURI}`);
    
    // Connect to MongoDB - Simplified for Mongoose 9+
    console.log('⏳ Connecting...');
    const conn = await mongoose.connect(mongoURI);
    
    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    
    // Test the connection with a simple operation
    const collections = await conn.connection.db.listCollections().toArray();
    console.log(`   Collections: ${collections.length} collections found`);
    
    return conn;
    
  } catch (error) {
    console.error(`\n❌ MongoDB Connection Failed!`);
    console.error(`   Error Name: ${error.name}`);
    console.error(`   Error Message: ${error.message}`);
    
    // Provide specific troubleshooting based on error type
    if (error.name === 'MongoServerSelectionError') {
      console.log('\n🔧 This usually means:');
      console.log('   1. Your IP address is not whitelisted in MongoDB Atlas');
      console.log('   2. The cluster is paused or not running');
      console.log('   3. Network/firewall issues');
      console.log('\n💡 Solution:');
      console.log('   - Go to MongoDB Atlas → Network Access');
      console.log('   - Add your IP address or use 0.0.0.0/0 temporarily');
    }
    
    if (error.message.includes('Authentication failed')) {
      console.log('\n🔧 Authentication failed:');
      console.log('   - Check username: marcusekidor_db_user');
      console.log('   - Check password: db_Marcasa100 (no brackets)');
      console.log('   - Verify the user exists in MongoDB Atlas');
    }
    
    if (error.message.includes('ENOTFOUND')) {
      console.log('\n🔧 DNS resolution failed:');
      console.log('   - Check your internet connection');
      console.log('   - The hostname might be incorrect');
    }
    
    return null;
  }
};

// Health endpoint
app.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  
  res.json({
    status: 'healthy',
    server: 'running',
    database: states[dbState] || 'unknown',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Database status endpoint
app.get('/api/db-status', (req, res) => {
  const state = mongoose.connection.readyState;
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  
  res.json({
    success: state === 1,
    state: states[state],
    message: state === 1 ? 'Database connected' : 'Database not connected',
    code: state
  });
});

// Start server
const startServer = async () => {
  console.log('🚀 Starting KAPEYAMAHA Backend Server...');
  console.log(`📁 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔧 Port: ${process.env.PORT || 3000}`);
  console.log(`📦 Mongoose version: ${mongoose.version}`);
  
  // Connect to database
  const dbConnection = await connectDB();
  
  const PORT = process.env.PORT || 3000;
  const HOST = '0.0.0.0';
  
  app.listen(PORT, HOST, () => {
    console.log(`\n✅ Server running on http://${HOST}:${PORT}`);
    console.log(`📊 MongoDB Status: ${mongoose.connection.readyState === 1 ? '✅ Connected' : '❌ Disconnected'}`);
    
    console.log(`\n👉 Test endpoints:`);
    console.log(`   Home:       curl http://localhost:${PORT}/`);
    console.log(`   Health:     curl http://localhost:${PORT}/health`);
    console.log(`   DB Status:  curl http://localhost:${PORT}/api/db-status`);
    console.log(`\n⚡ Ready for development!`);
  });
};

// Start the server
startServer();

module.exports = app;