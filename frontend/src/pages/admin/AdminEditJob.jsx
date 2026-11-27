import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { jobAPI } from '../../services/api';

const AdminEditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    jobType: 'Internship',
    duration: '',
    salary: '',
    skills: '',
    responsibilities: '',
    qualifications: '',
    description: '',
    deadline: '',
  });

  const [initialLoading, setInitialLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setInitialLoading(true);
        const res = await jobAPI.getJobById(id);
        if (res.data.success) {
          const j = res.data.data;
          setFormData({
            title: j.title || '',
            company: j.company || '',
            location: j.location || '',
            jobType: j.jobType || 'Internship',
            duration: j.duration || '',
            salary: j.salary || '',
            skills: Array.isArray(j.skills) ? j.skills.join(', ') : '',
            responsibilities: j.responsibilities || '',
            qualifications: j.qualifications || '',
            description: j.description || '',
            deadline: j.deadline ? new Date(j.deadline).toISOString().split('T')[0] : '',
          });
        }
      } catch (err) {
        console.error('Error fetching job details for editing:', err);
        setFeedback({
          type: 'error',
          text: 'Unable to load existing job details. The posting may not exist.',
        });
      } finally {
        setInitialLoading(false);
      }
    };

    if (id) {
      fetchJob();
    }
  }, [id]);

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
        text: 'Please complete all required fields.',
      });
      return;
    }

    try {
      setSaveLoading(true);
      const res = await jobAPI.updateJob(id, formData);

      if (res.data.success) {
        setFeedback({
          type: 'success',
          text: 'Job posting updated successfully. Returning to directory...',
        });
        setTimeout(() => {
          navigate('/admin/jobs');
        }, 1200);
      }
    } catch (err) {
      console.error('Error saving job changes:', err);
      setFeedback({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update job posting.',
      });
    } finally {
      setSaveLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="loading-container" style={{ minHeight: '50vh' }}>
        <div className="spinner"></div>
        <p>Loading job details...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto' }}>
      {/* Breadcrumb Header */}
      <div style={{ marginBottom: '20px' }}>
        <Link to="/admin/jobs" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary)' }}>
          &larr; Back to Job Postings
        </Link>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--navy-dark)', marginTop: '8px', marginBottom: '4px' }}>
          Edit Job Posting
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Update role requirements, deadline, and description for {formData.company}.
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
              <label className="form-label" htmlFor="editTitle">
                Job Title *
              </label>
              <input
                type="text"
                id="editTitle"
                name="title"
                className="form-control"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="editCompany">
                Company Name *
              </label>
              <input
                type="text"
                id="editCompany"
                name="company"
                className="form-control"
                value={formData.company}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Row 2: Location, Type, Duration */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="editLocation">
                Location *
              </label>
              <input
                type="text"
                id="editLocation"
                name="location"
                className="form-control"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="editJobType">
                Job Type *
              </label>
              <select
                id="editJobType"
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
              <label className="form-label" htmlFor="editDuration">
                Duration
              </label>
              <input
                type="text"
                id="editDuration"
                name="duration"
                className="form-control"
                value={formData.duration}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Row 3: Compensation & Deadline */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="editSalary">
                Compensation / Stipend (NPR)
              </label>
              <input
                type="text"
                id="editSalary"
                name="salary"
                className="form-control"
                placeholder="e.g. NPR 35,000 - 50,000 / mo"
                value={formData.salary}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="editDeadline">
                Application Deadline *
              </label>
              <input
                type="date"
                id="editDeadline"
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
            <label className="form-label" htmlFor="editSkills">
              Required Skills (comma-separated)
            </label>
            <input
              type="text"
              id="editSkills"
              name="skills"
              className="form-control"
              value={formData.skills}
              onChange={handleChange}
            />
          </div>

          {/* Responsibilities */}
          <div className="form-group">
            <label className="form-label" htmlFor="editResponsibilities">
              Responsibilities
            </label>
            <textarea
              id="editResponsibilities"
              name="responsibilities"
              className="form-control"
              rows="4"
              placeholder="Detail key day-to-day duties, project ownership, and deliverables..."
              value={formData.responsibilities}
              onChange={handleChange}
            />
          </div>

          {/* Qualifications */}
          <div className="form-group">
            <label className="form-label" htmlFor="editQualifications">
              Qualifications
            </label>
            <textarea
              id="editQualifications"
              name="qualifications"
              className="form-control"
              rows="4"
              placeholder="Detail required education, academic standing, prior experience, or coursework..."
              value={formData.qualifications}
              onChange={handleChange}
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="editDescription">
              Position Description *
            </label>
            <textarea
              id="editDescription"
              name="description"
              className="form-control"
              rows="5"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
            <Link to="/admin/jobs" className="btn btn-secondary">
              Cancel
            </Link>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saveLoading}
            >
              {saveLoading ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminEditJob;
