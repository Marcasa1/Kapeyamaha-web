const jwt = require('jsonwebtoken');

exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token provided'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_change_this');
    
    // Add user ID to request
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token failed'
    });
  }
};

exports.admin = async (req, res, next) => {
  try {
    // This middleware assumes protect middleware has already run
    // You need to fetch user from database to check role
    const User = require('../models/User.model');
    const user = await User.findById(req.userId);

    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized as admin'
      });
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};