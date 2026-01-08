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
    mongoState: mongoose.connection.readyState
  });
});

// Database connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    console.log('🔍 Attempting MongoDB Atlas connection...');
    
    if (!mongoURI) {
      console.log('❌ MONGODB_URI is not defined in .env file');
      return;
    }
    
    // Mask the password in logs for security
    const maskedURI = mongoURI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
    console.log(`📦 Connection string: ${maskedURI}`);
    
    // Connect to MongoDB - Simplified for Mongoose 9+
    const conn = await mongoose.connect(mongoURI);
    
    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    console.log(`   Port: ${conn.connection.port}`);
    
    // Connection event handlers
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected');
    });
    
    return conn;
    
  } catch (error) {
    console.error(`❌ MongoDB Connection Failed!`);
    console.error(`   Error: ${error.message}`);
    
    console.log('\n🔧 Troubleshooting Steps:');
    console.log('1. Check MongoDB Atlas dashboard to ensure cluster is running');
    console.log('2. Verify your IP is whitelisted in Atlas Network Access');
    console.log('3. Check if username/password is correct');
    console.log('4. Try connecting with MongoDB Compass to verify credentials');
    
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
  
  // Connect to database
  const dbConnection = await connectDB();
  
  const PORT = process.env.PORT || 3000;
  const HOST = '0.0.0.0';
  
  app.listen(PORT, HOST, () => {
    console.log(`\n✅ Server running on http://${HOST}:${PORT}`);
    console.log(`📊 MongoDB Status: ${mongoose.connection.readyState === 1 ? '✅ Connected' : '❌ Disconnected'}`);
    
    if (dbConnection) {
      console.log(`📦 Database: ${dbConnection.connection.name}`);
    }
    
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
