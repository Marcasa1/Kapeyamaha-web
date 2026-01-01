const express = require('express');
const router = express.Router();

// ==============================================
// SAMPLE API ROUTES - You can expand these later
// ==============================================

// Test route to verify API is working
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'KAPEYAMAHA API is working!',
        endpoints: {
            products: 'GET /api/products',
            contact: 'POST /api/contact',
            health: 'GET /api/health'
        }
    });
});

// Products route
router.get('/products', (req, res) => {
    res.json({
        success: true,
        data: [
            { id: 1, name: 'Coffee Beans', price: 15.99 },
            { id: 2, name: 'Yamaha Accessories', price: 45.50 },
            { id: 3, name: 'Motorcycle Parts', price: 120.00 }
        ]
    });
});

// Contact form submission
router.post('/contact', (req, res) => {
    const { name, email, message } = req.body;
    
    // Basic validation
    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            message: 'Please provide name, email, and message'
        });
    }
    
    // In a real app, you would save this to a database
    console.log(`📧 Contact form submission: ${name} (${email}) - ${message}`);
    
    res.json({
        success: true,
        message: 'Message received! We will contact you soon.',
        data: { name, email, message }
    });
});

// Health check for API
router.get('/health', (req, res) => {
    res.json({
        status: 'API Healthy',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;