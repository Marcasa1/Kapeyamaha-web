const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  
  sku: {
    type: String,
    unique: true,
    uppercase: true
  },
  
  category: {
    type: String,
    required: true,
    enum: ['car', 'motorbike', 'vehicle', 'spare-part', 'accessory']
  },
  
  brand: {
    type: String,
    required: true,
    enum: ['Toyota', 'Yamaha', 'Hino', 'Other']
  },
  
  model: String,
  year: Number,
  
  description: {
    type: String,
    required: true
  },
  
  features: [String],
  
  images: [{
    url: String,
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  
  price: {
    type: Number,
    required: true,
    min: 0
  },
  
  discount: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  
  warranty: {
    type: String,
    default: '6 months'
  },
  
  isAvailable: {
    type: Boolean,
    default: true
  },
  
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  specifications: mongoose.Schema.Types.Mixed,
  
  compatibility: [String],
  
  tags: [String],
  
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  
  soldCount: {
    type: Number,
    default: 0
  },
  
  viewCount: {
    type: Number,
    default: 0
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Generate SKU before saving
productSchema.pre('save', function(next) {
  if (!this.sku) {
    const prefix = this.brand.substring(0, 3).toUpperCase();
    const random = Math.floor(100000 + Math.random() * 900000);
    this.sku = `${prefix}-${random}`;
  }
  this.updatedAt = Date.now();
  next();
});

// Virtual for discounted price
productSchema.virtual('discountedPrice').get(function() {
  if (this.discount > 0) {
    return this.price * (1 - this.discount / 100);
  }
  return this.price;
});

module.exports = mongoose.model('Product', productSchema);