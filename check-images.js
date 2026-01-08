const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Image Issues on Vercel...\n');

// Read index.html
const html = fs.readFileSync('index.html', 'utf8');

// Find all image references
const imagePatterns = [
  /src=["']([^"']+\.(jpg|jpeg|png|gif|webp))["']/gi,
  /url\(['"]?([^)'"]+\.(jpg|jpeg|png|gif|webp))['"]?\)/gi,
  /background-image:\s*url\(['"]?([^)'"]+\.(jpg|jpeg|png|gif|webp))['"]?\)/gi
];

let imageCount = 0;
const images = new Set();

imagePatterns.forEach(pattern => {
  let match;
  while ((match = pattern.exec(html)) !== null) {
    images.add(match[1]);
    imageCount++;
  }
});

console.log(`Found ${imageCount} image references in HTML/CSS`);
console.log('Unique image paths:');

images.forEach(img => {
  console.log(`  ${img}`);
  
  // Check if image exists locally
  const localPath = path.join(__dirname, img.replace(/^\//, ''));
  if (fs.existsSync(localPath)) {
    console.log(`    ✅ Local file exists (${(fs.statSync(localPath).size / 1024).toFixed(1)} KB)`);
  } else {
    console.log(`    ❌ Local file NOT FOUND: ${localPath}`);
  }
});

console.log('\n🎯 Quick Test URLs for your Vercel deployment:');
console.log('1. Open your browser console (F12)');
console.log('2. Paste these test commands:');

console.log(`
// Test hero images
const heroImages = [
  '/images/hero/Toyota-fortuner.jpg',
  '/images/hero/TOYOTA-LANDCRUISER-GDJ.jpg',
  '/images/hero/toyota-landcruiser-prado.jpg',
  '/images/hero/toyota-RSA.jpg'
];

heroImages.forEach(src => {
  const img = new Image();
  img.onload = () => console.log('✅ Loaded:', src);
  img.onerror = () => console.log('❌ Failed:', src);
  img.src = src;
});
`);

console.log('\n📝 Open this URL in browser to test:');
console.log('https://kapeyamaha-web.vercel.app/');
