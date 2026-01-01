const express = require('express');
const router = express.Router();

// GET all orders
router.get('/', (req, res) => {
  res.json([{ id: 1, status: 'pending' }, { id: 2, status: 'completed' }]);
});

// Create order
router.post('/', (req, res) => {
  res.json({ message: 'Order created successfully', orderId: Date.now() });
});

module.exports = router;
