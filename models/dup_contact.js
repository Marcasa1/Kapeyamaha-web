const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

// Submit contact form
router.post('/', async (req, res) => {
    try {
        const contact = new Contact(req.body);
        await contact.save();
        
        // Send email to admin
        await sendContactEmail(contact);
        
        // Send auto-reply to customer
        await sendAutoReply(contact);
        
        res.status(201).json({ 
            success: true, 
            message: 'Message sent successfully!' 
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all messages (admin)
router.get('/', async (req, res) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

async function sendContactEmail(contact) {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: 'kapeyamaha@gmail.com',
        subject: `New Contact Form: ${contact.subject}`,
        html: `
            <h2>New Contact Message</h2>
            <p><strong>Name:</strong> ${contact.name}</p>
            <p><strong>Email:</strong> ${contact.email}</p>
            <p><strong>Phone:</strong> ${contact.phone}</p>
            <p><strong>Subject:</strong> ${contact.subject}</p>
            <p><strong>Message:</strong></p>
            <p>${contact.message}</p>
        `
    });
}

async function sendAutoReply(contact) {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: contact.email,
        subject: 'Thank you for contacting KAPEYAMAHA LIMITED',
        html: `
            <h2>Thank you for your message!</h2>
            <p>Dear ${contact.name},</p>
            <p>We have received your message and will get back to you within 24 hours.</p>
            <p><strong>Our Contact:</strong> +254 758 772 539</p>
            <p><strong>WhatsApp:</strong> <a href="https://wa.me/254758772539">Click to chat</a></p>
            <br>
            <p>Best regards,<br>KAPEYAMAHA LIMITED Team</p>
        `
    });
}

module.exports = router;