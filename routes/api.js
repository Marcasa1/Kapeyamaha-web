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
            orders: 'POST /api/orders',
            health: 'GET /api/health'
        }
    });
});

// Enhanced Products route with filtering
router.get('/products', async (req, res) => {
    try {
        const { category, featured } = req.query;
        
        // Sample products data (you would normally get this from a database)
        const products = {
            motorbikes: [
                { id: 1, name: 'Yamaha R15', category: 'motorbike', price: 12000, featured: true },
                { id: 2, name: 'Yamaha MT-15', category: 'motorbike', price: 11500, featured: true },
                { id: 3, name: 'Yamaha FZ', category: 'motorbike', price: 9500, featured: false }
            ],
            cars: [
                { id: 4, name: 'Toyota Premio', category: 'car', price: 15000, featured: true },
                { id: 5, name: 'Toyota Fielder', category: 'car', price: 14000, featured: false }
            ],
            vehicles: [
                { id: 6, name: 'Isuzu Truck', category: 'vehicle', price: 35000, featured: true },
                { id: 7, name: 'Mitsubishi Canter', category: 'vehicle', price: 32000, featured: false }
            ],
            parts: [
                { id: 8, name: 'Yamaha Oil Filter', category: 'part', price: 25, featured: true },
                { id: 9, name: 'Brake Pads', category: 'part', price: 45, featured: true }
            ]
        };

        let filteredProducts = [];
        
        // Filter by category if provided
        if (category) {
            if (category === 'motorbike') filteredProducts = products.motorbikes;
            else if (category === 'car') filteredProducts = products.cars;
            else if (category === 'vehicle') filteredProducts = products.vehicles;
            else if (category === 'part') filteredProducts = products.parts;
            else {
                // If category doesn't match, return all products
                filteredProducts = [
                    ...products.motorbikes,
                    ...products.cars,
                    ...products.vehicles,
                    ...products.parts
                ];
            }
        } else {
            // No category specified, return all products
            filteredProducts = [
                ...products.motorbikes,
                ...products.cars,
                ...products.vehicles,
                ...products.parts
            ];
        }
        
        // Filter by featured if specified
        if (featured === 'true') {
            filteredProducts = filteredProducts.filter(product => product.featured === true);
        }
        
        res.json({ success: true, products: filteredProducts });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
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

// Order endpoint
router.post('/orders', async (req, res) => {
    try {
        const order = req.body;
        
        // Basic validation
        if (!order.customer || !order.items || order.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide customer information and at least one item'
            });
        }
        
        // In a real app, you would save this to a database
        console.log('📦 New order received:', order);
        
        // Generate order ID
        const orderId = `KYP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // Send order confirmation email (you would implement this)
        // await sendOrderConfirmationEmail(order, orderId);
        
        res.json({
            success: true,
            message: 'Order placed successfully',
            orderId: orderId,
            data: order
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Health check for API
router.get('/health', (req, res) => {
    res.json({
        status: 'API Healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

module.exports = router;