import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { jobAPI } from '../../services/api';

const AdminCreateJob = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    jobType: 'Internship',
    duration: '3 Months',
    salary: '',
    skills: '',
    responsibilities: '',
    qualifications: '',
    description: '',
    deadline: '',
  });

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: '', text: '' });

    if (!formData.title.trim() || !formData.company.trim() || !formData.location.trim() || !formData.description.trim() || !formData.deadline) {
      setFeedback({
        type: 'error',
        text: 'Please complete all required fields: Job Title, Company, Location, Description, and Deadline.',
      });
      return;
    }

    try {
      setLoading(true);
      const res = await jobAPI.createJob(formData);

      if (res.data.success) {
        setFeedback({
          type: 'success',
          text: 'Opportunity published successfully. Redirecting to job directory...',
        });
        setTimeout(() => {
          navigate('/admin/jobs');
        }, 1200);
      }
    } catch (err) {
      console.error('Job creation error:', err);
      setFeedback({
        type: 'error',
        text: err.response?.data?.message || 'Failed to create job posting. Please check all fields.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto' }}>
      {/* Breadcrumb Header */}
      <div style={{ marginBottom: '20px' }}>
        <Link to="/admin/jobs" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary)' }}>
          &larr; Back to Job Postings
        </Link>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--navy-dark)', marginTop: '8px', marginBottom: '4px' }}>
          Create New Job Opportunity
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Publish a verified internship, co-op, or full-time position on the TalentAxis network.
        </p>
      </div>

      {feedback.text && (
        <div className={`alert ${feedback.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          {feedback.text}
        </div>
      )}

      {/* Form Card */}
      <div className="card" style={{ padding: '32px' }}>
        <form onSubmit={handleSubmit}>
          {/* Row 1: Title & Company */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="createTitle">
                Job Title *
              </label>
              <input
                type="text"
                id="createTitle"
                name="title"
                className="form-control"
                placeholder="e.g. Software Engineering Intern"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="createCompany">
                Company Name *
              </label>
              <input
                type="text"
                id="createCompany"
                name="company"
                className="form-control"
                placeholder="e.g. Nova Digital Labs"
                value={formData.company}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Row 2: Location, Type, Duration */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="createLocation">
                Location *
              </label>
              <input
                type="text"
                id="createLocation"
                name="location"
                className="form-control"
                placeholder="e.g. Remote, San Francisco, CA"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="createJobType">
                Job Type *
              </label>
              <select
                id="createJobType"
                name="jobType"
                className="form-control form-select"
                value={formData.jobType}
                onChange={handleChange}
              >
                <option value="Internship">Internship</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="createDuration">
                Duration
              </label>
              <input
                type="text"
                id="createDuration"
                name="duration"
                className="form-control"
                placeholder="e.g. 3 Months, 6 Months"
                value={formData.duration}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Row 3: Compensation & Deadline */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="createSalary">
                Compensation / Stipend (NPR)
              </label>
              <input
                type="text"
                id="createSalary"
                name="salary"
                className="form-control"
                placeholder="e.g. NPR 35,000 - 50,000 / mo"
                value={formData.salary}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="createDeadline">
                Application Deadline *
              </label>
              <input
                type="date"
                id="createDeadline"
                name="deadline"
                className="form-control"
                value={formData.deadline}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Skills */}
          <div className="form-group">
            <label className="form-label" htmlFor="createSkills">
              Required Skills (comma-separated)
            </label>
            <input
              type="text"
              id="createSkills"
              name="skills"
              className="form-control"
              placeholder="e.g. JavaScript, Python, SQL, Git, Figma"
              value={formData.skills}
              onChange={handleChange}
            />
            <span className="form-hint">
              List the primary technical languages, tools, or frameworks required.
            </span>
          </div>

          {/* Responsibilities */}
          <div className="form-group">
            <label className="form-label" htmlFor="createResponsibilities">
              Responsibilities
            </label>
            <textarea
              id="createResponsibilities"
              name="responsibilities"
              className="form-control"
              rows="4"
              placeholder="e.g. Develop modular features; write automated tests; collaborate with design team"
              value={formData.responsibilities}
              onChange={handleChange}
            />
          </div>

          {/* Qualifications */}
          <div className="form-group">
            <label className="form-label" htmlFor="createQualifications">
              Qualifications
            </label>
            <textarea
              id="createQualifications"
              name="qualifications"
              className="form-control"
              rows="4"
              placeholder="e.g. Pursuing Computer Science degree; strong analytical problem solving"
              value={formData.qualifications}
              onChange={handleChange}
            />
          </div>

          {/* Full Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="createDescription">
              Position Description *
            </label>
            <textarea
              id="createDescription"
              name="description"
              className="form-control"
              rows="5"
              placeholder="Provide a comprehensive overview of the role, mentorship provided, and project impact..."
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
            <Link to="/admin/jobs" className="btn btn-secondary">
              Cancel
            </Link>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Publishing...' : 'Publish Opportunity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCreateJob;
