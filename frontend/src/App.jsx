import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import StockSelector from './components/StockSelector';
import IntervalTabs from './components/IntervalTabs';
import CandlestickChart from './components/CandlestickChart';
import DataTable from './components/DataTable';
import StatCard from './components/StatCard';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBanner from './components/ErrorBanner';
import { useStockData } from './hooks/useStockData';
import { NIFTY_50_STOCKS } from './services/constants';

function fmtPrice(n) {
  if (n == null) return '—';
  return '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtVol(n) {
  if (!n) return '—';
  if (n >= 1_00_00_000) return (n / 1_00_00_000).toFixed(2) + ' Cr';
  if (n >= 1_00_000) return (n / 1_00_000).toFixed(2) + ' L';
  return n.toLocaleString('en-IN');
}

export default function App() {
  const [symbol, setSymbol] = useState('^NSEI');
  const [interval, setInterval] = useState('1d');

  const { data, loading, error, refetch } = useStockData(symbol, interval);

  const stockLabel = useMemo(() => {
    const found = NIFTY_50_STOCKS.find(s => s.symbol === symbol);
    return found ? found.label : symbol;
  }, [symbol]);

  const stats = useMemo(() => {
    if (!data || data.length === 0) return null;
    const last = data[data.length - 1];
    const prev = data[data.length - 2];
    const chg = prev && last ? ((last.close - prev.close) / prev.close * 100) : null;
    const highVol = data.filter(d => d.volume_high).length;
    const maxHigh = Math.max(...data.map(d => d.high).filter(Boolean));
    const minLow = Math.min(...data.map(d => d.low).filter(Boolean));
    const avgVol = data.reduce((s, d) => s + (d.volume || 0), 0) / data.length;
    return { last, chg, highVol, maxHigh, minLow, avgVol, total: data.length };
  }, [data]);

  const handleSymbolChange = (sym) => {
    setSymbol(sym);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Header />

      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px 20px' }}>

        {/* Controls Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '20px',
          flexWrap: 'wrap',
          marginBottom: '24px',
        }}>
          <StockSelector value={symbol} onChange={handleSymbolChange} />
          <IntervalTabs value={interval} onChange={setInterval} />

          <button
            onClick={refetch}
            disabled={loading}
            style={{
              background: 'var(--accent-teal-dim)',
              border: '1px solid var(--accent-teal)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--accent-teal)',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              padding: '9px 18px',
              cursor: loading ? 'default' : 'pointer',
              opacity: loading ? 0.5 : 1,
              marginBottom: '2px',
              transition: 'all 0.2s',
            }}
          >
            ↻ Refresh
          </button>
        </div>

        {/* Stock Title */}
        <div style={{ marginBottom: '20px' }}>
          <h1 style={{
            fontSize: '22px',
            fontWeight: 700,
            letterSpacing: '-0.5px',
            color: 'var(--text-primary)',
          }}>
            {stockLabel}
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              fontWeight: 400,
              color: 'var(--text-muted)',
              marginLeft: '12px',
            }}>{symbol}</span>
          </h1>
        </div>

        {/* Stats Row */}
        {stats && !loading && (
          <div style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            marginBottom: '24px',
            animation: 'fadeIn 0.3s ease',
          }}>
            <StatCard
              label="Last Close"
              value={fmtPrice(stats.last.close)}
              sub={stats.chg != null
                ? `${stats.chg >= 0 ? '+' : ''}${stats.chg.toFixed(2)}% vs prev`
                : undefined}
              accent
            />
            <StatCard
              label="Period High"
              value={fmtPrice(stats.maxHigh)}
              sub="52-week high"
            />
            <StatCard
              label="Period Low"
              value={fmtPrice(stats.minLow)}
              sub="52-week low"
            />
            <StatCard
              label="Avg Volume"
              value={fmtVol(Math.round(stats.avgVol))}
              sub={`${stats.total} sessions`}
            />
            <StatCard
              label="High Vol Days"
              value={stats.highVol}
              sub={`${((stats.highVol / stats.total) * 100).toFixed(1)}% of period`}
            />
          </div>
        )}

        {/* Main content */}
        {loading && <LoadingSpinner message={`Loading ${stockLabel}...`} />}

        {!loading && error && (
          <ErrorBanner error={error} onRetry={refetch} />
        )}

        {!loading && !error && data.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '60px 20px',
            color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '13px',
          }}>
            No data returned for {symbol}. Try a different symbol or interval.
          </div>
        )}

        {!loading && !error && data.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.35s ease' }}>
            <CandlestickChart data={data} symbol={symbol} />
            <DataTable data={data} />
          </div>
        )}
      </main>
    </div>
  );
}
