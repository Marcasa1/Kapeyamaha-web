const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'package.json');

try {
  // Read the file as a buffer to detect BOM
  const data = fs.readFileSync(filePath);
  
  // Check for UTF-8 BOM (EF BB BF)
  let content;
  if (data[0] === 0xEF && data[1] === 0xBB && data[2] === 0xBF) {
    console.log('BOM detected, removing...');
    content = data.slice(3);
  } else {
    content = data;
  }
  
  // Write back without BOM
  fs.writeFileSync(filePath, content);
  console.log('package.json BOM removed successfully!');
  
  // Verify it's valid JSON
  const parsed = JSON.parse(content.toString());
  console.log('✅ package.json is now valid JSON');
  
} catch (error) {
  console.error('Error fixing package.json:', error.message);
  process.exit(1);
}