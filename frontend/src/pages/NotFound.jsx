import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="section-py" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--navy-dark)', marginBottom: '8px' }}>
          404
        </h1>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--navy-dark)', marginBottom: '8px' }}>
          Page Not Found
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto 24px', fontSize: '0.9375rem' }}>
          The requested page could not be located on the TalentAxis portal.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <Link to="/" className="btn btn-primary btn-sm">
            Return to Homepage
          </Link>
          <Link to="/jobs" className="btn btn-secondary btn-sm">
            Browse Jobs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
