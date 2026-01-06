#!/bin/bash

echo "=== Quick Deploy to Vercel ==="

# Create minimal files
echo "Creating deployment files..."

# Create a simple index.html that works
cat > index.html << 'HTML'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KAPEYAMAHA LIMITED - Toyota Cars, Vehicles & Spare Parts</title>
    <style>
        body { 
            margin: 0; 
            padding: 0; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
        }
        .container {
            max-width: 800px;
            padding: 2rem;
            background: rgba(0,0,0,0.7);
            border-radius: 20px;
            margin: 2rem;
        }
        h1 {
            color: #ff6b6b;
            margin-bottom: 1rem;
        }
        .logo {
            font-size: 4rem;
            margin-bottom: 2rem;
        }
        .status {
            background: #10b981;
            padding: 1rem;
            border-radius: 10px;
            margin: 2rem 0;
        }
        .contact {
            margin-top: 2rem;
            padding-top: 2rem;
            border-top: 1px solid rgba(255,255,255,0.2);
        }
        a {
            color: #ffd93d;
            text-decoration: none;
            font-weight: bold;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">🚗</div>
        <h1>KAPEYAMAHA ENTERPRISES LIMITED</h1>
        <p>Your Complete Automotive Solution</p>
        
        <div class="status">
            <h2>🚀 Deployment in Progress</h2>
            <p>Our website is being deployed with all features including:</p>
            <ul style="text-align: left; display: inline-block;">
                <li>Auto-sliding hero images</li>
                <li>Toyota car catalog</li>
                <li>Yamaha bike collection</li>
                <li>Spare parts shopping</li>
                <li>Secure checkout</li>
                <li>WhatsApp integration</li>
            </ul>
        </div>
        
        <div class="contact">
            <h3>📞 Contact Us Now</h3>
            <p>WhatsApp: <a href="https://wa.me/254758772539">+254 758 772 539</a></p>
            <p>Email: <a href="mailto:kapeyamaha@gmail.com">kapeyamaha@gmail.com</a></p>
            <p>Location: Kitale-Lodwar Highway, Kapenguria, Kenya</p>
        </div>
        
        <p style="margin-top: 2rem; font-size: 0.9rem; opacity: 0.8;">
            Full website launching momentarily...
        </p>
    </div>
</body>
</html>
HTML

echo "Deployment ready! Files created:"
ls -la

echo ""
echo "=== TO DEPLOY ==="
echo "1. Go to https://vercel.com"
echo "2. Click 'New Project'"
echo "3. Drag & drop this folder"
echo "4. Click 'Deploy'"
echo ""
echo "Or use CLI: npm i -g vercel && vercel"
