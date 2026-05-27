// ============================================
// axiosInstance — Listening IELTS
// Base URL + JWT interceptor
// ============================================
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Attach JWT token from localStorage ──
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('listeningielts-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Handle 401 globally ──
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('listeningielts-token');
      localStorage.removeItem('listeningielts-user');
      localStorage.removeItem('listeningielts-premium');
      // Redirect to home if not already there
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
