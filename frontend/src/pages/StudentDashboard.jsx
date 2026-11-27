import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { applicationAPI, jobAPI } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import JobCard from '../components/JobCard';
import { formatSalary } from '../utils/companyData';

const StudentDashboard = () => {
  const { user } = useAuth();

  const [applications, setApplications] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Withdraw state
  const [withdrawTarget, setWithdrawTarget] = useState(null);
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  // Apply Modal state for recommended jobs
  const [selectedJob, setSelectedJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyFeedback, setApplyFeedback] = useState({ type: '', text: '' });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      const [appRes, jobsRes] = await Promise.all([
        applicationAPI.getMyApplications(),
        jobAPI.getJobs(),
      ]);

      const myApps = appRes.data?.data || [];
      const allJobs = jobsRes.data?.data || [];
      setApplications(myApps);

      const appliedIds = myApps.map((a) => a.jobId?._id || a.jobId);

      // Recommend jobs not yet applied to that match user skills or general openings
      const unappliedJobs = allJobs.filter((j) => !appliedIds.includes(j._id));

      let matched = [];
      if (user?.skills && user.skills.length > 0) {
        matched = unappliedJobs.filter((j) =>
          j.skills?.some((sk) =>
            user.skills.some((userSk) => userSk.toLowerCase().includes(sk.toLowerCase()))
          )
        );
      }

      const recommendations = matched.length >= 2 ? matched : unappliedJobs;
      setRecommendedJobs(recommendations.slice(0, 3));
    } catch (err) {
      console.error('Error fetching student dashboard data:', err);
      setError('Unable to load your dashboard information.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Compute live statistics
  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === 'Pending').length,
    underReview: applications.filter((a) => a.status === 'Under Review').length,
    shortlisted: applications.filter((a) => a.status === 'Shortlisted').length,
    accepted: applications.filter((a) => a.status === 'Accepted').length,
    rejected: applications.filter((a) => a.status === 'Rejected').length,
  };

  const handleWithdraw = async () => {
    if (!withdrawTarget) return;

    try {
      setWithdrawLoading(true);
      const res = await applicationAPI.deleteApplication(withdrawTarget._id);
      if (res.data.success) {
        setApplications((prev) => prev.filter((a) => a._id !== withdrawTarget._id));
        setWithdrawTarget(null);
      }
    } catch (err) {
      console.error('Error withdrawing application:', err);
      alert(err.response?.data?.message || 'Failed to withdraw application.');
    } finally {
      setWithdrawLoading(false);
    }
  };

  const handleApplyRecommended = async (e) => {
    e.preventDefault();
    if (!selectedJob) return;

    if (!cvFile) {
      setApplyFeedback({
        type: 'error',
        text: 'A CV/resume (.pdf, .doc, .docx) is mandatory before applying.',
      });
      return;
    }

    try {
      setApplyLoading(true);
      setApplyFeedback({ type: '', text: '' });

      const formData = new FormData();
      formData.append('jobId', selectedJob._id);
      formData.append('coverLetter', coverLetter);
      formData.append('cv', cvFile);

      const res = await applicationAPI.createApplication(formData);

      if (res.data.success) {
        setApplyFeedback({
          type: 'success',
          text: 'Application submitted successfully with your CV. Updated in your applications list.',
        });
        setTimeout(() => {
          setSelectedJob(null);
          setApplyFeedback({ type: '', text: '' });
          setCvFile(null);
          setCoverLetter('');
          fetchDashboardData();
        }, 1400);
      }
    } catch (err) {
      console.error('Error applying for recommended job:', err);
      setApplyFeedback({
        type: 'error',
        text: err.response?.data?.message || 'Failed to submit application.',
      });
    } finally {
      setApplyLoading(false);
    }
  };

  return (
    <div>
      {/* Dashboard Banner Header */}
      <div className="dashboard-header">
        <div className="container">
          <div className="dashboard-title-row">
            <div>
              <span className="hero-pill" style={{ marginBottom: '8px' }}>
                Student Career Hub
              </span>
              <h1 className="dashboard-heading">Welcome, {user?.name}</h1>
              <p className="dashboard-subheading">
                Monitor your active applications, review recommendations, and track status updates in real time.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <Link to="/jobs" className="btn btn-primary btn-sm">
                Browse Jobs
              </Link>
              <Link to="/student/applications" className="btn btn-secondary btn-sm">
                My Applications
              </Link>
              <Link to="/student/profile" className="btn btn-secondary btn-sm">
                Edit Profile
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '56px' }}>
        {/* Profile Summary Card */}
        <div className="card" style={{ padding: '20px 24px', marginBottom: '28px', backgroundColor: '#FFFFFF' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {user?.name ? user.name[0].toUpperCase() : 'S'}
              </div>
              <div>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--navy-dark)', margin: 0 }}>
                  {user?.name}
                </h2>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {user?.email} • {user?.education || 'University Candidate'}
                </div>
                {user?.skills && user.skills.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px' }}>
                    {user.skills.map((sk, idx) => (
                      <span key={idx} className="skill-tag" style={{ fontSize: '0.6875rem', padding: '1px 6px' }}>
                        {sk}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <Link to="/student/profile" className="btn btn-secondary btn-sm">
                Update Profile &amp; Skills &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total Applications</span>
          </div>

          <div className="stat-card">
            <span className="stat-value" style={{ color: 'var(--color-warning)' }}>{stats.pending}</span>
            <span className="stat-label">Pending</span>
          </div>

          <div className="stat-card">
            <span className="stat-value" style={{ color: 'var(--color-info)' }}>{stats.underReview}</span>
            <span className="stat-label">Under Review</span>
          </div>

          <div className="stat-card">
            <span className="stat-value" style={{ color: 'var(--color-purple)' }}>{stats.shortlisted}</span>
            <span className="stat-label">Shortlisted</span>
          </div>

          <div className="stat-card">
            <span className="stat-value" style={{ color: 'var(--color-success)' }}>{stats.accepted}</span>
            <span className="stat-label">Accepted</span>
          </div>

          <div className="stat-card">
            <span className="stat-value" style={{ color: 'var(--color-error)' }}>{stats.rejected}</span>
            <span className="stat-label">Rejected</span>
          </div>
        </div>

        {/* Recommended Opportunities Section */}
        {recommendedJobs.length > 0 && (
          <div style={{ marginTop: '36px', marginBottom: '36px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span className="section-tag">Matched For You</span>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--navy-dark)', margin: 0 }}>
                  Recommended Opportunities
                </h2>
              </div>
              <Link to="/jobs" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                Explore All Roles &rarr;
              </Link>
            </div>

            <div className="jobs-grid">
              {recommendedJobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  onApplyClick={(j) => {
                    setSelectedJob(j);
                    setCoverLetter('');
                    setApplyFeedback({ type: '', text: '' });
                  }}
                  isStudent={true}
                  hasApplied={false}
                />
              ))}
            </div>
          </div>
        )}

        {/* Recent Applications Section */}
        <div style={{ marginTop: '36px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--navy-dark)', margin: 0 }}>
              Recent Applications
            </h2>
            <Link to="/student/applications" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
              View All Applications ({applications.length}) &rarr;
            </Link>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading application records...</p>
            </div>
          ) : error ? (
            <div className="alert alert-error">{error}</div>
          ) : applications.length === 0 ? (
            <div className="empty-state">
              <h3 className="empty-state-title">No applications submitted yet</h3>
              <p className="empty-state-text">
                Browse open opportunities and submit your credentials to begin your early career journey.
              </p>
              <Link to="/jobs" className="btn btn-primary btn-sm">
                Explore Available Roles
              </Link>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Job Title &amp; Company</th>
                      <th>Location</th>
                      <th>Applied On</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.slice(0, 5).map((app) => (
                      <tr key={app._id}>
                        <td>
                          {app.jobId ? (
                            <Link to={`/jobs/${app.jobId._id}`} style={{ fontWeight: 600, color: 'var(--navy-dark)' }}>
                              {app.jobId.title}
                            </Link>
                          ) : (
                            <span style={{ color: 'var(--text-secondary)' }}>Position Closed</span>
                          )}
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            {app.jobId?.company} • {app.jobId?.jobType}
                          </div>
                        </td>
                        <td>{app.jobId?.location || 'Remote'}</td>
                        <td>
                          {new Date(app.appliedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>
                        <td>
                          <StatusBadge status={app.status} />
                        </td>
                        <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            {app.jobId && (
                              <Link to={`/jobs/${app.jobId._id}`} className="btn btn-secondary btn-sm">
                                View Details
                              </Link>
                            )}
                            <button
                              onClick={() => setWithdrawTarget(app)}
                              className="btn btn-danger-outline btn-sm"
                              title="Withdraw application"
                            >
                              Withdraw
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {applications.length > 5 ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', padding: '12px 16px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Showing <strong>5</strong> of <strong>{applications.length}</strong> applications
                  </span>
                  <Link to="/student/applications" className="btn btn-secondary btn-sm">
                    View All {applications.length} Applications &rarr;
                  </Link>
                </div>
              ) : (
                applications.length > 0 && (
                  <div style={{ marginTop: '10px', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    Showing all {applications.length} application{applications.length === 1 ? '' : 's'}.
                  </div>
                )
              )}
            </>
          )}
        </div>
      </div>

      {/* Withdraw Modal */}
      <Modal
        isOpen={!!withdrawTarget}
        onClose={() => setWithdrawTarget(null)}
        title="Withdraw Application"
      >
        <p style={{ color: 'var(--text-main)', marginBottom: '14px', lineHeight: '1.6' }}>
          Are you sure you want to withdraw your application for{' '}
          <strong>{withdrawTarget?.jobId?.title || 'this role'}</strong> at{' '}
          <strong>{withdrawTarget?.jobId?.company}</strong>?
        </p>
        <p style={{ fontSize: '0.8125rem', color: 'var(--color-error)', marginBottom: '20px' }}>
          This action cannot be undone. The hiring team will be notified of your withdrawal.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setWithdrawTarget(null)}
            disabled={withdrawLoading}
          >
            Keep Application
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleWithdraw}
            disabled={withdrawLoading}
          >
            {withdrawLoading ? 'Withdrawing...' : 'Confirm Withdrawal'}
          </button>
        </div>
      </Modal>

      {/* Apply to Recommended Job Modal */}
      <Modal
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        title={selectedJob ? `Apply: ${selectedJob.title}` : 'Application'}
      >
        {selectedJob && (
          <form onSubmit={handleApplyRecommended}>
            <div style={{ marginBottom: '14px', padding: '12px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontWeight: 700, color: 'var(--navy-dark)' }}>{selectedJob.company}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                {selectedJob.location} • {selectedJob.jobType} {selectedJob.salary && `• ${formatSalary(selectedJob.salary)}`}
              </div>
            </div>

            {applyFeedback.text && (
              <div className={`alert ${applyFeedback.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                {applyFeedback.text}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">
                Applicant: {user?.name} ({user?.email})
              </label>
              <span className="form-hint">
                Skills attached: {user?.skills?.length ? user.skills.join(', ') : 'None specified in profile'}
              </span>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="recCvFile">
                Resume / CV <span style={{ color: 'var(--color-error)' }}>* (Mandatory)</span>
              </label>
              <input
                type="file"
                id="recCvFile"
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
              <label className="form-label" htmlFor="recCoverLetter">
                Cover Letter / Statement of Interest (Optional)
              </label>
              <textarea
                id="recCoverLetter"
                className="form-control"
                rows="4"
                placeholder="Briefly state your qualifications and why this position aligns with your career goals..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedJob(null)}
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
        )}
      </Modal>
    </div>
  );
};

export default StudentDashboard;
