import React from 'react';
import Icon from '../components/Icon';

export default function Placeholder({ title, description }) {
  let iconName = 'layout';
  if (title === 'Progress') iconName = 'star';
  else if (title === 'Notes') iconName = 'file-text';
  else if (title === 'Profile') iconName = 'user';
  else if (title === 'Logged Out') iconName = 'log-out';

  return (
    <div
      className="page-view placeholder-page-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        textAlign: 'center',
        color: 'var(--text-medium)',
        fontFamily: 'var(--font-family-body)'
      }}
    >
      <div
        className="placeholder-icon-wrapper"
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '20px',
          backgroundColor: 'var(--primary-blue-light)',
          color: 'var(--primary-blue)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
          boxShadow: 'var(--card-shadow)'
        }}
      >
        <Icon name={iconName} style={{ width: '40px', height: '40px' }} />
      </div>
      <h2
        className="placeholder-title"
        style={{
          fontFamily: 'var(--font-family-header)',
          fontSize: '28px',
          fontWeight: 800,
          color: 'var(--text-dark)',
          marginBottom: '8px'
        }}
      >
        {title}
      </h2>
      <p
        className="placeholder-desc"
        style={{
          fontSize: '16px',
          color: 'var(--text-light)',
          maxWidth: '400px',
          lineHeight: 1.5,
          marginBottom: '32px'
        }}
      >
        {description}
      </p>

      <div
        className="placeholder-card"
        style={{
          background: 'white',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '24px 32px',
          boxShadow: 'var(--card-shadow)',
          maxWidth: '480px',
          width: '100%'
        }}
      >
        <h4
          style={{
            fontFamily: 'var(--font-family-header)',
            fontSize: '16px',
            fontWeight: 700,
            color: 'var(--text-dark)',
            marginBottom: '8px'
          }}
        >
          Development Notice
        </h4>
        <p style={{ fontSize: '14px', color: 'var(--text-medium)', lineHeight: 1.4 }}>
          This section represents a placeholder menu item. The Home, Course, and Schedule tabs are fully functional training environments.
        </p>
      </div>
    </div>
  );
}
