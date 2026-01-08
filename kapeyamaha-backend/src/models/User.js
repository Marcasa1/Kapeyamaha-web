const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  
  role: {
    type: String,
    enum: ['user', 'admin', 'staff'],
    default: 'user'
  },
  
  address: {
    street: String,
    city: String,
    state: String,
    country: {
      type: String,
      default: 'Kenya'
    },
    postalCode: String
  },
  
  avatar: {
    type: String,
    default: 'https://ui-avatars.com/api/?name=User&background=4A90E2&color=fff'
  },
  
  isVerified: {
    type: Boolean,
    default: false
  },
  
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.updatedAt = Date.now();
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);