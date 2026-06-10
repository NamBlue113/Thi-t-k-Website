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
      // Dispatch session-expired event instead of hard redirect.
      // Each page/component can decide how to handle it (show modal, toast, etc.)
      window.dispatchEvent(new CustomEvent('auth:session-expired'));
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
