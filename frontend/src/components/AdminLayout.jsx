import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jobAPI, applicationAPI, contactAPI, userAPI } from '../services/api';
import NotificationBell from './NotificationBell';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Badge counts
  const [counts, setCounts] = useState({
    jobs: 0,
    applications: 0,
    users: 0,
    contacts: 0,
  });

  useEffect(() => {
    // Fetch counts for sidebar badges
    const loadCounts = async () => {
      try {
        const [jobsRes, appsRes, usersRes, contactsRes] = await Promise.all([
          jobAPI.getJobs().catch(() => ({ data: { data: [] } })),
          applicationAPI.getApplications().catch(() => ({ data: { data: [] } })),
          userAPI.getAllUsers().catch(() => ({ data: { data: [] } })),
          contactAPI.getMessages().catch(() => ({ data: { data: [] } })),
        ]);

        setCounts({
          jobs: jobsRes.data?.data?.length || 0,
          applications: appsRes.data?.data?.length || 0,
          users: usersRes.data?.data?.length || 0,
          contacts: contactsRes.data?.data?.length || 0,
        });
      } catch (err) {
        console.error('Error fetching admin sidebar counts:', err);
      }
    };

    loadCounts();
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/admin/jobs/create')) return 'Create Job Posting';
    if (path.includes('/admin/jobs') && path.includes('edit')) return 'Edit Job Posting';
    if (path === '/admin/jobs') return 'Job Postings Directory';
    if (path.includes('/admin/applications')) return 'Candidate Applications';
    if (path.includes('/admin/users')) return 'Registered Users';
    if (path.includes('/admin/contact')) return 'Contact Submissions';
    return 'Recruitment Administration';
  };

  return (
    <div className="admin-shell">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-brand">
          <div className="brand-mark">T</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.01em', color: '#FFFFFF' }}>
              TalentAxis
            </span>
            <span style={{ fontSize: '0.6875rem', color: '#94A3B8' }}>
              Recruitment Portal
            </span>
          </div>
          <span className="admin-sidebar-badge">Admin</span>
        </div>

        <nav className="admin-sidebar-nav">
          <NavLink
            to="/admin/dashboard"
            end
            className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <span>Overview</span>
          </NavLink>

          <NavLink
            to="/admin/jobs"
            className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <span>Manage Jobs</span>
            {counts.jobs > 0 && <span className="admin-nav-count">{counts.jobs}</span>}
          </NavLink>

          <NavLink
            to="/admin/applications"
            className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <span>Applications</span>
            {counts.applications > 0 && <span className="admin-nav-count">{counts.applications}</span>}
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <span>Registered Users</span>
            {counts.users > 0 && <span className="admin-nav-count">{counts.users}</span>}
          </NavLink>

          <NavLink
            to="/admin/contacts"
            className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <span>Contact Messages</span>
            {counts.contacts > 0 && <span className="admin-nav-count">{counts.contacts}</span>}
          </NavLink>
        </nav>

        {/* Sidebar Footer with User Details & Logout */}
        <div className="admin-sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.875rem',
              }}
            >
              {user?.name ? user.name[0].toUpperCase() : 'A'}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.name}
              </div>
              <div style={{ fontSize: '0.6875rem', color: '#94A3B8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.email}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', borderColor: '#334155', color: '#CBD5E1', backgroundColor: '#1E293B' }}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Shell */}
      <div className="admin-main-wrapper">
        <header className="admin-topbar">
          <div className="admin-page-title-row">
            <button
              type="button"
              className="admin-mobile-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              Menu
            </button>
            <h1 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--navy-dark)', margin: 0 }}>
              {getPageTitle()}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <NotificationBell />
            <Link to="/admin/jobs/create" className="btn btn-primary btn-sm">
              + Post New Job
            </Link>
          </div>
        </header>

        <main className="admin-content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
