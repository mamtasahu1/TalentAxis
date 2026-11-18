const Contact = require('../models/Contact');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Submit a contact form message
// @route   POST /api/contact
// @access  Public
const submitContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all contact fields (name, email, subject, message)',
      });
    }

    const contactEntry = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
    });

    // Notify admins about the new contact inquiry
    try {
      const admins = await User.find({ role: 'admin' });
      if (admins && admins.length > 0) {
        const adminNotifications = admins.map((admin) => ({
          recipient: admin._id,
          title: 'New Contact Inquiry',
          message: `${contactEntry.name} (${contactEntry.email}): "${contactEntry.subject}"`,
          type: 'contact_inquiry',
          link: '/admin/contacts',
        }));
        await Notification.insertMany(adminNotifications);
      }
    } catch (notifErr) {
      console.error('Contact inquiry notification error:', notifErr);
    }

    return res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! Your message has been received.',
      data: contactEntry,
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while submitting your inquiry',
    });
  }
};

// @desc    Get all contact messages (Admin review)
// @route   GET /api/contact
// @access  Private (Admin only)
const getContactMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Contact messages retrieved successfully',
      data: messages,
    });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching contact inquiries',
    });
  }
};

// @desc    Delete a single contact message
// @route   DELETE /api/contact/:id
// @access  Private (Admin only)
const deleteContactMessage = async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found.',
      });
    }

    await Contact.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Contact message deleted successfully.',
      data: { id: req.params.id },
    });
  } catch (error) {
    console.error('Error deleting contact message:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found.',
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting contact message.',
    });
  }
};

module.exports = {
  submitContactMessage,
  getContactMessages,
  deleteContactMessage,
};
