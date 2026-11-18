import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, isAuthenticated, isStudent, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="container navbar-container">
        {/* Brand: TalentAxis */}
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <div className="brand-mark">T</div>
          <span>
            Talent<span className="brand-accent">Axis</span>
          </span>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="nav-toggle-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? 'Close' : 'Menu'}
        </button>

        {/* Dynamic Nav Links */}
        <ul className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
          {/* Public / Unauthenticated */}
          {!isAuthenticated && (
            <>
              <li>
                <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={closeMenu} end>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/jobs" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={closeMenu}>
                  Find Jobs
                </NavLink>
              </li>
              <li>
                <NavLink to="/companies" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={closeMenu}>
                  Companies
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={closeMenu}>
                  About Us
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={closeMenu}>
                  Contact Us
                </NavLink>
              </li>
            </>
          )}

          {/* Student Navigation */}
          {isAuthenticated && isStudent && (
            <>
              <li>
                <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={closeMenu} end>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/jobs" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={closeMenu}>
                  Find Jobs
                </NavLink>
              </li>
              <li>
                <NavLink to="/companies" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={closeMenu}>
                  Companies
                </NavLink>
              </li>
              <li>
                <NavLink to="/student/dashboard" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={closeMenu}>
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink to="/student/applications" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={closeMenu}>
                  My Applications
                </NavLink>
              </li>
              <li>
                <NavLink to="/student/profile" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={closeMenu}>
                  Profile
                </NavLink>
              </li>
            </>
          )}

          {/* Admin Navigation */}
          {isAuthenticated && isAdmin && (
            <>
              <li>
                <NavLink to="/admin/dashboard" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={closeMenu} end>
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/jobs" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={closeMenu}>
                  Manage Jobs
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/applications" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={closeMenu}>
                  Applications
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/users" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={closeMenu}>
                  Users
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/contacts" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={closeMenu}>
                  Inquiries
                </NavLink>
              </li>
            </>
          )}

          {/* Right Action Buttons */}
          <li className="nav-actions" style={{ marginLeft: '8px' }}>
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="btn btn-secondary btn-sm" onClick={closeMenu}>
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm" onClick={closeMenu}>
                  Register
                </Link>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <NotificationBell />
                <div className="user-badge">
                  <div className="user-avatar">
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <div className="user-info">
                    <span className="user-name">{user?.name}</span>
                    <span className="user-role-label">
                      {user?.role === 'admin' ? 'Administrator' : 'Student'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn btn-secondary btn-sm"
                  title="Sign out"
                >
                  Logout
                </button>
              </div>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
