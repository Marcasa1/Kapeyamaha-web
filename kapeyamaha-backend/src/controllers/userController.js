const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('favorites');

    res.status(200).json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        phone,
        address,
        updatedAt: Date.now()
      },
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
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Add to favorites
// @route   POST /api/users/favorites/:productId
// @access  Private
exports.addToFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const productId = req.params.productId;

    // Check if already in favorites
    if (user.favorites.includes(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Product already in favorites'
      });
    }

    user.favorites.push(productId);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Added to favorites',
      favorites: user.favorites
    });

  } catch (error) {
    console.error('Add to favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Remove from favorites
// @route   DELETE /api/users/favorites/:productId
// @access  Private
exports.removeFromFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const productId = req.params.productId;

    // Remove from favorites
    user.favorites = user.favorites.filter(
      fav => fav.toString() !== productId
    );

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Removed from favorites',
      favorites: user.favorites
    });

  } catch (error) {
    console.error('Remove from favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};