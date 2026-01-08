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
    mongoState: mongoose.connection.readyState // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  });
});

// Database connection with detailed logging
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    console.log('🔍 Attempting MongoDB connection...');
    
    if (!mongoURI) {
      console.log('❌ MONGODB_URI is not defined in .env file');
      return;
    }
    
    // Mask the password in logs for security
    const maskedURI = mongoURI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
    console.log(`📦 Using URI: ${maskedURI}`);
    
    // Set mongoose options
    mongoose.set('strictQuery', true);
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
    });
    
    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    console.log(`   State: ${conn.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
    
  } catch (error) {
    console.error(`❌ MongoDB Connection Failed!`);
    console.error(`   Error: ${error.message}`);
    console.log('\n🔧 Troubleshooting Steps:');
    console.log('   1. Check if password in .env is correct (without < > brackets)');
    console.log('   2. Verify MongoDB Atlas cluster is running');
    console.log('   3. Check if your IP is whitelisted in Atlas Network Access');
    console.log('   4. Check internet connection');
    console.log('   5. Try the connection string in MongoDB Compass to verify');
  }
};

// Health endpoint with DB status
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const statusMap = {
    0: 'disconnected',
    1: 'connected', 
    2: 'connecting',
    3: 'disconnecting'
  };
  
  res.json({
    status: 'healthy',
    server: 'running',
    database: statusMap[dbStatus] || 'unknown',
    timestamp: new Date().toISOString()
  });
});

// Test database endpoint
app.get('/api/db-status', (req, res) => {
  const state = mongoose.connection.readyState;
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  
  res.json({
    success: state === 1,
    state: states[state] || 'unknown',
    connection: state === 1 ? '✅ Connected' : '❌ Disconnected',
    database: mongoose.connection.name || 'Not connected'
  });
});

// Start server
const startServer = async () => {
  console.log('🚀 Starting KAPEYAMAHA Backend Server...');
  console.log(`📁 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔧 Port: ${process.env.PORT || 3000}`);
  
  // Connect to database
  await connectDB();
  
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

startServer();

module.exports = app;