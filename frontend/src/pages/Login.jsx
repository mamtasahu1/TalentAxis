import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectPath = location.state?.from?.pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setLoading(true);
      const user = await login(email.trim(), password);

      if (redirectPath) {
        navigate(redirectPath, { replace: true });
      } else if (user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/student/dashboard', { replace: true });
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const fillStudentDemo = () => {
    setEmail('student@talentaxis.com');
    setPassword('password123');
    setError('');
  };

  const fillAdminDemo = () => {
    setEmail('admin@talentaxis.com');
    setPassword('password123');
    setError('');
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">TalentAxis Login</h1>
            <p className="auth-subtitle">Sign in to your account</p>
          </div>

          {/* Quick Demo Fill Credentials Box */}
          <div className="demo-credentials-box">
            <div className="demo-title">Explore With Demo Accounts</div>
            <div className="demo-buttons-row">
              <button
                type="button"
                onClick={fillStudentDemo}
                className="btn btn-secondary btn-sm"
                style={{ flex: 1 }}
              >
                Student Demo
              </button>
              <button
                type="button"
                onClick={fillAdminDemo}
                className="btn btn-secondary btn-sm"
                style={{ flex: 1 }}
              >
                Admin Demo
              </button>
            </div>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="loginEmail">
                Email Address
              </label>
              <input
                type="email"
                id="loginEmail"
                className="form-control"
                placeholder="name@talentaxis.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="loginPassword">
                Password
              </label>
              <input
                type="password"
                id="loginPassword"
                className="form-control"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '8px' }}
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Need a student account?{' '}
            <Link to="/register" style={{ fontWeight: 600 }}>
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
