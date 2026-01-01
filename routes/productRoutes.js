const express = require('express');
const router = express.Router();

// GET all products
router.get('/', (req, res) => {
  res.json([
    { id: 1, name: 'Product 1', price: 100 },
    { id: 2, name: 'Product 2', price: 200 }
  ]);
});

// GET single product
router.get('/:id', (req, res) => {
  res.json({ 
    id: req.params.id, 
    name: `Product ${req.params.id}`,
    price: 100 * req.params.id
  });
});

module.exports = router;