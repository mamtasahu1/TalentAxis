import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobAPI } from '../services/api';

const Companies = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const companyProfiles = [
    {
      name: 'Nova Digital Labs',
      industry: 'Digital Product Engineering',
      location: 'Remote',
      description: 'A modern engineering studio focused on building high-performance web applications, design systems, and developer productivity tools.',
      founded: '2021',
      size: '50 - 150 employees',
    },
    {
      name: 'CloudScale Systems',
      industry: 'Cloud Infrastructure & Networks',
      location: 'Remote',
      description: 'Provides scalable backend microservices, resilient data streaming, and enterprise infrastructure solutions for high-growth tech ventures.',
      founded: '2019',
      size: '100 - 250 employees',
    },
    {
      name: 'Apex Cognitive Labs',
      industry: 'Applied Artificial Intelligence',
      location: 'Boston, MA / Hybrid',
      description: 'Specializes in machine learning research, neural model optimization, and data intelligence pipelines across biotechnology and robotics.',
      founded: '2022',
      size: '25 - 50 employees',
    },
    {
      name: 'PixelCraft Studio',
      industry: 'Product Design & Creative Tech',
      location: 'New York, NY',
      description: 'An award-winning product design agency creating accessible design systems, user interfaces, and brand experiences for next-generation software.',
      founded: '2020',
      size: '30 - 75 employees',
    },
    {
      name: 'Vanguard Solutions',
      industry: 'Enterprise Software & Security',
      location: 'San Francisco, CA',
      description: 'Delivers mission-critical enterprise platforms, distributed cloud architecture, and security-hardened web applications for global organizations.',
      founded: '2018',
      size: '200 - 500 employees',
    },
    {
      name: 'InsightStream Analytics',
      industry: 'Data Intelligence & Analytics',
      location: 'Chicago, IL / Remote',
      description: 'Empowers organizations with predictive analytics, business intelligence dashboards, and real-time operational data processing.',
      founded: '2020',
      size: '60 - 120 employees',
    },
  ];

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await jobAPI.getJobs();
        if (res.data.success) {
          setJobs(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching jobs for companies page:', err);
      }
    };

    fetchJobs();
  }, []);

  const getJobCount = (companyName) => {
    return jobs.filter((j) => j.company?.toLowerCase() === companyName.toLowerCase()).length;
  };

  const getInitials = (name) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const filteredCompanies = companyProfiles.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="section-py">
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <span className="section-tag">Employer Network</span>
          <h1 style={{ fontSize: '2.125rem', fontWeight: 800, color: 'var(--navy-dark)', marginBottom: '8px' }}>
            Hiring Companies &amp; Organizations
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', maxWidth: '680px' }}>
            Discover top technology companies, startups, and research studios offering verified internships and early career positions on TalentAxis.
          </p>
        </div>

        {/* Search */}
        <div className="card" style={{ padding: '16px 20px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search companies by name, industry, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ marginBottom: 0 }}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="btn btn-secondary btn-sm"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Company Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {filteredCompanies.map((comp, idx) => {
            const count = getJobCount(comp.name);
            return (
              <div key={idx} className="card card-hover" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                    <div className="company-logo" style={{ width: '48px', height: '48px', fontSize: '1rem' }}>
                      {getInitials(comp.name)}
                    </div>
                    <div>
                      <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--navy-dark)', marginBottom: '2px' }}>
                        {comp.name}
                      </h2>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                        {comp.industry} • {comp.location}
                      </span>
                    </div>
                  </div>

                  <p style={{ color: 'var(--text-main)', fontSize: '0.875rem', lineHeight: '1.6', marginBottom: '16px' }}>
                    {comp.description}
                  </p>

                  <div style={{ display: 'flex', gap: '8px', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '18px', flexWrap: 'wrap' }}>
                    <span style={{ padding: '3px 8px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
                      Founded: {comp.founded}
                    </span>
                    <span style={{ padding: '3px 8px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
                      Team: {comp.size}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: count > 0 ? 'var(--primary)' : 'var(--text-secondary)' }}>
                    {count} open position{count === 1 ? '' : 's'}
                  </span>
                  <Link
                    to={`/jobs?search=${encodeURIComponent(comp.name)}`}
                    className="btn btn-secondary btn-sm"
                  >
                    View Openings &rarr;
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Companies;
