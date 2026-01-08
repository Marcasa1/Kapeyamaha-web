const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { protect, admin } = require('../middleware/auth.middleware');

// Public routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.get('/category/:category', productController.getProductsByCategory);
router.get('/brand/:brand', productController.getProductsByBrand);

// Protected routes (admin only)
router.post('/', protect, admin, productController.createProduct);
router.put('/:id', protect, admin, productController.updateProduct);
router.delete('/:id', protect, admin, productController.deleteProduct);

module.exports = router;