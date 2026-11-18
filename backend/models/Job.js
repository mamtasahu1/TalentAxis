const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a job title'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Please provide a company name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a job description'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Please provide job location'],
      trim: true,
    },
    jobType: {
      type: String,
      required: [true, 'Please specify the job type'],
      enum: {
        values: ['Internship', 'Full-time', 'Part-time', 'Remote'],
        message: 'Job type must be Internship, Full-time, Part-time, or Remote',
      },
    },
    skills: {
      type: [String],
      default: [],
    },
    duration: {
      type: String,
      default: 'Flexible',
      trim: true,
    },
    salary: {
      type: String,
      default: '',
      trim: true,
    },
    qualifications: {
      type: String,
      default: '',
      trim: true,
    },
    responsibilities: {
      type: String,
      default: '',
      trim: true,
    },
    deadline: {
      type: Date,
      required: [true, 'Please provide an application deadline'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Job', jobSchema);
