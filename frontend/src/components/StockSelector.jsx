import React from 'react';
import { NIFTY_50_STOCKS } from '../services/constants';

export default function StockSelector({ value, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{
        fontSize: '11px',
        fontFamily: 'var(--font-mono)',
        color: 'var(--text-muted)',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      }}>
        Symbol
      </label>
      <div style={{ position: 'relative' }}>
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{
            appearance: 'none',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            padding: '9px 36px 9px 12px',
            width: '260px',
            cursor: 'pointer',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--accent-teal)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        >
          {NIFTY_50_STOCKS.map(s => (
            <option key={s.symbol} value={s.symbol}>
              {s.symbol === '^NSEI' ? '▶ ' : ''}{s.label} ({s.symbol})
            </option>
          ))}
        </select>
        <svg
          style={{
            position: 'absolute', right: '10px', top: '50%',
            transform: 'translateY(-50%)', pointerEvents: 'none',
            color: 'var(--text-muted)',
          }}
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </div>
  );
}
