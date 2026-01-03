const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'package.json');

try {
  // Read the file
  let content = fs.readFileSync(filePath, 'utf8');
  console.log('Original content:');
  console.log(content);
  
  // Fix: Remove extra spaces after colons
  // Matches pattern: ":  " (colon followed by two or more spaces)
  content = content.replace(/:\s+/g, ': ');
  
  // Also fix any BOM if present
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
    console.log('Removed BOM');
  }
  
  // Write back
  fs.writeFileSync(filePath, content);
  
  console.log('\nFixed content:');
  console.log(content);
  
  // Verify it's valid JSON
  JSON.parse(content);
  console.log('✅ Valid JSON!');
  
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}