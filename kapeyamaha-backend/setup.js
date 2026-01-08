const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up KAPEYAMAHA Backend...');

// 1. Create basic folder structure
const folders = [
  'src/config',
  'src/models', 
  'src/controllers',
  'src/routes',
  'src/middleware',
  'src/utils',
  'src/seeds',
  'uploads'
];

folders.forEach(folder => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
    console.log(`✅ Created folder: ${folder}`);
  }
});

// 2. Create minimal server.js
const serverContent = `
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'KAPEYAMAHA API is running!',
    version: '1.0.0',
    endpoints: [
      '/api/products',
      '/api/auth/register',
      '/api/auth/login'
    ]
  });
});

app.get('/api/products', (req, res) => {
  res.json({
    success: true,
    products: [
      { id: 1, name: 'Toyota Land Cruiser', price: 125000 },
      { id: 2, name: 'Toyota Hilux', price: 45000 },
      { id: 3, name: 'Yamaha R1', price: 15999 }
    ]
  });
});

app.listen(PORT, () => {
  console.log(\`🚗 Server running on port \${PORT}\`);
});
`;

fs.writeFileSync('src/server.js', serverContent);
console.log('✅ Created src/server.js');

// 3. Create .env file
const envContent = `PORT=5000
MONGODB_URI=mongodb://localhost:27017/kapeyamaha
JWT_SECRET=your_super_secret_jwt_key_here
ADMIN_EMAIL=admin@kapeyamaha.com
ADMIN_PASSWORD=Admin@123
`;

fs.writeFileSync('.env', envContent);
console.log('✅ Created .env file');

// 4. Create .gitignore
const gitignoreContent = `node_modules/
.env
uploads/
*.log
`;

fs.writeFileSync('.gitignore', gitignoreContent);
console.log('✅ Created .gitignore');

console.log('\n🎉 Setup completed!');
console.log('📋 Next steps:');
console.log('   1. Run: npm run dev');
console.log('   2. Open: http://localhost:5000');
console.log('   3. Test the API endpoints');