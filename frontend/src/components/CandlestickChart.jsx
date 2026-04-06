import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

export default function CandlestickChart({ data, symbol }) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const volumeSeriesRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clean up previous chart
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    const chart = createChart(containerRef.current, {
      layout: {
        background: { color: 'transparent' },
        textColor: '#7a8fb5',
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: 11,
      },
      grid: {
        vertLines: { color: '#1e2d4a', style: 1 },
        horzLines: { color: '#1e2d4a', style: 1 },
      },
      crosshair: {
        mode: 1,
        vertLine: { color: '#00d4aa', width: 1, style: 2, labelBackgroundColor: '#00d4aa' },
        horzLine: { color: '#00d4aa', width: 1, style: 2, labelBackgroundColor: '#00d4aa' },
      },
      rightPriceScale: {
        borderColor: '#1e2d4a',
        scaleMargins: { top: 0.1, bottom: 0.3 },
      },
      timeScale: {
        borderColor: '#1e2d4a',
        timeVisible: true,
        secondsVisible: false,
      },
      width: containerRef.current.clientWidth,
      height: 460,
    });

    chartRef.current = chart;

    // Candlestick series
    const candleSeries = chart.addCandlestickSeries({
      upColor: '#00e676',
      downColor: '#ff4d6d',
      borderUpColor: '#00e676',
      borderDownColor: '#ff4d6d',
      wickUpColor: '#00e676',
      wickDownColor: '#ff4d6d',
    });
    seriesRef.current = candleSeries;

    // Volume histogram
    const volumeSeries = chart.addHistogramSeries({
      color: '#00d4aa',
      priceFormat: { type: 'volume' },
      priceScaleId: 'volume',
    });

    chart.priceScale('volume').applyOptions({
      scaleMargins: { top: 0.75, bottom: 0 },
    });

    volumeSeriesRef.current = volumeSeries;

    // Populate data
    if (data && data.length > 0) {
      const candles = data
        .filter(d => d.open && d.high && d.low && d.close)
        .map(d => ({
          time: d.date,
          open: d.open,
          high: d.high,
          low: d.low,
          close: d.close,
        }));

      const volumes = data
        .filter(d => d.volume != null)
        .map(d => ({
          time: d.date,
          value: d.volume,
          color: d.volume_high
            ? 'rgba(0,230,118,0.5)'
            : 'rgba(255,77,109,0.35)',
        }));

      candleSeries.setData(candles);
      volumeSeries.setData(volumes);
      chart.timeScale().fitContent();
    }

    // Responsive resize
    const resizeObserver = new ResizeObserver(entries => {
      if (entries[0] && chartRef.current) {
        chartRef.current.applyOptions({ width: entries[0].contentRect.width });
      }
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [data]);

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-card)',
    }}>
      <div style={{
        padding: '14px 20px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '13px',
          color: 'var(--text-secondary)',
        }}>
          Candlestick · {symbol}
        </span>
        <div style={{ display: 'flex', gap: '16px', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
          <span style={{ color: '#00e676' }}>▲ Bullish</span>
          <span style={{ color: '#ff4d6d' }}>▼ Bearish</span>
          <span style={{ color: '#00d4aa' }}>█ Vol High</span>
          <span style={{ color: 'rgba(255,77,109,0.6)' }}>█ Vol Low</span>
        </div>
      </div>
      <div ref={containerRef} style={{ width: '100%' }} />
    </div>
  );
}
