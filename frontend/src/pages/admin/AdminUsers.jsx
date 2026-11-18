import React, { useState, useEffect, useMemo } from 'react';
import { userAPI } from '../../services/api';
import Pagination from '../../components/Pagination';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await userAPI.getAllUsers();
        if (res.data.success) {
          setUsers(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching registered users:', err);
        setError('Unable to load registered user accounts.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.education?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchRole = roleFilter === 'All' || u.role === roleFilter;

      return matchSearch && matchRole;
    });
  }, [users, searchTerm, roleFilter]);

  // Paginated users
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
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

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--navy-dark)', marginBottom: '4px' }}>
          Registered Members Directory
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Overview of registered university students and platform administrator accounts.
        </p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '10px', flex: 1, minWidth: '240px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search by name, email, or university..."
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
              Role:
            </span>
            {['All', 'student', 'admin'].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => {
                  setRoleFilter(role);
                  setCurrentPage(1);
                }}
                className={`btn btn-sm ${roleFilter === role ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: 'var(--radius-full)' }}
              >
                {role === 'All' ? 'All Roles' : role === 'student' ? 'Students' : 'Administrators'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Content */}
      {loading ? (
        <div className="loading-container" style={{ minHeight: '40vh' }}>
          <div className="spinner"></div>
          <p>Loading member directory...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="empty-state">
          <h3 className="empty-state-title">No members found</h3>
          <p className="empty-state-text">No registered accounts match your current search.</p>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Member Name</th>
                  <th>Email Address</th>
                  <th>Role</th>
                  <th>Academic / Professional Background</th>
                  <th>Skills</th>
                  <th style={{ textAlign: 'right' }}>Joined</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: u.role === 'admin' ? 'var(--navy-dark)' : 'var(--primary)',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.8125rem',
                            flexShrink: 0,
                          }}
                        >
                          {u.name ? u.name[0].toUpperCase() : 'U'}
                        </div>
                        <strong style={{ color: 'var(--navy-dark)', fontSize: '0.875rem' }}>
                          {u.name}
                        </strong>
                      </div>
                    </td>

                    <td style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>
                      {u.email}
                    </td>

                    <td>
                      <span
                        className="badge"
                        style={{
                          backgroundColor: u.role === 'admin' ? '#EDE9FE' : '#EFF6FF',
                          color: u.role === 'admin' ? '#6D28D9' : 'var(--primary)',
                          border: `1px solid ${u.role === 'admin' ? '#DDD6FE' : 'var(--border)'}`,
                          textTransform: 'capitalize',
                        }}
                      >
                        {u.role}
                      </span>
                    </td>

                    <td style={{ maxWidth: '240px', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                      {u.education || 'Not specified'}
                    </td>

                    <td style={{ maxWidth: '220px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {u.skills?.length ? (
                          u.skills.slice(0, 4).map((sk, idx) => (
                            <span key={idx} className="skill-tag" style={{ fontSize: '0.6875rem', padding: '1px 5px' }}>
                              {sk}
                            </span>
                          ))
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>None listed</span>
                        )}
                        {u.skills?.length > 4 && (
                          <span style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
                            +{u.skills.length - 4}
                          </span>
                        )}
                      </div>
                    </td>

                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                      {formatDate(u.createdAt)}
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
            totalItems={filteredUsers.length}
            itemsPerPage={itemsPerPage}
            itemName="registered members"
          />
        </>
      )}
    </div>
  );
};

export default AdminUsers;
