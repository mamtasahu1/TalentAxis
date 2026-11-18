import React, { useState, useEffect, useMemo } from 'react';
import { contactAPI } from '../../services/api';
import Modal from '../../components/Modal';
import Pagination from '../../components/Pagination';

const AdminContacts = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search
  const [searchTerm, setSearchTerm] = useState('');

  // Active Inquiry Modal
  const [activeMessage, setActiveMessage] = useState(null);

  // Delete Inquiry State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await contactAPI.getMessages();
        if (res.data.success) {
          setInquiries(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching contact messages:', err);
        setError('Unable to load contact submissions.');
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, []);

  // Filtered inquiries
  const filteredInquiries = useMemo(() => {
    return inquiries.filter((msg) => {
      return (
        msg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.message?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [inquiries, searchTerm]);

  // Paginated inquiries
  const totalPages = Math.ceil(filteredInquiries.length / itemsPerPage);
  const paginatedInquiries = filteredInquiries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  const handleDeleteMessage = async () => {
    if (!deleteTarget) return;

    try {
      setDeleteLoading(true);
      const res = await contactAPI.deleteMessage(deleteTarget._id);
      if (res.data.success) {
        setInquiries((prev) => prev.filter((msg) => msg._id !== deleteTarget._id));
        setFeedback({
          type: 'success',
          text: `Inquiry from "${deleteTarget.name}" deleted successfully.`,
        });
        setDeleteTarget(null);
        if (activeMessage?._id === deleteTarget._id) {
          setActiveMessage(null);
        }
        setTimeout(() => setFeedback({ type: '', text: '' }), 3000);
      }
    } catch (err) {
      console.error('Error deleting contact inquiry:', err);
      alert(err.response?.data?.message || 'Failed to delete contact inquiry.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--navy-dark)', marginBottom: '4px' }}>
          Contact Submissions
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Inquiries and support messages submitted through the public Contact Us portal.
        </p>
      </div>

      {feedback.text && (
        <div className={`alert ${feedback.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          {feedback.text}
        </div>
      )}

      {error && <div className="alert alert-error">{error}</div>}

      {/* Search Bar */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search messages by sender, email, or subject..."
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
      </div>

      {/* Table Content */}
      {loading ? (
        <div className="loading-container" style={{ minHeight: '40vh' }}>
          <div className="spinner"></div>
          <p>Loading contact messages...</p>
        </div>
      ) : filteredInquiries.length === 0 ? (
        <div className="empty-state">
          <h3 className="empty-state-title">No contact messages found</h3>
          <p className="empty-state-text">New contact inquiries from visitors will appear here.</p>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Sender</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th>Message Preview</th>
                  <th>Received Date</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedInquiries.map((inq) => (
                  <tr key={inq._id}>
                    <td>
                      <strong style={{ color: 'var(--navy-dark)', fontSize: '0.875rem' }}>
                        {inq.name}
                      </strong>
                    </td>

                    <td style={{ fontSize: '0.875rem' }}>
                      <a href={`mailto:${inq.email}`} style={{ color: 'var(--primary)', fontWeight: 500 }}>
                        {inq.email}
                      </a>
                    </td>

                    <td style={{ fontWeight: 600, color: 'var(--navy-dark)', maxWidth: '200px' }}>
                      {inq.subject}
                    </td>

                    <td style={{ maxWidth: '280px' }}>
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
                        {inq.message}
                      </span>
                    </td>

                    <td style={{ whiteSpace: 'nowrap', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                      {formatDate(inq.createdAt)}
                    </td>

                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => setActiveMessage(inq)}
                          className="btn btn-secondary btn-sm"
                          title="Read inquiry details"
                        >
                          Read
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(inq)}
                          className="btn btn-danger-outline btn-sm"
                          title="Delete contact inquiry"
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
            totalItems={filteredInquiries.length}
            itemsPerPage={itemsPerPage}
            itemName="messages"
          />
        </>
      )}

      {/* Read Message Modal */}
      <Modal
        isOpen={!!activeMessage}
        onClose={() => setActiveMessage(null)}
        title="Contact Inquiry"
      >
        {activeMessage && (
          <div>
            <div style={{ padding: '14px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <strong style={{ color: 'var(--navy-dark)' }}>{activeMessage.name}</strong>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  {formatDate(activeMessage.createdAt)}
                </span>
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                Email:{' '}
                <a href={`mailto:${activeMessage.email}`} style={{ color: 'var(--primary)', fontWeight: 600 }}>
                  {activeMessage.email}
                </a>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Subject
              </span>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--navy-dark)' }}>
                {activeMessage.subject}
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Full Message
              </span>
              <div
                style={{
                  padding: '16px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                  lineHeight: '1.6',
                  color: 'var(--text-main)',
                  whiteSpace: 'pre-line',
                }}
              >
                {activeMessage.message}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                className="btn btn-danger-outline btn-sm"
                onClick={() => {
                  setDeleteTarget(activeMessage);
                }}
              >
                Delete Inquiry
              </button>
              <a
                href={`mailto:${activeMessage.email}?subject=Re: ${encodeURIComponent(activeMessage.subject)}`}
                className="btn btn-primary btn-sm"
              >
                Reply via Email
              </a>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setActiveMessage(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Confirm Delete Contact Inquiry"
      >
        <p style={{ color: 'var(--text-main)', marginBottom: '14px', lineHeight: '1.6' }}>
          Are you sure you want to permanently delete the inquiry from{' '}
          <strong>{deleteTarget?.name}</strong> (<em>{deleteTarget?.email}</em>)?
        </p>
        <p style={{ fontSize: '0.8125rem', color: 'var(--color-error)', marginBottom: '20px' }}>
          Subject: "{deleteTarget?.subject}". This action cannot be undone.
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
            onClick={handleDeleteMessage}
            disabled={deleteLoading}
          >
            {deleteLoading ? 'Deleting...' : 'Delete Inquiry'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminContacts;
