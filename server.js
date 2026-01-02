const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

// Verify environment variables are loaded
console.log('📧 Email Configuration:');
console.log('   Host:', process.env.EMAIL_HOST || 'Not set');
console.log('   User:', process.env.EMAIL_USER || 'Not set');
console.log('   From:', process.env.EMAIL_FROM || 'Not set');
console.log('   Admin:', process.env.ADMIN_EMAIL || 'Not set');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(helmet({
    contentSecurityPolicy: false,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', (req, res) => {
    res.render('index', { 
        title: 'KapeYamaha',
        message: 'Welcome to KapeYamaha API'
    });
});

app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        server: 'KAPEYAMAHA BACKEND',
        port: PORT,
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// Import API routes
try {
    const apiRoutes = require('./routes/api');
    app.use('/api', apiRoutes);
    console.log('✅ API routes loaded');
} catch (error) {
    console.log('⚠️  No API routes found, continuing without them');
}

// SPA catch-all route
app.get('/*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
        return next();
    }
    
    if (req.path.includes('.')) {
        return next();
    }
    
    console.log(`📄 Serving SPA for path: ${req.path}`);
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handler
app.use((err, req, res, next) => {
    console.error('🔥 Error:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint not found'
    });
});

// Start server
const server = app.listen(PORT, () => {
    console.log(`
    🚀 KAPEYAMAHA BACKEND RUNNING
    =============================
    📌 Port: ${PORT}
    📅 ${new Date().toLocaleString()}
    🌐 Environment: ${process.env.NODE_ENV || 'Development'}
    
    🌐 Available Endpoints:
       → http://localhost:${PORT}/ (Welcome Page)
       → http://localhost:${PORT}/health (Health Check)
       → http://localhost:${PORT}/api/products (Products API)
       → http://localhost:${PORT}/api/contact (Contact Form)
    
    📁 Static files served from: ${path.join(__dirname, 'public')}
    
    📞 Contact: +254 758 772 539
    📧 Email: kapeyamaha@gmail.com
    
    ⚡ Press Ctrl+C to stop
    `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down gracefully...');
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
});

