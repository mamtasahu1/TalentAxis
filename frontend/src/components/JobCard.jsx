import React from 'react';
import { Link } from 'react-router-dom';
import { getCompanyLogo, formatSalary } from '../utils/companyData';

const JobCard = ({ job, onApplyClick, isStudent, hasApplied }) => {
  if (!job) return null;

  const getInitials = (name) => {
    if (!name) return 'TA';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const formatDeadline = (dateStr) => {
    if (!dateStr) return 'Open';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const getTypeBadgeClass = (type) => {
    switch (type) {
      case 'Internship':
        return 'badge-internship';
      case 'Full-time':
        return 'badge-full-time';
      case 'Part-time':
        return 'badge-part-time';
      case 'Remote':
        return 'badge-remote';
      default:
        return 'badge-primary';
    }
  };

  return (
    <div className="job-card">
      <div>
        <div className="job-card-header">
          <div style={{ width: '44px', height: '44px', minWidth: '44px', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#fff', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img
              src={getCompanyLogo(job.company)}
              alt={`${job.company} logo`}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
          <div className="job-header-info">
            <h3 className="job-title">
              <Link to={`/jobs/${job._id}`}>{job.title}</Link>
            </h3>
            <span className="company-name">{job.company}</span>
          </div>
        </div>

        <div className="job-meta-row">
          <span>{job.location || 'Remote'}</span>
          <span>•</span>
          <span className={`badge ${getTypeBadgeClass(job.jobType)}`}>
            {job.jobType}
          </span>
          {job.salary && (
            <>
              <span>•</span>
              <span style={{ fontWeight: 600, color: 'var(--navy-dark)' }}>{formatSalary(job.salary)}</span>
            </>
          )}
          {job.duration && (
            <>
              <span>•</span>
              <span>{job.duration}</span>
            </>
          )}
        </div>

        <p className="job-description-preview">{job.description}</p>

        {job.skills && job.skills.length > 0 && (
          <div className="job-skills-list">
            {job.skills.slice(0, 4).map((skill, idx) => (
              <span key={idx} className="skill-tag">
                {skill}
              </span>
            ))}
            {job.skills.length > 4 && (
              <span className="skill-tag">+{job.skills.length - 4} more</span>
            )}
          </div>
        )}
      </div>

      <div className="job-card-footer">
        <span className="job-deadline">
          Deadline: <strong>{formatDeadline(job.deadline)}</strong>
        </span>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Link to={`/jobs/${job._id}`} className="btn btn-secondary btn-sm">
            View Details
          </Link>
          {isStudent && !hasApplied && onApplyClick && (
            <button
              onClick={() => onApplyClick(job)}
              className="btn btn-primary btn-sm"
            >
              Apply
            </button>
          )}
          {hasApplied && (
            <span className="badge badge-primary" style={{ padding: '5px 10px' }}>
              Applied
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
