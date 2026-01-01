// services/emailService.js
const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        // Check if environment variables are set
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.warn('⚠️  Email credentials not set. Using development mode.');
            this.setupDevMode();
            return;
        }

        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.EMAIL_PORT || 587),
            secure: process.env.EMAIL_PORT == 465,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // Test connection on startup
        this.testConnection();
    }

    setupDevMode() {
        // Development mode - log emails to console
        console.log('📧 EMAIL SERVICE: Development mode activated');
        console.log('   Emails will be logged to console instead of sent');
        
        this.transporter = {
            sendMail: async (options) => {
                console.log('\n📧 [EMAIL LOG] =================================');
                console.log('   From:', options.from);
                console.log('   To:', options.to);
                console.log('   Subject:', options.subject);
                console.log('   Text:', options.text?.substring(0, 200) + '...');
                console.log('   ===========================================\n');
                return { messageId: 'dev-mode-' + Date.now() };
            }
        };
    }

    async testConnection() {
        try {
            await this.transporter.verify();
            console.log('✅ Email service: Connection verified');
        } catch (error) {
            console.warn('⚠️  Email service: Connection failed, using dev mode');
            this.setupDevMode();
        }
    }

    async sendContactForm(data) {
        try {
            // Email to business
            const businessEmail = {
                from: `"${process.env.SITE_NAME || 'KAPEYAMAHA'}" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
                to: process.env.SITE_EMAIL || process.env.EMAIL_USER,
                replyTo: data.email,
                subject: `📧 New Contact: ${data.subject || 'General Inquiry'}`,
                text: this.formatBusinessEmailText(data),
                html: this.formatBusinessEmailHTML(data)
            };

            const result = await this.transporter.sendMail(businessEmail);
            
            // Send auto-reply to customer
            await this.sendAutoReply(data);
            
            return {
                success: true,
                messageId: result.messageId
            };
            
        } catch (error) {
            console.error('Email send error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async sendAutoReply(data) {
        const autoReply = {
            from: `"${process.env.SITE_NAME || 'KAPEYAMAHA'}" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
            to: data.email,
            subject: 'Thank you for contacting KAPEYAMAHA!',
            text: this.formatAutoReplyText(data),
            html: this.formatAutoReplyHTML(data)
        };

        return await this.transporter.sendMail(autoReply);
    }

    formatBusinessEmailText(data) {
        return `
NEW CONTACT FORM SUBMISSION
===========================

Customer Information:
--------------------
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Subject: ${data.subject || 'General Inquiry'}

Message:
--------
${data.message}

Technical Details:
------------------
IP Address: ${data.ip || 'Not available'}
User Agent: ${data.userAgent || 'Not available'}
Timestamp: ${new Date().toLocaleString()}

---
This email was sent from your website contact form.
`;
    }

    formatBusinessEmailHTML(data) {
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: #dc2626; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { padding: 20px; background: #f9fafb; }
        .field { margin: 10px 0; padding: 10px; background: white; border-left: 4px solid #dc2626; }
        .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📧 New Contact Form Submission</h1>
            <p>From your website - ${process.env.SITE_NAME || 'KAPEYAMAHA'}</p>
        </div>
        <div class="content">
            <div class="field">
                <strong>👤 Customer Name:</strong> ${data.name}
            </div>
            <div class="field">
                <strong>📧 Email:</strong> ${data.email}
            </div>
            <div class="field">
                <strong>📞 Phone:</strong> ${data.phone}
            </div>
            <div class="field">
                <strong>📌 Subject:</strong> ${data.subject || 'General Inquiry'}
            </div>
            <div class="field">
                <strong>💬 Message:</strong><br>
                ${data.message.replace(/\n/g, '<br>')}
            </div>
            <div style="margin-top: 20px; padding: 15px; background: #e0f2fe; border-radius: 8px;">
                <p><strong>Quick Actions:</strong></p>
                <p>📧 <a href="mailto:${data.email}">Reply via Email</a></p>
                <p>💬 <a href="https://wa.me/${data.phone.replace(/\D/g, '')}">WhatsApp Customer</a></p>
            </div>
        </div>
        <div class="footer">
            <p>This email was automatically generated from your website contact form.</p>
            <p>© ${new Date().getFullYear()} ${process.env.SITE_NAME || 'KAPEYAMAHA'}</p>
        </div>
    </div>
</body>
</html>
        `;
    }

    formatAutoReplyText(data) {
        return `
Dear ${data.name},

Thank you for contacting ${process.env.SITE_NAME || 'KAPEYAMAHA ENTERPRISES LIMITED'}!

We have received your message and our team will get back to you within 24 hours.

Your Inquiry Details:
---------------------
Reference: KYP-${Date.now().toString().slice(-6)}
Subject: ${data.subject || 'General Inquiry'}
Message: ${data.message.substring(0, 100)}...

Need Immediate Assistance?
--------------------------
Phone: ${process.env.SITE_PHONE || '+254 758 772 539'}
WhatsApp: ${process.env.SITE_PHONE || '+254 758 772 539'}
Email: ${process.env.SITE_EMAIL || 'kapeyamaha@gmail.com'}

Business Hours:
---------------
Monday - Saturday: 8:00 AM - 6:00 PM
Sunday: Emergency Service Available

Thank you for choosing KAPEYAMAHA!

Best regards,
${process.env.SITE_NAME || 'KAPEYAMAHA ENTERPRISES LIMITED'}
${process.env.SITE_PHONE || '+254 758 772 539'}
        `;
    }

    formatAutoReplyHTML(data) {
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: #dc2626; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 30px; background: #f9fafb; }
        .thankyou { font-size: 18px; color: #065f46; text-align: center; margin: 20px 0; }
        .info-box { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border: 1px solid #e5e7eb; }
        .contact-info { background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; }
        .whatsapp-btn { display: inline-block; background: #25D366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
        .call-btn { display: inline-block; background: #dc2626; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${process.env.SITE_NAME || 'KAPEYAMAHA ENTERPRISES LIMITED'}</h1>
            <p>Your Automotive Solutions Partner</p>
        </div>
        <div class="content">
            <div class="thankyou">
                <h2>Thank You, ${data.name}!</h2>
                <p>We have received your message and will contact you soon.</p>
            </div>
            
            <div class="info-box">
                <h3>📋 Your Inquiry Summary</h3>
                <p><strong>Reference Number:</strong> KYP-${Date.now().toString().slice(-6)}</p>
                <p><strong>Subject:</strong> ${data.subject || 'General Inquiry'}</p>
                <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <div class="contact-info">
                <h3>📞 Need Immediate Assistance?</h3>
                <p>Our team is ready to help you:</p>
                
                <div style="text-align: center; margin: 20px 0;">
                    <a href="tel:${process.env.SITE_PHONE || '+254758772539'}" class="call-btn">
                        📞 Call Us Now
                    </a>
                    <a href="https://wa.me/${process.env.SITE_PHONE ? process.env.SITE_PHONE.replace(/\D/g, '') : '254758772539'}" class="whatsapp-btn">
                        💬 WhatsApp Us
                    </a>
                </div>
                
                <p><strong>Phone:</strong> ${process.env.SITE_PHONE || '+254 758 772 539'}</p>
                <p><strong>Email:</strong> ${process.env.SITE_EMAIL || 'kapeyamaha@gmail.com'}</p>
                <p><strong>Address:</strong> Kitale-Lodwar Highway, Kapenguria</p>
                <p><strong>Business Hours:</strong> Mon-Sat 8:00 AM - 6:00 PM</p>
            </div>
            
            <div class="info-box">
                <h3>🚗 Our Services</h3>
                <p>• Toyota Cars & SUVs</p>
                <p>• Yamaha Motorcycles</p>
                <p>• Commercial Vehicles</p>
                <p>• Genuine Spare Parts</p>
                <p>• Vehicle Maintenance & Repair</p>
            </div>
        </div>
        <div class="footer">
            <p>This is an automated confirmation email. Please do not reply to this message.</p>
            <p>© ${new Date().getFullYear()} ${process.env.SITE_NAME || 'KAPEYAMAHA ENTERPRISES LIMITED'}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
        `;
    }
}

module.exports = new EmailService();