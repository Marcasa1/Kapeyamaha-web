const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', productController.getProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/category/:category', productController.getProductsByCategory);
router.get('/:id', productController.getProduct);
router.get('/:id/related', productController.getRelatedProducts);

// Protected routes (Admin only)
router.post('/', protect, authorize('admin'), productController.createProduct);
router.put('/:id', protect, authorize('admin'), productController.updateProduct);
router.delete('/:id', protect, authorize('admin'), productController.deleteProduct);
router.put('/:id/images', protect, authorize('admin'), upload.array('images', 10), productController.uploadProductImages);

module.exports = router;