const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000; // Using 4000 to avoid conflicts

console.log('🚀 Starting KapeYamaha Server...');
console.log(`📡 Port: ${PORT}`);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Basic route
app.get('/', (req, res) => {
    res.json({
        message: 'KapeYamaha Motorcycles API',
        status: 'running',
        endpoints: ['/health', '/api/contact']
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

// Simple contact endpoint
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    console.log(`📨 Contact form: ${name} <${email}>: ${message}`);
    
    res.json({
        success: true,
        message: 'Message received!'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`
    ===================================
    🏍️  KAPEYAMAHA SERVER RUNNING
    ===================================
    🔗 http://localhost:${PORT}
    ⏰ ${new Date().toLocaleTimeString()}
    ===================================
    `);
});
