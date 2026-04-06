import yfinance as yf
import pandas as pd

INTERVAL_PERIOD_MAP = {
    '1d':  ('1y',  '1d'),
    '1wk': ('2y',  '1wk'),
    '1mo': ('5y',  '1mo'),
    '1y':  ('10y', '3mo'),
}

DEFAULT_SYMBOL = '^NSEI'
VOLUME_MA_WINDOW = 30
VOLUME_THRESHOLD = 0.20

SYMBOL_FALLBACKS = {
    '^NSEI': ['^NSEI', 'NSEI.NS', '^BSESN'],
}

def fetch_stock_data(symbol: str = DEFAULT_SYMBOL, interval: str = '1d') -> list[dict]:
    period, yf_interval = INTERVAL_PERIOD_MAP.get(interval, ('1y', '1d'))

    symbols_to_try = SYMBOL_FALLBACKS.get(symbol, [symbol])
    if symbol not in symbols_to_try:
        symbols_to_try = [symbol] + symbols_to_try

    df = pd.DataFrame()
    for sym in symbols_to_try:
        try:
            ticker = yf.Ticker(sym)
            df = ticker.history(period=period, interval=yf_interval)
            if not df.empty:
                break
        except Exception:
            continue

    if df.empty:
        try:
            df = yf.download(
                symbols_to_try[0],
                period=period,
                interval=yf_interval,
                progress=False,
                auto_adjust=True,
            )
        except Exception:
            pass

    if df.empty:
        return []

    df = df.reset_index()
    df.columns = [str(col).lower().replace(' ', '_') for col in df.columns]

    date_col = next((c for c in df.columns if 'date' in c or 'datetime' in c), None)
    if date_col is None:
        return []
    df = df.rename(columns={date_col: 'date'})

    cols = ['date', 'open', 'high', 'low', 'close', 'volume']
    df = df[[c for c in cols if c in df.columns]].copy()
    df = df.dropna(subset=['close'])
    df['volume'] = df['volume'].fillna(0).astype(int)

    df['volume_ma30'] = df['volume'].rolling(window=VOLUME_MA_WINDOW, min_periods=1).mean()
    df['volume_high'] = df['volume'] > df['volume_ma30'] * (1 + VOLUME_THRESHOLD)

    result = []
    for _, row in df.iterrows():
        try:
            date_val = pd.Timestamp(row['date'])
            if date_val.tzinfo is not None:
                date_val = date_val.tz_convert(None)
            date_str = date_val.strftime('%Y-%m-%d')
        except Exception:
            date_str = str(row['date'])[:10]

        result.append({
            'date':        date_str,
            'open':        round(float(row['open']),  2) if pd.notna(row.get('open'))  else None,
            'high':        round(float(row['high']),  2) if pd.notna(row.get('high'))  else None,
            'low':         round(float(row['low']),   2) if pd.notna(row.get('low'))   else None,
            'close':       round(float(row['close']), 2) if pd.notna(row.get('close')) else None,
            'volume':      int(row['volume']),
            'volume_ma30': round(float(row['volume_ma30']), 2),
            'volume_high': bool(row['volume_high']),
        })

    return result