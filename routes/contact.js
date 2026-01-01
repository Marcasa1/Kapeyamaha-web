// routes/api/contact.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config();

// Email transporter configuration
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Contact form submission endpoint
router.post('/contact', async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        // Validation
        if (!name || !email || !phone || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required fields'
            });
        }

        // Email to business owner
        const mailOptions = {
            from: `"KAPEYAMAHA Website" <${process.env.EMAIL_USER}>`,
            to: 'kapeyamaha@gmail.com',
            subject: `New Contact Form: ${subject || 'General Inquiry'}`,
            html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
                    .content { padding: 20px; background: #f9fafb; }
                    .detail { margin: 10px 0; padding: 10px; background: white; border-left: 4px solid #dc2626; }
                    .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>New Contact Form Submission</h1>
                        <p>From: KAPEYAMAHA Website</p>
                    </div>
                    <div class="content">
                        <div class="detail">
                            <strong>Customer Name:</strong> ${name}
                        </div>
                        <div class="detail">
                            <strong>Email:</strong> ${email}
                        </div>
                        <div class="detail">
                            <strong>Phone:</strong> ${phone}
                        </div>
                        <div class="detail">
                            <strong>Subject:</strong> ${subject || 'General Inquiry'}
                        </div>
                        <div class="detail">
                            <strong>Message:</strong>
                            <p>${message.replace(/\n/g, '<br>')}</p>
                        </div>
                        <div class="detail">
                            <strong>Submission Time:</strong> ${new Date().toLocaleString()}
                        </div>
                    </div>
                    <div class="footer">
                        <p>This email was automatically generated from the KAPEYAMAHA website contact form.</p>
                        <p>© ${new Date().getFullYear()} KAPEYAMAHA ENTERPRISES LIMITED</p>
                    </div>
                </div>
            </body>
            </html>
            `,
            text: `
            NEW CONTACT FORM SUBMISSION - KAPEYAMAHA
            
            Customer Name: ${name}
            Email: ${email}
            Phone: ${phone}
            Subject: ${subject || 'General Inquiry'}
            
            Message:
            ${message}
            
            Submission Time: ${new Date().toLocaleString()}
            
            ---
            This message was sent from the KAPEYAMAHA website contact form.
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);

        // Send auto-reply to customer
        const customerMail = {
            from: `"KAPEYAMAHA Enterprises" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Thank you for contacting KAPEYAMAHA Enterprises',
            html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
                    .content { padding: 20px; background: #f9fafb; }
                    .thank-you { font-size: 18px; color: #065f46; margin: 20px 0; }
                    .info-box { background: white; padding: 15px; margin: 15px 0; border-radius: 8px; border: 1px solid #e5e7eb; }
                    .contact-info { margin-top: 20px; padding: 15px; background: #f0f9ff; border-radius: 8px; }
                    .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>KAPEYAMAHA ENTERPRISES LIMITED</h2>
                        <p>Your Automotive Solutions Partner</p>
                    </div>
                    <div class="content">
                        <div class="thank-you">
                            <strong>Dear ${name},</strong>
                            <p>Thank you for contacting KAPEYAMAHA ENTERPRISES LIMITED!</p>
                        </div>
                        
                        <div class="info-box">
                            <p>We have received your inquiry and our team will get back to you within 24 hours.</p>
                            <p>Your inquiry reference: <strong>KYP-${Date.now().toString().slice(-6)}</strong></p>
                        </div>
                        
                        <div class="contact-info">
                            <h3>Our Contact Information:</h3>
                            <p><strong>Phone:</strong> +254 758 772 539</p>
                            <p><strong>WhatsApp:</strong> +254 758 772 539</p>
                            <p><strong>Email:</strong> kapeyamaha@gmail.com</p>
                            <p><strong>Address:</strong> Kitale-Lodwar Highway, Kapenguria</p>
                            <p><strong>Business Hours:</strong> Monday-Saturday 8:00 AM - 6:00 PM</p>
                        </div>
                        
                        <div class="info-box">
                            <h3>How to Reach Us Faster:</h3>
                            <p>• For immediate assistance, call: +254 758 772 539</p>
                            <p>• WhatsApp us for quick responses</p>
                            <p>• Visit our showroom in Kapenguria</p>
                        </div>
                    </div>
                    <div class="footer">
                        <p>This is an automated confirmation email. Please do not reply to this message.</p>
                        <p>© ${new Date().getFullYear()} KAPEYAMAHA ENTERPRISES LIMITED. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            `
        };

        await transporter.sendMail(customerMail);

        res.status(200).json({
            success: true,
            message: 'Message sent successfully! We will contact you soon.'
        });

    } catch (error) {
        console.error('Email sending error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send message. Please try again or contact us directly.'
        });
    }
});

// Test email endpoint (for testing only)
router.post('/test-email', async (req, res) => {
    try {
        const testMail = {
            from: `"KAPEYAMAHA Test" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: 'Test Email from KAPEYAMAHA Website',
            text: 'This is a test email from your website backend.',
            html: '<h1>Test Email Successful!</h1><p>Your email setup is working correctly.</p>'
        };

        await transporter.sendMail(testMail);
        res.json({ success: true, message: 'Test email sent successfully!' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;