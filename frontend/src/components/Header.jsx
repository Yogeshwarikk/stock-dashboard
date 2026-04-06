import React from 'react';

export default function Header() {
  return (
    <header style={{
      borderBottom: '1px solid var(--border)',
      background: 'var(--bg-secondary)',
      padding: '0 24px',
      height: '56px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '32px', height: '32px',
          background: 'var(--accent-teal)',
          borderRadius: '6px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-mono)',
          fontWeight: 700, fontSize: '14px',
          color: '#0a0e17',
        }}>N</div>
        <div>
          <div style={{ fontWeight: 600, fontSize: '15px', letterSpacing: '-0.3px' }}>
            Nifty Market Terminal
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            NSE · Live Data via Yahoo Finance
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{
          width: '7px', height: '7px', borderRadius: '50%',
          background: 'var(--accent-teal)',
          display: 'inline-block',
          animation: 'pulse-dot 2s infinite',
        }} />
        <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
          LIVE
        </span>
      </div>
    </header>
  );
}
