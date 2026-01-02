const emailConfig = require('../config/email');

class EmailService {
    constructor() {
        this.transporter = emailConfig.getTransporter();
        this.from = `"${process.env.EMAIL_FROM_NAME || 'Your App'}" <${process.env.EMAIL_FROM}>`;
    }

    async sendEmail(to, subject, htmlContent, textContent = null) {
        try {
            const mailOptions = {
                from: this.from,
                to: Array.isArray(to) ? to.join(', ') : to,
                subject: subject,
                html: htmlContent,
                text: textContent || this.stripHtml(htmlContent),
            };

            const info = await this.transporter.sendMail(mailOptions);
            console.log(`✅ Email sent: ${info.messageId}`);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error('❌ Email sending failed:', error);
            return { success: false, error: error.message };
        }
    }

    stripHtml(html) {
        return html.replace(/<[^>]*>?/gm, '');
    }

    // Specific email templates
    async sendWelcomeEmail(userEmail, userName) {
        const subject = 'Welcome to Our App!';
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #4CAF50; color: white; padding: 10px; text-align: center; }
                    .content { padding: 20px; }
                    .footer { text-align: center; margin-top: 30px; color: #666; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Welcome ${userName}!</h1>
                    </div>
                    <div class="content">
                        <p>Thank you for joining our application.</p>
                        <p>We're excited to have you on board!</p>
                    </div>
                    <div class="footer">
                        <p>&copy; ${new Date().getFullYear()} Your App Name</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        return await this.sendEmail(userEmail, subject, html);
    }

    async sendPasswordResetEmail(userEmail, resetToken) {
        const resetLink = `https://yourapp.com/reset-password?token=${resetToken}`;
        const subject = 'Password Reset Request';
        const html = `
            <h2>Password Reset</h2>
            <p>Click the link below to reset your password:</p>
            <a href="${resetLink}">${resetLink}</a>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
        `;

        return await this.sendEmail(userEmail, subject, html);
    }
}

module.exports = new EmailService();