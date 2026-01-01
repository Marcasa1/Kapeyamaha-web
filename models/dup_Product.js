const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: { 
        type: String, 
        required: true, 
        unique: true 
    },
    name: { 
        type: String, 
        required: [true, 'Product name is required'] 
    },
    category: { 
        type: String, 
        required: [true, 'Category is required'],
        enum: ['motorbike', 'car', 'vehicle', 'engine', 'brake', 'electrical', 'suspension', 'body', 'fluid', 'accessory', 'part']
    },
    subcategory: { 
        type: String 
    },
    price: { 
        type: Number, 
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    description: { 
        type: String, 
        required: [true, 'Description is required'] 
    },
    features: [{ 
        type: String 
    }],
    image: { 
        type: String, 
        required: [true, 'Image path is required'],
        // Remove URL validation to allow relative paths
        validate: {
            validator: function(v) {
                // Allow both relative paths and URLs
                return typeof v === 'string' && v.length > 0;
            },
            message: 'Image must be a string'
        }
    },
    specs: { 
        type: Map, 
        of: mongoose.Schema.Types.Mixed 
    },
    compatibility: [{ 
        type: String 
    }],
    stock: { 
        type: Number, 
        default: 10,
        min: [0, 'Stock cannot be negative']
    },
    isFeatured: { 
        type: Boolean, 
        default: false 
    },
    brand: {
        type: String,
        enum: ['Toyota', 'Yamaha', 'Hino', 'Generic']
    },
    model: {
        type: String
    },
    year: {
        type: Number
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

// Update the updatedAt field on save
productSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Product', productSchema);