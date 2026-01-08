const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Validation rules
const registerValidation = [
  body('name').not().isEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').not().isEmpty().withMessage('Phone number is required')
];

const loginValidation = [
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password').not().isEmpty().withMessage('Password is required')
];

// Routes
router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.get('/logout', protect, authController.logout);
router.get('/me', protect, authController.getMe);
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/forgot-password', authController.forgotPassword);
router.put('/reset-password/:token', authController.resetPassword);
router.put('/update-password', protect, authController.updatePassword);

module.exports = router;