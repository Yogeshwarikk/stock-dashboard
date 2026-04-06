from django.urls import path
from .views import StockDataView

urlpatterns = [
    path('stocks/', StockDataView.as_view(), name='stock-data'),
]
