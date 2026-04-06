# 📈 Nifty Stock Market Dashboard

A full-stack stock market dashboard with a **Django REST Framework** backend and **React + Vite** frontend.

---

## 🗂️ Folder Structure

```
stock-dashboard/
│
├── backend/                        ← Django project
│   ├── config/
│   │   ├── __init__.py
│   │   ├── settings.py             ← Django settings
│   │   └── urls.py                 ← Root URL routing
│   ├── backend_app/
│   │   ├── __init__.py
│   │   ├── services.py             ← yfinance + pandas logic
│   │   ├── views.py                ← DRF API view
│   │   └── urls.py                 ← App URL routes
│   ├── manage.py
│   └── requirements.txt
│
└── frontend/                       ← React + Vite project
    ├── src/
    │   ├── components/
    │   │   ├── Header.jsx
    │   │   ├── StockSelector.jsx
    │   │   ├── IntervalTabs.jsx
    │   │   ├── CandlestickChart.jsx
    │   │   ├── DataTable.jsx
    │   │   ├── StatCard.jsx
    │   │   ├── LoadingSpinner.jsx
    │   │   └── ErrorBanner.jsx
    │   ├── services/
    │   │   ├── stockApi.js          ← Axios API layer
    │   │   └── constants.js         ← Nifty 50 symbols + intervals
    │   ├── hooks/
    │   │   └── useStockData.js      ← Custom React hook
    │   ├── App.jsx                  ← Root component
    │   ├── main.jsx                 ← React entry point
    │   └── index.css                ← Global styles + CSS vars
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## ✅ Prerequisites

Make sure you have the following installed on your machine:

| Tool | Version | Check command |
|------|---------|---------------|
| Python | 3.10+ | `python --version` |
| pip | latest | `pip --version` |
| Node.js | 18+ | `node --version` |
| npm | 9+ | `npm --version` |

---

## 🚀 Step-by-Step Setup

### STEP 1 — Open Two Terminal Windows

You need **two separate terminals** — one for the backend, one for the frontend.

---

### STEP 2 — Set Up the Django Backend

**In Terminal 1:**

```bash
# Navigate to the backend folder
cd stock-dashboard/backend

# (Recommended) Create a Python virtual environment
python -m venv venv

# Activate it:
# On macOS / Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install all Python dependencies
pip install -r requirements.txt

# Start the Django development server
python manage.py runserver
```

✅ You should see:
```
Starting development server at http://127.0.0.1:8000/
```

> **Note:** There are no database migrations needed — this project has no models.

---

### STEP 3 — Set Up the React Frontend

**In Terminal 2:**

```bash
# Navigate to the frontend folder
cd stock-dashboard/frontend

# Install Node.js dependencies
npm install

# Start the Vite development server
npm run dev
```

✅ You should see:
```
  VITE v5.x.x  ready in ...ms
  ➜  Local:   http://localhost:5173/
```

---

### STEP 4 — Open the Dashboard

Open your browser and go to:
```
http://localhost:5173
```

🎉 The dashboard should load with Nifty 50 data!

---

## 🔌 API Reference

### GET `/api/stocks/`

Fetches OHLCV stock data with volume analysis.

**Query Parameters:**

| Parameter | Default | Options |
|-----------|---------|---------|
| `symbol`  | `^NSEI` | Any Nifty 50 symbol (e.g. `RELIANCE.NS`) |
| `interval`| `1d`    | `1d`, `1wk`, `1mo`, `1y` |

**Example Request:**
```
GET http://localhost:8000/api/stocks/?symbol=RELIANCE.NS&interval=1wk
```

**Example Response:**
```json
{
  "symbol": "RELIANCE.NS",
  "interval": "1wk",
  "count": 104,
  "data": [
    {
      "date": "2024-01-01",
      "open": 2450.50,
      "high": 2510.00,
      "low": 2430.00,
      "close": 2490.75,
      "volume": 5200000,
      "volume_ma30": 4800000.00,
      "volume_high": true
    }
  ]
}
```

**Field Descriptions:**

| Field | Type | Description |
|-------|------|-------------|
| `date` | string | Trading date (YYYY-MM-DD) |
| `open` | float | Opening price |
| `high` | float | Highest price of the day |
| `low` | float | Lowest price of the day |
| `close` | float | Closing price |
| `volume` | int | Number of shares traded |
| `volume_ma30` | float | 30-period rolling average of volume |
| `volume_high` | boolean | `true` if volume > MA30 × 1.2 (20% above average) |

---

## 🎨 Frontend Features

- **Stock Selector** — Dropdown with all 50 Nifty 50 stocks
- **Interval Tabs** — Daily / Weekly / Monthly / Yearly
- **Stats Bar** — Last close, period high/low, avg volume, high-volume day count
- **Candlestick Chart** — Interactive OHLC chart with volume histogram (lightweight-charts)
- **Data Table** — Sortable, paginated (20 rows/page) with:
  - 🟢 Green rows = `volume_high: true`
  - 🔴 Red rows = `volume_high: false`
  - % change column, MA30 column, signal badge
- **Loading & Error States** — Skeleton loaders and descriptive error messages

---

## 🛠️ Troubleshooting

### "No data returned for symbol"
- Some symbols may not be available on Yahoo Finance. Try `^NSEI` or `RELIANCE.NS` first.

### CORS errors in browser console
- Make sure the Django backend is running on port **8000**
- Vite proxies `/api` → `http://localhost:8000` automatically

### `pip install` fails for yfinance
- Try: `pip install --upgrade pip` then retry

### `npm install` fails
- Make sure Node.js 18+ is installed: `node --version`
- Try deleting `node_modules` and running `npm install` again

---

## 🧹 Stopping the Servers

- **Backend**: Press `Ctrl + C` in Terminal 1
- **Frontend**: Press `Ctrl + C` in Terminal 2
- **Deactivate virtualenv**: Run `deactivate` in Terminal 1
