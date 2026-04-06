import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchStockData = async (symbol = '^NSEI', interval = '1d') => {
  const response = await api.get('/stocks/', {
    params: { symbol, interval },
  });
  return response.data;
};

export default api;
