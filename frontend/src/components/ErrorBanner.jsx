import React from 'react';

export default function ErrorBanner({ error, onRetry }) {
  return (
    <div style={{
      background: 'rgba(255,77,109,0.08)',
      border: '1px solid rgba(255,77,109,0.3)',
      borderRadius: 'var(--radius-lg)',
      padding: '24px 28px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '16px',
    }}>
      <div style={{ fontSize: '24px', flexShrink: 0 }}>⚠</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, color: '#ff4d6d', marginBottom: '6px', fontSize: '15px' }}>
          Failed to load market data
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          color: 'var(--text-secondary)',
          marginBottom: '16px',
          wordBreak: 'break-word',
        }}>
          {error}
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
          Make sure the Django backend is running at <code style={{
            fontFamily: 'var(--font-mono)',
            background: 'var(--bg-card)',
            padding: '2px 6px',
            borderRadius: '4px',
            color: 'var(--accent-teal)',
          }}>http://localhost:8000</code>
        </div>
        {onRetry && (
          <button onClick={onRetry} style={{
            background: 'transparent',
            border: '1px solid #ff4d6d',
            borderRadius: '6px',
            color: '#ff4d6d',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            padding: '7px 16px',
            cursor: 'pointer',
          }}>
            ↻ Retry
          </button>
        )}
      </div>
    </div>
  );
}
