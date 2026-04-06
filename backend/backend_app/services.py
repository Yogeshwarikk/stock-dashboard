import requests
import pandas as pd
import os

API_KEY = os.environ.get('ALPHA_VANTAGE_KEY', 'demo')
BASE_URL = 'https://www.alphavantage.co/query'

VOLUME_MA_WINDOW = 30
VOLUME_THRESHOLD = 0.20

# Map our intervals to Alpha Vantage functions
INTERVAL_MAP = {
    '1d':  ('TIME_SERIES_DAILY_ADJUSTED',  'Time Series (Daily)'),
    '1wk': ('TIME_SERIES_WEEKLY_ADJUSTED', 'Weekly Adjusted Time Series'),
    '1mo': ('TIME_SERIES_MONTHLY_ADJUSTED','Monthly Adjusted Time Series'),
    '1y':  ('TIME_SERIES_MONTHLY_ADJUSTED','Monthly Adjusted Time Series'),
}

# Alpha Vantage uses different symbol format (no .NS suffix)
def convert_symbol(symbol: str) -> str:
    if symbol == '^NSEI':
        return 'NSEI'
    if symbol.endswith('.NS'):
        return symbol.replace('.NS', '.BSE')
    return symbol

def fetch_stock_data(symbol: str = '^NSEI', interval: str = '1d') -> list[dict]:
    av_symbol = convert_symbol(symbol)
    func, series_key = INTERVAL_MAP.get(interval, INTERVAL_MAP['1d'])

    params = {
        'function':   func,
        'symbol':     av_symbol,
        'outputsize': 'full',
        'apikey':     API_KEY,
    }

    try:
        resp = requests.get(BASE_URL, params=params, timeout=30)
        resp.raise_for_status()
        json_data = resp.json()
    except Exception as e:
        raise RuntimeError(f'Alpha Vantage request failed: {e}')

    if 'Information' in json_data:
        raise RuntimeError('API rate limit reached. Wait 1 minute and retry.')

    if series_key not in json_data:
        return []

    series = json_data[series_key]
    rows = []
    for date_str, vals in series.items():
        try:
            rows.append({
                'date':   date_str,
                'open':   float(vals.get('1. open',            vals.get('1. open',  0))),
                'high':   float(vals.get('2. high',            vals.get('2. high',  0))),
                'low':    float(vals.get('3. low',             vals.get('3. low',   0))),
                'close':  float(vals.get('5. adjusted close',  vals.get('4. close', 0))),
                'volume': int(float(vals.get('6. volume',      vals.get('5. volume',0)))),
            })
        except Exception:
            continue

    if not rows:
        return []

    df = pd.DataFrame(rows)
    df['date'] = pd.to_datetime(df['date'])
    df = df.sort_values('date').reset_index(drop=True)

    # Limit rows based on interval
    limits = {'1d': 365, '1wk': 104, '1mo': 60, '1y': 120}
    df = df.tail(limits.get(interval, 365))

    df['volume_ma30'] = df['volume'].rolling(window=VOLUME_MA_WINDOW, min_periods=1).mean()
    df['volume_high'] = df['volume'] > df['volume_ma30'] * (1 + VOLUME_THRESHOLD)

    result = []
    for _, row in df.iterrows():
        result.append({
            'date':        row['date'].strftime('%Y-%m-%d'),
            'open':        round(row['open'],  2),
            'high':        round(row['high'],  2),
            'low':         round(row['low'],   2),
            'close':       round(row['close'], 2),
            'volume':      int(row['volume']),
            'volume_ma30': round(float(row['volume_ma30']), 2),
            'volume_high': bool(row['volume_high']),
        })

    return result