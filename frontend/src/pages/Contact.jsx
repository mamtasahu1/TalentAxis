import React, { useState } from 'react';
import { contactAPI } from '../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: '', text: '' });

    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setFeedback({
        type: 'error',
        text: 'Please complete all required fields.',
      });
      return;
    }

    try {
      setLoading(true);
      const res = await contactAPI.submit(formData);

      if (res.data.success) {
        setFeedback({
          type: 'success',
          text: 'Thank you for reaching out. The recruitment team will review your inquiry and respond promptly.',
        });
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
      }
    } catch (err) {
      console.error('Contact submission error:', err);
      setFeedback({
        type: 'error',
        text: err.response?.data?.message || 'Failed to submit message. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-py">
      <div className="container">
        {/* Header */}
        <div className="section-header" style={{ marginBottom: '40px' }}>
          <span className="section-tag">Get in Touch</span>
          <h1 className="section-title">Contact TalentAxis</h1>
          <p className="section-subtitle">
            Have questions regarding postings, student accounts, or recruitment operations? Send our team a message.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '36px', alignItems: 'start' }}>
          {/* Left Column: Office & Support Info */}
          <div>
            <div className="card" style={{ padding: '28px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '14px', color: 'var(--navy-dark)' }}>
                Recruitment Operations
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.6', marginBottom: '20px' }}>
                TalentAxis administrative and support teams operate during regular university business hours.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.875rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Email</span>
                  <strong style={{ color: 'var(--navy-dark)' }}>support@talentaxis.com</strong>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Hours</span>
                  <strong style={{ color: 'var(--navy-dark)' }}>Monday – Friday: 9:00 AM – 5:00 PM EST</strong>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Location</span>
                  <strong style={{ color: 'var(--navy-dark)' }}>Career Services Center, Campus Hub</strong>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '20px', backgroundColor: 'var(--bg-subtle)' }}>
              <strong style={{ color: 'var(--navy-dark)', fontSize: '0.875rem', display: 'block', marginBottom: '4px' }}>
                Administrator Access Notice
              </strong>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
                Hiring managers and university administrators can manage active listings and applicant records directly via the administrator dashboard.
              </p>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '6px', color: 'var(--navy-dark)' }}>
              Send an Inquiry
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '20px' }}>
              Fill in the form below and our team will get back to you as soon as possible.
            </p>

            {feedback.text && (
              <div className={`alert ${feedback.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                {feedback.text}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="contactName">
                  Full Name
                </label>
                <input
                  type="text"
                  id="contactName"
                  name="name"
                  className="form-control"
                  placeholder="e.g. Alex Rivera"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contactEmail">
                  Email Address
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  name="email"
                  className="form-control"
                  placeholder="name@university.edu"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contactSubject">
                  Subject
                </label>
                <input
                  type="text"
                  id="contactSubject"
                  name="subject"
                  className="form-control"
                  placeholder="e.g. Question regarding internship postings"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contactMessage">
                  Message
                </label>
                <textarea
                  id="contactMessage"
                  name="message"
                  className="form-control"
                  rows="4"
                  placeholder="Type your message here..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '8px' }}
                disabled={loading}
              >
                {loading ? 'Sending Message...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
