import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { jobAPI, applicationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { getCompanyLogo, formatSalary } from '../utils/companyData';

const JobDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated, isStudent, isAdmin } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [existingApplication, setExistingApplication] = useState(null);

  // Apply modal
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyMessage, setApplyMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        setError('');

        const res = await jobAPI.getJobById(id);
        if (res.data.success) {
          setJob(res.data.data);
        }

        if (isStudent) {
          try {
            const appRes = await applicationAPI.getMyApplications();
            if (appRes.data.success) {
              const matched = appRes.data.data.find(
                (app) => (app.jobId?._id || app.jobId) === id
              );
              if (matched) {
                setExistingApplication(matched);
              }
            }
          } catch (appErr) {
            console.error('Error fetching student applications:', appErr);
          }
        }
      } catch (err) {
        console.error('Error fetching job details:', err);
        setError(err.response?.data?.message || 'Opportunity not found or server error.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id, isStudent]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!cvFile) {
      setApplyMessage({
        type: 'error',
        text: 'Uploading your CV/resume (.pdf, .doc, .docx) is mandatory before applying.',
      });
      return;
    }

    try {
      setApplyLoading(true);
      setApplyMessage({ type: '', text: '' });

      const formData = new FormData();
      formData.append('jobId', job._id);
      formData.append('coverLetter', coverLetter);
      formData.append('cv', cvFile);

      const res = await applicationAPI.createApplication(formData);

      if (res.data.success) {
        setExistingApplication(res.data.data);
        setApplyMessage({
          type: 'success',
          text: 'Application submitted successfully with your CV. You can track its progress in your dashboard.',
        });
        setTimeout(() => {
          setIsApplyModalOpen(false);
          setApplyMessage({ type: '', text: '' });
          setCvFile(null);
          setCoverLetter('');
        }, 1600);
      }
    } catch (err) {
      setApplyMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to submit application.',
      });
    } finally {
      setApplyLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Not specified';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const isExpired = job?.deadline ? new Date(job.deadline) < new Date() : false;

  if (loading) {
    return (
      <div className="loading-container" style={{ minHeight: '60vh' }}>
        <div className="spinner"></div>
        <p>Loading opportunity details...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container section-py">
        <div className="card" style={{ textAlign: 'center', padding: '48px 20px' }}>
          <h2 style={{ marginBottom: '10px', color: 'var(--navy-dark)' }}>Opportunity Not Found</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
            {error || 'The job you are looking for does not exist or may have been removed.'}
          </p>
          <Link to="/jobs" className="btn btn-primary btn-sm">
            Back to All Opportunities
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section-py">
      <div className="container">
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: '20px' }}>
          <Link to="/jobs" className="btn btn-secondary btn-sm">
            &larr; Back to Find Jobs
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '28px', alignItems: 'start' }}>
          {/* Left Column: Details */}
          <div>
            <div className="card" style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <div style={{ width: '56px', height: '56px', minWidth: '56px', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#fff', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img
                    src={getCompanyLogo(job.company)}
                    alt={`${job.company} logo`}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>
                <div>
                  <span className="badge badge-primary" style={{ marginBottom: '6px' }}>
                    {job.jobType}
                  </span>
                  <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--navy-dark)', marginBottom: '2px' }}>
                    {job.title}
                  </h1>
                  <h2 style={{ fontSize: '1.125rem', color: 'var(--primary)', fontWeight: 600 }}>
                    {job.company}
                  </h2>
                </div>
              </div>

              {/* Meta Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '14px', padding: '14px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', marginBottom: '24px' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Location</span>
                  <strong style={{ color: 'var(--navy-dark)', fontSize: '0.875rem' }}>{job.location}</strong>
                </div>
                {job.salary && (
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Compensation</span>
                    <strong style={{ color: 'var(--navy-dark)', fontSize: '0.875rem' }}>{formatSalary(job.salary)}</strong>
                  </div>
                )}
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Duration</span>
                  <strong style={{ color: 'var(--navy-dark)', fontSize: '0.875rem' }}>{job.duration || 'Flexible'}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Deadline</span>
                  <strong style={{ color: isExpired ? 'var(--color-error)' : 'var(--navy-dark)', fontSize: '0.875rem' }}>
                    {formatDate(job.deadline)} {isExpired && '(Closed)'}
                  </strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Posted</span>
                  <strong style={{ color: 'var(--navy-dark)', fontSize: '0.875rem' }}>{formatDate(job.createdAt)}</strong>
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: '28px' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '10px', color: 'var(--navy-dark)' }}>
                  Position Description
                </h3>
                <div style={{ whiteSpace: 'pre-line', lineHeight: '1.6', color: 'var(--text-main)', fontSize: '0.9375rem' }}>
                  {job.description}
                </div>
              </div>

              {/* Responsibilities */}
              {job.responsibilities && (
                <div style={{ marginBottom: '28px' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '10px', color: 'var(--navy-dark)' }}>
                    Responsibilities
                  </h3>
                  <div style={{ whiteSpace: 'pre-line', lineHeight: '1.6', color: 'var(--text-main)', fontSize: '0.9375rem' }}>
                    {job.responsibilities}
                  </div>
                </div>
              )}

              {/* Qualifications */}
              {job.qualifications && (
                <div style={{ marginBottom: '28px' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '10px', color: 'var(--navy-dark)' }}>
                    Qualifications
                  </h3>
                  <div style={{ whiteSpace: 'pre-line', lineHeight: '1.6', color: 'var(--text-main)', fontSize: '0.9375rem' }}>
                    {job.qualifications}
                  </div>
                </div>
              )}

              {/* Required Skills */}
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '10px', color: 'var(--navy-dark)' }}>
                  Required Skills
                </h3>
                {job.skills && job.skills.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {job.skills.map((skill, index) => (
                      <span key={index} className="skill-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    No specific skills prerequisites listed.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Apply / Status Card */}
          <div>
            <div className="card" style={{ position: 'sticky', top: '90px' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '14px', color: 'var(--navy-dark)' }}>
                Application Center
              </h3>

              {/* Expired Job warning */}
              {isExpired && (
                <div className="alert alert-error" style={{ marginBottom: '14px' }}>
                  The application deadline for this position has passed. Applications are closed.
                </div>
              )}

              {/* Case 1: Student already applied */}
              {isStudent && existingApplication && (
                <div style={{ padding: '14px', backgroundColor: 'var(--bg-success)', border: '1px solid var(--border-success)', borderRadius: 'var(--radius-md)', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--color-success)', fontSize: '0.875rem' }}>Status:</span>
                    <StatusBadge status={existingApplication.status} />
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-success)', margin: 0 }}>
                    Applied on {formatDate(existingApplication.appliedAt)}.
                  </p>
                  <Link to="/student/applications" className="btn btn-secondary btn-sm" style={{ width: '100%', marginTop: '12px' }}>
                    View in My Applications &rarr;
                  </Link>
                </div>
              )}

              {/* Case 2: Student has NOT applied yet */}
              {isStudent && !existingApplication && (
                <div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '16px' }}>
                    Submit your application directly to the {job.company} recruitment team.
                  </p>
                  <button
                    onClick={() => setIsApplyModalOpen(true)}
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                    disabled={isExpired}
                  >
                    {isExpired ? 'Applications Closed' : 'Apply for this Position'}
                  </button>
                </div>
              )}

              {/* Case 3: Public Visitor */}
              {!isAuthenticated && (
                <div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '16px' }}>
                    Sign in to your student account to apply for this opportunity.
                  </p>
                  <Link
                    to="/login"
                    state={{ from: { pathname: `/jobs/${job._id}` } }}
                    className="btn btn-primary"
                    style={{ width: '100%', marginBottom: '8px' }}
                  >
                    Login to Apply
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-secondary"
                    style={{ width: '100%' }}
                  >
                    Register as Student
                  </Link>
                </div>
              )}

              {/* Case 4: Admin */}
              {isAdmin && (
                <div>
                  <div className="alert alert-info" style={{ marginBottom: '14px' }}>
                    Logged in as Administrator. You have management permissions for this posting.
                  </div>
                  <Link to={`/admin/jobs/${job._id}/edit`} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                    Edit Job Posting
                  </Link>
                </div>
              )}

              {/* Metadata */}
              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                <div>Verified TalentAxis Opportunity</div>
                <div style={{ marginTop: '6px' }}>Direct hiring team review</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title={`Apply: ${job.title}`}
      >
        <form onSubmit={handleApply}>
          <div style={{ marginBottom: '14px', padding: '12px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontWeight: 700, color: 'var(--navy-dark)' }}>{job.company}</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              {job.location} • {job.jobType}
            </div>
          </div>

          {applyMessage.text && (
            <div className={`alert ${applyMessage.type === 'success' ? 'alert-success' : 'alert-error'}`}>
              {applyMessage.text}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Applicant</label>
            <div className="form-control" style={{ backgroundColor: 'var(--bg-subtle)' }}>
              {user?.name} ({user?.email})
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="cvFileInput">
              Resume / CV <span style={{ color: 'var(--color-error)' }}>* (Mandatory)</span>
            </label>
            <input
              type="file"
              id="cvFileInput"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="form-control"
              onChange={(e) => setCvFile(e.target.files[0] || null)}
              required
            />
            <span className="form-hint">Accepted formats: PDF, DOC, DOCX (Max 5MB)</span>
            {cvFile && (
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-success)', marginTop: '4px', display: 'block', fontWeight: 600 }}>
                Selected file: {cvFile.name} ({(cvFile.size / 1024).toFixed(1)} KB)
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="coverLetterInput">
              Cover Letter / Statement of Interest (Optional)
            </label>
            <textarea
              id="coverLetterInput"
              className="form-control"
              rows="4"
              placeholder="Explain why you are interested in this position and relevant coursework..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsApplyModalOpen(false)}
              disabled={applyLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={applyLoading}
            >
              {applyLoading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default JobDetails;
