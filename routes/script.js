// fix-missing-routes.js
const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing missing routes...\n');

const routesDir = path.join(__dirname, 'routes');
const productRoutesFile = path.join(routesDir, 'productRoutes.js');

// 1. Create routes directory if it doesn't exist
if (!fs.existsSync(routesDir)) {
  fs.mkdirSync(routesDir);
  console.log('✅ Created routes directory');
} else {
  console.log('✅ Routes directory exists');
}

// 2. Create productRoutes.js if it doesn't exist
if (!fs.existsSync(productRoutesFile)) {
  const content = `const express = require('express');
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
    name: \`Product \${req.params.id}\`,
    price: 100 * req.params.id
  });
});

module.exports = router;`;
  
  fs.writeFileSync(productRoutesFile, content);
  console.log('✅ Created productRoutes.js');
} else {
  console.log('✅ productRoutes.js already exists');
}

// 3. Verify server.js has the require statement
const serverFile = path.join(__dirname, 'server.js');
if (fs.existsSync(serverFile)) {
  const serverContent = fs.readFileSync(serverFile, 'utf8');
  if (serverContent.includes("require('./routes/productRoutes')")) {
    console.log('✅ server.js requires productRoutes');
  } else {
    console.log('⚠️  server.js does not require productRoutes');
  }
}

console.log('\n🎉 Fix complete! Try running: npm run dev');