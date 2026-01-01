const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerAddress: { type: String },
    items: [{
        productId: String,
        name: String,
        price: Number,
        quantity: Number,
        image: String
    }],
    subtotal: { type: Number, required: true },
    shipping: { type: Number, default: 50 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['paypal', 'stripe', 'bank', 'mpesa'], required: true },
    paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    orderStatus: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered'], default: 'pending' },
    paymentId: String,
    shippingTracking: String,
    notes: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);