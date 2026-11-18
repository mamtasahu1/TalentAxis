const express = require('express');
const router = express.Router();
const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
} = require('../controllers/jobController');
const { protect, requireAdmin } = require('../middleware/authMiddleware');

// Public routes for viewing opportunities
router.get('/', getJobs);
router.get('/:id', getJobById);

// Admin-only management routes (Only POST, PATCH, DELETE as per REST restrictions)
router.post('/', protect, requireAdmin, createJob);
router.patch('/:id', protect, requireAdmin, updateJob);
router.delete('/:id', protect, requireAdmin, deleteJob);

module.exports = router;
