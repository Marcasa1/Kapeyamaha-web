const fs = require('fs');
const path = require('path');

const serverPath = path.join(__dirname, 'src', 'server.js');
let content = fs.readFileSync(serverPath, 'utf8');

// Replace the old connection options with new ones
content = content.replace(
  `    // Connect to MongoDB
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
    });`,
  `    // Connect to MongoDB - Simplified for Mongoose 9+
    const conn = await mongoose.connect(mongoURI);`
);

// Also remove strictQuery warning
content = content.replace(`mongoose.set('strictQuery', true);`, ``);

fs.writeFileSync(serverPath, content, 'utf8');
console.log('✅ Fixed mongoose connection options for v9+');
