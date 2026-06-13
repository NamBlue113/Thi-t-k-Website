// ============================================
// Streak Service — Listening IELTS
// API streak (chuoi ngay hoc)
// ============================================
import api from '../api/axiosInstance';

export const streakService = {
  getStreak: () => api.get('/streak'),
};
