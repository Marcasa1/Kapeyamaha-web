// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const paypal = require('@paypal/checkout-server-sdk');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Image storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  }
});

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Copy your existing images to uploads folder
const imageFiles = [
  'WhatsApp Image 2025-11-02 at 21.57.48.jpeg',
  'WhatsApp Image 2025-11-02 at 21.57.45.jpeg',
  'WhatsApp Image 2025-11-02 at 21.57.46 (1).jpeg',
  'WhatsApp Image 2025-11-02 at 21.57.47.jpeg',
  'yamaha-yzf-r166ec165a9cf4d.avif',
  'yamaha-mt-07-2021-review-price-spec_02.avif',
  'XMAX 300.png',
  'yamaha tenere.jpg',
  'YZF-R3-Blue.avif',
  'MT O9.jpg',
  'LANDCRUISER 300.png',
  'Toyota-Hilux-2021-new.jpg',
  'RAV-4 HYBRID.avif',
  'TOYOTA COROLLA.png',
  'LANDCRUISER PRADO.png',
  'Fortuner-Auto.jpg',
  'hiace.jpg',
  'COASTER.webp',
  'HINO.png',
  'LANDCRIUSER 79.png',
  'hilux double-cabin.png',
  'suvs3.avif',
  'oil filter.png',
  'yamaha air filter.webp',
  'spark plug.webp',
  'timing belt.jpg'
];

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Product Database (JSON file - you can expand to MongoDB later)
const productsDB = {
  yamahaBikes: require('./data/yamaha-bikes.json'),
  toyotaCars: require('./data/toyota-cars.json'),
  commercialVehicles: require('./data/commercial-vehicles.json'),
  spareParts: require('./data/spare-parts.json')
};

// API Routes
// Get all products
app.get('/api/products', (req, res) => {
  res.json(productsDB);
});

// Get product by ID
app.get('/api/products/:id', (req, res) => {
  const allProducts = [
    ...productsDB.yamahaBikes,
    ...productsDB.toyotaCars,
    ...productsDB.commercialVehicles,
    ...productsDB.spareParts
  ];
  
  const product = allProducts.find(p => p.id === req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

// Process order
app.post('/api/orders', async (req, res) => {
  try {
    const { items, customer, paymentMethod, totalAmount } = req.body;
    
    // Generate order ID
    const orderId = 'KAPE' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    // Create order record
    const order = {
      orderId,
      items,
      customer,
      paymentMethod,
      totalAmount,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Save order to file (in production, use database)
    const orders = JSON.parse(fs.readFileSync('./data/orders.json', 'utf8') || '[]');
    orders.push(order);
    fs.writeFileSync('./data/orders.json', JSON.stringify(orders, null, 2));
    
    // Send confirmation email
    await sendOrderConfirmationEmail(order);
    
    // Send WhatsApp notification (simulated)
    sendWhatsAppNotification(order);
    
    res.json({ 
      success: true, 
      orderId,
      message: 'Order created successfully' 
    });
  } catch (error) {
    console.error('Order processing error:', error);
    res.status(500).json({ error: 'Failed to process order' });
  }
});

// Stripe payment intent
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd' } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: { integration_check: 'accept_a_payment' }
    });
    
    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PayPal order creation
app.post('/api/create-paypal-order', async (req, res) => {
  try {
    const { amount } = req.body;
    
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: amount.toString()
        }
      }]
    });
    
    const order = await paypal.client().execute(request);
    res.json({ id: order.result.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Contact form submission
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    
    await sendContactEmail({ name, email, phone, subject, message });
    
    res.json({ 
      success: true, 
      message: 'Message sent successfully. We will contact you soon.' 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Newsletter subscription
app.post('/api/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Save subscriber to file
    const subscribers = JSON.parse(fs.readFileSync('./data/subscribers.json', 'utf8') || '[]');
    
    if (!subscribers.find(s => s.email === email)) {
      subscribers.push({ email, subscribedAt: new Date().toISOString() });
      fs.writeFileSync('./data/subscribers.json', JSON.stringify(subscribers, null, 2));
    }
    
    await sendWelcomeEmail(email);
    
    res.json({ 
      success: true, 
      message: 'Successfully subscribed to newsletter!' 
    });
  } catch (error) {
    res.status(500).json({ error: 'Subscription failed' });
  }
});

// Upload image
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }
  
  res.json({ 
    success: true, 
    imageUrl: `/uploads/${req.file.filename}` 
  });
});

// Email sending functions
async function sendOrderConfirmationEmail(order) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: order.customer.email,
    subject: `Order Confirmation - ${order.orderId}`,
    html: `
      <h2>Thank you for your order!</h2>
      <p>Order ID: <strong>${order.orderId}</strong></p>
      <p>Total Amount: <strong>$${order.totalAmount}</strong></p>
      <p>Payment Method: <strong>${order.paymentMethod}</strong></p>
      <p>We will process your order and contact you soon.</p>
      <p>Best regards,<br>KAPEYAMAHA LIMITED</p>
    `
  };
  
  await transporter.sendMail(mailOptions);
}

async function sendContactEmail(data) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'kapeyamaha@gmail.com',
    subject: `New Contact Form: ${data.subject}`,
    html: `
      <h3>New Contact Form Submission</h3>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Subject:</strong> ${data.subject}</p>
      <p><strong>Message:</strong></p>
      <p>${data.message}</p>
    `
  };
  
  await transporter.sendMail(mailOptions);
}

async function sendWelcomeEmail(email) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Welcome to KAPEYAMAHA Newsletter',
    html: `
      <h2>Welcome to KAPEYAMAHA LIMITED!</h2>
      <p>Thank you for subscribing to our newsletter.</p>
      <p>You'll receive updates about new Toyota cars, Yamaha bikes, and special offers.</p>
      <p>Best regards,<br>KAPEYAMAHA LIMITED Team</p>
    `
  };
  
  await transporter.sendMail(mailOptions);
}

function sendWhatsAppNotification(order) {
  // In production, use Twilio API or WhatsApp Business API
  console.log(`WhatsApp Notification: New order ${order.orderId} for ${order.customer.phone}`);
  // Implement actual WhatsApp API call here
}

// Serve main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});