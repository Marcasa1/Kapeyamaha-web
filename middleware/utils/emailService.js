const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT === '465',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Email templates
const orderConfirmationTemplate = (order) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #dc2626;">Thank You for Your Order!</h2>
    <p>Dear ${order.customer.name},</p>
    <p>Your order has been received and is being processed.</p>
    
    <h3>Order Details:</h3>
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Order Number:</strong></td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${order.orderNumber}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Date:</strong></td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${new Date(order.createdAt).toLocaleDateString()}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Total:</strong></td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">$${order.total.toFixed(2)}</td>
      </tr>
    </table>
    
    <h3>Items Ordered:</h3>
    ${order.items.map(item => `
      <div style="margin-bottom: 10px; padding: 10px; background: #f9f9f9;">
        <strong>${item.name}</strong><br>
        Quantity: ${item.quantity}<br>
        Price: $${item.price.toFixed(2)} each
      </div>
    `).join('')}
    
    <p>You can track your order status by contacting us.</p>
    <p>Thank you for shopping with KAPEYAMAHA Enterprises!</p>
    <hr>
    <p style="color: #666; font-size: 12px;">
      KAPEYAMAHA ENTERPRISES LIMITED<br>
      Kitale-Lodwar Highway, Kapenguria, Kenya<br>
      Phone: +254 758 772 539<br>
      Email: kapeyamaha@gmail.com
    </p>
  </div>
`;

// Send order confirmation
exports.sendOrderConfirmation = async (order, customerEmail) => {
  try {
    const mailOptions = {
      from: `"KAPEYAMAHA Enterprises" <${process.env.EMAIL_FROM}>`,
      to: customerEmail,
      cc: process.env.EMAIL_USER,
      subject: `Order Confirmation - ${order.orderNumber}`,
      html: orderConfirmationTemplate(order)
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending order confirmation:', error);
  }
};

// Send contact email
exports.sendContactEmail = async (contact) => {
  try {
    const mailOptions = {
      from: `"KAPEYAMAHA Contact" <${process.env.EMAIL_FROM}>`,
      to: process.env.EMAIL_USER,
      subject: `New Contact Form Submission: ${contact.subject}`,
      html: `
        <div>
          <h3>New Contact Form Submission</h3>
          <p><strong>Name:</strong> ${contact.name}</p>
          <p><strong>Email:</strong> ${contact.email}</p>
          <p><strong>Phone:</strong> ${contact.phone}</p>
          <p><strong>Subject:</strong> ${contact.subject}</p>
          <p><strong>Message:</strong></p>
          <p>${contact.message}</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending contact email:', error);
  }
};

// Send password reset email
exports.sendPasswordResetEmail = async (user, resetToken) => {
  try {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: `"KAPEYAMAHA Support" <${process.env.EMAIL_FROM}>`,
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <div>
          <h3>Password Reset Request</h3>
          <p>You requested a password reset. Click the link below to reset your password:</p>
          <p><a href="${resetUrl}" style="background: #dc2626; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
          <p>This link will expire in 15 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending password reset email:', error);
  }
};