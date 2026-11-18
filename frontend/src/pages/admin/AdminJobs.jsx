import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { jobAPI } from '../../services/api';
import Modal from '../../components/Modal';
import Pagination from '../../components/Pagination';

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await jobAPI.getJobs();
      if (res.data.success) {
        setJobs(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Unable to load job postings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDeleteJob = async () => {
    if (!deleteTarget) return;

    try {
      setDeleteLoading(true);
      const res = await jobAPI.deleteJob(deleteTarget._id);
      if (res.data.success) {
        setJobs((prev) => prev.filter((j) => j._id !== deleteTarget._id));
        setFeedback({
          type: 'success',
          text: `"${deleteTarget.title}" was successfully deleted.`,
        });
        setDeleteTarget(null);
        setTimeout(() => setFeedback({ type: '', text: '' }), 3000);
      }
    } catch (err) {
      console.error('Error deleting job:', err);
      alert(err.response?.data?.message || 'Failed to delete job posting.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchSearch =
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchType = typeFilter === 'All' || job.jobType === typeFilter;

      return matchSearch && matchType;
    });
  }, [jobs, searchTerm, typeFilter]);

  // Paginated jobs
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Open';
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
      {/* Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--navy-dark)', marginBottom: '4px' }}>
            Job Postings Directory
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Publish, edit, and maintain active opportunities across all partner organizations.
          </p>
        </div>
        <Link to="/admin/jobs/create" className="btn btn-primary btn-sm">
          + Create New Job
        </Link>
      </div>

      {feedback.text && (
        <div className={`alert ${feedback.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          {feedback.text}
        </div>
      )}

      {error && <div className="alert alert-error">{error}</div>}

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '10px', flex: 1, minWidth: '240px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search by title, company, or location..."
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
              Type:
            </span>
            {['All', 'Internship', 'Full-time', 'Part-time', 'Remote'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  setTypeFilter(type);
                  setCurrentPage(1);
                }}
                className={`btn btn-sm ${typeFilter === type ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: 'var(--radius-full)' }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Data Table */}
      {loading ? (
        <div className="loading-container" style={{ minHeight: '40vh' }}>
          <div className="spinner"></div>
          <p>Loading job postings...</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="empty-state">
          <h3 className="empty-state-title">No job postings found</h3>
          <p className="empty-state-text">
            No opportunities match your current filter criteria.
          </p>
          <Link to="/admin/jobs/create" className="btn btn-primary btn-sm">
            Create First Job Posting
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
                  <th>Type</th>
                  <th>Compensation</th>
                  <th>Deadline</th>
                  <th>Skills</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedJobs.map((job) => (
                  <tr key={job._id}>
                    <td>
                      <strong style={{ color: 'var(--navy-dark)', display: 'block', fontSize: '0.875rem' }}>
                        {job.title}
                      </strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {job.company}
                      </span>
                    </td>
                    <td>{job.location}</td>
                    <td>
                      <span className="badge badge-primary">{job.jobType}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--navy-dark)' }}>
                        {job.salary || 'Competitive'}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8125rem', color: new Date(job.deadline) < new Date() ? 'var(--color-error)' : 'var(--text-secondary)' }}>
                        {formatDate(job.deadline)}
                      </span>
                    </td>
                    <td style={{ maxWidth: '180px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {job.skills?.slice(0, 3).map((sk, idx) => (
                          <span key={idx} className="skill-tag" style={{ fontSize: '0.6875rem', padding: '1px 5px' }}>
                            {sk}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <Link
                          to={`/jobs/${job._id}`}
                          className="btn btn-secondary btn-sm"
                          title="View public details"
                        >
                          View
                        </Link>
                        <Link
                          to={`/admin/jobs/${job._id}/edit`}
                          className="btn btn-secondary btn-sm"
                          title="Edit job posting"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(job)}
                          className="btn btn-danger-outline btn-sm"
                          title="Delete posting"
                        >
                          Delete
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
            totalItems={filteredJobs.length}
            itemsPerPage={itemsPerPage}
            itemName="job postings"
          />
        </>
      )}

      {/* Delete Job Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Confirm Delete Job"
      >
        <p style={{ color: 'var(--text-main)', marginBottom: '14px', lineHeight: '1.6' }}>
          Are you sure you want to permanently delete <strong>{deleteTarget?.title}</strong> at{' '}
          <strong>{deleteTarget?.company}</strong>?
        </p>
        <p style={{ fontSize: '0.8125rem', color: 'var(--color-error)', marginBottom: '20px' }}>
          Deleting this posting permanently removes the opportunity and all candidate applications associated with it.
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
            onClick={handleDeleteJob}
            disabled={deleteLoading}
          >
            {deleteLoading ? 'Deleting...' : 'Delete Job'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminJobs;
