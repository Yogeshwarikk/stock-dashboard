import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchStockData } from '../services/stockApi';

export function useStockData(symbol, interval) {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const load = useCallback(async () => {
    if (!symbol || !interval) return;

    // Cancel any in-flight request
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const result = await fetchStockData(symbol, interval);
      if (!controller.signal.aborted) {
        setData(result.data || []);
        setMeta({ symbol: result.symbol, interval: result.interval, count: result.count });
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        setError(err?.response?.data?.error || err.message || 'Failed to fetch data');
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [symbol, interval]);

  useEffect(() => {
    load();
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, [load]);

  return { data, meta, loading, error, refetch: load };
}
