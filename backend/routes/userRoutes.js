const express = require('express');
const router = express.Router();
const {
  getCurrentUser,
  updateCurrentUser,
  getAllUsers,
  changePassword,
} = require('../controllers/userController');
const { protect, requireAdmin } = require('../middleware/authMiddleware');

// Student / Self routes
router.get('/me', protect, getCurrentUser);
router.patch('/me', protect, updateCurrentUser);
router.patch('/me/password', protect, changePassword);

// Admin-only user directory route
router.get('/', protect, requireAdmin, getAllUsers);

module.exports = router;
