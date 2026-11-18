const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Get applications for logged-in student
// @route   GET /api/applications/my
// @access  Private (Student)
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ studentId: req.user._id })
      .populate('jobId', 'title company location jobType deadline duration skills description qualifications responsibilities')
      .populate('studentId', 'name email skills education')
      .sort({ appliedAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Student applications retrieved successfully.',
      data: applications,
    });
  } catch (error) {
    console.error('Error fetching student applications:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching student applications.',
    });
  }
};

// @desc    Get all applications (Admin gets all, Student gets their own)
// @route   GET /api/applications
// @access  Private
const getApplications = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'student') {
      query.studentId = req.user._id;
    }

    const applications = await Application.find(query)
      .populate('jobId', 'title company location jobType deadline duration skills description qualifications responsibilities')
      .populate('studentId', 'name email skills education')
      .sort({ appliedAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Applications fetched successfully.',
      data: applications,
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching applications.',
    });
  }
};

// @desc    Get single application by ID
// @route   GET /api/applications/:id
// @access  Private
const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('jobId', 'title company location jobType deadline duration')
      .populate('studentId', 'name email skills education');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found.',
      });
    }

    // Role check: Admin or the owner student
    if (
      req.user.role !== 'admin' &&
      application.studentId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to this application record.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Application retrieved successfully.',
      data: application,
    });
  } catch (error) {
    console.error('Error fetching application by ID:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Application not found.',
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching application.',
    });
  }
};

// @desc    Create a new application (Apply for a job with mandatory CV)
// @route   POST /api/applications
// @access  Private (Student only)
const createApplication = async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: 'Job ID is required to submit an application.',
      });
    }

    // Mandatory CV file check
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'A CV / resume file (.pdf, .doc, .docx) is mandatory. Please upload your CV before applying.',
      });
    }

    // Verify job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found.',
      });
    }

    // Check application deadline
    if (job.deadline && new Date(job.deadline) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'The application deadline for this position has passed.',
      });
    }

    // Prevent duplicate application
    const existingApplication = await Application.findOne({
      studentId: req.user._id,
      jobId,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this position.',
      });
    }

    const application = await Application.create({
      studentId: req.user._id,
      jobId,
      coverLetter: coverLetter ? coverLetter.trim() : '',
      cvPath: req.file.filename,
      cvOriginalName: req.file.originalname,
      status: 'Pending',
    });

    const populatedApp = await Application.findById(application._id)
      .populate('jobId', 'title company location jobType deadline duration')
      .populate('studentId', 'name email skills education');

    // Send notifications to Admin and Student
    try {
      const admins = await User.find({ role: 'admin' });
      if (admins && admins.length > 0) {
        const adminNotifications = admins.map((admin) => ({
          recipient: admin._id,
          sender: req.user._id,
          title: 'New Application Received',
          message: `${req.user.name} applied for "${job.title}" at ${job.company}`,
          type: 'application_submitted',
          link: '/admin/applications',
        }));
        await Notification.insertMany(adminNotifications);
      }

      await Notification.create({
        recipient: req.user._id,
        title: 'Application Submitted',
        message: `Your application for "${job.title}" at ${job.company} has been submitted with your CV.`,
        type: 'application_submitted',
        link: '/student/applications',
      });
    } catch (notifErr) {
      console.error('Notification creation error:', notifErr);
    }

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully with your CV.',
      data: populatedApp,
    });
  } catch (error) {
    console.error('Error creating application:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted an application for this position.',
      });
    }
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while submitting application.',
    });
  }
};

// @desc    Update application status (Admin) or note (Student)
// @route   PATCH /api/applications/:id
// @access  Private
const updateApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found.',
      });
    }

    const { status, coverLetter } = req.body;

    const previousStatus = application.status;

    if (req.user.role === 'admin') {
      if (status) {
        const allowedStatuses = ['Pending', 'Under Review', 'Shortlisted', 'Accepted', 'Rejected'];
        if (!allowedStatuses.includes(status)) {
          return res.status(400).json({
            success: false,
            message: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}`,
          });
        }
        application.status = status;
      }
      if (coverLetter !== undefined) {
        application.coverLetter = coverLetter.trim();
      }
    } else if (req.user.role === 'student') {
      // Students can only update their own cover letter, never status!
      if (application.studentId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to edit this application.',
        });
      }
      if (status && status !== application.status) {
        return res.status(403).json({
          success: false,
          message: 'Students are not permitted to change application status.',
        });
      }
      if (coverLetter !== undefined) {
        application.coverLetter = coverLetter.trim();
      }
    }

    await application.save();

    const updatedApp = await Application.findById(application._id)
      .populate('jobId', 'title company location jobType deadline duration')
      .populate('studentId', 'name email skills education');

    // Send status change notification to student if status updated by admin
    if (req.user.role === 'admin' && status && status !== previousStatus) {
      try {
        const jobTitle = updatedApp.jobId?.title || 'the opportunity';
        const company = updatedApp.jobId?.company || '';
        await Notification.create({
          recipient: application.studentId,
          sender: req.user._id,
          title: `Application ${status}`,
          message: `Your application for "${jobTitle}" ${company ? 'at ' + company : ''} has been updated to "${status}".`,
          type: 'application_status',
          link: '/student/applications',
        });
      } catch (notifErr) {
        console.error('Status change notification error:', notifErr);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Application updated successfully.',
      data: updatedApp,
    });
  } catch (error) {
    console.error('Error updating application:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Application not found.',
      });
    }
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while updating application.',
    });
  }
};

// @desc    Delete/Withdraw an application
// @route   DELETE /api/applications/:id
// @access  Private
const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found.',
      });
    }

    // Role check: Student can withdraw their own; Admin can delete any
    if (
      req.user.role !== 'admin' &&
      application.studentId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to withdraw/delete this application.',
      });
    }

    await Application.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Application removed successfully.',
      data: { id: req.params.id },
    });
  } catch (error) {
    console.error('Error deleting application:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Application not found.',
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Server error while removing application.',
    });
  }
};

module.exports = {
  getMyApplications,
  getApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
};
