const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  
  phone: {
    type: String,
    required: [true, 'Please provide your phone number'],
    match: [/^[0-9\+\-\s]+$/, 'Please provide a valid phone number']
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
  
  verificationToken: String,
  verificationTokenExpire: Date,
  
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  
  lastLogin: Date,
  loginHistory: [{
    date: Date,
    ip: String,
    device: String
  }],
  
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

// Encrypt password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.updatedAt = Date.now();
});

// Sign JWT token
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Match password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate verification token
userSchema.methods.getVerificationToken = function() {
  const verificationToken = crypto.randomBytes(20).toString('hex');
  
  // Hash token and set to verificationToken field
  this.verificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
  
  // Set expire to 1 hour
  this.verificationTokenExpire = Date.now() + 60 * 60 * 1000;
  
  return verificationToken;
};

// Generate password reset token
userSchema.methods.getResetPasswordToken = function() {
  const resetToken = crypto.randomBytes(20).toString('hex');
  
  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  // Set expire to 10 minutes
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  
  return resetToken;
};

module.exports = mongoose.model('User', userSchema);