// ============================================
// AuthContext — Listening IELTS
// Full auth flow: login, register, logout, auto-check session
// ============================================
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axiosInstance';
import { STORAGE_KEYS } from '../utils/constants';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEYS.TOKEN));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── LISTEN FOR SESSION-EXPIRED EVENT (dispatched by axios interceptor) ──
  useEffect(() => {
    function handleSessionExpired() {
      setToken(null);
      setUser(null);
    }
    window.addEventListener('auth:session-expired', handleSessionExpired);
    return () => window.removeEventListener('auth:session-expired', handleSessionExpired);
  }, []);

  // ── AUTO-CHECK SESSION ON MOUNT ──
  useEffect(() => {
    let cancelled = false;

    async function checkSession() {
      // If no token in localStorage, skip
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get('/auth/me');
        if (!cancelled) {
          const userData = data.data?.user || data.user || data.data || data;
          setUser(userData);
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));

          // Sync premium status
          if (userData.plan && userData.plan !== 'free') {
            localStorage.setItem(STORAGE_KEYS.PREMIUM, userData.plan);
          }
        }
      } catch (err) {
        if (!cancelled) {
          // Token expired or invalid — clear
          if (err.response?.status === 401) {
            localStorage.removeItem(STORAGE_KEYS.TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER);
            localStorage.removeItem(STORAGE_KEYS.PREMIUM);
            setToken(null);
            setUser(null);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    checkSession();
    return () => { cancelled = true; };
  }, [token]);

  // ── LOGIN ──
  const login = useCallback(async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      const newToken = data.data?.token || data.token;
      const userData = data.data?.user || data.user || data.data;

      if (!newToken) {
        throw new Error('Server did not return a token');
      }

      localStorage.setItem(STORAGE_KEYS.TOKEN, newToken);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      setToken(newToken);
      setUser(userData);

      if (userData?.plan && userData.plan !== 'free') {
        localStorage.setItem(STORAGE_KEYS.PREMIUM, userData.plan);
      }

      return { success: true, user: userData };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Đăng nhập thất bại';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  // ── REGISTER ──
  const register = useCallback(async (username, email, password) => {
    setError(null);
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', { username, email, password });
      const newToken = data.data?.token || data.token;
      const userData = data.data?.user || data.user || data.data;

      if (!newToken) {
        throw new Error('Server did not return a token');
      }

      localStorage.setItem(STORAGE_KEYS.TOKEN, newToken);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      setToken(newToken);
      setUser(userData);

      return { success: true, user: userData };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Đăng ký thất bại';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  // ── LOGOUT ──
  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.PREMIUM);
    setToken(null);
    setUser(null);
  }, []);

  // ── ACTIVATE PREMIUM (demo/local) ──
  const activatePremium = useCallback((plan = 'premium') => {
    if (user) {
      const updated = { ...user, plan };
      setUser(updated);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
      localStorage.setItem(STORAGE_KEYS.PREMIUM, plan);
    }
  }, [user]);

  // ── DERIVED ──
  const isAuthenticated = !!user && !!token;
  const isPremium = user?.plan === 'premium' || user?.plan === 'premium_plus';
  const isAdmin = user?.role === 'admin';

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    isPremium,
    isAdmin,
    login,
    register,
    logout,
    activatePremium,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
