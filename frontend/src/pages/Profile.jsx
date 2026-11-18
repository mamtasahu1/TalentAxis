import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';

const Profile = () => {
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    skills: user?.skills ? user.skills.join(', ') : '',
    education: user?.education || '',
  });

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  // Password change state
  const [pwdData, setPwdData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdFeedback, setPwdFeedback] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        skills: user.skills ? user.skills.join(', ') : '',
        education: user.education || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: '', text: '' });

    if (!formData.name.trim() || !formData.email.trim()) {
      setFeedback({
        type: 'error',
        text: 'Full name and email address are required.',
      });
      return;
    }

    try {
      setLoading(true);
      await updateProfile({
        name: formData.name.trim(),
        email: formData.email.trim(),
        skills: formData.skills,
        education: formData.education,
      });

      setFeedback({
        type: 'success',
        text: 'Profile updated successfully.',
      });
    } catch (err) {
      console.error('Profile update error:', err);
      setFeedback({
        type: 'error',
        text: err.response?.data?.message || err.message || 'Failed to update profile.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePwdChange = (e) => {
    setPwdData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwdFeedback({ type: '', text: '' });

    if (!pwdData.currentPassword || !pwdData.newPassword || !pwdData.confirmPassword) {
      setPwdFeedback({
        type: 'error',
        text: 'All password fields are required.',
      });
      return;
    }

    if (pwdData.newPassword.length < 6) {
      setPwdFeedback({
        type: 'error',
        text: 'New password must be at least 6 characters long.',
      });
      return;
    }

    if (pwdData.newPassword !== pwdData.confirmPassword) {
      setPwdFeedback({
        type: 'error',
        text: 'New password and confirmation do not match.',
      });
      return;
    }

    try {
      setPwdLoading(true);
      const res = await userAPI.changePassword({
        currentPassword: pwdData.currentPassword,
        newPassword: pwdData.newPassword,
        confirmPassword: pwdData.confirmPassword,
      });

      if (res.data.success) {
        setPwdFeedback({
          type: 'success',
          text: 'Password changed successfully.',
        });
        setPwdData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    } catch (err) {
      console.error('Password change error:', err);
      setPwdFeedback({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update password. Please check your current password.',
      });
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <div className="section-py">
      <div className="container container-narrow">
        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <span className="hero-pill" style={{ marginBottom: '8px' }}>
            Account Settings
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--navy-dark)', marginBottom: '4px' }}>
            Student Profile
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            Manage your personal profile, university degree, and technical competencies.
          </p>
        </div>

        {/* Profile Card */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingBottom: '20px', marginBottom: '20px', borderBottom: '1px solid var(--border)' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 700,
              }}
            >
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--navy-dark)', marginBottom: '2px' }}>
                {user?.name}
              </h2>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                {user?.email} • Role: <strong>{user?.role === 'admin' ? 'Administrator' : 'Student'}</strong>
              </span>
            </div>
          </div>

          {feedback.text && (
            <div className={`alert ${feedback.type === 'success' ? 'alert-success' : 'alert-error'}`}>
              {feedback.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="education">
                Education / University / Degree
              </label>
              <input
                type="text"
                id="education"
                name="education"
                className="form-control"
                placeholder="e.g. B.S. in Computer Science, Year 3"
                value={formData.education}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="skills">
                Technical Skills (comma-separated)
              </label>
              <input
                type="text"
                id="skills"
                name="skills"
                className="form-control"
                placeholder="e.g. JavaScript, Python, SQL, Git, Figma"
                value={formData.skills}
                onChange={handleChange}
              />
              <span className="form-hint">
                Separate skills with a comma. These are visible to recruiters on your applications.
              </span>
            </div>

            {user?.skills && user.skills.length > 0 && (
              <div style={{ marginTop: '12px', marginBottom: '20px' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Current Active Skills:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {user.skills.map((s, idx) => (
                    <span key={idx} className="skill-tag">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  if (user) {
                    setFormData({
                      name: user.name || '',
                      email: user.email || '',
                      skills: user.skills ? user.skills.join(', ') : '',
                      education: user.education || '',
                    });
                    setFeedback({ type: '', text: '' });
                  }
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Password Security Card */}
        <div className="card" style={{ marginTop: '28px' }}>
          <div style={{ paddingBottom: '16px', marginBottom: '20px', borderBottom: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--navy-dark)', marginBottom: '4px' }}>
              Change Password
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
              Ensure your account is using a secure password of at least 6 characters.
            </p>
          </div>

          {pwdFeedback.text && (
            <div className={`alert ${pwdFeedback.type === 'success' ? 'alert-success' : 'alert-error'}`}>
              {pwdFeedback.text}
            </div>
          )}

          <form onSubmit={handlePasswordSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="currentPassword">
                Current Password *
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                className="form-control"
                placeholder="Enter current password"
                value={pwdData.currentPassword}
                onChange={handlePwdChange}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="newPassword">
                  New Password *
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  className="form-control"
                  placeholder="At least 6 characters"
                  value={pwdData.newPassword}
                  onChange={handlePwdChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="confirmPassword">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="form-control"
                  placeholder="Re-enter new password"
                  value={pwdData.confirmPassword}
                  onChange={handlePwdChange}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setPwdData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  setPwdFeedback({ type: '', text: '' });
                }}
              >
                Clear
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={pwdLoading}
              >
                {pwdLoading ? 'Updating Password...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
