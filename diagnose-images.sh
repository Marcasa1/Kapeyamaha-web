#!/bin/bash
echo "=== Vercel Image Deployment Diagnostic ==="
echo ""

# Check project structure
echo "1. Project Structure:"
echo "   Working directory: $(pwd)"
echo "   Files at root:"
ls -la | head -20

# Check image directory
echo ""
echo "2. Image Directory:"
if [ -d images ]; then
    echo "   ✅ images/ directory exists"
    echo "   Total image files found: $(find images -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.gif" -o -name "*.svg" -o -name "*.webp" \) 2>/dev/null | wc -l)"
    echo "   First few image directories:"
    find images -type d 2>/dev/null | head -5
else
    echo "   ❌ images/ directory NOT found!"
fi

# Check vercel.json
echo ""
echo "3. Vercel Configuration:"
if [ -f vercel.json ]; then
    echo "   ✅ vercel.json exists"
    cat vercel.json
else
    echo "   ❌ No vercel.json found"
fi

# Check .vercelignore
echo ""
echo "4. .vercelignore:"
if [ -f .vercelignore ]; then
    cat .vercelignore
    if grep -q "images" .vercelignore 2>/dev/null; then
        echo "   ⚠️  Warning: 'images' is in .vercelignore!"
    fi
else
    echo "   ✅ No .vercelignore (good - means nothing is ignored)"
fi

# Test a few images
echo ""
echo "5. Testing sample images locally:"
test_images=(
    "images/vehicles/suv1.jpg"
    "images/hero/background.jpg"
    "images/parts/toyota-battery.jpg"
    "images/vehicles/yamaha-yzf-r1.jpg"
)
for img in "${test_images[@]}"; do
    if [ -f "$img" ]; then
        size=$(du -h "$img" 2>/dev/null | cut -f1 || echo "unknown")
        echo "   ✅ $img exists ($size)"
    else
        echo "   ❌ $img missing"
    fi
done

# Check for large files (>4MB) that might cause issues
echo ""
echo "6. Large files (>4MB):"
find images -type f -size +4M 2>/dev/null | head -5 | while read file; do
    size=$(du -h "$file" 2>/dev/null | cut -f1)
    echo "   ⚠️  $file ($size)"
done

echo ""
echo "=== Current HTML Image References ==="
echo "Sample of image paths in index.html:"
grep -o 'src="[^"]*"' index.html 2>/dev/null | head -3
grep -o "url('[^']*')" index.html 2>/dev/null | head -2

echo ""
echo "=== Deployment Status ==="
echo "To check your deployed URL:"
echo "Run: vercel ls"
echo ""
echo "=== Next Steps ==="
echo "1. Check if images are in .gitignore: cat .gitignore 2>/dev/null | grep images || echo 'Not in .gitignore'"
echo "2. Test direct image URL after deployment"
echo "3. Deploy with: vercel --prod"
