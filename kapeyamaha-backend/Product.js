const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  
  sku: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  
  category: {
    type: String,
    required: true,
    enum: ['car', 'motorbike', 'vehicle', 'spare-part', 'accessory']
  },
  
  subcategory: {
    type: String,
    required: function() {
      return this.category === 'spare-part';
    }
  },
  
  brand: {
    type: String,
    required: true,
    enum: ['Toyota', 'Yamaha', 'Hino', 'Other']
  },
  
  model: {
    type: String,
    required: true
  },
  
  year: {
    type: Number,
    min: [1990, 'Year must be at least 1990'],
    max: [new Date().getFullYear() + 1, 'Year cannot be in the future']
  },
  
  description: {
    type: String,
    required: [true, 'Please provide product description']
  },
  
  detailedDescription: String,
  
  features: [{
    type: String
  }],
  
  specifications: {
    engine: String,
    power: String,
    torque: String,
    transmission: String,
    fuelType: String,
    seatingCapacity: Number,
    cargoCapacity: String,
    weight: String,
    dimensions: String
  },
  
  compatibility: [{
    type: String
  }],
  
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
    required: [true, 'Please provide product price'],
    min: [0, 'Price must be positive']
  },
  
  originalPrice: Number,
  
  discount: {
    type: Number,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%']
  },
  
  stock: {
    type: Number,
    required: [true, 'Please provide stock quantity'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  
  minOrderQuantity: {
    type: Number,
    default: 1
  },
  
  maxOrderQuantity: {
    type: Number,
    default: 10
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
  
  tags: [{
    type: String
  }],
  
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
  
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  soldCount: {
    type: Number,
    default: 0
  },
  
  viewCount: {
    type: Number,
    default: 0
  },
  
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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
  if (this.discount && this.discount > 0) {
    return this.price - (this.price * this.discount / 100);
  }
  return this.price;
});

module.exports = mongoose.model('Product', productSchema);