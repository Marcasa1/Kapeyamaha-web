const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up KAPEYAMAHA project...');

// Create necessary directories
const dirs = [
    'images/vehicles',
    'images/parts',
    'models',
    'routes',
    'uploads'
];

dirs.forEach(dir => {
    const dirPath = path.join(__dirname, '..', dir);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`✅ Created directory: ${dir}`);
    }
});

// Create basic files
const files = {
    '.env': `MONGODB_URI=mongodb://127.0.0.1:27017/kapeyamaha
PORT=5000`,
    
    'models/Product.js': `const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    stock: { type: Number, default: 10 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);`
};

Object.entries(files).forEach(([filePath, content]) => {
    const fullPath = path.join(__dirname, '..', filePath);
    if (!fs.existsSync(fullPath)) {
        fs.writeFileSync(fullPath, content);
        console.log(`✅ Created file: ${filePath}`);
    }
});

console.log('\n🎉 Setup complete!');
console.log('\n📋 Next steps:');
console.log('   1. Install MongoDB from: https://www.mongodb.com/try/download/community');
console.log('   2. Start MongoDB: npm run mongo-start');
console.log('   3. Seed database: npm run seed');
console.log('   4. Start server: npm run dev');
console.log('\n🌐 Or use MongoDB Atlas (cloud):');
console.log('   1. Create free account at https://mongodb.com/atlas');
console.log('   2. Update MONGODB_URI in .env file');
console.log('   3. Run: npm run seed && npm run dev');