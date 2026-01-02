const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailConfig {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false // Only for development/testing
            }
        });
    }

    async verifyConnection() {
        try {
            await this.transporter.verify();
            console.log('✅ Email server connection verified');
            return true;
        } catch (error) {
            console.error('❌ Email connection failed:', error);
            return false;
        }
    }

    getTransporter() {
        return this.transporter;
    }
}

module.exports = new EmailConfig();