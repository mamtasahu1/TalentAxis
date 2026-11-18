const Job = require('../models/Job');
const Application = require('../models/Application');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Get all jobs with optional search and filters
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
  try {
    const { search, jobType, location } = req.query;
    let query = {};

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { company: searchRegex },
        { description: searchRegex },
        { skills: searchRegex },
        { location: searchRegex },
      ];
    }

    if (jobType && jobType !== 'All') {
      query.jobType = jobType;
    }

    if (location && location.trim()) {
      query.location = new RegExp(location.trim(), 'i');
    }

    const jobs = await Job.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Jobs fetched successfully',
      data: jobs,
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching jobs',
    });
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('createdBy', 'name email');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Job retrieved successfully',
      data: job,
    });
  } catch (error) {
    console.error('Error fetching single job:', error);
    // Handle invalid ObjectId format
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching job details',
    });
  }
};

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private (Admin only)
const createJob = async (req, res) => {
  try {
    const { title, company, description, location, jobType, skills, duration, salary, responsibilities, qualifications, deadline } = req.body;

    if (!title || !company || !description || !location || !jobType || !deadline) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, company, description, location, jobType, and deadline',
      });
    }

    // Format skills
    let parsedSkills = [];
    if (Array.isArray(skills)) {
      parsedSkills = skills;
    } else if (typeof skills === 'string' && skills.trim()) {
      parsedSkills = skills.split(',').map((s) => s.trim()).filter(Boolean);
    }

    const job = await Job.create({
      title: title.trim(),
      company: company.trim(),
      description: description.trim(),
      location: location.trim(),
      jobType,
      skills: parsedSkills,
      duration: duration ? duration.trim() : 'Flexible',
      salary: salary ? salary.trim() : '',
      responsibilities: responsibilities ? responsibilities.trim() : '',
      qualifications: qualifications ? qualifications.trim() : '',
      deadline: new Date(deadline),
      createdBy: req.user._id,
    });

    // Notify all registered students about the new job
    try {
      const students = await User.find({ role: 'student' });
      if (students && students.length > 0) {
        const studentNotifications = students.map((s) => ({
          recipient: s._id,
          sender: req.user._id,
          title: 'New Opportunity Available',
          message: `New opening: "${job.title}" at ${job.company} (${job.location}). Applications now open.`,
          type: 'job_posted',
          link: `/jobs/${job._id}`,
        }));
        await Notification.insertMany(studentNotifications);
      }
    } catch (notifErr) {
      console.error('Job posted notification error:', notifErr);
    }

    return res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: job,
    });
  } catch (error) {
    console.error('Error creating job:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while creating job',
    });
  }
};

// @desc    Update a job
// @route   PATCH /api/jobs/:id
// @access  Private (Admin only)
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    const { title, company, description, location, jobType, skills, duration, salary, responsibilities, qualifications, deadline } = req.body;

    if (title !== undefined) job.title = title.trim();
    if (company !== undefined) job.company = company.trim();
    if (description !== undefined) job.description = description.trim();
    if (location !== undefined) job.location = location.trim();
    if (jobType !== undefined) job.jobType = jobType;
    if (duration !== undefined) job.duration = duration.trim();
    if (salary !== undefined) job.salary = salary.trim();
    if (responsibilities !== undefined) job.responsibilities = responsibilities.trim();
    if (qualifications !== undefined) job.qualifications = qualifications.trim();
    if (deadline !== undefined) job.deadline = new Date(deadline);

    if (skills !== undefined) {
      if (Array.isArray(skills)) {
        job.skills = skills;
      } else if (typeof skills === 'string') {
        job.skills = skills.split(',').map((s) => s.trim()).filter(Boolean);
      }
    }

    const updatedJob = await job.save();

    return res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      data: updatedJob,
    });
  } catch (error) {
    console.error('Error updating job:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while updating job',
    });
  }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private (Admin only)
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Also delete any applications associated with this job
    await Application.deleteMany({ jobId: job._id });
    await Job.findByIdAndDelete(job._id);

    return res.status(200).json({
      success: true,
      message: 'Job and associated applications deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    console.error('Error deleting job:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting job',
    });
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
};
