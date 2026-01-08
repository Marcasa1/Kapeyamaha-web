const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// User profile routes
router.get('/profile', protect, userController.getProfile);
router.put('/profile', protect, userController.updateProfile);

// Favorites routes
router.post('/favorites/:productId', protect, userController.addToFavorites);
router.delete('/favorites/:productId', protect, userController.removeFromFavorites);

// Admin only routes
router.get('/', protect, authorize('admin'), userController.getUsers);

module.exports = router;