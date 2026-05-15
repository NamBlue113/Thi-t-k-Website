// ============================================
// AuthContext — Listening IELTS
// ============================================
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { STORAGE_KEYS } from '../utils/constants';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEYS.TOKEN));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── CHECK EXISTING SESSION ON MOUNT ──
  useEffect(() => {
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        // corrupted data — clear
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    }
    setLoading(false);
  }, [token]);

  // ── LOGIN ──
  const login = useCallback(async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      const { data } = await authService.login({ email, password });
      const { token: newToken, user: userData } = data.data || data;

      localStorage.setItem(STORAGE_KEYS.TOKEN, newToken);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      setToken(newToken);
      setUser(userData);

      if (userData.plan && userData.plan !== 'free') {
        localStorage.setItem(STORAGE_KEYS.PREMIUM, userData.plan);
      }

      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Đăng nhập thất bại';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  // ── REGISTER ──
  const register = useCallback(async (nickname, email, password) => {
    setError(null);
    setLoading(true);
    try {
      const { data } = await authService.register({ nickname, email, password });
      const { token: newToken, user: userData } = data.data || data;

      localStorage.setItem(STORAGE_KEYS.TOKEN, newToken);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      setToken(newToken);
      setUser(userData);

      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Đăng ký thất bại';
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

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    isPremium,
    login,
    register,
    logout,
    activatePremium,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
