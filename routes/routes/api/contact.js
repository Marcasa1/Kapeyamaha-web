const express = require('express');
const router = express.Router();
const emailService = require('../../services/emailService');

// POST /api/contact - Contact form submission
router.post('/contact', async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        // Validation
        const errors = [];
        if (!name || name.trim().length < 2) errors.push('Name must be at least 2 characters');
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Valid email is required');
        if (!phone || phone.trim().length < 10) errors.push('Valid phone number is required');
        if (!message || message.trim().length < 10) errors.push('Message must be at least 10 characters');

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }

        // Prepare form data
        const formData = {
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            subject: subject || 'General Inquiry',
            message: message.trim(),
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            timestamp: new Date()
        };

        // Send email
        const emailResult = await emailService.sendContactFormEmail(formData);

        if (emailResult.success) {
            // Save to database (optional)
            // await ContactMessage.create(formData);

            res.status(200).json({
                success: true,
                message: 'Message sent successfully! We will contact you soon.',
                reference: `KYP-${Date.now().toString().slice(-6)}`
            });
        } else {
            throw new Error(emailResult.error);
        }

    } catch (error) {
        console.error('Contact form error:', error);
        
        res.status(500).json({
            success: false,
            message: 'Failed to send message. Please try again or contact us directly.',
            contactInfo: {
                phone: process.env.SITE_PHONE,
                email: process.env.SITE_EMAIL,
                whatsapp: `https://wa.me/${process.env.SITE_PHONE.replace(/\D/g, '')}`
            }
        });
    }
});

// GET /api/contact/test - Test email endpoint
router.get('/contact/test', async (req, res) => {
    try {
        const testData = {
            name: 'Test Customer',
            email: 'test@example.com',
            phone: '+254712345678',
            subject: 'Test Inquiry',
            message: 'This is a test message from the API.'
        };

        const result = await emailService.sendContactFormEmail(testData);

        res.json({
            success: true,
            message: 'Test email sent successfully',
            result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;