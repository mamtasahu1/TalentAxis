import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();

  // Admin section has its own full-height dedicated sidebar and layout
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Column 1: Brand & Mission */}
          <div>
            <div className="footer-brand">
              <span className="brand-mark" style={{ width: '24px', height: '24px', fontSize: '0.75rem' }}>
                T
              </span>
              <span>TalentAxis</span>
            </div>
            <p className="footer-desc">
              TalentAxis connects students and early talent with verified internships and career opportunities across leading technology and engineering teams.
            </p>
          </div>

          {/* Column 2: Opportunities */}
          <div>
            <h4 className="footer-heading">Opportunities</h4>
            <ul className="footer-links">
              <li>
                <Link to="/jobs">All Opportunities</Link>
              </li>
              <li>
                <Link to="/companies">Hiring Companies</Link>
              </li>
              <li>
                <Link to="/jobs?jobType=Internship">Internships</Link>
              </li>
              <li>
                <Link to="/jobs?jobType=Full-time">Full-Time Positions</Link>
              </li>
              <li>
                <Link to="/jobs?jobType=Remote">Remote Roles</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform */}
          <div>
            <h4 className="footer-heading">Platform</h4>
            <ul className="footer-links">
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/contact">Contact Support</Link>
              </li>
              <li>
                <Link to="/register">Student Registration</Link>
              </li>
              <li>
                <Link to="/login">Account Login</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: For Employers */}
          <div>
            <h4 className="footer-heading">For Employers</h4>
            <p className="footer-desc" style={{ fontSize: '0.8125rem' }}>
              Partner with TalentAxis to discover top early talent, recruit high-performing interns, and streamline your hiring pipeline.
            </p>
            <div style={{ fontSize: '0.8125rem', color: '#94A3B8' }}>
              Verified candidates, transparent tracking, and comprehensive recruitment tools.
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div>
            &copy; {new Date().getFullYear()} TalentAxis. All rights reserved.
          </div>
          <div>
            <span>Professional Recruitment &amp; Early Talent Platform</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
