const express = require('express');
const router = express.Router();
const {
  submitContactMessage,
  getContactMessages,
  deleteContactMessage,
} = require('../controllers/contactController');
const { protect, requireAdmin } = require('../middleware/authMiddleware');

// Public route to submit contact inquiry
router.post('/', submitContactMessage);

// Admin-only route to view inquiries
router.get('/', protect, requireAdmin, getContactMessages);

// Admin-only route to delete contact message
router.delete('/:id', protect, requireAdmin, deleteContactMessage);

module.exports = router;
