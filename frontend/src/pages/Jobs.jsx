import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { jobAPI, applicationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import JobCard from '../components/JobCard';
import Modal from '../components/Modal';
import { formatSalary } from '../utils/companyData';
import Pagination from '../components/Pagination';

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isStudent } = useAuth();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [locationQuery, setLocationQuery] = useState(searchParams.get('location') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('jobType') || 'All');
  const [sortBy, setSortBy] = useState('newest');

  // Jobs state
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Application Modal state
  const [selectedJob, setSelectedJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyMessage, setApplyMessage] = useState({ type: '', text: '' });

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError('');

      const params = {};
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (locationQuery.trim()) params.location = locationQuery.trim();
      if (selectedType && selectedType !== 'All') params.jobType = selectedType;

      const res = await jobAPI.getJobs(params);
      if (res.data.success) {
        setJobs(res.data.data);
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
      setError('Failed to retrieve opportunities. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    const newParams = {};
    if (searchQuery.trim()) newParams.search = searchQuery.trim();
    if (locationQuery.trim()) newParams.location = locationQuery.trim();
    if (selectedType && selectedType !== 'All') newParams.jobType = selectedType;
    setSearchParams(newParams);
    setCurrentPage(1);
  }, [selectedType]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchJobs();
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setLocationQuery('');
    setSelectedType('All');
    setSortBy('newest');
    setCurrentPage(1);
    setSearchParams({});
    jobAPI.getJobs({}).then((res) => {
      if (res.data.success) setJobs(res.data.data);
    });
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
          text: 'Application submitted successfully with your CV. Track status in your student dashboard.',
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

  const jobTypes = ['All', 'Internship', 'Full-time', 'Part-time', 'Remote'];

  // Sorting
  const sortedJobs = useMemo(() => {
    const list = [...jobs];
    if (sortBy === 'title-asc') {
      return list.sort((a, b) => a.title.localeCompare(b.title));
    }
    if (sortBy === 'company-asc') {
      return list.sort((a, b) => a.company.localeCompare(b.company));
    }
    // Default newest
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [jobs, sortBy]);

  // Paginated jobs
  const totalPages = Math.ceil(sortedJobs.length / itemsPerPage);
  const paginatedJobs = sortedJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="section-py">
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '2.125rem', fontWeight: 800, color: 'var(--navy-dark)', marginBottom: '6px' }}>
            Find Jobs &amp; Internships
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            Explore curated internships, apprenticeships, and entry-level positions across top companies.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="card" style={{ marginBottom: '28px', padding: '18px' }}>
          <form onSubmit={handleSearchSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr)) auto', gap: '12px', alignItems: 'center' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Title, company, or keyword"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Location or 'Remote'"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="submit" className="btn btn-primary btn-sm">
                  Filter
                </button>
                {(searchQuery || locationQuery || selectedType !== 'All') && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="btn btn-secondary btn-sm"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Type Pills and Sort Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Type:
                </span>
                {jobTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedType(type)}
                    className={`btn btn-sm ${selectedType === type ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ borderRadius: 'var(--radius-full)' }}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label htmlFor="sortBy" style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', margin: 0 }}>
                  Sort:
                </label>
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="form-select"
                  style={{ padding: '6px 10px', fontSize: '0.8125rem', borderRadius: 'var(--radius-sm)' }}
                >
                  <option value="newest">Newest First</option>
                  <option value="title-asc">Job Title (A-Z)</option>
                  <option value="company-asc">Company (A-Z)</option>
                </select>
              </div>
            </div>
          </form>
        </div>

        {/* Results Count & Student Hint */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <span style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Showing <strong>{sortedJobs.length}</strong> available position{sortedJobs.length === 1 ? '' : 's'}
          </span>
          {isStudent && (
            <span style={{ fontSize: '0.8125rem', color: 'var(--primary)', fontWeight: 600 }}>
              Logged in as Student: Click Apply to submit your credentials
            </span>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading opportunities...</p>
          </div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : sortedJobs.length === 0 ? (
          <div className="empty-state">
            <h3 className="empty-state-title">No matching opportunities found</h3>
            <p className="empty-state-text">
              Try adjusting your search criteria or resetting filters to see all available roles.
            </p>
            <button onClick={handleResetFilters} className="btn btn-primary btn-sm">
              Show All Postings
            </button>
          </div>
        ) : (
          <>
            <div className="jobs-grid">
              {paginatedJobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  onApplyClick={openApplyModal}
                  isStudent={isStudent}
                  hasApplied={appliedJobIds.includes(job._id)}
                />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
              totalItems={sortedJobs.length}
              itemsPerPage={itemsPerPage}
              itemName="opportunities"
            />
          </>
        )}
      </div>

      {/* Apply Modal */}
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
                {selectedJob.location} • {selectedJob.jobType} {selectedJob.salary && `• ${formatSalary(selectedJob.salary)}`}
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
                Skills: {user?.skills?.length ? user.skills.join(', ') : 'None listed in profile'}
              </span>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="jobsCvFile">
                Resume / CV <span style={{ color: 'var(--color-error)' }}>* (Mandatory)</span>
              </label>
              <input
                type="file"
                id="jobsCvFile"
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
              <label className="form-label" htmlFor="jobsCoverLetter">
                Cover Letter (Optional)
              </label>
              <textarea
                id="jobsCoverLetter"
                className="form-control"
                rows="4"
                placeholder="Highlight your interest and relevant experience..."
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

export default Jobs;
