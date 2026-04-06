import React, { useState } from 'react';

function fmt(num) {
  if (num == null) return '—';
  return num.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
}

function fmtVol(num) {
  if (!num) return '—';
  if (num >= 1_00_00_000) return (num / 1_00_00_000).toFixed(2) + ' Cr';
  if (num >= 1_00_000) return (num / 1_00_000).toFixed(2) + ' L';
  return num.toLocaleString('en-IN');
}

const PAGE_SIZE = 20;

export default function DataTable({ data }) {
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState('date');
  const [sortDir, setSortDir] = useState('desc');

  const sorted = [...data].sort((a, b) => {
    let va = a[sortKey], vb = b[sortKey];
    if (typeof va === 'string') return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
    return sortDir === 'asc' ? va - vb : vb - va;
  });

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const pageData = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
    setPage(1);
  };

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <span style={{ color: 'var(--text-muted)' }}>⇅</span>;
    return <span style={{ color: 'var(--accent-teal)' }}>{sortDir === 'asc' ? '↑' : '↓'}</span>;
  };

  const thStyle = (col) => ({
    padding: '10px 14px',
    textAlign: col === 'date' ? 'left' : 'right',
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    fontWeight: 500,
    cursor: 'pointer',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    borderBottom: '1px solid var(--border)',
    background: 'var(--bg-secondary)',
  });

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-card)',
    }}>
      {/* Table header label */}
      <div style={{
        padding: '14px 20px',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-secondary)' }}>
          OHLCV Data · {data.length} rows
        </span>
        <div style={{ display: 'flex', gap: '16px', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
          <span>
            <span style={{
              display: 'inline-block', width: '8px', height: '8px',
              background: 'var(--green-bg)', border: '1px solid var(--green)',
              borderRadius: '2px', marginRight: '5px',
            }} />
            Volume High
          </span>
          <span>
            <span style={{
              display: 'inline-block', width: '8px', height: '8px',
              background: 'var(--red-bg)', border: '1px solid var(--red)',
              borderRadius: '2px', marginRight: '5px',
            }} />
            Volume Low
          </span>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {[
                { key: 'date', label: 'Date' },
                { key: 'open', label: 'Open' },
                { key: 'high', label: 'High' },
                { key: 'low', label: 'Low' },
                { key: 'close', label: 'Close' },
                { key: 'volume', label: 'Volume' },
                { key: 'volume_ma30', label: 'MA30' },
                { key: 'volume_high', label: 'Signal' },
              ].map(col => (
                <th key={col.key} style={thStyle(col.key)} onClick={() => handleSort(col.key)}>
                  {col.label} <SortIcon col={col.key} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.map((row, i) => {
              const isHigh = row.volume_high;
              const chg = row.close && row.open
                ? ((row.close - row.open) / row.open * 100)
                : null;

              return (
                <tr
                  key={`${row.date}-${i}`}
                  style={{
                    background: isHigh ? 'var(--green-bg)' : 'var(--red-bg)',
                    borderBottom: '1px solid var(--border)',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = isHigh ? 'var(--green-bg)' : 'var(--red-bg)'}
                >
                  <td style={{ padding: '9px 14px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                    {row.date}
                  </td>
                  <td style={{ padding: '9px 14px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                    {fmt(row.open)}
                  </td>
                  <td style={{ padding: '9px 14px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#00e676' }}>
                    {fmt(row.high)}
                  </td>
                  <td style={{ padding: '9px 14px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#ff4d6d' }}>
                    {fmt(row.low)}
                  </td>
                  <td style={{ padding: '9px 14px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600 }}>
                    <span style={{ color: chg != null ? (chg >= 0 ? '#00e676' : '#ff4d6d') : 'var(--text-primary)' }}>
                      {fmt(row.close)}
                      {chg != null && (
                        <span style={{ fontSize: '10px', marginLeft: '6px', opacity: 0.8 }}>
                          {chg >= 0 ? '+' : ''}{chg.toFixed(2)}%
                        </span>
                      )}
                    </span>
                  </td>
                  <td style={{ padding: '9px 14px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {fmtVol(row.volume)}
                  </td>
                  <td style={{ padding: '9px 14px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>
                    {fmtVol(Math.round(row.volume_ma30))}
                  </td>
                  <td style={{ padding: '9px 14px', textAlign: 'right' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 600,
                      letterSpacing: '0.05em',
                      background: isHigh ? 'rgba(0,230,118,0.15)' : 'rgba(255,77,109,0.15)',
                      color: isHigh ? '#00e676' : '#ff4d6d',
                      border: `1px solid ${isHigh ? 'rgba(0,230,118,0.3)' : 'rgba(255,77,109,0.3)'}`,
                    }}>
                      {isHigh ? '▲ HIGH' : '▼ LOW'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          padding: '12px 20px',
          borderTop: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            Page {page} of {totalPages} · {data.length} total rows
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            {[
              { label: '«', fn: () => setPage(1), disabled: page === 1 },
              { label: '‹', fn: () => setPage(p => Math.max(1, p - 1)), disabled: page === 1 },
              { label: '›', fn: () => setPage(p => Math.min(totalPages, p + 1)), disabled: page === totalPages },
              { label: '»', fn: () => setPage(totalPages), disabled: page === totalPages },
            ].map((btn, i) => (
              <button key={i} onClick={btn.fn} disabled={btn.disabled} style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                color: btn.disabled ? 'var(--text-muted)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                padding: '4px 10px',
                cursor: btn.disabled ? 'default' : 'pointer',
              }}>
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
