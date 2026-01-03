const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001; // Changed to 3001 to avoid conflicts

console.log('🔧 Server Configuration:');
console.log('   Port:', PORT);
console.log('   Environment:', process.env.NODE_ENV || 'development');

// Email configuration
let transporter;
if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT || 587,
        secure: process.env.EMAIL_SECURE === 'true' || false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    
    // Verify email connection
    transporter.verify(function(error, success) {
        if (error) {
            console.log('❌ Email connection failed:', error);
        } else {
            console.log('✅ Email server is ready to send messages');
        }
    });
} else {
    console.log('⚠️  Email not configured - contact form will not send emails');
    console.log('   Set EMAIL_HOST, EMAIL_USER, EMAIL_PASS in .env file');
}

// Middleware
app.use(cors());
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Basic route
app.get('/', (req, res) => {
    res.json({
        message: 'KapeYamaha Motorcycles API',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            contact: 'POST /api/contact'
        }
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        server: 'KapeYamaha',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        email: transporter ? 'configured' : 'not configured'
    });
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, subject, message, phone } = req.body;
        
        // Validate input
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, subject, and message are required'
            });
        }
        
        console.log(`📧 Contact form submission from: ${name} <${email}>`);
        
        // If email is configured, send it
        if (transporter) {
            const mailOptions = {
                from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
                to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
                replyTo: email,
                subject: `KapeYamaha Contact: ${subject}`,
                html: `
                    <h2>New Contact Form Submission</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <p><strong>Message:</strong></p>
                    <p>${message.replace(/\n/g, '<br>')}</p>
                    <hr>
                    <p><small>Sent from KapeYamaha website at ${new Date().toLocaleString()}</small></p>
                `,
                text: `
New Contact Form Submission
===========================
Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Subject: ${subject}

Message:
${message}

Sent from KapeYamaha website at ${new Date().toLocaleString()}
                `
            };
            
            await transporter.sendMail(mailOptions);
            console.log('✅ Email sent successfully');
            
            res.json({
                success: true,
                message: 'Your message has been sent successfully! We will contact you soon.'
            });
        } else {
            // If email not configured, just log and return success
            console.log('📝 Message details:', { name, email, subject, message });
            
            res.json({
                success: true,
                message: 'Message received! (Email service not configured - check server logs)',
                data: { name, email, subject }
            });
        }
        
    } catch (error) {
        console.error('❌ Contact form error:', error);
        
        res.status(500).json({
            success: false,
            message: 'Failed to send message. Please try again later.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Handle all other routes - serve SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('🔥 Server Error:', err.message);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`
    ========================================
    🚀 KAPEYAMAHA SERVER STARTED
    ========================================
    📍 Local:    http://localhost:${PORT}
    📍 Network:  http://YOUR_IP:${PORT}
    
    🔧 Port:     ${PORT}
    📧 Email:    ${transporter ? 'Configured ✅' : 'Not Configured ⚠️'}
    ⏰ Time:     ${new Date().toLocaleString()}
    
    📞 Contact:  +254 758 772 539
    📧 Support:  kapeyamaha@gmail.com
    ========================================
    `);
});