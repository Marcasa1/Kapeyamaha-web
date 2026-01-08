const User = require('../models/User');

// @desc    Get user dashboard data
// @route   GET /api/users/dashboard
// @access  Private
exports.getDashboard = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate({
        path: 'favorites',
        select: 'name price images'
      });
    
    // Get user orders
    const Order = require('../models/Order');
    const orders = await Order.find({ user: req.user.id })
      .sort('-createdAt')
      .limit(5);
    
    // Calculate stats
    const totalOrders = await Order.countDocuments({ user: req.user.id });
    const totalSpent = await Order.aggregate([
      { $match: { user: req.user.id, paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    const dashboardData = {
      user,
      stats: {
        totalOrders,
        totalSpent: totalSpent[0]?.total || 0,
        lastLogin: user.lastLogin,
        joined: user.createdAt
      },
      recentOrders: orders,
      favorites: user.favorites
    };
    
    res.status(200).json({
      success: true,
      data: dashboardData
    });
    
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const updateData = {
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address
    };
    
    // Remove undefined fields
    Object.keys(updateData).forEach(key => 
      updateData[key] === undefined && delete updateData[key]
    );
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');
    
    res.status(200).json({
      success: true,
      data: user
    });
    
  } catch (error) {
    next(error);
  }
};

// @desc    Update user avatar
// @route   PUT /api/users/avatar
// @access  Private
exports.updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image'
      });
    }
    
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: avatarUrl },
      { new: true }
    ).select('-password');
    
    res.status(200).json({
      success: true,
      data: user
    });
    
  } catch (error) {
    next(error);
  }
};

// @desc    Get user orders
// @route   GET /api/users/orders
// @access  Private
exports.getUserOrders = async (req, res, next) => {
  try {
    const Order = require('../models/Order');
    
    const orders = await Order.find({ user: req.user.id })
      .sort('-createdAt')
      .populate('items.product', 'name images');
    
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
    
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle favorite product
// @route   POST /api/users/favorites/:productId
// @access  Private
exports.toggleFavorite = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const productId = req.params.productId;
    
    const index = user.favorites.indexOf(productId);
    
    if (index === -1) {
      // Add to favorites
      user.favorites.push(productId);
    } else {
      // Remove from favorites
      user.favorites.splice(index, 1);
    }
    
    await user.save();
    
    res.status(200).json({
      success: true,
      message: index === -1 ? 'Added to favorites' : 'Removed from favorites',
      favorites: user.favorites
    });
    
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's favorite products
// @route   GET /api/users/favorites
// @access  Private
exports.getFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'favorites',
      select: 'name price images category brand'
    });
    
    res.status(200).json({
      success: true,
      count: user.favorites.length,
      data: user.favorites
    });
    
  } catch (error) {
    next(error);
  }
};