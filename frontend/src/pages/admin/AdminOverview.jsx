import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobAPI, applicationAPI, contactAPI, userAPI } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
    shortlistedApplications: 0,
    acceptedApplications: 0,
    totalStudents: 0,
    totalContacts: 0,
  });

  const [recentApplications, setRecentApplications] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        setLoading(true);
        setError('');

        const [jobsRes, appsRes, contactsRes, usersRes] = await Promise.all([
          jobAPI.getJobs(),
          applicationAPI.getApplications(),
          contactAPI.getMessages().catch(() => ({ data: { data: [] } })),
          userAPI.getAllUsers().catch(() => ({ data: { data: [] } })),
        ]);

        const allJobs = jobsRes.data?.data || [];
        const allApps = appsRes.data?.data || [];
        const allUsers = usersRes.data?.data || [];
        const allContacts = contactsRes.data?.data || [];

        const now = new Date();
        const activeJobsCount = allJobs.filter((j) => !j.deadline || new Date(j.deadline) >= now).length;
        const studentsCount = allUsers.filter((u) => u.role === 'student').length;

        setStats({
          totalJobs: allJobs.length,
          activeJobs: activeJobsCount,
          totalApplications: allApps.length,
          pendingApplications: allApps.filter((a) => a.status === 'Pending').length,
          shortlistedApplications: allApps.filter((a) => a.status === 'Shortlisted').length,
          acceptedApplications: allApps.filter((a) => a.status === 'Accepted').length,
          totalStudents: studentsCount,
          totalContacts: allContacts.length,
        });

        setRecentApplications(allApps.slice(0, 5));
        setRecentJobs(allJobs.slice(0, 5));
      } catch (err) {
        console.error('Error fetching admin overview data:', err);
        setError('Unable to load administration metrics. Please check server connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchOverviewData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container" style={{ minHeight: '50vh' }}>
        <div className="spinner"></div>
        <p>Loading administration overview...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header Banner */}
      <div style={{ marginBottom: '24px' }}>
        <span className="hero-pill" style={{ marginBottom: '6px' }}>
          Executive Overview
        </span>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--navy-dark)', marginBottom: '4px' }}>
          Recruitment Administration
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
          Key operational metrics, latest candidate submissions, and recent opportunity postings.
        </p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Summary Cards Grid */}
      <div className="stats-grid" style={{ marginBottom: '32px' }}>
        <div className="stat-card">
          <span className="stat-value">{stats.totalStudents}</span>
          <span className="stat-label">Registered Students</span>
        </div>

        <div className="stat-card">
          <span className="stat-value">{stats.totalJobs}</span>
          <span className="stat-label">Total Job Postings</span>
        </div>

        <div className="stat-card">
          <span className="stat-value" style={{ color: 'var(--primary)' }}>{stats.activeJobs}</span>
          <span className="stat-label">Active Openings</span>
        </div>

        <div className="stat-card">
          <span className="stat-value">{stats.totalApplications}</span>
          <span className="stat-label">Total Applications</span>
        </div>

        <div className="stat-card">
          <span className="stat-value" style={{ color: 'var(--color-warning)' }}>{stats.pendingApplications}</span>
          <span className="stat-label">Pending Reviews</span>
        </div>

        <div className="stat-card">
          <span className="stat-value" style={{ color: 'var(--color-purple)' }}>{stats.shortlistedApplications}</span>
          <span className="stat-label">Shortlisted</span>
        </div>

        <div className="stat-card">
          <span className="stat-value" style={{ color: 'var(--color-success)' }}>{stats.acceptedApplications}</span>
          <span className="stat-label">Accepted Candidates</span>
        </div>

        <div className="stat-card">
          <span className="stat-value">{stats.totalContacts}</span>
          <span className="stat-label">Inquiries Received</span>
        </div>
      </div>

      {/* Quick Actions & Platform Guidelines */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="card">
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '14px', color: 'var(--navy-dark)' }}>
            Quick Actions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link to="/admin/jobs/create" className="btn btn-primary btn-sm" style={{ justifyContent: 'flex-start' }}>
              + Post New Opportunity
            </Link>
            <Link to="/admin/applications" className="btn btn-secondary btn-sm" style={{ justifyContent: 'flex-start' }}>
              Review Candidate Applications ({stats.pendingApplications} Pending)
            </Link>
            <Link to="/admin/users" className="btn btn-secondary btn-sm" style={{ justifyContent: 'flex-start' }}>
              View Student Talent Directory
            </Link>
            <Link to="/admin/contacts" className="btn btn-secondary btn-sm" style={{ justifyContent: 'flex-start' }}>
              Review Contact Messages ({stats.totalContacts})
            </Link>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '14px', color: 'var(--navy-dark)' }}>
            Recruitment Standards
          </h3>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            <div>Status Transparency: <strong>Prompt feedback on all applicants</strong>.</div>
            <div style={{ marginTop: '8px' }}>Opportunity Quality: <strong>Verified job requirements and transparent stipends</strong>.</div>
            <div style={{ marginTop: '8px' }}>Access Control: <strong>Protected administrator-only management</strong>.</div>
            <div style={{ marginTop: '8px' }}>Candidate Protection: <strong>One application per candidate per role enforced</strong>.</div>
          </div>
        </div>
      </div>

      {/* Two Column Section: Recent Applications & Recent Postings */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Recent Applications */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--navy-dark)', margin: 0 }}>
              Recent Applications
            </h3>
            <Link to="/admin/applications" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
              View All ({stats.totalApplications}) &rarr;
            </Link>
          </div>

          {recentApplications.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              No applications submitted yet.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentApplications.map((app) => (
                <div
                  key={app._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    backgroundColor: 'var(--bg-subtle)',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  <div>
                    <strong style={{ color: 'var(--navy-dark)', fontSize: '0.875rem', display: 'block' }}>
                      {app.studentId?.name || 'Applicant'}
                    </strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {app.jobId?.title || 'Position'} • {app.jobId?.company}
                    </span>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recently Posted Jobs */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--navy-dark)', margin: 0 }}>
              Recent Job Postings
            </h3>
            <Link to="/admin/jobs" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
              Manage Jobs ({stats.totalJobs}) &rarr;
            </Link>
          </div>

          {recentJobs.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              No jobs posted yet.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentJobs.map((job) => (
                <div
                  key={job._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    backgroundColor: 'var(--bg-subtle)',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  <div>
                    <strong style={{ color: 'var(--navy-dark)', fontSize: '0.875rem', display: 'block' }}>
                      {job.title}
                    </strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {job.company} • {job.jobType} {job.salary && `• ${job.salary}`}
                    </span>
                  </div>
                  <Link to={`/admin/jobs/${job._id}/edit`} className="btn btn-secondary btn-sm" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
