const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: String,
    sku: String,
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    },
    image: String
  }],
  
  shippingAddress: {
    name: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String
  },
  
  billingAddress: {
    sameAsShipping: {
      type: Boolean,
      default: true
    },
    name: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String
  },
  
  paymentMethod: {
    type: String,
    enum: ['paypal', 'stripe', 'bank-transfer', 'mpesa', 'cash-on-delivery'],
    required: true
  },
  
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  
  paymentDetails: {
    transactionId: String,
    payerId: String,
    payerEmail: String,
    paymentDate: Date,
    amount: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  
  shippingMethod: {
    type: String,
    enum: ['standard', 'express', 'pickup'],
    default: 'standard'
  },
  
  shippingCost: {
    type: Number,
    default: 0
  },
  
  taxAmount: {
    type: Number,
    default: 0
  },
  
  subtotal: {
    type: Number,
    required: true
  },
  
  totalAmount: {
    type: Number,
    required: true
  },
  
  currency: {
    type: String,
    default: 'USD'
  },
  
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  
  statusHistory: [{
    status: String,
    date: {
      type: Date,
      default: Date.now
    },
    note: String
  }],
  
  notes: String,
  
  estimatedDelivery: Date,
  
  deliveredAt: Date,
  
  trackingNumber: String,
  
  invoiceUrl: String,
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Generate order number before saving
orderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(1000 + Math.random() * 9000);
    this.orderNumber = `ORD-${year}${month}${day}-${random}`;
  }
  
  // Add initial status to history
  if (this.isNew) {
    this.statusHistory.push({
      status: this.status,
      note: 'Order created'
    });
  }
  
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Order', orderSchema);