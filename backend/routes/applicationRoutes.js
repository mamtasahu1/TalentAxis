const express = require('express');
const router = express.Router();
const {
  getMyApplications,
  getApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
} = require('../controllers/applicationController');
const { protect, requireStudent } = require('../middleware/authMiddleware');
const { handleCvUpload } = require('../middleware/uploadMiddleware');

router.use(protect);

// GET /api/applications/my (Students only)
router.get('/my', requireStudent, getMyApplications);

// GET /api/applications (Admin gets all, Student gets own)
router.get('/', getApplications);

// GET /api/applications/:id
router.get('/:id', getApplicationById);

// POST /api/applications (Mandatory CV upload)
router.post('/', requireStudent, handleCvUpload, createApplication);

// PATCH /api/applications/:id
router.patch('/:id', updateApplication);

// DELETE /api/applications/:id
router.delete('/:id', deleteApplication);

module.exports = router;
