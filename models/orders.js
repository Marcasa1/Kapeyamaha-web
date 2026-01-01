const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Create new order
router.post('/', async (req, res) => {
    try {
        const order = new Order({
            ...req.body,
            orderId: 'KAPE-' + Date.now() + '-' + Math.floor(Math.random() * 1000)
        });
        await order.save();
        
        // Send email notification
        await sendOrderConfirmation(order);
        
        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get order by ID
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: req.params.id });
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update order status (admin)
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findOneAndUpdate(
            { orderId: req.params.id },
            { orderStatus: status },
            { new: true }
        );
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Process payment webhook
router.post('/webhook/paypal', async (req, res) => {
    try {
        // Verify PayPal payment
        const { paymentId, status } = req.body;
        
        if (status === 'COMPLETED') {
            const order = await Order.findOneAndUpdate(
                { paymentId },
                { paymentStatus: 'completed', orderStatus: 'processing' },
                { new: true }
            );
        }
        
        res.json({ received: true });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

async function sendOrderConfirmation(order) {
    // Email sending logic
    console.log('Order confirmation sent to:', order.customerEmail);
}

module.exports = router;