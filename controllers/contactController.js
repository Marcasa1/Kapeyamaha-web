const Contact = require('../models/Contact');
const { sendContactEmail, sendContactConfirmation } = require('../utils/emailService');

// Submit contact form
exports.submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Create contact record
    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    // Send email to admin
    await sendContactEmail(contact);

    // Send confirmation to user
    await sendContactConfirmation(contact);

    res.status(201).json({
      success: true,
      message: 'Thank you for your message! We will contact you soon.',
      data: contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting contact form',
      error: error.message
    });
  }
};

// Get all contact submissions (admin)
exports.getContacts = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const filter = {};
    if (status) filter.status = status;

    const skip = (page - 1) * limit;

    const [contacts, total] = await Promise.all([
      Contact.find(filter)
        .sort('-createdAt')
        .skip(skip)
        .limit(Number(limit)),
      Contact.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      count: contacts.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      contacts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching contacts',
      error: error.message
    });
  }
};

// Update contact status (admin)
exports.updateContact = async (req, res) => {
  try {
    const { status, replyMessage } = req.body;
    
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    const updates = {};
    if (status) updates.status = status;
    if (replyMessage) {
      updates.replyMessage = replyMessage;
      updates.repliedAt = new Date();
    }

    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    // Send reply email if reply message provided
    if (replyMessage) {
      await sendContactReply(updatedContact);
    }

    res.status(200).json({
      success: true,
      message: 'Contact updated successfully',
      contact: updatedContact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating contact',
      error: error.message
    });
  }
};