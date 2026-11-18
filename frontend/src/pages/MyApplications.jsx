import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { applicationAPI } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import Pagination from '../components/Pagination';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Withdraw state
  const [withdrawTarget, setWithdrawTarget] = useState(null);
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await applicationAPI.getMyApplications();
      if (res.data.success) {
        setApplications(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Unable to fetch your application records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

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

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchSearch =
        app.jobId?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.jobId?.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.jobId?.location?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === 'All' || app.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [applications, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const paginatedApps = filteredApplications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const statuses = ['All', 'Pending', 'Under Review', 'Shortlisted', 'Accepted', 'Rejected'];

  return (
    <div className="section-py">
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <span className="hero-pill" style={{ marginBottom: '8px' }}>
              Student Portal
            </span>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--navy-dark)', marginBottom: '4px' }}>
              My Applications
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
              Track all your submitted job applications, interview progress, and recruiter status changes.
            </p>
          </div>
          <Link to="/jobs" className="btn btn-primary btn-sm">
            Find Opportunities
          </Link>
        </div>

        {/* Filter and Search Bar */}
        <div className="card" style={{ padding: '16px 20px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '10px', flex: 1, minWidth: '240px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search by job title or company..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                style={{ marginBottom: 0 }}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="btn btn-secondary btn-sm"
                >
                  Clear
                </button>
              )}
            </div>

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Status:
              </span>
              {statuses.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => {
                    setStatusFilter(st);
                    setCurrentPage(1);
                  }}
                  className={`btn btn-sm ${statusFilter === st ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ borderRadius: 'var(--radius-full)' }}
                >
                  {st} {st !== 'All' && `(${applications.filter((a) => a.status === st).length})`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading application records...</p>
          </div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : filteredApplications.length === 0 ? (
          <div className="empty-state">
            <h3 className="empty-state-title">No applications found</h3>
            <p className="empty-state-text">
              {statusFilter === 'All'
                ? "You haven't applied to any job postings yet."
                : `You currently have no applications with status '${statusFilter}'.`}
            </p>
            <Link to="/jobs" className="btn btn-primary btn-sm">
              Browse Open Opportunities
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
                    <th>Job Type</th>
                    <th>Applied On</th>
                    <th>Status</th>
                    <th>CV / Resume</th>
                    <th>Cover Statement</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedApps.map((app) => (
                    <tr key={app._id}>
                      <td>
                        {app.jobId ? (
                          <Link to={`/jobs/${app.jobId._id}`} style={{ fontWeight: 600, color: 'var(--navy-dark)' }}>
                            {app.jobId.title}
                          </Link>
                        ) : (
                          <span style={{ color: 'var(--text-secondary)' }}>Position Closed</span>
                        )}
                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                          {app.jobId?.company}
                        </div>
                      </td>
                      <td>{app.jobId?.location || 'Remote'}</td>
                      <td>
                        <span className="badge badge-primary">{app.jobId?.jobType || 'Internship'}</span>
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        {new Date(app.appliedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td>
                        <StatusBadge status={app.status} />
                      </td>
                      <td>
                        {app.cvPath ? (
                          <a
                            href={`/uploads/cvs/${app.cvPath}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.8125rem',
                              color: 'var(--primary)',
                              fontWeight: 600,
                            }}
                            title={app.cvOriginalName || 'Uploaded CV'}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <polyline points="14 2 14 8 20 8" />
                            </svg>
                            View CV
                          </a>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>None</span>
                        )}
                      </td>
                      <td style={{ maxWidth: '240px' }}>
                        <span
                          style={{
                            fontSize: '0.8125rem',
                            color: 'var(--text-secondary)',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {app.coverLetter || 'No cover statement submitted'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          {app.jobId && (
                            <Link to={`/jobs/${app.jobId._id}`} className="btn btn-secondary btn-sm">
                              View Job
                            </Link>
                          )}
                          <button
                            onClick={() => setWithdrawTarget(app)}
                            className="btn btn-danger-outline btn-sm"
                            title="Withdraw this application"
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

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
              totalItems={filteredApplications.length}
              itemsPerPage={itemsPerPage}
              itemName="applications"
            />
          </>
        )}
      </div>

      {/* Withdraw Modal */}
      <Modal
        isOpen={!!withdrawTarget}
        onClose={() => setWithdrawTarget(null)}
        title="Withdraw Application"
      >
        <p style={{ color: 'var(--text-main)', marginBottom: '14px', lineHeight: '1.6' }}>
          Are you sure you wish to withdraw your application for{' '}
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
            Cancel
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
    </div>
  );
};

export default MyApplications;
