import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="section-py">
      <div className="container">
        {/* Header */}
        <div className="section-header" style={{ marginBottom: '48px' }}>
          <span className="section-tag">About TalentAxis</span>
          <h1 className="section-title">Connecting Early Talent with Opportunity</h1>
          <p className="section-subtitle">
            TalentAxis is a dedicated recruitment portal that provides a clear, transparent bridge between students, early-career job seekers, and hiring organizations.
          </p>
        </div>

        {/* Purpose & Platform */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center', marginBottom: '56px' }}>
          <div>
            <h2 style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--navy-dark)', marginBottom: '14px' }}>
              The Purpose of TalentAxis
            </h2>
            <p style={{ color: 'var(--text-main)', lineHeight: '1.6', marginBottom: '14px', fontSize: '0.9375rem' }}>
              Students and graduates often face hurdles finding genuine entry-level opportunities amid crowded general job boards. TalentAxis is structured specifically to highlight internships, co-ops, and early technical career paths.
            </p>
            <p style={{ color: 'var(--text-main)', lineHeight: '1.6', marginBottom: '20px', fontSize: '0.9375rem' }}>
              By centralizing verified postings and providing real-time application tracking, TalentAxis eliminates uncertainty in the recruitment process and allows candidates to manage their applications systematically.
            </p>
            <Link to="/jobs" className="btn btn-primary btn-sm">
              Browse Available Roles &rarr;
            </Link>
          </div>

          <div className="card" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '16px', color: 'var(--navy-dark)' }}>
              Core Platform Objectives
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <li style={{ borderLeft: '3px solid var(--primary)', paddingLeft: '12px' }}>
                <strong style={{ color: 'var(--navy-dark)', fontSize: '0.9375rem', display: 'block' }}>Early Career Focus</strong>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  Opportunities organized by internships, full-time junior positions, and remote options.
                </span>
              </li>
              <li style={{ borderLeft: '3px solid var(--primary)', paddingLeft: '12px' }}>
                <strong style={{ color: 'var(--navy-dark)', fontSize: '0.9375rem', display: 'block' }}>Verified Opportunities</strong>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  Every opportunity is directly curated and validated to ensure legitimate career pathways for candidates.
                </span>
              </li>
              <li style={{ borderLeft: '3px solid var(--primary)', paddingLeft: '12px' }}>
                <strong style={{ color: 'var(--navy-dark)', fontSize: '0.9375rem', display: 'block' }}>Application Transparency</strong>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  Real-time status progression from Pending to Under Review, Shortlisted, and Accepted.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Platform Commitment */}
        <div className="card" style={{ textAlign: 'center', padding: '36px' }}>
          <span className="badge badge-primary" style={{ marginBottom: '10px' }}>
            Our Commitment
          </span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--navy-dark)', marginBottom: '10px' }}>
            Setting a Higher Standard for Early Career Hiring
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto 20px', lineHeight: '1.6', fontSize: '0.875rem' }}>
            TalentAxis empowers candidates with direct access to decision-makers, actionable feedback on applications, and equal opportunities to showcase their abilities.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span className="skill-tag">Direct Applications</span>
            <span className="skill-tag">Transparent Review</span>
            <span className="skill-tag">Verified Employers</span>
            <span className="skill-tag">Skill-Based Matching</span>
            <span className="skill-tag">Privacy Protected</span>
            <span className="skill-tag">Real-Time Updates</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
