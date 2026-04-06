import React from 'react';

export default function StatCard({ label, value, sub, accent = false }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: `1px solid ${accent ? 'var(--accent-teal)' : 'var(--border)'}`,
      borderRadius: 'var(--radius-lg)',
      padding: '16px 20px',
      boxShadow: accent ? 'var(--shadow-glow)' : 'none',
      flex: '1 1 160px',
      minWidth: '140px',
    }}>
      <div style={{
        fontSize: '11px',
        fontFamily: 'var(--font-mono)',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        marginBottom: '8px',
      }}>{label}</div>
      <div style={{
        fontSize: '20px',
        fontWeight: 600,
        fontFamily: 'var(--font-mono)',
        color: accent ? 'var(--accent-teal)' : 'var(--text-primary)',
        letterSpacing: '-0.5px',
      }}>{value}</div>
      {sub && (
        <div style={{
          fontSize: '11px',
          color: 'var(--text-muted)',
          marginTop: '4px',
        }}>{sub}</div>
      )}
    </div>
  );
}
