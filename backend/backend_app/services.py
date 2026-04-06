import requests
import pandas as pd
import os

VOLUME_MA_WINDOW = 30
VOLUME_THRESHOLD = 0.20

INTERVAL_RANGE_MAP = {
    '1d':  ('1y',  '1d'),
    '1wk': ('2y',  '1wk'),
    '1mo': ('5y',  '1mo'),
    '1y':  ('10y', '3mo'),
}

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json',
    'Accept-Language': 'en-US,en;q=0.9',
    'Referer': 'https://finance.yahoo.com',
}

def fetch_stock_data(symbol: str = '^NSEI', interval: str = '1d') -> list[dict]:
    range_val, interval_val = INTERVAL_RANGE_MAP.get(interval, ('1y', '1d'))

    endpoints = [
        'https://query1.finance.yahoo.com/v8/finance/chart/',
        'https://query2.finance.yahoo.com/v8/finance/chart/',
    ]

    params = {
        'range':    range_val,
        'interval': interval_val,
        'events':   'history',
    }

    data = None
    for base in endpoints:
        try:
            url = f'{base}{requests.utils.quote(symbol)}'
            resp = requests.get(url, params=params, headers=HEADERS, timeout=20)
            resp.raise_for_status()
            json_data = resp.json()
            result_data = json_data.get('chart', {}).get('result', [])
            if result_data:
                data = result_data[0]
                break
        except Exception:
            continue

    if not data:
        return []

    timestamps = data.get('timestamp', [])
    quotes = data.get('indicators', {}).get('quote', [{}])[0]

    if not timestamps:
        return []

    opens   = quotes.get('open',   [])
    highs   = quotes.get('high',   [])
    lows    = quotes.get('low',    [])
    closes  = quotes.get('close',  [])
    volumes = quotes.get('volume', [])

    rows = []
    for i, ts in enumerate(timestamps):
        try:
            close = closes[i] if i < len(closes) else None
            if close is None:
                continue
            rows.append({
                'date':   pd.Timestamp(ts, unit='s').strftime('%Y-%m-%d'),
                'open':   round(float(opens[i]),  2) if i < len(opens)   and opens[i]   is not None else None,
                'high':   round(float(highs[i]),  2) if i < len(highs)   and highs[i]   is not None else None,
                'low':    round(float(lows[i]),   2) if i < len(lows)    and lows[i]    is not None else None,
                'close':  round(float(close),     2),
                'volume': int(volumes[i]) if i < len(volumes) and volumes[i] is not None else 0,
            })
        except Exception:
            continue

    if not rows:
        return []

    df = pd.DataFrame(rows)
    df['volume_ma30'] = df['volume'].rolling(window=VOLUME_MA_WINDOW, min_periods=1).mean()
    df['volume_high'] = df['volume'] > df['volume_ma30'] * (1 + VOLUME_THRESHOLD)

    result = []
    for _, row in df.iterrows():
        result.append({
            'date':        row['date'],
            'open':        row['open'],
            'high':        row['high'],
            'low':         row['low'],
            'close':       row['close'],
            'volume':      int(row['volume']),
            'volume_ma30': round(float(row['volume_ma30']), 2),
            'volume_high': bool(row['volume_high']),
        })

    return result