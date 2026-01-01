const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { protect, admin } = require('../middleware/auth');

// Public route
router.post('/', contactController.submitContact);

// Admin routes
router.get('/', protect, admin, contactController.getContacts);
router.put('/:id', protect, admin, contactController.updateContact);

module.exports = router;