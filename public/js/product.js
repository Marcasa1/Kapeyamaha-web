const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  category: {
    type: String,
    required: true,
    enum: ['car', 'motorbike', 'vehicle', 'spare-part']
  },
  subcategory: {
    type: String,
    required: function() {
      return this.category === 'spare-part';
    }
  },
  brand: {
    type: String,
    enum: ['Toyota', 'Yamaha', 'Hino', 'Other']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  discountedPrice: {
    type: Number,
    min: 0
  },
  description: {
    type: String,
    required: true
  },
  specifications: {
    type: Map,
    of: String
  },
  features: [String],
  compatibility: [String],
  images: [{
    url: String,
    alt: String,
    isPrimary: Boolean
  }],
  stock: {
    type: Number,
    default: 1,
    min: 0
  },
  sku: {
    type: String,
    unique: true,
    sparse: true
  },
  warranty: {
    duration: String,
    terms: String
  },
  shipping: {
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    cost: Number
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  metaTitle: String,
  metaDescription: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for faster queries
productSchema.index({ category: 1, subcategory: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ price: 1 });
productSchema.index({ isFeatured: 1 });

module.exports = mongoose.model('Product', productSchema);