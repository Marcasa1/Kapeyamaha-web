const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT),
            secure: process.env.EMAIL_PORT == 465,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        this.verifyConnection();
    }

    async verifyConnection() {
        try {
            await this.transporter.verify();
            console.log('✅ Email server connection verified');
        } catch (error) {
            console.error('❌ Email connection error:', error.message);
            console.log('⚠️  Using development email fallback');
            this.setupDevFallback();
        }
    }

    setupDevFallback() {
        // For development, log emails to console instead of sending
        if (process.env.NODE_ENV === 'development') {
            this.transporter = {
                sendMail: async (options) => {
                    console.log('📧 [DEV] Email would be sent:');
                    console.log('   To:', options.to);
                    console.log('   Subject:', options.subject);
                    console.log('   Preview:', options.text?.substring(0, 100) + '...');
                    return { messageId: 'dev-mode' };
                }
            };
        }
    }

    async sendContactFormEmail(formData) {
        const { name, email, phone, subject, message } = formData;

        // Email to business owner
        const mailOptions = {
            from: `"${process.env.SITE_NAME}" <${process.env.EMAIL_FROM}>`,
            to: process.env.SITE_EMAIL,
            replyTo: email,
            subject: `📧 New Contact Form: ${subject || 'General Inquiry'}`,
            html: this.generateContactEmailHTML(formData),
            text: this.generateContactEmailText(formData)
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            
            // Send auto-reply to customer
            await this.sendAutoReply(formData);
            
            return {
                success: true,
                messageId: info.messageId
            };
        } catch (error) {
            console.error('Email sending error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async sendAutoReply(formData) {
        const { name, email } = formData;

        const mailOptions = {
            from: `"${process.env.SITE_NAME}" <${process.env.EMAIL_FROM}>`,
            to: email,
            subject: 'Thank you for contacting KAPEYAMAHA Enterprises!',
            html: this.generateAutoReplyHTML(formData),
            text: this.generateAutoReplyText(formData)
        };

        return await this.transporter.sendMail(mailOptions);
    }

    async sendOrderConfirmation(orderData) {
        const mailOptions = {
            from: `"${process.env.SITE_NAME}" <${process.env.EMAIL_FROM}>`,
            to: orderData.customerEmail,
            subject: `✅ Order Confirmation - KAPEYAMAHA #${orderData.orderId}`,
            html: this.generateOrderEmailHTML(orderData),
            text: this.generateOrderEmailText(orderData)
        };

        // Send copy to admin
        const adminMail = { ...mailOptions };
        adminMail.to = process.env.ADMIN_EMAIL;
        adminMail.subject = `🛒 New Order Received - #${orderData.orderId}`;

        await this.transporter.sendMail(mailOptions);
        await this.transporter.sendMail(adminMail);
    }

    generateContactEmailHTML(formData) {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Contact Form Submission</title>
            <style>
                /* Your email styles here */
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>📧 New Contact Form Submission</h1>
                    <p>From: ${process.env.SITE_NAME} Website</p>
                </div>
                <div class="content">
                    <div class="detail">
                        <strong>📝 Customer Name:</strong> ${formData.name}
                    </div>
                    <div class="detail">
                        <strong>📧 Email:</strong> ${formData.email}
                    </div>
                    <div class="detail">
                        <strong>📞 Phone:</strong> ${formData.phone}
                    </div>
                    <div class="detail">
                        <strong>📌 Subject:</strong> ${formData.subject || 'General Inquiry'}
                    </div>
                    <div class="detail">
                        <strong>💬 Message:</strong>
                        <p>${formData.message.replace(/\n/g, '<br>')}</p>
                    </div>
                    <div class="detail">
                        <strong>⏰ Submission Time:</strong> ${new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })}
                    </div>
                    <div class="action">
                        <p><a href="mailto:${formData.email}?subject=Re: ${formData.subject || 'Your Inquiry'}" style="background: #dc2626; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reply to Customer</a></p>
                        <p><a href="https://wa.me/${formData.phone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(formData.name)}%2C%20thank%20you%20for%20contacting%20KAPEYAMAHA" style="background: #25D366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">WhatsApp Customer</a></p>
                    </div>
                </div>
                <div class="footer">
                    <p>This email was automatically generated from ${process.env.SITE_NAME} website.</p>
                    <p>📞 Call us: ${process.env.SITE_PHONE} | 📧 Email: ${process.env.SITE_EMAIL}</p>
                </div>
            </div>
        </body>
        </html>
        `;
    }

    generateAutoReplyHTML(formData) {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Thank you for contacting KAPEYAMAHA</title>
            <style>
                /* Auto-reply email styles */
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>${process.env.SITE_NAME}</h2>
                    <p>Your Automotive Solutions Partner</p>
                </div>
                <div class="content">
                    <h1>Thank you for contacting us, ${formData.name}!</h1>
                    <p>We have received your message and our team will respond within 24 hours.</p>
                    
                    <div class="summary">
                        <h3>Your Inquiry Summary:</h3>
                        <p><strong>Reference:</strong> KYP-${Date.now().toString().slice(-6)}</p>
                        <p><strong>Subject:</strong> ${formData.subject || 'General Inquiry'}</p>
                        <p><strong>Message:</strong> ${formData.message.substring(0, 100)}...</p>
                    </div>
                    
                    <div class="contact-info">
                        <h3>Need immediate assistance?</h3>
                        <p>📞 Call: ${process.env.SITE_PHONE}</p>
                        <p>💬 WhatsApp: ${process.env.SITE_PHONE}</p>
                        <p>📧 Email: ${process.env.SITE_EMAIL}</p>
                        <p>📍 Location: Kitale-Lodwar Highway, Kapenguria</p>
                    </div>
                </div>
                <div class="footer">
                    <p>© ${new Date().getFullYear()} ${process.env.SITE_NAME}. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        `;
    }

    // ... other email generation methods
}

module.exports = new EmailService();