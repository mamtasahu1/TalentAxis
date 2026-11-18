import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { applicationAPI } from '../../services/api';
import Modal from '../../components/Modal';
import Pagination from '../../components/Pagination';

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Status updating state
  const [statusLoadingId, setStatusLoadingId] = useState(null);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  // Detail Modal state
  const [activeApp, setActiveApp] = useState(null);

  // Delete target modal
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await applicationAPI.getApplications();
      if (res.data.success) {
        setApplications(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Unable to load candidate applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      setStatusLoadingId(appId);
      setFeedback({ type: '', text: '' });

      const res = await applicationAPI.updateApplicationStatus(appId, {
        status: newStatus,
      });

      if (res.data.success) {
        setApplications((prev) =>
          prev.map((app) => (app._id === appId ? res.data.data : app))
        );
        setFeedback({
          type: 'success',
          text: `Application status updated to "${newStatus}".`,
        });
        setTimeout(() => setFeedback({ type: '', text: '' }), 2500);
      }
    } catch (err) {
      console.error('Error updating status:', err);
      setFeedback({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update application status.',
      });
    } finally {
      setStatusLoadingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleteLoading(true);
      const res = await applicationAPI.deleteApplication(deleteTarget._id);
      if (res.data.success) {
        setApplications((prev) => prev.filter((a) => a._id !== deleteTarget._id));
        setFeedback({
          type: 'success',
          text: 'Application record removed successfully.',
        });
        setDeleteTarget(null);
        setTimeout(() => setFeedback({ type: '', text: '' }), 2500);
      }
    } catch (err) {
      console.error('Error removing application:', err);
      alert(err.response?.data?.message || 'Failed to remove application record.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Filtered applications
  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      const matchSearch =
        app.studentId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.studentId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.jobId?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.jobId?.company?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === 'All' || app.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [applications, searchTerm, statusFilter]);

  // Paginated applications
  const totalPages = Math.ceil(filteredApps.length / itemsPerPage);
  const paginatedApps = filteredApps.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const statuses = ['All', 'Pending', 'Under Review', 'Shortlisted', 'Accepted', 'Rejected'];

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--navy-dark)', marginBottom: '4px' }}>
          Candidate Applications
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Review candidate qualifications, cover statements, and update recruitment evaluation statuses.
        </p>
      </div>

      {feedback.text && (
        <div className={`alert ${feedback.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          {feedback.text}
        </div>
      )}

      {error && <div className="alert alert-error">{error}</div>}

      {/* Search and Filters */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '10px', flex: 1, minWidth: '240px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search by candidate name, email, or role..."
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
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Content */}
      {loading ? (
        <div className="loading-container" style={{ minHeight: '40vh' }}>
          <div className="spinner"></div>
          <p>Loading candidate applications...</p>
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="empty-state">
          <h3 className="empty-state-title">No candidate applications found</h3>
          <p className="empty-state-text">
            {statusFilter === 'All'
              ? 'No candidate applications have been submitted yet.'
              : `No applications currently match the status "${statusFilter}".`}
          </p>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Applicant Details</th>
                  <th>Applied Position</th>
                  <th>Education &amp; Skills</th>
                  <th>Statement</th>
                  <th>Applied Date</th>
                  <th>Application Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedApps.map((app) => (
                  <tr key={app._id}>
                    <td>
                      <strong style={{ color: 'var(--navy-dark)', display: 'block', fontSize: '0.875rem' }}>
                        {app.studentId?.name || 'Applicant'}
                      </strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {app.studentId?.email}
                      </span>
                    </td>

                    <td>
                      {app.jobId ? (
                        <Link to={`/jobs/${app.jobId._id}`} style={{ fontWeight: 600, color: 'var(--primary)' }}>
                          {app.jobId.title}
                        </Link>
                      ) : (
                        <span style={{ color: 'var(--text-secondary)' }}>Position Closed</span>
                      )}
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {app.jobId?.company}
                      </div>
                    </td>

                    <td style={{ maxWidth: '200px' }}>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: '4px' }}>
                        {app.studentId?.education || 'Not specified'}
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                        {app.studentId?.skills?.slice(0, 3).map((sk, idx) => (
                          <span key={idx} className="skill-tag" style={{ fontSize: '0.6875rem', padding: '1px 5px' }}>
                            {sk}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td style={{ maxWidth: '220px' }}>
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
                        {app.coverLetter || 'No cover statement provided.'}
                      </span>
                    </td>

                    <td style={{ whiteSpace: 'nowrap', fontSize: '0.8125rem' }}>
                      {formatDate(app.appliedAt)}
                    </td>

                    <td>
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app._id, e.target.value)}
                        disabled={statusLoadingId === app._id}
                        className="form-select"
                        style={{
                          padding: '4px 8px',
                          fontSize: '0.8125rem',
                          borderRadius: 'var(--radius-sm)',
                          fontWeight: 600,
                          backgroundColor:
                            app.status === 'Accepted'
                              ? '#DCFCE7'
                              : app.status === 'Shortlisted'
                              ? '#F3E8FF'
                              : app.status === 'Rejected'
                              ? '#FEE2E2'
                              : '#F1F5F9',
                          color:
                            app.status === 'Accepted'
                              ? '#166534'
                              : app.status === 'Shortlisted'
                              ? '#6B21A8'
                              : app.status === 'Rejected'
                              ? '#991B1B'
                              : '#1E293B',
                          border: '1px solid var(--border)',
                        }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>

                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => setActiveApp(app)}
                          className="btn btn-secondary btn-sm"
                          title="View complete application statement"
                        >
                          Details
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(app)}
                          className="btn btn-danger-outline btn-sm"
                          title="Remove record"
                        >
                          Remove
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
            totalItems={filteredApps.length}
            itemsPerPage={itemsPerPage}
            itemName="applications"
          />
        </>
      )}

      {/* Candidate Details Modal */}
      <Modal
        isOpen={!!activeApp}
        onClose={() => setActiveApp(null)}
        title="Application Review"
        size="lg"
      >
        {activeApp && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px', padding: '16px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Candidate</span>
                <strong style={{ color: 'var(--navy-dark)', fontSize: '0.9375rem' }}>{activeApp.studentId?.name}</strong>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{activeApp.studentId?.email}</div>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Applied Position</span>
                <strong style={{ color: 'var(--primary)', fontSize: '0.9375rem' }}>{activeApp.jobId?.title}</strong>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{activeApp.jobId?.company} • {activeApp.jobId?.jobType}</div>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Academic Background</span>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--navy-dark)' }}>
                {activeApp.studentId?.education || 'No academic details provided.'}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Candidate Skills</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {activeApp.studentId?.skills?.length ? (
                  activeApp.studentId.skills.map((sk, idx) => (
                    <span key={idx} className="skill-tag">
                      {sk}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>No skills listed.</span>
                )}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Uploaded CV / Resume</span>
              {activeApp.cvPath ? (
                <a
                  href={`/uploads/cvs/${activeApp.cvPath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 600 }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                  View / Download CV ({activeApp.cvOriginalName || activeApp.cvPath})
                </a>
              ) : (
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>No CV file attached to this record</span>
              )}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Cover Letter / Statement of Interest</span>
              <div
                style={{
                  padding: '14px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                  lineHeight: '1.6',
                  color: 'var(--text-main)',
                  whiteSpace: 'pre-line',
                }}
              >
                {activeApp.coverLetter || 'No cover letter submitted.'}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setActiveApp(null)}
              >
                Close Dialog
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Application Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Remove Application Record"
      >
        <p style={{ color: 'var(--text-main)', marginBottom: '14px', lineHeight: '1.6' }}>
          Are you sure you wish to remove the application from{' '}
          <strong>{deleteTarget?.studentId?.name}</strong> for{' '}
          <strong>{deleteTarget?.jobId?.title}</strong>?
        </p>
        <p style={{ fontSize: '0.8125rem', color: 'var(--color-error)', marginBottom: '20px' }}>
          This action will permanently delete the application record.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setDeleteTarget(null)}
            disabled={deleteLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleDelete}
            disabled={deleteLoading}
          >
            {deleteLoading ? 'Removing...' : 'Confirm Removal'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminApplications;
