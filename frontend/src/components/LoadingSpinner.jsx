import React from 'react';

export default function LoadingSpinner({ message = 'Fetching market data...' }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '80px 20px', gap: '20px',
    }}>
      {/* Animated ring */}
      <div style={{
        width: '48px', height: '48px',
        border: '3px solid var(--border)',
        borderTop: '3px solid var(--accent-teal)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '13px',
        color: 'var(--text-muted)',
        letterSpacing: '0.05em',
      }}>
        {message}
      </div>
      {/* Skeleton bars */}
      <div style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
        {[100, 80, 90, 70].map((w, i) => (
          <div key={i} className="skeleton" style={{ height: '14px', width: `${w}%`, borderRadius: '4px' }} />
        ))}
      </div>
    </div>
  );
}
