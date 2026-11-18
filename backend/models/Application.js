const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student ID is required'],
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job ID is required'],
    },
    coverLetter: {
      type: String,
      default: '',
      trim: true,
    },
    cvPath: {
      type: String,
      required: [true, 'CV file is required for application'],
      default: '',
    },
    cvOriginalName: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['Pending', 'Under Review', 'Shortlisted', 'Accepted', 'Rejected'],
        message: 'Status must be Pending, Under Review, Shortlisted, Accepted, or Rejected',
      },
      default: 'Pending',
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to guarantee a student can only apply once to a given job
applicationSchema.index({ studentId: 1, jobId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
