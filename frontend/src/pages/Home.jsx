import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jobAPI, applicationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import JobCard from '../components/JobCard';
import Modal from '../components/Modal';

const Home = () => {
  const navigate = useNavigate();
  const { user, isStudent } = useAuth();

  // Search form
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('All');

  // Featured and Recent Jobs
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Application Modal state
  const [selectedJob, setSelectedJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyMessage, setApplyMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await jobAPI.getJobs();
        if (res.data.success) {
          const allJobs = res.data.data;
          setFeaturedJobs(allJobs.slice(0, 4));
          setRecentJobs(allJobs.slice(0, 6));
        }

        if (isStudent) {
          const appRes = await applicationAPI.getMyApplications();
          if (appRes.data.success) {
            const ids = appRes.data.data.map((app) => app.jobId?._id || app.jobId);
            setAppliedJobIds(ids);
          }
        }
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Unable to load job postings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [isStudent]);

  const handleSearch = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (keyword.trim()) queryParams.set('search', keyword.trim());
    if (location.trim()) queryParams.set('location', location.trim());
    if (jobType && jobType !== 'All') queryParams.set('jobType', jobType);

    navigate(`/jobs?${queryParams.toString()}`);
  };

  const openApplyModal = (job) => {
    setSelectedJob(job);
    setCoverLetter('');
    setCvFile(null);
    setApplyMessage({ type: '', text: '' });
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!selectedJob) return;

    if (!cvFile) {
      setApplyMessage({
        type: 'error',
        text: 'A CV/resume (.pdf, .doc, .docx) is mandatory before applying.',
      });
      return;
    }

    try {
      setApplyLoading(true);
      setApplyMessage({ type: '', text: '' });

      const formData = new FormData();
      formData.append('jobId', selectedJob._id);
      formData.append('coverLetter', coverLetter);
      formData.append('cv', cvFile);

      const res = await applicationAPI.createApplication(formData);

      if (res.data.success) {
        setAppliedJobIds((prev) => [...prev, selectedJob._id]);
        setApplyMessage({
          type: 'success',
          text: 'Application submitted successfully with your CV. You can track its status in your dashboard.',
        });
        setTimeout(() => {
          setSelectedJob(null);
          setApplyMessage({ type: '', text: '' });
          setCvFile(null);
          setCoverLetter('');
        }, 1600);
      }
    } catch (err) {
      setApplyMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to submit application. Please try again.',
      });
    } finally {
      setApplyLoading(false);
    }
  };

  const categories = [
    { title: 'Software Engineering', query: 'Software' },
    { title: 'Web Development', query: 'Web' },
    { title: 'Engineering', query: 'Engineering' },
    { title: 'UI/UX Design', query: 'Design' },
    { title: 'Data & Analytics', query: 'Data' },
    { title: 'Machine Learning', query: 'Machine Learning' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-pill">
            TalentAxis Early Career Platform
          </div>

          <h1 className="hero-title">
            Find the Right Opportunity for Your Future.
          </h1>

          <p className="hero-subtitle">
            TalentAxis connects job seekers and university students with verified internships, co-ops, and full-time employment opportunities. Discover positions and apply with a direct profile.
          </p>

          {/* Prominent Search Interface */}
          <div className="hero-search-card">
            <form onSubmit={handleSearch} className="search-grid">
              <div className="search-field">
                <input
                  type="text"
                  placeholder="Job title, company, or keyword"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="search-field">
                <input
                  type="text"
                  placeholder="Location or 'Remote'"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="search-field">
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  className="search-input form-select"
                >
                  <option value="All">All Job Types</option>
                  <option value="Internship">Internship</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: '10px 22px' }}>
                Search Jobs
              </button>
            </form>
          </div>

          {/* Metrics */}
          <div className="hero-metrics">
            <div className="metric-item">
              <span className="metric-number">100%</span>
              <span className="metric-label">Verified Postings</span>
            </div>
            <div className="metric-item">
              <span className="metric-number">2,500+</span>
              <span className="metric-label">Active Career Opportunities</span>
            </div>
            <div className="metric-item">
              <span className="metric-number">Direct</span>
              <span className="metric-label">Employer Connections</span>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="section-py" style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Explore Disciplines</span>
            <h2 className="section-title">Popular Job Categories</h2>
            <p className="section-subtitle">
              Browse positions across core engineering, design, and analytical specializations.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '14px' }}>
            {categories.map((cat, idx) => (
              <div
                key={idx}
                className="card card-hover"
                style={{ padding: '16px 14px', textAlign: 'center', cursor: 'pointer' }}
                onClick={() => navigate(`/jobs?search=${encodeURIComponent(cat.query)}`)}
              >
                <strong style={{ fontSize: '0.9375rem', color: 'var(--navy-dark)', display: 'block', marginBottom: '4px' }}>
                  {cat.title}
                </strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>
                  View Postings &rarr;
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Opportunities */}
      <section className="section-py">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span className="section-tag">Featured</span>
              <h2 className="section-title" style={{ marginBottom: '4px' }}>
                Featured Opportunities
              </h2>
              <p className="section-subtitle">
                Explore hand-picked roles from trusted tech companies and fast-growing organizations.
              </p>
            </div>
            <Link to="/jobs" className="btn btn-outline btn-sm">
              View All Opportunities &rarr;
            </Link>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading opportunities...</p>
            </div>
          ) : error ? (
            <div className="alert alert-error">{error}</div>
          ) : featuredJobs.length === 0 ? (
            <div className="empty-state">
              <h3 className="empty-state-title">No job postings currently available</h3>
              <p className="empty-state-text">Check back soon for new opportunities.</p>
            </div>
          ) : (
            <div className="jobs-grid">
              {featuredJobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  onApplyClick={openApplyModal}
                  isStudent={isStudent}
                  hasApplied={appliedJobIds.includes(job._id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Recently Posted Jobs Section */}
      {recentJobs.length > 0 && (
        <section className="section-py" style={{ backgroundColor: 'var(--bg-subtle)' }}>
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <span className="section-tag">Latest Openings</span>
                <h2 className="section-title" style={{ marginBottom: '4px' }}>
                  Recently Posted Opportunities
                </h2>
                <p className="section-subtitle">
                  Fresh roles added by hiring managers across top technology teams.
                </p>
              </div>
              <Link to="/jobs" className="btn btn-secondary btn-sm">
                Explore All Jobs &rarr;
              </Link>
            </div>

            <div className="jobs-grid">
              {recentJobs.slice(0, 4).map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  onApplyClick={openApplyModal}
                  isStudent={isStudent}
                  hasApplied={appliedJobIds.includes(job._id)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="section-py" style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Platform Process</span>
            <h2 className="section-title">How TalentAxis Works</h2>
            <p className="section-subtitle">
              A transparent three-step workflow from discovery to status updates.
            </p>
          </div>

          <div className="how-it-works-grid">
            <div className="step-card">
              <span className="step-number-tag">Step 1</span>
              <h3 className="step-title">Create Student Profile</h3>
              <p className="step-desc">
                Register with your academic background, coursework, and technical skills. Your profile is automatically attached to every application you submit.
              </p>
            </div>

            <div className="step-card">
              <span className="step-number-tag">Step 2</span>
              <h3 className="step-title">Discover &amp; Apply</h3>
              <p className="step-desc">
                Filter opportunities by location, internship, full-time, or remote roles. Submit targeted applications with a personalized cover letter.
              </p>
            </div>

            <div className="step-card">
              <span className="step-number-tag">Step 3</span>
              <h3 className="step-title">Track Status Real-Time</h3>
              <p className="step-desc">
                Monitor recruitment milestones from Pending to Under Review, Shortlisted, and Accepted directly on your student portal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Student Career Growth Section */}
      <section className="section-py" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
            <div>
              <span className="section-tag">Career Acceleration</span>
              <h2 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--navy-dark)', marginBottom: '16px', lineHeight: '1.3' }}>
                Build Your Early Career With Confidence and Clarity
              </h2>
              <p style={{ color: 'var(--text-main)', fontSize: '0.9375rem', lineHeight: '1.7', marginBottom: '16px' }}>
                Transitioning from university coursework to professional employment requires opportunities where you can grow, learn from industry mentors, and make a tangible impact. TalentAxis connects students directly with companies that value early technical talent.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ color: 'var(--primary)', fontWeight: 700 }}>•</span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>
                    <strong>Direct Employer Review:</strong> Every application is evaluated directly by participating hiring managers.
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ color: 'var(--primary)', fontWeight: 700 }}>•</span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>
                    <strong>Transparent Details:</strong> Clear duration, requirements, and competitive compensation posted for all openings.
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ color: 'var(--primary)', fontWeight: 700 }}>•</span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>
                    <strong>Real-Time Tracking:</strong> Stay informed at every stage of the evaluation journey on your student portal.
                  </span>
                </div>
              </div>
              <Link to="/jobs" className="btn btn-primary btn-sm">
                Explore Available Roles &rarr;
              </Link>
            </div>

            <div className="card" style={{ padding: '36px', borderLeft: '4px solid var(--primary)' }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '0.05em', marginBottom: '8px' }}>
                Early Talent Spotlight
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--navy-dark)', marginBottom: '12px' }}>
                Launch Your Career Journey Today
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '20px' }}>
                Over 2,500 students have applied to engineering internships and junior positions through TalentAxis. Create a profile once and submit customized statements of interest in minutes.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Register as Student
                </Link>
                <Link to="/companies" className="btn btn-secondary btn-sm">
                  Hiring Companies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Call to Action */}
      <section className="section-py">
        <div className="container">
          <div className="cta-grid">
            <div className="cta-box cta-student">
              <div>
                <span className="badge badge-primary" style={{ backgroundColor: '#1E293B', color: '#93C5FD', borderColor: '#334155', marginBottom: '14px' }}>
                  For Students &amp; Job Seekers
                </span>
                <h3>Ready to Launch Your Career?</h3>
                <p>
                  Explore verified internships and entry-level engineering roles. Create your account and apply in minutes.
                </p>
              </div>
              <div>
                <Link to="/register" className="btn btn-secondary">
                  Register as Student &rarr;
                </Link>
              </div>
            </div>

            <div className="cta-box cta-employer">
              <div>
                <span className="badge badge-primary" style={{ marginBottom: '14px' }}>
                  For Administrators &amp; Recruiters
                </span>
                <h3>Hiring Early Technical Talent?</h3>
                <p>
                  Manage active postings, review applicant credentials, and process recruitment statuses through the administrator console.
                </p>
              </div>
              <div>
                <Link to="/login" className="btn btn-primary">
                  Access Admin Portal &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Student Apply Modal */}
      <Modal
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        title={selectedJob ? `Apply: ${selectedJob.title}` : 'Application'}
      >
        {selectedJob && (
          <form onSubmit={handleApplySubmit}>
            <div style={{ marginBottom: '14px', padding: '12px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontWeight: 700, color: 'var(--navy-dark)' }}>{selectedJob.company}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                {selectedJob.location} • {selectedJob.jobType}
              </div>
            </div>

            {applyMessage.text && (
              <div className={`alert ${applyMessage.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                {applyMessage.text}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">
                Applicant: {user?.name} ({user?.email})
              </label>
              <span className="form-hint">
                Skills attached: {user?.skills?.length ? user.skills.join(', ') : 'No skills specified in profile'}
              </span>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="homeCvFile">
                Resume / CV <span style={{ color: 'var(--color-error)' }}>* (Mandatory)</span>
              </label>
              <input
                type="file"
                id="homeCvFile"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="form-control"
                onChange={(e) => setCvFile(e.target.files[0] || null)}
                required
              />
              <span className="form-hint">Accepted formats: PDF, DOC, DOCX (Max 5MB)</span>
              {cvFile && (
                <span style={{ fontSize: '0.8125rem', color: 'var(--color-success)', marginTop: '4px', display: 'block', fontWeight: 600 }}>
                  Selected file: {cvFile.name} ({(cvFile.size / 1024).toFixed(1)} KB)
                </span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="coverLetter">
                Cover Letter / Statement of Interest (Optional)
              </label>
              <textarea
                id="coverLetter"
                className="form-control"
                rows="4"
                placeholder="Describe your technical background and interest in this role..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '18px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedJob(null)}
                disabled={applyLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={applyLoading}
              >
                {applyLoading ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default Home;
