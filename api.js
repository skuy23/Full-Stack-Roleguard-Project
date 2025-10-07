import axios from 'axios';
import { getAuth, setAuth, clearAuth } from './auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:4000'
});

let isRefreshing = false;
let pending = [];

const onRefreshed = (token) => {
  pending.forEach(cb => cb(token));
  pending = [];
};

api.interceptors.request.use(cfg => {
  const { accessToken } = getAuth();
  if (accessToken) cfg.headers.Authorization = 'Bearer ' + accessToken;
  return cfg;
});

api.interceptors.response.use(
  r => r,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      const { refreshToken } = getAuth();
      if (!refreshToken) {
        clearAuth();
        throw err;
      }

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const { data } = await axios.post(`${api.defaults.baseURL}/auth/refresh`, { token: refreshToken });
          setAuth(data.data.accessToken, data.data.refreshToken);
          isRefreshing = false;
          onRefreshed(data.data.accessToken);
        } catch {
          isRefreshing = false;
          clearAuth();
          throw err;
        }
      }

      return new Promise((resolve) => {
        pending.push((t) => {
          original.headers.Authorization = 'Bearer ' + t;
          resolve(api.request(original));
        });
      });
    }
    throw err;
  }
);

export default api;
