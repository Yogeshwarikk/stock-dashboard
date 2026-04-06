import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta


INTERVAL_PERIOD_MAP = {
    '1d': ('1y', '1d'),
    '1wk': ('2y', '1wk'),
    '1mo': ('5y', '1mo'),
    '1y': ('10y', '3mo'),
}

DEFAULT_SYMBOL = '^NSEI'
VOLUME_MA_WINDOW = 30
VOLUME_THRESHOLD = 0.20  # 20% deviation from moving average


def fetch_stock_data(symbol: str = DEFAULT_SYMBOL, interval: str = '1d') -> list[dict]:
    """
    Fetch stock data from Yahoo Finance and process it.

    Args:
        symbol: Stock ticker symbol (e.g. '^NSEI', 'RELIANCE.NS')
        interval: Data interval ('1d', '1wk', '1mo', '1y')

    Returns:
        List of dicts with OHLCV data, 30-day volume MA, and volume_high flag.
    """
    period, yf_interval = INTERVAL_PERIOD_MAP.get(interval, ('1y', '1d'))

    ticker = yf.Ticker(symbol)
    df = ticker.history(period=period, interval=yf_interval)

    if df.empty:
        return []

    df = df.reset_index()

    # Rename columns for consistency
    df.columns = [col.lower().replace(' ', '_') for col in df.columns]
    date_col = 'date' if 'date' in df.columns else 'datetime'
    df = df.rename(columns={date_col: 'date'})

    # Keep only needed columns
    cols = ['date', 'open', 'high', 'low', 'close', 'volume']
    df = df[[c for c in cols if c in df.columns]].copy()

    # Drop rows with NaN volume or close
    df = df.dropna(subset=['close'])
    df['volume'] = df['volume'].fillna(0).astype(int)

    # Calculate 30-period rolling average of volume
    df['volume_ma30'] = df['volume'].rolling(window=VOLUME_MA_WINDOW, min_periods=1).mean()

    # volume_high = True if volume is significantly above OR below the 30-day MA
    df['volume_high'] = df.apply(
        lambda row: bool(
            row['volume'] > row['volume_ma30'] * (1 + VOLUME_THRESHOLD)
        ),
        axis=1
    )

    result = []
    for _, row in df.iterrows():
        date_val = row['date']
        # Handle timezone-aware timestamps
        if hasattr(date_val, 'tzinfo') and date_val.tzinfo is not None:
            date_val = date_val.tz_localize(None) if hasattr(date_val, 'tz_localize') else date_val

        result.append({
            'date': pd.Timestamp(date_val).strftime('%Y-%m-%d'),
            'open': round(float(row['open']), 2) if pd.notna(row['open']) else None,
            'high': round(float(row['high']), 2) if pd.notna(row['high']) else None,
            'low': round(float(row['low']), 2) if pd.notna(row['low']) else None,
            'close': round(float(row['close']), 2) if pd.notna(row['close']) else None,
            'volume': int(row['volume']),
            'volume_ma30': round(float(row['volume_ma30']), 2),
            'volume_high': bool(row['volume_high']),
        })

    return result
