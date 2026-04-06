from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .services import fetch_stock_data

VALID_INTERVALS = {'1d', '1wk', '1mo', '1y'}

NIFTY_50_SYMBOLS = {
    '^NSEI', 'RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'INFY.NS',
    'ICICIBANK.NS', 'HINDUNILVR.NS', 'ITC.NS', 'SBIN.NS', 'BHARTIARTL.NS',
    'KOTAKBANK.NS', 'LT.NS', 'AXISBANK.NS', 'ASIANPAINT.NS', 'MARUTI.NS',
    'HCLTECH.NS', 'SUNPHARMA.NS', 'TITAN.NS', 'BAJFINANCE.NS', 'WIPRO.NS',
    'ULTRACEMCO.NS', 'NESTLEIND.NS', 'POWERGRID.NS', 'NTPC.NS', 'ONGC.NS',
    'TECHM.NS', 'JSWSTEEL.NS', 'TATASTEEL.NS', 'ADANIENT.NS', 'ADANIPORTS.NS',
    'COALINDIA.NS', 'DIVISLAB.NS', 'DRREDDY.NS', 'EICHERMOT.NS', 'GRASIM.NS',
    'HEROMOTOCO.NS', 'HINDALCO.NS', 'INDUSINDBK.NS', 'M&M.NS', 'MM.NS',
    'BAJAJFINSV.NS', 'BAJAJ-AUTO.NS', 'BPCL.NS', 'CIPLA.NS', 'HDFCLIFE.NS',
    'SBILIFE.NS', 'TATACONSUM.NS', 'TATAMOTORS.NS', 'UPL.NS', 'BRITANNIA.NS',
    'APOLLOHOSP.NS',
}


class StockDataView(APIView):
    """
    GET /api/stocks/
    Query Params:
        symbol  - stock ticker (default: ^NSEI)
        interval - data interval: 1d | 1wk | 1mo | 1y (default: 1d)
    """

    def get(self, request):
        symbol = request.query_params.get('symbol', '^NSEI').strip().upper()
        interval = request.query_params.get('interval', '1d').strip().lower()

        if interval not in VALID_INTERVALS:
            return Response(
                {'error': f'Invalid interval. Choose from: {", ".join(VALID_INTERVALS)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            data = fetch_stock_data(symbol=symbol, interval=interval)
            return Response({
                'symbol': symbol,
                'interval': interval,
                'count': len(data),
                'data': data,
            })
        except Exception as e:
            return Response(
                {'error': f'Failed to fetch data: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
