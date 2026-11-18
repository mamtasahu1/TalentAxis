import React from 'react';

const StatusBadge = ({ status }) => {
  const getStatusClass = (st) => {
    switch (st) {
      case 'Pending':
        return 'status-pending';
      case 'Under Review':
        return 'status-under-review';
      case 'Shortlisted':
        return 'status-shortlisted';
      case 'Accepted':
        return 'status-accepted';
      case 'Rejected':
        return 'status-rejected';
      default:
        return 'status-pending';
    }
  };

  return (
    <span className={`status-badge ${getStatusClass(status)}`}>
      {status || 'Pending'}
    </span>
  );
};

export default StatusBadge;
