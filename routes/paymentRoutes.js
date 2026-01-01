const express = require('express');
const router = express.Router();

// Process payment
router.post('/process', (req, res) => {
  res.json({ 
    success: true, 
    transactionId: 'txn_' + Date.now(),
    message: 'Payment processed successfully'
  });
});

// Get payment status
router.get('/status/:id', (req, res) => {
  res.json({ 
    transactionId: req.params.id,
    status: 'completed'
  });
});

module.exports = router;
