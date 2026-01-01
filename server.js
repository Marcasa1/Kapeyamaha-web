const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

require('dotenv').config({ path: '.env' });

// Verify environment variables are loaded
console.log('📧 Email Configuration:');
console.log('   Host:', process.env.EMAIL_HOST);
console.log('   User:', process.env.EMAIL_USER);
console.log('   From:', process.env.EMAIL_FROM);
console.log('   Admin:', process.env.ADMIN_EMAIL);
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet({
    contentSecurityPolicy: false,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (must come before routes)
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ==============================================
// ROUTES START HERE
// ==============================================

// Welcome route (added from your code)
app.get('/', (req, res) => {
    // You can choose to serve JSON or render a page
    // Option 1: JSON response (as in your code)
    // res.json({ message: 'Welcome to KapeYamaha API' });
    
    // Option 2: If you have a frontend, redirect to it
    // res.redirect('/index.html');
    
    // Option 3: Render an EJS template
    res.render('index', { 
        title: 'KapeYamaha',
        message: 'Welcome to KapeYamaha API'
    });
});

// Health check endpoint
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
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// ==============================================
// FIXED: SPA catch-all route (for React/Vue/Angular)
// This must be the LAST route in your Express app
// ==============================================
app.get('/*', (req, res, next) => {
    // Check if the request is for an API route
    if (req.path.startsWith('/api')) {
        return next(); // Pass to API routes
    }
    
    // Check if it's a static file request
    if (req.path.includes('.')) {
        return next(); // Let static middleware handle it
    }
    
    // For all other routes, serve the SPA
    console.log(`📄 Serving SPA for path: ${req.path}`);
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ==============================================
// ERROR HANDLER (must come after all routes)
// ==============================================
app.use((err, req, res, next) => {
    console.error('🔥 Error:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// ==============================================
// START SERVER
// ==============================================
app.listen(PORT, () => {
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