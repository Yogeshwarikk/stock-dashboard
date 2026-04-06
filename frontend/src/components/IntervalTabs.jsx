import React from 'react';
import { INTERVALS } from '../services/constants';

export default function IntervalTabs({ value, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{
        fontSize: '11px',
        fontFamily: 'var(--font-mono)',
        color: 'var(--text-muted)',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      }}>
        Interval
      </label>
      <div style={{
        display: 'flex',
        gap: '4px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: '4px',
      }}>
        {INTERVALS.map(tab => {
          const active = tab.value === value;
          return (
            <button
              key={tab.value}
              onClick={() => onChange(tab.value)}
              style={{
                padding: '6px 16px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                fontWeight: 500,
                letterSpacing: '0.04em',
                transition: 'all 0.18s ease',
                background: active ? 'var(--accent-teal)' : 'transparent',
                color: active ? '#0a0e17' : 'var(--text-secondary)',
                boxShadow: active ? '0 0 12px var(--accent-teal-glow)' : 'none',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
